/**
 * 2026 Singapore national examination dates.
 *
 * Single source of truth for every timetable surface on the site. Never inline
 * an exam date in a page — import from here so a correction lands everywhere.
 *
 * Sources (retrieved 2026-07-26, calendars updated as at 13 February 2026):
 *   https://file.go.gov.sg/2026-psle-exam-cal.pdf
 *   https://file.go.gov.sg/2026-o-level-exam-cal.pdf
 *   https://file.go.gov.sg/2026-n-level-exam-cal.pdf
 *   https://file.go.gov.sg/2026-a-level-exam-cal.pdf
 *   https://www.seab.gov.sg/important-dates-for-candidates/
 */

export const EXAM_CALENDAR_2026 = {
  psle: {
    slug: 'psle',
    label: 'PSLE',
    examWindow: { start: '2026-08-12', end: '2026-09-30' },
    resultsWindow: { start: '2026-11-24', end: '2026-11-25' },
    subjects: [
      {
        slug: 'english',
        name: 'English Language',
        papers: [
          { label: 'Oral', date: '2026-08-12', time: '0800–1330h', note: 'Also held 13 August' },
          { label: 'Listening Comprehension', date: '2026-09-15', time: '1115–1150h' },
          { label: 'Paper 1 (Writing)', date: '2026-09-24', time: '0815–0925h' },
          { label: 'Paper 2 (Comprehension)', date: '2026-09-24', time: '1030–1220h' },
        ],
      },
      {
        slug: 'math',
        name: 'Mathematics',
        papers: [
          { label: 'Paper 1', date: '2026-09-25', time: '0815–0925h' },
          { label: 'Paper 2', date: '2026-09-25', time: '1030–1150h' },
        ],
      },
      {
        slug: 'mother-tongue',
        name: 'Mother Tongue Languages',
        papers: [
          { label: 'Oral', date: '2026-08-13', time: '0800–1330h' },
          { label: 'Listening Comprehension', date: '2026-09-15', time: '0900–0935h' },
          { label: 'Paper 1', date: '2026-09-28', time: '0815–0905h' },
          { label: 'Paper 2', date: '2026-09-28', time: '1015–1155h' },
        ],
      },
      {
        slug: 'science',
        name: 'Science',
        papers: [{ label: 'Paper 1', date: '2026-09-29', time: '0815–1000h' }],
      },
      {
        slug: 'higher-mother-tongue',
        name: 'Higher Mother Tongue',
        papers: [
          { label: 'Paper 1', date: '2026-09-30', time: '0815–0905h' },
          { label: 'Paper 2', date: '2026-09-30', time: '1015–1135h' },
        ],
      },
    ],
  },

  'o-level': {
    slug: 'o-level',
    label: 'GCE O-Level',
    examWindow: { start: '2026-06-02', end: '2026-11-10' },
    resultsWindow: { start: '2027-01-13', end: '2027-01-15' },
    subjects: [
      {
        slug: 'english',
        name: 'English Language',
        code: '1184',
        papers: [
          { label: 'Oral', date: '2026-07-13', note: 'Also held 14 and 17 July' },
          { label: 'Listening Comprehension', date: '2026-10-15', time: '1400–1445h' },
          { label: 'Paper 1', date: '2026-10-19', time: '1330–1520h' },
          { label: 'Paper 2', date: '2026-10-19', time: '1605–1755h' },
        ],
      },
      {
        slug: 'math',
        name: 'Mathematics (E-Math)',
        code: '4052',
        papers: [
          { label: 'Paper 1', date: '2026-10-21', time: '1400–1615h' },
          { label: 'Paper 2', date: '2026-10-23', time: '1430–1645h' },
        ],
      },
      {
        slug: 'additional-math',
        name: 'Additional Mathematics (A-Math)',
        code: '4049',
        papers: [
          { label: 'Paper 1', date: '2026-10-26', time: '1400–1615h' },
          { label: 'Paper 2', date: '2026-10-28', time: '0800–1015h' },
        ],
      },
      {
        slug: 'chemistry',
        name: 'Chemistry',
        code: '6092',
        papers: [
          { label: 'Paper 3 (Practical)', date: '2026-09-30', note: 'Four shifts, 0800–1650h' },
          { label: 'Paper 2', date: '2026-10-27', time: '1400–1545h' },
          { label: 'Paper 1 (MCQ)', date: '2026-11-06', time: '0800–0900h' },
        ],
      },
      {
        slug: 'physics',
        name: 'Physics',
        code: '6091',
        papers: [
          { label: 'Paper 3 (Practical)', date: '2026-10-05', note: 'Four shifts, 0800–1650h' },
          { label: 'Paper 2', date: '2026-10-29', time: '1400–1545h' },
          { label: 'Paper 1 (MCQ)', date: '2026-11-06', time: '1430–1530h' },
        ],
      },
      {
        slug: 'biology',
        name: 'Biology',
        code: '6093',
        papers: [
          { label: 'Paper 3 (Practical)', date: '2026-10-13', note: 'Four shifts, 0800–1650h' },
          { label: 'Paper 2', date: '2026-10-30', time: '0800–0945h' },
          { label: 'Paper 1 (MCQ)', date: '2026-11-10', time: '1400–1500h' },
        ],
      },
      {
        slug: 'combined-science-phy-chem',
        name: 'Combined Science (Physics/Chemistry)',
        code: '5086',
        papers: [
          { label: 'Paper 3 (Chemistry)', date: '2026-10-27', time: '1400–1515h' },
          { label: 'Paper 2 (Physics)', date: '2026-10-29', time: '1400–1515h' },
          { label: 'Paper 1 (MCQ)', date: '2026-11-10', time: '0800–0900h' },
        ],
      },
      {
        slug: 'combined-science-phy-bio',
        name: 'Combined Science (Physics/Biology)',
        code: '5087',
        papers: [
          { label: 'Paper 2 (Physics)', date: '2026-10-29', time: '1400–1515h' },
          { label: 'Paper 4 (Biology)', date: '2026-10-30', time: '0800–0915h' },
          { label: 'Paper 1 (MCQ)', date: '2026-11-10', time: '0800–0900h' },
        ],
      },
      {
        slug: 'combined-science-chem-bio',
        name: 'Combined Science (Chemistry/Biology)',
        code: '5088',
        papers: [
          { label: 'Paper 3 (Chemistry)', date: '2026-10-27', time: '1400–1515h' },
          { label: 'Paper 4 (Biology)', date: '2026-10-30', time: '0800–0915h' },
          { label: 'Paper 1 (MCQ)', date: '2026-11-10', time: '0800–0900h' },
        ],
      },
      {
        slug: 'mother-tongue',
        name: 'Mother Tongue Languages',
        papers: [
          { label: 'Written papers', date: '2026-06-02', time: '0800–1230h' },
          { label: 'Listening Comprehension', date: '2026-07-07', time: '1400–1630h' },
        ],
      },
    ],
  },

  'n-level': {
    slug: 'n-level',
    label: 'GCE N-Level',
    examWindow: { start: '2026-07-13', end: '2026-10-13' },
    resultsWindow: { start: '2026-12-17', end: '2026-12-21' },
    subjects: [
      // N(A) and N(T) are separate tracks with distinct syllabus codes and
      // distinct papers, so they are modelled as separate subjects rather than
      // merged. Never present an N(A) date to an N(T) candidate.
      {
        slug: 'english-na',
        name: 'English Language N(A) — Syllabus A',
        code: '1190',
        papers: [
          { label: 'Oral', date: '2026-07-13', note: 'Also held 17 July' },
          { label: 'Paper 1 (Writing)', date: '2026-09-14', time: '0800–0950h' },
          { label: 'Paper 2 (Comprehension)', date: '2026-09-14', time: '1035–1225h' },
          { label: 'Paper 3 (Listening)', date: '2026-09-15', time: '1400–1445h' },
        ],
      },
      {
        slug: 'english-nt',
        name: 'English Language N(T) — Syllabus T',
        code: '1195',
        papers: [
          { label: 'Oral', date: '2026-07-14', note: 'Also held 17 July' },
          { label: 'Paper 1 (Writing)', date: '2026-09-14', time: '0800–0920h' },
          { label: 'Paper 2 (Comprehension)', date: '2026-09-14', time: '1035–1155h' },
          { label: 'Paper 3 (Listening)', date: '2026-09-16', time: '1400–1445h' },
        ],
      },
      {
        slug: 'math-na',
        name: 'Mathematics N(A) — Syllabus A',
        code: '4045',
        papers: [
          { label: 'Paper 1', date: '2026-10-05', time: '0800–1000h' },
          { label: 'Paper 2', date: '2026-10-07', time: '0800–1000h' },
        ],
      },
      {
        slug: 'math-nt',
        name: 'Mathematics N(T) — Syllabus T',
        code: '4046',
        papers: [
          { label: 'Paper 1', date: '2026-10-06', time: '1400–1530h' },
          { label: 'Paper 2', date: '2026-10-09', time: '0800–0930h' },
        ],
      },
      {
        slug: 'chinese',
        name: 'Chinese Language',
        code: '1196',
        papers: [
          { label: 'Oral', date: '2026-07-14', note: 'Also held 15 and 16 July' },
          { label: 'Paper 1', date: '2026-09-17', time: '0800–1000h' },
        ],
      },
      {
        slug: 'combined-science-phy-chem',
        name: 'Combined Science (Physics/Chemistry)',
        code: '5105',
        papers: [
          { label: 'Papers 1 & 2 (Physics)', date: '2026-10-06', time: '0800–0915h' },
          { label: 'Papers 3 & 4 (Chemistry)', date: '2026-10-08', time: '0800–0915h' },
        ],
      },
      {
        slug: 'combined-science-phy-bio',
        name: 'Combined Science (Physics/Biology)',
        code: '5106',
        papers: [
          { label: 'Papers 1 & 2 (Physics)', date: '2026-10-06', time: '0800–0915h' },
          { label: 'Papers 5 & 6 (Biology)', date: '2026-10-12', time: '0800–0915h' },
        ],
      },
      {
        slug: 'combined-science-chem-bio',
        name: 'Combined Science (Chemistry/Biology)',
        code: '5107',
        papers: [
          { label: 'Papers 3 & 4 (Chemistry)', date: '2026-10-08', time: '0800–0915h' },
          { label: 'Papers 5 & 6 (Biology)', date: '2026-10-12', time: '0800–0915h' },
        ],
      },
    ],
  },

  'a-level': {
    slug: 'a-level',
    label: 'GCE A-Level',
    examWindow: { start: '2026-06-02', end: '2026-11-27' },
    resultsWindow: { start: '2027-02-19', end: '2027-02-23' },
    subjects: [
      {
        slug: 'general-paper',
        name: 'General Paper',
        code: '8881',
        papers: [
          { label: 'Paper 1', date: '2026-11-02', time: '0800–0930h' },
          { label: 'Paper 2', date: '2026-11-04', time: '0800–0930h' },
        ],
      },
      {
        slug: 'h2-math',
        name: 'H2 Mathematics',
        code: '9758',
        papers: [
          { label: 'Paper 1', date: '2026-11-03', time: '0800–1100h' },
          { label: 'Paper 2', date: '2026-11-06', time: '0800–1100h' },
        ],
      },
      {
        slug: 'h1-math',
        name: 'H1 Mathematics',
        code: '8865',
        papers: [{ label: 'Paper 1', date: '2026-11-03', time: '0800–1100h' }],
      },
      {
        slug: 'h2-chemistry',
        name: 'H2 Chemistry',
        code: '9476',
        legacyCode: '9729',
        papers: [
          { label: 'Paper 4 (Practical)', date: '2026-10-14', note: 'Three shifts, 0800–1700h' },
          { label: 'Paper 2', date: '2026-11-10', time: '1400–1600h' },
          { label: 'Paper 3', date: '2026-11-12', time: '0800–1000h' },
          { label: 'Paper 1', date: '2026-11-23', time: '1400–1500h' },
        ],
      },
      {
        slug: 'h2-physics',
        name: 'H2 Physics',
        code: '9478',
        legacyCode: '9749',
        papers: [
          { label: 'Paper 4 (Practical)', date: '2026-10-19', note: 'Three shifts, 0800–1700h' },
          { label: 'Paper 2', date: '2026-11-13', time: '0800–1000h' },
          { label: 'Paper 3', date: '2026-11-17', time: '1400–1600h' },
          { label: 'Paper 1', date: '2026-11-27', time: '0800–0900h' },
        ],
      },
      {
        slug: 'h2-biology',
        name: 'H2 Biology',
        code: '9477',
        legacyCode: '9744',
        papers: [
          { label: 'Paper 4 (Practical)', date: '2026-10-22', note: 'Three shifts, 0800–1700h' },
          { label: 'Paper 2', date: '2026-11-18', time: '0800–1000h' },
          { label: 'Paper 3', date: '2026-11-20', time: '1430–1630h' },
          { label: 'Paper 1', date: '2026-11-26', time: '1400–1500h' },
        ],
      },
      {
        slug: 'h2-economics',
        name: 'H2 Economics',
        code: '9570',
        papers: [
          { label: 'Paper 1', date: '2026-11-05', time: '1400–1630h' },
          { label: 'Paper 2', date: '2026-11-16', time: '0800–1030h' },
        ],
      },
      {
        slug: 'h1-economics',
        name: 'H1 Economics',
        code: '8843',
        papers: [{ label: 'Paper 1', date: '2026-11-05', time: '1400–1700h' }],
      },
    ],
  },
};

export function getExam(slug) {
  return EXAM_CALENDAR_2026[slug];
}

export function getSubjectPapers(examSlug, subjectSlug) {
  const exam = getExam(examSlug);
  if (!exam) return [];
  const subject = exam.subjects.find((s) => s.slug === subjectSlug);
  return subject ? subject.papers : [];
}
