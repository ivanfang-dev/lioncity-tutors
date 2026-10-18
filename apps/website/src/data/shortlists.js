/**
 * Real tutor profiles shown as an example shortlist on subject pages.
 *
 * Pulled from the live tutor pool on 2026-10-18: active tutors with a profile
 * qualityGrade of 4 or 5 and extracted evidence for the subject. Names, photos and
 * anything that would identify the tutor are withheld, and credentials are coarsened.
 * Each `evidence` line is the tutor's own stated record, shortened, never an invented
 * result (see reviews.mjs for why that line is not crossed).
 *
 * Pool counts are rounded down, the same rule as MATCH_TIMELINE in promises.js.
 *   active physics tutors: 64 (Secondary 61, H2 22, IB 9) → "60+"
 */
export const SHORTLISTS_AS_OF = 'October 2026';

export const PHYSICS_TUTOR_COUNT = '60+';

export const PHYSICS_SHORTLIST = {
  // A real request's level, frequency and area, shown as the example brief.
  request: { title: 'Sec 3 Physics', detail: 'Once a week · Hougang' },
  tutors: [
    {
      headline: 'Retired polytechnic engineering lecturer',
      meta: 'Ex-MOE · 10+ years · B.Eng (NUS), MSc (UK)',
      rate: '$60/hr',
      evidence: 'Has tutored Pure Physics students from schools including Dunman High and Raffles Institution (IP).',
    },
    {
      headline: 'Former international-school physics teacher',
      meta: 'Full-time · 5–10 years · Master’s degree',
      rate: '$70/hr',
      evidence: 'Taught IB Physics full-time for two years; all four students in a Sec 2–3 physics class scored A1.',
    },
    {
      headline: 'NUS undergraduate, ex-Eunoia JC',
      meta: 'Undergraduate · 3–5 years · Sec and H2 Physics',
      rate: '$50/hr',
      evidence: 'Students have gone from an E in Sec 3 to an A in Sec 4 Physics.',
    },
  ],
};
