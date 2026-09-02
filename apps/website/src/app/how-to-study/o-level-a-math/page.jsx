import { MATCH_TIME } from '@/data/promises';
import { DEFAULT_OG_IMAGE } from '@/lib/seo/openGraph';

export const metadata = {
  title: 'How to Study for O-Level A-Math (4049): Formulae & Marks',
  description:
    'How to study for O-Level Additional Maths — which formulae are printed for you, which you must memorise, why working carries marks, and 10 common mistakes.',
  keywords: [
    'how to study for a math',
    'O Level Additional Mathematics 4049',
    'A Math formula list',
    'A Math paper structure',
    'tips for scoring a1 in o level math',
    'additional mathematics Singapore',
  ],
  openGraph: {
    images: [DEFAULT_OG_IMAGE],
    title: 'How to Study for O-Level A-Math (4049): Formulae & Marks',
    description:
      'Which A-Math formulae are printed in the exam, which you must memorise, and the 10 mistakes our tutors correct most.',
    url: 'https://www.lioncitytutors.com/how-to-study/o-level-a-math',
    type: 'article',
  },
  alternates: {
    canonical: 'https://www.lioncitytutors.com/how-to-study/o-level-a-math',
  },
};

import Link from 'next/link';
import TableOfContents from '@/components/TableOfContents';
import GuideSchema from '@/components/seo/GuideSchema';
import {
  GuideHeader, SectionHeading, GuideCard, KeyTakeaways, GuideCTA, ICON_STROKE,
  RelatedGuides,
} from '@/components/guide';
import { Scale, Sigma, PenLine, Repeat, TriangleAlert, ListChecks } from 'lucide-react';

const tableOfContents = [
  { id: 'mark-map', label: 'How the two papers split' },
  { id: 'formulae', label: 'What is printed for you' },
  { id: 'working', label: 'Why working carries marks' },
  { id: 'revision', label: 'How to revise A-Math' },
  { id: 'mistakes', label: '10 common mistakes' },
];

const papers = [
  {
    paper: 'Paper 1',
    stat: '2 h 15 min · 90 marks · 50%',
    detail: '12 to 14 questions of varying length, up to 10 marks each. All compulsory.',
  },
  {
    paper: 'Paper 2',
    stat: '2 h 15 min · 90 marks · 50%',
    detail: '9 to 11 questions of varying length, up to 12 marks each. All compulsory.',
  },
];

// What the printed list does and does not cover, per syllabus 4049. The absence
// of calculus is the point of the section: it is the largest part of the course
// and none of it is handed over.
const givenFormulae = [
  { area: 'Algebra', items: 'The quadratic formula, and the binomial expansion with its coefficient notation.' },
  { area: 'Trigonometry — identities', items: 'sin²A + cos²A = 1, sec²A = 1 + tan²A, cosec²A = 1 + cot²A.' },
  { area: 'Trigonometry — compound and double angles', items: 'The addition formulae for sine, cosine and tangent, and the double-angle results that follow from them.' },
  { area: 'Triangle formulae', items: 'The sine rule, the cosine rule, and the area of a triangle as ½bc sin A.' },
];

const notGiven = [
  'Every differentiation rule — product, quotient and chain — and the derivatives of the standard functions.',
  'Every integration result, including the ones that simply reverse the derivatives above.',
  'The laws of logarithms and indices.',
  'The remainder and factor theorems.',
  'Coordinate geometry: gradient, distance, midpoint, and the equation of a circle.',
  'The relationships between the roots of a quadratic and its coefficients.',
];

const commonMistakes = [
  {
    mistake: 'Memorising the formulae you are given',
    detail: 'The trigonometric identities and the quadratic formula are printed in both papers. Revision spent committing them to memory buys nothing on exam day.',
    fix: 'Read the printed list once, early, and never revise it again. Redirect that time to calculus, which is the largest part of the course and appears nowhere on the list.',
  },
  {
    mistake: 'Skipping working because the answer is obvious',
    detail: 'The syllabus states plainly that omission of essential working will result in loss of marks. A correct final answer with nothing above it can still score badly.',
    fix: 'Write the line that shows the method even when you did it mentally. In a question worth up to 12 marks, the answer itself is rarely most of them.',
  },
  {
    mistake: 'Rounding at the wrong point',
    detail: 'Answers are wanted to 3 significant figures, or 1 decimal place for angles in degrees. Students round intermediate values and carry the error into the final line.',
    fix: 'Keep full accuracy inside the working and round only at the end. Where a question asks you to show an answer to a stated accuracy, work to a higher one first.',
  },
  {
    mistake: 'Treating differentiation and integration as separate topics',
    detail: 'They are learned in sequence and then revised as if unrelated, so students who can differentiate confidently stall on the integral that simply reverses it.',
    fix: 'Revise them as pairs. For every derivative you learn, write the integral it implies on the same card.',
  },
  {
    mistake: 'Losing the domain of a trigonometric equation',
    detail: 'A question set for 0° ≤ x ≤ 360° wants every solution in that range, and students routinely give the principal value alone.',
    fix: 'Write the range at the top of the working before solving, and check the count of solutions against it before moving on.',
  },
  {
    mistake: 'Reaching for the calculator on a "show that" question',
    detail: 'Show-that questions are asking for the derivation. A numerical check confirms the result without demonstrating it, and earns little.',
    fix: 'Work symbolically from the given starting point to the stated result. If your working contains a decimal, you have probably answered a different question.',
  },
  {
    mistake: 'Weak algebra beneath sound method',
    detail: 'Most A-Math marks lost in our experience are not conceptual. They are sign errors, mishandled fractions and dropped brackets inside otherwise correct methods.',
    fix: 'When you mark your own work, separate method errors from algebra slips. The second category needs drilling, not re-teaching.',
  },
  {
    mistake: 'Ignoring the mark allocation as a length signal',
    detail: 'Questions run up to 10 marks in Paper 1 and 12 in Paper 2. A three-line answer to a ten-mark question has almost certainly missed required steps.',
    fix: 'Read the mark count before starting and treat it as a rough estimate of how many distinct steps are expected.',
  },
  {
    mistake: 'Practising only the topics that feel comfortable',
    detail: 'Every question is compulsory in both papers, so there is nowhere to hide a weak topic. There is no choice section in A-Math.',
    fix: 'Track which topics you avoid and schedule those first. Comfort is a poor guide to where the marks are.',
  },
  {
    mistake: 'Never rehearsing under time',
    detail: 'Two papers of 2 hours 15 minutes each, with everything compulsory, punish slow starts more than they punish gaps in knowledge.',
    fix: 'Sit at least two full papers to time before the exam, and record where the time actually went rather than how it felt.',
  },
];

export default function HowToStudyOLevelAMath() {
  const whatsappMessage = `Hi LionCity Tutors! I'd like help finding an O Level A-Math tutor.

Student level (e.g. Sec 3 / Sec 4):
Current grade:
Location:
Preferred days & timing: `;
  const whatsappHref = `https://wa.me/6588701152?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <>
      <GuideSchema
        slug="how-to-study-o-level-a-math"
        article={{
          headline: 'How to Study for O-Level A-Math (4049): Formulae & Marks',
          description:
            'Which A-Math formulae are printed in the exam, which you must memorise, and the 10 mistakes our tutors correct most.',
          datePublished: '2026-08-26',
          dateModified: '2026-08-26',
        }}
      />
      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16">
        <div className="mx-auto max-w-2xl lg:max-w-none lg:grid lg:grid-cols-[minmax(0,42rem)_15rem] lg:justify-center lg:gap-12">
          <div>
            <GuideHeader
              title="How to Study for O-Level A-Math"
              author="By the LionCity Tutors maths team"
              meta="Updated August 26, 2026 · 10 min read"
            />

            <article className="space-y-12 text-gray-700 leading-relaxed">
              <p className="text-lg text-gray-800 leading-relaxed text-pretty">
                Additional Mathematics hands you a formula sheet in both papers. Most students never find out exactly what is on it, so they memorise things they will be given and arrive short on the things they will not. Syllabus 4049 settles the question, and it changes where revision should go.
              </p>

              <KeyTakeaways
                items={[
                  <>Two papers, both <strong>2 h 15 min and 90 marks</strong>, weighted 50% each. Everything is compulsory.</>,
                  <>The printed list covers algebra and trigonometry. It contains <strong>no calculus whatsoever</strong>.</>,
                  <>&ldquo;Omission of essential working will result in loss of marks&rdquo; is a stated rule, not a convention.</>,
                  <>Answers to <strong>3 significant figures</strong>, or 1 decimal place for angles in degrees.</>,
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
                  A-Math is unusually simple to plan for: two papers of identical length and weight, with no optional questions anywhere.
                </p>
                <div className="mt-5 space-y-4">
                  {papers.map((item) => (
                    <GuideCard key={item.paper}>
                      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 mb-2">
                        <h3 className="font-semibold text-gray-900">{item.paper}</h3>
                        <span className="text-sm font-semibold text-primary tabular-nums">{item.stat}</span>
                      </div>
                      <p className="text-sm text-gray-700">{item.detail}</p>
                    </GuideCard>
                  ))}
                </div>
                <p className="mt-4 text-pretty">
                  Because every question is compulsory, a weak topic cannot be avoided the way it can in a paper with a choice section. That single fact should shape a revision timetable more than anything else here.
                </p>
              </section>

              <section id="formulae" className="scroll-mt-24">
                <SectionHeading icon={Sigma}>What is printed for you — and what is not</SectionHeading>
                <p className="text-pretty">
                  The syllabus states that relevant mathematical formulae will be provided. Here is what that list actually covers.
                </p>

                <GuideCard className="mt-5">
                  <h3 className="font-semibold text-gray-900 mb-3">Provided in the exam</h3>
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
                  <h3 className="font-semibold text-gray-900 mb-3">Not on the list — you must know these</h3>
                  <ul className="list-disc ml-5 space-y-1.5 text-sm text-gray-700">
                    {notGiven.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </GuideCard>

                <p className="mt-4 text-pretty">
                  The asymmetry is the useful part. Trigonometric identities — the thing students most often drill onto flashcards — are handed over in full. Calculus, which carries a large share of the course, appears nowhere. If a revision plan treats those two the same way, it is aimed at the wrong half of the paper.
                </p>
              </section>

              <section id="working" className="scroll-mt-24">
                <SectionHeading icon={PenLine}>Why working carries the marks</SectionHeading>
                <p className="text-pretty">
                  The syllabus notes open with it: omission of essential working will result in loss of marks. In a subject where single questions run to 10 and 12 marks, the final answer is rarely worth most of them — the method is.
                </p>
                <GuideCard className="mt-4">
                  <ul className="list-disc ml-5 space-y-2 text-sm text-gray-700">
                    <li><strong>Write the step you did mentally.</strong> A line of algebra you skipped is a line the marker cannot award.</li>
                    <li><strong>Use the mark count as a step count.</strong> Ten marks implies substantially more than three lines of work.</li>
                    <li><strong>Keep full accuracy until the end.</strong> Round once, at the final answer, to 3 significant figures — or 1 decimal place for angles in degrees.</li>
                    <li><strong>On a &ldquo;show that&rdquo;, derive rather than verify.</strong> Substituting a number to confirm the result is not the demonstration being asked for.</li>
                    <li><strong>Work to higher accuracy first</strong> where a question asks you to show an answer correct to a stated accuracy.</li>
                  </ul>
                </GuideCard>
              </section>

              <section id="revision" className="scroll-mt-24">
                <SectionHeading icon={Repeat}>How to revise A-Math</SectionHeading>
                <GuideCard className="mt-4">
                  <ul className="list-disc ml-5 space-y-2 text-sm text-gray-700">
                    <li><strong>Start from the not-given list.</strong> Calculus, logarithms, the factor theorem and coordinate geometry are the memory load. The printed sheet covers the rest.</li>
                    <li><strong>Separate method errors from algebra slips</strong> when marking your own work. Most lost marks in our experience are the second kind, and they need drilling rather than re-teaching.</li>
                    <li><strong>Pair every derivative with its integral</strong> on the same card, so the two never drift into separate topics.</li>
                    <li><strong>Work unseen past papers to time.</strong> Prelim and past-year A-Math papers are in our <Link href="/free-test-papers" className="text-primary underline underline-offset-2">free test papers library</Link>.</li>
                    <li><strong>Keep one formula reference, not twelve.</strong> Our free <Link href="/free-notes" className="text-primary underline underline-offset-2">O-Level A-Math revision notes</Link> put the formulae for every topic in 17 pages, with worked examples and the errors that cost method marks.</li>
                    <li><strong>Schedule your avoided topics first.</strong> Nothing is optional in either paper, so comfort is a poor guide to where the marks are.</li>
                  </ul>
                </GuideCard>
                <p className="mt-4 text-pretty">
                  For topic-by-topic coverage of both O-Level maths syllabuses, see our{' '}
                  <Link href="/o-level-math" className="text-primary underline underline-offset-2">O-Level Maths subject guide</Link>, or the companion{' '}
                  <Link href="/how-to-study/o-level-e-math" className="text-primary underline underline-offset-2">E-Math study guide</Link> — the two subjects are given different formula lists, so they need different preparation.
                </p>
              </section>

              <section id="mistakes" className="scroll-mt-24">
                <SectionHeading icon={TriangleAlert}>10 common A-Math mistakes</SectionHeading>
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
                          <h3 className="font-semibold text-gray-900 mb-1.5">{item.mistake}</h3>
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
                Paper structure, the provided formula list and the marking notes are from the Singapore-Cambridge GCE O-Level Additional Mathematics syllabus 4049 (2026), published by SEAB. Always check the current syllabus for your exam year.
              </p>

              <RelatedGuides slug="how-to-study-o-level-a-math" />

              <GuideCTA
                title="Get an A-Math tutor who marks like an examiner"
                description={`Tell us which topics are costing marks — calculus, trigonometry or algebra. We hand-match a vetted A-Math tutor, usually within ${MATCH_TIME}, and parents never pay an agency fee.`}
                buttonText="Find an A-Math tutor"
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
