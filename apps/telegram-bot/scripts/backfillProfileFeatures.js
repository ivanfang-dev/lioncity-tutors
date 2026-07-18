// One-off / repeatable backfill: run write-time LLM profile extraction (roadmap Phase 9) over tutors
// that don't yet have profileFeatures at the CURRENT model version. Populates the same field the
// registration/edit path writes, so ranking (Step B) can read a stored qualityGrade instead of
// re-running Gemini at query time.
//
// Safe by default: DRY RUN — prints WHO would be extracted and how many, and makes NO Gemini calls
// and NO writes. Add --apply to actually extract + write.
//
// Resumable: it only selects tutors whose profileFeatures.modelVersion differs from the current one
// (missing counts as differing), and writes each tutor immediately — so an interrupted run just
// re-run continues where it stopped, and a modelVersion bump re-processes everyone. Rate-limited: one
// tutor at a time with a delay between calls (Gemini free-tier friendly). Writes are updateOne $set
// only (never .save()), so legacy out-of-enum profile fields aren't re-validated.
//
//   node --env-file=.env scripts/backfillProfileFeatures.js                 # preview scope (no API)
//   node --env-file=.env scripts/backfillProfileFeatures.js --apply         # extract + write
//   node --env-file=.env scripts/backfillProfileFeatures.js --apply --limit 20 --delay 5000

import mongoose from 'mongoose';
import { Tutor } from '../../../packages/shared/server-exports.js';
import {
  PROFILE_MODEL_VERSION,
  hasExtractableText,
  runExtractionForTutor,
} from '../utils/profileExtractor.js';

const APPLY = process.argv.includes('--apply');
const arg = (name, fallback) => {
  const i = process.argv.indexOf(name);
  return i !== -1 && process.argv[i + 1] ? Number(process.argv[i + 1]) : fallback;
};
const LIMIT = arg('--limit', Infinity);          // cap tutors processed this run
const DELAY_MS = arg('--delay', 4500);           // pause between Gemini calls (rate-limit safety)

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

if (!process.env.MONGODB_URI) {
  console.error('MONGODB_URI not set. Run with --env-file=.env or MONGODB_URI=... prefix.');
  process.exit(1);
}
if (APPLY && !process.env.GEMINI_API_KEY) {
  console.error('GEMINI_API_KEY not set — --apply needs it to run the extractor.');
  process.exit(1);
}

await mongoose.connect(process.env.MONGODB_URI);

// $ne matches missing fields too, so this catches both never-extracted tutors and stale versions.
const pending = await Tutor.find({ 'profileFeatures.modelVersion': { $ne: PROFILE_MODEL_VERSION } })
  .select('fullName tutorType yearsOfExperience highestEducation introduction teachingExperience trackRecord profileFeatures')
  .sort({ createdAt: 1 })
  .lean();

// Only tutors with enough profile text are worth a call — the rest have nothing to extract.
const extractable = pending.filter(hasExtractableText);
const skippedBlank = pending.length - extractable.length;

console.log(`\nModel version: ${PROFILE_MODEL_VERSION}`);
console.log(`Pending (not at current version): ${pending.length}`);
console.log(`  with extractable text: ${extractable.length}`);
console.log(`  skipped (blank/near-blank profiles): ${skippedBlank}`);

const batch = extractable.slice(0, LIMIT === Infinity ? extractable.length : LIMIT);

if (!APPLY) {
  console.log(`\nDRY RUN — would extract ${batch.length} tutor(s) (no Gemini calls, no writes). First 20:\n`);
  for (const t of batch.slice(0, 20)) {
    console.log(`  • ${t.fullName || '(no name)'} — ${t.tutorType || 'Unknown'}, ${t.yearsOfExperience || '?'}`);
  }
  console.log(`\nRe-run with --apply to extract + write. Use --limit to bound a run.`);
  await mongoose.disconnect();
  process.exit(0);
}

console.log(`\nAPPLYING — extracting ${batch.length} tutor(s), ~${(DELAY_MS / 1000).toFixed(1)}s apart...\n`);
let ok = 0, failed = 0;
for (let i = 0; i < batch.length; i++) {
  const t = batch[i];
  try {
    const features = await runExtractionForTutor(t);
    if (features) {
      ok++;
      console.log(`  [${i + 1}/${batch.length}] ✅ ${t.fullName} → grade ${features.qualityGrade}, ${features.seniority}`);
    } else {
      failed++;
      console.log(`  [${i + 1}/${batch.length}] ⚠️  ${t.fullName} → no features (API/validation failure, nothing written)`);
    }
  } catch (err) {
    failed++;
    console.log(`  [${i + 1}/${batch.length}] ❌ ${t.fullName} → ${err.message}`);
  }
  if (i < batch.length - 1) await sleep(DELAY_MS);
}

console.log(`\nDone. Extracted ${ok}, failed/skipped ${failed}. Re-run to continue any remaining.`);
await mongoose.disconnect();
