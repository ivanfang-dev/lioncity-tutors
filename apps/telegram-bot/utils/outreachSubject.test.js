import { describe, test, expect } from '@jest/globals';
import { formatAssignmentForChannel } from './channelFormat.js';
import { formatAssignmentDM } from './telegramOutreach.js';
import { buildAssignmentParams } from './tutorNotifier.js';

// Everything a tutor reads about an assignment should name the subjects it actually covers.
// "Multiple Subjects" is a wizard category, not something a tutor can decide against.
const multi = {
  title: 'P4 Maths and Science',
  level: 'Primary 4',
  subject: 'Multiple Subjects',
  subjects: ['Mathematics', 'Science'],
  location: 'Bishan',
  frequency: 'Twice a week',
  rate: '$40/hr',
};
const single = { ...multi, subject: 'Mathematics', subjects: undefined, title: 'P4 Maths' };

describe('the channel post', () => {
  test('names the subjects rather than the category', () => {
    expect(formatAssignmentForChannel(multi)).toContain('Mathematics + Science');
    expect(formatAssignmentForChannel(multi)).not.toContain('Multiple Subjects');
  });

  test('is unchanged for an ordinary single-subject assignment', () => {
    expect(formatAssignmentForChannel(single)).toContain('Mathematics');
  });
});

describe('the Telegram outreach DM', () => {
  test('names the subjects rather than the category', () => {
    expect(formatAssignmentDM(multi)).toContain('Mathematics + Science');
    expect(formatAssignmentDM(multi)).not.toContain('Multiple Subjects');
  });

  test('is unchanged for an ordinary single-subject assignment', () => {
    expect(formatAssignmentDM(single)).toContain('Mathematics');
  });
});

describe('the WhatsApp template params', () => {
  test('sends the subjects as {{3}}', () => {
    expect(buildAssignmentParams(multi)[2]).toBe('Mathematics + Science');
  });

  test('is unchanged for an ordinary single-subject assignment', () => {
    expect(buildAssignmentParams(single)[2]).toBe('Mathematics');
  });

  test('every param stays single-line and non-empty — Meta rejects both', () => {
    for (const param of buildAssignmentParams(multi)) {
      expect(String(param).trim()).not.toBe('');
      expect(String(param)).not.toMatch(/[\n\t]/);
    }
  });
});
