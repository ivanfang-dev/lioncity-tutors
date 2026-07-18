import { describe, test, expect } from '@jest/globals';
import { computeWaveSize, trailingInterestRate, WAVE_MIN, WAVE_MAX } from './waveSizing.js';

describe('computeWaveSize (clamp edges)', () => {
  test('cold interest rate → wave clamps up to the max', () => {
    // need 3, rate floored to 0.10 → ceil(30) → clamped to 12.
    expect(computeWaveSize(3, 0.10)).toBe(WAVE_MAX);
    expect(computeWaveSize(3, 0.02)).toBe(WAVE_MAX); // sub-floor rate is floored first
  });

  test('hot interest rate → wave clamps down to the min', () => {
    expect(computeWaveSize(3, 1.0)).toBe(WAVE_MIN);  // ceil(3) = 3 → up to min 4
    expect(computeWaveSize(1, 0.5)).toBe(WAVE_MIN);  // ceil(2) = 2 → up to min 4
  });

  test('mid rate lands between the bounds', () => {
    expect(computeWaveSize(3, 0.30)).toBe(10); // ceil(10) = 10
    expect(computeWaveSize(2, 0.25)).toBe(8);  // ceil(8) = 8
  });

  test('a floored/zero/undefined rate never divides by zero', () => {
    expect(computeWaveSize(3, 0)).toBe(WAVE_MAX);
    expect(computeWaveSize(3, undefined)).toBe(WAVE_MAX);
    expect(computeWaveSize(3, null)).toBe(WAVE_MAX);
  });

  test('non-positive need still respects the minimum (callers guard, but be safe)', () => {
    expect(computeWaveSize(0, 0.5)).toBe(WAVE_MIN);
    expect(computeWaveSize(-2, 0.5)).toBe(WAVE_MIN);
  });

  test('custom bounds are honoured', () => {
    expect(computeWaveSize(3, 0.10, { min: 2, max: 6 })).toBe(6);
    expect(computeWaveSize(3, 1.0, { min: 2, max: 6 })).toBe(3);
  });
});

describe('trailingInterestRate', () => {
  const fake = (rows) => ({ aggregate: async () => rows });

  test('interested / contacted from the aggregate', async () => {
    expect(await trailingInterestRate({ model: fake([{ contacted: 100, interested: 25 }]) })).toBe(0.25);
  });

  test('floors a very low observed rate', async () => {
    expect(await trailingInterestRate({ model: fake([{ contacted: 100, interested: 2 }]) })).toBe(0.10);
  });

  test('empty history → the floor, not a divide-by-zero', async () => {
    expect(await trailingInterestRate({ model: fake([]) })).toBe(0.10);
    expect(await trailingInterestRate({ model: fake([{ contacted: 0, interested: 0 }]) })).toBe(0.10);
  });
});
