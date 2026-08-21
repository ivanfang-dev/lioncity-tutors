'use client';

import { motion, MotionConfig } from 'framer-motion';
import { enter } from '@/lib/motion';
import TableOfContents from '@/components/TableOfContents';
import {
  GuideHeader, SectionHeading, GuideCard, GuideTimeline, KeyTakeaways, GuideCTA,
  RelatedGuides, ExamTimetable, ICON_STROKE,
} from '@/components/guide';
import { MATCH_TIME } from '@/data/promises';
import {
  BookOpenCheck, CalendarClock, RefreshCw, Milestone, BookOpen, Lightbulb, ListChecks,
  AlertTriangle, Clock, GraduationCap, Heart, Compass, Users, Target, HelpCircle,
  Calendar, ShieldCheck, Zap, Flag, Brain, Moon, Briefcase, Award,
} from 'lucide-react';
import { A_LEVEL_FAQS } from './faqs.mjs';

// Scroll entrance via the shared `enter()` helper, which rests at the final value —
// a reveal that never fires (tall sections on mobile) leaves content visible.
function Reveal({ children, className }) {
  return (
    <motion.div className={className} {...enter()}>
      {children}
    </motion.div>
  );
}

const tableOfContents = [
  { id: 'gateway', label: 'The A-Levels: gateway to university' },
  { id: 'exam-timetable', label: '2026 exam timetable' },
  { id: 'revised-syllabus', label: 'What changed for 2026' },
  { id: 'campaign', label: 'The two-year campaign' },
  { id: 'strategies', label: 'Subject-specific strategies' },
  { id: 'techniques', label: 'Study techniques that work' },
  { id: 'exam-strategy', label: 'Exam-day strategy' },
  { id: 'pitfalls', label: 'Common pitfalls to avoid' },
  { id: 'study-plan', label: 'Weekly study plan' },
  { id: 'resources', label: 'Essential resources' },
  { id: 'well-being', label: 'Maintaining peak performance' },
  { id: 'pathways', label: 'Life after the A-Levels' },
  { id: 'tuition', label: 'When to consider tuition' },
  { id: 'countdown', label: 'The final 60 days' },
  { id: 'faq', label: 'A-Level FAQs' },
];

const subjectData = [
  {
    name: 'General Paper (GP)',
    icon: '✍️',
    tips: [
      { title: 'Build a Diverse Content Arsenal', description: "GP tests breadth and depth. Create a digital or physical 'content file' organized by key themes (e.g., Science & Tech, The Arts, Politics, Social Issues). For each theme, collate key statistics, relevant real-world examples (local and global), and insightful quotes to substantiate your arguments." },
      { title: 'Master the Application Question (AQ) Demands', description: "The AQ is a test of critical thinking. Practice deconstructing arguments from passages, identifying the author's assumptions and biases. Crucially, you must be able to evaluate these arguments and apply them to the specific context of Singapore, providing local examples to demonstrate deep understanding." },
      { title: 'Refine Essay Structure for Clarity and Cohesion', description: "A-Level essays demand a clear, logical, and persuasive structure. Master the PEEL (Point, Evidence, Explanation, Link) framework for your paragraphs. Use sophisticated signposting (e.g., 'Consequently,', 'In contrast,', 'This paradigm is further complicated by...') to guide the examiner through your line of reasoning." },
    ],
  },
  {
    name: 'H2 Mathematics',
    icon: '🧮',
    tips: [
      { title: 'Cultivate Conceptual Mastery Over Rote Learning', description: "A-Level Math is designed to thwart pure memorization. Invest time in understanding the proofs and derivations behind formulas, especially in Calculus and Vectors. This conceptual depth is what enables you to solve novel, application-based problems that are a hallmark of the exam." },
      { title: 'Leverage the Graphing Calculator (GC) Strategically', description: "Your GC is an indispensable tool, not just a calculator. Master its functions for graphing complex functions, solving systems of equations, and performing statistical tests. Knowing your GC's capabilities can save critical time and allow you to verify answers obtained through manual calculation." },
      { title: 'Simulate Exam Conditions Consistently', description: "The sheer volume of the H2 Math syllabus requires rigorous, timed practice. Work through a wide variety of past-year papers from different JCs. This builds speed, accuracy, and the mental stamina required to perform under pressure. Meticulously review your mistakes to identify and eliminate recurring errors." },
    ],
  },
  {
    name: 'H2 Chemistry',
    icon: '🧪',
    tips: [
      { title: 'Visualize and Master Reaction Mechanisms', description: "Organic Chemistry is often the deciding factor. Don't just memorize reactions; understand the underlying mechanisms (e.g., nucleophilic substitution, electrophilic addition). Use arrow-pushing diagrams to visualize electron flow. This understanding is key to predicting products in unfamiliar reaction schemes." },
      { title: 'Conquer Data Interpretation & Application', description: "Paper 3 heavily tests data analysis. Practice interpreting spectroscopic data (IR, NMR), titration curves, and kinetic graphs. The ability to extract information, draw logical inferences, and apply them to a given chemical context is a skill that separates top students." },
      { title: 'Connect the Dots Across Chemistry Branches', description: "A-Level Chemistry is highly integrated. Questions often require you to link concepts from Physical, Organic, and Inorganic Chemistry (e.g., applying principles of Chemical Bonding to explain the properties of an organic molecule). Use mind maps to visualize these interconnections." },
    ],
  },
  {
    name: 'H2 Physics',
    icon: '⚛️',
    tips: [
      { title: 'Develop Strong Foundational Principles', description: "Physics is hierarchical; complex topics are built on fundamental principles like conservation of energy and momentum. Before tackling advanced concepts like Quantum Physics or Electromagnetism, ensure your grasp of Newtonian Mechanics is flawless. Many challenging questions are simply fundamentals in disguise." },
      { title: 'Hone Your Explanation & Definition Skills', description: "Paper 2 requires precise, keyword-focused explanations. Simply stating a formula is not enough. Practice articulating the physical meaning behind concepts and laws (e.g., Lenz's Law, Principle of Superposition). Create a glossary of precise definitions and commit them to memory." },
      { title: 'Master Experimental Design and Error Analysis', description: "The Planning Question (Q1) in Paper 4 is a common stumbling block. Practice designing viable experiments, identifying key variables, and suggesting methods for uncertainty reduction. This section tests your practical intuition as a scientist and can be a major score differentiator." },
    ],
  },
  {
    name: 'H2 Biology',
    icon: '🧬',
    tips: [
      { title: 'Embrace the Volume with Smart Note-Taking', description: "H2 Biology has the largest content volume. Use smart learning techniques like mind maps, flowcharts for physiological processes, and summary tables to condense information. Focus on understanding pathways (e.g., Cellular Respiration, Photosynthesis) rather than just memorizing isolated facts." },
      { title: 'Develop Application Skills for Novel Scenarios', description: "Top-band questions often present novel biological scenarios and require you to apply your knowledge. For example, applying principles of genetics to a previously unseen pedigree chart. Practice is key to developing this intellectual flexibility and avoiding 'template' answers." },
      { title: 'Master the Art of Comparison', description: "Many essay questions require you to 'Compare and contrast' (e.g., mitosis vs. meiosis; prokaryotic vs. eukaryotic cells). Practice structuring these answers using a point-by-point comparison table to ensure your response is balanced, comprehensive, and directly addresses the question." },
    ],
  },
  {
    name: 'H2 Economics',
    icon: '📈',
    tips: [
      { title: 'Go Beyond Theory with Deep Evaluation', description: "Getting a distinction in Economics requires strong evaluative skills. For any policy you discuss (e.g., fiscal, monetary), you must analyze its limitations, unintended consequences, and conflicting outcomes. Use the 'UDEE' (Understand, Define, Explain, Evaluate) framework, dedicating significant effort to the evaluation part." },
      { title: 'Integrate Real-World Context in Case Studies', description: "Paper 2 is entirely application-based. You must be able to dissect case study extracts, identify the relevant economic concepts, and use data from the extracts to support your analysis. Regularly read economic news to build a rich repository of real-world examples to enhance your answers." },
      { title: 'Draw Accurate, Well-Labelled, and Integrated Diagrams', description: "Diagrams are your primary analytical tool. Practice drawing them from memory until they are second nature. Ensure all axes, curves, and equilibrium points are accurately labelled. In essays, explicitly refer to your diagrams to explain complex concepts, making them an integral part of your argument." },
    ],
  },
  {
    name: 'H2 History',
    icon: '📜',
    tips: [
      { title: 'Master Source-Based Question (SBQ) Skills', description: "History is not just about content; it's about analysis. For SBQs, practice identifying provenance, purpose, and tone to evaluate the reliability and utility of sources. Master the skills of comparison, cross-referencing, and detecting authorial bias to construct nuanced arguments." },
      { title: 'Engage with Historiography', description: "Top-tier history essays engage with different historical interpretations (historiography). For key events like the Cold War, understand the arguments of different schools of thought (e.g., Orthodox, Revisionist, Post-Revisionist). Incorporating these into your essays demonstrates a higher level of historical understanding." },
      { title: 'Craft a Strong, Thesis-Driven Argument', description: "An A-Level History essay must have a clear, consistent, and well-defended thesis statement that is established in the introduction and sustained throughout. Each paragraph should contribute directly to proving your overall argument, avoiding a narrative or descriptive approach." },
    ],
  },
  {
    name: 'H2 Literature in English',
    icon: '📚',
    tips: [
      { title: 'Develop Sophisticated Close Reading Skills', description: "Literature is about analysing the 'how' as much as the 'what'. Practice detailed textual analysis (close reading), paying attention to literary devices, imagery, sentence structure (syntax), and tone. Your analysis must be grounded in specific evidence from the text." },
      { title: 'Engage with Literary Criticism and Theory', description: "Beyond your personal interpretation, showing awareness of different critical perspectives (e.g., feminist, post-colonial, psychoanalytic) can elevate your analysis. Understanding these lenses allows you to offer more nuanced and academically rigorous interpretations of your set texts." },
      { title: 'Master the Unseen Paper', description: "The unseen paper is a true test of your analytical abilities. Practice with a wide range of poems and prose passages. Develop a systematic approach: first impressions, identifying key themes and devices, analysing structure, and forming a coherent interpretation, all under timed conditions." },
    ],
  },
];

const campaignTimeline = [
  {
    period: 'JC1 Year-End to March of JC2',
    title: 'Syllabus Completion & Deep Understanding',
    icon: Calendar,
    description: 'Master the remaining JC2 topics while constantly revisiting JC1 content — the goal is an interconnected understanding, not just coverage. Consolidate notes and clear every conceptual doubt with a teacher or tutor.',
  },
  {
    period: 'April to June (Mid-Year Exams)',
    title: 'Targeted Revision & Prelim Preparation',
    icon: ShieldCheck,
    description: 'Begin topical past-paper practice to find and fix weaknesses. Use the mid-year exams as a genuine benchmark, then build a targeted plan for the final stretch from the results.',
  },
  {
    period: 'July to September (Prelims)',
    title: 'Full Mock Papers & Stamina Building',
    icon: Zap,
    description: 'Shift to full-length papers from other JCs under strict exam conditions. Prelims are the most realistic simulation before the real thing — use them to perfect timing and technique.',
  },
  {
    period: 'October to the A-Levels',
    title: 'Strategic Refinement & Mental Preparation',
    icon: Flag,
    description: 'Stop learning new content. Review mistakes, memorise key definitions and formulas, reread your content files, and prioritise sleep and well-being ahead of peak performance.',
  },
];

const mistakes = [
  {
    title: 'Underestimating the JC1 to JC2 Jump',
    description: "The pace and depth of the JC2 curriculum are significantly more intense than in JC1. Many students struggle because they don't adjust their study habits, leading to a snowball effect of falling behind. What worked in JC1 is often insufficient for JC2.",
    solution: 'Start revising JC1 content during the JC1 year-end holidays. Treat the beginning of JC2 as a critical period to establish a rigorous and disciplined study routine. Stay consistently on top of your tutorials and lectures from day one.',
  },
  {
    title: 'Neglecting General Paper (GP) until the last minute',
    description: 'GP is not a subject you can cram for. It requires a broad knowledge of current affairs and the ability to construct coherent, nuanced arguments. Last-minute reading will be superficial and insufficient for the demands of the GP essay and AQ.',
    solution: 'Make reading a weekly habit from the start of JC1. Dedicate a few hours each week to reading from diverse, quality sources. Discuss these issues with peers to sharpen your thinking and argumentation skills. Build your content file progressively.',
  },
  {
    title: 'Memorizing Answers Instead of Understanding Concepts',
    description: 'The A-Levels are designed to test higher-order thinking, not rote memorization. Examiners can easily spot memorized essays or solutions. This approach fails when faced with novel questions that require the application of concepts in unfamiliar contexts.',
    solution: "Focus on the 'why' behind every concept, formula, and theory. Use techniques like the Feynman method to test your understanding. Practice applying your knowledge to a wide variety of questions from different schools' prelim papers to build intellectual flexibility.",
  },
  {
    title: 'Ignoring Mental Health and Sacrificing Sleep',
    description: 'The A-Level marathon is mentally and emotionally taxing. Chronic sleep deprivation and high stress levels impair cognitive function, memory recall, and critical thinking. Burnout before the exam is a very real and dangerous possibility.',
    solution: 'Schedule regular breaks and maintain at least one hobby or sport. Aim for 7-8 hours of quality sleep per night. Learn to recognize the signs of burnout and seek support from friends, family, or school counsellors. A healthy mind is your most powerful asset.',
  },
];

const studyTechniques = [
  { title: 'The Pomodoro Technique', description: 'Work in focused 25-minute sprints followed by a 5-minute break. Keeps concentration high and prevents burnout across a long revision session.' },
  { title: 'Active Recall', description: 'After studying a topic, close your notes and write down everything you remember. Retrieval strengthens memory far more than rereading ever does.' },
  { title: 'Spaced Repetition', description: 'Revisit material at growing intervals — a day, then three days, then a week — so it moves from short-term to long-term memory instead of fading after the first pass.' },
  { title: 'The Feynman Technique', description: 'Explain a concept in the simplest language you can, as if teaching a junior. Wherever you reach for jargon or get stuck, that is the gap in your understanding.' },
  { title: 'Mind Mapping', description: 'Draw the connections between topics — especially powerful for content-heavy subjects like Biology, History and Economics, where the links between ideas carry marks.' },
];

const examStrategyPhases = [
  {
    title: 'Before the Exam',
    points: [
      "Confirm your timetable, venue and required materials — GC, stationery, ID — the night before",
      'Get at least 8 hours of sleep and eat a proper meal; skip anything heavy or unfamiliar',
      'Do a light review of formulas and definitions only — this is not the time to learn new content',
      "Arrive early enough that a delayed bus or a wrong room doesn't become a crisis",
    ],
  },
  {
    title: 'During the Exam',
    points: [
      'Scan the whole paper first and mark the questions you are most confident on',
      'Start with your strongest questions to build momentum and secure marks early',
      'Show every step of working — method marks are real marks',
      "Answer the command word that is actually asked ('evaluate' is not 'describe')",
      'If a question stalls you, move on and return to it once the rest is done',
    ],
  },
  {
    title: 'Time Management',
    points: [
      'Budget roughly a minute per mark as a starting rule, then adjust per paper',
      'Plan your section-by-section time allocation before you start writing',
      'Reserve the last 10–15 minutes to check working, units and that every question is attempted',
      'The only way to internalise pacing is timed practice under real conditions — do it repeatedly',
    ],
  },
];

const weeklyPlan = {
  weekdays: [
    'Start with a short break after school before beginning any deep work',
    'One focused 90-minute block on your heaviest subject (often H2 Math or a science)',
    'A second block rotating through the remaining subjects',
    'A short nightly review of what was covered and what tomorrow needs',
  ],
  weekends: [
    'Morning: a full timed past-paper attempt under exam conditions',
    "Afternoon: mark it strictly against the Cambridge scheme and log every mark lost",
    "Evening: a weekly review — consolidate the week's mistakes into your content file or formula sheet",
    "Sunday night: set next week's priority subject before Monday arrives",
  ],
};

const resourceGroups = [
  {
    title: 'Official resources',
    items: [
      'SEAB syllabus documents for every H1/H2 subject — the actual scope of what can be examined',
      'Past-year papers from your own JC and, once those run out, from other JCs',
      'Prelim papers, which are the closest realistic simulation of the actual exam',
    ],
  },
  {
    title: 'Subject tools',
    items: [
      "A graphing calculator (GC) you know inside out, not one you're still learning under exam pressure",
      'A content file for GP and the Humanities, built weekly rather than crammed in Term 3',
      'Mark schemes for every past paper attempted — mark yourself before a tutor or teacher does',
    ],
  },
  {
    title: 'Digital tools',
    items: [
      'Scheduling: Google Calendar or Todoist to actually protect study blocks',
      'Flashcards: Anki for spaced repetition, especially definitions and formulas',
      'Focus: Forest or a similar app to keep your phone out of study sessions',
    ],
  },
];

const countdownPhases = [
  {
    range: 'Days 60–31',
    title: 'Comprehensive Review & Gap-Filling',
    points: [
      'Finish any remaining content and move to daily topical past-paper practice',
      'Use your results so far to aggressively target the weakest topics, not the comfortable ones',
      'Start condensing notes into a single-page summary per subject',
    ],
  },
  {
    range: 'Days 30–15',
    title: 'Peak Practice & Simulation',
    points: [
      'Shift to full papers under strict timing, daily where possible',
      'Refine technique, precision and pacing rather than covering new ground',
      'Track whether marks are lost early (a rushed start) or late (ran out of time) and adjust',
    ],
  },
  {
    range: 'Days 14–1',
    title: 'Final Consolidation & Mental Prep',
    points: [
      'Move from intense practice to light review of your content files and mistake log',
      'Finalise your cheat sheets — the single-page distillation of each subject',
      'Protect sleep and routine over squeezing in one more topic',
    ],
  },
];

const wellbeingPillars = [
  {
    icon: Brain,
    iconClass: 'bg-green-100 text-green-600',
    title: 'Combat Cognitive Fatigue',
    description: 'The intensity of A-Level preparation can lead to cognitive fatigue. Use spaced repetition and active recall to study more efficiently, and take short, frequent breaks rather than marathon sessions.',
  },
  {
    icon: Moon,
    iconClass: 'bg-blue-100 text-blue-600',
    title: 'Optimize Your Sleep',
    description: 'Sleep is when your brain consolidates learning into long-term memory. Establish a strict pre-bed routine, avoid caffeine late in the day, and aim for 7–9 hours of uninterrupted sleep.',
  },
  {
    icon: Heart,
    iconClass: 'bg-red-100 text-red-600',
    title: 'Nutrition for the Brain',
    description: 'Your diet directly impacts focus and energy. Prioritise omega-3s, antioxidants and complex carbohydrates, stay hydrated, and avoid sugary snacks that cause energy crashes.',
  },
];

const pathways = [
  {
    icon: GraduationCap,
    title: 'Local Universities (NUS, NTU, SMU etc.)',
    description: 'The primary goal for most A-Level graduates. Your Rank Points (RP) determine eligibility for competitive courses, and a strong CCA portfolio can be a differentiating factor for admission.',
  },
  {
    icon: Briefcase,
    title: 'Overseas Universities (UK, US, Australia)',
    description: 'A-Levels are internationally recognised and can grant direct entry into top universities worldwide. Application processes may require additional essays, interviews, or tests like the SAT or BMAT.',
  },
  {
    icon: Award,
    title: 'Scholarships & Special Programmes',
    description: 'Excellent A-Level results open doors to scholarships from government bodies (PSC), statutory boards, and private organisations — these often cover tuition and provide an allowance, but come with a service bond.',
  },
];

const revisedSyllabusRows = [
  {
    subject: 'H2 Chemistry',
    legacy: '9729',
    revised: '9476',
    whatChanged: 'Practical paper: 55 → 50 marks (still 20% weighting). Paper 3: 80 → 75 marks, with Section A 60 → 55 marks.',
  },
  {
    subject: 'H2 Physics',
    legacy: '9749',
    revised: '9478',
    whatChanged: 'Practical paper: 55 → 50 marks (still 20% weighting). Candidates now process and analyse data using spreadsheet software.',
  },
  {
    subject: 'H2 Biology',
    legacy: '9744',
    revised: '9477',
    whatChanged: 'Practical paper: 55 → 50 marks (still 20% weighting).',
  },
];

export default function ALevelPrepClient() {
  const whatsappMessage = `Hi LionCity Tutors! I'd like help finding an A-Level (JC) tutor.

Subject(s):
Student level (e.g. JC1 / JC2):
Current grade:
Preferred days & timing: `;
  const whatsappHref = `https://wa.me/6588701152?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <MotionConfig reducedMotion="user">
      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16">
        <div className="mx-auto max-w-2xl lg:max-w-none lg:grid lg:grid-cols-[minmax(0,42rem)_15rem] lg:justify-center lg:gap-12">
          <div>
            <Reveal>
              <GuideHeader
                title="A-Level Preparation Guide 2026: H1 & H2 Study Plan"
                author="By the LionCity Tutors JC Team"
                meta="Updated August 1, 2026 · 16 min read"
                imageSrc="/jc-tuition_optimized.webp"
                imageAlt="A JC tutor working through a concept with a student ahead of the A-Level exams."
              />
            </Reveal>

            <article className="space-y-12 text-gray-700 leading-relaxed">
              <p className="text-lg text-gray-800 leading-relaxed text-pretty">
                The Singapore-Cambridge GCE A-Level exam is the culmination of the pre-university journey and the primary benchmark for university admission. This guide covers the official 2026 timetable, what changed in the revised H2 science syllabuses, subject-by-subject strategies, and a full JC1-to-JC2 study plan.
              </p>

              <KeyTakeaways
                items={[
                  <>The 2026 A-Levels run <span className="tabular-nums">2 June – 27 November</span>, with results out <span className="tabular-nums">19–23 February 2027</span>.</>,
                  <>H2 Chemistry, Physics and Biology move to revised syllabuses (9476, 9478, 9477) for school candidates in 2026.</>,
                  <>A two-year plan beats a Term 3 sprint — finish content before the JC2 June holidays, then shift to full timed papers.</>,
                  <>Your Rank Points (RP) come from every H1 and H2 subject, including General Paper and Project Work.</>,
                ]}
              />

              <section id="gateway" className="scroll-mt-24">
                <SectionHeading icon={BookOpenCheck}>The A-Levels: Your Gateway to University and Beyond</SectionHeading>
                <GuideCard>
                  <p className="text-sm text-gray-700">
                    The A-Levels test depth, critical thinking and intellectual maturity rather than content recall alone — success takes a strategic, disciplined approach, not just hours logged. Your Rank Points (RP) are the currency of university admission: every H2 and H1 subject, including General Paper and Project Work, contributes to the final score that determines eligibility for competitive courses.
                  </p>
                </GuideCard>
              </section>

              <section id="exam-timetable" className="scroll-mt-24">
                <SectionHeading icon={CalendarClock}>{A_LEVEL_FAQS[0].question}</SectionHeading>
                <p className="mb-4 text-sm text-gray-700">{A_LEVEL_FAQS[0].answer}</p>
                <ExamTimetable examSlug="a-level" caption="Official 2026 GCE A-Level timetable, as published by SEAB." />
              </section>

              <section id="revised-syllabus" className="scroll-mt-24">
                <SectionHeading icon={RefreshCw}>What Changed in the 2026 A-Level Science Syllabuses?</SectionHeading>
                <p className="mb-4 text-sm text-gray-700">{A_LEVEL_FAQS[2].answer}</p>
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
                      <thead>
                        <tr className="border-b-2 border-gray-200 bg-gray-100 text-gray-900">
                          <th scope="col" className="py-3 px-4 font-semibold">Subject</th>
                          <th scope="col" className="py-3 px-4 font-semibold">Legacy code (last exam 2026)</th>
                          <th scope="col" className="py-3 px-4 font-semibold">Revised code (from 2026)</th>
                          <th scope="col" className="py-3 px-4 font-semibold">What changed</th>
                        </tr>
                      </thead>
                      <tbody>
                        {revisedSyllabusRows.map((row) => (
                          <tr key={row.subject} className="border-b border-gray-100">
                            <th scope="row" className="py-3 px-4 align-top font-medium text-gray-900">{row.subject}</th>
                            <td className="py-3 px-4 align-top tabular-nums text-gray-700">{row.legacy}</td>
                            <td className="py-3 px-4 align-top tabular-nums text-gray-700">{row.revised}</td>
                            <td className="py-3 px-4 align-top text-gray-700">{row.whatChanged}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="mt-4 flex items-start gap-3 rounded-xl border-l-4 border-accent bg-accent/10 p-5">
                  <AlertTriangle className="mt-0.5 h-6 w-6 shrink-0 text-accent" strokeWidth={ICON_STROKE} aria-hidden="true" />
                  <p className="text-sm text-gray-800">
                    <strong className="font-semibold">If you&rsquo;re sitting a legacy paper (9729, 9749 or 9744) in 2026,</strong> this is your final attempt on that syllabus — SEAB will not offer it again. Any resit must be on the revised syllabus (9476, 9478 or 9477) instead.
                  </p>
                </div>
              </section>

              <section id="campaign" className="scroll-mt-24">
                <SectionHeading icon={Milestone}>The Two-Year A-Level Campaign</SectionHeading>
                <p className="mb-6 text-sm text-gray-700">A strategic timeline for the marathon from the end of JC1 to the final paper.</p>
                <Reveal>
                  <GuideTimeline items={campaignTimeline} variant="graph" />
                </Reveal>
              </section>

              <section id="strategies" className="scroll-mt-24">
                <SectionHeading icon={BookOpen}>Subject-Specific Strategies</SectionHeading>
                <p className="mb-6 text-sm text-gray-700">Move beyond surface revision with techniques for the core H1 and H2 subjects.</p>
                <Reveal className="grid gap-6 md:grid-cols-2">
                  {subjectData.map((subject) => (
                    <GuideCard key={subject.name}>
                      <h4 className="mb-3 flex items-center gap-2 text-base font-semibold text-gray-900">
                        <span className="text-xl" aria-hidden="true">{subject.icon}</span>
                        {subject.name}
                      </h4>
                      <div className="space-y-3">
                        {subject.tips.map((tip) => (
                          <div key={tip.title}>
                            <p className="text-sm font-semibold text-primary">{tip.title}</p>
                            <p className="mt-0.5 text-sm text-gray-700">{tip.description}</p>
                          </div>
                        ))}
                      </div>
                    </GuideCard>
                  ))}
                </Reveal>
              </section>

              <section id="techniques" className="scroll-mt-24">
                <SectionHeading icon={Lightbulb}>Study Techniques That Work</SectionHeading>
                <GuideCard>
                  <h4 className="mb-3 font-semibold text-gray-900">Proven Methods for Deeper Learning</h4>
                  <div className="space-y-3 text-sm">
                    {studyTechniques.map((technique) => (
                      <div key={technique.title}>
                        <p><strong className="text-gray-900">{technique.title}:</strong></p>
                        <p className="text-gray-700">{technique.description}</p>
                      </div>
                    ))}
                  </div>
                </GuideCard>
              </section>

              <section id="exam-strategy" className="scroll-mt-24">
                <SectionHeading icon={ListChecks}>Exam-Day Strategy</SectionHeading>
                <div className="space-y-4">
                  {examStrategyPhases.map((phase) => (
                    <GuideCard key={phase.title}>
                      <h4 className="mb-2 font-semibold text-gray-900">{phase.title}</h4>
                      <ul className="ml-5 list-disc space-y-1 text-sm text-gray-700">
                        {phase.points.map((point) => (
                          <li key={point}>{point}</li>
                        ))}
                      </ul>
                    </GuideCard>
                  ))}
                </div>
              </section>

              <section id="pitfalls" className="scroll-mt-24">
                <SectionHeading icon={AlertTriangle}>Common A-Level Pitfalls to Avoid</SectionHeading>
                <Reveal className="grid gap-6 md:grid-cols-2">
                  {mistakes.map((mistake) => (
                    <div key={mistake.title} className="rounded-xl border border-red-100 bg-red-50 p-5">
                      <h4 className="mb-2 font-semibold text-red-800">{mistake.title}</h4>
                      <p className="mb-3 text-sm text-gray-700">{mistake.description}</p>
                      <div className="rounded-lg border border-green-200 bg-green-50 p-3">
                        <p className="text-sm text-green-900"><strong className="font-semibold">The fix:</strong> {mistake.solution}</p>
                      </div>
                    </div>
                  ))}
                </Reveal>
              </section>

              <section id="study-plan" className="scroll-mt-24">
                <SectionHeading icon={Clock}>Creating Your Weekly Study Plan</SectionHeading>
                <GuideCard>
                  <h4 className="mb-3 font-semibold text-gray-900">A Starting Template — Adapt It to Your CCA and Energy Levels</h4>
                  <div className="grid gap-6 text-sm md:grid-cols-2">
                    <div>
                      <p className="mb-1.5 font-semibold text-gray-900">Weekdays</p>
                      <ul className="ml-5 list-disc space-y-1 text-gray-700">
                        {weeklyPlan.weekdays.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="mb-1.5 font-semibold text-gray-900">Weekends</p>
                      <ul className="ml-5 list-disc space-y-1 text-gray-700">
                        {weeklyPlan.weekends.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </GuideCard>
              </section>

              <section id="resources" className="scroll-mt-24">
                <SectionHeading icon={GraduationCap}>Essential Resources &amp; Tools</SectionHeading>
                <div className="space-y-4">
                  {resourceGroups.map((group) => (
                    <div key={group.title}>
                      <h4 className="mb-1.5 font-semibold text-gray-900">{group.title}</h4>
                      <ul className="ml-5 list-disc space-y-1 text-sm text-gray-700">
                        {group.items.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>

              <section id="well-being" className="scroll-mt-24">
                <SectionHeading icon={Heart}>Maintaining Peak Performance</SectionHeading>
                <p className="mb-6 text-sm text-gray-700">Your mental and physical well-being are non-negotiable parts of A-Level preparation, not an afterthought.</p>
                <Reveal className="grid gap-8 sm:grid-cols-3">
                  {wellbeingPillars.map((pillar) => (
                    <div key={pillar.title} className="text-center">
                      <div className={`mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full ${pillar.iconClass}`}>
                        <pillar.icon className="h-6 w-6" strokeWidth={ICON_STROKE} aria-hidden="true" />
                      </div>
                      <h4 className="mb-1.5 font-semibold text-gray-900">{pillar.title}</h4>
                      <p className="text-sm text-gray-700">{pillar.description}</p>
                    </div>
                  ))}
                </Reveal>
              </section>

              <section id="pathways" className="scroll-mt-24">
                <SectionHeading icon={Compass}>Life After the A-Levels</SectionHeading>
                <p className="mb-6 text-sm text-gray-700">Strong A-Level results open doors both locally and globally — here&rsquo;s what each path requires.</p>
                <Reveal className="grid gap-6 md:grid-cols-3">
                  {pathways.map((path) => (
                    <GuideCard key={path.title}>
                      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <path.icon className="h-5 w-5" strokeWidth={ICON_STROKE} aria-hidden="true" />
                      </div>
                      <h4 className="mb-2 font-semibold text-gray-900">{path.title}</h4>
                      <p className="text-sm text-gray-700">{path.description}</p>
                    </GuideCard>
                  ))}
                </Reveal>
              </section>

              <section id="tuition" className="scroll-mt-24">
                <SectionHeading icon={Users}>When to Consider Specialist Tuition</SectionHeading>
                <p className="mb-3 text-sm text-gray-700">
                  In a high-stakes environment, targeted guidance can be the difference between a good grade and a distinction. A specialist JC tutor offers what a school classroom often cannot:
                </p>
                <ul className="ml-6 list-disc space-y-1 text-sm text-gray-700">
                  <li><strong className="text-gray-900">Deconstructing complex questions:</strong> breaking higher-order and synoptic questions into manageable parts with an experienced guide</li>
                  <li><strong className="text-gray-900">Customised pacing:</strong> moving ahead of the school curriculum or spending more time on weak topics</li>
                  <li><strong className="text-gray-900">Curated resources:</strong> a tutor&rsquo;s collection of challenging practice papers, summary notes and exam strategies</li>
                </ul>
              </section>

              <section id="countdown" className="scroll-mt-24">
                <SectionHeading icon={Target}>The Final 60-Day Countdown</SectionHeading>
                <GuideCard>
                  <h4 className="mb-3 font-semibold text-gray-900">An Intensive Strategy for the Home Stretch</h4>
                  <div className="space-y-4 text-sm">
                    {countdownPhases.map((phase) => (
                      <div key={phase.range}>
                        <p className="font-semibold text-gray-900">{phase.range}: {phase.title}</p>
                        <ul className="ml-5 mt-1 list-disc space-y-1 text-gray-700">
                          {phase.points.map((point) => (
                            <li key={point}>{point}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </GuideCard>
              </section>

              <RelatedGuides slug="a-level-prep" heading="Explore Our Other A-Level Resources" showHub={false} limit={20} />

              <section id="faq" className="scroll-mt-24">
                <SectionHeading icon={HelpCircle}>A-Level FAQs</SectionHeading>
                <div className="space-y-6">
                  {A_LEVEL_FAQS.map((faq) => (
                    <div key={faq.question}>
                      <h3 className="text-lg font-semibold text-gray-900">{faq.question}</h3>
                      <p className="mt-1 text-sm text-gray-700">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </section>

              <GuideCTA
                title="Find your specialist A-Level tutor"
                description={`Tell us your child's subjects and goals. We hand-match a vetted, MOE-familiar JC tutor — usually within ${MATCH_TIME} — and parents never pay an agency fee.`}
                buttonText="Find your A-Level tutor"
                whatsappHref={whatsappHref}
              />
            </article>
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <TableOfContents items={tableOfContents} />
            </div>
          </aside>
        </div>
      </main>
    </MotionConfig>
  );
}
