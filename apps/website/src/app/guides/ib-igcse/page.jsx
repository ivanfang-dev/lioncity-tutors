import GuideSchema from '@/components/seo/GuideSchema';
import { RelatedGuides } from '@/components/guide';
import { IB_IGCSE_FAQS } from './faqs.mjs';
import { DEFAULT_OG_IMAGE } from '@/lib/seo/openGraph';

export const metadata = {
  title: 'IB & IGCSE Guides Singapore: HL, SL and Paper Strategy',
  description:
    'How the IB Diploma and IGCSE differ from the Singapore track — HL versus SL choices, internal assessment, and subject guides for Biology, Chemistry and Physics.',
  keywords: [
    'IB Diploma Singapore', 'IGCSE Singapore', 'IBDP Biology', 'IBDP Chemistry',
    'IBDP Physics', 'IGCSE Biology', 'IGCSE Chemistry', 'IGCSE Physics',
    'HL vs SL', 'IB vs A Level', 'IGCSE vs O Level', 'internal assessment',
  ],
  openGraph: {
    images: [DEFAULT_OG_IMAGE],
    title: 'IB & IGCSE Guides Singapore: HL, SL and Paper Strategy',
    description:
      'How the IB Diploma and IGCSE differ from the Singapore national track, with subject guides for Biology, Chemistry and Physics.',
    url: 'https://www.lioncitytutors.com/guides/ib-igcse',
    type: 'article',
  },
  alternates: { canonical: 'https://www.lioncitytutors.com/guides/ib-igcse' },
};

export default function IbIgcseHub() {
  return (
    <>
      <GuideSchema
        slug="ib-igcse"
        article={{
          headline: 'IB & IGCSE Guides Singapore: HL, SL and Paper Strategy',
          description:
            'How the IB Diploma and IGCSE differ from the Singapore national track, with subject guides for Biology, Chemistry and Physics at both levels.',
          datePublished: '2026-07-29',
          dateModified: '2026-07-29',
        }}
        faqs={IB_IGCSE_FAQS}
      />

      <main className="mx-auto max-w-3xl px-6 py-16">
        <header className="mb-10 border-b border-gray-100 pb-8">
          <h1 className="page-title text-primary mb-4">
            IB &amp; IGCSE Guides for Singapore Students
          </h1>
          <p className="text-sm text-gray-500">
            By the LionCity Tutors Science Team · Updated July 29, 2026
          </p>
        </header>

        <section id="how-they-differ" className="mb-12">
          <h2 className="section-title text-primary mb-4">
            How do IB and IGCSE differ from the Singapore national track?
          </h2>
          <p className="mb-4 text-lg leading-relaxed text-gray-800">
            IB and IGCSE are international qualifications run by the IB Organization
            and Cambridge International, not by SEAB. They assess more coursework and
            practical work than the O-Level and A-Level, spread marks across internal
            assessment, and follow their own calendars rather than Singapore&apos;s
            national examination timetable.
          </p>
          <p className="leading-relaxed text-gray-700">
            That difference matters most in how you prepare. A student moving from a
            local school into an IB or IGCSE programme is usually strong on content and
            underprepared for the investigation, write-up and reflection components,
            which carry real marks and cannot be revised for the night before. The
            subject guides below are organised around that gap.
          </p>
        </section>

        <section id="faq" className="mb-4">
          <h2 className="section-title text-primary mb-6">
            IB and IGCSE questions, answered
          </h2>
          <div className="space-y-8">
            {IB_IGCSE_FAQS.map((faq) => (
              <div key={faq.question}>
                <h3 className="mb-2 text-xl font-semibold text-gray-900">{faq.question}</h3>
                <p className="leading-relaxed text-gray-800">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <RelatedGuides
          slug="ib-igcse"
          heading="IB and IGCSE subject guides"
          showHub={false}
        />
      </main>
    </>
  );
}
