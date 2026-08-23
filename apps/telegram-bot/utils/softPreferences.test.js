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
