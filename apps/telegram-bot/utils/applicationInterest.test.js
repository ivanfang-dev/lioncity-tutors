import { describe, test, expect } from '@jest/globals';
import {
  applicationContact,
  recordApplicationInterest,
} from '../../../packages/shared/utils/applicationInterest.js';

const tutor = { _id: 'tutor1', fullName: 'Jane Tan', contactNumber: '91234567' };

describe('applicationContact', () => {
  test('builds an Interested contact row, since applying IS the yes', () => {
    const now = new Date('2026-08-22T10:00:00Z');
    const c = applicationContact(tutor, { rate: 60, now });
    expect(c).toMatchObject({
      tutorId: 'tutor1',
      tutorName: 'Jane Tan',
      channel: 'application',
      status: 'Interested',
      wave: 0,
      sentAt: now,
      respondedAt: now,
      quotedRate: 60,
    });
  });

  test('normalizes the phone so a later WhatsApp reply still matches this row', () => {
    expect(applicationContact(tutor).phone).toBe('91234567');
  });

  test('parses a typed rate string', () => {
    expect(applicationContact(tutor, { rate: '$65/hr' }).quotedRate).toBe(65);
  });

  test('omits quotedRate entirely when no usable rate was given', () => {
    expect(applicationContact(tutor, { rate: null })).not.toHaveProperty('quotedRate');
    expect(applicationContact(tutor, { rate: 'ask me' })).not.toHaveProperty('quotedRate');
  });
});

// Minimal Assignment stand-in: records the updateOne calls and returns queued results.
function fakeModel(results) {
  const calls = [];
  return {
    calls,
    updateOne: async (filter, update, options) => {
      calls.push({ filter, update, options });
      return results[calls.length - 1] ?? { matchedCount: 0, modifiedCount: 0 };
    },
  };
}

describe('recordApplicationInterest', () => {
  test('pushes a new contact when the tutor was never messaged for this assignment', async () => {
    const model = fakeModel([
      { matchedCount: 0, modifiedCount: 0 }, // no existing row to flip
      { matchedCount: 1, modifiedCount: 1 }, // push succeeds
    ]);
    const result = await recordApplicationInterest(model, 'a1', tutor, { rate: 60 });

    expect(result).toEqual({ flipped: false, added: true });
    expect(model.calls).toHaveLength(2);
    expect(model.calls[1].update.$push['outreach.contacts']).toMatchObject({
      tutorId: 'tutor1',
      status: 'Interested',
      channel: 'application',
    });
  });

  test('flips the existing outreach row instead of duplicating the tutor', async () => {
    const model = fakeModel([{ matchedCount: 1, modifiedCount: 1 }]);
    const result = await recordApplicationInterest(model, 'a1', tutor, { rate: 60 });

    expect(result).toEqual({ flipped: true, added: false });
    expect(model.calls).toHaveLength(1); // never reaches the push
    const { update, options } = model.calls[0];
    expect(update.$set['outreach.contacts.$[c].status']).toBe('Interested');
    expect(update.$set['outreach.contacts.$[c].quotedRate']).toBe(60);
    expect(options.arrayFilters).toEqual([{ 'c.tutorId': 'tutor1' }]);
  });

  test('a matched-but-unmodified row still counts as flipped, not duplicated', async () => {
    const model = fakeModel([{ matchedCount: 1, modifiedCount: 0 }]);
    const result = await recordApplicationInterest(model, 'a1', tutor, { rate: 60 });

    expect(result).toEqual({ flipped: true, added: false });
    expect(model.calls).toHaveLength(1);
  });

  test('never overwrites a stored quotedRate with nothing when no rate was given', async () => {
    const model = fakeModel([{ matchedCount: 1, modifiedCount: 1 }]);
    await recordApplicationInterest(model, 'a1', tutor, { rate: null });

    expect(model.calls[0].update.$set).not.toHaveProperty('outreach.contacts.$[c].quotedRate');
  });

  test('leaves a parent-rejected contact alone — reapplying must not resurrect them', async () => {
    const model = fakeModel([{ matchedCount: 0, modifiedCount: 0 }, { matchedCount: 0, modifiedCount: 0 }]);
    await recordApplicationInterest(model, 'a1', tutor, { rate: 60 });

    expect(model.calls[0].filter['outreach.contacts']).toMatchObject({
      $elemMatch: { tutorId: 'tutor1', parentRejectedAt: { $exists: false } },
    });
  });

  test('guards the push against a concurrent duplicate', async () => {
    const model = fakeModel([{ matchedCount: 0, modifiedCount: 0 }, { matchedCount: 1, modifiedCount: 1 }]);
    await recordApplicationInterest(model, 'a1', tutor, { rate: 60 });

    expect(model.calls[1].filter['outreach.contacts.tutorId']).toEqual({ $ne: 'tutor1' });
  });
});
