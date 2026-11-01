import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { findTutorsLink } from './ownerAlert.js';

const draft = { level: 'Secondary 3', subject: 'Physics', location: 'Tampines', rate: '$40-50/hr' };

describe('findTutorsLink', () => {
  const saved = process.env.OPS_CONSOLE_URL;
  beforeEach(() => { process.env.OPS_CONSOLE_URL = 'https://example.com/'; });
  afterEach(() => { process.env.OPS_CONSOLE_URL = saved; });

  test('builds a pre-filled console search URL', () => {
    const url = new URL(findTutorsLink(draft));
    expect(url.origin + url.pathname).toBe('https://example.com/ops/find');
    expect(Object.fromEntries(url.searchParams)).toEqual(draft);
  });

  test('searches the first picked subject of a multi-subject request', () => {
    const url = new URL(findTutorsLink({ ...draft, subject: 'Multiple Subjects', subjects: ['Chemistry', 'Physics'] }));
    expect(url.searchParams.get('subject')).toBe('Chemistry');
  });

  test('returns null when the console URL is not configured', () => {
    delete process.env.OPS_CONSOLE_URL;
    expect(findTutorsLink(draft)).toBeNull();
  });
});
