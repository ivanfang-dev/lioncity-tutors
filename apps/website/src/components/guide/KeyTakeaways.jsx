import { Sparkles, CheckCircle2 } from 'lucide-react';
import { ICON_STROKE } from './constants';

/**
 * The "short version" callout that opens a guide: a soft blue box with a
 * checklist of the four or five things a reader should leave with.
 *
 * @param {string} [title]
 * @param {import('react').ReactNode[]} items - takeaway lines (may contain markup)
 */
export default function KeyTakeaways({ title = 'The short version', items = [] }) {
  return (
    <div className="rounded-xl border border-primary/15 bg-primary/5 p-5 sm:p-6">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-5 w-5 text-primary" strokeWidth={ICON_STROKE} aria-hidden="true" />
        <h2 className="text-base leading-6 font-semibold text-gray-900">{title}</h2>
      </div>
      <ul className="space-y-2.5 text-sm text-gray-700">
        {items.map((item, index) => (
          <li key={index} className="flex gap-2.5">
            <CheckCircle2
              className="h-4 w-4 mt-0.5 shrink-0 text-primary"
              strokeWidth={ICON_STROKE}
              aria-hidden="true"
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
