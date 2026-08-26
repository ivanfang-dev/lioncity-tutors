import { MATCH_TIME } from '@/data/promises';
import { DEFAULT_OG_IMAGE } from '@/lib/seo/openGraph';

export const metadata = {
  title: 'How to Study for General Paper (8881): Where the Marks Are',
  description:
    'How to study for General Paper — where the marks sit across both papers, what moves an essay from Band 4 to Band 5, and the 10 mistakes our tutors correct most.',
  keywords: [
    'how to study for gp',
    'how to study general paper',
    'how to study for gp essay',
    'General Paper 8881',
    'GP essay band descriptors',
    'GP application question',
    'A Level General Paper Singapore',
  ],
  openGraph: {
    images: [DEFAULT_OG_IMAGE],
    title: 'How to Study for General Paper (8881): Where the Marks Are',
    description:
      'The mark split across both GP papers, what moves an essay from Band 4 to Band 5, and the 10 mistakes our tutors correct most.',
    url: 'https://www.lioncitytutors.com/how-to-study/general-paper',
    type: 'article',
  },
  alternates: {
    canonical: 'https://www.lioncitytutors.com/how-to-study/general-paper',
  },
};

import Link from 'next/link';
import TableOfContents from '@/components/TableOfContents';
import GuideSchema from '@/components/seo/GuideSchema';
import {
  GuideHeader, SectionHeading, GuideCard, KeyTakeaways, GuideCTA, ICON_STROKE,
  RelatedGuides,
} from '@/components/guide';
import { Scale, PenLine, BookOpen, Layers, Repeat, TriangleAlert, ListChecks } from 'lucide-react';

const tableOfContents = [
  { id: 'mark-map', label: 'Where the marks actually are' },
  { id: 'essay', label: 'Paper 1: moving up a band' },
  { id: 'comprehension', label: 'Paper 2, question by question' },
  { id: 'evidence', label: 'Building usable examples' },
  { id: 'revision', label: 'Revising a skills subject' },
  { id: 'mistakes', label: '10 common mistakes' },
];

// Straight from syllabus 8881 (2026). The point of putting this on the page is
// that most students have never seen the mark split, and it changes what they
// should practise — particularly the Paper 2 language marks, which are awarded
// only on two of the eight or nine questions.
const paper1 = [
  { component: 'Content', marks: '30 marks', note: 'Argument, relevance, illustration, balance and the conclusion.' },
  { component: 'Language', marks: '20 marks', note: 'Marked separately from content: accuracy, sentence variety, vocabulary and paragraphing.' },
];

const paper2 = [
  {
    question: 'Comprehension on Passage 1',
    marks: '9–11 marks',
    wants: 'Literal comprehension, inference, analysis, evaluation and synthesis of ideas in the first passage.',
    weak: 'Lifting a phrase from the passage and presenting it as the answer.',
    strong: 'Answering in your own words, at the length the mark allocation implies — one mark rarely wants three lines.',
  },
  {
    question: 'Summary of Passage 2',
    marks: '8 marks',
    wants: 'The relevant points of the second passage, compressed and rewritten.',
    weak: 'Copying sentences in original wording and running past the word limit.',
    strong: 'Selecting only points that answer the summary question asked, then rewriting them tightly. This answer also carries language marks.',
  },
  {
    question: 'Connections across passages',
    marks: '4–6 marks',
    wants: 'How ideas relate across two passages — Passages 1 and 3, and Passages 2 and 3.',
    weak: 'Summarising each passage in turn and leaving the relationship implied.',
    strong: 'Naming the relationship first — agreement, qualification, contradiction — then proving it with both passages in the same answer.',
  },
  {
    question: 'Application question',
    marks: '12 marks',
    wants: 'Applying ideas from the passages to a theme or scenario derived from the text.',
    weak: 'Restating the writers’ views with a sentence of agreement bolted on.',
    strong: 'Taking a position on the ideas and testing them against your own society and experience. This is the largest single question in the paper, and it also carries language marks.',
  },
];

// The 25–30 and 19–24 ranges, and the split inside Band 5, are as stated in the
// 8881 band descriptors. The phrasing here is ours — what the distinction means
// in practice, rather than the descriptor wording.
const bandMoves = [
  {
    move: 'Band 4 (19–24) to Band 5 (25–30)',
    driver: 'Nuance and connection, not volume',
    detail: 'Both bands are relevant, balanced and illustrated. What separates them is whether observations are measured and nuanced, and whether connections between issues are explained rather than merely spotted. Adding a fourth example moves nothing; explaining how two issues bear on each other does.',
  },
  {
    move: 'Inside Band 5: 25–27 to 28–30',
    driver: 'Consistency of evaluation',
    detail: 'The top of the band asks for examples that are consistently evaluated and connections that are fully explained. A script that evaluates most examples and part-explains its connections sits at 25–27. The gap is follow-through on every point, not a better opening.',
  },
  {
    move: 'Language: getting past the middle',
    driver: 'Variety and control, marked on its own',
    detail: 'Language is a separate 20 marks, so a strong argument in flat prose caps out. The bands reward varied sentence structure, appropriate range of vocabulary and coherent paragraphing with real linking — not long words dropped into short sentences.',
  },
];

const commonMistakes = [
  {
    mistake: 'Treating Language as something that looks after itself',
    detail: 'Language is 20 of the 50 marks on Paper 1 — 40% of the essay — and it is awarded separately from content. A well-argued essay in error-strewn prose loses marks that no amount of extra content recovers.',
    fix: 'Spend some revision specifically on expression: sentence variety, paragraph transitions, and the handful of grammar errors you personally repeat. Get an essay marked for language alone at least once.',
  },
  {
    mistake: 'Polishing the short comprehension answers',
    detail: 'On Paper 2 the 15 language marks are awarded on the summary and application answers only. Careful prose in a two-mark inference answer earns nothing extra.',
    fix: 'Answer the short questions accurately and briefly, then spend the saved time on the summary and the 12-mark application question, where language is actually credited.',
  },
  {
    mistake: 'Under-weighting the application question',
    detail: 'At 12 marks it is the single largest question in Paper 2, larger than the summary, and it is often reached last with the least time left.',
    fix: 'Budget for it before you start. Some students answer it before the shorter questions precisely so it never gets the leftover minutes.',
  },
  {
    mistake: 'Answering the topic instead of the question',
    detail: 'A question on whether something is the best solution is not a question about whether it is a good one. Essays that address the general subject rather than the specific claim lose relevance marks throughout, not just at the start.',
    fix: 'Define the terms and scope of the question in the introduction, then check each paragraph against that definition rather than against the topic.',
  },
  {
    mistake: 'Examples that decorate rather than prove',
    detail: 'A named country, policy or event dropped in without explanation does not support the argument; it only signals that reading happened.',
    fix: 'After every example, write one sentence explaining how it supports the point. If you cannot, the example is not doing work and a different one is needed.',
  },
  {
    mistake: 'A balanced essay with no judgement',
    detail: 'Considering both sides and then declining to decide reads as incomplete. The conclusion is where a position is expected.',
    fix: 'Commit, and say what tipped it. An argued conclusion outscores a balanced non-answer.',
  },
  {
    mistake: 'Only ever using foreign examples',
    detail: 'Questions about your own society need to be rooted in a specific society, and answers that reach for other countries when Singapore was asked about drift off the question.',
    fix: 'Keep a small bank of Singapore examples — policy, demography, education, housing — so a "your society" question never has to be answered generically.',
  },
  {
    mistake: 'Reading the news passively',
    detail: 'Hours of scrolling produce a vague sense of current affairs and nothing retrievable under exam conditions.',
    fix: 'Convert reading into notes you can use: an issue, two opposing positions, and one concrete example with a date. Ten of those beat a term of undirected reading.',
  },
  {
    mistake: 'Writing full essays as the only practice',
    detail: 'Essays are slow to produce and slow to mark, so students write few of them and rarely repeat a weakness before the exam.',
    fix: 'Write plans far more often than full essays. Structure and judgement are where most band movement happens, and both can be trained in ten minutes.',
  },
  {
    mistake: 'Running over or under the word range',
    detail: 'The essay is set at 500 to 800 words. Very short scripts cannot develop an argument; very long ones tend to lose relevance and cost time needed elsewhere.',
    fix: 'Learn what 800 of your own words looks like on paper so you can pace without counting during the exam.',
  },
];

export default function HowToStudyGeneralPaper() {
  const whatsappMessage = `Hi LionCity Tutors! I'd like help finding a General Paper tutor.

Student level (e.g. JC1 / JC2):
Current grade:
Location:
Preferred days & timing: `;
  const whatsappHref = `https://wa.me/6588701152?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <>
      <GuideSchema
        slug="how-to-study-general-paper"
        article={{
          headline: 'How to Study for General Paper (8881): Where the Marks Are',
          description:
            'The mark split across both GP papers, what moves an essay from Band 4 to Band 5, and the 10 mistakes our tutors correct most.',
          datePublished: '2026-08-26',
          dateModified: '2026-08-26',
        }}
      />
      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16">
        <div className="mx-auto max-w-2xl lg:max-w-none lg:grid lg:grid-cols-[minmax(0,42rem)_15rem] lg:justify-center lg:gap-12">
          <div>
            <GuideHeader
              title="How to Study for General Paper"
              author="By the LionCity Tutors humanities team"
              meta="Updated August 26, 2026 · 10 min read"
            />

            <article className="space-y-12 text-gray-700 leading-relaxed">
              <p className="text-lg text-gray-800 leading-relaxed text-pretty">
                General Paper is the subject students most often describe as unrevisable. There is no content list to finish, so advice collapses into &ldquo;read more news&rdquo; and effort goes in without much sense of where it lands. But GP is marked against a published scheme that says precisely where its 100 marks sit — and most students have never seen it. Knowing the split changes what is worth practising.
              </p>

              <KeyTakeaways
                items={[
                  <>Language is a separate <strong>20 of the 50 marks</strong> on Paper 1 — 40% of the essay, whatever the argument does.</>,
                  <>On Paper 2 the 15 language marks come from the <strong>summary and application answers only</strong>.</>,
                  <>The application question is <strong>12 marks</strong> — the largest single question in Paper 2.</>,
                  <>Band 4 to Band 5 is bought with nuance and explained connections, not with more examples.</>,
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
                <SectionHeading icon={Scale}>Where the marks actually are</SectionHeading>
                <p className="text-pretty">
                  GP (syllabus 8881) is two papers of 50 marks each, both an hour and a half, weighted equally. That much most students know. What changes revision is the split inside each paper.
                </p>

                <GuideCard className="mt-5">
                  <h4 className="font-semibold text-gray-900 mb-1">Paper 1 — Essay · 1h 30m · 50 marks</h4>
                  <p className="text-sm text-gray-600 mb-3">Eight questions are set; you answer one, in 500 to 800 words.</p>
                  <ul className="space-y-2 text-sm text-gray-700">
                    {paper1.map((row) => (
                      <li key={row.component} className="flex flex-col sm:flex-row sm:items-baseline sm:gap-3">
                        <span className="font-semibold text-gray-900 sm:w-40 shrink-0">
                          {row.component} <span className="tabular-nums font-normal text-gray-600">({row.marks})</span>
                        </span>
                        <span>{row.note}</span>
                      </li>
                    ))}
                  </ul>
                </GuideCard>

                <GuideCard className="mt-4">
                  <h4 className="font-semibold text-gray-900 mb-1">Paper 2 — Comprehension · 1h 30m · 50 marks</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Three passages totalling roughly 1,200 words, with eight or nine questions across them. Content is worth 35; language is worth 15.
                  </p>
                  <p className="text-sm text-gray-700">
                    The detail worth acting on: those 15 language marks are awarded on the <strong>summary and application answers only</strong>. Careful phrasing in the short questions is not credited as language anywhere.
                  </p>
                </GuideCard>

                <p className="mt-4 text-pretty">
                  Two consequences follow immediately. First, a student working only on argument is competing for 65 of the 100 marks. Second, on Paper 2 the time is better spent on the two long answers than on polishing the short ones.
                </p>
              </section>

              <section id="essay" className="scroll-mt-24">
                <SectionHeading icon={PenLine}>Paper 1: what actually moves you up a band</SectionHeading>
                <p className="text-pretty">
                  Essay content is banded, and the descriptors are unusually specific about what separates one band from the next. Most students plateau in the upper-middle because they respond to a mid-band script by adding material, when the bands are not asking for more.
                </p>
                <div className="mt-5 space-y-4">
                  {bandMoves.map((item) => (
                    <GuideCard key={item.move}>
                      <h4 className="font-semibold text-gray-900 mb-1">{item.move}</h4>
                      <p className="text-sm text-primary font-medium mb-2">{item.driver}</p>
                      <p className="text-sm text-gray-700">{item.detail}</p>
                    </GuideCard>
                  ))}
                </div>
                <p className="mt-4 text-pretty">
                  Questions are drawn from society and culture, economics, politics, the arts and humanities, science and technology, and the environment — and they are deliberately general, so they reward drawing across those areas rather than staying inside one.
                </p>
              </section>

              <section id="comprehension" className="scroll-mt-24">
                <SectionHeading icon={BookOpen}>Paper 2, question by question</SectionHeading>
                <p className="text-pretty">
                  The comprehension paper is four kinds of question wearing eight or nine numbers. Each wants something different, and each is worth a known amount — which is the fastest way to decide how long an answer should be.
                </p>
                <div className="mt-5 space-y-4">
                  {paper2.map((item) => (
                    <GuideCard key={item.question}>
                      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 mb-1">
                        <h4 className="font-semibold text-gray-900">{item.question}</h4>
                        <span className="text-sm font-semibold text-primary tabular-nums">{item.marks}</span>
                      </div>
                      <p className="text-sm text-gray-700 mb-3 italic">{item.wants}</p>
                      <p className="text-sm text-gray-700 mb-1.5">
                        <span className="font-semibold text-gray-900">Weak answer: </span>{item.weak}
                      </p>
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold text-gray-900">Strong answer: </span>{item.strong}
                      </p>
                    </GuideCard>
                  ))}
                </div>
                <p className="mt-4 text-pretty">
                  The passages are printed with paragraph numbers down the left and line numbers down the right. Use them — questions are located by those references, and answering from the wrong paragraph is a recoverable mistake only if you notice it.
                </p>
              </section>

              <section id="evidence" className="scroll-mt-24">
                <SectionHeading icon={Layers}>Building examples you can actually use</SectionHeading>
                <p className="text-pretty">
                  &ldquo;Read the news&rdquo; is true and nearly useless as an instruction, because passive reading does not survive an exam hall. What works is converting reading into something retrievable.
                </p>
                <GuideCard className="mt-4">
                  <h4 className="font-semibold text-gray-900 mb-3">One note per issue</h4>
                  <ul className="list-disc ml-5 space-y-1 text-sm text-gray-700">
                    <li><strong>The issue</strong>, in a sentence you could use as an essay point.</li>
                    <li><strong>Two opposing positions</strong>, stated fairly — you need the other side to write a balanced paragraph.</li>
                    <li><strong>One concrete example</strong>: named, dated, specific enough to prove something.</li>
                    <li><strong>Where it connects</strong> — which other issues it touches. This is the raw material for the connections that separate the top two bands.</li>
                  </ul>
                </GuideCard>
                <p className="mt-4 text-pretty">
                  Thirty of these, spread across the six question areas, will carry a student further than a year of undirected reading — and because each one already contains a connection, they feed straight into the skill the top band is looking for. Keep a separate handful rooted in Singapore, since &ldquo;your society&rdquo; questions need a specific society rather than a general one.
                </p>
              </section>

              <section id="revision" className="scroll-mt-24">
                <SectionHeading icon={Repeat}>How to revise a subject with no content list</SectionHeading>
                <p className="text-pretty">
                  GP rewards practice that produces feedback. Reading model essays is comfortable and teaches very little; the routine our tutors use looks like this:
                </p>
                <GuideCard className="mt-4">
                  <ul className="list-disc ml-5 space-y-2 text-sm text-gray-700">
                    <li><strong>Write plans, not essays, most weeks.</strong> Ten plans in an hour trains structure and judgement — where the band movement is — far better than one full script.</li>
                    <li><strong>Do comprehension on unseen passages.</strong> A passage you have already worked through tests memory, not inference. Past-year and prelim papers are the supply; there are A-Level GP papers in our <Link href="/free-test-papers" className="text-primary underline underline-offset-2">free test papers library</Link>.</li>
                    <li><strong>Mark against the scheme, then classify the loss.</strong> Knowledge, technique, misread question, or time? The fix is completely different for each, and students who skip this step repeat the same error until the exam.</li>
                    <li><strong>Get one essay marked for language alone.</strong> With 20 marks riding on it separately, it is worth knowing which errors you personally repeat.</li>
                    <li><strong>Time the comprehension paper early.</strong> Ninety minutes across three passages and nine questions is tight, and the 12-mark application question is the one that suffers when it runs out.</li>
                  </ul>
                </GuideCard>
              </section>

              <section id="mistakes" className="scroll-mt-24">
                <SectionHeading icon={TriangleAlert}>10 common General Paper mistakes</SectionHeading>
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
                Paper structure, mark allocations and band ranges are from the Singapore-Cambridge GCE A-Level H1 General Paper syllabus 8881 (2026), published by SEAB. Always check the current syllabus for your exam year.
              </p>

              <RelatedGuides slug="how-to-study-general-paper" />

              <GuideCTA
                title="Get a GP tutor who marks like an examiner"
                description={`Tell us where the marks are going — essay, comprehension or both. We hand-match a vetted General Paper tutor, usually within ${MATCH_TIME}, and parents never pay an agency fee.`}
                buttonText="Find a General Paper tutor"
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
