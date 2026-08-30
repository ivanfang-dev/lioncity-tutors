import { MATCH_TIME } from '@/data/promises';
export const metadata = {
  title: 'O-Level Physics (6091): Topics, Common Mistakes & Tips',
  description: 'The 10 mistakes our tutors correct most on O-Level Physics scripts, plus paper-by-paper exam strategy, practical skills and the 2026 syllabus 6091 topics.',
  keywords: [
    'common physics mistakes O Level',
    'O Level Physics exam tips',
    'physics O Level',
    'O Level Physics 2026',
    'O Level Physics Singapore',
    'GCE O Level Physics guide',
    'O Level Physics preparation',
    'O Level Physics tuition Singapore',
  ],
  openGraph: {
    images: [DEFAULT_OG_IMAGE],
    title: 'O-Level Physics (6091): Topics, Common Mistakes & Tips',
    description: 'The 10 mistakes our tutors correct most on O-Level Physics scripts, plus paper-by-paper exam strategy, practical skills and the 2026 syllabus 6091 topics.',
    url: 'https://www.lioncitytutors.com/o-level-physics',
    type: 'article',
  },
  alternates: {
    canonical: 'https://www.lioncitytutors.com/o-level-physics',
  },
};

import TableOfContents from '@/components/TableOfContents';
import Link from 'next/link';
import GuideSchema from '@/components/seo/GuideSchema';
import {
  GuideHeader, SectionHeading, GuideCard, TopicCard, GuideTimeline, KeyTakeaways, GuideCTA, ICON_STROKE,
  RelatedGuides, ExamTimetable,
} from '@/components/guide';
import {
  FileText, CalendarClock, Gauge, Waves, Zap, Brain, Target,
  TriangleAlert, CalendarDays, BookOpen, Ruler, GraduationCap, Users,
  Hourglass, HeartHandshake, Flag, ListChecks, HelpCircle, Flame, Radiation,
} from 'lucide-react';
import { O_LEVEL_PHYSICS_FAQS } from './faqs.mjs';
import { DEFAULT_OG_IMAGE } from '@/lib/seo/openGraph';

const tableOfContents = [
  { id: 'structure', label: 'Exam & paper structure' },
  { id: 'exam-dates', label: '2026 exam timetable' },
  { id: 'timeline', label: '18-month study timeline' },
  { id: 'mechanics', label: 'Newtonian mechanics' },
  { id: 'thermal', label: 'Thermal physics' },
  { id: 'waves', label: 'Waves & light' },
  { id: 'electromagnetism', label: 'Electricity & magnetism' },
  { id: 'radioactivity', label: 'Radioactivity' },
  { id: 'study-techniques', label: 'Study techniques that work' },
  { id: 'exam-strategies', label: 'Paper-by-paper exam strategy' },
  { id: 'mistakes', label: '10 common mistakes' },
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

// The mistakes our tutors correct most often on Physics scripts. Each entry
// names the error, what it costs, and the fix — a bare list of labels gives a
// student nothing to act on.
const commonMistakes = [
  {
    mistake: 'Leaving the unit conversion undone',
    detail: 'Centimetres used where the equation expects metres, minutes where it expects seconds, grams where it expects kilograms. The physics is right and the answer is out by a factor of 100 or 1,000.',
    fix: 'Convert everything to SI units in the first line of working, before any substitution. Write the converted values down rather than doing it in your head.',
  },
  {
    mistake: 'Omitting units from the final answer',
    detail: 'A numerically correct answer with no unit is an incomplete answer, and it costs marks on a question the student got right.',
    fix: 'Write the unit on every line of working, not just the last one. A wrong conversion then shows up before it reaches the answer.',
  },
  {
    mistake: 'Knowing the formula but not recognising when it applies',
    detail: 'The single most common Physics pattern our tutors see. The student can reproduce every formula on the sheet and still cannot tell which one the question is asking for.',
    fix: 'Learn four things about each formula, not one: what each variable means, its units, the physical situation it describes, and the question types it appears in.',
  },
  {
    mistake: 'Correct formula, wrong substitution',
    detail: 'Total distance used where displacement is required, initial velocity where final velocity is needed, or a value read from the wrong part of the question.',
    fix: 'List the given quantities with their symbols before substituting. It takes fifteen seconds and makes a mismatch visible.',
  },
  {
    mistake: 'Definitions that are conceptually right but miss the required terminology',
    detail: 'An answer that describes the idea correctly in everyday language frequently scores nothing. Physics definitions are marked against specific wording.',
    fix: 'Learn definitions in the syllabus’s own phrasing. If your definition would not appear in a textbook, it is a paraphrase, not a definition.',
  },
  {
    mistake: 'Answering "explain" by restating the outcome',
    detail: '"The object moves faster because there is more force" says the same thing twice in different words. The marks are in the mechanism, not the result.',
    fix: 'Name the quantity that changes, state what that does, and connect it to the effect described in the question. Three linked statements, not one assertion.',
  },
  {
    mistake: 'Graph work done by eye',
    detail: 'Gradients calculated from a single point instead of a large triangle, axes misread, and units on the axes ignored when interpreting what the gradient represents.',
    fix: 'Use a triangle spanning at least half the plotted line, mark it on the graph, and state what the gradient physically represents before calculating it.',
  },
  {
    mistake: 'Not showing enough working',
    detail: 'When the final answer is wrong, method marks are the only marks available — and they can only be awarded for working that is on the page.',
    fix: 'Write the formula, then the substitution, then the answer. Three lines minimum, even for a calculation you can do mentally.',
  },
  {
    mistake: 'Rounding too early, or to the wrong precision',
    detail: 'Intermediate values rounded partway through the working shift the final answer outside the accepted range, and significant figures are frequently ignored altogether.',
    fix: 'Carry full calculator precision through every step and round only at the end, to the precision the question specifies.',
  },
  {
    mistake: 'Treating the practical paper as a writing exercise',
    detail: 'Variables not clearly identified or controlled, sources of error confused with mistakes the student made, and "improvements" that could not actually be carried out.',
    fix: 'For every experiment know the independent, dependent and controlled variables, and make each suggested improvement something a person could physically do in a lab.',
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
            meta="Updated August 29, 2026 · 15 min read"
            imageSrc="/o-level-physics.webp"
            imageAlt="Apparatus on a lab bench — the mechanics, waves and electricity at the heart of O Level Physics."
          />

          <article className="space-y-12 text-gray-700 leading-relaxed">
            <p className="text-lg text-gray-800 leading-relaxed text-pretty">
              O Level Physics is a fundamental subject that builds the foundation for further studies in science and engineering. With its focus on Newtonian mechanics, thermal physics, waves, electricity and magnetism, and radioactivity, O Level Physics requires both theoretical understanding and practical application skills. This comprehensive guide provides proven strategies for achieving A1 grades in O Level Physics 2026.
            </p>

            {/* Key takeaways */}
            <KeyTakeaways
              items={[
                <>O Level Physics (6091) is three papers &mdash; MCQ (<span className="tabular-nums">30%</span>), structured &amp; free-response (<span className="tabular-nums">50%</span>) and a practical test (<span className="tabular-nums">20%</span>).</>,
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
                Singapore&rsquo;s O Level Physics (syllabus 6091) is designed to develop students&rsquo; understanding of physics principles and their applications in everyday life and technology. Combined Science (Physics) is a different subject &mdash; 5086 or 5087 &mdash; with its own papers and weightings.
              </p>
              <GuideCard className="mt-4">
                <h4 className="font-semibold text-gray-900 mb-4">O Level Physics Papers Breakdown</h4>
                <div className="space-y-5">
                  <div>
                    <h5 className="font-semibold text-gray-900">Paper 1: Multiple Choice</h5>
                    <ul className="list-disc ml-5 mt-1.5 space-y-1 text-sm text-gray-700">
                      <li>40 compulsory items, 40 marks</li>
                      <li>Duration: 1 hour</li>
                      <li>30% of the grade</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-900">Paper 2: Structured and Free Response</h5>
                    <ul className="list-disc ml-5 mt-1.5 space-y-1 text-sm text-gray-700">
                      <li>80 marks, 1 hour 45 minutes, 50% of the grade</li>
                      <li>Section A: 70 marks of compulsory structured questions; the last two share 20 marks, one a data-based question worth 8–12</li>
                      <li>Section B: 10 marks &mdash; two questions, answer one</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-900">Paper 3: Practical</h5>
                    <ul className="list-disc ml-5 mt-1.5 space-y-1 text-sm text-gray-700">
                      <li>40 marks, 1 hour 50 minutes, 20% of the grade</li>
                      <li>Section A: 20 marks, 1–2 experiments in 55 minutes</li>
                      <li>Section B: 20 marks, one 55-minute experiment; planning can be assessed on paper</li>
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
              <SectionHeading icon={Gauge}>Newtonian Mechanics</SectionHeading>
              <div className="space-y-4">
                <TopicCard
                  title="Kinematics & Dynamics"
                  chips={['Motion Graphs', "Newton’s Laws", 'Forces', 'Free-fall', 'Energy']}
                  points={[
                    'Master displacement–time and velocity–time graphs in one dimension',
                    'Practice free-body diagrams (forces in at most two dimensions)',
                    'Understand energy, work and power',
                    'Kinematics here is one-dimensional — including free-fall, not projectile motion',
                  ]}
                />
                <TopicCard
                  title="Turning Effects & Pressure"
                  chips={['Moments', 'Centre of Gravity', 'Pressure', 'Hydraulic Press']}
                  points={[
                    'Master moment calculations and equilibrium',
                    'Apply P = F/A and liquid-column pressure',
                    'Explain pressure transmission in a hydraulic press',
                    'Learn to solve centre-of-gravity and stability questions',
                  ]}
                />
              </div>
            </section>

            <section id="thermal" className="scroll-mt-24">
              <SectionHeading icon={Flame}>Thermal Physics</SectionHeading>
              <div className="space-y-4">
                <TopicCard
                  title="Kinetic Model, Processes & Properties"
                  chips={['Kinetic Particle Model', 'Conduction, Convection, Radiation', 'Specific Heat Capacity', 'Latent Heat']}
                  points={[
                    'Link particle motion to temperature and changes of state',
                    'Explain the three thermal processes with everyday examples',
                    'Practise specific heat capacity and latent heat calculations',
                    'Treat thermal physics as its own section — it is not folded into mechanics',
                  ]}
                />
              </div>
            </section>

            <section id="waves" className="scroll-mt-24">
              <SectionHeading icon={Waves}>Waves & Light</SectionHeading>
              <div className="space-y-4">
                <TopicCard
                  title="Wave Properties, Sound & EM Spectrum"
                  chips={['Wave Characteristics', 'Sound', 'Electromagnetic Spectrum']}
                  points={[
                    'Apply v = fλ and compare transverse with longitudinal waves',
                    'Relate loudness to amplitude and pitch to frequency; use echoes and ultrasound',
                    'Order the EM spectrum and recall typical uses and hazards',
                  ]}
                />
                <TopicCard
                  title="Light"
                  chips={['Reflection', 'Refraction', 'Total Internal Reflection', 'Thin Converging Lenses']}
                  points={[
                    'Use i = r, Snell’s law, refractive index, critical angle and optical fibres',
                    'Draw ray diagrams for a thin converging lens only',
                    'Describe images as real/virtual, magnified/diminished, upright/inverted',
                    'The syllabus does not require the lens formula, diverging lenses, microscopes or telescopes',
                  ]}
                />
              </div>
            </section>

            <section id="electromagnetism" className="scroll-mt-24">
              <SectionHeading icon={Zap}>Electricity & Magnetism</SectionHeading>
              <div className="space-y-4">
                <TopicCard
                  title="Electric Circuits"
                  chips={['Static Electricity', 'Current', 'Voltage', 'Resistance', 'D.C. Circuits', 'Practical Electricity']}
                  points={[
                    'Master circuit analysis and Ohm’s Law',
                    'Practice series and parallel combinations',
                    'Understand power, energy and household electricity',
                    'Learn static electricity alongside current electricity',
                  ]}
                />
                <TopicCard
                  title="Magnetism, Electromagnetism & Induction"
                  chips={['Magnetic Fields', 'Electromagnetism', 'Electromagnetic Induction']}
                  points={[
                    'Sketch field patterns and the field due to a current',
                    'Explain motors using the force on a current-carrying conductor',
                    'Apply electromagnetic induction and transformers',
                  ]}
                />
              </div>
            </section>

            <section id="radioactivity" className="scroll-mt-24">
              <SectionHeading icon={Radiation}>Radioactivity</SectionHeading>
              <div className="space-y-4">
                <TopicCard
                  title="The Nucleus & Radioactive Decay"
                  chips={['Atomic Model', 'α, β and γ', 'Half-life', 'Uses & Hazards']}
                  points={[
                    'Describe the composition of the nucleus and the three types of emission',
                    'Use half-life in calculations and interpret decay graphs',
                    'Discuss uses of radioisotopes and the hazards of ionising radiation',
                    'This is its own syllabus section — do not leave it until the last week',
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
                  <h4 className="font-semibold text-gray-900 mb-2">Paper 2 (Structured &amp; Free Response) Strategy</h4>
                  <ul className="list-disc ml-5 space-y-1 text-sm text-gray-700">
                    <li>Section A is compulsory (70 marks); one of the last two questions is data-based (8–12 marks)</li>
                    <li>Read both Section B questions fully before choosing the 10-mark one</li>
                    <li>Show all working clearly &mdash; partial credit is available</li>
                    <li>Use proper units and significant figures</li>
                    <li>Draw clear diagrams with proper labels</li>
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
              <SectionHeading icon={TriangleAlert}>10 common O-Level Physics mistakes</SectionHeading>
              <p className="text-gray-700 mb-5">
                Most Physics marks our tutors recover are not lost to gaps in knowledge. They are lost by students who understood the question and wrote an answer the mark scheme could not reward. These are the ten we correct most often, and what to do instead.
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
                  <h4 className="font-semibold text-gray-900 mb-1.5">Free from us</h4>
                  <ul className="list-disc ml-5 text-sm space-y-1 text-gray-700">
                    <li>
                      <Link href="/free-notes" className="text-primary underline underline-offset-2">O-Level Physics study notes</Link>
                      {' '}&mdash; every formula with its SI unit attached, across all eleven topics, then answer templates, instrument precision and the graphing rules. Written against syllabus 6091
                    </li>
                    <li>
                      <Link href="/free-test-papers" className="text-primary underline underline-offset-2">Free test papers</Link>
                      {' '}&mdash; Secondary 4 Physics prelim and school papers, to work unseen and to time
                    </li>
                    <li>
                      <Link href="/how-to-study/o-level-physics" className="text-primary underline underline-offset-2">How to study for O-Level Physics</Link>
                      {' '}&mdash; only about 15% of the theory marks are recall, and revision built the other way round is the usual reason for a plateau
                    </li>
                  </ul>
                </div>
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
