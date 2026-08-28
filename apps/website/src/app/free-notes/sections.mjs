/**
 * Subject segmentation for /free-notes.
 *
 * The notes queries this page already appears for are almost entirely General
 * Paper and H2 sciences (GSC, 3 months to 2026-07-23). Only General Paper and
 * the two O-Level maths papers have notes today, so the H2 block says so
 * plainly and hands the reader to the subject guide that does cover the
 * material — claiming notes we do not host would be the one thing worse than
 * ranking without them.
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
    id: 'h2-sciences',
    label: 'H2 Biology, Chemistry and Physics notes',
    heading: 'Are there free H2 Biology and H2 Chemistry notes?',
    answer:
      'Not yet. The notes library covers General Paper and O-Level maths today, and H2 science notes are still being written. In the meantime the H2 subject guides cover the same syllabus content in full, and the JC shelf of free test papers carries 2024 prelim papers for H2 Biology, Chemistry, Physics, Maths and Economics.',
    linkLead: 'Start with',
    links: ['a-level-biology', 'a-level-chemistry', 'a-level-physics'],
  },
  {
    id: 'o-level',
    label: 'O-Level and secondary notes',
    heading: 'Are there free O-Level A-Math and E-Math notes?',
    answer:
      'Both maths papers, free to download: 17 pages on Additional Mathematics (syllabus 4049) and 16 on Elementary Mathematics (4052). Each carries a formula reference across every topic area \u2014 calculus, trigonometry and partial fractions on the A-Math side, mensuration, vectors, matrices and probability on the E-Math side \u2014 then the errors that cost marks and worked examples. No other O-Level subject has notes yet, so start from the subject guides.',
    linkLead: 'Start with',
    links: ['how-to-study-o-level-a-math', 'how-to-study-o-level-e-math', 'o-level-math', 'free-test-papers'],
  },
];
