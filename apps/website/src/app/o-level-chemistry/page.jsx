import { MATCH_TIME } from '@/data/promises';
export const metadata = {
  title: 'O-Level Chemistry (6092): Topics, Common Mistakes & Tips',
  description: 'The 2026 syllabus 6092 topics ranked by marks weight, the 10 mistakes our tutors correct most on Chemistry scripts, and how to prepare for Papers 1 to 3.',
  keywords: [
    'pure chemistry O Level syllabus',
    'O Level Chemistry common mistakes',
    'O Level Chemistry study tips',
    'O Level Chemistry 2026',
    'O Level Chemistry Singapore',
    'GCE O Level Chemistry guide',
    'O Level Chemistry preparation',
    'O Level Chemistry tuition Singapore',
  ],
  openGraph: {
    images: [DEFAULT_OG_IMAGE],
    title: 'O-Level Chemistry (6092): Topics, Common Mistakes & Tips',
    description: 'The 2026 syllabus 6092 topics ranked by marks weight, the 10 mistakes our tutors correct most on Chemistry scripts, and how to prepare for Papers 1 to 3.',
    url: 'https://www.lioncitytutors.com/o-level-chemistry',
    type: 'article',
  },
  alternates: {
    canonical: 'https://www.lioncitytutors.com/o-level-chemistry',
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
  FileText, CalendarClock, Atom, Gem, Hexagon, Beaker, Target,
  TriangleAlert, CalendarDays, BookOpen, GraduationCap, Users,
  Hourglass, HeartHandshake, Compass, Flag, ListChecks, HelpCircle,
} from 'lucide-react';
import { O_LEVEL_CHEMISTRY_FAQS } from './faqs.mjs';
import { DEFAULT_OG_IMAGE } from '@/lib/seo/openGraph';

const tableOfContents = [
  { id: 'structure', label: 'Exam & paper structure' },
  { id: 'exam-dates', label: '2026 exam timetable' },
  { id: 'timeline', label: '12-month study timeline' },
  { id: 'physical', label: 'Physical chemistry' },
  { id: 'inorganic', label: 'Inorganic chemistry' },
  { id: 'organic', label: 'Organic chemistry' },
  { id: 'exam-strategies', label: 'Paper-by-paper exam strategy' },
  { id: 'mistakes', label: '10 common mistakes' },
  { id: 'schedule', label: 'Weekly study schedule' },
  { id: 'resources', label: 'Essential resources' },
  { id: 'practical', label: 'Practical & lab skills' },
  { id: 'pathways', label: 'Future pathways' },
  { id: 'tuition', label: 'When to consider tuition' },
  { id: 'final-months', label: 'Final two months' },
  { id: 'exam-day', label: 'Mental prep & exam day' },
  { id: 'post-exam', label: 'After the exam' },
  { id: 'faq', label: 'Frequently asked questions' },
  { id: 'conclusion', label: 'Conclusion' },
];

const timeline = [
  {
    title: 'Term 1–2 · Foundation Building Phase',
    points: [
      'Master atomic structure, chemical bonding, and molecular geometry',
      'Build strong foundation in stoichiometry and chemical calculations',
      'Develop systematic approach to balancing equations',
      'Focus on understanding rather than memorization',
      'Complete all tutorial questions and practical worksheets',
    ],
  },
  {
    title: 'Term 3–4 · Concept Integration Phase',
    points: [
      'Master acids, bases, and salts',
      'Begin organic chemistry foundation with hydrocarbons',
      'Develop analytical thinking for problem-solving',
      'Practice past year O Level questions by topic',
      'Strengthen practical skills and data analysis techniques',
    ],
  },
  {
    title: 'Term 5–6 · Application Mastery Phase',
    points: [
      'Complete organic chemistry and macromolecules',
      'Master chemical analysis and qualitative tests',
      'Intensive practice with full O Level past papers',
      'Develop time management and exam techniques',
      'Focus on common exam question patterns and mark schemes',
    ],
  },
  {
    title: 'Term 7 to O Levels · Excellence Phase',
    points: [
      'Intensive revision based on Prelim exam performance',
      'Daily practice with timed O Level standard questions',
      'Perfect answer presentation and scientific communication',
      'Final consolidation of all formulae and key concepts',
      'Mental preparation and stress management strategies',
    ],
  },
];

// The mistakes our tutors correct most often on Chemistry scripts. Chemistry
// rewards precise terminology more than most subjects, so several of these are
// about how the answer is written rather than what the student knows.
const commonMistakes = [
  {
    mistake: 'A shaky mole concept, which then breaks four other topics',
    detail: 'Weak mole fundamentals do not stay contained. They resurface in stoichiometry, in concentration, in gas volumes and in every titration calculation — so a student can appear to be weak at four topics when the gap is really one.',
    fix: 'Repair the mole concept before anything else. It is the highest-leverage fix in the entire syllabus, because one foundation repairs several topics at once.',
  },
  {
    mistake: 'Taking the mole ratio from an unbalanced equation',
    detail: 'The calculation is then carried out perfectly on the wrong numbers. Every subsequent step is consistent, which is exactly why it is so hard to catch when checking.',
    fix: 'Balance the equation first, then circle the two species the question relates, and read the ratio from the balanced coefficients only.',
  },
  {
    mistake: 'Equations with wrong formulae or wrong ionic charges',
    detail: 'Writing NaCl₂ or giving sulfate a single negative charge produces an equation that cannot balance correctly no matter how carefully the coefficients are adjusted.',
    fix: 'Get the formula of each species right before balancing. Learn the common ionic charges cold — they appear in nearly every inorganic question on the paper.',
  },
  {
    mistake: 'Missing or incorrect state symbols',
    detail: 'State symbols are marked, and they are frequently left off entirely on equations that are otherwise completely correct.',
    fix: 'Add state symbols as you write each species rather than as a final pass. Precipitates in particular must be (s), and that is often the mark being tested.',
  },
  {
    mistake: 'Mixing up cm³ and dm³',
    detail: 'The factor of 1,000 between them appears in almost every concentration and gas-volume calculation, and it is the most common numerical error we see in Chemistry.',
    fix: 'Convert every volume to dm³ in the first line of working. Do the same for grams and kilograms, and write the unit on each intermediate value.',
  },
  {
    mistake: 'Describing the chemistry correctly in everyday language',
    detail: 'A chemically sensible answer that avoids the required term frequently scores nothing. This is the most frustrating category, because the student genuinely understood the question.',
    fix: 'Learn the syllabus’s phrasing, not just the idea. When revising, check your wording against the mark scheme rather than against whether it sounds right.',
  },
  {
    mistake: 'Confusing observation with inference in qualitative analysis',
    detail: 'An observation is what you see — a white precipitate forming, a gas evolving. An inference is what it tells you. Questions ask for one or the other, and students routinely supply an explanation where an observation was required.',
    fix: 'Check the command word before answering. If it says "state what you observe", nothing about identity or reasoning belongs in the answer.',
  },
  {
    mistake: 'Oxidation states worked out by guesswork',
    detail: 'Oxidation and reduction get inverted, or the oxidation state of an element in a compound ion is assigned by pattern-matching rather than calculation, which then reverses the entire redox analysis.',
    fix: 'Calculate oxidation states from the rules every time rather than recalling them. Then identify which species lost electrons before naming anything as oxidised.',
  },
  {
    mistake: 'Electrolysis answered from memory of a single example',
    detail: 'Cathode and anode get swapped, or the products of the example the student memorised are given for a different electrolyte entirely.',
    fix: 'Work from the ions actually present in the solution, decide what is discharged at each electrode and why, then write the half-equations. Learn the reasoning, not one worked case.',
  },
  {
    mistake: 'Organic chemistry memorised reaction by reaction',
    detail: 'Individual reactions are learned in isolation, so an unfamiliar molecule with the same functional group becomes unanswerable, and reaction conditions are left off answers that are otherwise right.',
    fix: 'Learn by functional group and reaction pattern rather than by specific example, and treat the conditions as part of the answer, not an optional extra.',
  },
];

export default function OLevelChemistry() {
  const whatsappMessage = `Hi LionCity Tutors! I'd like help finding an O Level Chemistry tutor.

Student level (e.g. Sec 3 / Sec 4):
Current grade:
Location:
Preferred days & timing: `;
  const whatsappHref = `https://wa.me/6588701152?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <>
    <GuideSchema
      slug="o-level-chemistry"
      course={{
        name: 'O-Level Chemistry Tuition',
        description: 'One-to-one O-Level Chemistry tuition in Singapore, covering the full 6092 syllabus and the Paper 3 practical.',
        educationalLevel: 'GCE O-Level',
      }}
      faqs={O_LEVEL_CHEMISTRY_FAQS}
    />
    <main className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16">
      <div className="mx-auto max-w-2xl lg:max-w-none lg:grid lg:grid-cols-[minmax(0,42rem)_15rem] lg:justify-center lg:gap-12">
        {/* Article column */}
        <div>
          <GuideHeader
            title="O Level Chemistry Guide 2026: Master Physical, Organic & Inorganic Chemistry"
            author="By the LionCity Tutors Chemistry Team"
            meta="Updated May 23, 2026 · 18 min read"
            imageSrc="/o-level-chemistry.webp"
            imageAlt="Laboratory glassware and reagents — the hands-on craft at the heart of O Level Chemistry."
          />

          <article className="space-y-12 text-gray-700 leading-relaxed">
            <p className="text-lg text-gray-800 leading-relaxed text-pretty">
              O Level Chemistry is one of the most challenging and rewarding subjects in the Singapore GCE O Level curriculum. With its comprehensive coverage of physical, organic, and inorganic chemistry, O Level Chemistry demands both theoretical understanding and practical application skills. This detailed guide provides proven strategies for achieving A1 grades in O Level Chemistry 2026.
            </p>

            {/* Key takeaways */}
            <KeyTakeaways
              items={[
                <>O Level Chemistry (6092) is examined as three papers &mdash; MCQ (<span className="tabular-nums">30%</span>), structured &amp; free-response (<span className="tabular-nums">50%</span>) and practical (<span className="tabular-nums">20%</span>).</>,
                <>A steady two-year timeline built on understanding beats last-minute memorisation every time.</>,
                <>The biggest score lever isn&rsquo;t knowing more &mdash; it&rsquo;s answer technique: balanced equations with state symbols, correct units and clear diagrams.</>,
                <>Struggling with mole calculations, bonding or practical questions is the usual signal that targeted tuition will help.</>,
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
              <SectionHeading icon={FileText}>Understanding O Level Chemistry Structure</SectionHeading>
              <p className="text-pretty">
                Singapore&rsquo;s O Level Chemistry (Paper 6092) is a comprehensive subject that builds the foundation for further studies in science and engineering. The subject is available in both Pure and Combined Science streams.
              </p>
              <GuideCard className="mt-4">
                <h4 className="font-semibold text-gray-900 mb-4">O Level Chemistry Papers Breakdown</h4>
                <div className="space-y-5">
                  <div>
                    <h5 className="font-semibold text-gray-900">Pure Chemistry</h5>
                    <ul className="list-disc ml-5 mt-1.5 space-y-1 text-sm text-gray-700">
                      <li>Paper 1: Multiple Choice (30%)</li>
                      <li>Paper 2: Structured &amp; Free Response (50%)</li>
                      <li>Paper 3: Practical Assessment (20%)</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-900">Combined Science (Chemistry)</h5>
                    <ul className="list-disc ml-5 mt-1.5 space-y-1 text-sm text-gray-700">
                      <li>Paper 1: Multiple Choice (30%)</li>
                      <li>Paper 2: Structured &amp; Free Response (50%)</li>
                      <li>Paper 3: Practical Assessment (20%)</li>
                    </ul>
                  </div>
                </div>
              </GuideCard>
            </section>

            <section id="exam-dates" className="scroll-mt-24">
              <SectionHeading icon={CalendarDays}>2026 O-Level Chemistry Exam Timetable</SectionHeading>
              <ExamTimetable
                examSlug="o-level"
                subjectSlugs={['chemistry']}
                caption="Official 2026 SEAB dates for O-Level Chemistry."
              />
            </section>

            <section id="timeline" className="scroll-mt-24">
              <SectionHeading icon={CalendarClock}>12-Month O Level Chemistry Preparation Timeline</SectionHeading>
              <GuideTimeline items={timeline} />
            </section>

            <section id="physical" className="scroll-mt-24">
              <SectionHeading icon={Atom}>Physical Chemistry Mastery Guide</SectionHeading>
              <div className="space-y-4">
                <TopicCard
                  title="Atomic Structure & Chemical Bonding"
                  weight="20–25% of papers"
                  chips={['Electronic Configuration', 'Periodic Trends', 'Ionic/Covalent Bonding', 'Intermolecular Forces']}
                  points={[
                    'Master electron configuration patterns',
                    'Understand periodic trends with underlying principles',
                    'Practice predicting molecular shapes',
                    'Learn to explain properties based on bonding types',
                  ]}
                />
                <TopicCard
                  title="Energy Changes"
                  weight="15–20% of papers"
                  chips={['Exothermic/Endothermic Reactions', 'Energy Level Diagrams', 'Bond Energy']}
                  points={[
                    'Master energy level diagrams',
                    'Practice bond energy calculations',
                    'Understand energy changes in reactions',
                    'Learn to predict reaction energetics',
                  ]}
                />
                <TopicCard
                  title="Chemical Calculations"
                  weight="20–25% of papers"
                  chips={['Moles', 'Concentration', 'Gas Laws', 'Stoichiometry']}
                  points={[
                    'Master mole concept calculations',
                    'Practice concentration problems',
                    'Understand gas law applications',
                    'Learn to solve stoichiometry problems',
                  ]}
                />
              </div>
            </section>

            <section id="inorganic" className="scroll-mt-24">
              <SectionHeading icon={Gem}>Inorganic Chemistry Mastery Guide</SectionHeading>
              <div className="space-y-4">
                <TopicCard
                  title="Acids, Bases & Salts"
                  weight="20–25% of papers"
                  chips={['pH Scale', 'Neutralization', 'Salt Preparation', 'Titration']}
                  points={[
                    'Master pH calculations and indicators',
                    'Practice salt preparation methods',
                    'Understand titration techniques',
                    'Learn to solve acid-base problems',
                  ]}
                />
                <TopicCard
                  title="Metals & Non-metals"
                  weight="15–20% of papers"
                  chips={['Reactivity Series', 'Extraction', 'Corrosion', 'Alloys']}
                  points={[
                    'Master reactivity series applications',
                    'Practice extraction methods',
                    'Understand corrosion prevention',
                    'Learn to explain metal properties',
                  ]}
                />
              </div>
            </section>

            <section id="organic" className="scroll-mt-24">
              <SectionHeading icon={Hexagon}>Organic Chemistry Mastery Guide</SectionHeading>
              <div className="space-y-4">
                <TopicCard
                  title="Hydrocarbons"
                  weight="15–20% of papers"
                  chips={['Alkanes', 'Alkenes', 'Fuels', 'Cracking']}
                  points={[
                    'Master hydrocarbon reactions',
                    'Practice naming organic compounds',
                    'Understand fuel properties',
                    'Learn to explain cracking processes',
                  ]}
                />
                <TopicCard
                  title="Functional Groups"
                  weight="15–20% of papers"
                  chips={['Alcohols', 'Carboxylic Acids', 'Esters', 'Polymers']}
                  points={[
                    'Master functional group reactions',
                    'Practice polymer formation',
                    'Understand esterification',
                    'Learn to explain macromolecules',
                  ]}
                />
              </div>
            </section>

            <section id="exam-strategies" className="scroll-mt-24">
              <SectionHeading icon={Target}>O Level Chemistry Exam Strategies</SectionHeading>
              <div className="space-y-4">
                <GuideCard>
                  <h4 className="font-semibold text-gray-900 mb-2">Paper 1 (MCQ) Strategy</h4>
                  <ul className="list-disc ml-5 space-y-1 text-sm text-gray-700">
                    <li>Allocate 1.5 minutes per question maximum</li>
                    <li>Use the elimination method for difficult questions</li>
                    <li>Pay attention to keywords like &ldquo;always,&rdquo; &ldquo;never,&rdquo; &ldquo;most likely&rdquo;</li>
                    <li>Don&rsquo;t second-guess yourself unless you find a clear error</li>
                    <li>Review flagged questions if time permits</li>
                  </ul>
                </GuideCard>

                <GuideCard>
                  <h4 className="font-semibold text-gray-900 mb-2">Paper 2 (Structured & Free Response) Strategy</h4>
                  <ul className="list-disc ml-5 space-y-1 text-sm text-gray-700">
                    <li>Read all questions first and start with your strongest topics</li>
                    <li>Show all working clearly &mdash; partial credit is available</li>
                    <li>Use proper chemical notation and balanced equations</li>
                    <li>Draw clear diagrams with proper labels</li>
                    <li>Check units and significant figures in calculations</li>
                  </ul>
                </GuideCard>

                <GuideCard>
                  <h4 className="font-semibold text-gray-900 mb-2">Paper 3 (Practical) Strategy</h4>
                  <ul className="list-disc ml-5 space-y-1 text-sm text-gray-700">
                    <li>Read instructions carefully before starting</li>
                    <li>Record all observations immediately</li>
                    <li>Use proper safety precautions</li>
                    <li>Draw clear diagrams of apparatus</li>
                    <li>Leave time to check calculations and conclusions</li>
                  </ul>
                </GuideCard>
              </div>
            </section>

            <section id="mistakes" className="scroll-mt-24">
              <SectionHeading icon={TriangleAlert}>10 common O-Level Chemistry mistakes</SectionHeading>
              <p className="text-gray-700 mb-5">
                Chemistry rewards precise terminology more than almost any other subject, so a large share of the marks our tutors recover are lost on questions the student understood. These are the ten we correct most often, and what to do instead.
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
              <SectionHeading icon={CalendarDays}>Creating Your O Level Chemistry Study Schedule</SectionHeading>
              <GuideCard>
                <h4 className="font-semibold text-gray-900 mb-3">Recommended Weekly Schedule</h4>
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
              <SectionHeading icon={BookOpen}>Essential O Level Chemistry Resources</SectionHeading>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1.5">Free from us</h4>
                  <ul className="list-disc ml-5 text-sm space-y-1 text-gray-700">
                    <li>
                      <Link href="/free-notes" className="text-primary underline underline-offset-2">O-Level Chemistry study notes</Link>
                      {' '}&mdash; 23 pages across all eleven topics, with sentence templates for the &ldquo;explain&rdquo; questions, the qualitative analysis tables and Paper 3 error analysis
                    </li>
                    <li>
                      <Link href="/free-test-papers" className="text-primary underline underline-offset-2">Free test papers</Link>
                      {' '}&mdash; Secondary 4 Chemistry prelim and school papers, to work unseen and to time
                    </li>
                    <li>
                      <Link href="/how-to-study/o-level-chemistry" className="text-primary underline underline-offset-2">How to study for O-Level Chemistry</Link>
                      {' '}&mdash; what each paper is worth, and which reference material you are handed in the exam hall
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1.5">Recommended Textbooks</h4>
                  <ul className="list-disc ml-5 text-sm space-y-1 text-gray-700">
                    <li>Chemistry Matters (Marshall Cavendish) &mdash; comprehensive coverage</li>
                    <li>Understanding Chemistry (Pearson) &mdash; detailed explanations</li>
                    <li>O Level Chemistry Study Guide (Oxford) &mdash; exam-focused content</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1.5">Practice Materials</h4>
                  <ul className="list-disc ml-5 text-sm space-y-1 text-gray-700">
                    <li>GCE O Level past papers (last 5 years minimum)</li>
                    <li>School preliminary examination papers</li>
                    <li>Topical practice books for specific chemistry areas</li>
                    <li>International O Level chemistry papers for extra practice</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1.5">Digital Tools</h4>
                  <ul className="list-disc ml-5 text-sm space-y-1 text-gray-700">
                    <li>ChemSketch for drawing molecular structures</li>
                    <li>PhET simulations for visualizing chemical processes</li>
                    <li>Chemistry problem-solving apps</li>
                    <li>Anki for memorizing reactions and formulas</li>
                  </ul>
                </div>
              </div>
            </section>

            <section id="practical" className="scroll-mt-24">
              <SectionHeading icon={Beaker}>Practical Skills and Laboratory Techniques</SectionHeading>
              <p className="text-pretty">
                O Level Chemistry emphasizes practical skills and data analysis abilities that are tested through the practical paper:
              </p>
              <ul className="list-disc ml-6 space-y-2 mt-3 text-gray-700">
                <li><strong className="text-gray-900">Master Common Techniques:</strong> Titration, crystallization, distillation, and chromatography procedures</li>
                <li><strong className="text-gray-900">Data Analysis Skills:</strong> Interpret graphs, calculate uncertainties, and draw valid conclusions</li>
                <li><strong className="text-gray-900">Safety Awareness:</strong> Understand chemical hazards and proper laboratory safety protocols</li>
                <li><strong className="text-gray-900">Observation Skills:</strong> Learn to describe chemical observations using precise scientific language</li>
                <li><strong className="text-gray-900">Experimental Design:</strong> Understand how to plan investigations and control variables</li>
                <li><strong className="text-gray-900">Error Analysis:</strong> Identify sources of experimental error and suggest improvements</li>
              </ul>
            </section>

            <section id="pathways" className="scroll-mt-24">
              <SectionHeading icon={GraduationCap}>Future Pathways</SectionHeading>
              <GuideCard>
                <h4 className="font-semibold text-gray-900 mb-3">Your O Level Chemistry Results Open These Doors</h4>
                <div className="space-y-4 text-sm">
                  <div>
                    <strong className="text-gray-900">A1-A2 grades in O Level Chemistry:</strong>
                    <ul className="list-disc ml-5 mt-1 space-y-1 text-gray-700">
                      <li>JC Science stream with H2 Chemistry</li>
                      <li>Polytechnic Science and Engineering courses</li>
                      <li>Foundation for A Level Chemistry</li>
                      <li>Science and research career pathways</li>
                    </ul>
                  </div>
                  <div>
                    <strong className="text-gray-900">B3-C6 grades in O Level Chemistry:</strong>
                    <ul className="list-disc ml-5 mt-1 space-y-1 text-gray-700">
                      <li>JC Arts stream with H1 Chemistry</li>
                      <li>Polytechnic Applied Science courses</li>
                      <li>Science Education and Communication roles</li>
                      <li>Technical and laboratory positions</li>
                    </ul>
                  </div>
                </div>
              </GuideCard>
            </section>

            <section id="tuition" className="scroll-mt-24">
              <SectionHeading icon={Users}>When to Consider O Level Chemistry Tuition</SectionHeading>
              <p>Consider professional O Level Chemistry tuition if your child:</p>
              <ul className="list-disc ml-6 space-y-1 mt-3 text-gray-700">
                <li>Struggles with chemical concepts and calculations</li>
                <li>Needs help connecting theoretical knowledge to practical applications</li>
                <li>Requires structured guidance for mathematical problem-solving</li>
                <li>Lacks confidence in data analysis and graph interpretation</li>
                <li>Aims for A1 grades to meet competitive course requirements</li>
                <li>Benefits from personalized feedback on answer techniques</li>
              </ul>
              <GuideCard className="mt-4">
                <p className="text-sm"><strong className="text-gray-900">Choose O Level Chemistry tutors who:</strong> Have extensive experience with current O Level syllabi, understand common student misconceptions, can explain complex concepts clearly, provide structured practice programs, and have strong backgrounds in chemistry or science education.</p>
              </GuideCard>
            </section>

            <section id="final-months" className="scroll-mt-24">
              <SectionHeading icon={Hourglass}>Final Two Months O Level Preparation</SectionHeading>
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
                      <li>Create final summary cards for all key formulas and reactions</li>
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
                Regardless of how you feel after your O Level Chemistry exams, focus on the opportunities ahead. Strong chemistry knowledge opens doors to numerous exciting career paths in science, engineering, and technology.
              </p>
              <GuideCard className="mt-4">
                <h4 className="font-semibold text-gray-900 mb-2">Moving Forward</h4>
                <ul className="list-disc ml-5 space-y-1 text-sm text-gray-700">
                  <li>Use the post-exam period to explore different science and engineering programs</li>
                  <li>Consider internships or research opportunities in chemistry-related fields</li>
                  <li>Continue developing your problem-solving and analytical skills</li>
                  <li>Remember that success in chemistry is about persistence, not just exam grades</li>
                </ul>
              </GuideCard>
            </section>

            <section id="faq" className="scroll-mt-24">
              <SectionHeading icon={HelpCircle}>Frequently Asked Questions</SectionHeading>
              <div className="space-y-6">
                {O_LEVEL_CHEMISTRY_FAQS.map((faq) => (
                  <div key={faq.question}>
                    <h3 className="text-lg font-semibold text-gray-900">{faq.question}</h3>
                    <p className="mt-2 text-gray-700">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </section>

            <section id="conclusion" className="scroll-mt-24">
              <SectionHeading icon={Flag}>Conclusion: Your O Level Chemistry Success Journey</SectionHeading>
              <p className="text-pretty">
                Achieving excellence in O Level Chemistry requires dedication, strategic preparation, and consistent practice. The comprehensive approach outlined in this guide &mdash; from understanding the syllabus structure through mastering each topic area to developing effective exam strategies &mdash; provides you with the roadmap to success.
              </p>
              <p className="mt-3 text-pretty">
                Remember that O Level Chemistry is not just about memorizing reactions and formulas. It&rsquo;s about developing critical thinking skills, understanding the molecular world around us, and preparing for exciting further studies in science and technology. Every challenging problem you solve and every concept you master builds towards your future success.
              </p>
              <div className="rounded-xl border border-primary/15 bg-primary/5 p-5 sm:p-6 mt-4">
                <p className="font-semibold text-gray-900">
                  Success in O Level Chemistry comes from consistent daily practice, understanding rather than memorization, and maintaining confidence in your abilities. Trust your preparation, stay focused during exams, and remember that your hard work will pay off in opening doors to amazing opportunities in science and beyond.
                </p>
              </div>
            </section>

            <RelatedGuides slug="o-level-chemistry" />

            {/* Conversion block */}
            <GuideCTA
              title="Find your O Level Chemistry tutor"
              description={`Tell us your child’s level and goals. We hand-match a vetted, MOE-familiar O Level Chemistry tutor — usually within ${MATCH_TIME} — and parents never pay an agency fee.`}
              buttonText="Find your O Level Chemistry tutor"
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
