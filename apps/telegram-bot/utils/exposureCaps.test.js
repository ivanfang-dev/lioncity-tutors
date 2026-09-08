import { describe, test, expect } from '@jest/globals';
import {
  openOffersByTutor, cappedTutorIds, loadCappedTutorIds, siblingContactedTutorIds,
} from './exposureCaps.js';

// Assignments as the lean query returns them: each with outreach.contacts [{ tutorId, status }].
const A = (contacts) => ({ outreach: { contacts } });

describe('openOffersByTutor', () => {
  test('counts only Sent/Interested contacts, across assignments, per tutor', () => {
    const open = [
      A([{ tutorId: 't1', status: 'Sent' }, { tutorId: 't2', status: 'Interested' }]),
      A([{ tutorId: 't1', status: 'Interested' }, { tutorId: 't2', status: 'Declined' }]),
      A([{ tutorId: 't1', status: 'Sent' }]),
    ];
    const counts = openOffersByTutor(open);
    expect(counts.get('t1')).toBe(3); // Sent + Interested + Sent
    expect(counts.get('t2')).toBe(1); // Interested only (Declined ignored)
  });

  test('ignores resolved statuses and contacts without a tutorId', () => {
    const counts = openOffersByTutor([
      A([{ tutorId: 't1', status: 'Declined' }, { tutorId: 't1', status: 'Filled' }, { status: 'Sent' }]),
    ]);
    expect(counts.get('t1')).toBeUndefined();
  });

  test('normalizes ObjectId-like tutorIds to strings', () => {
    const counts = openOffersByTutor([A([{ tutorId: { toString: () => 'abc' }, status: 'Sent' }])]);
    expect(counts.get('abc')).toBe(1);
  });

  test('handles empty / missing contacts safely', () => {
    expect(openOffersByTutor([]).size).toBe(0);
    expect(openOffersByTutor([{ outreach: {} }, {}]).size).toBe(0);
  });
});

describe('cappedTutorIds', () => {
  const open = [
    A([{ tutorId: 't1', status: 'Sent' }, { tutorId: 't2', status: 'Sent' }]),
    A([{ tutorId: 't1', status: 'Interested' }]),
  ];

  test('excludes tutors at or over the cap (default 2)', () => {
    const capped = cappedTutorIds(open);
    expect(capped.has('t1')).toBe(true);  // 2 open offers
    expect(capped.has('t2')).toBe(false); // 1 open offer
  });

  test('respects a custom cap', () => {
    expect(cappedTutorIds(open, 3).has('t1')).toBe(false); // 2 < 3
    expect(cappedTutorIds(open, 1).has('t2')).toBe(true);  // 1 ≥ 1
  });
});

describe('loadCappedTutorIds', () => {
  test('queries Open assignments and returns the capped set', async () => {
    const docs = [
      A([{ tutorId: 't1', status: 'Sent' }, { tutorId: 't1', status: 'Interested' }]),
    ];
    const model = { find: () => ({ select: () => ({ lean: async () => docs }) }) };
    const capped = await loadCappedTutorIds({ model });
    expect([...capped]).toEqual(['t1']);
  });
});

describe('siblingContactedTutorIds', () => {
  const contacts = (...ids) => ({ outreach: { contacts: ids.map(tutorId => ({ tutorId })) } });
  const fakeModel = (docs) => ({
    find: (query) => ({
      select: () => ({ lean: async () => docs.filter(d => d.siblingGroupId === query.siblingGroupId) }),
    }),
  });

  test('collects everyone already contacted on the other assignments in the group', async () => {
    const model = fakeModel([
      { _id: 'a', siblingGroupId: 'g1', ...contacts('t1', 't2') },
      { _id: 'b', siblingGroupId: 'g1', ...contacts('t3') },
    ]);
    const ids = await siblingContactedTutorIds({ _id: 'c', siblingGroupId: 'g1' }, { model });
    expect([...ids].sort()).toEqual(['t1', 't2', 't3']);
  });

  test('an assignment with no siblings excludes nobody, without querying', async () => {
    const model = { find: () => { throw new Error('should not query'); } };
    expect(await siblingContactedTutorIds({ _id: 'a' }, { model })).toEqual(new Set());
  });

  test('ids come back as strings, so they compare against the matcher pool', async () => {
    const model = fakeModel([{ _id: 'a', siblingGroupId: 'g1', ...contacts({ toString: () => 't1' }) }]);
    const ids = await siblingContactedTutorIds({ _id: 'b', siblingGroupId: 'g1' }, { model });
    expect(ids.has('t1')).toBe(true);
  });

  test('siblings that have not been sent anything yet contribute nothing', async () => {
    const model = fakeModel([{ _id: 'a', siblingGroupId: 'g1', outreach: {} }]);
    expect(await siblingContactedTutorIds({ _id: 'b', siblingGroupId: 'g1' }, { model })).toEqual(new Set());
  });
});
