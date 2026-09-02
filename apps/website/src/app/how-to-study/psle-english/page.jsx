import { MATCH_TIME } from '@/data/promises';
import { DEFAULT_OG_IMAGE } from '@/lib/seo/openGraph';

export const metadata = {
  title: 'How to Study for PSLE English (0001): 40 Marks in 10 Min',
  description:
    'How to study for PSLE English — why Oral carries 40 marks in about ten minutes, how Paper 2 splits across its two booklets, and the 10 mistakes to avoid.',
  keywords: [
    'how to study for psle english',
    'PSLE English 0001',
    'psle english paper format',
    'psle english oral marks',
    'psle english paper 2 booklet a b',
    'psle situational writing',
  ],
  openGraph: {
    images: [DEFAULT_OG_IMAGE],
    title: 'How to Study for PSLE English (0001): 40 Marks in 10 Min',
    description:
      'Why Oral carries 40 marks in about ten minutes, how Paper 2 splits across its two booklets, and the 10 mistakes our tutors correct most.',
    url: 'https://www.lioncitytutors.com/how-to-study/psle-english',
    type: 'article',
  },
  alternates: {
    canonical: 'https://www.lioncitytutors.com/how-to-study/psle-english',
  },
};

import Link from 'next/link';
import TableOfContents from '@/components/TableOfContents';
import GuideSchema from '@/components/seo/GuideSchema';
import {
  GuideHeader, SectionHeading, GuideCard, KeyTakeaways, GuideCTA, ICON_STROKE,
  RelatedGuides,
} from '@/components/guide';
import { Scale, Mic, PenLine, Repeat, TriangleAlert, ListChecks } from 'lucide-react';

const tableOfContents = [
  { id: 'mark-map', label: 'All 200 marks, paper by paper' },
  { id: 'oral', label: '40 marks in about ten minutes' },
  { id: 'paper-2', label: 'Inside the 45% paper' },
  { id: 'revision', label: 'How to revise PSLE English' },
  { id: 'mistakes', label: '10 common mistakes' },
];

const papers = [
  {
    paper: 'Paper 1 — Writing',
    stat: '50 marks · 25% · 1 h 10 min',
    rows: [
      ['Situational Writing', '14 marks'],
      ['Continuous Writing', '36 marks'],
    ],
  },
  {
    paper: 'Paper 2 — Language Use and Comprehension',
    stat: '90 marks · 45% · 1 h 50 min',
    rows: [
      ['Booklet A — multiple choice', '25 marks'],
      ['Booklet B — open-ended', '65 marks'],
    ],
  },
  {
    paper: 'Paper 3 — Listening Comprehension',
    stat: '20 marks · 10% · about 35 min',
    rows: [['20 multiple-choice items', '20 marks']],
  },
  {
    paper: 'Paper 4 — Oral Communication',
    stat: '40 marks · 20% · about 10 min',
    rows: [
      ['Reading Aloud', '15 marks'],
      ['Stimulus-based Conversation', '25 marks'],
    ],
  },
];

const bookletB = [
  ['Grammar Cloze', '10 marks'],
  ['Editing for Spelling and Grammar', '10 marks'],
  ['Comprehension Cloze', '15 marks'],
  ['Synthesis / Transformation', '10 marks'],
  ['Comprehension', '20 marks'],
];

const commonMistakes = [
  {
    mistake: 'Leaving Oral until the last month',
    detail: 'Oral is 40 marks — 20% of the subject — and more than the Continuous Writing composition is worth. It is also the only paper that cannot be practised silently, which is why it slips.',
    fix: 'Practise aloud weekly from P5 onwards. Reading a passage and talking about a photograph both improve quickly with repetition.',
  },
  {
    mistake: 'Wasting the five minutes of preparation',
    detail: 'The oral paper allows about five minutes of preparation before roughly five minutes of examination. That preparation is half the clock.',
    fix: 'Use a fixed routine: skim the passage for hard words and punctuation, then decide two things to say about the photo and one personal example.',
  },
  {
    mistake: 'Reading aloud too fast',
    detail: 'Reading Aloud is 15 marks and rewards clarity, pronunciation and expression — none of which survive speed. Nervous pupils accelerate.',
    fix: 'Practise pausing at punctuation deliberately. Slower reading sounds more confident and scores better.',
  },
  {
    mistake: 'One-word answers in the conversation',
    detail: 'Stimulus-based Conversation is 25 marks — the single largest component of the oral paper — and rewards developed responses with reasons and examples.',
    fix: 'Answer, then give a reason, then add a personal experience. Three sentences where one was offered.',
  },
  {
    mistake: 'Treating Booklet A as most of Paper 2',
    detail: 'Booklet A is 25 of the 90 marks. Booklet B, the open-ended half, is 65 — including 20 marks of comprehension and 15 of comprehension cloze.',
    fix: 'Weight practice to the written booklet. It carries nearly three times the marks.',
  },
  {
    mistake: 'Composition that ignores the pictures',
    detail: 'Continuous Writing is 36 marks with three pictures supplied on a topic, and the composition must run to at least 150 words in continuous prose.',
    fix: 'Plan before writing: choose the picture or angle you have most material for, then a beginning, a problem, and a resolution.',
  },
  {
    mistake: 'Situational Writing in the wrong register',
    detail: 'Fourteen marks depend on purpose, audience and format — a letter, email or report that suits the situation given. Good English in the wrong form still loses marks.',
    fix: 'Underline who it is for, why, and what format is required, before writing anything.',
  },
  {
    mistake: 'Guessing in Listening without reading ahead',
    detail: 'Twenty multiple-choice items in about 35 minutes leaves time to read questions before each recording begins.',
    fix: 'Read the question and options first so you know what to listen for, rather than listening and hoping.',
  },
  {
    mistake: 'Learning vocabulary as isolated word lists',
    detail: 'Vocabulary, vocabulary cloze and comprehension cloze all test words in context, not definitions in isolation.',
    fix: 'Learn words inside sentences, and practise cloze passages where the surrounding text decides the answer.',
  },
  {
    mistake: 'Never sitting the papers to time',
    detail: 'Paper 2 is 1 hour 50 minutes of sustained written work, and pupils who practise in short sets discover the pacing problem in the exam.',
    fix: 'Sit whole papers to time and review where the minutes went, not just the score.',
  },
];

export default function HowToStudyPsleEnglish() {
  const whatsappMessage = `Hi LionCity Tutors! I'd like help finding a PSLE English tutor.

Student level (e.g. P5 / P6):
Current grade:
Location:
Preferred days & timing: `;
  const whatsappHref = `https://wa.me/6588701152?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <>
      <GuideSchema
        slug="how-to-study-psle-english"
        article={{
          headline: 'How to Study for PSLE English (0001): 40 Marks in 10 Min',
          description:
            'Why Oral carries 40 marks in about ten minutes, how Paper 2 splits across its two booklets, and the 10 mistakes our tutors correct most.',
          datePublished: '2026-08-26',
          dateModified: '2026-08-26',
        }}
      />
      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16">
        <div className="mx-auto max-w-2xl lg:max-w-none lg:grid lg:grid-cols-[minmax(0,42rem)_15rem] lg:justify-center lg:gap-12">
          <div>
            <GuideHeader
              title="How to Study for PSLE English"
              author="By the LionCity Tutors primary team"
              meta="Updated August 26, 2026 · 10 min read"
            />

            <article className="space-y-12 text-gray-700 leading-relaxed">
              <p className="text-lg text-gray-800 leading-relaxed text-pretty">
                PSLE English is four papers and 200 marks. One of them is worth 40 marks and takes about ten minutes, half of which is preparation — and it is the paper most families leave until last, because it is the only one that cannot be done on paper.
              </p>

              <KeyTakeaways
                items={[
                  <><strong>Oral is 40 marks — 20%</strong> — in roughly ten minutes, including about five of preparation.</>,
                  <>Paper 2 is <strong>45%</strong>, and <strong>65 of its 90 marks are open-ended</strong>, not multiple choice.</>,
                  <>Continuous Writing is <strong>36 marks</strong> against 14 for Situational Writing.</>,
                  <>Listening is the smallest paper at <strong>20 marks</strong>.</>,
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
                <SectionHeading icon={Scale}>All 200 marks, paper by paper</SectionHeading>
                <div className="mt-5 space-y-4">
                  {papers.map((item) => (
                    <GuideCard key={item.paper}>
                      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 mb-2">
                        <h4 className="font-semibold text-gray-900">{item.paper}</h4>
                        <span className="text-sm font-semibold text-primary tabular-nums">{item.stat}</span>
                      </div>
                      <ul className="space-y-1 text-sm text-gray-700">
                        {item.rows.map(([name, marks]) => (
                          <li key={name} className="flex justify-between gap-4">
                            <span>{name}</span>
                            <span className="tabular-nums text-gray-900 font-medium shrink-0">{marks}</span>
                          </li>
                        ))}
                      </ul>
                    </GuideCard>
                  ))}
                </div>
              </section>

              <section id="oral" className="scroll-mt-24">
                <SectionHeading icon={Mic}>40 marks in about ten minutes</SectionHeading>
                <p className="text-pretty">
                  Put the two together and the imbalance is obvious. Paper 1 is 50 marks earned across 1 hour 10 minutes of writing. Paper 4 is 40 marks earned in roughly ten minutes, of which about five are preparation time before the examination itself.
                </p>
                <p className="mt-4 text-pretty">
                  Nothing else in PSLE English concentrates marks like that, and nothing else is rehearsed less — because it needs a listener rather than a worksheet.
                </p>
                <GuideCard className="mt-5">
                  <h4 className="font-semibold text-gray-900 mb-3">Reading Aloud — 15 marks</h4>
                  <ul className="list-disc ml-5 space-y-1.5 text-sm text-gray-700">
                    <li><strong>Slow down.</strong> Clarity and expression are what is marked; speed hides both.</li>
                    <li><strong>Pause at punctuation</strong> deliberately — it is the easiest way to sound assured.</li>
                    <li><strong>Scan for hard words</strong> in the preparation minutes and decide how to say them.</li>
                  </ul>
                </GuideCard>
                <GuideCard className="mt-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Stimulus-based Conversation — 25 marks</h4>
                  <ul className="list-disc ml-5 space-y-1.5 text-sm text-gray-700">
                    <li><strong>Answer, reason, example.</strong> Three sentences where one was invited.</li>
                    <li><strong>Have a personal experience ready</strong> — the strongest development is usually something that happened to you.</li>
                    <li><strong>It is a conversation,</strong> not a recitation. Being wrong but engaged scores better than being silent.</li>
                  </ul>
                </GuideCard>
              </section>

              <section id="paper-2" className="scroll-mt-24">
                <SectionHeading icon={PenLine}>Inside the 45% paper</SectionHeading>
                <p className="text-pretty">
                  Paper 2 carries 90 marks — nearly half the subject — and splits unevenly between its two booklets. Booklet A is 25 marks of multiple choice. Booklet B is 65 marks of writing.
                </p>
                <GuideCard className="mt-5">
                  <h4 className="font-semibold text-gray-900 mb-3">Booklet B, component by component</h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    {bookletB.map(([name, marks]) => (
                      <li key={name} className="flex justify-between gap-4">
                        <span>{name}</span>
                        <span className="tabular-nums text-gray-900 font-medium shrink-0">{marks}</span>
                      </li>
                    ))}
                  </ul>
                </GuideCard>
                <p className="mt-4 text-pretty">
                  Comprehension alone is 20 marks and comprehension cloze another 15 — together more than the whole of Booklet A. Practice that leans on multiple-choice worksheets is aimed at the smaller quarter of the paper.
                </p>
              </section>

              <section id="revision" className="scroll-mt-24">
                <SectionHeading icon={Repeat}>How to revise PSLE English</SectionHeading>
                <GuideCard className="mt-4">
                  <ul className="list-disc ml-5 space-y-2 text-sm text-gray-700">
                    <li><strong>Practise oral aloud every week.</strong> Forty marks, ten minutes, and no worksheet can rehearse it.</li>
                    <li><strong>Weight Paper 2 practice to Booklet B</strong> — 65 of its 90 marks.</li>
                    <li><strong>Write one composition a week</strong> and have it marked; Continuous Writing is 36 marks.</li>
                    <li><strong>Learn vocabulary in sentences,</strong> since every vocabulary component tests it in context.</li>
                    <li><strong>Read listening questions before the recording</strong> so you know what to listen for.</li>
                    <li><strong>Sit whole papers to time.</strong> Prelim and past-year primary papers are in our <Link href="/free-test-papers" className="text-primary underline underline-offset-2">free test papers library</Link>.</li>
                    <li><strong>Rehearse the oral out loud, not on paper.</strong> Our free <Link href="/free-notes" className="text-primary underline underline-offset-2">PSLE English study guide</Link> sets out both components &mdash; Reading Aloud at 15 marks and the stimulus-based conversation at 25 &mdash; alongside the writing band descriptors and a phrase bank to draw on.</li>
                  </ul>
                </GuideCard>
                <p className="mt-4 text-pretty">
                  For topic coverage across the primary syllabus, see our{' '}
                  <Link href="/psle-english" className="text-primary underline underline-offset-2">PSLE English subject guide</Link>, and the companion guides for{' '}
                  <Link href="/how-to-study/psle-math" className="text-primary underline underline-offset-2">PSLE Maths</Link> and{' '}
                  <Link href="/how-to-study/psle-science" className="text-primary underline underline-offset-2">PSLE Science</Link>.
                </p>
              </section>

              <section id="mistakes" className="scroll-mt-24">
                <SectionHeading icon={TriangleAlert}>10 common PSLE English mistakes</SectionHeading>
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
                Examination format, component mark allocations and timings are from the PSLE English Language syllabus 0001, for examination from 2026, published by SEAB. Always check the current syllabus for your exam year.
              </p>

              <RelatedGuides slug="how-to-study-psle-english" />

              <GuideCTA
                title="Get a PSLE English tutor who marks like an examiner"
                description={`Tell us where the marks are going — oral, composition, comprehension or grammar. We hand-match a vetted PSLE English tutor, usually within ${MATCH_TIME}, and parents never pay an agency fee.`}
                buttonText="Find a PSLE English tutor"
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
