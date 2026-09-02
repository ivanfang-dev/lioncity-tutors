import { MATCH_TIME } from '@/data/promises';
import GuideSchema from '@/components/seo/GuideSchema';
export const metadata = {
  title: 'IBDP Physics Guide 2026: HL & SL Study Strategy',
  description: 'Ultimate IBDP Physics preparation guide for Singapore students. Expert strategies, practical techniques, and proven tips to score 7 in IBDP Physics 2026.',
  keywords: [
    'IBDP Physics 2026',
    'IB Physics Singapore',
    'International Baccalaureate Physics guide',
    'IBDP Physics preparation',
    'IB Physics study tips',
    'IBDP Physics tuition Singapore',
    'Physics revision techniques',
    'IBDP Physics syllabus'
  ],
  openGraph: {
    images: [DEFAULT_OG_IMAGE],
    title: 'IBDP Physics Guide 2026: Complete Study Strategy for Singapore Students',
    description: 'Comprehensive IBDP Physics guide with proven strategies to help Singapore students achieve level 7 in IBDP Physics.',
    url: 'https://www.lioncitytutors.com/ibdp-physics',
    type: 'article',
  },
  alternates: {
    canonical: 'https://www.lioncitytutors.com/ibdp-physics',
  },
};

import TableOfContents from '@/components/TableOfContents';
import { DEFAULT_OG_IMAGE } from '@/lib/seo/openGraph';
import {
  GuideHeader, SectionHeading, GuideCard, TopicCard, GuideTimeline, KeyTakeaways, GuideCTA, ICON_STROKE,
  RelatedGuides,
} from '@/components/guide';
import {
  FileText, CalendarClock, Gauge, Waves, Zap, Atom, ClipboardList, Target,
  TriangleAlert, CalendarDays, BookOpen, GraduationCap, Users,
  Hourglass, HeartHandshake, Compass, Flag, ListChecks,
} from 'lucide-react';

const tableOfContents = [
  { id: 'structure', label: 'Exam & assessment structure' },
  { id: 'timeline', label: '24-month study timeline' },
  { id: 'mechanics', label: 'Mechanics' },
  { id: 'waves', label: 'Waves & optics' },
  { id: 'electromagnetism', label: 'Electricity & magnetism' },
  { id: 'modern', label: 'Modern physics' },
  { id: 'ia', label: 'Internal assessment (IA)' },
  { id: 'exam-strategies', label: 'Paper-by-paper exam strategy' },
  { id: 'mistakes', label: 'Common mistakes to avoid' },
  { id: 'schedule', label: 'Weekly study schedule' },
  { id: 'resources', label: 'Essential resources' },
  { id: 'career', label: 'University & career pathways' },
  { id: 'tuition', label: 'When to consider tuition' },
  { id: 'final-months', label: 'Final two months' },
  { id: 'exam-day', label: 'Mental prep & exam day' },
  { id: 'post-exam', label: 'After the exam' },
  { id: 'conclusion', label: 'Conclusion' },
];

const timeline = [
  {
    title: 'Year 1 Term 1–2 · Foundation Building Phase',
    points: [
      'Master kinematics, dynamics, and Newton’s laws',
      'Build strong foundation in vector mathematics',
      'Develop systematic approach to force analysis',
      'Focus on understanding rather than memorization',
      'Complete all tutorial questions and practical worksheets',
    ],
  },
  {
    title: 'Year 1 Term 3–4 · Concept Integration Phase',
    points: [
      'Master waves, oscillations, and wave phenomena',
      'Begin electricity and magnetism foundation',
      'Develop analytical thinking for complex problem-solving',
      'Practice past year IBDP questions by topic',
      'Strengthen practical skills and data analysis techniques',
    ],
  },
  {
    title: 'Year 2 Term 1–2 · Application Mastery Phase',
    points: [
      'Complete modern physics and quantum mechanics',
      'Master electromagnetic induction and AC circuits',
      'Intensive practice with full IBDP past papers',
      'Develop time management and exam techniques',
      'Focus on common exam question patterns and mark schemes',
    ],
  },
  {
    title: 'Year 2 Term 3 to Exams · Excellence Phase',
    points: [
      'Intensive revision based on Mock exam performance',
      'Daily practice with timed IBDP standard questions',
      'Perfect answer presentation and scientific communication',
      'Final consolidation of all formulae and key concepts',
      'Mental preparation and stress management strategies',
    ],
  },
];

export default function IBDPPhysics() {
  const whatsappMessage = `Hi LionCity Tutors! I'd like help finding an IBDP Physics tutor.

Student level (e.g. IBDP Year 1 / Year 2):
Current grade:
Location:
Preferred days & timing: `;
  const whatsappHref = `https://wa.me/6588701152?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <>
      <GuideSchema
        slug="ibdp-physics"
        course={{
          name: 'IBDP Physics Tuition',
          description:
            'IB Diploma Physics tuition in Singapore, covering HL and SL content, the internal assessment and paper technique.',
          educationalLevel: 'IB Diploma Programme',
        }}
      />
    <main className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16">
      <div className="mx-auto max-w-2xl lg:max-w-none lg:grid lg:grid-cols-[minmax(0,42rem)_15rem] lg:justify-center lg:gap-12">
        {/* Article column */}
        <div>
          <GuideHeader
            title="IBDP Physics Guide 2026: Master Mechanics, Waves & Modern Physics"
            author="By the LionCity Tutors Physics Team"
            meta="Updated June 22, 2026 · 18 min read"
            imageSrc="/physics.webp"
            imageAlt="Trails of light in motion — the mechanics, waves and modern physics at the heart of IBDP Physics."
          />

          <article className="space-y-12 text-gray-700 leading-relaxed">
            <p className="text-lg text-gray-800 leading-relaxed text-pretty">
              IBDP Physics is one of the most challenging and rewarding subjects in the International Baccalaureate Diploma Programme. With its comprehensive coverage of mechanics, waves, electricity, and modern physics, IBDP Physics demands both theoretical understanding and practical application skills. This detailed guide provides proven strategies for achieving level 7 in IBDP Physics 2026.
            </p>

            {/* Key takeaways */}
            <KeyTakeaways
              items={[
                <>IBDP Physics runs at SL and HL &mdash; <span className="tabular-nums">80%</span> exams (P1 MCQ, P2 structured, P3 data analysis) and a <span className="tabular-nums">20%</span> internal assessment.</>,
                <>A steady two-year timeline built on understanding beats last-minute memorisation every time.</>,
                <>Two marks matter most: answer technique in the papers (units, working, diagrams) and a well-designed IA investigation.</>,
                <>Struggling with problem-solving, data analysis or the IA is the usual signal that targeted tuition will help.</>,
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
              <SectionHeading icon={FileText}>Understanding IBDP Physics Structure</SectionHeading>
              <p className="text-pretty">
                The IBDP Physics course is designed to develop students&rsquo; understanding of the fundamental principles of physics and their application to real-world situations. The course is available at both Standard Level (SL) and Higher Level (HL).
              </p>
              <GuideCard className="mt-4">
                <h3 className="font-semibold text-gray-900 mb-4">IBDP Physics Assessment Breakdown</h3>
                <div className="space-y-5">
                  <div>
                    <h4 className="font-semibold text-gray-900">External Assessment (80%)</h4>
                    <ul className="list-disc ml-5 mt-1.5 space-y-1 text-sm text-gray-700">
                      <li>Paper 1: Multiple Choice (20%)</li>
                      <li>Paper 2: Structured Questions (40%)</li>
                      <li>Paper 3: Data Analysis and Extended Response (20%)</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Internal Assessment (20%)</h4>
                    <ul className="list-disc ml-5 mt-1.5 space-y-1 text-sm text-gray-700">
                      <li>Individual Scientific Investigation</li>
                      <li>10 hours of lab work</li>
                      <li>Written report of 6–12 pages</li>
                    </ul>
                  </div>
                </div>
              </GuideCard>
            </section>

            <section id="timeline" className="scroll-mt-24">
              <SectionHeading icon={CalendarClock}>24-Month IBDP Physics Preparation Timeline</SectionHeading>
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

            <section id="ia" className="scroll-mt-24">
              <SectionHeading icon={ClipboardList}>Internal Assessment (IA) Guide</SectionHeading>
              <GuideCard>
                <h3 className="font-semibold text-gray-900 mb-3">Key Components of a Successful IA</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p><strong className="text-gray-900">Research Question:</strong></p>
                    <p>Develop a clear, focused question that allows for quantitative analysis and demonstrates your understanding of physics concepts.</p>
                  </div>
                  <div>
                    <p><strong className="text-gray-900">Methodology:</strong></p>
                    <p>Design a detailed experimental procedure with appropriate controls and variables.</p>
                  </div>
                  <div>
                    <p><strong className="text-gray-900">Data Collection:</strong></p>
                    <p>Record precise measurements and observations with proper units and uncertainties.</p>
                  </div>
                  <div>
                    <p><strong className="text-gray-900">Analysis:</strong></p>
                    <p>Use appropriate statistical methods and graphical representations to analyze your data.</p>
                  </div>
                  <div>
                    <p><strong className="text-gray-900">Evaluation:</strong></p>
                    <p>Critically evaluate your methodology and suggest improvements.</p>
                  </div>
                </div>
              </GuideCard>
            </section>

            <section id="exam-strategies" className="scroll-mt-24">
              <SectionHeading icon={Target}>IBDP Physics Exam Strategies</SectionHeading>
              <div className="space-y-4">
                <GuideCard>
                  <h3 className="font-semibold text-gray-900 mb-2">Paper 1 (MCQ) Strategy</h3>
                  <ul className="list-disc ml-5 space-y-1 text-sm text-gray-700">
                    <li>Allocate 1.5 minutes per question maximum</li>
                    <li>Use the elimination method for difficult questions</li>
                    <li>Pay attention to units and significant figures</li>
                    <li>Don&rsquo;t second-guess yourself unless you find a clear error</li>
                    <li>Review flagged questions if time permits</li>
                  </ul>
                </GuideCard>

                <GuideCard>
                  <h3 className="font-semibold text-gray-900 mb-2">Paper 2 (Structured Questions) Strategy</h3>
                  <ul className="list-disc ml-5 space-y-1 text-sm text-gray-700">
                    <li>Read all questions first and start with your strongest topics</li>
                    <li>Show all working clearly &mdash; partial credit is available</li>
                    <li>Use proper units and significant figures</li>
                    <li>Draw clear diagrams with proper labels</li>
                    <li>Check calculations and units in your final answers</li>
                  </ul>
                </GuideCard>

                <GuideCard>
                  <h3 className="font-semibold text-gray-900 mb-2">Paper 3 (Data Analysis) Strategy</h3>
                  <ul className="list-disc ml-5 space-y-1 text-sm text-gray-700">
                    <li>Read the entire question before starting</li>
                    <li>Identify key data points and relationships</li>
                    <li>Use appropriate formulas and units</li>
                    <li>Show all calculations clearly</li>
                    <li>Draw conclusions based on the data</li>
                  </ul>
                </GuideCard>
              </div>
            </section>

            <section id="mistakes" className="scroll-mt-24">
              <SectionHeading icon={TriangleAlert}>Common IBDP Physics Mistakes to Avoid</SectionHeading>
              <GuideCard>
                <h3 className="font-semibold text-gray-900 mb-3">Top 12 IBDP Physics Pitfalls</h3>
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
              <SectionHeading icon={CalendarDays}>Creating Your IBDP Physics Study Schedule</SectionHeading>
              <GuideCard>
                <h3 className="font-semibold text-gray-900 mb-3">Recommended Weekly Schedule (Year 2)</h3>
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
                      <li>Work on your IA or lab report writing</li>
                    </ul>
                  </div>
                </div>
              </GuideCard>
            </section>

            <section id="resources" className="scroll-mt-24">
              <SectionHeading icon={BookOpen}>Essential IBDP Physics Resources</SectionHeading>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1.5">Recommended Textbooks</h3>
                  <ul className="list-disc ml-5 text-sm space-y-1 text-gray-700">
                    <li>IB Physics Course Book (Oxford) &mdash; comprehensive coverage</li>
                    <li>Physics for the IB Diploma (Cambridge) &mdash; detailed explanations</li>
                    <li>IB Physics Study Guide (Oxford) &mdash; exam-focused content</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1.5">Practice Materials</h3>
                  <ul className="list-disc ml-5 text-sm space-y-1 text-gray-700">
                    <li>IBDP past papers (last 5 years minimum)</li>
                    <li>School mock examination papers</li>
                    <li>Topical practice books for specific physics areas</li>
                    <li>IB Question Bank for targeted practice</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1.5">Digital Tools</h3>
                  <ul className="list-disc ml-5 text-sm space-y-1 text-gray-700">
                    <li>PhET simulations for visualizing physics concepts</li>
                    <li>Physics problem-solving apps</li>
                    <li>Online physics calculators</li>
                    <li>Anki for memorizing formulas and concepts</li>
                  </ul>
                </div>
              </div>
            </section>

            <section id="career" className="scroll-mt-24">
              <SectionHeading icon={GraduationCap}>University and Career Pathways</SectionHeading>
              <GuideCard>
                <h3 className="font-semibold text-gray-900 mb-3">Your IBDP Physics Results Open These Doors</h3>
                <div className="space-y-4 text-sm">
                  <div>
                    <strong className="text-gray-900">Level 6-7 in IBDP Physics:</strong>
                    <ul className="list-disc ml-5 mt-1 space-y-1 text-gray-700">
                      <li>Engineering programs (Mechanical, Electrical, Civil)</li>
                      <li>Physics and Applied Physics degrees</li>
                      <li>Computer Science and Data Science</li>
                      <li>Research and development career pathways</li>
                    </ul>
                  </div>
                  <div>
                    <strong className="text-gray-900">Level 4-5 in IBDP Physics:</strong>
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
              <SectionHeading icon={Users}>When to Consider IBDP Physics Tuition</SectionHeading>
              <p>Consider professional IBDP Physics tuition if your child:</p>
              <ul className="list-disc ml-6 space-y-1 mt-3 text-gray-700">
                <li>Struggles with complex physics concepts and problem-solving</li>
                <li>Needs help connecting theoretical knowledge to practical applications</li>
                <li>Requires structured guidance for mathematical problem-solving</li>
                <li>Lacks confidence in data analysis and graph interpretation</li>
                <li>Aims for level 7 to meet competitive university course requirements</li>
                <li>Benefits from personalized feedback on answer techniques</li>
              </ul>
              <GuideCard className="mt-4">
                <p className="text-sm"><strong className="text-gray-900">Choose IBDP Physics tutors who:</strong> Have extensive experience with the IBDP syllabus, understand common student misconceptions, can explain complex concepts clearly, provide structured practice programs, and have strong backgrounds in physics or engineering.</p>
              </GuideCard>
            </section>

            <section id="final-months" className="scroll-mt-24">
              <SectionHeading icon={Hourglass}>Final Two Months IBDP Preparation</SectionHeading>
              <GuideCard>
                <h3 className="font-semibold text-gray-900 mb-3">Last 8 Weeks Strategy</h3>
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
                  <h3 className="font-semibold text-gray-900 mb-2">Stress Management Techniques</h3>
                  <ul className="list-disc ml-5 space-y-1 text-sm text-gray-700">
                    <li>Practice deep breathing exercises before and during exams</li>
                    <li>Use positive visualization &mdash; imagine yourself succeeding</li>
                    <li>Maintain perspective &mdash; one exam doesn&rsquo;t define your future</li>
                    <li>Get adequate sleep (7–8 hours), especially the week before exams</li>
                    <li>Stay physically active to manage stress hormones naturally</li>
                  </ul>
                </GuideCard>

                <GuideCard>
                  <h3 className="font-semibold text-gray-900 mb-2">Exam Day Protocol</h3>
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
                Regardless of how you feel after your IBDP Physics exams, focus on the opportunities ahead. Strong physics knowledge opens doors to numerous exciting career paths in engineering, research, technology, and industry.
              </p>
              <GuideCard className="mt-4">
                <h3 className="font-semibold text-gray-900 mb-2">Moving Forward</h3>
                <ul className="list-disc ml-5 space-y-1 text-sm text-gray-700">
                  <li>Use the university application period to explore different engineering programs</li>
                  <li>Consider internships or research opportunities in physics-related fields</li>
                  <li>Continue developing your problem-solving and analytical skills</li>
                  <li>Remember that success in physics is about persistence, not just exam grades</li>
                </ul>
              </GuideCard>
            </section>

            <section id="conclusion" className="scroll-mt-24">
              <SectionHeading icon={Flag}>Conclusion: Your IBDP Physics Success Journey</SectionHeading>
              <p className="text-pretty">
                Achieving excellence in IBDP Physics requires dedication, strategic preparation, and consistent practice. The comprehensive approach outlined in this guide &mdash; from understanding the syllabus structure through mastering each topic area to developing effective exam strategies &mdash; provides you with the roadmap to success.
              </p>
              <p className="mt-3 text-pretty">
                Remember that IBDP Physics is not just about memorizing formulas and equations. It&rsquo;s about developing critical thinking skills, understanding the physical world around us, and preparing for exciting careers in science and technology. Every challenging problem you solve and every concept you master builds towards your future success.
              </p>
              <div className="rounded-xl border border-primary/15 bg-primary/5 p-5 sm:p-6 mt-4">
                <p className="font-semibold text-gray-900">
                  Success in IBDP Physics comes from consistent daily practice, understanding rather than memorization, and maintaining confidence in your abilities. Trust your preparation, stay focused during exams, and remember that your hard work will pay off in opening doors to amazing opportunities in engineering and beyond.
                </p>
              </div>
            </section>

            {/* Conversion block */}
            <RelatedGuides slug="ibdp-physics" />

            <GuideCTA
              title="Find your IBDP Physics tutor"
              description={`Tell us your child’s level and goals. We hand-match a vetted, MOE-familiar IBDP Physics tutor — usually within ${MATCH_TIME} — and parents never pay an agency fee.`}
              buttonText="Find your IBDP Physics tutor"
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
