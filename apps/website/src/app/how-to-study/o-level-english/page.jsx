import { MATCH_TIME } from '@/data/promises';
import { DEFAULT_OG_IMAGE } from '@/lib/seo/openGraph';

export const metadata = {
  title: 'How to Study for O-Level English (1184): Oral Is 20%',
  description:
    'How to study for O-Level English — why Oral is 20% of the grade, which listening section is played only once, and the 10 mistakes our tutors correct most.',
  keywords: [
    'how to study for o level english',
    'O Level English 1184',
    'O Level English oral weighting',
    'O Level English paper 2 summary',
    'situational writing O Level',
    'O Level english listening compre',
  ],
  openGraph: {
    images: [DEFAULT_OG_IMAGE],
    title: 'How to Study for O-Level English (1184): Oral Is 20%',
    description:
      'Why Oral is 20% of the grade, which listening section is played only once, and the 10 mistakes our tutors correct most.',
    url: 'https://www.lioncitytutors.com/how-to-study/o-level-english',
    type: 'article',
  },
  alternates: {
    canonical: 'https://www.lioncitytutors.com/how-to-study/o-level-english',
  },
};

import Link from 'next/link';
import TableOfContents from '@/components/TableOfContents';
import GuideSchema from '@/components/seo/GuideSchema';
import {
  GuideHeader, SectionHeading, GuideCard, KeyTakeaways, GuideCTA, ICON_STROKE,
  RelatedGuides,
} from '@/components/guide';
import { Scale, Mic, Headphones, Eye, Repeat, TriangleAlert, ListChecks } from 'lucide-react';

const tableOfContents = [
  { id: 'mark-map', label: 'All 180 marks, section by section' },
  { id: 'oral', label: 'Oral is a fifth of the grade' },
  { id: 'listening', label: 'The section played only once' },
  { id: 'visual', label: 'The visual texts nobody practises' },
  { id: 'revision', label: 'How to revise English' },
  { id: 'mistakes', label: '10 common mistakes' },
];

const papers = [
  {
    paper: 'Paper 1 — Writing',
    stat: '70 marks · 35% · 1 h 50 min',
    sections: [
      ['Section A — Editing', '10 marks', 'Identify and correct grammatical errors in a text of up to 250 words.'],
      ['Section B — Situational Writing', '30 marks', '250–350 words on a given situation, involving a visual text.'],
      ['Section C — Continuous Writing', '30 marks', '350–500 words on one of four topics set.'],
    ],
  },
  {
    paper: 'Paper 2 — Comprehension',
    stat: '50 marks · 35% · 1 h 50 min',
    sections: [
      ['Section A', '5 marks', 'Questions on Texts 1 and 2, one of which is a visual text.'],
      ['Section B', '20 marks', 'Questions on Text 3, a narrative or a recount.'],
      ['Section C', '25 marks', 'Questions on Text 4, a non-narrative text, plus an 80-word summary task.'],
    ],
  },
  {
    paper: 'Paper 3 — Listening',
    stat: '30 marks · 10% · about 45 min',
    sections: [
      ['Section A', '22 marks', 'Tasks based on several audio recordings, each heard twice.'],
      ['Section B', '8 marks', 'A note-taking exercise on a recording heard only once.'],
    ],
  },
  {
    paper: 'Paper 4 — Oral Communication',
    stat: '30 marks · 20% · about 20 min',
    sections: [
      ['Part 1 — Planned Response', '15 marks', 'Plan and deliver a response to a video clip and prompt on screen.'],
      ['Part 2 — Spoken Interaction', '15 marks', 'Discussion with the examiners on a topic from the same clip.'],
    ],
  },
];

const commonMistakes = [
  {
    mistake: 'Treating Oral as the paper that looks after itself',
    detail: 'Oral Communication is 20% of the grade — double the Listening paper, and worth more than Editing and Situational Writing combined. It is also the paper students rehearse least, because it cannot be done from a worksheet.',
    fix: 'Practise aloud, weekly, with someone who will push back. Twenty per cent of a subject cannot be revised silently.',
  },
  {
    mistake: 'Wasting the ten minutes of preparation',
    detail: 'The oral paper runs about twenty minutes including ten minutes of preparation time. That preparation is half the clock and is the only part fully under your control.',
    fix: 'Have a fixed plan for those ten minutes: what the clip is about, your position, two reasons, one example. Rehearse the routine, not just the speaking.',
  },
  {
    mistake: 'Not knowing Section B of Listening is played once',
    detail: 'Section A recordings are heard twice. The Section B note-taking exercise is heard only once, and students expecting a second pass lose the marks in the first thirty seconds.',
    fix: 'Practise single-play note-taking specifically. Write while listening rather than after, and use abbreviations you can read back.',
  },
  {
    mistake: 'Over-investing in Paper 2 Section A',
    detail: 'It is worth 5 marks. Section C is worth 25, including the summary. Students routinely spend disproportionate time on the opening section because it comes first.',
    fix: 'Budget by mark value. Five marks should not consume a quarter of the paper.',
  },
  {
    mistake: 'Writing a summary that is not 80 words',
    detail: 'The summary task in Section C specifies an 80-word response. Overrunning wastes time and usually pulls in material the question did not ask for.',
    fix: 'Practise selecting points first, then compressing. Learn what 80 of your own words looks like so you are not counting in the exam.',
  },
  {
    mistake: 'Ignoring the visual texts',
    detail: 'A visual text appears in Paper 1 Section B and again in Paper 2 Section A. Reading images, charts and layout for meaning is a distinct skill, and almost nobody drills it.',
    fix: 'Practise describing what a visual conveys and why it was designed that way — audience, purpose, the choice of image.',
  },
  {
    mistake: 'Rushing the Editing section',
    detail: 'Ten marks in a text of no more than 250 words is dense. Students skim it because it looks mechanical, and miss errors that a slower read would catch.',
    fix: 'Read line by line looking for one error class at a time — tense, agreement, preposition — rather than reading for sense.',
  },
  {
    mistake: 'Continuous Writing chosen on the topic that sounds nicest',
    detail: 'Four topics are set and one is chosen, for 30 marks. The appealing title often has less material behind it than the plain one.',
    fix: 'Spend ninety seconds planning two options before committing. Choose the one where you already have concrete content.',
  },
  {
    mistake: 'Situational Writing without reading the situation',
    detail: 'These 30 marks depend on purpose, audience and format as much as on language. An excellent piece of writing in the wrong register loses marks it never had to.',
    fix: 'Underline who you are writing to, why, and in what form — before planning a single sentence.',
  },
  {
    mistake: 'Revising English as though it were content',
    detail: 'There is nothing to memorise here. Every one of the 180 marks is a performance under time, in writing, reading, listening or speech.',
    fix: 'Replace rereading with production. Write one timed piece and speak one timed response each week, and have both marked.',
  },
];

export default function HowToStudyOLevelEnglish() {
  const whatsappMessage = `Hi LionCity Tutors! I'd like help finding an O Level English tutor.

Student level (e.g. Sec 3 / Sec 4):
Current grade:
Location:
Preferred days & timing: `;
  const whatsappHref = `https://wa.me/6588701152?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <>
      <GuideSchema
        slug="how-to-study-o-level-english"
        article={{
          headline: 'How to Study for O-Level English (1184): Oral Is 20%',
          description:
            'Why Oral is 20% of the grade, which listening section is played only once, and the 10 mistakes our tutors correct most.',
          datePublished: '2026-08-26',
          dateModified: '2026-08-26',
        }}
      />
      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16">
        <div className="mx-auto max-w-2xl lg:max-w-none lg:grid lg:grid-cols-[minmax(0,42rem)_15rem] lg:justify-center lg:gap-12">
          <div>
            <GuideHeader
              title="How to Study for O-Level English"
              author="By the LionCity Tutors humanities team"
              meta="Updated August 26, 2026 · 11 min read"
            />

            <article className="space-y-12 text-gray-700 leading-relaxed">
              <p className="text-lg text-gray-800 leading-relaxed text-pretty">
                O-Level English is four papers and 180 marks, and the way those marks are distributed rarely matches how students spend their time. The clearest example: the paper worth a fifth of the grade is the one that cannot be practised from a worksheet, so it usually is not practised at all.
              </p>

              <KeyTakeaways
                items={[
                  <><strong>Oral is 20%</strong> — double the Listening paper, and more than Editing and Situational Writing together.</>,
                  <>Listening <strong>Section B is played only once</strong>; Section A is played twice.</>,
                  <>Paper 2 Section A is <strong>5 marks</strong>. Section C is <strong>25</strong>.</>,
                  <>A <strong>visual text</strong> appears in both Paper 1 and Paper 2.</>,
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
                <SectionHeading icon={Scale}>All 180 marks, section by section</SectionHeading>
                <p className="text-pretty">
                  Four compulsory papers. Writing and Comprehension carry 35% each; Oral carries 20% and Listening 10%.
                </p>
                <div className="mt-5 space-y-4">
                  {papers.map((item) => (
                    <GuideCard key={item.paper}>
                      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 mb-3">
                        <h3 className="font-semibold text-gray-900">{item.paper}</h3>
                        <span className="text-sm font-semibold text-primary tabular-nums">{item.stat}</span>
                      </div>
                      <ul className="space-y-2 text-sm">
                        {item.sections.map(([name, marks, detail]) => (
                          <li key={name}>
                            <span className="font-medium text-gray-900">{name}</span>
                            <span className="text-primary tabular-nums"> · {marks}</span>
                            <br />
                            <span className="text-gray-700">{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </GuideCard>
                  ))}
                </div>
              </section>

              <section id="oral" className="scroll-mt-24">
                <SectionHeading icon={Mic}>Oral is a fifth of the grade</SectionHeading>
                <p className="text-pretty">
                  Thirty marks, 20% of the subject, in about twenty minutes — of which ten are preparation. Part 1 is a planned response to a video clip and prompt shown on a screen; Part 2 is a discussion with the examiners on a topic drawn from the same clip, and the two parts may be thematically linked.
                </p>
                <GuideCard className="mt-5">
                  <h3 className="font-semibold text-gray-900 mb-3">What the ten minutes of preparation are for</h3>
                  <ul className="list-disc ml-5 space-y-1.5 text-sm text-gray-700">
                    <li><strong>Decide your position</strong> on the prompt before deciding how to phrase it.</li>
                    <li><strong>Choose two reasons</strong> you can develop, rather than five you can only mention.</li>
                    <li><strong>Find one concrete example</strong> — personal, local, or from something you have read.</li>
                    <li><strong>Anticipate the discussion.</strong> Part 2 comes from the same clip, so the thinking carries over.</li>
                  </ul>
                </GuideCard>
                <p className="mt-4 text-pretty">
                  This is the most improvable paper in the subject and the least rehearsed, because it needs a listener. A weekly twenty-minute run-through with someone willing to ask follow-up questions is worth more than any amount of silent revision.
                </p>
              </section>

              <section id="listening" className="scroll-mt-24">
                <SectionHeading icon={Headphones}>The section played only once</SectionHeading>
                <p className="text-pretty">
                  Paper 3 has an asymmetry that costs marks every year. Section A, worth 22 marks, is based on recordings heard <strong>twice</strong>. Section B, the note-taking exercise worth 8 marks, is heard <strong>once</strong>.
                </p>
                <p className="mt-4 text-pretty">
                  Students who have practised with replayable audio develop the habit of listening first and writing second. That habit is fine for Section A and fatal for Section B. Practise single-play note-taking on its own: write while listening, use abbreviations you can decode afterwards, and accept an incomplete note over a missed minute.
                </p>
              </section>

              <section id="visual" className="scroll-mt-24">
                <SectionHeading icon={Eye}>The visual texts nobody practises</SectionHeading>
                <p className="text-pretty">
                  A visual text appears twice in this subject: in Paper 1 Section B, where situational writing involves viewing one, and in Paper 2 Section A, where one of the two texts is visual.
                </p>
                <GuideCard className="mt-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Reading a visual for marks</h3>
                  <ul className="list-disc ml-5 space-y-1.5 text-sm text-gray-700">
                    <li><strong>Purpose</strong> — what is this trying to make the viewer do or believe?</li>
                    <li><strong>Audience</strong> — who was it made for, and what shows that?</li>
                    <li><strong>Choices</strong> — image, colour, layout, prominence. Each was decided by someone.</li>
                    <li><strong>What it omits</strong> — often as informative as what it includes.</li>
                  </ul>
                </GuideCard>
                <p className="mt-4 text-pretty">
                  It is a small, learnable skill that most candidates arrive without, because reading practice is almost always prose.
                </p>
              </section>

              <section id="revision" className="scroll-mt-24">
                <SectionHeading icon={Repeat}>How to revise English</SectionHeading>
                <GuideCard className="mt-4">
                  <ul className="list-disc ml-5 space-y-2 text-sm text-gray-700">
                    <li><strong>Practise aloud every week.</strong> Oral is 20% and cannot be revised on paper.</li>
                    <li><strong>Do single-play listening drills</strong> for the note-taking section specifically.</li>
                    <li><strong>Budget Paper 2 by mark value</strong> — 5, 20, 25 — rather than by section order.</li>
                    <li><strong>Write one timed piece a week and have it marked.</strong> Writing is 70 marks and improves only through production.</li>
                    <li><strong>Read visuals deliberately</strong> — advertisements, infographics, posters — for purpose and audience.</li>
                    <li><strong>Use past papers to time.</strong> Prelim and past-year O-Level English papers are in our <Link href="/free-test-papers" className="text-primary underline underline-offset-2">free test papers library</Link>.</li>
                    <li><strong>Keep the situational formats to hand.</strong> Our free <Link href="/free-notes" className="text-primary underline underline-offset-2">O-Level English study guide</Link> sets out all six text types with their conventions, plus a task-numbering method that makes every required content point visible to the marker &mdash; the fix for the most common situational writing loss.</li>
                  </ul>
                </GuideCard>
                <p className="mt-4 text-pretty">
                  For fuller coverage of the syllabus and its components, see our{' '}
                  <Link href="/o-level-english" className="text-primary underline underline-offset-2">O-Level English subject guide</Link>. This page is about where the marks are; that one is about what the papers contain.
                </p>
              </section>

              <section id="mistakes" className="scroll-mt-24">
                <SectionHeading icon={TriangleAlert}>10 common O-Level English mistakes</SectionHeading>
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
                Paper structure, section mark allocations and the listening-replay rules are from the Singapore-Cambridge GCE O-Level English Language syllabus 1184 (2026), published by SEAB. Always check the current syllabus for your exam year.
              </p>

              <RelatedGuides slug="how-to-study-o-level-english" />

              <GuideCTA
                title="Get an English tutor who marks like an examiner"
                description={`Tell us where the marks are going — writing, comprehension, oral or listening. We hand-match a vetted O-Level English tutor, usually within ${MATCH_TIME}, and parents never pay an agency fee.`}
                buttonText="Find an O-Level English tutor"
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
