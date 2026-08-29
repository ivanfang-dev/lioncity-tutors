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
    label: 'O-Level Physics notes',
    heading: 'Are there free O-Level Physics notes?',
    answer:
      'One set, 11 pages across all eleven topics from measurement and kinematics through waves, electricity, electromagnetism and radioactivity. Every topic carries its formulas with SI units attached, because the most common way to lose an easy mark is substituting minutes or grams straight into a formula. It closes on answer templates, instrument precision and error analysis, and the graphing rules the practical paper marks against. Written to Cambridge 5054, which matches Singapore’s 6091 topic for topic.',
    linkLead: 'For where the marks actually sit — only about 15% is recall — read',
    links: ['how-to-study-o-level-physics', 'o-level-physics'],
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
    label: 'H2 Biology and Physics notes',
    heading: 'Are there free H2 Biology and H2 Physics notes?',
    answer:
      'Not yet — those two are still being written. H2 and H1 Chemistry both have notes, in the chemistry block above. For Biology and Physics the subject guides cover the same syllabus content in full, and the JC shelf of free test papers carries 2024 prelim papers for H2 Biology, Chemistry, Physics, Maths and Economics.',
    linkLead: 'Start with',
    links: ['a-level-biology', 'a-level-physics', 'free-test-papers'],
  },
];
