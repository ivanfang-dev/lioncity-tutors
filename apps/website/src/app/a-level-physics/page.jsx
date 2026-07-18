export const metadata = {
  title: 'A Level H2 Physics Guide 2025: Complete Study Strategy for Singapore Students | LionCity Tutors',
  description: 'Ultimate A Level H2 Physics preparation guide for Singapore students. Expert strategies, practical techniques, and proven tips to score A in H2 Physics 2025.',
  keywords: ["A Level H2 Physics 2025", "H2 Physics Singapore", "GCE A Level Physics guide", "A Level Physics preparation", "H2 Physics study tips", "A Level Physics tuition Singapore", "Physics revision techniques", "H2 Physics syllabus"],
  openGraph: {
    title: 'A Level H2 Physics Guide 2025: Complete Study Strategy for Singapore Students | LionCity Tutors',
    description: 'Comprehensive A Level H2 Physics guide with proven strategies to help Singapore students achieve A grades in GCE A Level Physics.',
    url: 'https://www.lioncitytutors.com/a-level-physics',
    type: 'article',
  },
  alternates: {
    canonical: "https://www.lioncitytutors.com/a-level-physics"
  }
};

import TableOfContents from '@/components/TableOfContents';
import {
  GuideHeader, SectionHeading, GuideCard, TopicCard, GuideTimeline, KeyTakeaways, GuideCTA, ICON_STROKE,
} from '@/components/guide';
import {
  FileText, CalendarClock, Gauge, Waves, Zap, Atom, Brain, Target,
  TriangleAlert, CalendarDays, BookOpen, Ruler, GraduationCap, Users,
  Hourglass, HeartHandshake, Compass, Flag, ListChecks,
} from 'lucide-react';

const tableOfContents = [
  { id: 'structure', label: 'Exam & paper structure' },
  { id: 'timeline', label: '24-month study timeline' },
  { id: 'mechanics', label: 'Mechanics' },
  { id: 'waves', label: 'Waves & optics' },
  { id: 'electromagnetism', label: 'Electricity & magnetism' },
  { id: 'modern', label: 'Modern physics' },
  { id: 'study-techniques', label: 'Study techniques that work' },
  { id: 'exam-strategies', label: 'Paper-by-paper exam strategy' },
  { id: 'mistakes', label: 'Common mistakes to avoid' },
  { id: 'schedule', label: 'Weekly study schedule' },
  { id: 'resources', label: 'Essential resources' },
  { id: 'practical', label: 'Practical & lab skills' },
  { id: 'career', label: 'University & career pathways' },
  { id: 'tuition', label: 'When to consider tuition' },
  { id: 'final-months', label: 'Final two months' },
  { id: 'exam-day', label: 'Mental prep & exam day' },
  { id: 'post-exam', label: 'After the exam' },
  { id: 'conclusion', label: 'Conclusion' },
];

const timeline = [
  {
    title: 'JC1 Term 1–2 · Foundation Building Phase',
    points: [
      'Master kinematics, dynamics, and Newton’s laws',
      'Build strong foundation in vector mathematics',
      'Develop systematic approach to force analysis',
      'Focus on understanding rather than memorization',
      'Complete all tutorial questions and practical worksheets',
    ],
  },
  {
    title: 'JC1 Term 3–4 · Concept Integration Phase',
    points: [
      'Master waves, oscillations, and wave phenomena',
      'Begin electricity and magnetism foundation',
      'Develop analytical thinking for complex problem-solving',
      'Practice past year A Level questions by topic',
      'Strengthen practical skills and data analysis techniques',
    ],
  },
  {
    title: 'JC2 Term 1–2 · Application Mastery Phase',
    points: [
      'Complete modern physics and quantum mechanics',
      'Master electromagnetic induction and AC circuits',
      'Intensive practice with full A Level past papers',
      'Develop time management and exam techniques',
      'Focus on common exam question patterns and mark schemes',
    ],
  },
  {
    title: 'JC2 Term 3 to A Levels · Excellence Phase',
    points: [
      'Intensive revision based on Prelim exam performance',
      'Daily practice with timed A Level standard questions',
      'Perfect answer presentation and scientific communication',
      'Final consolidation of all formulae and key concepts',
      'Mental preparation and stress management strategies',
    ],
  },
];

export default function ALevelPhysics() {
  const whatsappMessage = `Hi LionCity Tutors! I'd like help finding an H2 Physics tutor.

Student level (e.g. JC1 / JC2):
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
            title="A Level H2 Physics Guide 2025: Master Mechanics, Waves & Modern Physics"
            author="By the LionCity Tutors Physics Team"
            meta="Updated June 14, 2025 · 18 min read"
            imageSrc="/physics.webp"
            imageAlt="Trails of light in motion — the mechanics, waves and modern physics at the heart of H2 Physics."
          />

          <article className="space-y-12 text-gray-700 leading-relaxed">
            <p className="text-lg text-gray-800 leading-relaxed text-pretty">
              A Level H2 Physics is one of the most challenging and rewarding subjects in the Singapore GCE A Level curriculum. With its comprehensive coverage of mechanics, waves, electricity, and modern physics, H2 Physics demands both theoretical understanding and practical application skills. This detailed guide provides proven strategies for achieving A grades in H2 Physics 2025.
            </p>

            {/* Key takeaways */}
            <KeyTakeaways
              items={[
                <>H2 Physics (9749) is examined across three papers &mdash; MCQ (<span className="tabular-nums">15%</span>), structured (<span className="tabular-nums">50%</span>) and free-response (<span className="tabular-nums">35%</span>).</>,
                <>A steady JC1&rarr;JC2 timeline built on understanding beats last-minute memorisation every time.</>,
                <>The biggest score lever isn&rsquo;t knowing more &mdash; it&rsquo;s answer technique: correct units, shown working and clear diagrams.</>,
                <>Struggling with multi-step problem-solving or data-analysis questions is the usual signal that targeted tuition will help.</>,
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
              <SectionHeading icon={FileText}>Understanding A Level H2 Physics Structure</SectionHeading>
              <p className="text-pretty">
                Singapore&rsquo;s A Level H2 Physics (Paper 9749) is a comprehensive subject that bridges secondary school physics with university-level concepts, essential for students pursuing engineering, physics, and related science courses.
              </p>
              <GuideCard className="mt-4">
                <h4 className="font-semibold text-gray-900 mb-4">H2 Physics Papers Breakdown</h4>
                <div className="space-y-5">
                  <div>
                    <h5 className="font-semibold text-gray-900">Paper 1: Multiple Choice Questions</h5>
                    <ul className="list-disc ml-5 mt-1.5 space-y-1 text-sm text-gray-700">
                      <li>30 questions worth 30 marks</li>
                      <li>Duration: 1 hour</li>
                      <li>15% of total H2 Physics grade</li>
                      <li>Tests breadth of knowledge across all topics</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-900">Paper 2: Structured Questions</h5>
                    <ul className="list-disc ml-5 mt-1.5 space-y-1 text-sm text-gray-700">
                      <li>Variable number of questions worth 100 marks</li>
                      <li>Duration: 2 hours</li>
                      <li>50% of total H2 Physics grade</li>
                      <li>Focuses on application and problem-solving</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-900">Paper 3: Free Response Questions</h5>
                    <ul className="list-disc ml-5 mt-1.5 space-y-1 text-sm text-gray-700">
                      <li>Variable number of questions worth 100 marks</li>
                      <li>Duration: 2 hours 30 minutes</li>
                      <li>35% of total H2 Physics grade</li>
                      <li>Emphasizes extended responses and synthesis</li>
                    </ul>
                  </div>
                </div>
              </GuideCard>
            </section>

            <section id="timeline" className="scroll-mt-24">
              <SectionHeading icon={CalendarClock}>24-Month A Level H2 Physics Preparation Timeline</SectionHeading>
              <GuideTimeline items={timeline} />
            </section>

            <section id="mechanics" className="scroll-mt-24">
              <SectionHeading icon={Gauge}>Mechanics Mastery Guide</SectionHeading>
              <div className="space-y-4">
                <TopicCard
                  title="Kinematics & Dynamics"
                  weight="20–25% of papers"
                  chips={['Motion Graphs', 'Newton’s Laws', 'Forces', 'Momentum', 'Energy Conservation']}
                  points={[
                    'Master motion graph interpretation and analysis',
                    'Practice force diagrams and free body analysis',
                    'Understand energy conservation principles',
                    'Learn to solve projectile motion problems',
                  ]}
                />
                <TopicCard
                  title="Circular Motion & Gravitation"
                  weight="15–20% of papers"
                  chips={['Uniform Circular Motion', 'Gravitational Fields', 'Orbital Mechanics']}
                  points={[
                    'Master centripetal force calculations',
                    'Practice gravitational field problems',
                    'Understand satellite motion principles',
                    'Learn to solve orbital mechanics problems',
                  ]}
                />
                <TopicCard
                  title="Oscillations & Simple Harmonic Motion"
                  weight="10–15% of papers"
                  chips={['SHM Equations', 'Energy in Oscillations', 'Resonance']}
                  points={[
                    'Master SHM equation derivations',
                    'Practice energy calculations in oscillations',
                    'Understand resonance phenomena',
                    'Learn to solve damping problems',
                  ]}
                />
              </div>
            </section>

            <section id="waves" className="scroll-mt-24">
              <SectionHeading icon={Waves}>Waves & Optics Mastery Guide</SectionHeading>
              <div className="space-y-4">
                <TopicCard
                  title="Wave Properties & Behavior"
                  weight="15–20% of papers"
                  chips={['Wave Characteristics', 'Superposition', 'Interference', 'Diffraction']}
                  points={[
                    'Master wave equation applications',
                    'Practice interference pattern calculations',
                    'Understand diffraction principles',
                    'Learn to solve standing wave problems',
                  ]}
                />
                <TopicCard
                  title="Optics & Light"
                  weight="15–20% of papers"
                  chips={['Reflection', 'Refraction', 'Lenses', 'Optical Instruments']}
                  points={[
                    'Master ray diagram construction',
                    'Practice lens equation applications',
                    'Understand optical instrument principles',
                    'Learn to solve complex optics problems',
                  ]}
                />
              </div>
            </section>

            <section id="electromagnetism" className="scroll-mt-24">
              <SectionHeading icon={Zap}>Electricity & Magnetism Mastery Guide</SectionHeading>
              <div className="space-y-4">
                <TopicCard
                  title="Electric Fields & Potential"
                  weight="15–20% of papers"
                  chips={['Coulomb’s Law', 'Electric Fields', 'Potential Difference', 'Capacitance']}
                  points={[
                    'Master field line representation',
                    'Practice potential calculations',
                    'Understand capacitor principles',
                    'Learn to solve complex field problems',
                  ]}
                />
                <TopicCard
                  title="Magnetic Fields & Induction"
                  weight="15–20% of papers"
                  chips={['Magnetic Fields', 'Electromagnetic Induction', 'AC Circuits']}
                  points={[
                    'Master magnetic field calculations',
                    'Practice induction problems',
                    'Understand AC circuit principles',
                    'Learn to solve transformer problems',
                  ]}
                />
              </div>
            </section>

            <section id="modern" className="scroll-mt-24">
              <SectionHeading icon={Atom}>Modern Physics Mastery Guide</SectionHeading>
              <div className="space-y-4">
                <TopicCard
                  title="Quantum Physics"
                  weight="10–15% of papers"
                  chips={['Wave-Particle Duality', 'Photoelectric Effect', 'Atomic Structure']}
                  points={[
                    'Master quantum calculations',
                    'Practice photoelectric effect problems',
                    'Understand atomic energy levels',
                    'Learn to solve quantum mechanics problems',
                  ]}
                />
                <TopicCard
                  title="Nuclear Physics"
                  weight="10–15% of papers"
                  chips={['Nuclear Decay', 'Mass-Energy Equivalence', 'Nuclear Reactions']}
                  points={[
                    'Master decay calculations',
                    'Practice mass-energy problems',
                    'Understand nuclear reactions',
                    'Learn to solve nuclear physics problems',
                  ]}
                />
              </div>
            </section>

            <section id="study-techniques" className="scroll-mt-24">
              <SectionHeading icon={Brain}>H2 Physics Study Techniques That Work</SectionHeading>
              <GuideCard>
                <h4 className="font-semibold text-gray-900 mb-3">Proven H2 Physics Study Methods</h4>
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
              <SectionHeading icon={Target}>A Level H2 Physics Exam Strategies</SectionHeading>
              <div className="space-y-4">
                <GuideCard>
                  <h4 className="font-semibold text-gray-900 mb-2">Paper 1 (MCQ) Strategy</h4>
                  <ul className="list-disc ml-5 space-y-1 text-sm text-gray-700">
                    <li>Allocate 2 minutes per question maximum</li>
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
                  <h4 className="font-semibold text-gray-900 mb-2">Paper 3 (Free Response) Strategy</h4>
                  <ul className="list-disc ml-5 space-y-1 text-sm text-gray-700">
                    <li>Plan your answers before writing &mdash; outline the key points</li>
                    <li>Use scientific language and terminology accurately</li>
                    <li>Support explanations with relevant physics principles</li>
                    <li>Structure long answers with clear paragraphs</li>
                    <li>Leave time to review and check calculations</li>
                  </ul>
                </GuideCard>
              </div>
            </section>

            <section id="mistakes" className="scroll-mt-24">
              <SectionHeading icon={TriangleAlert}>Common A Level H2 Physics Mistakes to Avoid</SectionHeading>
              <GuideCard>
                <h4 className="font-semibold text-gray-900 mb-3">Top 12 H2 Physics Pitfalls</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-sm">
                  <div>
                    <ol className="list-decimal ml-5 space-y-1 text-gray-700">
                      <li>Incorrect unit conversions</li>
                      <li>Confusing vector and scalar quantities</li>
                      <li>Missing forces in free body diagrams</li>
                      <li>Wrong significant figures in calculations</li>
                      <li>Incorrect sign conventions</li>
                      <li>Confusing potential and potential difference</li>
                    </ol>
                  </div>
                  <div>
                    <ol className="list-decimal ml-5 space-y-1 text-gray-700" start="7">
                      <li>Incorrect interpretation of graphs</li>
                      <li>Missing units in numerical answers</li>
                      <li>Confusing different types of energy</li>
                      <li>Inadequate explanation of principles</li>
                      <li>Poor time management across papers</li>
                      <li>Not showing working for multi-step problems</li>
                    </ol>
                  </div>
                </div>
              </GuideCard>
            </section>

            <section id="schedule" className="scroll-mt-24">
              <SectionHeading icon={CalendarDays}>Creating Your H2 Physics Study Schedule</SectionHeading>
              <GuideCard>
                <h4 className="font-semibold text-gray-900 mb-3">Recommended Weekly Schedule (JC2)</h4>
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
                      <li>Practise laboratory report writing</li>
                    </ul>
                  </div>
                </div>
              </GuideCard>
            </section>

            <section id="resources" className="scroll-mt-24">
              <SectionHeading icon={BookOpen}>Essential H2 Physics Resources</SectionHeading>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1.5">Recommended Textbooks</h4>
                  <ul className="list-disc ml-5 text-sm space-y-1 text-gray-700">
                    <li>Physics for Scientists and Engineers (Serway &amp; Jewett) &mdash; comprehensive coverage</li>
                    <li>University Physics (Young &amp; Freedman) &mdash; advanced physics concepts</li>
                    <li>Understanding Physics for Advanced Level (Jim Breithaupt) &mdash; A Level focused</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1.5">Practice Materials</h4>
                  <ul className="list-disc ml-5 text-sm space-y-1 text-gray-700">
                    <li>GCE A Level past papers (last 10 years minimum)</li>
                    <li>School preliminary examination papers from top JCs</li>
                    <li>Topical practice books for specific physics areas</li>
                    <li>International A Level physics papers for extra practice</li>
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
                H2 Physics emphasizes practical skills and data analysis abilities that are tested indirectly through written papers:
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

            <section id="career" className="scroll-mt-24">
              <SectionHeading icon={GraduationCap}>University and Career Pathways</SectionHeading>
              <GuideCard>
                <h4 className="font-semibold text-gray-900 mb-3">Your H2 Physics Results Open These Doors</h4>
                <div className="space-y-4 text-sm">
                  <div>
                    <strong className="text-gray-900">A-B grades in H2 Physics:</strong>
                    <ul className="list-disc ml-5 mt-1 space-y-1 text-gray-700">
                      <li>Engineering programs (Mechanical, Electrical, Civil)</li>
                      <li>Physics and Applied Physics degrees</li>
                      <li>Computer Science and Data Science</li>
                      <li>Research and development career pathways</li>
                    </ul>
                  </div>
                  <div>
                    <strong className="text-gray-900">C-D grades in H2 Physics:</strong>
                    <ul className="list-disc ml-5 mt-1 space-y-1 text-gray-700">
                      <li>Engineering Technology programs</li>
                      <li>Architecture and Design degrees</li>
                      <li>Science Education and Communication roles</li>
                      <li>Technical and laboratory positions</li>
                    </ul>
                  </div>
                </div>
              </GuideCard>
            </section>

            <section id="tuition" className="scroll-mt-24">
              <SectionHeading icon={Users}>When to Consider H2 Physics Tuition</SectionHeading>
              <p>Consider professional H2 Physics tuition if your child:</p>
              <ul className="list-disc ml-6 space-y-1 mt-3 text-gray-700">
                <li>Struggles with complex physics concepts and problem-solving</li>
                <li>Needs help connecting theoretical knowledge to practical applications</li>
                <li>Requires structured guidance for mathematical problem-solving</li>
                <li>Lacks confidence in data analysis and graph interpretation</li>
                <li>Aims for A grades to meet competitive university course requirements</li>
                <li>Benefits from personalized feedback on answer techniques</li>
              </ul>
              <GuideCard className="mt-4">
                <p className="text-sm"><strong className="text-gray-900">Choose H2 Physics tutors who:</strong> Have extensive experience with current A Level syllabi, understand common student misconceptions, can explain complex concepts clearly, provide structured practice programs, and have strong backgrounds in physics or engineering.</p>
              </GuideCard>
            </section>

            <section id="final-months" className="scroll-mt-24">
              <SectionHeading icon={Hourglass}>Final Two Months A Level Preparation</SectionHeading>
              <GuideCard>
                <h4 className="font-semibold text-gray-900 mb-3">Last 8 Weeks Strategy</h4>
                <div className="space-y-4 text-sm">
                  <div>
                    <strong className="text-gray-900">Weeks 1–3: Intensive Practice Phase</strong>
                    <ul className="list-disc ml-5 mt-1 space-y-1 text-gray-700">
                      <li>Complete 1 full set of papers (P1, P2, P3) every 2 days</li>
                      <li>Time all practice sessions according to actual exam conditions</li>
                      <li>Analyze performance patterns and identify recurring mistakes</li>
                      <li>Focus intensively on your weakest topics with targeted practice</li>
                    </ul>
                  </div>
                  <div>
                    <strong className="text-gray-900">Weeks 4–6: Consolidation Phase</strong>
                    <ul className="list-disc ml-5 mt-1 space-y-1 text-gray-700">
                      <li>Perfect your answer presentation and scientific writing style</li>
                      <li>Create final summary cards for all key formulas and concepts</li>
                      <li>Practice common exam question types with perfect timing</li>
                      <li>Review all practical procedures and data-interpretation skills</li>
                    </ul>
                  </div>
                  <div>
                    <strong className="text-gray-900">Weeks 7–8: Peak Performance Phase</strong>
                    <ul className="list-disc ml-5 mt-1 space-y-1 text-gray-700">
                      <li>Light review of core concepts &mdash; avoid learning new material</li>
                      <li>Focus on mental preparation and stress management</li>
                      <li>Maintain a regular sleep schedule and healthy habits</li>
                      <li>Do a final check of exam logistics and required materials</li>
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

            <section id="post-exam" className="scroll-mt-24">
              <SectionHeading icon={Compass}>Post-Exam Success Planning</SectionHeading>
              <p className="text-pretty">
                Regardless of how you feel after your H2 Physics exams, focus on the opportunities ahead. Strong physics knowledge opens doors to numerous exciting career paths in engineering, research, technology, and industry.
              </p>
              <GuideCard className="mt-4">
                <h4 className="font-semibold text-gray-900 mb-2">Moving Forward</h4>
                <ul className="list-disc ml-5 space-y-1 text-sm text-gray-700">
                  <li>Use the university application period to explore different engineering programs</li>
                  <li>Consider internships or research opportunities in physics-related fields</li>
                  <li>Continue developing your problem-solving and analytical skills</li>
                  <li>Remember that success in physics is about persistence, not just exam grades</li>
                </ul>
              </GuideCard>
            </section>

            <section id="conclusion" className="scroll-mt-24">
              <SectionHeading icon={Flag}>Conclusion: Your H2 Physics Success Journey</SectionHeading>
              <p className="text-pretty">
                Achieving excellence in A Level H2 Physics requires dedication, strategic preparation, and consistent practice. The comprehensive approach outlined in this guide &mdash; from understanding the syllabus structure through mastering each topic area to developing effective exam strategies &mdash; provides you with the roadmap to success.
              </p>
              <p className="mt-3 text-pretty">
                Remember that H2 Physics is not just about memorizing formulas and equations. It&rsquo;s about developing critical thinking skills, understanding the physical world around us, and preparing for exciting careers in science and technology. Every challenging problem you solve and every concept you master builds towards your future success.
              </p>
              <div className="rounded-xl border border-primary/15 bg-primary/5 p-5 sm:p-6 mt-4">
                <p className="font-semibold text-gray-900">
                  Success in H2 Physics comes from consistent daily practice, understanding rather than memorization, and maintaining confidence in your abilities. Trust your preparation, stay focused during exams, and remember that your hard work will pay off in opening doors to amazing opportunities in engineering and beyond.
                </p>
              </div>
            </section>

            {/* Conversion block */}
            <GuideCTA
              title="Find your H2 Physics tutor"
              description="Tell us your child’s level and goals. We hand-match a vetted, MOE-familiar H2 Physics tutor — usually within hours — and parents never pay an agency fee."
              buttonText="Find your H2 Physics tutor"
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
