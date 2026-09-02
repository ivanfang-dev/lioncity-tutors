import { MATCH_TIME } from '@/data/promises';
export const metadata = {
  title: 'O-Level Maths (E-Math & A-Math): Common Mistakes & Tips',
  description: 'The 10 mistakes our tutors correct most across E-Math and A-Math scripts, plus topic strategy, paper timing and a revision timeline for the 2026 O-Levels.',
  keywords: [
    'O Level math exam tips',
    'tips for scoring A1 in O Level math',
    'O Level Math 2026',
    'O Level Mathematics Singapore',
    'GCE O Level Math guide',
    'Additional Math preparation',
    'Elementary Math study tips',
    'O Level Math tuition Singapore',
  ],
  openGraph: {
    images: [DEFAULT_OG_IMAGE],
    title: 'O-Level Maths (E-Math & A-Math): Common Mistakes & Tips',
    description: 'The 10 mistakes our tutors correct most across E-Math and A-Math scripts, plus topic strategy, paper timing and a revision timeline for the 2026 O-Levels.',
    url: 'https://www.lioncitytutors.com/o-level-math',
    type: 'article',
  },
  alternates: {
    canonical: 'https://www.lioncitytutors.com/o-level-math',
  },
};

import Link from 'next/link';
import TableOfContents from '@/components/TableOfContents';
import GuideSchema from '@/components/seo/GuideSchema';
import {
  GuideHeader, SectionHeading, GuideCard, TopicCard, GuideTimeline, KeyTakeaways, GuideCTA, ICON_STROKE,
  RelatedGuides, ExamTimetable,
} from '@/components/guide';
import {
  FileText, CalendarClock, Calculator, Sigma, Brain, Target,
  TriangleAlert, CalendarDays, BookOpen, Lightbulb, GraduationCap, Users,
  Hourglass, ListChecks, HelpCircle,
} from 'lucide-react';
import { O_LEVEL_MATH_FAQS } from './faqs.mjs';
import { DEFAULT_OG_IMAGE } from '@/lib/seo/openGraph';

const tableOfContents = [
  { id: 'structure', label: 'Exam & subject structure' },
  { id: 'exam-dates', label: '2026 exam timetable' },
  { id: 'timeline', label: '18-month study timeline' },
  { id: 'e-math', label: 'Elementary Math (E Math)' },
  { id: 'a-math', label: 'Additional Math (A Math)' },
  { id: 'study-techniques', label: 'Study techniques that work' },
  { id: 'exam-strategies', label: 'Paper-by-paper exam strategy' },
  { id: 'mistakes', label: '10 common mistakes' },
  { id: 'schedule', label: 'Weekly study schedule' },
  { id: 'resources', label: 'Essential resources' },
  { id: 'mindset', label: 'Mental preparation & mindset' },
  { id: 'pathways', label: 'Future pathways' },
  { id: 'tuition', label: 'When to consider tuition' },
  { id: 'final-months', label: 'Final month' },
  { id: 'faq', label: 'Frequently asked questions' },
];

const timeline = [
  {
    title: 'Secondary 3 · Foundation Phase',
    points: [
      'Master fundamental algebraic manipulation and equation solving',
      'Build strong foundation in geometry and trigonometry',
      'Develop systematic problem-solving approaches',
      'Focus on accuracy before speed in calculations',
      'Complete all textbook exercises and school assessments thoroughly',
    ],
  },
  {
    title: 'Secondary 4 Term 1–2 · Skill Development Phase',
    points: [
      'Complete syllabus coverage for both E Math and A Math',
      'Begin intensive practice with past year O Level papers',
      'Develop time management skills for different paper formats',
      'Identify and strengthen weak topic areas through targeted practice',
      'Master calculator techniques and shortcut methods',
    ],
  },
  {
    title: 'Secondary 4 Term 3 to Prelims · Application Phase',
    points: [
      'Daily practice with O Level standard questions',
      'Focus on exam techniques and answer presentation',
      'Simulate exam conditions with full paper attempts',
      'Review and analyze all mistakes systematically',
      'Prepare comprehensively for Preliminary Examinations',
    ],
  },
  {
    title: 'Post-Prelims to O Levels · Mastery Phase',
    points: [
      'Intensive revision based on prelim performance gaps',
      'Final consolidation of formulas and key concepts',
      'Practice papers under strict timing conditions daily',
      'Mental preparation and exam stress management',
      'Maintain a consistent study routine until exam day',
    ],
  },
];

// The mistakes our tutors correct most often across E-Math and A-Math scripts.
// In maths especially, far more marks go to execution than to genuine gaps in
// knowledge — so each entry names the fix, not just the error.
const commonMistakes = [
  {
    mistake: 'Dropping a negative sign, usually in front of a bracket',
    detail: 'Expanding −(3x − 5) as −3x − 5 instead of −3x + 5 is the single most frequent algebra slip we see, and it propagates through every line that follows.',
    fix: 'Expand brackets on their own line before combining anything, and write the sign of every term explicitly rather than carrying it mentally.',
  },
  {
    mistake: 'Rounding in the middle of the working',
    detail: 'Intermediate values rounded to 3 significant figures and then reused push the final answer outside the accepted range, even though the method was entirely correct.',
    fix: 'Keep full calculator precision through every intermediate step. Round once, at the end, to the accuracy the question asks for.',
  },
  {
    mistake: 'Leaving the calculator in the wrong angle mode',
    detail: 'Degrees against radians costs the entire question, and the working on the page looks perfectly correct — which makes it almost impossible to spot when checking.',
    fix: 'Check the mode before starting any trigonometry question, and again after any calculator reset. Make it as automatic as writing your name on the paper.',
  },
  {
    mistake: 'Copying the question down incorrectly',
    detail: 'A digit transposed or a sign changed while transferring the question to your working means a flawless solution to a problem that was never asked.',
    fix: 'Read the copied line back against the question paper before solving. This is the cheapest check on the paper.',
  },
  {
    mistake: 'Not showing enough working',
    detail: 'When the final answer is wrong, method marks are the only marks still available, and they can only be given for working that is written down.',
    fix: 'Show the formula, the substitution and the rearrangement as separate lines — including for steps you can do in your head.',
  },
  {
    mistake: 'Setting up probability questions wrongly',
    detail: '"At least one" and "at most one" get treated as interchangeable, and questions involving without-replacement are set up as if replacement occurred.',
    fix: 'Write out what the event actually includes before calculating. For "at least one", check whether the complement is faster — it usually is.',
  },
  {
    mistake: 'Losing marks on graphs before any maths happens',
    detail: 'Scales chosen to make plotting awkward, points misplotted, and gradients read off between two points that are too close together to be accurate.',
    fix: 'Choose a scale that uses most of the grid, plot with a sharp pencil, and take gradients from a triangle spanning at least half the line.',
  },
  {
    mistake: 'A-Math: the calculus is right, the algebra afterwards is not',
    detail: 'Chain, product and quotient rules applied correctly, then the simplification that follows goes wrong. The question is lost after the hard part was done.',
    fix: 'Treat the post-differentiation algebra as its own step. If A-Math started slipping in Sec 4, the repair is often in Sec 3 algebra rather than in the calculus.',
  },
  {
    mistake: 'A-Math: integration set up without choosing a method first',
    detail: 'A forgotten constant of integration, limits substituted in the wrong order, or an attempt to integrate directly when a substitution was required.',
    fix: 'Name the method before writing anything. Check for the constant on every indefinite integral, and evaluate limits as upper minus lower every time.',
  },
  {
    mistake: 'Only being able to solve questions that look familiar',
    detail: 'It is possible to become very good at recognising questions you have already practised without becoming better at recognising the concept underneath them.',
    fix: 'Deliberately include unfamiliar and harder questions in every practice session. If every question you attempt is one you can already do, the session is revision, not preparation.',
  },
];

export default function OLevelMath() {
  const whatsappMessage = `Hi LionCity Tutors! I'd like help finding an O Level Math tutor.

Student level (e.g. Sec 3 / Sec 4):
Current grade:
Location:
Preferred days & timing: `;
  const whatsappHref = `https://wa.me/6588701152?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <>
    <GuideSchema
      slug="o-level-math"
      course={{
        name: 'O-Level Maths Tuition',
        description: 'One-to-one O-Level Mathematics tuition in Singapore, covering both E-Math (4052) and A-Math (4049).',
        educationalLevel: 'GCE O-Level',
      }}
      faqs={O_LEVEL_MATH_FAQS}
    />
    <main className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16">
      <div className="mx-auto max-w-2xl lg:max-w-none lg:grid lg:grid-cols-[minmax(0,42rem)_15rem] lg:justify-center lg:gap-12">
        {/* Article column */}
        <div>
          <GuideHeader
            title="O Level Math Guide 2026: Master Elementary & Additional Mathematics"
            author="By the LionCity Tutors Mathematics Team"
            meta="Updated August 29, 2026 · 15 min read"
            imageSrc="/math-tuition.webp"
            imageAlt="Handwritten equations and working — the algebra, calculus and trigonometry at the heart of O Level Mathematics."
          />

          <article className="space-y-12 text-gray-700 leading-relaxed">
            <p className="text-lg text-gray-800 leading-relaxed text-pretty">
              O Level Mathematics remains one of the most critical subjects for Singapore students, directly impacting polytechnic and JC admissions. With both Elementary Mathematics and Additional Mathematics offering different pathways, strategic preparation is essential for achieving A1 grades. This comprehensive guide provides proven strategies for O Level Math success in 2026.
            </p>

            {/* Key takeaways */}
            <KeyTakeaways
              items={[
                <>O Level Maths splits into compulsory E Math (4052) and optional A Math (4049) &mdash; A Math is the gateway to H2 Maths in JC.</>,
                <>A steady Sec 3&rarr;Sec 4 timeline built on understanding beats last-minute memorisation every time.</>,
                <>Method marks are everything &mdash; clear working and correct notation earn as much as the final answer.</>,
                <>Struggling with algebra, calculus or careless errors is the usual signal that targeted tuition will help.</>,
              ]}
            />

            {/* Inline table of contents — mobile / tablet only */}
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

            <section id="structure" className="scroll-mt-24">
              <SectionHeading icon={FileText}>Understanding O Level Mathematics Structure</SectionHeading>
              <p className="text-pretty">
                Singapore&rsquo;s O Level Mathematics offers two distinct subjects, each serving different academic pathways and university prerequisites.
              </p>
              <GuideCard className="mt-4">
                <h4 className="font-semibold text-gray-900 mb-4">O Level Math Subjects Breakdown</h4>
                <div className="space-y-5">
                  <div>
                    <h5 className="font-semibold text-gray-900">Elementary Mathematics (E Math) &mdash; syllabus 4052</h5>
                    <ul className="list-disc ml-5 mt-1.5 space-y-1 text-sm text-gray-700">
                      <li>Compulsory for all O Level students</li>
                      <li>Prerequisite for polytechnic and JC admission</li>
                      <li>Paper 1: about 26 short-answer questions &mdash; 90 marks, 50%, 2 hours 15 minutes</li>
                      <li>Paper 2: 9–10 questions, last one a real-world application &mdash; 90 marks, 50%, 2 hours 15 minutes</li>
                      <li>Calculator allowed in both papers; geometrical instruments required in both</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-900">Additional Mathematics (A Math) &mdash; syllabus 4049</h5>
                    <ul className="list-disc ml-5 mt-1.5 space-y-1 text-sm text-gray-700">
                      <li>Optional subject for higher-achieving students</li>
                      <li>Essential for H2 Mathematics in JC</li>
                      <li>Required for many engineering and science university pathways</li>
                      <li>Paper 1: 12–14 questions (up to 10 marks each) &mdash; 90 marks, 50%, 2 hours 15 minutes</li>
                      <li>Paper 2: 9–11 questions (up to 12 marks each) &mdash; 90 marks, 50%, 2 hours 15 minutes</li>
                      <li>Calculator allowed in both papers; a formula list is provided</li>
                    </ul>
                  </div>
                </div>
              </GuideCard>
            </section>

            <section id="exam-dates" className="scroll-mt-24">
              <SectionHeading icon={CalendarDays}>2026 O-Level Maths Exam Timetable</SectionHeading>
              <ExamTimetable
                examSlug="o-level"
                subjectSlugs={['math', 'additional-math']}
                caption="Official 2026 SEAB dates for E-Math and A-Math."
              />
            </section>

            <section id="timeline" className="scroll-mt-24">
              <SectionHeading icon={CalendarClock}>18-Month O Level Math Preparation Timeline</SectionHeading>
              <GuideTimeline items={timeline} />
            </section>

            <section id="e-math" className="scroll-mt-24">
              <SectionHeading icon={Calculator}>Elementary Mathematics (E Math) Mastery Guide</SectionHeading>
              <div className="space-y-4">
                <TopicCard
                  title="Number and Algebra"
                  chips={['Numbers & Indices', 'Ratio & Percentage', 'Algebra', 'Functions & Graphs', 'Equations & Inequalities', 'Sets', 'Matrices']}
                  points={[
                    'Master algebraic manipulation through daily practice',
                    'Memorize standard forms and factorization patterns',
                    'Practice word problems involving algebraic equations',
                    'Learn to check answers by substitution',
                  ]}
                />
                <TopicCard
                  title="Geometry and Measurement"
                  chips={['Angles & Polygons', 'Congruence & Similarity', 'Circles', 'Pythagoras & Trigonometry', 'Mensuration', 'Coordinate Geometry', 'Vectors']}
                  points={[
                    'Memorize geometric properties and circle theorems',
                    'Practice accurate diagrams with compasses, protractor and ruler',
                    'Master trigonometric ratios, sine rule and cosine rule',
                    'Learn to identify which geometric property to apply',
                  ]}
                />
                <TopicCard
                  title="Statistics and Probability"
                  chips={['Data Handling', 'Mean, Mode & Median', 'Quartiles & Standard Deviation', 'Probability']}
                  points={[
                    'Practice interpreting tables, histograms, box plots and cumulative frequency',
                    'Compare data sets using mean and standard deviation',
                    'Master tree diagrams and combined events (including mutually exclusive and independent events)',
                    'Watch for diagrams that mislead — the syllabus tests that explicitly',
                  ]}
                />
              </div>
            </section>

            <section id="a-math" className="scroll-mt-24">
              <SectionHeading icon={Sigma}>Additional Mathematics (A Math) Mastery Guide</SectionHeading>
              <div className="space-y-4">
                <TopicCard
                  title="Algebra"
                  chips={['Quadratic Functions', 'Equations & Inequalities', 'Surds', 'Polynomials', 'Partial Fractions', 'Binomial', 'Exponential & Log']}
                  points={[
                    'Master algebraic manipulation at advanced level',
                    'Practice graph sketching and transformations daily',
                    'Learn to solve complex equations systematically',
                    'The quadratic formula and binomial expansion are on the printed list — calculus is not',
                  ]}
                />
                <TopicCard
                  title="Geometry and Trigonometry"
                  chips={['Trigonometric Functions', 'Identities', 'Equations', 'R-formula', 'Coordinate Geometry', 'Proofs in Plane Geometry']}
                  points={[
                    'Memorize the identities that are not printed, then use the ones that are',
                    'Master R-formula applications (a cos θ + b sin θ)',
                    'Practice solving trigonometric equations in a given interval',
                    'Coordinate geometry of the circle and plane-geometry proofs are examined here too',
                  ]}
                />
                <TopicCard
                  title="Calculus"
                  chips={['Differentiation', 'Applications of Differentiation', 'Integration', 'Applications of Integration']}
                  points={[
                    'Master differentiation rules and chain rule thoroughly',
                    'Practice optimization and rate of change problems',
                    'Learn integration techniques and standard integrals',
                    'Practice area under a curve and straight-line kinematics',
                  ]}
                />
              </div>
            </section>

            <section id="study-techniques" className="scroll-mt-24">
              <SectionHeading icon={Brain}>O Level Math Study Techniques That Work</SectionHeading>
              <GuideCard>
                <h4 className="font-semibold text-gray-900 mb-3">Proven O Level Math Study Methods</h4>
                <div className="space-y-3 text-sm">
                  <div>
                    <p><strong className="text-gray-900">The 10-10-10 Method:</strong></p>
                    <p>Practice 10 similar questions, review 10 mistakes from previous sessions, spend 10 minutes on mental math daily.</p>
                  </div>
                  <div>
                    <p><strong className="text-gray-900">Error Analysis Technique:</strong></p>
                    <p>Keep a detailed error log categorizing mistakes (careless, conceptual, or procedural) and review weekly.</p>
                  </div>
                  <div>
                    <p><strong className="text-gray-900">Formula Memory Palace:</strong></p>
                    <p>Create visual associations and memory aids for formulas. Draw formula sheets from memory regularly.</p>
                  </div>
                  <div>
                    <p><strong className="text-gray-900">Backwards Practice Method:</strong></p>
                    <p>Start with the answer and work backwards to understand the solution process fully.</p>
                  </div>
                </div>
              </GuideCard>
            </section>

            <section id="exam-strategies" className="scroll-mt-24">
              <SectionHeading icon={Target}>O Level Math Exam Strategies</SectionHeading>
              <div className="space-y-4">
                <GuideCard>
                  <h4 className="font-semibold text-gray-900 mb-2">Paper 1 (Short Answer) Strategy</h4>
                  <ul className="list-disc ml-5 space-y-1 text-sm text-gray-700">
                    <li>About 26 questions in 2 hours 15 minutes &mdash; keep moving, then return</li>
                    <li>Show essential working; a correct answer with nothing above it can still lose marks</li>
                    <li>Double-check calculations for careless errors</li>
                    <li>Have compasses, protractor and a straight edge with you, not only for Paper 2</li>
                    <li>Mark uncertain answers and return if time permits</li>
                  </ul>
                </GuideCard>

                <GuideCard>
                  <h4 className="font-semibold text-gray-900 mb-2">Paper 2 (Longer Questions) Strategy</h4>
                  <ul className="list-disc ml-5 space-y-1 text-sm text-gray-700">
                    <li>Read all questions first and start with your strongest topics</li>
                    <li>Show all working clearly &mdash; method marks are crucial</li>
                    <li>Leave time for the last question: it applies maths to a real-world scenario</li>
                    <li>Use proper mathematical notation and units</li>
                    <li>Check final answers for reasonableness</li>
                  </ul>
                </GuideCard>

                <GuideCard>
                  <h4 className="font-semibold text-gray-900 mb-2">Calculator Mastery Tips</h4>
                  <ul className="list-disc ml-5 space-y-1 text-sm text-gray-700">
                    <li>Learn all calculator functions relevant to O Level Math</li>
                    <li>Practice calculator shortcuts for common operations</li>
                    <li>Always verify calculator results with mental approximations</li>
                    <li>Know when NOT to use the calculator (exact answers required)</li>
                    <li>Master statistical functions for data analysis questions</li>
                  </ul>
                </GuideCard>
              </div>
            </section>

            <section id="mistakes" className="scroll-mt-24">
              <SectionHeading icon={TriangleAlert}>10 common O-Level Maths mistakes</SectionHeading>
              <p className="text-gray-700 mb-5">
                In maths our tutors see far more marks lost to execution than to gaps in knowledge — and the fix for a careless error is completely different from the fix for a concept gap, which is why they have to be logged separately. These are the ten we correct most often across E-Math and A-Math.
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

            <section id="schedule" className="scroll-mt-24">
              <SectionHeading icon={CalendarDays}>Creating Your O Level Math Study Schedule</SectionHeading>
              <GuideCard>
                <h4 className="font-semibold text-gray-900 mb-3">Recommended Weekly Schedule (Secondary 4)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                  <div>
                    <p className="font-semibold text-gray-900 mb-1.5">School Days (E Math)</p>
                    <ul className="list-disc ml-5 space-y-1 text-gray-700">
                      <li>45–60 minutes of daily practice</li>
                      <li>Focus on homework plus additional practice</li>
                      <li>Review class notes within 24 hours</li>
                      <li>Complete 2–3 past-paper questions</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 mb-1.5">School Days (A Math)</p>
                    <ul className="list-disc ml-5 space-y-1 text-gray-700">
                      <li>60–90 minutes of daily practice</li>
                      <li>Emphasis on concept mastery</li>
                      <li>Practice differentiation/integration daily</li>
                      <li>Work through challenging problem sets</li>
                    </ul>
                  </div>
                </div>
                <div className="mt-5">
                  <p className="font-semibold text-gray-900 mb-1.5 text-sm">Weekends</p>
                  <ul className="list-disc ml-5 space-y-1 text-sm text-gray-700">
                    <li>Complete 1–2 full practice papers</li>
                    <li>Review and analyze all weekly mistakes</li>
                    <li>Focus on weakest topics with intensive practice</li>
                    <li>Prepare formula sheets and summary notes</li>
                  </ul>
                </div>
              </GuideCard>
            </section>

            <section id="resources" className="scroll-mt-24">
              <SectionHeading icon={BookOpen}>Essential O Level Math Resources</SectionHeading>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1.5">Free from us</h4>
                  <ul className="list-disc ml-5 text-sm space-y-1 text-gray-700">
                    <li>
                      <Link href="/free-notes" className="inline-flex min-h-11 items-center text-primary underline underline-offset-2">A-Math revision notes</Link>
                      {' '}&mdash; 17 pages on syllabus 4049: a formula reference for every topic, worked examples and the errors that cost method marks
                    </li>
                    <li>
                      <Link href="/free-notes" className="inline-flex min-h-11 items-center text-primary underline underline-offset-2">E-Math revision notes</Link>
                      {' '}&mdash; the same for syllabus 4052 in 16 pages, across all seventeen topics from numbers and algebra to vectors and probability
                    </li>
                    <li>
                      <Link href="/free-test-papers" className="inline-flex min-h-11 items-center text-primary underline underline-offset-2">Free test papers</Link>
                      {' '}&mdash; school prelim papers for E-Math and A-Math, to work unseen and to time
                    </li>
                    <li>
                      <Link href="/how-to-study/o-level-a-math" className="inline-flex min-h-11 items-center text-primary underline underline-offset-2">How to study for A-Math</Link>
                      {' '}and{' '}
                      <Link href="/how-to-study/o-level-e-math" className="text-primary underline underline-offset-2">for E-Math</Link>
                      {' '}&mdash; which formulae are printed for you, and where the method marks go
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1.5">Recommended Textbooks</h4>
                  <ul className="list-disc ml-5 text-sm space-y-1 text-gray-700">
                    <li>New Syllabus Mathematics (Shinglee) &mdash; comprehensive coverage</li>
                    <li>Additional Mathematics 360 (Marshall Cavendish) &mdash; A Math focused</li>
                    <li>Discovering Mathematics (Victor Chow) &mdash; conceptual approach</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1.5">Practice Materials</h4>
                  <ul className="list-disc ml-5 text-sm space-y-1 text-gray-700">
                    <li>GCE O Level past papers (last 10 years minimum)</li>
                    <li>School preliminary examination papers</li>
                    <li>Topical practice books for weak areas</li>
                    <li>Online practice platforms (KooBits, MathScore)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1.5">Digital Tools</h4>
                  <ul className="list-disc ml-5 text-sm space-y-1 text-gray-700">
                    <li>GeoGebra for visualization and graphing</li>
                    <li>Desmos Calculator for function exploration</li>
                    <li>Photomath for step-by-step solutions (learning tool)</li>
                    <li>Anki for formula memorization</li>
                  </ul>
                </div>
              </div>
            </section>

            <section id="mindset" className="scroll-mt-24">
              <SectionHeading icon={Lightbulb}>Mental Preparation for O Level Math</SectionHeading>
              <p className="text-pretty">
                Mathematical confidence is as important as mathematical competence. Here&rsquo;s how to build both:
              </p>
              <ul className="list-disc ml-6 space-y-2 mt-3 text-gray-700">
                <li><strong className="text-gray-900">Build Number Sense:</strong> Practice mental calculations daily to improve computational fluency</li>
                <li><strong className="text-gray-900">Embrace Mistakes:</strong> View errors as learning opportunities rather than failures</li>
                <li><strong className="text-gray-900">Practice Under Pressure:</strong> Simulate exam conditions regularly to build exam resilience</li>
                <li><strong className="text-gray-900">Visualize Success:</strong> Use positive visualization techniques before major tests</li>
                <li><strong className="text-gray-900">Maintain a Growth Mindset:</strong> Believe that mathematical ability can be developed through effort</li>
                <li><strong className="text-gray-900">Seek Help Early:</strong> Don&rsquo;t let mathematical gaps compound over time</li>
              </ul>
            </section>

            <section id="pathways" className="scroll-mt-24">
              <SectionHeading icon={GraduationCap}>Post-O Level Math Pathways</SectionHeading>
              <GuideCard>
                <h4 className="font-semibold text-gray-900 mb-3">Your O Level Math Results Open These Doors</h4>
                <div className="space-y-4 text-sm">
                  <div>
                    <strong className="text-gray-900">A1-B3 in E Math + A1-B3 in A Math:</strong>
                    <ul className="list-disc ml-5 mt-1 space-y-1 text-gray-700">
                      <li>Eligible for H2 Mathematics in Junior College</li>
                      <li>Access to engineering and science courses in polytechnics</li>
                      <li>Strong foundation for university STEM programs</li>
                    </ul>
                  </div>
                  <div>
                    <strong className="text-gray-900">A1-B3 in E Math only:</strong>
                    <ul className="list-disc ml-5 mt-1 space-y-1 text-gray-700">
                      <li>Eligible for H1 Mathematics in Junior College</li>
                      <li>Access to most polytechnic diploma courses</li>
                      <li>Foundation for business and social science programs</li>
                    </ul>
                  </div>
                </div>
              </GuideCard>
            </section>

            <section id="tuition" className="scroll-mt-24">
              <SectionHeading icon={Users}>When to Consider O Level Math Tuition</SectionHeading>
              <p>Consider professional O Level Math tuition if your child:</p>
              <ul className="list-disc ml-6 space-y-1 mt-3 text-gray-700">
                <li>Consistently struggles with mathematical concepts despite self-study efforts</li>
                <li>Lacks confidence in problem-solving approaches</li>
                <li>Needs structured guidance for both E Math and A Math preparation</li>
                <li>Requires personalized attention beyond classroom teaching</li>
                <li>Aims for A1 grades to meet JC or polytechnic course requirements</li>
                <li>Benefits from regular practice supervision and immediate feedback</li>
              </ul>
              <GuideCard className="mt-4">
                <p className="text-sm"><strong className="text-gray-900">Choose O Level Math tutors who:</strong> Have extensive experience with current O Level syllabi, understand common student misconceptions, can teach both conceptual understanding and exam techniques, and provide structured practice programs.</p>
              </GuideCard>
            </section>

            <section id="final-months" className="scroll-mt-24">
              <SectionHeading icon={Hourglass}>Final Month O Level Math Preparation</SectionHeading>
              <GuideCard>
                <h4 className="font-semibold text-gray-900 mb-3">Last 30 Days Strategy</h4>
                <div className="space-y-4 text-sm">
                  <div>
                    <strong className="text-gray-900">Week 1–2: Intensive Practice</strong>
                    <ul className="list-disc ml-5 mt-1 space-y-1 text-gray-700">
                      <li>Complete 2 full papers daily (1 E Math, 1 A Math if applicable)</li>
                      <li>Time all practice sessions strictly</li>
                      <li>Analyze performance patterns and focus areas</li>
                    </ul>
                  </div>
                  <div>
                    <strong className="text-gray-900">Week 3: Consolidation</strong>
                    <ul className="list-disc ml-5 mt-1 space-y-1 text-gray-700">
                      <li>Review all formula sheets and key concepts</li>
                      <li>Practice weak topics with targeted questions</li>
                      <li>Ensure calculator proficiency and backup preparation</li>
                    </ul>
                  </div>
                  <div>
                    <strong className="text-gray-900">Week 4: Final Preparation</strong>
                    <ul className="list-disc ml-5 mt-1 space-y-1 text-gray-700">
                      <li>Light revision and confidence building</li>
                      <li>Ensure adequate rest and stress management</li>
                      <li>Prepare all examination materials and logistics</li>
                    </ul>
                  </div>
                </div>
              </GuideCard>
            </section>

            <section id="faq" className="scroll-mt-24">
              <SectionHeading icon={HelpCircle}>Frequently Asked Questions</SectionHeading>
              <div className="space-y-6">
                {O_LEVEL_MATH_FAQS.map((faq) => (
                  <div key={faq.question}>
                    <h3 className="text-lg font-semibold text-gray-900">{faq.question}</h3>
                    <p className="mt-2 text-gray-700">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </section>

            <RelatedGuides slug="o-level-math" />

            {/* Conversion block */}
            <GuideCTA
              title="Achieve your O Level Math A1 goals with expert guidance"
              description={`Tell us your child’s level and goals. We hand-match a vetted, MOE-familiar O Level Math tutor — usually within ${MATCH_TIME} — and parents never pay an agency fee.`}
              buttonText="Get expert O Level Math support"
              whatsappHref={whatsappHref}
            />
          </article>
        </div>

        {/* Sticky table of contents — desktop only */}
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
