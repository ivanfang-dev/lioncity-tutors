import { MATCH_TIME } from '@/data/promises';
import { DEFAULT_OG_IMAGE } from '@/lib/seo/openGraph';

export const metadata = {
  title: 'How to Study for PSLE Maths (0008): Where the Marks Are',
  description:
    'How to study for PSLE Maths — the exact mark split across all three booklets, the method mark most pupils throw away, and 10 mistakes worth fixing early.',
  keywords: [
    'how to study for psle math',
    'PSLE Mathematics 0008',
    'PSLE maths paper 1 paper 2 format',
    'psle math marks breakdown',
    'psle math booklet a booklet b',
    'psle maths method marks',
  ],
  openGraph: {
    images: [DEFAULT_OG_IMAGE],
    title: 'How to Study for PSLE Maths (0008): Where the Marks Are',
    description:
      'The exact mark split across all three PSLE Maths booklets, the method mark most pupils throw away, and 10 mistakes worth fixing early.',
    url: 'https://www.lioncitytutors.com/how-to-study/psle-math',
    type: 'article',
  },
  alternates: {
    canonical: 'https://www.lioncitytutors.com/how-to-study/psle-math',
  },
};

import Link from 'next/link';
import TableOfContents from '@/components/TableOfContents';
import GuideSchema from '@/components/seo/GuideSchema';
import {
  GuideHeader, SectionHeading, GuideCard, KeyTakeaways, GuideCTA, ICON_STROKE,
  RelatedGuides,
} from '@/components/guide';
import { Scale, PenLine, Clock, Repeat, TriangleAlert, ListChecks } from 'lucide-react';

const tableOfContents = [
  { id: 'mark-map', label: 'All 100 marks, booklet by booklet' },
  { id: 'method-marks', label: 'The method mark pupils throw away' },
  { id: 'timing', label: 'Two very different papers' },
  { id: 'revision', label: 'How to revise PSLE Maths' },
  { id: 'mistakes', label: '10 common mistakes' },
];

// Straight from the 0008 examination format table. Worth printing in full,
// because the shape of it is what tells a parent where the practice should go.
const booklets = [
  { paper: 'Paper 1', booklet: 'Booklet A', type: 'Multiple choice', qs: '10 questions', each: '1 mark', total: '10' },
  { paper: 'Paper 1', booklet: 'Booklet A', type: 'Multiple choice', qs: '8 questions', each: '2 marks', total: '16' },
  { paper: 'Paper 1', booklet: 'Booklet B', type: 'Short answer', qs: '12 questions', each: '2 marks', total: '24' },
  { paper: 'Paper 2', booklet: 'Booklet C', type: 'Short answer', qs: '5 questions', each: '2 marks', total: '10' },
  { paper: 'Paper 2', booklet: 'Booklet C', type: 'Structured / long answer', qs: '10 questions', each: '3, 4 or 5 marks', total: '40' },
];

const commonMistakes = [
  {
    mistake: 'Writing no working in Booklet B',
    detail: 'On a one-part short-answer question, 2 marks go to a correct answer — and if the answer is wrong, 1 mark is still awarded for the correct method. A blank space beside a wrong answer earns nothing at all.',
    fix: 'Show the working even on 2-mark questions. Across twelve of them, the habit is worth real marks on a bad day.',
  },
  {
    mistake: 'Treating the long-answer section as the last thing',
    detail: 'The ten structured questions in Paper 2 carry 40 marks — 40% of the entire subject, and more than either booklet of Paper 1.',
    fix: 'Give them the majority of practice time, and never let them be the questions that get the leftover minutes.',
  },
  {
    mistake: 'Practising with a calculator throughout',
    detail: 'Calculators are not allowed in Paper 1, which is 50 of the 100 marks. A pupil who practises everything with one arrives without the arithmetic fluency the first paper assumes.',
    fix: 'Do all Paper 1 practice by hand. Save the calculator for Paper 2 practice, where it is permitted.',
  },
  {
    mistake: 'Rushing Paper 1 because the questions look small',
    detail: 'Paper 1 is 30 questions in 1 hour 10 minutes — a little over two minutes each. It rewards steadiness, and careless slips there cost the same as errors anywhere else.',
    fix: 'Practise short timed sets rather than long untimed ones, so the pace becomes familiar.',
  },
  {
    mistake: 'Not showing the method on long-answer questions',
    detail: 'These questions require the working to be shown. A correct final answer with no visible method cannot be awarded the marks allocated to the steps.',
    fix: 'Write each step on its own line. A 5-mark question is asking for several stages, not one number.',
  },
  {
    mistake: 'Changing the unit given in the question',
    detail: 'Any unit required in an answer is provided, and the answer must be given in that unit. Converting to something more convenient loses the mark even when the number is right.',
    fix: 'Check the unit printed beside the answer space before writing, and convert to it rather than away from it.',
  },
  {
    mistake: 'Guessing on multiple choice without eliminating',
    detail: 'Booklet A has 18 questions worth 26 marks, and the 2-mark items are not the same difficulty as the 1-mark ones. A blind guess wastes a question that elimination often solves.',
    fix: 'Rule out the impossible options first. On a 4-option question, removing two turns a guess into a coin flip.',
  },
  {
    mistake: 'Learning heuristics as named recipes',
    detail: 'Model drawing, working backwards and guess-and-check are strategies for reading a problem, not labels to match to it. Pupils taught to name the method often cannot start an unfamiliar question.',
    fix: 'Practise deciding what the question is asking before choosing an approach, on problems that have not been pre-sorted by topic.',
  },
  {
    mistake: 'Only practising questions from the current topic',
    detail: 'Topic-sorted worksheets tell the pupil the method before they read the question, which is the one help the exam will not give.',
    fix: 'Mix topics deliberately. Past papers do this naturally, which is part of why they are worth more than worksheets.',
  },
  {
    mistake: 'Leaving no time to check',
    detail: 'Both papers are on the same day with a break in between, and 45 questions across 2 hours 30 minutes leaves little slack for a pupil who has never practised finishing early.',
    fix: 'Build in a checking habit: re-read what the question asked, and confirm the answer is in the unit given.',
  },
];

export default function HowToStudyPsleMath() {
  const whatsappMessage = `Hi LionCity Tutors! I'd like help finding a PSLE Maths tutor.

Student level (e.g. P5 / P6):
Current grade:
Location:
Preferred days & timing: `;
  const whatsappHref = `https://wa.me/6588701152?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <>
      <GuideSchema
        slug="how-to-study-psle-math"
        article={{
          headline: 'How to Study for PSLE Maths (0008): Where the Marks Are',
          description:
            'The exact mark split across all three PSLE Maths booklets, the method mark most pupils throw away, and 10 mistakes worth fixing early.',
          datePublished: '2026-08-26',
          dateModified: '2026-08-26',
        }}
      />
      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16">
        <div className="mx-auto max-w-2xl lg:max-w-none lg:grid lg:grid-cols-[minmax(0,42rem)_15rem] lg:justify-center lg:gap-12">
          <div>
            <GuideHeader
              title="How to Study for PSLE Maths"
              author="By the LionCity Tutors primary team"
              meta="Updated August 26, 2026 · 9 min read"
            />

            <article className="space-y-12 text-gray-700 leading-relaxed">
              <p className="text-lg text-gray-800 leading-relaxed text-pretty">
                PSLE Mathematics publishes its mark scheme down to the individual question type, and the detail changes what practice should look like. One rule in particular is worth more than any revision technique: on some questions, a wrong answer still earns a mark if the working is there.
              </p>

              <KeyTakeaways
                items={[
                  <>On one-part short-answer questions, a wrong answer still earns <strong>1 of 2 marks for correct method</strong>.</>,
                  <>The ten long-answer questions carry <strong>40 of the 100 marks</strong> — more than either Paper 1 booklet.</>,
                  <><strong>No calculator in Paper 1</strong>, which is half the subject. Calculators are allowed in Paper 2.</>,
                  <>45 questions, 100 marks, 2 h 30 min in total, both papers on the same day.</>,
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
                <SectionHeading icon={Scale}>All 100 marks, booklet by booklet</SectionHeading>
                <p className="text-pretty">
                  Two papers, three booklets, 45 questions. The examination format sets out exactly how the marks fall.
                </p>
                <GuideCard className="mt-5">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left border-collapse">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th scope="col" className="py-2 pr-3 font-semibold text-gray-900">Paper</th>
                          <th scope="col" className="py-2 pr-3 font-semibold text-gray-900">Question type</th>
                          <th scope="col" className="py-2 pr-3 font-semibold text-gray-900">Number</th>
                          <th scope="col" className="py-2 pr-3 font-semibold text-gray-900">Each</th>
                          <th scope="col" className="py-2 font-semibold text-gray-900">Marks</th>
                        </tr>
                      </thead>
                      <tbody>
                        {booklets.map((row, i) => (
                          <tr key={i} className="border-b border-gray-100 last:border-0 align-top">
                            <td className="py-2 pr-3 text-gray-700 whitespace-nowrap">{row.paper}</td>
                            <td className="py-2 pr-3 text-gray-700">{row.type}</td>
                            <td className="py-2 pr-3 text-gray-700 whitespace-nowrap">{row.qs}</td>
                            <td className="py-2 pr-3 text-gray-700 whitespace-nowrap">{row.each}</td>
                            <td className="py-2 font-semibold text-primary tabular-nums">{row.total}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="mt-3 text-sm text-gray-600">
                    Paper 1 is 1 h 10 min and carries 50 marks. Paper 2 is 1 h 20 min and carries the other 50.
                  </p>
                </GuideCard>
                <p className="mt-4 text-pretty">
                  The line that should govern a revision plan is the last one: <strong>ten questions, 40 marks</strong>. The long-answer section is worth more than all of Booklet A, and more than all of Booklet B. It is also the section that tends to be practised last.
                </p>
              </section>

              <section id="method-marks" className="scroll-mt-24">
                <SectionHeading icon={PenLine}>The method mark pupils throw away</SectionHeading>
                <p className="text-pretty">
                  The marking rules for short-answer questions are published, and they contain something many pupils have never been told.
                </p>
                <GuideCard className="mt-5">
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li><strong className="text-gray-900">One-part question:</strong> 2 marks for the correct answer. If the answer is wrong, <strong>1 mark is awarded for the correct method</strong>.</li>
                    <li><strong className="text-gray-900">Two-part question:</strong> 2 marks in total, one for each part.</li>
                    <li><strong className="text-gray-900">Structured / long answer:</strong> the method must be shown clearly, and the marks are allocated across the steps.</li>
                    <li><strong className="text-gray-900">Units:</strong> any unit needed is printed for you, and the answer must be given in it.</li>
                  </ul>
                </GuideCard>
                <p className="mt-4 text-pretty">
                  Booklet B has twelve one-part short-answer questions. A pupil who works them mentally and writes only a number is playing all twelve for two marks or nothing. A pupil who writes the working keeps a mark on every question they get wrong — and on a difficult paper, that is the difference between grade bands.
                </p>
              </section>

              <section id="timing" className="scroll-mt-24">
                <SectionHeading icon={Clock}>Two very different papers</SectionHeading>
                <p className="text-pretty">
                  The two papers carry the same 50 marks and ask for almost opposite things.
                </p>
                <GuideCard className="mt-5">
                  <h4 className="font-semibold text-gray-900 mb-1">Paper 1 — 1 h 10 min, 30 questions, no calculator</h4>
                  <p className="text-sm text-gray-700">
                    Roughly two minutes a question, and every calculation done by hand. This paper rewards arithmetic fluency and steadiness more than problem-solving depth.
                  </p>
                </GuideCard>
                <GuideCard className="mt-4">
                  <h4 className="font-semibold text-gray-900 mb-1">Paper 2 — 1 h 20 min, 15 questions, calculator allowed</h4>
                  <p className="text-sm text-gray-700">
                    Roughly five minutes a question, ten of them worth 3 to 5 marks each. This paper rewards reading the problem properly and setting out a method.
                  </p>
                </GuideCard>
                <p className="mt-4 text-pretty">
                  Practising everything with a calculator prepares for one paper and quietly undermines the other. Both are on the same day, with a break between them.
                </p>
              </section>

              <section id="revision" className="scroll-mt-24">
                <SectionHeading icon={Repeat}>How to revise PSLE Maths</SectionHeading>
                <GuideCard className="mt-4">
                  <ul className="list-disc ml-5 space-y-2 text-sm text-gray-700">
                    <li><strong>Weight practice to the long-answer questions.</strong> Forty marks sit there, and they are the ones that reward method.</li>
                    <li><strong>Do Paper 1 practice by hand.</strong> Fifty marks depend on arithmetic without a calculator.</li>
                    <li><strong>Make showing working automatic,</strong> including on 2-mark questions where the method mark exists.</li>
                    <li><strong>Mix topics.</strong> Topic-sorted worksheets announce the method; the exam will not.</li>
                    <li><strong>Use whole past papers to time.</strong> Prelim and past-year primary papers are in our <Link href="/free-test-papers" className="text-primary underline underline-offset-2">free test papers library</Link>.</li>
                    <li><strong>Work one heuristic at a time.</strong> Our free <Link href="/free-notes" className="text-primary underline underline-offset-2">PSLE Maths revision notes</Link> take model drawing, the branch method, assumption, before-change-after, working backwards, pattern recognition and systematic listing one per section, and open on what the 2026 syllabus changed.</li>
                    <li><strong>Mark against the scheme and classify the loss</strong> — concept, method, arithmetic slip, or misread question. Each needs a different response.</li>
                  </ul>
                </GuideCard>
                <p className="mt-4 text-pretty">
                  For topic coverage across the primary syllabus, see our{' '}
                  <Link href="/psle-math" className="text-primary underline underline-offset-2">PSLE Maths subject guide</Link>. This page is about where the marks are; that one is about what is on the syllabus.
                </p>
              </section>

              <section id="mistakes" className="scroll-mt-24">
                <SectionHeading icon={TriangleAlert}>10 common PSLE Maths mistakes</SectionHeading>
                <p className="text-gray-700 mb-5">
                  These are the ones our tutors correct most often across the three booklets, and what to do instead.
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
                Examination format, mark allocations and the marking rules for each item type are from the PSLE Mathematics syllabus 0008, for examination from 2026, published by SEAB. Always check the current syllabus for your exam year.
              </p>

              <RelatedGuides slug="how-to-study-psle-math" />

              <GuideCTA
                title="Get a PSLE Maths tutor who marks like an examiner"
                description={`Tell us where the marks are going — Paper 1 speed, long-answer method, or a specific topic. We hand-match a vetted PSLE Maths tutor, usually within ${MATCH_TIME}, and parents never pay an agency fee.`}
                buttonText="Find a PSLE Maths tutor"
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
