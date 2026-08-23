import { describe, test, expect } from '@jest/globals';
import {
  assessOutreachHealth, formatHealthAlert, TICK_STALE_MS,
} from '../../../packages/shared/utils/outreachHealth.js';

const now = new Date('2026-08-23T12:00:00Z');
const agoMs = ms => new Date(now.getTime() - ms);
const H = 3600000;

describe('assessOutreachHealth', () => {
  test('a recent tick with nothing overdue is healthy', () => {
    const r = assessOutreachHealth({ lastTickAt: agoMs(10 * 60000) }, now);
    expect(r.healthy).toBe(true);
    expect(r.problems).toEqual([]);
  });

  // The blind spot this covers: during a quiet week no work piles up, so backlog alone
  // would report healthy while the tick is dead.
  test('a stale heartbeat is caught even with no backlog', () => {
    const r = assessOutreachHealth({ lastTickAt: agoMs(5 * H) }, now);
    expect(r.healthy).toBe(false);
    expect(r.problems.map(p => p.kind)).toEqual(['tick_stale']);
    expect(r.problems[0].detail).toContain('5h');
  });

  test('a never-run tick is distinguished from a stale one', () => {
    expect(assessOutreachHealth({ lastTickAt: null }, now).problems[0].kind).toBe('no_heartbeat');
    expect(assessOutreachHealth({}, now).problems[0].kind).toBe('no_heartbeat');
  });

  test('an unparseable heartbeat is treated as no heartbeat, not as fresh', () => {
    const r = assessOutreachHealth({ lastTickAt: 'not a date' }, now);
    expect(r.problems[0].kind).toBe('no_heartbeat');
  });

  // The other blind spot: a tick that boots, stamps, then fails partway still looks alive.
  test('backlog is caught even when the heartbeat is fresh', () => {
    const r = assessOutreachHealth(
      { lastTickAt: agoMs(60000), holdingOverdue: 2, wavesOverdue: 3 }, now);
    expect(r.healthy).toBe(false);
    expect(r.problems.map(p => p.kind)).toEqual(['holding_overdue', 'waves_overdue']);
  });

  test('reports every problem at once rather than only the first', () => {
    const r = assessOutreachHealth(
      { lastTickAt: agoMs(9 * H), holdingOverdue: 1, wavesOverdue: 1 }, now);
    expect(r.problems.map(p => p.kind)).toEqual(['tick_stale', 'holding_overdue', 'waves_overdue']);
  });

  test('singular and plural read correctly', () => {
    const one = assessOutreachHealth({ lastTickAt: now, holdingOverdue: 1 }, now);
    expect(one.problems[0].detail).toContain('1 assignment held');
    const many = assessOutreachHealth({ lastTickAt: now, holdingOverdue: 4 }, now);
    expect(many.problems[0].detail).toContain('4 assignments held');
  });

  test('sits just inside and just outside the staleness threshold', () => {
    expect(assessOutreachHealth({ lastTickAt: agoMs(TICK_STALE_MS - 1000) }, now).healthy).toBe(true);
    expect(assessOutreachHealth({ lastTickAt: agoMs(TICK_STALE_MS + 1000) }, now).healthy).toBe(false);
  });
});

describe('formatHealthAlert', () => {
  test('returns null when healthy, so the caller just checks for text', () => {
    expect(formatHealthAlert(assessOutreachHealth({ lastTickAt: now }, now))).toBeNull();
    expect(formatHealthAlert(null)).toBeNull();
  });

  test('lists every problem in the alert body', () => {
    const text = formatHealthAlert(assessOutreachHealth(
      { lastTickAt: agoMs(9 * H), holdingOverdue: 2 }, now));
    expect(text).toContain('Outreach watchdog');
    expect(text).toContain('has not run in 9h');
    expect(text).toContain('2 assignments held');
  });
});
