import mongoose from 'mongoose';
import { Assignment, Tutor, Placement } from '../../../packages/shared/server-exports.js';
import { getLevelCategory } from './tutorMatcher.js';
import { escalateAssignment } from './tutorNotifier.js';
import { formatAssignmentForChannel } from './channelFormat.js';

// The single recorder for every parent-side outcome: the parent picked a tutor, passed on the
// whole shortlist, or hasn't replied. Channel-agnostic on purpose — the owner records outcomes
// from Telegram buttons (bot/handlers.js) AND from the ops console (api/parent-outcome.js), and
// both MUST land identical state. This module owns the state transitions; callers own how they
// report back to whoever tapped.
//
// Every write is a targeted updateOne/$set — never .save() on a loaded Assignment: legacy docs
// carry subject/level values outside the current enums and full-document saves re-validate and
// throw (see the roadmap's Repo facts).

export const REJECT_REASONS = ['rate', 'profiles', 'timing', 'other'];

// Re-render a filled assignment's channel post so tutors stop applying. Raw Telegram API call
// (no bot instance needed), so the console path closes the post exactly like the Telegram path.
// Best-effort throughout: a failed edit must never undo a recorded outcome.
async function closeChannelPostAsFilled(assignment) {
  const botToken = process.env.BOT_TOKEN;
  const channelId = process.env.CHANNEL_ID;
  if (!botToken || !channelId || !assignment.channelMessageId) return;
  try {
    await fetch(`https://api.telegram.org/bot${botToken}/editMessageText`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: channelId,
        message_id: assignment.channelMessageId,
        text: formatAssignmentForChannel(assignment), // caller has already set status = 'Filled'
        parse_mode: 'Markdown',
        reply_markup: { inline_keyboard: [[{ text: '🔒 Assignment Filled', callback_data: 'assignment_closed' }]] },
      }),
    });
  } catch (err) {
    console.warn(`closeChannelPostAsFilled failed for ${assignment._id}:`, err.message);
  }
}

// The parent chose `tutorId`. Marks the assignment Filled, records the winner, stamps the winning
// contact's parentPickedAt, stops outreach, writes the Placement, and closes the channel post.
// Idempotent: a double-tap re-sets the same fields and the Placement upsert is keyed on
// (assignment, tutor), so it can't produce a second row.
export async function recordParentPick({ assignmentId, tutorId }) {
  if (!mongoose.isValidObjectId(assignmentId) || !mongoose.isValidObjectId(tutorId)) {
    return { ok: false, error: 'invalid_id' };
  }
  const assignment = await Assignment.findById(assignmentId);
  if (!assignment) return { ok: false, error: 'assignment_not_found' };

  const contact = (assignment.outreach?.contacts || []).find(c => c.tutorId?.toString() === String(tutorId));
  if (!contact) return { ok: false, error: 'tutor_not_a_candidate' };

  const now = new Date();
  const tutorOid = new mongoose.Types.ObjectId(String(tutorId));

  await Assignment.updateOne(
    { _id: assignment._id },
    { $set: {
      status: 'Filled',
      matchedTutorId: tutorOid,
      filledAt: now,
      'outreach.status': 'Fulfilled',
      'outreach.contacts.$[c].parentPickedAt': now,
    } },
    { arrayFilters: [{ 'c.tutorId': tutorOid }] }
  );
  assignment.status = 'Filled'; // for the channel re-render below

  // The Placement is the ground-truth match row the day-30 check-in (Phase 5) and future ranking
  // work train against. Best-effort: losing it must not block marking the assignment Filled.
  try {
    const tutorDoc = await Tutor.findById(tutorOid).select('hourlyRate').lean();
    const agreedRate = tutorDoc?.hourlyRate?.[getLevelCategory(assignment.level)]
      || tutorDoc?.hourlyRate?.secondary || assignment.rate;
    await Placement.updateOne(
      { assignmentId: assignment._id, tutorId: tutorOid },
      { $setOnInsert: { parentContact: assignment.parentContact, filledAt: now, agreedRate, status: 'active' } },
      { upsert: true }
    );
  } catch (err) {
    console.error('Failed to record Placement:', err.message);
  }

  await closeChannelPostAsFilled(assignment);

  return { ok: true, assignment, tutorName: contact.tutorName || 'the tutor' };
}

// The parent passed on the whole shortlist. Records the reason on every shortlisted contact and
// resets outreach to Active so fresh tutors get messaged — rejected tutors stop counting toward
// the interested target (viableInterestedCount) but stay in contactedTutorIds, so they're never
// re-messaged. DB only: firing the actual wave is `resumeOutreach`, which callers background.
export async function recordParentReject({ assignmentId, reason }) {
  if (!mongoose.isValidObjectId(assignmentId)) return { ok: false, error: 'invalid_id' };
  if (!REJECT_REASONS.includes(reason)) return { ok: false, error: 'invalid_reason' };

  const assignment = await Assignment.findById(assignmentId);
  if (!assignment) return { ok: false, error: 'assignment_not_found' };

  const now = new Date();
  const rejectedCount = (assignment.outreach?.contacts || [])
    .filter(c => c.status === 'Interested' && c.shortlistRank != null && !c.parentRejectedAt).length;

  // Reset the outreach clock so the 4h timeout counts from now, not the original start
  // (recordWaveContacts only sets startedAt when absent). Reopen in case auto-close already fired.
  await Assignment.updateOne(
    { _id: assignment._id },
    { $set: {
      'outreach.contacts.$[c].parentRejectedAt': now,
      'outreach.contacts.$[c].parentRejectReason': reason,
      'outreach.status': 'Active',
      'outreach.startedAt': now,
      'outreach.lastWaveAt': now,
      status: 'Open',
    } },
    { arrayFilters: [{ 'c.status': 'Interested', 'c.shortlistRank': { $exists: true }, 'c.parentRejectedAt': { $exists: false } }] }
  );

  // Mirror the reset in memory so an immediate resumeOutreach sees Active state.
  assignment.outreach.status = 'Active';
  assignment.outreach.startedAt = now;
  assignment.outreach.lastWaveAt = now;
  assignment.status = 'Open';

  return { ok: true, assignment, rejectedCount };
}

// Fire one fresh wave immediately after a rejection (speed is the differentiator); the 30-min
// scheduler cadence continues afterward since the wave re-stamps lastWaveAt. Slow — callers run
// it in the background (waitUntil) rather than holding a tap or an HTTP response open.
export async function resumeOutreach(assignment, { botUsername, waveSize = 6 } = {}) {
  return escalateAssignment(assignment, botUsername, { waveSize });
}
