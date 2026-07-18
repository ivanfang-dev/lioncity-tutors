import { describe, test, expect } from '@jest/globals';
import { findMatchingTutorsScored } from './tutorMatcher.js';

// Phase 10 step 4: a small boost for unproven-but-decent newcomers (0 lifetime placements, decent
// profile), and exposure-capped tutors excluded from the fetch. Assignment maps to secondary/central.
const assignment = {
  level: 'Secondary 3', subject: 'Mathematics', title: 'Sec 3 Maths', location: 'Bishan', rate: '$50/hr',
};

function tutor(id, { placed, qualityGrade }) {
  return {
    _id: id,
    fullName: id,
    yearsOfExperience: '3-5 years',
    hourlyRate: { secondary: '$40/hr' },
    tutorType: 'Part-time Tutor',
    responseStats: { contacted: 10, responded: 8 },
    profileFeatures: qualityGrade == null ? undefined : { qualityGrade },
    stats: placed == null ? undefined : { placed },
  };
}

function fakeModel(docs) {
  const captured = {};
  const chain = { select: () => chain, sort: () => chain, limit: () => chain, lean: async () => docs };
  return {
    _captured: captured,
    countDocuments: async () => docs.length,
    find: (query) => { captured.query = query; return chain; },
  };
}

describe('newcomer boost', () => {
  test('a 0-placement decent-profile tutor outranks an otherwise-identical proven one', async () => {
    const proven = tutor('proven', { placed: 5, qualityGrade: 5 });
    const newcomer = tutor('newcomer', { placed: 0, qualityGrade: 5 });
    const scored = await findMatchingTutorsScored(assignment, 40, { model: fakeModel([proven, newcomer]) });
    expect(scored.map(s => s.tutor._id)).toEqual(['newcomer', 'proven']);
  });

  test('no boost for a newcomer with a weak profile', async () => {
    const proven = tutor('proven', { placed: 5, qualityGrade: 5 });      // strong, proven
    const weakNew = tutor('weakNew', { placed: 0, qualityGrade: 1 });    // newcomer but weak profile
    const scored = await findMatchingTutorsScored(assignment, 40, { model: fakeModel([proven, weakNew]) });
    expect(scored[0].tutor._id).toBe('proven'); // weak newcomer isn't lifted over a strong proven tutor
  });

  test('absent stats is treated as zero placements (still a newcomer)', async () => {
    const proven = tutor('proven', { placed: 3, qualityGrade: 5 });
    const noStats = tutor('noStats', { placed: null, qualityGrade: 5 }); // no stats subdoc at all
    const scored = await findMatchingTutorsScored(assignment, 40, { model: fakeModel([proven, noStats]) });
    expect(scored[0].tutor._id).toBe('noStats');
  });
});

describe('exposure-cap exclusion', () => {
  test('excludeTutorIds becomes an _id $nin on the fetch query', async () => {
    const model = fakeModel([tutor('a', { placed: 1, qualityGrade: 4 })]);
    await findMatchingTutorsScored(assignment, 40, { model, excludeTutorIds: new Set(['x', 'y']) });
    expect(model._captured.query._id).toEqual({ $nin: ['x', 'y'] });
  });

  test('no exclusion clause when the set is empty', async () => {
    const model = fakeModel([tutor('a', { placed: 1, qualityGrade: 4 })]);
    await findMatchingTutorsScored(assignment, 40, { model, excludeTutorIds: new Set() });
    expect(model._captured.query._id).toBeUndefined();
  });
});
