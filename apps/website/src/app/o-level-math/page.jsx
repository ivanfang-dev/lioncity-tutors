import { MATCH_TIME } from '@/data/promises';
export const metadata = {
  title: 'O Level Math Guide 2026: Complete Preparation Strategy for Singapore Students | LionCity Tutors',
  description: 'Ultimate O Level Mathematics preparation guide for Singapore students. Expert strategies, practice techniques, and proven tips to score A1 in O Level Math 2026.',
  keywords: [
    'O Level Math 2026',
    'O Level Mathematics Singapore',
    'GCE O Level Math guide',
    'Additional Math preparation',
    'Elementary Math study tips',
    'O Level Math tuition Singapore',
    'Math revision techniques'
  ],
  openGraph: {
    title: 'O Level Math Guide 2026: Complete Preparation Strategy for Singapore Students',
    description: 'Comprehensive O Level Mathematics guide with proven strategies to help Singapore students achieve A1 grades in both Elementary and Additional Mathematics.',
    url: 'https://www.lioncitytutors.com/o-level-math',
    type: 'article',
  },
  alternates: {
    canonical: 'https://www.lioncitytutors.com/o-level-math',
  },
};

import TableOfContents from '@/components/TableOfContents';
import {
  GuideHeader, SectionHeading, GuideCard, TopicCard, GuideTimeline, KeyTakeaways, GuideCTA, ICON_STROKE,
} from '@/components/guide';
import {
  FileText, CalendarClock, Calculator, Sigma, Brain, Target,
  TriangleAlert, CalendarDays, BookOpen, Lightbulb, GraduationCap, Users,
  Hourglass, ListChecks,
} from 'lucide-react';

const tableOfContents = [
  { id: 'structure', label: 'Exam & subject structure' },
  { id: 'timeline', label: '18-month study timeline' },
  { id: 'e-math', label: 'Elementary Math (E Math)' },
  { id: 'a-math', label: 'Additional Math (A Math)' },
  { id: 'study-techniques', label: 'Study techniques that work' },
  { id: 'exam-strategies', label: 'Paper-by-paper exam strategy' },
  { id: 'mistakes', label: 'Common mistakes to avoid' },
  { id: 'schedule', label: 'Weekly study schedule' },
  { id: 'resources', label: 'Essential resources' },
  { id: 'mindset', label: 'Mental preparation & mindset' },
  { id: 'pathways', label: 'Future pathways' },
  { id: 'tuition', label: 'When to consider tuition' },
  { id: 'final-months', label: 'Final month' },
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

export default function OLevelMath() {
  const whatsappMessage = `Hi LionCity Tutors! I'd like help finding an O Level Math tutor.

Student level (e.g. Sec 3 / Sec 4):
Current grade:
Location:
Preferred days & timing: `;
  const whatsappHref = `https://wa.me/6588701152?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <>
    <main className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16">
      <div className="mx-auto max-w-2xl lg:max-w-none lg:grid lg:grid-cols-[minmax(0,42rem)_15rem] lg:justify-center lg:gap-12">
        {/* Article column */}
        <div>
          <GuideHeader
            title="O Level Math Guide 2026: Master Elementary & Additional Mathematics"
            author="By the LionCity Tutors Mathematics Team"
            meta="Updated June 1, 2026 · 15 min read"
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
                <>O Level Maths splits into compulsory E Math (4016) and optional A Math (4047) &mdash; A Math is the gateway to H2 Maths in JC.</>,
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
                    <a href={`#${item.id}`} className="text-gray-700 hover:text-primary transition-colors">{item.label}</a>
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
                    <h5 className="font-semibold text-gray-900">Elementary Mathematics (E Math) &mdash; Paper 4016</h5>
                    <ul className="list-disc ml-5 mt-1.5 space-y-1 text-sm text-gray-700">
                      <li>Compulsory for all O Level students</li>
                      <li>Prerequisites for polytechnic and JC admission</li>
                      <li>Paper 1: Multiple Choice (40 marks, 1 hour)</li>
                      <li>Paper 2: Short Answer &amp; Long Answer (80 marks, 2.5 hours)</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-900">Additional Mathematics (A Math) &mdash; Paper 4047</h5>
                    <ul className="list-disc ml-5 mt-1.5 space-y-1 text-sm text-gray-700">
                      <li>Optional subject for higher-achieving students</li>
                      <li>Essential for H2 Mathematics in JC</li>
                      <li>Required for engineering, science university courses</li>
                      <li>Paper 1: Pure Mathematics (80 marks, 2.5 hours)</li>
                      <li>Paper 2: Pure Mathematics (80 marks, 2.5 hours)</li>
                    </ul>
                  </div>
                </div>
              </GuideCard>
            </section>

            <section id="timeline" className="scroll-mt-24">
              <SectionHeading icon={CalendarClock}>18-Month O Level Math Preparation Timeline</SectionHeading>
              <GuideTimeline items={timeline} />
            </section>

            <section id="e-math" className="scroll-mt-24">
              <SectionHeading icon={Calculator}>Elementary Mathematics (E Math) Mastery Guide</SectionHeading>
              <div className="space-y-4">
                <TopicCard
                  title="Numbers and Algebra"
                  weight="35–40% of paper"
                  chips={['Indices', 'Surds', 'Polynomials', 'Simultaneous Equations', 'Quadratic Equations', 'Inequalities']}
                  points={[
                    'Master algebraic manipulation through daily practice',
                    'Memorize standard forms and factorization patterns',
                    'Practice word problems involving algebraic equations',
                    'Learn to check answers by substitution',
                  ]}
                />
                <TopicCard
                  title="Geometry and Trigonometry"
                  weight="25–30% of paper"
                  chips={['Angles', 'Triangles', 'Polygons', 'Circles', 'Coordinate Geometry', 'Trigonometric Ratios']}
                  points={[
                    'Memorize all geometric properties and theorems',
                    'Practice drawing accurate diagrams for visualization',
                    'Master SOHCAHTOA and special angle values',
                    'Learn to identify which geometric property to apply',
                  ]}
                />
                <TopicCard
                  title="Statistics and Probability"
                  weight="20–25% of paper"
                  chips={['Data Representation', 'Measures of Central Tendency', 'Probability', 'Normal Distribution']}
                  points={[
                    'Practice interpreting various types of graphs and charts',
                    'Master probability tree diagrams and Venn diagrams',
                    'Learn to read and use normal distribution tables',
                    'Practice real-world applications of statistical concepts',
                  ]}
                />
                <TopicCard
                  title="Mensuration and Similarity"
                  weight="15–20% of paper"
                  chips={['Area', 'Volume', 'Surface Area', 'Arc Length', 'Sector Area', 'Similar Figures']}
                  points={[
                    'Memorize all area and volume formulas',
                    'Practice 3D visualization and net drawing',
                    'Master ratio calculations for similar figures',
                    'Learn to break complex shapes into simpler parts',
                  ]}
                />
              </div>
            </section>

            <section id="a-math" className="scroll-mt-24">
              <SectionHeading icon={Sigma}>Additional Mathematics (A Math) Mastery Guide</SectionHeading>
              <div className="space-y-4">
                <TopicCard
                  title="Pure Mathematics — Algebra"
                  weight="40–45% of papers"
                  chips={['Functions', 'Quadratic Functions', 'Equations & Inequalities', 'Surds', 'Polynomials', 'Partial Fractions']}
                  points={[
                    'Master algebraic manipulation at advanced level',
                    'Practice graph sketching and transformations daily',
                    'Learn to solve complex equations systematically',
                    'Memorize key algebraic identities and formulas',
                  ]}
                />
                <TopicCard
                  title="Calculus"
                  weight="35–40% of papers"
                  chips={['Differentiation', 'Applications of Differentiation', 'Integration', 'Applications of Integration']}
                  points={[
                    'Master differentiation rules and chain rule thoroughly',
                    'Practice optimization and rate of change problems',
                    'Learn integration techniques and standard integrals',
                    'Practice area under curve and kinematics applications',
                  ]}
                />
                <TopicCard
                  title="Trigonometry"
                  weight="15–20% of papers"
                  chips={['Trigonometric Functions', 'Identities', 'Equations', 'R-formula']}
                  points={[
                    'Memorize all trigonometric identities',
                    'Master R-formula applications',
                    'Practice solving trigonometric equations',
                    'Learn to sketch trigonometric graphs accurately',
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
                  <h4 className="font-semibold text-gray-900 mb-2">Paper 1 (Multiple Choice) Strategy</h4>
                  <ul className="list-disc ml-5 space-y-1 text-sm text-gray-700">
                    <li>Aim to complete in 45–50 minutes, leaving time for review</li>
                    <li>Use the elimination method for difficult questions</li>
                    <li>Double-check calculations for careless errors</li>
                    <li>Don&rsquo;t spend more than 2 minutes on any single question initially</li>
                    <li>Mark uncertain answers and return if time permits</li>
                  </ul>
                </GuideCard>

                <GuideCard>
                  <h4 className="font-semibold text-gray-900 mb-2">Paper 2 (Structured Questions) Strategy</h4>
                  <ul className="list-disc ml-5 space-y-1 text-sm text-gray-700">
                    <li>Read all questions first and start with your strongest topics</li>
                    <li>Show all working clearly &mdash; method marks are crucial</li>
                    <li>Use proper mathematical notation and units</li>
                    <li>Leave space for corrections and additional working</li>
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
              <SectionHeading icon={TriangleAlert}>Common O Level Math Mistakes to Avoid</SectionHeading>
              <GuideCard>
                <h4 className="font-semibold text-gray-900 mb-3">Top 10 O Level Math Pitfalls</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-sm">
                  <div>
                    <ol className="list-decimal ml-5 space-y-1 text-gray-700">
                      <li>Careless sign errors in algebra</li>
                      <li>Forgetting to simplify final answers</li>
                      <li>Misreading question requirements</li>
                      <li>Not showing sufficient working</li>
                      <li>Confusing degrees and radians</li>
                    </ol>
                  </div>
                  <div>
                    <ol className="list-decimal ml-5 space-y-1 text-gray-700" start="6">
                      <li>Incorrect calculator mode settings</li>
                      <li>Poor time management strategies</li>
                      <li>Not checking answer reasonableness</li>
                      <li>Mixing up similar formulas</li>
                      <li>Incomplete coordinate geometry solutions</li>
                    </ol>
                  </div>
                </div>
              </GuideCard>
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
