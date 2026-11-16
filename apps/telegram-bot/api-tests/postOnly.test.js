import { jest } from '@jest/globals';

// "Post only" must post to the channel without messaging any tutor.
const notifyMatchedTutors = jest.fn(async () => ({ sent: 0, failed: 0 }));
jest.unstable_mockModule('../utils/tutorNotifier.js', () => ({
  notifyMatchedTutors, escalateAssignment: jest.fn(), remindNonResponders: jest.fn(), hasFreshTutors: jest.fn(),
}));
jest.unstable_mockModule('@vercel/functions', () => ({ waitUntil: (p) => p }));

const { confirmPostAssignment } = await import('../bot/handlers.js');

function setup() {
  const sent = [];
  const bot = {
    sendMessage: jest.fn(async (_chat, text) => { sent.push(text); return { message_id: 42 }; }),
  };
  const draft = {
    _id: 'a1', status: 'Draft', subject: 'Mathematics', level: 'Primary 4', title: 'P4 Maths',
    location: 'Bishan', save: jest.fn(async () => {}),
  };
  const Assignment = { findById: jest.fn(async () => draft) };
  return { bot, draft, Assignment, sent, sessions: { 1: { state: 'X' } } };
}

beforeEach(() => notifyMatchedTutors.mockClear());

test('post only: goes Open on the channel, no outreach', async () => {
  const { bot, draft, Assignment, sent, sessions } = setup();
  await confirmPostAssignment(bot, 1, sessions, Assignment, '@chan', 'bot', 'a1', { withGuidance: false, outreach: false });
  expect(draft.status).toBe('Open');
  expect(notifyMatchedTutors).not.toHaveBeenCalled();
  expect(sent.some(t => t.includes('Tutors not contacted'))).toBe(true);
});

test('default confirm still starts outreach', async () => {
  const { bot, Assignment, sessions } = setup();
  await confirmPostAssignment(bot, 1, sessions, Assignment, '@chan', 'bot', 'a1', { withGuidance: false });
  expect(notifyMatchedTutors).toHaveBeenCalledTimes(1);
});
