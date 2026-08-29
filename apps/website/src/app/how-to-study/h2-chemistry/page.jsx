import { MATCH_TIME } from '@/data/promises';
import { DEFAULT_OG_IMAGE } from '@/lib/seo/openGraph';

export const metadata = {
  title: 'How to Study for H2 Chemistry (9476): Where the Marks Are',
  description:
    'How to study for A-Level H2 Chemistry — why Paper 3 carries 35% of the grade and Paper 1 only 15%, what the Data Booklet gives you, and 10 common mistakes.',
  keywords: [
    'how to study for h2 chemistry',
    'a level h2 chemistry',
    'H2 Chemistry 9476',
    'H2 chemistry paper weighting',
    'chemistry data booklet A level',
    'H2 chemistry data based question',
  ],
  openGraph: {
    images: [DEFAULT_OG_IMAGE],
    title: 'How to Study for H2 Chemistry (9476): Where the Marks Are',
    description:
      'Why Paper 3 carries 35% and Paper 1 only 15%, what the Data Booklet gives you, and the 10 mistakes our tutors correct most.',
    url: 'https://www.lioncitytutors.com/how-to-study/h2-chemistry',
    type: 'article',
  },
  alternates: {
    canonical: 'https://www.lioncitytutors.com/how-to-study/h2-chemistry',
  },
};

import Link from 'next/link';
import TableOfContents from '@/components/TableOfContents';
import GuideSchema from '@/components/seo/GuideSchema';
import {
  GuideHeader, SectionHeading, GuideCard, KeyTakeaways, GuideCTA, ICON_STROKE,
  RelatedGuides,
} from '@/components/guide';
import { Scale, BookOpen, Brain, Repeat, TriangleAlert, ListChecks } from 'lucide-react';

const tableOfContents = [
  { id: 'mark-map', label: 'Four papers, uneven weights' },
  { id: 'objectives', label: 'Applying outweighs knowing' },
  { id: 'data-booklet', label: 'What you are given' },
  { id: 'revision', label: 'How to revise H2 Chemistry' },
  { id: 'mistakes', label: '10 common mistakes' },
];

const papers = [
  {
    paper: 'Paper 1 — Multiple Choice',
    stat: '1 h · 30 marks · 15%',
    detail: '30 compulsory questions, all with four options. Five to eight are multiple-completion items, where more than one statement can be correct.',
  },
  {
    paper: 'Paper 2 — Structured',
    stat: '2 h · 75 marks · 30%',
    detail: 'A variable number of compulsory structured questions, answered on the paper. Data-based questions account for 20–25 of the 75 marks.',
  },
  {
    paper: 'Paper 3 — Structured',
    stat: '2 h · 75 marks · 35%',
    detail: 'Section A is 55 marks across 3–4 compulsory questions of 15–25 marks each. Section B is 20 marks: two questions of 20, and you answer one. This is the only choice anywhere in the subject.',
  },
  {
    paper: 'Paper 4 — Practical',
    stat: '2 h 30 min · 50 marks · 20%',
    detail: 'Experimental skills and investigations. The Qualitative Analysis Notes are made available for this paper.',
  },
];

const objectives = [
  { ao: 'A — Knowledge with understanding', weight: '36%', where: 'Papers 1, 2 and 3' },
  { ao: 'B — Handling, applying and evaluating information', weight: '44%', where: 'Papers 1, 2 and 3' },
  { ao: 'C — Experimental skills and investigations', weight: '20%', where: 'Paper 4' },
];

const commonMistakes = [
  {
    mistake: 'Revising as though knowledge is the biggest category',
    detail: 'It is not. Handling, applying and evaluating information carries 44% of the marks against 36% for knowledge with understanding. More of the paper rewards what you do with chemistry than what you can state about it.',
    fix: 'Spend the majority of revision on unseen problems rather than on notes. If a session produced no question you had not seen before, it worked the smaller category.',
  },
  {
    mistake: 'Giving Paper 1 the most practice time',
    detail: 'Multiple choice is quick to mark and satisfying to drill, and it is worth 15% — the smallest component of the four. Paper 3 is worth 35%, more than twice as much.',
    fix: 'Weight practice to Papers 2 and 3, which together carry 65% of the grade.',
  },
  {
    mistake: 'Memorising what the Data Booklet contains',
    detail: 'A Data Booklet, including the Periodic Table, is provided in all three theory papers. Time spent committing those values to memory buys nothing.',
    fix: 'Learn to navigate it instead. Knowing where a value lives, and which questions expect you to reach for one, is the skill being rewarded.',
  },
  {
    mistake: 'Learning the Qualitative Analysis Notes for the theory papers',
    detail: 'They are made available for the practical, Paper 4. The theory papers get the Data Booklet, which is a different document.',
    fix: 'Know which document you get in which paper, and revise for the gap rather than for the thing in front of you.',
  },
  {
    mistake: 'Choosing the Paper 3 Section B question too quickly',
    detail: 'It is the only choice in the entire subject, worth 20 marks, and the friendlier opening is often the harder question once the later parts arrive.',
    fix: 'Read both questions completely, including every sub-part, before committing. Two minutes here protects 20 marks.',
  },
  {
    mistake: 'Treating data-based questions as an afterthought',
    detail: 'They carry 20–25 of Paper 2’s 75 marks — roughly a third of that paper, and around 8% of the whole grade — and they are designed to be unfamiliar.',
    fix: 'Practise interpreting stems you have never seen. The chemistry needed is always syllabus chemistry; only the context is new.',
  },
  {
    mistake: 'Answering multiple-completion items like ordinary MCQs',
    detail: 'Five to eight of the 30 questions in Paper 1 are multiple-completion, where several statements may be individually true and the answer depends on which combination holds.',
    fix: 'Evaluate every statement on its own before looking at the options. Reading the options first is what produces the guess.',
  },
  {
    mistake: 'Explaining with the observation rather than the reason',
    detail: 'At H2 the mark schemes reward mechanism and justification. Describing what happens, however accurately, does not answer a question asking why.',
    fix: 'Check that every explanation names the underlying cause — bonding, energetics, kinetics or structure — rather than restating the result.',
  },
  {
    mistake: 'Learning topics in isolation',
    detail: 'The syllabus states that questions in Papers 2 and 3 will require integrating knowledge from different areas and topics. A student who revises topic by topic meets the paper unprepared for the joins.',
    fix: 'Practise questions that cross topics deliberately, and note which combinations recur.',
  },
  {
    mistake: 'Leaving the practical to look after itself',
    detail: 'Paper 4 is 20% of the grade — larger than Paper 1 — and rewards planning, observation and evaluation technique that theory revision never touches.',
    fix: 'Rehearse the recording and evaluation steps specifically. Those marks are available even when an experiment goes imperfectly.',
  },
];

export default function HowToStudyH2Chemistry() {
  const whatsappMessage = `Hi LionCity Tutors! I'd like help finding an H2 Chemistry tutor.

Student level (e.g. JC1 / JC2):
Current grade:
Location:
Preferred days & timing: `;
  const whatsappHref = `https://wa.me/6588701152?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <>
      <GuideSchema
        slug="how-to-study-h2-chemistry"
        article={{
          headline: 'How to Study for H2 Chemistry (9476): Where the Marks Are',
          description:
            'Why Paper 3 carries 35% and Paper 1 only 15%, what the Data Booklet gives you, and the 10 mistakes our tutors correct most.',
          datePublished: '2026-08-26',
          dateModified: '2026-08-26',
        }}
      />
      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16">
        <div className="mx-auto max-w-2xl lg:max-w-none lg:grid lg:grid-cols-[minmax(0,42rem)_15rem] lg:justify-center lg:gap-12">
          <div>
            <GuideHeader
              title="How to Study for H2 Chemistry"
              author="By the LionCity Tutors science team"
              meta="Updated August 26, 2026 · 11 min read"
            />

            <article className="space-y-12 text-gray-700 leading-relaxed">
              <p className="text-lg text-gray-800 leading-relaxed text-pretty">
                H2 Chemistry has four papers, and they are not close to equally weighted. Syllabus 9476 also publishes how the marks divide between knowing chemistry and doing something with it — and the second is the larger share. Most revision plans are built as though the opposite were true.
              </p>

              <KeyTakeaways
                items={[
                  <><strong>Paper 3 is 35%</strong> of the grade. Paper 1, the multiple choice, is <strong>15%</strong>.</>,
                  <>Applying and evaluating information carries <strong>44%</strong> of the marks; knowledge carries 36%.</>,
                  <>A <strong>Data Booklet</strong> is provided in all three theory papers; the QA Notes appear in the practical instead.</>,
                  <>The one choice in the whole subject is Paper 3 Section B — two questions, answer one.</>,
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
                <p className="text-pretty">
                  All four are compulsory, and the spread between the largest and smallest is wide enough to change how a term of revision should be spent.
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
                  Papers 2 and 3 together are 65% of the grade. Paper 1 is 15%, and it is the one most students practise most, because multiple choice is fast to do and instantly marked. That is a poor reason to give it the most time.
                </p>
              </section>

              <section id="objectives" className="scroll-mt-24">
                <SectionHeading icon={Brain}>Applying outweighs knowing</SectionHeading>
                <p className="text-pretty">
                  The syllabus publishes the weighting of its assessment objectives, and the result is worth sitting with.
                </p>
                <GuideCard className="mt-5">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left border-collapse">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th scope="col" className="py-2 pr-3 font-semibold text-gray-900">Assessment objective</th>
                          <th scope="col" className="py-2 pr-3 font-semibold text-gray-900">Weighting</th>
                          <th scope="col" className="py-2 font-semibold text-gray-900">Assessed in</th>
                        </tr>
                      </thead>
                      <tbody>
                        {objectives.map((row) => (
                          <tr key={row.ao} className="border-b border-gray-100 last:border-0 align-top">
                            <td className="py-2 pr-3 text-gray-700">{row.ao}</td>
                            <td className="py-2 pr-3 font-semibold text-primary tabular-nums">{row.weight}</td>
                            <td className="py-2 text-gray-700">{row.where}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </GuideCard>
                <p className="mt-4 text-pretty">
                  Handling, applying and evaluating information is the largest single category in the subject, and it is assessed in every theory paper. A revision routine built around rereading notes is aimed at the 36%. The 44% is only reachable through problems you have not seen before — which is also why practice from a bank of familiar questions stops producing improvement after a while.
                </p>
              </section>

              <section id="data-booklet" className="scroll-mt-24">
                <SectionHeading icon={BookOpen}>What you are given, and where</SectionHeading>
                <p className="text-pretty">
                  Two different reference documents appear in this subject, and they appear in different papers. Knowing which is which decides what is worth memorising.
                </p>
                <GuideCard className="mt-5">
                  <h4 className="font-semibold text-gray-900 mb-1">Theory papers — Papers 1, 2 and 3</h4>
                  <p className="text-sm text-gray-700">
                    A <strong>Data Booklet</strong>, including the Periodic Table. The syllabus itself points to it for things like the factors influencing ionisation energies, so questions are written on the assumption you will consult it.
                  </p>
                </GuideCard>
                <GuideCard className="mt-4">
                  <h4 className="font-semibold text-gray-900 mb-1">Practical — Paper 4</h4>
                  <p className="text-sm text-gray-700">
                    The <strong>Qualitative Analysis Notes</strong> are made available. The Data Booklet belongs to the theory papers; do not plan the practical around it.
                  </p>
                </GuideCard>
                <p className="mt-4 text-pretty">
                  The practical consequence is the same one that catches O-Level students, in mirror image: revise the material you will <em>not</em> be handed, and practise navigating the material you will. If you also sit O-Level Chemistry in memory, note that the arrangement there differs — our{' '}
                  <Link href="/how-to-study/o-level-chemistry" className="text-primary underline underline-offset-2">O-Level Chemistry guide</Link>{' '}
                  covers that one.
                </p>
              </section>

              <section id="revision" className="scroll-mt-24">
                <SectionHeading icon={Repeat}>How to revise H2 Chemistry</SectionHeading>
                <GuideCard className="mt-4">
                  <ul className="list-disc ml-5 space-y-2 text-sm text-gray-700">
                    <li><strong>Weight time to Papers 2 and 3.</strong> They carry 65% between them; Paper 1 carries 15%.</li>
                    <li><strong>Work unseen problems, not notes.</strong> The 44% category cannot be revised by rereading, and familiar questions stop testing it once you remember the answer.</li>
                    <li><strong>Practise crossing topics.</strong> The syllabus says Papers 2 and 3 require integrating different areas, so revise the joins rather than the topics alone.</li>
                    <li><strong>Drill data-based stems.</strong> They are 20–25 marks of Paper 2 and deliberately unfamiliar. Past-year and prelim papers are in our <Link href="/free-test-papers" className="text-primary underline underline-offset-2">free test papers library</Link>.</li>
                    <li><strong>Learn to navigate the Data Booklet under time.</strong> Finding a value quickly is a skill; memorising it is wasted effort.</li>
                    <li><strong>Rehearse Paper 4 separately.</strong> Twenty per cent of the grade sits in technique that theory revision does not build.</li>
                    <li><strong>Keep one reference you can check against.</strong> Our free <Link href="/free-notes" className="text-primary underline underline-offset-2">H2 Chemistry study notes</Link> cover all thirteen topics in 15 pages, with the Paper 4 titration, calorimetry and QA technique and a sheet of the equations and constants worth memorising.</li>
                  </ul>
                </GuideCard>
                <p className="mt-4 text-pretty">
                  For topic-by-topic coverage of syllabus 9476, see our{' '}
                  <Link href="/a-level-chemistry" className="text-primary underline underline-offset-2">A-Level H2 Chemistry subject guide</Link>. This page is about where the marks are; that one is about what is on the syllabus.
                </p>
              </section>

              <section id="mistakes" className="scroll-mt-24">
                <SectionHeading icon={TriangleAlert}>10 common H2 Chemistry mistakes</SectionHeading>
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
                Paper structure, weightings, assessment objectives and the Data Booklet arrangements are from the Singapore-Cambridge GCE A-Level H2 Chemistry syllabus 9476 (2026), published by SEAB. Always check the current syllabus for your exam year.
              </p>

              <RelatedGuides slug="how-to-study-h2-chemistry" />

              <GuideCTA
                title="Get an H2 Chemistry tutor who marks like an examiner"
                description={`Tell us where the marks are going — Paper 2, Paper 3 or the practical. We hand-match a vetted H2 Chemistry tutor, usually within ${MATCH_TIME}, and parents never pay an agency fee.`}
                buttonText="Find an H2 Chemistry tutor"
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
