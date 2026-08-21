import Link from 'next/link';
import { HelpCircle } from 'lucide-react';
import GuideSchema from '@/components/seo/GuideSchema';
import { RelatedGuides, SectionHeading } from '@/components/guide';
import { RegionHero, AreaCoverage, DemandSnapshot, SchoolList, TransportNote } from '@/components/region';
import { MATCH_TIME } from '@/data/promises';
import { regionFor, TOTAL_TUTORS, ONLINE_TUTORS } from '@/data/regions.mjs';
import { rangeFor } from '../tuition-rates/rates.mjs';

const SLUG = 'tuition-punggol-sengkang';
const region = regionFor(SLUG);
const { min: primaryMin, max: primaryMax } = rangeFor('primary');
const hasSchools = region.schools.primary.length > 0 || region.schools.secondary.length > 0;

const ANSWER_BLOCKS = [
  {
    id: 'tutor-supply',
    label: 'Tutor supply',
    question: `How many tutors cover ${region.name}?`,
    answer:
      `${region.tutorCount} of our ${TOTAL_TUTORS} tutors cover the northeast corridor — Punggol, Sengkang, Hougang, Serangoon, Kovan and Ang Mo Kio. That's just over a third of our roster, concentrated in the area with the highest assignment volume of any corridor we serve, which is why matches here tend to move quickly.`,
  },
  {
    id: 'demand-snapshot',
    label: 'What parents ask for',
    question: `What tuition do parents in ${region.name} ask for?`,
    answer:
      `Parents in the northeast most often ask for primary-level tuition — 51 of our 76 assignments here — with Mathematics, English and Chinese the most requested subjects. Primary tuition runs $${primaryMin} to $${primaryMax} an hour depending on tutor type; see the full rate card for secondary and JC.`,
    table: <DemandSnapshot region={region} />,
  },
  {
    id: 'how-fast-punggol',
    label: 'How fast in Punggol',
    question: 'How quickly can you find a tutor in Punggol?',
    answer:
      `Punggol sits inside our best-covered corridor — 159 tutors serve the wider northeast — so most requests here are matched within ${MATCH_TIME}. A niche subject or an unusual schedule can push that out, but Punggol itself is rarely the bottleneck.`,
  },
  {
    id: 'rates-punggol',
    label: 'Rates in Punggol',
    question: 'How much does tuition cost in Punggol?',
    answer:
      `Tuition in Punggol is priced the same as everywhere else we cover — by level and tutor experience, not by area. Primary tuition, the most common request here, runs $${primaryMin} to $${primaryMax} an hour; secondary and JC sit higher on our full rate card.`,
    link: true,
  },
  {
    id: 'home-or-online-punggol',
    label: 'Home or online',
    question: 'Home tuition or online in Punggol?',
    answer:
      `With 159 tutors covering the well-served northeast, home visits are easy to arrange across Punggol, Sengkang and the surrounding estates. Online remains worth considering if you want a specific tutor type or subject that's harder to find locally — ${ONLINE_TUTORS} of our ${TOTAL_TUTORS} tutors offer it as an option.`,
  },
];

const FAQS = [
  {
    question: 'Is JC tuition available in the northeast?',
    answer:
      "Yes, though it's a small share of our northeast bookings — 5 of 76 assignments here have been JC level, well below the primary and secondary demand. We still cover H1 and H2 subjects if you need one.",
  },
  {
    question: 'How do I request a tutor in Punggol or Sengkang?',
    answer:
      "Use our request-tutor form and mention your area — we'll match a tutor already covering the northeast corridor and get back to you, usually within our normal turnaround.",
  },
];

const ALL_FAQS = [...ANSWER_BLOCKS.map(({ question, answer }) => ({ question, answer })), ...FAQS];

export default function PunggolSengkangPage() {
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

          <nav aria-label="Jump to a question" className="flex flex-wrap items-center justify-center gap-2 mb-16">
            {ANSWER_BLOCKS.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="rounded-full border border-border bg-background-card px-4 py-2 text-center text-sm font-semibold text-primary shadow-sm transition-colors hover:border-primary"
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
