'use client';

import { useLayoutEffect, useRef, useState } from 'react';

// Clamped to a few lines so cards stay skimmable; tap to read the whole thing.
export default function ExpandableText({ label, text }) {
  const [open, setOpen] = useState(false);
  const [clipped, setClipped] = useState(false);
  const ref = useRef(null);

  // Only offer "Show more" when the clamp actually hid something.
  useLayoutEffect(() => {
    const el = ref.current;
    if (el && !open) setClipped(el.scrollHeight > el.clientHeight + 1);
  }, [text, open]);

  if (!text?.trim()) {
    return (
      <p className="text-xs text-[var(--color-text-tertiary)]">
        <span className="font-medium">{label}:</span> not filled in
      </p>
    );
  }

  return (
    <div className="text-xs leading-relaxed text-[var(--color-text-secondary)]">
      <p className="font-medium text-[var(--color-text-default)]">{label}</p>
      <p ref={ref} className={`whitespace-pre-line ${open ? '' : 'line-clamp-4'}`}>{text}</p>
      {(clipped || open) && (
        <button
          type="button"
          onClick={() => setOpen(o => !o)}
          className="mt-0.5 font-medium text-[var(--color-primary)] hover:underline"
        >
          {open ? 'Show less' : 'Show more'}
        </button>
      )}
    </div>
  );
}
