import { dbConnect } from '@/lib/mongoose';
import { Assignment, Tutor } from '@lioncity/shared/server-exports.js';

// Reads for the console. Straight to Mongo (via the shared models) rather than through the bot:
// these are pure reads with no state transitions, so there's nothing to keep in sync — unlike the
// writes, which all go through the bot's recorder (see botApi.js).
//
// Everything here is `.lean()`: the console never saves an Assignment (legacy docs carry
// subject/level values outside the current enums and re-validate on save), and plain objects are
// what the queue's pure derivation and the client components expect.

// The assignments the console cares about: live work, plus the ones that already broke.
// 'Filled'/'Closed' are outcomes, not work — they'd bloat the board without offering a decision.
const ACTIVE_QUERY = {
  $or: [
    { status: 'Open' },
    { status: 'In Progress' },
    { 'outreach.status': 'Exhausted' }, // survives even if auto-close flipped status to Closed
  ],
};

// Bounded: this is a single-operator console for an agency running a handful of assignments at a
// time. If the board ever grows past this, it needs paging, not a bigger number.
const MAX_ASSIGNMENTS = 100;

const BOARD_FIELDS = 'title level subject location rate status parentContact createdAt outreach matchedTutorId filledAt';

export async function loadActiveAssignments() {
  await dbConnect();
  return Assignment.find(ACTIVE_QUERY)
    .select(BOARD_FIELDS)
    .sort({ createdAt: -1 })
    .limit(MAX_ASSIGNMENTS)
    .lean();
}

export async function loadAssignment(assignmentId) {
  await dbConnect();
  // A malformed id from a hand-typed URL would otherwise throw a CastError into the page.
  if (!/^[0-9a-fA-F]{24}$/.test(assignmentId || '')) return null;
  return Assignment.findById(assignmentId).lean();
}

// The tutors behind a set of contacts, keyed by id. Contacts store only tutorId and a cached name,
// so the drill-down's candidate breakdown needs the profiles themselves. Only the fields the score
// actually weighs — the console has no business rendering a tutor's full record.
export async function loadTutorsByIds(tutorIds) {
  await dbConnect();
  const ids = tutorIds.filter(Boolean);
  if (ids.length === 0) return new Map();
  const tutors = await Tutor.find({ _id: { $in: ids } })
    .select('fullName tutorType yearsOfExperience hourlyRate responseStats contactNumber telegramId')
    .lean();
  return new Map(tutors.map(t => [t._id.toString(), t]));
}

// Mongo ObjectIds and Dates can't cross the server/client boundary as-is, and the queue rows are
// handed to client components (the outcome buttons). Flatten to strings/numbers at the edge.
export function serializeAssignment(assignment) {
  return JSON.parse(JSON.stringify(assignment));
}
