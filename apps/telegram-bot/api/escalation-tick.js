import mongoose from 'mongoose';
import { waitUntil } from '@vercel/functions';
import { Assignment, Tutor } from '../../../packages/shared/server-exports.js';
import { escalateAssignment, remindNonResponders } from '../utils/tutorNotifier.js';
import { shortlistScore, shortlistReason } from '../utils/tutorMatcher.js';
import { holdTransition } from '../utils/recordTutorReply.js';
import { notifyOwner } from '../utils/ownerAlert.js';
import { formatAssignmentForChannel } from '../utils/channelFormat.js';

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
      `in ${Math.round(MAX_DURATION_MS / 3600000)}h.\nPlease follow up manually.`
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
      `(${assignment.interestedCount()} interested).\nPlease follow up manually.`
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

  // Load just the fields shortlistScore + the owner alert need. Contacts store only tutorId.
  const tutorIds = viable.map(c => c.tutorId);
  const tutors = tutorIds.length
    ? await Tutor.find({ _id: { $in: tutorIds } })
        .select('fullName yearsOfExperience introduction teachingExperience trackRecord hourlyRate tutorType teachingLevels')
        .lean()
    : [];
  const tutorById = new Map(tutors.map(t => [t._id.toString(), t]));

  const ranked = viable
    .map(c => ({ contact: c, tutor: tutorById.get(c.tutorId.toString()) }))
    .filter(x => x.tutor)
    .map(x => ({ ...x, score: shortlistScore(x.tutor, assignment) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, SHORTLIST_SIZE);

  if (ranked.length === 0) {
    // Nothing left to shortlist (all rejected, or tutor docs vanished). Stop holding so it
    // doesn't loop, and let the owner know to handle it manually.
    await Assignment.updateOne({ _id: assignment._id }, { $set: { 'outreach.status': 'Fulfilled' } });
    await notifyOwner(
      `🎯 *Hold window closed* — *${assignment.title}*\n` +
      `No shortlist could be built (interested tutors are unavailable). Please follow up manually.`
    );
    return;
  }

  // Stamp shortlistRank 1..N on the winners AND fulfil in one atomic update. arrayFilters
  // address each winner by tutorId. Never .save(): a legacy subject/level would fail
  // re-validation, and a stale contact array could clobber a reply that landed mid-release.
  const set = { 'outreach.status': 'Fulfilled' };
  const arrayFilters = [];
  ranked.forEach((r, i) => {
    set[`outreach.contacts.$[c${i}].shortlistRank`] = i + 1;
    arrayFilters.push({ [`c${i}.tutorId`]: r.tutor._id });
  });
  await Assignment.updateOne({ _id: assignment._id }, { $set: set }, { arrayFilters });

  // Mirror the release into the in-memory doc so the owner alert (pendingParentTutorIds +
  // the rich card) sees the ranks and the Fulfilled status.
  assignment.outreach.status = 'Fulfilled';
  ranked.forEach((r, i) => {
    const c = assignment.outreach.contacts.find(cc => cc.tutorId?.toString() === r.tutor._id.toString());
    if (c) c.shortlistRank = i + 1;
  });

  await alertOwnerShortlistReady(assignment, ranked);
}

// Alert the owner that a ranked shortlist is ready to relay: a rich card with the top 3,
// a one-line "why" per tutor (experience/type + rate-vs-budget), and the one-tap "Send all"
// button. (Phase 2 upgrades this into the full drafted parent message.)
async function alertOwnerShortlistReady(assignment, ranked) {
  let replyMarkup;
  if (assignment.parentContact) {
    const pendingCount = assignment.pendingParentTutorIds().length;
    if (pendingCount > 0) {
      replyMarkup = {
        inline_keyboard: [[{
          text: pendingCount === 1 ? '📤 Send profile to parent' : `📤 Send all ${pendingCount} profiles to parent`,
          callback_data: `sendallprof_${assignment._id}`
        }]]
      };
    }
  }

  const medals = ['🥇', '🥈', '🥉'];
  const cards = ranked.map((r, i) => {
    const medal = medals[i] || `${i + 1}.`;
    return `${medal} *${r.tutor.fullName || 'Tutor'}*\n    ${shortlistReason(r.tutor, assignment)}`;
  });

  await notifyOwner(
    `🎯 *Shortlist ready* — *${assignment.title}*\n` +
    `Picked the best ${ranked.length} of ${assignment.viableInterestedCount()} interested tutor(s):\n\n` +
    cards.join('\n\n') +
    (assignment.parentContact
      ? `\n\nTap below to forward the ${ranked.length} profile(s) to the parent.`
      : `\n\n⚠️ No parent contact on this assignment — relay unavailable.`),
    replyMarkup
  );
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
      try {
        await closeStaleAssignments(now);
      } catch (err) {
        console.error('Auto-close failed:', err.message);
      }
    })());

    return res.status(200).json({ processed: claimed.length });
  } catch (err) {
    console.error('escalation-tick error:', err);
    return res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
}
