'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

// Console v2 recovery (roadmap deferred item): one-tap fixes for a stalled assignment — widen to
// adjacent regions, raise the budget ceiling, or drop the tutor-type restriction — each of which
// resets outreach and fires a fresh wave. Posts to /api/ops/recover (same secret-side proxy pattern
// as OutcomeButtons). Client-side so the owner sees the tap land and a success/error line.

const ACTIONS = [
  { action: 'widen_region', label: '↔ Widen to adjacent regions' },
  { action: 'raise_ceiling', label: '↑ Raise budget +$10/hr', amount: 10 },
  { action: 'relax_type', label: '⇱ Relax tutor-type restriction' },
];

export default function RecoveryButtons({ assignmentId }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState(null);
  const [error, setError] = useState(null);

  const disabled = busy || isPending;

  async function run({ action, amount }) {
    setBusy(true);
    setError(null);
    setNote(null);
    try {
      const response = await fetch('/api/ops/recover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignmentId, action, amount }),
      });
      const detail = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(detail.error || `Request failed (${response.status})`);
      setNote(detail.summary || 'Retrying outreach…');
      startTransition(() => router.refresh());
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-3 border-t border-[var(--color-border)] pt-3">
      <p className="mb-2 text-xs text-[var(--color-text-secondary)]">Retry with looser criteria:</p>
      <div className="grid gap-2">
        {ACTIONS.map(({ action, label, amount }) => (
          <button
            key={action}
            type="button"
            disabled={disabled}
            onClick={() => run({ action, amount })}
            className="w-full rounded-md border border-[var(--color-border)] bg-white px-3 py-2.5 text-left text-sm font-medium text-[var(--color-text-default)] transition-colors hover:bg-[var(--color-gray-50)] disabled:opacity-50"
          >
            {label}
          </button>
        ))}
      </div>
      {disabled && <p className="mt-2 text-xs text-[var(--color-text-tertiary)]">Applying…</p>}
      {note && <p className="mt-2 text-xs text-[#03649f]">{note}</p>}
      {error && <p role="alert" className="mt-2 text-xs text-[var(--color-error)]">{error}</p>}
    </div>
  );
}
