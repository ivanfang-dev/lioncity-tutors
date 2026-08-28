/**
 * FAQ content for /free-notes. Rendered as visible text on the page AND
 * emitted as FAQPage JSON-LD via GuideSchema — the two must always match, so
 * both read from here.
 *
 * Targets the notes queries the page already appears for (GSC, 3 months to
 * 2026-07-23), which are dominated by General Paper: "general paper a level
 * notes" (65 impressions), "gp notes a level" (46), "general paper notes" (31).
 *
 * Every claim below is checked against src/data/notesData.mjs. If a subject is
 * not in that file, this page does not promise it.
 */
export const FREE_NOTES_FAQS = [
  {
    question: 'Which subjects do the free study notes cover?',
    answer:
      'Two so far. A-Level General Paper, as five Raffles Institution 2024 infopacks: media issues, science and technology, social issues, arts and culture, and politics. And O-Level Additional Mathematics, as a 17-page revision set for syllabus 4049. Other subjects show as "Coming soon" until real notes exist for them — nothing on this page is a placeholder download.',
  },
  {
    question: 'How do you use a General Paper infopack to revise?',
    answer:
      'Read one theme at a time and pull out three things: a recent example with a date, a counter-argument, and a phrase you could reuse in an essay. Infopacks are raw material, not model answers, so the value comes from turning each theme into your own bank of examples before the exam.',
  },
  {
    question: 'What is in the O-Level A-Math notes?',
    answer:
      'Seventeen pages on syllabus 4049: how the two papers are marked, the working discipline that keeps method marks, the question families that recur, and a formula reference for quadratics and polynomials, indices, surds and logarithms, binomial expansion, partial fractions, coordinate geometry, trigonometry, differentiation, integration and kinematics. It closes with common errors, worked examples and a revision plan.',
  },
  {
    question: 'Are the free notes really free to download?',
    answer:
      'Yes. There is no payment and no account to create: you enter an email address and a contact number, and the file opens in a new tab. We use those details to send new notes and study resources, and parents who go on to request a tutor never pay an agency fee.',
  },
];
