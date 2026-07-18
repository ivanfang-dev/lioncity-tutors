'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
    ArrowRight, 
    BookOpenCheck, 
    Calendar, 
    ShieldCheck, 
    Zap, 
    Flag, 
    AlertTriangle, 
    XCircle, 
    Heart, 
    Brain, 
    Moon,
    GraduationCap,
    Briefcase,
    ArrowUpRight,
    Check,
    ClipboardCheck,
    Bell,
    FileText,
    Target
} from 'lucide-react';

// Data for sections, tailored for A-Levels
const subjectData = {
    'General Paper (GP)': {
        icon: '✍️',
        tips: [
            { title: 'Build a Diverse Content Arsenal', description: "GP tests breadth and depth. Create a digital or physical 'content file' organized by key themes (e.g., Science & Tech, The Arts, Politics, Social Issues). For each theme, collate key statistics, relevant real-world examples (local and global), and insightful quotes to substantiate your arguments." },
            { title: 'Master the Application Question (AQ) Demands', description: "The AQ is a test of critical thinking. Practice deconstructing arguments from passages, identifying the author's assumptions and biases. Crucially, you must be able to evaluate these arguments and apply them to the specific context of Singapore, providing local examples to demonstrate deep understanding." },
            { title: 'Refine Essay Structure for Clarity and Cohesion', description: "A-Level essays demand a clear, logical, and persuasive structure. Master the PEEL (Point, Evidence, Explanation, Link) framework for your paragraphs. Use sophisticated signposting (e.g., 'Consequently,', 'In contrast,', 'This paradigm is further complicated by...') to guide the examiner through your line of reasoning." }
        ]
    },
    'H2 Mathematics': {
        icon: '🧮',
        tips: [
            { title: 'Cultivate Conceptual Mastery Over Rote Learning', description: "A-Level Math is designed to thwart pure memorization. Invest time in understanding the proofs and derivations behind formulas, especially in Calculus and Vectors. This conceptual depth is what enables you to solve novel, application-based problems that are a hallmark of the exam." },
            { title: 'Leverage the Graphing Calculator (GC) Strategically', description: "Your GC is an indispensable tool, not just a calculator. Master its functions for graphing complex functions, solving systems of equations, and performing statistical tests. Knowing your GC's capabilities can save critical time and allow you to verify answers obtained through manual calculation." },
            { title: 'Simulate Exam Conditions Consistently', description: "The sheer volume of the H2 Math syllabus requires rigorous, timed practice. Work through a wide variety of past-year papers from different JCs. This builds speed, accuracy, and the mental stamina required to perform under pressure. Meticulously review your mistakes to identify and eliminate recurring errors." }
        ]
    },
    'H2 Chemistry': {
        icon: '🧪',
        tips: [
            { title: 'Visualize and Master Reaction Mechanisms', description: "Organic Chemistry is often the deciding factor. Don't just memorize reactions; understand the underlying mechanisms (e.g., nucleophilic substitution, electrophilic addition). Use arrow-pushing diagrams to visualize electron flow. This understanding is key to predicting products in unfamiliar reaction schemes." },
            { title: 'Conquer Data Interpretation & Application', description: "Paper 3 heavily tests data analysis. Practice interpreting spectroscopic data (IR, NMR), titration curves, and kinetic graphs. The ability to extract information, draw logical inferences, and apply them to a given chemical context is a skill that separates top students." },
            { title: 'Connect the Dots Across Chemistry Branches', description: "A-Level Chemistry is highly integrated. Questions often require you to link concepts from Physical, Organic, and Inorganic Chemistry (e.g., applying principles of Chemical Bonding to explain the properties of an organic molecule). Use mind maps to visualize these interconnections." }
        ]
    },
    'H2 Physics': {
        icon: '⚛️',
        tips: [
            { title: 'Develop Strong Foundational Principles', description: "Physics is hierarchical; complex topics are built on fundamental principles like conservation of energy and momentum. Before tackling advanced concepts like Quantum Physics or Electromagnetism, ensure your grasp of Newtonian Mechanics is flawless. Many challenging questions are simply fundamentals in disguise." },
            { title: 'Hone Your Explanation & Definition Skills', description: "Paper 2 requires precise, keyword-focused explanations. Simply stating a formula is not enough. Practice articulating the physical meaning behind concepts and laws (e.g., Lenz's Law, Principle of Superposition). Create a glossary of precise definitions and commit them to memory." },
            { title: 'Master Experimental Design and Error Analysis', description: "The Planning Question (Q1) in Paper 4 is a common stumbling block. Practice designing viable experiments, identifying key variables, and suggesting methods for uncertainty reduction. This section tests your practical intuition as a scientist and can be a major score differentiator." }
        ]
    },
    'H2 Biology': {
        icon: '🧬',
        tips: [
            { title: 'Embrace the Volume with Smart Note-Taking', description: "H2 Biology has the largest content volume. Use smart learning techniques like mind maps, flowcharts for physiological processes, and summary tables to condense information. Focus on understanding pathways (e.g., Cellular Respiration, Photosynthesis) rather than just memorizing isolated facts." },
            { title: 'Develop Application Skills for Novel Scenarios', description: "Top-band questions often present novel biological scenarios and require you to apply your knowledge. For example, applying principles of genetics to a previously unseen pedigree chart. Practice is key to developing this intellectual flexibility and avoiding 'template' answers." },
            { title: 'Master the Art of Comparison', description: "Many essay questions require you to 'Compare and contrast' (e.g., mitosis vs. meiosis; prokaryotic vs. eukaryotic cells). Practice structuring these answers using a point-by-point comparison table to ensure your response is balanced, comprehensive, and directly addresses the question." }
        ]
    },
    'H2 Economics': {
        icon: '📈',
        tips: [
            { title: 'Go Beyond Theory with Deep Evaluation', description: "Getting a distinction in Economics requires strong evaluative skills. For any policy you discuss (e.g., fiscal, monetary), you must analyze its limitations, unintended consequences, and conflicting outcomes. Use the 'UDEE' (Understand, Define, Explain, Evaluate) framework, dedicating significant effort to the evaluation part." },
            { title: 'Integrate Real-World Context in Case Studies', description: "Paper 2 is entirely application-based. You must be able to dissect case study extracts, identify the relevant economic concepts, and use data from the extracts to support your analysis. Regularly read economic news to build a rich repository of real-world examples to enhance your answers." },
            { title: 'Draw Accurate, Well-Labelled, and Integrated Diagrams', description: "Diagrams are your primary analytical tool. Practice drawing them from memory until they are second nature. Ensure all axes, curves, and equilibrium points are accurately labelled. In essays, explicitly refer to your diagrams to explain complex concepts, making them an integral part of your argument." }
        ]
    },
     'H2 History': {
        icon: '📜',
        tips: [
            { title: 'Master Source-Based Question (SBQ) Skills', description: "History is not just about content; it's about analysis. For SBQs, practice identifying provenance, purpose, and tone to evaluate the reliability and utility of sources. Master the skills of comparison, cross-referencing, and detecting authorial bias to construct nuanced arguments." },
            { title: 'Engage with Historiography', description: "Top-tier history essays engage with different historical interpretations (historiography). For key events like the Cold War, understand the arguments of different schools of thought (e.g., Orthodox, Revisionist, Post-Revisionist). Incorporating these into your essays demonstrates a higher level of historical understanding." },
            { title: 'Craft a Strong, Thesis-Driven Argument', description: "An A-Level History essay must have a clear, consistent, and well-defended thesis statement that is established in the introduction and sustained throughout. Each paragraph should contribute directly to proving your overall argument, avoiding a narrative or descriptive approach." }
        ]
    },
    'H2 Literature in English': {
        icon: '📚',
        tips: [
            { title: 'Develop Sophisticated Close Reading Skills', description: "Literature is about analysing the 'how' as much as the 'what'. Practice detailed textual analysis (close reading), paying attention to literary devices, imagery, sentence structure (syntax), and tone. Your analysis must be grounded in specific evidence from the text." },
            { title: 'Engage with Literary Criticism and Theory', description: "Beyond your personal interpretation, showing awareness of different critical perspectives (e.g., feminist, post-colonial, psychoanalytic) can elevate your analysis. Understanding these lenses allows you to offer more nuanced and academically rigorous interpretations of your set texts." },
            { title: 'Master the Unseen Paper', description: "The unseen paper is a true test of your analytical abilities. Practice with a wide range of poems and prose passages. Develop a systematic approach: first impressions, identifying key themes and devices, analysing structure, and forming a coherent interpretation, all under timed conditions." }
        ]
    }
};

const timelineData = [
  {
    period: 'JC1 Year-End to March of JC2',
    icon: <Calendar className="h-8 w-8 text-white" />,
    bgColor: 'bg-blue-500',
    title: 'Syllabus Completion & Deep Understanding',
    description: 'This is the most critical phase. Focus on mastering the remaining JC2 topics while constantly revisiting JC1 content. The goal is not just to cover the syllabus, but to achieve a deep, interconnected understanding. Consolidate notes and clarify all conceptual doubts with teachers or tutors.',
  },
  {
    period: 'April to June (Mid-Year Exams)',
    icon: <ShieldCheck className="h-8 w-8 text-white" />,
    bgColor: 'bg-green-500',
    title: 'Targeted Revision & Prelim Preparation',
    description: 'Begin intensive, focused revision. Start working through topical past papers to identify and rectify weaknesses. Use the mid-year examinations as a serious benchmark to gauge your progress. After the exams, analyze your performance in detail and create a targeted plan for the final stretch.',
  },
  {
    period: 'July to September (Prelims)',
    icon: <Zap className="h-8 w-8 text-white" />,
    bgColor: 'bg-yellow-500',
    title: 'Full Mock Papers & Stamina Building',
    description: 'Shift your focus entirely to full-length papers from various top JCs under strict exam conditions. This phase is about building mental stamina, perfecting time management, and refining exam strategies. The Prelims are the most realistic simulation before the actual A-Levels.',
  },
  {
    period: 'October to A-Level Exams',
    icon: <Flag className="h-8 w-8 text-white" />,
    bgColor: 'bg-red-500',
    title: 'Strategic Refinement & Mental Preparation',
    description: 'In the final weeks, avoid learning new content. Focus on reviewing your mistakes, memorizing key definitions and formulas, and rereading your content files (especially for GP and Humanities). Prioritize sleep, nutrition, and mental well-being to ensure you are at your peak performance state.',
  }
];

const mistakes = [
  {
    title: "Underestimating the JC1 to JC2 Jump",
    description: "The pace and depth of the JC2 curriculum are significantly more intense than in JC1. Many students struggle because they don't adjust their study habits, leading to a snowball effect of falling behind. What worked in JC1 is often insufficient for JC2.",
    solution: "Start revising JC1 content during the JC1 year-end holidays. Treat the beginning of JC2 as a critical period to establish a rigorous and disciplined study routine. Stay consistently on top of your tutorials and lectures from day one."
  },
  {
    title: "Neglecting General Paper (GP) until the last minute",
    description: "GP is not a subject you can cram for. It requires a broad knowledge of current affairs and the ability to construct coherent, nuanced arguments. Last-minute reading will be superficial and insufficient for the demands of the GP essay and AQ.",
    solution: "Make reading a weekly habit from the start of JC1. Dedicate a few hours each week to reading from diverse, quality sources. Discuss these issues with peers to sharpen your thinking and argumentation skills. Build your content file progressively."
  },
  {
    title: "Memorizing Answers Instead of Understanding Concepts",
    description: "The A-Levels are designed to test higher-order thinking, not rote memorization. Examiners can easily spot memorized essays or solutions. This approach fails when faced with novel questions that require the application of concepts in unfamiliar contexts.",
    solution: "Focus on the 'why' behind every concept, formula, and theory. Use techniques like the Feynman method to test your understanding. Practice applying your knowledge to a wide variety of questions from different schools' prelim papers to build intellectual flexibility."
  },
  {
    title: "Ignoring Mental Health and Sacrificing Sleep",
    description: "The A-Level marathon is mentally and emotionally taxing. Chronic sleep deprivation and high stress levels impair cognitive function, memory recall, and critical thinking. Burnout before the exam is a very real and dangerous possibility.",
    solution: "Schedule regular breaks and maintain at least one hobby or sport. Aim for 7-8 hours of quality sleep per night. Learn to recognize the signs of burnout and seek support from friends, family, or school counsellors. A healthy mind is your most powerful asset."
  }
];

const pathways = [
    {
        icon: <GraduationCap className="h-8 w-8 text-white" />,
        title: "Local Universities (NUS, NTU, SMU etc.)",
        description: "The primary goal for most A-Level graduates. Your Rank Points (RP) will determine your eligibility for various competitive courses. A strong portfolio in co-curricular activities (CCAs) can also be a differentiating factor for admission.",
        color: "from-blue-600 to-indigo-700"
    },
    {
        icon: <Briefcase className="h-8 w-8 text-white" />,
        title: "Overseas Universities (UK, US, Australia)",
        description: "A-Levels are an internationally recognized qualification that can grant you direct entry into top universities worldwide. Application processes may require additional essays, interviews, or standardized tests like the SAT or BMAT.",
        color: "from-purple-500 to-violet-600"
    },
    {
        icon: <Target className="h-8 w-8 text-white" />,
        title: "Scholarships & Special Programmes",
        description: "Excellent A-Level results open doors to prestigious scholarships from government bodies (PSC), statutory boards, and private organizations. These often cover tuition fees and provide an allowance, but come with a service bond.",
        color: "from-green-500 to-teal-600"
    }
]

const relatedGuides = [
    {
        title: "General Paper (GP) Strategies",
        description: "Explore advanced techniques for crafting compelling essays and acing the Application Question in the H1 General Paper.",
        link: "/a-level-general-paper",
    },
    {
        title: "H2 Chemistry Guide",
        description: "A deep dive into the H2 Chemistry syllabus, with a focus on challenging topics like Organic Chemistry and Electrochemistry.",
        link: "/a-level-chemistry",
    },
    {
        title: "H2 Physics Guide",
        description: "A deep dive into the H2 Physics syllabus, with a focus on challenging topics like Mechanics and Electromagnetism.",
        link: "/a-level-physics",
    },
    {
        title: "H2 Biology Guide",
        description: "A deep dive into the H2 Biology syllabus, with a focus on challenging topics like Cell Biology and Genetics.",
        link: "/a-level-biology",
    },
    {
        title: "H2 Mathematics Guide",
        description: "A deep dive into the H2 Mathematics syllabus, with a focus on challenging topics like Calculus and Linear Algebra.",
        link: "/a-level-mathematics",
    },
    {
        title: "A-Level Tuition Services",
        description: "Find out how our specialist A-Level tutors can provide the targeted guidance needed to excel in this demanding examination.",
        link: "/jc-tuition",
    }
]


const ALevelPrepClient = () => {
  return (
    <div className="bg-white text-gray-800 font-sans antialiased">
      <main>
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative text-center py-30 px-4 shadow-lg overflow-hidden bg-cover bg-top"
        style={{ backgroundImage: "url('/final.webp')" }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10">
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-5xl md:text-6xl font-extrabold text-white mb-4 tracking-tight"
          >
            Conquer the A-Levels in 2025
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-lg md:text-xl text-gray-200 mb-10 max-w-3xl mx-auto"
          >
            The ultimate guide to mastering the Singapore GCE A-Levels. Unlock elite strategies, in-depth subject analysis, and proven study plans for JC students.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
              <Link href="/request-tutor" passHref>
                  <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-8 text-lg rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300">
                      Get a Free Consultation <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
              </Link>
          </motion.div>
        </div>
      </motion.section>

        {/* Introduction Section */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="py-20 px-4"
        >
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-indigo-900 mb-4">The A-Levels: Your Gateway to University and Beyond</h2>
              <p className="text-lg text-gray-600">
                Understanding the gravity and structure of this examination is fundamental to strategic preparation.
              </p>
            </div>
            <Card className="bg-white p-8 rounded-xl shadow-md border-l-4 border-indigo-500">
              <CardContent className="text-lg text-gray-700 space-y-6">
                  <div className="flex items-start space-x-4">
                      <BookOpenCheck className="h-8 w-8 text-indigo-500 mt-1 flex-shrink-0" />
                      <p>
                      The Singapore-Cambridge GCE A-Level examination is the culmination of the pre-university journey, serving as the primary benchmark for admission into local and international universities. Unlike previous national exams, the A-Levels test for a profound depth of knowledge, critical thinking, and intellectual maturity. Success requires not just hard work, but a highly strategic and disciplined approach.
                      </p>
                  </div>
                  <p>
                  Your A-Level Rank Points (RP) are the currency for university admissions. Every H2 and H1 subject, including General Paper and Project Work, contributes to this final score. This guide is engineered to provide you with the frameworks, subject-specific insights, and psychological preparation needed to navigate this demanding journey and emerge successful, opening the doors to your dream university course and future career.
                  </p>
              </CardContent>
            </Card>
          </div>
        </motion.section>

        {/* Subject-Specific Strategies Section */}
        <section className="py-20 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-indigo-900 mb-4">Advanced Subject-Specific Strategies</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Move beyond surface-level revision with these expert techniques for core H1 and H2 subjects.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-10">
              {Object.entries(subjectData).map(([subject, data], index) => (
                <motion.div
                  key={subject}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full shadow-lg hover:shadow-2xl transition-shadow duration-300 rounded-xl overflow-hidden">
                    <CardHeader className="bg-indigo-600 text-white p-6">
                      <CardTitle className="flex items-center text-2xl font-bold">
                        <span className="text-3xl mr-4">{data.icon}</span>
                        {subject}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                      {data.tips.map((tip, tipIndex) => (
                        <div key={tipIndex} className="p-4 bg-indigo-50 rounded-lg">
                          <h4 className="font-semibold text-indigo-800">{tip.title}</h4>
                          <p className="text-gray-700">{tip.description}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Study Timeline Section */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-indigo-900 mb-4">The Two-Year A-Level Campaign</h2>
              <p className="text-lg text-gray-600">A strategic timeline to manage the marathon from the end of JC1 to the final paper.</p>
            </div>
            <div className="relative">
              <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gray-200 transform -translate-x-1/2"></div>
              {timelineData.map((item, index) => (
                <motion.div
                  key={index}
                  className="mb-12 flex items-center w-full"
                  initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.6 }}
                >
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8'}`}>
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                      <h3 className="text-xl font-bold text-indigo-800 mb-2">{item.title}</h3>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-full flex items-center justify-center z-10 absolute left-1/2 transform -translate-x-1/2">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${item.bgColor} shadow-md`}>
                          {item.icon}
                      </div>
                  </div>
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pl-8' : 'pr-8 text-right'}`}>
                       <p className="text-lg font-semibold text-gray-500">{item.period}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Common Mistakes Section */}
        <section className="py-20 px-4 bg-red-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-red-800 mb-4 flex items-center justify-center">
                  <AlertTriangle className="h-10 w-10 mr-4"/>
                  Critical A-Level Pitfalls to Avoid
              </h2>
              <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                Top-performing students are often separated by their awareness and avoidance of these common strategic errors.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {mistakes.map((mistake, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 h-full">
                    <h3 className="text-2xl font-bold text-red-700 mb-3 flex items-center">
                      <XCircle className="h-6 w-6 mr-2"/>
                      {mistake.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{mistake.description}</p>
                    <div className="p-3 rounded-lg bg-green-50 border border-green-200 text-green-800">
                      <p><strong className="font-semibold">The Strategic Edge:</strong> {mistake.solution}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Well-being Section */}
        <section className="py-20 px-4 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-indigo-900 mb-4">Maintaining Peak Performance</h2>
              <p className="text-lg text-gray-600">Your mental and physical well-being are non-negotiable components of A-Level success.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }} className="p-6">
                <div className="flex justify-center mb-4">
                  <div className="bg-green-100 p-4 rounded-full">
                    <Brain className="h-12 w-12 text-green-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-2">Combat Cognitive Fatigue</h3>
                <p className="text-gray-600">The intensity of A-Level preparation can lead to cognitive fatigue. Use techniques like spaced repetition and active recall to study more efficiently. Short, frequent breaks are more effective than marathon sessions. Step away from your desk to recharge.</p>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }} className="p-6">
                <div className="flex justify-center mb-4">
                  <div className="bg-blue-100 p-4 rounded-full">
                    <Moon className="h-12 w-12 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-2">Optimize Your Sleep</h3>
                <p className="text-gray-600">Sleep is when your brain consolidates learning and forms long-term memories. Consistently sacrificing sleep for study is one of the worst trade-offs you can make. Establish a strict pre-bed routine, avoid caffeine late in the day, and aim for 7-9 hours of uninterrupted sleep.</p>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }} className="p-6">
                <div className="flex justify-center mb-4">
                  <div className="bg-red-100 p-4 rounded-full">
                    <Heart className="h-12 w-12 text-red-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-2">Nutrition for the Brain</h3>
                <p className="text-gray-600">Your diet directly impacts your focus and energy levels. Prioritize brain-boosting foods like omega-3 fatty acids (fish, walnuts), antioxidants (berries), and complex carbohydrates (oats). Stay hydrated and avoid sugary snacks that cause energy crashes.</p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Pathways After A-Levels Section */}
        <section className="py-20 px-4 bg-gray-50">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-indigo-900 mb-4">Life After A-Levels: Your Next Chapter</h2>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">Strong A-Level results are the key that unlocks a world of prestigious opportunities, both locally and globally.</p>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                    {pathways.map((path, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.5 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <Card className="h-full shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg overflow-hidden flex flex-col">
                                <CardHeader className={`bg-gradient-to-br ${path.color} text-white p-6 flex flex-row items-center space-x-4`}>
                                    {path.icon}
                                    <CardTitle className="text-xl font-bold">{path.title}</CardTitle>
                                </CardHeader>
                                <CardContent className="p-6 flex-grow">
                                    <p className="text-gray-700">{path.description}</p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>

        {/* Tuition Advice Section */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.7 }}
            >
          <Image src="/jc-tuition_optimized.webp"  alt="Tutor explaining a complex concept for A-Level preparation"  className="rounded-xl shadow-2xl" width={800} height={533} style={{ width: '100%', height: 'auto' }} />
           </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.7 }}
            >
              <h2 className="text-4xl font-bold text-indigo-900 mb-6">Gaining a Competitive Edge with Specialist Tuition</h2>
              <p className="text-lg text-gray-700 mb-6">
                In the high-stakes A-Level environment, targeted, expert guidance can be the deciding factor between a good grade and a distinction. A specialist JC tutor can provide what a school classroom often cannot.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <Check className="h-6 w-6 text-green-500 mr-3 flex-shrink-0 mt-1" />
                  <span><strong className="font-semibold">Deconstruct Complex Questions:</strong> Learn to tackle higher-order and synoptic questions by breaking them down into manageable parts with an experienced guide.</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-6 w-6 text-green-500 mr-3 flex-shrink-0 mt-1" />
                  <span><strong className="font-semibold">Customized Pacing:</strong> Move ahead of the school curriculum or spend more time reinforcing weak topics. Tuition offers the flexibility to tailor the learning pace to your specific needs.</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-6 w-6 text-green-500 mr-3 flex-shrink-0 mt-1" />
                  <span><strong className="font-semibold">Access to Curated Resources:</strong> Benefit from a tutor's collection of challenging practice papers, concise summary notes, and proprietary exam strategies that are not available elsewhere.</span>
                </li>
              </ul>
              <Link href="/request-tutor" passHref>
                <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold">
                  <Link href="/request-tutor">Find a Specialist A-Level Tutor</Link>
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Final Preparation Section */}
        <section className="py-20 px-4 bg-gray-50">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-indigo-900 mb-4">The Final Ascent: Exam Period Strategy</h2>
                    <p className="text-lg text-gray-600">How you manage the final days before each paper is critical for peak performance.</p>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                    <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }} className="p-6 bg-white rounded-lg shadow-md text-center">
                        <ClipboardCheck className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Finalize Your "Cheat Sheets"</h3>
                        <p className="text-gray-600">Condense all your notes for each subject onto a single A4 page. This should contain only the most essential formulas, definitions, and key concepts. This is your final, high-impact revision tool for the morning of the exam.</p>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }} className="p-6 bg-white rounded-lg shadow-md text-center">
                        <Bell className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Review, Don't Re-learn</h3>
                        <p className="text-gray-600">The time for learning new content is long past. Focus on reviewing your mistake log and re-reading model essays or solutions. Re-affirm what you know to build confidence, rather than trying to patch knowledge gaps in a panic.</p>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }} className="p-6 bg-white rounded-lg shadow-md text-center">
                        <Briefcase className="h-12 w-12 text-green-500 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Execute with Calm Confidence</h3>
                        <p className="text-gray-600">On exam day, have a good breakfast and arrive early. During the exam, stay calm, manage your time according to your practiced strategy, and read every question carefully. Trust in your two years of hard work and preparation.</p>
                    </motion.div>
                </div>
            </div>
        </section>

        {/* Related Guides Section */}
        <section className="py-20 px-4 bg-white">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-indigo-900 mb-4">Explore Our Other A-Level Resources</h2>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">Deepen your knowledge with our other specialized guides for Junior College students.</p>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                    {relatedGuides.map((guide, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.5 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <Card className="h-full shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg overflow-hidden flex flex-col group">
                                <CardHeader>
                                    <div className="flex items-center space-x-4 text-indigo-600">
                                        <FileText className="h-8 w-8"/>
                                        <CardTitle className="text-xl font-bold">{guide.title}</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-6 flex-grow flex flex-col">
                                    <p className="text-gray-700 mb-4 flex-grow">{guide.description}</p>
                                    <Link href={guide.link} passHref>
                                        <Button variant="outline" className="w-full mt-auto group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                                            Read More <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>

        {/* Call to Action Section */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8 }}
          className="py-24 px-4 bg-gradient-to-r from-indigo-700 to-purple-800 text-white"
        >
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">
              Ready to Achieve Your A-Level Goals?
            </h2>
            <p className="text-lg md:text-xl text-indigo-100 mb-10 max-w-2xl mx-auto">
              The A-Levels are a formidable challenge, but you don't have to face it alone. LionCity Tutors provides elite, specialist tutors who can give you the competitive edge needed to secure your place in a top university course.
            </p>
            <Link href="/request-tutor" passHref>
                <Button
                  size="lg"
                  className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-10 text-lg rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300"
                >
                  Request a Specialist Tutor
                </Button>
            </Link>
          </div>
        </motion.section>
      </main>
    </div>
  );
};

export default ALevelPrepClient;