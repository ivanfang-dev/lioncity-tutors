import { findMatchingTutorsForWave, findMatchingTutorsWithStats } from './tutorMatcher.js';
import { poolShortfallReport, ACTION_LABELS } from './poolDiagnosis.js';
// Wave 1 takes the deterministic top of the ranking directly — the query-time Gemini re-rank was
// retired once the ranking started reading each tutor's extracted qualityGrade.
import { recordRecommendation, candidatesFromScored } from './recordRecommendation.js';
import { Assignment, Tutor } from '../../../packages/shared/server-exports.js';
import { normalizePhone } from './phone.js';
import { formatTimeSlots } from '../../../packages/shared/utils/timeSlots.js';
import { sendWhatsAppTemplate } from './whatsappSender.js';
import { sendAssignmentDM } from './telegramOutreach.js';
import { computeWaveSize, trailingInterestRate } from './waveSizing.js';
import { loadCappedTutorIds } from './exposureCaps.js';
import { notifyOwner, opsButtonRow } from './ownerAlert.js';

// The interested-tutor target an assignment aims for before holding (mirrors escalation-tick and
// recordTutorReply). Wave 1 has zero interested yet, so it needs the full target's worth.
const INTERESTED_TARGET = Number(process.env.OUTREACH_INTERESTED_TARGET) || 6;

// The approved outreach template (see WhatsApp Manager). Its body has 6 positional params;
// buildAssignmentParams() below produces them in order. Quick-Reply buttons ("Yes, interested"
// / "Not available") carry the reply — handled by the inbound webhook, not here.
const OUTREACH_TEMPLATE = 'assignment_match';

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

// Map an assignment to the assignment_match template's 6 body params, in {{1}}..{{6}} order.
// {{5}} merges optional timing into frequency so the param is never empty (Meta rejects blank
// params) and stays single-line. Description is intentionally dropped — it can be long/multi-
// line, which templates can't carry; tutors get it in full when they apply via Telegram.
function buildAssignmentParams(assignment) {
  const timing = formatTimeSlots(assignment.preferredTimeSlots);
  const frequency = timing ? `${assignment.frequency}, ${timing}` : assignment.frequency;
  return [
    assignment.title,     // {{1}}
    assignment.level,     // {{2}}
    assignment.subject,   // {{3}}
    assignment.location,  // {{4}}
    frequency,            // {{5}}
    assignment.rate       // {{6}}
  ];
}

// Reach ONE tutor for this wave and report which channel carried the message, so the
// outreach log records the right value.
//
// This is the money decision. Telegram DMs are FREE; WhatsApp templates are billed per
// conversation. But only tutors who've linked the bot (tutor.telegramId set) can be DMed,
// and even a linked tutor can be unreachable — blocked the bot, deleted the chat, stale id —
// in which case sendAssignmentDM() throws.
//
// Tools available to you:
//   await sendAssignmentDM(tutor, assignment)                                → resolves if the
//        free DM went out; THROWS if it couldn't be delivered.
//   await sendWhatsAppTemplate(tutor.contactNumber, OUTREACH_TEMPLATE, params) → the billed
//        fallback that reaches any tutor with a phone number.
//
// @param tutor       matched tutor doc — has `.telegramId` (may be empty) and `.contactNumber`
// @param assignment  the assignment being offered (for the DM body)
// @param params      WhatsApp template body params (from buildAssignmentParams)
// @returns {Promise<'telegram' | 'whatsapp'>} the channel the message actually went out on.
//          Let a WhatsApp failure throw — sendWaveToTutors counts that as a failed send.
async function sendToTutor(tutor, assignment, params) {
  // Free path: DM the tutor on Telegram — but only if they've linked the bot AND we haven't
  // already found their Telegram unreachable. telegramStale is set the first time a DM fails,
  // so a tutor who blocked/deleted the bot doesn't cost a wasted try-then-fall-back on every
  // future wave. (Re-linking via the bot clears the flag — see handleContact.)
  if (tutor.telegramId && !tutor.telegramStale) {
    try {
      await sendAssignmentDM(tutor, assignment);
      return 'telegram';
    } catch (err) {
      // Undeliverable (blocked bot, deleted chat, stale id). Remember it so future waves go
      // straight to WhatsApp, and fall through to the paid channel now so this tutor is still
      // reached. Best-effort persist — if it fails we simply retry Telegram next wave.
      console.warn(`Telegram DM to ${tutor.fullName || tutor._id} failed — marking telegram stale, falling back to WhatsApp: ${err.message}`);
      await Tutor.updateOne({ _id: tutor._id }, { $set: { telegramStale: true } }).catch(() => {});
    }
  }

  // Billed fallback: reaches any tutor with a phone number. Let a failure throw so
  // sendWaveToTutors counts it as a failed send.
  await sendWhatsAppTemplate(tutor.contactNumber, OUTREACH_TEMPLATE, params);
  return 'whatsapp';
}

// Message every tutor in `batch` and record the successful sends as part of `wave`.
// Sends sequentially — whatsapp-web.js uses a single Chrome process and concurrent
// sendMessage calls queue CDP commands on the same browser, causing protocol timeouts.
async function sendWaveToTutors(assignment, batch, wave, botUsername) {
  const params = buildAssignmentParams(assignment);

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
      const channel = await sendToTutor(tutor, assignment, params);
      sent++;
      contacts.push({
        tutorId: tutor._id,
        phone: normalizePhone(tutor.contactNumber),
        tutorName: tutor.fullName || 'Unknown',
        wave,
        channel,
        sentAt: new Date(),
        status: 'Sent'
      });
    } catch (err) {
      failed++;
      errors.push(err.message);
    }
  }

  // Split the sends by channel so the WhatsApp-conversation savings are visible in the logs.
  const viaTelegram = contacts.filter(c => c.channel === 'telegram').length;
  const viaWhatsApp = contacts.filter(c => c.channel === 'whatsapp').length;
  console.log(
    `Wave ${wave} for ${assignment._id}: ${sent} sent (${viaTelegram} via Telegram, ${viaWhatsApp} via WhatsApp), ${failed} failed` +
    (failed > 0 ? `: ${errors.join('; ')}` : '')
  );

  // Persist who we contacted so Yes/No replies can be matched and the escalation loop
  // can resume after a restart — this state lives in Mongo, never in process memory.
  await recordWaveContacts(assignment._id, contacts);
  return { sent, failed };
}

// Diagnose a thin wave-1 pool and hand the owner the recovery actions as buttons. The funnel costs
// one count per filter, so it runs only on the thin-pool path.
async function alertThinPool(assignment, poolSize, relaxed) {
  const { stats } = await findMatchingTutorsWithStats(assignment, 40).catch(() => ({ stats: null }));
  const report = poolShortfallReport({ poolSize, target: INTERESTED_TARGET, stats, assignment, relaxed });
  if (!report) return;

  const rows = report.actions.map(action => ([{
    text: ACTION_LABELS[action],
    callback_data: `recover_${action}_${assignment._id}`,
  }]));
  const opsRow = opsButtonRow(assignment._id);
  if (opsRow) rows.push(opsRow);

  await notifyOwner(report.text, rows.length ? { inline_keyboard: rows } : undefined);
}

// Wave 1 — fired immediately when an assignment is posted.
async function notifyMatchedTutors(assignment, botUsername) {
  try {
    // Pull the top 40 quality-ranked matches (with their score breakdown for the decision log). The
    // ranking now folds in each tutor's extracted qualityGrade, so wave 1 takes its top 8 directly —
    // no query-time Gemini re-rank (removed an API call, a failure mode, and ~5s from wave 1).
    // Exposure caps (Phase 10 step 4): exclude tutors already holding ≥2 unresolved offers.
    const excludeTutorIds = await loadCappedTutorIds();
    const { scored, relaxed } = await findMatchingTutorsForWave(assignment, 40, { excludeTutorIds });

    // Too few matches to reach the target: tell the owner NOW, with the filter that cost the most
    // candidates and one-tap ways to widen — rather than letting it run quietly to Exhausted.
    if (scored.length < INTERESTED_TARGET) {
      await alertThinPool(assignment, scored.length, relaxed)
        .catch(err => console.warn('Thin-pool alert failed:', err.message));
    }

    if (scored.length === 0) {
      console.log(`No matching tutors found for assignment ${assignment._id}`);
      return { sent: 0, failed: 0, aiUsed: false, aiError: null };
    }

    // Adaptive wave sizing (Phase 10 step 2): size wave 1 to the full interested target and the
    // trailing interest rate, instead of a fixed 8. Clamped to [4, 12].
    const waveSize = computeWaveSize(INTERESTED_TARGET, await trailingInterestRate());
    const tutors = scored.slice(0, waveSize).map(s => s.tutor);
    console.log(`Notifying ${tutors.length} top-ranked tutors for assignment ${assignment._id} (deterministic, waveSize ${waveSize})`);

    const { sent, failed } = await sendWaveToTutors(assignment, tutors, 1, botUsername);

    // Log what the ranker knew and chose (Phase 6). After the wave, so this can't delay outreach;
    // best-effort so a failure can't break it. `contacted` = the top 8 we actually messaged.
    await recordRecommendation({
      assignmentId: assignment._id,
      trigger: 'wave1',
      candidates: candidatesFromScored(scored, tutors.map(t => t._id)),
    });

    // aiUsed/aiError kept in the shape for callers that log them; always false now (re-rank retired).
    return { sent, failed, aiUsed: false, aiError: null };
  } catch (error) {
    console.error('Error notifying matched tutors:', error);
    return { sent: 0, failed: 0, aiUsed: false, aiError: null };
  }
}

// Waves 2+ — message the next-best matching tutors we haven't contacted yet. Uses the
// deterministic quality ranking (no extra AI call per wave). Returns { exhausted } when
// the matching pool has no fresh tutors left to try.
async function escalateAssignment(assignment, botUsername, { waveSize = 6, excludeTutorIds = null } = {}) {
  // Exposure caps (Phase 10 step 4): the tick passes the set of tutors already holding ≥2 unresolved
  // offers, held out of this wave. Computed once per tick by the caller.
  const { scored } = await findMatchingTutorsForWave(assignment, 40, { excludeTutorIds });
  const contacted = new Set(assignment.contactedTutorIds());
  // Re-rank the not-yet-contacted tutors 1..N — the escalation decision only ever chooses among
  // these, so ranks relative to the fresh pool are what the decision log should record.
  const fresh = scored
    .filter(s => !contacted.has(s.tutor._id?.toString()))
    .map((s, i) => ({ ...s, rank: i + 1 }));

  if (fresh.length === 0) {
    return { exhausted: true, sent: 0, failed: 0 };
  }

  const wave = (assignment.outreach?.waveCount || 1) + 1;
  const batch = fresh.slice(0, waveSize);
  const { sent, failed } = await sendWaveToTutors(assignment, batch.map(s => s.tutor), wave, botUsername);

  // Log the escalation decision (Phase 6). After the wave, best-effort. `contacted` = this batch.
  await recordRecommendation({
    assignmentId: assignment._id,
    trigger: 'escalation',
    candidates: candidatesFromScored(fresh, batch.map(s => s.tutor._id)),
  });

  return { exhausted: false, sent, failed, wave };
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
  const params = buildAssignmentParams(assignment);

  // Route reminders exactly like a fresh wave — Telegram-first, WhatsApp fallback — so a
  // non-responder we can still reach on Telegram gets a FREE re-ping instead of a billed
  // template. Contacts store tutorId + channel but not telegramId, so reload the tutor docs.
  const tutorIds = batch.map(c => c.tutorId).filter(Boolean);
  const tutors = tutorIds.length
    ? await Tutor.find({ _id: { $in: tutorIds } })
        .select('fullName contactNumber telegramId telegramStale')
        .lean()
    : [];
  const tutorById = new Map(tutors.map(t => [t._id.toString(), t]));

  // Mirror sendWaveToTutors' test-mode redirect: send everything to one number (over WhatsApp)
  // so the reminder path can be exercised without paging real tutors.
  const testPhone = process.env.TEST_RECIPIENT_PHONE || '';

  let sent = 0;
  let failed = 0;
  const remindedPhones = [];
  for (const c of batch) {
    try {
      const tutor = c.tutorId ? tutorById.get(c.tutorId.toString()) : null;
      if (testPhone || !tutor) {
        // Test mode, or a contact with no resolvable tutor doc — re-send the template to the
        // phone we recorded (cold sends must be templated; there's no open 24h window here).
        await sendWhatsAppTemplate(testPhone || c.phone, OUTREACH_TEMPLATE, params);
      } else {
        await sendToTutor(tutor, assignment, params);
      }
      sent++;
      remindedPhones.push(c.phone);
    } catch (err) {
      failed++;
    }
  }

  // Bump reminderCount only on the contacts we actually re-messaged. Targeted $inc
  // (not .save()): a full-document save re-validates legacy subject/level enums
  // (ValidationError), and its stale contact array could clobber a reply that landed
  // while the sends above were in flight.
  if (remindedPhones.length > 0) {
    await Assignment.updateOne(
      { _id: assignment._id },
      { $inc: { 'outreach.contacts.$[c].reminderCount': 1 } },
      { arrayFilters: [{ 'c.phone': { $in: remindedPhones }, 'c.status': 'Sent' }] }
    );
  }

  return { remindedNone: false, sent, failed, reminded: batch.length };
}

export { notifyMatchedTutors, escalateAssignment, remindNonResponders };
