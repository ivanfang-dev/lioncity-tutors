import { searchTutors } from '../utils/tutorMatcher.js';
import { connectToDatabase } from '../utils/db.js';

// Ops console "Find tutors": the outreach matcher's ranked pool for hand-typed criteria, so the
// owner can message tutors directly. Read-only — nothing is sent, no assignment needed.
//
// GET /api/find-tutors?level=&subject=&location=&rate=&minExperience=  →  { results, unmappable }

export default async function handler(req, res) {
  try {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

    const apiKey = process.env.WHATSAPP_API_KEY;
    if (apiKey && req.headers['x-api-key'] !== apiKey) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { level, subject, location, rate, minExperience } = req.query;
    if (!level || !subject || !location) return res.status(400).json({ error: 'level_subject_location_required' });

    await connectToDatabase();

    const { results, unmappable } = await searchTutors({ level, subject, location, rate, minExperience });
    return res.status(200).json({ results, unmappable });
  } catch (err) {
    console.error('find-tutors error:', err);
    return res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
}
