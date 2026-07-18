import mongoose from 'mongoose';
import { recordCheckInWell, recordCheckInEnded, recordCheckInEndReason, recordCheckInNoReply } from '../utils/checkInOutcome.js';

// Lets the ops console record a day-30 check-in outcome through the SAME recorder the Telegram
// buttons use (utils/checkInOutcome.js) — the console never writes Placement state itself, so the
// two surfaces can't drift. Authed with the existing x-api-key shared secret, like parent-outcome.
//
// POST { outcome: 'well',    placementId, rating? }         → going well (+ optional 1–5 rating)
//      { outcome: 'ended',   placementId, endReason? }      → ended (+ optional verbatim reason,
//                                                              recorded in one shot for the console)
//      { outcome: 'noreply', placementId }                  → owner marks it no-reply

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

// Map recorder error codes to HTTP: a bad id/rating is the caller's fault, a missing placement 404.
const ERROR_STATUS = {
  invalid_id: 400,
  invalid_rating: 400,
  empty_reason: 400,
  placement_not_found: 404,
};

function fail(res, error) {
  return res.status(ERROR_STATUS[error] || 500).json({ error });
}

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const apiKey = process.env.WHATSAPP_API_KEY;
    if (apiKey && req.headers['x-api-key'] !== apiKey) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { outcome, placementId, rating, endReason } = req.body || {};
    await connectToDatabase();

    if (outcome === 'well') {
      const result = await recordCheckInWell({ placementId, rating: rating ?? null });
      if (!result.ok) return fail(res, result.error);
      return res.status(200).json({ ok: true, status: 'active', survived30d: true });
    }

    if (outcome === 'ended') {
      const result = await recordCheckInEnded({ placementId });
      if (!result.ok) return fail(res, result.error);
      // The console captures the reason in the same submit, so attach it now (best-effort — the
      // ended outcome is already saved). A blank/absent reason just skips this.
      if (endReason && String(endReason).trim() && result.checkInId) {
        await recordCheckInEndReason({ placementId, checkInId: result.checkInId, reason: endReason });
      }
      return res.status(200).json({ ok: true, status: 'ended', survived30d: false });
    }

    if (outcome === 'noreply') {
      const result = await recordCheckInNoReply({ placementId });
      if (!result.ok) return fail(res, result.error);
      return res.status(200).json({ ok: true, status: 'no_reply' });
    }

    return res.status(400).json({ error: 'invalid_outcome', allowed: ['well', 'ended', 'noreply'] });
  } catch (err) {
    console.error('checkin-outcome error:', err);
    return res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
}
