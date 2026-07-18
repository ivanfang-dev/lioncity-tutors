import { describe, test, expect } from '@jest/globals';
import { planRecovery, applyRecovery, RECOVERY_ACTIONS } from './recovery.js';
import { adjacentRegions } from './locations.js';
import { buildFilterStages } from './tutorMatcher.js';

describe('adjacentRegions', () => {
  test('central borders every other physical region', () => {
    expect(adjacentRegions('central').sort()).toEqual(['east', 'north', 'northeast', 'northwest', 'south', 'west']);
  });
  test('adjacency is symmetric', () => {
    for (const [region, neighbours] of Object.entries({ east: adjacentRegions('east'), west: adjacentRegions('west'), north: adjacentRegions('north') })) {
      for (const n of neighbours) expect(adjacentRegions(n)).toContain(region);
    }
  });
  test('online / unknown regions have no neighbours', () => {
    expect(adjacentRegions('online')).toEqual([]);
    expect(adjacentRegions('atlantis')).toEqual([]);
  });
});

describe('buildFilterStages multi-region (widen)', () => {
  const base = { level: 'Secondary 3', subject: 'Mathematics', title: 'Sec 3 Maths', location: 'Bishan' }; // central

  // stage.query is CUMULATIVE (carries prior clauses), so assert on the region clause specifically.
  test('single region unchanged when no matchRegions', () => {
    const { stages } = buildFilterStages(base);
    const q = stages.find(s => s.filter === 'region').query;
    expect(q['locations.central']).toBe(true);
    expect(q.$or).toBeUndefined();
  });

  test('ORs the base region with matchRegions, deduped', () => {
    const { stages } = buildFilterStages({ ...base, matchRegions: ['east', 'central', 'north'] });
    const q = stages.find(s => s.filter === 'region').query;
    expect(q.$or).toEqual([
      { 'locations.central': true },
      { 'locations.east': true },
      { 'locations.north': true },
    ]);
  });
});

describe('planRecovery', () => {
  const assignment = {
    location: 'Bishan', // central
    budgetNumeric: { default: 50 },
    preferredTutorTypes: ['Part-time'],
    matchRegions: [],
  };

  test('widen_region merges adjacent regions', () => {
    const plan = planRecovery(assignment, 'widen_region');
    expect(plan.set.matchRegions).toEqual(adjacentRegions('central'));
    expect(plan.summary).toMatch(/Widened/);
  });

  test('widen_region is idempotent-ish (merges with existing, no dupes)', () => {
    const plan = planRecovery({ ...assignment, matchRegions: ['east'] }, 'widen_region');
    expect(new Set(plan.set.matchRegions).size).toBe(plan.set.matchRegions.length);
    expect(plan.set.matchRegions).toContain('east');
  });

  test('widen_region errors when the base region has no neighbours (online)', () => {
    expect(planRecovery({ ...assignment, location: 'Online' }, 'widen_region')).toEqual({ error: 'no_adjacent_regions' });
  });

  test('raise_ceiling bumps every present band by the amount (default $10)', () => {
    expect(planRecovery(assignment, 'raise_ceiling').set.budgetNumeric).toEqual({ default: 60 });
    expect(planRecovery({ ...assignment, budgetNumeric: { partTime: 40, fullTime: 60 } }, 'raise_ceiling', 15).set.budgetNumeric)
      .toEqual({ partTime: 55, fullTime: 75 });
  });

  test('raise_ceiling falls back to parsing the rate text when budgetNumeric is absent', () => {
    const plan = planRecovery({ location: 'Bishan', rate: '$40/hr' }, 'raise_ceiling');
    expect(plan.set.budgetNumeric).toEqual({ default: 50 });
  });

  test('relax_type clears the tutor-type restriction', () => {
    expect(planRecovery(assignment, 'relax_type').set.preferredTutorTypes).toEqual([]);
    expect(planRecovery({ ...assignment, preferredTutorTypes: [] }, 'relax_type')).toEqual({ error: 'no_type_to_relax' });
  });

  test('unknown action errors', () => {
    expect(planRecovery(assignment, 'nope')).toEqual({ error: 'invalid_action' });
  });
});

describe('applyRecovery', () => {
  function fakeModel(doc) {
    const updates = [];
    return {
      _updates: updates,
      findById: async () => doc,
      updateOne: async (filter, update) => { updates.push(update); return { modifiedCount: 1 }; },
    };
  }

  test('mutates + resets outreach and returns the reloaded assignment', async () => {
    const doc = { _id: 'a1', location: 'Bishan', budgetNumeric: { default: 50 }, preferredTutorTypes: ['Part-time'] };
    const model = fakeModel(doc);
    const res = await applyRecovery({ assignmentId: 'a1', action: 'raise_ceiling', amount: 5 }, { model });
    expect(res.ok).toBe(true);
    const set = model._updates[0].$set;
    expect(set.budgetNumeric).toEqual({ default: 55 });
    expect(set['outreach.status']).toBe('Active');
    expect(set.status).toBe('Open');
  });

  test('rejects an invalid action before touching the DB', async () => {
    expect(await applyRecovery({ assignmentId: 'a1', action: 'bogus' }, { model: fakeModel({}) }))
      .toEqual({ ok: false, error: 'invalid_action' });
  });

  test('RECOVERY_ACTIONS is the canonical action list', () => {
    expect(RECOVERY_ACTIONS).toEqual(['widen_region', 'raise_ceiling', 'relax_type']);
  });
});
