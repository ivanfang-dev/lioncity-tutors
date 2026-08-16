import Link from 'next/link';
import { ArrowRight, FileText, HelpCircle } from 'lucide-react';
import GuideSchema from '@/components/seo/GuideSchema';
import { RelatedGuides, GuideCTA, SectionHeading, ICON_STROKE } from '@/components/guide';
import { getPage } from '@/lib/seo/links.mjs';
import { MATCH_TIME } from '@/data/promises';
import PaperLibrary from './PaperLibrary';
import { PAPER_SECTIONS } from './sections.mjs';
import { FREE_TEST_PAPERS_FAQS } from './faqs.mjs';
import { paperStats } from './stats';

const SLUG = 'free-test-papers';

// Which library section each level answer block sends the reader to. N-Level
// has no shelf of its own, so it points at the O-Level papers it explains.
const LIBRARY_ANCHOR = {
  'o-level': '#papers-secondary',
  'n-level': '#papers-secondary',
  'a-level': '#papers-jc',
  psle: '#papers-primary',
};

const whatsappMessage = `Hi LionCity Tutors! I've been using your free test papers and I'd like help finding a tutor.

Student level (e.g. P6 / Sec 4 / JC2):
Subject:
Location:
Preferred days & timing: `;
const whatsappHref = `https://wa.me/6588701152?text=${encodeURIComponent(whatsappMessage)}`;

export default function FreeTestPapersPage() {
  return (
    <>
      <GuideSchema
        slug={SLUG}
        collection={{
          name: 'Free Test Papers: O-Level, JC and PSLE',
          description:
            'Free prelim and past year papers from Singapore schools, grouped by level, subject and exam.',
          items: PAPER_SECTIONS.map((section) => ({
            name: section.label,
            url: `/free-test-papers#${section.id}`,
          })),
        }}
        faqs={FREE_TEST_PAPERS_FAQS}
      />

      <div className="bg-gray-50 min-h-screen">
        <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-16">
          <section className="text-center py-8 space-y-6">
            <h1 className="page-title text-primary">
              Free Test Papers
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed text-pretty">
              Free exam papers for every level &mdash; {paperStats.total} prelim and past year
              papers from Singapore schools, {paperStats.firstYear} to {paperStats.lastYear},
              sorted by level, subject and exam.
            </p>
            <nav aria-label="Jump to a level" className="flex flex-wrap justify-center gap-2">
              {PAPER_SECTIONS.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="rounded-full border border-[#0474BA]/25 bg-white px-4 py-2 text-sm font-semibold text-[#0474BA] shadow-sm transition-colors hover:border-[#0474BA] hover:bg-[#0474BA]/5"
                >
                  {section.label}
                </a>
              ))}
            </nav>
          </section>

          {/* Level answer blocks: what the library holds for each exam level. */}
          <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2">
            {PAPER_SECTIONS.map((section) => {
              const hub = getPage(section.hub);
              return (
                <section
                  key={section.id}
                  id={section.id}
                  className="scroll-mt-24 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
                >
                  <h2 className="text-xl font-bold text-gray-900 text-balance">{section.heading}</h2>
                  <p className="mt-3 text-gray-700 leading-relaxed text-pretty">{section.answer}</p>
                  <p className="mt-3 text-gray-700 leading-relaxed text-pretty">
                    {section.linkLead}{' '}
                    <Link href={hub.url} className="font-semibold text-[#0474BA] underline underline-offset-2">
                      {hub.anchor}
                    </Link>
                    .
                  </p>
                  <a
                    href={LIBRARY_ANCHOR[section.id]}
                    className="group mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#F17720]"
                  >
                    <FileText className="h-4 w-4" strokeWidth={ICON_STROKE} aria-hidden="true" />
                    Go to the papers
                    <ArrowRight
                      className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                      strokeWidth={ICON_STROKE}
                      aria-hidden="true"
                    />
                  </a>
                </section>
              );
            })}
          </div>

          <PaperLibrary />

          <section aria-labelledby="faq" className="mx-auto max-w-3xl">
            <SectionHeading id="faq" icon={HelpCircle}>
              Free test papers: common questions
            </SectionHeading>
            <div className="space-y-6">
              {FREE_TEST_PAPERS_FAQS.map((faq) => (
                <div key={faq.question}>
                  <h3 className="text-lg font-semibold text-gray-900">{faq.question}</h3>
                  <p className="mt-2 text-gray-700 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="mx-auto max-w-3xl">
            <RelatedGuides slug={SLUG} heading="Guides that go with these papers" showHub={false} />
          </div>

          <div className="mx-auto max-w-3xl">
            <GuideCTA
              title="Papers only take you so far"
              description={`Tell us the subject and the grade you are aiming for. We hand-match a vetted tutor — usually within ${MATCH_TIME} — and parents never pay an agency fee.`}
              buttonText="Find a tutor for this subject"
              whatsappHref={whatsappHref}
            />
          </div>
        </div>
      </div>
    </>
  );
}
