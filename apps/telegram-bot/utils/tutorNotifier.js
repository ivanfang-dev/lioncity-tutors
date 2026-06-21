import { findMatchingTutors } from './tutorMatcher.js';
import { rankTutorsWithAI } from './tutorRanker.js';
import { Assignment, Tutor } from '../../../packages/shared/server-exports.js';
import { normalizePhone } from './phone.js';
import { formatTimeSlots } from '../../../packages/shared/utils/timeSlots.js';
import { sendWhatsApp } from './whatsappSender.js';

// Safe-testing switch: when set to a phone number, EVERY outreach wave is redirected to
// that single number (and recorded under it) instead of going to real tutors — so the
// full flow, including your own Yes/No reply, can be tested end-to-end. Leave UNSET in
// production, or no real tutor will ever be messaged.
const TEST_RECIPIENT_PHONE = process.env.TEST_RECIPIENT_PHONE || '';

// Append the tutors we just messaged to the assignment's outreach log and mark the
// wave. Best-effort: a recording failure must not abort the notification flow.
async function recordWaveContacts(assignmentId, contacts) {
  if (contacts.length === 0) return;
  const now = new Date();
  try {
    await Assignment.updateOne(
      { _id: assignmentId },
      {
        $push: { 'outreach.contacts': { $each: contacts } },
        $set: { 'outreach.status': 'Active', 'outreach.lastWaveAt': now },
        $inc: { 'outreach.waveCount': 1 }
      }
    );
    // Stamp the start time only on the first wave (when it isn't set yet).
    await Assignment.updateOne(
      { _id: assignmentId, 'outreach.startedAt': { $exists: false } },
      { $set: { 'outreach.startedAt': now } }
    );
    // Bump each messaged tutor's contacted count — the denominator of their
    // responsiveness score. (responded is incremented when they reply, in whatsapp-reply.)
    const tutorIds = contacts.map(c => c.tutorId).filter(Boolean);
    if (tutorIds.length > 0) {
      await Tutor.updateMany({ _id: { $in: tutorIds } }, { $inc: { 'responseStats.contacted': 1 } });
    }

    // Diagnostic: confirms recording ran and shows the exact phone keys stored, so a
    // reply that comes back matched=false can be compared against what we saved.
    console.log(`Recorded ${contacts.length} outreach contact(s) for ${assignmentId}: phones=[${contacts.map(c => c.phone).join(', ')}]`);
  } catch (err) {
    console.error('Failed to record outreach contacts:', err.message);
  }
}

// The WhatsApp message a tutor receives for an assignment.
function buildAssignmentMessage(assignment, botUsername) {
  const applyUrl = `https://t.me/${botUsername}?start=apply_${assignment._id}`;
  const timing = formatTimeSlots(assignment.preferredTimeSlots);
  return (
    `New Tuition Assignment Match!\n\n` +
    `Title: ${assignment.title}\n` +
    `Level: ${assignment.level}\n` +
    `Subject: ${assignment.subject}\n` +
    `Location: ${assignment.location}\n` +
    `Frequency: ${assignment.frequency}\n` +
    (timing ? `Timing: ${timing}\n` : '') +
    `Rate: ${assignment.rate}\n` +
    (assignment.description ? `Description: ${assignment.description}\n` : '') +
    `\nThis assignment matches your profile.\n` +
    `- Reply "Yes" to apply\n` +
    `- Reply "No" to decline\n` +
    `- Or apply via Telegram: ${applyUrl}`
  );
}

// Message every tutor in `batch` and record the successful sends as part of `wave`.
// Sends sequentially — whatsapp-web.js uses a single Chrome process and concurrent
// sendMessage calls queue CDP commands on the same browser, causing protocol timeouts.
async function sendWaveToTutors(assignment, batch, wave, botUsername) {
  const message = buildAssignmentMessage(assignment, botUsername);

  // Test mode: redirect the whole wave to one number (yours) so you can exercise the
  // full flow — send, your reply, the ack, the Telegram alert — without paging real
  // tutors. Recorded under your number too, so your reply matches.
  if (TEST_RECIPIENT_PHONE && batch.length > 0) {
    console.log(`TEST MODE: redirecting wave ${wave} (${batch.length} tutor(s)) to ${TEST_RECIPIENT_PHONE}`);
    batch = [{ ...batch[0], contactNumber: TEST_RECIPIENT_PHONE, fullName: 'TEST RECIPIENT' }];
  }

  let sent = 0;
  let failed = 0;
  const errors = [];
  const contacts = [];
  for (const tutor of batch) {
    try {
      await sendWhatsApp(tutor.contactNumber, message);
      sent++;
      contacts.push({
        tutorId: tutor._id,
        phone: normalizePhone(tutor.contactNumber),
        tutorName: tutor.fullName || 'Unknown',
        wave,
        sentAt: new Date(),
        status: 'Sent'
      });
    } catch (err) {
      failed++;
      errors.push(err.message);
    }
  }

  if (failed > 0) {
    console.log(`Wave ${wave} for ${assignment._id}: ${sent} sent, ${failed} failed:`, errors);
  }

  // Persist who we contacted so Yes/No replies can be matched and the escalation loop
  // can resume after a restart — this state lives in Mongo, never in process memory.
  await recordWaveContacts(assignment._id, contacts);
  return { sent, failed };
}

// Wave 1 — fired immediately when an assignment is posted. AI-ranked top 8.
async function notifyMatchedTutors(assignment, botUsername) {
  try {
    // Pull the top 40 quality-ranked matches; the AI re-ranker narrows to the best 8.
    const candidates = await findMatchingTutors(assignment, 40);

    if (candidates.length === 0) {
      console.log(`No matching tutors found for assignment ${assignment._id}`);
      return { sent: 0, failed: 0, aiUsed: false, aiError: null };
    }

    console.log(`Found ${candidates.length} candidates for assignment ${assignment._id}, ranking with AI...`);
    const { tutors, aiUsed, aiError } = await rankTutorsWithAI(assignment, candidates, 8);
    console.log(`Notifying ${tutors.length} top-ranked tutors (AI used: ${aiUsed})`);

    const { sent, failed } = await sendWaveToTutors(assignment, tutors, 1, botUsername);
    return { sent, failed, aiUsed, aiError };
  } catch (error) {
    console.error('Error notifying matched tutors:', error);
    return { sent: 0, failed: 0, aiUsed: false, aiError: null };
  }
}

// Waves 2+ — message the next-best matching tutors we haven't contacted yet. Uses the
// deterministic quality ranking (no extra AI call per wave). Returns { exhausted } when
// the matching pool has no fresh tutors left to try.
async function escalateAssignment(assignment, botUsername, { waveSize = 6 } = {}) {
  const candidates = await findMatchingTutors(assignment, 40);
  const contacted = new Set(assignment.contactedTutorIds());
  const fresh = candidates.filter(t => !contacted.has(t._id?.toString()));

  if (fresh.length === 0) {
    return { exhausted: true, sent: 0, failed: 0 };
  }

  const wave = (assignment.outreach?.waveCount || 1) + 1;
  const batch = fresh.slice(0, waveSize);
  const { sent, failed } = await sendWaveToTutors(assignment, batch, wave, botUsername);
  return { exhausted: false, sent, failed, wave };
}

// The gentle nudge a non-responding tutor receives. Same apply paths as the first
// message — just framed as a reminder. (Owner-tunable wording.)
function buildReminderMessage(assignment, botUsername) {
  const applyUrl = `https://t.me/${botUsername}?start=apply_${assignment._id}`;
  const timing = formatTimeSlots(assignment.preferredTimeSlots);
  return (
    `Reminder: this assignment is still open and we'd love to hear back from you!\n\n` +
    `Title: ${assignment.title}\n` +
    `Level: ${assignment.level}\n` +
    `Subject: ${assignment.subject}\n` +
    `Location: ${assignment.location}\n` +
    `Frequency: ${assignment.frequency}\n` +
    (timing ? `Timing: ${timing}\n` : '') +
    `Rate: ${assignment.rate}\n` +
    `\n- Reply "Yes" to apply\n` +
    `- Reply "No" to decline\n` +
    `- Or apply via Telegram: ${applyUrl}`
  );
}

// Fallback when escalation has no fresh tutors left: re-ping the non-responders (status
// 'Sent') who still have reminders remaining, instead of giving up. Re-messages EXISTING
// contacts in place (no new outreach rows, no responseStats change — a reminder isn't a
// new tutor contacted) and bumps each one's reminderCount. Returns { remindedNone: true }
// when there's no one left to remind, so the caller can finally mark the assignment
// Exhausted.
async function remindNonResponders(assignment, botUsername, { maxReminders = 1, waveSize = 6 } = {}) {
  const remindable = (assignment.outreach?.contacts || [])
    .filter(c => c.status === 'Sent' && (c.reminderCount || 0) < maxReminders);
  if (remindable.length === 0) {
    return { remindedNone: true, sent: 0, failed: 0 };
  }

  const batch = remindable.slice(0, waveSize);
  const message = buildReminderMessage(assignment, botUsername);

  // Mirror sendWaveToTutors' test-mode redirect: send everything to one number so the
  // reminder path can be exercised without paging real tutors.
  const testPhone = process.env.TEST_RECIPIENT_PHONE || '';

  let sent = 0;
  let failed = 0;
  const remindedPhones = [];
  for (const c of batch) {
    try {
      await sendWhatsApp(testPhone || c.phone, message);
      sent++;
      remindedPhones.push(c.phone);
    } catch (err) {
      failed++;
    }
  }

  // Bump reminderCount only on the contacts we actually re-messaged.
  const remindedSet = new Set(remindedPhones);
  for (const c of assignment.outreach.contacts) {
    if (c.status === 'Sent' && remindedSet.has(c.phone)) {
      c.reminderCount = (c.reminderCount || 0) + 1;
    }
  }
  await assignment.save();

  return { remindedNone: false, sent, failed, reminded: batch.length };
}

export { notifyMatchedTutors, escalateAssignment, remindNonResponders };
