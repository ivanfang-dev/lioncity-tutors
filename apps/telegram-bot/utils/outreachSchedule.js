// Time-of-day outreach gating (roadmap Phase 10, step 1). Tutor waves shouldn't fire in the middle
// of the night, and an assignment posted at 21:00 shouldn't burn its 4h outreach budget overnight
// while nothing is being sent. Both questions reduce to Singapore local time.
//
// Singapore has NO daylight saving and is a fixed UTC+8, so we work in SGT by shifting the epoch —
// no timezone library, and the math stays exact and unit-testable. Pure functions only.

const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;
const SG_OFFSET_MS = 8 * HOUR_MS; // UTC+8, fixed

// The quiet window when no waves go out AND which doesn't count toward the outreach time cap:
// 22:00 (inclusive) to 08:00 (exclusive), Singapore time.
const NIGHT_START_HOUR = 22;
const NIGHT_END_HOUR = 8;

const ms = (d) => (d instanceof Date ? d.getTime() : new Date(d).getTime());

// Hour-of-day (0..23) in Singapore for an instant. Exported for tests/diagnostics.
export function sgHour(date = new Date()) {
  return Math.floor((ms(date) + SG_OFFSET_MS) / HOUR_MS) % 24;
}

// True during the 22:00–08:00 SGT quiet hours — when the tick must not send tutor waves.
export function isNightSG(date = new Date()) {
  const h = sgHour(date);
  return h >= NIGHT_START_HOUR || h < NIGHT_END_HOUR;
}

// Milliseconds between `start` and `end` that fall within DAYTIME SG hours (08:00–22:00), i.e. the
// elapsed that counts toward the outreach time cap with the overnight quiet window excluded.
// Analytic (no sampling): shift to SGT, then sum each SGT day's daytime overlap. Pure.
export function activeElapsedMs(start, end) {
  const s = ms(start) + SG_OFFSET_MS;
  const e = ms(end) + SG_OFFSET_MS;
  if (!(e > s)) return 0;

  let total = 0;
  const firstDay = Math.floor(s / DAY_MS);
  const lastDay = Math.floor((e - 1) / DAY_MS);
  for (let d = firstDay; d <= lastDay; d++) {
    const dayStart = d * DAY_MS + NIGHT_END_HOUR * HOUR_MS;   // 08:00 SGT
    const dayEnd = d * DAY_MS + NIGHT_START_HOUR * HOUR_MS;   // 22:00 SGT
    const lo = Math.max(s, dayStart);
    const hi = Math.min(e, dayEnd);
    if (hi > lo) total += hi - lo;
  }
  return total;
}
