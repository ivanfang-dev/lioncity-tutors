'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { postManualContact } from './manualContactApi';

const REPLIES = [
  { value: 'yes', label: 'Said yes', selected: 'border-[#0474BA] bg-[#0474BA]/10 text-[#03649f]' },
  { value: 'no', label: 'Said no', selected: 'border-[var(--color-gray-300)] bg-[var(--color-gray-100)] text-[var(--color-text-default)]' },
];

// The owner's recent chats with this tutor (last 14 days), each with the reply they gave.
export default function ManualContactLog({ tutorId, entries }) {
  const router = useRouter();
  const [pending, setPending] = useState(null);

  if (!entries?.length) return null;

  const setReply = async (entryId, reply) => {
    setPending(entryId);
    try {
      await postManualContact({ tutorId, entryId, reply });
      router.refresh();
    } finally {
      setPending(null);
    }
  };

  return (
    <ul className="mt-2 grid gap-1.5">
      {entries.map(entry => (
        <li
          key={entry.id}
          className="flex flex-wrap items-center gap-x-2 gap-y-1.5 rounded-md bg-[var(--color-gray-100)] px-2.5 py-1.5 text-xs"
        >
          <span className="min-w-0 flex-1 text-[var(--color-text-secondary)]">
            <span className="font-semibold text-[var(--color-text-default)]">Messaged {entry.ago}</span> · {entry.label}
          </span>
          <span className="flex gap-1.5">
            {REPLIES.map(r => (
              <button
                key={r.value}
                type="button"
                disabled={pending === entry.id}
                aria-pressed={entry.reply === r.value}
                onClick={() => setReply(entry.id, r.value)}
                className={`rounded border px-2 py-0.5 font-semibold disabled:opacity-50 ${
                  entry.reply === r.value
                    ? r.selected
                    : 'border-[var(--color-border)] bg-white text-[var(--color-text-secondary)] hover:bg-[var(--color-gray-100)]'
                }`}
              >
                {r.label}
              </button>
            ))}
          </span>
        </li>
      ))}
    </ul>
  );
}
