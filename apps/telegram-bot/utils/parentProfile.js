// Formats a tutor profile for sending to a PARENT over WhatsApp.
//
// Deliberately excludes internal/PII fields — contact number, NRIC, DOB, email — so the
// agency stays the broker (the parent can't contact the tutor directly) and no sensitive
// data leaks. Plain text (no Telegram markdown), since this is delivered via WhatsApp.

import { getLevelCategory } from './tutorMatcher.js';

// The tutor's per-level rate, matched to the assignment's level. Uses getLevelCategory so
// multi-word levels map correctly (e.g. "Junior College" → jc, "International
// Baccalaureate" → ib), falling back to the secondary rate when that level isn't set.
function rateForLevel(tutor, level) {
  const category = getLevelCategory(level);
  return tutor.hourlyRate?.[category] || tutor.hourlyRate?.secondary || null;
}

// `intro` is the short lead-in line shown before the profile (owner-configurable).
export function formatTutorProfileForParent(tutor, assignment, intro) {
  const lines = [];
  if (intro) lines.push(intro, '');

  lines.push(`👤 ${tutor.fullName || 'Tutor'}`);
  if (tutor.tutorType) lines.push(`Type: ${tutor.tutorType}`);
  if (tutor.yearsOfExperience) lines.push(`Experience: ${tutor.yearsOfExperience}`);

  // Schools are a strong selling point for SG parents (e.g. "ex-RI").
  const schools = [tutor.currentSchool, tutor.previousSchools].filter(Boolean).join('; ');
  if (schools) lines.push(`School(s): ${schools}`);

  const rate = rateForLevel(tutor, assignment?.level);
  if (rate) lines.push(`Rate: ${rate}`);

  if (tutor.introduction) lines.push('', `About:\n${tutor.introduction}`);
  if (tutor.teachingExperience) lines.push('', `Teaching experience:\n${tutor.teachingExperience}`);
  if (tutor.trackRecord) lines.push('', `Track record:\n${tutor.trackRecord}`);

  return lines.join('\n');
}
