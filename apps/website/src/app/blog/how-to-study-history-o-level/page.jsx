import { MATCH_TIME } from '@/data/promises';

export const metadata = {
  title: 'How to Study for O-Level History: SBQ & Essay Technique',
  description:
    'How to study for O-Level History — what each source-based question type wants, how to build an essay that argues rather than narrates, and 10 common mistakes.',
  keywords: [
    'how to study for history o levels',
    'O Level History Singapore',
    'O Level History SBQ technique',
    'source based question History',
    'O Level History essay structure',
    'O Level History common mistakes',
    'History revision Singapore',
  ],
  openGraph: {
    images: [DEFAULT_OG_IMAGE],
    title: 'How to Study for O-Level History: SBQ & Essay Technique',
    description:
      'Source-based question technique, essay structure and the 10 mistakes our tutors correct most on O-Level History scripts.',
    url: 'https://www.lioncitytutors.com/blog/how-to-study-history-o-level',
    type: 'article',
  },
  alternates: {
    canonical: 'https://www.lioncitytutors.com/blog/how-to-study-history-o-level',
  },
};

import Link from 'next/link';
import TableOfContents from '@/components/TableOfContents';
import GuideSchema from '@/components/seo/GuideSchema';
import { DEFAULT_OG_IMAGE } from '@/lib/seo/openGraph';
import {
  GuideHeader, SectionHeading, GuideCard, KeyTakeaways, GuideCTA, ICON_STROKE,
  RelatedGuides,
} from '@/components/guide';
import { FileText, ScrollText, PenLine, Repeat, TriangleAlert, ListChecks } from 'lucide-react';

const tableOfContents = [
  { id: 'what-it-tests', label: 'What History actually tests' },
  { id: 'sbq', label: 'Source-based questions' },
  { id: 'essays', label: 'Essays that argue' },
  { id: 'revision', label: 'How to revise History' },
  { id: 'mistakes', label: '10 common mistakes' },
];

// The five source-based question types and what each one is really asking for.
// Students who can name the type before answering lose far fewer marks than
// students who answer every source question the same way.
const sourceQuestionTypes = [
  {
    type: 'Inference',
    asks: 'What does this source suggest, beyond what it states outright?',
    weak: 'Paraphrasing the source in slightly different words.',
    strong: 'Stating what the source implies, then quoting the specific detail that supports the inference.',
  },
  {
    type: 'Comparison',
    asks: 'How are these two sources similar or different?',
    weak: 'Describing Source A, then describing Source B, and leaving the reader to spot the relationship.',
    strong: 'Naming the similarity or difference first, then proving it with evidence drawn from both sources in the same paragraph.',
  },
  {
    type: 'Purpose',
    asks: 'Why did the author produce this source, for whom, and to what end?',
    weak: 'Explaining the message of the source and stopping there.',
    strong: 'Identifying the message, then the intended audience, then what the author wanted that audience to think or do.',
  },
  {
    type: 'Reliability',
    asks: 'Can this source be trusted for this particular claim?',
    weak: '"The source is biased." Almost every source is; on its own the observation earns nothing.',
    strong: 'Explaining how the provenance, content or context affects reliability for the specific thing being tested — a partisan source can still be reliable evidence of what its side believed.',
  },
  {
    type: 'Contextual knowledge',
    asks: 'What do you know that helps interpret this source?',
    weak: 'Writing everything you remember about the period, unconnected to the source in front of you.',
    strong: 'Bringing in only the context that changes how the source should be read, and saying explicitly what it changes.',
  },
];

// The mistakes our tutors correct most often on History scripts, across both
// the source paper and the essay paper.
const commonMistakes = [
  {
    mistake: 'Paraphrasing a source instead of inferring from it',
    detail: 'The student locates exactly the right line and restates it. Inference questions ask what the source suggests, so a restatement answers a question that was not asked.',
    fix: 'After finding the relevant detail, write the sentence that begins "This suggests that…" and support it with the quotation.',
  },
  {
    mistake: 'Comparing two sources without ever comparing them',
    detail: 'A paragraph on Source A followed by a paragraph on Source B is two descriptions, not a comparison, and comparison marks cannot be awarded for it.',
    fix: 'Open with the similarity or difference itself, then bring evidence from both sources into the same paragraph to prove it.',
  },
  {
    mistake: 'Answering "reliability" with "it is biased"',
    detail: 'Bias is the starting point of the analysis, not its conclusion. Left there, it says nothing about whether the source is useful for the claim in question.',
    fix: 'Say what the bias is, where it comes from, and what it means for this specific claim. A biased source is often excellent evidence of something.',
  },
  {
    mistake: 'Identifying a source’s message but not its purpose',
    detail: 'Message and purpose are different questions. What the source says is not the same as what its author was trying to achieve by producing it.',
    fix: 'Work through message, then audience, then intended effect. Purpose questions are marked on the third step.',
  },
  {
    mistake: 'Contextual knowledge dumped rather than applied',
    detail: 'Everything the student remembers about the period gets written down, whether or not it helps interpret the source on the page.',
    fix: 'Include context only where it changes the reading of the source, and state what it changes. Unattached background earns nothing.',
  },
  {
    mistake: 'Essays that narrate instead of argue',
    detail: 'A well-written account of what happened, in order, is a story. The essay paper asks a question, and the answer has to take a position on it.',
    fix: 'Every paragraph should defend a claim that answers the question. If a paragraph only tells the reader what happened next, it is not yet an argument.',
  },
  {
    mistake: 'Listing factors without weighing them',
    detail: 'Three well-evidenced factors presented as equally important leave the actual question — which mattered most, and why — unanswered.',
    fix: 'Rank the factors and justify the ranking. The comparison between them is where the higher-band marks sit.',
  },
  {
    mistake: 'Evaluation with no judgement at the end of it',
    detail: 'Both sides get considered, and then the essay stops without deciding anything. Balance is necessary but it is not a conclusion.',
    fix: 'Commit to a position and say why the evidence supports it over the alternative. A judgement the essay has earned is worth more than a balanced non-answer.',
  },
  {
    mistake: 'A memorised essay forced onto a different question',
    detail: 'A prepared answer on a topic gets reproduced when the question asked something adjacent, so the content is strong and the relevance is not.',
    fix: 'Memorise evidence and argument structures rather than whole essays, so what you prepared can be redirected at whatever is actually asked.',
  },
  {
    mistake: 'A conclusion that repeats the paragraphs above it',
    detail: 'Summarising what has already been said adds nothing the marker has not just read, and wastes the one place a judgement is expected.',
    fix: 'Use the conclusion to answer the question directly and explain what tipped the decision — not to recap.',
  },
];

export default function HowToStudyHistoryOLevel() {
  const whatsappMessage = `Hi LionCity Tutors! I'd like help finding an O Level History tutor.

Student level (e.g. Sec 3 / Sec 4):
Current grade:
Location:
Preferred days & timing: `;
  const whatsappHref = `https://wa.me/6588701152?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <>
      <GuideSchema
        slug="o-level-history"
        article={{
          headline: 'How to Study for O-Level History: SBQ & Essay Technique',
          description:
            'Source-based question technique, essay structure and the 10 mistakes our tutors correct most on O-Level History scripts.',
          datePublished: '2026-08-11',
          dateModified: '2026-08-11',
        }}
      />
      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16">
        <div className="mx-auto max-w-2xl lg:max-w-none lg:grid lg:grid-cols-[minmax(0,42rem)_15rem] lg:justify-center lg:gap-12">
          <div>
            <GuideHeader
              title="How to Study for O-Level History"
              author="By the LionCity Tutors humanities team"
              meta="Updated August 11, 2026 · 9 min read"
            />

            <article className="space-y-12 text-gray-700 leading-relaxed">
              <p className="text-lg text-gray-800 leading-relaxed text-pretty">
                History is the subject where our tutors see the widest gap between what a student knows and what their script scores. Students arrive able to recount the content in detail and still sit in the middle bands, because O-Level History rewards a set of skills — inference, comparison, judgement — that are almost never the same thing as remembering what happened.
              </p>

              <KeyTakeaways
                items={[
                  <>Knowing the content is the entry requirement, not the thing being marked.</>,
                  <>Name the source question type before answering &mdash; each of the five wants a different shape of answer.</>,
                  <>&ldquo;The source is biased&rdquo; earns nothing on its own; reliability is always reliability <em>for a particular claim</em>.</>,
                  <>Essays are marked on argument and judgement, so a narrative of events caps out well below the top band.</>,
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

              <section id="what-it-tests" className="scroll-mt-24">
                <SectionHeading icon={FileText}>What O-Level History actually tests</SectionHeading>
                <p className="text-pretty">
                  History is assessed on what you can do with the content, not on how much of it you can reproduce. That single distinction explains most of the marks our tutors recover. A student who has memorised a topic thoroughly and answers every source question the same way will score consistently in the middle; a student who knows less but can infer, compare and judge will score above them.
                </p>
                <GuideCard className="mt-4">
                  <h4 className="font-semibold text-gray-900 mb-3">The skills being marked</h4>
                  <ul className="list-disc ml-5 space-y-1 text-sm text-gray-700">
                    <li><strong>Inference</strong> — reading what a source implies, not only what it states.</li>
                    <li><strong>Comparison</strong> — establishing the relationship between two accounts.</li>
                    <li><strong>Evaluation</strong> — deciding how much weight a piece of evidence deserves.</li>
                    <li><strong>Argument</strong> — building a case that answers the question asked.</li>
                    <li><strong>Judgement</strong> — committing to a conclusion and justifying it.</li>
                  </ul>
                </GuideCard>
              </section>

              <section id="sbq" className="scroll-mt-24">
                <SectionHeading icon={ScrollText}>Source-based questions, type by type</SectionHeading>
                <p className="text-pretty">
                  There are five recurring source question types, and each is asking for something different. Students who work out which type they are looking at before writing lose far fewer marks than students who answer all five the same way — which is, by some distance, the most common cause of lost source marks we see.
                </p>
                <div className="mt-5 space-y-4">
                  {sourceQuestionTypes.map((item) => (
                    <GuideCard key={item.type}>
                      <h4 className="font-semibold text-gray-900 mb-1">{item.type}</h4>
                      <p className="text-sm text-gray-700 mb-3 italic">{item.asks}</p>
                      <p className="text-sm text-gray-700 mb-1.5">
                        <span className="font-semibold text-gray-900">Weak answer: </span>{item.weak}
                      </p>
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold text-gray-900">Strong answer: </span>{item.strong}
                      </p>
                    </GuideCard>
                  ))}
                </div>
              </section>

              <section id="essays" className="scroll-mt-24">
                <SectionHeading icon={PenLine}>Writing essays that argue rather than narrate</SectionHeading>
                <p className="text-pretty">
                  The single biggest difference between a mid-band and a top-band History essay is whether it takes a position. Narrative essays describe what happened in order and leave the marker to infer the argument. Top-band essays decide something in the first paragraph and spend the rest of the essay proving it.
                </p>
                <GuideCard className="mt-4">
                  <h4 className="font-semibold text-gray-900 mb-3">What a paragraph needs</h4>
                  <ul className="list-disc ml-5 space-y-1 text-sm text-gray-700">
                    <li><strong>A point</strong> that answers the question, not a topic sentence announcing a subject.</li>
                    <li><strong>Specific evidence</strong> — named, dated, concrete. Evidence proves; it does not decorate.</li>
                    <li><strong>Explanation</strong> of how that evidence supports the point. This is the step most often skipped.</li>
                    <li><strong>A link</strong> back to the question, and where possible a weighing against the other factors.</li>
                  </ul>
                </GuideCard>
                <p className="mt-4 text-pretty">
                  Then finish properly. A conclusion that repeats the body paragraphs wastes the one place in the essay where a judgement is expected. Say which factor mattered most and what tipped it — an argued conclusion is worth more than a balanced non-answer.
                </p>
              </section>

              <section id="revision" className="scroll-mt-24">
                <SectionHeading icon={Repeat}>How to revise History</SectionHeading>
                <p className="text-pretty">
                  Reading notes repeatedly is the least efficient way to prepare for a skills-based paper. What our tutors use instead:
                </p>
                <GuideCard className="mt-4">
                  <ul className="list-disc ml-5 space-y-2 text-sm text-gray-700">
                    <li><strong>Practise on unseen sources.</strong> A source you have already analysed tests recall, not inference. Past-year and prelim papers are the supply — there are O-Level History prelim papers with mark schemes in our <Link href="/free-test-papers" className="text-primary underline underline-offset-2">free test papers library</Link>.</li>
                    <li><strong>Mark against the scheme, then classify what you lost.</strong> Was it knowledge, technique, misreading the command word, or running out of time? The fix differs completely for each.</li>
                    <li><strong>Build evidence banks, not essays.</strong> Learn dated, specific evidence you can redirect at any question, rather than a prepared answer that only fits one.</li>
                    <li><strong>Write plans more often than full essays.</strong> Ten plans in an hour trains structure and judgement better than one full essay, and structure is where most of the marks move.</li>
                    <li><strong>Time yourself early.</strong> History is a writing-heavy paper, and running short is a mark-loss category of its own.</li>
                  </ul>
                </GuideCard>
              </section>

              <section id="mistakes" className="scroll-mt-24">
                <SectionHeading icon={TriangleAlert}>10 common O-Level History mistakes</SectionHeading>
                <p className="text-gray-700 mb-5">
                  These are the ten our tutors correct most often across the source paper and the essay paper, and what to do instead.
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

              <RelatedGuides slug="o-level-history" />

              <GuideCTA
                title="Get a History tutor who marks like an examiner"
                description={`Tell us where the marks are going missing — sources, essays or both. We hand-match a vetted O-Level History tutor, usually within ${MATCH_TIME}, and parents never pay an agency fee.`}
                buttonText="Find an O-Level History tutor"
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
