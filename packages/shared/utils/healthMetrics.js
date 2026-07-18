// Weekly health metrics (roadmap deferred item) — the numbers behind the ops console's health tab.
// Pure functions over already-loaded data, so the math is testable without a DB and the page just
// renders what it's handed. Each returns its SAMPLE SIZE alongside the value: a rate over three
// data points is noise, and the UI should be able to say so rather than print a confident "100%".

function median(nums) {
  const xs = (nums || []).filter(n => typeof n === 'number' && Number.isFinite(n)).sort((a, b) => a - b);
  if (xs.length === 0) return null;
  const mid = Math.floor(xs.length / 2);
  return xs.length % 2 ? xs[mid] : Math.round((xs[mid - 1] + xs[mid]) / 2);
}

const isConcluded = (a) => a.status === 'Filled' || a.status === 'Closed';

// Median time from outreach start to the THIRD interested reply, over assignments that got there.
// The core speed metric — "how fast do we assemble a shortlist". { medianMs, count }.
export function timeToThreeInterested(assignments) {
  const durations = [];
  for (const a of assignments || []) {
    const started = a.outreach?.startedAt;
    if (!started) continue;
    const times = (a.outreach?.contacts || [])
      .filter(c => c.status === 'Interested' && c.respondedAt)
      .map(c => new Date(c.respondedAt).getTime())
      .sort((x, y) => x - y);
    if (times.length < 3) continue;
    durations.push(times[2] - new Date(started).getTime());
  }
  return { medianMs: median(durations), count: durations.length };
}

// Of assignments whose outreach has CONCLUDED (Filled or Closed), the fraction that got a tutor
// (matchedTutorId set). { rate, placed, concluded }.
export function placementRate(assignments) {
  const concluded = (assignments || []).filter(isConcluded);
  const placed = concluded.filter(a => a.matchedTutorId).length;
  return { rate: concluded.length ? placed / concluded.length : null, placed, concluded: concluded.length };
}

// Of placements with a recorded 30-day outcome, the fraction still going at day 30. { rate, count }.
export function day30Survival(placements) {
  const withOutcome = (placements || []).filter(p => typeof p.survived30d === 'boolean');
  const survived = withOutcome.filter(p => p.survived30d).length;
  return { rate: withOutcome.length ? survived / withOutcome.length : null, count: withOutcome.length };
}

// Share of outreach contacts reached over Telegram (free) vs WhatsApp (billed). { rate, total }.
export function telegramShare(assignments) {
  let telegram = 0;
  let total = 0;
  for (const a of assignments || []) {
    for (const c of a.outreach?.contacts || []) {
      total++;
      if (c.channel === 'telegram') telegram++;
    }
  }
  return { rate: total ? telegram / total : null, total };
}

// Share of active tutors currently auto-paused for dormancy. { rate, dormant, total }.
export function dormantShare({ total = 0, dormant = 0 } = {}) {
  return { rate: total ? dormant / total : null, dormant, total };
}

// Of assignments whose shortlist was RELAYED to the parent, the fraction that produced a pick
// (parentPickedAt on a contact, or a matchedTutorId). The money conversion. { rate, relayed }.
export function relayToPickConversion(assignments) {
  const relayed = (assignments || []).filter(a => a.outreach?.shortlistReleasedAt);
  const picked = relayed.filter(a =>
    a.matchedTutorId || (a.outreach?.contacts || []).some(c => c.parentPickedAt)
  ).length;
  return { rate: relayed.length ? picked / relayed.length : null, picked, relayed: relayed.length };
}

// Everything the health tab needs, in one call. `tutorCounts` = { total, dormant }.
export function computeHealthMetrics({ assignments = [], placements = [], tutorCounts = {} } = {}) {
  return {
    timeToThreeInterested: timeToThreeInterested(assignments),
    placementRate: placementRate(assignments),
    day30Survival: day30Survival(placements),
    telegramShare: telegramShare(assignments),
    dormantShare: dormantShare(tutorCounts),
    relayToPickConversion: relayToPickConversion(assignments),
  };
}
