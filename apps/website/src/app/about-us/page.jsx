import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MATCH_TIME, TUTOR_COUNT, TUTOR_COUNT_NUM, MEASURED_AS_OF } from '@/data/promises';

export const metadata = {
  title: 'About LionCity Tutors — How the Matching Works',
  description: `LionCity Tutors is a Singapore tuition agency that hand-matches parents with vetted tutors, usually within ${MATCH_TIME}. How it started, how tutors are vetted, and what parents pay — nothing.`,
  alternates: { canonical: 'https://www.lioncitytutors.com/about-us' },
  openGraph: {
    type: 'website',
    url: 'https://www.lioncitytutors.com/about-us',
    title: 'About LionCity Tutors — How the Matching Works',
    description: `A Singapore tuition agency built around one promise: a hand-matched, vetted tutor within ${MATCH_TIME}, with no agency fee for parents.`,
    images: [{ url: 'https://www.lioncitytutors.com/final.png', alt: 'LionCity Tutors' }],
  },
  robots: 'index, follow',
};

// Measured, not promised — these mirror the medians documented in data/promises.js.
// If those are recomputed, update both together.
const EDGE = [
  {
    stat: '<1 min',
    label: 'to first tutor contact',
    body: 'A request does not sit in an inbox. Tutors filtered by level, subject and location are messaged directly, usually inside a minute of the form landing.',
  },
  {
    stat: '17 min',
    label: 'median to the first yes',
    body: 'Replies typically start arriving while a parent is still reading the page they submitted from.',
  },
  {
    stat: '~2 hrs',
    label: 'median to a shortlist',
    body: `Two to three profiles reach the parent on WhatsApp, ranked by fit. The promise is ${MATCH_TIME}; the median is about two.`,
  },
  {
    stat: '$0',
    label: 'paid to the agency, ever',
    body: 'Parents pay the tutor directly at the agreed rate. There is no commission, no placement fee and no markup on the hourly rate.',
  },
];

const VETTING = [
  'Every tutor submits their academic transcripts, and they are checked — not just collected.',
  'Teaching experience is verified against the level and syllabus a tutor asks to teach, not accepted at face value.',
  'Tutors are matched on temperament as well as subject: a student who has lost confidence and a student chasing a distinction need different people.',
  'A match that is not working is replaced. Most families stay with their first tutor; the ones who do not get a rematch rather than an argument.',
];

export default function AboutUs() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'AboutPage',
            name: 'About LionCity Tutors',
            url: 'https://www.lioncitytutors.com/about-us',
            mainEntity: {
              '@type': 'EducationalOrganization',
              name: 'LionCity Tutors',
              url: 'https://www.lioncitytutors.com/',
              areaServed: 'Singapore',
              description: `Singapore tuition agency hand-matching parents with vetted tutors for PSLE, O-Level, N-Level, A-Level and IB subjects, usually within ${MATCH_TIME}. Free for parents.`,
            },
          }),
        }}
      />

      <div className="p-6 max-w-5xl mx-auto space-y-16">

        {/* Hero — the eyebrow appears once on this page, per the Label rule. */}
        <section className="text-center space-y-4">
          <p className="text-sm font-semibold tracking-[0.22em] uppercase text-primary">
            About LionCity Tutors
          </p>
          <h1 className="page-title text-primary">
            It started because finding a good tutor took too long.
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            LionCity Tutors was built around a single frustration: in a city with no shortage of
            capable tutors, matching a parent to the right one still took days of phone tag — and
            usually cost them a fee for the privilege. It exists to remove both.
          </p>
        </section>

        {/* Origin — company voice throughout, no founder byline by design. */}
        <section className="space-y-4">
          <h2 className="section-title text-primary">Why it exists</h2>
          <p className="text-gray-700 max-w-3xl">
            Singapore does not have a tutor shortage. It has a matching problem. Parents describe
            the same experience: a list of agencies, a form on each one, and then silence — followed
            days later by a profile that does not fit the child, the schedule, or the budget. By the
            time a tutor is in the room, a term has moved on without the student.
          </p>
          <p className="text-gray-700 max-w-3xl">
            The delay is rarely about effort. It is about how the work is organised. Most agencies
            treat a request as a lead to be worked through a queue. Treated instead as a matching
            problem — the right tutors identified and contacted immediately, in parallel — the same
            job takes hours rather than weeks.
          </p>
          <p className="text-gray-700 max-w-3xl">
            That is the whole premise. A roster of {TUTOR_COUNT} vetted tutors is only useful if the
            right one reaches the right family quickly, so speed and fit are the two things measured,
            and the only two things promised.
          </p>
        </section>

        {/* The requested section, carried by measured numbers rather than adjectives. */}
        <section className="space-y-6">
          <div className="space-y-3">
            <h2 className="section-title text-primary">The LionCity Tutors edge</h2>
            <p className="text-gray-700 max-w-3xl">
              Four things separate this from the agency queue. Each is a number rather than a claim,
              measured from real placements as of {MEASURED_AS_OF}.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {EDGE.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-gray-200 bg-white p-6 space-y-2 shadow-sm"
              >
                <div className="text-3xl font-bold text-primary tabular-nums leading-none">
                  {item.stat}
                </div>
                <div className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                  {item.label}
                </div>
                <p className="text-gray-700 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500 max-w-3xl">
            Medians, not averages, and drawn from a small sample — a single slow match should not be
            able to flatter the number, and a single fast one should not be able to carry it.
          </p>
        </section>

        {/* Mechanism over adjective — the voice rule's "specifics persuade" in practice. */}
        <section className="space-y-4">
          <h2 className="section-title text-primary">How a tutor is vetted</h2>
          <p className="text-gray-700 max-w-3xl">
            &ldquo;Vetted&rdquo; is the most overused word in Singapore tuition, so here is what it
            means here, specifically.
          </p>
          <ul className="space-y-3 max-w-3xl">
            {VETTING.map((line) => (
              <li key={line} className="flex gap-3 text-gray-700">
                <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Under-claiming as a trust device — straight out of DESIGN.md §2. */}
        <section className="space-y-4">
          <h2 className="section-title text-primary">What it does not do</h2>
          <p className="text-gray-700 max-w-3xl">
            A tuition agency is easier to trust when it says where it stops.
          </p>
          <ul className="space-y-3 max-w-3xl">
            <li className="flex gap-3 text-gray-700">
              <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-300" />
              <span>
                It does not run centres or classes. Every match is one tutor and one student, at home
                or online.
              </span>
            </li>
            <li className="flex gap-3 text-gray-700">
              <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-300" />
              <span>
                It does not guarantee grades. No agency can, and the ones that do are describing
                marketing rather than teaching.
              </span>
            </li>
            <li className="flex gap-3 text-gray-700">
              <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-300" />
              <span>
                It does not take a cut of the lesson rate. What a parent agrees with a tutor is what
                the tutor is paid.
              </span>
            </li>
            <li className="flex gap-3 text-gray-700">
              <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-300" />
              <span>
                It does not claim its tutors are MOE-certified. MOE certifies teachers, not agencies —
                where a tutor is a current or former MOE teacher, the profile says so and it can be
                checked.
              </span>
            </li>
          </ul>
        </section>

        {/* Proof, linked out so it is verifiable rather than asserted. */}
        <section className="rounded-2xl bg-gray-50 border border-gray-200 p-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            <div className="space-y-1">
              <div className="text-3xl font-bold text-primary tabular-nums">4.8/5</div>
              <a
                href="https://search.google.com/local/reviews?placeid=ChIJz5sczNYR2jERc_4Ka3tDwyY"
                target="_blank"
                rel="noreferrer"
                className="text-sm font-medium text-primary underline underline-offset-4 hover:no-underline"
              >
                Google rating — read the reviews
              </a>
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-bold text-primary tabular-nums">{TUTOR_COUNT}</div>
              <div className="text-sm text-gray-600">vetted tutors on the roster</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-bold text-primary tabular-nums">{MATCH_TIME}</div>
              <div className="text-sm text-gray-600">the match-time promise</div>
            </div>
          </div>
        </section>

        {/* One CTA, one orange — the Rationed Orange Rule. */}
        <section className="text-center space-y-5">
          <h2 className="section-title text-primary">Start with a request, not a phone call</h2>
          <p className="text-gray-700 max-w-2xl mx-auto">
            The form takes about three minutes. Tutors are contacted straight away, and a shortlist
            usually reaches you the same afternoon.
          </p>
          <div className="flex justify-center">
            <Link href="/request-tutor">
              <Button
                size="cta"
                className="text-[18.7px] font-bold bg-accent-fill hover:bg-accent-fill-hover text-white rounded-full shadow-md hover:shadow-lg transition-all duration-200 px-8 py-5"
              >
                Request tutors
              </Button>
            </Link>
          </div>
        </section>

      </div>
    </main>
  );
}
