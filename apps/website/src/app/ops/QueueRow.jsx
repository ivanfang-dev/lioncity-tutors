import Link from 'next/link';
import OutcomeButtons from './OutcomeButtons';
import RecoveryButtons from './RecoveryButtons';

// Outreach-stall rows where the fix is looser matching criteria (widen / raise ceiling / relax type)
// rather than a parent message. Recovery buttons show on these (Console v2).
const RECOVERABLE = new Set(['outreach_exhausted', 'pool_too_small', 'no_replies']);

// One row of the "Needs you" queue: what's wrong, and the tap that fixes it. Mobile-first — the
// whole point is that a Telegram ping lands here on a phone and the owner can finish the job with
// their thumb, so actions are full-width and the diagnosis is one line.

// Which rows get a wa.me button, and what the draft should say. Rows without an entry are ones
// where there's nothing to send the parent yet (the owner needs to fix outreach first).
const RELAY_KIND = {
  shortlist_ready: { kind: 'shortlist', label: 'Send profiles via WhatsApp' },
  parent_silent: { kind: 'nudge', label: 'Send nudge via WhatsApp' },
  parent_flagged: { kind: 'nudge', label: 'Send nudge via WhatsApp' },
};

// Colour carries urgency, but never alone — each row also states its status in words, since
// colour-only signalling fails both accessibility and a glance in bright sunlight.
const TONE = {
  shortlist_ready: { chip: 'bg-[#0474BA]/10 text-[#03649f]', label: 'Ready to send' },
  parent_flagged: { chip: 'bg-[#EF4444]/10 text-[#b91c1c]', label: 'Needs follow-up' },
  parent_silent: { chip: 'bg-[#D9691C]/10 text-[#a04c12]', label: 'Parent quiet' },
  outreach_exhausted: { chip: 'bg-[#EF4444]/10 text-[#b91c1c]', label: 'Outreach stopped' },
  pool_too_small: { chip: 'bg-[#D9691C]/10 text-[#a04c12]', label: 'Thin pool' },
  no_replies: { chip: 'bg-[#D9691C]/10 text-[#a04c12]', label: 'No replies' },
  open_too_long: { chip: 'bg-[var(--color-gray-100)] text-[var(--color-text-secondary)]', label: 'Stale' },
};

function formatAge(ms) {
  const hours = Math.round(ms / (60 * 60 * 1000));
  if (hours < 1) return 'just now';
  if (hours < 24) return `${hours}h`;
  return `${Math.round(hours / 24)}d`;
}

export default function QueueRow({ row }) {
  const relay = RELAY_KIND[row.kind];
  const tone = TONE[row.kind];
  const showOutcomes = row.shortlisted.length > 0;

  return (
    <li id={row.assignmentId} className="scroll-mt-16 rounded-lg border border-[var(--color-border)] bg-white p-4 shadow-[var(--shadow-xs)]">
      <div className="flex items-start justify-between gap-3">
        <Link href={`/ops/assignment/${row.assignmentId}`} className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-semibold text-[var(--color-text-default)]">{row.title}</h3>
        </Link>
        <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${tone.chip}`}>
          {tone.label}
        </span>
      </div>

      <p className="mt-1 text-sm text-[var(--color-text-secondary)]">{row.diagnosis}</p>

      <p className="mt-1 text-xs tabular-nums text-[var(--color-text-tertiary)]">
        {formatAge(row.ageMs)} · contacted {row.funnel.contacted} · replied {row.funnel.replied} · interested {row.funnel.interested}
      </p>

      {relay && (
        <Link
          href={`/ops/relay/${row.assignmentId}?kind=${relay.kind}`}
          className="mt-3 block rounded-md bg-[var(--color-primary)] px-4 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-[#03649f]"
        >
          {relay.label}
        </Link>
      )}

      {showOutcomes && (
        <OutcomeButtons
          assignmentId={row.assignmentId}
          shortlisted={row.shortlisted.map(c => ({
            tutorId: c.tutorId,
            tutorName: c.tutorName,
            shortlistRank: c.shortlistRank,
          }))}
        />
      )}

      {RECOVERABLE.has(row.kind) && <RecoveryButtons assignmentId={row.assignmentId} />}
    </li>
  );
}
