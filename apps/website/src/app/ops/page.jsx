import Link from 'next/link';
import OpsHeader from './OpsHeader';
import QueueRow from './QueueRow';
import CheckInRow from './CheckInRow';
import AssignmentCard from './AssignmentCard';
import { loadActiveAssignments, loadCheckInQueue, serializeAssignment } from '@/lib/ops/data';
import { buildNeedsYouRows } from '@/lib/ops/queue';

export default async function OpsPage({ searchParams }) {
  const now = Date.now();
  const [assignments, checkInRows] = await Promise.all([
    loadActiveAssignments().then(list => list.map(serializeAssignment)),
    loadCheckInQueue(now),
  ]);
  const rows = buildNeedsYouRows(assignments, now);
  const needsYouCount = rows.length + checkInRows.length;

  return (
    <>
      <OpsHeader title="Ops" subtitle={`${needsYouCount} need${needsYouCount === 1 ? 's' : ''} you · ${assignments.length} open`} />

      <div className="mx-auto max-w-3xl px-4 py-6">
        {searchParams?.error === 'draft_failed' && (
          <p role="alert" className="mb-4 rounded-lg border border-[var(--color-error)]/30 bg-[var(--color-error)]/5 p-3 text-sm text-[var(--color-error)]">
            Couldn’t draft that message. Try again, or send it from Telegram.
          </p>
        )}

        <section aria-labelledby="needs-you">
          <h2 id="needs-you" className="mb-3 text-sm font-semibold text-[var(--color-text-default)]">
            Needs you
          </h2>

          {needsYouCount === 0 ? (
            <p className="rounded-lg border border-dashed border-[var(--color-border)] bg-white p-6 text-center text-sm text-[var(--color-text-tertiary)]">
              Nothing needs you right now.
            </p>
          ) : (
            <ul className="grid gap-3">
              {rows.map(row => <QueueRow key={row.assignmentId} row={row} />)}
              {checkInRows.map(row => <CheckInRow key={row.placementId} row={row} />)}
            </ul>
          )}
        </section>

        <section aria-labelledby="assignments" className="mt-8">
          <div className="mb-3 flex items-center justify-between">
            <h2 id="assignments" className="text-sm font-semibold text-[var(--color-text-default)]">
              Assignments
            </h2>
            <Link href="/ops/metrics" className="text-xs font-medium text-[var(--color-primary)] hover:underline">
              Health metrics →
            </Link>
          </div>

          {assignments.length === 0 ? (
            <p className="rounded-lg border border-dashed border-[var(--color-border)] bg-white p-6 text-center text-sm text-[var(--color-text-tertiary)]">
              No open assignments.
            </p>
          ) : (
            <ul className="grid gap-3">
              {assignments.map(assignment => (
                <AssignmentCard key={assignment._id} assignment={assignment} now={now} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}
