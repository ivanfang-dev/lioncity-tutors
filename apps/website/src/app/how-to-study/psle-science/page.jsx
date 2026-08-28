import { MATCH_TIME } from '@/data/promises';
import { DEFAULT_OG_IMAGE } from '@/lib/seo/openGraph';

export const metadata = {
  title: 'How to Study for PSLE Science (0009): 60 Marks Are MCQ',
  description:
    'How to study for PSLE Science — why multiple choice carries 60 of the 100 marks at 2 marks each, how Booklet B is marked, and 10 common mistakes to avoid.',
  keywords: [
    'how to study for psle science',
    'PSLE Science 0009',
    'psle science paper format',
    'psle science booklet a booklet b',
    'psle science mcq marks',
    'psle science open ended',
  ],
  openGraph: {
    images: [DEFAULT_OG_IMAGE],
    title: 'How to Study for PSLE Science (0009): 60 Marks Are MCQ',
    description:
      'Why multiple choice carries 60 of the 100 marks at 2 marks each, how Booklet B is marked, and the 10 mistakes our tutors correct most.',
    url: 'https://www.lioncitytutors.com/how-to-study/psle-science',
    type: 'article',
  },
  alternates: {
    canonical: 'https://www.lioncitytutors.com/how-to-study/psle-science',
  },
};

import Link from 'next/link';
import TableOfContents from '@/components/TableOfContents';
import GuideSchema from '@/components/seo/GuideSchema';
import {
  GuideHeader, SectionHeading, GuideCard, KeyTakeaways, GuideCTA, ICON_STROKE,
  RelatedGuides,
} from '@/components/guide';
import { Scale, ListFilter, PenLine, Repeat, TriangleAlert, ListChecks } from 'lucide-react';

const tableOfContents = [
  { id: 'mark-map', label: 'One paper, two booklets' },
  { id: 'mcq', label: 'Why the MCQs are the paper' },
  { id: 'booklet-b', label: 'Writing answers that score' },
  { id: 'revision', label: 'How to revise PSLE Science' },
  { id: 'mistakes', label: '10 common mistakes' },
];

const commonMistakes = [
  {
    mistake: 'Treating multiple choice as the easy half',
    detail: 'Booklet A is 30 questions at 2 marks each — 60 of the 100 marks. It is not a warm-up; it is the majority of the paper, and there is no method mark to soften a wrong answer.',
    fix: 'Practise MCQs as seriously as open-ended questions, and review every wrong option to understand why it was wrong.',
  },
  {
    mistake: 'Guessing without eliminating',
    detail: 'Each question has four options and costs 2 marks. A blind guess is a 25% chance on a question that elimination often reduces to a coin flip or better.',
    fix: 'Rule out the impossible options first, and say why each is impossible. That habit also catches misread questions.',
  },
  {
    mistake: 'Answering the concept instead of the question',
    detail: 'Booklet B questions describe a specific situation — an experiment, a diagram, an animal in a habitat. Answers that recite the general concept without applying it to that situation lose the application marks.',
    fix: 'Name the concept, then say what it means for the thing in the question. The second half is where the marks are.',
  },
  {
    mistake: 'Vague cause-and-effect language',
    detail: 'Answers like "because it is better" or "so it can survive" do not identify a mechanism. Science marking wants the chain: what changes, what that causes, and what the result is.',
    fix: 'Write in links. Because A happens, B happens, so C. Check every explanation has all three parts.',
  },
  {
    mistake: 'Not using the data given',
    detail: 'Many questions supply a table, graph or set of results. An answer that ignores them and explains from memory misses the marks tied to the evidence.',
    fix: 'Quote the figures or the trend from the material before adding what you know.',
  },
  {
    mistake: 'Confusing variables in experiment questions',
    detail: 'Pupils name the thing being measured when asked what was changed, or list everything held constant when asked for one.',
    fix: 'Practise labelling the three roles on any experiment: what was changed, what was measured, what was kept the same.',
  },
  {
    mistake: 'Losing marks on precise vocabulary',
    detail: 'Terms like evaporation and boiling, or heat and temperature, are not interchangeable, and the near-synonym usually costs the mark outright.',
    fix: 'Learn the confusable pairs together, with the distinction written beside each, rather than one at a time.',
  },
  {
    mistake: 'Writing long answers to short questions',
    detail: 'Booklet B questions carry 2, 3, 4 or 5 marks. A five-line answer to a 2-mark question spends time that the 5-mark questions later need.',
    fix: 'Use the mark count as a length guide, and move on once the required points are down.',
  },
  {
    mistake: 'Revising topic by topic to the end',
    detail: 'Questions mix themes deliberately — a question on a food chain can carry energy, adaptations and human impact at once. Topic-sorted revision announces the answer in a way the exam will not.',
    fix: 'Mix topics in practice, which whole past papers do naturally.',
  },
  {
    mistake: 'Never doing the full 1 h 45 min',
    detail: 'It is one paper, both booklets, in one sitting. Pupils who only practise in short sets discover the pacing problem in the exam.',
    fix: 'Sit complete papers to time, and check where the minutes went afterwards.',
  },
];

export default function HowToStudyPsleScience() {
  const whatsappMessage = `Hi LionCity Tutors! I'd like help finding a PSLE Science tutor.

Student level (e.g. P5 / P6):
Current grade:
Location:
Preferred days & timing: `;
  const whatsappHref = `https://wa.me/6588701152?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <>
      <GuideSchema
        slug="how-to-study-psle-science"
        article={{
          headline: 'How to Study for PSLE Science (0009): 60 Marks Are MCQ',
          description:
            'Why multiple choice carries 60 of the 100 marks at 2 marks each, how Booklet B is marked, and the 10 mistakes our tutors correct most.',
          datePublished: '2026-08-26',
          dateModified: '2026-08-26',
        }}
      />
      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16">
        <div className="mx-auto max-w-2xl lg:max-w-none lg:grid lg:grid-cols-[minmax(0,42rem)_15rem] lg:justify-center lg:gap-12">
          <div>
            <GuideHeader
              title="How to Study for PSLE Science"
              author="By the LionCity Tutors primary team"
              meta="Updated August 26, 2026 · 9 min read"
            />

            <article className="space-y-12 text-gray-700 leading-relaxed">
              <p className="text-lg text-gray-800 leading-relaxed text-pretty">
                PSLE Science is a single paper, and its shape surprises most parents: the multiple-choice booklet carries more marks than the written one. Sixty of the hundred marks are decided by choosing between four options, at two marks a question — with no working to fall back on.
              </p>

              <KeyTakeaways
                items={[
                  <><strong>Booklet A is 60 marks</strong> — 30 questions at 2 marks each.</>,
                  <><strong>Booklet B is 40 marks</strong> — 10 to 11 structured questions worth 2 to 5 marks.</>,
                  <>One paper, <strong>1 h 45 min</strong>, everything compulsory.</>,
                  <>A wrong multiple-choice answer earns nothing; there is no method mark.</>,
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
                <SectionHeading icon={Scale}>One paper, two booklets</SectionHeading>
                <GuideCard className="mt-5">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left border-collapse">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th scope="col" className="py-2 pr-3 font-semibold text-gray-900">Booklet</th>
                          <th scope="col" className="py-2 pr-3 font-semibold text-gray-900">Type</th>
                          <th scope="col" className="py-2 pr-3 font-semibold text-gray-900">Questions</th>
                          <th scope="col" className="py-2 pr-3 font-semibold text-gray-900">Each</th>
                          <th scope="col" className="py-2 font-semibold text-gray-900">Marks</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-gray-100 align-top">
                          <td className="py-2 pr-3 font-medium text-gray-900">A</td>
                          <td className="py-2 pr-3 text-gray-700">Multiple choice</td>
                          <td className="py-2 pr-3 text-gray-700">30</td>
                          <td className="py-2 pr-3 text-gray-700">2 marks</td>
                          <td className="py-2 font-semibold text-primary tabular-nums">60</td>
                        </tr>
                        <tr className="align-top">
                          <td className="py-2 pr-3 font-medium text-gray-900">B</td>
                          <td className="py-2 pr-3 text-gray-700">Structured</td>
                          <td className="py-2 pr-3 text-gray-700">10–11</td>
                          <td className="py-2 pr-3 text-gray-700">2–5 marks</td>
                          <td className="py-2 font-semibold text-primary tabular-nums">40</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <p className="mt-3 text-sm text-gray-600">
                    Both booklets are compulsory and sat as one paper of 1 hour 45 minutes.
                  </p>
                </GuideCard>
              </section>

              <section id="mcq" className="scroll-mt-24">
                <SectionHeading icon={ListFilter}>Why the multiple-choice booklet is the paper</SectionHeading>
                <p className="text-pretty">
                  Sixty per cent of PSLE Science is decided in Booklet A. That single fact should change how it is practised, because multiple choice is usually treated as the light half — quick to do, quick to mark, and easy to review superficially by checking the score.
                </p>
                <p className="mt-4 text-pretty">
                  It also behaves differently from PSLE Maths. In Maths, a wrong short answer can still earn a method mark. Here a wrong option earns nothing at all, and each one costs two marks. The gap between a pupil who eliminates and a pupil who guesses is worth more in this subject than in any other at the level.
                </p>
                <GuideCard className="mt-5">
                  <h4 className="font-semibold text-gray-900 mb-3">Reviewing MCQs properly</h4>
                  <ul className="list-disc ml-5 space-y-1.5 text-sm text-gray-700">
                    <li><strong>Explain every wrong option,</strong> not just the right one. The distractors are written around specific misconceptions.</li>
                    <li><strong>Note which ones were guessed,</strong> even when correct. A lucky guess is an unlearned question.</li>
                    <li><strong>Re-read the stem before the options.</strong> Many errors are misreadings, not gaps in knowledge.</li>
                    <li><strong>Watch for "most likely" and "best"</strong> — these ask you to rank plausible options, not find the only true one.</li>
                  </ul>
                </GuideCard>
              </section>

              <section id="booklet-b" className="scroll-mt-24">
                <SectionHeading icon={PenLine}>Writing answers that score in Booklet B</SectionHeading>
                <p className="text-pretty">
                  Forty marks across ten or eleven questions worth 2 to 5 marks each. These reward explanation, and explanation at this level means a chain rather than a statement.
                </p>
                <GuideCard className="mt-4">
                  <h4 className="font-semibold text-gray-900 mb-3">The shape of a scoring answer</h4>
                  <ul className="list-disc ml-5 space-y-1.5 text-sm text-gray-700">
                    <li><strong>Name the concept</strong> that applies.</li>
                    <li><strong>Apply it to the situation in the question</strong> — the specific plant, circuit or experiment described.</li>
                    <li><strong>Give the chain:</strong> because this changes, that happens, so this results.</li>
                    <li><strong>Use the data supplied</strong> where the question provides a table or graph.</li>
                    <li><strong>Match the length to the marks</strong> — a 2-mark question is not asking for five lines.</li>
                  </ul>
                </GuideCard>
                <p className="mt-4 text-pretty">
                  The most common loss our tutors see is an answer that is scientifically correct in general and never mentions the thing in the question. The concept earns part of the mark; applying it earns the rest.
                </p>
              </section>

              <section id="revision" className="scroll-mt-24">
                <SectionHeading icon={Repeat}>How to revise PSLE Science</SectionHeading>
                <GuideCard className="mt-4">
                  <ul className="list-disc ml-5 space-y-2 text-sm text-gray-700">
                    <li><strong>Give Booklet A its 60% share</strong> of practice time, and review wrong options rather than just scores.</li>
                    <li><strong>Drill the explanation chain</strong> until because-so-therefore is automatic.</li>
                    <li><strong>Practise experiment questions</strong> by labelling what changed, what was measured, and what stayed the same.</li>
                    <li><strong>Learn confusable terms in pairs,</strong> with the distinction written down.</li>
                    <li><strong>Mix topics.</strong> Questions cross themes, and topic-sorted worksheets do not.</li>
                    <li><strong>Sit whole papers to time.</strong> Prelim and past-year primary papers are in our <Link href="/free-test-papers" className="text-primary underline underline-offset-2">free test papers library</Link>.</li>
                  </ul>
                </GuideCard>
                <p className="mt-4 text-pretty">
                  For topic coverage across the primary syllabus, see our{' '}
                  <Link href="/psle-science" className="text-primary underline underline-offset-2">PSLE Science subject guide</Link>, and our{' '}
                  <Link href="/how-to-study/psle-math" className="text-primary underline underline-offset-2">PSLE Maths study guide</Link> for the other core paper.
                </p>
              </section>

              <section id="mistakes" className="scroll-mt-24">
                <SectionHeading icon={TriangleAlert}>10 common PSLE Science mistakes</SectionHeading>
                <p className="text-gray-700 mb-5">
                  These are the ones our tutors correct most often across both booklets, and what to do instead.
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
                Examination format and mark allocations are from the PSLE Science syllabus 0009, for examination from 2026, published by SEAB. Always check the current syllabus for your exam year.
              </p>

              <RelatedGuides slug="how-to-study-psle-science" />

              <GuideCTA
                title="Get a PSLE Science tutor who marks like an examiner"
                description={`Tell us where the marks are going — multiple choice, open-ended explanation, or a specific theme. We hand-match a vetted PSLE Science tutor, usually within ${MATCH_TIME}, and parents never pay an agency fee.`}
                buttonText="Find a PSLE Science tutor"
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
