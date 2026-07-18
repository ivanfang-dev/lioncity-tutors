// One-off backfill: populate assignment.budgetNumeric from the existing free-text rate (roadmap
// Phase 7), so matching reads numbers instead of regex-parsing text. Going forward the Assignment
// pre-save hook keeps it in sync; this catches assignments created before it.
//
// Safe by default: DRY RUN — prints what it WOULD write. Add --apply to write.
// Bulk updateOne only (never .save()) so legacy assignments with out-of-enum subject/level values
// aren't re-validated by the model's pre-save hook.
//
//   node --env-file=.env scripts/backfillBudgetNumeric.js          # preview
//   node --env-file=.env scripts/backfillBudgetNumeric.js --apply  # write

import mongoose from 'mongoose';
import { Assignment } from '../../../packages/shared/server-exports.js';
import { deriveBudgetNumeric, hasNumericValue } from '../../../packages/shared/utils/numericRates.js';

const APPLY = process.argv.includes('--apply');

if (!process.env.MONGODB_URI) {
  console.error('MONGODB_URI not set. Run with --env-file=.env or MONGODB_URI=... prefix.');
  process.exit(1);
}

await mongoose.connect(process.env.MONGODB_URI);

const assignments = await Assignment.find({ rate: { $exists: true, $ne: null } })
  .select('title rate budgetNumeric')
  .lean();

console.log(`\nScanning ${assignments.length} assignment(s) with a rate...\n`);

let toWrite = 0;
let noBudget = 0;
const ops = [];
for (const a of assignments) {
  const derived = deriveBudgetNumeric(a.rate);
  if (!hasNumericValue(derived)) { noBudget++; continue; }
  if (JSON.stringify(a.budgetNumeric || {}) === JSON.stringify(derived)) continue;
  toWrite++;
  ops.push({ updateOne: { filter: { _id: a._id }, update: { $set: { budgetNumeric: derived } } } });
  if (toWrite <= 20) {
    const summary = Object.entries(derived).map(([k, v]) => `${k}:${v}`).join(' ');
    console.log(`  • ${a.title || a._id}  "${a.rate}"  →  ${summary}`);
  }
}
if (toWrite > 20) console.log(`  … and ${toWrite - 20} more`);

console.log(`\n  ${toWrite} assignment(s) to update · ${noBudget} with no parseable rate (skipped).`);

if (!APPLY) {
  console.log(`\nDRY RUN — nothing written. Re-run with --apply to update ${toWrite} assignment(s).\n`);
  await mongoose.disconnect();
  process.exit(0);
}

let modified = 0;
if (ops.length) {
  const res = await Assignment.bulkWrite(ops, { ordered: false });
  modified = res.modifiedCount ?? 0;
}
console.log(`\n✅ Updated budgetNumeric on ${modified} assignment(s).\n`);
await mongoose.disconnect();
process.exit(0);
