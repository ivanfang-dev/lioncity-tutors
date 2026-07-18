import { describe, test, expect } from '@jest/globals';
import {
  timeToThreeInterested, placementRate, day30Survival,
  telegramShare, dormantShare, relayToPickConversion, computeHealthMetrics,
} from '../../../packages/shared/utils/healthMetrics.js';

const MIN = 60 * 1000;
const t = (base, mins) => new Date(base + mins * MIN);

describe('timeToThreeInterested', () => {
  test('median ms from start to the 3rd interested reply', () => {
    const base = Date.parse('2026-07-18T00:00:00Z');
    const a = (offsets) => ({
      outreach: { startedAt: new Date(base), contacts: offsets.map(m => ({ status: 'Interested', respondedAt: t(base, m) })) },
    });
    // assignment 1: 3rd interested at +30min; assignment 2: 3rd at +50min → median 40min.
    const res = timeToThreeInterested([a([10, 20, 30, 45]), a([15, 35, 50])]);
    expect(res.count).toBe(2);
    expect(res.medianMs).toBe(40 * MIN);
  });

  test('ignores assignments that never reached 3 interested or lack a start', () => {
    const base = Date.parse('2026-07-18T00:00:00Z');
    expect(timeToThreeInterested([
      { outreach: { startedAt: new Date(base), contacts: [{ status: 'Interested', respondedAt: t(base, 5) }] } }, // only 1
      { outreach: { contacts: [{ status: 'Interested', respondedAt: t(base, 5) }] } }, // no start
    ])).toEqual({ medianMs: null, count: 0 });
  });
});

describe('placementRate', () => {
  test('placed / concluded (Filled or Closed)', () => {
    const res = placementRate([
      { status: 'Filled', matchedTutorId: 'x' },
      { status: 'Closed', matchedTutorId: 'y' },
      { status: 'Closed' },              // concluded, not placed
      { status: 'Open', matchedTutorId: 'z' }, // in-flight, excluded from denominator
    ]);
    expect(res).toEqual({ rate: 2 / 3, placed: 2, concluded: 3 });
  });

  test('null rate when nothing has concluded', () => {
    expect(placementRate([{ status: 'Open' }]).rate).toBeNull();
  });
});

describe('day30Survival', () => {
  test('survived / placements with a boolean outcome', () => {
    expect(day30Survival([
      { survived30d: true }, { survived30d: true }, { survived30d: false }, { survived30d: null },
    ])).toEqual({ rate: 2 / 3, count: 3 });
  });
  test('null when no outcomes recorded yet', () => {
    expect(day30Survival([{ survived30d: null }, {}]).rate).toBeNull();
  });
});

describe('telegramShare', () => {
  test('telegram contacts / all contacts', () => {
    const res = telegramShare([
      { outreach: { contacts: [{ channel: 'telegram' }, { channel: 'whatsapp' }] } },
      { outreach: { contacts: [{ channel: 'telegram' }] } },
    ]);
    expect(res).toEqual({ rate: 2 / 3, total: 3 });
  });
});

describe('dormantShare', () => {
  test('dormant / total', () => {
    expect(dormantShare({ total: 400, dormant: 40 })).toEqual({ rate: 0.1, dormant: 40, total: 400 });
  });
  test('null when no tutors', () => {
    expect(dormantShare({ total: 0, dormant: 0 }).rate).toBeNull();
  });
});

describe('relayToPickConversion', () => {
  test('picked / relayed (pick via contact flag or matchedTutorId)', () => {
    const res = relayToPickConversion([
      { outreach: { shortlistReleasedAt: new Date(), contacts: [{ parentPickedAt: new Date() }] } }, // picked
      { outreach: { shortlistReleasedAt: new Date(), contacts: [] }, matchedTutorId: 'x' },          // picked (matched)
      { outreach: { shortlistReleasedAt: new Date(), contacts: [] } },                               // relayed, no pick
      { outreach: {}, matchedTutorId: 'y' },                                                          // never relayed
    ]);
    expect(res).toEqual({ rate: 2 / 3, picked: 2, relayed: 3 });
  });
});

describe('computeHealthMetrics', () => {
  test('bundles all six and is safe on empty input', () => {
    const m = computeHealthMetrics({});
    expect(Object.keys(m).sort()).toEqual([
      'day30Survival', 'dormantShare', 'placementRate', 'relayToPickConversion', 'telegramShare', 'timeToThreeInterested',
    ]);
    expect(m.placementRate.rate).toBeNull();
  });
});
