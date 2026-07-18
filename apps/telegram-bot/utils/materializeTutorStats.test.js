import { describe, test, expect } from '@jest/globals';
import { median } from './materializeTutorStats.js';

describe('median (tutor.stats materialization)', () => {
  test('empty / all-null → null', () => {
    expect(median([])).toBeNull();
    expect(median([null, undefined, NaN])).toBeNull();
    expect(median(undefined)).toBeNull();
  });

  test('odd count → middle value', () => {
    expect(median([30, 10, 20])).toBe(20);
  });

  test('even count → rounded average of the two middles', () => {
    expect(median([10, 20, 30, 40])).toBe(25);
    expect(median([10, 30])).toBe(20);
    expect(median([10, 15])).toBe(13); // (10+15)/2 = 12.5 → 13
  });

  test('ignores non-numeric entries mixed in', () => {
    expect(median([10, null, 20, undefined, 30])).toBe(20);
  });
});
