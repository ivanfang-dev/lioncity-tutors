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
    label: 'O-Level and IGCSE Chemistry notes',
    heading: 'What free O-Level Chemistry notes are available?',
    answer:
      'Two sets. The O-Level notes run to 23 pages across all eleven topics, from states of matter to organic chemistry, and then cover what revision usually skips: templates for the "explain" questions, the qualitative analysis tables for cations, anions and gases, and the error analysis Paper 3 asks for. They are written to Cambridge 5070, which matches Singapore’s 6092 topic for topic. The IGCSE guide covers the same eleven topics in 17 pages and closes on a quick-reference sheet — industrial conditions, the reactivity series, solubility rules and the phrasings examiners accept.',
    linkLead: 'For how the papers are weighted and where the marks go, read',
    links: ['how-to-study-o-level-chemistry', 'o-level-chemistry', 'igcse-chemistry'],
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
    label: 'H2 Chemistry notes',
    heading: 'Are there free H2 Biology and H2 Chemistry notes?',
    answer:
      'H2 Chemistry, yes: 15 pages across all thirteen topics, from atomic structure and energetics through aqueous equilibria, organic chemistry and transition elements, then the Paper 4 practical skills — titration types, calorimetry, kinetics methods and qualitative analysis — and a sheet of the equations and constants worth memorising. It is written to syllabus 9729; the revised 9476 that school candidates sit from 2026 changes mark allocations, not the content. H2 Biology and H2 Physics notes are still being written, so the subject guides remain the fuller resource for those two.',
    linkLead: 'Start with',
    links: ['how-to-study-h2-chemistry', 'a-level-chemistry', 'a-level-biology', 'a-level-physics'],
  },
];
