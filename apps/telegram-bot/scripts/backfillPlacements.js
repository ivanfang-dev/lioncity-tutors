// One-off backfill: create a Placement row for every historical assignment that has a
// matchedTutorId but no Placement yet (roadmap Phase 5). These predate the Phase 2 pick flow that
// writes placements at pick time, so they have no ground-truth match record. Backfilled rows are
// created with status 'unknown' and NO check-in — they're too stale to ping a parent about, and the
// day-30 tick only ever pings status 'active' placements, so these will never generate an owner ping.
//
// Safe by default: runs as a DRY RUN and only prints what it WOULD create. Add --apply to write.
// (--dry-run is accepted explicitly too, and is the default either way.)
//
//   node --env-file=.env scripts/backfillPlacements.js            # preview (dry run)
//   node --env-file=.env scripts/backfillPlacements.js --apply    # actually write
//
// Idempotent: the Placement upsert is keyed on (assignmentId, tutorId) and uses $setOnInsert, so a
// re-run never touches an existing row (a real Phase 2 placement, or a prior backfill).

import mongoose from 'mongoose';
import { Assignment, Tutor, Placement } from '../../../packages/shared/server-exports.js';
import { getLevelCategory } from '../utils/tutorMatcher.js';

const APPLY = process.argv.includes('--apply');

if (!process.env.MONGODB_URI) {
  console.error('MONGODB_URI not set. Run with --env-file=.env or MONGODB_URI=... prefix.');
  process.exit(1);
}

await mongoose.connect(process.env.MONGODB_URI);

// Every assignment that reached a placement: matchedTutorId is set the moment a parent picks (or on
// a manual mark-filled). Status isn't required to be 'Filled' — legacy flows may have left it Open.
const assignments = await Assignment.find({ matchedTutorId: { $exists: true, $ne: null } })
  .select('title level rate parentContact matchedTutorId filledAt createdAt')
  .lean();

console.log(`\nFound ${assignments.length} assignment(s) with a matchedTutorId.`);

// Which of those already have a Placement (Phase 2 rows, or a prior backfill) — skip them.
const existing = await Placement.find({
  assignmentId: { $in: assignments.map(a => a._id) },
}).select('assignmentId tutorId').lean();
const existingKeys = new Set(existing.map(p => `${p.assignmentId}_${p.tutorId}`));

// Resolve the placed tutors' rates in one query so agreedRate mirrors what Phase 2 would have stored
// (the tutor's asking rate for the level, else the assignment's posted rate).
const tutorIds = [...new Set(assignments.map(a => String(a.matchedTutorId)))];
const tutors = await Tutor.find({ _id: { $in: tutorIds } }).select('hourlyRate').lean();
const tutorById = new Map(tutors.map(t => [String(t._id), t]));

const toCreate = [];
let skipped = 0;
for (const a of assignments) {
  const key = `${a._id}_${a.matchedTutorId}`;
  if (existingKeys.has(key)) { skipped++; continue; }
  const tutor = tutorById.get(String(a.matchedTutorId));
  const agreedRate = tutor?.hourlyRate?.[getLevelCategory(a.level)]
    || tutor?.hourlyRate?.secondary || a.rate || null;
  toCreate.push({
    assignmentId: a._id,
    tutorId: a.matchedTutorId,
    parentContact: a.parentContact || undefined,
    filledAt: a.filledAt || a.createdAt || new Date(),
    agreedRate,
    status: 'unknown', // backfilled: no ground truth on whether tuition survived
    title: a.title,     // for the preview only
  });
}

console.log(`  ${skipped} already have a Placement (skipped).`);
console.log(`  ${toCreate.length} to create.\n`);

for (const p of toCreate) {
  console.log(`  • ${p.title || '(untitled)'}  tutor ${p.tutorId}  filled ${new Date(p.filledAt).toISOString().slice(0, 10)}  rate ${p.agreedRate || '—'}`);
}

if (!APPLY) {
  console.log(`\nDRY RUN — nothing written. Re-run with --apply to create ${toCreate.length} Placement(s).\n`);
  await mongoose.disconnect();
  process.exit(0);
}

let created = 0;
for (const p of toCreate) {
  const { title, ...doc } = p; // title is preview-only, not a Placement field
  const res = await Placement.updateOne(
    { assignmentId: doc.assignmentId, tutorId: doc.tutorId },
    { $setOnInsert: doc },
    { upsert: true }
  );
  if (res.upsertedCount > 0) created++;
}

console.log(`\n✅ Created ${created} Placement(s) (status 'unknown', no check-in).\n`);
await mongoose.disconnect();
process.exit(0);
