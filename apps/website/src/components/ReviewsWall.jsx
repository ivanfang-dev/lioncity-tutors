import { ArrowUpRight, Star } from 'lucide-react';
import { REVIEWS, REVIEW_SOURCES } from '@/data/reviews.mjs';
import { ICON_STROKE } from '@/components/guide';

// The lead quote names a tutor and a month: the most specific thing a parent has said.
const LEAD = REVIEWS.find((r) => r.author === 'Amanda MB') ?? REVIEWS[0];
const REST = REVIEWS.filter((r) => r !== LEAD);

const quoted = (r) => `“${r.quote}${r.truncated ? '…' : ''}”`;

function Attribution({ review }) {
  const source = REVIEW_SOURCES[review.source];
  return (
    <footer className="mt-3 text-sm text-gray-500">
      <cite className="not-italic font-semibold text-gray-900">{review.author}</cite>
      {source && (
        <>
          {' · '}
          <a href={source.url} target="_blank" rel="noopener noreferrer" className="-my-3 inline-block py-3 underline-offset-4 hover:text-gray-800 hover:underline">
            {source.name} review
          </a>
        </>
      )}
    </footer>
  );
}

/**
 * Verbatim reviews from src/data/reviews.mjs, each linked to where it was left.
 * Phones get the lead quote and a swipeable row; wider screens set the rest in columns.
 */
export default function ReviewsWall() {
  const google = REVIEW_SOURCES.google;
  const carousell = REVIEW_SOURCES.carousell;

  return (
    <section className="section-padding bg-background-default">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <h2 className="text-balance text-gray-900">Parents, in their own words.</h2>
          <p className="text-gray-600 text-pretty">
            <span className="whitespace-nowrap">
              <Star className="-mt-1 mr-1.5 inline h-5 w-5 fill-rating text-rating" aria-hidden="true" />
              <span className="font-semibold text-gray-900 tabular-nums">{google.rating}</span> from
            </span>{' '}
            <span>
              <a href={google.url} target="_blank" rel="noopener noreferrer" className="-my-2 inline-block py-2 font-medium text-primary-deep underline underline-offset-4">
                <span className="tabular-nums">{google.count}</span> Google reviews
              </a>
              , plus{' '}
              <a href={carousell.url} target="_blank" rel="noopener noreferrer" className="-my-2 inline-block py-2 font-medium text-primary-deep underline underline-offset-4">
                <span className="tabular-nums">{carousell.count}</span> on Carousell
              </a>
            </span>
          </p>
        </div>

        <div className="mt-10 grid gap-10 lg:mt-14 lg:grid-cols-12 lg:gap-16">
          <blockquote className="lg:col-span-5">
            <p className="text-2xl font-semibold leading-snug tracking-tight text-gray-900 text-pretty sm:text-3xl">
              {quoted(LEAD)}
            </p>
            <Attribution review={LEAD} />
          </blockquote>

          {/* Phones: a row to swipe, with the next quote peeking in. From md: columns. */}
          <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:-mx-6 sm:px-6 md:mx-0 md:block md:columns-2 md:gap-10 md:overflow-visible md:px-0 md:pb-0 lg:col-span-7">
            {REST.map((review) => (
              <blockquote
                key={review.author}
                className="w-[82%] shrink-0 snap-start rounded-2xl border border-gray-200 bg-white p-5 md:mb-8 md:w-auto md:break-inside-avoid md:rounded-none md:border-0 md:border-t md:p-0 md:pt-5"
              >
                <p className="leading-relaxed text-gray-700 text-pretty">{quoted(review)}</p>
                <Attribution review={review} />
              </blockquote>
            ))}
          </div>
        </div>

        <a
          href={google.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group mt-8 inline-flex min-h-11 items-center gap-1.5 font-medium text-primary-deep underline-offset-4 hover:underline lg:mt-4"
        >
          Read every review on Google
          <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={ICON_STROKE} aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
