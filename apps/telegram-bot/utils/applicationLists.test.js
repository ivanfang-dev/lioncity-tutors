import { describe, test, expect } from '@jest/globals';
import {
  adminViewAllApplications, viewMyApplications, TELEGRAM_MESSAGE_LIMIT,
} from '../bot/handlers.js';

// Telegram rejects a sendMessage over 4096 characters outright, and safeSend rethrows — so an
// unbounded list doesn't degrade, it fails with a generic error. These views grew past the limit
// on real data (292 assignments with applicants produced a 104k-character message).
function fakeAssignments(count, applicantsEach, tutorId = 't1') {
  return Array.from({ length: count }, (_, i) => ({
    _id: `a${i}`,
    title: `Primary 4 Mathematics at Bishan ${i}`,
    level: 'Primary 4',
    subject: 'Mathematics',
    location: 'Bishan',
    rate: '$40/hr',
    applicants: Array.from({ length: applicantsEach }, (_, j) => ({
      tutorId: { toString: () => tutorId },
      status: 'Pending',
      contactDetails: '+65 8123 4567',
      appliedAt: new Date('2026-01-15'),
      notes: 'Available weekday evenings',
      rate: '40',
    })),
  }));
}

function fakeModel(docs) {
  const chain = {
    sort: () => chain,
    skip: (n) => { chain._skip = n; return chain; },
    limit: (n) => { chain._limit = n; return chain; },
    then: undefined,
  };
  return {
    countDocuments: async () => docs.length,
    find: () => {
      const c = { _skip: 0, _limit: docs.length };
      const self = {
        sort: () => self,
        skip: (n) => { c._skip = n; return self; },
        limit: (n) => { c._limit = n; return self; },
        populate: () => self,
        then: (resolve) => resolve(docs.slice(c._skip, c._skip + c._limit)),
      };
      return self;
    },
  };
}

function recorder() {
  const sent = [];
  return {
    sent,
    bot: {
      sendMessage: async (_chat, text, options) => {
        sent.push({ text, buttons: (options?.reply_markup?.inline_keyboard || []).flat() });
        return { message_id: 1 };
      },
    },
  };
}

const pageButtons = (msg) => msg.buttons.map(b => b.callback_data);

describe('the admin all-applications view', () => {
  test('stays under the Telegram limit with the volume that broke it', async () => {
    const { bot, sent } = recorder();
    await adminViewAllApplications(bot, 1, fakeModel(fakeAssignments(292, 4)), 0);
    expect(sent).toHaveLength(1);
    expect(sent[0].text).not.toContain('error occurred');
    expect(sent[0].text.length).toBeLessThanOrEqual(TELEGRAM_MESSAGE_LIMIT);
  });

  test('stays under the limit even when every assignment is heavily applied to', async () => {
    const { bot, sent } = recorder();
    await adminViewAllApplications(bot, 1, fakeModel(fakeAssignments(292, 26)), 0);
    expect(sent[0].text.length).toBeLessThanOrEqual(TELEGRAM_MESSAGE_LIMIT);
  });

  test('offers a way to the next page, and back from it', async () => {
    const { bot, sent } = recorder();
    await adminViewAllApplications(bot, 1, fakeModel(fakeAssignments(292, 4)), 0);
    expect(pageButtons(sent[0])).toContain('admin_apps_page_1');
    expect(pageButtons(sent[0])).not.toContain('admin_apps_page_-1');

    await adminViewAllApplications(bot, 1, fakeModel(fakeAssignments(292, 4)), 1);
    expect(pageButtons(sent[1])).toContain('admin_apps_page_0');
    expect(pageButtons(sent[1])).toContain('admin_apps_page_2');
  });

  test('says which page it is showing', async () => {
    const { bot, sent } = recorder();
    await adminViewAllApplications(bot, 1, fakeModel(fakeAssignments(292, 4)), 0);
    expect(sent[0].text).toMatch(/Page 1 of \d+/);
  });

  test('a single page of results offers no pagination', async () => {
    const { bot, sent } = recorder();
    await adminViewAllApplications(bot, 1, fakeModel(fakeAssignments(2, 1)), 0);
    expect(pageButtons(sent[0]).filter(d => d.startsWith('admin_apps_page_'))).toEqual([]);
  });

  test('reports an empty set rather than an empty page', async () => {
    const { bot, sent } = recorder();
    await adminViewAllApplications(bot, 1, fakeModel([]), 0);
    expect(sent[0].text).toContain('No applications');
  });
});

describe("the tutor's own applications view", () => {
  const sessions = { 1: { tutorId: 't1' } };

  test('stays under the limit for the busiest applicant on record', async () => {
    const { bot, sent } = recorder();
    await viewMyApplications(bot, 1, sessions, fakeModel(fakeAssignments(368, 1)), 0);
    expect(sent[0].text.length).toBeLessThanOrEqual(TELEGRAM_MESSAGE_LIMIT);
  });

  test('offers a way to the next page', async () => {
    const { bot, sent } = recorder();
    await viewMyApplications(bot, 1, sessions, fakeModel(fakeAssignments(368, 1)), 0);
    expect(pageButtons(sent[0])).toContain('my_apps_page_1');
  });
});
