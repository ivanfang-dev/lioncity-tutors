import { describe, test, expect } from '@jest/globals';
import { runProfileNudgeSweep } from './profileNudge.js';

const now = new Date('2026-07-18T04:00:00Z');

// A model fake: find() returns docs; updateOne records + can be told whether it modified anything.
function fakeModel(docs, { firstUpdateModifies = true } = {}) {
  const updates = [];
  return {
    _updates: updates,
    find: () => ({ select: () => ({ limit: () => ({ lean: async () => docs }) }) }),
    updateOne: async (filter, update) => {
      updates.push({ filter, update });
      // The claim (filtered on profileNudgedAt: null) is the first updateOne per tutor.
      const isClaim = update.$set.profileNudgedAt instanceof Date;
      return { modifiedCount: isClaim && firstUpdateModifies ? 1 : (isClaim ? 0 : 1) };
    },
  };
}

const tutor = (id) => ({ _id: id, telegramId: 100 + id, profileFeatures: { qualityGrade: 1 } });

describe('runProfileNudgeSweep', () => {
  test('claims and DMs each eligible tutor once', async () => {
    const dmed = [];
    const model = fakeModel([tutor(1), tutor(2)]);
    const res = await runProfileNudgeSweep(now, { model, sendDM: async (t) => dmed.push(t._id) });
    expect(res.sent).toBe(2);
    expect(dmed).toEqual([1, 2]);
    // Each claim stamps profileNudgedAt = now.
    expect(model._updates[0].update.$set.profileNudgedAt).toEqual(now);
  });

  test('rolls back the stamp when the DM fails, so the tutor is retried later', async () => {
    const model = fakeModel([tutor(1)]);
    const res = await runProfileNudgeSweep(now, { model, sendDM: async () => { throw new Error('blocked'); } });
    expect(res.sent).toBe(0);
    // Two writes: the claim (now) then the rollback (null).
    expect(model._updates.map(u => u.update.$set.profileNudgedAt)).toEqual([now, null]);
  });

  test('skips a tutor another tick already claimed (claim modified nothing)', async () => {
    const dmed = [];
    const model = fakeModel([tutor(1)], { firstUpdateModifies: false });
    const res = await runProfileNudgeSweep(now, { model, sendDM: async (t) => dmed.push(t._id) });
    expect(res.sent).toBe(0);
    expect(dmed).toEqual([]);
  });
});
