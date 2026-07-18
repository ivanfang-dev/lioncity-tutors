import mongoose from 'mongoose';
import { Assignment } from '../../../packages/shared/server-exports.js';
import { findMatchingTutorsWithStats } from '../utils/tutorMatcher.js';

// Explains why an assignment's matching pool is thin: the per-filter attrition funnel behind the
// ops console's "pool smaller than wave" diagnosis. Read-only.
//
// Lives on the bot (not the website) so the funnel is computed by the same code and deployment
// that runs outreach — a diagnosis derived from a second copy of the filters would eventually lie.
// On-demand only: it costs one countDocuments per filter, so the console asks for one assignment
// at a time rather than the whole board.
//
// GET /api/match-stats?assignmentId=<id>  →  { stats }
//
// `stats.matched` is the honest pool size. Don't report the returned tutors' length instead: that's
// sliced to `poolSize` (40), an outreach implementation detail, so a pool of 60 would read as 40.

export default async function handler(req, res) {
  try {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

    const apiKey = process.env.WHATSAPP_API_KEY;
    if (apiKey && req.headers['x-api-key'] !== apiKey) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { assignmentId } = req.query;
    if (!mongoose.isValidObjectId(assignmentId)) return res.status(400).json({ error: 'invalid_id' });

    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI, {
        maxPoolSize: 10, serverSelectionTimeoutMS: 5000, socketTimeoutMS: 45000,
      });
    }

    const assignment = await Assignment.findById(assignmentId).lean();
    if (!assignment) return res.status(404).json({ error: 'assignment_not_found' });

    const { stats } = await findMatchingTutorsWithStats(assignment, 40);
    return res.status(200).json({ stats });
  } catch (err) {
    console.error('match-stats error:', err);
    return res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
}
