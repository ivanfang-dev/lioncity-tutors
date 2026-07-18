import { rateGuide } from '../utils/tutorMatcher.js';
import mongoose from 'mongoose';

// The typical asking rate for a level (roadmap Phase 8) — the read-only guidance shown beside the
// website request form's budget field. Aggregate only (p25/p50/p75 of tutor floors): no tutor
// identities, no PII, so it's safe to surface to a parent-facing page (via the website's own proxy
// route, which keeps this endpoint's shared key server-side).
//
// Lives on the bot, like match-stats, so the percentiles are computed by the same matching code
// that runs outreach — a second copy in the website would eventually disagree with reality.
//
// GET /api/rate-guide?level=<str>&location=<str>&type=<Part-time|Full-time|MOE/Ex-MOE>
//   → { typical: { p25, p50, p75 } | null, sampleSize, levelCategory }
// Returns 200 with typical:null when the level is unrecognized or no tutor has stated a rate — the
// caller simply shows no hint. Informational only; never gates anything.

export default async function handler(req, res) {
  try {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

    const apiKey = process.env.WHATSAPP_API_KEY;
    if (apiKey && req.headers['x-api-key'] !== apiKey) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { level, location, type } = req.query;
    if (!level) return res.status(400).json({ error: 'level_required' });

    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI, {
        maxPoolSize: 10, serverSelectionTimeoutMS: 5000, socketTimeoutMS: 45000,
      });
    }

    const guide = await rateGuide({ level, location, type });
    if (!guide.ok) return res.status(200).json({ typical: null, sampleSize: 0 });
    return res.status(200).json({
      typical: guide.typical,
      sampleSize: guide.sampleSize,
      levelCategory: guide.levelCategory,
    });
  } catch (err) {
    console.error('rate-guide error:', err);
    return res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
}
