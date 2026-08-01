import Link from 'next/link';
import { ArrowRight, HelpCircle } from 'lucide-react';
import GuideSchema from '@/components/seo/GuideSchema';
import { RelatedGuides, ICON_STROKE } from '@/components/guide';
import { MATCH_TIME } from '@/data/promises';
import TuitionRequestForm from './TuitionRequestForm';
import { RATE_CARD, RATES_REVIEWED, bandFor, priceLabel, overallRange } from './rates.mjs';
import { RATE_ANSWERS, SERVICE_FAQS, TUITION_RATES_FAQS } from './faqs.mjs';

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
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter mb-6 text-primary text-balance">
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
                <h2 className="text-2xl font-bold text-primary text-balance">{section.question}</h2>
                <p className="mt-3 text-text-default/85 leading-relaxed text-pretty">{section.answer}</p>
                {section.band ? <RateTable id={section.band} /> : null}
              </section>
            ))}
          </div>

          <section aria-labelledby="faq" className="mt-16 max-w-3xl mx-auto">
            <div className="flex items-start gap-3 mb-6">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <HelpCircle className="h-5 w-5" strokeWidth={ICON_STROKE} aria-hidden="true" />
              </span>
              <h2 id="faq" className="scroll-mt-24 text-2xl font-bold tracking-tight text-primary">
                Answering your questions
              </h2>
            </div>
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
            <RelatedGuides slug={SLUG} heading="Plan the year around the exam" />
          </div>
        </main>

        <TuitionRequestForm />
      </div>
    </>
  );
}
