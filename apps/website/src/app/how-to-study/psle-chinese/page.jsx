import { MATCH_TIME } from '@/data/promises';
import { DEFAULT_OG_IMAGE } from '@/lib/seo/openGraph';

export const metadata = {
  title: 'How to Study for PSLE Chinese (0005): Oral Is 25%',
  description:
    'How to study for PSLE Chinese — why 口试 is a quarter of the grade, the dictionary you are allowed in the writing paper, and 10 common mistakes to avoid.',
  keywords: [
    'how to study for psle chinese',
    'PSLE Chinese 0005',
    'psle chinese oral 口试',
    'psle chinese paper format',
    'psle chinese marks breakdown',
    'psle chinese composition dictionary',
  ],
  openGraph: {
    images: [DEFAULT_OG_IMAGE],
    title: 'How to Study for PSLE Chinese (0005): Oral Is 25%',
    description:
      'Why 口试 carries a quarter of the grade, the dictionary you are allowed in the writing paper, and the 10 mistakes our tutors correct most.',
    url: 'https://www.lioncitytutors.com/how-to-study/psle-chinese',
    type: 'article',
  },
  alternates: {
    canonical: 'https://www.lioncitytutors.com/how-to-study/psle-chinese',
  },
};

import Link from 'next/link';
import TableOfContents from '@/components/TableOfContents';
import GuideSchema from '@/components/seo/GuideSchema';
import {
  GuideHeader, SectionHeading, GuideCard, KeyTakeaways, GuideCTA, ICON_STROKE,
  RelatedGuides,
} from '@/components/guide';
import { Scale, Mic, BookMarked, Repeat, TriangleAlert, ListChecks } from 'lucide-react';

const tableOfContents = [
  { id: 'mark-map', label: 'All 200 marks, paper by paper' },
  { id: 'oral', label: '口试 is a quarter of the grade' },
  { id: 'dictionary', label: 'The dictionary you may bring' },
  { id: 'revision', label: 'How to revise PSLE Chinese' },
  { id: 'mistakes', label: '10 common mistakes' },
];

const papers = [
  {
    paper: '试卷一 — Writing (写作)',
    stat: '40 marks · 20% · 50 min',
    detail: 'A choice between a topic-based composition (命题作文) and a picture-based one (看图作文) — you answer one, in no fewer than 100 characters. An approved dictionary is permitted.',
  },
  {
    paper: '试卷二 — Language Use and Comprehension (语文应用与阅读理解)',
    stat: '90 marks · 45% · 1 h 40 min',
    detail: 'Four components: language use (语文应用), cloze passage (短文填充), reading comprehension (阅读理解一 and 阅读理解二), and completing a dialogue (完成对话).',
  },
  {
    paper: '试卷三 — Oral (口试)',
    stat: '50 marks · 25% · about 10 min',
    detail: 'Reading a passage aloud (朗读篇章) and a conversation with the examiner based on a video clip (会话). Ten minutes of preparation are given beforehand.',
  },
  {
    paper: '试卷三 — Listening (听力理解)',
    stat: '20 marks · 10% · about 30 min',
    detail: 'Conversations, announcements, advertisements, explanations, introductions and stories, each followed by questions.',
  },
];

const commonMistakes = [
  {
    mistake: 'Treating 口试 as a minor paper',
    detail: 'Oral is 50 marks — 25% of the subject, and the second-largest component after Paper 2. It is worth more than the entire composition paper.',
    fix: 'Practise aloud weekly. A quarter of the grade cannot be revised by writing characters.',
  },
  {
    mistake: 'Not using the full ten minutes of preparation',
    detail: 'Before the oral examination, candidates get ten minutes in which they may read the passage silently and watch the video clip — and they may do both more than once within that time.',
    fix: 'Read the passage at least twice and watch the clip more than once. Use the repeats; they are explicitly allowed.',
  },
  {
    mistake: 'Not knowing a dictionary is permitted in the writing paper',
    detail: 'Candidates may use an approved dictionary while writing. Pupils who never practise with one lose time hunting for a character they could have looked up in seconds.',
    fix: 'Practise with the dictionary you will bring, so lookups are fast and rare rather than slow and frequent.',
  },
  {
    mistake: 'Reading aloud without expression',
    detail: 'Reading a passage aloud rewards pronunciation, fluency and expression. Flat, hurried reading loses marks that have nothing to do with vocabulary.',
    fix: 'Practise reading passages aloud daily, pausing at punctuation and varying tone.',
  },
  {
    mistake: 'Short answers in 会话',
    detail: 'The conversation is where the larger share of oral marks sits, and it rewards developed answers with reasons and personal experience.',
    fix: 'Answer, give a reason, then add something that happened to you. Practise extending rather than replying.',
  },
  {
    mistake: 'Writing under the character minimum',
    detail: 'The composition must be no fewer than 100 characters. A piece that stops short cannot show the range the mark scheme is looking for.',
    fix: 'Plan a beginning, a complication and a resolution before writing, so the length arrives naturally.',
  },
  {
    mistake: 'Choosing the composition topic too quickly',
    detail: 'Two options are offered and one is answered. The picture-based option is not automatically easier, and the topic that sounds familiar may have less material behind it.',
    fix: 'Spend a minute planning both before committing to either.',
  },
  {
    mistake: 'Learning 成语 as isolated lists',
    detail: 'Idioms and set phrases are tested in use — in cloze, in comprehension and in writing — not as definitions to recall.',
    fix: 'Learn each one inside a sentence you could actually write, and reuse it in practice compositions.',
  },
  {
    mistake: 'Ignoring 完成对话 practice',
    detail: 'Completing a dialogue tests register and context as much as vocabulary, and it behaves differently from ordinary comprehension.',
    fix: 'Practise it specifically, paying attention to who is speaking to whom and how formal the exchange is.',
  },
  {
    mistake: 'Listening practice without the full range of text types',
    detail: 'The listening paper spans conversations, announcements, advertisements, explanations, introductions and stories. Practising only one type leaves the others unfamiliar.',
    fix: 'Vary the material deliberately, and read the questions before each recording begins.',
  },
];

export default function HowToStudyPsleChinese() {
  const whatsappMessage = `Hi LionCity Tutors! I'd like help finding a PSLE Chinese tutor.

Student level (e.g. P5 / P6):
Current grade:
Location:
Preferred days & timing: `;
  const whatsappHref = `https://wa.me/6588701152?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <>
      <GuideSchema
        slug="how-to-study-psle-chinese"
        article={{
          headline: 'How to Study for PSLE Chinese (0005): Oral Is 25%',
          description:
            'Why 口试 carries a quarter of the grade, the dictionary you are allowed in the writing paper, and the 10 mistakes our tutors correct most.',
          datePublished: '2026-08-26',
          dateModified: '2026-08-26',
        }}
      />
      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16">
        <div className="mx-auto max-w-2xl lg:max-w-none lg:grid lg:grid-cols-[minmax(0,42rem)_15rem] lg:justify-center lg:gap-12">
          <div>
            <GuideHeader
              title="How to Study for PSLE Chinese"
              author="By the LionCity Tutors primary team"
              meta="Updated August 26, 2026 · 10 min read"
            />

            <article className="space-y-12 text-gray-700 leading-relaxed">
              <p className="text-lg text-gray-800 leading-relaxed text-pretty">
                PSLE Chinese is 200 marks across three papers, and two facts in the syllabus change how it should be prepared for. Oral is worth a quarter of the grade — more than the composition paper. And in the writing paper, a dictionary is allowed.
              </p>

              <KeyTakeaways
                items={[
                  <><strong>口试 is 50 marks — 25%</strong> — the second-largest component in the subject.</>,
                  <>An approved <strong>dictionary is permitted</strong> in the writing paper.</>,
                  <>The ten minutes of oral preparation allow <strong>re-reading and re-watching</strong> more than once.</>,
                  <>Paper 2 is the largest single paper at <strong>90 marks, 45%</strong>.</>,
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
                <SectionHeading icon={Scale}>All 200 marks, paper by paper</SectionHeading>
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

              <section id="oral" className="scroll-mt-24">
                <SectionHeading icon={Mic}>口试 is a quarter of the grade</SectionHeading>
                <p className="text-pretty">
                  Fifty marks in about ten minutes of examination. Compare that with the writing paper: 40 marks across fifty minutes. Oral is worth more, takes less time, and is almost always the last thing a family practises — because it needs a listener.
                </p>
                <GuideCard className="mt-5">
                  <h4 className="font-semibold text-gray-900 mb-3">Using the ten minutes of preparation</h4>
                  <p className="text-sm text-gray-700 mb-3">
                    Before the examination, candidates are given ten minutes to read the passage silently and watch the video clip — and within that time they may do each more than once. That permission is worth using deliberately.
                  </p>
                  <ul className="list-disc ml-5 space-y-1.5 text-sm text-gray-700">
                    <li><strong>First read:</strong> get the sense of the passage and find the characters you are unsure of.</li>
                    <li><strong>Second read:</strong> practise the difficult words and mark where to pause.</li>
                    <li><strong>Watch the clip twice:</strong> once for what happens, once for what you think about it.</li>
                    <li><strong>Decide your opening line</strong> for the conversation before you walk in.</li>
                  </ul>
                </GuideCard>
                <p className="mt-4 text-pretty">
                  In the conversation itself, the marks follow development. Answer the question, give a reason, then add something from your own experience — three sentences where one was invited.
                </p>
              </section>

              <section id="dictionary" className="scroll-mt-24">
                <SectionHeading icon={BookMarked}>The dictionary you may bring</SectionHeading>
                <p className="text-pretty">
                  The syllabus states that candidates may use an approved dictionary while writing the composition. Many pupils either do not know this or have never practised with one, which turns a permitted aid into a time sink on the day.
                </p>
                <GuideCard className="mt-4">
                  <ul className="list-disc ml-5 space-y-1.5 text-sm text-gray-700">
                    <li><strong>Practise with the exact dictionary</strong> you intend to bring, so the layout is familiar.</li>
                    <li><strong>Look up rarely.</strong> It rescues a character you half-remember; it cannot supply vocabulary you never learned.</li>
                    <li><strong>Plan first, write second, check third.</strong> Lookups belong in the checking pass, not mid-sentence.</li>
                    <li><strong>Confirm what is approved</strong> with the school before the exam.</li>
                  </ul>
                </GuideCard>
              </section>

              <section id="revision" className="scroll-mt-24">
                <SectionHeading icon={Repeat}>How to revise PSLE Chinese</SectionHeading>
                <GuideCard className="mt-4">
                  <ul className="list-disc ml-5 space-y-2 text-sm text-gray-700">
                    <li><strong>Speak aloud every week.</strong> Oral is 25% and improves faster than any written component.</li>
                    <li><strong>Read passages aloud daily,</strong> pausing at punctuation and varying tone.</li>
                    <li><strong>Practise with the dictionary</strong> so it saves time rather than costing it.</li>
                    <li><strong>Learn 成语 inside sentences</strong> you could actually write, then reuse them in compositions.</li>
                    <li><strong>Vary listening material</strong> across the text types the paper uses.</li>
                    <li><strong>Sit whole papers to time.</strong> Prelim and past-year primary papers are in our <Link href="/free-test-papers" className="text-primary underline underline-offset-2">free test papers library</Link>.</li>
                  </ul>
                </GuideCard>
                <p className="mt-4 text-pretty">
                  For topic coverage across the primary syllabus, see our{' '}
                  <Link href="/psle-chinese" className="text-primary underline underline-offset-2">PSLE Chinese subject guide</Link>, and the companion guides for{' '}
                  <Link href="/how-to-study/psle-english" className="text-primary underline underline-offset-2">PSLE English</Link> and{' '}
                  <Link href="/how-to-study/psle-math" className="text-primary underline underline-offset-2">PSLE Maths</Link>.
                </p>
              </section>

              <section id="mistakes" className="scroll-mt-24">
                <SectionHeading icon={TriangleAlert}>10 common PSLE Chinese mistakes</SectionHeading>
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
                Examination format, mark allocations, the oral preparation arrangements and the dictionary permission are from the PSLE Chinese Language syllabus 0005, published by SEAB. Always check the current syllabus and the approved dictionary list for your exam year.
              </p>

              <RelatedGuides slug="how-to-study-psle-chinese" />

              <GuideCTA
                title="Get a PSLE Chinese tutor who marks like an examiner"
                description={`Tell us where the marks are going — 口试, composition, comprehension or listening. We hand-match a vetted PSLE Chinese tutor, usually within ${MATCH_TIME}, and parents never pay an agency fee.`}
                buttonText="Find a PSLE Chinese tutor"
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
