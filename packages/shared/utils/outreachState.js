// Pure readers over an assignment's outreach state. Shared because the escalation tick (which
// decides when to nudge) and the ops console (which shows the owner what needs them) must agree
// exactly on questions like "has the parent decided yet?" — two copies of that logic would drift
// and the console would show rows the tick had already resolved.
//
// Every function here takes a plain/lean assignment and returns a value. No I/O, no mutation.

// Has the parent's answer to the CURRENT shortlist been recorded?
//
// Scoped by timestamp on purpose: a reject → resume → re-release cycle leaves stale contacts from
// the prior shortlist still carrying shortlistRank + parentRejectedAt. Comparing against
// shortlistReleasedAt means those can't mask the new shortlist as already-decided.
export function shortlistDecided(assignment) {
  const o = assignment?.outreach || {};
  if (!o.shortlistReleasedAt) return false;
  const releasedAt = new Date(o.shortlistReleasedAt);
  return (o.contacts || []).some(c =>
    (c.parentPickedAt && new Date(c.parentPickedAt) >= releasedAt) ||
    (c.shortlistRank != null && c.parentRejectedAt && new Date(c.parentRejectedAt) >= releasedAt)
  );
}

// The tutors currently shown to the parent: ranked, not yet rejected, best-first. This is the set
// the outcome buttons act on.
export function shortlistedContacts(assignment) {
  return (assignment?.outreach?.contacts || [])
    .filter(c => c.shortlistRank != null && !c.parentRejectedAt)
    .sort((a, b) => a.shortlistRank - b.shortlistRank);
}

// The outreach funnel for one assignment: contacted 14 → replied 6 → interested 4 → shown 3.
// `replied` counts a "No" too — declining is a reply, and the gap between contacted and replied
// is the reachability signal (see the zero-replies queue row).
export function funnelCounts(assignment) {
  const contacts = assignment?.outreach?.contacts || [];
  return {
    contacted: contacts.length,
    replied: contacts.filter(c => c.status === 'Interested' || c.status === 'Declined').length,
    interested: contacts.filter(c => c.status === 'Interested').length,
    shown: contacts.filter(c => c.shortlistRank != null).length,
  };
}

// How many tutors the first wave actually reached. Fewer than the intended wave size means the
// matching pool was thin at launch — the assignment is likely to exhaust, and it's worth widening
// the budget/region before four hours are burned. Read straight off the recorded contacts, so
// detection costs no matching query.
export function firstWaveSize(assignment) {
  return (assignment?.outreach?.contacts || []).filter(c => c.wave === 1).length;
}
