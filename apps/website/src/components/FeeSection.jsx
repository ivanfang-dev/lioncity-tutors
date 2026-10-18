import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { RATE_CARD, RATES_REVIEWED, rangeFor } from '@/app/tuition-rates/rates.mjs';
import { ICON_STROKE } from '@/components/guide';

const LEVELS = RATE_CARD.filter((band) => band.id !== 'ib');

/**
 * The free-to-parents promise as one plain statement, with the rate card beside it
 * so "free" never reads as "cheap" or "hidden".
 */
export default function FeeSection() {
  return (
    <section className="section-padding bg-background-subtle">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:items-center lg:gap-16">
        <div className="lg:col-span-6">
          <h2 className="text-balance text-gray-900">
            You pay the tutor.
            <span className="block text-primary">Never us.</span>
          </h2>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-gray-600 text-pretty">
            Matching is free. There is no agency fee on top, and you pay the tutor&rsquo;s rate directly once lessons
            begin. If the first match is not right, rematching costs nothing either.
          </p>
        </div>

        <div className="lg:col-span-6">
          <table className="w-full text-left">
            <caption className="sr-only">Tutor rates per hour by level</caption>
            <thead>
              <tr className="text-sm text-gray-500">
                <th scope="col" className="pb-3 font-normal">Level</th>
                <th scope="col" className="pb-3 text-right font-normal">Per hour</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-300 border-y border-gray-300">
              {LEVELS.map((band) => {
                const { min, max } = rangeFor(band.id);
                return (
                  <tr key={band.id}>
                    <th scope="row" className="py-5 pr-4 align-baseline font-semibold text-gray-900">
                      {band.level}
                    </th>
                    <td className="py-5 text-right align-baseline text-2xl font-bold tracking-tight text-gray-900 tabular-nums sm:text-3xl">
                      ${min}&ndash;{max}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="mt-4 flex flex-col gap-3 text-sm text-gray-600 sm:flex-row sm:items-baseline sm:justify-between">
            <p className="text-pretty">
              From undergraduates to MOE-trained teachers. Our rate card, reviewed {RATES_REVIEWED}.
            </p>
            <Link
              href="/tuition-rates"
              className="group inline-flex min-h-11 shrink-0 items-center gap-1.5 font-medium text-primary-deep underline-offset-4 hover:underline sm:min-h-0"
            >
              Full rate card
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" strokeWidth={ICON_STROKE} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
