import { describe, test, expect } from '@jest/globals';
import { lateInterestOutcome, nextShortlistRank, checkLateApplication } from './lateInterest.js';

const shortlist = [
  { tutorId: 'a', tutorName: 'Amy', shortlistRank: 1, score: 0.90 },
  { tutorId: 'b', tutorName: 'Ben', shortlistRank: 2, score: 0.75 },
  { tutorId: 'c', tutorName: 'Cara', shortlistRank: 3, score: 0.60 },
];

describe('lateInterestOutcome', () => {
  test('flags a candidate who outscores the weakest shortlisted tutor', () => {
    const out = lateInterestOutcome({ tutorId: 'd', tutorName: 'Dan', score: 0.80 }, shortlist);
    expect(out.stronger).toBe(true);
    expect(out.weakest).toMatchObject({ tutorName: 'Cara', shortlistRank: 3 });
    expect(out.wouldRank).toBe(2);
  });

  test('a top scorer would rank first', () => {
    const out = lateInterestOutcome({ tutorId: 'd', tutorName: 'Dan', score: 0.99 }, shortlist);
    expect(out).toMatchObject({ stronger: true, wouldRank: 1 });
  });

  test('a weaker candidate is bench, not an alert', () => {
    const out = lateInterestOutcome({ tutorId: 'd', tutorName: 'Dan', score: 0.50 }, shortlist);
    expect(out.stronger).toBe(false);
    expect(out.wouldRank).toBe(4);
  });

  test('an exact tie does not displace an incumbent', () => {
    const out = lateInterestOutcome({ tutorId: 'd', tutorName: 'Dan', score: 0.60 }, shortlist);
    expect(out.stronger).toBe(false);
  });

  // Reaching here with an empty shortlist means the released one is spent — every name rejected,
  // or none could be built. Defaulting to "stronger" there announced a 0-1-year tutor as beating
  // the shortlist, because there was no shortlist left to lose to.
  test('with no shortlist to compare against, nobody counts as stronger', () => {
    const out = lateInterestOutcome({ tutorId: 'd', tutorName: 'Dan', score: 0.1 }, []);
    expect(out).toMatchObject({ stronger: false, weakest: null, wouldRank: 1 });
  });

  test('a shortlist holding only the candidate\'s own row is still nothing to beat', () => {
    const out = lateInterestOutcome(
      { tutorId: 'c', tutorName: 'Cara', score: 0.60 },
      [{ tutorId: 'c', tutorName: 'Cara', shortlistRank: 1, score: 0.60 }]
    );
    expect(out.stronger).toBe(false);
  });

  test('ignores the candidate\'s own row if it somehow appears in the shortlist', () => {
    const out = lateInterestOutcome(
      { tutorId: 'c', tutorName: 'Cara', score: 0.60 },
      shortlist
    );
    expect(out.weakest).toMatchObject({ tutorName: 'Ben' });
  });
});

describe('nextShortlistRank', () => {
  test('appends after the highest existing rank', () => {
    expect(nextShortlistRank(shortlist)).toBe(4);
  });

  test('starts at 1 when nothing is ranked yet', () => {
    expect(nextShortlistRank([{ tutorId: 'x', status: 'Interested' }])).toBe(1);
  });

  test('ignores gaps and unranked contacts', () => {
    expect(nextShortlistRank([
      { shortlistRank: 1 },
      { shortlistRank: 5 },
      { status: 'Sent' },
    ])).toBe(6);
  });

  // A reject leaves parentRejectedAt + the old shortlistRank on every contact that was shown.
  // Counting those numbered the first tutor on the NEXT shortlist #4 instead of #1.
  test('skips contacts the parent already rejected', () => {
    const rejected = new Date();
    expect(nextShortlistRank([
      { shortlistRank: 1, parentRejectedAt: rejected },
      { shortlistRank: 2, parentRejectedAt: rejected },
      { shortlistRank: 3, parentRejectedAt: rejected },
    ])).toBe(1);
  });

  test('appends after the live shortlist only, ignoring a rejected round below it', () => {
    const rejected = new Date();
    expect(nextShortlistRank([
      { shortlistRank: 1, parentRejectedAt: rejected },
      { shortlistRank: 2, parentRejectedAt: rejected },
      { shortlistRank: 1 },
    ])).toBe(2);
  });

  test('handles a missing contacts array', () => {
    expect(nextShortlistRank(undefined)).toBe(1);
    expect(nextShortlistRank([])).toBe(1);
  });
});

describe('checkLateApplication', () => {
  const modelReturning = (doc) => ({ findById: async () => doc });

  test('does nothing while outreach is still running', async () => {
    const assignment = { outreach: { status: 'Active', contacts: [{ tutorId: 't1' }] } };
    expect(await checkLateApplication(modelReturning(assignment), 'a1', 't1'))
      .toEqual({ alerted: false, stronger: false });
  });

  test('does nothing when the applicant has no outreach contact', async () => {
    const assignment = { outreach: { status: 'Fulfilled', contacts: [{ tutorId: 'other' }] } };
    expect(await checkLateApplication(modelReturning(assignment), 'a1', 't1'))
      .toEqual({ alerted: false, stronger: false });
  });

  test('does nothing when the assignment is gone', async () => {
    expect(await checkLateApplication(modelReturning(null), 'a1', 't1'))
      .toEqual({ alerted: false, stronger: false });
  });
});
