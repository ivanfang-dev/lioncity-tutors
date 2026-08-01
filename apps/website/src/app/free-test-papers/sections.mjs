/**
 * Level segmentation for /free-test-papers.
 *
 * The page used to be one undifferentiated list, which left the generic
 * level-and-exam queries ("secondary free exam papers", "o level test papers",
 * "jc test papers") with nothing specific to match. Each entry is an
 * answer block: a question-shaped heading, then a direct answer describing
 * what the library actually holds for that level.
 *
 * `hub` names the exam-prep hub this level belongs to. Anchor text for that
 * link is read from the registry at render time, never written here.
 *
 * Facts in `answer` are checked against src/data/testPapers.js — subjects,
 * years and school names must all appear there. Counts are deliberately absent
 * so the copy cannot go stale; the visible numbers come from stats.js.
 */
export const PAPER_SECTIONS = [
  {
    id: 'o-level',
    label: 'O-Level and secondary school papers',
    heading: 'What secondary school and O-Level test papers are free to download?',
    answer:
      'Every O-Level paper here is free. The shelf covers school prelim papers in English, E-Math, A-Math, Physics, Chemistry and Biology, plus earlier SA1 papers in E-Math and Chemistry. Most are 2024 prelims from schools such as ACS, CHIJ, Methodist Girls, Nanyang Girls, SJI and Xinmin, and several arrive with answers.',
    linkLead: 'Fitting practice papers into a revision plan is covered in the',
    hub: 'o-level-prep',
  },
  {
    id: 'n-level',
    label: 'N-Level papers',
    heading: 'Are there free N-Level test papers?',
    answer:
      'Not yet. The secondary shelf holds Secondary 4 O-Level school papers, and there are no N(A) or N(T) papers in the library today. N-Level students heading for O-Level in Secondary 5 can still work through the O-Level prelims in this library, which are the papers they will eventually sit.',
    linkLead: 'For the N-Level route itself, including the Secondary 5 decision, read the',
    hub: 'n-level-prep',
  },
  {
    id: 'a-level',
    label: 'JC and A-Level prelim papers',
    heading: 'What JC and A-Level test papers can I download?',
    answer:
      'The JC shelf is entirely 2024 JC2 prelim papers: General Paper, H2 Mathematics, H2 Physics, H2 Chemistry, H2 Biology and H2 Economics. They come from HCI, RI, ACJC, NJC, NYJC, EJC, VJC, CJC and RVHS, and most of the science and General Paper prelims include answers.',
    linkLead: 'To place these papers in a two-year H2 timeline, see the',
    hub: 'a-level-prep',
  },
  {
    id: 'psle',
    label: 'PSLE and primary school papers',
    heading: 'What free PSLE and primary school papers are available?',
    answer:
      'Primary papers are 2024 school assessments: P6 English, Maths and Science, and P5 English, from Nanyang, Raffles Girls, Henry Park, Methodist Girls, Catholic High, Tao Nan and SCGS. These are WA1 and SA2 papers set by the schools themselves rather than the national PSLE papers.',
    linkLead: 'For how the school year builds towards the exam, see the',
    hub: 'psle-prep',
  },
];
