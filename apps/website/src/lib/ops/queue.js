import { shortlistDecided, shortlistedContacts, funnelCounts, firstWaveSize } from '@lioncity/shared/utils/outreachState.js';

// Derives the "Needs you" queue from open assignments. Pure — no I/O — so the urgency rules stay
// testable and legible. The console is the state surface; Telegram stays the interrupt surface,
// which means this list has to be trustworthy: a row appears ONLY when the owner genuinely has to
// act, or it becomes scrollback like the thing it replaces.

const H = 60 * 60 * 1000;
const D = 24 * H;

// Thresholds mirror the escalation tick's (PARENT_NUDGE_AFTER_MS / PARENT_FLAG_AFTER_MS) so the
// console and the tick agree on when a parent counts as silent.
export const PARENT_SILENT_MS = 24 * H;
export const OPEN_TOO_LONG_MS = 5 * D;
// How many tutors wave 1 AIMS for — notifyMatchedTutors ranks the pool down to 8 and messages
// them. Note this is NOT the escalation wave size (6, OUTREACH_WAVE_SIZE): wave 1 is deliberately
// wider. Comparing a first wave against 6 would have called a pool of 6 or 7 healthy when it had
// in fact failed to fill the wave. A first wave short of this means the POOL was the constraint,
// not the schedule.
export const WAVE_ONE_TARGET = 8;
export const MIN_WAVES_FOR_ZERO_REPLIES = 2;

// Urgency order. Lower sorts first. The ranking is a claim about what earns money and what dies
// quietly: a shortlist the parent is waiting on is the closest thing to a placement, while an
// assignment that's merely old is the least time-sensitive.
export const ROW_PRIORITY = {
  shortlist_ready: 1,   // parent is waiting on us right now — fastest path to a placement
  parent_flagged: 2,    // 48h silent, auto-reminders stopped — dies unless a human intervenes
  parent_silent: 3,     // 24h silent — a nudge still recovers it
  outreach_exhausted: 4,// the machine gave up; only the owner can widen or work contacts
  pool_too_small: 5,    // will likely exhaust in ~4h — cheapest to fix BEFORE that happens
  no_replies: 6,        // reachability problem worth a look
  open_too_long: 7,     // stale; probably needs closing
};

function ageMs(date, now) {
  return date ? now - new Date(date).getTime() : 0;
}

// One row per assignment: the single most urgent thing about it. Showing an assignment three
// times (silent AND old AND no replies) would pad the queue without adding a decision — the owner
// acts on the assignment, not on the diagnosis.
function rowFor(assignment, now) {
  // A finished assignment is never work, whatever its outreach state says. Filled ones in
  // particular still carry a Fulfilled outreach with a thin contact list, which the diagnoses
  // below would happily misread as a problem.
  if (assignment.status === 'Filled' || assignment.status === 'Closed') return null;

  const o = assignment.outreach || {};
  const funnel = funnelCounts(assignment);
  const shortlisted = shortlistedContacts(assignment);
  const base = { assignmentId: String(assignment._id), title: assignment.title, funnel };

  // A released shortlist the parent hasn't answered. The silence clock starts at release, so the
  // same condition produces three rows of increasing urgency as it ages.
  if (o.status === 'Fulfilled' && o.shortlistReleasedAt && !shortlistDecided(assignment)) {
    const waiting = ageMs(o.shortlistReleasedAt, now);
    const tutorCount = shortlisted.length;

    if (o.parentSilenceEscalatedAt) {
      return { ...base, kind: 'parent_flagged', ageMs: waiting, shortlisted,
        diagnosis: `Parent silent ${Math.round(waiting / H)}h — auto-reminders stopped. Needs a manual follow-up.` };
    }
    if (waiting >= PARENT_SILENT_MS) {
      return { ...base, kind: 'parent_silent', ageMs: waiting, shortlisted,
        diagnosis: `No answer ${Math.round(waiting / H)}h after you sent ${tutorCount} profile${tutorCount === 1 ? '' : 's'}. Nudge them.` };
    }
    return { ...base, kind: 'shortlist_ready', ageMs: waiting, shortlisted,
      diagnosis: `${tutorCount} tutor${tutorCount === 1 ? '' : 's'} shortlisted from ${funnel.interested} interested — ready to send.` };
  }

  if (o.status === 'Exhausted') {
    return { ...base, kind: 'outreach_exhausted', ageMs: ageMs(o.startedAt, now), shortlisted,
      diagnosis: `Outreach stopped after ${funnel.contacted} tutor${funnel.contacted === 1 ? '' : 's'} with only ${funnel.interested} interested. Follow up manually.` };
  }

  // Everything below diagnoses outreach that's still RUNNING — a shortlist the parent already
  // answered, say, has a contact list these rules would misread. Enforced, not just intended.
  const running = ['Pending', 'Active', 'Holding'].includes(o.status);
  if (!running) return null;

  // Age first. The two diagnoses below are both "this is going wrong, act before the 4h cap burns"
  // — advice that's meaningless for something already days old. At that point the only real
  // decision is close it or push it, and the thin pool that caused it is on the drill-down.
  const age = ageMs(assignment.createdAt, now);
  if (age >= OPEN_TOO_LONG_MS) {
    return { ...base, kind: 'open_too_long', ageMs: age, shortlisted,
      diagnosis: `Open ${Math.round(age / D)} days with ${funnel.interested} interested. Close it or push it.` };
  }

  const firstWave = firstWaveSize(assignment);
  if (firstWave > 0 && firstWave < WAVE_ONE_TARGET) {
    return { ...base, kind: 'pool_too_small', ageMs: ageMs(o.startedAt, now), shortlisted,
      diagnosis: `Only ${firstWave} tutor${firstWave === 1 ? '' : 's'} matched at launch (wave 1 aims for ${WAVE_ONE_TARGET}). The budget or region is probably too tight.` };
  }

  if ((o.waveCount || 0) >= MIN_WAVES_FOR_ZERO_REPLIES && funnel.replied === 0 && funnel.contacted > 0) {
    return { ...base, kind: 'no_replies', ageMs: ageMs(o.startedAt, now), shortlisted,
      diagnosis: `${funnel.contacted} tutors messaged over ${o.waveCount} waves, zero replies.` };
  }

  return null; // healthy: outreach is doing its job, nothing for the owner to do
}

// The queue, most urgent first. Within a kind, oldest first — the one that's been waiting longest
// is the one most at risk.
export function buildNeedsYouRows(assignments, now = Date.now()) {
  return assignments
    .map(a => rowFor(a, now))
    .filter(Boolean)
    .sort((a, b) => (ROW_PRIORITY[a.kind] - ROW_PRIORITY[b.kind]) || (b.ageMs - a.ageMs));
}
