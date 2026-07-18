'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

// The day-30 check-in recording buttons: the same three decisions as the Telegram ping (Going well
// + 1–5 rating / It ended + reason / No reply), posting to the same recorder (/api/ops/checkin →
// bot). Client-side because the owner needs to see the tap land — a silent wait on a phone gets
// tapped twice.

export default function CheckInButtons({ placementId }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState(null); // null | 'rating' | 'ended'
  const [endReason, setEndReason] = useState('');
  const [error, setError] = useState(null);

  const disabled = busy || isPending;

  async function send(body) {
    setBusy(true);
    setError(null);
    try {
      const response = await fetch('/api/ops/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ placementId, ...body }),
      });
      if (!response.ok) {
        const detail = await response.json().catch(() => ({}));
        throw new Error(detail.error || `Request failed (${response.status})`);
      }
      startTransition(() => router.refresh());
      setMode(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  if (mode === 'rating') {
    return (
      <div className="mt-3">
        <p className="mb-2 text-xs text-[var(--color-text-secondary)]">How would the parent rate it?</p>
        <div className="grid grid-cols-5 gap-2">
          {[1, 2, 3, 4, 5].map(n => (
            <button
              key={n}
              type="button"
              disabled={disabled}
              onClick={() => send({ outcome: 'well', rating: n })}
              className="rounded-md border border-[var(--color-border)] bg-white px-2 py-2.5 text-center text-sm font-medium text-[var(--color-text-default)] transition-colors hover:bg-[var(--color-gray-50)] disabled:opacity-50"
            >
              {n}⭐
            </button>
          ))}
        </div>
        <button
          type="button"
          disabled={disabled}
          onClick={() => setMode(null)}
          className="mt-2 w-full px-3 py-2 text-sm text-[var(--color-text-tertiary)] disabled:opacity-50"
        >
          Cancel
        </button>
        {error && <p role="alert" className="mt-2 text-xs text-[var(--color-error)]">{error}</p>}
      </div>
    );
  }

  if (mode === 'ended') {
    return (
      <div className="mt-3">
        <label className="mb-2 block text-xs text-[var(--color-text-secondary)]">
          Why did it end? (optional — stored as the parent said it)
        </label>
        <textarea
          value={endReason}
          onChange={e => setEndReason(e.target.value)}
          rows={2}
          disabled={disabled}
          className="w-full rounded-md border border-[var(--color-border)] bg-white px-3 py-2 text-sm text-[var(--color-text-default)] disabled:opacity-50"
          placeholder="e.g. moved overseas, exams over…"
        />
        <div className="mt-2 grid grid-cols-2 gap-2">
          <button
            type="button"
            disabled={disabled}
            onClick={() => send({ outcome: 'ended', endReason: endReason.trim() || undefined })}
            className="rounded-md bg-[var(--color-primary)] px-3 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#03649f] disabled:opacity-50"
          >
            Save as ended
          </button>
          <button
            type="button"
            disabled={disabled}
            onClick={() => setMode(null)}
            className="rounded-md border border-[var(--color-border)] bg-white px-3 py-2.5 text-sm font-medium text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-gray-50)] disabled:opacity-50"
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
      <button
        type="button"
        disabled={disabled}
        onClick={() => setMode('rating')}
        className="w-full rounded-md border border-[var(--color-border)] bg-white px-3 py-2.5 text-left text-sm font-medium text-[var(--color-text-default)] transition-colors hover:bg-[var(--color-gray-50)] disabled:opacity-50"
      >
        <span aria-hidden="true">✅ </span>Going well
      </button>
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          disabled={disabled}
          onClick={() => setMode('ended')}
          className="rounded-md border border-[var(--color-border)] bg-white px-3 py-2.5 text-sm font-medium text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-gray-50)] disabled:opacity-50"
        >
          It ended
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={() => send({ outcome: 'noreply' })}
          className="rounded-md border border-[var(--color-border)] bg-white px-3 py-2.5 text-sm font-medium text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-gray-50)] disabled:opacity-50"
        >
          No reply
        </button>
      </div>
      {disabled && <p className="text-xs text-[var(--color-text-tertiary)]">Recording…</p>}
      {error && <p role="alert" className="text-xs text-[var(--color-error)]">{error}</p>}
    </div>
  );
}
