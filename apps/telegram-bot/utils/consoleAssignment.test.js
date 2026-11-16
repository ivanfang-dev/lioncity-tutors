import { describe, test, expect } from '@jest/globals';
import { validateConsoleAssignment } from './consoleAssignment.js';

const good = {
  title: 'Primary 4 Mathematics @ Bishan', level: 'Primary 4', subject: 'Mathematics',
  location: 'Bishan', rate: '$45/h', frequency: '1x a week, 1.5h',
};

describe('validateConsoleAssignment', () => {
  test('accepts a complete assignment and trims it', () => {
    const r = validateConsoleAssignment({ ...good, title: '  T  ', description: '   ' });
    expect(r).toEqual({ ok: true, data: { ...good, title: 'T' } });
  });

  test('keeps a non-blank description', () => {
    const r = validateConsoleAssignment({ ...good, description: ' Exam in May ' });
    expect(r.data.description).toBe('Exam in May');
  });

  test.each(['title', 'level', 'subject', 'location', 'rate', 'frequency'])('missing %s', f => {
    expect(validateConsoleAssignment({ ...good, [f]: '   ' })).toEqual({ ok: false, error: `missing_${f}` });
  });

  test('rejects a subject the level does not offer', () => {
    expect(validateConsoleAssignment({ ...good, subject: 'Economics' })).toEqual({ ok: false, error: 'invalid_subject' });
  });

  test('an empty body reports the first missing field', () => {
    expect(validateConsoleAssignment(undefined)).toEqual({ ok: false, error: 'missing_title' });
  });
});
