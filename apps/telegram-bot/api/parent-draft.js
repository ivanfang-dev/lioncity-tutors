import mongoose from 'mongoose';
import { Assignment, Tutor } from '../../../packages/shared/server-exports.js';
import { shortlistedContacts } from '../../../packages/shared/utils/outreachState.js';
import { draftParentMessage, buildWaMeButton, waMeLink } from '../utils/parentMessage.js';

// Drafts a parent-facing message for the ops console and returns it as a ready-to-open wa.me deep
// link. Reuses draftParentMessage — the same transport seam the Telegram alerts use — so the owner
// sends identical text whichever surface they act from, and a future switch to Cloud API templates
// still touches only parentMessage.js.
//
// Parents are never messaged from here (roadmap Repo facts): this returns a link the OWNER taps to
// open WhatsApp with the draft pre-filled. The bot owns timing and drafting; the owner is the
// transport.
//
// GET /api/parent-draft?assignmentId=<id>&kind=shortlist|nudge|expectation|checkin
//   → { text, waMeUrl, parentContact }   (waMeUrl null when the draft is too long for a URL)

// Gemini drafting is the slow part; give it room.
export const maxDuration = 30;

const KINDS = ['shortlist', 'nudge', 'expectation', 'checkin'];

export default async function handler(req, res) {
  try {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

    const apiKey = process.env.WHATSAPP_API_KEY;
    if (apiKey && req.headers['x-api-key'] !== apiKey) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { assignmentId, kind = 'shortlist' } = req.query;
    if (!mongoose.isValidObjectId(assignmentId)) return res.status(400).json({ error: 'invalid_id' });
    if (!KINDS.includes(kind)) return res.status(400).json({ error: 'invalid_kind', allowed: KINDS });

    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI, {
        maxPoolSize: 10, serverSelectionTimeoutMS: 5000, socketTimeoutMS: 45000,
      });
    }

    const assignment = await Assignment.findById(assignmentId).lean();
    if (!assignment) return res.status(404).json({ error: 'assignment_not_found' });
    if (!assignment.parentContact) return res.status(409).json({ error: 'no_parent_contact' });

    // The shortlist draft describes specific tutors, so it needs their profiles; contacts store
    // only tutorId. Ordered by rank so the parent's "tutor 2" matches the console's "#2".
    let tutors = [];
    let tutorName = null;
    if (kind === 'shortlist') {
      const ranked = shortlistedContacts(assignment);
      const docs = ranked.length
        ? await Tutor.find({ _id: { $in: ranked.map(c => c.tutorId) } })
            .select('fullName yearsOfExperience introduction teachingExperience trackRecord hourlyRate tutorType')
            .lean()
        : [];
      const byId = new Map(docs.map(t => [t._id.toString(), t]));
      tutors = ranked.map(c => byId.get(c.tutorId?.toString())).filter(Boolean);
      if (tutors.length === 0) return res.status(409).json({ error: 'no_shortlist' });
    } else if (kind === 'checkin') {
      // The day-30 check-in names the placed tutor. It's the assignment's matched tutor (set on the
      // parent's pick, and the backfill criterion), so no placement lookup is needed here.
      if (assignment.matchedTutorId) {
        const t = await Tutor.findById(assignment.matchedTutorId).select('fullName').lean();
        tutorName = t?.fullName || null;
      }
    }

    const text = await draftParentMessage(kind, { assignment, tutors, tutorName });
    const button = buildWaMeButton(assignment.parentContact, text);

    return res.status(200).json({
      text,
      // null when the encoded draft exceeds what a deep link can carry — the caller then shows the
      // text to copy alongside a bare chat link.
      waMeUrl: button?.url || null,
      chatUrl: waMeLink(assignment.parentContact),
      parentContact: assignment.parentContact,
    });
  } catch (err) {
    console.error('parent-draft error:', err);
    return res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
}
