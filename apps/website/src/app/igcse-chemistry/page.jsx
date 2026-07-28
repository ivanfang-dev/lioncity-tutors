import { MATCH_TIME } from '@/data/promises';
export const metadata = {
  title: 'IGCSE Chemistry Guide 2026: Complete Study Strategy for Singapore Students | LionCity Tutors',
  description: 'Ultimate IGCSE Chemistry preparation guide for Singapore students. Expert strategies, practical techniques, and proven tips to score A* in IGCSE Chemistry 2026.',
  keywords: [
    'IGCSE Chemistry 2026',
    'IGCSE Chemistry Singapore',
    'CIE Chemistry',
    'Edexcel Chemistry',
    'IGCSE Chemistry preparation',
    'IGCSE Chemistry study tips',
    'IGCSE Chemistry tuition Singapore',
    'Chemistry revision techniques',
    'IGCSE Chemistry syllabus'
  ],
  openGraph: {
    title: 'IGCSE Chemistry Guide 2026: Complete Study Strategy for Singapore Students',
    description: 'Comprehensive IGCSE Chemistry guide with proven strategies to help Singapore students achieve A* grades in IGCSE Chemistry.',
    url: 'https://www.lioncitytutors.com/igcse-chemistry',
    type: 'article',
  },
  alternates: {
    canonical: 'https://www.lioncitytutors.com/igcse-chemistry',
  },
};

import TableOfContents from '@/components/TableOfContents';
import {
  GuideHeader, SectionHeading, GuideCard, TopicCard, GuideTimeline, KeyTakeaways, GuideCTA, ICON_STROKE,
} from '@/components/guide';
import {
  FileText, CalendarClock, Atom, FlaskConical, Hexagon, Microscope, Brain, Target,
  TriangleAlert, CalendarDays, BookOpen, GraduationCap, Users,
  Hourglass, HeartHandshake, Compass, Flag, ListChecks,
} from 'lucide-react';

const tableOfContents = [
  { id: 'structure', label: 'Exam & assessment structure' },
  { id: 'timeline', label: '24-month study timeline' },
  { id: 'atomic', label: 'Atomic structure & bonding' },
  { id: 'reactions', label: 'Chemical reactions & equations' },
  { id: 'organic', label: 'Organic chemistry' },
  { id: 'practical', label: 'Practical skills' },
  { id: 'study-techniques', label: 'Study techniques that work' },
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
      'Master atomic structure and the periodic table',
      'Build strong foundation in chemical bonding',
      'Develop systematic approach to chemical equations',
      'Focus on understanding rather than memorization',
      'Complete all tutorial questions and practical worksheets',
    ],
  },
  {
    title: 'Year 1 Term 3–4 · Concept Integration Phase',
    points: [
      'Master acids, bases, and salts',
      'Begin organic chemistry foundation',
      'Develop analytical thinking for complex problem-solving',
      'Practice past year IGCSE questions by topic',
      'Strengthen practical skills and data analysis techniques',
    ],
  },
  {
    title: 'Year 2 Term 1–2 · Application Mastery Phase',
    points: [
      'Complete organic chemistry and industrial processes',
      'Master chemical calculations and stoichiometry',
      'Intensive practice with full IGCSE past papers',
      'Develop time management and exam techniques',
      'Focus on common exam question patterns and mark schemes',
    ],
  },
  {
    title: 'Year 2 Term 3 to Exams · Excellence Phase',
    points: [
      'Intensive revision based on Mock exam performance',
      'Daily practice with timed IGCSE standard questions',
      'Perfect answer presentation and scientific communication',
      'Final consolidation of all formulae and key concepts',
      'Mental preparation and stress management strategies',
    ],
  },
];

export default function IGCSEChemistry() {
  const whatsappMessage = `Hi LionCity Tutors! I'd like help finding an IGCSE Chemistry tutor.

Student level (e.g. Year 10 / Year 11):
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
            title="IGCSE Chemistry Guide 2026: Master Atomic Structure, Bonding & Reactions"
            author="By the LionCity Tutors Chemistry Team"
            meta="Updated June 14, 2026 · 18 min read"
            imageSrc="/chemistry.webp"
            imageAlt="Laboratory glassware and reagents — the hands-on craft at the heart of IGCSE Chemistry."
          />

          <article className="space-y-12 text-gray-700 leading-relaxed">
            <p className="text-lg text-gray-800 leading-relaxed text-pretty">
              IGCSE Chemistry is one of the most fundamental and rewarding subjects in the International General Certificate of Secondary Education curriculum. With its comprehensive coverage of atomic structure, chemical bonding, and reactions, IGCSE Chemistry demands both theoretical understanding and practical application skills. This detailed guide provides proven strategies for achieving A* grades in IGCSE Chemistry 2026.
            </p>

            {/* Key takeaways */}
            <KeyTakeaways
              items={[
                <>IGCSE Chemistry is offered by Cambridge (CIE) and Edexcel &mdash; both split roughly <span className="tabular-nums">60%</span> theory and <span className="tabular-nums">40%</span> practical.</>,
                <>A steady two-year timeline built on understanding beats last-minute memorisation every time.</>,
                <>The biggest score lever isn&rsquo;t knowing more &mdash; it&rsquo;s answer technique: balanced equations with state symbols, correct units and clear diagrams.</>,
                <>Struggling with calculations, bonding or data-analysis questions is the usual signal that targeted tuition will help.</>,
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
              <SectionHeading icon={FileText}>Understanding IGCSE Chemistry Structure</SectionHeading>
              <p className="text-pretty">
                The IGCSE Chemistry course is designed to develop students&rsquo; understanding of the fundamental principles of chemistry and their application to real-world situations. The course is available through two main examination boards: Cambridge (CIE) and Edexcel.
              </p>
              <GuideCard className="mt-4">
                <h4 className="font-semibold text-gray-900 mb-4">IGCSE Chemistry Assessment Breakdown</h4>
                <div className="space-y-5">
                  <div>
                    <h5 className="font-semibold text-gray-900">Cambridge (CIE) Assessment</h5>
                    <ul className="list-disc ml-5 mt-1.5 space-y-1 text-sm text-gray-700">
                      <li>Paper 2/4: Theory (60%)</li>
                      <li>Paper 5/6: Practical (40%)</li>
                      <li>Core and Extended options available</li>
                      <li>Separate practical assessment</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-900">Edexcel Assessment</h5>
                    <ul className="list-disc ml-5 mt-1.5 space-y-1 text-sm text-gray-700">
                      <li>Paper 1: Theory (60%)</li>
                      <li>Paper 2: Practical (40%)</li>
                      <li>Foundation and Higher tiers</li>
                      <li>Integrated practical assessment</li>
                    </ul>
                  </div>
                </div>
              </GuideCard>
            </section>

            <section id="timeline" className="scroll-mt-24">
              <SectionHeading icon={CalendarClock}>24-Month IGCSE Chemistry Preparation Timeline</SectionHeading>
              <GuideTimeline items={timeline} />
            </section>

            <section id="atomic" className="scroll-mt-24">
              <SectionHeading icon={Atom}>Atomic Structure & Bonding Mastery Guide</SectionHeading>
              <div className="space-y-4">
                <TopicCard
                  title="Atomic Structure"
                  weight="15–20% of papers"
                  chips={['Atomic Models', 'Electronic Configuration', 'Isotopes', 'Radioactivity']}
                  points={[
                    'Master atomic structure diagrams',
                    'Practice electronic configuration',
                    'Understand isotope calculations',
                    'Learn to solve radioactivity problems',
                  ]}
                />
                <TopicCard
                  title="Chemical Bonding"
                  weight="20–25% of papers"
                  chips={['Ionic Bonding', 'Covalent Bonding', 'Metallic Bonding', 'Intermolecular Forces']}
                  points={[
                    'Master dot-and-cross diagrams',
                    'Practice bond type identification',
                    'Understand bonding properties',
                    'Learn to predict molecular shapes',
                  ]}
                />
              </div>
            </section>

            <section id="reactions" className="scroll-mt-24">
              <SectionHeading icon={FlaskConical}>Chemical Reactions & Equations Mastery Guide</SectionHeading>
              <div className="space-y-4">
                <TopicCard
                  title="Types of Reactions"
                  weight="15–20% of papers"
                  chips={['Synthesis', 'Decomposition', 'Displacement', 'Redox Reactions']}
                  points={[
                    'Master reaction type identification',
                    'Practice balancing equations',
                    'Understand redox principles',
                    'Learn to predict reaction products',
                  ]}
                />
                <TopicCard
                  title="Acids, Bases & Salts"
                  weight="15–20% of papers"
                  chips={['pH Scale', 'Neutralization', 'Salt Preparation', 'Titration']}
                  points={[
                    'Master pH calculations',
                    'Practice titration problems',
                    'Understand salt preparation methods',
                    'Learn to solve acid-base problems',
                  ]}
                />
              </div>
            </section>

            <section id="organic" className="scroll-mt-24">
              <SectionHeading icon={Hexagon}>Organic Chemistry Mastery Guide</SectionHeading>
              <div className="space-y-4">
                <TopicCard
                  title="Basic Organic Chemistry"
                  weight="15–20% of papers"
                  chips={['Alkanes', 'Alkenes', 'Alcohols', 'Carboxylic Acids']}
                  points={[
                    'Master organic naming',
                    'Practice structural formulas',
                    'Understand functional groups',
                    'Learn to solve organic problems',
                  ]}
                />
                <TopicCard
                  title="Industrial Chemistry"
                  weight="10–15% of papers"
                  chips={['Haber Process', 'Contact Process', 'Extraction of Metals']}
                  points={[
                    'Master industrial processes',
                    'Practice process calculations',
                    'Understand environmental impact',
                    'Learn to solve industrial problems',
                  ]}
                />
              </div>
            </section>

            <section id="practical" className="scroll-mt-24">
              <SectionHeading icon={Microscope}>Practical Skills Mastery Guide</SectionHeading>
              <div className="space-y-4">
                <TopicCard
                  title="Laboratory Techniques"
                  weight="20–25% of papers"
                  chips={['Safety Procedures', 'Apparatus Use', 'Measurements', 'Observations']}
                  points={[
                    'Master safety protocols',
                    'Practice apparatus identification',
                    'Understand measurement techniques',
                    'Learn to record observations',
                  ]}
                />
                <TopicCard
                  title="Data Analysis"
                  weight="15–20% of papers"
                  chips={['Graphs', 'Calculations', 'Error Analysis', 'Conclusions']}
                  points={[
                    'Master graph plotting',
                    'Practice data calculations',
                    'Understand error analysis',
                    'Learn to draw conclusions',
                  ]}
                />
              </div>
            </section>

            <section id="study-techniques" className="scroll-mt-24">
              <SectionHeading icon={Brain}>IGCSE Chemistry Study Techniques That Work</SectionHeading>
              <GuideCard>
                <h4 className="font-semibold text-gray-900 mb-3">Proven IGCSE Chemistry Study Methods</h4>
                <div className="space-y-3 text-sm">
                  <div>
                    <p><strong className="text-gray-900">The Problem-Solving Method:</strong></p>
                    <p>Practice solving 5 different types of chemistry problems daily, focusing on systematic approaches and mathematical accuracy.</p>
                  </div>
                  <div>
                    <p><strong className="text-gray-900">Concept Mapping Technique:</strong></p>
                    <p>Create visual connections between different chemistry topics to see the bigger picture and relationships.</p>
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
              <SectionHeading icon={Target}>IGCSE Chemistry Exam Strategies</SectionHeading>
              <div className="space-y-4">
                <GuideCard>
                  <h4 className="font-semibold text-gray-900 mb-2">Theory Paper Strategy</h4>
                  <ul className="list-disc ml-5 space-y-1 text-sm text-gray-700">
                    <li>Read all questions first and start with your strongest topics</li>
                    <li>Show all working clearly &mdash; partial credit is available</li>
                    <li>Use proper units and significant figures</li>
                    <li>Draw clear diagrams with proper labels</li>
                    <li>Check calculations and units in your final answers</li>
                  </ul>
                </GuideCard>

                <GuideCard>
                  <h4 className="font-semibold text-gray-900 mb-2">Practical Paper Strategy</h4>
                  <ul className="list-disc ml-5 space-y-1 text-sm text-gray-700">
                    <li>Read instructions carefully before starting</li>
                    <li>Record all observations immediately</li>
                    <li>Use proper safety procedures</li>
                    <li>Draw clear diagrams with proper labels</li>
                    <li>Check calculations and units in your final answers</li>
                  </ul>
                </GuideCard>
              </div>
            </section>

            <section id="mistakes" className="scroll-mt-24">
              <SectionHeading icon={TriangleAlert}>Common IGCSE Chemistry Mistakes to Avoid</SectionHeading>
              <GuideCard>
                <h4 className="font-semibold text-gray-900 mb-3">Top 12 IGCSE Chemistry Pitfalls</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-sm">
                  <div>
                    <ol className="list-decimal ml-5 space-y-1 text-gray-700">
                      <li>Incorrect unit conversions</li>
                      <li>Confusing ionic and covalent bonding</li>
                      <li>Missing state symbols in equations</li>
                      <li>Wrong significant figures in calculations</li>
                      <li>Incorrect pH scale understanding</li>
                      <li>Confusing exothermic and endothermic</li>
                    </ol>
                  </div>
                  <div>
                    <ol className="list-decimal ml-5 space-y-1 text-gray-700" start="7">
                      <li>Incorrect interpretation of graphs</li>
                      <li>Missing units in numerical answers</li>
                      <li>Confusing different types of reactions</li>
                      <li>Inadequate explanation of principles</li>
                      <li>Poor time management across papers</li>
                      <li>Not showing working for multi-step problems</li>
                    </ol>
                  </div>
                </div>
              </GuideCard>
            </section>

            <section id="schedule" className="scroll-mt-24">
              <SectionHeading icon={CalendarDays}>Creating Your IGCSE Chemistry Study Schedule</SectionHeading>
              <GuideCard>
                <h4 className="font-semibold text-gray-900 mb-3">Recommended Weekly Schedule (Year 2)</h4>
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
                      <li>Work on practical skills</li>
                    </ul>
                  </div>
                </div>
              </GuideCard>
            </section>

            <section id="resources" className="scroll-mt-24">
              <SectionHeading icon={BookOpen}>Essential IGCSE Chemistry Resources</SectionHeading>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1.5">Recommended Textbooks</h4>
                  <ul className="list-disc ml-5 text-sm space-y-1 text-gray-700">
                    <li>IGCSE Chemistry Course Book (Cambridge) &mdash; comprehensive coverage</li>
                    <li>IGCSE Chemistry Student Book (Edexcel) &mdash; detailed explanations</li>
                    <li>IGCSE Chemistry Study Guide (Oxford) &mdash; exam-focused content</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1.5">Practice Materials</h4>
                  <ul className="list-disc ml-5 text-sm space-y-1 text-gray-700">
                    <li>IGCSE past papers (last 5 years minimum)</li>
                    <li>School mock examination papers</li>
                    <li>Topical practice books for specific chemistry areas</li>
                    <li>IGCSE Question Bank for targeted practice</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1.5">Digital Tools</h4>
                  <ul className="list-disc ml-5 text-sm space-y-1 text-gray-700">
                    <li>Chemistry simulations for visualizing concepts</li>
                    <li>Chemistry problem-solving apps</li>
                    <li>Online chemistry calculators</li>
                    <li>Anki for memorizing formulas and concepts</li>
                  </ul>
                </div>
              </div>
            </section>

            <section id="career" className="scroll-mt-24">
              <SectionHeading icon={GraduationCap}>University and Career Pathways</SectionHeading>
              <GuideCard>
                <h4 className="font-semibold text-gray-900 mb-3">Your IGCSE Chemistry Results Open These Doors</h4>
                <div className="space-y-4 text-sm">
                  <div>
                    <strong className="text-gray-900">A*-A grades in IGCSE Chemistry:</strong>
                    <ul className="list-disc ml-5 mt-1 space-y-1 text-gray-700">
                      <li>Chemistry and Chemical Engineering degrees</li>
                      <li>Medicine and Pharmacy programs</li>
                      <li>Materials Science and Engineering</li>
                      <li>Research and development career pathways</li>
                    </ul>
                  </div>
                  <div>
                    <strong className="text-gray-900">B-C grades in IGCSE Chemistry:</strong>
                    <ul className="list-disc ml-5 mt-1 space-y-1 text-gray-700">
                      <li>Chemical Technology programs</li>
                      <li>Laboratory Science degrees</li>
                      <li>Science Education and Communication roles</li>
                      <li>Technical and laboratory positions</li>
                    </ul>
                  </div>
                </div>
              </GuideCard>
            </section>

            <section id="tuition" className="scroll-mt-24">
              <SectionHeading icon={Users}>When to Consider IGCSE Chemistry Tuition</SectionHeading>
              <p>Consider professional IGCSE Chemistry tuition if your child:</p>
              <ul className="list-disc ml-6 space-y-1 mt-3 text-gray-700">
                <li>Struggles with complex chemistry concepts and problem-solving</li>
                <li>Needs help connecting theoretical knowledge to practical applications</li>
                <li>Requires structured guidance for mathematical problem-solving</li>
                <li>Lacks confidence in data analysis and graph interpretation</li>
                <li>Aims for A* grades to meet competitive university course requirements</li>
                <li>Benefits from personalized feedback on answer techniques</li>
              </ul>
              <GuideCard className="mt-4">
                <p className="text-sm"><strong className="text-gray-900">Choose IGCSE Chemistry tutors who:</strong> Have extensive experience with the IGCSE syllabus, understand common student misconceptions, can explain complex concepts clearly, provide structured practice programs, and have strong backgrounds in chemistry or related fields.</p>
              </GuideCard>
            </section>

            <section id="final-months" className="scroll-mt-24">
              <SectionHeading icon={Hourglass}>Final Two Months IGCSE Preparation</SectionHeading>
              <GuideCard>
                <h4 className="font-semibold text-gray-900 mb-3">Last 8 Weeks Strategy</h4>
                <div className="space-y-4 text-sm">
                  <div>
                    <strong className="text-gray-900">Weeks 1–3: Intensive Practice Phase</strong>
                    <ul className="list-disc ml-5 mt-1 space-y-1 text-gray-700">
                      <li>Complete 1 full set of papers every 2 days</li>
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
                Regardless of how you feel after your IGCSE Chemistry exams, focus on the opportunities ahead. Strong chemistry knowledge opens doors to numerous exciting career paths in science, engineering, medicine, and industry.
              </p>
              <GuideCard className="mt-4">
                <h4 className="font-semibold text-gray-900 mb-2">Moving Forward</h4>
                <ul className="list-disc ml-5 space-y-1 text-sm text-gray-700">
                  <li>Use the post-exam period to explore different science pathways</li>
                  <li>Consider work experience or projects in chemistry-related fields</li>
                  <li>Continue developing your problem-solving and analytical skills</li>
                  <li>Remember that success in chemistry is about persistence, not just exam grades</li>
                </ul>
              </GuideCard>
            </section>

            <section id="conclusion" className="scroll-mt-24">
              <SectionHeading icon={Flag}>Conclusion: Your IGCSE Chemistry Success Journey</SectionHeading>
              <p className="text-pretty">
                Achieving excellence in IGCSE Chemistry requires dedication, strategic preparation, and consistent practice. The comprehensive approach outlined in this guide &mdash; from understanding the syllabus structure through mastering each topic area to developing effective exam strategies &mdash; provides you with the roadmap to success.
              </p>
              <p className="mt-3 text-pretty">
                Remember that IGCSE Chemistry is not just about memorizing formulas and equations. It&rsquo;s about developing critical thinking skills, understanding the chemical world around us, and preparing for exciting further studies in science and technology. Every challenging problem you solve and every concept you master builds towards your future success.
              </p>
              <div className="rounded-xl border border-primary/15 bg-primary/5 p-5 sm:p-6 mt-4">
                <p className="font-semibold text-gray-900">
                  Success in IGCSE Chemistry comes from consistent daily practice, understanding rather than memorization, and maintaining confidence in your abilities. Trust your preparation, stay focused during exams, and remember that your hard work will pay off in opening doors to amazing opportunities in science and beyond.
                </p>
              </div>
            </section>

            {/* Conversion block */}
            <GuideCTA
              title="Find your IGCSE Chemistry tutor"
              description={`Tell us your child’s level and goals. We hand-match a vetted, MOE-familiar IGCSE Chemistry tutor — usually within ${MATCH_TIME} — and parents never pay an agency fee.`}
              buttonText="Find your IGCSE Chemistry tutor"
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
