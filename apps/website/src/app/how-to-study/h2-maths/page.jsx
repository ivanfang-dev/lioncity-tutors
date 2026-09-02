import { MATCH_TIME } from '@/data/promises';
import { DEFAULT_OG_IMAGE } from '@/lib/seo/openGraph';

export const metadata = {
  title: 'How to Study for H2 Maths (9758): The GC Rules Nobody Reads',
  description:
    'How to study for A-Level H2 Maths — the graphing calculator rules that decide marks, why statistics is 30% of the grade, and the assumed A-Math knowledge.',
  keywords: [
    'how to study for h2 math',
    'H2 Mathematics 9758',
    'a level mathematics',
    'graphing calculator A level rules',
    'H2 maths application question',
    'H2 maths statistics weighting',
  ],
  openGraph: {
    images: [DEFAULT_OG_IMAGE],
    title: 'How to Study for H2 Maths (9758): The GC Rules Nobody Reads',
    description:
      'The graphing calculator rules that decide marks, why statistics is 30% of the grade, and the A-Math knowledge the syllabus quietly assumes.',
    url: 'https://www.lioncitytutors.com/how-to-study/h2-maths',
    type: 'article',
  },
  alternates: {
    canonical: 'https://www.lioncitytutors.com/how-to-study/h2-maths',
  },
};

import Link from 'next/link';
import TableOfContents from '@/components/TableOfContents';
import GuideSchema from '@/components/seo/GuideSchema';
import {
  GuideHeader, SectionHeading, GuideCard, KeyTakeaways, GuideCTA, ICON_STROKE,
  RelatedGuides,
} from '@/components/guide';
import { Scale, Calculator, Globe, Layers, Repeat, TriangleAlert, ListChecks } from 'lucide-react';

const tableOfContents = [
  { id: 'mark-map', label: 'Two papers, and where stats sits' },
  { id: 'calculator', label: 'The graphing calculator rules' },
  { id: 'application', label: 'The application question' },
  { id: 'assumed', label: 'The A-Math it assumes' },
  { id: 'revision', label: 'How to revise H2 Maths' },
  { id: 'mistakes', label: '10 common mistakes' },
];

const papers = [
  {
    paper: 'Paper 1',
    stat: '3 hours · 100 marks · 50%',
    detail: '10 to 12 questions of varying length, all on Pure Mathematics, all compulsory. One of them applies mathematics to a real-world context and carries at least 12 marks.',
  },
  {
    paper: 'Paper 2',
    stat: '3 hours · 100 marks · 50%',
    detail: 'Section A is Pure Mathematics, 40 marks across 4–5 questions. Section B is Probability and Statistics, 60 marks across 6–8 questions, including one application question.',
  },
];

// The GC rules are published in full and are almost never taught as rules.
// Each of these is a mark-scoring or mark-losing behaviour, not a preference.
const calculatorRules = [
  {
    rule: 'Unsupported answers are usually allowed',
    detail: 'As a general rule an answer straight from the calculator is acceptable — unless the question says otherwise. Knowing this saves time you would otherwise spend justifying steps nobody asked for.',
  },
  {
    rule: 'When they are not allowed, use mathematical notation',
    detail: 'Where a question rules out unsupported answers, the working must be presented in mathematical notation — not as a sequence of calculator commands. Writing what you pressed does not count as method.',
  },
  {
    rule: 'Sketch the graphs you used',
    detail: 'If a solution came from reading a graph, the sketch is part of the answer. Leaving it out removes the evidence the method existed.',
  },
  {
    rule: 'A wrong answer with no working scores nothing',
    detail: 'But written evidence of using the calculator correctly can still earn method marks. Silence is the only outcome that guarantees zero.',
  },
  {
    rule: 'Trust the calculator less than you think',
    detail: 'The syllabus warns explicitly that tracing along a graph to find roots may not give the required accuracy. Where precision matters, solve rather than trace.',
  },
];

// Published in the syllabus as the contexts questions may be set in. Students
// who have seen the list are not surprised by the application question.
const applicationContexts = [
  { context: 'Kinematics and dynamics — free fall, projectile motion, collisions', topics: 'Functions, calculus, vectors' },
  { context: 'Optimisation — maximising strength, minimising surface area', topics: 'Inequalities, systems of linear equations, calculus' },
  { context: 'Electrical circuits', topics: 'Complex numbers, calculus' },
  { context: 'Population growth, radioactive decay, heating and cooling', topics: 'Differential equations' },
  { context: 'Financial maths — banking, insurance', topics: 'Sequences and series, probability, sampling distributions' },
  { context: 'Standardised testing', topics: 'Normal distribution, probability' },
];

const commonMistakes = [
  {
    mistake: 'Under-revising Probability and Statistics',
    detail: 'Section B of Paper 2 is 60 marks — 30% of the entire subject, in one section. Pure Mathematics is the larger half overall, but no single section carries as much as statistics does.',
    fix: 'Give statistics its share of the timetable. It is often taught later and revised least, which is the wrong way round for 30% of the grade.',
  },
  {
    mistake: 'Writing calculator commands as working',
    detail: 'Where a question does not accept unsupported answers, the method must be in mathematical notation. A line describing which buttons produced the number is not method.',
    fix: 'Write the mathematics that justifies the result, then quote the value. The calculator is a tool, not an explanation.',
  },
  {
    mistake: 'Omitting the sketch when a graph produced the answer',
    detail: 'The syllabus states that graphs used to find a solution should be sketched as part of the answer. Without it there is no evidence of the route taken.',
    fix: 'Sketch it, label the axes and mark the point you read. It takes seconds and it is explicitly expected.',
  },
  {
    mistake: 'Leaving a wrong answer bare',
    detail: 'An incorrect answer with no working receives no marks — but written evidence of correct calculator use can still attract method marks.',
    fix: 'Always leave the trail. An answer you doubt is exactly the one that needs the working beside it.',
  },
  {
    mistake: 'Trusting a traced root',
    detail: 'The syllabus warns that tracing along a graph may not deliver the accuracy a question requires, and answers are commonly wanted to a stated precision.',
    fix: 'Use the solver rather than the trace where accuracy matters, and check the value satisfies the original equation.',
  },
  {
    mistake: 'Treating the application question as unpredictable',
    detail: 'It carries at least 12 marks in Paper 1 and appears again in Section B, and the syllabus publishes the contexts it may be drawn from — kinematics, optimisation, circuits, growth and decay, financial maths, standardised testing.',
    fix: 'Work through one problem in each published context. The mathematics is syllabus mathematics; only the dressing is unfamiliar.',
  },
  {
    mistake: 'Assuming A-Math content is behind you',
    detail: 'The syllabus lists content from O-Level Additional Mathematics as assumed knowledge — partial fractions, the factor theorem, logarithm laws, the circle equation, standard derivatives and integrals. Questions are not set directly on it, but they are built on top of it.',
    fix: 'Audit the assumed list early. A gap there does not appear as a topic you failed; it appears as questions that take too long across the whole paper.',
  },
  {
    mistake: 'Revising topics separately',
    detail: 'The syllabus states that questions may integrate ideas from more than one topic, and the application question explicitly may require concepts from several.',
    fix: 'Practise problems that cross topics, and note which combinations recur — calculus with vectors, series with probability.',
  },
  {
    mistake: 'Never rehearsing three hours',
    detail: 'Each paper is three hours of continuous work, and stamina is a real variable at that length. Students who only ever practise in one-hour blocks are surprised by the last hour.',
    fix: 'Sit at least two full papers to time before the exam, and note where accuracy dropped rather than where it felt hard.',
  },
  {
    mistake: 'Presenting an answer to the wrong accuracy',
    detail: 'Where a question specifies a level of accuracy, the value must be given at it — and rounding early inside a multi-step calculation is what usually breaks this.',
    fix: 'Keep full precision in the calculator through the working and round once, at the end, to what the question asked for.',
  },
];

export default function HowToStudyH2Maths() {
  const whatsappMessage = `Hi LionCity Tutors! I'd like help finding an H2 Maths tutor.

Student level (e.g. JC1 / JC2):
Current grade:
Location:
Preferred days & timing: `;
  const whatsappHref = `https://wa.me/6588701152?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <>
      <GuideSchema
        slug="how-to-study-h2-maths"
        article={{
          headline: 'How to Study for H2 Maths (9758): The GC Rules Nobody Reads',
          description:
            'The graphing calculator rules that decide marks, why statistics is 30% of the grade, and the A-Math knowledge the syllabus quietly assumes.',
          datePublished: '2026-08-26',
          dateModified: '2026-08-26',
        }}
      />
      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16">
        <div className="mx-auto max-w-2xl lg:max-w-none lg:grid lg:grid-cols-[minmax(0,42rem)_15rem] lg:justify-center lg:gap-12">
          <div>
            <GuideHeader
              title="How to Study for H2 Maths"
              author="By the LionCity Tutors maths team"
              meta="Updated August 26, 2026 · 11 min read"
            />

            <article className="space-y-12 text-gray-700 leading-relaxed">
              <p className="text-lg text-gray-800 leading-relaxed text-pretty">
                H2 Mathematics publishes a page of rules about how the graphing calculator may be used, and almost no student reads it. Those rules decide whether working earns marks, whether a sketch is required, and when a bare answer is acceptable. They are the cheapest marks in the subject, and they are procedural rather than mathematical.
              </p>

              <KeyTakeaways
                items={[
                  <>A <strong>wrong answer with no working scores nothing</strong> — but evidence of correct calculator use can earn method marks.</>,
                  <>Probability and Statistics is <strong>60 marks of Paper 2</strong>, which is 30% of the whole subject.</>,
                  <>The application question carries <strong>at least 12 marks</strong>, and its possible contexts are published.</>,
                  <>O-Level A-Math content is <strong>assumed knowledge</strong>, not re-taught.</>,
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
                <SectionHeading icon={Scale}>Two papers, and where statistics sits</SectionHeading>
                <p className="text-pretty">
                  Two three-hour papers, each out of 100 and each worth half the subject. The asymmetry is inside Paper 2.
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
                  Pure Mathematics is the larger half of the subject — all of Paper 1 plus 40 marks of Paper 2, so 140 of 200 marks. But no single block is heavier than Probability and Statistics, which is 60 marks in one section and 30% of the grade. It is also, in most schools, taught later and revised less.
                </p>
              </section>

              <section id="calculator" className="scroll-mt-24">
                <SectionHeading icon={Calculator}>The graphing calculator rules</SectionHeading>
                <p className="text-pretty">
                  An approved graphing calculator without a computer algebra system is expected, and the papers are written on the assumption you have one. What follows is what the syllabus actually says about using it — each line is a marking rule.
                </p>
                <div className="mt-5 space-y-4">
                  {calculatorRules.map((item) => (
                    <GuideCard key={item.rule}>
                      <h4 className="font-semibold text-gray-900 mb-1.5">{item.rule}</h4>
                      <p className="text-sm text-gray-700">{item.detail}</p>
                    </GuideCard>
                  ))}
                </div>
                <p className="mt-4 text-pretty">
                  None of this is mathematics, and all of it is marks. A student who knows when a bare answer is acceptable saves minutes across a three-hour paper; a student who does not know that a sketch counts as working loses marks they had already earned.
                </p>
              </section>

              <section id="application" className="scroll-mt-24">
                <SectionHeading icon={Globe}>The application question, and its published contexts</SectionHeading>
                <p className="text-pretty">
                  Paper 1 contains one question applying mathematics to a real-world context, worth at least 12 marks, and Section B of Paper 2 contains another. The syllabus then does something unusually helpful: it lists the contexts these may be drawn from.
                </p>
                <GuideCard className="mt-5">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left border-collapse">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th scope="col" className="py-2 pr-3 font-semibold text-gray-900">Context</th>
                          <th scope="col" className="py-2 font-semibold text-gray-900">Topics likely involved</th>
                        </tr>
                      </thead>
                      <tbody>
                        {applicationContexts.map((row) => (
                          <tr key={row.context} className="border-b border-gray-100 last:border-0 align-top">
                            <td className="py-2 pr-3 text-gray-700">{row.context}</td>
                            <td className="py-2 text-gray-700">{row.topics}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </GuideCard>
                <p className="mt-4 text-pretty">
                  A student who has worked one problem in each of these rows has met the shape of the application question before the exam. The mathematics is always syllabus mathematics; the difficulty is recognising which topic a paragraph of physics or finance is really asking about.
                </p>
              </section>

              <section id="assumed" className="scroll-mt-24">
                <SectionHeading icon={Layers}>The A-Math it quietly assumes</SectionHeading>
                <p className="text-pretty">
                  The syllabus carries a section of assumed knowledge drawn from O-Level Additional Mathematics. No questions are set directly on it — but everything above it is built on top.
                </p>
                <GuideCard className="mt-4">
                  <ul className="list-disc ml-5 space-y-1.5 text-sm text-gray-700">
                    <li>Quadratic functions, discriminant conditions, and simultaneous equations.</li>
                    <li>Surds, including rationalising denominators.</li>
                    <li>Polynomials, the remainder and factor theorems, and partial fractions.</li>
                    <li>Exponential and logarithmic functions and the laws of logarithms.</li>
                    <li>Coordinate geometry of the circle, and trigonometric identities and equations.</li>
                    <li>Standard derivatives and integrals, and differentiation as a rate of change.</li>
                  </ul>
                </GuideCard>
                <p className="mt-4 text-pretty">
                  A gap here never presents as a topic you failed. It presents as questions that take too long, everywhere, because the foundation step is being reconstructed each time. If that sounds familiar, our{' '}
                  <Link href="/how-to-study/o-level-a-math" className="text-primary underline underline-offset-2">O-Level A-Math guide</Link>{' '}
                  covers the same ground from below.
                </p>
              </section>

              <section id="revision" className="scroll-mt-24">
                <SectionHeading icon={Repeat}>How to revise H2 Maths</SectionHeading>
                <GuideCard className="mt-4">
                  <ul className="list-disc ml-5 space-y-2 text-sm text-gray-700">
                    <li><strong>Read the calculator rules once, properly.</strong> They are procedural marks available to anyone who knows them.</li>
                    <li><strong>Give statistics 30% of the timetable,</strong> because it is 30% of the grade.</li>
                    <li><strong>Work one problem per published application context.</strong> Six problems removes most of the surprise from a 12-mark question.</li>
                    <li><strong>Audit the assumed A-Math list early,</strong> while there is still time for it to be a study task rather than an exam problem.</li>
                    <li><strong>Practise across topics,</strong> since questions are explicitly allowed to integrate them.</li>
                    <li><strong>Sit full three-hour papers.</strong> Past-year and prelim JC papers are in our <Link href="/free-test-papers" className="text-primary underline underline-offset-2">free test papers library</Link>.</li>
                    <li><strong>Check what is not examinable before revising it.</strong> Our free <Link href="/free-notes" className="text-primary underline underline-offset-2">H2 Maths revision notes</Link> list the excluded topics beside the Pure and Statistics reference — several of them still appear in older Ten-Year Series papers, which is where the wasted hours go.</li>
                  </ul>
                </GuideCard>
                <p className="mt-4 text-pretty">
                  For topic-by-topic coverage of syllabus 9758, see our{' '}
                  <Link href="/a-level-math" className="text-primary underline underline-offset-2">A-Level H2 Maths subject guide</Link>. This page is about where the marks are; that one is about what is on the syllabus.
                </p>
              </section>

              <section id="mistakes" className="scroll-mt-24">
                <SectionHeading icon={TriangleAlert}>10 common H2 Maths mistakes</SectionHeading>
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
                Paper structure, the graphing calculator rules, the application contexts and the assumed-knowledge list are from the Singapore-Cambridge GCE A-Level H2 Mathematics syllabus 9758 (2026), published by SEAB. A list of formulae and results is provided in the examination. Always check the current syllabus for your exam year.
              </p>

              <RelatedGuides slug="how-to-study-h2-maths" />

              <GuideCTA
                title="Get an H2 Maths tutor who marks like an examiner"
                description={`Tell us where the marks are going — pure, statistics, or the application question. We hand-match a vetted H2 Maths tutor, usually within ${MATCH_TIME}, and parents never pay an agency fee.`}
                buttonText="Find an H2 Maths tutor"
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
