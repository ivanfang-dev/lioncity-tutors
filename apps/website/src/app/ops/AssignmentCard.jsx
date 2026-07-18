import Link from 'next/link';
import Funnel from './Funnel';
import { funnelCounts } from '@lioncity/shared/utils/outreachState.js';

// One card on the assignments board: the state of everything, at a glance. This is the half of the
// console Telegram can't do — concurrent assignments interleave into scrollback there, so "what's
// happening across all of them" has never had a surface.

// Outreach status is the one that matters day to day; the assignment's own status only becomes
// interesting once it's Filled or Closed.
const OUTREACH_LABEL = {
  Pending: 'Not started',
  Active: 'Messaging tutors',
  Holding: 'Holding for better candidates',
  Fulfilled: 'Shortlist ready',
  Exhausted: 'Out of tutors',
};

function formatAge(createdAt, now) {
  const hours = Math.round((now - new Date(createdAt).getTime()) / (60 * 60 * 1000));
  if (hours < 1) return 'just now';
  if (hours < 24) return `${hours}h old`;
  return `${Math.round(hours / 24)}d old`;
}

export default function AssignmentCard({ assignment, now }) {
  const funnel = funnelCounts(assignment);
  const outreachStatus = assignment.outreach?.status;
  const isFilled = assignment.status === 'Filled';

  return (
    <li>
      <Link
        href={`/ops/assignment/${assignment._id}`}
        className="block rounded-lg border border-[var(--color-border)] bg-white p-4 shadow-[var(--shadow-xs)] transition-shadow hover:shadow-[var(--shadow-sm)]"
      >
        <div className="flex items-start justify-between gap-3">
          <h3 className="min-w-0 flex-1 truncate text-sm font-semibold text-[var(--color-text-default)]">
            {assignment.title}
          </h3>
          <span className="shrink-0 text-xs tabular-nums text-[var(--color-text-tertiary)]">
            {formatAge(assignment.createdAt, now)}
          </span>
        </div>

        <p className="mt-0.5 truncate text-xs text-[var(--color-text-tertiary)]">
          {[assignment.level, assignment.location, assignment.rate].filter(Boolean).join(' · ')}
        </p>

        <p className="mt-2 text-xs font-medium text-[var(--color-text-secondary)]">
          {isFilled ? 'Filled' : OUTREACH_LABEL[outreachStatus] || assignment.status}
        </p>

        <div className="mt-2">
          <Funnel funnel={funnel} />
        </div>
      </Link>
    </li>
  );
}
