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
  test('a subject list of two posts as Multiple Subjects', () => {
    const r = validateConsoleAssignment({ ...good, subject: undefined, subjects: ['Mathematics', 'Science'] });
    expect(r.data.subject).toBe('Multiple Subjects');
    expect(r.data.subjects).toEqual(['Mathematics', 'Science']);
  });

  test('a one-element list is a plain subject', () => {
    const r = validateConsoleAssignment({ ...good, subject: undefined, subjects: ['Mathematics'] });
    expect(r.data.subject).toBe('Mathematics');
    expect(r.data).not.toHaveProperty('subjects');
  });

  test('any subject the level lacks is rejected', () => {
    expect(validateConsoleAssignment({ ...good, subject: undefined, subjects: ['Mathematics', 'Economics'] }))
      .toEqual({ ok: false, error: 'invalid_subject' });
  });

  test('an empty list is a missing subject', () => {
    expect(validateConsoleAssignment({ ...good, subject: undefined, subjects: [] }))
      .toEqual({ ok: false, error: 'missing_subject' });
  });

  test('duplicate subjects in the list collapse', () => {
    const r = validateConsoleAssignment({ ...good, subject: undefined, subjects: ['Science', ' Science '] });
    expect(r.data.subject).toBe('Science');
  });
});
