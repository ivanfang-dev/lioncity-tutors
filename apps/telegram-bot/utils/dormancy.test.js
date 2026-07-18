import { describe, test, expect } from '@jest/globals';
import { isDormant, runDormancySweep } from './dormancy.js';

const now = new Date('2026-07-18T04:00:00Z');
const daysAgo = (n) => new Date(now.getTime() - n * 24 * 60 * 60 * 1000);

function tutor(overrides = {}) {
  return {
    _id: 't',
    responseStats: { contacted: 10, responded: 1 }, // 9 misses ≥ threshold 8
    lastConfirmedActiveAt: daysAgo(90),
    pausedAt: null,
    ...overrides,
  };
}

describe('isDormant', () => {
  test('dormant: many misses AND long inactive', () => {
    expect(isDormant(tutor(), now)).toBe(true);
  });

  test('not dormant when misses are below the threshold', () => {
    expect(isDormant(tutor({ responseStats: { contacted: 10, responded: 5 } }), now)).toBe(false); // 5 < 8
  });

  test('not dormant when recently active, however many misses', () => {
    expect(isDormant(tutor({ lastConfirmedActiveAt: daysAgo(10) }), now)).toBe(false);
  });

  test('missing lastConfirmedActiveAt counts as never active → dormant (given enough misses)', () => {
    expect(isDormant(tutor({ lastConfirmedActiveAt: null }), now)).toBe(true);
    expect(isDormant(tutor({ lastConfirmedActiveAt: undefined }), now)).toBe(true);
  });

  test('an already-paused tutor is never re-flagged', () => {
    expect(isDormant(tutor({ pausedAt: daysAgo(1) }), now)).toBe(false);
  });

  test('respects custom threshold/window', () => {
    const t = tutor({ responseStats: { contacted: 6, responded: 0 }, lastConfirmedActiveAt: daysAgo(40) });
    expect(isDormant(t, now)).toBe(false);                                   // 6 < 8, 40 < 60
    expect(isDormant(t, now, { missThreshold: 5, dormantDays: 30 })).toBe(true);
  });

  test('exactly at the miss threshold counts', () => {
    expect(isDormant(tutor({ responseStats: { contacted: 8, responded: 0 } }), now)).toBe(true); // 8 ≥ 8
  });
});

// A model fake: find() replays the chain and returns docs; updateOne reports a modification.
function fakeModel(docs, { updated = 1 } = {}) {
  const chain = { select: () => chain, limit: () => chain, lean: async () => docs };
  const updates = [];
  return {
    find: () => chain,
    updateOne: async (filter, update) => { updates.push({ filter, update }); return { modifiedCount: updated }; },
    _updates: updates,
  };
}

describe('runDormancySweep', () => {
  test('pauses each dormant tutor and DMs the Telegram-linked ones', async () => {
    const docs = [
      tutor({ _id: 'a', telegramId: 111 }),                       // paused + DM
      tutor({ _id: 'b', telegramId: null }),                      // paused, no DM (no telegram)
      tutor({ _id: 'c', telegramId: 222, telegramStale: true }),  // paused, no DM (stale link)
    ];
    const dmed = [];
    const model = fakeModel(docs);
    const res = await runDormancySweep(now, { model, sendDM: async (t) => dmed.push(t._id) });
    expect(res.paused).toBe(3);
    expect(res.dmSent).toBe(1);
    expect(dmed).toEqual(['a']);
    expect(model._updates.every(u => u.update.$set.pausedAt === now)).toBe(true);
  });

  test('a DM failure still counts the pause and never throws', async () => {
    const model = fakeModel([tutor({ _id: 'a', telegramId: 111 })]);
    const res = await runDormancySweep(now, { model, sendDM: async () => { throw new Error('blocked bot'); } });
    expect(res.paused).toBe(1);
    expect(res.dmSent).toBe(0);
  });

  test('skips a tutor another tick already paused (updateOne modified nothing)', async () => {
    const model = fakeModel([tutor({ _id: 'a', telegramId: 111 })], { updated: 0 });
    const dmed = [];
    const res = await runDormancySweep(now, { model, sendDM: async (t) => dmed.push(t._id) });
    expect(res.paused).toBe(0);
    expect(dmed).toEqual([]); // no DM if we didn't actually pause it
  });
});
