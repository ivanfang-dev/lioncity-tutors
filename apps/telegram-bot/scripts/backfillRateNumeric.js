// One-off backfill: populate tutor.rateNumeric from the existing free-text hourlyRate strings
// (roadmap Phase 7), so matching reads numbers instead of regex-parsing text. Going forward the
// Tutor pre-save hook keeps rateNumeric in sync; this catches every tutor registered before it.
//
// Safe by default: DRY RUN — prints what it WOULD write. Add --apply to write.
// Bulk updateOne only (never .save()) so legacy profiles with out-of-enum values aren't re-validated.
//
//   node --env-file=.env scripts/backfillRateNumeric.js          # preview
//   node --env-file=.env scripts/backfillRateNumeric.js --apply  # write

import mongoose from 'mongoose';
import { Tutor } from '../../../packages/shared/server-exports.js';
import { deriveRateNumeric, hasNumericValue } from '../../../packages/shared/utils/numericRates.js';

const APPLY = process.argv.includes('--apply');

if (!process.env.MONGODB_URI) {
  console.error('MONGODB_URI not set. Run with --env-file=.env or MONGODB_URI=... prefix.');
  process.exit(1);
}

await mongoose.connect(process.env.MONGODB_URI);

const tutors = await Tutor.find({ hourlyRate: { $exists: true, $ne: null } })
  .select('fullName hourlyRate rateNumeric')
  .lean();

console.log(`\nScanning ${tutors.length} tutor(s) with an hourlyRate...\n`);

let toWrite = 0;
let noRates = 0;
const ops = [];
for (const t of tutors) {
  const derived = deriveRateNumeric(t.hourlyRate);
  if (!hasNumericValue(derived)) { noRates++; continue; }
  // Skip if already populated identically (idempotent re-runs stay quiet).
  if (JSON.stringify(t.rateNumeric || {}) === JSON.stringify(derived)) continue;
  toWrite++;
  ops.push({ updateOne: { filter: { _id: t._id }, update: { $set: { rateNumeric: derived } } } });
  if (toWrite <= 20) {
    const summary = Object.entries(derived).map(([k, v]) => `${k}:${v.min}-${v.max}`).join(' ');
    console.log(`  • ${t.fullName || t._id}  →  ${summary}`);
  }
}
if (toWrite > 20) console.log(`  … and ${toWrite - 20} more`);

console.log(`\n  ${toWrite} tutor(s) to update · ${noRates} with no parseable rate (skipped).`);

if (!APPLY) {
  console.log(`\nDRY RUN — nothing written. Re-run with --apply to update ${toWrite} tutor(s).\n`);
  await mongoose.disconnect();
  process.exit(0);
}

let modified = 0;
if (ops.length) {
  const res = await Tutor.bulkWrite(ops, { ordered: false });
  modified = res.modifiedCount ?? 0;
}
console.log(`\n✅ Updated rateNumeric on ${modified} tutor(s).\n`);
await mongoose.disconnect();
process.exit(0);
