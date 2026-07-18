import OpsHeader from '../OpsHeader';
import { loadHealthMetricsData } from '@/lib/ops/data';
import { computeHealthMetrics } from '@lioncity/shared/utils/healthMetrics.js';

// Weekly health metrics tab (roadmap deferred item). Read-only snapshot of how the pipeline is
// doing. Every tile shows its sample size — a rate over a handful of data points is noise, and the
// tile says so ("n=2") rather than printing a confident percent. Placement/survival numbers stay
// blank until that data accrues (placements are only just being recorded), which is honest, not broken.

export const dynamic = 'force-dynamic';

const pct = (r) => (r == null ? '—' : `${Math.round(r * 100)}%`);
const hours = (ms) => (ms == null ? '—' : `${(ms / (60 * 60 * 1000)).toFixed(1)}h`);

function MetricTile({ label, value, sample, hint }) {
  const thin = sample != null && sample < 5;
  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-white p-4 shadow-[var(--shadow-xs)]">
      <p className="text-xs font-medium text-[var(--color-text-secondary)]">{label}</p>
      <p className="mt-1 text-2xl font-semibold tabular-nums text-[var(--color-text-default)]">{value}</p>
      <p className="mt-1 text-xs text-[var(--color-text-tertiary)]">
        {sample != null && (
          <span className={thin ? 'text-[var(--color-error)]' : undefined}>n={sample}</span>
        )}
        {sample != null && hint ? ' · ' : ''}
        {hint}
      </p>
    </div>
  );
}

export default async function MetricsPage() {
  const data = await loadHealthMetricsData();
  const m = computeHealthMetrics(data);

  return (
    <>
      <OpsHeader title="Health metrics" backHref="/ops" subtitle={`over the last ${data.sampled} assignment${data.sampled === 1 ? '' : 's'}`} />

      <div className="mx-auto max-w-3xl px-4 py-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <MetricTile
            label="Time to 3 interested"
            value={hours(m.timeToThreeInterested.medianMs)}
            sample={m.timeToThreeInterested.count}
            hint="median"
          />
          <MetricTile
            label="Placement rate"
            value={pct(m.placementRate.rate)}
            sample={m.placementRate.concluded}
            hint="of concluded"
          />
          <MetricTile
            label="Day-30 survival"
            value={pct(m.day30Survival.rate)}
            sample={m.day30Survival.count}
            hint="of checked-in"
          />
          <MetricTile
            label="Outreach via Telegram"
            value={pct(m.telegramShare.rate)}
            sample={m.telegramShare.total}
            hint="of contacts (free)"
          />
          <MetricTile
            label="Pool dormant"
            value={pct(m.dormantShare.rate)}
            sample={m.dormantShare.total}
            hint="auto-paused"
          />
          <MetricTile
            label="Relay → pick"
            value={pct(m.relayToPickConversion.rate)}
            sample={m.relayToPickConversion.relayed}
            hint="of shortlists sent"
          />
        </div>

        <p className="mt-6 text-xs text-[var(--color-text-tertiary)]">
          A red <span className="text-[var(--color-error)]">n=</span> means too few data points to trust the number yet.
          Placement and survival figures fill in as day-30 check-ins are recorded.
        </p>
      </div>
    </>
  );
}
