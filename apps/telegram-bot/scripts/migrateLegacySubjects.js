// One-time migration: bring legacy Assignment.subject values into the current SUBJECTS
// enum so every save (escalation, auto-close, reply handling) works without per-call
// guards. Old assignments predate the enum and hold values like "Physics/Chemistry/Emath".
//
// Safe by default: runs as a DRY RUN and only prints what it would change.
// Add --apply to actually write.
//
//   MONGODB_URI="<your uri>" node scripts/migrateLegacySubjects.js          # preview
//   MONGODB_URI="<your uri>" node scripts/migrateLegacySubjects.js --apply  # write
//
// (MONGODB_URI is not in the local .env — it lives in Vercel. Pass it inline or add it
//  to .env temporarily to run this.)

import 'dotenv/config';
import mongoose from 'mongoose';
import { Assignment } from '../../../packages/shared/server-exports.js';
import { EDUCATION_LEVELS, isValidLevelSubjectCombination } from '../../../packages/shared/client-exports.js';

const APPLY = process.argv.includes('--apply');

// Tokens that mean "this is really several subjects" → the valid catch-all category.
const MULTI_SEPARATORS = ['/', ',', '&', '+', ' and ', ' or '];

// Known abbreviation → canonical enum value. Only applied when the result is actually
// valid for that assignment's level; otherwise we fall back (Multiple Subjects / Other).
const ALIASES = {
  'emath': 'Elementary Mathematics',
  'e math': 'Elementary Mathematics',
  'e-math': 'Elementary Mathematics',
  'amath': 'Additional Mathematics',
  'a math': 'Additional Mathematics',
  'a-math': 'Additional Mathematics',
  'math': 'Mathematics',
  'maths': 'Mathematics',
  'english': 'English Language',
  'eng': 'English Language',
  'poa': 'Principles of Accounts',
  'gp': 'General Paper',
  'lit': 'Literature in English',
  'chem': 'Chemistry',
  'phy': 'Physics',
  'phys': 'Physics',
  'bio': 'Biology',
  'sci': 'Science',
  'pure biology': 'Biology',
  'pure chemistry': 'Chemistry',
  'pure physics': 'Physics',
  'foundation math': 'Mathematics',
  'foundation maths': 'Mathematics',
  'foundation mathematics': 'Mathematics',
  // JC H1/H2 subjects — valid once the level is normalised to Junior College 1/2.
  'h1 mathematics': 'H1 Mathematics', 'h1 maths': 'H1 Mathematics', 'h1 math': 'H1 Mathematics',
  'h1 physics': 'H1 Physics', 'h1 chemistry': 'H1 Chemistry', 'h1 biology': 'H1 Biology',
  'h1 economics': 'H1 Economics', 'h1 econs': 'H1 Economics',
  'h2 mathematics': 'H2 Mathematics', 'h2 maths': 'H2 Mathematics', 'h2 math': 'H2 Mathematics',
  'h2 physics': 'H2 Physics', 'h2 chemistry': 'H2 Chemistry', 'h2 biology': 'H2 Biology',
  'h2 economics': 'H2 Economics', 'h2 econs': 'H2 Economics',
};

// Legacy level strings → canonical EDUCATION_LEVELS value. Normalising the level makes the
// doc matchable again (tutorMatcher keys off the canonical prefix) and lets level-specific
// subject aliases (e.g. H2 Chemistry → Junior College) validate.
const LEVEL_ALIASES = {
  'jc1': 'Junior College 1', 'j1': 'Junior College 1',
  'jc2': 'Junior College 2', 'j2': 'Junior College 2',
  'p1': 'Primary 1', 'p2': 'Primary 2', 'p3': 'Primary 3',
  'p4': 'Primary 4', 'p5': 'Primary 5', 'p6': 'Primary 6',
  's1': 'Secondary 1', 's2': 'Secondary 2', 's3': 'Secondary 3',
  's4': 'Secondary 4', 's5': 'Secondary 5',
};

function normalizeLevel(raw) {
  const level = (raw || '').trim();
  if (!level) return null;
  if (EDUCATION_LEVELS.includes(level)) return level; // already canonical
  const lower = level.toLowerCase().replace(/\s+/g, ' ').trim();
  if (LEVEL_ALIASES[lower]) return LEVEL_ALIASES[lower];
  // Strip stream/qualifier suffixes, e.g. "Secondary 4 NA", "Sec 3 Express".
  const sec = lower.match(/^sec(?:ondary)?\s*([1-5])\b/);
  if (sec) return `Secondary ${sec[1]}`;
  const pri = lower.match(/^pri(?:mary)?\s*([1-6])\b/);
  if (pri) return `Primary ${pri[1]}`;
  return null; // unknown — leave the level untouched
}

function mapSubject(level, raw) {
  const subject = (raw || '').trim();
  if (!subject) return 'Other';

  // Looks like a combination of subjects → the catch-all that's valid for every level.
  const lower = subject.toLowerCase();
  if (MULTI_SEPARATORS.some((sep) => lower.includes(sep))) {
    return 'Multiple Subjects';
  }

  // A known abbreviation, but only if it's a legal subject for this level.
  const aliased = ALIASES[lower];
  if (aliased && isValidLevelSubjectCombination(level, aliased)) {
    return aliased;
  }

  // Unknown single subject we can't safely map.
  return 'Other';
}

async function main() {
  if (!process.env.MONGODB_URI) {
    console.error('❌ MONGODB_URI is not set. Pass it inline or add it to .env, e.g.:');
    console.error('   MONGODB_URI="<uri>" node scripts/migrateLegacySubjects.js');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 8000 });
  console.log(`✅ Connected. Mode: ${APPLY ? 'APPLY (writing)' : 'DRY RUN (no writes)'}\n`);

  // Pull only the fields we need; lean() so the schema's getters/validators don't run.
  const all = await Assignment.find({}, { level: 1, subject: 1, title: 1 }).lean();

  const planned = [];
  for (const a of all) {
    const canonicalLevel = normalizeLevel(a.level);       // canonical, or null if unknown
    const levelChanged = !!canonicalLevel && canonicalLevel !== a.level;
    const effectiveLevel = canonicalLevel || a.level;     // validate the subject against this

    const subjectOkNow = isValidLevelSubjectCombination(effectiveLevel, a.subject);
    const toSubject = subjectOkNow ? a.subject : mapSubject(effectiveLevel, a.subject);
    const subjectChanged = toSubject !== a.subject;

    if (!levelChanged && !subjectChanged) continue;       // already valid, nothing to do
    planned.push({
      id: a._id,
      fromLevel: a.level, toLevel: effectiveLevel, levelChanged,
      from: a.subject, to: toSubject, subjectChanged,
    });
  }

  if (planned.length === 0) {
    console.log('🎉 No legacy subjects found — every assignment is already valid.');
    await mongoose.disconnect();
    return;
  }

  // Summarise the distinct remappings so the changes are reviewable at a glance.
  const summary = {};
  for (const p of planned) {
    const levelPart = p.levelChanged ? `${p.fromLevel} → ${p.toLevel}` : (p.fromLevel || '(no level)');
    const subjPart = p.subjectChanged ? `"${p.from}" → "${p.to}"` : `"${p.from}" (kept)`;
    const key = `${levelPart} | ${subjPart}`;
    summary[key] = (summary[key] || 0) + 1;
  }
  console.log(`Found ${planned.length} assignment(s) with legacy subjects:\n`);
  Object.entries(summary)
    .sort((a, b) => b[1] - a[1])
    .forEach(([key, count]) => console.log(`  ${String(count).padStart(4)}  ${key}`));
  console.log('');

  if (!APPLY) {
    console.log('DRY RUN — nothing written. Re-run with --apply to commit these changes.');
    await mongoose.disconnect();
    return;
  }

  // updateOne (not save) so we bypass the enum validator and the level/subject pre-save
  // hook — we are deliberately writing the corrected value.
  let updated = 0;
  for (const p of planned) {
    const set = { updatedAt: new Date() };
    if (p.levelChanged) set.level = p.toLevel;
    if (p.subjectChanged) set.subject = p.to;
    await Assignment.updateOne({ _id: p.id }, { $set: set });
    updated += 1;
  }
  console.log(`✅ Updated ${updated} assignment(s).`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
