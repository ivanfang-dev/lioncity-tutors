import { describe, test, expect } from '@jest/globals';
import Assignment from '../../../packages/shared/models/Assignment.js';
import { holdTransition } from './recordTutorReply.js';

// Borrow the schema method as a pure function over a plain "this" — no DB needed.
const pendingParentTutorIds = (contacts) =>
  Assignment.schema.methods.pendingParentTutorIds.call({ outreach: { contacts } });

describe('Assignment.pendingParentTutorIds — shortlist preference', () => {
  test('with no shortlist ranks, returns every interested-but-unrelayed contact (legacy behavior)', () => {
    const ids = pendingParentTutorIds([
      { tutorId: 'a', status: 'Interested' },
      { tutorId: 'b', status: 'Interested', relayedToParentAt: new Date() },
      { tutorId: 'c', status: 'Sent' },
      { tutorId: 'd', status: 'Interested' },
    ]);
    expect(ids).toEqual(['a', 'd']);
  });

  test('once a shortlist exists, relays only the ranked top 3, best-first', () => {
    const ids = pendingParentTutorIds([
      { tutorId: 'a', status: 'Interested', shortlistRank: 3 },
      { tutorId: 'backup', status: 'Interested' }, // interested but not shortlisted
      { tutorId: 'b', status: 'Interested', shortlistRank: 1 },
      { tutorId: 'c', status: 'Interested', shortlistRank: 2 },
    ]);
    expect(ids).toEqual(['b', 'c', 'a']);
  });

  test('excludes already-relayed shortlisted tutors, so a repeat tap sends nothing new (no backup leak)', () => {
    const ids = pendingParentTutorIds([
      { tutorId: 'b', status: 'Interested', shortlistRank: 1, relayedToParentAt: new Date() },
      { tutorId: 'c', status: 'Interested', shortlistRank: 2, relayedToParentAt: new Date() },
      { tutorId: 'a', status: 'Interested', shortlistRank: 3, relayedToParentAt: new Date() },
      { tutorId: 'backup', status: 'Interested' }, // must NOT leak to the parent
    ]);
    expect(ids).toEqual([]);
  });

  test('newly-arrived shortlisted tutor is relayed while relayed ones are skipped', () => {
    const ids = pendingParentTutorIds([
      { tutorId: 'b', status: 'Interested', shortlistRank: 1, relayedToParentAt: new Date() },
      { tutorId: 'c', status: 'Interested', shortlistRank: 2 }, // ranked but not yet sent
    ]);
    expect(ids).toEqual(['c']);
  });
});

describe('holdTransition — hold-window decision', () => {
  const now = new Date('2026-07-16T10:00:00Z');
  const opts = { target: 3, holdWindowMs: 45 * 60 * 1000, earlyReleaseMargin: 3 };

  test('below target: no transition', () => {
    expect(holdTransition('Active', 2, now, opts)).toBeNull();
  });

  test('reaching target from Active: enter Holding with a future window', () => {
    const t = holdTransition('Active', 3, now, opts);
    expect(t).toEqual({
      status: 'Holding',
      holdUntil: new Date('2026-07-16T10:45:00Z'),
    });
  });

  test('another yes while Holding, still under the margin: window untouched', () => {
    expect(holdTransition('Holding', 4, now, opts)).toBeNull();
    expect(holdTransition('Holding', 5, now, opts)).toBeNull();
  });

  test('comfortably over target (>= target+margin) from Active: release immediately', () => {
    const t = holdTransition('Active', 6, now, opts);
    expect(t).toEqual({ status: 'Holding', holdUntil: now }); // holdUntil = now → next tick releases
  });

  test('crossing the margin while already Holding: release immediately', () => {
    const t = holdTransition('Holding', 6, now, opts);
    expect(t).toEqual({ status: 'Holding', holdUntil: now });
  });

  test('respects a configured target', () => {
    expect(holdTransition('Active', 1, now, { ...opts, target: 2 })).toBeNull();
    expect(holdTransition('Active', 2, now, { ...opts, target: 2 })).toMatchObject({ status: 'Holding' });
  });
});
