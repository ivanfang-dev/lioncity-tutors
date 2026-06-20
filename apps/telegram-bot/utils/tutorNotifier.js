import { findMatchingTutors } from './tutorMatcher.js';
import { rankTutorsWithAI } from './tutorRanker.js';
import { Assignment } from '../../../packages/shared/server-exports.js';
import { normalizePhone } from './phone.js';
import { formatTimeSlots } from '../../../packages/shared/utils/timeSlots.js';

const WHATSAPP_SERVICE_URL = process.env.WHATSAPP_SERVICE_URL || 'http://localhost:3001';
const WHATSAPP_API_KEY = process.env.WHATSAPP_API_KEY || '';

async function sendWhatsAppMessage(phoneNumber, message, assignmentId, assignmentTitle, tutorName) {
  const headers = { 'Content-Type': 'application/json' };
  if (WHATSAPP_API_KEY) headers['x-api-key'] = WHATSAPP_API_KEY;

  const res = await fetch(`${WHATSAPP_SERVICE_URL}/send`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ phoneNumber, message, assignmentId, assignmentTitle, tutorName }),
    signal: AbortSignal.timeout(45000)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
}

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
    `- Or apply via Telegram: ${applyUrl}`
  );
}

// Message every tutor in `batch` and record the successful sends as part of `wave`.
// Sends sequentially — whatsapp-web.js uses a single Chrome process and concurrent
// sendMessage calls queue CDP commands on the same browser, causing protocol timeouts.
async function sendWaveToTutors(assignment, batch, wave, botUsername) {
  const message = buildAssignmentMessage(assignment, botUsername);
  let sent = 0;
  let failed = 0;
  const errors = [];
  const contacts = [];
  for (const tutor of batch) {
    try {
      await sendWhatsAppMessage(
        tutor.contactNumber,
        message,
        assignment._id.toString(),
        assignment.title,
        tutor.fullName || 'Unknown'
      );
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

export { notifyMatchedTutors, escalateAssignment };
