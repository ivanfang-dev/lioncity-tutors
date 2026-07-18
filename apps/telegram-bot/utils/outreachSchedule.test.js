import { describe, test, expect } from '@jest/globals';
import { sgHour, isNightSG, activeElapsedMs } from './outreachSchedule.js';

// SGT = UTC+8, no DST. So a UTC wall-clock maps to SGT by +8h. These use explicit UTC instants
// (Z-suffixed) so the assertions are independent of the machine's timezone.
const at = (utc) => new Date(utc);
const HOUR = 60 * 60 * 1000;

describe('sgHour', () => {
  test('shifts UTC to Singapore local hour', () => {
    expect(sgHour(at('2026-07-18T00:00:00Z'))).toBe(8);  // 08:00 SGT
    expect(sgHour(at('2026-07-18T14:00:00Z'))).toBe(22); // 22:00 SGT
    expect(sgHour(at('2026-07-18T16:30:00Z'))).toBe(0);  // 00:30 SGT next day
  });
});

describe('isNightSG', () => {
  test('22:00–08:00 SGT is night (no waves)', () => {
    expect(isNightSG(at('2026-07-18T14:00:00Z'))).toBe(true);  // 22:00 SGT — inclusive start
    expect(isNightSG(at('2026-07-18T18:00:00Z'))).toBe(true);  // 02:00 SGT
    expect(isNightSG(at('2026-07-18T23:59:00Z'))).toBe(true);  // 07:59 SGT
  });

  test('08:00–22:00 SGT is daytime (waves allowed)', () => {
    expect(isNightSG(at('2026-07-18T00:00:00Z'))).toBe(false); // 08:00 SGT — exclusive end
    expect(isNightSG(at('2026-07-18T04:00:00Z'))).toBe(false); // 12:00 SGT
    expect(isNightSG(at('2026-07-18T13:59:00Z'))).toBe(false); // 21:59 SGT
  });
});

describe('activeElapsedMs', () => {
  test('a span fully within daytime counts in full', () => {
    // 10:00 → 14:00 SGT = 02:00 → 06:00 UTC
    expect(activeElapsedMs(at('2026-07-18T02:00:00Z'), at('2026-07-18T06:00:00Z'))).toBe(4 * HOUR);
  });

  test('excludes the overnight quiet window', () => {
    // 21:00 SGT → 09:00 SGT next day: 1h before 22:00 + 1h after 08:00 = 2h active.
    // 21:00 SGT = 13:00 UTC; 09:00 SGT next day = 01:00 UTC next day.
    expect(activeElapsedMs(at('2026-07-18T13:00:00Z'), at('2026-07-19T01:00:00Z'))).toBe(2 * HOUR);
  });

  test('a span entirely inside the night counts as zero', () => {
    // 23:00 → 05:00 SGT = 15:00 → 21:00 UTC
    expect(activeElapsedMs(at('2026-07-18T15:00:00Z'), at('2026-07-18T21:00:00Z'))).toBe(0);
  });

  test('spanning multiple nights sums only the daytime portions', () => {
    // 08:00 SGT day1 → 08:00 SGT day3 = two full daytime windows (14h each) = 28h.
    // 08:00 SGT = 00:00 UTC.
    expect(activeElapsedMs(at('2026-07-18T00:00:00Z'), at('2026-07-20T00:00:00Z'))).toBe(28 * HOUR);
  });

  test('clamps a partial first day correctly', () => {
    // 20:00 SGT → 23:00 SGT same day: 2h daytime (20:00–22:00), 1h night. = 2h.
    // 20:00 SGT = 12:00 UTC; 23:00 SGT = 15:00 UTC.
    expect(activeElapsedMs(at('2026-07-18T12:00:00Z'), at('2026-07-18T15:00:00Z'))).toBe(2 * HOUR);
  });

  test('zero or reversed spans are zero', () => {
    expect(activeElapsedMs(at('2026-07-18T06:00:00Z'), at('2026-07-18T06:00:00Z'))).toBe(0);
    expect(activeElapsedMs(at('2026-07-18T06:00:00Z'), at('2026-07-18T02:00:00Z'))).toBe(0);
  });
});
