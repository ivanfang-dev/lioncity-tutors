/**
 * FAQ content for /free-test-papers. Rendered as visible text on the page AND
 * emitted as FAQPage JSON-LD via GuideSchema — the two must always match, so
 * both read from here.
 *
 * The first three questions are phrased to match queries the page already
 * ranks top-10 for (GSC, 3 months to 2026-07-23): "o level prelim papers"
 * (position 7.9), "2024 prelim papers with answers" (6.2) and the JC paper
 * queries. Do not reword them.
 *
 * Every subject, year and school named below is checked against
 * src/data/testPapers.js.
 */
export const FREE_TEST_PAPERS_FAQS = [
  {
    question: 'Where can I download free O-Level prelim papers?',
    answer:
      'From the Secondary section on this page — every O-Level prelim paper here is free. Open a subject card, choose the Prelim tab, and enter an email address and contact number to unlock the file. Prelims run from 2022 to 2025 across English, E-Math, A-Math, Physics, Chemistry, Biology, Geography and History, and most of them are 2025 papers.',
  },
  {
    question: 'Are past year papers with answers available?',
    answer:
      'Yes, though not for every paper, and the title always says which. Many 2025 prelims ship with a separate answers file: E-Math, A-Math, Geography and History at O-Level, and H2 Mathematics, H2 Physics and H2 Chemistry at JC. The 2024 General Paper, H2 Biology and O-Level English prelims are marked "with Answers", and the 2024 H2 Physics and H2 Chemistry prelims from HCI and RI also have an answer file.',
  },
  {
    question: 'Which free test papers are available for JC and A-Level?',
    answer:
      'Six subjects at JC2 level: General Paper, H2 Mathematics, H2 Physics, H2 Chemistry, H2 Biology and H2 Economics. General Paper, H2 Mathematics, H2 Physics and H2 Chemistry have both 2025 and 2024 prelims; H2 Biology and H2 Economics have 2024 prelims. Physics has the deepest set, with 2024 papers from HCI, RI, NJC, ACJC, NYJC, CJC and RVHS and 2025 papers from six more schools. Economics is split into Paper 1 and Paper 2 from EJC and HCI.',
  },
  {
    question: 'Do you have free PSLE and primary school papers?',
    answer:
      'Yes — 2025 P6 Maths and P6 Chinese across WA1, WA2, SA1 and prelims, plus 2024 P6 English, Maths and Science and P5 English. Schools include Nanyang, Raffles Girls, Henry Park, Methodist Girls, Catholic High, Rosyth, Red Swastika, Nanhua, Tao Nan and SCGS. They are the schools’ own assessments rather than the national PSLE papers.',
  },
  {
    question: 'Are the papers really free to download?',
    answer:
      'Yes. There is no payment and no account to create: you enter an email address and a contact number, and the paper opens in a new tab. We use those details to send new papers and study resources, and parents who go on to request a tutor never pay an agency fee.',
  },
];
