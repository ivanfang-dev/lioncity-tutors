import { MATCH_TIME } from '@/data/promises';
export const metadata = {
  title: 'A-Level Math Guide 2026: H1 & H2 Strategy | LionCity Tutors',
  description: 'A-Level Mathematics guide for Singapore JC students — H1 (8865) and H2 (9758) topic breakdowns, the 2026 exam timetable, and the technique that earns marks.',
  keywords: [
    "A Level Math 2026", "H1 Mathematics Singapore", "H2 Mathematics Singapore", "Cambridge A Level Math guide", "A Level Math preparation", "JC Math tuition Singapore", "A Level Math revision techniques", "Singapore A Level Mathematics"
  ],
  openGraph: {
    images: [DEFAULT_OG_IMAGE],
    title: 'A-Level Math Guide 2026: H1 & H2 Strategy | LionCity Tutors',
    description: 'Comprehensive A Level Mathematics guide with proven strategies to help Singapore JC students achieve A grades in H1 & H2 Mathematics.',
    url: 'https://www.lioncitytutors.com/a-level-math',
    type: 'article',
  },
  alternates: {
    canonical: "https://www.lioncitytutors.com/a-level-math"
  }
};

import TableOfContents from '@/components/TableOfContents';
import GuideSchema from '@/components/seo/GuideSchema';
import { DEFAULT_OG_IMAGE } from '@/lib/seo/openGraph';
import {
  GuideHeader, SectionHeading, GuideCard, TopicCard, GuideTimeline, KeyTakeaways, GuideCTA, ICON_STROKE,
  RelatedGuides, ExamTimetable,
} from '@/components/guide';
import {
  FileText, CalendarClock, Calculator, Sigma, Brain, Target,
  TriangleAlert, CalendarDays, BookOpen, Lightbulb, GraduationCap, Users,
  Hourglass, ListChecks,
} from 'lucide-react';

const tableOfContents = [
  { id: 'structure', label: 'Exam & subject structure' },
  { id: 'exam-dates', label: '2026 exam timetable' },
  { id: 'timeline', label: '24-month study timeline' },
  { id: 'h1-math', label: 'H1 Mathematics' },
  { id: 'h2-math', label: 'H2 Mathematics' },
  { id: 'study-techniques', label: 'Study techniques that work' },
  { id: 'exam-strategies', label: 'Exam strategy' },
  { id: 'mistakes', label: 'Common mistakes to avoid' },
  { id: 'schedule', label: 'Weekly study schedule' },
  { id: 'resources', label: 'Essential resources' },
  { id: 'mindset', label: 'Mental preparation & maturity' },
  { id: 'university', label: 'University pathways' },
  { id: 'tuition', label: 'When to consider tuition' },
  { id: 'final-months', label: 'Final months' },
];

const timeline = [
  {
    title: 'JC1 Term 1–2 · Foundation Phase',
    points: [
      'Master fundamental pure mathematics concepts and techniques',
      'Build strong algebra and trigonometry foundation',
      'Develop systematic approach to calculus problems',
      'Begin introduction to statistical concepts and probability',
      'Focus on mathematical reasoning and proof techniques',
    ],
  },
  {
    title: 'JC1 Term 3–4 · Skill Development Phase',
    points: [
      'Complete majority of H1/H2 syllabus coverage',
      'Master advanced calculus techniques and applications',
      'Develop proficiency in complex numbers and sequences',
      'Build statistical analysis and hypothesis testing skills',
      'Begin practicing A Level standard examination questions',
    ],
  },
  {
    title: 'JC2 Term 1–2 · Application Phase',
    points: [
      'Intensive practice with Cambridge A Level past papers',
      'Focus on exam techniques and mathematical communication',
      'Master time management for 3-hour examination papers',
      'Develop advanced problem-solving strategies',
      'Prepare comprehensively for Mid-Year Examinations',
    ],
  },
  {
    title: 'JC2 Prelims to A Levels · Mastery Phase',
    points: [
      'Intensive revision targeting preliminary exam weaknesses',
      'Final consolidation of all formulas and key theorems',
      'Daily practice papers under strict examination conditions',
      'Perfect mathematical presentation and notation',
      'Mental preparation and stress management techniques',
    ],
  },
];

export default function ALevelMath() {
  const whatsappMessage = `Hi LionCity Tutors! I'd like help finding an A Level Math tutor.

Student level (e.g. JC1 / JC2):
Current grade:
Location:
Preferred days & timing: `;
  const whatsappHref = `https://wa.me/6588701152?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <>
    <GuideSchema
      slug="a-level-math"
      course={{
        name: 'A-Level H1/H2 Mathematics Tuition',
        description: 'One-to-one H1 and H2 Mathematics tuition in Singapore, covering the full 8865 and 9758 syllabuses.',
        educationalLevel: 'GCE A-Level',
      }}
    />
    <main className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16">
      <div className="mx-auto max-w-2xl lg:max-w-none lg:grid lg:grid-cols-[minmax(0,42rem)_15rem] lg:justify-center lg:gap-12">
        {/* Article column */}
        <div>
          <GuideHeader
            title="A Level Math Guide 2026: Master H1 & H2 Mathematics for University Success"
            author="By the LionCity Tutors Mathematics Team"
            meta="Updated June 8, 2026 · 18 min read"
            imageSrc="/math-tuition.webp"
            imageAlt="Handwritten calculus and equations — the pure maths and statistics at the heart of A Level Mathematics."
          />

          <article className="space-y-12 text-gray-700 leading-relaxed">
            <p className="text-lg text-gray-800 leading-relaxed text-pretty">
              A Level Mathematics is the gateway to Singapore&rsquo;s top universities and competitive courses like Medicine, Engineering, and Economics. With H1 and H2 Mathematics offering different levels of mathematical rigor, strategic preparation is crucial for achieving A grades. This comprehensive guide provides proven strategies for A Level Math excellence in 2026.
            </p>

            {/* Key takeaways */}
            <KeyTakeaways
              items={[
                <>A Level Maths comes in two levels &mdash; H1 (8865) for non-STEM courses, and H2 (9758) for Engineering, Medicine and the sciences.</>,
                <>A steady JC1&rarr;JC2 timeline built on understanding beats last-minute memorisation every time.</>,
                <>Method marks are everything &mdash; clear working, correct notation and mathematical communication earn as much as the final answer.</>,
                <>Struggling with proofs, unfamiliar problems or the O-Level&rarr;A-Level jump is the usual signal that targeted tuition will help.</>,
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
              <SectionHeading icon={FileText}>Understanding A Level Mathematics Structure</SectionHeading>
              <p className="text-pretty">
                Singapore&rsquo;s A Level Mathematics offers two distinct levels, each designed for different university pathways and degree requirements.
              </p>
              <GuideCard className="mt-4">
                <h4 className="font-semibold text-gray-900 mb-4">A Level Math Subjects Breakdown</h4>
                <div className="space-y-5">
                  <div>
                    <h5 className="font-semibold text-gray-900">H1 Mathematics &mdash; Paper 8865</h5>
                    <ul className="list-disc ml-5 mt-1.5 space-y-1 text-sm text-gray-700">
                      <li>For students not pursuing STEM degrees</li>
                      <li>Required for Economics, Business, Social Sciences</li>
                      <li>Paper 1: Pure Mathematics (50 marks, 1.5 hours)</li>
                      <li>Paper 2: Statistics (50 marks, 1.5 hours)</li>
                      <li>50% Pure Math, 50% Statistics coverage</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-900">H2 Mathematics &mdash; Paper 9758</h5>
                    <ul className="list-disc ml-5 mt-1.5 space-y-1 text-sm text-gray-700">
                      <li>Essential for Engineering, Medicine, Science degrees</li>
                      <li>Prerequisite for competitive university courses</li>
                      <li>Paper 1: Pure Mathematics (100 marks, 3 hours)</li>
                      <li>Paper 2: Pure Mathematics &amp; Statistics (100 marks, 3 hours)</li>
                      <li>70% Pure Math, 30% Statistics coverage</li>
                    </ul>
                  </div>
                </div>
              </GuideCard>
            </section>

            <section id="exam-dates" className="scroll-mt-24">
              <SectionHeading icon={CalendarDays}>2026 A-Level Math Exam Timetable</SectionHeading>
              <ExamTimetable
                examSlug="a-level"
                subjectSlugs={['h2-math', 'h1-math']}
                caption="Official 2026 SEAB dates for H1 (8865) and H2 (9758) Mathematics."
              />
            </section>

            <section id="timeline" className="scroll-mt-24">
              <SectionHeading icon={CalendarClock}>24-Month A Level Math Preparation Timeline</SectionHeading>
              <GuideTimeline items={timeline} />
            </section>

            <section id="h1-math" className="scroll-mt-24">
              <SectionHeading icon={Calculator}>H1 Mathematics Mastery Guide</SectionHeading>
              <div className="space-y-4">
                <TopicCard
                  title="Pure Mathematics"
                  weight="50% of total marks"
                  chips={['Functions', 'Graphing Techniques', 'Differentiation', 'Integration', 'Exponential & Logarithmic Functions']}
                  points={[
                    'Master function transformations and graph sketching',
                    'Practice differentiation and integration techniques daily',
                    'Focus on real-world applications of calculus',
                    'Develop strong algebraic manipulation skills',
                  ]}
                />
                <TopicCard
                  title="Statistics"
                  weight="50% of total marks"
                  chips={['Descriptive Statistics', 'Probability Distributions', 'Normal Distribution', 'Sampling', 'Hypothesis Testing']}
                  points={[
                    'Master probability calculations and distributions',
                    'Practice hypothesis testing procedures systematically',
                    'Learn to interpret statistical results in context',
                    'Develop proficiency with statistical tables and formulas',
                  ]}
                />
              </div>
            </section>

            <section id="h2-math" className="scroll-mt-24">
              <SectionHeading icon={Sigma}>H2 Mathematics Mastery Guide</SectionHeading>
              <div className="space-y-4">
                <TopicCard
                  title="Pure Mathematics — Algebra & Functions"
                  weight="25% of papers"
                  chips={['Functions', 'Graphing', 'Inequalities', 'Partial Fractions', 'Binomial Theorem', 'Mathematical Induction']}
                  points={[
                    'Master function composition and inverse functions',
                    'Practice advanced algebraic manipulation techniques',
                    'Learn systematic approaches to mathematical proofs',
                    'Develop graph sketching accuracy and speed',
                  ]}
                />
                <TopicCard
                  title="Calculus"
                  weight="35% of papers"
                  chips={['Differentiation', 'Integration', 'Differential Equations', 'Maclaurin Series']}
                  points={[
                    'Master advanced differentiation techniques (product, quotient, chain rules)',
                    'Practice integration by parts and substitution methods',
                    'Learn to solve first-order differential equations',
                    'Develop proficiency with series expansions',
                  ]}
                />
                <TopicCard
                  title="Complex Numbers & Vectors"
                  weight="15% of papers"
                  chips={['Complex Numbers', 'Argand Diagrams', 'De Moivre’s Theorem', 'Vectors', 'Lines and Planes']}
                  points={[
                    'Master complex number operations and representations',
                    'Practice geometric applications of complex numbers',
                    'Learn vector operations and 3D geometry',
                    'Develop spatial visualization skills',
                  ]}
                />
                <TopicCard
                  title="Statistics & Probability"
                  weight="25% of papers"
                  chips={['Probability Distributions', 'Sampling Theory', 'Hypothesis Testing', 'Correlation & Regression']}
                  points={[
                    'Master binomial, Poisson, and normal distributions',
                    'Practice hypothesis testing for different scenarios',
                    'Learn regression analysis and correlation interpretation',
                    'Develop statistical reasoning and communication skills',
                  ]}
                />
              </div>
            </section>

            <section id="study-techniques" className="scroll-mt-24">
              <SectionHeading icon={Brain}>A Level Math Study Techniques That Work</SectionHeading>
              <GuideCard>
                <h4 className="font-semibold text-gray-900 mb-3">Proven A Level Math Study Methods</h4>
                <div className="space-y-3 text-sm">
                  <div>
                    <p><strong className="text-gray-900">The Deep Practice Method:</strong></p>
                    <p>Focus on understanding the &lsquo;why&rsquo; behind each step. Practice fewer problems but ensure complete mastery of solution methods.</p>
                  </div>
                  <div>
                    <p><strong className="text-gray-900">Mathematical Communication Practice:</strong></p>
                    <p>Write out solutions in full mathematical language. Practice explaining your reasoning clearly and concisely.</p>
                  </div>
                  <div>
                    <p><strong className="text-gray-900">Conceptual Mapping Technique:</strong></p>
                    <p>Create visual maps connecting different mathematical concepts. Understand how topics link together across the syllabus.</p>
                  </div>
                  <div>
                    <p><strong className="text-gray-900">Timed Problem Solving:</strong></p>
                    <p>Practice solving problems under time pressure. Aim for 2–3 minutes per mark allocated to each question.</p>
                  </div>
                </div>
              </GuideCard>
            </section>

            <section id="exam-strategies" className="scroll-mt-24">
              <SectionHeading icon={Target}>A Level Math Exam Strategies</SectionHeading>
              <div className="space-y-4">
                <GuideCard>
                  <h4 className="font-semibold text-gray-900 mb-2">H1 Mathematics Exam Strategy</h4>
                  <ul className="list-disc ml-5 space-y-1 text-sm text-gray-700">
                    <li>Paper 1 (Pure): Focus on accuracy over speed, show all working clearly</li>
                    <li>Paper 2 (Statistics): Practice statistical interpretation and communication</li>
                    <li>Allocate time proportionally &mdash; roughly 1.8 minutes per mark</li>
                    <li>Always check answers for statistical reasonableness</li>
                    <li>Use graphing calculator efficiently for complex calculations</li>
                  </ul>
                </GuideCard>

                <GuideCard>
                  <h4 className="font-semibold text-gray-900 mb-2">H2 Mathematics Exam Strategy</h4>
                  <ul className="list-disc ml-5 space-y-1 text-sm text-gray-700">
                    <li>Paper 1: Start with your strongest pure math topics, manage the 3-hour duration carefully</li>
                    <li>Paper 2: Balance pure math and statistics sections effectively</li>
                    <li>Show mathematical reasoning clearly &mdash; method marks are crucial</li>
                    <li>Use proper mathematical notation and terminology throughout</li>
                    <li>Practice switching between calculator and non-calculator sections</li>
                  </ul>
                </GuideCard>

                <GuideCard>
                  <h4 className="font-semibold text-gray-900 mb-2">Graphing Calculator Mastery</h4>
                  <ul className="list-disc ml-5 space-y-1 text-sm text-gray-700">
                    <li>Learn all statistical functions (regression, hypothesis testing)</li>
                    <li>Master graphing techniques for function analysis</li>
                    <li>Practice numerical integration and equation solving</li>
                    <li>Know when calculator use is appropriate vs. exact methods</li>
                    <li>Verify calculator results with mathematical reasoning</li>
                  </ul>
                </GuideCard>
              </div>
            </section>

            <section id="mistakes" className="scroll-mt-24">
              <SectionHeading icon={TriangleAlert}>Common A Level Math Mistakes to Avoid</SectionHeading>
              <GuideCard>
                <h4 className="font-semibold text-gray-900 mb-3">Top 12 A Level Math Pitfalls</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-sm">
                  <div>
                    <ol className="list-decimal ml-5 space-y-1 text-gray-700">
                      <li>Poor mathematical communication and notation</li>
                      <li>Insufficient justification for solution steps</li>
                      <li>Misunderstanding question requirements</li>
                      <li>Inadequate use of mathematical language</li>
                      <li>Careless algebraic manipulation errors</li>
                      <li>Incorrect statistical interpretation</li>
                    </ol>
                  </div>
                  <div>
                    <ol className="list-decimal ml-5 space-y-1 text-gray-700" start="7">
                      <li>Poor time management in long papers</li>
                      <li>Over-reliance on calculator without understanding</li>
                      <li>Mixing up similar formulas and theorems</li>
                      <li>Not checking answer reasonableness</li>
                      <li>Incomplete solutions to multi-part questions</li>
                      <li>Weak proof and reasoning techniques</li>
                    </ol>
                  </div>
                </div>
              </GuideCard>
            </section>

            <section id="schedule" className="scroll-mt-24">
              <SectionHeading icon={CalendarDays}>Creating Your A Level Math Study Schedule</SectionHeading>
              <GuideCard>
                <h4 className="font-semibold text-gray-900 mb-3">Recommended Weekly Schedule (JC2)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                  <div>
                    <p className="font-semibold text-gray-900 mb-1.5">School Days (H1 Math)</p>
                    <ul className="list-disc ml-5 space-y-1 text-gray-700">
                      <li>60–90 minutes of daily focused practice</li>
                      <li>Balance pure mathematics and statistics</li>
                      <li>Review lecture notes within 24 hours</li>
                      <li>Complete tutorial questions thoroughly</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 mb-1.5">School Days (H2 Math)</p>
                    <ul className="list-disc ml-5 space-y-1 text-gray-700">
                      <li>90–120 minutes of daily intensive practice</li>
                      <li>Focus on concept mastery and application</li>
                      <li>Practice advanced problem-solving techniques</li>
                      <li>Work on mathematical communication skills</li>
                    </ul>
                  </div>
                </div>
                <div className="mt-5">
                  <p className="font-semibold text-gray-900 mb-1.5 text-sm">Weekends (both H1 &amp; H2)</p>
                  <ul className="list-disc ml-5 space-y-1 text-sm text-gray-700">
                    <li>Complete 1–2 full A Level practice papers</li>
                    <li>Analyze and review all weekly mistakes systematically</li>
                    <li>Focus intensive practice on identified weak areas</li>
                    <li>Prepare comprehensive formula sheets and concept summaries</li>
                  </ul>
                </div>
              </GuideCard>
            </section>

            <section id="resources" className="scroll-mt-24">
              <SectionHeading icon={BookOpen}>Essential A Level Math Resources</SectionHeading>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1.5">Recommended Textbooks</h4>
                  <ul className="list-disc ml-5 text-sm space-y-1 text-gray-700">
                    <li>H2 Mathematics (Coursebook) by Lee Peng Yee &mdash; comprehensive coverage</li>
                    <li>Understanding Mathematics by Lee Hong Kang &mdash; conceptual approach</li>
                    <li>New Syllabus Mathematics for JC by Teh Keng Seng</li>
                    <li>Cambridge International AS &amp; A Level Mathematics &mdash; official resources</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1.5">Practice Materials</h4>
                  <ul className="list-disc ml-5 text-sm space-y-1 text-gray-700">
                    <li>Cambridge A Level past papers (minimum 10 years)</li>
                    <li>Local JC preliminary examination papers</li>
                    <li>Topical workbooks for specific weak areas</li>
                    <li>Online practice platforms (MyMathLab, Khan Academy)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1.5">Digital Tools</h4>
                  <ul className="list-disc ml-5 text-sm space-y-1 text-gray-700">
                    <li>GeoGebra for advanced function visualization</li>
                    <li>Desmos Graphing Calculator for complex analysis</li>
                    <li>Wolfram Alpha for step-by-step solutions (learning tool)</li>
                    <li>TI-84 Plus CE graphing calculator tutorials</li>
                  </ul>
                </div>
              </div>
            </section>

            <section id="mindset" className="scroll-mt-24">
              <SectionHeading icon={Lightbulb}>Mental Preparation for A Level Math</SectionHeading>
              <p className="text-pretty">
                A Level Mathematics demands both mathematical maturity and mental resilience. Here&rsquo;s how to develop both:
              </p>
              <ul className="list-disc ml-6 space-y-2 mt-3 text-gray-700">
                <li><strong className="text-gray-900">Develop Mathematical Maturity:</strong> Focus on understanding concepts deeply rather than memorizing procedures</li>
                <li><strong className="text-gray-900">Build Problem-Solving Confidence:</strong> Practice approaching unfamiliar problems systematically</li>
                <li><strong className="text-gray-900">Master Mathematical Communication:</strong> Learn to express mathematical ideas clearly and precisely</li>
                <li><strong className="text-gray-900">Embrace Abstract Thinking:</strong> Develop comfort with theoretical concepts and proofs</li>
                <li><strong className="text-gray-900">Practice Under Exam Conditions:</strong> Build stamina for 3-hour examination papers</li>
                <li><strong className="text-gray-900">Seek Clarification Early:</strong> Don&rsquo;t let conceptual gaps compound over time</li>
              </ul>
            </section>

            <section id="university" className="scroll-mt-24">
              <SectionHeading icon={GraduationCap}>University Pathways After A Level Math</SectionHeading>
              <GuideCard>
                <h4 className="font-semibold text-gray-900 mb-3">Your A Level Math Results Determine University Options</h4>
                <div className="space-y-4 text-sm">
                  <div>
                    <strong className="text-gray-900">H2 Mathematics Grade A or B:</strong>
                    <ul className="list-disc ml-5 mt-1 space-y-1 text-gray-700">
                      <li>Eligible for competitive courses: Medicine, Dentistry, Engineering</li>
                      <li>Access to Mathematics, Physics, Computer Science programs</li>
                      <li>Strong foundation for overseas university applications</li>
                    </ul>
                  </div>
                  <div>
                    <strong className="text-gray-900">H1 Mathematics Grade A or B:</strong>
                    <ul className="list-disc ml-5 mt-1 space-y-1 text-gray-700">
                      <li>Eligible for Economics, Business, Social Sciences</li>
                      <li>Access to most local university programs</li>
                      <li>Foundation for business and humanities degrees</li>
                    </ul>
                  </div>
                  <div>
                    <strong className="text-gray-900">Both H1 &amp; H2 with Further Mathematics:</strong>
                    <ul className="list-disc ml-5 mt-1 space-y-1 text-gray-700">
                      <li>Enhanced competitiveness for top-tier programs</li>
                      <li>Scholarship opportunities and direct admissions</li>
                      <li>Advanced standing in university mathematics courses</li>
                    </ul>
                  </div>
                </div>
              </GuideCard>
            </section>

            <section id="tuition" className="scroll-mt-24">
              <SectionHeading icon={Users}>When to Consider A Level Math Tuition</SectionHeading>
              <p>Consider professional A Level Math tuition if your child:</p>
              <ul className="list-disc ml-6 space-y-1 mt-3 text-gray-700">
                <li>Struggles with abstract mathematical concepts and proofs</li>
                <li>Needs guidance in mathematical communication and presentation</li>
                <li>Requires a structured approach to complex problem-solving</li>
                <li>Lacks confidence in tackling unfamiliar mathematical problems</li>
                <li>Aims for Grade A to meet competitive university course requirements</li>
                <li>Benefits from personalized attention beyond JC classroom teaching</li>
                <li>Needs help bridging the gap from O Level to A Level mathematics</li>
              </ul>
              <GuideCard className="mt-4">
                <p className="text-sm"><strong className="text-gray-900">Choose A Level Math tutors who:</strong> Have extensive experience with the Cambridge A Level curriculum, understand the transition from O Level mathematics, can teach both conceptual understanding and exam techniques, provide structured practice programs, and have proven track records with university-bound students.</p>
              </GuideCard>
            </section>

            <section id="final-months" className="scroll-mt-24">
              <SectionHeading icon={Hourglass}>Final Months A Level Math Preparation</SectionHeading>
              <GuideCard>
                <h4 className="font-semibold text-gray-900 mb-3">Last 60 Days Strategy</h4>
                <div className="space-y-4 text-sm">
                  <div>
                    <strong className="text-gray-900">Week 1–4: Intensive Practice Phase</strong>
                    <ul className="list-disc ml-5 mt-1 space-y-1 text-gray-700">
                      <li>Complete 1 full A Level paper daily (alternating H1/H2)</li>
                      <li>Time all practice sessions under exam conditions</li>
                      <li>Focus on mathematical communication and presentation</li>
                      <li>Analyze performance patterns across different topics</li>
                    </ul>
                  </div>
                  <div>
                    <strong className="text-gray-900">Week 5–6: Consolidation Phase</strong>
                    <ul className="list-disc ml-5 mt-1 space-y-1 text-gray-700">
                      <li>Review all key theorems, formulas, and concepts</li>
                      <li>Practice weak areas with targeted problem sets</li>
                      <li>Perfect graphing calculator techniques and shortcuts</li>
                      <li>Prepare comprehensive formula sheets for revision</li>
                    </ul>
                  </div>
                  <div>
                    <strong className="text-gray-900">Week 7–8: Final Preparation</strong>
                    <ul className="list-disc ml-5 mt-1 space-y-1 text-gray-700">
                      <li>Light revision focusing on confidence building</li>
                      <li>Practice mathematical communication and notation</li>
                      <li>Ensure adequate rest and stress management</li>
                      <li>Prepare all examination materials and logistics</li>
                    </ul>
                  </div>
                </div>
              </GuideCard>
            </section>

            <RelatedGuides slug="a-level-math" />

            {/* Conversion block */}
            <GuideCTA
              title="Excel in A Level Mathematics with expert guidance"
              description={`Tell us your child’s level and goals. We hand-match a vetted, MOE-familiar H1 or H2 Math tutor — usually within ${MATCH_TIME} — and parents never pay an agency fee.`}
              buttonText="Get expert A Level Math support"
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
