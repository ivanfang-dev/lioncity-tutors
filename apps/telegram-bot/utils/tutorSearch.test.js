import { describe, test, expect } from '@jest/globals';
import { searchTutors } from './tutorMatcher.js';

// Fake Tutor model: returns every doc for any query (the DB-side filters are covered elsewhere).
function fakeModel(docs) {
  return {
    countDocuments: async () => docs.length,
    find: () => {
      const chain = { select: () => chain, sort: () => chain, limit: () => chain, lean: async () => docs };
      return chain;
    },
  };
}

function tutor(id, overrides = {}) {
  return {
    _id: id,
    fullName: id,
    contactNumber: '91234567',
    tutorType: 'Full-time Tutor',
    yearsOfExperience: '3-5 years',
    hourlyRate: { secondary: '$40/hr' },
    teachingLevels: { secondary: { science: true } },
    introduction: 'x'.repeat(200),
    teachingExperience: 'y'.repeat(200),
    ...overrides,
  };
}

const criteria = { level: 'Secondary 3', subject: 'Science', location: 'Tampines', rate: '$45/hr' };

describe('searchTutors', () => {
  test('returns ranked cards with the fields the console shows', async () => {
    const model = fakeModel([tutor('a', { stats: { placed: 2 }, responseStats: { contacted: 4, responded: 3 } })]);
    const { results, unmappable } = await searchTutors(criteria, { model });

    expect(unmappable).toBeNull();
    expect(results).toHaveLength(1);
    expect(results[0]).toMatchObject({
      id: 'a',
      fullName: 'a',
      contactNumber: '91234567',
      yearsOfExperience: '3-5 years',
      askingRate: '$40/hr',
      floorRate: 40,
      ceiling: 45,
      overBudget: false,
      placed: 2,
      replies: { contacted: 4, responded: 3 },
    });
    expect(results[0].introduction).toHaveLength(200);
  });

  test('drops tutors below the minimum experience', async () => {
    const model = fakeModel([
      tutor('junior', { yearsOfExperience: '1-3 years' }),
      tutor('senior', { yearsOfExperience: '5-10 years' }),
      tutor('unknown', { yearsOfExperience: undefined }),
    ]);
    const { results } = await searchTutors({ ...criteria, minExperience: '3-5 years' }, { model });
    expect(results.map(r => r.id)).toEqual(['senior']);
  });

  test('flags a tutor asking slightly over the budget instead of dropping them', async () => {
    const model = fakeModel([tutor('pricey', { hourlyRate: { secondary: '$50/hr' } })]);
    const { results } = await searchTutors(criteria, { model });
    expect(results).toHaveLength(1);
    expect(results[0].overBudget).toBe(true);
  });

  test('ranks a well-written profile above a bare one', async () => {
    const model = fakeModel([
      tutor('bare', { introduction: 'Hi', teachingExperience: '' }),
      tutor('solid'),
    ]);
    const { results } = await searchTutors(criteria, { model });
    expect(results.map(r => r.id)).toEqual(['solid', 'bare']);
  });

  test('caps the result count at the limit', async () => {
    const model = fakeModel(Array.from({ length: 30 }, (_, i) => tutor(`t${i}`)));
    const { results } = await searchTutors(criteria, { model, limit: 5 });
    expect(results).toHaveLength(5);
  });

  test('reports which field could not be mapped', async () => {
    const { results, unmappable } = await searchTutors({ ...criteria, location: 'Atlantis' }, { model: fakeModel([]) });
    expect(results).toEqual([]);
    expect(unmappable).toBe('location');
  });
});
