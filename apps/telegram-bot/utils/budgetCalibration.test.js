import { describe, test, expect } from '@jest/globals';
import { summarizeBudget, percentile, budgetCalibration } from './tutorMatcher.js';

// Secondary Maths, $50 ceiling (no budgetNumeric → resolveBudget parses the free-text rate).
const assignment = {
  level: 'Secondary 3',
  subject: 'Mathematics',
  title: 'Sec 3 Maths',
  location: 'Bishan',
  rate: '$50/hr',
};

// A tutor whose asking floor for the level is `floor` (via rateNumeric, the Phase 7 numeric mirror).
function tutor(floor, overrides = {}) {
  return {
    _id: 'x',
    tutorType: 'Part-time Tutor',
    rateNumeric: floor == null ? {} : { secondary: { min: floor, max: floor + 10 } },
    teachingLevels: { secondary: { mathematics: true } },
    ...overrides,
  };
}

describe('percentile', () => {
  test('linear-interpolates like a spreadsheet PERCENTILE', () => {
    const xs = [20, 30, 40, 50, 60];
    expect(percentile(xs, 0.25)).toBe(30);
    expect(percentile(xs, 0.5)).toBe(40);
    expect(percentile(xs, 0.75)).toBe(50);
  });

  test('interpolates between samples', () => {
    expect(percentile([10, 20], 0.5)).toBe(15);
  });

  test('is null for an empty set', () => {
    expect(percentile([], 0.5)).toBeNull();
  });
});

describe('summarizeBudget', () => {
  const pool = [20, 30, 40, 50, 60].map(f => tutor(f));

  test('reports the typical percentile range of tutor floors', () => {
    const c = summarizeBudget(pool, assignment, 'secondary', { dominantFilter: 'region' });
    expect(c.typical).toEqual({ p25: 30, p50: 40, p75: 50 });
    expect(c.floorSampleSize).toBe(5);
    expect(c.poolTotal).toBe(5);
  });

  test('counts how many tutors the current ceiling can afford (with grace)', () => {
    // Ceiling $50, +20% grace → affordable at a floor ≤ $60: all five.
    const c = summarizeBudget(pool, assignment, 'secondary', {});
    expect(c.currentCeiling).toBe(50);
    expect(c.poolAtCurrent).toBe(5);
  });

  test('suggests raising the budget only when it unlocks strictly more tutors', () => {
    // A $25 ceiling affords only floors ≤ $30 (2 of 5). p75 is $50 → suggest $50, which reaches all 5.
    const c = summarizeBudget(pool, { ...assignment, rate: '$25/hr' }, 'secondary', {});
    expect(c.poolAtCurrent).toBe(2);
    expect(c.suggested).toBe(50);
    expect(c.poolAtSuggested).toBe(5);
  });

  test('does not suggest a raise when the current budget already covers p75', () => {
    const c = summarizeBudget(pool, { ...assignment, rate: '$80/hr' }, 'secondary', {});
    expect(c.suggested).toBeNull();
    expect(c.poolAtSuggested).toBeNull();
  });

  test('rounds the suggested rate up to the nearest $5', () => {
    // Floors 32/38/44 → p75 = 41 → rounds up to $45.
    const oddPool = [32, 38, 44].map(f => tutor(f));
    const c = summarizeBudget(oddPool, { ...assignment, rate: '$30/hr' }, 'secondary', {});
    expect(c.suggested).toBe(45);
  });

  test('a thin pre-budget pool is a supply problem — no raise suggested, dominant filter surfaced', () => {
    const c = summarizeBudget([tutor(30), tutor(35)], assignment, 'secondary', { dominantFilter: 'region' });
    expect(c.poolTotal).toBe(2);
    expect(c.suggested).toBeNull(); // both already affordable at $50; raising buys nothing
    expect(c.dominantFilter).toBe('region');
  });

  test('handles tutors with no stated rate — they count in the pool but not the percentiles', () => {
    const mixed = [tutor(30), tutor(40), tutor(null)];
    const c = summarizeBudget(mixed, assignment, 'secondary', {});
    expect(c.poolTotal).toBe(3);
    expect(c.floorSampleSize).toBe(2);
    expect(c.typical).toEqual({ p25: 33, p50: 35, p75: 38 }); // percentiles are rounded to whole dollars
  });

  test('no floor data at all → typical is null, no crash', () => {
    const c = summarizeBudget([tutor(null), tutor(null)], assignment, 'secondary', {});
    expect(c.typical).toBeNull();
    expect(c.suggested).toBeNull();
  });
});

// A stand-in Tutor model: countDocuments answers the funnel from a table; find() replays the
// chainable select/sort/limit/lean and returns the docs (projection ignored, as in a fake).
function fakeModel({ counts, docs }) {
  const chain = { select: () => chain, sort: () => chain, limit: () => chain, lean: async () => docs };
  return {
    countDocuments: async (query) => {
      if (Object.keys(query).length === 0) return counts.total;
      if (query['teachingLevels.secondary.mathematics']) return counts.subject;
      if (query['locations.central']) return counts.region;
      if (query.pausedAt !== undefined) return counts.active;
      return counts.contactable;
    },
    find: () => chain,
  };
}

describe('budgetCalibration (async, against the model)', () => {
  test('maps the assignment, then returns the calibration view-model', async () => {
    const docs = [20, 30, 40, 50, 60].map(f => tutor(f));
    const c = await budgetCalibration({ ...assignment, rate: '$25/hr' }, {
      model: fakeModel({ counts: { total: 500, contactable: 480, active: 470, region: 120, subject: 31 }, docs }),
    });
    expect(c.ok).toBe(true);
    expect(c.levelCategory).toBe('secondary');
    expect(c.poolTotal).toBe(5);
    expect(c.suggested).toBe(50);
    expect(c.dominantFilter).toBe('region');
  });

  test('an unmappable assignment reports ok:false and does not calibrate', async () => {
    const c = await budgetCalibration({ ...assignment, location: 'Atlantis' }, {
      model: fakeModel({ counts: {}, docs: [] }),
    });
    expect(c).toEqual({ ok: false, unmappable: 'location' });
  });

  test('respects the timing filter when building the pre-budget pool', async () => {
    const wantsWeekend = { ...assignment, preferredTimeSlots: { weekendMorning: true } };
    const docs = [
      tutor(30, { availableTimeSlots: { weekendMorning: true } }),
      tutor(35, { availableTimeSlots: { weekdayMorning: true } }), // no overlap → excluded
    ];
    const c = await budgetCalibration(wantsWeekend, {
      model: fakeModel({ counts: { total: 100, contactable: 100, active: 100, region: 50, subject: 20 }, docs }),
    });
    expect(c.poolTotal).toBe(1);
  });
});
