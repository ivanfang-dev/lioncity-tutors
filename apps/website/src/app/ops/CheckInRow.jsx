import Link from 'next/link';
import CheckInButtons from './CheckInButtons';

// One row of the day-30 check-in queue (roadmap Phase 5): who was placed, how long ago, a one-tap
// wa.me to ask the parent how it's going, and the recording buttons. Mobile-first, matching QueueRow
// — the owner finishes the job with their thumb. The wa.me draft is fetched at tap time through the
// existing relay redirect (kind=checkin), so the console stays fast and the message text still comes
// from the bot's single transport seam.

function formatAge(ms) {
  const days = Math.round(ms / (24 * 60 * 60 * 1000));
  return `${days}d`;
}

export default function CheckInRow({ row }) {
  return (
    <li className="rounded-lg border border-[var(--color-border)] bg-white p-4 shadow-[var(--shadow-xs)]">
      <div className="flex items-start justify-between gap-3">
        <Link href={`/ops/assignment/${row.assignmentId}`} className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-semibold text-[var(--color-text-default)]">{row.title}</h3>
        </Link>
        <span className="shrink-0 rounded-full bg-[#0474BA]/10 px-2 py-0.5 text-[11px] font-medium text-[#03649f]">
          Check-in due
        </span>
      </div>

      <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
        {row.tutorName} was placed {formatAge(row.ageMs)} ago. Ask how it&apos;s going, then record the outcome.
      </p>

      {row.pinged && (
        <p className="mt-1 text-xs text-[var(--color-text-tertiary)]">Owner already pinged on Telegram — waiting on the parent.</p>
      )}

      {row.parentContact ? (
        <Link
          href={`/ops/relay/${row.assignmentId}?kind=checkin`}
          className="mt-3 block rounded-md bg-[var(--color-primary)] px-4 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-[#03649f]"
        >
          Ask parent via WhatsApp
        </Link>
      ) : (
        <p className="mt-3 text-xs text-[var(--color-text-tertiary)]">No parent contact on this placement — reach out manually.</p>
      )}

      <CheckInButtons placementId={row.placementId} />
    </li>
  );
}
