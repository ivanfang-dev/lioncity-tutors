import { Tutor } from '../../../packages/shared/server-exports.js';
import { sendReactivationDM } from './telegramOutreach.js';

// Dormancy auto-pause + reactivation (roadmap Phase 10, step 3). Tutors we've messaged many times
// without a reply, and who haven't shown any confirmed activity in months, are almost certainly no
// longer tutoring — they pollute pools and waste WhatsApp sends. Auto-pause them (pausedAt is a hard
// matching filter, Phase 4), and if they're Telegram-linked give them ONE free tap to come back.

const DORMANT_MISS_THRESHOLD = Number(process.env.DORMANT_MISS_THRESHOLD) || 8;   // contacted − responded
const DORMANT_DAYS = Number(process.env.DORMANT_DAYS) || 60;                      // since last confirmed active
const MAX_DORMANCY_PER_TICK = Number(process.env.MAX_DORMANCY_PER_TICK) || 10;    // bound work per run
const DAY_MS = 24 * 60 * 60 * 1000;

// Pure predicate — the authoritative "is this tutor dormant" check the sweep applies after fetching.
// Dormant = at least `missThreshold` more messages than replies AND no confirmed activity within
// `dormantDays` (missing lastConfirmedActiveAt counts as never-active → dormant). Already-paused
// tutors are never re-flagged. Exported for unit testing.
export function isDormant(tutor, now = new Date(), { missThreshold = DORMANT_MISS_THRESHOLD, dormantDays = DORMANT_DAYS } = {}) {
  if (tutor.pausedAt) return false;
  const contacted = tutor.responseStats?.contacted || 0;
  const responded = tutor.responseStats?.responded || 0;
  if (contacted - responded < missThreshold) return false;
  const cutoff = now.getTime() - dormantDays * DAY_MS;
  const last = tutor.lastConfirmedActiveAt ? new Date(tutor.lastConfirmedActiveAt).getTime() : null;
  return last == null || last < cutoff;
}

// Find a bounded batch of dormant tutors, pause each (atomic $set — never .save()), and DM the
// Telegram-linked ones a reactivation offer. Best-effort: a DM failure logs and the pause stands.
// The DB query mirrors isDormant; isDormant is then re-applied as the source-of-truth guard.
// `model`/`sendDM` injectable for tests.
export async function runDormancySweep(now = new Date(), { model = Tutor, sendDM = sendReactivationDM, limit = MAX_DORMANCY_PER_TICK } = {}) {
  const cutoff = new Date(now.getTime() - DORMANT_DAYS * DAY_MS);
  const candidates = await model.find({
    pausedAt: null,
    $expr: { $gte: [{ $subtract: ['$responseStats.contacted', '$responseStats.responded'] }, DORMANT_MISS_THRESHOLD] },
    $or: [{ lastConfirmedActiveAt: { $lt: cutoff } }, { lastConfirmedActiveAt: null }],
  })
    .select('fullName telegramId telegramStale responseStats lastConfirmedActiveAt pausedAt')
    .limit(limit)
    .lean();

  let paused = 0;
  let dmSent = 0;
  for (const t of candidates) {
    if (!isDormant(t, now)) continue; // guard against any query/predicate drift
    // Re-check pausedAt in the filter so two overlapping ticks can't both pause + DM the same tutor.
    const res = await model.updateOne({ _id: t._id, pausedAt: null }, { $set: { pausedAt: now } });
    if ((res.modifiedCount ?? 0) === 0) continue; // another tick got there first
    paused++;
    if (t.telegramId && !t.telegramStale) {
      try { await sendDM(t); dmSent++; }
      catch (err) { console.warn(`Reactivation DM failed for tutor ${t._id}:`, err.message); }
    }
  }
  if (paused) console.log(`Dormancy sweep: paused ${paused} tutor(s), sent ${dmSent} reactivation DM(s).`);
  return { paused, dmSent, scanned: candidates.length };
}
