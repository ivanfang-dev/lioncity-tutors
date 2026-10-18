import { UserRound } from 'lucide-react';
import { MATCH_TIMELINE, MEASURED_AS_OF } from '@/data/promises';
import { ICON_STROKE } from '@/components/guide';
import TiltSurface from '@/components/TiltSurface';
import styles from './ShortlistArtifact.module.css';

// One wobbled segment per gap, so the stroke starts at the request and stops at the shortlist.
const SEGMENTS = [
  'M 12 -3 C 8 25, 16 55, 12 103',
  'M 12 -3 C 17 30, 7 62, 12 103',
  'M 12 -3 C 8 28, 17 64, 12 103',
];

const strokeProps = { fill: 'none', stroke: 'currentColor', strokeWidth: 2.5, strokeLinecap: 'butt' };

/**
 * A request, the measured match timeline, and the shortlist it ends in, as one object.
 *
 * @param {{ request: { title: string, detail: string }, tutors: object[] }} shortlist - see src/data/shortlists.js
 * @param {string} subject - pool name for the caption, e.g. "physics"
 */
export default function ShortlistArtifact({ shortlist, subject }) {
  const last = MATCH_TIMELINE.length - 1;

  return (
    <figure className="w-full max-w-md mx-auto lg:max-w-none lg:mx-0">
      <TiltSurface className={styles.tilt}>
        <div className={`${styles.rise} rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-[0_8px_24px_rgba(0,0,0,0.10)]`}>
          <div className="flex items-start justify-between gap-4 border-b border-gray-100 pb-5">
            <div>
              <p className="font-semibold text-gray-900">{shortlist.request.title}</p>
              <p className="mt-0.5 text-sm text-gray-500">{shortlist.request.detail}</p>
            </div>
            <span className="shrink-0 rounded-full border border-gray-200 px-2.5 py-0.5 text-xs text-gray-500">
              Example request
            </span>
          </div>

          <ol className="pt-5 pl-9">
            {MATCH_TIMELINE.map((stage, i) => (
              <li key={stage.time} className={`relative ${i < last ? 'pb-3' : ''}`}>
                {i < last && (
                  <svg
                    className="pointer-events-none absolute -left-9 top-2.5 h-full w-6 overflow-visible text-accent"
                    viewBox="0 0 24 100"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    <path {...strokeProps} d={SEGMENTS[i]} className="opacity-20" />
                    <path {...strokeProps} d={SEGMENTS[i]} pathLength="1" className={styles.draw} style={{ '--i': i }} />
                  </svg>
                )}
                <span
                  className={`${styles.node} absolute -left-9 top-0.5 z-10 flex h-4 w-6 items-center justify-center`}
                  style={{ '--i': i }}
                  aria-hidden="true"
                >
                  {i === last ? (
                    <span className="relative block h-4 w-4 rounded-full bg-accent ring-4 ring-accent/20">
                      <span className={`${styles.arrive} absolute inset-0 rounded-full`} />
                    </span>
                  ) : (
                    <span className="block h-2.5 w-2.5 rounded-full bg-accent" />
                  )}
                </span>
                <p className="flex items-baseline gap-3 text-sm">
                  <span className="w-14 shrink-0 font-semibold text-primary tabular-nums">{stage.time}</span>
                  <span className={i === last ? 'font-semibold text-gray-900' : 'text-gray-700'}>{stage.label}</span>
                </p>
              </li>
            ))}
          </ol>

          <ul className="mt-5 divide-y divide-gray-100 border-t border-gray-100">
            {shortlist.tutors.map((tutor, i) => (
              <li key={tutor.headline} className={`${styles.deal} flex gap-3 py-3.5 last:pb-0`} style={{ '--i': i }}>
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <UserRound className="h-[18px] w-[18px]" strokeWidth={ICON_STROKE} aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold leading-snug text-gray-900">{tutor.headline}</p>
                  <div className="mt-0.5 flex items-baseline justify-between gap-3">
                    <p className="text-xs text-gray-500">{tutor.meta}</p>
                    <p className="shrink-0 text-sm font-semibold text-gray-900 tabular-nums">{tutor.rate}</p>
                  </div>
                  <p className="mt-1.5 text-sm leading-normal text-gray-700 text-pretty">{tutor.evidence}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </TiltSurface>

      <figcaption className="mt-4 text-xs leading-relaxed text-gray-500 text-pretty">
        Times are medians from our matching records ({MEASURED_AS_OF}). Tutors are real profiles from our {subject} pool, names withheld; results are as each tutor states them.
      </figcaption>
    </figure>
  );
}
