import Link from 'next/link';
import { ArrowUpRight, Compass } from 'lucide-react';
import { getHubsFor, getSiblings, getPage } from '@/lib/seo/links.mjs';
import { ICON_STROKE } from './constants';

/**
 * Reciprocal cluster links, derived entirely from the SEO registry.
 *
 * Anchor text comes from the registry rather than the call site so the same
 * page is described consistently everywhere it is linked. A page can surface
 * more than one hub (see getHubsFor) — e.g. a page that is both an O-Level
 * and N-Level spoke gets one card per hub.
 *
 * Siblings are capped: the O-Level hub carries nineteen spokes since the
 * commercial pages joined it, and a page that links eighteen others spreads
 * itself thin and reads as a link farm. The cap keeps registry order, which
 * lists the subject guides first — those are the ones worth passing equity to.
 *
 * @param {string} slug - registry slug of the page rendering this block
 * @param {string} [heading]
 * @param {boolean} [showHub] - pass false on a hub page
 * @param {number} [limit] - maximum sibling cards
 */
export default function RelatedGuides({
  slug,
  heading = 'Continue your revision',
  showHub = true,
  limit = 10,
}) {
  const page = getPage(slug);
  if (!page) return null;

  // A hub never links to itself, so drop it from its own list of hub cards.
  const hubs = getHubsFor(slug).filter((hub) => hub.slug !== slug);
  const siblings = getSiblings(slug).slice(0, limit);
  if (hubs.length === 0 && siblings.length === 0) return null;

  return (
    <section aria-labelledby={`related-${slug}`} className="mt-16 border-t border-gray-100 pt-10">
      <h2 id={`related-${slug}`} className="flex items-center gap-2 text-2xl font-bold text-gray-900 mb-6">
        <Compass className="h-6 w-6 text-[#0474BA]" strokeWidth={ICON_STROKE} aria-hidden="true" />
        {heading}
      </h2>

      {showHub && hubs.length > 0 ? (
        <div className="mb-6 space-y-4">
          {hubs.map((hub) => (
            <Link
              key={hub.slug}
              href={hub.url}
              className="group flex items-start justify-between gap-4 rounded-xl border border-[#0474BA]/20 bg-[#0474BA]/5 p-5 transition-colors hover:border-[#0474BA]/50"
            >
              <span>
                <span className="block font-semibold text-[#0474BA]">{hub.anchor}</span>
                <span className="mt-1 block text-sm text-gray-600">
                  {hub.blurb ?? 'Timetable, subject choices and the full revision plan in one place.'}
                </span>
              </span>
              <ArrowUpRight
                className="mt-1 h-5 w-5 shrink-0 text-[#0474BA] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                strokeWidth={ICON_STROKE}
                aria-hidden="true"
              />
            </Link>
          ))}
        </div>
      ) : null}

      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {siblings.map((s) => (
          <li key={s.slug}>
            <Link
              href={s.url}
              className="group block h-full rounded-xl border border-gray-200 p-5 transition-all hover:-translate-y-0.5 hover:border-[#F17720] hover:shadow-md"
            >
              <span className="block font-semibold text-gray-900 group-hover:text-[#F17720]">
                {s.anchor}
              </span>
              <span className="mt-1 block text-sm text-gray-600">{s.blurb}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
