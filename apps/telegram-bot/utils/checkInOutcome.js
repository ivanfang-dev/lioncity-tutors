import mongoose from 'mongoose';
import { Placement } from '../../../packages/shared/server-exports.js';

// The single recorder for every day-30 check-in outcome (roadmap Phase 5). Channel-agnostic on
// purpose — the owner records from Telegram buttons (bot/handlers.js) AND from the ops console
// (api/checkin-outcome.js), and both MUST land identical state. This module owns the Placement
// state transitions; callers own how they report back to whoever tapped.
//
// Placement is a NEW, clean model (every row is created by our own code, never a legacy import),
// so unlike Assignment/Tutor it's safe to write freely — but we still use targeted updateOne/
// findOneAndUpdate with $push/$set so a check-in append can't clobber a concurrent one.

// Day-30 window: ping once the placement is this old (28d, so it lands around the one-month mark),
// then a single re-ping 3 days later, then give up (append a no_reply so the queue stays clean).
export const CHECKIN_DUE_MS = Number(process.env.CHECKIN_DUE_MS) || 28 * 24 * 60 * 60 * 1000;
export const CHECKIN_REPING_MS = Number(process.env.CHECKIN_REPING_MS) || 3 * 24 * 60 * 60 * 1000;

// Pure decision for the check-in cadence — mirrors the tick's three queries so the thresholds live
// in one place and stay unit-testable without a DB (same pattern as parentSilenceAction). Reads
// only fields the tick selects. `now` injected for tests.
//   'ping'   → first owner ping is due (set checkInRequestedAt)
//   'reping' → the 3-day re-ping is due (set checkInRepingedAt)
//   'giveup' → no reply after the re-ping window; append a 'no_reply' checkIn and stop
//   null     → nothing to do (too new, already answered, or not an active placement)
export function checkInAction(placement, now = new Date(), {
  dueMs = CHECKIN_DUE_MS,
  repingMs = CHECKIN_REPING_MS,
} = {}) {
  if (!placement) return null;
  // Any recorded outcome ends the cadence — a placement with a checkIn has been answered (or
  // already given up on). Only 'active' placements are ever pinged (a backfilled 'unknown' row is
  // too stale to chase — roadmap Phase 5).
  if ((placement.checkIns?.length || 0) > 0) return null;
  if (placement.status !== 'active') return null;

  const t = now instanceof Date ? now.getTime() : new Date(now).getTime();

  if (placement.checkInRepingedAt) {
    return (t - new Date(placement.checkInRepingedAt).getTime()) >= repingMs ? 'giveup' : null;
  }
  if (placement.checkInRequestedAt) {
    return (t - new Date(placement.checkInRequestedAt).getTime()) >= repingMs ? 'reping' : null;
  }
  if (!placement.filledAt) return null;
  return (t - new Date(placement.filledAt).getTime()) >= dueMs ? 'ping' : null;
}

function badId(id) {
  return !mongoose.isValidObjectId(id);
}

// Parent says tuition is going well. Appends an 'active' checkIn (with the owner's 1–5 rating when
// given), and marks the placement survived. Idempotent-enough: a double-tap adds a second row, but
// both carry the same signal — survival is the label that matters and it's set the same either way.
export async function recordCheckInWell({ placementId, rating = null }) {
  if (badId(placementId)) return { ok: false, error: 'invalid_id' };
  let ratingNum = null;
  if (rating != null) {
    ratingNum = Number(rating);
    if (!Number.isInteger(ratingNum) || ratingNum < 1 || ratingNum > 5) return { ok: false, error: 'invalid_rating' };
  }
  const checkIn = { at: new Date(), status: 'active' };
  if (ratingNum != null) checkIn.rating = ratingNum;

  const placement = await Placement.findOneAndUpdate(
    { _id: placementId },
    { $push: { checkIns: checkIn }, $set: { survived30d: true, status: 'active' } },
    { new: true }
  );
  if (!placement) return { ok: false, error: 'placement_not_found' };
  return { ok: true, placement };
}

// Parent says tuition ended. Marks the placement ended/not-survived and appends the checkIn.
// Returns the new checkIn's _id so the caller can attach the verbatim reason next (a two-step
// flow: the owner types the parent's stated reason after tapping "It ended").
export async function recordCheckInEnded({ placementId }) {
  if (badId(placementId)) return { ok: false, error: 'invalid_id' };
  const checkIn = { at: new Date(), status: 'ended' };
  const placement = await Placement.findOneAndUpdate(
    { _id: placementId },
    { $push: { checkIns: checkIn }, $set: { survived30d: false, status: 'ended' } },
    { new: true }
  );
  if (!placement) return { ok: false, error: 'placement_not_found' };
  const appended = placement.checkIns[placement.checkIns.length - 1];
  return { ok: true, placement, checkInId: appended?._id?.toString() || null };
}

// Attach the parent's stated reason to a specific 'ended' checkIn (stored verbatim). Best-effort
// enrichment — the ended outcome is already recorded, so a lost/never-typed reason costs nothing.
export async function recordCheckInEndReason({ placementId, checkInId, reason }) {
  if (badId(placementId) || badId(checkInId)) return { ok: false, error: 'invalid_id' };
  const text = String(reason ?? '').trim();
  if (!text) return { ok: false, error: 'empty_reason' };
  const res = await Placement.updateOne(
    { _id: placementId },
    { $set: { 'checkIns.$[c].endReason': text } },
    { arrayFilters: [{ 'c._id': new mongoose.Types.ObjectId(String(checkInId)) }] }
  );
  if (res.matchedCount === 0) return { ok: false, error: 'placement_not_found' };
  return { ok: true };
}

// Owner marks the check-in as no-reply (either explicitly, or the tick's give-up step). Appends a
// 'no_reply' checkIn so the placement leaves the due queue without asserting survival either way.
export async function recordCheckInNoReply({ placementId }) {
  if (badId(placementId)) return { ok: false, error: 'invalid_id' };
  const res = await Placement.updateOne(
    { _id: placementId },
    { $push: { checkIns: { at: new Date(), status: 'no_reply' } } }
  );
  if (res.matchedCount === 0) return { ok: false, error: 'placement_not_found' };
  return { ok: true };
}
