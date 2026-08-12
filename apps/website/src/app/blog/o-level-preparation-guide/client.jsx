'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BookOpen, Target, Calendar, Brain, Heart, CheckCircle, AlertTriangle, GraduationCap, Users, Calculator, PenTool, Lightbulb, TrendingUp, ShieldCheck, ListChecks, Clock, CalendarClock, Milestone, HelpCircle } from 'lucide-react';
import { RelatedGuides, ExamTimetable, GuideTimeline } from '@/components/guide';
import { O_LEVEL_FAQS } from './faqs.mjs';

const sec3ToSec4 = [
  {
    title: 'Sec 3 Term 1–2 · Foundation',
    points: [
      'Lock in subject combination and confirm which subjects count toward L1R5',
      'Build the A-Math and Chemistry foundations that Sec 4 assumes',
      'Fix note-taking and filing habits now — Sec 4 offers no time for it',
    ],
  },
  {
    title: 'Sec 3 Term 3–4 · Consolidation',
    points: [
      'Start topical past-paper practice on completed topics',
      'Identify the two weakest topics per subject and address them while there is slack',
      'Sit end-of-year exams as a diagnostic rather than a verdict',
    ],
  },
  {
    title: 'Sec 4 Term 1 · Syllabus completion',
    points: [
      'Finish remaining syllabus content by the end of term',
      'Begin weekly timed sections, not yet full papers',
      'Book any needed tuition now — availability tightens sharply after March',
    ],
  },
  {
    title: 'Sec 4 Term 2 · Full-paper practice',
    points: [
      'Move to complete papers under exam timing',
      'Mark against the official SEAB mark scheme and log every method mark lost',
      'Prepare Mother Tongue papers — they are sat on 2 June, before everything else',
    ],
  },
  {
    title: 'Sec 4 Term 3 · Prelims and orals',
    points: [
      'Sit prelims as a rehearsal for pacing, not as a predictor of the final grade',
      'English and Mother Tongue orals fall in July — practise aloud, not silently',
      'Rebuild the revision plan around whatever prelims exposed',
    ],
  },
  {
    title: 'Sec 4 Term 4 · Final run',
    points: [
      'Science practicals come first: Chemistry 30 Sep, Physics 5 Oct, Biology 13 Oct',
      'Written papers begin 15 October and run to 10 November',
      'Taper new content two weeks out and shift entirely to past papers and rest',
    ],
  },
];

// The tips chapter. Grouped by subject, numbered continuously 1–21 at render
// time so tips can be added to a group without renumbering the rest by hand.
// Each group opens with `lead` — a direct answer to the group's implied
// question, which is what featured snippets and AI answers extract.
const tipGroups = [
  {
    id: 'tips-general',
    heading: 'Technique that applies to every subject',
    lead: 'Most of the marks our tutors recover in Sec 4 are not new content. They are marks the student already knew enough to earn, but lost in how the answer was written.',
    tips: [
      {
        title: 'Read the mark allocation as a specification',
        body: 'A 3-mark question is telling you the marker has to find three distinct things. Decide what your three are before you start writing. Students who write one long paragraph and hope it covers everything routinely score 1 or 2 on questions they understood completely.',
      },
      {
        title: 'Underline the command word before you write anything',
        body: 'Describe, explain, compare, evaluate and suggest each want a different shape of answer. The most common way to lose marks on a topic you know well is to answer a slightly different question from the one printed.',
      },
      {
        title: 'Your error log matters more than your paper count',
        body: 'The loop that works is: attempt, mark, categorise the mistake, write one line on why it happened, redo the question, then do a similar one a few days later. Attempt, check the answer, move on teaches almost nothing. Four papers worked properly beat ten papers skimmed.',
      },
      {
        title: "Practise the questions you don't recognise",
        body: 'It is possible to get very good at recognising the exact questions you have already practised without getting any better at recognising the underlying concept. Deliberately include unfamiliar and harder questions in every practice session, not just the ones that look like worked examples.',
      },
      {
        title: 'Memorising is fine. Memorising without application is not',
        body: 'The problem is almost never that a student memorised something. It is that the question arrived in an unfamiliar context and the memorised version did not fit. After learning anything, ask how it would look if the question changed the situation.',
      },
    ],
  },
  {
    id: 'tips-maths',
    heading: 'Elementary and Additional Mathematics',
    lead: 'In maths our tutors see far more marks lost to execution than to genuine gaps in knowledge. The fix for a careless error is different from the fix for a concept gap, so they have to be logged separately.',
    tips: [
      {
        title: 'Most maths marks are lost to execution, not knowledge',
        body: 'Dropped negative signs, a bracket expanded wrongly, a number copied incorrectly out of the question, the right answer written in the wrong place. Keep these in a separate column of your error log from concept errors — counting them is usually a surprise.',
      },
      {
        title: 'Roughly a minute a mark, and never let one question eat ten',
        body: 'This is a pacing strategy rather than an SEAB rule, but it works. A difficult 3-mark question that consumes ten minutes can cost more marks at the end of the paper than it was ever worth. Mark it, move on, come back.',
      },
      {
        title: 'Never round in the middle of your working',
        body: 'Premature rounding is one of the most avoidable ways to lose accuracy marks. Carry full calculator precision through every intermediate step and round only the final answer, to the accuracy the question asks for.',
      },
      {
        title: "Check the calculator's angle mode before every trigonometry question",
        body: 'Degrees against radians costs the whole question, and the working looks perfectly correct on the page. Make the check a reflex, along with clearing the previous answer.',
      },
      {
        title: 'A-Math punishes weak Sec 3 algebra hardest',
        body: (
          <>
            Differentiation and integration questions are usually lost in the algebra
            after the calculus, not in the calculus itself. If A-Math started slipping
            in Sec 4, the repair is often two terms further back. Our{' '}
            <Link href="/o-level-math" className="text-primary underline underline-offset-2">
              O-Level E-Math and A-Math guide
            </Link>{' '}
            breaks down which topics carry the most marks.
          </>
        ),
      },
    ],
  },
  {
    id: 'tips-physics',
    heading: 'Physics',
    lead: 'The pattern our tutors see most in Physics is a student who can write every formula on the sheet and still cannot tell which one the question wants.',
    tips: [
      {
        title: 'Learn four things about every formula, not one',
        body: (
          <>
            What each variable means, its units, the physical situation the formula
            applies to, and the question types it turns up in. A student who has
            memorised only the symbols can reproduce the formula and still not
            recognise it as the one being asked for. More topic-by-topic detail is in
            the{' '}
            <Link href="/o-level-physics" className="text-primary underline underline-offset-2">
              O-Level Physics topic guide
            </Link>
            .
          </>
        ),
      },
      {
        title: 'Unit conversion is free marks',
        body: 'Centimetres to metres, minutes to seconds, grams to kilograms, and the area and volume conversions that catch almost everyone. Write the unit on every answer, including the intermediate ones — it makes a wrong conversion visible before it reaches the final line.',
      },
      {
        title: '"Explain" means give the mechanism',
        body: '"The object moves faster because there is more force" restates the outcome in different words. The marks are in the relationship: which quantity changes, what that does, and why that produces the effect described.',
      },
    ],
  },
  {
    id: 'tips-chemistry',
    heading: 'Chemistry',
    lead: 'Chemistry rewards precise terminology more than most subjects. An answer that is chemically sensible but avoids the required term frequently scores nothing.',
    tips: [
      {
        title: 'Weak mole fundamentals propagate further than any other gap',
        body: (
          <>
            Shaky mole calculations show up again in stoichiometry, in concentration,
            in gas volumes and in titration. It is the one gap where fixing the
            foundation repairs several topics at once. The{' '}
            <Link href="/o-level-chemistry" className="text-primary underline underline-offset-2">
              O-Level Chemistry topic guide
            </Link>{' '}
            covers the mole concept in full.
          </>
        ),
      },
      {
        title: 'A plausible answer is not a full-mark answer',
        body: 'Marks attach to specific chemical terminology. Students routinely describe the right process in everyday language and score zero on a question they genuinely understood. Learn the phrasing the syllabus uses, not just the idea behind it.',
      },
      {
        title: 'In qualitative analysis, answer what was actually asked',
        body: 'An observation is what you see. An inference is what it means. The two are marked differently, and giving an explanation where an observation was required is one of the most common QA mistakes.',
      },
    ],
  },
  {
    id: 'tips-biology',
    heading: 'Biology',
    lead: 'Our tutors regularly meet students who know Biology well and still lose marks, because knowing the content and writing the answer the mark scheme rewards are two different skills.',
    tips: [
      {
        title: 'Describe and explain are different questions',
        body: '"The heart rate increases" describes. The marks are in the physiological reason — which mechanism produces the change, and why. If your answer could be written by someone reading a graph without any Biology, it is a description.',
      },
      {
        title: 'A definition needs the key term, not an example',
        body: 'Giving an example, or describing the process instead of defining it, is the most common way to drop a definition mark on content the student actually knows. Definitions are worth learning in the syllabus’s own words.',
      },
    ],
  },
  {
    id: 'tips-english',
    heading: 'English Language',
    lead: 'In English our tutors see strong writers lose marks for reasons that have nothing to do with how good their English is.',
    tips: [
      {
        title: 'Situational writing: tick off every content point as you plan',
        body: 'A polished, well-organised response that misses one required point loses those marks regardless of how well it reads. Tone counts too — the register has to match the audience and situation, not default to essay English.',
      },
      {
        title: 'In comprehension, identify the question type before answering',
        body: 'Literal, inference, vocabulary-in-context, language effect and summary each want a different answer shape. Inference answers that quote the passage without explaining what it implies, and language answers that name a technique without explaining its effect, are the two biggest recurring losses.',
      },
      {
        title: 'Use the words you are confident with',
        body: 'Forced "impressive" vocabulary produces awkward phrasing and grammar errors in sentences that would have been correct in plain English. The same applies to memorised phrases dropped in where they do not fit — and it applies just as much to Chinese and Higher Chinese composition.',
      },
    ],
  },
];

// Shorter pointers for subjects that have their own paper conventions; the
// full treatment belongs on the individual subject guides, not this hub.
const otherSubjectNotes = [
  ['Geography', 'Case studies are evidence, not decoration. Naming an event proves nothing — the marks are in using its specifics to support the argument.'],
  ['History', '"The source is biased" scores nothing on its own. Explain how the provenance or content affects reliability for the particular claim being tested.'],
  ['Literature', 'Identifying the metaphor is step one, not the answer. What it suggests, why the writer chose it and what effect it creates are where the marks sit.'],
  ['Chinese and Higher Chinese', 'Memorise structures and transitions, not whole essays. Forced 成语 and memorised paragraphs that do not fit the prompt read worse than plain, accurate Chinese.'],
  ['Principles of Accounts', 'When a statement will not balance, find the first incorrect entry rather than fixing the final number — one early error cascades through journal, ledger, trial balance and both statements.'],
  ['Computing', 'When a trace question goes wrong, the cause is usually not syntax. Trace variable by variable through each iteration instead of reasoning backwards from the output.'],
];

const TableOfContents = () => (
  <aside className="hidden lg:block w-64 xl:w-72">
    <div className="sticky top-28 space-y-3 border-l-2 pl-4">
      <h4 className="font-bold text-sm tracking-wide uppercase text-foreground">On This Page</h4>
      <nav className="flex flex-col space-y-2 text-sm">
        <Link href="#system" className="text-muted-foreground hover:text-primary transition-colors">Understanding the O-Level System</Link>
        <Link href="#timetable" className="text-muted-foreground hover:text-primary transition-colors">2026 O-Level exam timetable</Link>
        <Link href="#sec3-sec4-timeline" className="text-muted-foreground hover:text-primary transition-colors">Sec 3 to Sec 4 timeline</Link>
        <Link href="#timeline" className="text-muted-foreground hover:text-primary transition-colors">The 24-Month Roadmap</Link>
        <Link href="#strategies" className="text-muted-foreground hover:text-primary transition-colors">Subject-Specific Strategies</Link>
        <Link href="#tips" className="text-muted-foreground hover:text-primary transition-colors">21 tips from our tutors</Link>
        <Link href="#prelim-recovery" className="text-muted-foreground hover:text-primary transition-colors">If your prelims went badly</Link>
        <Link href="#exam-strategy" className="text-muted-foreground hover:text-primary transition-colors">Mastering Exam Strategy</Link>
        <Link href="#pitfalls" className="text-muted-foreground hover:text-primary transition-colors">Preparation mistakes to avoid</Link>
        <Link href="#study-plan" className="text-muted-foreground hover:text-primary transition-colors">Creating a Personal Study Plan</Link>
        <Link href="#resources" className="text-muted-foreground hover:text-primary transition-colors">Essential Resources & Tools</Link>
        <Link href="#related-o-level-prep" className="text-muted-foreground hover:text-primary transition-colors">In-depth O-Level subject guides</Link>
        <Link href="#well-being" className="text-muted-foreground hover:text-primary transition-colors">Managing Stress & Well-being</Link>
        <Link href="#pathways" className="text-muted-foreground hover:text-primary transition-colors">Post-O-Level Pathways</Link>
        <Link href="#tuition" className="text-muted-foreground hover:text-primary transition-colors">When to Consider Tuition</Link>
        <Link href="#countdown" className="text-muted-foreground hover:text-primary transition-colors">The Final 60-Day Countdown</Link>
        <Link href="#faq" className="text-muted-foreground hover:text-primary transition-colors">O-Level FAQs</Link>
      </nav>
    </div>
  </aside>
);

export default function OLevelPrepGuideClient() {
  return (
    <div className="bg-background text-foreground">
      {/* Header */}
      <header className="bg-muted/30 border-b">
        <div className="container mx-auto px-6 py-16 md:py-24 text-center">
          <p className="font-semibold text-primary">THE 2026 GCE O-LEVELS</p>
          <h1 className="mt-2 text-4xl md:text-6xl font-extrabold text-primary leading-tight tracking-tighter">
            How to Prepare for the O-Levels
          </h1>
          <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            The 2026 timetable and a term-by-term study plan, 21 exam-tested tips from our tutors, and what to do if your prelims went badly.
          </p>
          <div className="mt-8">
            <Button size="lg" className="bg-accent text-text-inverse hover:bg-accent/90 shadow-lg transform hover:scale-105 transition-transform">
              <Link href="/request-tutor">Request a Specialist O-Level Tutor</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-16 flex flex-col lg:flex-row gap-12 xl:gap-20">
        <TableOfContents />
        <main className="flex-1 min-w-0">
          <article className="space-y-20">
            {/* SECTION: Understanding the O-Level System */}
            <section id="system" aria-labelledby="system-heading">
                <h2 id="system-heading" className="text-3xl font-bold mb-6 border-l-4 border-primary pl-4 flex items-center"><Calculator className="mr-3 h-8 w-8" />Understanding the O-Level System in Singapore</h2>
                <p className="text-lg text-muted-foreground mb-6">
                  The GCE O-Level examinations, jointly conducted by the Singapore Examinations and Assessment Board (SEAB) and Cambridge, are the critical gateway to your post-secondary education. Mastering the scoring system isn't just about grades—it's about strategically planning your path to Junior College or Polytechnic.
                </p>
                <Card className="shadow-md">
                    <CardHeader>
                        <CardTitle>O-Level Grading and Entry Requirements</CardTitle>
                        <CardDescription>A lower aggregate score is better. Here’s how your grades translate into opportunities.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="font-semibold text-primary mb-2">Grade Points (The Lower, The Better)</h3>
                                <ul className="space-y-1 text-muted-foreground">
                                    <li><strong>A1:</strong> 1 point (Distinction)</li>
                                    <li><strong>A2:</strong> 2 points (Distinction)</li>
                                    <li><strong>B3:</strong> 3 points (Credit)</li>
                                    <li><strong>B4:</strong> 4 points (Credit)</li>
                                    <li><strong>C5:</strong> 5 points (Credit)</li>
                                    <li><strong>C6:</strong> 6 points (Credit)</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-semibold text-primary mb-2">Typical Post-Secondary Entry Scores</h3>
                                <ul className="space-y-1 text-muted-foreground">
                                    <li><strong>Junior College (JC):</strong> L1R5 ≤ 20 points</li>
                                    <li><strong>Polytechnic:</strong> L1R4 ≤ 26 points (course-dependent)</li>
                                    <li><strong>Institute of Technical Education (ITE):</strong> Minimum 5 passed subjects</li>
                                    <li><strong>Private Institutions:</strong> Requirements vary</li>
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </section>

            {/* SECTION: 2026 O-Level Exam Timetable */}
            <section id="timetable" aria-labelledby="timetable-heading">
                <h2 id="timetable-heading" className="text-3xl font-bold mb-6 border-l-4 border-primary pl-4 flex items-center"><CalendarClock className="mr-3 h-8 w-8" />When are the 2026 O-Level exams?</h2>
                <p className="text-lg text-muted-foreground mb-6">
                  {O_LEVEL_FAQS[0].answer}
                </p>
                <Card className="shadow-md">
                    <CardContent className="pt-6">
                        <ExamTimetable examSlug="o-level" caption="Official 2026 GCE O-Level timetable, as published by SEAB." />
                    </CardContent>
                </Card>
            </section>

            {/* SECTION: Sec 3 to Sec 4 timeline */}
            <section id="sec3-sec4-timeline" aria-labelledby="sec3-sec4-timeline-heading">
                <h2 id="sec3-sec4-timeline-heading" className="text-3xl font-bold mb-6 border-l-4 border-primary pl-4 flex items-center"><Milestone className="mr-3 h-8 w-8" />What should I be doing from Sec 3 to Sec 4?</h2>
                <p className="text-lg text-muted-foreground mb-8">
                  From Sec 3 to Sec 4, O-Level preparation moves through six phases: locking in your subject combination, consolidating weak topics before Sec 4 begins, finishing the syllabus, then shifting to full timed papers, prelims, and a final run built around the SEAB exam dates below.
                </p>
                <Card className="shadow-md">
                    <CardContent className="pt-6">
                        <GuideTimeline items={sec3ToSec4} />
                    </CardContent>
                </Card>
            </section>

            {/* SECTION: Timeline */}
            <section id="timeline" aria-labelledby="timeline-heading">
              <h2 id="timeline-heading" className="text-3xl font-bold mb-8 border-l-4 border-primary pl-4 flex items-center"><Calendar className="mr-3 h-8 w-8" />The 24-Month O-Level Roadmap</h2>
              <div className="space-y-6">
                <Card className="shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp className="text-green-500"/>Secondary 3 - The Foundation Phase</CardTitle></CardHeader>
                  <CardContent>
                    <p className="mb-3 text-muted-foreground">This is the most crucial year. What you build here determines the height you can reach in Secondary 4. The focus is on deep conceptual understanding.</p>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Establish strong, consistent study habits and time management skills.</li>
                      <li>Master the fundamental concepts in all core subjects to prevent knowledge gaps.</li>
                      <li>Identify personal strengths and weaknesses through regular class tests and assessments.</li>
                      <li>Begin creating comprehensive, organized notes for each subject.</li>
                      <li>Prioritize understanding the 'why' behind concepts, not just memorizing the 'what'.</li>
                      <li>Actively participate in class and seek clarification from teachers immediately when in doubt.</li>
                    </ul>
                  </CardContent>
                </Card>
                <Card className="shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader><CardTitle className="flex items-center gap-2"><PenTool className="text-yellow-500"/>Secondary 4 (Terms 1-2) - The Content Mastery Phase</CardTitle></CardHeader>
                  <CardContent>
                    <p className="mb-3 text-muted-foreground">The focus shifts from learning new content to applying it. You should aim to complete the syllabus and begin familiarizing yourself with the exam format.</p>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                        <li>Systematically complete syllabus coverage for all subjects.</li>
                        <li>Begin practicing with topical Ten Year Series (TYS) questions.</li>
                        <li>Develop subject-specific study techniques, such as creating formula sheets or mind maps.</li>
                        <li>Create and adhere to a comprehensive revision schedule.</li>
                        <li>Form effective study groups for collaborative learning and to tackle difficult problems together.</li>
                        <li>Seek additional support for challenging subjects early on, before they become critical issues.</li>
                    </ul>
                  </CardContent>
                </Card>
                <Card className="shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader><CardTitle className="flex items-center gap-2"><Target className="text-orange-500"/>Secondary 4 (Term 3 to Prelims) - The Application Phase</CardTitle></CardHeader>
                  <CardContent>
                    <p className="mb-3 text-muted-foreground">This is where you sharpen your skills under pressure. The goal is to build exam endurance and refine your answering techniques.</p>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                        <li>Engage in intensive practice with full O-Level past papers.</li>
                        <li>Master exam techniques, such as keyword identification and answer structuring.</li>
                        <li>Simulate full examination conditions at home to build stamina and manage time.</li>
                        <li>Systematically analyze every mistake in a dedicated logbook.</li>
                        <li>Fine-tune your time management strategies for each individual paper.</li>
                        <li>Build confidence through consistent, deliberate practice and review.</li>
                    </ul>
                  </CardContent>
                </Card>
                <Card className="shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader><CardTitle className="flex items-center gap-2"><ShieldCheck className="text-red-500"/>Post-Prelims to O-Levels - The Peak Performance Phase</CardTitle></CardHeader>
                  <CardContent>
                    <p className="mb-3 text-muted-foreground">The final lap. Revision becomes highly targeted, and the focus is on consolidating knowledge and managing your mental state for optimal performance.</p>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                        <li>Conduct intensive, targeted revision based on your prelims performance.</li>
                        <li>Finalize and consolidate key concepts, formulas, and definitions onto summary sheets.</li>
                        <li>Continue daily practice papers under strict examination timing.</li>
                        <li>Practice mental preparation and stress management techniques.</li>
                        <li>Prioritize physical health with a consistent sleep schedule and balanced nutrition.</li>
                        <li>Double-check all examination logistics, including venues, timings, and required materials.</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </section>
            
            {/* SECTION: Subject-Specific Strategies */}
            <section id="strategies" aria-labelledby="strategies-heading">
              <h2 id="strategies-heading" className="text-3xl font-bold mb-8 border-l-4 border-primary pl-4 flex items-center"><BookOpen className="mr-3 h-8 w-8" />Subject-Specific Strategies for A1 Grades</h2>
              <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>📚 Languages (English & Mother Tongue)</CardTitle>
                        <CardDescription>Focus on structure, nuance, and cultural context.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <h4 className="font-semibold">English Language:</h4>
                            <ul className="list-disc pl-5 mt-1 space-y-1 text-sm text-muted-foreground">
                                <li><strong>Essay Writing:</strong> Read editorials and opinion pieces to develop strong arguments. Practice the PEEL (Point, Evidence, Explanation, Link) structure for coherent paragraphs.</li>
                                <li><strong>Comprehension:</strong> Master identifying the question type. Is it literal, inferential, or vocabulary-in-context? Practice annotating passages to actively engage with the text.</li>
                                <li><strong>Vocabulary:</strong> Keep a word journal. Don't just list words; write sentences using them in context.</li>
                                <li><strong>Oral & Listening:</strong> Practice discussing current affairs with family to build confidence. Listen to news podcasts to train your ear for different accents and speeds.</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold">Mother Tongue Languages:</h4>
                            <ul className="list-disc pl-5 mt-1 space-y-1 text-sm text-muted-foreground">
                                <li><strong>Immersion:</strong> Go beyond the textbook. Read local newspapers, watch dramas, and listen to radio in your Mother Tongue to internalize natural phrasing.</li>
                                <li><strong>Composition:</strong> Understand cultural nuances and common proverbs (谚语/peribahasa). Weave them into your writing appropriately to demonstrate depth.</li>
                                <li><strong>Oral Exam:</strong> Be prepared to discuss topics relevant to Singapore's cultural context. Practice forming and articulating your opinions clearly.</li>
                            </ul>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>🔬 Sciences (Physics, Chemistry, Biology)</CardTitle>
                        <CardDescription>Prioritize conceptual understanding and precise application.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                            <li><strong>Keywords are King:</strong> Create flashcards for scientific keywords. Marks are often awarded for using the correct terminology (e.g., "denaturation" vs. "cooked").</li>
                            <li><strong>Master Practical Skills:</strong> Understand the purpose of each step in lab procedures. Be able to identify sources of error and suggest improvements.</li>
                            <li><strong>Scientific Writing:</strong> Practice the C-E-R (Claim, Evidence, Reasoning) framework for structured answers. Make a scientific claim, support it with data from the question, and explain the underlying concept.</li>
                            <li><strong>Concept Maps:</strong> Use visual aids like diagrams and flowcharts to connect different topics, especially for complex processes like respiration or electricity.</li>
                            <li><strong>Real-World Links:</strong> Actively connect theoretical knowledge to real-world applications (e.g., how physics principles apply in a car engine). This deepens understanding.</li>
                            <li><strong>Numerical Problems (Physics/Chem):</strong> Practice daily. Always write down the formula, show your substitutions, and include the correct units in your final answer to avoid losing careless marks.</li>
                        </ul>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>📊 Mathematics (Elementary & Additional)</CardTitle>
                        <CardDescription>Build a foundation of relentless practice and systematic error analysis.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                            <li><strong>Daily Practice:</strong> Math is a skill built on consistency. Dedicate time every single day to solve a variety of problems.</li>
                            <li><strong>Identify Question Patterns:</strong> After completing a topic, review past paper questions to identify common patterns and the specific information you need to look for.</li>
                            <li><strong>Show Your Work:</strong> Present your steps clearly and logically. Marks are often awarded for correct working even if the final answer is wrong.</li>
                            <li><strong>Calculator Fluency:</strong> Know your calculator inside out. Master functions for statistics, solving equations, and graphing to save precious time during exams.</li>
                            <li><strong>Mistake Logbook:</strong> Don't just discard wrong answers. Categorize your mistakes: Was it a careless calculation, a conceptual error, or a misread question? This pinpoints true weaknesses.</li>
                        </ul>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>🏛️ Humanities (History, Geography, Social Studies)</CardTitle>
                        <CardDescription>Develop strong analytical skills and the ability to construct well-supported arguments.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                            <li><strong>Master Timelines & Causality:</strong> For History, create detailed timelines. Understand not just *what* happened, but *why* it happened and its consequences.</li>
                            <li><strong>Structured Essays:</strong> For essay questions (SEQ), always plan your answer. Use a clear structure with an introduction, balanced body paragraphs (using PEEL), and a concise conclusion.</li>
                            <li><strong>Source-Based Questions (SBQ):</strong> Practice identifying Purpose, Audience, Tone, and Message for each source. Learn the skills of comparison, reliability testing, and inference.</li>
                            <li><strong>Use Examples:</strong> Support every argument with specific case studies and evidence, whether from historical events, geographical examples, or social studies contexts.</li>
                            <li><strong>Map & Data Skills (Geog):</strong> Regularly practice map reading, graph interpretation, and photograph analysis until they become second nature.</li>
                        </ul>
                    </CardContent>
                </Card>
              </div>
            </section>
            
            {/* SECTION: The 21 tips */}
            <section id="tips" aria-labelledby="tips-heading">
                <h2 id="tips-heading" className="text-3xl font-bold mb-6 border-l-4 border-primary pl-4 flex items-center"><Lightbulb className="mr-3 h-8 w-8" />21 O-Level tips from our tutors</h2>
                <p className="text-lg text-muted-foreground mb-8">
                  These are the corrections our tutors make most often with Sec 3 and Sec 4 students. Almost none of them are about working harder. They are about converting knowledge the student already has into the specific answer the paper rewards — which is where the majority of recoverable marks sit.
                </p>
                <div className="space-y-10">
                  {tipGroups.map((group, groupIndex) => {
                    // Continuous numbering across groups.
                    const startNumber =
                      tipGroups.slice(0, groupIndex).reduce((total, g) => total + g.tips.length, 0) + 1;
                    return (
                      <div key={group.id}>
                        <h3 id={group.id} className="scroll-mt-24 text-2xl font-bold text-primary mb-3">{group.heading}</h3>
                        <p className="text-muted-foreground mb-6">{group.lead}</p>
                        <div className="space-y-4">
                          {group.tips.map((tip, tipIndex) => (
                            <Card key={tip.title} className="shadow-sm">
                              <CardContent className="flex gap-4 pt-6">
                                <span
                                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary"
                                  aria-hidden="true"
                                >
                                  {startNumber + tipIndex}
                                </span>
                                <div>
                                  <h4 className="font-semibold text-foreground mb-1">{tip.title}</h4>
                                  <p className="text-sm text-muted-foreground">{tip.body}</p>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <Card className="mt-10 shadow-sm">
                  <CardHeader>
                    <CardTitle>Other subjects, in one line each</CardTitle>
                    <CardDescription>The same principle applies — every paper has its own way of turning knowledge into marks.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <dl className="space-y-3">
                      {otherSubjectNotes.map(([subject, note]) => (
                        <div key={subject}>
                          <dt className="font-semibold text-sm text-foreground">{subject}</dt>
                          <dd className="text-sm text-muted-foreground">{note}</dd>
                        </div>
                      ))}
                    </dl>
                  </CardContent>
                </Card>
            </section>

            {/* SECTION: Prelim recovery */}
            <section id="prelim-recovery" aria-labelledby="prelim-recovery-heading">
                <h2 id="prelim-recovery-heading" className="text-3xl font-bold mb-6 border-l-4 border-primary pl-4 flex items-center"><Target className="mr-3 h-8 w-8" />How to improve fast if your prelims went badly</h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Prelims are a diagnostic, not a verdict. The fastest recovery between prelims and the O-Levels comes from working out exactly where the marks went, then attacking the cheapest categories first — technique and careless marks come back in weeks, genuine knowledge gaps take months. Students who recover most are almost always the ones who can name the category their lost marks fall into.
                </p>
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Step 1 · Get every script back and classify every lost mark</CardTitle>
                      <CardDescription>Not "I did badly in Chemistry" — mark by mark, into six categories.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                        <li><strong>Knowledge</strong> — you did not know the content.</li>
                        <li><strong>Application</strong> — you knew it, but not in that context.</li>
                        <li><strong>Technique</strong> — the answer missed the keyword, the mechanism or the required structure.</li>
                        <li><strong>Careless</strong> — sign, unit, transcription, arithmetic.</li>
                        <li><strong>Time</strong> — you ran out and left marks on the table.</li>
                        <li><strong>Misread</strong> — you answered a different question from the one asked.</li>
                      </ul>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Step 2 · Count them, do not estimate</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">Add the marks in each category, per subject. Nearly every student we do this with is wrong about where their marks went before they count. Most assume knowledge; most find technique and careless dominate.</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Step 3 · Attack in cost order, not in syllabus order</CardTitle>
                      <CardDescription>Cheapest marks first — that is what makes the difference over a short runway.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                        <li><strong>Weeks:</strong> careless, misread and time marks. These respond to checking habits and pacing drills, not to more content.</li>
                        <li><strong>Weeks to a month:</strong> technique marks — keywords, mechanism sentences, observation against inference, command words. This is usually the single biggest recoverable block.</li>
                        <li><strong>Month plus:</strong> application, then genuine knowledge gaps. Real, but the slowest per mark, and the wrong place to start if the exam is close.</li>
                      </ul>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Step 4 · Run the loop on whichever category dominates</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">Attempt, mark, categorise, write one line on why, redo, then a similar question days later (tip 3). Doing this on twenty targeted questions beats another full paper skimmed for the answers.</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Step 5 · Re-test under real timing</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        A category is only fixed when it stops appearing on a timed paper. Work through school prelim papers from other schools under exam conditions and classify the losses again — the mix should have shifted. Our{' '}
                        <Link href="/free-test-papers" className="text-primary underline underline-offset-2">
                          free O-Level and JC prelim papers
                        </Link>{' '}
                        are a good source of unseen papers for this.
                      </p>
                    </CardContent>
                  </Card>
                </div>
            </section>

            {/* SECTION: O-Level Examination Strategies */}
            <section id="exam-strategy" aria-labelledby="exam-strategy-heading">
                <h2 id="exam-strategy-heading" className="text-3xl font-bold mb-8 border-l-4 border-primary pl-4 flex items-center"><ListChecks className="mr-3 h-8 w-8" />Mastering O-Level Examination Strategy</h2>
                <div className="space-y-6">
                    <Card>
                        <CardHeader><CardTitle>Before the Examination:</CardTitle></CardHeader>
                        <CardContent>
                            <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                                <li><strong>Confirm Logistics:</strong> Double-check your exam timetable, venue, and required materials (calculators, stationery, ID) the night before.</li>
                                <li><strong>Fuel Your Brain:</strong> Ensure you get adequate sleep (at least 8 hours) and have a nutritious meal before the exam. Avoid heavy, greasy foods.</li>
                                <li><strong>Warm-Up, Don't Cram:</strong> Do a light review of key formulas or concepts, but avoid trying to learn new information. The goal is to get your brain into the right mode.</li>
                                <li><strong>Manage Anxiety:</strong> Practice deep breathing or other relaxation techniques to calm your nerves. Arrive at the venue early to avoid rushing.</li>
                            </ul>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader><CardTitle>During the Examination:</CardTitle></CardHeader>
                        <CardContent>
                            <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                                <li><strong>Deconstruct the Paper:</strong> Use the first few minutes to scan the entire paper. Mentally note the questions you are most confident in.</li>
                                <li><strong>Start Strong:</strong> Begin with questions you can answer well to build confidence and secure early marks.</li>
                                <li><strong>Show All Workings:</strong> For calculation-based subjects, write down every step clearly. Method marks are invaluable.</li>
                                <li><strong>Don't Get Stuck:</strong> If a question is too difficult, circle it and move on. Return to it only after completing the rest of the paper.</li>
                                <li><strong>Answer the Question:</strong> Pay close attention to command words (e.g., 'Explain', 'Describe', 'Compare'). Ensure your answer directly addresses what is being asked.</li>
                            </ul>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader><CardTitle>Time Management Mastery:</CardTitle></CardHeader>
                        <CardContent>
                            <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                                <li><strong>Allocate by Marks:</strong> A simple rule is to allocate roughly 1 to 1.5 minutes per mark. A 5-mark question should not take 15 minutes.</li>
                                <li><strong>Plan Your Attack:</strong> Before you start writing, allocate specific time blocks for each section of the paper.</li>
                                <li><strong>The Final Check:</strong> Always reserve the last 10-15 minutes to review your answers, check for careless mistakes, and ensure you haven't missed any questions.</li>
                                <li><strong>Practice Makes Perfect:</strong> The only way to master timing is to complete numerous past papers under strict, timed conditions. This builds a natural rhythm.</li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </section>
            
            {/* SECTION: Common O-Level Preparation Mistakes */}
            <section id="pitfalls" aria-labelledby="pitfalls-heading">
                <div className="bg-red-100/50 border-l-4 border-red-500 text-red-900 p-6 rounded-r-lg shadow-lg">
                    <h2 id="pitfalls-heading" className="text-2xl font-bold flex items-center mb-2 text-red-700"><AlertTriangle className="mr-3 h-8 w-8" />Preparation mistakes that cost the most</h2>
                    <p className="text-sm text-red-800/80 mb-4">The tips above cover marks lost inside the exam hall. These are the ones lost in the two years before it.</p>
                    <div className="text-red-800/90">
                        <ol className="list-decimal list-inside space-y-2">
                            <li><strong>Starting serious preparation too late in Sec 4</strong>, when the syllabus is still being completed.</li>
                            <li><strong>Over-investing in favourite subjects and avoiding weak ones</strong> — L1R5 counts both, and the cheapest grade to move is usually the worst one.</li>
                            <li><strong>Leaving the Ten Year Series until the final months</strong>, so there is no time left to act on what it exposes.</li>
                            <li><strong>Not asking teachers for help early</strong>, while there is still runway to do something about the answer.</li>
                            <li><strong>Trading sleep for cramming in the final weeks</strong>, which reliably costs more marks in careless errors than the extra hours add.</li>
                            <li><strong>Studying without a schedule</strong>, so the subject that gets dropped is always the one that needed the time.</li>
                        </ol>
                    </div>
                </div>
            </section>

            {/* SECTION: Creating Your Personalized O-Level Study Plan */}
            <section id="study-plan" aria-labelledby="study-plan-heading">
                <h2 id="study-plan-heading" className="text-3xl font-bold mb-8 border-l-4 border-primary pl-4 flex items-center"><Clock className="mr-3 h-8 w-8" />Creating Your Personalized O-Level Study Plan</h2>
                <Card className="shadow-md">
                    <CardHeader><CardTitle>Weekly Study Schedule Template</CardTitle><CardDescription>This is a starting point. Adapt it to your own energy levels, CCA commitments, and subject needs.</CardDescription></CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <h4 className="font-semibold">Weekdays (Monday-Friday):</h4>
                            <ul className="list-disc pl-5 text-sm text-muted-foreground mt-1 space-y-1">
                                <li><strong>3:00 PM - 4:00 PM:</strong> Rest & Recharge. Complete any urgent school homework.</li>
                                <li><strong>4:30 PM - 6:00 PM:</strong> Deep Work Session 1 (e.g., focus on a "heavy" subject like A-Math or Physics).</li>
                                <li><strong>7:30 PM - 8:30 PM:</strong> Deep Work Session 2 (e.g., rotate through other subjects).</li>
                                <li><strong>9:00 PM - 9:30 PM:</strong> Daily Review. Quickly go over what you learned and plan the next day's tasks.</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold">Weekends (Saturday-Sunday):</h4>
                             <ul className="list-disc pl-5 text-sm text-muted-foreground mt-1 space-y-1">
                                <li><strong>Morning (9 AM - 12 PM):</strong> Intensive session on your weakest subject. This is prime brain time—use it wisely.</li>
                                <li><strong>Afternoon (2 PM - 4 PM):</strong> Timed practice paper session. Replicate exam conditions.</li>
                                <li><strong>Evening (7 PM - 8 PM):</strong> Weekly Review. Go through your mistake logbook and consolidate the week's learning.</li>
                                <li><strong>Sunday Night:</strong> Plan the upcoming week's study focus to start Monday with clarity.</li>
                            </ul>
                        </div>
                    </CardContent>
                </Card>
            </section>

            {/* SECTION: Essential O-Level Resources and Materials */}
            <section id="resources" aria-labelledby="resources-heading">
                <h2 id="resources-heading" className="text-3xl font-bold mb-8 border-l-4 border-primary pl-4 flex items-center"><GraduationCap className="mr-3 h-8 w-8" />Essential O-Level Resources and Materials</h2>
                <div className="space-y-6">
                    <div>
                        <h3 className="font-semibold text-lg">Official Resources (Non-Negotiable)</h3>
                        <ul className="list-disc pl-5 text-sm text-muted-foreground mt-1 space-y-1">
                            <li><strong>SEAB Syllabus Documents:</strong> The official "rulebook" for each subject. Download it and use it as a checklist.</li>
                            <li><strong>Ten Year Series (TYS):</strong> Your most important practice tool. Aim to complete the last 10 years of papers.</li>
                            <li><strong>School Textbooks & Notes:</strong> Your primary source of information, aligned with what your teachers emphasize.</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg">Supplementary Materials</h3>
                        <ul className="list-disc pl-5 text-sm text-muted-foreground mt-1 space-y-1">
                            <li><strong>Topical Assessment Books:</strong> Useful in Sec 3 and early Sec 4 to drill specific concepts.</li>
                            <li><strong>Online Learning Platforms:</strong> Khan Academy (for Math/Science concepts), YouTube educational channels (for visual explanations).</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg">Digital Productivity Tools</h3>
                        <ul className="list-disc pl-5 text-sm text-muted-foreground mt-1 space-y-1">
                            <li><strong>Scheduling:</strong> Google Calendar or Todoist to plan your study sessions.</li>
                            <li><strong>Note-Taking:</strong> Notion or OneNote to organize your notes digitally.</li>
                            <li><strong>Flashcards:</strong> Anki (for spaced repetition) or Quizlet for active recall practice.</li>
                            <li><strong>Focus:</strong> Forest or similar apps to lock your phone and track focused study time.</li>
                        </ul>
                    </div>
                </div>
            </section>
            
            <RelatedGuides slug="o-level-prep" heading="In-depth O-Level subject guides" showHub={false} />

            {/* SECTION: Managing Stress and Maintaining Well-being */}
            <section id="well-being" aria-labelledby="well-being-heading">
                <h2 id="well-being-heading" className="text-3xl font-bold mb-8 border-l-4 border-primary pl-4 flex items-center"><Heart className="mr-3 h-8 w-8" />Managing Stress and Maintaining Well-being</h2>
                <p className="text-lg text-muted-foreground mb-6">A burnt-out student cannot perform. Your physical and mental health are not luxuries—they are essential components of your academic success.</p>
                <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader><CardTitle>Physical Health Pillars</CardTitle></CardHeader>
                        <CardContent>
                            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                                <li><strong>Consistent Sleep:</strong> Aim for 7-9 hours per night. Sleep is critical for memory consolidation.</li>
                                <li><strong>Regular Exercise:</strong> Even a 20-minute walk can reduce stress and improve focus.</li>
                                <li><strong>Balanced Nutrition:</strong> Fuel your brain with healthy meals and stay hydrated. Avoid excessive sugar and caffeine.</li>
                                <li><strong>Scheduled Breaks:</strong> Step away from your desk during breaks. Do something completely unrelated to studying.</li>
                            </ul>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader><CardTitle>Mental Health Strategies</CardTitle></CardHeader>
                        <CardContent>
                             <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                                <li><strong>Mindfulness & Breathing:</strong> Practice simple mindfulness exercises to manage anxiety.</li>
                                <li><strong>Stay Connected:</strong> Don't isolate yourself. Talk to family and friends about things other than exams.</li>
                                <li><strong>Set Realistic Goals:</strong> Break down large tasks into small, manageable steps to avoid feeling overwhelmed.</li>
                                <li><strong>Seek Support:</strong> It's a sign of strength to talk to a teacher, parent, or counselor if you're feeling overwhelmed.</li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* SECTION: Post-O-Level Pathways and Planning */}
            <section id="pathways" aria-labelledby="pathways-heading">
                <h2 id="pathways-heading" className="text-3xl font-bold mb-8 border-l-4 border-primary pl-4 flex items-center"><TrendingUp className="mr-3 h-8 w-8" />Post-O-Level Pathways and Planning</h2>
                <Card className="shadow-md">
                    <CardHeader><CardTitle>Understanding Your Options</CardTitle><CardDescription>Your O-Level results open doors to different pathways. Knowing the requirements helps you set clear targets.</CardDescription></CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <h4 className="font-semibold">Junior College (JC) - 2-Year A-Level Programme</h4>
                            <ul className="list-disc pl-5 text-sm text-muted-foreground mt-1">
                                <li><strong>Requirements:</strong> L1R5 score of 20 or less, with specific subject grade requirements.</li>
                                <li><strong>Leads to:</strong> Primarily university admission via A-Level results.</li>
                                <li><strong>Best for:</strong> Students with strong academic inclinations aiming for university.</li>
                            </ul>
                        </div>
                         <div>
                            <h4 className="font-semibold">Polytechnic - 3-Year Diploma Programmes</h4>
                            <ul className="list-disc pl-5 text-sm text-muted-foreground mt-1">
                                <li><strong>Requirements:</strong> L1R4 score of 26 or less, with course-specific subject requirements.</li>
                                <li><strong>Leads to:</strong> Direct employment in specialized fields or university admission.</li>
                                <li><strong>Best for:</strong> Students who prefer hands-on, applied learning and want to develop practical skills.</li>
                            </ul>
                        </div>
                         <div>
                            <h4 className="font-semibold">Institute of Technical Education (ITE)</h4>
                            <ul className="list-disc pl-5 text-sm text-muted-foreground mt-1">
                                <li><strong>Requirements:</strong> Minimum of 5 passed O-Level subjects.</li>
                                <li><strong>Leads to:</strong> Polytechnic progression (Higher Nitec) or skilled employment.</li>
                                <li><strong>Best for:</strong> Students who excel in hands-on, technical education.</li>
                            </ul>
                        </div>
                    </CardContent>
                </Card>
            </section>
            
            {/* SECTION: When to Consider O-Level Tuition */}
            <section id="tuition" aria-labelledby="tuition-heading">
                <h2 id="tuition-heading" className="text-3xl font-bold mb-8 border-l-4 border-primary pl-4 flex items-center"><Users className="mr-3 h-8 w-8" />When to Consider O-Level Tuition</h2>
                <p className="text-lg text-muted-foreground mb-6">While self-study is vital, targeted support can make a significant difference. A specialist tutor can provide personalized guidance where it's needed most.</p>
                <Card className="shadow-md">
                    <CardHeader><CardTitle>Key Indicators That a Tutor Could Help</CardTitle></CardHeader>
                    <CardContent>
                        <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                            <li>You're struggling with specific subjects despite consistent effort.</li>
                            <li>You need a more structured and personalized learning approach than school can provide.</li>
                            <li>You require more intensive practice and expert feedback to refine your answers.</li>
                            <li>You lack confidence in your exam techniques and time management skills.</li>
                            <li>You're aiming for specific grades to meet competitive course entry requirements.</li>
                            <li>You benefit from the focused attention of a small group or one-on-one setting.</li>
                            <li>You need motivation and accountability to stay on track with your study plan.</li>
                        </ul>
                        <div className="mt-4 bg-muted/50 p-4 rounded-lg">
                            <p className="text-sm font-semibold">Look for O-Level tutors who have deep experience with the current SEAB syllabus, a proven track record, and the ability to adapt their teaching style to your specific learning needs.</p>
                        </div>
                    </CardContent>
                </Card>
            </section>
            
            {/* SECTION: Final Preparation: The Last 60 Days */}
            <section id="countdown" aria-labelledby="countdown-heading">
                <h2 id="countdown-heading" className="text-3xl font-bold mb-8 border-l-4 border-primary pl-4 flex items-center"><Target className="mr-3 h-8 w-8" />The Final 60-Day Countdown</h2>
                <Card className="shadow-md">
                    <CardHeader><CardTitle>An Intensive Strategy for the Home Stretch</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <h4 className="font-semibold">Days 60-31: Comprehensive Review & Gap Filling</h4>
                            <ul className="list-disc pl-5 text-sm text-muted-foreground mt-1 space-y-1">
                                <li>Complete any remaining topics and begin intensive TYS practice (1-2 papers daily).</li>
                                <li>Use your performance to identify and aggressively target remaining knowledge gaps.</li>
                                <li>Create final, condensed summary sheets and formula lists for quick review.</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold">Days 30-15: Peak Practice & Simulation</h4>
                            <ul className="list-disc pl-5 text-sm text-muted-foreground mt-1 space-y-1">
                                <li>Shift to daily full paper practice under strict, timed conditions. No excuses.</li>
                                <li>Focus on refining examination techniques, answer precision, and time allocation.</li>
                                <li>Analyze your performance patterns. Are you losing marks at the start? Or running out of time at the end? Adjust your strategy.</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold">Days 14-1: Final Consolidation & Mental Prep</h4>
                            <ul className="list-disc pl-5 text-sm text-muted-foreground mt-1 space-y-1">
                                <li>Transition from intense practice to light revision of key concepts and your mistake logbook.</li>
                                <li>Prepare all your exam materials. Pack your bag the night before each paper.</li>
                                <li>Focus on building a positive mindset. Visualize success and trust in the preparation you've done.</li>
                            </ul>
                        </div>
                    </CardContent>
                </Card>
            </section>

            {/* SECTION: FAQ */}
            <section id="faq" aria-labelledby="faq-heading">
                <h2 id="faq-heading" className="text-3xl font-bold mb-8 border-l-4 border-primary pl-4 flex items-center"><HelpCircle className="mr-3 h-8 w-8" />O-Level FAQs</h2>
                <div className="space-y-6">
                  {O_LEVEL_FAQS.map((faq) => (
                    <div key={faq.question}>
                      <h3 className="text-xl font-semibold text-foreground">{faq.question}</h3>
                      <p className="mt-2 text-muted-foreground">{faq.answer}</p>
                    </div>
                  ))}
                </div>
            </section>

            {/* FINAL CTA */}
            <section id="final-cta" aria-labelledby="cta-heading">
                <div className="bg-muted/40 rounded-lg shadow-xl p-8 md:p-12 text-center border">
                  <h2 id="cta-heading" className="text-3xl font-extrabold text-primary">Unlock Your A1 Potential for the O-Levels</h2>
                  <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
                    Navigating the O-Levels requires more than just hard work—it requires a smart strategy. If you need help mastering key subjects, refining exam techniques, or building confidence, our specialist tutors are here to guide you to success.
                  </p>
                  <div className="mt-8">
                    <Button size="lg" className="bg-accent text-text-inverse hover:bg-accent/90 shadow-lg transform hover:scale-105 transition-transform">
                      <Link href="/request-tutor">Find Your Specialist O-Level Tutor Today</Link>
                    </Button>
                    <p className="text-sm mt-3 text-muted-foreground">Get a no-obligation consultation to find the perfect match.</p>
                  </div>
                </div>
            </section>
          </article>
        </main>
      </div>
    </div>
  );
}