/**
 * Subject segmentation for /free-notes.
 *
 * The notes queries this page already appears for are almost entirely General
 * Paper and H2 sciences (GSC, 3 months to 2026-07-23), so General Paper leads
 * and the H2 block stays honest about what is still missing.
 *
 * Every block below is checked against src/data/notesData.mjs. A subject with
 * no file in that data does not get a block claiming one — the H2 block says
 * plainly that the notes are not written yet and hands the reader to the
 * subject guide that does cover the material.
 *
 * `links` name registry slugs; anchor text is read from the registry at render
 * time, never written here. `linkLead` stops before the article, because the
 * renderer supplies "the" in front of each anchor.
 */
export const NOTE_SECTIONS = [
  {
    id: 'general-paper',
    label: 'A-Level General Paper notes',
    heading: 'What free A-Level General Paper notes are available?',
    answer:
      'Five Raffles Institution 2024 General Paper infopacks, free to download: media issues, science and technology, social issues, arts and culture, and politics. Each collects current examples, statistics and arguments on one theme, which is the raw material Paper 1 essays and Paper 2 application questions are built from.',
    linkLead: 'For essay structure and the Paper 2 mark scheme, read',
    links: ['a-level-general-paper', 'a-level-prep'],
  },
  {
    id: 'chemistry',
    label: 'Chemistry notes: H2, H1, O-Level, IGCSE',
    heading: 'What free Chemistry notes are available?',
    answer:
      'Four sets, one per level. H2 Chemistry: 15 pages across all thirteen topics, with Paper 4 practical technique and an equations sheet. H1 Chemistry: the eight core topics, both Materials extension topics, and a scope list of what H1 leaves to H2 — no entropy, no electrochemistry, no practical paper. O-Level: 23 pages covering all eleven topics, then the parts revision skips — templates for the "explain" questions, the qualitative analysis tables, and the error analysis Paper 3 asks for. IGCSE: the same eleven topics in 17 pages, closing on industrial conditions, the reactivity series, solubility rules and the phrasings examiners accept.',
    linkLead: 'For how the papers are weighted and where the marks go, read',
    links: ['how-to-study-o-level-chemistry', 'o-level-chemistry', 'a-level-chemistry', 'igcse-chemistry'],
  },
  {
    id: 'physics',
    label: 'Physics notes: H2 and O-Level',
    heading: 'What free Physics notes are available?',
    answer:
      'Three sets. H2 Physics comes in both syllabuses: 9478, which every school candidate sits from 2026, and 9749, which has its final examination that same year and is open to private and repeat candidates only. Each runs to roughly 48 pages across all six sections, with worked derivations, answer blueprints and a formula sheet — take 9478 unless you know you are sitting the legacy paper. The O-Level set covers all eleven topics in 11 pages, every formula carrying its SI unit, then answer templates, instrument precision and the graphing rules the practical marks against; it is written to Cambridge 5054, which matches Singapore’s 6091 topic for topic.',
    linkLead: 'For where the marks actually sit in each, read',
    links: ['how-to-study-h2-physics', 'a-level-physics', 'how-to-study-o-level-physics', 'o-level-physics'],
  },
  {
    id: 'o-level-english',
    label: 'O-Level English notes',
    heading: 'Are there free O-Level English notes?',
    answer:
      'One guide, 20 pages on syllabus 1184. It starts with what each paper is actually worth — Writing and Comprehension 35% each, Oral 20%, Listening 10% — because that ordering is not what most revision timetables assume. Then the six situational text-type formats with their conventions, the PAC method for reading a prompt, and a task-numbering protocol for proving every content point was covered. Comprehension, listening and oral technique follow, and it closes on a quick-reference appendix and a pre-exam checklist.',
    linkLead: 'For the ten mistakes our tutors correct most often, read',
    links: ['how-to-study-o-level-english', 'o-level-english'],
  },
  {
    id: 'psle-math',
    label: 'PSLE Maths notes',
    heading: 'Are there free PSLE Maths notes?',
    answer:
      'One set, and it opens on what changed for the 2026 exam: speed and the 8-point compass are out of the primary syllabus entirely, nets and pie charts moved down to Primary 4, and ratio and average are now taught wholly in Primary 6. Then the format table, Polya’s four steps and the working discipline that earns method marks, a content reference by strand, and seven heuristics worked through one at a time — model drawing, the branch method, assumption, before-change-after, working backwards, pattern recognition and systematic listing. It ends on common errors and a final checklist.',
    linkLead: 'For how the two papers are structured and where the marks go, read',
    links: ['how-to-study-psle-math', 'psle-math'],
  },
  {
    id: 'psle-english',
    label: 'PSLE English notes',
    heading: 'Are there free PSLE English notes?',
    answer:
      'One guide, 17 pages on syllabus 0001. It sets out how the 200 marks divide across the four papers, then spends its length on the two that reward preparation most: Writing, at 25%, with the band descriptors, seven narrative techniques and the traps that cost bands; and Oral, at 20%, split into Reading Aloud and the stimulus-based conversation. In between sit the synthesis and transformation rules — one master rule and four checking gates — and it closes on a phrase and idiom bank and an exam-day checklist.',
    linkLead: 'For where the marks actually sit, including 40 of them in ten minutes of oral, read',
    links: ['how-to-study-psle-english', 'psle-english'],
  },
  {
    id: 'psle-science',
    label: 'PSLE Science notes',
    heading: 'Are there free PSLE Science notes?',
    answer:
      'One set, covering the chemistry-related half of the syllabus: what counts as matter, mass against volume, measuring an irregular solid by displacement, and the properties of the three states. It then works through the three application models PSLE reuses — the burst balloon, the overflowing cup and the two-hole milk tin — and the H.A.N.D.S.O.M.E. method for structured open-ended answers. The biology, energy and systems themes are not in this set.',
    linkLead: 'For the full syllabus and how the open-ended paper is marked, read',
    links: ['how-to-study-psle-science', 'psle-science'],
  },
  {
    id: 'o-level',
    label: 'O-Level maths notes',
    heading: 'Are there free O-Level A-Math and E-Math notes?',
    answer:
      'Both maths papers, free to download: 17 pages on Additional Mathematics (syllabus 4049) and 16 on Elementary Mathematics (4052). Each carries a formula reference across every topic area — calculus, trigonometry and partial fractions on the A-Math side, mensuration, vectors, matrices and probability on the E-Math side — then the errors that cost marks and worked examples.',
    linkLead: 'Start with',
    links: ['how-to-study-o-level-a-math', 'how-to-study-o-level-e-math', 'o-level-math', 'o-level-prep', 'free-test-papers'],
  },
  {
    id: 'h2-maths',
    label: 'H2 Maths notes',
    heading: 'Are there free H2 Maths notes?',
    answer:
      'One set, 19 pages on syllabus 9758. It opens on the three things that decide marks before any mathematics happens: what the graphing calculator may and may not be used for, what the printed formula list already gives you, and the working discipline — state the model, keep 5 significant figures until the last line, answer in the context the question asked. Then a reference across Pure Mathematics and Probability and Statistics, the topics the syllabus explicitly excludes (they still appear in older Ten-Year Series papers), common errors and worked examples.',
    linkLead: 'For why statistics is 30% of the grade and which A-Math knowledge is assumed, read',
    links: ['how-to-study-h2-maths', 'a-level-math'],
  },
  {
    id: 'n-level',
    label: 'N(T)-Level Science notes',
    heading: 'Are there free N-Level Science notes?',
    answer:
      'One module so far: Food Matters, from syllabus 5148. It sets out the four food tests with the exact reagent, procedure and colour change for each, digestion and the enzymes that drive it, and the chemistry behind every preservation method. It ends with what N(T) does not test — no moles, no orbitals, no industrial processes — so revision time does not drain into O-Level material.',
    linkLead: 'For the rest of the N-Level picture, read',
    links: ['n-level-tuition', 'free-test-papers'],
  },
  {
    id: 'h2-sciences',
    label: 'H2 Biology notes',
    heading: 'Are there free H2 Biology notes?',
    answer:
      'Not yet — Biology is the one H2 science still without notes. Chemistry has H2 and H1 sets, and Physics has both the 9478 and 9749 syllabuses, in the blocks above. For Biology the subject guide covers the same syllabus content in full, and the JC shelf of free test papers carries 2024 prelim papers for H2 Biology, Chemistry, Physics, Maths and Economics.',
    linkLead: 'Start with',
    links: ['a-level-biology', 'free-test-papers'],
  },
];
