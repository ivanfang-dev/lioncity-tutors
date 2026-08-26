import Link from 'next/link';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import GuideSchema from "@/components/seo/GuideSchema";
import SecondaryTutorRequestForm from './SecondaryTutorRequestForm';
import { MATCH_TIME } from '@/data/promises';
import { RATE_CARD, RATES_REVIEWED } from '../tuition-rates/rates.mjs';
import {
  PLACEMENT_SAMPLE, PLACEMENTS_REVIEWED, observedFor, observedSpan, sampleLabel,
} from '../tuition-rates/placements.mjs';

const secondaryRates = RATE_CARD.find((band) => band.id === 'secondary');
const secondaryObserved = observedFor('secondary');

// Singapore's secondary system is mid-transition: Full Subject-Based Banding
// replaced the Express / N(A) / N(T) streams with Posting Groups and per-subject
// G1/G2/G3 levels, so a parent of a Sec 1 student and a parent of a Sec 4
// student are living in two different systems right now. Both are described
// because both are in-market — most competitor pages describe only the old one.
const postingGroups = [
  {
    group: 'Posting Group 3',
    formerly: 'formerly Express',
    detail: 'Most subjects taken at G3. The usual route towards Junior College or Polytechnic.',
  },
  {
    group: 'Posting Group 2',
    formerly: 'formerly Normal (Academic)',
    detail: 'Most subjects at G2, with stronger subjects often taken at G3. Polytechnic is the common destination.',
  },
  {
    group: 'Posting Group 1',
    formerly: 'formerly Normal (Technical)',
    detail: 'Most subjects at G1, with room to move up per subject. Typically leads towards ITE.',
  },
];

const subjectDecisions = [
  {
    decision: 'Pure Sciences or Combined Science',
    detail: 'Two pure sciences suit students aiming at science-heavy JC or Polytechnic courses. Combined Science covers two disciplines in one subject and frees a slot for something else. The decision is usually made on Sec 2 results plus how much science the intended post-secondary route actually needs.',
    href: '/combined-science-overview',
    linkText: 'Combined Science explained',
  },
  {
    decision: 'Whether to take Additional Mathematics',
    detail: 'A-Math is close to mandatory for several JC and engineering-adjacent Polytechnic routes, and it is the subject that most often decides whether a student can keep those doors open. It also assumes strong Sec 2 algebra — which is where our tutors see A-Math grades actually decided.',
    href: '/o-level-math',
    linkText: 'O-Level Maths guide',
  },
  {
    decision: 'Which humanities elective',
    detail: 'History, Geography and Literature reward different skills: source analysis, data interpretation and textual analysis respectively. Picking the one a student is already stronger at usually beats picking the one that sounds easier.',
    href: '/how-to-study/o-level-history',
    linkText: 'How to study for O-Level History',
  },
];

const faqs = [
  {
    q: 'How much does secondary school tuition cost in Singapore?',
    a: `Our published range for secondary is $${secondaryRates.rates[0].min}–$${secondaryRates.rates[2].max} an hour depending on tutor type. Separately, across ${PLACEMENT_SAMPLE} of our own assignments, most parents of secondary students budgeted ${observedSpan('secondary')}. Both figures are broken down below.`,
  },
  {
    q: 'Can I change tutors if it is not working out?',
    a: 'Yes. Tell us what is not working — pace, teaching style, timing — and we will match a replacement. There is no fee to switch, because parents never pay us an agency fee in the first place.',
  },
  {
    q: 'Is there a trial lesson?',
    a: 'Yes. A first lesson lets both sides check the fit before committing to a regular slot. Most mismatches are obvious within one session, and it is far cheaper to find out then.',
  },
  {
    q: 'How quickly can you find a tutor?',
    a: `Usually within ${MATCH_TIME} of your request. Harder combinations — a specific stream, an unusual subject pairing, a tight timing window, or a location far from most tutors — can take longer.`,
  },
  {
    q: 'Do you cover both the O-Level and N-Level tracks?',
    a: 'Yes, and both the newer G1/G2/G3 subject levels. When you submit a request, tell us the exact level each subject is taken at — it changes which tutors are a genuine fit.',
  },
];

export default function SecondarySchoolTuition() {
  return (
    <main>
      <GuideSchema
        slug="secondary-school-tuition"
        course={{
          name: 'Secondary School Tuition in Singapore',
          description:
            'One-to-one secondary school tuition from Sec 1 to Sec 5, covering both the O-Level and N-Level tracks.',
          educationalLevel: 'GCE O-Level and N-Level',
        }}
      />
      <div className="p-6 max-w-5xl mx-auto space-y-16">
        {/* Hero */}
        <section className="text-center space-y-4">
          {/* The explicit space matters: <br> is a visual break but not a word
              separator, so without it the heading extracts as
              "…in SingaporeO-Level & N-Level…" for crawlers and screen readers. */}
          <h1 className="page-title text-primary">Secondary School Tuition in Singapore{' '}<br />O-Level &amp; N-Level Specialist Tutors</h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Hand-matched tutors for Sec 1 to Sec 5, across Posting Groups, G1&ndash;G3 subject levels and the O-Level and N-Level tracks. Tutors are matched in about {MATCH_TIME}, and parents never pay an agency fee.
          </p>
          <div className="my-8 relative w-full max-w-3xl mx-auto aspect-video overflow-hidden rounded-xl shadow-lg">
            <Image
              src="/secondary-tuition.webp"
              alt="Secondary school tuition in Singapore - Students learning with experienced tutors"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
              priority
            />
          </div>
        </section>

        {/* Streams / Posting Groups — the differentiated explainer */}
        <section className="space-y-4">
          <h2 className="section-title text-primary">Posting Groups, G-levels and the old streams</h2>
          <p className="text-gray-700">
            Singapore&apos;s secondary system is part-way through a change, so parents of a Sec 1 student and parents of a Sec 4 student are currently describing two different systems. Full Subject-Based Banding replaced the old Express, Normal (Academic) and Normal (Technical) streams with <strong>Posting Groups</strong> at entry and <strong>subject levels G1, G2 and G3</strong> thereafter.
          </p>
          <p className="text-gray-700">
            The practical difference is that a student is no longer in one stream for everything. Subjects are taken at the level that fits each one, so a student can sit Maths at G3 and another subject at G2 — and can move a subject up or down between levels as they progress.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            {postingGroups.map((pg) => (
              <Card key={pg.group} className="border-t-4 border-t-primary shadow-sm">
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg text-primary">{pg.group}</h3>
                  <p className="text-sm text-gray-500 mb-2 italic">{pg.formerly}</p>
                  <p className="text-sm text-gray-700">{pg.detail}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="text-gray-700 mt-4">
            For tuition this matters more than it first appears. A tutor who has only taught the top stream is often the wrong match for a student taking two subjects at G2, and the level a subject is actually taken at &mdash; not the student&apos;s overall group &mdash; is what determines the right fit. It is the first thing we ask about.
          </p>
        </section>

        {/* Sec 2 subject decisions */}
        <section className="space-y-4">
          <h2 className="section-title text-primary">The Sec 2 subject decisions that matter most</h2>
          <p className="text-gray-700">
            End of Sec 2 is where the consequential choices get made, and they narrow what is available at 16 more than most families expect at the time. Three decisions carry the most weight.
          </p>
          <div className="space-y-4 mt-6">
            {subjectDecisions.map((item) => (
              <Card key={item.decision} className="shadow-sm">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">{item.decision}</h3>
                  <p className="text-sm text-gray-700 mb-3">{item.detail}</p>
                  <Link href={item.href} className="text-sm text-primary underline underline-offset-2">
                    {item.linkText}
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Cost */}
        <section className="space-y-4">
          <h2 className="section-title text-primary">What secondary tuition costs</h2>
          <p className="text-gray-700">
            Two different numbers are worth knowing, and they answer different questions. The first is what we charge. The second is what other parents actually decided to spend.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-6">Our secondary rates</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <caption className="sr-only">LionCity Tutors secondary school hourly rates by tutor type</caption>
              <thead>
                <tr className="border-b border-gray-300 text-left">
                  <th scope="col" className="py-2 pr-4 font-semibold text-gray-900">Tutor type</th>
                  <th scope="col" className="py-2 pr-4 font-semibold text-gray-900 tabular-nums">Per hour</th>
                  <th scope="col" className="py-2 font-semibold text-gray-900">Typically</th>
                </tr>
              </thead>
              <tbody>
                {secondaryRates.rates.map((row) => (
                  <tr key={row.type} className="border-b border-gray-200">
                    <td className="py-2 pr-4 text-gray-900">{row.type}</td>
                    <td className="py-2 pr-4 text-gray-700 tabular-nums">${row.min}&ndash;${row.max}</td>
                    <td className="py-2 text-gray-700">{row.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-gray-500">
            LionCity Tutors&apos; own rates, reviewed {RATES_REVIEWED}. These are our figures, not an industry benchmark.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-8">What parents actually budget</h3>
          <p className="text-gray-700">
            Across our own assignment history, parents of secondary students most often budgeted{' '}
            <strong>{observedSpan('secondary')}</strong>. The tenth percentile sits at ${secondaryObserved.p10} and the ninetieth at ${secondaryObserved.p90}, so a request below ${secondaryObserved.p10} an hour is unusual — and in our experience takes noticeably longer to fill, because fewer tutors will take it.
          </p>
          <p className="text-sm text-gray-500">
            Based on {sampleLabel('secondary')} with a stated budget, from {PLACEMENT_SAMPLE} across all levels. Reviewed {PLACEMENTS_REVIEWED}. These are budgets parents asked for, not rates finally agreed.
          </p>
          <p className="text-gray-700">
            <Link href="/tuition-rates" className="text-primary underline underline-offset-2">
              Full 2026 tuition rates by level
            </Link>
          </p>
        </section>

        {/* Level routing */}
        <section className="space-y-4">
          <h2 className="section-title text-primary">Where students need the most help</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="shadow-sm">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg text-primary mb-2">Sec 1&ndash;2 · Foundation</h3>
                <p className="text-sm text-gray-700 mb-3">
                  The years where gaps form quietly. Algebra in particular compounds: weak Sec 2 algebra is the most common root cause of the A-Math difficulties our tutors meet two years later.
                </p>
                <p className="text-sm text-gray-700">
                  Worth fixing here rather than in Sec 4, when there is no slack in the timetable.
                </p>
              </CardContent>
            </Card>
            <Card className="shadow-sm">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg text-primary mb-2">Sec 3&ndash;5 · Exam track</h3>
                <p className="text-sm text-gray-700 mb-3">
                  Content finishes and technique starts deciding grades. Most of the marks our tutors recover at this stage are lost to how answers are written, not to gaps in what the student knows.
                </p>
                <p className="text-sm text-gray-700">
                  See the{' '}
                  <Link href="/blog/o-level-preparation-guide" className="text-primary underline underline-offset-2">
                    O-Level preparation guide
                  </Link>{' '}
                  for the full timeline and 21 exam-tested tips.
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="mt-4">
            <p className="text-gray-700 mb-2">Subject guides, each with the ten mistakes we correct most:</p>
            <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
              <li><Link href="/o-level-math" className="text-primary underline underline-offset-2">O-Level Maths</Link></li>
              <li><Link href="/o-level-physics" className="text-primary underline underline-offset-2">O-Level Physics</Link></li>
              <li><Link href="/o-level-chemistry" className="text-primary underline underline-offset-2">O-Level Chemistry</Link></li>
              <li><Link href="/o-level-biology" className="text-primary underline underline-offset-2">O-Level Biology</Link></li>
              <li><Link href="/o-level-english" className="text-primary underline underline-offset-2">O-Level English</Link></li>
              <li><Link href="/combined-science-overview" className="text-primary underline underline-offset-2">Combined Science</Link></li>
            </ul>
          </div>
        </section>

        {/* Track cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="border-t-4 border-t-primary shadow-lg">
            <CardContent className="p-8 flex flex-col h-full">
              <h3 className="font-bold text-2xl text-primary mb-4">O-Level Tuition</h3>
              <p className="text-gray-700 mb-4">Support across all O-Level subjects — English, Maths, the Sciences and Humanities — focused on exam technique and past-paper practice for JC or Polytechnic entry.</p>
              <ul className="list-disc pl-5 mb-6 text-gray-600">
                <li>Experienced O-Level specialist tutors</li>
                <li>G3 subject level and IP support</li>
                <li>Exam strategies &amp; past year paper practice</li>
                <li>Customised lesson plans</li>
              </ul>
              <Link href="/secondary-school-tuition/o-level-tuition" className="mt-auto">
                <Button className="h-auto py-3 w-full bg-primary hover:bg-primary/90 text-white">Learn More</Button>
              </Link>
            </CardContent>
          </Card>
          <Card className="border-t-4 border-t-[#F17720] shadow-lg">
            <CardContent className="p-8 flex flex-col h-full">
              <h3 className="font-bold text-2xl text-[#d9691c] mb-4">N-Level Tuition</h3>
              <p className="text-gray-700 mb-4">Tuition for the N(A) and N(T) tracks and their G1/G2 equivalents, focused on building foundations and confidence for progression to O-Levels, ITE or Polytechnic.</p>
              <ul className="list-disc pl-5 mb-6 text-gray-600">
                <li>Expert N(A) &amp; N(T) tutors</li>
                <li>All core and elective N-Level subjects</li>
                <li>Step-by-step concept mastery</li>
                <li>Support for progression to O-Levels or ITE</li>
              </ul>
              <Link href="/secondary-school-tuition/n-level-tuition" className="mt-auto">
                <Button className="h-auto py-3 w-full text-[18.7px] font-bold bg-accent-fill hover:bg-accent-fill-hover text-white">Learn More</Button>
              </Link>
            </CardContent>
          </Card>
        </section>

        {/* How matching works */}
        <section className="space-y-4">
          <h2 className="section-title text-primary">How we match a secondary tutor</h2>
          <p className="text-gray-700">
            Matching is done by hand, not by an algorithm dropping your request into a job board. It usually takes about {MATCH_TIME}.
          </p>
          <ol className="list-decimal pl-5 space-y-2 text-gray-700">
            <li><strong>You tell us the specifics.</strong> Subject, the level each subject is taken at, the current grade, location and timing. The subject level matters as much as the year.</li>
            <li><strong>We shortlist by hand</strong> from tutors who have taught that subject at that level — not simply anyone free at that hour.</li>
            <li><strong>You get profiles to choose from</strong>, with rates, experience and availability, so the choice stays yours.</li>
            <li><strong>A first lesson checks the fit.</strong> If it is not right, tell us and we will match someone else at no cost.</li>
          </ol>
          <p className="text-gray-700">
            Parents pay the tutor directly, at the tutor&apos;s rate. There is no agency fee at any point.
          </p>
        </section>

        {/* FAQ */}
        <section className="space-y-4">
          <h2 className="section-title text-primary">Secondary tuition FAQs</h2>
          <div className="space-y-5">
            {faqs.map((item) => (
              <div key={item.q}>
                <h3 className="font-semibold text-gray-900 mb-1">{item.q}</h3>
                <p className="text-gray-700">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Request form */}
        <section className="bg-gradient-to-br from-blue-50 to-sky-50 p-8 rounded-2xl shadow-lg">
          <div className="max-w-4xl mx-auto">
            <h2 className="section-title text-primary text-center mb-2">Request a Secondary School Tutor</h2>
            <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">
              Tell us the subject and the level it is taken at, and we will match a tutor — fast, free, and with no obligation.
            </p>
            <SecondaryTutorRequestForm />
          </div>
        </section>
      </div>
    </main>
  );
}
