import { MATCH_TIME } from '@/data/promises';
import { DEFAULT_OG_IMAGE } from '@/lib/seo/openGraph';

export const metadata = {
  title: 'How to Study for O-Level Biology (6093): Beyond Memorising',
  description:
    'How to study for O-Level Biology — why most theory marks are not for recall, how the free-response and data-based questions work, and 10 common mistakes.',
  keywords: [
    'how to study for o level biology',
    'O Level Biology 6093',
    'O Level biology paper 2 structure',
    'biology free response question',
    'biology practical planning',
    'o level biology tips',
  ],
  openGraph: {
    images: [DEFAULT_OG_IMAGE],
    title: 'How to Study for O-Level Biology (6093): Beyond Memorising',
    description:
      'Why most O-Level Biology theory marks are not for recall, how the free-response questions work, and the 10 mistakes our tutors correct most.',
    url: 'https://www.lioncitytutors.com/how-to-study/o-level-biology',
    type: 'article',
  },
  alternates: {
    canonical: 'https://www.lioncitytutors.com/how-to-study/o-level-biology',
  },
};

import Link from 'next/link';
import TableOfContents from '@/components/TableOfContents';
import GuideSchema from '@/components/seo/GuideSchema';
import {
  GuideHeader, SectionHeading, GuideCard, KeyTakeaways, GuideCTA, ICON_STROKE,
  RelatedGuides,
} from '@/components/guide';
import { Scale, Brain, PenLine, Repeat, TriangleAlert, ListChecks } from 'lucide-react';

const tableOfContents = [
  { id: 'memorising', label: 'Why memorising is not enough' },
  { id: 'mark-map', label: 'How the three papers split' },
  { id: 'free-response', label: 'The free-response questions' },
  { id: 'revision', label: 'How to revise Biology' },
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
      'Section A carries 70 marks of compulsory structured questions, ending with one free-response and one data-based question worth 20 marks between them. Section B carries 10 marks: two free-response questions, of which you answer one.',
  },
  {
    paper: 'Paper 3 — Practical',
    stat: '1 h 50 min · 40 marks · 20%',
    detail:
      'Two to three compulsory practical questions, based mainly on experimental skills. No notes or textbooks may be consulted.',
  },
];

const commonMistakes = [
  {
    mistake: 'Revising Biology purely by memorising',
    detail: 'Around 55% of the theory marks are for handling information and solving problems, against roughly 45% for knowledge with understanding. Biology looks like the most memorisable science and is marked like the least.',
    fix: 'Turn revision into questions. Recall gets you to the start line; the larger share of marks is only reachable through unfamiliar material.',
  },
  {
    mistake: 'Describing a process when asked to explain its purpose',
    detail: 'Reciting the stages of a process, correctly and in order, does not answer a question about why it happens or what it achieves.',
    fix: 'Check whether the question wants the sequence or the reason. If it wants the reason, the answer needs a because.',
  },
  {
    mistake: 'Writing free-response answers without structure',
    detail: 'Section B is answered as continuous prose, and unstructured answers repeat themselves, omit stages, and become hard to award marks against.',
    fix: 'Spend a minute planning the points in order before writing. A ten-mark answer usually wants distinct points, not one long paragraph.',
  },
  {
    mistake: 'Choosing the Section B question too quickly',
    detail: 'Two free-response questions are offered and one is answered. Students commit on the topic name and then discover the second half is the unfamiliar part.',
    fix: 'Read both fully before starting. The recognisable opening is often attached to the harder question.',
  },
  {
    mistake: 'Skipping the data-based question',
    detail: 'It carries 8–12 marks and asks for interpretation of a stem you have not seen. It rewards reading graphs and tables carefully, not recall.',
    fix: 'Practise on unfamiliar data specifically. Describe the trend first, quote figures from the data, then explain the biology behind it.',
  },
  {
    mistake: 'Quoting no figures when describing data',
    detail: 'Saying a value "increases" without citing the numbers leaves marks on the table, because the mark scheme usually wants the data referenced.',
    fix: 'Give the direction, then the figures with units, then the explanation. Three moves, and each earns separately.',
  },
  {
    mistake: 'Imprecise biological vocabulary',
    detail: 'Terms like diffusion, osmosis and active transport are not interchangeable, and a near-synonym in the wrong place usually costs the mark outright.',
    fix: 'Learn the terms as a set with their distinctions, rather than one at a time from separate topics.',
  },
  {
    mistake: 'Drawing biological diagrams carelessly',
    detail: 'Marks depend on clear labelling with straight lines that touch the structure, and on proportion — not on artistic quality.',
    fix: 'Label with a ruler, name every structure the question asks for, and never shade or sketch over a boundary you need to be visible.',
  },
  {
    mistake: 'Neglecting the planning marks in the practical',
    detail: 'Planning is assessed in the practical paper and can appear as a written question, so it is available to anyone who has rehearsed writing methods.',
    fix: 'Practise stating the variable to change, the ones to control, the measurements to take, and how you would make the comparison fair.',
  },
  {
    mistake: 'Learning topics without their connections',
    detail: 'Transport, respiration and photosynthesis are set as separate chapters and examined as one system. Questions frequently cross them.',
    fix: 'Build a diagram linking the processes and redraw it from memory rather than rereading the chapters.',
  },
];

export default function HowToStudyOLevelBiology() {
  const whatsappMessage = `Hi LionCity Tutors! I'd like help finding an O Level Biology tutor.

Student level (e.g. Sec 3 / Sec 4):
Current grade:
Location:
Preferred days & timing: `;
  const whatsappHref = `https://wa.me/6588701152?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <>
      <GuideSchema
        slug="how-to-study-o-level-biology"
        article={{
          headline: 'How to Study for O-Level Biology (6093): Beyond Memorising',
          description:
            'Why most O-Level Biology theory marks are not for recall, how the free-response questions work, and the 10 mistakes our tutors correct most.',
          datePublished: '2026-08-26',
          dateModified: '2026-08-26',
        }}
      />
      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16">
        <div className="mx-auto max-w-2xl lg:max-w-none lg:grid lg:grid-cols-[minmax(0,42rem)_15rem] lg:justify-center lg:gap-12">
          <div>
            <GuideHeader
              title="How to Study for O-Level Biology"
              author="By the LionCity Tutors science team"
              meta="Updated August 26, 2026 · 10 min read"
            />

            <article className="space-y-12 text-gray-700 leading-relaxed">
              <p className="text-lg text-gray-800 leading-relaxed text-pretty">
                Biology has a reputation as the science you can memorise, and syllabus 6093 does not agree. Most of the marks in the theory papers are not awarded for knowing things. That single fact explains why hard-working students plateau here more often than in Physics or Chemistry.
              </p>

              <KeyTakeaways
                items={[
                  <>Handling information and solving problems is about <strong>55%</strong> of theory marks; knowledge is about 45%.</>,
                  <>Paper 2 is <strong>half the grade</strong>, and ends Section A with a free-response and a data-based question worth 20 marks together.</>,
                  <>Section B offers <strong>two free-response questions</strong> — you answer one.</>,
                  <>The practical is 20%, and <strong>planning</strong> can be assessed as a written question.</>,
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

              <section id="memorising" className="scroll-mt-24">
                <SectionHeading icon={Brain}>Why memorising is not enough</SectionHeading>
                <p className="text-pretty">
                  The syllabus splits the theory papers between two assessment objectives, and publishes roughly how the marks fall.
                </p>
                <GuideCard className="mt-5">
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li><strong className="text-gray-900">~45%</strong> — knowledge with understanding.</li>
                    <li><strong className="text-gray-900">~55%</strong> — handling information and solving problems.</li>
                  </ul>
                </GuideCard>
                <p className="mt-4 text-pretty">
                  Biology carries more vocabulary and more process detail than the other two sciences, which makes memorisation feel like the obvious strategy. But the majority of the theory marks are for applying that content to something you have not seen — a graph, an experiment, an unfamiliar organism. Content is the entry requirement, not the thing being marked.
                </p>
              </section>

              <section id="mark-map" className="scroll-mt-24">
                <SectionHeading icon={Scale}>How the three papers split</SectionHeading>
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
              </section>

              <section id="free-response" className="scroll-mt-24">
                <SectionHeading icon={PenLine}>The free-response questions</SectionHeading>
                <p className="text-pretty">
                  Biology asks for extended prose in two places: at the end of Section A, and again in Section B where you choose one of two. These are the questions where structure earns marks that content alone does not.
                </p>
                <GuideCard className="mt-4">
                  <h4 className="font-semibold text-gray-900 mb-3">What a free-response answer needs</h4>
                  <ul className="list-disc ml-5 space-y-1.5 text-sm text-gray-700">
                    <li><strong>A plan before the first sentence.</strong> One minute listing the points in order prevents the repetition that fills space without scoring.</li>
                    <li><strong>Distinct points, not one paragraph.</strong> A ten-mark answer generally wants several separable ideas, each developed.</li>
                    <li><strong>Precise terminology.</strong> Diffusion, osmosis and active transport are different mechanisms, and the wrong word loses the mark outright.</li>
                    <li><strong>The connection stated.</strong> If the question links two processes, say how they relate rather than describing each in turn.</li>
                    <li><strong>An answer to the question asked.</strong> Everything you know about the topic is not the same as what was requested.</li>
                  </ul>
                </GuideCard>
                <p className="mt-4 text-pretty">
                  The data-based question beside it works differently: describe the trend, quote figures from the data with units, then explain the biology behind it. Students who explain without ever citing a number routinely lose marks they had the knowledge to earn.
                </p>
              </section>

              <section id="revision" className="scroll-mt-24">
                <SectionHeading icon={Repeat}>How to revise Biology</SectionHeading>
                <GuideCard className="mt-4">
                  <ul className="list-disc ml-5 space-y-2 text-sm text-gray-700">
                    <li><strong>Convert notes into questions.</strong> The 55% category cannot be revised by rereading; it needs unfamiliar material.</li>
                    <li><strong>Practise free-response answers to time,</strong> with a written plan first. Structure is the difference between knowing the content and scoring it.</li>
                    <li><strong>Drill data interpretation</strong> — trend, figures, explanation — on graphs you have not seen before.</li>
                    <li><strong>Learn the vocabulary as contrasted sets</strong> rather than one term at a time, so the distinctions stay sharp under pressure.</li>
                    <li><strong>Rehearse planning on paper</strong> for the practical: variable to change, variables to control, measurements, and how the comparison stays fair.</li>
                    <li><strong>Use unseen past papers.</strong> Prelim and past-year O-Level Biology papers are in our <Link href="/free-test-papers" className="text-primary underline underline-offset-2">free test papers library</Link>.</li>
                  </ul>
                </GuideCard>
                <p className="mt-4 text-pretty">
                  For topic-by-topic coverage of syllabus 6093, see our{' '}
                  <Link href="/o-level-biology" className="text-primary underline underline-offset-2">O-Level Biology subject guide</Link>. This page is about where the marks are; that one is about what is on the syllabus.
                </p>
              </section>

              <section id="mistakes" className="scroll-mt-24">
                <SectionHeading icon={TriangleAlert}>10 common O-Level Biology mistakes</SectionHeading>
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
                Paper structure, weightings and assessment-objective allocations are from the Singapore-Cambridge GCE O-Level Biology syllabus 6093 (2026), published by SEAB. Always check the current syllabus for your exam year.
              </p>

              <RelatedGuides slug="how-to-study-o-level-biology" />

              <GuideCTA
                title="Get a Biology tutor who marks like an examiner"
                description={`Tell us where the marks are going — structured questions, free response or the practical. We hand-match a vetted O-Level Biology tutor, usually within ${MATCH_TIME}, and parents never pay an agency fee.`}
                buttonText="Find an O-Level Biology tutor"
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
