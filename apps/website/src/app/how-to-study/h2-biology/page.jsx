import { MATCH_TIME } from '@/data/promises';
import { DEFAULT_OG_IMAGE } from '@/lib/seo/openGraph';

export const metadata = {
  title: 'How to Study for H2 Biology (9477): Reading the Unfamiliar',
  description:
    'How to study for A-Level H2 Biology — why Paper 3 uses journal extracts that need not be on the syllabus, where writing quality is marked, and 10 mistakes.',
  keywords: [
    'how to study for h2 biology',
    'H2 Biology 9477',
    'h2 bio syllabus',
    'H2 biology paper 3 stimulus',
    'H2 biology free response question',
    'a level biology Singapore',
  ],
  openGraph: {
    images: [DEFAULT_OG_IMAGE],
    title: 'How to Study for H2 Biology (9477): Reading the Unfamiliar',
    description:
      'Why Paper 3 uses journal extracts that need not be on the syllabus, where writing quality is marked, and the 10 mistakes our tutors correct most.',
    url: 'https://www.lioncitytutors.com/how-to-study/h2-biology',
    type: 'article',
  },
  alternates: {
    canonical: 'https://www.lioncitytutors.com/how-to-study/h2-biology',
  },
};

import Link from 'next/link';
import TableOfContents from '@/components/TableOfContents';
import GuideSchema from '@/components/seo/GuideSchema';
import {
  GuideHeader, SectionHeading, GuideCard, KeyTakeaways, GuideCTA, ICON_STROKE,
  RelatedGuides,
} from '@/components/guide';
import { Scale, FileSearch, PenLine, Repeat, TriangleAlert, ListChecks } from 'lucide-react';

const tableOfContents = [
  { id: 'mark-map', label: 'Four papers, uneven weights' },
  { id: 'stimulus', label: 'Biology you have not been taught' },
  { id: 'writing', label: 'Where writing is marked' },
  { id: 'revision', label: 'How to revise H2 Biology' },
  { id: 'mistakes', label: '10 common mistakes' },
];

const papers = [
  {
    paper: 'Paper 1 — Multiple Choice',
    stat: '1 h · 30 marks · 15%',
    detail: '30 compulsory questions, each with four options.',
  },
  {
    paper: 'Paper 2 — Structured',
    stat: '2 h · 90 marks · 30%',
    detail: 'A variable number of compulsory structured questions, including data-based and comprehension-type questions, some requiring you to integrate different areas of the syllabus.',
  },
  {
    paper: 'Paper 3 — Long Structured and Free Response',
    stat: '2 h · 75 marks · 35%',
    detail: 'Section A is 55 marks of long structured questions built on stimulus material. Section B is 20 marks: two free-response questions, of which you answer one.',
  },
  {
    paper: 'Paper 4 — Practical',
    stat: '2 h 30 min · 50 marks · 20%',
    detail: 'Experimental skills across planning, manipulation and observation, presentation of data, and analysis and evaluation.',
  },
];

const stimulusTasks = [
  'Explain terms used in the passage — including ones you meet for the first time there.',
  'Analyse the data presented in the stimulus.',
  'Justify a decision on the basis of what the material shows.',
  'Perform calculations using values supplied in the passage.',
  'Draw conclusions grounded in the stimulus rather than in recalled content.',
];

const commonMistakes = [
  {
    mistake: 'Assuming every question comes from the syllabus content',
    detail: 'Paper 3 Section A is built on stimulus material that may be taken or adapted from a scientific journal or book, and the syllabus states it may not relate directly to the syllabus content. Fifty-five marks can sit on biology you were never taught.',
    fix: 'Practise reading unfamiliar science and answering from the page. The skill is comprehension under time, and it improves with rehearsal.',
  },
  {
    mistake: 'Not knowing that writing quality is marked',
    detail: 'In Paper 3 Section B, a percentage of the marks is given for the quality of scientific argumentation and written communication. Biology is the last subject most students expect to be marked on prose.',
    fix: 'Plan free-response answers before writing, and build an argument rather than a list. Those marks are available to anyone who structures the answer.',
  },
  {
    mistake: 'Revising by memorising content',
    detail: 'Handling, applying and evaluating information carries 44% of the marks against 36% for knowledge with understanding. Content is the entry requirement.',
    fix: 'Convert revision into unseen questions. If a session produced nothing unfamiliar, it worked the smaller category.',
  },
  {
    mistake: 'Giving Paper 1 the most practice time',
    detail: 'Multiple choice is fast to do and instantly marked, and it is 15% — the smallest of the four papers. Paper 3 is 35%.',
    fix: 'Weight practice to Papers 2 and 3, which are 65% between them.',
  },
  {
    mistake: 'Explaining without using the data given',
    detail: 'Data-based and comprehension questions expect the answer to be grounded in the material supplied. An explanation drawn purely from memory misses the marks tied to the stimulus.',
    fix: 'Quote figures, name the trend, and reference the passage explicitly before adding what you know.',
  },
  {
    mistake: 'Choosing the Section B question too quickly',
    detail: 'Two free-response questions are offered and one is answered, worth 20 marks — and the recognisable opening is often attached to the harder second half.',
    fix: 'Read both in full before committing. Two minutes of reading protects a fifth of the paper.',
  },
  {
    mistake: 'Learning topics as separate chapters',
    detail: 'The syllabus states that questions in Papers 2 and 3 require integrating knowledge from different areas. Biology at this level is examined as connected systems.',
    fix: 'Revise the joins deliberately — build maps linking topics and redraw them from memory rather than rereading.',
  },
  {
    mistake: 'Imprecise terminology under pressure',
    detail: 'At H2 the distinctions between related processes carry marks, and a near-synonym in the wrong place usually loses one outright.',
    fix: 'Learn terms as contrasted sets, with the distinction written next to each, rather than one at a time.',
  },
  {
    mistake: 'Ignoring the assumed physical-science background',
    detail: 'The syllabus notes that students should know topics such as the electromagnetic spectrum and energy changes, sufficient to understand biological systems. No questions are set directly on them, but they underpin explanations.',
    fix: 'Check the additional-information list early. Gaps there make otherwise straightforward explanations harder than they should be.',
  },
  {
    mistake: 'Leaving the practical to look after itself',
    detail: 'Paper 4 is 20% — larger than Paper 1 — and rewards planning, observation and evaluation technique that theory revision never touches.',
    fix: 'Rehearse recording and evaluation specifically. Those marks are available even when an experiment goes imperfectly.',
  },
];

export default function HowToStudyH2Biology() {
  const whatsappMessage = `Hi LionCity Tutors! I'd like help finding an H2 Biology tutor.

Student level (e.g. JC1 / JC2):
Current grade:
Location:
Preferred days & timing: `;
  const whatsappHref = `https://wa.me/6588701152?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <>
      <GuideSchema
        slug="how-to-study-h2-biology"
        article={{
          headline: 'How to Study for H2 Biology (9477): Reading the Unfamiliar',
          description:
            'Why Paper 3 uses journal extracts that need not be on the syllabus, where writing quality is marked, and the 10 mistakes our tutors correct most.',
          datePublished: '2026-08-26',
          dateModified: '2026-08-26',
        }}
      />
      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16">
        <div className="mx-auto max-w-2xl lg:max-w-none lg:grid lg:grid-cols-[minmax(0,42rem)_15rem] lg:justify-center lg:gap-12">
          <div>
            <GuideHeader
              title="How to Study for H2 Biology"
              author="By the LionCity Tutors science team"
              meta="Updated August 26, 2026 · 11 min read"
            />

            <article className="space-y-12 text-gray-700 leading-relaxed">
              <p className="text-lg text-gray-800 leading-relaxed text-pretty">
                H2 Biology contains a feature that surprises students in the exam hall every year: a section built on material drawn from scientific journals, which the syllabus says need not relate directly to the syllabus content. Fifty-five marks can rest on biology nobody taught you. That is not a flaw in your preparation — it is the design, and it can be prepared for.
              </p>

              <KeyTakeaways
                items={[
                  <>Paper 3 Section A uses <strong>journal-derived stimulus</strong> that may not relate to the syllabus content.</>,
                  <>In Section B, <strong>scientific argumentation and written communication</strong> carry a percentage of the marks.</>,
                  <>Applying and evaluating information is <strong>44%</strong> of the marks; knowledge is 36%.</>,
                  <>Paper 3 is <strong>35%</strong> of the grade. Paper 1, the multiple choice, is <strong>15%</strong>.</>,
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
                      <a href={`#${item.id}`} className="text-gray-700 hover:text-primary transition-colors">{item.label}</a>
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
                  Papers 2 and 3 carry 65% between them. Paper 1 carries 15%, and is the one most students practise hardest because it is quick and self-marking.
                </p>
              </section>

              <section id="stimulus" className="scroll-mt-24">
                <SectionHeading icon={FileSearch}>Biology you have not been taught</SectionHeading>
                <p className="text-pretty">
                  Section A of Paper 3 is 55 marks of long structured questions built around one or more stimulus materials, which may be taken or adapted from a source such as a scientific journal or book. The syllabus states plainly that this material may not necessarily relate directly to the content of the syllabus.
                </p>
                <GuideCard className="mt-5">
                  <h4 className="font-semibold text-gray-900 mb-3">What those questions ask you to do</h4>
                  <ul className="list-disc ml-5 space-y-1.5 text-sm text-gray-700">
                    {stimulusTasks.map((task) => (
                      <li key={task}>{task}</li>
                    ))}
                  </ul>
                </GuideCard>
                <p className="mt-4 text-pretty">
                  Read that list again and notice what it does not contain: recall. Every task is something you do <em>to a passage</em>. A student who has spent a year memorising content and never practised reading unfamiliar science is unprepared for the largest section of the heaviest paper — not because they know too little, but because they trained the wrong skill.
                </p>
                <p className="mt-4 text-pretty">
                  This is also the most improvable part of the subject, because comprehension responds quickly to practice. Reading one piece of real science a week, and answering questions on it without looking anything up, is a more direct rehearsal than another pass through the notes.
                </p>
              </section>

              <section id="writing" className="scroll-mt-24">
                <SectionHeading icon={PenLine}>Where writing quality is marked</SectionHeading>
                <p className="text-pretty">
                  Section B of Paper 3 offers two free-response questions, of which you answer one, for 20 marks. The syllabus adds a detail that catches people out: a percentage of the marks available is given for the quality of scientific argumentation and written communication.
                </p>
                <GuideCard className="mt-4">
                  <h4 className="font-semibold text-gray-900 mb-3">What that rewards</h4>
                  <ul className="list-disc ml-5 space-y-1.5 text-sm text-gray-700">
                    <li><strong>An argument, not a list.</strong> Points in a defensible order, each one developed.</li>
                    <li><strong>Precise terminology,</strong> used correctly rather than approximately.</li>
                    <li><strong>Explicit connections</strong> where the question spans more than one process.</li>
                    <li><strong>A plan before the first sentence,</strong> which is what prevents repetition and omission.</li>
                    <li><strong>An answer to the question asked</strong> — not everything known about the topic.</li>
                  </ul>
                </GuideCard>
                <p className="mt-4 text-pretty">
                  Biology is the last subject most students expect to be marked on prose, which is exactly why these marks are available. One planned answer a week, marked for structure as well as content, is enough to claim them.
                </p>
              </section>

              <section id="revision" className="scroll-mt-24">
                <SectionHeading icon={Repeat}>How to revise H2 Biology</SectionHeading>
                <GuideCard className="mt-4">
                  <ul className="list-disc ml-5 space-y-2 text-sm text-gray-700">
                    <li><strong>Read unfamiliar science weekly.</strong> A journal abstract or a science article, answered without lookups, rehearses the largest section of Paper 3 directly.</li>
                    <li><strong>Plan free-response answers before writing,</strong> since argumentation and communication carry marks of their own.</li>
                    <li><strong>Weight practice to Papers 2 and 3</strong> — 65% of the grade between them.</li>
                    <li><strong>Ground every explanation in the data given,</strong> quoting figures before adding recalled content.</li>
                    <li><strong>Revise the joins between topics,</strong> which the syllabus says questions will require.</li>
                    <li><strong>Use unseen past papers.</strong> Prelim and past-year JC Biology papers are in our <Link href="/free-test-papers" className="text-primary underline underline-offset-2">free test papers library</Link>.</li>
                  </ul>
                </GuideCard>
                <p className="mt-4 text-pretty">
                  For topic-by-topic coverage of syllabus 9477, see our{' '}
                  <Link href="/a-level-biology" className="text-primary underline underline-offset-2">A-Level H2 Biology subject guide</Link>. This page is about where the marks are; that one is about what is on the syllabus.
                </p>
              </section>

              <section id="mistakes" className="scroll-mt-24">
                <SectionHeading icon={TriangleAlert}>10 common H2 Biology mistakes</SectionHeading>
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
                Paper structure, weightings, assessment objectives and the description of the Paper 3 stimulus material are from the Singapore-Cambridge GCE A-Level H2 Biology syllabus 9477 (2026), published by SEAB. Always check the current syllabus for your exam year.
              </p>

              <RelatedGuides slug="how-to-study-h2-biology" />

              <GuideCTA
                title="Get an H2 Biology tutor who marks like an examiner"
                description={`Tell us where the marks are going — data questions, free response or the practical. We hand-match a vetted H2 Biology tutor, usually within ${MATCH_TIME}, and parents never pay an agency fee.`}
                buttonText="Find an H2 Biology tutor"
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
