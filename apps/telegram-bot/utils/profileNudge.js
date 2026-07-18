import { Tutor } from '../../../packages/shared/server-exports.js';
import { sendProfileNudgeDM } from './telegramOutreach.js';

// Profile-improvement nudges (roadmap Phase 9 follow-on). A tutor with a weak extracted profile
// (qualityGrade ≤ 2) usually just presents themselves badly, not teaches badly — so nudge them ONCE
// on Telegram to add concrete results. Editing their track record re-extracts the profile (Phase 9),
// which can lift their grade and ranking automatically. Telegram-linked tutors only; no WhatsApp spend.

const NUDGE_GRADE_MAX = Number(process.env.PROFILE_NUDGE_GRADE_MAX) || 2;
const MAX_NUDGE_PER_TICK = Number(process.env.PROFILE_NUDGE_PER_TICK) || 5; // bound the DMs per run

// Send a bounded batch of first-time nudges. Only tutors who are Telegram-reachable, not paused, and
// never nudged before (profileNudgedAt absent) — so each tutor is nudged at most once, ever. Stamps
// profileNudgedAt in the SAME filtered updateOne so overlapping ticks can't double-send. Best-effort:
// a DM failure logs, doesn't stamp, and will be retried. `model`/`sendDM` injectable for tests.
export async function runProfileNudgeSweep(now = new Date(), { model = Tutor, sendDM = sendProfileNudgeDM, limit = MAX_NUDGE_PER_TICK } = {}) {
  const candidates = await model.find({
    'profileFeatures.qualityGrade': { $lte: NUDGE_GRADE_MAX },
    telegramId: { $nin: [null, ''] },
    telegramStale: { $ne: true },
    pausedAt: null,
    profileNudgedAt: null, // matches missing too
  })
    .select('fullName telegramId profileFeatures.qualityGrade')
    .limit(limit)
    .lean();

  let sent = 0;
  for (const t of candidates) {
    // Claim the nudge first (filtered on profileNudgedAt: null) so a concurrent tick can't also send.
    const res = await model.updateOne({ _id: t._id, profileNudgedAt: null }, { $set: { profileNudgedAt: now } });
    if ((res.modifiedCount ?? 0) === 0) continue; // another tick claimed it
    try {
      await sendDM(t);
      sent++;
    } catch (err) {
      // Roll back the stamp so this tutor is retried next time rather than silently never nudged.
      await model.updateOne({ _id: t._id }, { $set: { profileNudgedAt: null } });
      console.warn(`Profile nudge DM failed for tutor ${t._id}:`, err.message);
    }
  }
  if (sent) console.log(`Profile nudge sweep: sent ${sent} DM(s).`);
  return { sent, scanned: candidates.length };
}
