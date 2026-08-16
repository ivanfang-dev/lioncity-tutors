import Link from 'next/link';
import { ArrowRight, HelpCircle } from 'lucide-react';
import GuideSchema from '@/components/seo/GuideSchema';
import { RelatedGuides, SectionHeading } from '@/components/guide';
import { MATCH_TIME } from '@/data/promises';
import { AGENCY_ANSWERS, COMPARISON, AGENCY_FAQS, ALL_FAQS } from './content.mjs';

const SLUG = 'how-to-choose-a-tuition-agency-singapore';

/** Agency vs centre vs independent tutor. Server-rendered: no JS, no accordion. */
function ComparisonTable() {
  return (
    <div className="mt-5 overflow-x-auto">
      <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
        <caption className="sr-only">{COMPARISON.caption}</caption>
        <thead>
          <tr className="border-b border-border">
            <th scope="col" className="py-2 pr-4 font-semibold text-text-default">
              &nbsp;
            </th>
            {COMPARISON.columns.map((col) => (
              <th key={col} scope="col" className="py-2 pr-4 font-semibold text-text-default">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {COMPARISON.rows.map((row) => (
            <tr key={row.name} className="border-b border-border/60 last:border-0">
              <th scope="row" className="py-3 pr-4 font-semibold text-text-default whitespace-nowrap">
                {row.name}
              </th>
              {row.cells.map((cell, index) => (
                <td key={COMPARISON.columns[index]} className="py-3 pr-4 text-text-default/85">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function ChooseAgencyPage() {
  return (
    <>
      <GuideSchema
        slug={SLUG}
        service={{
          name: 'Tuition agency matching in Singapore',
          description:
            'Guidance on choosing between a tuition agency, a tuition centre and an independent tutor in Singapore, and how to vet an agency before committing.',
        }}
        faqs={ALL_FAQS}
      />

      <div className="bg-background-default text-text-default">
        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
          <div className="text-center mb-16">
            <h1 className="page-title text-primary mb-6">
              How to Choose a Tuition Agency in Singapore
            </h1>
            <p className="text-lg md:text-xl text-text-default/80 max-w-3xl mx-auto mb-4 text-pretty">
              Agencies, tuition centres and independent tutors all charge and operate differently.
              Here&apos;s how to tell them apart, what a good agency should do for you, and the
              warning signs of a bad one &mdash; including the case for skipping an agency entirely.
            </p>
            <p className="text-sm text-text-default/60 mb-10">
              LionCity Tutors charges parents no agency fee, so we can be honest about how the rest
              of the market makes its money.
            </p>
            <a
              href="#request-tutor-cta"
              className="group inline-flex items-center gap-2 bg-accent hover:opacity-90 text-text-inverse font-bold px-8 py-4 rounded-full shadow-lg text-lg"
            >
              Request a Tutor
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </a>
          </div>

          <nav aria-label="Jump to a question" className="flex flex-wrap justify-center gap-2 mb-16">
            {AGENCY_ANSWERS.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="rounded-full border border-border bg-background-card px-4 py-2 text-sm font-semibold text-primary shadow-sm transition-colors hover:border-primary"
              >
                {section.label}
              </a>
            ))}
          </nav>

          <div className="space-y-10">
            {AGENCY_ANSWERS.map((section) => (
              <section
                key={section.id}
                id={section.id}
                className="scroll-mt-24 rounded-2xl border border-border bg-background-card p-6 sm:p-8 shadow-sm"
              >
                <h2 className="section-title text-primary">{section.question}</h2>
                <p className="mt-3 text-text-default/85 leading-relaxed text-pretty">{section.answer}</p>
                {section.id === 'agency-centre-or-tutor' ? <ComparisonTable /> : null}
                {section.id === 'agency-centre-or-tutor' ? (
                  <p className="mt-3 text-xs text-text-default/60">
                    Tuition centre and independent-tutor figures are market estimates for comparison,
                    not LionCity Tutors&apos; own data. Only the agency row above is ours.
                  </p>
                ) : null}
              </section>
            ))}
          </div>

          <section aria-labelledby="faq" className="mt-16 max-w-3xl mx-auto">
            <SectionHeading id="faq" icon={HelpCircle}>
              Answering your questions
            </SectionHeading>
            <div className="space-y-6">
              {AGENCY_FAQS.map((faq) => (
                <div key={faq.question}>
                  <h3 className="text-lg font-semibold text-text-default">{faq.question}</h3>
                  <p className="mt-2 text-text-default/80 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>

          <div id="request-tutor-cta" className="mt-16 max-w-3xl mx-auto scroll-mt-24">
            <p className="text-text-default/80">
              Ready to skip the vetting yourself? Tell us the level and subject and we hand-match a
              vetted tutor, usually within {MATCH_TIME}, at no cost to you.{' '}
              <Link href="/request-tutor" className="font-semibold text-primary underline underline-offset-2">
                Request a tutor
              </Link>
              .
            </p>
            {/* hubLimit={5}: this page now belongs to 5 hubs (4 exam hubs +
                find-a-tutor) — the default cap of 4 would silently drop the
                find-a-tutor back-link. */}
            <RelatedGuides slug={SLUG} heading="Plan the year around the exam" hubLimit={5} />
          </div>
        </main>
      </div>
    </>
  );
}
