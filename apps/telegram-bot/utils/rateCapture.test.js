import { describe, test, expect } from '@jest/globals';
import { parseRateReply, selectPendingRateContact, buildRatePrompt } from './rateCapture.js';

describe('buildRatePrompt', () => {
  test('quotes the posted rate so the tutor answers against a range, not a blank', () => {
    const prompt = buildRatePrompt({ rate: '$40-60/hr' });
    expect(prompt).toContain('$40-60/hr');
    expect(prompt.toLowerCase()).toContain('your rate');
  });

  test('still asks when the assignment has no posted rate', () => {
    const prompt = buildRatePrompt({});
    expect(prompt.toLowerCase()).toContain('your rate');
    expect(prompt).not.toContain('posted');
  });

  test('asks for a plain number, since the parser is anchored and rejects prose', () => {
    expect(buildRatePrompt({ rate: '$40/hr' }).toLowerCase()).toMatch(/number|just the|e\.g\./);
  });
});

describe('parseRateReply', () => {
  test('accepts the shapes tutors actually type', () => {
    expect(parseRateReply('45')).toBe(45);
    expect(parseRateReply('$45')).toBe(45);
    expect(parseRateReply('45/hr')).toBe(45);
    expect(parseRateReply('$45/hr')).toBe(45);
    expect(parseRateReply('$45/HR')).toBe(45);
    expect(parseRateReply('  50  ')).toBe(50);
    expect(parseRateReply('45.50')).toBe(45.5);
  });

  test('rejects yes/no intent so the rate parser never swallows a reply', () => {
    expect(parseRateReply('yes')).toBeNull();
    expect(parseRateReply('no')).toBeNull();
    expect(parseRateReply('interested')).toBeNull();
  });

  test('rejects prose — RateValidator is anchored, and a second looser parser is not worth its cost', () => {
    expect(parseRateReply('I charge 45')).toBeNull();
    expect(parseRateReply('45-60')).toBeNull();
    expect(parseRateReply('can we discuss?')).toBeNull();
  });

  test('rejects implausible numbers so a pasted phone number never becomes a rate', () => {
    expect(parseRateReply('91234567')).toBeNull();
    expect(parseRateReply('2026')).toBeNull();
    expect(parseRateReply('0')).toBeNull();
    expect(parseRateReply('2')).toBeNull();
  });

  test('allows a genuinely high hourly rate — a top JC tutor is not a parse error', () => {
    expect(parseRateReply('250')).toBe(250);
  });

  test('handles empty and non-string input', () => {
    expect(parseRateReply('')).toBeNull();
    expect(parseRateReply(null)).toBeNull();
    expect(parseRateReply(undefined)).toBeNull();
  });
});

describe('selectPendingRateContact', () => {
  const older = new Date('2026-07-17T10:00:00Z');
  const newer = new Date('2026-07-17T12:00:00Z');

  test('finds the contact we asked, matched by phone', () => {
    const contacts = [
      { phone: '6591111111', rateRequestedAt: older },
      { phone: '6592222222', rateRequestedAt: newer },
    ];
    expect(selectPendingRateContact(contacts, { phone: '6592222222' }).phone).toBe('6592222222');
  });

  test('finds the contact we asked, matched by tutorId', () => {
    const contacts = [
      { tutorId: 'aaa', rateRequestedAt: older },
      { tutorId: 'bbb', rateRequestedAt: newer },
    ];
    expect(selectPendingRateContact(contacts, { tutorId: 'bbb' }).tutorId).toBe('bbb');
  });

  test('picks the most recent request when a tutor holds several pending rows', () => {
    const contacts = [
      { phone: '6591111111', rateRequestedAt: older },
      { phone: '6591111111', rateRequestedAt: newer },
    ];
    expect(selectPendingRateContact(contacts, { phone: '6591111111' }).rateRequestedAt).toBe(newer);
  });

  test('ignores contacts that already answered — a second number must not overwrite the first', () => {
    const contacts = [{ phone: '6591111111', rateRequestedAt: older, quotedRate: 40 }];
    expect(selectPendingRateContact(contacts, { phone: '6591111111' })).toBeNull();
  });

  test('ignores contacts we never asked', () => {
    const contacts = [{ phone: '6591111111' }];
    expect(selectPendingRateContact(contacts, { phone: '6591111111' })).toBeNull();
  });

  test('returns null for a stranger, an empty list, and a missing list', () => {
    const contacts = [{ phone: '6591111111', rateRequestedAt: older }];
    expect(selectPendingRateContact(contacts, { phone: '6599999999' })).toBeNull();
    expect(selectPendingRateContact([], { phone: '6591111111' })).toBeNull();
    expect(selectPendingRateContact(undefined, { phone: '6591111111' })).toBeNull();
  });

  test('never matches when neither phone nor tutorId is given', () => {
    const contacts = [{ phone: '6591111111', rateRequestedAt: older }];
    expect(selectPendingRateContact(contacts, {})).toBeNull();
  });

  // Contacts store the 8-digit local form (normalizePhone), but Meta's webhook gives us a
  // wa_id ("6591234567") and tutor profiles carry every shape under the sun. Matching on the
  // raw string would silently find nothing — a rate that vanishes with no error anywhere.
  test('matches regardless of the shape the number arrives in', () => {
    const contacts = [{ phone: '91234567', rateRequestedAt: older }];
    for (const shape of ['91234567', '6591234567', '+65 9123 4567', '9123 4567']) {
      expect(selectPendingRateContact(contacts, { phone: shape })).not.toBeNull();
    }
  });

  test('still tells two different numbers apart after normalizing', () => {
    const contacts = [{ phone: '91234567', rateRequestedAt: older }];
    expect(selectPendingRateContact(contacts, { phone: '+65 9999 9999' })).toBeNull();
  });
});
