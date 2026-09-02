import { MATCH_TIME } from '@/data/promises';
import { DEFAULT_OG_IMAGE } from '@/lib/seo/openGraph';

export const metadata = {
  title: 'How to Study for O-Level Chemistry (6092): Marks & QA Notes',
  description:
    'How to study for O-Level Chemistry — how the three papers split, the qualitative analysis tests to memorise for Paper 2, command words and 10 common mistakes.',
  keywords: [
    'how to study for o level chemistry',
    'O Level Chemistry 6092',
    'qualitative analysis O Level chemistry',
    'chemistry QA tests table',
    'O Level chemistry paper 2 structure',
    'chemistry command words',
    'pure chemistry O Level Singapore',
  ],
  openGraph: {
    images: [DEFAULT_OG_IMAGE],
    title: 'How to Study for O-Level Chemistry (6092): Marks & QA Notes',
    description:
      'How the three Chemistry papers are weighted, the qualitative analysis tests worth memorising, and the 10 mistakes our tutors correct most.',
    url: 'https://www.lioncitytutors.com/how-to-study/o-level-chemistry',
    type: 'article',
  },
  alternates: {
    canonical: 'https://www.lioncitytutors.com/how-to-study/o-level-chemistry',
  },
};

import Link from 'next/link';
import TableOfContents from '@/components/TableOfContents';
import GuideSchema from '@/components/seo/GuideSchema';
import {
  GuideHeader, SectionHeading, GuideCard, KeyTakeaways, GuideCTA, ICON_STROKE,
  RelatedGuides,
} from '@/components/guide';
import { Scale, FlaskConical, ClipboardList, Repeat, TriangleAlert, ListChecks } from 'lucide-react';

const tableOfContents = [
  { id: 'mark-map', label: 'How the three papers split' },
  { id: 'qa-notes', label: 'Qualitative analysis notes' },
  { id: 'command-words', label: 'What the command words want' },
  { id: 'revision', label: 'How to revise Chemistry' },
  { id: 'mistakes', label: '10 common mistakes' },
];

const papers = [
  {
    paper: 'Paper 1 — Multiple Choice',
    stat: '1 h · 40 marks · 30%',
    detail: '40 compulsory multiple-choice items. A Periodic Table is printed in the paper.',
  },
  {
    paper: 'Paper 2 — Structured and Free Response',
    stat: '1 h 45 min · 80 marks · 50%',
    detail:
      'Section A carries 70 marks of compulsory structured questions; the last two are worth 20 marks between them, one being a data-based question worth 8–12. Section B carries 10 marks — two questions, of which you answer one. A Periodic Table is printed.',
  },
  {
    paper: 'Paper 3 — Practical',
    stat: '1 h 50 min · 40 marks · 20%',
    detail:
      'Compulsory practical questions, one or more of which may assess Planning. No notes or textbooks are allowed — but a copy of the Notes for Qualitative Analysis is printed in this paper.',
  },
];

// The anion, cation and gas tests as published in the 6092 Notes for Qualitative
// Analysis. Reproduced here because of where they are — and are not — printed:
// candidates get them in Paper 3 and not in Paper 2, which inverts the way most
// students revise them.
const anionTests = [
  { ion: 'Carbonate, CO₃²⁻', test: 'Add dilute acid', result: 'Effervescence; carbon dioxide produced' },
  { ion: 'Chloride, Cl⁻ (aq)', test: 'Acidify with dilute nitric acid, then add aqueous silver nitrate', result: 'White precipitate' },
  { ion: 'Iodide, I⁻ (aq)', test: 'Acidify with dilute nitric acid, then add aqueous silver nitrate', result: 'Yellow precipitate' },
  { ion: 'Nitrate, NO₃⁻ (aq)', test: 'Add aqueous sodium hydroxide, then aluminium foil; warm carefully', result: 'Ammonia produced' },
  { ion: 'Sulfate, SO₄²⁻ (aq)', test: 'Acidify with dilute nitric acid, then add aqueous barium nitrate', result: 'White precipitate' },
];

const cationTests = [
  { ion: 'Aluminium, Al³⁺', naoh: 'White ppt., soluble in excess giving a colourless solution', ammonia: 'White ppt., insoluble in excess' },
  { ion: 'Ammonium, NH₄⁺', naoh: 'Ammonia produced on warming', ammonia: '—' },
  { ion: 'Calcium, Ca²⁺', naoh: 'White ppt., insoluble in excess', ammonia: 'No precipitate' },
  { ion: 'Copper(II), Cu²⁺', naoh: 'Light blue ppt., insoluble in excess', ammonia: 'Light blue ppt., soluble in excess giving a dark blue solution' },
  { ion: 'Iron(II), Fe²⁺', naoh: 'Green ppt., insoluble in excess', ammonia: 'Green ppt., insoluble in excess' },
  { ion: 'Iron(III), Fe³⁺', naoh: 'Red-brown ppt., insoluble in excess', ammonia: 'Red-brown ppt., insoluble in excess' },
  { ion: 'Zinc, Zn²⁺', naoh: 'White ppt., soluble in excess giving a colourless solution', ammonia: 'White ppt., soluble in excess giving a colourless solution' },
];

const gasTests = [
  { gas: 'Ammonia, NH₃', test: 'Turns damp red litmus paper blue' },
  { gas: 'Carbon dioxide, CO₂', test: 'Gives a white precipitate with limewater, which dissolves with excess CO₂' },
  { gas: 'Chlorine, Cl₂', test: 'Bleaches damp litmus paper' },
  { gas: 'Hydrogen, H₂', test: 'Pops with a lighted splint' },
  { gas: 'Oxygen, O₂', test: 'Relights a glowing splint' },
  { gas: 'Sulfur dioxide, SO₂', test: 'Turns acidified aqueous potassium manganate(VII) from purple to colourless' },
];

// The syllabus publishes a glossary of command words. These are the ones our
// tutors see cost marks, phrased as what the answer has to contain.
const commandWords = [
  { word: 'Describe', wants: 'The main points in words, and for a phenomenon that means the visible observations. For an experiment, work through apparatus, method, measurement, results and precautions.' },
  { word: 'Explain', wants: 'The reason, not the observation. If the answer does not contain a "because", it is probably still describing.' },
  { word: 'Compare', wants: 'Both similarities and differences. An answer giving only differences has answered half the question.' },
  { word: 'Construct', wants: 'A balanced equation built by analogy or from information in the question — not recalled. Unfamiliar reagents are the point, not a mistake.' },
  { word: 'Determine', wants: 'A quantity you cannot measure directly, reached by substituting known values into a standard formula. Show the substitution.' },
  { word: 'Calculate', wants: 'A numerical answer, with working shown wherever two or more steps are involved.' },
  { word: 'Define', wants: 'A formal statement or an equivalent paraphrase. Literally the definition — an example is not a definition.' },
  { word: 'Suggest', wants: 'An answer applying familiar chemistry to an unfamiliar case. There is often more than one acceptable response.' },
];

const commonMistakes = [
  {
    mistake: 'Memorising qualitative analysis for the wrong paper',
    detail: 'The Notes for Qualitative Analysis are printed in Paper 3, the practical — and not in Paper 2, where QA questions also appear. Students routinely revise the tables for the practical and then meet them unaided in the theory paper.',
    fix: 'Know the tables cold for Paper 2. In Paper 3 read the printed copy rather than trusting memory under time pressure.',
  },
  {
    mistake: 'Describing an observation when asked to explain',
    detail: '"The solution turns blue" answers describe. Explain wants the chemistry that caused it, and the mark scheme separates the two.',
    fix: 'Check every explain answer contains a because. If it does not, the reason is missing.',
  },
  {
    mistake: 'Leaving out state symbols and charges',
    detail: 'Equations lose marks for missing state symbols, unbalanced charges, or ions written without them. It is the most mechanical mark loss on the paper.',
    fix: 'Treat the last ten seconds of every equation as a check: balanced atoms, balanced charges, state symbols present.',
  },
  {
    mistake: 'Vague colour language in QA answers',
    detail: '"Blue precipitate" does not distinguish copper(II) from anything else in the same family; the published tests are specific about light blue, green, red-brown and white for a reason.',
    fix: 'Use the exact wording of the test result, including whether the precipitate dissolves in excess — that clause is often the mark.',
  },
  {
    mistake: 'Treating mole calculations as arithmetic',
    detail: 'Students get the number right and lose the mark on units, significant figures, or answering a different quantity than the one asked for.',
    fix: 'Write the quantity you are solving for before starting, and carry units through every line rather than adding them at the end.',
  },
  {
    mistake: 'Skipping the data-based question because it looks unfamiliar',
    detail: 'It is worth 8–12 marks and it is designed to be unfamiliar — it tests interpretation of a supplied stem, not recall. Leaving it is a large, avoidable loss.',
    fix: 'Practise on stems you have never seen. The chemistry needed is always syllabus chemistry; only the context is new.',
  },
  {
    mistake: 'Choosing the Section B question by topic comfort',
    detail: 'Two questions are offered and one is answered. Students pick the familiar topic and discover the harder sub-parts three marks in.',
    fix: 'Read both fully, including every sub-part, before committing. The friendlier opening is often the harder question.',
  },
  {
    mistake: 'Organic chemistry learned as isolated facts',
    detail: 'Homologous series memorised separately makes reaction pathways impossible to reconstruct when a question runs across two of them.',
    fix: 'Build one reaction map connecting the series you have met, and redraw it from memory rather than rereading it.',
  },
  {
    mistake: 'Practising theory and ignoring the practical paper',
    detail: 'Paper 3 is 20% of the grade and rewards technique — reading a burette, tabulating results, controlling variables, planning — that is not learned from theory revision.',
    fix: 'Rehearse the recording and planning steps specifically, since those marks are available even when the practical itself goes imperfectly.',
  },
  {
    mistake: 'Ignoring the Periodic Table that is printed for you',
    detail: 'It is supplied in Papers 1 and 2, and it carries relative atomic masses, group positions and trends that students spend revision time memorising instead.',
    fix: 'Spend that time on the QA tables, which are the thing Paper 2 does not give you.',
  },
];

export default function HowToStudyOLevelChemistry() {
  const whatsappMessage = `Hi LionCity Tutors! I'd like help finding an O Level Chemistry tutor.

Student level (e.g. Sec 3 / Sec 4):
Current grade:
Location:
Preferred days & timing: `;
  const whatsappHref = `https://wa.me/6588701152?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <>
      <GuideSchema
        slug="how-to-study-o-level-chemistry"
        article={{
          headline: 'How to Study for O-Level Chemistry (6092): Marks & QA Notes',
          description:
            'How the three Chemistry papers are weighted, the qualitative analysis tests worth memorising, and the 10 mistakes our tutors correct most.',
          datePublished: '2026-08-26',
          dateModified: '2026-08-26',
        }}
      />
      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16">
        <div className="mx-auto max-w-2xl lg:max-w-none lg:grid lg:grid-cols-[minmax(0,42rem)_15rem] lg:justify-center lg:gap-12">
          <div>
            <GuideHeader
              title="How to Study for O-Level Chemistry"
              author="By the LionCity Tutors science team"
              meta="Updated August 26, 2026 · 11 min read"
            />

            <article className="space-y-12 text-gray-700 leading-relaxed">
              <p className="text-lg text-gray-800 leading-relaxed text-pretty">
                Chemistry rewards revision that is aimed correctly more than revision that is long. Syllabus 6092 tells you which paper is worth what, which reference material you are handed in the exam hall, and which you have to carry in your head — and that last distinction is the one most students get backwards.
              </p>

              <KeyTakeaways
                items={[
                  <>Paper 2 is <strong>half the grade</strong>; the multiple-choice paper is 30% and the practical 20%.</>,
                  <>The qualitative analysis notes are printed in <strong>Paper 3 but not Paper 2</strong> — so memorise them for the theory paper.</>,
                  <>A Periodic Table is printed in Papers 1 and 2. Memorising it is wasted revision.</>,
                  <>The data-based question is worth <strong>8–12 marks</strong> and is meant to look unfamiliar.</>,
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
                <SectionHeading icon={Scale}>How the three papers split</SectionHeading>
                <p className="text-pretty">
                  All three papers are compulsory, and they are not equally worth revising for. Paper 2 alone carries half the grade.
                </p>
                <div className="mt-5 space-y-4">
                  {papers.map((item) => (
                    <GuideCard key={item.paper}>
                      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 mb-2">
                        <h3 className="font-semibold text-gray-900">{item.paper}</h3>
                        <span className="text-sm font-semibold text-primary tabular-nums">{item.stat}</span>
                      </div>
                      <p className="text-sm text-gray-700">{item.detail}</p>
                    </GuideCard>
                  ))}
                </div>
                <p className="mt-4 text-pretty">
                  Read the last line of Paper 3 again, because it decides how you revise: the qualitative analysis notes are handed to you in the practical. They are <em>not</em> handed to you in Paper 2, where QA questions also appear. Most students revise those tables for the practical they are given them in, and meet them cold in the paper worth half the grade.
                </p>
              </section>

              <section id="qa-notes" className="scroll-mt-24">
                <SectionHeading icon={FlaskConical}>Qualitative analysis, in one place</SectionHeading>
                <p className="text-pretty">
                  These are the tests as published for syllabus 6092. Learn them for Paper 2. In Paper 3 you will have a copy in front of you, so read it rather than trusting memory at speed.
                </p>

                <GuideCard className="mt-5">
                  <h3 className="font-semibold text-gray-900 mb-3">Tests for anions</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left border-collapse">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th scope="col" className="py-2 pr-3 font-semibold text-gray-900">Anion</th>
                          <th scope="col" className="py-2 pr-3 font-semibold text-gray-900">Test</th>
                          <th scope="col" className="py-2 font-semibold text-gray-900">Result</th>
                        </tr>
                      </thead>
                      <tbody>
                        {anionTests.map((row) => (
                          <tr key={row.ion} className="border-b border-gray-100 last:border-0 align-top">
                            <td className="py-2 pr-3 font-medium text-gray-900 whitespace-nowrap">{row.ion}</td>
                            <td className="py-2 pr-3 text-gray-700">{row.test}</td>
                            <td className="py-2 text-gray-700">{row.result}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </GuideCard>

                <GuideCard className="mt-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Tests for aqueous cations</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left border-collapse">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th scope="col" className="py-2 pr-3 font-semibold text-gray-900">Cation</th>
                          <th scope="col" className="py-2 pr-3 font-semibold text-gray-900">With aqueous sodium hydroxide</th>
                          <th scope="col" className="py-2 font-semibold text-gray-900">With aqueous ammonia</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cationTests.map((row) => (
                          <tr key={row.ion} className="border-b border-gray-100 last:border-0 align-top">
                            <td className="py-2 pr-3 font-medium text-gray-900 whitespace-nowrap">{row.ion}</td>
                            <td className="py-2 pr-3 text-gray-700">{row.naoh}</td>
                            <td className="py-2 text-gray-700">{row.ammonia}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="mt-3 text-sm text-gray-600">
                    The distinguishing clause is almost always &ldquo;soluble in excess&rdquo; versus &ldquo;insoluble in excess&rdquo;. Aluminium and zinc behave identically with sodium hydroxide — only the ammonia column separates them.
                  </p>
                </GuideCard>

                <GuideCard className="mt-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Tests for gases</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left border-collapse">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th scope="col" className="py-2 pr-3 font-semibold text-gray-900">Gas</th>
                          <th scope="col" className="py-2 font-semibold text-gray-900">Test and result</th>
                        </tr>
                      </thead>
                      <tbody>
                        {gasTests.map((row) => (
                          <tr key={row.gas} className="border-b border-gray-100 last:border-0 align-top">
                            <td className="py-2 pr-3 font-medium text-gray-900 whitespace-nowrap">{row.gas}</td>
                            <td className="py-2 text-gray-700">{row.test}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </GuideCard>
              </section>

              <section id="command-words" className="scroll-mt-24">
                <SectionHeading icon={ClipboardList}>What the command words actually want</SectionHeading>
                <p className="text-pretty">
                  The syllabus publishes a glossary of the instruction words used in Chemistry papers, and a large share of the marks our tutors recover come from reading them properly. These are the ones that most often cost marks.
                </p>
                <GuideCard className="mt-5">
                  <dl className="space-y-3 text-sm">
                    {commandWords.map((item) => (
                      <div key={item.word}>
                        <dt className="font-semibold text-gray-900">{item.word}</dt>
                        <dd className="text-gray-700">{item.wants}</dd>
                      </div>
                    ))}
                  </dl>
                </GuideCard>
              </section>

              <section id="revision" className="scroll-mt-24">
                <SectionHeading icon={Repeat}>How to revise Chemistry</SectionHeading>
                <GuideCard className="mt-4">
                  <ul className="list-disc ml-5 space-y-2 text-sm text-gray-700">
                    <li><strong>Weight your time to Paper 2.</strong> It is 50% of the grade and the only theory paper where extended answers are marked. Multiple-choice practice feels productive and is worth 30%.</li>
                    <li><strong>Test yourself on QA blind.</strong> Cover the table and write the cation column from memory. Recognising the tests when you see them is not the same as recalling them in Paper 2.</li>
                    <li><strong>Practise on unseen data-based stems.</strong> Past-year and prelim papers are the supply — there are O-Level Chemistry papers in our <Link href="/free-test-papers" className="text-primary underline underline-offset-2">free test papers library</Link>.</li>
                    <li><strong>Mark against the scheme and classify the loss.</strong> Knowledge, command word misread, equation mechanics, or time? Each has a different fix, and students who skip this step repeat the same error until the exam.</li>
                    <li><strong>Rehearse the practical separately.</strong> Twenty per cent of the grade rewards recording and planning technique that theory revision never touches.</li>
                    <li><strong>Build one organic reaction map.</strong> Redraw it from memory weekly rather than rereading it; pathways across two homologous series are where organic questions live.</li>
                    <li><strong>Keep one reference for the phrasing.</strong> Our free <Link href="/free-notes" className="text-primary underline underline-offset-2">O-Level Chemistry study notes</Link> carry the QA tables, the &ldquo;explain&rdquo; answer templates and the practical error analysis in 23 pages, written to Cambridge 5070 and matching syllabus 6092 topic for topic.</li>
                  </ul>
                </GuideCard>
                <p className="mt-4 text-pretty">
                  For the full topic-by-topic breakdown of syllabus 6092, including the twelve topics grouped across the three sections, see our{' '}
                  <Link href="/o-level-chemistry" className="text-primary underline underline-offset-2">O-Level Chemistry subject guide</Link>. This page is about technique; that one is about coverage.
                </p>
              </section>

              <section id="mistakes" className="scroll-mt-24">
                <SectionHeading icon={TriangleAlert}>10 common O-Level Chemistry mistakes</SectionHeading>
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
                Paper structure, weightings, the qualitative analysis tests and the command-word glossary are from the Singapore-Cambridge GCE O-Level Chemistry syllabus 6092 (2026), published by SEAB. Always check the current syllabus for your exam year.
              </p>

              <RelatedGuides slug="how-to-study-o-level-chemistry" />

              <GuideCTA
                title="Get a Chemistry tutor who marks like an examiner"
                description={`Tell us where the marks are going — theory, practical or both. We hand-match a vetted O-Level Chemistry tutor, usually within ${MATCH_TIME}, and parents never pay an agency fee.`}
                buttonText="Find an O-Level Chemistry tutor"
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
