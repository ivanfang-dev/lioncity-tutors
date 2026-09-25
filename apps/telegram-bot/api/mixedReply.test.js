import { jest } from '@jest/globals';

// A mixed WhatsApp reply keeps the text as a note and asks the tutor to tap Yes/No.
const recordReplyNote = jest.fn();
const recordTutorReply = jest.fn();
const sendWhatsApp = jest.fn(async () => {});
const sendWhatsAppButtons = jest.fn(async () => {});
const notifyOwner = jest.fn(async () => {});

jest.unstable_mockModule('../utils/recordTutorReply.js', () => ({ recordReplyNote, recordTutorReply }));
jest.unstable_mockModule('../utils/whatsappSender.js', () => ({
  sendWhatsApp, sendWhatsAppButtons, sendWhatsAppList: jest.fn(async () => {}),
}));
jest.unstable_mockModule('../utils/ownerAlert.js', () => ({ notifyOwner }));
jest.unstable_mockModule('../utils/tutorLookup.js', () => ({
  getRecentOutreachForNumber: jest.fn(async () => null),
  getTutorNameByNumber: jest.fn(async () => 'Jane Tan'),
}));
const actualRateCapture = await import('../utils/rateCapture.js');
jest.unstable_mockModule('../utils/rateCapture.js', () => ({
  ...actualRateCapture, recordQuotedRate: jest.fn(async () => ({ matched: false })),
}));

const { default: handler } = await import('./whatsapp-webhook.js');

const res = () => ({ status: jest.fn().mockReturnThis(), json: jest.fn(), send: jest.fn(), end: jest.fn() });
const inbound = (msg) => ({ method: 'POST', body: { entry: [{ changes: [{ value: { messages: [{ from: '6591234567', ...msg }] } }] }] } });

beforeEach(() => jest.clearAllMocks());

test('saves the note and sends Yes/No buttons instead of recording a reply', async () => {
  recordReplyNote.mockResolvedValue({ matched: true, assignmentId: 'a1', assignmentTitle: 'P5 Math @ Bedok' });

  await handler(inbound({ type: 'text', text: { body: 'Yes, but not free on weekdays' } }), res());

  expect(recordReplyNote).toHaveBeenCalledWith('6591234567', 'Yes, but not free on weekdays');
  expect(recordTutorReply).not.toHaveBeenCalled();
  const [to, { body, buttons }] = sendWhatsAppButtons.mock.calls[0];
  expect(to).toBe('6591234567');
  expect(body).toContain('P5 Math @ Bedok');
  expect(buttons.map(b => b.title)).toEqual(['Yes, interested', 'Not available']);
  expect(buttons.every(b => b.title.length <= 20)).toBe(true);
});

test('the tap on those buttons is recorded as a normal reply', async () => {
  recordTutorReply.mockResolvedValue({ matched: true, assignmentId: 'a1', ratePrompt: "What's your rate?" });

  await handler(inbound({ type: 'interactive', interactive: { button_reply: { id: 'confirm_yes', title: 'Yes, interested' } } }), res());

  expect(recordTutorReply).toHaveBeenCalledWith('6591234567', 'yes');
});

test('a mixed reply with no open outreach goes to the owner, not buttons', async () => {
  recordReplyNote.mockResolvedValue({ matched: false, reason: 'unknown' });

  await handler(inbound({ type: 'text', text: { body: 'Yes, but not free on weekdays' } }), res());

  expect(sendWhatsAppButtons).not.toHaveBeenCalled();
  expect(notifyOwner.mock.calls[0][0]).toContain('Yes, but not free on weekdays');
});

test('a mixed reply on a closed assignment gets the closed ack', async () => {
  recordReplyNote.mockResolvedValue({ matched: false, reason: 'closed' });

  await handler(inbound({ type: 'text', text: { body: 'Yes, but not free on weekdays' } }), res());

  expect(sendWhatsAppButtons).not.toHaveBeenCalled();
  expect(sendWhatsApp.mock.calls[0][1]).toContain('already been closed');
});
