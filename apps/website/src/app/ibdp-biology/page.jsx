import { MATCH_TIME } from '@/data/promises';
import GuideSchema from '@/components/seo/GuideSchema';
export const metadata = {
  title: 'IBDP Biology Guide 2026: HL & SL Study Strategy',
  description: 'Ultimate IBDP Biology preparation guide for Singapore students. Expert strategies, practical techniques, and proven tips to score 7 in IBDP Biology 2026.',
  keywords: [
    'IBDP Biology 2026',
    'IB Biology Singapore',
    'International Baccalaureate Biology guide',
    'IBDP Biology preparation',
    'IB Biology study tips',
    'IBDP Biology tuition Singapore',
    'Biology revision techniques',
    'IBDP Biology syllabus'
  ],
  openGraph: {
    title: 'IBDP Biology Guide 2026: Complete Study Strategy for Singapore Students',
    description: 'Comprehensive IBDP Biology guide with proven strategies to help Singapore students achieve level 7 in IBDP Biology.',
    url: 'https://www.lioncitytutors.com/ibdp-biology',
    type: 'article',
  },
  alternates: {
    canonical: 'https://www.lioncitytutors.com/ibdp-biology',
  },
};

import TableOfContents from '@/components/TableOfContents';
import {
  GuideHeader, SectionHeading, GuideCard, TopicCard, GuideTimeline, KeyTakeaways, GuideCTA, ICON_STROKE,
  RelatedGuides,
} from '@/components/guide';
import {
  FileText, CalendarClock, Microscope, Dna, Leaf, HeartPulse, ClipboardList, Target,
  TriangleAlert, CalendarDays, BookOpen, GraduationCap, Users,
  Hourglass, HeartHandshake, Compass, Flag, ListChecks,
} from 'lucide-react';

const tableOfContents = [
  { id: 'structure', label: 'Exam & assessment structure' },
  { id: 'timeline', label: '24-month study timeline' },
  { id: 'cell-biology', label: 'Cell biology' },
  { id: 'genetics', label: 'Genetics & evolution' },
  { id: 'ecology', label: 'Ecology & conservation' },
  { id: 'physiology', label: 'Human physiology' },
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
      'Master cell structure and function',
      'Build strong foundation in molecular biology',
      'Develop systematic approach to biological processes',
      'Focus on understanding rather than memorization',
      'Complete all tutorial questions and practical worksheets',
    ],
  },
  {
    title: 'Year 1 Term 3–4 · Concept Integration Phase',
    points: [
      'Master genetics and evolution',
      'Begin ecology and biodiversity foundation',
      'Develop analytical thinking for complex problem-solving',
      'Practice past year IBDP questions by topic',
      'Strengthen practical skills and data analysis techniques',
    ],
  },
  {
    title: 'Year 2 Term 1–2 · Application Mastery Phase',
    points: [
      'Complete human physiology and health',
      'Master plant biology and biotechnology',
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
      'Final consolidation of all key concepts and terminology',
      'Mental preparation and stress management strategies',
    ],
  },
];

export default function IBDPBiology() {
  const whatsappMessage = `Hi LionCity Tutors! I'd like help finding an IBDP Biology tutor.

Student level (e.g. IBDP Year 1 / Year 2):
Current grade:
Location:
Preferred days & timing: `;
  const whatsappHref = `https://wa.me/6588701152?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <>
      <GuideSchema
        slug="ibdp-biology"
        course={{
          name: 'IBDP Biology Tuition',
          description:
            'IB Diploma Biology tuition in Singapore, covering HL and SL content, the internal assessment and paper technique.',
          educationalLevel: 'IB Diploma Programme',
        }}
      />
    <main className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16">
      <div className="mx-auto max-w-2xl lg:max-w-none lg:grid lg:grid-cols-[minmax(0,42rem)_15rem] lg:justify-center lg:gap-12">
        {/* Article column */}
        <div>
          <GuideHeader
            title="IBDP Biology Guide 2026: Master Cell Biology, Genetics & Ecology"
            author="By the LionCity Tutors Biology Team"
            meta="Updated June 25, 2026 · 18 min read"
            imageSrc="/biology.webp"
            imageAlt="A blue-toned DNA double helix — the molecular biology at the heart of IBDP Biology."
          />

          <article className="space-y-12 text-gray-700 leading-relaxed">
            <p className="text-lg text-gray-800 leading-relaxed text-pretty">
              IBDP Biology is one of the most challenging and rewarding subjects in the International Baccalaureate Diploma Programme. With its comprehensive coverage of cell biology, genetics, ecology, and human physiology, IBDP Biology demands both theoretical understanding and practical application skills. This detailed guide provides proven strategies for achieving level 7 in IBDP Biology 2026.
            </p>

            {/* Key takeaways */}
            <KeyTakeaways
              items={[
                <>IBDP Biology runs at SL and HL &mdash; <span className="tabular-nums">80%</span> exams (P1 MCQ, P2 structured, P3 data analysis) and a <span className="tabular-nums">20%</span> internal assessment.</>,
                <>A steady two-year timeline built on understanding beats last-minute memorisation every time.</>,
                <>Two marks matter most: answer technique in the papers (terminology, diagrams, working) and a well-designed IA investigation.</>,
                <>Struggling with genetics, physiology or data-analysis questions is the usual signal that targeted tuition will help.</>,
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
              <SectionHeading icon={FileText}>Understanding IBDP Biology Structure</SectionHeading>
              <p className="text-pretty">
                The IBDP Biology course is designed to develop students&rsquo; understanding of biological concepts and their application to real-world situations. The course is available at both Standard Level (SL) and Higher Level (HL).
              </p>
              <GuideCard className="mt-4">
                <h4 className="font-semibold text-gray-900 mb-4">IBDP Biology Assessment Breakdown</h4>
                <div className="space-y-5">
                  <div>
                    <h5 className="font-semibold text-gray-900">External Assessment (80%)</h5>
                    <ul className="list-disc ml-5 mt-1.5 space-y-1 text-sm text-gray-700">
                      <li>Paper 1: Multiple Choice (20%)</li>
                      <li>Paper 2: Structured Questions (40%)</li>
                      <li>Paper 3: Data Analysis and Extended Response (20%)</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-900">Internal Assessment (20%)</h5>
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
              <SectionHeading icon={CalendarClock}>24-Month IBDP Biology Preparation Timeline</SectionHeading>
              <GuideTimeline items={timeline} />
            </section>

            <section id="cell-biology" className="scroll-mt-24">
              <SectionHeading icon={Microscope}>Cell Biology Mastery Guide</SectionHeading>
              <div className="space-y-4">
                <TopicCard
                  title="Cell Structure & Function"
                  weight="20–25% of papers"
                  chips={['Cell Organelles', 'Membrane Transport', 'Cell Division', 'Cell Respiration']}
                  points={[
                    'Master organelle functions and interactions',
                    'Practice membrane transport mechanisms',
                    'Understand cell cycle regulation',
                    'Learn to explain cellular processes',
                  ]}
                />
                <TopicCard
                  title="Molecular Biology"
                  weight="15–20% of papers"
                  chips={['DNA Structure', 'Protein Synthesis', 'Enzymes', 'Metabolism']}
                  points={[
                    'Master DNA replication and transcription',
                    'Practice protein synthesis steps',
                    'Understand enzyme kinetics',
                    'Learn to solve metabolic pathway problems',
                  ]}
                />
              </div>
            </section>

            <section id="genetics" className="scroll-mt-24">
              <SectionHeading icon={Dna}>Genetics & Evolution Mastery Guide</SectionHeading>
              <div className="space-y-4">
                <TopicCard
                  title="Genetics"
                  weight="20–25% of papers"
                  chips={['Mendelian Inheritance', 'Genetic Engineering', 'Biotechnology']}
                  points={[
                    'Master inheritance patterns',
                    'Practice genetic cross problems',
                    'Understand genetic modification techniques',
                    'Learn to analyze genetic data',
                  ]}
                />
                <TopicCard
                  title="Evolution"
                  weight="15–20% of papers"
                  chips={['Natural Selection', 'Speciation', 'Phylogeny', 'Classification']}
                  points={[
                    'Master evolutionary mechanisms',
                    'Practice phylogenetic tree analysis',
                    'Understand speciation processes',
                    'Learn to evaluate evidence for evolution',
                  ]}
                />
              </div>
            </section>

            <section id="ecology" className="scroll-mt-24">
              <SectionHeading icon={Leaf}>Ecology & Conservation Mastery Guide</SectionHeading>
              <div className="space-y-4">
                <TopicCard
                  title="Ecology"
                  weight="15–20% of papers"
                  chips={['Ecosystems', 'Energy Flow', 'Nutrient Cycles', 'Population Dynamics']}
                  points={[
                    'Master ecosystem interactions',
                    'Practice energy pyramid calculations',
                    'Understand population growth models',
                    'Learn to analyze ecological data',
                  ]}
                />
                <TopicCard
                  title="Conservation Biology"
                  weight="10–15% of papers"
                  chips={['Biodiversity', 'Conservation Methods', 'Environmental Issues']}
                  points={[
                    'Master biodiversity assessment methods',
                    'Practice conservation strategy evaluation',
                    'Understand environmental impact assessment',
                    'Learn to propose conservation solutions',
                  ]}
                />
              </div>
            </section>

            <section id="physiology" className="scroll-mt-24">
              <SectionHeading icon={HeartPulse}>Human Physiology Mastery Guide</SectionHeading>
              <div className="space-y-4">
                <TopicCard
                  title="Body Systems"
                  weight="20–25% of papers"
                  chips={['Digestive System', 'Circulatory System', 'Respiratory System', 'Nervous System']}
                  points={[
                    'Master system interactions',
                    'Practice physiological process explanations',
                    'Understand homeostasis mechanisms',
                    'Learn to analyze medical case studies',
                  ]}
                />
                <TopicCard
                  title="Neurobiology"
                  weight="15–20% of papers"
                  chips={['Brain Structure', 'Neural Communication', 'Behavior', 'Hormones']}
                  points={[
                    'Master neural pathway analysis',
                    'Practice hormone action explanations',
                    'Understand behavioral responses',
                    'Learn to evaluate neurological research',
                  ]}
                />
              </div>
            </section>

            <section id="ia" className="scroll-mt-24">
              <SectionHeading icon={ClipboardList}>Internal Assessment (IA) Guide</SectionHeading>
              <GuideCard>
                <h4 className="font-semibold text-gray-900 mb-3">Key Components of a Successful IA</h4>
                <div className="space-y-3 text-sm">
                  <div>
                    <p><strong className="text-gray-900">Research Question:</strong></p>
                    <p>Develop a clear, focused question that allows for quantitative analysis and demonstrates your understanding of biological concepts.</p>
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
              <SectionHeading icon={Target}>IBDP Biology Exam Strategies</SectionHeading>
              <div className="space-y-4">
                <GuideCard>
                  <h4 className="font-semibold text-gray-900 mb-2">Paper 1 (MCQ) Strategy</h4>
                  <ul className="list-disc ml-5 space-y-1 text-sm text-gray-700">
                    <li>Allocate 1.5 minutes per question maximum</li>
                    <li>Use the elimination method for difficult questions</li>
                    <li>Pay attention to key terms and definitions</li>
                    <li>Don&rsquo;t second-guess yourself unless you find a clear error</li>
                    <li>Review flagged questions if time permits</li>
                  </ul>
                </GuideCard>

                <GuideCard>
                  <h4 className="font-semibold text-gray-900 mb-2">Paper 2 (Structured Questions) Strategy</h4>
                  <ul className="list-disc ml-5 space-y-1 text-sm text-gray-700">
                    <li>Read all questions first and start with your strongest topics</li>
                    <li>Show all working clearly &mdash; partial credit is available</li>
                    <li>Use proper scientific terminology</li>
                    <li>Draw clear diagrams with proper labels</li>
                    <li>Check calculations and units in your final answers</li>
                  </ul>
                </GuideCard>

                <GuideCard>
                  <h4 className="font-semibold text-gray-900 mb-2">Paper 3 (Data Analysis) Strategy</h4>
                  <ul className="list-disc ml-5 space-y-1 text-sm text-gray-700">
                    <li>Read the entire question before starting</li>
                    <li>Identify key data points and relationships</li>
                    <li>Use appropriate statistical methods</li>
                    <li>Show all calculations clearly</li>
                    <li>Draw conclusions based on the data</li>
                  </ul>
                </GuideCard>
              </div>
            </section>

            <section id="mistakes" className="scroll-mt-24">
              <SectionHeading icon={TriangleAlert}>Common IBDP Biology Mistakes to Avoid</SectionHeading>
              <GuideCard>
                <h4 className="font-semibold text-gray-900 mb-3">Top 12 IBDP Biology Pitfalls</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-sm">
                  <div>
                    <ol className="list-decimal ml-5 space-y-1 text-gray-700">
                      <li>Incorrect terminology usage</li>
                      <li>Confusing similar biological processes</li>
                      <li>Missing key steps in explanations</li>
                      <li>Wrong statistical analysis</li>
                      <li>Incorrect graph interpretation</li>
                      <li>Confusing correlation and causation</li>
                    </ol>
                  </div>
                  <div>
                    <ol className="list-decimal ml-5 space-y-1 text-gray-700" start="7">
                      <li>Incorrect experimental design</li>
                      <li>Missing control variables</li>
                      <li>Confusing different biological systems</li>
                      <li>Inadequate explanation of mechanisms</li>
                      <li>Poor time management across papers</li>
                      <li>Not showing working for calculations</li>
                    </ol>
                  </div>
                </div>
              </GuideCard>
            </section>

            <section id="schedule" className="scroll-mt-24">
              <SectionHeading icon={CalendarDays}>Creating Your IBDP Biology Study Schedule</SectionHeading>
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
                      <li>Learn 2–3 new concepts each week</li>
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
              <SectionHeading icon={BookOpen}>Essential IBDP Biology Resources</SectionHeading>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1.5">Recommended Textbooks</h4>
                  <ul className="list-disc ml-5 text-sm space-y-1 text-gray-700">
                    <li>IB Biology Course Book (Oxford) &mdash; comprehensive coverage</li>
                    <li>Biology for the IB Diploma (Cambridge) &mdash; detailed explanations</li>
                    <li>IB Biology Study Guide (Oxford) &mdash; exam-focused content</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1.5">Practice Materials</h4>
                  <ul className="list-disc ml-5 text-sm space-y-1 text-gray-700">
                    <li>IBDP past papers (last 5 years minimum)</li>
                    <li>School mock examination papers</li>
                    <li>Topical practice books for specific biology areas</li>
                    <li>IB Question Bank for targeted practice</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1.5">Digital Tools</h4>
                  <ul className="list-disc ml-5 text-sm space-y-1 text-gray-700">
                    <li>BioNinja for concept summaries</li>
                    <li>Biology problem-solving apps</li>
                    <li>Online biology simulations</li>
                    <li>Anki for memorizing terms and processes</li>
                  </ul>
                </div>
              </div>
            </section>

            <section id="career" className="scroll-mt-24">
              <SectionHeading icon={GraduationCap}>University and Career Pathways</SectionHeading>
              <GuideCard>
                <h4 className="font-semibold text-gray-900 mb-3">Your IBDP Biology Results Open These Doors</h4>
                <div className="space-y-4 text-sm">
                  <div>
                    <strong className="text-gray-900">Level 6-7 in IBDP Biology:</strong>
                    <ul className="list-disc ml-5 mt-1 space-y-1 text-gray-700">
                      <li>Medicine and Healthcare programs</li>
                      <li>Biological Sciences degrees</li>
                      <li>Biotechnology and Research</li>
                      <li>Environmental Science careers</li>
                    </ul>
                  </div>
                  <div>
                    <strong className="text-gray-900">Level 4-5 in IBDP Biology:</strong>
                    <ul className="list-disc ml-5 mt-1 space-y-1 text-gray-700">
                      <li>Biomedical Technology programs</li>
                      <li>Health Sciences degrees</li>
                      <li>Science Education and Communication roles</li>
                      <li>Laboratory and Research positions</li>
                    </ul>
                  </div>
                </div>
              </GuideCard>
            </section>

            <section id="tuition" className="scroll-mt-24">
              <SectionHeading icon={Users}>When to Consider IBDP Biology Tuition</SectionHeading>
              <p>Consider professional IBDP Biology tuition if your child:</p>
              <ul className="list-disc ml-6 space-y-1 mt-3 text-gray-700">
                <li>Struggles with complex biological concepts</li>
                <li>Needs help connecting theoretical knowledge to practical applications</li>
                <li>Requires structured guidance for experimental design</li>
                <li>Lacks confidence in data analysis and interpretation</li>
                <li>Aims for level 7 to meet competitive university course requirements</li>
                <li>Benefits from personalized feedback on answer techniques</li>
              </ul>
              <GuideCard className="mt-4">
                <p className="text-sm"><strong className="text-gray-900">Choose IBDP Biology tutors who:</strong> Have extensive experience with the IBDP syllabus, understand common student misconceptions, can explain complex concepts clearly, provide structured practice programs, and have strong backgrounds in biology or related sciences.</p>
              </GuideCard>
            </section>

            <section id="final-months" className="scroll-mt-24">
              <SectionHeading icon={Hourglass}>Final Two Months IBDP Preparation</SectionHeading>
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
                      <li>Create final summary cards for all key concepts and terminology</li>
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
                    <li>Use any remaining time to check answers and calculations</li>
                  </ul>
                </GuideCard>
              </div>
            </section>

            <section id="post-exam" className="scroll-mt-24">
              <SectionHeading icon={Compass}>Post-Exam Success Planning</SectionHeading>
              <p className="text-pretty">
                Regardless of how you feel after your IBDP Biology exams, focus on the opportunities ahead. Strong biology knowledge opens doors to numerous exciting career paths in healthcare, research, environmental science, and biotechnology.
              </p>
              <GuideCard className="mt-4">
                <h4 className="font-semibold text-gray-900 mb-2">Moving Forward</h4>
                <ul className="list-disc ml-5 space-y-1 text-sm text-gray-700">
                  <li>Use the university application period to explore different biology-related programs</li>
                  <li>Consider internships or research opportunities in biology-related fields</li>
                  <li>Continue developing your analytical and research skills</li>
                  <li>Remember that success in biology is about persistence, not just exam grades</li>
                </ul>
              </GuideCard>
            </section>

            <section id="conclusion" className="scroll-mt-24">
              <SectionHeading icon={Flag}>Conclusion: Your IBDP Biology Success Journey</SectionHeading>
              <p className="text-pretty">
                Achieving excellence in IBDP Biology requires dedication, strategic preparation, and consistent practice. The comprehensive approach outlined in this guide &mdash; from understanding the syllabus structure through mastering each topic area to developing effective exam strategies &mdash; provides you with the roadmap to success.
              </p>
              <p className="mt-3 text-pretty">
                Remember that IBDP Biology is not just about memorizing facts and processes. It&rsquo;s about developing critical thinking skills, understanding the living world around us, and preparing for exciting careers in science and healthcare. Every challenging concept you master and every experiment you conduct builds towards your future success.
              </p>
              <div className="rounded-xl border border-primary/15 bg-primary/5 p-5 sm:p-6 mt-4">
                <p className="font-semibold text-gray-900">
                  Success in IBDP Biology comes from consistent daily practice, understanding rather than memorization, and maintaining confidence in your abilities. Trust your preparation, stay focused during exams, and remember that your hard work will pay off in opening doors to amazing opportunities in science and beyond.
                </p>
              </div>
            </section>

            {/* Conversion block */}
            <RelatedGuides slug="ibdp-biology" />

            <GuideCTA
              title="Find your IBDP Biology tutor"
              description={`Tell us your child’s level and goals. We hand-match a vetted, MOE-familiar IBDP Biology tutor — usually within ${MATCH_TIME} — and parents never pay an agency fee.`}
              buttonText="Find your IBDP Biology tutor"
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
