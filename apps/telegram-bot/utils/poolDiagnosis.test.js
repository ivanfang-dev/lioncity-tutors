import { describe, test, expect } from '@jest/globals';
import { poolShortfallReport, FILTER_LABELS } from './poolDiagnosis.js';

const stats = (dominantFilter, stages = []) => ({ dominantFilter, stages, matched: 3 });

const assignment = {
  location: 'Bishan',
  preferredTutorTypes: ['Full-time'],
  rate: '$50/hr',
};

describe('poolShortfallReport', () => {
  test('is null when the pool is big enough to work with', () => {
    expect(poolShortfallReport({ poolSize: 12, target: 6, stats: stats('region'), assignment })).toBeNull();
  });

  test('reports when the pool is smaller than the target', () => {
    const r = poolShortfallReport({ poolSize: 2, target: 6, stats: stats('region'), assignment });
    expect(r).not.toBeNull();
    expect(r.text).toContain('2');
  });

  test('names the filter that cost the most candidates', () => {
    const r = poolShortfallReport({
      poolSize: 2, target: 6, assignment,
      stats: stats('region', [{ filter: 'region', before: 120, after: 8, removed: 112 }]),
    });
    expect(r.text).toContain(FILTER_LABELS.region);
    expect(r.text).toContain('112');
  });

  test('offers widening the region when region is the bottleneck', () => {
    const r = poolShortfallReport({ poolSize: 2, target: 6, stats: stats('region'), assignment });
    expect(r.actions).toContain('widen_region');
  });

  test('offers raising the budget when budget is the bottleneck', () => {
    const r = poolShortfallReport({ poolSize: 2, target: 6, stats: stats('budget'), assignment });
    expect(r.actions[0]).toBe('raise_ceiling');
  });

  test('offers relaxing tutor type only when one was actually set', () => {
    const withType = poolShortfallReport({ poolSize: 2, target: 6, stats: stats('tutorType'), assignment });
    expect(withType.actions).toContain('relax_type');

    const noType = poolShortfallReport({
      poolSize: 2, target: 6, stats: stats('tutorType'),
      assignment: { ...assignment, preferredTutorTypes: [] },
    });
    expect(noType.actions).not.toContain('relax_type');
  });

  test('says what was already relaxed automatically, so the owner is not surprised', () => {
    const r = poolShortfallReport({
      poolSize: 4, target: 6, stats: stats('gender'), assignment, relaxed: ['gender'],
    });
    expect(r.text.toLowerCase()).toContain('gender');
  });

  test('an empty pool reads as no tutors at all, not "0 of 6"', () => {
    const r = poolShortfallReport({ poolSize: 0, target: 6, stats: stats('subject'), assignment });
    expect(r.text.toLowerCase()).toContain('no tutors');
  });

  test('survives stats being unavailable', () => {
    const r = poolShortfallReport({ poolSize: 1, target: 6, stats: null, assignment });
    expect(r).not.toBeNull();
    expect(r.actions.length).toBeGreaterThan(0);
  });
});
