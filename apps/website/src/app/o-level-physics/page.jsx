import { MATCH_TIME } from '@/data/promises';
export const metadata = {
  title: 'O-Level Physics Guide 2026 | LionCity Tutors',
  description: 'O-Level Physics guide for Singapore students — mechanics, waves and electricity explained, plus the practical-paper and exam techniques that lift a B3 to an A1.',
  keywords: [
    'O Level Physics 2026',
    'O Level Physics Singapore',
    'GCE O Level Physics guide',
    'O Level Physics preparation',
    'Physics study tips',
    'O Level Physics tuition Singapore',
    'Physics revision techniques'
  ],
  openGraph: {
    images: [DEFAULT_OG_IMAGE],
    title: 'O Level Physics Guide 2026: Complete Study Strategy for Singapore Students',
    description: 'Comprehensive O Level Physics guide with proven strategies to help Singapore students achieve A1 grades in GCE O Level Physics.',
    url: 'https://www.lioncitytutors.com/o-level-physics',
    type: 'article',
  },
  alternates: {
    canonical: 'https://www.lioncitytutors.com/o-level-physics',
  },
};

import TableOfContents from '@/components/TableOfContents';
import GuideSchema from '@/components/seo/GuideSchema';
import {
  GuideHeader, SectionHeading, GuideCard, TopicCard, GuideTimeline, KeyTakeaways, GuideCTA, ICON_STROKE,
  RelatedGuides, ExamTimetable,
} from '@/components/guide';
import {
  FileText, CalendarClock, Gauge, Waves, Zap, Brain, Target,
  TriangleAlert, CalendarDays, BookOpen, Ruler, GraduationCap, Users,
  Hourglass, HeartHandshake, Flag, ListChecks, HelpCircle,
} from 'lucide-react';
import { O_LEVEL_PHYSICS_FAQS } from './faqs.mjs';
import { DEFAULT_OG_IMAGE } from '@/lib/seo/openGraph';

const tableOfContents = [
  { id: 'structure', label: 'Exam & paper structure' },
  { id: 'exam-dates', label: '2026 exam timetable' },
  { id: 'timeline', label: '18-month study timeline' },
  { id: 'mechanics', label: 'Mechanics' },
  { id: 'waves', label: 'Waves & optics' },
  { id: 'electromagnetism', label: 'Electricity & magnetism' },
  { id: 'study-techniques', label: 'Study techniques that work' },
  { id: 'exam-strategies', label: 'Paper-by-paper exam strategy' },
  { id: 'mistakes', label: 'Common mistakes to avoid' },
  { id: 'schedule', label: 'Weekly study schedule' },
  { id: 'resources', label: 'Essential resources' },
  { id: 'practical', label: 'Practical & lab skills' },
  { id: 'pathways', label: 'Future pathways' },
  { id: 'tuition', label: 'When to consider tuition' },
  { id: 'final-months', label: 'Final month' },
  { id: 'exam-day', label: 'Mental prep & exam day' },
  { id: 'faq', label: 'Frequently asked questions' },
  { id: 'conclusion', label: 'Conclusion' },
];

const timeline = [
  {
    title: 'Secondary 3 · Foundation Phase',
    points: [
      'Master basic measurement and units',
      'Build strong foundation in kinematics and dynamics',
      'Develop systematic approach to problem-solving',
      'Focus on understanding rather than memorization',
      'Complete all practical worksheets thoroughly',
    ],
  },
  {
    title: 'Secondary 4 Term 1–2 · Skill Development Phase',
    points: [
      'Master waves, electricity, and magnetism',
      'Begin intensive practice with past year papers',
      'Develop time management skills for different papers',
      'Strengthen practical skills and data analysis',
      'Practice drawing accurate diagrams and graphs',
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
      'Intensive revision based on prelim performance',
      'Final consolidation of formulas and key concepts',
      'Practice papers under strict timing conditions',
      'Mental preparation and exam stress management',
      'Maintain a consistent study routine until exam day',
    ],
  },
];

export default function OLevelPhysics() {
  const whatsappMessage = `Hi LionCity Tutors! I'd like help finding an O Level Physics tutor.

Student level (e.g. Sec 3 / Sec 4):
Current grade:
Location:
Preferred days & timing: `;
  const whatsappHref = `https://wa.me/6588701152?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <>
    <GuideSchema
      slug="o-level-physics"
      course={{
        name: 'O-Level Physics Tuition',
        description: 'One-to-one O-Level Physics tuition in Singapore, covering the full 6091 syllabus and the Paper 3 practical.',
        educationalLevel: 'GCE O-Level',
      }}
      faqs={O_LEVEL_PHYSICS_FAQS}
    />
    <main className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16">
      <div className="mx-auto max-w-2xl lg:max-w-none lg:grid lg:grid-cols-[minmax(0,42rem)_15rem] lg:justify-center lg:gap-12">
        {/* Article column */}
        <div>
          <GuideHeader
            title="O Level Physics Guide 2026: Master Mechanics, Waves & Electricity"
            author="By the LionCity Tutors Physics Team"
            meta="Updated May 22, 2026 · 15 min read"
            imageSrc="/o-level-physics.webp"
            imageAlt="Apparatus on a lab bench — the mechanics, waves and electricity at the heart of O Level Physics."
          />

          <article className="space-y-12 text-gray-700 leading-relaxed">
            <p className="text-lg text-gray-800 leading-relaxed text-pretty">
              O Level Physics is a fundamental subject that builds the foundation for further studies in science and engineering. With its focus on mechanics, waves, electricity, and modern physics, O Level Physics requires both theoretical understanding and practical application skills. This comprehensive guide provides proven strategies for achieving A1 grades in O Level Physics 2026.
            </p>

            {/* Key takeaways */}
            <KeyTakeaways
              items={[
                <>O Level Physics (5054) is three papers &mdash; MCQ (<span className="tabular-nums">30%</span>), structured (<span className="tabular-nums">50%</span>) and a practical test (<span className="tabular-nums">20%</span>).</>,
                <>A steady Sec 3&rarr;Sec 4 timeline built on understanding beats last-minute memorisation every time.</>,
                <>The biggest score lever isn&rsquo;t knowing more &mdash; it&rsquo;s answer technique: correct units, shown working and clear diagrams.</>,
                <>Struggling with problem-solving, circuits or practical questions is the usual signal that targeted tuition will help.</>,
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
              <SectionHeading icon={FileText}>Understanding O Level Physics Structure</SectionHeading>
              <p className="text-pretty">
                Singapore&rsquo;s O Level Physics (Paper 5054) is designed to develop students&rsquo; understanding of physics principles and their applications in everyday life and technology.
              </p>
              <GuideCard className="mt-4">
                <h4 className="font-semibold text-gray-900 mb-4">O Level Physics Papers Breakdown</h4>
                <div className="space-y-5">
                  <div>
                    <h5 className="font-semibold text-gray-900">Paper 1: Multiple Choice Questions</h5>
                    <ul className="list-disc ml-5 mt-1.5 space-y-1 text-sm text-gray-700">
                      <li>40 questions worth 40 marks</li>
                      <li>Duration: 1 hour</li>
                      <li>30% of total O Level Physics grade</li>
                      <li>Tests breadth of knowledge across all topics</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-900">Paper 2: Structured Questions</h5>
                    <ul className="list-disc ml-5 mt-1.5 space-y-1 text-sm text-gray-700">
                      <li>Variable number of questions worth 80 marks</li>
                      <li>Duration: 1 hour 45 minutes</li>
                      <li>50% of total O Level Physics grade</li>
                      <li>Focuses on application and problem-solving</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-900">Paper 3: Practical Test</h5>
                    <ul className="list-disc ml-5 mt-1.5 space-y-1 text-sm text-gray-700">
                      <li>2–3 experiments worth 40 marks</li>
                      <li>Duration: 1 hour 50 minutes</li>
                      <li>20% of total O Level Physics grade</li>
                      <li>Tests practical skills and data analysis</li>
                    </ul>
                  </div>
                </div>
              </GuideCard>
            </section>

            <section id="exam-dates" className="scroll-mt-24">
              <SectionHeading icon={CalendarDays}>2026 O-Level Physics Exam Timetable</SectionHeading>
              <ExamTimetable
                examSlug="o-level"
                subjectSlugs={['physics']}
                caption="Official 2026 SEAB dates for O-Level Physics."
              />
            </section>

            <section id="timeline" className="scroll-mt-24">
              <SectionHeading icon={CalendarClock}>18-Month O Level Physics Preparation Timeline</SectionHeading>
              <GuideTimeline items={timeline} />
            </section>

            <section id="mechanics" className="scroll-mt-24">
              <SectionHeading icon={Gauge}>Mechanics Mastery Guide</SectionHeading>
              <div className="space-y-4">
                <TopicCard
                  title="Kinematics & Dynamics"
                  weight="25–30% of papers"
                  chips={['Motion Graphs', 'Newton’s Laws', 'Forces', 'Momentum', 'Energy Conservation']}
                  points={[
                    'Master motion graph interpretation',
                    'Practice force diagrams and free body analysis',
                    'Understand energy conservation principles',
                    'Learn to solve projectile motion problems',
                  ]}
                />
                <TopicCard
                  title="Turning Effects & Pressure"
                  weight="15–20% of papers"
                  chips={['Moments', 'Center of Gravity', 'Pressure', 'Hydraulics']}
                  points={[
                    'Master moment calculations',
                    'Practice pressure problems',
                    'Understand hydraulic principles',
                    'Learn to solve equilibrium problems',
                  ]}
                />
              </div>
            </section>

            <section id="waves" className="scroll-mt-24">
              <SectionHeading icon={Waves}>Waves & Optics Mastery Guide</SectionHeading>
              <div className="space-y-4">
                <TopicCard
                  title="Wave Properties & Behavior"
                  weight="20–25% of papers"
                  chips={['Wave Characteristics', 'Sound Waves', 'Light Waves', 'Reflection', 'Refraction']}
                  points={[
                    'Master wave equation applications',
                    'Practice ray diagram construction',
                    'Understand wave phenomena',
                    'Learn to solve optics problems',
                  ]}
                />
                <TopicCard
                  title="Lenses & Optical Instruments"
                  weight="15–20% of papers"
                  chips={['Convex & Concave Lenses', 'Magnification', 'Microscopes', 'Telescopes']}
                  points={[
                    'Master lens equation applications',
                    'Practice ray diagram construction',
                    'Understand optical instrument principles',
                    'Learn to solve magnification problems',
                  ]}
                />
              </div>
            </section>

            <section id="electromagnetism" className="scroll-mt-24">
              <SectionHeading icon={Zap}>Electricity & Magnetism Mastery Guide</SectionHeading>
              <div className="space-y-4">
                <TopicCard
                  title="Electric Circuits"
                  weight="20–25% of papers"
                  chips={['Current', 'Voltage', 'Resistance', 'Series & Parallel Circuits', 'Power']}
                  points={[
                    'Master circuit analysis techniques',
                    'Practice Ohm’s Law applications',
                    'Understand power calculations',
                    'Learn to solve complex circuit problems',
                  ]}
                />
                <TopicCard
                  title="Magnetism & Electromagnetism"
                  weight="15–20% of papers"
                  chips={['Magnetic Fields', 'Electromagnetic Induction', 'Transformers', 'Motors']}
                  points={[
                    'Master magnetic field concepts',
                    'Practice induction problems',
                    'Understand transformer principles',
                    'Learn to solve motor problems',
                  ]}
                />
              </div>
            </section>

            <section id="study-techniques" className="scroll-mt-24">
              <SectionHeading icon={Brain}>O Level Physics Study Techniques That Work</SectionHeading>
              <GuideCard>
                <h4 className="font-semibold text-gray-900 mb-3">Proven O Level Physics Study Methods</h4>
                <div className="space-y-3 text-sm">
                  <div>
                    <p><strong className="text-gray-900">The Problem-Solving Method:</strong></p>
                    <p>Practice solving 5 different types of physics problems daily, focusing on systematic approaches and mathematical accuracy.</p>
                  </div>
                  <div>
                    <p><strong className="text-gray-900">Concept Mapping Technique:</strong></p>
                    <p>Create visual connections between different physics topics to see the bigger picture and relationships.</p>
                  </div>
                  <div>
                    <p><strong className="text-gray-900">Formula Derivation Practice:</strong></p>
                    <p>Don&rsquo;t just memorize equations &mdash; understand how they&rsquo;re derived and when to apply them.</p>
                  </div>
                  <div>
                    <p><strong className="text-gray-900">Real-World Connection Method:</strong></p>
                    <p>Always connect theoretical concepts to real-world applications and phenomena.</p>
                  </div>
                </div>
              </GuideCard>
            </section>

            <section id="exam-strategies" className="scroll-mt-24">
              <SectionHeading icon={Target}>O Level Physics Exam Strategies</SectionHeading>
              <div className="space-y-4">
                <GuideCard>
                  <h4 className="font-semibold text-gray-900 mb-2">Paper 1 (MCQ) Strategy</h4>
                  <ul className="list-disc ml-5 space-y-1 text-sm text-gray-700">
                    <li>Allocate 1.5 minutes per question maximum</li>
                    <li>Use the elimination method for difficult questions</li>
                    <li>Pay attention to units and significant figures</li>
                    <li>Don&rsquo;t second-guess yourself unless you find a clear error</li>
                    <li>Review flagged questions if time permits</li>
                  </ul>
                </GuideCard>

                <GuideCard>
                  <h4 className="font-semibold text-gray-900 mb-2">Paper 2 (Structured Questions) Strategy</h4>
                  <ul className="list-disc ml-5 space-y-1 text-sm text-gray-700">
                    <li>Read all questions first and start with your strongest topics</li>
                    <li>Show all working clearly &mdash; partial credit is available</li>
                    <li>Use proper units and significant figures</li>
                    <li>Draw clear diagrams with proper labels</li>
                    <li>Check calculations and units in your final answers</li>
                  </ul>
                </GuideCard>

                <GuideCard>
                  <h4 className="font-semibold text-gray-900 mb-2">Paper 3 (Practical) Strategy</h4>
                  <ul className="list-disc ml-5 space-y-1 text-sm text-gray-700">
                    <li>Read instructions carefully before starting</li>
                    <li>Record all measurements with proper units</li>
                    <li>Draw clear and accurate graphs</li>
                    <li>Show all calculations clearly</li>
                    <li>Check for systematic errors</li>
                  </ul>
                </GuideCard>
              </div>
            </section>

            <section id="mistakes" className="scroll-mt-24">
              <SectionHeading icon={TriangleAlert}>Common O Level Physics Mistakes to Avoid</SectionHeading>
              <GuideCard>
                <h4 className="font-semibold text-gray-900 mb-3">Top 10 O Level Physics Pitfalls</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-sm">
                  <div>
                    <ol className="list-decimal ml-5 space-y-1 text-gray-700">
                      <li>Incorrect unit conversions</li>
                      <li>Confusing vector and scalar quantities</li>
                      <li>Missing forces in free body diagrams</li>
                      <li>Wrong significant figures in calculations</li>
                      <li>Incorrect sign conventions</li>
                    </ol>
                  </div>
                  <div>
                    <ol className="list-decimal ml-5 space-y-1 text-gray-700" start="6">
                      <li>Incorrect interpretation of graphs</li>
                      <li>Missing units in numerical answers</li>
                      <li>Confusing different types of energy</li>
                      <li>Inadequate explanation of principles</li>
                      <li>Poor time management across papers</li>
                    </ol>
                  </div>
                </div>
              </GuideCard>
            </section>

            <section id="schedule" className="scroll-mt-24">
              <SectionHeading icon={CalendarDays}>Creating Your O Level Physics Study Schedule</SectionHeading>
              <GuideCard>
                <h4 className="font-semibold text-gray-900 mb-3">Recommended Weekly Schedule (Secondary 4)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                  <div>
                    <p className="font-semibold text-gray-900 mb-1.5">School Days</p>
                    <ul className="list-disc ml-5 space-y-1 text-gray-700">
                      <li>2–3 hours of daily practice and revision</li>
                      <li>Focus on homework plus additional past-paper questions</li>
                      <li>Review lecture notes within 24 hours</li>
                      <li>Practice 3–5 challenging problems daily</li>
                      <li>Learn 2–3 new formulas each week</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 mb-1.5">Weekends</p>
                    <ul className="list-disc ml-5 space-y-1 text-gray-700">
                      <li>Complete 1–2 full practice papers</li>
                      <li>Intensive topic revision for weak areas</li>
                      <li>Create summary notes and concept maps</li>
                      <li>Review and analyse the week&rsquo;s mistakes</li>
                      <li>Practise practical skills and experiments</li>
                    </ul>
                  </div>
                </div>
              </GuideCard>
            </section>

            <section id="resources" className="scroll-mt-24">
              <SectionHeading icon={BookOpen}>Essential O Level Physics Resources</SectionHeading>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1.5">Recommended Textbooks</h4>
                  <ul className="list-disc ml-5 text-sm space-y-1 text-gray-700">
                    <li>Physics Matters (Marshall Cavendish) &mdash; comprehensive coverage</li>
                    <li>O Level Physics Guide (Shinglee) &mdash; exam-focused</li>
                    <li>Understanding Physics (Jim Breithaupt) &mdash; conceptual approach</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1.5">Practice Materials</h4>
                  <ul className="list-disc ml-5 text-sm space-y-1 text-gray-700">
                    <li>GCE O Level past papers (last 10 years minimum)</li>
                    <li>School preliminary examination papers</li>
                    <li>Topical practice books for specific physics areas</li>
                    <li>Online practice platforms and simulations</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1.5">Digital Tools</h4>
                  <ul className="list-disc ml-5 text-sm space-y-1 text-gray-700">
                    <li>PhET simulations for visualizing physics concepts</li>
                    <li>Physics problem-solving apps</li>
                    <li>Online physics calculators</li>
                    <li>Anki for memorizing formulas and concepts</li>
                  </ul>
                </div>
              </div>
            </section>

            <section id="practical" className="scroll-mt-24">
              <SectionHeading icon={Ruler}>Practical Skills and Laboratory Techniques</SectionHeading>
              <p className="text-pretty">
                O Level Physics emphasizes practical skills and data analysis abilities that are tested in Paper 3:
              </p>
              <ul className="list-disc ml-6 space-y-2 mt-3 text-gray-700">
                <li><strong className="text-gray-900">Master Common Techniques:</strong> Measurement, data collection, error analysis, and graph plotting</li>
                <li><strong className="text-gray-900">Data Analysis Skills:</strong> Interpret graphs, calculate uncertainties, and draw valid conclusions</li>
                <li><strong className="text-gray-900">Safety Awareness:</strong> Understand laboratory safety protocols and equipment handling</li>
                <li><strong className="text-gray-900">Observation Skills:</strong> Learn to describe physical phenomena using precise scientific language</li>
                <li><strong className="text-gray-900">Experimental Design:</strong> Understand how to plan investigations and control variables</li>
                <li><strong className="text-gray-900">Error Analysis:</strong> Identify sources of experimental error and suggest improvements</li>
              </ul>
            </section>

            <section id="pathways" className="scroll-mt-24">
              <SectionHeading icon={GraduationCap}>Post-O Level Physics Pathways</SectionHeading>
              <GuideCard>
                <h4 className="font-semibold text-gray-900 mb-3">Your O Level Physics Results Open These Doors</h4>
                <div className="space-y-4 text-sm">
                  <div>
                    <strong className="text-gray-900">A1-B3 grades in O Level Physics:</strong>
                    <ul className="list-disc ml-5 mt-1 space-y-1 text-gray-700">
                      <li>Eligible for H2 Physics in Junior College</li>
                      <li>Access to engineering and science courses in polytechnics</li>
                      <li>Strong foundation for university STEM programs</li>
                    </ul>
                  </div>
                  <div>
                    <strong className="text-gray-900">C5-C6 grades in O Level Physics:</strong>
                    <ul className="list-disc ml-5 mt-1 space-y-1 text-gray-700">
                      <li>Eligible for H1 Physics in Junior College</li>
                      <li>Access to most polytechnic diploma courses</li>
                      <li>Foundation for technical and applied science programs</li>
                    </ul>
                  </div>
                </div>
              </GuideCard>
            </section>

            <section id="tuition" className="scroll-mt-24">
              <SectionHeading icon={Users}>When to Consider O Level Physics Tuition</SectionHeading>
              <p>Consider professional O Level Physics tuition if your child:</p>
              <ul className="list-disc ml-6 space-y-1 mt-3 text-gray-700">
                <li>Struggles with complex physics concepts and problem-solving</li>
                <li>Needs help connecting theoretical knowledge to practical applications</li>
                <li>Requires structured guidance for mathematical problem-solving</li>
                <li>Lacks confidence in data analysis and graph interpretation</li>
                <li>Aims for A1 grades to meet JC or polytechnic course requirements</li>
                <li>Benefits from personalized feedback on answer techniques</li>
              </ul>
              <GuideCard className="mt-4">
                <p className="text-sm"><strong className="text-gray-900">Choose O Level Physics tutors who:</strong> Have extensive experience with current O Level syllabi, understand common student misconceptions, can explain complex concepts clearly, provide structured practice programs, and have strong backgrounds in physics or engineering.</p>
              </GuideCard>
            </section>

            <section id="final-months" className="scroll-mt-24">
              <SectionHeading icon={Hourglass}>Final Month O Level Physics Preparation</SectionHeading>
              <GuideCard>
                <h4 className="font-semibold text-gray-900 mb-3">Last 30 Days Strategy</h4>
                <div className="space-y-4 text-sm">
                  <div>
                    <strong className="text-gray-900">Week 1–2: Intensive Practice</strong>
                    <ul className="list-disc ml-5 mt-1 space-y-1 text-gray-700">
                      <li>Complete 2 full papers daily</li>
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

            <section id="exam-day" className="scroll-mt-24">
              <SectionHeading icon={HeartHandshake}>Mental Preparation and Exam Day Success</SectionHeading>
              <div className="space-y-4">
                <GuideCard>
                  <h4 className="font-semibold text-gray-900 mb-2">Stress Management Techniques</h4>
                  <ul className="list-disc ml-5 space-y-1 text-sm text-gray-700">
                    <li>Practice deep breathing exercises before and during exams</li>
                    <li>Use positive visualization &mdash; imagine yourself succeeding</li>
                    <li>Maintain perspective &mdash; one exam doesn&rsquo;t define your future</li>
                    <li>Get adequate sleep (7–8 hours), especially the week before exams</li>
                    <li>Stay physically active to manage stress hormones naturally</li>
                  </ul>
                </GuideCard>

                <GuideCard>
                  <h4 className="font-semibold text-gray-900 mb-2">Exam Day Protocol</h4>
                  <ul className="list-disc ml-5 space-y-1 text-sm text-gray-700">
                    <li>Arrive 30 minutes early with all required materials</li>
                    <li>Bring multiple pens, pencils, a calculator, and your data booklet</li>
                    <li>Read instructions carefully &mdash; don&rsquo;t rush into questions</li>
                    <li>Start with the questions you&rsquo;re most confident about</li>
                    <li>If stuck, move on and return later with a fresh perspective</li>
                    <li>Use any remaining time to check calculations and units</li>
                  </ul>
                </GuideCard>
              </div>
            </section>

            <section id="faq" className="scroll-mt-24">
              <SectionHeading icon={HelpCircle}>Frequently Asked Questions</SectionHeading>
              <div className="space-y-6">
                {O_LEVEL_PHYSICS_FAQS.map((faq) => (
                  <div key={faq.question}>
                    <h3 className="text-lg font-semibold text-gray-900">{faq.question}</h3>
                    <p className="mt-2 text-gray-700">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </section>

            <section id="conclusion" className="scroll-mt-24">
              <SectionHeading icon={Flag}>Conclusion: Your O Level Physics Success Journey</SectionHeading>
              <p className="text-pretty">
                Achieving excellence in O Level Physics requires dedication, strategic preparation, and consistent practice. The comprehensive approach outlined in this guide &mdash; from understanding the syllabus structure through mastering each topic area to developing effective exam strategies &mdash; provides you with the roadmap to success.
              </p>
              <p className="mt-3 text-pretty">
                Remember that O Level Physics is not just about memorizing formulas and equations. It&rsquo;s about developing critical thinking skills, understanding the physical world around us, and preparing for exciting further studies in science and technology. Every challenging problem you solve and every concept you master builds towards your future success.
              </p>
              <div className="rounded-xl border border-primary/15 bg-primary/5 p-5 sm:p-6 mt-4">
                <p className="font-semibold text-gray-900">
                  Success in O Level Physics comes from consistent daily practice, understanding rather than memorization, and maintaining confidence in your abilities. Trust your preparation, stay focused during exams, and remember that your hard work will pay off in opening doors to amazing opportunities in science and engineering.
                </p>
              </div>
            </section>

            <RelatedGuides slug="o-level-physics" />

            {/* Conversion block */}
            <GuideCTA
              title="Find your O Level Physics tutor"
              description={`Tell us your child’s level and goals. We hand-match a vetted, MOE-familiar O Level Physics tutor — usually within ${MATCH_TIME} — and parents never pay an agency fee.`}
              buttonText="Find your O Level Physics tutor"
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
