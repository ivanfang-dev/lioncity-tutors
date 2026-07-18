import { Assignment } from '../../../packages/shared/server-exports.js';

// Exposure caps (roadmap Phase 10, step 4). A tutor already sitting on several unresolved offers is
// the worst candidate for one more — they're likely about to take a placement, and piling on
// spreads them thin and wastes sends. So a tutor with too many open offers is held out of NEW waves
// (not the shortlist re-rank — those tutors already replied) until some of theirs resolve.

// An offer is "unresolved" while its outreach contact is Sent (awaiting reply) or Interested (said
// yes, not yet placed/rejected), on an assignment that's still Open.
const OPEN_OFFER_STATUSES = new Set(['Sent', 'Interested']);
const EXPOSURE_CAP = Number(process.env.OUTREACH_EXPOSURE_CAP) || 2;

// Pure: count each tutor's unresolved offers across the given (Open) assignments.
// Returns Map<tutorIdString, count>. Exported for unit testing the open-offers count.
export function openOffersByTutor(openAssignments) {
  const counts = new Map();
  for (const a of openAssignments || []) {
    for (const c of a.outreach?.contacts || []) {
      if (!c.tutorId || !OPEN_OFFER_STATUSES.has(c.status)) continue;
      const id = String(c.tutorId);
      counts.set(id, (counts.get(id) || 0) + 1);
    }
  }
  return counts;
}

// Pure: the set of tutor-id strings AT OR OVER the cap — the ones to exclude from new waves.
export function cappedTutorIds(openAssignments, cap = EXPOSURE_CAP) {
  const capped = new Set();
  for (const [id, n] of openOffersByTutor(openAssignments)) {
    if (n >= cap) capped.add(id);
  }
  return capped;
}

// Load the capped set from currently-Open assignments (contacts only — a cheap projection; the
// system's Open set is small). Computed once per tick and reused. `model` injectable for tests.
export async function loadCappedTutorIds({ model = Assignment, cap = EXPOSURE_CAP } = {}) {
  const open = await model.find({ status: 'Open', 'outreach.contacts.0': { $exists: true } })
    .select('outreach.contacts.tutorId outreach.contacts.status')
    .lean();
  return cappedTutorIds(open, cap);
}

export { EXPOSURE_CAP };
