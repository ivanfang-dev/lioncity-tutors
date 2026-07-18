import mongoose from 'mongoose';
import { Assignment, Tutor } from '../../../packages/shared/server-exports.js';
import { normalizePhone } from './phone.js';
import { notifyOwner, opsButtonRow } from './ownerAlert.js';
import { buildRatePrompt } from './rateCapture.js';

// Shared core for recording a tutor's Yes/No reply, used by both the legacy
// /api/whatsapp-reply endpoint (VM-forwarded) and the new /api/whatsapp-webhook
// (Meta Cloud API). Keeping the matching + owner-alert logic in one place means the
// two entry points can never drift apart.

// Stop sending new waves once this many tutors have replied "Yes".
const INTERESTED_TARGET = Number(process.env.OUTREACH_INTERESTED_TARGET) || 3;
// After the target is reached we don't fulfil immediately — we HOLD for this long, still
// collecting late yeses, so the shortlist can be the BEST target tutors rather than the
// fastest. The escalation tick re-ranks and releases when the window elapses.
const OUTREACH_HOLD_WINDOW_MS = Number(process.env.OUTREACH_HOLD_WINDOW_MS) || 45 * 60 * 1000; // 45min
// Once the viable interested pool runs this far past target there's nothing to gain from
// waiting — release immediately (the next tick ranks + fulfils) rather than idling tutors.
const EARLY_RELEASE_MARGIN = 3;

// Pure decision for the hold-window transition, triggered on an Interested reply. Returns
// the outreach fields to $set, or null when nothing should change (still below target, or
// already Holding with the window open and the pool not yet comfortably over target).
// `now` is injected so the transition can be unit-tested without wall-clock coupling.
export function holdTransition(currentStatus, viableInterestedCount, now = new Date(), {
  target = INTERESTED_TARGET,
  holdWindowMs = OUTREACH_HOLD_WINDOW_MS,
  earlyReleaseMargin = EARLY_RELEASE_MARGIN,
} = {}) {
  if (viableInterestedCount < target) return null;
  // Comfortably over target — release now (holdUntil in the past → next tick ranks + fulfils).
  // Fires regardless of current status: one WhatsApp reply can flip several seeded contacts
  // straight past the margin, so a first-time transition can already warrant an early release.
  if (viableInterestedCount >= target + earlyReleaseMargin) {
    return { status: 'Holding', holdUntil: now };
  }
  // Just reached target — open the hold window. If we're already Holding (a later yes that's
  // still under the early-release margin), leave the existing window untouched.
  if (currentStatus !== 'Holding') {
    return { status: 'Holding', holdUntil: new Date(now.getTime() + holdWindowMs) };
  }
  return null;
}

// How long the tutor took to reply, in whole minutes — the per-contact number Phase 7's
// medianResponseMins aggregates and the responsiveness factor already scores on. Returns null
// rather than NaN/garbage when either end is missing (legacy contacts predate sentAt) so the
// field is simply absent instead of poisoning later averages. Clock skew between the Vercel
// function and Mongo can put respondedAt marginally before sentAt; clamp to 0 — a negative
// latency is never meaningful and would drag a median below zero.
export function responseLatencyMins(sentAt, respondedAt) {
  if (!sentAt || !respondedAt) return null;
  const ms = new Date(respondedAt).getTime() - new Date(sentAt).getTime();
  if (!Number.isFinite(ms)) return null;
  return Math.max(0, Math.round(ms / 60000));
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

// Wall-clock HH:MM in Singapore time — the owner's timezone — for the hold-window message.
function formatSgTime(date) {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Singapore', hour: '2-digit', minute: '2-digit', hour12: false
  }).format(date);
}

// Ping the owner when a tutor says yes — the signal they act on to reach the parent fast.
async function alertOwnerInterested(assignment, tutorName, interestedCount) {
  const holding = assignment.outreach?.status === 'Holding';

  // Offer a one-tap relay only when we can act on it: the assignment has a parent number to
  // send to. While Holding we deliberately wait for the ranked shortlist (released by the
  // tick), so we suppress the early, unranked send here — the send button returns on the
  // release "rich card" once the best 3 are chosen. The button forwards the whole
  // interested-but-unsent set, so its label tracks how many are waiting to be sent (1, 2...).
  const rows = [];
  if (assignment.parentContact && !holding) {
    const pendingCount = assignment.pendingParentTutorIds().length;
    if (pendingCount > 0) {
      rows.push([{
        text: pendingCount === 1
          ? '📤 Send profile to parent'
          : `📤 Send all ${pendingCount} profiles to parent`,
        callback_data: `sendallprof_${assignment._id}`
      }]);
    }
  }
  // Deep link into the console, where the full picture of this assignment lives.
  const opsRow = opsButtonRow(assignment._id);
  if (opsRow) rows.push(opsRow);
  const replyMarkup = rows.length ? { inline_keyboard: rows } : undefined;

  // On the yes that reaches target, say we're holding for better candidates (not "done") —
  // the shortlist is picked when the window elapses, not on the fastest 3 responders.
  let statusLine = '';
  if (holding) {
    const until = assignment.outreach?.holdUntil ? formatSgTime(assignment.outreach.holdUntil) : 'shortly';
    statusLine =
      `\n\n🕑 Target reached — *holding for better candidates until ${until}*.\n` +
      `No new tutors will be messaged; you'll get the ranked top 3 to send when the window closes.`;
  }

  await notifyOwner(
    `✅ *Tutor interested*\n` +
    `*${tutorName || 'A tutor'}* said YES to *${assignment.title}*\n` +
    `(${interestedCount}/${INTERESTED_TARGET} interested)` +
    (assignment.parentContact ? '' : `\n\n⚠️ No parent contact on this assignment — relay unavailable.`) +
    statusLine,
    replyMarkup
  );
}

// Record a tutor's reply ('yes' | 'no') against the most recent active outreach that
// messaged this number. Returns a result object; { matched: false } when the reply can't
// be tied to an open outreach (so callers can skip acknowledging strangers). Never throws
// for a bad reply value — returns { matched: false, error } instead.
export async function recordTutorReply(phone, reply) {
  const decision = reply === 'yes' ? 'Interested' : reply === 'no' ? 'Declined' : null;
  if (!phone || !decision) {
    return { matched: false, error: 'phone and reply (yes|no) required' };
  }

  await connectToDatabase();
  const norm = normalizePhone(phone);

  // Find the most recent still-active outreach that messaged this number AND flip its
  // waiting contact(s) to the decision, in one atomic operation. Deliberately not
  // find + mutate + .save(): a full-document save re-validates legacy assignments whose
  // subject/level predate the current enums (ValidationError → reply lost), and a
  // concurrent reply from another tutor could be clobbered by the stale write-back.
  // (A tutor in several open assignments → the sort attributes it to the latest wave.)
  const assignment = await Assignment.findOneAndUpdate(
    {
      // Accept replies while Active AND while Holding — a late "Yes" during the hold window
      // still counts toward the pool the shortlist re-rank picks from.
      'outreach.status': { $in: ['Active', 'Holding'] },
      'outreach.contacts': { $elemMatch: { phone: norm, status: 'Sent' } }
    },
    {
      $set: {
        'outreach.contacts.$[c].status': decision,
        'outreach.contacts.$[c].respondedAt': new Date()
      }
    },
    {
      new: true,
      sort: { 'outreach.lastWaveAt': -1 },
      arrayFilters: [{ 'c.phone': norm, 'c.status': 'Sent' }]
    }
  );

  if (!assignment) {
    return { matched: false };
  }

  // `new: true` returns the post-update doc, so the flipped contact already carries
  // the decision; any row with this phone belongs to the same tutor.
  const contact = assignment.outreach.contacts.find(c => c.phone === norm);
  return finalizeReply(assignment, contact, decision, reply);
}

// Shared tail for both reply recorders (WhatsApp phone-matched and Telegram tutorId-matched):
// apply the interested-target fulfilment gate, credit the tutor for responding, and alert the
// owner on a Yes. Keeping it here means the two channels can never drift apart. `assignment`
// is already the post-update doc; `contact` is the row we just flipped.
async function finalizeReply(assignment, contact, decision, reply) {
  const tutorName = contact?.tutorName || '';
  const tutorId = contact?.tutorId || null;

  // Enrich the row we just flipped, in ONE targeted update:
  //   responseLatencyMins — needs sentAt from the matched row, which we only know post-update.
  //   rateRequestedAt     — every yes is asked what they'd charge for THIS assignment, because
  //                         profile rates go stale and posted ranges ("$40-60/hr") leave a bare
  //                         Yes ambiguous. Persisting the ask here (not in userSessions) is what
  //                         lets the answer be matched back after a Vercel cold start, and what
  //                         lets WhatsApp — which has no session at all — use the same path.
  // arrayFilters on the contact's own _id stays precise even if a tutor holds several rows.
  const contactSet = {};
  const latencyMins = responseLatencyMins(contact?.sentAt, contact?.respondedAt);
  if (latencyMins !== null) {
    contactSet['outreach.contacts.$[c].responseLatencyMins'] = latencyMins;
    contact.responseLatencyMins = latencyMins;
  }

  let ratePrompt = null;
  if (decision === 'Interested') {
    const now = new Date();
    contactSet['outreach.contacts.$[c].rateRequestedAt'] = now;
    contact.rateRequestedAt = now;
    // The caller sends this on its own channel — state here, transport there.
    ratePrompt = buildRatePrompt(assignment);
  }

  if (Object.keys(contactSet).length && contact?._id) {
    await Assignment.updateOne(
      { _id: assignment._id },
      { $set: contactSet },
      { arrayFilters: [{ 'c._id': contact._id }] }
    ).catch(err => console.warn('Failed to enrich outreach contact:', err.message));
  }

  // Gate on viable (non-parent-rejected) interested tutors, so a resumed "find more" outreach
  // keeps sending until fresh tutors say Yes rather than instantly re-holding on the old shortlist.
  const interestedCount = assignment.viableInterestedCount();
  if (decision === 'Interested') {
    // Hitting the target starts a HOLD (not an immediate fulfil): stop new waves but keep
    // collecting late yeses until holdUntil, when the tick re-ranks and picks the best 3.
    const transition = holdTransition(assignment.outreach?.status, interestedCount);
    if (transition) {
      // Targeted update — never re-save a legacy document (subject/level enums may fail validation).
      await Assignment.updateOne(
        { _id: assignment._id },
        { $set: { 'outreach.status': transition.status, 'outreach.holdUntil': transition.holdUntil } }
      );
      // Mirror it in memory so the owner alert and the `stopped` return value see it.
      assignment.outreach.status = transition.status;
      assignment.outreach.holdUntil = transition.holdUntil;
    }
  }

  // Credit the tutor for responding (Yes OR No both count — they're reachable) and stamp their
  // freshness (Phase 7 lastConfirmedActiveAt — a reply is positive proof they're active).
  if (tutorId) {
    await Tutor.updateOne(
      { _id: tutorId },
      { $inc: { 'responseStats.responded': 1 }, $set: { lastConfirmedActiveAt: new Date() } }
    );
  }

  if (decision === 'Interested') {
    await alertOwnerInterested(assignment, tutorName, interestedCount);
  }

  return {
    matched: true,
    assignmentId: assignment._id.toString(),
    reply,
    interestedCount,
    // Set on a Yes: the caller should send this on whichever channel the tutor replied on,
    // in place of a generic acknowledgement. Null on a No.
    ratePrompt,
    // No longer sending fresh waves — Holding (target reached, collecting late yeses),
    // Fulfilled (shortlist chosen) or Exhausted all count as stopped.
    stopped: assignment.outreach.status !== 'Active'
  };
}

// Telegram counterpart of recordTutorReply. When a tutor taps ✅ Interested / ❌ on an outreach
// DM, the callback carries the exact assignmentId and we know the tutorId from their linked
// telegramId — so match precisely by (assignmentId, tutorId) instead of by phone. Same atomic,
// no-`.save()` flip + shared finalize tail as the phone path.
export async function recordTutorReplyByTutorId(tutorId, reply, assignmentId) {
  const decision = reply === 'yes' ? 'Interested' : reply === 'no' ? 'Declined' : null;
  if (!tutorId || !assignmentId || !decision) {
    return { matched: false, error: 'tutorId, assignmentId and reply (yes|no) required' };
  }

  await connectToDatabase();
  const tid = new mongoose.Types.ObjectId(tutorId);

  const assignment = await Assignment.findOneAndUpdate(
    {
      _id: assignmentId,
      // Active OR Holding — a late Telegram "Yes" during the hold window still lands.
      'outreach.status': { $in: ['Active', 'Holding'] },
      'outreach.contacts': { $elemMatch: { tutorId: tid, status: 'Sent' } }
    },
    {
      $set: {
        'outreach.contacts.$[c].status': decision,
        'outreach.contacts.$[c].respondedAt': new Date()
      }
    },
    {
      new: true,
      arrayFilters: [{ 'c.tutorId': tid, 'c.status': 'Sent' }]
    }
  );

  if (!assignment) {
    return { matched: false };
  }

  const contact = assignment.outreach.contacts.find(c => c.tutorId?.toString() === tid.toString());
  return finalizeReply(assignment, contact, decision, reply);
}
