import { describe, test, expect } from '@jest/globals';
import { preferenceFactor, findMatchingTutorsForWave, shortlistScore } from './tutorMatcher.js';

const assignment = {
  level: 'Secondary 3', subject: 'Mathematics', title: 'Sec 3 Maths',
  location: 'Bishan', rate: '$50/hr',
  preferredGender: 'Female',
  preferredTutorTypes: ['Full-time'],
};

describe('preferenceFactor', () => {
  test('no penalty when the tutor matches both stated preferences', () => {
    expect(preferenceFactor({ gender: 'Female', tutorType: 'Full-time Tutor' }, assignment)).toBe(1);
  });

  test('no penalty when the parent stated no preference', () => {
    const open = { ...assignment, preferredGender: 'No preference', preferredTutorTypes: [] };
    expect(preferenceFactor({ gender: 'Male', tutorType: 'Part-time Tutor' }, open)).toBe(1);
  });

  test('penalises a gender mismatch', () => {
    expect(preferenceFactor({ gender: 'Male', tutorType: 'Full-time Tutor' }, assignment)).toBeLessThan(1);
  });

  test('penalises a tutor-type mismatch', () => {
    expect(preferenceFactor({ gender: 'Female', tutorType: 'Part-time Tutor' }, assignment)).toBeLessThan(1);
  });

  test('missing tutor data is not penalised — we only penalise a known mismatch', () => {
    expect(preferenceFactor({}, assignment)).toBe(1);
  });

  test('missing both preferences compounds below either alone', () => {
    const both = preferenceFactor({ gender: 'Male', tutorType: 'Part-time Tutor' }, assignment);
    const genderOnly = preferenceFactor({ gender: 'Male', tutorType: 'Full-time Tutor' }, assignment);
    expect(both).toBeLessThan(genderOnly);
  });
});

describe('shortlistScore respects stated preferences', () => {
  const base = {
    yearsOfExperience: '3-5 years',
    hourlyRate: { secondary: '$40/hr' },
    teachingLevels: { secondary: { mathematics: true } },
  };

  test('a preference-matching tutor outranks an identical relaxed-in one', () => {
    const match = shortlistScore({ ...base, gender: 'Female', tutorType: 'Full-time Tutor' }, assignment);
    const relaxed = shortlistScore({ ...base, gender: 'Male', tutorType: 'Full-time Tutor' }, assignment);
    expect(match).toBeGreaterThan(relaxed);
  });
});

// Fake Tutor model that honours the gender / tutorType clauses, so a strict query returns a
// different set than a relaxed one — which is the whole behaviour under test.
function fakeModel(docs) {
  const calls = [];
  const matches = (doc, query) => {
    if (query.gender && doc.gender !== query.gender) return false;
    if (query.tutorType?.$in && !query.tutorType.$in.includes(doc.tutorType)) return false;
    return true;
  };
  return {
    calls,
    countDocuments: async () => docs.length,
    find: (query) => {
      calls.push(query);
      const hits = docs.filter(d => matches(d, query));
      const chain = { select: () => chain, sort: () => chain, limit: () => chain, lean: async () => hits };
      return chain;
    },
  };
}

function tutor(id, { gender, tutorType }) {
  return {
    _id: id, fullName: id, gender, tutorType,
    yearsOfExperience: '3-5 years',
    hourlyRate: { secondary: '$40/hr' },
    teachingLevels: { secondary: { mathematics: true } },
    responseStats: { contacted: 10, responded: 8 },
  };
}

describe('soft-preference relaxation when the pool is too thin', () => {
  const female = (n) => Array.from({ length: n }, (_, i) => tutor(`f${i}`, { gender: 'Female', tutorType: 'Full-time Tutor' }));
  const male = (n) => Array.from({ length: n }, (_, i) => tutor(`m${i}`, { gender: 'Male', tutorType: 'Full-time Tutor' }));

  test('a healthy strict pool is used as-is, with nothing relaxed', async () => {
    const model = fakeModel([...female(12), ...male(12)]);
    const { scored, relaxed } = await findMatchingTutorsForWave(assignment, 40, { model });
    expect(relaxed).toEqual([]);
    expect(scored.every(s => s.tutor.gender === 'Female')).toBe(true);
  });

  test('a thin strict pool pulls in tutors who miss the stated preferences', async () => {
    const model = fakeModel([...female(2), ...male(12)]);
    const { scored, relaxed } = await findMatchingTutorsForWave(assignment, 40, { model });
    expect(relaxed).toContain('gender');
    expect(scored.length).toBeGreaterThan(2);
  });

  test('relaxed-in tutors rank below the ones who actually match', async () => {
    const model = fakeModel([...female(2), ...male(12)]);
    const { scored } = await findMatchingTutorsForWave(assignment, 40, { model });
    expect(scored.slice(0, 2).every(s => s.tutor.gender === 'Female')).toBe(true);
  });

  test('nothing is relaxed when the parent stated no preferences to relax', async () => {
    const open = { ...assignment, preferredGender: 'No preference', preferredTutorTypes: [] };
    const model = fakeModel(female(1));
    const { relaxed } = await findMatchingTutorsForWave(open, 40, { model });
    expect(relaxed).toEqual([]);
  });
});

// --- "One tutor for every subject" (soft AND) -------------------------------
// A multi-subject request where the parent wants ONE tutor filters on tutors who cover all of
// them, but that pool can be tiny — so it relaxes to "any of them" rather than sending nothing.

const get = (doc, path) => path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), doc);

// Enough of a Mongo matcher for the clauses buildFilterStages actually emits.
function matchesQuery(doc, query) {
  return Object.entries(query).every(([key, cond]) => {
    if (key === '$or') return cond.some(c => matchesQuery(doc, c));
    if (key === '$and') return cond.every(c => matchesQuery(doc, c));
    const value = get(doc, key);
    if (cond && typeof cond === 'object' && !Array.isArray(cond)) {
      if ('$in' in cond) return cond.$in.includes(value);
      if ('$nin' in cond) return !cond.$nin.includes(value);
    }
    if (cond === null) return value == null;
    return value === cond;
  });
}

function queryingModel(docs) {
  return {
    countDocuments: async () => docs.length,
    find: (query) => {
      const hits = docs.filter(d => matchesQuery(d, query));
      const chain = { select: () => chain, sort: () => chain, limit: () => chain, lean: async () => hits };
      return chain;
    },
  };
}

describe('allSubjects relaxation when too few tutors cover everything', () => {
  const multi = {
    level: 'Primary 5', subject: 'Multiple Subjects', title: 'P5 Maths and Science',
    location: 'Bishan', rate: '$40/hr',
    subjects: ['Mathematics', 'Science'],
  };

  const primaryTutor = (id, { science, gender }) => ({
    _id: id, fullName: id, gender,
    contactNumber: '81234567',
    locations: { central: true },
    yearsOfExperience: '3-5 years',
    hourlyRate: { primary: '$35/hr' },
    tutorType: 'Full-time Tutor',
    teachingLevels: { primary: { mathematics: true, science } },
    responseStats: { contacted: 10, responded: 8 },
  });

  const both = (n, gender) => Array.from({ length: n }, (_, i) => primaryTutor(`b${gender || ''}${i}`, { science: true, gender }));
  const mathOnly = (n) => Array.from({ length: n }, (_, i) => primaryTutor(`m${i}`, { science: false }));

  test('a healthy all-covering pool is used as-is, with nothing relaxed', async () => {
    const model = queryingModel([...both(12), ...mathOnly(12)]);
    const { scored, relaxed } = await findMatchingTutorsForWave(multi, 40, { model });
    expect(relaxed).toEqual([]);
    expect(scored).toHaveLength(12);
    expect(scored.every(s => s.tutor.teachingLevels.primary.science)).toBe(true);
  });

  test('a thin all-covering pool falls back to tutors who cover any of the subjects', async () => {
    const model = queryingModel([...both(2), ...mathOnly(12)]);
    const { scored, relaxed } = await findMatchingTutorsForWave(multi, 40, { model });
    expect(relaxed).toEqual(['allSubjects']);
    expect(scored.length).toBeGreaterThan(2);
  });

  test('relaxed-in partial-coverage tutors rank below the ones who cover everything', async () => {
    const model = queryingModel([...both(2), ...mathOnly(12)]);
    const { scored } = await findMatchingTutorsForWave(multi, 40, { model });
    expect(scored.slice(0, 2).every(s => s.tutor.teachingLevels.primary.science)).toBe(true);
  });

  test('a stated gender preference is given up before the one-tutor requirement', async () => {
    // 2 female all-rounders is too thin; 14 all-rounders is not. Dropping gender is enough,
    // so the parent still gets one tutor for both subjects.
    const model = queryingModel([...both(2, 'Female'), ...both(12, 'Male'), ...mathOnly(12)]);
    const { scored, relaxed } = await findMatchingTutorsForWave(
      { ...multi, preferredGender: 'Female' }, 40, { model }
    );
    expect(relaxed).toEqual(['gender']);
    expect(scored.every(s => s.tutor.teachingLevels.primary.science)).toBe(true);
  });

  test('both are given up when dropping the gender preference is still not enough', async () => {
    const model = queryingModel([...both(2, 'Female'), ...mathOnly(12)]);
    const { relaxed } = await findMatchingTutorsForWave(
      { ...multi, preferredGender: 'Female' }, 40, { model }
    );
    expect(relaxed).toEqual(['allSubjects', 'gender']);
  });

  test('nothing to relax when the subjects were only guessed from the title', async () => {
    const model = queryingModel([...both(1), ...mathOnly(12)]);
    const { relaxed } = await findMatchingTutorsForWave({ ...multi, subjects: undefined }, 40, { model });
    expect(relaxed).toEqual([]);
  });
});
