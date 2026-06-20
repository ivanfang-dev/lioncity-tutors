import mongoose from 'mongoose';
import { waitUntil } from '@vercel/functions';
import { Assignment } from '../../../packages/shared/server-exports.js';
import { escalateAssignment } from '../utils/tutorNotifier.js';
import { notifyOwner } from '../utils/ownerAlert.js';

// Give the background sends (which run after the response) room to finish.
export const maxDuration = 60;

const WAVE_INTERVAL_MS = Number(process.env.OUTREACH_WAVE_INTERVAL_MS) || 60 * 30 * 1000; // 30mins
const WAVE_SIZE = Number(process.env.OUTREACH_WAVE_SIZE) || 6;
const MAX_DURATION_MS = Number(process.env.OUTREACH_MAX_DURATION_MS) || 4 * 60 * 60 * 1000; // 4h
const INTERESTED_TARGET = Number(process.env.OUTREACH_INTERESTED_TARGET) || 3;
// Assignments handled per tick. Kept at 1 so each tick's send load stays within the
// same time budget as the proven wave-1 path; the WhatsApp service ticks frequently,
// so a backlog drains quickly. Raise if assignment volume grows.
const MAX_PER_TICK = Number(process.env.OUTREACH_MAX_PER_TICK) || 1;
const BOT_USERNAME = process.env.BOT_USERNAME;

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
    assignment.outreach.status = 'Fulfilled';
    await assignment.save();
    return;
  }

  // Past the time cap with too few replies → stop and ask the owner to step in.
  const startedAt = assignment.outreach?.startedAt;
  if (startedAt && (now - new Date(startedAt)) >= MAX_DURATION_MS) {
    assignment.outreach.status = 'Exhausted';
    await assignment.save();
    await notifyOwner(
      `⏰ *Outreach timed out*\n*${assignment.title}* got ${assignment.interestedCount()} interested tutor(s) ` +
      `in ${Math.round(MAX_DURATION_MS / 3600000)}h.\nPlease follow up manually.`
    );
    return;
  }

  const result = await escalateAssignment(assignment, BOT_USERNAME, { waveSize: WAVE_SIZE });

  if (result.exhausted) {
    await Assignment.updateOne({ _id: assignment._id }, { $set: { 'outreach.status': 'Exhausted' } });
    await notifyOwner(
      `📭 *Ran out of tutors*\n*${assignment.title}* has no more matching tutors to contact ` +
      `(${assignment.interestedCount()} interested).\nPlease follow up manually.`
    );
  } else {
    console.log(`Escalation wave ${result.wave} for ${assignment._id}: ${result.sent} sent, ${result.failed} failed`);
  }
}

// Pinged on a schedule by the always-on WhatsApp service (the bot itself can't run
// timers on Vercel). Finds assignments due for their next outreach wave and fires it.
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

    if (claimed.length === 0) {
      return res.status(200).json({ processed: 0 });
    }

    // Ranking + sending is slow; run it after the response (same pattern as wave 1).
    waitUntil((async () => {
      for (const assignment of claimed) {
        try {
          await processAssignment(assignment, now);
        } catch (err) {
          console.error(`Escalation failed for ${assignment._id}:`, err.message);
        }
      }
    })());

    return res.status(200).json({ processed: claimed.length });
  } catch (err) {
    console.error('escalation-tick error:', err);
    return res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
}
