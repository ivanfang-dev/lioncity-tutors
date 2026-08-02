/**
 * Observed parent budgets from LionCity Tutors' own assignment history.
 *
 * This is what parents ASKED to pay, not what tutors were paid — the
 * Placement collection is empty and no quoted rates have been captured yet.
 * Every surface that renders these figures must say "budget", never "rate",
 * and must carry the sample size. See
 * docs/specs/2026-08-01-rates-placement-evidence-design.md for the query that
 * produced them and for when they may be refreshed.
 *
 * Static by necessity: the website has no database access.
 *
 * Refresh cadence: quarterly, alongside regions.mjs's REGIONS_REVIEWED.
 */

/** Human-readable review date, shown wherever these figures surface. */
export const PLACEMENTS_REVIEWED = 'August 2026';

/** Assignments with a parseable budget, of 298 total. */
export const PLACEMENT_SAMPLE = 254;

/** Bands keyed by RATE_CARD.id, so a row can sit beside its rate table. */
export const OBSERVED_BUDGETS = [
  { id: 'primary',   n: 154, medianMin: 30, medianMax: 45, p10: 25, p90: 50 },
  { id: 'secondary', n: 75,  medianMin: 40, medianMax: 50, p10: 30, p90: 60 },
  { id: 'jc',        n: 16,  medianMin: 45, medianMax: 65, p10: 35, p90: 70 },
];

/** Below this, a band is described as indicative rather than typical. */
export const THIN_SAMPLE = 30;

export const observedFor = (id) => OBSERVED_BUDGETS.find((b) => b.id === id);

/** "$30 to $45 an hour" — prose form of a band's median budget. */
export const observedSpan = (id) => {
  const b = observedFor(id);
  return b ? `$${b.medianMin} to $${b.medianMax} an hour` : null;
};

/** "154 assignments" / "16 assignments (indicative)". */
export const sampleLabel = (id) => {
  const b = observedFor(id);
  if (!b) return null;
  return b.n < THIN_SAMPLE ? `${b.n} assignments, indicative` : `${b.n} assignments`;
};
