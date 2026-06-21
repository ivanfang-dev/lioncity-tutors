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

// Formats a SHORTLIST of interested tutors as a single WhatsApp message to the parent.
// Used by the owner's one-tap "Send all N" relay. `tutors` are already vetted (they each
// said Yes); `assignment` supplies the level for per-tutor rate; `intro` is the
// owner-configured lead-in (PARENT_INTRO_MESSAGE), worded for the single-tutor case.
export function formatTutorProfilesForParent(tutors, assignment, intro) {
  // One tutor isn't a "shortlist" — reuse the single-profile format verbatim so a lone
  // Yes reads naturally ("Here is a tutor we found...") rather than "Option 1 of 1".
  if (tutors.length === 1) {
    return formatTutorProfileForParent(tutors[0], assignment, intro);
  }

  // Per-tutor card WITHOUT a lead-in line: call formatTutorProfileForParent(tutor,
  // assignment) and omit the `intro` argument. It returns the same fields as a single
  // send (name, type, experience, school(s), rate, about, etc.), minus the greeting.
  //
  // Plural lead-in: `intro` is worded for a single tutor, so for a shortlist we open with
  // our own line and keep the configured `intro` only as a fallback if it's missing.
  const lines = [`Hi! Here are ${tutors.length} tutors we've shortlisted for your request:`];

  // Number each tutor so the parent can reply "I'll go with Option 2". Emoji digits read
  // cleaner than "*Option 2*" on WhatsApp (which has no plain-text bold). A divider line
  // before each option gives clear visual breaks when skimming on mobile.
  const numberEmoji = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];
  tutors.forEach((tutor, i) => {
    const label = numberEmoji[i] || `${i + 1}.`;
    lines.push('', '──────────', `${label} Option ${i + 1}`, formatTutorProfileForParent(tutor, assignment));
  });

  // Gentle nudge to reply — closing the loop is what converts a shortlist into a booking.
  lines.push('', 'Let us know which tutor you’d like to go with and we’ll arrange the rest! 😊');

  return lines.join('\n');
}
