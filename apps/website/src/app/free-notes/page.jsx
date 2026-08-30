import Link from 'next/link';
import { ArrowRight, ExternalLink, FileText, HelpCircle } from 'lucide-react';
import GuideSchema from '@/components/seo/GuideSchema';
import { GuideCTA, SectionHeading, ICON_STROKE } from '@/components/guide';
import { getPage } from '@/lib/seo/links.mjs';
import { MATCH_TIME } from '@/data/promises';
import NoteLibrary from './NoteLibrary';
import { NOTE_SECTIONS } from './sections.mjs';
import { FREE_NOTES_FAQS } from './faqs.mjs';
import { EXTERNAL_NOTES } from './externalResources.mjs';
import { NOTES_DISCLAIMER } from './disclaimer.mjs';

const SLUG = 'free-notes';

// Which library section each answer block sends the reader to. The H2 sciences
// have no shelf of their own yet, so that block points at the JC section where
// the General Paper notes live.
const LIBRARY_ANCHOR = {
  'general-paper': '#notes-jc',
  'h2-sciences': '#notes-jc',
  'chemistry': '#notes-secondary',
  'physics': '#notes-secondary',
  'psle-math': '#notes-primary',
  'o-level-english': '#notes-secondary',
  'h2-maths': '#notes-jc',
  'o-level': '#notes-secondary',
  'n-level': '#notes-secondary',
  'psle-science': '#notes-primary',
};

/**
 * Renders a registry-sourced list of links as prose:
 * "the A-Level General Paper guide and the complete A-Level preparation guide".
 * The article sits outside the anchor so the link text stays exactly what the
 * registry says the page is called.
 */
function RegistryLinks({ slugs }) {
  return slugs.map((slug, index) => {
    const page = getPage(slug);
    return (
      <span key={slug}>
        {index === 0 ? ' ' : index === slugs.length - 1 ? ' and ' : ', '}
        the{' '}
        <Link href={page.url} className="font-semibold text-[#0474BA] underline underline-offset-2">
          {page.anchor}
        </Link>
      </span>
    );
  });
}

const whatsappMessage = `Hi LionCity Tutors! I've been using your free notes and I'd like help finding a tutor.

Student level (e.g. Sec 4 / JC1 / JC2):
Subject:
Location:
Preferred days & timing: `;
const whatsappHref = `https://wa.me/6588701152?text=${encodeURIComponent(whatsappMessage)}`;

export default function FreeNotesPage() {
  return (
    <>
      <GuideSchema
        slug={SLUG}
        collection={{
          name: 'Free Study Notes: PSLE, O-Level and A-Level',
          description:
            'Free revision notes to download for PSLE, O-Level and A-Level students. The library holds Chemistry notes for H2, H1, O-Level and IGCSE, H2 Physics for both the 9478 and 9749 syllabuses, H2 Maths, O-Level Physics and English, PSLE Maths and Science, N(T)-Level Science, O-Level A-Math and E-Math, and A-Level General Paper infopacks.',
          items: NOTE_SECTIONS.map((section) => ({
            name: section.label,
            url: `/free-notes#${section.id}`,
          })),
        }}
        faqs={FREE_NOTES_FAQS}
      />

      <div className="bg-gray-50 min-h-screen">
        <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-16">
          <section className="text-center py-8 space-y-6">
            <h1 className="page-title text-primary">
              Free Study Notes
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed text-pretty">
              Revision notes to download, free and without an account, across PSLE, O-Level
              and A-Level &mdash; Chemistry for H2, H1, O-Level and IGCSE, H2 Physics for
              both the current and legacy syllabuses, H2 Maths, O-Level Physics and English,
              PSLE Maths and Science, N(T)-Level Science, both O-Level maths papers and
              A-Level General Paper infopacks.
            </p>
            <nav aria-label="Jump to a subject" className="flex flex-wrap items-center justify-center gap-2">
              {NOTE_SECTIONS.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="rounded-full border border-[#0474BA]/25 bg-white px-4 py-2 text-center text-sm font-semibold text-[#0474BA] shadow-sm transition-colors hover:border-[#0474BA] hover:bg-[#0474BA]/5"
                >
                  {section.label}
                </a>
              ))}
            </nav>
          </section>

          {/* Subject answer blocks: what the library holds, and what it doesn't. */}
          <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {NOTE_SECTIONS.map((section) => (
              <section
                key={section.id}
                id={section.id}
                className="scroll-mt-24 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <h2 className="text-xl font-bold text-gray-900 text-balance">{section.heading}</h2>
                <p className="mt-3 text-gray-700 leading-relaxed text-pretty">{section.answer}</p>
                <p className="mt-3 text-gray-700 leading-relaxed text-pretty">
                  {section.linkLead}<RegistryLinks slugs={section.links} />.
                </p>
                <a
                  href={LIBRARY_ANCHOR[section.id]}
                  className="group mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#F17720]"
                >
                  <FileText className="h-4 w-4" strokeWidth={ICON_STROKE} aria-hidden="true" />
                  Go to the notes
                  <ArrowRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                    strokeWidth={ICON_STROKE}
                    aria-hidden="true"
                  />
                </a>
              </section>
            ))}
          </div>

          <NoteLibrary />

          {/* Collections hosted elsewhere: described here, downloaded there. */}
          <section aria-labelledby="elsewhere" className="mx-auto max-w-5xl">
            <SectionHeading id="elsewhere" icon={ExternalLink}>
              Where else to find free notes
            </SectionHeading>
            <p className="mb-6 text-gray-700 leading-relaxed text-pretty">
              Our own library is still small, so here is where we send students for the subjects it
              does not cover yet. Every collection below is hosted and maintained by someone else,
              not by us. We have been through each one and summarised what is actually inside,
              including where the coverage is patchy. Links open in a new tab.
            </p>
            <div className="grid gap-6 sm:grid-cols-2">
              {EXTERNAL_NOTES.map((resource) => (
                <article
                  key={resource.id}
                  id={resource.id}
                  className="flex flex-col scroll-mt-24 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
                >
                  <h3 className="text-lg font-bold text-gray-900 text-balance">{resource.subject}</h3>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-[#0474BA]">
                    {resource.tag}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    {resource.host} &middot; {resource.fileCount}
                  </p>
                  <p className="mt-3 flex-1 text-gray-700 leading-relaxed text-pretty">{resource.summary}</p>
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="group mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#F17720]"
                  >
                    <ExternalLink className="h-4 w-4" strokeWidth={ICON_STROKE} aria-hidden="true" />
                    Open the {resource.subject} folder
                    <ArrowRight
                      className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                      strokeWidth={ICON_STROKE}
                      aria-hidden="true"
                    />
                  </a>
                </article>
              ))}
            </div>
          </section>

          <section aria-labelledby="faq" className="mx-auto max-w-3xl">
            <SectionHeading id="faq" icon={HelpCircle}>
              Free study notes: common questions
            </SectionHeading>
            <div className="space-y-6">
              {FREE_NOTES_FAQS.map((faq) => (
                <div key={faq.question}>
                  <h3 className="text-lg font-semibold text-gray-900">{faq.question}</h3>
                  <p className="mt-2 text-gray-700 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="mx-auto max-w-3xl">
            <GuideCTA
              title="Notes are a starting point, not a plan"
              description={`Tell us the subject and where the marks are going missing. We hand-match a vetted tutor — usually within ${MATCH_TIME} — and parents never pay an agency fee.`}
              buttonText="Find a tutor for this subject"
              whatsappHref={whatsappHref}
            />
          </div>

          {/* Small print: notice on third-party material plus a takedown address. */}
          <section aria-labelledby="notes-disclaimer" className="mx-auto max-w-3xl border-t border-gray-200 pt-8 pb-4">
            <h2 id="notes-disclaimer" className="text-sm font-semibold text-gray-900">
              About these materials
            </h2>
            <dl className="mt-4 space-y-3">
              {NOTES_DISCLAIMER.map((item) => (
                <div key={item.title}>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    {item.title}
                  </dt>
                  <dd className="mt-1 text-sm leading-relaxed text-gray-600 text-pretty">{item.body}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>
      </div>
    </>
  );
}
