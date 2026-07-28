/**
 * FAQ content for the O-Level hub. Rendered as visible text on the page AND
 * emitted as FAQPage JSON-LD — the two must always match, so both read from here.
 *
 * Query positions at time of writing (GSC, 3 months to 2026-07-23) are noted so a
 * future editor can tell which phrasing is load-bearing.
 */
export const O_LEVEL_FAQS = [
  {
    // targets "o level exam dates 2026"
    question: 'When are the 2026 O-Level exams?',
    answer:
      'The 2026 GCE O-Level examinations run from 2 June to 10 November 2026. Mother Tongue written papers are sat first on 2 June, oral examinations follow in July, and the main written period begins on 15 October. Results are released between 13 and 15 January 2027.',
  },
  {
    // targets "o level preparation tips" (pos 17.0, 217 impressions, 0 clicks)
    question: 'What are the best O-Level preparation tips?',
    answer:
      'Work past papers by topic rather than by year, so weak areas surface early. Mark your own scripts against the official SEAB mark scheme instead of model answers. Start full timed papers ten weeks before the exam. Most lost marks come from method and presentation, not missing knowledge.',
  },
  {
    // targets "how to improve grades before o levels" (pos 17.3, 201 impressions)
    question: 'How can I improve my grades before the O-Levels?',
    answer:
      'In the final months grades move fastest by fixing how you answer, not by learning new content. Drill only your two weakest topics, rewrite answers that lost method marks, and sit complete papers under exam timing. Presentation and working alone are often worth a full grade.',
  },
  {
    question: 'How many subjects should I take for O-Level?',
    answer:
      'Most Singapore students take six to eight O-Level subjects. Only your L1 and five relevant subjects count toward L1R5, so a seventh or eighth subject rarely improves your aggregate. Take an extra subject only when a specific JC or polytechnic course requires it.',
  },
  {
    question: 'How is L1R5 calculated?',
    answer:
      'L1R5 adds your first language grade to your five best relevant subject grades, producing an aggregate between 6 and 30. A lower score is better. Either English or Higher Mother Tongue can serve as L1. From the 2028 cohort, JC admission moves from L1R5 to L1R4.',
  },
];
