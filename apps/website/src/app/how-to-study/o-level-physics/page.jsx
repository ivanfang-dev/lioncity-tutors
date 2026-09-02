import { MATCH_TIME } from '@/data/promises';
import { DEFAULT_OG_IMAGE } from '@/lib/seo/openGraph';

export const metadata = {
  title: 'How to Study for O-Level Physics (6091): Only 15% Is Recall',
  description:
    'How to study for O-Level Physics — why only about 15% of theory marks are recall, how the practical splits into two timed sections, and 10 common mistakes.',
  keywords: [
    'how to study for o level physics',
    'physics o level',
    'O Level Physics 6091',
    'O Level physics paper 3 practical',
    'common physics mistakes o level',
    'physics practical planning marks',
  ],
  openGraph: {
    images: [DEFAULT_OG_IMAGE],
    title: 'How to Study for O-Level Physics (6091): Only 15% Is Recall',
    description:
      'Why only about 15% of O-Level Physics theory marks are recall, how the practical is split, and the 10 mistakes our tutors correct most.',
    url: 'https://www.lioncitytutors.com/how-to-study/o-level-physics',
    type: 'article',
  },
  alternates: {
    canonical: 'https://www.lioncitytutors.com/how-to-study/o-level-physics',
  },
};

import Link from 'next/link';
import TableOfContents from '@/components/TableOfContents';
import GuideSchema from '@/components/seo/GuideSchema';
import {
  GuideHeader, SectionHeading, GuideCard, KeyTakeaways, GuideCTA, ICON_STROKE,
  RelatedGuides,
} from '@/components/guide';
import { Scale, Brain, FlaskConical, Repeat, TriangleAlert, ListChecks } from 'lucide-react';

const tableOfContents = [
  { id: 'recall', label: 'Only 15% is recall' },
  { id: 'mark-map', label: 'How the three papers split' },
  { id: 'practical', label: 'Inside the practical paper' },
  { id: 'revision', label: 'How to revise Physics' },
  { id: 'mistakes', label: '10 common mistakes' },
];

const papers = [
  {
    paper: 'Paper 1 — Multiple Choice',
    stat: '1 h · 40 marks · 30%',
    detail: '40 compulsory multiple-choice items.',
  },
  {
    paper: 'Paper 2 — Structured and Free Response',
    stat: '1 h 45 min · 80 marks · 50%',
    detail:
      'Section A carries 70 marks of compulsory structured questions; the last two are worth 20 marks between them, one being a data-based question worth 8–12. Section B carries 10 marks — two questions, of which you answer one.',
  },
  {
    paper: 'Paper 3 — Practical',
    stat: '1 h 50 min · 40 marks · 20%',
    detail:
      'Two sections of 20 marks each. Section A is one or two compulsory experiment questions over 55 minutes; Section B is a single compulsory 55-minute experiment.',
  },
];

const practicalSkills = [
  { skill: 'Planning (P)', weight: '15%', detail: 'Designing a method: what to vary, what to control, what to measure and how.' },
  { skill: 'Manipulation, measurement and observation (MMO)', weight: '85% combined', detail: 'Handling apparatus and taking readings at the precision the instrument allows.' },
  { skill: 'Presentation of data and observations (PDO)', weight: '—', detail: 'Tables and graphs: consistent decimal places, correct units in headings, sensible scales.' },
  { skill: 'Analysis, conclusions and evaluation (ACE)', weight: '—', detail: 'Drawing the conclusion the data supports, and saying honestly where the method limits it.' },
];

const commonMistakes = [
  {
    mistake: 'Revising by memorising definitions',
    detail: 'Roughly 15% of theory marks are allocated to recall. A student who can state every definition perfectly has prepared for about a seventh of the theory papers.',
    fix: 'Use definitions as the entry fee, then spend the time on problems. The 55% for handling information and solving problems is only reachable through unseen questions.',
  },
  {
    mistake: 'Skipping the working on calculation questions',
    detail: 'Physics marks are awarded for the formula chosen, the substitution and the final answer with its unit. A bare number collects the last of those three at best.',
    fix: 'Write the equation, then the substitution, then the answer with a unit. Three lines, three chances to earn marks.',
  },
  {
    mistake: 'Dropping or mangling units',
    detail: 'An unlabelled answer is incomplete, and a wrong unit usually signals a conversion error earlier in the working that would otherwise be recoverable.',
    fix: 'Carry units through the substitution rather than adding one at the end. If they do not cancel to the unit you expect, the method is wrong.',
  },
  {
    mistake: 'Treating the data-based question as an extra',
    detail: 'It is worth 8–12 marks and asks you to interpret, evaluate or solve using a stem you have not seen. It rewards reading, not recall.',
    fix: 'Practise on unfamiliar stems specifically. The physics needed is always syllabus physics; only the context is new.',
  },
  {
    mistake: 'Choosing the Section B question by topic comfort',
    detail: 'Two questions are offered and one is answered, worth 10 marks. Students commit to the familiar topic and meet the harder sub-parts afterwards.',
    fix: 'Read both fully, including every part, before starting. The friendlier opening is often the harder question.',
  },
  {
    mistake: 'Drawing graphs carelessly',
    detail: 'Scale choice, axis labels with units, and plotted-point accuracy carry marks independently of whether the line looks right — and this is true in both Paper 2 and Paper 3.',
    fix: 'Use most of the grid, label both axes with quantity and unit, plot before joining, and draw the line of best fit rather than connecting dots.',
  },
  {
    mistake: 'Ignoring the planning marks in the practical',
    detail: 'Planning carries 15% of the practical paper, and it can be assessed on paper without apparatus at all. Students who only rehearse hands-on technique leave it untouched.',
    fix: 'Practise writing methods: the variable to change, the ones to control, the measurements to take and the instrument for each.',
  },
  {
    mistake: 'Reading instruments to the wrong precision',
    detail: 'Recording 2.5 cm where the rule allows 2.50 cm loses marks, and so does inventing precision an instrument cannot deliver.',
    fix: 'Record to the precision of the instrument and keep decimal places consistent down a column of results.',
  },
  {
    mistake: 'Vague evaluation in conclusions',
    detail: '"There was human error" earns nothing. Evaluation marks want a specific limitation of the method and the direction of its effect.',
    fix: 'Name one concrete source, say which way it shifted the result, and suggest a change that would reduce it.',
  },
  {
    mistake: 'Never sitting the practical to time',
    detail: 'Two 55-minute experiments in one paper is a pacing problem as much as a technique problem, and it is the component most students rehearse least.',
    fix: 'Run at least one full practical to time, including the recording and the analysis, rather than only the hands-on part.',
  },
];

export default function HowToStudyOLevelPhysics() {
  const whatsappMessage = `Hi LionCity Tutors! I'd like help finding an O Level Physics tutor.

Student level (e.g. Sec 3 / Sec 4):
Current grade:
Location:
Preferred days & timing: `;
  const whatsappHref = `https://wa.me/6588701152?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <>
      <GuideSchema
        slug="how-to-study-o-level-physics"
        article={{
          headline: 'How to Study for O-Level Physics (6091): Only 15% Is Recall',
          description:
            'Why only about 15% of O-Level Physics theory marks are recall, how the practical is split, and the 10 mistakes our tutors correct most.',
          datePublished: '2026-08-26',
          dateModified: '2026-08-26',
        }}
      />
      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16">
        <div className="mx-auto max-w-2xl lg:max-w-none lg:grid lg:grid-cols-[minmax(0,42rem)_15rem] lg:justify-center lg:gap-12">
          <div>
            <GuideHeader
              title="How to Study for O-Level Physics"
              author="By the LionCity Tutors science team"
              meta="Updated August 26, 2026 · 10 min read"
            />

            <article className="space-y-12 text-gray-700 leading-relaxed">
              <p className="text-lg text-gray-800 leading-relaxed text-pretty">
                Syllabus 6091 states something most Physics students would change their revision over if they knew it: of the marks in the theory papers, only about 15% are allocated to recall. Almost everything else rewards using physics rather than reciting it.
              </p>

              <KeyTakeaways
                items={[
                  <>Approximately <strong>15% of theory marks are recall</strong>. Handling information and solving problems is <strong>55%</strong>.</>,
                  <>Paper 2 is <strong>half the grade</strong>; the practical is 20% and the multiple choice 30%.</>,
                  <>The practical is <strong>two 55-minute experiments</strong>, 20 marks each.</>,
                  <><strong>Planning is 15%</strong> of the practical, and can be assessed without apparatus.</>,
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

              <section id="recall" className="scroll-mt-24">
                <SectionHeading icon={Brain}>Only about 15% is recall</SectionHeading>
                <p className="text-pretty">
                  The syllabus divides the theory papers into two assessment objectives. Knowledge with understanding is roughly 45% of the marks — and within that, only about 15% is allocated to recall. Handling information and solving problems is roughly 55%.
                </p>
                <GuideCard className="mt-5">
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li><strong className="text-gray-900">~15%</strong> — recall, inside the knowledge objective.</li>
                    <li><strong className="text-gray-900">~45%</strong> — knowledge with understanding, in total.</li>
                    <li><strong className="text-gray-900">~55%</strong> — handling information and solving problems.</li>
                  </ul>
                </GuideCard>
                <p className="mt-4 text-pretty">
                  This is the number that should decide a revision timetable. Rewriting notes and drilling definitions works the smallest slice of the paper. The majority of marks are only reachable by attempting problems you have not seen, because that is literally the objective being assessed.
                </p>
              </section>

              <section id="mark-map" className="scroll-mt-24">
                <SectionHeading icon={Scale}>How the three papers split</SectionHeading>
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
                  Paper 2 alone is half the grade, and its Section B is the only place in the theory papers where you choose. Ten marks is small enough to rush and large enough to matter.
                </p>
              </section>

              <section id="practical" className="scroll-mt-24">
                <SectionHeading icon={FlaskConical}>Inside the practical paper</SectionHeading>
                <p className="text-pretty">
                  Paper 3 is unusual in shape: two sections of 20 marks, each running 55 minutes. It is assessed across four skill areas, and one of them can be examined with no apparatus at all.
                </p>
                <GuideCard className="mt-5">
                  <dl className="space-y-3 text-sm">
                    {practicalSkills.map((item) => (
                      <div key={item.skill}>
                        <dt className="font-semibold text-gray-900">
                          {item.skill}
                          {item.weight !== '—' && (
                            <span className="ml-2 font-normal text-primary tabular-nums">{item.weight}</span>
                          )}
                        </dt>
                        <dd className="text-gray-700">{item.detail}</dd>
                      </div>
                    ))}
                  </dl>
                </GuideCard>
                <p className="mt-4 text-pretty">
                  Planning carries 15% and the other three share 85%. Because planning and data analysis can be set as written questions, a student who only ever rehearses at the bench is leaving the most practisable marks in the paper untouched.
                </p>
              </section>

              <section id="revision" className="scroll-mt-24">
                <SectionHeading icon={Repeat}>How to revise Physics</SectionHeading>
                <GuideCard className="mt-4">
                  <ul className="list-disc ml-5 space-y-2 text-sm text-gray-700">
                    <li><strong>Do problems, not notes.</strong> Recall is about 15% of the theory marks; problem-solving is 55%.</li>
                    <li><strong>Write the equation, the substitution, then the answer.</strong> Each is a separate opportunity to earn a mark.</li>
                    <li><strong>Practise planning on paper.</strong> Fifteen per cent of the practical, and it needs no apparatus to rehearse.</li>
                    <li><strong>Drill graph technique.</strong> Scale, labels and plotting carry marks in both Paper 2 and Paper 3.</li>
                    <li><strong>Use unseen past papers.</strong> Prelim and past-year O-Level Physics papers are in our <Link href="/free-test-papers" className="text-primary underline underline-offset-2">free test papers library</Link>.</li>
                    <li><strong>Keep the formulas and their units in one place.</strong> Our free <Link href="/free-notes" className="text-primary underline underline-offset-2">O-Level Physics study notes</Link> carry every formula with its SI unit attached across all eleven topics, plus the answer templates and the error-analysis technique the practical paper marks against.</li>
                    <li><strong>Mark against the scheme and classify the loss</strong> — knowledge, method, units, or reading the question. Each needs a different fix.</li>
                  </ul>
                </GuideCard>
                <p className="mt-4 text-pretty">
                  For topic-by-topic coverage of syllabus 6091, see our{' '}
                  <Link href="/o-level-physics" className="text-primary underline underline-offset-2">O-Level Physics subject guide</Link>. This page is about where the marks are; that one is about what is on the syllabus.
                </p>
              </section>

              <section id="mistakes" className="scroll-mt-24">
                <SectionHeading icon={TriangleAlert}>10 common O-Level Physics mistakes</SectionHeading>
                <p className="text-gray-700 mb-5">
                  These are the ones our tutors correct most often across the three papers, and what to do instead.
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
                Paper structure, weightings and assessment-objective allocations are from the Singapore-Cambridge GCE O-Level Physics syllabus 6091 (2026), published by SEAB. Always check the current syllabus for your exam year.
              </p>

              <RelatedGuides slug="how-to-study-o-level-physics" />

              <GuideCTA
                title="Get a Physics tutor who marks like an examiner"
                description={`Tell us where the marks are going — theory, practical or both. We hand-match a vetted O-Level Physics tutor, usually within ${MATCH_TIME}, and parents never pay an agency fee.`}
                buttonText="Find an O-Level Physics tutor"
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
