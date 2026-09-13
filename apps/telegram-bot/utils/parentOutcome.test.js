import { describe, test, expect } from '@jest/globals';
import { placementRate, pickUpdate } from './parentOutcome.js';

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

describe('pickUpdate', () => {
  const tutorOid = 'tutor-oid';
  const now = new Date('2026-09-12T10:00:00Z');

  test('fills the assignment and stops outreach either way', () => {
    for (const onContact of [true, false]) {
      const { update } = pickUpdate({ tutorOid, now, onContact });
      expect(update.$set).toMatchObject({
        status: 'Filled',
        matchedTutorId: tutorOid,
        filledAt: now,
        'outreach.status': 'Fulfilled',
      });
    }
  });

  test('stamps the pick on the contact row when the tutor came through outreach', () => {
    const { update, options } = pickUpdate({ tutorOid, now, onContact: true });
    expect(update.$set['outreach.contacts.$[c].parentPickedAt']).toBe(now);
    expect(options.arrayFilters).toEqual([{ 'c.tutorId': tutorOid }]);
  });

  // A tutor the owner placed personally has no contact row, so there is nothing to stamp and no
  // filter to address one with.
  test('touches no contact row, and passes no array filter, for an off-list tutor', () => {
    const { update, options } = pickUpdate({ tutorOid, now, onContact: false });
    expect(Object.keys(update.$set).some(k => k.startsWith('outreach.contacts'))).toBe(false);
    expect(options.arrayFilters).toBeUndefined();
  });
});
