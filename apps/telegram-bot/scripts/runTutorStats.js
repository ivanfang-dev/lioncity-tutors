// Run the tutor.stats materialization immediately (bypassing the once-per-day tick guard) and print
// a summary — for verifying Phase 7 step 2 without waiting a day for the tick. Pass a tutorId to also
// print that tutor's freshly-computed stats row.
//
//   node --env-file=.env scripts/runTutorStats.js [tutorId]

import mongoose from 'mongoose';
import { Tutor } from '../../../packages/shared/server-exports.js';
import { materializeTutorStats } from '../utils/materializeTutorStats.js';

if (!process.env.MONGODB_URI) {
  console.error('MONGODB_URI not set. Run with --env-file=.env or MONGODB_URI=... prefix.');
  process.exit(1);
}

await mongoose.connect(process.env.MONGODB_URI);

const { tutorCount, updated } = await materializeTutorStats(new Date());
console.log(`\n✅ Recomputed stats across ${tutorCount} tutor(s); ${updated} updated.\n`);

const tutorId = process.argv[2];
if (tutorId && mongoose.isValidObjectId(tutorId)) {
  const t = await Tutor.findById(tutorId).select('fullName stats').lean();
  if (t) {
    console.log(`  ${t.fullName || tutorId}:`);
    console.log(`   ${JSON.stringify(t.stats, null, 2)}\n`);
  } else {
    console.log(`  No tutor found with id ${tutorId}.\n`);
  }
}

await mongoose.disconnect();
process.exit(0);
