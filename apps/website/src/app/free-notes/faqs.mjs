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
 * not in that file, this page does not promise it — including where a set
 * covers only part of a syllabus, which the answer has to say outright.
 */
export const FREE_NOTES_FAQS = [
  {
    question: 'Which subjects do the free study notes cover?',
    answer:
      'Chemistry, science, maths and General Paper. Chemistry has a 23-page O-Level set and a 17-page IGCSE guide. Science has a PSLE set on matter and materials and the N(T)-Level Food Matters module from syllabus 5148. Maths has both O-Level papers: 17 pages for Additional Mathematics (syllabus 4049) and 16 for Elementary Mathematics (4052). A-Level General Paper has five Raffles Institution 2024 infopacks — media issues, science and technology, social issues, arts and culture, and politics. Other subjects show as "Coming soon" until real notes exist for them — nothing on this page is a placeholder download.',
  },
  {
    question: 'What is in the O-Level Chemistry notes?',
    answer:
      'Twenty-three pages across all eleven syllabus topics, from states of matter and stoichiometry through electrochemistry, energetics, acids and salts, the Periodic Table, metals, environmental and organic chemistry. The last third is exam technique rather than content: sentence templates for the "explain" questions, the qualitative analysis tables for cations, anions and gases, apparatus precision, and how to separate systematic from random error in a titration. The set is written to Cambridge syllabus 5070, which matches the Singapore-Cambridge 6092 syllabus topic for topic, so it works for either. The IGCSE guide covers the same ground in seventeen pages.',
  },
  {
    question: 'Are the H2 Chemistry notes written for the 9476 syllabus?',
    answer:
      'They are written to 9729, and they still work for 9476. The revised syllabus that school candidates sit from 2026 changed mark allocations — the practical paper from 55 to 50 marks, Paper 3 from 80 to 75 — not the thirteen content topics, and the notes make no claim about marks or weightings anywhere. What they carry is the chemistry itself, the Paper 4 practical technique and a key-equations sheet. Check the A-Level preparation guide for the mark-scheme changes, and the current SEAB syllabus for your exam year.',
  },
  {
    question: 'Do the PSLE Science notes cover the whole syllabus?',
    answer:
      'No, and the file says so. They cover the chemistry-related themes — matter, mass and volume, measuring irregular solids by displacement, the three states, and the water cycle — plus the three application models PSLE keeps reusing and the H.A.N.D.S.O.M.E. method for open-ended answers. Biology, energy and systems topics are not in this set. The PSLE Science guide covers the rest of the syllabus in the meantime.',
  },
  {
    question: 'How do you use a General Paper infopack to revise?',
    answer:
      'Read one theme at a time and pull out three things: a recent example with a date, a counter-argument, and a phrase you could reuse in an essay. Infopacks are raw material, not model answers, so the value comes from turning each theme into your own bank of examples before the exam.',
  },
  {
    question: 'What is in the O-Level maths notes?',
    answer:
      'The A-Math set runs to seventeen pages on syllabus 4049: how the two papers are marked, the working discipline that keeps method marks, the question families that recur, and a formula reference for quadratics and polynomials, indices, surds and logarithms, binomial expansion, partial fractions, coordinate geometry, trigonometry, differentiation, integration and kinematics. The E-Math set covers syllabus 4052 in sixteen pages, from numbers and algebra through sets and matrices, circle properties, trigonometry, mensuration, vectors, statistics and probability. Both close with common errors and worked examples.',
  },
  {
    question: 'Are the free notes really free to download?',
    answer:
      'Yes. There is no payment and no account to create: you enter an email address and a contact number, and the file opens in a new tab. We use those details to send new notes and study resources, and parents who go on to request a tutor never pay an agency fee.',
  },
];
