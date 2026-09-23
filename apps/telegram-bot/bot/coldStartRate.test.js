import { jest } from '@jest/globals';

// A tutor's rate reply must reach rate capture even when the in-memory session is gone.
const recordQuotedRate = jest.fn(async () => ({ matched: true, rate: 45, assignmentTitle: 'P5 Math' }));
const actualRateCapture = await import('../utils/rateCapture.js');
jest.unstable_mockModule('../utils/rateCapture.js', () => ({ ...actualRateCapture, recordQuotedRate }));

const { handleMessage } = await import('./handlers.js');

function fakeBot() {
  return { sendMessage: jest.fn(async () => ({})) };
}

const tutorDoc = { _id: '64b000000000000000000001', fullName: 'Jane Tan' };

test('a known tutor replying "45" after a cold start has the rate recorded', async () => {
  const bot = fakeBot();
  const Tutor = { findOne: jest.fn(async () => tutorDoc) };
  const userSessions = {};

  await handleMessage(bot, 111, 111, '45', { text: '45' }, Tutor, {}, userSessions, []);

  expect(Tutor.findOne).toHaveBeenCalledWith({ telegramId: 111 });
  expect(recordQuotedRate).toHaveBeenCalledWith({ tutorId: tutorDoc._id, text: '45' });
  expect(bot.sendMessage.mock.calls[0][1]).toContain('Noted — $45/hr');
});

test('an unknown Telegram user is still sent to /start', async () => {
  recordQuotedRate.mockClear();
  const bot = fakeBot();
  const Tutor = { findOne: jest.fn(async () => null) };

  await handleMessage(bot, 222, 222, '45', { text: '45' }, Tutor, {}, {}, []);

  expect(recordQuotedRate).not.toHaveBeenCalled();
  expect(bot.sendMessage.mock.calls[0][1]).toContain('share your contact number');
});
