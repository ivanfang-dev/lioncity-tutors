import { MATCH_TIME } from '@/data/promises';
import { DEFAULT_OG_IMAGE } from '@/lib/seo/openGraph';

export const metadata = {
  title: 'How to Study for H2 Economics (9570): Evaluation Is 60%',
  description:
    'How to study for A-Level H2 Economics — why essays carry 60% of the grade, how the essay choice rule works, and why evaluation decides most of the marks.',
  keywords: [
    'how to study for h2 economics',
    'H2 Economics 9570',
    'a level economics Singapore',
    'H2 economics essay structure',
    'economics case study technique',
    'H2 economics evaluation marks',
  ],
  openGraph: {
    images: [DEFAULT_OG_IMAGE],
    title: 'How to Study for H2 Economics (9570): Evaluation Is 60%',
    description:
      'Why essays carry 60% of the grade, how the essay choice rule works, and why evaluation decides most of the marks on both papers.',
    url: 'https://www.lioncitytutors.com/how-to-study/h2-economics',
    type: 'article',
  },
  alternates: {
    canonical: 'https://www.lioncitytutors.com/how-to-study/h2-economics',
  },
};

import Link from 'next/link';
import TableOfContents from '@/components/TableOfContents';
import GuideSchema from '@/components/seo/GuideSchema';
import {
  GuideHeader, SectionHeading, GuideCard, KeyTakeaways, GuideCTA, ICON_STROKE,
  RelatedGuides,
} from '@/components/guide';
import { Scale, Scaling, FileText, Repeat, TriangleAlert, ListChecks } from 'lucide-react';

const tableOfContents = [
  { id: 'mark-map', label: 'Two papers, and the 60/40 split' },
  { id: 'evaluation', label: 'Evaluation carries the marks' },
  { id: 'choice', label: 'The essay selection rule' },
  { id: 'revision', label: 'How to revise Economics' },
  { id: 'mistakes', label: '10 common mistakes' },
];

const papers = [
  {
    paper: 'Paper 1 — Case Studies',
    stat: '60 marks · 40% · 2 h 30 min',
    detail: 'Two compulsory case studies, 30 marks each and 20% of the grade each. Within each set, about 12 marks are data response and about 18 are higher-order questions.',
  },
  {
    paper: 'Paper 2 — Essays',
    stat: '75 marks · 60% · 2 h 30 min',
    detail: 'Six essay questions are set — three mainly microeconomics in Section A, three mainly macroeconomics in Section B. You answer three, at 25 marks each.',
  },
];

const commonMistakes = [
  {
    mistake: 'Treating evaluation as a concluding paragraph',
    detail: 'On both papers, questions testing AO1 to AO4 — the set that includes evaluation — account for about 60% of the marks. Evaluation is not the ending; it is the majority of the assessment.',
    fix: 'Evaluate throughout: after each argument, say what it depends on, when it fails, and how much weight it deserves. A final paragraph cannot carry 60%.',
  },
  {
    mistake: 'Answering three essays from one comfort zone',
    detail: 'You must answer one from Section A, one from Section B, and one from either. A student who has revised microeconomics thoroughly and macroeconomics loosely is forced into their weak section regardless.',
    fix: 'Revise both halves to a usable standard. The rule guarantees you cannot avoid either.',
  },
  {
    mistake: 'Spending equal time on the two papers',
    detail: 'Paper 2 is 60% of the grade and Paper 1 is 40%, and both are two and a half hours. Essay technique is the higher-leverage skill.',
    fix: 'Weight practice toward essays, while keeping enough case-study work to stay fluent at data response.',
  },
  {
    mistake: 'Describing the data instead of using it',
    detail: 'About 12 marks per case study are data response, but the remaining 18 are higher-order. Restating what a table shows answers the smaller half.',
    fix: 'Quote the figure, then explain what it implies, then say what follows for the question asked.',
  },
  {
    mistake: 'Diagrams drawn but not explained',
    detail: 'A correctly drawn diagram with no reference in the prose earns little. The marks are for the analysis the diagram supports, not the drawing itself.',
    fix: 'Reference the diagram explicitly: name the shift, the new equilibrium, and what it means for the agents in the question.',
  },
  {
    mistake: 'Ignoring the context of the question',
    detail: 'Questions are set in specific economies, industries or policy settings. A generic answer that would fit any context loses the applied marks.',
    fix: 'Anchor every argument in the case described — the country, the market, the time period given.',
  },
  {
    mistake: 'Listing policies without weighing them',
    detail: 'Naming four policy options and describing each is knowledge. The question almost always asks which is best, or whether one would work.',
    fix: 'Compare on stated criteria — effectiveness, cost, time lag, side effects — and commit to a judgement.',
  },
  {
    mistake: 'Unbalanced essay timing',
    detail: 'Three essays at 25 marks each in 2 h 30 min gives about 50 minutes each. Students routinely over-run the first and leave the third half-written.',
    fix: 'Set a hard time per essay and move on when it is reached. An unfinished third essay costs more than a slightly thinner first.',
  },
  {
    mistake: 'Memorising essay plans',
    detail: 'A prepared answer redirected at an adjacent question produces strong content and weak relevance — and relevance is assessed throughout.',
    fix: 'Memorise frameworks and evidence, not essays, so what you prepared can be aimed at whatever is actually asked.',
  },
  {
    mistake: 'Never writing under time',
    detail: 'Economics essays are long, and analysis quality drops sharply when the clock is unfamiliar. Reading model essays does not train this.',
    fix: 'Write full essays to time and have them marked for evaluation specifically, not just content coverage.',
  },
];

export default function HowToStudyH2Economics() {
  const whatsappMessage = `Hi LionCity Tutors! I'd like help finding an H2 Economics tutor.

Student level (e.g. JC1 / JC2):
Current grade:
Location:
Preferred days & timing: `;
  const whatsappHref = `https://wa.me/6588701152?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <>
      <GuideSchema
        slug="how-to-study-h2-economics"
        article={{
          headline: 'How to Study for H2 Economics (9570): Evaluation Is 60%',
          description:
            'Why essays carry 60% of the grade, how the essay choice rule works, and why evaluation decides most of the marks on both papers.',
          datePublished: '2026-08-26',
          dateModified: '2026-08-26',
        }}
      />
      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16">
        <div className="mx-auto max-w-2xl lg:max-w-none lg:grid lg:grid-cols-[minmax(0,42rem)_15rem] lg:justify-center lg:gap-12">
          <div>
            <GuideHeader
              title="How to Study for H2 Economics"
              author="By the LionCity Tutors humanities team"
              meta="Updated August 26, 2026 · 10 min read"
            />

            <article className="space-y-12 text-gray-700 leading-relaxed">
              <p className="text-lg text-gray-800 leading-relaxed text-pretty">
                H2 Economics publishes how its marks divide between knowing, applying and judging — and the last of those is the largest. On both papers, questions that include evaluation account for roughly 60% of the marks. Most students treat evaluation as the paragraph at the end.
              </p>

              <KeyTakeaways
                items={[
                  <>Questions including <strong>evaluation are about 60%</strong> of the marks on both papers.</>,
                  <>Essays are <strong>60% of the grade</strong>; case studies are 40%.</>,
                  <>You must answer <strong>one micro and one macro essay</strong> — neither half can be avoided.</>,
                  <>Each case study is 30 marks: about 12 data response, about 18 higher-order.</>,
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
                <SectionHeading icon={Scale}>Two papers, and the 60/40 split</SectionHeading>
                <p className="text-pretty">
                  Both papers run two and a half hours, and both are compulsory — but they are not worth the same, and they reward different things.
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
                  Equal time in the exam hall, unequal weight in the grade. Essay technique is worth half again as much as case-study technique, and it is the slower skill to build.
                </p>
              </section>

              <section id="evaluation" className="scroll-mt-24">
                <SectionHeading icon={Scaling}>Evaluation carries the marks</SectionHeading>
                <p className="text-pretty">
                  The syllabus splits each paper by which assessment objectives a question tests. On Paper 1, questions testing AO1 to AO3 are about 40% of the marks, and those adding AO4 are about 60%. Paper 2 shows the same shape.
                </p>
                <GuideCard className="mt-5">
                  <h4 className="font-semibold text-gray-900 mb-3">What evaluating actually looks like</h4>
                  <ul className="list-disc ml-5 space-y-1.5 text-sm text-gray-700">
                    <li><strong>Conditions</strong> — under what assumptions does this argument hold, and when does it break?</li>
                    <li><strong>Magnitude</strong> — how large is the effect likely to be, and compared with what?</li>
                    <li><strong>Time frame</strong> — does the short run differ from the long run here?</li>
                    <li><strong>Trade-offs</strong> — who gains, who loses, and what is given up?</li>
                    <li><strong>A judgement</strong> — which consideration dominates, and why.</li>
                  </ul>
                </GuideCard>
                <p className="mt-4 text-pretty">
                  Notice that none of these can be done once at the end. An essay that analyses for four paragraphs and evaluates in the fifth has left most of the available marks in the first four. Evaluation belongs after each argument, not after all of them.
                </p>
              </section>

              <section id="choice" className="scroll-mt-24">
                <SectionHeading icon={FileText}>The essay selection rule</SectionHeading>
                <p className="text-pretty">
                  Six essays are set: three focusing mainly on microeconomics in Section A, three mainly on macroeconomics in Section B. You answer three — <strong>at least one from each section</strong>, with the third from either.
                </p>
                <p className="mt-4 text-pretty">
                  The consequence is worth stating plainly, because it changes revision strategy: you cannot specialise. A student who prepares microeconomics thoroughly and macroeconomics loosely will still have to write a macro essay, and it will be chosen from three questions rather than six. Both halves need to be usable, and the freedom of the third essay is the only place preference can be exercised.
                </p>
                <GuideCard className="mt-5">
                  <h4 className="font-semibold text-gray-900 mb-3">Choosing well in the exam</h4>
                  <ul className="list-disc ml-5 space-y-1.5 text-sm text-gray-700">
                    <li><strong>Pick the compulsory two first</strong> — the strongest option in each section — before deciding the third.</li>
                    <li><strong>Read every part of a question</strong> before committing. Two-part essays often hide the difficulty in part (b).</li>
                    <li><strong>Choose on evidence you have,</strong> not on the topic that sounds most familiar.</li>
                    <li><strong>Budget about fifty minutes each</strong> and hold to it.</li>
                  </ul>
                </GuideCard>
              </section>

              <section id="revision" className="scroll-mt-24">
                <SectionHeading icon={Repeat}>How to revise Economics</SectionHeading>
                <GuideCard className="mt-4">
                  <ul className="list-disc ml-5 space-y-2 text-sm text-gray-700">
                    <li><strong>Practise evaluating, not concluding.</strong> Take any argument you already know and write three conditions under which it fails.</li>
                    <li><strong>Keep both halves alive.</strong> The selection rule makes specialising impossible.</li>
                    <li><strong>Weight time toward essays</strong> — 60% of the grade, and the slower skill.</li>
                    <li><strong>Build an evidence bank</strong> of real economies, policies and dates you can deploy in any context.</li>
                    <li><strong>Write to time and be marked for evaluation</strong> specifically, since that is where most of the marks live.</li>
                    <li><strong>Work case studies on unseen data.</strong> Past-year and prelim JC papers are in our <Link href="/free-test-papers" className="text-primary underline underline-offset-2">free test papers library</Link>.</li>
                  </ul>
                </GuideCard>
                <p className="mt-4 text-pretty">
                  If you also take General Paper, the evaluation habit transfers directly — our{' '}
                  <Link href="/how-to-study/general-paper" className="text-primary underline underline-offset-2">General Paper study guide</Link>{' '}
                  covers the same skill in a different subject.
                </p>
              </section>

              <section id="mistakes" className="scroll-mt-24">
                <SectionHeading icon={TriangleAlert}>10 common H2 Economics mistakes</SectionHeading>
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
                Paper structure, weightings, the essay selection rule and the assessment-objective proportions are from the Singapore-Cambridge GCE A-Level H2 Economics syllabus 9570 (2026), published by SEAB. Always check the current syllabus for your exam year.
              </p>

              <RelatedGuides slug="how-to-study-h2-economics" />

              <GuideCTA
                title="Get an Economics tutor who marks like an examiner"
                description={`Tell us where the marks are going — essays, case studies or evaluation technique. We hand-match a vetted H2 Economics tutor, usually within ${MATCH_TIME}, and parents never pay an agency fee.`}
                buttonText="Find an H2 Economics tutor"
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
