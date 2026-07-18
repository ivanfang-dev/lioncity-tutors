// Phase 9 pre-swap review: for recent assignments, print the CURRENT production top-8 (deterministic
// quality rank + the query-time Gemini re-rank) beside the PROPOSED top-8 (deterministic rank with
// the extracted qualityGrade replacing commitmentScore, NO Gemini re-rank). Read-only — it changes
// nothing. Eyeball this before shipping the scoring swap (Step B) that retires the re-ranker.
//
// Run the profile backfill FIRST (scripts/backfillProfileFeatures.js --apply), otherwise no tutor has
// a qualityGrade and the two columns are identical by construction — the script reports the coverage
// so you can tell.
//
//   node --env-file=.env scripts/compareRanking.js            # 5 most recent assignments
//   node --env-file=.env scripts/compareRanking.js --limit 10

import mongoose from 'mongoose';
import { Assignment } from '../../../packages/shared/server-exports.js';
import { findMatchingTutorsScored } from '../utils/tutorMatcher.js';
import { rankTutorsWithAI } from '../utils/tutorRanker.js';

const arg = (name, fallback) => {
  const i = process.argv.indexOf(name);
  return i !== -1 && process.argv[i + 1] ? Number(process.argv[i + 1]) : fallback;
};
const LIMIT = arg('--limit', 5);

if (!process.env.MONGODB_URI) {
  console.error('MONGODB_URI not set. Run with --env-file=.env or MONGODB_URI=... prefix.');
  process.exit(1);
}

await mongoose.connect(process.env.MONGODB_URI);

const assignments = await Assignment.find({ level: { $ne: null }, location: { $ne: null } })
  .sort({ createdAt: -1 })
  .limit(LIMIT)
  .lean();

const name = t => (t.fullName || String(t._id)).slice(0, 22);
const grade = t => (t.profileFeatures?.qualityGrade != null ? `q${t.profileFeatures.qualityGrade}` : ' · ');

for (const a of assignments) {
  console.log('\n============================================================');
  console.log(`${a.title}  |  ${a.level}  |  ${a.subject}  |  ${a.location}  |  ${a.rate}`);

  // PRE-SWAP baseline: commitmentScore ranking (useQualityGrade:false) + the query-time Gemini
  // re-rank — what production did before Phase 9 Step B. Pinned explicitly since the default flipped.
  const scored = await findMatchingTutorsScored(a, 40, { useQualityGrade: false });
  if (scored.length === 0) { console.log('  (no matching tutors)'); continue; }
  const candidates = scored.map(s => s.tutor);
  const withGrade = candidates.filter(t => t.profileFeatures?.qualityGrade != null).length;
  const { tutors: oldTop, aiUsed } = await rankTutorsWithAI(a, candidates, 8);

  // CURRENT path (Phase 9 Step B): deterministic rank with qualityGrade replacing commitmentScore,
  // no Gemini re-rank. This is what production now ships.
  const newScored = await findMatchingTutorsScored(a, 40, { useQualityGrade: true });
  const newTop = newScored.slice(0, 8).map(s => s.tutor);

  const oldIds = new Set(oldTop.map(t => String(t._id)));
  const newIds = new Set(newTop.map(t => String(t._id)));
  const overlap = [...oldIds].filter(id => newIds.has(id)).length;

  console.log(`  pool ${candidates.length} · ${withGrade}/${candidates.length} have an extracted grade · Gemini re-rank used: ${aiUsed}`);
  console.log(`  top-8 overlap: ${overlap}/8\n`);
  console.log(`  ${'#'.padEnd(3)}${'OLD (deterministic + Gemini)'.padEnd(30)}NEW (qualityGrade, no Gemini)`);
  for (let i = 0; i < 8; i++) {
    const o = oldTop[i];
    const n = newTop[i];
    const oStr = o ? `${name(o)} ${grade(o)}` : '';
    const nStr = n ? `${name(n)} ${grade(n)}` : '';
    const moved = o && n && String(o._id) !== String(n._id) ? ' *' : '';
    console.log(`  ${String(i + 1).padEnd(3)}${oStr.padEnd(30)}${nStr}${moved}`);
  }
}

if (assignments.some(a => true)) {
  console.log('\n(* = row differs. If most rows show " · " grades, run the backfill --apply first.)');
}

await mongoose.disconnect();
