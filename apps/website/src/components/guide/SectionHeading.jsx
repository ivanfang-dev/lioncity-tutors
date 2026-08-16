import { ICON_STROKE } from './constants';

/**
 * A guide section header: a blue icon chip beside an anchored h2.
 * The `id` doubles as the scroll target for the table of contents.
 *
 * @param {string} id - anchor id, matched by the guide's table of contents
 * @param {import('lucide-react').LucideIcon} icon - Lucide icon component
 */
export default function SectionHeading({ id, icon: Icon, children }) {
  return (
    <div className="flex items-start gap-3 mb-5">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="h-5 w-5" strokeWidth={ICON_STROKE} aria-hidden="true" />
      </span>
      <h2 id={id} className="section-title text-primary scroll-mt-24">
        {children}
      </h2>
    </div>
  );
}
