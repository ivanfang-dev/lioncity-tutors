import mongoose from 'mongoose';
import { waitUntil } from '@vercel/functions';
import { recordParentPick, recordParentReject, resumeOutreach, REJECT_REASONS } from '../utils/parentOutcome.js';
import { notifyOwner } from '../utils/ownerAlert.js';
import { escapeMd } from '../utils/markdown.js';

// Lets the ops console record a parent outcome through the SAME recorder the Telegram buttons use
// (utils/parentOutcome.js) — the console never writes outreach state itself, so the two surfaces
// can't drift. Authed with the existing x-api-key shared secret, like escalation-tick.
//
// POST { outcome: 'pick', assignmentId, tutorId }
//      { outcome: 'reject', assignmentId, reason: 'rate'|'profiles'|'timing'|'other' }
//      { outcome: 'noreply', assignmentId }

// A rejection fires a fresh outreach wave after the response — give it room to finish.
export const maxDuration = 60;

const BOT_USERNAME = process.env.BOT_USERNAME;

let isConnected = false;
async function connectToDatabase() {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGODB_URI, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  });
  isConnected = true;
}

// Map the recorder's error codes to HTTP: a bad id/reason is the caller's fault, a missing
// assignment is a 404. Anything else surfaces as a 500 from the try/catch below.
const ERROR_STATUS = {
  invalid_id: 400,
  invalid_reason: 400,
  tutor_not_a_candidate: 409,
  assignment_not_found: 404,
};

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const apiKey = process.env.WHATSAPP_API_KEY;
    if (apiKey && req.headers['x-api-key'] !== apiKey) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { outcome, assignmentId, tutorId, reason } = req.body || {};
    await connectToDatabase();

    if (outcome === 'pick') {
      const result = await recordParentPick({ assignmentId, tutorId });
      if (!result.ok) return res.status(ERROR_STATUS[result.error] || 500).json({ error: result.error });
      return res.status(200).json({ ok: true, status: 'Filled', tutorName: result.tutorName });
    }

    if (outcome === 'reject') {
      const result = await recordParentReject({ assignmentId, reason });
      if (!result.ok) {
        return res.status(ERROR_STATUS[result.error] || 500).json({
          error: result.error,
          ...(result.error === 'invalid_reason' && { allowed: REJECT_REASONS }),
        });
      }
      // The wave is slow; respond first and send it in the background, exactly like the Telegram
      // path. The owner is watching the console, so progress goes to Telegram as usual.
      waitUntil((async () => {
        try {
          const wave = await resumeOutreach(result.assignment, { botUsername: BOT_USERNAME });
          await notifyOwner(wave.exhausted
            ? `📭 *No fresh matching tutors left* for *${escapeMd(result.assignment.title)}* — you've contacted everyone in the pool. You'll need to follow up manually.`
            : `🔄 *Resuming outreach* for *${escapeMd(result.assignment.title)}* — reason logged: _${reason}_. Messaging more tutors.`);
        } catch (err) {
          console.error('parent-outcome: resume outreach failed:', err.message);
          await notifyOwner(`❌ Couldn't resume outreach for *${escapeMd(result.assignment.title)}* — please retry from Telegram.`);
        }
      })());
      return res.status(200).json({ ok: true, status: 'Open', rejectedCount: result.rejectedCount });
    }

    // No state change by design — the tick's 24h/48h silence follow-up owns the reminders. The
    // console still offers the button so the owner can dismiss a row the same way as in Telegram.
    if (outcome === 'noreply') return res.status(200).json({ ok: true, noted: true });

    return res.status(400).json({ error: 'unknown_outcome' });
  } catch (err) {
    console.error('parent-outcome error:', err);
    return res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
}
