import Link from 'next/link';
import { ArrowRight, HelpCircle, Wallet, GraduationCap } from 'lucide-react';
import GuideSchema from '@/components/seo/GuideSchema';
import { RelatedGuides, SectionHeading } from '@/components/guide';
import { MATCH_TIME } from '@/data/promises';
import TuitionRequestForm from './TuitionRequestForm';
import {
  RATE_CARD, RATES_REVIEWED, TUTOR_TYPES, bandFor, rangeFor, priceLabel, overallRange,
} from './rates.mjs';
import { RATE_ANSWERS, SERVICE_FAQS, TUITION_RATES_FAQS } from './faqs.mjs';
import { PLACEMENT_SAMPLE, PLACEMENTS_REVIEWED, observedFor, observedSpan, sampleLabel } from './placements.mjs';

const SLUG = 'tuition-rates';

/** One level's rate table. Server-rendered: the figures are in the HTML. */
function RateTable({ id }) {
  const band = bandFor(id);
  return (
    <div className="mt-5 overflow-x-auto">
      <table className="w-full min-w-[20rem] border-collapse text-left text-sm">
        <caption className="sr-only">
          {band.level} tuition rates per hour, by tutor type
        </caption>
        <thead>
          <tr className="border-b border-border">
            <th scope="col" className="py-2 pr-4 font-semibold text-text-default">Tutor type</th>
            <th scope="col" className="py-2 font-semibold text-text-default">Rate per hour</th>
          </tr>
        </thead>
        <tbody>
          {band.rates.map((rate) => (
            <tr key={rate.type} className="border-b border-border/60 last:border-0">
              <td className="py-3 pr-4">
                <span className="block font-medium text-text-default">{rate.type}</span>
                <span className="block text-xs text-text-default/60">{rate.details}</span>
              </td>
              <td className="py-3 font-bold text-primary whitespace-nowrap">{priceLabel(rate)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * What parents actually budgeted per hour, by level, beside our published
 * range. IB has no observed sample — observedFor returns undefined and this
 * renders an em-dash with a "not enough data yet" note, never $0 or blank.
 */
function ObservedTable() {
  return (
    <div className="mt-5 overflow-x-auto">
      <table className="w-full min-w-[32rem] border-collapse text-left text-sm">
        <caption className="sr-only">
          What parents actually budget per hour, by level, compared with LionCity Tutors&apos;
          published rate range
        </caption>
        <thead>
          <tr className="border-b border-border">
            <th scope="col" className="py-2 pr-4 font-semibold text-text-default">Level</th>
            <th scope="col" className="py-2 pr-4 font-semibold text-text-default">
              What parents budget (median)
            </th>
            <th scope="col" className="py-2 pr-4 font-semibold text-text-default">
              Our published range
            </th>
            <th scope="col" className="py-2 font-semibold text-text-default">Based on</th>
          </tr>
        </thead>
        <tbody>
          {RATE_CARD.map((band) => {
            const observed = observedFor(band.id);
            const { min, max } = rangeFor(band.id);
            return (
              <tr key={band.id} className="border-b border-border/60 last:border-0">
                <th scope="row" className="py-3 pr-4 font-medium text-text-default whitespace-nowrap">
                  {band.level}
                </th>
                <td className="py-3 pr-4 text-text-default/85 whitespace-nowrap">
                  {observed ? `$${observed.medianMin} – $${observed.medianMax}` : '—'}
                </td>
                <td className="py-3 pr-4 text-text-default/85 whitespace-nowrap">
                  ${min} &ndash; ${max}
                </td>
                <td className="py-3 text-text-default/85">
                  {observed ? sampleLabel(band.id) : 'Not enough data yet'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/** Rate by tutor type and level, built from RATE_CARD rather than hand-written cells. */
function TierTable() {
  const levels = ['primary', 'secondary', 'jc'];
  const bestFor = {
    'Undergraduate': 'Confidence, relatability, keeping pace',
    'Full-Time Tutor': 'Consistency, exam drilling, long engagements',
    'MOE-Trained Teacher': 'Diagnosing why a grade is stuck; marking-scheme insight',
  };
  return (
    <div className="mt-5 overflow-x-auto">
      <table className="w-full min-w-[32rem] border-collapse text-left text-sm">
        <caption className="sr-only">
          Hourly tuition rates by tutor type and level: undergraduate, full-time tutor and
          MOE-trained teacher
        </caption>
        <thead>
          <tr className="border-b border-border">
            <th scope="col" className="py-2 pr-4 font-semibold text-text-default">&nbsp;</th>
            {TUTOR_TYPES.map((type) => (
              <th key={type} scope="col" className="py-2 pr-4 font-semibold text-text-default">
                {type}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {levels.map((id) => {
            const band = bandFor(id);
            return (
              <tr key={id} className="border-b border-border/60 last:border-0">
                <th scope="row" className="py-3 pr-4 font-medium text-text-default whitespace-nowrap">
                  {band.level}
                </th>
                {TUTOR_TYPES.map((type) => {
                  const rate = band.rates.find((r) => r.type === type);
                  return (
                    <td key={type} className="py-3 pr-4 font-bold text-primary whitespace-nowrap">
                      {rate ? priceLabel(rate) : '—'}
                    </td>
                  );
                })}
              </tr>
            );
          })}
          <tr>
            <th scope="row" className="py-3 pr-4 font-medium text-text-default whitespace-nowrap">
              Best for
            </th>
            {TUTOR_TYPES.map((type) => (
              <td key={type} className="py-3 pr-4 text-sm text-text-default/85">
                {bestFor[type]}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default function TuitionRatesPage() {
  const { min, max } = overallRange();

  return (
    <>
      <GuideSchema
        slug={SLUG}
        service={{
          name: 'Private tuition in Singapore',
          description: `Hand-matched private tutors across every level, charged by the hour at $${min} to $${max} depending on level and tutor experience. No agency fee for parents.`,
          offers: RATE_CARD.map((band) => ({
            name: band.level,
            min: Math.min(...band.rates.map((r) => r.min)),
            max: Math.max(...band.rates.map((r) => r.max)),
          })),
        }}
        faqs={TUITION_RATES_FAQS}
      />

      <div className="bg-background-default text-text-default">
        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
          <div className="text-center mb-16">
            <h1 className="page-title text-primary mb-6">
              Tuition Rates in Singapore
            </h1>
            <p className="text-lg md:text-xl text-text-default/80 max-w-3xl mx-auto mb-4 text-pretty">
              Private tuition runs ${min} to ${max} an hour here, depending on the level and how
              experienced the tutor is. Every rate below is what the tutor charges &mdash; parents
              pay no agency fee.
            </p>
            <p className="text-sm text-text-default/60 mb-10">
              LionCity Tutors&apos; own rate card, reviewed {RATES_REVIEWED}. Rates elsewhere in the
              market will differ.
            </p>
            <a
              href="#request"
              className="group inline-flex items-center gap-2 bg-accent hover:opacity-90 text-text-inverse font-bold px-8 py-4 rounded-full shadow-lg text-lg"
            >
              Request a Tutor
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </a>
          </div>

          <nav aria-label="Jump to a level" className="flex flex-wrap justify-center gap-2 mb-16">
            {RATE_ANSWERS.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="rounded-full border border-border bg-background-card px-4 py-2 text-sm font-semibold text-primary shadow-sm transition-colors hover:border-primary"
              >
                {section.label}
              </a>
            ))}
          </nav>

          {/* Answer blocks: the question, the figure, then the table it came from. */}
          <div className="space-y-10">
            {RATE_ANSWERS.map((section) => (
              <section
                key={section.id}
                id={section.id}
                className="scroll-mt-24 rounded-2xl border border-border bg-background-card p-6 sm:p-8 shadow-sm"
              >
                <h2 className="section-title text-primary">{section.question}</h2>
                <p className="mt-3 text-text-default/85 leading-relaxed text-pretty">{section.answer}</p>
                {section.band ? <RateTable id={section.band} /> : null}
              </section>
            ))}
          </div>

          <section aria-labelledby="observed-budgets" className="mt-16 max-w-4xl mx-auto scroll-mt-24">
            <SectionHeading id="observed-budgets" icon={Wallet}>
              What do parents actually budget for tuition?
            </SectionHeading>
            <p className="text-text-default/85 leading-relaxed text-pretty">
              Across {PLACEMENT_SAMPLE} assignments, most Singapore parents budget {observedSpan('primary')} for
              primary tuition, {observedSpan('secondary')} for secondary and {observedSpan('jc')} for JC. That
              sits in the lower half of what tutors here charge &mdash; the MOE-trained tier is a minority
              choice, not the norm.
            </p>
            <ObservedTable />
            <p className="mt-4 text-sm text-text-default/60">
              LionCity Tutors&apos; own assignments, {PLACEMENT_SAMPLE} with a stated budget, reviewed{' '}
              {PLACEMENTS_REVIEWED}. This is what parents asked to pay, not a national average.
            </p>
            <div className="mt-5 space-y-3 text-text-default/85 leading-relaxed text-pretty">
              <p>
                A higher budget widens the pool of tutors willing to take the assignment and shortens
                the wait for a match.
              </p>
              <p>
                A budget under the p10 figure above will typically take longer to fill, since fewer
                tutors are willing to take it on.
              </p>
              <p>
                The published top end of the rate card reflects what the most experienced, MOE-trained
                tutors charge &mdash; not what a typical family pays.
              </p>
            </div>
          </section>

          <section aria-labelledby="tutor-tiers" className="mt-16 max-w-4xl mx-auto scroll-mt-24">
            <SectionHeading id="tutor-tiers" icon={GraduationCap}>
              Should I pay for an MOE-trained teacher or an undergraduate?
            </SectionHeading>
            <p className="text-text-default/85 leading-relaxed text-pretty">
              An undergraduate tutor is the cheaper, more relatable option &mdash; strong for building
              confidence and keeping pace with schoolwork. An MOE-trained teacher costs more but brings
              marking-scheme insight and can diagnose exactly why a grade is stuck. A full-time tutor sits
              between the two: consistent, but not curriculum-trained.
            </p>
            <TierTable />
            <p className="mt-4 text-text-default/85 leading-relaxed text-pretty">
              Most parents here budget below the MOE-trained tier, and that&apos;s a reasonable choice for
              a child who mainly needs consistent practice and pacing. The MOE-trained tier earns its
              premium when a grade has stalled and you need someone who can diagnose exactly why &mdash;
              not for a child who is already coping and just needs more reps.
            </p>
          </section>

          <section aria-labelledby="faq" className="mt-16 max-w-3xl mx-auto">
            <SectionHeading id="faq" icon={HelpCircle}>
              Answering your questions
            </SectionHeading>
            <div className="space-y-6">
              {SERVICE_FAQS.map((faq) => (
                <div key={faq.question}>
                  <h3 className="text-lg font-semibold text-text-default">{faq.question}</h3>
                  <p className="mt-2 text-text-default/80 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="mt-16 max-w-3xl mx-auto">
            <p className="text-text-default/80">
              Know the rate and ready to start? Tell us the level and subject and we hand-match a
              vetted tutor, usually within {MATCH_TIME}.{' '}
              <Link href="/request-tutor" className="font-semibold text-primary underline underline-offset-2">
                Request a tutor
              </Link>
              .
            </p>
            {/* hubLimit={5}: tuition-rates now belongs to 5 hubs (4 exam hubs +
                find-a-tutor) — the default cap of 4 would silently drop one of
                the existing prep-guide links Phase 1 built. */}
            <RelatedGuides slug={SLUG} heading="Plan the year around the exam" hubLimit={5} />
          </div>
        </main>

        <TuitionRequestForm />
      </div>
    </>
  );
}
