import { searchTutors } from '../utils/tutorMatcher.js';
import { connectToDatabase } from '../utils/db.js';

// Ops console "Find tutors": the outreach matcher's ranked pool for hand-typed criteria, so the
// owner can message tutors directly. Read-only — nothing is sent, no assignment needed.
//
// GET /api/find-tutors?level=&subject=&location=&rate=&minExperience=&nearby=1&limit=  →  { results, total, unmappable }

export default async function handler(req, res) {
  try {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

    const apiKey = process.env.WHATSAPP_API_KEY;
    if (apiKey && req.headers['x-api-key'] !== apiKey) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { level, subject, location, rate, minExperience, nearby } = req.query;
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 15, 1), 300);
    if (!level || !subject || !location) return res.status(400).json({ error: 'level_subject_location_required' });

    await connectToDatabase();

    const { results, total, unmappable } = await searchTutors({
      level, subject, location, rate, minExperience, includeNearby: nearby === '1',
    }, { limit });
    return res.status(200).json({ results, total, unmappable });
  } catch (err) {
    console.error('find-tutors error:', err);
    return res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
}
