import mongoose from 'mongoose';
import { waitUntil } from '@vercel/functions';
import { applyRecovery } from '../utils/recovery.js';
import { resumeOutreach } from '../utils/parentOutcome.js';

// Console v2 recovery (roadmap deferred item): the ops console's one-tap "widen / raise ceiling /
// relax type & retry" on a stalled assignment posts here. Applies the change + resets outreach, then
// fires a fresh wave in the background against the new criteria — the same escalateAssignment path
// the tick uses, so the retry can't drift from normal outreach.
//
// POST /api/recover  { assignmentId, action: 'widen_region'|'raise_ceiling'|'relax_type', amount? }
//   → { ok, summary }

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const apiKey = process.env.WHATSAPP_API_KEY;
    if (apiKey && req.headers['x-api-key'] !== apiKey) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { assignmentId, action, amount } = req.body || {};
    if (!mongoose.isValidObjectId(assignmentId)) return res.status(400).json({ error: 'invalid_id' });

    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI, {
        maxPoolSize: 10, serverSelectionTimeoutMS: 5000, socketTimeoutMS: 45000,
      });
    }

    const result = await applyRecovery({ assignmentId, action, amount });
    if (!result.ok) {
      const status = result.error === 'assignment_not_found' ? 404 : 400;
      return res.status(status).json({ error: result.error });
    }

    // Fire the retry wave after responding (speed is the differentiator), best-effort.
    waitUntil(
      resumeOutreach(result.assignment, { botUsername: process.env.BOT_USERNAME })
        .catch(err => console.error('recovery retry wave failed:', err.message))
    );

    return res.status(200).json({ ok: true, summary: result.summary });
  } catch (err) {
    console.error('recover error:', err);
    return res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
}
