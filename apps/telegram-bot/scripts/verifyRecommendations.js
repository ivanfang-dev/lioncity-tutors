// Read-only inspector for the Recommendation decision log (roadmap Phase 6). Prints the latest
// recommendation docs for an assignment — one per decision (wave1 / escalation / shortlist) — with
// each candidate's rank, score, whether we contacted them, and the feature breakdown behind the
// score. Use it to confirm the three write points fire and record sane snapshots.
//
// Usage:  node --env-file=.env scripts/verifyRecommendations.js <assignmentId> [limit]
//    or:  MONGODB_URI=... node scripts/verifyRecommendations.js <assignmentId>

import mongoose from 'mongoose';
import { Recommendation } from '../../../packages/shared/server-exports.js';

const assignmentId = process.argv[2];
const limit = Number(process.argv[3]) || 10;

if (!assignmentId) {
  console.error('Usage: node --env-file=.env scripts/verifyRecommendations.js <assignmentId> [limit]');
  process.exit(1);
}
if (!process.env.MONGODB_URI) {
  console.error('MONGODB_URI not set. Run with --env-file=.env or MONGODB_URI=... prefix.');
  process.exit(1);
}
if (!mongoose.isValidObjectId(assignmentId)) {
  console.error(`"${assignmentId}" is not a valid assignment id.`);
  process.exit(1);
}

await mongoose.connect(process.env.MONGODB_URI);

const fmt = (d) => (d ? new Date(d).toISOString().replace('T', ' ').slice(0, 19) : '—');
const n = (v) => (v == null ? '—' : Number(v).toFixed(3));

const recs = await Recommendation.find({ assignmentId })
  .sort({ generatedAt: -1 })
  .limit(limit)
  .lean();

console.log('');
if (recs.length === 0) {
  console.log(`No recommendation docs found for assignment ${assignmentId}.`);
  await mongoose.disconnect();
  process.exit(0);
}

console.log(`📊 ${recs.length} recommendation doc(s) for ${assignmentId} (newest first):\n`);

for (const r of recs) {
  console.log(`── ${r.trigger}  ·  ${fmt(r.generatedAt)}  ·  policy ${r.policyVersion || '—'}  ·  ${r.candidates?.length || 0} candidate(s)`);
  const rows = (r.candidates || []).slice().sort((a, b) => (a.rank ?? 999) - (b.rank ?? 999));
  for (const c of rows) {
    const f = c.featureSnapshot || {};
    console.log(
      `   #${String(c.rank ?? '?').padStart(2)} ${c.contacted ? '📨' : '  '} tutor ${c.tutorId}  score ${n(c.score)}` +
      `   [exp ${f.experienceRank ?? '—'} · commit ${n(f.commitmentScore)} · budget ${n(f.budgetComfort)}` +
      ` · coverage ${n(f.coverageFactor)} · responsiveness ${n(f.responsivenessFactor)} · quality ${f.qualityGrade ?? 'null'}]`
    );
  }
  console.log('');
}

await mongoose.disconnect();
process.exit(0);
