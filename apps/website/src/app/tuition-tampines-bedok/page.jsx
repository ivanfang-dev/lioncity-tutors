import Link from 'next/link';
import { HelpCircle } from 'lucide-react';
import GuideSchema from '@/components/seo/GuideSchema';
import { RelatedGuides, SectionHeading } from '@/components/guide';
import { RegionHero, AreaCoverage, DemandSnapshot, SchoolList, TransportNote } from '@/components/region';
import { MATCH_TIME } from '@/data/promises';
import { regionFor, TOTAL_TUTORS, ONLINE_TUTORS } from '@/data/regions.mjs';
import { rangeFor } from '../tuition-rates/rates.mjs';

const SLUG = 'tuition-tampines-bedok';
const region = regionFor(SLUG);
const { min: primaryMin, max: primaryMax } = rangeFor('primary');
const hasSchools = region.schools.primary.length > 0 || region.schools.secondary.length > 0;

const ANSWER_BLOCKS = [
  {
    id: 'tutor-supply',
    label: 'Tutor supply',
    question: `How many tutors cover ${region.name}?`,
    answer:
      `${region.tutorCount} of our ${TOTAL_TUTORS} tutors cover the east corridor — Tampines, Bedok, Pasir Ris, Simei, Marine Parade and Eunos. It's the smallest tutor pool of the three corridors we've built pages for, though still enough that most requests here are matched within our usual turnaround.`,
  },
  {
    id: 'demand-snapshot',
    label: 'What parents ask for',
    question: `What tuition do parents in ${region.name} ask for?`,
    answer:
      `Parents in the east most often ask for primary-level tuition — 34 of our 49 assignments here — with Mathematics and requests spanning multiple subjects the most common pattern. Primary tuition runs $${primaryMin} to $${primaryMax} an hour depending on tutor type; see the full rate card for secondary and JC pricing.`,
    table: <DemandSnapshot region={region} />,
  },
  {
    id: 'how-fast-tampines',
    label: 'How fast in Tampines',
    question: 'How quickly can you find a tutor in Tampines?',
    answer:
      `Tampines sits in our smallest tutor pool of the three corridors — 141 across the wider east — but demand here still moves fast, and most requests are matched within ${MATCH_TIME}. A less common subject combination may take a little longer to fill.`,
  },
  {
    id: 'rates-tampines',
    label: 'Rates in Tampines',
    question: 'How much does tuition cost in Tampines?',
    answer:
      `Tuition in Tampines is priced the same as everywhere else we cover — by level and tutor experience, not by area. Primary tuition, the most common request here, runs $${primaryMin} to $${primaryMax} an hour; secondary sits higher on our full rate card, and JC bookings are rare in this corridor.`,
    link: true,
  },
  {
    id: 'home-or-online-tampines',
    label: 'Home or online',
    question: 'Home tuition or online in Tampines?',
    answer:
      `Tampines, Bedok and Pasir Ris sit directly on the East-West Line, so home visits are straightforward once you find the right tutor. Because this is our smallest tutor pool of the three corridors, online lessons are worth considering if you want more choice — ${ONLINE_TUTORS} of our ${TOTAL_TUTORS} tutors offer it as an option.`,
  },
];

const FAQS = [
  {
    question: 'Is JC tuition available in the east?',
    answer:
      'It\'s rare — just 1 of 49 assignments in this corridor has been JC level, so most of our east tutors are primary and secondary specialists. We can still find a JC match if you need one; it just may take a little longer.',
  },
  {
    question: 'How do I request a tutor in Tampines or Bedok?',
    answer:
      "Use our request-tutor form and mention your area — we'll match a tutor already covering the east corridor and get back to you, usually within our normal turnaround.",
  },
];

const ALL_FAQS = [...ANSWER_BLOCKS.map(({ question, answer }) => ({ question, answer })), ...FAQS];

export default function TampinesBedokPage() {
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
                <h2 className="text-2xl font-bold text-primary text-balance">{section.question}</h2>
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
                <h2 className="text-2xl font-bold text-primary text-balance">
                  Which schools do we cover in {region.name}?
                </h2>
                <SchoolList schools={region.schools} />
              </section>
            ) : null}

            <section
              id="getting-to-you"
              className="scroll-mt-24 rounded-2xl border border-border bg-background-card p-6 sm:p-8 shadow-sm"
            >
              <h2 className="text-2xl font-bold text-primary text-balance">Getting to you</h2>
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
