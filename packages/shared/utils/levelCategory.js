// Maps an assignment's education level to the tutor-schema key that stores per-level data
// (teachingLevels.<category>, hourlyRate.<category>).
//
// Shared because both sides of the platform ask the same question of the same data: the matcher
// uses it to find tutors who teach the level, and the ops console uses it to show what a tutor
// asks for it. Two copies would drift the moment a level is added.
export function getLevelCategory(level) {
  if (!level) return null;
  const prefixes = [
    ['Pre-School', 'preschool'],
    ['Primary', 'primary'],
    ['Secondary', 'secondary'],
    ['Junior College', 'jc'],
    ['International Baccalaureate', 'ib'],
    ['Millennia Institute', 'millenniaInstitute'],
    ['Polytechnic', 'polytechnic'],
    ['University', 'university'],
    ['Graduate Studies', 'university'],
    ['Music Academy', 'music'],
    ['Professional Development', 'professional'],
  ];
  for (const [prefix, category] of prefixes) {
    if (level === prefix || level.startsWith(prefix)) return category;
  }
  return null;
}

// Common Singapore shorthand for education levels, as parents actually type it into FREE-TEXT intake
// (the website request form: "P4 Chinese", "Sec 3 A-Math", "JC1 H2 Chem"). Each pattern rewrites the
// shorthand PREFIX to the canonical level word getLevelCategory maps on. Anchored at the start (the
// level always leads "Level Subject"), and bare single letters require a following level number so
// "Physics"/"Science"/"Chinese" can't false-match.
const LEVEL_SHORTHAND = [
  [/^\s*pri\s*[1-6]?\b/i, 'Primary'],
  [/^\s*p\s*[1-6]\b/i, 'Primary'],
  [/^\s*sec\s*[1-5]?\b/i, 'Secondary'],
  [/^\s*s\s*[1-5]\b/i, 'Secondary'],
  [/^\s*jc\s*[12]?\b/i, 'Junior College'],
  [/^\s*j\s*[12]\b/i, 'Junior College'],
  [/^\s*poly\b/i, 'Polytechnic'],
  [/^\s*uni\b/i, 'University'],
  [/^\s*kindergarten\b/i, 'Pre-School'],
  [/^\s*k\s*[12]\b/i, 'Pre-School'],
];

// getLevelCategory, but tolerant of the shorthand above. Use this ONLY for free-text inputs (the
// website rate hint) — the strict version stays the matcher's entry point, so structured/dropdown
// levels never route through fuzzy rules. Tries the strict map first (canonical text wins), then the
// shorthand expansion; null when nothing recognizes it (caller shows no hint rather than a wrong one).
export function getLevelCategoryLoose(level) {
  const direct = getLevelCategory(level);
  if (direct) return direct;
  const text = String(level ?? '');
  for (const [pattern, canonical] of LEVEL_SHORTHAND) {
    if (pattern.test(text)) return getLevelCategory(canonical);
  }
  return null;
}
