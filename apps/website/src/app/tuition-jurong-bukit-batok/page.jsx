import Link from 'next/link';
import { HelpCircle } from 'lucide-react';
import GuideSchema from '@/components/seo/GuideSchema';
import { RelatedGuides, SectionHeading } from '@/components/guide';
import { RegionHero, AreaCoverage, DemandSnapshot, SchoolList, TransportNote } from '@/components/region';
import { MATCH_TIME } from '@/data/promises';
import { regionFor, TOTAL_TUTORS, ONLINE_TUTORS } from '@/data/regions.mjs';
import { rangeFor } from '../tuition-rates/rates.mjs';

const SLUG = 'tuition-jurong-bukit-batok';
const region = regionFor(SLUG);
const { min: primaryMin, max: primaryMax } = rangeFor('primary');
const hasSchools = region.schools.primary.length > 0 || region.schools.secondary.length > 0;

const ANSWER_BLOCKS = [
  {
    id: 'tutor-supply',
    label: 'Tutor supply',
    question: `How many tutors cover ${region.name}?`,
    answer:
      `${region.tutorCount} of our ${TOTAL_TUTORS} tutors cover the west corridor — Jurong East, Jurong West, Bukit Batok, Choa Chu Kang, Tengah and Clementi. It's our largest tutor pool of the three corridors we've built pages for, even though assignment volume here is currently the lowest of the three.`,
  },
  {
    id: 'demand-snapshot',
    label: 'What parents ask for',
    question: `What tuition do parents in ${region.name} ask for?`,
    answer:
      `Parents in the west most often ask for primary-level tuition — 19 of our 43 assignments here — but this is the only corridor where JC bookings are common, with H2 Physics among the top subjects requested. Primary tuition runs $${primaryMin} to $${primaryMax} an hour; see the full rate card for JC pricing.`,
    table: <DemandSnapshot region={region} />,
  },
  {
    id: 'how-fast-jurong',
    label: 'How fast in Jurong',
    question: 'How quickly can you find a tutor in Jurong?',
    answer:
      `Jurong sits in our largest tutor pool of the three corridors — 163 across the wider west — though assignment volume here is currently our lowest, so a request can occasionally take a little longer to match than the raw tutor count would suggest. Most are still matched within ${MATCH_TIME}.`,
  },
  {
    id: 'rates-jurong',
    label: 'Rates in Jurong',
    question: 'How much does tuition cost in Jurong?',
    answer:
      `Tuition in Jurong is priced the same as everywhere else we cover — by level and tutor experience, not by area. Primary tuition runs $${primaryMin} to $${primaryMax} an hour on our full rate card, and this is the one corridor where JC and H2 Physics tuition are a regular request rather than an exception.`,
    link: true,
  },
  {
    id: 'home-or-online-jurong',
    label: 'Home or online',
    question: 'Home tuition or online in Jurong?',
    answer:
      `Jurong East and Jurong West sit on the East-West Line, but Bukit Batok and Choa Chu Kang connect via a separate line, which is why travel time varies more across this corridor than the other two. Online lessons even that out — ${ONLINE_TUTORS} of our ${TOTAL_TUTORS} tutors offer them, useful if the closest match isn't nearby.`,
  },
];

const FAQS = [
  {
    question: 'Is JC tuition available in the west?',
    answer:
      "Yes — this is the one corridor where it's common. 8 of 43 assignments here have been JC level, with H2 Physics among the most requested subjects, well above what we see in our other corridors.",
  },
  {
    question: 'How do I request a tutor in Jurong or Bukit Batok?',
    answer:
      "Use our request-tutor form and mention your area — we'll match a tutor already covering the west corridor and get back to you, usually within our normal turnaround.",
  },
];

const ALL_FAQS = [...ANSWER_BLOCKS.map(({ question, answer }) => ({ question, answer })), ...FAQS];

export default function JurongBukitBatokPage() {
  return (
    <>
      <GuideSchema
        slug={SLUG}
        service={{
          name: `Tuition matching in ${region.name}`,
          description: `Hand-matched tutors covering ${region.headline}, matched within ${MATCH_TIME}. No agency fee for parents.`,
          areaServed: region.areas,
        }}
        faqs={ALL_FAQS}
      />

      <div className="bg-background-default text-text-default">
        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
          <RegionHero region={region} />
          <AreaCoverage region={region} />

          <nav aria-label="Jump to a question" className="flex flex-wrap justify-center gap-2 mb-16">
            {ANSWER_BLOCKS.map((section) => (
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
            {ANSWER_BLOCKS.map((section) => (
              <section
                key={section.id}
                id={section.id}
                className="scroll-mt-24 rounded-2xl border border-border bg-background-card p-6 sm:p-8 shadow-sm"
              >
                <h2 className="section-title text-primary">{section.question}</h2>
                <p className="mt-3 text-text-default/85 leading-relaxed text-pretty">{section.answer}</p>
                {section.table ?? null}
                {section.link ? (
                  <Link
                    href="/tuition-rates"
                    className="mt-3 inline-block text-sm font-semibold text-primary underline underline-offset-2"
                  >
                    See the full tuition rates
                  </Link>
                ) : null}
              </section>
            ))}

            {hasSchools ? (
              <section
                id="schools"
                className="scroll-mt-24 rounded-2xl border border-border bg-background-card p-6 sm:p-8 shadow-sm"
              >
                <h2 className="section-title text-primary">
                  Which schools do we cover in {region.name}?
                </h2>
                <SchoolList schools={region.schools} />
              </section>
            ) : null}

            <section
              id="getting-to-you"
              className="scroll-mt-24 rounded-2xl border border-border bg-background-card p-6 sm:p-8 shadow-sm"
            >
              <h2 className="section-title text-primary">Getting to you</h2>
              <TransportNote transport={region.transport} />
            </section>
          </div>

          <section aria-labelledby="faq" className="mt-16 max-w-3xl mx-auto">
            <SectionHeading id="faq" icon={HelpCircle}>
              Answering your questions
            </SectionHeading>
            <div className="space-y-6">
              {FAQS.map((faq) => (
                <div key={faq.question}>
                  <h3 className="text-lg font-semibold text-text-default">{faq.question}</h3>
                  <p className="mt-2 text-text-default/80 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="mt-16 max-w-3xl mx-auto">
            <p className="text-text-default/80">
              Ready to get matched? Tell us the level and subject and we hand-match a vetted tutor
              covering {region.name}, usually within {MATCH_TIME}, at no cost to you.{' '}
              <Link href="/request-tutor" className="font-semibold text-primary underline underline-offset-2">
                Request a tutor
              </Link>
              .
            </p>
            <RelatedGuides slug={SLUG} heading="Before you book" />
          </div>
        </main>
      </div>
    </>
  );
}
