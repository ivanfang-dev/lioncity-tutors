import mongoose from 'mongoose';
import { waitUntil } from '@vercel/functions';
import { Assignment } from '../../../packages/shared/server-exports.js';
import { escalateAssignment, remindNonResponders } from '../utils/tutorNotifier.js';
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
  // Already satisfied — the reply endpoint normally sets this, but guard anyway.
  if (assignment.interestedCount() >= INTERESTED_TARGET) {
    // Atomic update (see closeStaleAssignments): avoids re-validating a legacy subject.
    await Assignment.updateOne(
      { _id: assignment._id },
      { $set: { 'outreach.status': 'Fulfilled' } }
    );
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
