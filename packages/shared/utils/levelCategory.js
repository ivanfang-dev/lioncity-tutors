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
