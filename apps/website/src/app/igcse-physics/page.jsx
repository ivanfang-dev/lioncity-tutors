import { MATCH_TIME } from '@/data/promises';
import GuideSchema from '@/components/seo/GuideSchema';
export const metadata = {
  title: 'IGCSE Physics Guide 2026: Core, Extended & Practical',
  description: 'Ultimate IGCSE Physics preparation guide for Singapore students. Expert strategies, practical techniques, and proven tips to score A* in IGCSE Physics 2026.',
  keywords: [
    'IGCSE Physics 2026',
    'IGCSE Physics Singapore',
    'Cambridge IGCSE Physics guide',
    'IGCSE Physics preparation',
    'IGCSE Physics study tips',
    'IGCSE Physics tuition Singapore',
    'Physics revision techniques',
    'IGCSE Physics syllabus'
  ],
  openGraph: {
    images: [DEFAULT_OG_IMAGE],
    title: 'IGCSE Physics Guide 2026: Complete Study Strategy for Singapore Students',
    description: 'Comprehensive IGCSE Physics guide with proven strategies to help Singapore students achieve A* grades in Cambridge IGCSE Physics.',
    url: 'https://www.lioncitytutors.com/igcse-physics',
    type: 'article',
  },
  alternates: {
    canonical: 'https://www.lioncitytutors.com/igcse-physics',
  },
};

import TableOfContents from '@/components/TableOfContents';
import { DEFAULT_OG_IMAGE } from '@/lib/seo/openGraph';
import {
  GuideHeader, SectionHeading, GuideCard, TopicCard, GuideTimeline, KeyTakeaways, GuideCTA, ICON_STROKE,
  RelatedGuides,
} from '@/components/guide';
import {
  FileText, CalendarClock, Gauge, Waves, Zap, Brain, Target,
  TriangleAlert, CalendarDays, BookOpen, Ruler, GraduationCap, Users,
  Hourglass, HeartHandshake, Flag, ListChecks,
} from 'lucide-react';

const tableOfContents = [
  { id: 'structure', label: 'Exam & assessment structure' },
  { id: 'timeline', label: '12-month study timeline' },
  { id: 'mechanics', label: 'Mechanics' },
  { id: 'waves', label: 'Waves & sound' },
  { id: 'electromagnetism', label: 'Electricity & magnetism' },
  { id: 'study-techniques', label: 'Study techniques that work' },
  { id: 'exam-strategies', label: 'Paper-by-paper exam strategy' },
  { id: 'mistakes', label: 'Common mistakes to avoid' },
  { id: 'schedule', label: 'Weekly study schedule' },
  { id: 'resources', label: 'Essential resources' },
  { id: 'practical', label: 'Practical skills' },
  { id: 'pathways', label: 'Future pathways' },
  { id: 'tuition', label: 'When to consider tuition' },
  { id: 'final-months', label: 'Final two months' },
  { id: 'exam-day', label: 'Mental prep & exam day' },
  { id: 'conclusion', label: 'Conclusion' },
];

const timeline = [
  {
    title: 'Year 1 Term 1–2 · Foundation Building Phase',
    points: [
      'Master basic mechanics and motion',
      'Build foundation in measurement and units',
      'Develop systematic approach to problem-solving',
      'Focus on understanding basic concepts',
      'Complete all practical worksheets',
    ],
  },
  {
    title: 'Term 3–4 · Concept Integration Phase',
    points: [
      'Master waves and sound',
      'Begin electricity and magnetism',
      'Develop analytical thinking',
      'Practice past year IGCSE questions',
      'Strengthen practical skills',
    ],
  },
  {
    title: 'Term 5–6 · Application Mastery Phase',
    points: [
      'Complete modern physics topics',
      'Master electromagnetic concepts',
      'Intensive practice with past papers',
      'Develop time management skills',
      'Focus on common exam patterns',
    ],
  },
  {
    title: 'Term 7 to Exams · Excellence Phase',
    points: [
      'Intensive revision based on mock exams',
      'Daily practice with timed questions',
      'Perfect answer presentation',
      'Final consolidation of key concepts',
      'Mental preparation strategies',
    ],
  },
];

export default function IGCSEPhysics() {
  const whatsappMessage = `Hi LionCity Tutors! I'd like help finding an IGCSE Physics tutor.

Student level (e.g. Year 10 / Year 11):
Current grade:
Location:
Preferred days & timing: `;
  const whatsappHref = `https://wa.me/6588701152?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <>
      <GuideSchema
        slug="igcse-physics"
        course={{
          name: 'IGCSE Physics Tuition',
          description:
            'Cambridge IGCSE Physics tuition in Singapore, covering the core and extended syllabus and the practical paper.',
          educationalLevel: 'Cambridge IGCSE',
        }}
      />
    <main className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16">
      <div className="mx-auto max-w-2xl lg:max-w-none lg:grid lg:grid-cols-[minmax(0,42rem)_15rem] lg:justify-center lg:gap-12">
        {/* Article column */}
        <div>
          <GuideHeader
            title="IGCSE Physics Guide 2026: Master Mechanics, Waves & Modern Physics"
            author="By the LionCity Tutors Physics Team"
            meta="Updated June 15, 2026 · 18 min read"
            imageSrc="/physics.webp"
            imageAlt="Trails of light in motion — the mechanics, waves and electricity at the heart of IGCSE Physics."
          />

          <article className="space-y-12 text-gray-700 leading-relaxed">
            <p className="text-lg text-gray-800 leading-relaxed text-pretty">
              IGCSE Physics is a fundamental subject that builds the foundation for advanced physics studies. With its comprehensive coverage of mechanics, waves, electricity, and modern physics, IGCSE Physics develops both theoretical understanding and practical skills. This detailed guide provides proven strategies for achieving A* grades in IGCSE Physics 2026.
            </p>

            {/* Key takeaways */}
            <KeyTakeaways
              items={[
                <>Cambridge IGCSE Physics (0625) is three papers &mdash; MCQ (<span className="tabular-nums">30%</span>), theory (<span className="tabular-nums">50%</span>) and practical (<span className="tabular-nums">20%</span>).</>,
                <>A steady two-year timeline built on understanding beats last-minute memorisation every time.</>,
                <>The biggest score lever isn&rsquo;t knowing more &mdash; it&rsquo;s answer technique: correct units, shown working and clear diagrams.</>,
                <>Struggling with calculations, circuits or practical/data questions is the usual signal that targeted tuition will help.</>,
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
              <SectionHeading icon={FileText}>Understanding IGCSE Physics Structure</SectionHeading>
              <p className="text-pretty">
                Cambridge IGCSE Physics (0625) is designed to develop students&rsquo; understanding of basic physics principles and their application to everyday situations. The course emphasizes practical skills and scientific thinking.
              </p>
              <GuideCard className="mt-4">
                <h4 className="font-semibold text-gray-900 mb-4">IGCSE Physics Assessment Breakdown</h4>
                <div className="space-y-5">
                  <div>
                    <h5 className="font-semibold text-gray-900">Paper 1: Multiple Choice</h5>
                    <ul className="list-disc ml-5 mt-1.5 space-y-1 text-sm text-gray-700">
                      <li>40 questions worth 40 marks</li>
                      <li>Duration: 45 minutes</li>
                      <li>30% of total IGCSE Physics grade</li>
                      <li>Tests basic understanding across all topics</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-900">Paper 2: Theory</h5>
                    <ul className="list-disc ml-5 mt-1.5 space-y-1 text-sm text-gray-700">
                      <li>Short-answer and structured questions</li>
                      <li>Duration: 1 hour 15 minutes</li>
                      <li>50% of total IGCSE Physics grade</li>
                      <li>Focuses on application and problem-solving</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-900">Paper 3: Practical</h5>
                    <ul className="list-disc ml-5 mt-1.5 space-y-1 text-sm text-gray-700">
                      <li>Laboratory-based questions</li>
                      <li>Duration: 1 hour</li>
                      <li>20% of total IGCSE Physics grade</li>
                      <li>Tests practical skills and data analysis</li>
                    </ul>
                  </div>
                </div>
              </GuideCard>
            </section>

            <section id="timeline" className="scroll-mt-24">
              <SectionHeading icon={CalendarClock}>12-Month IGCSE Physics Preparation Timeline</SectionHeading>
              <GuideTimeline items={timeline} />
            </section>

            <section id="mechanics" className="scroll-mt-24">
              <SectionHeading icon={Gauge}>Mechanics Mastery Guide</SectionHeading>
              <div className="space-y-4">
                <TopicCard
                  title="Motion & Forces"
                  weight="25–30% of papers"
                  chips={['Speed', 'Velocity', 'Acceleration', 'Forces', 'Newton’s Laws']}
                  points={[
                    'Master motion graph interpretation',
                    'Practice force diagrams',
                    'Understand Newton’s laws',
                    'Learn to solve motion problems',
                  ]}
                />
                <TopicCard
                  title="Energy & Work"
                  weight="15–20% of papers"
                  chips={['Kinetic Energy', 'Potential Energy', 'Work Done', 'Power']}
                  points={[
                    'Master energy calculations',
                    'Practice work done problems',
                    'Understand energy conservation',
                    'Learn to solve power problems',
                  ]}
                />
              </div>
            </section>

            <section id="waves" className="scroll-mt-24">
              <SectionHeading icon={Waves}>Waves & Sound Mastery Guide</SectionHeading>
              <div className="space-y-4">
                <TopicCard
                  title="Wave Properties"
                  weight="15–20% of papers"
                  chips={['Wave Characteristics', 'Sound Waves', 'Light Waves']}
                  points={[
                    'Master wave equation applications',
                    'Practice sound wave problems',
                    'Understand wave properties',
                    'Learn to solve wave problems',
                  ]}
                />
                <TopicCard
                  title="Light & Optics"
                  weight="15–20% of papers"
                  chips={['Reflection', 'Refraction', 'Lenses', 'Optical Instruments']}
                  points={[
                    'Master ray diagram construction',
                    'Practice lens equation applications',
                    'Understand optical principles',
                    'Learn to solve optics problems',
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
                  chips={['Current', 'Voltage', 'Resistance', 'Circuit Analysis']}
                  points={[
                    'Master circuit analysis',
                    'Practice Ohm’s law problems',
                    'Understand circuit principles',
                    'Learn to solve circuit problems',
                  ]}
                />
                <TopicCard
                  title="Magnetism"
                  weight="10–15% of papers"
                  chips={['Magnetic Fields', 'Electromagnetism', 'Motors']}
                  points={[
                    'Master magnetic field concepts',
                    'Practice electromagnetism problems',
                    'Understand motor principles',
                    'Learn to solve magnetism problems',
                  ]}
                />
              </div>
            </section>

            <section id="study-techniques" className="scroll-mt-24">
              <SectionHeading icon={Brain}>IGCSE Physics Study Techniques</SectionHeading>
              <GuideCard>
                <h4 className="font-semibold text-gray-900 mb-3">Proven Study Methods</h4>
                <div className="space-y-3 text-sm">
                  <div>
                    <p><strong className="text-gray-900">The Problem-Solving Method:</strong></p>
                    <p>Practice solving 3–4 different types of physics problems daily, focusing on basic concepts and calculations.</p>
                  </div>
                  <div>
                    <p><strong className="text-gray-900">Concept Mapping Technique:</strong></p>
                    <p>Create visual connections between different physics topics to understand relationships.</p>
                  </div>
                  <div>
                    <p><strong className="text-gray-900">Formula Practice:</strong></p>
                    <p>Understand basic equations and when to apply them.</p>
                  </div>
                  <div>
                    <p><strong className="text-gray-900">Real-World Connection Method:</strong></p>
                    <p>Connect theoretical concepts to everyday applications.</p>
                  </div>
                </div>
              </GuideCard>
            </section>

            <section id="exam-strategies" className="scroll-mt-24">
              <SectionHeading icon={Target}>IGCSE Physics Exam Strategies</SectionHeading>
              <div className="space-y-4">
                <GuideCard>
                  <h4 className="font-semibold text-gray-900 mb-2">Paper 1 (MCQ) Strategy</h4>
                  <ul className="list-disc ml-5 space-y-1 text-sm text-gray-700">
                    <li>Allocate 1 minute per question</li>
                    <li>Use the elimination method</li>
                    <li>Check units and calculations</li>
                    <li>Review flagged questions</li>
                  </ul>
                </GuideCard>

                <GuideCard>
                  <h4 className="font-semibold text-gray-900 mb-2">Paper 2 (Theory) Strategy</h4>
                  <ul className="list-disc ml-5 space-y-1 text-sm text-gray-700">
                    <li>Read questions carefully</li>
                    <li>Show all working clearly</li>
                    <li>Use proper units</li>
                    <li>Draw clear diagrams</li>
                    <li>Check calculations</li>
                  </ul>
                </GuideCard>

                <GuideCard>
                  <h4 className="font-semibold text-gray-900 mb-2">Paper 3 (Practical) Strategy</h4>
                  <ul className="list-disc ml-5 space-y-1 text-sm text-gray-700">
                    <li>Read instructions carefully</li>
                    <li>Record measurements accurately</li>
                    <li>Draw clear graphs</li>
                    <li>Show all calculations</li>
                    <li>Check units and significant figures</li>
                  </ul>
                </GuideCard>
              </div>
            </section>

            <section id="mistakes" className="scroll-mt-24">
              <SectionHeading icon={TriangleAlert}>Common IGCSE Physics Mistakes to Avoid</SectionHeading>
              <GuideCard>
                <h4 className="font-semibold text-gray-900 mb-3">Top 10 IGCSE Physics Pitfalls</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-sm">
                  <div>
                    <ol className="list-decimal ml-5 space-y-1 text-gray-700">
                      <li>Incorrect unit conversions</li>
                      <li>Missing units in answers</li>
                      <li>Wrong significant figures</li>
                      <li>Incorrect graph plotting</li>
                      <li>Poor diagram labeling</li>
                    </ol>
                  </div>
                  <div>
                    <ol className="list-decimal ml-5 space-y-1 text-gray-700" start="6">
                      <li>Incomplete explanations</li>
                      <li>Calculation errors</li>
                      <li>Misreading questions</li>
                      <li>Poor time management</li>
                      <li>Not showing working</li>
                    </ol>
                  </div>
                </div>
              </GuideCard>
            </section>

            <section id="schedule" className="scroll-mt-24">
              <SectionHeading icon={CalendarDays}>Creating Your IGCSE Physics Study Schedule</SectionHeading>
              <GuideCard>
                <h4 className="font-semibold text-gray-900 mb-3">Recommended Weekly Schedule</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                  <div>
                    <p className="font-semibold text-gray-900 mb-1.5">School Days</p>
                    <ul className="list-disc ml-5 space-y-1 text-gray-700">
                      <li>1–2 hours of daily practice</li>
                      <li>Complete homework thoroughly</li>
                      <li>Review class notes</li>
                      <li>Practice 2–3 problems daily</li>
                      <li>Learn 1–2 new formulas each week</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 mb-1.5">Weekends</p>
                    <ul className="list-disc ml-5 space-y-1 text-gray-700">
                      <li>Complete 1 practice paper</li>
                      <li>Review weak topics</li>
                      <li>Create summary notes</li>
                      <li>Practice practical skills</li>
                    </ul>
                  </div>
                </div>
              </GuideCard>
            </section>

            <section id="resources" className="scroll-mt-24">
              <SectionHeading icon={BookOpen}>Essential IGCSE Physics Resources</SectionHeading>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1.5">Recommended Textbooks</h4>
                  <ul className="list-disc ml-5 text-sm space-y-1 text-gray-700">
                    <li>Cambridge IGCSE Physics Coursebook</li>
                    <li>IGCSE Physics Study Guide</li>
                    <li>IGCSE Physics Practice Book</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1.5">Practice Materials</h4>
                  <ul className="list-disc ml-5 text-sm space-y-1 text-gray-700">
                    <li>Cambridge IGCSE past papers</li>
                    <li>School mock examination papers</li>
                    <li>Topical practice books</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1.5">Digital Tools</h4>
                  <ul className="list-disc ml-5 text-sm space-y-1 text-gray-700">
                    <li>PhET simulations</li>
                    <li>Physics problem-solving apps</li>
                    <li>Online physics calculators</li>
                    <li>Flashcards for formulas</li>
                  </ul>
                </div>
              </div>
            </section>

            <section id="practical" className="scroll-mt-24">
              <SectionHeading icon={Ruler}>Practical Skills Development</SectionHeading>
              <p className="text-pretty">
                IGCSE Physics emphasizes practical skills that are tested in Paper 3:
              </p>
              <ul className="list-disc ml-6 space-y-2 mt-3 text-gray-700">
                <li><strong className="text-gray-900">Measurement Skills:</strong> Accurate reading of instruments</li>
                <li><strong className="text-gray-900">Data Collection:</strong> Recording measurements properly</li>
                <li><strong className="text-gray-900">Graph Plotting:</strong> Drawing and interpreting graphs</li>
                <li><strong className="text-gray-900">Safety Awareness:</strong> Following lab safety rules</li>
                <li><strong className="text-gray-900">Experimental Design:</strong> Understanding variables</li>
              </ul>
            </section>

            <section id="pathways" className="scroll-mt-24">
              <SectionHeading icon={GraduationCap}>Future Pathways</SectionHeading>
              <GuideCard>
                <h4 className="font-semibold text-gray-900 mb-3">Your IGCSE Physics Results Open These Doors</h4>
                <div className="space-y-4 text-sm">
                  <div>
                    <strong className="text-gray-900">A*-A grades in IGCSE Physics:</strong>
                    <ul className="list-disc ml-5 mt-1 space-y-1 text-gray-700">
                      <li>IBDP Physics</li>
                      <li>A Level H2 Physics</li>
                      <li>Science and Engineering streams</li>
                    </ul>
                  </div>
                  <div>
                    <strong className="text-gray-900">B-C grades in IGCSE Physics:</strong>
                    <ul className="list-disc ml-5 mt-1 space-y-1 text-gray-700">
                      <li>IBDP Physics (SL)</li>
                      <li>A Level H1 Physics</li>
                      <li>Applied Science courses</li>
                    </ul>
                  </div>
                </div>
              </GuideCard>
            </section>

            <section id="tuition" className="scroll-mt-24">
              <SectionHeading icon={Users}>When to Consider IGCSE Physics Tuition</SectionHeading>
              <p>Consider professional IGCSE Physics tuition if your child:</p>
              <ul className="list-disc ml-6 space-y-1 mt-3 text-gray-700">
                <li>Struggles with basic physics concepts</li>
                <li>Needs help with mathematical problem-solving</li>
                <li>Requires structured guidance</li>
                <li>Lacks confidence in practical work</li>
                <li>Aims for A* grades</li>
                <li>Benefits from personalized feedback</li>
              </ul>
              <GuideCard className="mt-4">
                <p className="text-sm"><strong className="text-gray-900">Choose IGCSE Physics tutors who:</strong> Have experience with the Cambridge IGCSE syllabus, understand common student misconceptions, can explain concepts clearly, provide structured practice, and have strong physics backgrounds.</p>
              </GuideCard>
            </section>

            <section id="final-months" className="scroll-mt-24">
              <SectionHeading icon={Hourglass}>Final Two Months Preparation</SectionHeading>
              <GuideCard>
                <h4 className="font-semibold text-gray-900 mb-3">Last 8 Weeks Strategy</h4>
                <div className="space-y-4 text-sm">
                  <div>
                    <strong className="text-gray-900">Weeks 1–3: Intensive Practice</strong>
                    <ul className="list-disc ml-5 mt-1 space-y-1 text-gray-700">
                      <li>Complete 1 practice paper every 3 days</li>
                      <li>Time all practice sessions</li>
                      <li>Identify weak areas</li>
                      <li>Focus on problem areas</li>
                    </ul>
                  </div>
                  <div>
                    <strong className="text-gray-900">Weeks 4–6: Consolidation</strong>
                    <ul className="list-disc ml-5 mt-1 space-y-1 text-gray-700">
                      <li>Perfect answer presentation</li>
                      <li>Create formula cards</li>
                      <li>Practice common questions</li>
                      <li>Review practical skills</li>
                    </ul>
                  </div>
                  <div>
                    <strong className="text-gray-900">Weeks 7–8: Final Preparation</strong>
                    <ul className="list-disc ml-5 mt-1 space-y-1 text-gray-700">
                      <li>Light review of concepts</li>
                      <li>Focus on mental preparation</li>
                      <li>Maintain healthy habits</li>
                      <li>Check exam requirements</li>
                    </ul>
                  </div>
                </div>
              </GuideCard>
            </section>

            <section id="exam-day" className="scroll-mt-24">
              <SectionHeading icon={HeartHandshake}>Mental Preparation and Exam Day Success</SectionHeading>
              <div className="space-y-4">
                <GuideCard>
                  <h4 className="font-semibold text-gray-900 mb-2">Stress Management</h4>
                  <ul className="list-disc ml-5 space-y-1 text-sm text-gray-700">
                    <li>Practice deep breathing</li>
                    <li>Use positive visualization</li>
                    <li>Maintain perspective</li>
                    <li>Get adequate sleep</li>
                    <li>Stay physically active</li>
                  </ul>
                </GuideCard>

                <GuideCard>
                  <h4 className="font-semibold text-gray-900 mb-2">Exam Day Protocol</h4>
                  <ul className="list-disc ml-5 space-y-1 text-sm text-gray-700">
                    <li>Arrive early with materials</li>
                    <li>Bring necessary equipment</li>
                    <li>Read instructions carefully</li>
                    <li>Start with confident questions</li>
                    <li>Check work thoroughly</li>
                  </ul>
                </GuideCard>
              </div>
            </section>

            <section id="conclusion" className="scroll-mt-24">
              <SectionHeading icon={Flag}>Conclusion: Your IGCSE Physics Success Journey</SectionHeading>
              <p className="text-pretty">
                Achieving excellence in IGCSE Physics requires dedication, strategic preparation, and consistent practice. This guide provides you with the roadmap to success, from understanding the syllabus to mastering each topic area.
              </p>
              <p className="mt-3 text-pretty">
                Remember that IGCSE Physics is about developing scientific thinking and understanding the physical world. Every concept you master builds towards your future success in science and engineering.
              </p>
              <div className="rounded-xl border border-primary/15 bg-primary/5 p-5 sm:p-6 mt-4">
                <p className="font-semibold text-gray-900">
                  Success in IGCSE Physics comes from consistent practice, understanding concepts, and maintaining confidence. Trust your preparation, stay focused during exams, and remember that your hard work will open doors to future opportunities.
                </p>
              </div>
            </section>

            {/* Conversion block */}
            <RelatedGuides slug="igcse-physics" />

            <GuideCTA
              title="Find your IGCSE Physics tutor"
              description={`Tell us your child’s level and goals. We hand-match a vetted, MOE-familiar IGCSE Physics tutor — usually within ${MATCH_TIME} — and parents never pay an agency fee.`}
              buttonText="Find your IGCSE Physics tutor"
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
