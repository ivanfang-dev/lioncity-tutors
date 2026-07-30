/**
 * FAQ content for the N-Level hub. Rendered as visible text on the page AND
 * emitted as FAQPage JSON-LD — both read from here so the two can never drift.
 *
 * The first entry exists because this page ranks 10.6-10.8 for "n level meaning"
 * and "gce n level meaning" (245 impressions combined) while earning zero clicks:
 * it ranked for the question without ever answering it.
 *
 * Every date below comes from examCalendar2026.mjs. If you change one, change both.
 */
export const N_LEVEL_FAQS = [
  {
    // targets "gce n level meaning" (pos 10.8) and "n level meaning" (pos 10.6)
    question: 'What does GCE N-Level mean?',
    answer:
      'GCE N-Level is the Singapore-Cambridge General Certificate of Education Normal Level, sat at the end of Secondary 4 by students in the Normal course. It runs in two tracks: Normal (Academic), which leads to a fifth year and the O-Level, and Normal (Technical), which leads to ITE.',
  },
  {
    question: 'What is the difference between N(A) and N(T)?',
    answer:
      'Normal (Academic) and Normal (Technical) are separate tracks with separate syllabuses and papers. N(A) students sit Syllabus A papers and can progress to Secondary 5 and the O-Level. N(T) students sit Syllabus T papers, which are more practically oriented, and typically progress to ITE.',
  },
  {
    question: 'When are the 2026 N-Level exams?',
    answer:
      'The 2026 GCE N-Level examinations run from 13 July to 13 October 2026. Oral examinations come first in July, written papers begin on 14 September, and the last papers are sat on 13 October. Results are released between 17 and 21 December 2026.',
  },
  {
    question: 'Can N-Level students take the O-Level?',
    answer:
      'Yes. Normal (Academic) students who do well enough in the N-Level can progress to Secondary 5 and sit the O-Level the following year. Some students also qualify for direct entry to a polytechnic foundation programme instead, skipping the extra O-Level year entirely.',
  },
  {
    question: 'What are the PFP and DPP routes after N-Level?',
    answer:
      'The Polytechnic Foundation Programme admits eligible N(A) students straight into a one-year polytechnic foundation year instead of Secondary 5. The Direct-Entry-Scheme to Polytechnic Programme also admits eligible N(A) students, to a two-year Higher Nitec at ITE with a guaranteed polytechnic diploma place on meeting the required GPA.',
  },
];
