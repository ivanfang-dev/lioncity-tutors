import { describe, test, expect } from '@jest/globals';
import { responseLatencyMins } from './recordTutorReply.js';

const sent = new Date('2026-07-17T10:00:00Z');
const mins = (n) => new Date(sent.getTime() + n * 60 * 1000);

describe('responseLatencyMins', () => {
  test('returns whole minutes between the send and the reply', () => {
    expect(responseLatencyMins(sent, mins(42))).toBe(42);
  });

  test('rounds to the nearest minute', () => {
    expect(responseLatencyMins(sent, new Date(sent.getTime() + 90 * 1000))).toBe(2);
    expect(responseLatencyMins(sent, new Date(sent.getTime() + 80 * 1000))).toBe(1);
  });

  test('a sub-30s reply is 0, not a fraction', () => {
    expect(responseLatencyMins(sent, new Date(sent.getTime() + 5 * 1000))).toBe(0);
  });

  test('clamps clock skew to 0 rather than reporting a negative latency', () => {
    expect(responseLatencyMins(sent, mins(-5))).toBe(0);
  });

  test('returns null when sentAt is missing (legacy contacts predate the field)', () => {
    expect(responseLatencyMins(undefined, mins(10))).toBeNull();
    expect(responseLatencyMins(null, mins(10))).toBeNull();
  });

  test('returns null when respondedAt is missing', () => {
    expect(responseLatencyMins(sent, undefined)).toBeNull();
  });

  test('returns null for an unparseable date rather than NaN', () => {
    expect(responseLatencyMins(sent, new Date('nonsense'))).toBeNull();
  });
});
