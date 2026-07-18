import { describe, test, expect, afterAll } from '@jest/globals';
import { buildWaMeButton, waMeLink, deterministicShortlist, draftParentMessage } from './parentMessage.js';

const assignment = { title: 'Sec 3 Maths', level: 'Secondary 3', subject: 'Mathematics', location: 'Bishan' };
const tutors = [
  { fullName: 'Alice Tan', tutorType: 'Full-time Tutor', yearsOfExperience: '5-10 years',
    hourlyRate: { secondary: '$45/hr' }, trackRecord: 'Raised 12 students from C to A in one year. Consistent results.' },
  { fullName: 'Bob Lim', tutorType: 'Part-time Tutor', yearsOfExperience: '1-3 years',
    hourlyRate: { secondary: '$30/hr' }, introduction: 'Patient NUS undergrad who makes maths click.' },
];

describe('buildWaMeButton', () => {
  test('builds a wa.me URL button with the SG country code and encoded text', () => {
    const btn = buildWaMeButton('91234567', 'Hi there!', 'Send via WhatsApp');
    expect(btn).toEqual({
      text: 'Send via WhatsApp',
      url: 'https://wa.me/6591234567?text=Hi%20there!',
    });
  });

  test('leaves an already-international number untouched', () => {
    const btn = buildWaMeButton('6591234567', 'x');
    expect(btn.url.startsWith('https://wa.me/6591234567?text=')).toBe(true);
  });

  test('returns null when the encoded URL would exceed the button limit (→ paste fallback)', () => {
    const huge = 'a'.repeat(2100);
    expect(buildWaMeButton('91234567', huge)).toBeNull();
  });
});

describe('waMeLink', () => {
  test('is a bare chat link with no text param', () => {
    expect(waMeLink('91234567')).toBe('https://wa.me/6591234567');
  });
});

describe('deterministicShortlist (guaranteed fallback)', () => {
  const msg = deterministicShortlist(assignment, tutors);

  test('names every tutor, their rate, and a differentiating line', () => {
    expect(msg).toContain('Alice Tan');
    expect(msg).toContain('$45/hr');
    expect(msg).toContain('Raised 12 students from C to A in one year.');
    expect(msg).toContain('Bob Lim');
    expect(msg).toContain('$30/hr');
    expect(msg).toContain('Patient NUS undergrad who makes maths click.');
  });

  test('opens with the assignment title and closes with a call to choose', () => {
    expect(msg).toContain('Sec 3 Maths');
    expect(msg.toLowerCase()).toContain('which tutor');
  });
});

describe('draftParentMessage without an API key falls back deterministically', () => {
  const orig = process.env.GEMINI_API_KEY;
  afterAll(() => { if (orig === undefined) delete process.env.GEMINI_API_KEY; else process.env.GEMINI_API_KEY = orig; });

  test('shortlist kind returns the deterministic template', async () => {
    delete process.env.GEMINI_API_KEY;
    const msg = await draftParentMessage('shortlist', { assignment, tutors });
    expect(msg).toBe(deterministicShortlist(assignment, tutors));
  });

  test('nudge and expectation kinds return non-empty owner-forwardable text', async () => {
    expect((await draftParentMessage('nudge', { assignment }))).toContain('Sec 3 Maths');
    expect((await draftParentMessage('expectation', { assignment })).toLowerCase()).toContain('6 hours');
  });
});
