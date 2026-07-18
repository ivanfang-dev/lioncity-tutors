import mongoose from 'mongoose';
import { Assignment, Tutor } from '../../../packages/shared/server-exports.js';
import { buildRatePrompt } from './rateCapture.js';
import { normalizePhone } from './phone.js';

// Why a tutor said no. Every "No" used to be thrown-away signal; this is the only place we
// learn the reason, and it's what tells us whether a pool is failing on money, distance, or
// timing. Capture is always best-effort — the Declined status is recorded on the tap itself,
// so a tutor who ignores this question costs us nothing.

// Must stay in lockstep with the declineReason enum on Assignment.outreach.contacts.
export const DECLINE_REASONS = ['rate', 'distance', 'schedule', 'inactive', 'other'];

export function isDeclineReason(reason) {
  return DECLINE_REASONS.includes(reason);
}

// Tutor-facing wording, shared by both channels so the analytics mean the same thing on each.
const REASON_LABELS = {
  rate: { short: 'Rate too low', long: 'The pay is below what I charge' },
  distance: { short: 'Too far', long: "The location doesn't work for me" },
  schedule: { short: 'Timing clash', long: "The days/times don't fit my schedule" },
  inactive: { short: 'Not tutoring now', long: "I'm not taking assignments at the moment" },
  other: { short: 'Other reason', long: 'Something else' }
};

// Telegram inline keyboard — one row per reason. callback_data is
// `outreach_reason_<reason>_<assignmentId>`: 16 + ~8 + 24 = well inside Telegram's 64-byte cap.
export function declineReasonKeyboard(assignmentId) {
  return DECLINE_REASONS.map(reason => ([{
    text: REASON_LABELS[reason].short,
    callback_data: `outreach_reason_${reason}_${assignmentId}`
  }]));
}

// WhatsApp interactive list rows. A LIST rather than buttons because reply-button messages cap
// at 3 and there are 5 reasons. Titles are capped at 24 chars and descriptions at 72 by the
// Cloud API — exceeding either makes the whole send fail, so the labels above stay short.
//
// The row id carries the assignment back with the answer ("rate:<id>", ~29 of the 200 chars
// allowed), mirroring Telegram's callback_data. Without it we'd have to guess which assignment
// a bare "rate" answers by looking up the tutor's most recent decline — wrong the moment a
// tutor declines two assignments in a row, which the wave design makes routine.
export function declineReasonListRows(assignmentId) {
  return DECLINE_REASONS.map(reason => ({
    id: `${reason}:${assignmentId}`,
    title: REASON_LABELS[reason].short,
    description: REASON_LABELS[reason].long
  }));
}

// Inverse of the row id above. Returns null for anything that isn't one of ours.
export function parseListReplyId(id) {
  const [reason, assignmentId] = String(id ?? '').split(':');
  if (!isDeclineReason(reason) || !assignmentId) return null;
  return { reason, assignmentId };
}

let isConnected = false;
async function connectToDatabase() {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGODB_URI, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000
  });
  isConnected = true;
}

// Record the reason against the contact we just flipped to Declined, and apply its two side
// effects. Shared by both channels. Returns { ratePrompt } when the tutor should be asked what
// they WOULD take — the caller sends it on its own channel.
//
// Matching is by (assignment, tutor) on a Declined row rather than by status: 'Sent', because
// the No has already been recorded by the time a reason arrives.
export async function recordDeclineReason({ phone, tutorId, assignmentId, reason }) {
  if (!isDeclineReason(reason) || !assignmentId || (!phone && !tutorId)) {
    return { matched: false };
  }

  await connectToDatabase();

  // Contacts store the 8-digit local form; the webhook hands us a Meta wa_id ("6591234567").
  // Matching raw would find nothing and report nothing.
  const normPhone = phone ? normalizePhone(phone) : null;

  const match = { status: 'Declined' };
  if (normPhone) match.phone = normPhone;
  else match.tutorId = new mongoose.Types.ObjectId(tutorId);

  const set = { 'outreach.contacts.$[c].declineReason': reason };
  // "Too low" plus a number is the single most actionable decline we get: it says exactly how
  // far off the budget was (Phase 8's raw material) and is sometimes a placement the owner can
  // take back to the parent. The contact stays Declined and still doesn't count toward the
  // interested target — we're buying information, not converting a no into a yes.
  const wantsRate = reason === 'rate';
  if (wantsRate) set['outreach.contacts.$[c].rateRequestedAt'] = new Date();

  const filter = { 'c.status': 'Declined' };
  if (normPhone) filter['c.phone'] = normPhone;
  else filter['c.tutorId'] = new mongoose.Types.ObjectId(tutorId);

  // Targeted $set — never a full-document save (legacy assignments carry subject/level values
  // outside the current enums and would throw ValidationError on re-validate).
  const assignment = await Assignment.findOneAndUpdate(
    { _id: assignmentId, 'outreach.contacts': { $elemMatch: match } },
    { $set: set },
    { new: true, arrayFilters: [filter] }
  );

  if (!assignment) return { matched: false };

  // "Not tutoring now" is the tutor telling us to stop. Honour it as a hard exclusion from
  // future matching rather than just noting it — continuing to message them is how a pool
  // rots and how a WhatsApp number gets reported. Cleared when they re-engage (handleContact).
  if (reason === 'inactive') {
    const tid = tutorId || assignment.outreach.contacts.find(c => c.phone === normPhone)?.tutorId;
    if (tid) {
      await Tutor.updateOne({ _id: tid }, { $set: { pausedAt: new Date() } })
        .catch(err => console.warn('Failed to set tutor.pausedAt:', err.message));
    }
  }

  return {
    matched: true,
    reason,
    ratePrompt: wantsRate ? buildRatePrompt(assignment) : null
  };
}
