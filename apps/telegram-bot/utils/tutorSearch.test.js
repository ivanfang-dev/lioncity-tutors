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

  test('reports the total match count beyond the limit', async () => {
    const model = fakeModel(Array.from({ length: 30 }, (_, i) => tutor(`t${i}`)));
    const { results, total } = await searchTutors(criteria, { model, limit: 5 });
    expect(results).toHaveLength(5);
    expect(total).toBe(30);
  });

  test('includeNearby widens the region filter to adjacent regions', async () => {
    const queries = [];
    const model = fakeModel([]);
    const find = model.find;
    model.find = (q) => { queries.push(q); return find(q); };
    await searchTutors({ ...criteria, includeNearby: true }, { model });
    expect(JSON.stringify(queries[0])).toEqual(expect.stringContaining('locations.central'));
  });

  test('gender is a hard filter on every fetch, even when the pool is thin', async () => {
    const queries = [];
    const model = fakeModel([]);
    const find = model.find;
    model.find = (q) => { queries.push(q); return find(q); };
    await searchTutors({ ...criteria, gender: 'Female' }, { model });
    expect(queries.length).toBeGreaterThan(0);
    for (const q of queries) expect(q.gender).toBe('Female');
  });

  test('ignores a gender other than Female or Male', async () => {
    const queries = [];
    const model = fakeModel([]);
    const find = model.find;
    model.find = (q) => { queries.push(q); return find(q); };
    await searchTutors({ ...criteria, gender: 'Any' }, { model });
    for (const q of queries) expect(q).not.toHaveProperty('gender');
  });

  test('lists exact-region tutors before nearby ones and tags the nearby region', async () => {
    const model = fakeModel([
      tutor('nearbyStar', { locations: { central: true }, yearsOfExperience: '10+ years' }),
      tutor('local', { locations: { east: true } }),
    ]);
    const { results } = await searchTutors({ ...criteria, includeNearby: true }, { model });
    expect(results.map(r => r.id)).toEqual(['local', 'nearbyStar']);
    expect(results[0].nearbyRegion).toBeNull();
    expect(results[1].nearbyRegion).toBe('central');
  });

  test('reports which field could not be mapped', async () => {
    const { results, unmappable } = await searchTutors({ ...criteria, location: 'Atlantis' }, { model: fakeModel([]) });
    expect(results).toEqual([]);
    expect(unmappable).toBe('location');
  });
  test('multi-subject: cards list taught and missing subjects', async () => {
    const model = fakeModel([tutor('a', { teachingLevels: { secondary: { science: true } } })]);
    const { results } = await searchTutors({ ...criteria, subject: ['Science', 'Physics'] }, { model });
    expect(results[0].teaches).toEqual(['Science']);
    expect(results[0].missing).toEqual(['Physics']);
  });

  test('multi-subject: full coverage ranks first', async () => {
    const model = fakeModel([
      tutor('partial', { teachingLevels: { secondary: { science: true } } }),
      tutor('full', { teachingLevels: { secondary: { science: true, physics: true } } }),
    ]);
    const { results } = await searchTutors({ ...criteria, subject: ['Science', 'Physics'] }, { model });
    expect(results.map(r => r.id)).toEqual(['full', 'partial']);
  });

  test('multi-subject: more subjects covered beats a stronger profile', async () => {
    const strong = { yearsOfExperience: '10+ years', stats: { placed: 9 }, responseStats: { contacted: 10, responded: 10 } };
    const model = fakeModel([
      tutor('one', { ...strong, teachingLevels: { secondary: { science: true } } }),
      tutor('two', { teachingLevels: { secondary: { science: true, physics: true } } }),
      tutor('three', { teachingLevels: { secondary: { science: true, physics: true, chemistry: true } } }),
    ]);
    const { results } = await searchTutors({ ...criteria, subject: ['Science', 'Physics', 'Chemistry'] }, { model });
    expect(results.map(r => r.id)).toEqual(['three', 'two', 'one']);
  });

  test('multi-subject: the query asks for any subject, never all of them', async () => {
    const queries = [];
    const base = fakeModel([tutor('a')]);
    const model = { ...base, find: (q) => { queries.push(q); return base.find(q); } };
    await searchTutors({ ...criteria, subject: ['Science', 'Physics'] }, { model });
    expect(queries[0]['teachingLevels.secondary.physics']).toBeUndefined();
    expect(JSON.stringify(queries[0])).toContain('"$or"');
  });

  test('single subject as a one-element list matches the string form', async () => {
    const model = fakeModel([tutor('a')]);
    const asString = await searchTutors(criteria, { model });
    const asList = await searchTutors({ ...criteria, subject: ['Science'] }, { model });
    expect(asList).toEqual(asString);
    expect(asList.results[0].teaches).toBeUndefined();
  });

  test('duplicate subjects collapse to one', async () => {
    const model = fakeModel([tutor('a')]);
    const { results } = await searchTutors({ ...criteria, subject: ['Science', 'Science'] }, { model });
    expect(results[0].teaches).toBeUndefined();
  });
});
