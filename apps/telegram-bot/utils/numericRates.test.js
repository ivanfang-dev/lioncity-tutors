import { describe, test, expect } from '@jest/globals';
import {
  parseRateRange, deriveRateNumeric, deriveBudgetNumeric, hasNumericValue,
} from '../../../packages/shared/utils/numericRates.js';
import { resolveBudget, tutorFloorRate, budgetFit } from './tutorMatcher.js';

describe('numericRates (shared)', () => {
  test('parseRateRange handles single, range, and junk', () => {
    expect(parseRateRange('50')).toEqual({ min: 50, max: 50 });
    expect(parseRateRange('$40-60/hr')).toEqual({ min: 40, max: 60 });
    expect(parseRateRange('negotiable')).toBeNull();
    expect(parseRateRange('')).toBeNull();
  });

  test('deriveRateNumeric only includes parseable categories', () => {
    const out = deriveRateNumeric({ primary: '30', secondary: '$40-50', jc: '', ib: 'ask' });
    expect(out).toEqual({ primary: { min: 30, max: 30 }, secondary: { min: 40, max: 50 } });
  });

  test('deriveBudgetNumeric mirrors band detection', () => {
    expect(deriveBudgetNumeric('$30-45/hr (PT), $40-50/hr (FT)')).toEqual({ partTime: 45, fullTime: 50 });
    expect(deriveBudgetNumeric('$40-50/hr')).toEqual({ default: 50 });
    expect(deriveBudgetNumeric('MOE $70')).toEqual({ moe: 70 });
  });

  test('hasNumericValue', () => {
    expect(hasNumericValue({})).toBe(false);
    expect(hasNumericValue({ default: 50 })).toBe(true);
    expect(hasNumericValue(null)).toBe(false);
  });
});

describe('numeric-preferred budget path (Phase 7)', () => {
  test('resolveBudget prefers budgetNumeric over parsing rate text', () => {
    const assignment = { rate: '$40-50/hr', budgetNumeric: { default: 80 } };
    expect(resolveBudget(assignment).bands).toEqual({ default: 80 });
  });

  test('resolveBudget falls back to parsing rate for legacy (no budgetNumeric)', () => {
    const assignment = { rate: '$40-50/hr' };
    expect(resolveBudget(assignment).bands).toEqual({ default: 50 });
  });

  test('resolveBudget ignores an empty budgetNumeric object', () => {
    const assignment = { rate: '$55/hr', budgetNumeric: {} };
    expect(resolveBudget(assignment).bands).toEqual({ default: 55 });
  });

  test('tutorFloorRate prefers rateNumeric.min over parsing hourlyRate', () => {
    const tutor = { rateNumeric: { secondary: { min: 35, max: 45 } }, hourlyRate: { secondary: '$99' } };
    expect(tutorFloorRate(tutor, 'secondary')).toBe(35);
  });

  test('tutorFloorRate falls back to parsing hourlyRate for legacy tutors', () => {
    const tutor = { hourlyRate: { secondary: '$40-60' } };
    expect(tutorFloorRate(tutor, 'secondary')).toBe(40);
  });

  test('budgetFit uses numeric floor and ceiling end-to-end', () => {
    // Numeric budget ceiling 80 (default band), tutor numeric floor 40 → comfortably affordable.
    const budget = resolveBudget({ rate: 'ignored', budgetNumeric: { default: 80 } });
    const tutor = { tutorType: 'Part-time Tutor', rateNumeric: { secondary: { min: 40, max: 50 } }, hourlyRate: {} };
    const fit = budgetFit(tutor, budget, 'secondary');
    expect(fit.affordable).toBe(true);
    expect(fit.comfort).toBeCloseTo(0.5 + 0.5 * (1 - 40 / 80), 5);
  });

  test('budgetFit drops a tutor whose numeric floor exceeds the numeric ceiling + grace', () => {
    const budget = resolveBudget({ rate: 'ignored', budgetNumeric: { default: 40 } });
    const tutor = { tutorType: 'Part-time Tutor', rateNumeric: { secondary: { min: 60, max: 70 } }, hourlyRate: {} };
    expect(budgetFit(tutor, budget, 'secondary').affordable).toBe(false);
  });
});
