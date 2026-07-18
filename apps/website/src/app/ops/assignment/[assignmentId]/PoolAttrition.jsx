import { fetchMatchStats } from '@/lib/ops/botApi';

// Why the matching pool is the size it is: the per-filter funnel from findMatchingTutors' stats
// mode. Answers the question behind every "pool too small" row — which constraint should I widen?
//
// An async server component so the drill-down paints immediately and this streams in behind a
// Suspense boundary: it costs one countDocuments per filter, which is fine on demand but must not
// hold up the page.

// Plain-English names — the owner thinks "region", not "locations.central".
const FILTER_LABEL = {
  contactable: 'Have a contact number',
  region: 'Cover this region',
  subject: 'Teach this subject at this level',
  tutorType: 'Match the requested tutor type',
  gender: 'Match the requested gender',
  budget: 'Within budget',
  timeSlots: 'Free at the requested times',
};

const UNMAPPABLE_HELP = {
  level: 'This assignment’s level doesn’t map to any tutor teaching level — outreach can never match it.',
  location: 'This assignment’s location isn’t in the region map — outreach can never match it.',
  subject: 'This assignment’s subject doesn’t map to a tutor field — outreach can never match it.',
};

export default async function PoolAttrition({ assignmentId }) {
  let stats;
  try {
    ({ stats } = await fetchMatchStats({ assignmentId }));
  } catch (err) {
    console.error('ops: match stats failed:', err.message);
    return (
      <p className="rounded-lg border border-[var(--color-border)] bg-white p-4 text-sm text-[var(--color-text-tertiary)]">
        Couldn’t work out the pool breakdown.
      </p>
    );
  }

  if (stats.unmappable) {
    return (
      <p className="rounded-lg border border-[var(--color-error)]/30 bg-[var(--color-error)]/5 p-4 text-sm text-[var(--color-error)]">
        {UNMAPPABLE_HELP[stats.unmappable]}
      </p>
    );
  }

  const dominant = stats.stages.find(s => s.filter === stats.dominantFilter);

  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-white p-4">
      <p className="text-sm text-[var(--color-text-default)]">
        {/* stats.matched, not the returned tutor count — that's capped at the outreach pool size. */}
        <span className="font-semibold tabular-nums">{stats.matched}</span> tutor{stats.matched === 1 ? '' : 's'} match right now.
        {dominant && (
          <>
            {' '}Biggest cut:{' '}
            <span className="font-medium">{(FILTER_LABEL[dominant.filter] || dominant.filter).toLowerCase()}</span>
            {' '}removed <span className="tabular-nums">{dominant.removed}</span>.
          </>
        )}
      </p>

      <ul className="mt-3 grid gap-1.5">
        {stats.stages.map(stage => (
          <li key={stage.filter} className="flex items-baseline justify-between gap-3 text-xs">
            <span className={stage.filter === stats.dominantFilter
              ? 'font-medium text-[var(--color-text-default)]'
              : 'text-[var(--color-text-secondary)]'}>
              {FILTER_LABEL[stage.filter] || stage.filter}
            </span>
            <span className="shrink-0 tabular-nums text-[var(--color-text-tertiary)]">
              {stage.before} → {stage.after}
              {stage.removed > 0 && <span className="ml-1.5 text-[var(--color-error)]">−{stage.removed}</span>}
            </span>
          </li>
        ))}
      </ul>

      {stats.fetchTruncated && (
        <p className="mt-3 text-xs text-[var(--color-text-tertiary)]">
          The budget and timing rows count the 300 most recent matches, not the whole pool.
        </p>
      )}

      <p className="mt-3 text-xs text-[var(--color-text-tertiary)]">
        Each row filters what’s left of the one above it.
      </p>
    </div>
  );
}
