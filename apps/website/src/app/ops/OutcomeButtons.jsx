'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

// The outcome-capture buttons: the same three decisions as the Telegram alert (Picked #N /
// Rejected all → reason / No reply yet), posting to the same recorder. Client-side because the
// owner needs to see the tap land — a silent 2s wait on a phone gets tapped twice, and a double
// "Picked" is a placement recorded against the wrong tutor.
//
// `shortlisted` = [{ tutorId, tutorName, shortlistRank }], best-first.

const REJECT_REASONS = [
  { value: 'rate', label: 'Rate too high' },
  { value: 'profiles', label: 'Profiles not a fit' },
  { value: 'timing', label: 'Timing / availability' },
  { value: 'other', label: 'Other' },
];

export default function OutcomeButtons({ assignmentId, shortlisted = [] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [busy, setBusy] = useState(false);
  const [askingReason, setAskingReason] = useState(false);
  const [error, setError] = useState(null);

  const disabled = busy || isPending;

  async function send(body) {
    setBusy(true);
    setError(null);
    try {
      const response = await fetch('/api/ops/outcome', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignmentId, ...body }),
      });
      if (!response.ok) {
        const detail = await response.json().catch(() => ({}));
        throw new Error(detail.error || `Request failed (${response.status})`);
      }
      // Re-render the server components so the row leaves the queue.
      startTransition(() => router.refresh());
      setAskingReason(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  if (askingReason) {
    return (
      <div className="mt-3">
        <p className="mb-2 text-xs text-[var(--color-text-secondary)]">Why did the parent pass?</p>
        <div className="grid gap-2">
          {REJECT_REASONS.map(reason => (
            <button
              key={reason.value}
              type="button"
              disabled={disabled}
              onClick={() => send({ outcome: 'reject', reason: reason.value })}
              className="w-full rounded-md border border-[var(--color-border)] bg-white px-3 py-2.5 text-left text-sm font-medium text-[var(--color-text-default)] transition-colors hover:bg-[var(--color-gray-50)] disabled:opacity-50"
            >
              {reason.label}
            </button>
          ))}
          <button
            type="button"
            disabled={disabled}
            onClick={() => setAskingReason(false)}
            className="w-full px-3 py-2 text-sm text-[var(--color-text-tertiary)] disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
        {error && <p role="alert" className="mt-2 text-xs text-[var(--color-error)]">{error}</p>}
      </div>
    );
  }

  return (
    <div className="mt-3 grid gap-2">
      {shortlisted.map(tutor => (
        <button
          key={tutor.tutorId}
          type="button"
          disabled={disabled}
          onClick={() => send({ outcome: 'pick', tutorId: tutor.tutorId })}
          className="w-full rounded-md border border-[var(--color-border)] bg-white px-3 py-2.5 text-left text-sm font-medium text-[var(--color-text-default)] transition-colors hover:bg-[var(--color-gray-50)] disabled:opacity-50"
        >
          <span aria-hidden="true">✅ </span>
          Parent picked #{tutor.shortlistRank} — {tutor.tutorName || 'Tutor'}
        </button>
      ))}

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          disabled={disabled}
          onClick={() => setAskingReason(true)}
          className="rounded-md border border-[var(--color-border)] bg-white px-3 py-2.5 text-sm font-medium text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-gray-50)] disabled:opacity-50"
        >
          Rejected all
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={() => send({ outcome: 'noreply' })}
          className="rounded-md border border-[var(--color-border)] bg-white px-3 py-2.5 text-sm font-medium text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-gray-50)] disabled:opacity-50"
        >
          No reply yet
        </button>
      </div>

      {disabled && <p className="text-xs text-[var(--color-text-tertiary)]">Recording…</p>}
      {error && <p role="alert" className="text-xs text-[var(--color-error)]">{error}</p>}
    </div>
  );
}
