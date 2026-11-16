'use client';

import { useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { defaultTitle, missingPostFields } from '@/lib/ops/postAssignment.mjs';

// Posts the searched assignment to the Telegram channel. Channel only: no tutor is contacted.

const fieldClass =
  'mt-1 block w-full rounded-md border border-[var(--color-border)] bg-white px-3 py-2 text-sm text-[var(--color-text-default)] focus:border-[var(--color-primary)] focus:outline-none';
const labelClass = 'block text-xs font-medium text-[var(--color-text-secondary)]';

export default function PostPanel({ criteria }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { level, subject, location } = criteria;
  const [title, setTitle] = useState(defaultTitle(criteria));
  const [rate, setRate] = useState(criteria.rate || '');
  const [frequency, setFrequency] = useState('');
  const [description, setDescription] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  // Blocks a second tap landing before the disabled state renders.
  const inFlight = useRef(false);

  const fields = { title, level, subject, location, rate, frequency, description };
  const incomplete = missingPostFields(fields).length > 0;

  async function post(event) {
    event.preventDefault();
    if (inFlight.current || incomplete) return;
    inFlight.current = true;
    setBusy(true);
    setError(false);
    try {
      const response = await fetch('/api/ops/post-assignment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.assignmentId) throw new Error(result.error || `HTTP ${response.status}`);
      const params = new URLSearchParams(searchParams);
      params.set('assignmentId', result.assignmentId);
      router.push(`${pathname}?${params}`);
    } catch (err) {
      console.error('post to channel failed:', err.message);
      setError(true);
      inFlight.current = false;
      setBusy(false);
    }
  }

  return (
    <section aria-labelledby="post-heading" className="mt-6 rounded-lg border border-[var(--color-border)] bg-white p-4">
      <h2 id="post-heading" className="text-sm font-semibold text-[var(--color-text-default)]">Post this to the channel</h2>
      <p className="mt-1 text-xs text-[var(--color-text-tertiary)]">{level} · {subject} · {location}</p>

      <form onSubmit={post} className="mt-3 grid gap-3 sm:grid-cols-2">
        <label className={`${labelClass} sm:col-span-2`}>
          Title
          <input required value={title} onChange={e => setTitle(e.target.value)} className={fieldClass} />
        </label>
        <label className={labelClass}>
          Rate
          <input required value={rate} onChange={e => setRate(e.target.value)} placeholder="e.g. $45/h" className={fieldClass} />
        </label>
        <label className={labelClass}>
          Frequency
          <input required value={frequency} onChange={e => setFrequency(e.target.value)} placeholder="e.g. 1x a week, 1.5h" className={fieldClass} />
        </label>
        <label className={`${labelClass} sm:col-span-2`}>
          Notes (optional)
          <textarea rows={2} value={description} onChange={e => setDescription(e.target.value)} className={fieldClass} />
        </label>

        <div className="sm:col-span-2">
          <button
            type="submit"
            disabled={incomplete || busy}
            className="w-full rounded-md bg-[var(--color-primary)] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#03649f] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            {busy ? 'Posting…' : '📢 Post to channel'}
          </button>
          <p className="mt-2 text-xs text-[var(--color-text-tertiary)]">
            {incomplete ? 'Fill in title, rate and frequency to post.' : 'Tutors are not contacted automatically.'}
          </p>
          {error && (
            <p role="alert" className="mt-2 text-xs text-[var(--color-error)]">
              Couldn’t post to the channel. Nothing was saved.
            </p>
          )}
        </div>
      </form>
    </section>
  );
}
