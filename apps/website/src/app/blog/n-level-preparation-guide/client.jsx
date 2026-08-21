'use client';

import { motion } from 'framer-motion';
import { enter, mount } from '@/lib/motion';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RelatedGuides, ExamTimetable } from '@/components/guide';
import { N_LEVEL_FAQS } from './faqs.mjs';
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
    FileText
} from 'lucide-react';

// Data for sections, kept within the component for a single-file structure
const subjectData = {
    English: {
        icon: '📖',
        tips: [
            { title: 'Master Paraphrasing & Inference', description: "For comprehension, practice rephrasing complex sentences in your own words. This is a critical skill that demonstrates true understanding beyond simply lifting answers from the text. Work on inferential questions by reading between the lines and understanding the author's intent." },
            { title: 'Expand Your Active Vocabulary', description: "Don’t just learn new words; use them. Read widely beyond textbooks—news articles, stories, and opinion pieces. Keep a vocabulary journal to note down new words, their meanings, synonyms, and how to use them in a sentence. Aim to use a new word in your writing each day." },
            { title: 'Consistent & Structured Writing Practice', description: "Regularly write essays and situational pieces under timed conditions. Focus on building a strong structure (introduction, body paragraphs with topic sentences, conclusion), developing clear arguments with supporting evidence, and ensuring grammatical accuracy. Get feedback and rewrite your work." }
        ]
    },
    Mathematics: {
        icon: '🧮',
        tips: [
            { title: 'Understand Concepts, Don’t Just Memorize Formulas', description: "Focus on grasping the 'why' behind mathematical formulas and theorems. This deeper understanding allows you to adapt your knowledge to solve unfamiliar and challenging problems, which are common in exams." },
            { title: 'Strategic Practice with the Ten-Year Series (TYS)', description: "The TYS is your best friend. Work through past N-Level papers to familiarize yourself with question patterns, common tricks, and the required presentation of answers. Analyze the marking scheme to understand how partial credits are awarded." },
            { title: 'Identify and Conquer Weak Topics', description: "Don't avoid topics you find difficult, such as trigonometry or geometry. Systematically tackle them by reviewing fundamentals, doing targeted practice, and seeking help from your teacher or tutor. Turning a weakness into a strength is a massive confidence booster." }
        ]
    },
    Science: {
        icon: '🔬',
        tips: [
            { title: 'Link Concepts to Real-World Applications', description: "Make abstract scientific principles tangible by connecting them to everyday phenomena. For example, relate the concept of energy conversion to charging your phone, or chemical reactions to cooking. This makes learning more intuitive and memorable." },
            { title: 'Master Scientific Keywords and Definitions', description: "Examiners look for the precise use of scientific terminology. Create flashcards for key definitions, units, and formulas. Use these keywords accurately in your answers to show clarity and command of the subject matter." },
            { title: 'Practice Answering Structured & Data-Based Questions', description: "Learn how to methodically break down multi-part questions. For data-based questions, practice interpreting graphs and tables to draw logical conclusions. Structure your answers clearly, especially for 'Explain' and 'Describe' questions." }
        ]
    },
    'Humanities (SS, History, Geography)': {
        icon: '🌍',
        tips: [
            { title: 'Develop Source-Based Question Skills', description: "For Social Studies and History, mastering source-based questions (SBQ) is essential. Practice identifying the purpose, tone, and reliability of sources. Learn the PEEL (Point, Evidence, Explanation, Link) structure to write well-supported paragraphs." },
            { title: 'Use Case Studies Effectively', description: "In Geography and History, case studies are vital. Create detailed notes for each case study, focusing on key facts, figures, and examples. Understand the broader concepts they illustrate so you can apply them in your essays." },
            { title: 'Create Mind Maps and Timelines', description: "Organize complex information using visual aids. Mind maps are excellent for connecting themes in Geography, while timelines are crucial for understanding the chronological flow of events in History. This helps in seeing the bigger picture and aids recall." }
        ]
    }
};

const timelineData = [
  {
    period: '6-9 Months Before Exam',
    icon: <Calendar className="h-8 w-8 text-white" />,
    bgColor: 'bg-blue-500',
    title: 'Foundation Building & Conceptual Clarity',
    description: 'This is the crucial phase for building a rock-solid understanding of the entire syllabus for all subjects. Focus on attending classes diligently, clarifying fundamental doubts with teachers, and creating detailed summary notes for each chapter. The goal is to finish the syllabus with a strong grasp of the basics, not just a superficial overview.',
  },
  {
    period: '3-5 Months Before Exam',
    icon: <ShieldCheck className="h-8 w-8 text-white" />,
    bgColor: 'bg-green-500',
    title: 'Targeted Practice & Weakness Reinforcement',
    description: 'With the foundation laid, begin intensive practice using topical Ten-Year Series (TYS) and school prelim papers. This will help you identify your weak areas. Create a "mistake book" to log errors and understand why you made them. Dedicate extra time to these difficult topics until you are confident in tackling them.',
  },
  {
    period: '1-2 Months Before Exam',
    icon: <Zap className="h-8 w-8 text-white" />,
    bgColor: 'bg-yellow-500',
    title: 'Full Mock Exams & Time Management Mastery',
    description: 'Shift your focus from topical practice to full mock papers under strict, timed conditions. This builds mental stamina and helps you refine your exam strategy, including time allocation for each section. Review your performance critically to fine-tune your approach and manage exam anxiety.',
  },
  {
    period: 'The Final Exam Week',
    icon: <Flag className="h-8 w-8 text-white" />,
    bgColor: 'bg-red-500',
    title: 'Execution, Confidence & Well-Being',
    description: 'This is the final stretch. Avoid learning new topics and focus on light, strategic revision of your summary notes and formulas. Prioritize your well-being: get adequate sleep (7-9 hours), eat nutritious meals, and stay hydrated. Arrive at the exam venue early, stay calm, and trust in the months of hard work you’ve put in.',
  }
];

const mistakes = [
  {
    title: "Passive Learning & Rote Memorization",
    description: "Many students fall into the trap of simply reading textbooks or notes over and over. This passive approach leads to poor retention. Rote memorization without understanding concepts means you'll be unable to answer questions that require application or analysis.",
    solution: "Engage in active recall. Close your book and write down everything you remember. Use techniques like the Feynman method: try to teach the concept to someone else. This forces your brain to truly understand and organize the information."
  },
  {
    title: "Neglecting the Ten-Year Series (TYS)",
    description: "The TYS is the most critical resource for exam preparation. Ignoring it or only starting it at the last minute is a major mistake. You miss out on understanding exam patterns, question styles, and the specific phrasing examiners look for.",
    solution: "Integrate TYS practice into your study plan from at least 5 months before the exams. Don't just do the questions; analyze the answer key and marking scheme to understand how marks are awarded. Identify recurring question types."
  },
  {
    title: "Ignoring Mental and Physical Health",
    description: "The 'hustle culture' of sacrificing sleep and relaxation for endless cramming is extremely counterproductive. Burnout is a real threat that leads to mental fatigue, poor concentration, and lower exam performance. It's a marathon, not a sprint.",
    solution: "Schedule non-negotiable breaks into your study timetable. Ensure you get 7-9 hours of quality sleep per night, as this is when memory consolidation happens. Engage in physical activity and hobbies to de-stress. A healthy, rested mind performs exponentially better."
  },
  {
    title: "Poor Time Management During Exams",
    description: "It's heartbreaking to lose marks not because you don't know the answer, but because you ran out of time. Many students spend too long on questions they find difficult, leaving no time for easier questions at the end of the paper.",
    solution: "Practice full mock papers under strict, timed conditions. Develop a strategy for allocating time per section and per mark. If you're stuck on a question, mark it, move on, and come back later if you have time. Secure the easy marks first."
  }
];

const pathways = [
    {
        icon: <GraduationCap className="h-8 w-8 text-white" />,
        title: "Polytechnic Foundation Programme (PFP)",
        description: "An excellent pathway for high-performing N(A) students (ELMAB3 ≤ 12). This one-year programme offers a practice-based curriculum that prepares you for direct entry into a pre-selected diploma course at a polytechnic, bypassing the O-Levels entirely. It's a fantastic head start for those who are certain about a vocational path.",
        color: "from-teal-500 to-cyan-600"
    },
    {
        icon: <Briefcase className="h-8 w-8 text-white" />,
        title: "Direct-Entry-Scheme to ITE (DPP)",
        description: "For N(A) students who are keen on hands-on learning (ELMAB3 ≤ 19). The DPP guarantees a place in a related Polytechnic Diploma course if you achieve the required GPA in your 2-year Higher Nitec course at ITE. It provides a seamless progression from vocational training to a diploma.",
        color: "from-purple-500 to-indigo-600"
    },
    {
        icon: <ArrowUpRight className="h-8 w-8 text-white" />,
        title: "Progression to Secondary 5 (O-Levels)",
        description: "N(A) students who perform well (ELMAB3 ≤ 19) can opt to advance to Secondary 5. This one-year course prepares you for the GCE O-Level examinations, which opens up pathways to Junior Colleges (for A-Levels) or a wider range of courses in Polytechnics. It's a more traditional academic route that keeps more doors open.",
        color: "from-orange-500 to-amber-600"
    }
]

// Related guides now come from the SEO cluster registry (src/lib/seo/clusters.mjs)
// via <RelatedGuides>, so anchor text stays consistent with how every other page
// links to the same targets. The registry lists five spokes here, not three.


const NLevelPrepClient = () => {
  return (
    <div className="bg-white text-gray-800 font-sans antialiased">
      <main>
        {/* Hero Section */}
        <motion.section
          {...mount()}
          className="relative text-center py-35 px-4 shadow-lg overflow-hidden bg-cover bg-top"
          style={{ backgroundImage: "url('/final.webp')" }}
        >
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="relative z-10">
            <motion.h1
              {...mount(1)}
              className="text-5xl md:text-6xl font-extrabold text-white mb-4 tracking-tight"
            >
              Master the N Levels in 2026
            </motion.h1>
            <motion.p
              {...mount(2)}
              className="text-lg md:text-xl text-gray-200 mb-10 max-w-3xl mx-auto"
            >
              Your complete guide to expert strategies, proven study plans, and essential tips for excelling in the Singapore GCE N-Level examinations.
            </motion.p>
            <motion.div
              {...mount(3)}
            >
                <Link href="/request-tutor" passHref>
                    <Button size="lg" className="h-auto bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-8 text-lg rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300">
                        Get a Free Consultation <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                </Link>
            </motion.div>
          </div>
        </motion.section>

        {/* Definition Section — answers the "n level meaning" queries this page
            already ranks page-one for. Kept immediately after the hero, and
            deliberately not animated-in, so the answer is the first thing read. */}
        <section id="what-is-n-level" className="py-16 px-4 border-b border-gray-100">
          <div className="max-w-3xl mx-auto">
            <h2 className="section-title text-primary mb-4">
              What does GCE N-Level mean?
            </h2>
            <p className="text-lg text-gray-800 leading-relaxed mb-6">
              GCE N-Level is the Singapore-Cambridge General Certificate of Education
              Normal Level, sat at the end of Secondary 4 by students in the Normal
              course. It runs in two tracks: Normal (Academic), which leads to a fifth
              year and the O-Level, and Normal (Technical), which leads to ITE.
            </p>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="rounded-xl border border-gray-200 p-5">
                <h3 className="font-semibold text-blue-900 mb-2">Normal (Academic) — N(A)</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Sits Syllabus A papers. Students who do well enough progress to
                  Secondary 5 and the O-Level, or take the Polytechnic Foundation
                  Programme instead.
                </p>
              </div>
              <div className="rounded-xl border border-gray-200 p-5">
                <h3 className="font-semibold text-blue-900 mb-2">Normal (Technical) — N(T)</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Sits Syllabus T papers, which are more practically oriented. Students
                  typically progress to a Nitec course at ITE, and can move on to a
                  polytechnic diploma from there.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 2026 Timetable Section — all dates read from examCalendar2026.mjs */}
        <section id="timetable" className="py-16 px-4 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="section-title text-primary mb-4">
              When are the 2026 N-Level exams?
            </h2>
            <p className="text-lg text-gray-800 leading-relaxed mb-8">
              The 2026 GCE N-Level examinations run from 13 July to 13 October 2026.
              Oral examinations come first in July, written papers begin on 14 September,
              and the last papers are sat on 13 October. Results are released between
              17 and 21 December 2026.
            </p>
            <ExamTimetable
              examSlug="n-level"
              caption="Official 2026 GCE N-Level timetable, as published by SEAB. N(A) and N(T) sit different papers — check the syllabus code against your own track."
            />
          </div>
        </section>

        {/* Introduction Section */}
        <motion.section
          {...enter()}
          className="py-20 px-4"
        >
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="section-title text-primary mb-4">Why the GCE N-Levels Are a Critical Milestone</h2>
              <p className="text-lg text-gray-600">
                Understanding the significance of this examination is the first step toward success.
              </p>
            </div>
            <Card className="bg-white p-5 sm:p-8 rounded-xl shadow-md border-l-4 border-blue-500">
              <CardContent className="px-0 text-lg text-gray-700 space-y-6">
                  <div className="flex items-start gap-3 sm:gap-4">
                      <BookOpenCheck className="h-8 w-8 text-blue-500 mt-1 flex-shrink-0" />
                      <p>
                      The GCE N-Level (Normal Level) examinations represent a pivotal moment in a student's academic life in Singapore. Far more than just another test, the N-Levels serve as a crucial gateway, influencing future educational pathways and career opportunities. A strong performance can unlock doors to various post-secondary options, providing a solid foundation for continued learning and personal growth.
                      </p>
                  </div>
                  <p>
                  Successfully navigating the N-Levels allows students to progress to the Polytechnic Foundation Programme (PFP), the Direct-Entry-Scheme to ITE (DPP), or to continue to Secondary 5 to take the GCE O-Level examinations. Each path offers unique advantages, and achieving good grades ensures that students have the freedom to choose the route that best aligns with their aspirations and strengths. This guide is designed to provide you with the comprehensive strategies and support needed to not just pass, but to excel in your N-Level journey.
                  </p>
              </CardContent>
            </Card>
          </div>
        </motion.section>

        {/* Subject-Specific Strategies Section */}
        <section className="py-20 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="section-title text-primary mb-4">In-Depth Subject Strategies</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Tailor your revision with these proven techniques for core N-Level subjects to maximize your scores.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-10">
              {Object.entries(subjectData).map(([subject, data], index) => (
                <motion.div
                  key={subject}
                  {...enter(index)}
                >
                  <Card className="h-full shadow-lg hover:shadow-2xl transition-shadow duration-300 rounded-xl overflow-hidden">
                    <CardHeader className="bg-blue-600 text-white p-6">
                      <CardTitle className="flex items-center text-2xl font-bold">
                        <span className="text-3xl mr-4">{data.icon}</span>
                        {subject}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                      {data.tips.map((tip, tipIndex) => (
                        <div key={tipIndex} className="p-4 bg-blue-50 rounded-lg">
                          <h4 className="font-semibold text-blue-800">{tip.title}</h4>
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
              <h2 className="section-title text-primary mb-4">Your N-Level Success Roadmap</h2>
              <p className="text-lg text-gray-600">A strategic timeline to guide your preparation from start to finish.</p>
            </div>
            {/* Alternating two-column below md gave each card a 97px text column.
                On mobile the spine moves left and every row is one full-width column. */}
            <div className="relative">
              <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-1 bg-gray-200 -translate-x-1/2"></div>
              {timelineData.map((item, index) => (
                <motion.div
                  key={index}
                  className="relative mb-12 flex w-full flex-col items-start gap-2 pl-16 md:flex-row md:items-center md:gap-0 md:pl-0"
                  {...enter(index)}
                >
                  <div className={`w-full md:w-1/2 ${index % 2 === 0 ? 'md:pr-8 md:text-right' : 'md:pl-8'}`}>
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                      <h3 className="text-xl font-bold text-blue-800 mb-2">{item.title}</h3>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </div>
                  <div className="absolute left-6 top-0 z-10 flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full md:left-1/2 md:top-1/2 md:-translate-y-1/2">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${item.bgColor} shadow-md`}>
                          {item.icon}
                      </div>
                  </div>
                  <div className={`order-first w-full md:order-none md:w-1/2 ${index % 2 === 0 ? 'md:pl-8' : 'md:pr-8 md:text-right'}`}>
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
              <h2 className="section-title text-primary mb-4 flex items-center justify-center">
                  <AlertTriangle className="h-10 w-10 mr-4"/>
                  Common Pitfalls to Avoid
              </h2>
              <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                Awareness of these common mistakes can significantly improve your preparation and final score.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {mistakes.map((mistake, index) => (
                <motion.div
                  key={index}
                  {...enter(index)}
                >
                  <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 h-full">
                    <h3 className="text-2xl font-bold text-red-700 mb-3 flex items-center">
                      <XCircle className="h-6 w-6 mr-2"/>
                      {mistake.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{mistake.description}</p>
                    <div className="p-3 rounded-lg bg-green-50 border border-green-200 text-green-800">
                      <p><strong className="font-semibold">How to Avoid:</strong> {mistake.solution}</p>
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
              <h2 className="section-title text-primary mb-4">Prioritizing Your Well-being</h2>
              <p className="text-lg text-gray-600">A healthy mind and body are your greatest assets during the exam period.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <motion.div {...enter(0)} className="p-6">
                <div className="flex justify-center mb-4">
                  <div className="bg-green-100 p-4 rounded-full">
                    <Brain className="h-12 w-12 text-green-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-2">Manage Stress Effectively</h3>
                <p className="text-gray-600">Incorporate short, regular breaks (Pomodoro Technique) into your study schedule. Practice mindfulness or deep breathing exercises when you feel overwhelmed. Talking about your anxieties with family, friends, or a school counsellor can also be very helpful.</p>
              </motion.div>
              <motion.div {...enter(1)} className="p-6">
                <div className="flex justify-center mb-4">
                  <div className="bg-blue-100 p-4 rounded-full">
                    <Moon className="h-12 w-12 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-2">Ensure Quality Sleep</h3>
                <p className="text-gray-600">Aim for 7-9 hours of quality sleep per night. Sleep is not a luxury; it is crucial for memory consolidation and cognitive function. Avoid screens an hour before bed and establish a consistent sleep schedule to improve sleep quality. Last-minute cramming is less effective than a well-rested brain.</p>
              </motion.div>
              <motion.div {...enter(2)} className="p-6">
                <div className="flex justify-center mb-4">
                  <div className="bg-red-100 p-4 rounded-full">
                    <Heart className="h-12 w-12 text-red-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-2">Fuel Your Body & Brain</h3>
                <p className="text-gray-600">Fuel your brain with balanced, nutritious meals. Include complex carbohydrates, proteins, and healthy fats. Avoid excessive sugary snacks that lead to energy crashes. Stay hydrated by drinking plenty of water throughout the day, as dehydration can severely impair concentration.</p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Pathways After N-Levels Section */}
        <section className="py-20 px-4 bg-gray-50">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="section-title text-primary mb-4">Pathways After the N-Levels</h2>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">Your N-Level results unlock a variety of exciting educational and vocational routes. Explore the main options available.</p>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                    {pathways.map((path, index) => (
                        <motion.div
                            key={index}
                            {...enter(index)}
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
              {...enter()}
            >
            <Image 
              src="/jc-tuition_optimized.webp" 
              alt="Tutor helping a student for N-Level preparation" 
              className="rounded-xl shadow-2xl"
              width={800}
              height={533} 
              style={{ width: '100%', height: 'auto' }}
            />
            </motion.div>
            <motion.div
              {...enter(1)}
            >
              <h2 className="section-title text-primary mb-6">Can Private Tuition Make a Critical Difference?</h2>
              <p className="text-lg text-gray-700 mb-6">
                For many students, targeted guidance is the key to unlocking their full potential. A qualified and experienced tutor can provide personalized attention that is often not possible in a large classroom setting, making a significant impact on results.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <Check className="h-6 w-6 text-green-500 mr-3 flex-shrink-0 mt-1" />
                  <span><strong className="font-semibold">Personalized Learning Plan:</strong> A tutor can diagnose specific weaknesses and tailor a study plan to address them, ensuring your revision time is spent as effectively as possible.</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-6 w-6 text-green-500 mr-3 flex-shrink-0 mt-1" />
                  <span><strong className="font-semibold">Clarify Doubts Instantly:</strong> Get immediate, detailed answers to your questions. This prevents misconceptions from snowballing and builds a stronger, more confident understanding of the subject.</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-6 w-6 text-green-500 mr-3 flex-shrink-0 mt-1" />
                  <span><strong className="font-semibold">Master Exam-Oriented Strategies:</strong> Learn effective answering techniques, keyword usage, and time management skills directly from an expert who understands the N-Level marking criteria inside and out.</span>
                </li>
              </ul>
              <Button asChild size="lg" className="h-auto py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold">
                <Link href="/request-tutor">Find a Specialist N-Level Tutor</Link>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Final Preparation Section */}
        <section className="py-20 px-4 bg-gray-50">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="section-title text-primary mb-4">Final Countdown: The Last 48 Hours</h2>
                    <p className="text-lg text-gray-600">Your strategy in the final days is just as important as the months of preparation.</p>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                    <motion.div {...enter(0)} className="p-6 bg-white rounded-lg shadow-md text-center">
                        <ClipboardCheck className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Organize Your Materials</h3>
                        <p className="text-gray-600">The day before, pack your bag with everything you need: student ID, entry proof, stationery (pens, pencils, ruler, calculator), and a watch. Double-check the exam venue and time. This simple step prevents last-minute panic and stress.</p>
                    </motion.div>
                    <motion.div {...enter(1)} className="p-6 bg-white rounded-lg shadow-md text-center">
                        <Bell className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Light Revision, No Cramming</h3>
                        <p className="text-gray-600">Do not try to learn anything new. Your brain needs time to consolidate information. Focus on light revision of your summary notes, key formulas, and the "mistake book" you've kept. The goal is to feel confident, not overwhelmed.</p>
                    </motion.div>
                    <motion.div {...enter(2)} className="p-6 bg-white rounded-lg shadow-md text-center">
                        <Briefcase className="h-12 w-12 text-green-500 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Rest, Relax, and Execute</h3>
                        <p className="text-gray-600">Get a full night of quality sleep. On the exam day, have a nutritious, balanced breakfast. Arrive at the examination hall at least 30 minutes early to settle in and calm your nerves. Stay positive, trust your preparation, and read every question carefully.</p>
                    </motion.div>
                </div>
            </div>
        </section>
                    
        {/* FAQ Section — rendered as plain text, never behind a disclosure widget,
            so the answers are present in the server-rendered HTML. Same array
            feeds the FAQPage JSON-LD in page.jsx. */}
        <section id="faq" className="py-16 px-4 bg-gray-50">
          <div className="max-w-3xl mx-auto">
            <h2 className="section-title text-primary mb-8">
              N-Level questions, answered
            </h2>
            <div className="space-y-8">
              {N_LEVEL_FAQS.map((faq) => (
                <div key={faq.question}>
                  <h3 className="text-xl font-semibold text-blue-900 mb-2">{faq.question}</h3>
                  <p className="text-gray-800 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Cluster links, from the SEO registry */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-3xl mx-auto">
            <RelatedGuides
              slug="n-level-prep"
              heading="Explore our other guides"
              showHub={false}
            />
          </div>
        </section>

        {/* Call to Action Section */}
        <motion.section
          {...enter()}
          className="py-24 px-4 bg-gradient-to-r from-blue-700 to-indigo-800 text-white"
        >
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="section-title text-primary mb-6">
              Ready to Secure Your Success in the N-Levels?
            </h2>
            <p className="text-lg md:text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
              Don't leave your future to chance. Our team of specialist N-Level tutors at LionCity Tutors is ready to provide the personalized support and expert guidance you need to achieve your academic goals and unlock your desired post-secondary pathway.
            </p>
            <Button
              asChild
              size="lg"
              className="h-auto bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-10 text-lg rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300"
            >
              <Link href="/request-tutor">Request a Tutor Now</Link>
            </Button>
          </div>
        </motion.section>
      </main>
    </div>
  );
};

export default NLevelPrepClient;