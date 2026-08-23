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

  test('shows the rate a tutor quoted for this assignment, not their stale profile rate', () => {
    // Alice's profile says $45, but she quoted $55 for this specific assignment. The parent
    // must see $55 — quoting the stale profile rate is exactly the failure Phase 4 fixes.
    const withQuote = deterministicShortlist(assignment, [{ ...tutors[0], quotedRate: 55 }]);
    expect(withQuote).toContain('$55/hr');
    expect(withQuote).not.toContain('$45/hr');
  });
});

describe('deterministicShortlist — concrete credentials from the profile', () => {
  const rich = {
    fullName: 'Cara Ng',
    tutorType: 'Full-time Tutor',
    yearsOfExperience: '5-10 years',
    highestEducation: "Bachelor's Degree",
    currentSchool: 'NUS Mechanical Engineering',
    previousSchools: 'Raffles Institution',
    hourlyRate: { secondary: '$50/hr' },
    stats: { placed: 12, survived30d: 11 },
    teachingExperience: 'Taught Sec 3 and Sec 4 E-Maths for six years at a centre in Bishan.',
    profileFeatures: {
      subjectsClaimed: [
        { subject: 'Mathematics', level: 'Secondary', evidence: 'Brought 8 students from C5 to A2 in O-Level E-Maths.' },
        { subject: 'Physics', level: 'Secondary', evidence: 'Occasional physics support.' },
      ],
    },
  };

  test('surfaces education and schools, which parents actually weigh', () => {
    const msg = deterministicShortlist(assignment, [rich]);
    expect(msg).toContain('NUS Mechanical Engineering');
    expect(msg).toContain('Raffles Institution');
  });

  test('quotes the placement record as numbers', () => {
    const msg = deterministicShortlist(assignment, [rich]);
    expect(msg).toContain('12 placements');
    expect(msg).toContain('11');
  });

  test('picks the subject-matched evidence, not the first claim listed', () => {
    const msg = deterministicShortlist(assignment, [rich]);
    expect(msg).toContain('C5 to A2');
    expect(msg).not.toContain('Occasional physics support');
  });

  test('a bare profile still produces a valid message with no empty lines', () => {
    const msg = deterministicShortlist(assignment, [{ fullName: 'Min Lee' }]);
    expect(msg).toContain('Min Lee');
    expect(msg).not.toMatch(/\n {3}\n/);
    expect(msg).not.toContain('undefined');
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

  test('budget kind quotes the typical range and the suggested rate (Phase 8)', async () => {
    const calib = { typical: { p25: 35, p50: 45, p75: 55 }, suggested: 60 };
    const msg = await draftParentMessage('budget', { assignment, calib });
    expect(msg).toContain('$35–$55/hr');
    expect(msg).toContain('$60/hr');
    expect(msg).toContain('Sec 3 Maths');
    expect(msg.toLowerCase()).toContain('do our very best'); // stays no-pressure
  });
});
