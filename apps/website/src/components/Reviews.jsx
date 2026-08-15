import { Star } from 'lucide-react';
import {
  REVIEWS, REVIEW_SOURCES, REVIEWS_REVIEWED, HEADLINE_SOURCE, sourceSummary,
} from '@/data/reviews.mjs';

/**
 * Verbatim customer reviews with a link back to the platform they came from,
 * so a reader can check them. Quotes come from src/data/reviews.mjs — see the
 * note there about never wrapping these in review JSON-LD, and about why the
 * headline star rating is Google's alone.
 *
 * @param {string} [heading]
 * @param {number} [limit] - maximum quotes to show
 */
export default function Reviews({ heading = 'What parents say', limit = 4 }) {
  const shown = REVIEWS.slice(0, limit);
  if (shown.length === 0) return null;

  const headline = REVIEW_SOURCES[HEADLINE_SOURCE];

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h2 className="text-2xl font-semibold text-blue-700">{heading}</h2>
        {headline?.rating ? (
          <p className="flex items-baseline gap-1.5 text-sm text-gray-600">
            <Star className="h-4 w-4 self-center fill-amber-400 text-amber-400" aria-hidden="true" />
            <span className="font-semibold text-gray-900 tabular-nums">{headline.rating}</span>
            <span>
              from{' '}
              <a
                href={headline.url}
                className="text-blue-700 underline underline-offset-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="tabular-nums">{headline.count}</span> {headline.name} reviews
              </a>
            </span>
          </p>
        ) : null}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {shown.map((review) => {
          const source = REVIEW_SOURCES[review.source];
          return (
            <blockquote
              key={`${review.author}-${review.quote.slice(0, 24)}`}
              className="rounded-xl border border-gray-200 bg-gray-50 p-6"
            >
              <p className="text-gray-700 mb-3">
                &ldquo;{review.quote}{review.truncated ? '…' : ''}&rdquo;
              </p>
              <footer className="text-sm text-gray-500">
                <cite className="not-italic font-semibold text-gray-900">{review.author}</cite>
                {source ? <> &middot; verified {source.name} review</> : null}
              </footer>
            </blockquote>
          );
        })}
      </div>

      <p className="text-sm text-gray-500">
        Read every review at source:{' '}
        {Object.entries(REVIEW_SOURCES).map(([key, source], index) => (
          <span key={key}>
            {index > 0 ? ' · ' : ''}
            <a
              href={source.url}
              className="text-blue-700 underline underline-offset-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              {source.name}
            </a>{' '}
            ({sourceSummary(key)})
          </span>
        ))}
        . Counts as of {REVIEWS_REVIEWED}.
      </p>
    </section>
  );
}
