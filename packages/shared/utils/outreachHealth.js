// Is the escalation tick still alive, and is outreach actually moving?
//
// The tick is the only thing that releases a held shortlist (escalation-tick.js writes the sole
// `outreach.shortlistReleasedAt` in the codebase), so when it stops, assignments sit in Holding
// and parents silently stop receiving tutors. Nothing surfaces that today: the tick failing looks
// exactly like a quiet week.
//
// Two independent signals, because either alone has a blind spot:
//   · heartbeat — the tick stamps Meta on every run. Catches a dead tick during a quiet period,
//     when no work exists to pile up.
//   · backlog — work sitting past its deadline. Catches a tick that boots and then fails partway,
//     which would still stamp a heartbeat.
//
// Pure: callers do the queries and pass counts in. Kept in shared/ because the watchdog runs on
// the WEBSITE deployment — a dead-man check hosted on the thing it watches dies with it.

// A tick fires far more often than this; a gap this long means it has stopped, not that it idled.
export const TICK_STALE_MS = 3 * 60 * 60 * 1000; // 3h

export function assessOutreachHealth({
  lastTickAt = null,
  holdingOverdue = 0,
  wavesOverdue = 0,
} = {}, now = new Date(), { staleAfterMs = TICK_STALE_MS } = {}) {
  const at = lastTickAt ? new Date(lastTickAt) : null;
  const validAt = at && !Number.isNaN(at.getTime()) ? at : null;
  const ageMs = validAt ? now.getTime() - validAt.getTime() : null;

  const problems = [];

  if (ageMs == null) {
    problems.push({
      kind: 'no_heartbeat',
      detail: 'the escalation tick has never recorded a run',
    });
  } else if (ageMs > staleAfterMs) {
    problems.push({
      kind: 'tick_stale',
      detail: `the escalation tick has not run in ${Math.floor(ageMs / 3600000)}h`,
    });
  }

  if (holdingOverdue > 0) {
    problems.push({
      kind: 'holding_overdue',
      detail: `${holdingOverdue} assignment${holdingOverdue === 1 ? '' : 's'} held past the hold window — parents are waiting on a shortlist`,
    });
  }

  if (wavesOverdue > 0) {
    problems.push({
      kind: 'waves_overdue',
      detail: `${wavesOverdue} active assignment${wavesOverdue === 1 ? '' : 's'} overdue for the next outreach wave`,
    });
  }

  return { healthy: problems.length === 0, problems, tickAgeMs: ageMs };
}

// The Telegram body for an unhealthy result. Returns null when healthy, so the caller's
// "alert only on a problem" branch is just `if (text)`.
export function formatHealthAlert(assessment) {
  if (!assessment || assessment.healthy) return null;
  const lines = assessment.problems.map(p => `• ${p.detail}`);
  return `🚨 *Outreach watchdog*\n\n${lines.join('\n')}\n\nCheck that the escalation tick is being called and that /api/escalation-tick is not erroring.`;
}
