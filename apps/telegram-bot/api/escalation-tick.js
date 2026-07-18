import mongoose from 'mongoose';
import { waitUntil } from '@vercel/functions';
import { Assignment, Tutor, Placement } from '../../../packages/shared/server-exports.js';
import { escalateAssignment, remindNonResponders } from '../utils/tutorNotifier.js';
import { shortlistScore, shortlistReason, buildFeatureSnapshot } from '../utils/tutorMatcher.js';
import { recordRecommendation } from '../utils/recordRecommendation.js';
import { holdTransition } from '../utils/recordTutorReply.js';
import { draftParentMessage, buildWaMeButton, waMeLink } from '../utils/parentMessage.js';
import { checkInAction, recordCheckInNoReply, CHECKIN_DUE_MS, CHECKIN_REPING_MS } from '../utils/checkInOutcome.js';
import { checkInButtonRows } from '../utils/checkInButtons.js';
import { runTutorStatsMaterialization } from '../utils/materializeTutorStats.js';
import { notifyOwner, opsButtonRow } from '../utils/ownerAlert.js';
import { formatAssignmentForChannel } from '../utils/channelFormat.js';
import { shortlistDecided, shortlistedContacts } from '../../../packages/shared/utils/outreachState.js';

// Give the background sends (which run after the response) room to finish.
export const maxDuration = 60;

const WAVE_INTERVAL_MS = Number(process.env.OUTREACH_WAVE_INTERVAL_MS) || 60 * 30 * 1000; // 30mins
const WAVE_SIZE = Number(process.env.OUTREACH_WAVE_SIZE) || 6;
const MAX_DURATION_MS = Number(process.env.OUTREACH_MAX_DURATION_MS) || 4 * 60 * 60 * 1000; // 4h
const INTERESTED_TARGET = Number(process.env.OUTREACH_INTERESTED_TARGET) || 3;
// Max reminder pings a single non-responder can receive once the fresh pool is dry,
// before we stop and hand the assignment to the owner.
const MAX_REMINDERS = Number(process.env.OUTREACH_MAX_REMINDERS) || 1;
// Assignments handled per tick. Kept at 1 so each tick's send load stays within the
// same time budget as the proven wave-1 path; the WhatsApp service ticks frequently,
// so a backlog drains quickly. Raise if assignment volume grows.
const MAX_PER_TICK = Number(process.env.OUTREACH_MAX_PER_TICK) || 1;
const BOT_USERNAME = process.env.BOT_USERNAME;

// Auto-close: assignments still Open this many days after creation are closed (they're
// almost always filled by then) and their channel post is updated so tutors stop asking.
const AUTO_CLOSE_DAYS = Number(process.env.ASSIGNMENT_AUTO_CLOSE_DAYS) || 7;
const MAX_CLOSE_PER_TICK = 20; // bound the Telegram edits done in one tick

// The shortlist relayed to the parent — the best N of everyone who said Yes during the hold
// window. Tied to the interested target (default 3): we collect extra, then pick this many.
const SHORTLIST_SIZE = INTERESTED_TARGET;
// Bound how many hold windows one tick releases, so the owner-alert fan-out stays inside the
// function's time budget (each release = a Tutor query + one owner Telegram message).
const MAX_RELEASE_PER_TICK = Number(process.env.OUTREACH_MAX_RELEASE_PER_TICK) || 5;

// Parent-silence follow-up: after the shortlist is handed to the owner, nudge once at this age
// if no pick/reject was recorded, then flag for manual follow-up (and stop nagging) at 48h.
const PARENT_NUDGE_AFTER_MS = Number(process.env.PARENT_NUDGE_AFTER_MS) || 24 * 60 * 60 * 1000; // 24h
const PARENT_FLAG_AFTER_MS = Number(process.env.PARENT_FLAG_AFTER_MS) || 48 * 60 * 60 * 1000; // 48h
const MAX_NUDGE_PER_TICK = Number(process.env.OUTREACH_MAX_NUDGE_PER_TICK) || 5;

// Day-30 check-in (Phase 5): how many owner pings (first + re-ping) one tick may send, bounded like
// the other fan-outs so a backlog of due placements can't blow the function's time budget.
const MAX_CHECKIN_PER_TICK = Number(process.env.OUTREACH_MAX_CHECKIN_PER_TICK) || 5;

// Pure decision for the parent-silence follow-up: 'nudge' (24h, once), 'flag' (48h, once), or
// null. `now` injected for testing. Self-contained: returns null the moment an outcome is
// recorded (pick → status Filled or parentPickedAt; reject → parentRejectedAt on a shortlisted
// contact) so a race with the owner's tap can't nag after a decision.
export function parentSilenceAction(assignment, now = new Date(), {
  nudgeAfterMs = PARENT_NUDGE_AFTER_MS,
  flagAfterMs = PARENT_FLAG_AFTER_MS,
} = {}) {
  const o = assignment.outreach || {};
  if (!o.shortlistReleasedAt) return null;      // no shortlist handed over yet
  if (o.parentSilenceEscalatedAt) return null;  // already flagged — done nagging
  if (assignment.status === 'Filled') return null;
  // Scoped to the CURRENT release cycle — see shortlistDecided. Shared with the ops console so
  // the queue can't show a row the tick considers resolved.
  if (shortlistDecided(assignment)) return null;

  const elapsed = now - new Date(o.shortlistReleasedAt);
  if (elapsed >= flagAfterMs) return 'flag';
  if (elapsed >= nudgeAfterMs && !o.parentNudgedAt) return 'nudge';
  return null;
}

// An "Open in console" keyboard for alerts that carry no other buttons, or undefined when no
// console URL is configured (notifyOwner then sends a plain message).
function opsKeyboard(assignmentId) {
  const row = opsButtonRow(assignmentId);
  return row ? { inline_keyboard: [row] } : undefined;
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

// Send the next wave (or close out) for one already-claimed assignment.
async function processAssignment(assignment, now) {
  // Already at target — the reply recorder normally moves it to Holding, but guard anyway.
  // Count only viable (non-parent-rejected) interested tutors so a resumed outreach isn't
  // re-held by a shortlist the parent already passed on. Route through the SAME hold-window
  // decision as the reply path (not a direct Fulfil) so the shortlist still gets re-ranked.
  const viable = assignment.viableInterestedCount();
  if (viable >= INTERESTED_TARGET) {
    const transition = holdTransition(assignment.outreach?.status, viable, now);
    if (transition) {
      // Atomic update (see closeStaleAssignments): avoids re-validating a legacy subject.
      await Assignment.updateOne(
        { _id: assignment._id },
        { $set: { 'outreach.status': transition.status, 'outreach.holdUntil': transition.holdUntil } }
      );
    }
    return;
  }

  // Past the time cap with too few replies → stop and ask the owner to step in.
  const startedAt = assignment.outreach?.startedAt;
  if (startedAt && (now - new Date(startedAt)) >= MAX_DURATION_MS) {
    await Assignment.updateOne(
      { _id: assignment._id },
      { $set: { 'outreach.status': 'Exhausted' } }
    );
    await notifyOwner(
      `⏰ *Outreach timed out*\n*${assignment.title}* got ${assignment.interestedCount()} interested tutor(s) ` +
      `in ${Math.round(MAX_DURATION_MS / 3600000)}h.\nPlease follow up manually.`,
      opsKeyboard(assignment._id)
    );
    return;
  }

  const result = await escalateAssignment(assignment, BOT_USERNAME, { waveSize: WAVE_SIZE });

  if (!result.exhausted) {
    console.log(`Escalation wave ${result.wave} for ${assignment._id}: ${result.sent} sent, ${result.failed} failed`);
    return;
  }

  // No fresh tutors left to try — before giving up, nudge the non-responders once (up to
  // MAX_REMINDERS each). Only when there's no one left to remind do we mark Exhausted.
  const reminder = await remindNonResponders(assignment, BOT_USERNAME, {
    maxReminders: MAX_REMINDERS,
    waveSize: WAVE_SIZE
  });

  if (reminder.remindedNone) {
    await Assignment.updateOne({ _id: assignment._id }, { $set: { 'outreach.status': 'Exhausted' } });
    await notifyOwner(
      `📭 *Ran out of tutors*\n*${assignment.title}* has no more matching tutors to contact ` +
      `(${assignment.interestedCount()} interested).\nPlease follow up manually.`,
      opsKeyboard(assignment._id)
    );
  } else {
    console.log(`Reminder wave for ${assignment._id}: ${reminder.sent} sent, ${reminder.failed} failed`);
  }
}

// A hold window has elapsed: re-rank everyone who said Yes into the parent-facing shortlist.
// Picks the best SHORTLIST_SIZE by shortlistScore (quality WITHOUT the responsiveness penalty
// — they already replied), stamps their 1..N rank, fulfils the outreach, and alerts the owner.
async function releaseOneShortlist(assignment) {
  // Viable = said Yes and the parent hasn't already passed on them (a resumed "find more"
  // shortlist can leave rejected-but-Interested contacts behind).
  const viable = (assignment.outreach?.contacts || [])
    .filter(c => c.status === 'Interested' && !c.parentRejectedAt && c.tutorId);

  // Load just the fields shortlistScore + the owner alert + the decision-log snapshot need.
  // Contacts store only tutorId. responseStats is included so the Recommendation featureSnapshot's
  // responsivenessFactor is accurate (shortlistScore itself doesn't use it, by design).
  const tutorIds = viable.map(c => c.tutorId);
  const tutors = tutorIds.length
    ? await Tutor.find({ _id: { $in: tutorIds } })
        .select('fullName yearsOfExperience introduction teachingExperience trackRecord hourlyRate tutorType teachingLevels responseStats')
        .lean()
    : [];
  const tutorById = new Map(tutors.map(t => [t._id.toString(), t]));

  // The full viable pool, scored + sorted — kept whole for the decision log below; `ranked` is the
  // top SHORTLIST_SIZE that actually go to the parent.
  const rankedAll = viable
    .map(c => ({ contact: c, tutor: tutorById.get(c.tutorId.toString()) }))
    .filter(x => x.tutor)
    .map(x => ({ ...x, score: shortlistScore(x.tutor, assignment, x.contact.quotedRate ?? null) }))
    .sort((a, b) => b.score - a.score);
  const ranked = rankedAll.slice(0, SHORTLIST_SIZE);

  if (ranked.length === 0) {
    // Nothing left to shortlist (all rejected, or tutor docs vanished). Stop holding so it
    // doesn't loop, and let the owner know to handle it manually.
    await Assignment.updateOne({ _id: assignment._id }, { $set: { 'outreach.status': 'Fulfilled' } });
    await notifyOwner(
      `🎯 *Hold window closed* — *${assignment.title}*\n` +
      `No shortlist could be built (interested tutors are unavailable). Please follow up manually.`,
      opsKeyboard(assignment._id)
    );
    return;
  }

  // Stamp shortlistRank 1..N on the winners, record the release time (starts the parent-
  // silence clock), AND fulfil — one atomic update. arrayFilters address each winner by
  // tutorId. Never .save(): a legacy subject/level would fail re-validation, and a stale
  // contact array could clobber a reply that landed mid-release.
  const releasedAt = new Date();
  const set = { 'outreach.status': 'Fulfilled', 'outreach.shortlistReleasedAt': releasedAt };
  const arrayFilters = [];
  ranked.forEach((r, i) => {
    set[`outreach.contacts.$[c${i}].shortlistRank`] = i + 1;
    arrayFilters.push({ [`c${i}.tutorId`]: r.tutor._id });
  });
  // Clear the parent-silence gates so a re-released shortlist (after a reject → resume) starts a
  // fresh 24h/48h cycle rather than inheriting the prior cycle's nudged/flagged state. No-op on
  // a first release.
  await Assignment.updateOne(
    { _id: assignment._id },
    { $set: set, $unset: { 'outreach.parentNudgedAt': '', 'outreach.parentSilenceEscalatedAt': '' } },
    { arrayFilters }
  );

  // Mirror the release into the in-memory doc so the owner alert (pendingParentTutorIds +
  // the rich card) sees the ranks and the Fulfilled status.
  assignment.outreach.status = 'Fulfilled';
  assignment.outreach.shortlistReleasedAt = releasedAt;
  assignment.outreach.parentNudgedAt = undefined;
  assignment.outreach.parentSilenceEscalatedAt = undefined;
  ranked.forEach((r, i) => {
    const c = assignment.outreach.contacts.find(cc => cc.tutorId?.toString() === r.tutor._id.toString());
    if (c) c.shortlistRank = i + 1;
  });

  await alertOwnerShortlistReady(assignment, ranked);

  // Log the shortlist decision (Phase 6): the whole viable pool with per-tutor score + features, and
  // which ones were actually shortlisted to the parent. After the relay, best-effort — never blocks.
  const shortlistedIds = new Set(ranked.map(r => r.tutor._id.toString()));
  await recordRecommendation({
    assignmentId: assignment._id,
    trigger: 'shortlist',
    candidates: rankedAll.map((r, i) => ({
      tutorId: r.tutor._id,
      rank: i + 1,
      score: r.score,
      contacted: shortlistedIds.has(r.tutor._id.toString()),
      featureSnapshot: buildFeatureSnapshot(r.tutor, assignment, r.contact.quotedRate ?? null),
    })),
  });
}

// Outcome-capture buttons for a released shortlist: one "Picked #N" per ranked tutor, plus
// "Rejected all" and "No reply yet". Reused by the release alert AND the 24h silence nudge so
// both record through the same handlers (setwinner_/rejectall_/parentnoreply_ in handlers.js
// — one source of truth). `shortlisted` = [{ tutorId, tutorName, shortlistRank }].
function buildOutcomeButtons(assignmentId, shortlisted) {
  const rows = shortlisted
    .slice()
    .sort((a, b) => (a.shortlistRank ?? Infinity) - (b.shortlistRank ?? Infinity))
    .map(s => ([{
      text: `✅ Parent picked #${s.shortlistRank} — ${s.tutorName || 'Tutor'}`,
      callback_data: `setwinner_${assignmentId}_${s.tutorId}`
    }]));
  rows.push([{ text: '❌ Parent rejected all', callback_data: `rejectall_${assignmentId}` }]);
  rows.push([{ text: '🕓 No reply yet', callback_data: `parentnoreply_${assignmentId}` }]);
  return rows;
}

// Alert the owner that a ranked shortlist is ready to relay: a rich card with the top 3, a
// one-line "why" per tutor (experience/type + rate-vs-budget), the drafted parent message
// behind a "Send via WhatsApp" wa.me button (paste-block fallback when the draft is too long
// for a button URL), and the outcome-capture buttons.
async function alertOwnerShortlistReady(assignment, ranked) {
  const medals = ['🥇', '🥈', '🥉'];
  const cards = ranked.map((r, i) => {
    const medal = medals[i] || `${i + 1}.`;
    return `${medal} *${r.tutor.fullName || 'Tutor'}*\n    ${shortlistReason(r.tutor, assignment, r.contact.quotedRate ?? null)}`;
  });

  let text =
    `🎯 *Shortlist ready* — *${assignment.title}*\n` +
    `Picked the best ${ranked.length} of ${assignment.viableInterestedCount()} interested tutor(s):\n\n` +
    cards.join('\n\n');

  const rows = [];

  if (assignment.parentContact) {
    // Draft the parent-facing message and offer it as a one-tap "open WhatsApp with the draft
    // pre-filled" button. Best-effort: any drafting failure falls back to a template inside
    // draftParentMessage; a too-long draft returns no button, so we paste it into the body.
    // Attach each tutor's quoted rate (Phase 4) onto the drafting view-model so the parent
    // message quotes what the tutor will actually charge for this assignment, not their profile.
    const draft = await draftParentMessage('shortlist', {
      assignment,
      tutors: ranked.map(r => ({ ...r.tutor, quotedRate: r.contact.quotedRate ?? null })),
    });
    const waButton = buildWaMeButton(assignment.parentContact, draft, '📤 Send via WhatsApp');
    if (waButton) {
      rows.push([waButton]);
    } else {
      text += `\n\n📋 *Draft too long for a button — open [WhatsApp](${waMeLink(assignment.parentContact)}) with ${assignment.parentContact} and paste:*\n\n${draft}`;
    }

    rows.push(...buildOutcomeButtons(assignment._id, ranked.map((r, i) => ({
      tutorId: r.tutor._id, tutorName: r.tutor.fullName, shortlistRank: i + 1
    }))));
  } else {
    text += `\n\n⚠️ No parent contact on this assignment — relay unavailable.`;
  }

  const opsRow = opsButtonRow(assignment._id);
  if (opsRow) rows.push(opsRow);

  await notifyOwner(text, rows.length ? { inline_keyboard: rows } : undefined, { disableWebPagePreview: true });
}

// Release every hold window whose timer has elapsed. Bounded per tick. Runs every tick
// (like closeStaleAssignments), independent of whether a wave was due.
async function releaseHoldingShortlists(now) {
  const due = await Assignment.find({
    'outreach.status': 'Holding',
    'outreach.holdUntil': { $lte: now }
  }).limit(MAX_RELEASE_PER_TICK);

  for (const assignment of due) {
    try {
      await releaseOneShortlist(assignment);
      console.log(`Released shortlist for ${assignment._id}`);
    } catch (err) {
      console.error(`Shortlist release failed for ${assignment._id}:`, err.message);
    }
  }
}

// Ping the owner about a parent who's gone quiet on a released shortlist: a nudge (24h) carries
// a drafted reminder behind a wa.me button, a flag (48h) just marks it for manual follow-up.
// Both re-show the outcome-capture buttons so the owner can still record the result from here.
async function alertOwnerParentSilent(assignment, kind) {
  const shortlisted = shortlistedContacts(assignment)
    .map(c => ({ tutorId: c.tutorId, tutorName: c.tutorName, shortlistRank: c.shortlistRank }));

  const rows = [];
  let text;
  if (kind === 'nudge') {
    text = `⏳ *Parent quiet* — no pick/reject on *${assignment.title}* ~24h after you got the shortlist.\nNudge them?`;
    if (assignment.parentContact) {
      const draft = await draftParentMessage('nudge', { assignment });
      const btn = buildWaMeButton(assignment.parentContact, draft, '📤 Send nudge via WhatsApp');
      if (btn) rows.push([btn]);
      else text += `\n\n📋 Open [WhatsApp](${waMeLink(assignment.parentContact)}) with ${assignment.parentContact} and paste:\n\n${draft}`;
    }
  } else {
    text = `🚩 *Parent silent ~48h* on *${assignment.title}* — flagged for manual follow-up. No more auto-reminders.`;
  }
  if (assignment.parentContact && shortlisted.length) {
    rows.push(...buildOutcomeButtons(assignment._id, shortlisted));
  }
  const opsRow = opsButtonRow(assignment._id);
  if (opsRow) rows.push(opsRow);
  await notifyOwner(text, rows.length ? { inline_keyboard: rows } : undefined, { disableWebPagePreview: true });
}

// Follow up on parents who've gone silent since a shortlist was handed over. Runs every tick,
// bounded per run. Nudges once at 24h, flags at 48h; parentSilenceAction gates both so nothing
// is nagged twice or after the owner records an outcome.
async function nudgeSilentParents(now) {
  const cutoff = new Date(now.getTime() - PARENT_NUDGE_AFTER_MS);
  const candidates = await Assignment.find({
    status: 'Open',
    'outreach.status': 'Fulfilled',
    'outreach.shortlistReleasedAt': { $lte: cutoff },
    'outreach.parentSilenceEscalatedAt': { $exists: false }
  }).limit(MAX_NUDGE_PER_TICK);

  for (const assignment of candidates) {
    const action = parentSilenceAction(assignment, now);
    if (!action) continue;
    try {
      // Record the gate FIRST so a slow owner-alert can't cause a double-nudge on the next tick.
      const field = action === 'nudge' ? 'outreach.parentNudgedAt' : 'outreach.parentSilenceEscalatedAt';
      await Assignment.updateOne({ _id: assignment._id }, { $set: { [field]: now } });
      await alertOwnerParentSilent(assignment, action);
      console.log(`Parent-silence ${action} for ${assignment._id}`);
    } catch (err) {
      console.error(`Parent silence follow-up failed for ${assignment._id}:`, err.message);
    }
  }
}

// Ping the owner that a placement is due its day-30 check-in: parent number + tutor name, a drafted
// "how's it going?" message behind a wa.me button (paste-block fallback), and the recording buttons
// (Going well / It ended / No reply) that all land through checkInOutcome.js. `kind` is 'due' (first
// ping) or 'reping' (the single 3-day follow-up), which only changes the wording.
async function alertOwnerCheckIn(placement, kind) {
  const [assignment, tutor] = await Promise.all([
    Assignment.findById(placement.assignmentId).select('title level subject parentContact').lean(),
    Tutor.findById(placement.tutorId).select('fullName').lean(),
  ]);
  const title = assignment?.title || 'a past assignment';
  const tutorName = tutor?.fullName || 'the tutor';
  const parentContact = placement.parentContact || assignment?.parentContact || null;
  const filledAt = placement.filledAt ? new Date(placement.filledAt) : null;
  const daysAgo = filledAt ? Math.round((Date.now() - filledAt.getTime()) / (24 * 60 * 60 * 1000)) : null;

  const header = kind === 'reping' ? '🔁 *Check-in reminder*' : '📅 *Day-30 check-in due*';
  let text =
    `${header} — *${title}*\n` +
    `${tutorName} was placed${daysAgo != null ? ` ${daysAgo} days ago` : ''}. ` +
    `Ask the parent${parentContact ? ` (${parentContact})` : ''} how it's going, then record the outcome:`;

  const rows = [];
  if (parentContact) {
    const draft = await draftParentMessage('checkin', { assignment: { title }, tutorName });
    const waButton = buildWaMeButton(parentContact, draft, '📤 Ask parent via WhatsApp');
    if (waButton) rows.push([waButton]);
    else text += `\n\n📋 Open [WhatsApp](${waMeLink(parentContact)}) with ${parentContact} and paste:\n\n${draft}`;
  } else {
    text += `\n\n⚠️ No parent contact on this placement — reach out manually.`;
  }

  rows.push(...checkInButtonRows(placement._id));
  const opsRow = opsButtonRow(placement.assignmentId);
  if (opsRow) rows.push(opsRow);

  await notifyOwner(text, { inline_keyboard: rows }, { disableWebPagePreview: true });
}

// Drive the day-30 check-in cadence (Phase 5). Three steps, each bounded per tick:
//   1. First ping   — active placements 28d+ old, never pinged.
//   2. Re-ping once — pinged 3d+ ago with still no recorded outcome.
//   3. Give up      — re-pinged 3d+ ago and still silent: append a 'no_reply' checkIn so the
//                     placement leaves the due queue (no owner message — we've asked twice).
// The gate timestamp is written BEFORE the owner alert so a slow/failed send can't double-ping on
// the next tick (same discipline as nudgeSilentParents). checkInAction is the single source of
// truth for the thresholds; the queries mirror it.
async function runDay30CheckIns(now) {
  const dueCutoff = new Date(now.getTime() - CHECKIN_DUE_MS);
  const repingCutoff = new Date(now.getTime() - CHECKIN_REPING_MS);
  let budget = MAX_CHECKIN_PER_TICK;

  // 1. First pings.
  const firstDue = await Placement.find({
    status: 'active',
    filledAt: { $lte: dueCutoff },
    checkInRequestedAt: { $exists: false },
    checkIns: { $size: 0 },
  }).limit(budget);
  for (const p of firstDue) {
    if (checkInAction(p, now) !== 'ping') continue;
    try {
      await Placement.updateOne({ _id: p._id }, { $set: { checkInRequestedAt: now } });
      await alertOwnerCheckIn(p, 'due');
      budget--;
      console.log(`Day-30 check-in ping for placement ${p._id}`);
    } catch (err) {
      console.error(`Check-in ping failed for placement ${p._id}:`, err.message);
    }
  }

  // 2. Re-pings, within the remaining ping budget.
  if (budget > 0) {
    const repingDue = await Placement.find({
      status: 'active',
      checkInRequestedAt: { $lte: repingCutoff },
      checkInRepingedAt: { $exists: false },
      checkIns: { $size: 0 },
    }).limit(budget);
    for (const p of repingDue) {
      if (checkInAction(p, now) !== 'reping') continue;
      try {
        await Placement.updateOne({ _id: p._id }, { $set: { checkInRepingedAt: now } });
        await alertOwnerCheckIn(p, 'reping');
        console.log(`Day-30 check-in re-ping for placement ${p._id}`);
      } catch (err) {
        console.error(`Check-in re-ping failed for placement ${p._id}:`, err.message);
      }
    }
  }

  // 3. Give up on the ones that never answered the re-ping. No owner message — just close the loop
  // so the queue stays clean. Bounded generously (cheap DB writes, no external calls).
  const giveUp = await Placement.find({
    status: 'active',
    checkInRepingedAt: { $lte: repingCutoff },
    checkIns: { $size: 0 },
  }).limit(20);
  for (const p of giveUp) {
    if (checkInAction(p, now) !== 'giveup') continue;
    try {
      await recordCheckInNoReply({ placementId: p._id });
      console.log(`Day-30 check-in gave up (no_reply) for placement ${p._id}`);
    } catch (err) {
      console.error(`Check-in give-up failed for placement ${p._id}:`, err.message);
    }
  }
}

// Re-render a closed assignment's channel post (status + closed notice) and swap the
// Apply button for a disabled "closed" one — same look as a manual close. Raw Telegram
// API call (no bot library needed here), matching the notifyOwner pattern.
async function updateChannelPostToClosed(assignment) {
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
        text: formatAssignmentForChannel(assignment), // assignment.status is already 'Closed'
        parse_mode: 'Markdown',
        reply_markup: { inline_keyboard: [[{ text: '🔒 Assignment Closed', callback_data: 'assignment_closed' }]] }
      })
    });
  } catch (err) {
    console.warn(`Auto-close: channel edit failed for ${assignment._id}:`, err.message);
  }
}

// Close assignments left Open past AUTO_CLOSE_DAYS, updating their channel posts so tutors
// stop asking about progress. Bounded per tick so one run can't hang the function.
async function closeStaleAssignments(now) {
  const cutoff = new Date(now.getTime() - AUTO_CLOSE_DAYS * 24 * 60 * 60 * 1000);
  const stale = await Assignment.find({ status: 'Open', createdAt: { $lte: cutoff } })
    .limit(MAX_CLOSE_PER_TICK);
  for (const assignment of stale) {
    // Atomic update: a legacy `subject` outside the current enum would otherwise trip
    // schema validation (and the level/subject pre-save hook) even though we only touch
    // status. updateOne skips both, so stale legacy assignments still close cleanly.
    await Assignment.updateOne(
      { _id: assignment._id },
      { $set: { status: 'Closed', updatedAt: new Date() } }
    );
    assignment.status = 'Closed';
    await updateChannelPostToClosed(assignment);
    console.log(`Auto-closed assignment ${assignment._id} (Open > ${AUTO_CLOSE_DAYS}d)`);
  }
  if (stale.length > 0) {
    await notifyOwner(`🔒 *Auto-closed ${stale.length} assignment(s)* open longer than ${AUTO_CLOSE_DAYS} days.`);
  }
}

// Pinged on a schedule by the always-on WhatsApp service (the bot itself can't run
// timers on Vercel). Finds assignments due for their next outreach wave and fires it,
// and closes assignments that have been Open too long.
export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
    const apiKey = process.env.WHATSAPP_API_KEY;
    if (apiKey && req.headers['x-api-key'] !== apiKey) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await connectToDatabase();
    const now = new Date();
    const dueBefore = new Date(now.getTime() - WAVE_INTERVAL_MS);

    // Atomically claim due assignments — set lastWaveAt=now so a concurrent or next
    // tick can't grab the same one and double-send.
    const claimed = [];
    for (let i = 0; i < MAX_PER_TICK; i++) {
      const assignment = await Assignment.findOneAndUpdate(
        {
          status: 'Open',
          'outreach.status': 'Active',
          'outreach.lastWaveAt': { $lte: dueBefore }
        },
        { $set: { 'outreach.lastWaveAt': now } },
        { new: true, sort: { 'outreach.lastWaveAt': 1 } }
      );
      if (!assignment) break;
      claimed.push(assignment);
    }

    // Background maintenance runs every tick (even when no wave is due): escalate any
    // claimed assignments, then auto-close stale ones. Slow work goes after the response.
    waitUntil((async () => {
      for (const assignment of claimed) {
        try {
          await processAssignment(assignment, now);
        } catch (err) {
          console.error(`Escalation failed for ${assignment._id}:`, err.message);
        }
      }
      // Release any hold windows that have elapsed (re-rank interested → shortlist). Runs
      // every tick regardless of whether a wave was due, since Holding assignments are
      // never claimed above (claim query is Active-only, by design — no new waves while holding).
      try {
        await releaseHoldingShortlists(now);
      } catch (err) {
        console.error('Shortlist release failed:', err.message);
      }
      // Follow up on parents who've gone silent on a shortlist (24h nudge, 48h flag).
      try {
        await nudgeSilentParents(now);
      } catch (err) {
        console.error('Parent silence follow-up failed:', err.message);
      }
      // Day-30 check-ins on placements: ping the owner, re-ping once, then give up (Phase 5).
      try {
        await runDay30CheckIns(now);
      } catch (err) {
        console.error('Day-30 check-in run failed:', err.message);
      }
      try {
        await closeStaleAssignments(now);
      } catch (err) {
        console.error('Auto-close failed:', err.message);
      }
      // Recompute the materialized tutor.stats cache — self-guarded to run at most once per day
      // (Phase 7). Best-effort: it logs and swallows its own errors, so it can't break the tick.
      try {
        await runTutorStatsMaterialization(now);
      } catch (err) {
        console.error('Tutor-stats materialization failed:', err.message);
      }
    })());

    return res.status(200).json({ processed: claimed.length });
  } catch (err) {
    console.error('escalation-tick error:', err);
    return res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
}
