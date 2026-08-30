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
      'Chemistry, physics, English, science, maths and General Paper. Chemistry runs across four levels: H2, H1, O-Level and IGCSE. Physics has H2 sets for both the 9478 and 9749 syllabuses, and an O-Level set covering all eleven topics. English has a PSLE guide to syllabus 0001 and an O-Level guide to 1184. Science has a PSLE set on matter and materials and the N(T)-Level Food Matters module from syllabus 5148. Maths runs across three: H2 Mathematics (syllabus 9758), PSLE Mathematics (0008), and both O-Level papers — Additional Mathematics (4049) and Elementary Mathematics (4052). A-Level General Paper has five Raffles Institution 2024 infopacks. Every subject card in the library has real files behind it — nothing on this page is a placeholder download, and a subject with no notes yet is simply absent rather than promised.',
  },
  {
    question: 'What is in the O-Level Chemistry notes?',
    answer:
      'Twenty-three pages across all eleven syllabus topics, from states of matter and stoichiometry through electrochemistry, energetics, acids and salts, the Periodic Table, metals, environmental and organic chemistry. The last third is exam technique rather than content: sentence templates for the "explain" questions, the qualitative analysis tables for cations, anions and gases, apparatus precision, and how to separate systematic from random error in a titration. The set is written to Cambridge syllabus 5070, which matches the Singapore-Cambridge 6092 syllabus topic for topic, so it works for either. The IGCSE guide covers the same ground in seventeen pages.',
  },
  {
    question: 'What is in the PSLE English guide?',
    answer:
      'Seventeen pages on syllabus 0001, weighted towards the two papers where preparation moves the grade most. Writing is 25% of the subject: the guide gives the band descriptors, seven narrative techniques with worked phrasing, and the traps that pull a script down a band. Oral is another 20% — fifteen marks for Reading Aloud and twenty-five for the stimulus-based conversation — and it is the paper most families leave until last. Paper 2 gets the synthesis and transformation rules, one master rule and four checking gates. It ends on a phrase and idiom bank and an exam-day checklist.',
  },
  {
    question: 'What is in the O-Level English guide?',
    answer:
      'Twenty pages on syllabus 1184, and it opens on the mark weightings because they are the thing most revision timetables get backwards: Writing and Comprehension are 35% each, but Oral is 20% — double the Listening paper — and it is the paper students rehearse least. The bulk of the guide is Paper 1: the six situational text types with their conventions, the PAC method for reading purpose, audience and context out of a prompt, and a task-numbering protocol that makes every required content point visible to the marker. Comprehension, listening and oral technique follow, then a quick-reference appendix and a pre-exam checklist.',
  },
  {
    question: 'Do the PSLE Maths notes cover the 2026 syllabus changes?',
    answer:
      'They open on them. The 2026 cohort is the first to sit the fully updated Primary Mathematics syllabus, and the changes are the kind that waste revision time if you miss them: speed and the 8-point compass have left the primary syllabus altogether, nets of solids and pie charts moved down to Primary 4, 12- and 24-hour time to Primary 3, and ratio and average are now taught wholly in Primary 6 rather than split with P5. Revision material written before 2026 describes a paper that no longer exists. The rest of the set is the format table, the seven heuristics worked through one at a time, common errors and a final checklist.',
  },
  {
    question: 'What is in the H2 Maths notes?',
    answer:
      'Nineteen pages on syllabus 9758, and the first three are about how the paper is marked rather than about mathematics: what the graphing calculator may be used for and where its use must still be shown, what the printed formula list already supplies, and the working discipline that earns method marks — state the model first, keep five significant figures until the final line, and end a hypothesis test with a sentence about the context. The middle is a topic reference across Pure Mathematics and Probability and Statistics. It also lists what the syllabus excludes, which matters because several excluded topics still appear in older Ten-Year Series papers.',
  },
  {
    question: 'Can I use the 9744 H2 Biology guide if I sit 9477?',
    answer:
      'For the biology, yes. For the paper structure, no. The topic content carries across, so the roadmap from cell biology and biomolecules through genetics to ecology is the same material either way. What does not carry across is the assessment table: 9744 had Paper 2 at 100 marks, Paper 3 split 50 and 25, and the practical at 55, while 9477 has 90, a 55 and 20 split, and a 50-mark practical. Read the paper structure off our H2 Biology guide, which is written against 9477. The 9744 set is here because its final examination is in 2026 and private and repeat candidates still sit it.',
  },
  {
    question: 'Should I download the 9478 or the 9749 H2 Physics notes?',
    answer:
      'Take 9478 unless you know otherwise. Syllabus 9478 replaced 9749 and is what every school candidate sits from 2026; 9749 has its final examination in the same year and is open only to private and repeat candidates, and SEAB will not offer it again. For the topics carried across, the content, definitions and derivations are identical — what changed is the paper structure and two genuinely new topics, capacitance and wavefunctions. On structure: Papers 2 and 3 each fell from 80 marks to 75, Paper 3’s Section A from 60 to 55, and the practical from 55 to 50, with Paper 4 now expecting spreadsheet-based data processing rather than manual graph-paper plotting. Every weighting stayed the same. Those two are the gap to close if you have been revising from 9749-labelled material.',
  },
  {
    question: 'What is in the O-Level Physics notes?',
    answer:
      'Eleven pages across all eleven topics, from measurement and kinematics through pressure, thermal physics, waves, sound, electricity, electromagnetism and radioactivity. Each topic lists its formulas with the SI unit attached, which is deliberate: the most common way to drop an easy mark is substituting a value in minutes or grams without converting first. The last third is technique — answer templates, instrument precision, systematic against random error, and the graphing rules the practical paper marks against. Written to Cambridge syllabus 5054, which matches the Singapore-Cambridge 6091 syllabus topic for topic.',
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
