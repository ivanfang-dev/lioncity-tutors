import { jest } from '@jest/globals';

process.env.WHATSAPP_API_KEY = 'k';
process.env.BOT_TOKEN = 'tok';
process.env.CHANNEL_ID = '@chan';
process.env.BOT_USERNAME = 'lcbot';

// Console posts: Draft → channel post → Open, and never any tutor outreach.
const saves = [];
let lastDoc = null;
class FakeAssignment {
  constructor(data) { Object.assign(this, data); this._id = 'a1'; lastDoc = this; }
  async save() { saves.push(this.status); return this; }
}
FakeAssignment.deleteOne = jest.fn(async () => ({}));

const notifyMatchedTutors = jest.fn();
jest.unstable_mockModule('../utils/db.js', () => ({ connectToDatabase: async () => {} }));
jest.unstable_mockModule('../../../packages/shared/server-exports.js', () => ({ Assignment: FakeAssignment }));
jest.unstable_mockModule('../utils/tutorNotifier.js', () => ({
  notifyMatchedTutors, escalateAssignment: jest.fn(), remindNonResponders: jest.fn(), hasFreshTutors: jest.fn(),
}));

const { default: handler } = await import('../api/post-assignment.js');

const good = {
  title: 'Primary 4 Mathematics @ Bishan', level: 'Primary 4', subject: 'Mathematics',
  location: 'Bishan', rate: '$45/h', frequency: '1x a week, 1.5h',
};
const res = () => ({ status: jest.fn().mockReturnThis(), json: jest.fn() });
const req = (body, { method = 'POST', key = 'k' } = {}) => ({ method, headers: { 'x-api-key': key }, body });
const telegramOk = () => jest.fn(async () => ({ ok: true, json: async () => ({ ok: true, result: { message_id: 77 } }) }));

beforeEach(() => {
  saves.length = 0;
  lastDoc = null;
  FakeAssignment.deleteOne.mockClear();
  notifyMatchedTutors.mockClear();
  global.fetch = telegramOk();
});

test('posts Open with the channel message id, never contacts tutors', async () => {
  const r = res();
  await handler(req(good), r);
  expect(r.status).toHaveBeenCalledWith(200);
  expect(r.json).toHaveBeenCalledWith({ ok: true, assignmentId: 'a1' });
  expect(saves).toEqual(['Draft', 'Open']);
  expect(lastDoc.channelMessageId).toBe(77);
  expect(notifyMatchedTutors).not.toHaveBeenCalled();

  const [url, init] = global.fetch.mock.calls[0];
  expect(url).toBe('https://api.telegram.org/bottok/sendMessage');
  const body = JSON.parse(init.body);
  expect(body.chat_id).toBe('@chan');
  expect(body.reply_markup.inline_keyboard[0][0].url).toBe('https://t.me/lcbot?start=apply_a1');
});

test('the channel post reads as Open, not Draft', async () => {
  await handler(req(good), res());
  const text = JSON.parse(global.fetch.mock.calls[0][1].body).text;
  expect(text).toContain('*Status:* Open');
  expect(text).not.toContain('no longer open');
});

test('multi-subject post shows every subject on the channel', async () => {
  const r = res();
  await handler(req({ ...good, subject: undefined, subjects: ['Mathematics', 'Science'] }), r);
  expect(r.status).toHaveBeenCalledWith(200);
  expect(JSON.parse(global.fetch.mock.calls[0][1].body).text).toContain('Mathematics + Science');
});

test('markdown characters in fields still post, escaped', async () => {
  const r = res();
  await handler(req({ ...good, title: 'P4_Maths *urgent*' }), r);
  expect(r.status).toHaveBeenCalledWith(200);
  expect(JSON.parse(global.fetch.mock.calls[0][1].body).text).toContain('P4\\_Maths');
});

test('Telegram refusal deletes the draft', async () => {
  global.fetch = jest.fn(async () => ({ ok: false, status: 400, json: async () => ({ description: 'bad' }) }));
  const r = res();
  await handler(req(good), r);
  expect(r.status).toHaveBeenCalledWith(502);
  expect(r.json).toHaveBeenCalledWith({ error: 'channel_post_failed' });
  expect(FakeAssignment.deleteOne).toHaveBeenCalledWith({ _id: 'a1' });
  expect(saves).toEqual(['Draft']);
});

test('invalid body → 400 without touching the DB', async () => {
  const r = res();
  await handler(req({ ...good, frequency: ' ' }), r);
  expect(r.status).toHaveBeenCalledWith(400);
  expect(r.json).toHaveBeenCalledWith({ error: 'missing_frequency' });
  expect(saves).toEqual([]);
});

test('wrong api key → 401', async () => {
  const r = res();
  await handler(req(good, { key: 'nope' }), r);
  expect(r.status).toHaveBeenCalledWith(401);
  expect(saves).toEqual([]);
});

test('GET → 405', async () => {
  const r = res();
  await handler(req(good, { method: 'GET' }), r);
  expect(r.status).toHaveBeenCalledWith(405);
});
