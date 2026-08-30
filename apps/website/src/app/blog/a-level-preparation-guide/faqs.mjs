/**
 * FAQ content for the A-Level hub. Rendered as visible text on the page AND
 * emitted as FAQPage JSON-LD — the two must always match, so both read from here.
 *
 * The three mark-change figures referenced in FAQ 3 were verified directly
 * against the official SEAB syllabus PDFs (9476, 9478, 9477, and the legacy
 * 9729, 9749, 9744) before publication — see task-8-report.md for the source
 * excerpts. No figure that could not be confirmed in the PDF text was kept.
 */
export const A_LEVEL_FAQS = [
  {
    // targets "a level exam dates 2026"
    question: 'When are the 2026 A-Level exams?',
    answer:
      'The 2026 GCE A-Level examinations run from 2 June to 27 November 2026. General Paper and the H1/H2 subject papers are sat mostly in November, after Preliminary Examinations at each JC in the third term. Results are released between 19 and 23 February 2027.',
  },
  {
    // targets "how to study for a levels singapore" (pos 20.6, 379 impressions — largest striking-distance query on the site)
    question: 'How should I study for the A-Levels in Singapore?',
    answer:
      'Build a two-year plan anchored on the JC1-to-JC2 syllabus, not just the final year. Complete syllabus content before the June holidays of JC2, then shift to full timed past papers, mark strictly against Cambridge mark schemes, and rebuild your revision plan around whatever your Prelims exposed.',
  },
  {
    question: 'What changed in the revised H2 science syllabuses?',
    answer:
      'School candidates sitting the 2026 GCE A-Level examinations take the revised H2 science syllabuses — Chemistry (9476), Physics (9478) and Biology (9477) — for the first time. The legacy codes, Chemistry 9729, Physics 9749 and Biology 9744, have their final examination in 2026 and remain available only to private and repeat candidates. The changes are to mark allocations rather than to weightings: every paper carries the same percentage of the grade as before, but the practical fell from 55 marks to 50 in all three subjects, and Paper 2 or Paper 3 lost marks in each. Physics also added a spreadsheet requirement to the practical. See the table below for the subject-by-subject detail.',
  },
  {
    question: 'Which H2 subject combination should I take?',
    answer:
      'Most Science-stream students take three H2 subjects from Chemistry, Physics, Biology and Math, plus a fourth H1 or H2 subject matched to their intended university course. Check the specific subject prerequisites for your target course before finalising a combination, since some degrees require a named H2 subject rather than any three sciences.',
  },
  {
    question: 'How many hours a week should a JC student revise?',
    answer:
      'Most JC2 students studying four subjects need roughly 15 to 20 hours a week outside class time by the second term, rising to full-day sessions during the June and September holidays. Consistent daily revision across the two-year programme matters far more than any single intensive burst before the exam.',
  },
];
