import { LEVEL_SUBJECT_MAPPINGS } from '@lioncity/shared/client-exports.js';

// Chip options for the request form's "Level & Subject" picker. Subject `name`s are the
// shared canonical names, so a request reads the same as the assignment wizard's lists.

const sg = (name, label) => ({ name, label });

const MOTHER_TONGUES = [sg('Chinese', 'Chinese'), sg('Malay', 'Malay'), sg('Tamil', 'Tamil')];

// `years` restricts a chip to some years; `canonical` is the shared level whose list filters the chips.
export const LEVELS = [
  {
    id: 'preschool', label: 'Pre-school',
    years: ['N1', 'N2', 'K1', 'K2'].map((y) => ({ id: y, label: y, name: `Pre-School ${y}`, canonical: 'Pre-School' })),
    subjects: [sg('English Language', 'English'), sg('Phonics', 'Phonics'), sg('Mathematics', 'Math'), ...MOTHER_TONGUES],
  },
  {
    id: 'primary', label: 'Primary',
    years: [1, 2, 3, 4, 5, 6].map((n) => ({ id: `P${n}`, label: `P${n}`, name: `Primary ${n}`, canonical: `Primary ${n}` })),
    subjects: [sg('English Language', 'English'), sg('Mathematics', 'Math'), sg('Science', 'Science'), ...MOTHER_TONGUES],
  },
  {
    id: 'secondary', label: 'Secondary', hasStream: true,
    years: [1, 2, 3, 4, 5].map((n) => ({ id: `S${n}`, label: `Sec ${n}`, name: `Secondary ${n}`, canonical: `Secondary ${n}` })),
    subjects: [
      sg('English Language', 'English'),
      { ...sg('Mathematics', 'Math'), years: ['S1', 'S2'] },
      sg('Elementary Mathematics', 'E-Math'),
      sg('Additional Mathematics', 'A-Math'),
      sg('Science', 'Science'),
      sg('Physics', 'Physics'),
      sg('Chemistry', 'Chemistry'),
      sg('Biology', 'Biology'),
      sg('Combined Science (Physics/Chemistry)', 'Combined Sci (Phy/Chem)'),
      sg('Combined Science (Chemistry/Biology)', 'Combined Sci (Chem/Bio)'),
      ...MOTHER_TONGUES,
      sg('Literature in English', 'Literature'),
      sg('History', 'History'),
      sg('Geography', 'Geography'),
      sg('Principles of Accounts', 'POA'),
    ],
  },
  {
    id: 'jc', label: 'JC',
    years: [1, 2].map((n) => ({ id: `J${n}`, label: `JC${n}`, name: `Junior College ${n}`, canonical: `Junior College ${n}` })),
    subjects: [
      sg('General Paper', 'GP'),
      sg('H2 Mathematics', 'H2 Math'),
      sg('H1 Mathematics', 'H1 Math'),
      sg('H2 Physics', 'H2 Physics'),
      sg('H2 Chemistry', 'H2 Chem'),
      sg('H2 Biology', 'H2 Bio'),
      sg('H2 Economics', 'H2 Econs'),
      sg('H1 Economics', 'H1 Econs'),
      sg('Chinese Language', 'Chinese'),
    ],
  },
  {
    // No shared list covers IGCSE or MYP, so these chips are plain names.
    id: 'ib-igcse', label: 'IB / IGCSE',
    years: [
      { id: 'IGCSE', label: 'IGCSE', name: 'IGCSE' },
      { id: 'MYP', label: 'IB MYP', name: 'IB MYP' },
      { id: 'DP', label: 'IB Diploma', name: 'IB Diploma' },
    ],
    subjects: ['Mathematics', 'English', 'Physics', 'Chemistry', 'Biology', 'Economics', 'Chinese']
      .map((s) => sg(s, s === 'Mathematics' ? 'Math' : s)),
  },
  {
    // Matching doesn't cover these yet; the owner reads the course text and matches by hand.
    id: 'ite-poly', label: 'ITE / Poly', textOnly: 'Course and module',
    years: [
      { id: 'ITE', label: 'ITE', name: 'ITE' },
      { id: 'POLY', label: 'Polytechnic', name: 'Polytechnic' },
    ],
    subjects: [],
  },
  { id: 'other', label: 'Other', textOnly: 'What do they need help with?', years: [], subjects: [] },
];

export const STREAMS = [
  { id: 'G3', label: 'G3 / Express' },
  { id: 'G2', label: 'G2 / NA' },
  { id: 'G1', label: 'G1 / NT' },
  { id: 'IP', label: 'IP' },
];

export const emptyStudent = () => ({ level: '', year: '', stream: '', subjects: [], other: '' });

export const levelFor = (levelId) => LEVELS.find((l) => l.id === levelId) || null;

export const yearsFor = (levelId) => levelFor(levelId)?.years || [];

const yearFor = (levelId, yearId) => yearsFor(levelId).find((y) => y.id === yearId) || null;

export const subjectsFor = (levelId, yearId) => {
  const level = levelFor(levelId);
  if (!level) return [];
  const offered = LEVEL_SUBJECT_MAPPINGS[yearFor(levelId, yearId)?.canonical];
  return level.subjects.filter((s) =>
    (!s.years || s.years.includes(yearId)) && (!offered || offered.includes(s.name)));
};

// A new level starts clean; the Other text is kept since it's the parent's own words.
export const selectLevel = (student, levelId) =>
  student.level === levelId ? student : { ...emptyStudent(), level: levelId, other: student.other };

export const selectYear = (student, yearId) => {
  const available = subjectsFor(student.level, yearId).map((s) => s.name);
  return { ...student, year: yearId, subjects: student.subjects.filter((s) => available.includes(s)) };
};

export const studentError = (student) => {
  const level = levelFor(student.level);
  if (!level) return "Choose the student's level.";
  if (level.years.length && !yearFor(level.id, student.year)) return 'Choose the year.';
  const hasOther = student.other.trim() !== '';
  if (level.textOnly) {
    if (hasOther) return null;
    return level.years.length ? 'Tell us the course or module.' : 'Tell us what they need help with.';
  }
  return student.subjects.length || hasOther ? null : 'Pick at least one subject.';
};

// One line per subject, e.g. "Secondary 3 Additional Mathematics (G3 / Express)".
export const toLevelSubjects = (students) => students.flatMap((student) => {
  if (studentError(student)) return [];
  const year = yearFor(student.level, student.year);
  const stream = levelFor(student.level).hasStream && STREAMS.find((s) => s.id === student.stream);
  const line = (subject) => [year?.name, subject, stream && `(${stream.label})`].filter(Boolean).join(' ');
  const other = student.other.trim();
  return [...student.subjects, ...(other ? [other] : [])].map(line);
});

// Drafts saved before the picker held free-text strings; they come back as Other text.
export const fromLegacy = (levelSubjects) => {
  const text = (levelSubjects || []).map((s) => s.trim()).filter(Boolean).join('; ');
  return [text ? { ...emptyStudent(), level: 'other', other: text } : emptyStudent()];
};

// A page's partial preset, e.g. { level: 'primary', year: 'P6' }, as form overrides.
export const presetOverrides = (student) =>
  (student ? { students: [{ ...emptyStudent(), ...student }] } : undefined);
