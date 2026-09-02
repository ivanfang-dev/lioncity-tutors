import { MATCH_TIME } from '@/data/promises';
import { DEFAULT_OG_IMAGE } from '@/lib/seo/openGraph';

export const metadata = {
  title: 'How to Study for H2 Physics (9478): Spreadsheets and Marks',
  description:
    'How to study for A-Level H2 Physics — the spreadsheet skills the practical now requires, what Data and Formulae are printed for you, and 10 common mistakes.',
  keywords: [
    'how to study for h2 physics',
    'H2 Physics 9478',
    'a level physics Singapore',
    'H2 physics practical spreadsheet',
    'H2 physics data and formulae',
    'H2 physics paper weighting',
  ],
  openGraph: {
    images: [DEFAULT_OG_IMAGE],
    title: 'How to Study for H2 Physics (9478): Spreadsheets and Marks',
    description:
      'The spreadsheet skills the practical now requires, what Data and Formulae are printed for you, and the 10 mistakes our tutors correct most.',
    url: 'https://www.lioncitytutors.com/how-to-study/h2-physics',
    type: 'article',
  },
  alternates: {
    canonical: 'https://www.lioncitytutors.com/how-to-study/h2-physics',
  },
};

import Link from 'next/link';
import TableOfContents from '@/components/TableOfContents';
import GuideSchema from '@/components/seo/GuideSchema';
import {
  GuideHeader, SectionHeading, GuideCard, KeyTakeaways, GuideCTA, ICON_STROKE,
  RelatedGuides,
} from '@/components/guide';
import { Scale, Table2, BookOpen, Repeat, TriangleAlert, ListChecks } from 'lucide-react';

const tableOfContents = [
  { id: 'mark-map', label: 'Four papers, uneven weights' },
  { id: 'practical', label: 'The practical wants spreadsheets' },
  { id: 'provided', label: 'Data and Formulae are printed' },
  { id: 'revision', label: 'How to revise H2 Physics' },
  { id: 'mistakes', label: '10 common mistakes' },
];

const papers = [
  { paper: 'Paper 1 — Multiple Choice', stat: '1 h · 30 marks · 15%', detail: '30 direct-choice questions, four options each.' },
  { paper: 'Paper 2 — Structured', stat: '2 h · 75 marks · 30%', detail: 'Compulsory structured questions plus one or two data-based questions worth 20–25 marks, some requiring you to integrate different areas of the syllabus.' },
  { paper: 'Paper 3 — Longer Structured', stat: '2 h · 75 marks · 35%', detail: 'Section A is 55 marks of compulsory structured questions. Section B is 20 marks: a choice of one from two 20-mark questions.' },
  { paper: 'Paper 4 — Practical', stat: '2 h 30 min · 50 marks · 20%', detail: 'Two sections, with 1 h 15 min of apparatus access for each. Planning carries 4%; manipulation, presentation and analysis carry 16% between them.' },
];

const spreadsheetSkills = [
  'Entering measured data into a table and keeping the columns consistent.',
  'Computing derived quantities with a formula rather than by hand, so the whole column updates.',
  'Plotting a graph from the data and choosing sensible axes and scales.',
  'Fitting a straight line and reading the gradient and intercept from it.',
  'Judging whether an output is physically plausible before writing it down.',
];

const commonMistakes = [
  {
    mistake: 'Arriving at the practical unable to drive a spreadsheet',
    detail: 'Syllabus 9478 states that candidates will be required to process and analyse data using spreadsheet software. It is a stated requirement of a paper worth 20%, and it is not a physics skill — which is exactly why it goes unpractised.',
    fix: 'Rehearse the whole workflow: enter data, compute a derived column with a formula, plot, fit a line, read the gradient. Fluency here is worth marks the physics alone cannot earn.',
  },
  {
    mistake: 'Memorising what is printed in front of you',
    detail: 'Data and Formulae are provided in the papers. Revision spent committing constants and standard relationships to memory buys nothing on exam day.',
    fix: 'Learn to find things on the sheet quickly instead, and put the saved time into problems.',
  },
  {
    mistake: 'Over-practising the multiple choice',
    detail: 'Paper 1 is 15% — the smallest of the four. Paper 3 is 35%, and Papers 2 and 3 are 65% between them.',
    fix: 'Weight practice to the structured papers, where the extended reasoning marks live.',
  },
  {
    mistake: 'Revising as though knowledge is the biggest category',
    detail: 'Handling, applying and evaluating information carries 44% of the marks; knowledge with understanding carries 36%. More of the subject rewards using physics than stating it.',
    fix: 'Work unseen problems rather than rereading notes. A session that produced no unfamiliar question trained the smaller category.',
  },
  {
    mistake: 'Treating the data-based question as an extra',
    detail: 'It is worth 20–25 marks of Paper 2 — roughly a third of that paper — and is designed to be unfamiliar.',
    fix: 'Practise on stems you have never seen. The physics is always syllabus physics; only the context is new.',
  },
  {
    mistake: 'Choosing the Paper 3 Section B question too fast',
    detail: 'It is a choice of one from two 20-mark questions, and the friendlier opening is often attached to the harder later parts.',
    fix: 'Read both fully before committing. Two minutes protects a fifth of the paper.',
  },
  {
    mistake: 'Dropping units and significant figures',
    detail: 'An unlabelled answer is incomplete, and an implausible number of significant figures signals a rounding decision that was never made deliberately.',
    fix: 'Carry units through the substitution and round once at the end, to the accuracy the question asks for.',
  },
  {
    mistake: 'Vague evaluation in the practical',
    detail: 'Statements like "there was human error" earn nothing. Analysis and evaluation marks want a specific limitation and its direction of effect.',
    fix: 'Name one concrete source, say which way it pushed the result, and suggest a change that would reduce it.',
  },
  {
    mistake: 'Learning topics in isolation',
    detail: 'Both Papers 2 and 3 include questions requiring you to integrate knowledge from different areas of the syllabus.',
    fix: 'Practise problems that cross topics, and note which combinations recur.',
  },
  {
    mistake: 'Never rehearsing the full practical',
    detail: 'Two sections with 1 h 15 min of apparatus access each is a pacing exercise as much as a technique one, and it is the component most students rehearse least.',
    fix: 'Run at least one complete practical to time, including the data processing and the written analysis.',
  },
];

export default function HowToStudyH2Physics() {
  const whatsappMessage = `Hi LionCity Tutors! I'd like help finding an H2 Physics tutor.

Student level (e.g. JC1 / JC2):
Current grade:
Location:
Preferred days & timing: `;
  const whatsappHref = `https://wa.me/6588701152?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <>
      <GuideSchema
        slug="how-to-study-h2-physics"
        article={{
          headline: 'How to Study for H2 Physics (9478): Spreadsheets and Marks',
          description:
            'The spreadsheet skills the practical now requires, what Data and Formulae are printed for you, and the 10 mistakes our tutors correct most.',
          datePublished: '2026-08-26',
          dateModified: '2026-08-26',
        }}
      />
      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16">
        <div className="mx-auto max-w-2xl lg:max-w-none lg:grid lg:grid-cols-[minmax(0,42rem)_15rem] lg:justify-center lg:gap-12">
          <div>
            <GuideHeader
              title="How to Study for H2 Physics"
              author="By the LionCity Tutors science team"
              meta="Updated August 26, 2026 · 10 min read"
            />

            <article className="space-y-12 text-gray-700 leading-relaxed">
              <p className="text-lg text-gray-800 leading-relaxed text-pretty">
                H2 Physics contains a requirement that has nothing to do with physics and can quietly cost marks in a paper worth a fifth of the grade: the practical expects you to process and analyse data using spreadsheet software. It is stated in the syllabus, it is rarely taught, and it is entirely learnable in an afternoon.
              </p>

              <KeyTakeaways
                items={[
                  <>The practical requires <strong>processing data with spreadsheet software</strong>. Paper 4 is 20%.</>,
                  <><strong>Data and Formulae are printed</strong> in the papers — memorising them is wasted revision.</>,
                  <>Applying and evaluating information is <strong>44%</strong>; knowledge is 36%.</>,
                  <>Paper 3 is <strong>35%</strong>; Paper 1, the multiple choice, is <strong>15%</strong>.</>,
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
                <SectionHeading icon={Scale}>Four papers, uneven weights</SectionHeading>
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
                  One detail inside Paper 4 is worth noting on its own: Planning is only <strong>4%</strong> of the subject here, where at O-Level it is 15% of the practical. The weight has moved to manipulation, presentation of data, and analysis — the parts a spreadsheet is used for.
                </p>
              </section>

              <section id="practical" className="scroll-mt-24">
                <SectionHeading icon={Table2}>The practical wants spreadsheets</SectionHeading>
                <p className="text-pretty">
                  The syllabus states that candidates will be required to process and analyse data using spreadsheet software, and that questions on data analysis may appear without any apparatus at all. Twenty per cent of the subject sits in this paper.
                </p>
                <GuideCard className="mt-5">
                  <h4 className="font-semibold text-gray-900 mb-3">What to be fluent in before the exam</h4>
                  <ul className="list-disc ml-5 space-y-1.5 text-sm text-gray-700">
                    {spreadsheetSkills.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                </GuideCard>
                <p className="mt-4 text-pretty">
                  None of this is difficult, and none of it is physics — which is precisely why it goes unrehearsed. A student who has never computed a derived column with a formula will do it by hand under time pressure and lose minutes they needed for the analysis. An afternoon of practice removes the problem permanently.
                </p>
              </section>

              <section id="provided" className="scroll-mt-24">
                <SectionHeading icon={BookOpen}>Data and Formulae are printed</SectionHeading>
                <p className="text-pretty">
                  Data and Formulae are provided in the papers, alongside a published set of mathematical requirements. As in the other sciences, the useful question is not what is on the sheet but what is not.
                </p>
                <p className="mt-4 text-pretty">
                  Constants and standard relationships are handed over. What you must carry is the reasoning: which relationship applies to a given situation, why, and what the algebra does next. Memorising the sheet is the single most common piece of wasted revision in this subject, and it is wasted in a subject where 44% of the marks are for applying rather than knowing.
                </p>
              </section>

              <section id="revision" className="scroll-mt-24">
                <SectionHeading icon={Repeat}>How to revise H2 Physics</SectionHeading>
                <GuideCard className="mt-4">
                  <ul className="list-disc ml-5 space-y-2 text-sm text-gray-700">
                    <li><strong>Spend an afternoon on spreadsheets.</strong> It is a stated requirement of a 20% paper and it is not physics.</li>
                    <li><strong>Weight practice to Papers 2 and 3</strong> — 65% of the grade between them.</li>
                    <li><strong>Work unseen problems</strong> rather than rereading. Applying is 44% of the marks.</li>
                    <li><strong>Practise data-based stems</strong> specifically; they are a third of Paper 2.</li>
                    <li><strong>Drill evaluation language</strong> — a named limitation and its direction, never "human error".</li>
                    <li><strong>Use unseen past papers.</strong> Prelim and past-year JC Physics papers are in our <Link href="/free-test-papers" className="text-primary underline underline-offset-2">free test papers library</Link>.</li>
                    <li><strong>Close the two 9478 gaps first.</strong> Capacitance and wavefunctions are new to this syllabus, so older material does not cover them. Our free <Link href="/free-notes" className="text-primary underline underline-offset-2">H2 Physics study notes</Link> carry all six sections against 9478, with the legacy 9749 set kept alongside for private and repeat candidates.</li>
                  </ul>
                </GuideCard>
                <p className="mt-4 text-pretty">
                  For topic-by-topic coverage of syllabus 9478, see our{' '}
                  <Link href="/a-level-physics" className="text-primary underline underline-offset-2">A-Level H2 Physics subject guide</Link>. This page is about where the marks are; that one is about what is on the syllabus.
                </p>
              </section>

              <section id="mistakes" className="scroll-mt-24">
                <SectionHeading icon={TriangleAlert}>10 common H2 Physics mistakes</SectionHeading>
                <p className="text-gray-700 mb-5">
                  These are the ones our tutors correct most often across the four papers, and what to do instead.
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
                Paper structure, weightings, assessment objectives and the practical requirements are from the Singapore-Cambridge GCE A-Level H2 Physics syllabus 9478 (2026), published by SEAB. Always check the current syllabus for your exam year.
              </p>

              <RelatedGuides slug="how-to-study-h2-physics" />

              <GuideCTA
                title="Get an H2 Physics tutor who marks like an examiner"
                description={`Tell us where the marks are going — structured papers, data questions or the practical. We hand-match a vetted H2 Physics tutor, usually within ${MATCH_TIME}, and parents never pay an agency fee.`}
                buttonText="Find an H2 Physics tutor"
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
