import { Recommendation } from '../../../packages/shared/server-exports.js';
import { POLICY_VERSION } from './tutorMatcher.js';

// Writes one Recommendation decision-log doc (roadmap Phase 6). Write-only and BEST-EFFORT: an
// insert failure must never block or delay outreach — the whole point is a passive audit trail, so
// it swallows every error with a log (same discipline as recordWaveContacts). Callers await it
// AFTER the wave/relay has gone out, so even the await can't delay a tutor being messaged.

// Build the candidates array from a scored pool ([{ tutor, rank, score, components }]) and the set
// of tutorIds actually contacted in this decision. `contacted` is the "what it chose" half of the
// record; the scores/ranks/features are the "what it knew" half.
export function candidatesFromScored(scored, contactedIds = []) {
  const contactedSet = new Set(contactedIds.map(id => String(id)));
  return scored.map(s => ({
    tutorId: s.tutor._id,
    rank: s.rank,
    score: s.score,
    contacted: contactedSet.has(String(s.tutor._id)),
    featureSnapshot: s.components,
  }));
}

export async function recordRecommendation({ assignmentId, trigger, candidates }) {
  try {
    if (!assignmentId || !candidates || candidates.length === 0) return;
    await Recommendation.create({
      assignmentId,
      trigger,
      policyVersion: POLICY_VERSION,
      generatedAt: new Date(),
      candidates,
    });
    console.log(`Recorded ${trigger} recommendation for ${assignmentId} (${candidates.length} candidate(s))`);
  } catch (err) {
    console.error('recordRecommendation failed (non-blocking):', err.message);
  }
}
