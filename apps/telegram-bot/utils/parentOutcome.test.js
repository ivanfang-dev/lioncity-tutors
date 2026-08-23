import { describe, test, expect } from '@jest/globals';
import { placementRate } from './parentOutcome.js';

const tutorDoc = { hourlyRate: { jc: '$70-90/hr', secondary: '$50-60/hr' } };
const jcAssignment = { level: 'Junior College 1', rate: '$60-80/hr' };

describe('placementRate', () => {
  // The Placement row is what the day-30 check-in and future ranking work train against. It used
  // to record the tutor's PROFILE rate even when the tutor had quoted a rate for this assignment
  // — so the ground-truth row disagreed with the number the parent actually picked on.
  test('a rate quoted for this assignment wins over the profile rate', () => {
    expect(placementRate({ quotedRate: 65 }, tutorDoc, jcAssignment)).toBe('$65/hr');
  });

  test('formats the quoted rate the way the parent was shown it', () => {
    expect(placementRate({ quotedRate: 45 }, null, jcAssignment)).toBe('$45/hr');
    expect(placementRate({ quotedRate: 47.5 }, null, jcAssignment)).toBe('$47.5/hr');
  });

  test('falls back to the profile rate for the level when nothing was quoted', () => {
    expect(placementRate({}, tutorDoc, jcAssignment)).toBe('$70-90/hr');
  });

  test('falls back to the secondary profile rate when the level has none', () => {
    expect(placementRate({}, { hourlyRate: { secondary: '$50-60/hr' } }, jcAssignment))
      .toBe('$50-60/hr');
  });

  test("falls back to the assignment's posted rate when the tutor has no profile rate", () => {
    expect(placementRate({}, { hourlyRate: {} }, jcAssignment)).toBe('$60-80/hr');
    expect(placementRate({}, null, jcAssignment)).toBe('$60-80/hr');
  });

  // A quoted 0 would be a real answer, not a missing one — != null, not truthiness.
  test('treats a quoted zero as a quote, not as missing', () => {
    expect(placementRate({ quotedRate: 0 }, tutorDoc, jcAssignment)).toBe('$0/hr');
  });

  test('does not throw on missing arguments', () => {
    expect(placementRate(null, null, null)).toBeUndefined();
    expect(placementRate({}, null, {})).toBeUndefined();
  });
});
