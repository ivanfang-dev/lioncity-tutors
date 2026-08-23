// Wave 1 found too few tutors to plausibly reach the interested target. Rather than letting the
// assignment run quietly to Exhausted hours later, say so immediately and name the filter that cost
// the most candidates, so the owner can widen it while the request is still fresh.

export const FILTER_LABELS = {
  contactable: 'missing phone number',
  active: 'paused tutors',
  region: 'region',
  subject: 'subject + level',
  tutorType: 'tutor type',
  gender: 'gender preference',
  budget: 'budget',
  timeSlots: 'timing',
};

// Which recovery action best answers each bottleneck. Gender is absent on purpose — matching
// already relaxes it automatically when the pool is thin, so there is nothing left to offer.
const ACTION_FOR_FILTER = {
  region: 'widen_region',
  budget: 'raise_ceiling',
  tutorType: 'relax_type',
};

export const ACTION_LABELS = {
  widen_region: '🌏 Widen to nearby regions',
  raise_ceiling: '💵 Raise budget by $10/hr',
  relax_type: '👥 Drop tutor-type requirement',
};

// The owner alert for a thin pool, or null when the pool is healthy. Pure — the caller sends it.
// Returns { text, actions } with actions ordered best-answer-first.
export function poolShortfallReport({ poolSize, target, stats, assignment, relaxed = [] }) {
  if (poolSize >= target) return null;

  const lines = [];
  lines.push(poolSize === 0
    ? `📭 *No tutors matched* — *${assignment?.title || 'this assignment'}*`
    : `⚠️ *Thin tutor pool* — only *${poolSize}* of the ${target} we need for *${assignment?.title || 'this assignment'}*`);

  const dominant = stats?.dominantFilter;
  if (dominant) {
    const stage = (stats.stages || []).find(s => s.filter === dominant);
    const label = FILTER_LABELS[dominant] || dominant;
    lines.push(stage
      ? `Biggest cut: *${label}* removed ${stage.removed} of ${stage.before}.`
      : `Biggest cut: *${label}*.`);
  }

  if (relaxed.length > 0) {
    const names = relaxed.map(f => FILTER_LABELS[f] || f).join(' and ');
    lines.push(`Already relaxed automatically: *${names}* — those tutors are ranked below exact matches.`);
  }

  // Lead with the action that answers the dominant filter, then the other applicable ones.
  const applicable = (action) => action !== 'relax_type' || (assignment?.preferredTutorTypes?.length > 0);
  const preferred = ACTION_FOR_FILTER[dominant];
  const actions = [preferred, 'widen_region', 'raise_ceiling', 'relax_type']
    .filter((a, i, arr) => a && arr.indexOf(a) === i && applicable(a));

  lines.push('', 'Widen the search?');
  return { text: lines.join('\n'), actions };
}
