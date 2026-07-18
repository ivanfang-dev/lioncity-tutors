import { describe, test, expect } from '@jest/globals';
import {
  DECLINE_REASONS, declineReasonKeyboard, declineReasonListRows, isDeclineReason, parseListReplyId,
} from './declineReason.js';

const ASSIGNMENT_ID = '68f0a1b2c3d4e5f600000001';

describe('DECLINE_REASONS', () => {
  test('matches the Assignment.declineReason enum exactly', () => {
    expect(DECLINE_REASONS).toEqual(['rate', 'distance', 'schedule', 'inactive', 'other']);
  });
});

describe('isDeclineReason', () => {
  test('accepts every enum value and rejects anything else', () => {
    for (const r of DECLINE_REASONS) expect(isDeclineReason(r)).toBe(true);
    expect(isDeclineReason('bogus')).toBe(false);
    expect(isDeclineReason('')).toBe(false);
    expect(isDeclineReason(undefined)).toBe(false);
  });
});

describe('declineReasonKeyboard', () => {
  test('offers one button per reason, carrying the assignment id back', () => {
    const kb = declineReasonKeyboard('abc123');
    expect(kb).toHaveLength(DECLINE_REASONS.length);
    for (const [btn] of kb) {
      expect(btn.callback_data).toMatch(/^outreach_reason_(rate|distance|schedule|inactive|other)_abc123$/);
      expect(btn.text.length).toBeGreaterThan(0);
    }
  });

  test('callback_data round-trips through the handler regex', () => {
    const [[btn]] = declineReasonKeyboard('68f0a1b2c3d4e5f600000001');
    const [, reason, assignmentId] = btn.callback_data.match(/^outreach_reason_([a-z]+)_(.+)$/);
    expect(reason).toBe('rate');
    expect(assignmentId).toBe('68f0a1b2c3d4e5f600000001');
  });

  test('stays inside Telegram\'s 64-byte callback_data limit for a real ObjectId', () => {
    for (const [btn] of declineReasonKeyboard('68f0a1b2c3d4e5f600000001')) {
      expect(Buffer.byteLength(btn.callback_data, 'utf8')).toBeLessThanOrEqual(64);
    }
  });
});

describe('declineReasonListRows', () => {
  test('carries the assignment id back with each reason', () => {
    const rows = declineReasonListRows(ASSIGNMENT_ID);
    expect(rows.map(r => r.id)).toEqual(DECLINE_REASONS.map(r => `${r}:${ASSIGNMENT_ID}`));
  });

  test('respects the Cloud API list-row limits (24-char title, 72-char description, 200-char id)', () => {
    for (const row of declineReasonListRows(ASSIGNMENT_ID)) {
      expect(row.title.length).toBeGreaterThan(0);
      expect(row.title.length).toBeLessThanOrEqual(24);
      expect(row.id.length).toBeLessThanOrEqual(200);
      if (row.description) expect(row.description.length).toBeLessThanOrEqual(72);
    }
  });

  test('fits in one list section — the reason we use a list, not buttons (which cap at 3)', () => {
    expect(declineReasonListRows(ASSIGNMENT_ID).length).toBeLessThanOrEqual(10);
    expect(declineReasonListRows(ASSIGNMENT_ID).length).toBeGreaterThan(3);
  });
});

describe('parseListReplyId', () => {
  test('round-trips every row id the list sends', () => {
    for (const row of declineReasonListRows(ASSIGNMENT_ID)) {
      const parsed = parseListReplyId(row.id);
      expect(parsed.assignmentId).toBe(ASSIGNMENT_ID);
      expect(DECLINE_REASONS).toContain(parsed.reason);
    }
  });

  test('rejects ids that are not ours rather than half-parsing them', () => {
    expect(parseListReplyId('bogus:123')).toBeNull();
    expect(parseListReplyId('rate')).toBeNull();
    expect(parseListReplyId('rate:')).toBeNull();
    expect(parseListReplyId('')).toBeNull();
    expect(parseListReplyId(undefined)).toBeNull();
  });
});
