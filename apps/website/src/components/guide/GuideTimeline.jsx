import { cn } from '@/lib/utils';
import { ICON_STROKE } from './constants';

/**
 * A vertical, numbered timeline for phased study plans. The badge number is
 * derived from order, so items only carry a title and their points.
 *
 * `variant="graph"` renders a richer desktop layout — alternating left/right
 * cards either side of a center spine, with an optional per-item icon — and
 * collapses to the same plain single-column layout as the default variant
 * below the `md` breakpoint. Existing callers are unaffected: omitting
 * `variant` keeps the original plain numbered-list rendering.
 *
 * @param {{ title: string, points?: string[], description?: string, period?: string, icon?: import('react').ComponentType }[]} items - ordered phases
 * @param {'list' | 'graph'} [variant]
 */
export default function GuideTimeline({ items = [], variant = 'list' }) {
  if (variant === 'graph') {
    return (
      <div className="relative">
        <div
          className="absolute left-5 top-0 bottom-0 w-px bg-gray-200 md:left-1/2 md:-translate-x-1/2"
          aria-hidden="true"
        />
        <ol className="space-y-10">
          {items.map((item, index) => {
            const Icon = item.icon;
            const alignRight = index % 2 === 1;
            return (
              <li key={item.title} className="relative">
                <div className="absolute left-5 top-0 z-10 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full bg-primary text-white shadow-sm md:left-1/2">
                  {Icon ? (
                    <Icon className="h-4 w-4" strokeWidth={ICON_STROKE} aria-hidden="true" />
                  ) : (
                    <span className="text-sm font-semibold tabular-nums">{index + 1}</span>
                  )}
                </div>
                <div
                  className={cn(
                    'pl-14 md:w-1/2 md:pl-0',
                    alignRight ? 'md:ml-auto md:pl-10 md:text-left' : 'md:mr-auto md:pr-10 md:text-right'
                  )}
                >
                  <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
                    {item.period ? (
                      <p className="mb-1 text-sm font-semibold text-gray-500 tabular-nums">{item.period}</p>
                    ) : null}
                    <h3 className="font-semibold text-gray-900">{item.title}</h3>
                    {item.description ? (
                      <p className="mt-2 text-left text-sm text-gray-700">{item.description}</p>
                    ) : null}
                    {item.points?.length ? (
                      <ul className="ml-5 mt-2 list-disc space-y-1 text-left text-sm text-gray-700">
                        {item.points.map((point) => (
                          <li key={point}>{point}</li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="absolute left-4 top-3 bottom-3 w-px bg-gray-200" aria-hidden="true" />
      <ol className="space-y-8">
        {items.map((item, index) => (
          <li key={item.title} className="relative pl-14">
            <div className="absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white text-sm font-semibold tabular-nums shadow-sm">
              {index + 1}
            </div>
            <h3 className="font-semibold text-gray-900">{item.title}</h3>
            <ul className="list-disc ml-5 mt-2 space-y-1 text-gray-700">
              {item.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </div>
  );
}
