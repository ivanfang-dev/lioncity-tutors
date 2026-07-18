import { describe, test, expect } from '@jest/globals';
import { checkInAction, CHECKIN_DUE_MS, CHECKIN_REPING_MS } from './checkInOutcome.js';

const now = new Date('2026-07-16T00:00:00Z');
const ago = (ms) => new Date(now.getTime() - ms);
const DAY = 24 * 60 * 60 * 1000;

// Minimal placement shape checkInAction reads.
function placement({ filledAgo = null, requestedAgo = null, repingedAgo = null, checkIns = [], status = 'active' } = {}) {
  return {
    status,
    filledAt: filledAgo == null ? undefined : ago(filledAgo),
    checkInRequestedAt: requestedAgo == null ? undefined : ago(requestedAgo),
    checkInRepingedAt: repingedAgo == null ? undefined : ago(repingedAgo),
    checkIns,
  };
}

describe('checkInAction', () => {
  test('null placement → null', () => {
    expect(checkInAction(null, now)).toBeNull();
  });

  test('too new (< 28d) → no ping', () => {
    expect(checkInAction(placement({ filledAgo: 20 * DAY }), now)).toBeNull();
  });

  test('28d old, never pinged → ping', () => {
    expect(checkInAction(placement({ filledAgo: CHECKIN_DUE_MS }), now)).toBe('ping');
  });

  test('older than 28d, never pinged → ping', () => {
    expect(checkInAction(placement({ filledAgo: 40 * DAY }), now)).toBe('ping');
  });

  test('pinged < 3d ago → no re-ping yet', () => {
    expect(checkInAction(placement({ filledAgo: 40 * DAY, requestedAgo: 2 * DAY }), now)).toBeNull();
  });

  test('pinged >= 3d ago, no reply → reping', () => {
    expect(checkInAction(placement({ filledAgo: 40 * DAY, requestedAgo: CHECKIN_REPING_MS }), now)).toBe('reping');
  });

  test('re-pinged < 3d ago → nothing yet', () => {
    expect(checkInAction(placement({ requestedAgo: 6 * DAY, repingedAgo: 1 * DAY }), now)).toBeNull();
  });

  test('re-pinged >= 3d ago, still no reply → giveup', () => {
    expect(checkInAction(placement({ requestedAgo: 9 * DAY, repingedAgo: CHECKIN_REPING_MS }), now)).toBe('giveup');
  });

  test('any recorded checkIn ends the cadence', () => {
    const p = placement({ filledAgo: 40 * DAY, checkIns: [{ status: 'active' }] });
    expect(checkInAction(p, now)).toBeNull();
  });

  test('non-active placement (backfilled unknown) is never pinged', () => {
    expect(checkInAction(placement({ filledAgo: 40 * DAY, status: 'unknown' }), now)).toBeNull();
  });

  test('ended placement is never pinged', () => {
    expect(checkInAction(placement({ filledAgo: 40 * DAY, status: 'ended' }), now)).toBeNull();
  });
});
