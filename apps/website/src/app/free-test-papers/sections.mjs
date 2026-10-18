/**
 * Level segmentation for /free-test-papers.
 *
 * The page used to be one undifferentiated list, which left the generic
 * level-and-exam queries ("secondary free exam papers", "o level test papers",
 * "jc test papers") with nothing specific to match. Each entry is an
 * answer block: a question-shaped heading, then a direct answer describing
 * what the library actually holds for that level.
 *
 * `label` names the level in schema; `pill` is the short form on the hero jump
 * links, where the full label wrapped to three lines on a phone.
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
    pill: 'O-Level',
    heading: 'What secondary school and O-Level test papers are free to download?',
    answer:
      'Every O-Level paper here is free. Recent papers include 2025 Secondary 4 prelims in E-Math, A-Math, Physics, Chemistry, Geography and History, from schools such as Catholic High, CHIJ, Chung Cheng, Maris Stella, Anglican High and Methodist Girls, and Principles of Accounts prelims from 2022 to 2026, including 2026 papers from St Patrick\'s and Yuan Ching. Many come with answers. Earlier prelims cover English, Biology, E-Math, A-Math, Physics, Chemistry and Geography, plus SA1 papers in E-Math and Chemistry.',
    linkLead: 'Fitting practice papers into a revision plan is covered in the',
    hub: 'o-level-prep',
  },
  {
    id: 'n-level',
    label: 'N-Level papers',
    pill: 'N-Level',
    heading: 'Are there free N-Level test papers?',
    answer:
      'Yes, for N(A). The secondary shelf holds N(A) prelim papers in English, Science (Chemistry) and A-Math from 2025, Mathematics from 2024, and older A-Math and Principles of Accounts papers, from schools such as Ang Mo Kio, Bowen, Sengkang, Fairfield Methodist, Kuo Chuan Presbyterian, Crest and Woodgrove. There are no N(T) papers yet. N(A) students heading for O-Level in Secondary 5 can also work through the O-Level prelims here, which are the papers they will eventually sit.',
    linkLead: 'For the N-Level route itself, including the Secondary 5 decision, read the',
    hub: 'n-level-prep',
  },
  {
    id: 'a-level',
    label: 'JC and A-Level prelim papers',
    pill: 'A-Level',
    heading: 'What JC and A-Level test papers can I download?',
    answer:
      'The JC shelf holds JC2 prelim papers from 2025 and 2024. The 2025 prelims cover General Paper, H2 Mathematics, H2 Physics and H2 Chemistry, from Hwa Chong, Anglo Chinese, Anderson, Catholic, Dunman and Eunoia among others, and the H2 papers mostly come with a separate answers file. The 2024 prelims add H2 Biology and H2 Economics, from HCI, RI, ACJC, NJC, NYJC, EJC, VJC, CJC and RVHS.',
    linkLead: 'To place these papers in a two-year H2 timeline, see the',
    hub: 'a-level-prep',
  },
  {
    id: 'psle',
    label: 'PSLE and primary school papers',
    pill: 'PSLE',
    heading: 'What free PSLE and primary school papers are available?',
    answer:
      'Primary papers are school assessments set by the schools themselves, not the national PSLE papers. The 2025 shelf covers P6 Maths and P6 Chinese across WA1, WA2, SA1 and prelims, from schools such as Raffles, Rosyth, Nanyang, Henry Park, Catholic High and Tao Nan, and most P6 Maths papers include answers. The 2024 shelf adds P6 English, Maths and Science and P5 English, from Nanyang, Raffles Girls, Methodist Girls and SCGS.',
    linkLead: 'For how the school year builds towards the exam, see the',
    hub: 'psle-prep',
  },
];
