import { MATCH_TIME } from '@/data/promises';
import { DEFAULT_OG_IMAGE } from '@/lib/seo/openGraph';

export const metadata = {
  title: 'How to Study for O-Level E-Math (4052): Formulae & Marks',
  description:
    'How to study for O-Level E-Maths — which formulae are printed for you, which you must memorise, the real-world question ending Paper 2, and 10 common mistakes.',
  keywords: [
    'how to study for e math',
    'O Level Mathematics 4052',
    'E Math formula list',
    'E Math paper 2 real world question',
    'O Level maths paper structure',
    'elementary mathematics Singapore',
  ],
  openGraph: {
    images: [DEFAULT_OG_IMAGE],
    title: 'How to Study for O-Level E-Math (4052): Formulae & Marks',
    description:
      'Which E-Math formulae are printed in the exam, the real-world question that closes Paper 2, and the 10 mistakes our tutors correct most.',
    url: 'https://www.lioncitytutors.com/how-to-study/o-level-e-math',
    type: 'article',
  },
  alternates: {
    canonical: 'https://www.lioncitytutors.com/how-to-study/o-level-e-math',
  },
};

import Link from 'next/link';
import TableOfContents from '@/components/TableOfContents';
import GuideSchema from '@/components/seo/GuideSchema';
import {
  GuideHeader, SectionHeading, GuideCard, KeyTakeaways, GuideCTA, ICON_STROKE,
  RelatedGuides,
} from '@/components/guide';
import { Scale, Sigma, Globe, Repeat, TriangleAlert, ListChecks } from 'lucide-react';

const tableOfContents = [
  { id: 'mark-map', label: 'How the two papers split' },
  { id: 'formulae', label: 'What is printed for you' },
  { id: 'real-world', label: 'The question that ends Paper 2' },
  { id: 'revision', label: 'How to revise E-Math' },
  { id: 'mistakes', label: '10 common mistakes' },
];

const papers = [
  {
    paper: 'Paper 1',
    stat: '2 h 15 min · 90 marks · 50%',
    detail: 'About 26 short-answer questions. All compulsory.',
  },
  {
    paper: 'Paper 2',
    stat: '2 h 15 min · 90 marks · 50%',
    detail: '9 to 10 questions of varying length, all compulsory — and the last one focuses specifically on applying mathematics to a real-world scenario.',
  },
];

// Exactly what the 4052 list carries. The omissions matter more than the
// inclusions: the quadratic formula is on the A-Math sheet and not this one.
const givenFormulae = [
  { area: 'Compound interest', items: 'The total-amount formula, with principal, rate and number of periods.' },
  { area: 'Mensuration', items: 'Curved surface area and volume of a cone, surface area and volume of a sphere, area of a triangle as ½ab sin C, and arc length and sector area in radians.' },
  { area: 'Trigonometry', items: 'The sine rule and the cosine rule.' },
  { area: 'Statistics', items: 'Mean and standard deviation for grouped data.' },
];

const notGiven = [
  'The quadratic formula — it appears on the A-Math sheet, but not on this one.',
  'Area and circumference of a circle, and the area formulae for common plane shapes.',
  'Pythagoras’ theorem and the basic trigonometric ratios.',
  'Gradient, midpoint and distance in coordinate geometry.',
  'The laws of indices, and standard algebraic expansions and factorisations.',
  'Probability rules, and the angle properties of circles, triangles and polygons.',
];

const commonMistakes = [
  {
    mistake: 'Assuming the quadratic formula will be printed',
    detail: 'It is on the Additional Mathematics list and not on the Mathematics one. Students who take both subjects are the most likely to be caught by this.',
    fix: 'Memorise it. Read the printed list once so you know exactly which mensuration and statistics results you are handed, and treat everything else as yours to carry.',
  },
  {
    mistake: 'Skipping working on short-answer questions',
    detail: 'Paper 1 is around 26 questions, so answers feel small enough to do in your head — but omission of essential working costs marks by rule, at any question size.',
    fix: 'Show at least the substitution line even on a two-mark question. It is also what makes a careless slip recoverable when you check.',
  },
  {
    mistake: 'Rounding too early',
    detail: 'Non-exact answers are wanted to 3 significant figures, or 1 decimal place for angles in degrees. Rounding an intermediate value propagates the error into the final line.',
    fix: 'Carry full accuracy through the working and round once at the end, and work to a higher accuracy first when asked to show a stated one.',
  },
  {
    mistake: 'Arriving without geometrical instruments',
    detail: 'The syllabus expects compasses, protractor and straight edge in both papers, not just the one that feels like the construction paper.',
    fix: 'Pack them for Paper 1 as well. Constructions and accurate diagrams carry marks that cannot be reasoned out.',
  },
  {
    mistake: 'Treating the last question of Paper 2 as an ordinary one',
    detail: 'It is set specifically on applying mathematics to a real-world scenario, so it is longer, wordier and more interpretive than the questions before it — and it arrives when time is shortest.',
    fix: 'Budget time for it deliberately. Practise reading a wordy scenario and deciding which mathematics it is asking for, which is the actual skill being tested.',
  },
  {
    mistake: 'Losing units and context in the answer',
    detail: 'Applied questions ask for money, lengths or rates, and an unlabelled number does not answer the question that was posed.',
    fix: 'Finish every applied answer with a sentence in the context of the question, carrying the correct unit.',
  },
  {
    mistake: 'Reading statistics questions too quickly',
    detail: 'Mean and standard deviation are provided, which makes it tempting to compute first and check what was asked second — often a comparison or an interpretation rather than a value.',
    fix: 'Underline whether the question wants a calculation, a comparison, or a comment on what the figures show. The formula being given is a hint that the marks are elsewhere.',
  },
  {
    mistake: 'Practising only the topics with tidy answers',
    detail: 'Everything is compulsory in both papers, so an avoided topic will simply appear. There is no choice section in E-Math.',
    fix: 'Track what you skip and schedule it first. Comfort is a poor guide to where the marks are.',
  },
  {
    mistake: 'Drawing graphs without care',
    detail: 'Scale, axis labels and plotted-point accuracy carry marks independently of whether the shape looks right.',
    fix: 'Choose a scale that uses most of the grid, label both axes with quantity and unit, and plot points before joining them.',
  },
  {
    mistake: 'Never rehearsing the full 2 h 15 min',
    detail: 'Around 26 questions in Paper 1 rewards pace, and students who have only ever done topic exercises discover the timing problem in the exam itself.',
    fix: 'Sit both papers to time at least once, and record where the minutes actually went rather than how it felt.',
  },
];

export default function HowToStudyOLevelEMath() {
  const whatsappMessage = `Hi LionCity Tutors! I'd like help finding an O Level E-Math tutor.

Student level (e.g. Sec 3 / Sec 4):
Current grade:
Location:
Preferred days & timing: `;
  const whatsappHref = `https://wa.me/6588701152?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <>
      <GuideSchema
        slug="how-to-study-o-level-e-math"
        article={{
          headline: 'How to Study for O-Level E-Math (4052): Formulae & Marks',
          description:
            'Which E-Math formulae are printed in the exam, the real-world question that closes Paper 2, and the 10 mistakes our tutors correct most.',
          datePublished: '2026-08-26',
          dateModified: '2026-08-26',
        }}
      />
      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16">
        <div className="mx-auto max-w-2xl lg:max-w-none lg:grid lg:grid-cols-[minmax(0,42rem)_15rem] lg:justify-center lg:gap-12">
          <div>
            <GuideHeader
              title="How to Study for O-Level E-Math"
              author="By the LionCity Tutors maths team"
              meta="Updated August 26, 2026 · 10 min read"
            />

            <article className="space-y-12 text-gray-700 leading-relaxed">
              <p className="text-lg text-gray-800 leading-relaxed text-pretty">
                E-Math gives you a formula sheet in both papers, and it is shorter than most students assume. Knowing precisely what is on it — and what conspicuously is not — is the cheapest revision decision available in syllabus 4052, and it takes about a minute to make.
              </p>

              <KeyTakeaways
                items={[
                  <>Two papers, both <strong>2 h 15 min and 90 marks</strong>, weighted 50% each. Everything is compulsory.</>,
                  <>The <strong>quadratic formula is not on the E-Math sheet</strong>, though it is on the A-Math one.</>,
                  <>The <strong>last question of Paper 2</strong> is set specifically on a real-world scenario.</>,
                  <>Geometrical instruments are expected in <strong>both</strong> papers, not just one.</>,
                ]}
              />

              <nav aria-label="Table of contents" className="lg:hidden rounded-xl border border-gray-200 bg-gray-50 p-5 sm:p-6">
                <div className="flex items-center gap-2 mb-4">
                  <ListChecks className="h-5 w-5 text-primary" strokeWidth={ICON_STROKE} aria-hidden="true" />
                  <p className="text-base font-semibold text-gray-900">In this guide</p>
                </div>
                <ol className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-sm">
                  {tableOfContents.map((item) => (
                    <li key={item.id}>
                      <a href={`#${item.id}`} className="flex min-h-11 items-center text-gray-700 hover:text-primary transition-colors">{item.label}</a>
                    </li>
                  ))}
                </ol>
              </nav>

              <section id="mark-map" className="scroll-mt-24">
                <SectionHeading icon={Scale}>How the two papers split</SectionHeading>
                <p className="text-pretty">
                  Equal length, equal weight, nothing optional — but the two papers ask for quite different rhythms.
                </p>
                <div className="mt-5 space-y-4">
                  {papers.map((item) => (
                    <GuideCard key={item.paper}>
                      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 mb-2">
                        <h4 className="font-semibold text-gray-900">{item.paper}</h4>
                        <span className="text-sm font-semibold text-primary tabular-nums">{item.stat}</span>
                      </div>
                      <p className="text-sm text-gray-700">{item.detail}</p>
                    </GuideCard>
                  ))}
                </div>
                <p className="mt-4 text-pretty">
                  Around 26 questions in 2 hours 15 minutes gives Paper 1 an average of roughly five minutes each, so it rewards pace and accuracy. Paper 2 has fewer, longer questions and ends with the applied one — a different problem entirely, and one worth arriving at with time in hand.
                </p>
              </section>

              <section id="formulae" className="scroll-mt-24">
                <SectionHeading icon={Sigma}>What is printed for you — and what is not</SectionHeading>
                <p className="text-pretty">
                  The syllabus states that relevant mathematical formulae will be provided. This is the whole of that list.
                </p>

                <GuideCard className="mt-5">
                  <h4 className="font-semibold text-gray-900 mb-3">Provided in the exam</h4>
                  <dl className="space-y-3 text-sm">
                    {givenFormulae.map((item) => (
                      <div key={item.area}>
                        <dt className="font-semibold text-gray-900">{item.area}</dt>
                        <dd className="text-gray-700">{item.items}</dd>
                      </div>
                    ))}
                  </dl>
                </GuideCard>

                <GuideCard className="mt-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Not on the list — you must know these</h4>
                  <ul className="list-disc ml-5 space-y-1.5 text-sm text-gray-700">
                    {notGiven.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </GuideCard>

                <p className="mt-4 text-pretty">
                  The sheet is generous about the formulae that are awkward to remember — cones, spheres, sectors, standard deviation — and silent about the ones used constantly. Circle area, Pythagoras and the quadratic formula all have to be carried in your head, which is exactly the opposite of what most students assume when they see that a formula list exists.
                </p>
              </section>

              <section id="real-world" className="scroll-mt-24">
                <SectionHeading icon={Globe}>The question that ends Paper 2</SectionHeading>
                <p className="text-pretty">
                  Syllabus 4052 specifies that the final question of Paper 2 focuses on applying mathematics to a real-world scenario. It is the one question whose difficulty is not really mathematical.
                </p>
                <GuideCard className="mt-4">
                  <ul className="list-disc ml-5 space-y-2 text-sm text-gray-700">
                    <li><strong>The mathematics is syllabus mathematics.</strong> Nothing new is being tested; the work is deciding which tool the situation calls for.</li>
                    <li><strong>Read it twice before writing.</strong> These questions carry more words than any other on the paper, and the constraint that matters is often in the second half.</li>
                    <li><strong>State assumptions where the scenario is loose.</strong> Real-world framing usually leaves something unspecified, and naming your assumption is part of a complete answer.</li>
                    <li><strong>Answer in context, with units.</strong> A bare number does not resolve a question posed about money, distance or time.</li>
                    <li><strong>Arrive with time left.</strong> It comes last, and it is the worst question on the paper to rush.</li>
                  </ul>
                </GuideCard>
              </section>

              <section id="revision" className="scroll-mt-24">
                <SectionHeading icon={Repeat}>How to revise E-Math</SectionHeading>
                <GuideCard className="mt-4">
                  <ul className="list-disc ml-5 space-y-2 text-sm text-gray-700">
                    <li><strong>Read the formula sheet once, early.</strong> Then stop revising anything on it and put that time into the not-given list.</li>
                    <li><strong>Drill Paper 1 for pace.</strong> Twenty-six questions rewards speed with accuracy, which is trained by short timed sets rather than long topic exercises.</li>
                    <li><strong>Practise wordy applied questions specifically.</strong> The skill is translation from scenario to method, and it does not improve by doing more routine sums.</li>
                    <li><strong>Separate method errors from careless slips</strong> when you mark your own work. The second kind is the larger category and needs drilling, not re-teaching.</li>
                    <li><strong>Work unseen past papers to time.</strong> Prelim and past-year O-Level maths papers are in our <Link href="/free-test-papers" className="text-primary underline underline-offset-2">free test papers library</Link>.</li>
                    <li><strong>Keep one reference for what is not printed.</strong> Our free <Link href="/free-notes" className="text-primary underline underline-offset-2">O-Level E-Math revision notes</Link> put the formulae and methods for all seventeen topics into 16 pages, with worked examples and the errors that lose marks.</li>
                  </ul>
                </GuideCard>
                <p className="mt-4 text-pretty">
                  For topic-by-topic coverage of both O-Level maths syllabuses, see our{' '}
                  <Link href="/o-level-math" className="text-primary underline underline-offset-2">O-Level Maths subject guide</Link>, or the companion{' '}
                  <Link href="/how-to-study/o-level-a-math" className="text-primary underline underline-offset-2">A-Math study guide</Link> if you take both — the two are given different formula lists, so they need different preparation.
                </p>
              </section>

              <section id="mistakes" className="scroll-mt-24">
                <SectionHeading icon={TriangleAlert}>10 common E-Math mistakes</SectionHeading>
                <p className="text-gray-700 mb-5">
                  These are the ones our tutors correct most often across both papers, and what to do instead.
                </p>
                <div className="space-y-4">
                  {commonMistakes.map((item, index) => (
                    <GuideCard key={item.mistake}>
                      <div className="flex gap-4">
                        <span
                          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary tabular-nums"
                          aria-hidden="true"
                        >
                          {index + 1}
                        </span>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1.5">{item.mistake}</h4>
                          <p className="text-sm text-gray-700 mb-2">{item.detail}</p>
                          <p className="text-sm text-gray-700">
                            <span className="font-semibold text-gray-900">The fix: </span>
                            {item.fix}
                          </p>
                        </div>
                      </div>
                    </GuideCard>
                  ))}
                </div>
              </section>

              <p className="text-sm text-gray-500">
                Paper structure, the provided formula list and the marking notes are from the Singapore-Cambridge GCE O-Level Mathematics syllabus 4052 (2026), published by SEAB. Always check the current syllabus for your exam year.
              </p>

              <RelatedGuides slug="how-to-study-o-level-e-math" />

              <GuideCTA
                title="Get an E-Math tutor who marks like an examiner"
                description={`Tell us where the marks are going — algebra, geometry, statistics or the applied question. We hand-match a vetted E-Math tutor, usually within ${MATCH_TIME}, and parents never pay an agency fee.`}
                buttonText="Find an E-Math tutor"
                whatsappHref={whatsappHref}
              />
            </article>
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <TableOfContents items={tableOfContents} />
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}
