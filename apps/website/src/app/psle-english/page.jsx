"use client";

import { MATCH_TIME } from '@/data/promises';
import { useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Step1, Step2, Step3 } from "@/components/FormSteps";
import FormStepper from "@/components/FormStepper";
import useTuitionRequestForm from "@/components/useTuitionRequestForm";
import FormBenefits from "@/components/FormBenefits";
import { CheckCircle } from "lucide-react";
import TableOfContents from "@/components/TableOfContents";
import GuideSchema from '@/components/seo/GuideSchema';
import {
  GuideHeader, SectionHeading, GuideCard, TopicCard, GuideTimeline, KeyTakeaways, ICON_STROKE,
  RelatedGuides, ExamTimetable,
} from "@/components/guide";
import {
  FileText, CalendarClock, PenLine, SpellCheck, BookOpenText, Mic, Brain, Target,
  TriangleAlert, CalendarDays, BookOpen, Users, ListChecks,
} from "lucide-react";

const tableOfContents = [
  { id: "structure", label: "Exam & paper structure" },
  { id: "exam-dates", label: "2026 exam timetable" },
  { id: "timeline", label: "12-month study plan" },
  { id: "writing", label: "Writing (Paper 1)" },
  { id: "language-use", label: "Language use & grammar" },
  { id: "comprehension", label: "Comprehension" },
  { id: "oral-listening", label: "Oral & listening" },
  { id: "techniques", label: "Study techniques that work" },
  { id: "exam-strategies", label: "Paper-by-paper strategy" },
  { id: "mistakes", label: "Common mistakes to avoid" },
  { id: "schedule", label: "Weekly study schedule" },
  { id: "resources", label: "Essential resources" },
  { id: "tuition", label: "When to consider tuition" },
];

const timeline = [
  {
    title: "P5 Term 4 – P6 Term 1 · Foundation",
    points: [
      "Secure the core grammar rules and common error patterns",
      "Grow vocabulary through a daily reading habit",
      "Learn to plan and structure both writing tasks",
      "Build steady pronunciation and oral confidence",
    ],
  },
  {
    title: "P6 Term 2 · Skill-building",
    points: [
      "Finish the P6 syllabus",
      "Start topical practice across every component",
      "Learn the exam technique for each paper section",
      "Time each section and log recurring weak areas",
    ],
  },
  {
    title: "P6 Term 3 to Prelims · Application",
    points: [
      "Daily practice at PSLE standard across the papers",
      "Attempt full papers under real exam timing",
      "Rewrite weak compositions and open-ended answers",
      "Review mistakes and sort them by cause",
    ],
  },
  {
    title: "Post-Prelims to PSLE · Consolidation",
    points: [
      "Target the weak components surfaced by the prelim analysis",
      "Keep reading, writing and speaking warm daily",
      "Hold a steady routine — rest and calm matter now",
    ],
  },
];

export default function PSLEEnglish() {
  const formRef = useRef(null);
  const {
    currentStep,
    formData,
    errors,
    status,
    nextStep,
    prevStep,
    handleChange,
    handleLevelSubjectChange,
    addLevelSubject,
    removeLevelSubject,
    handleSubmit,
    resetForm
  } = useTuitionRequestForm({
    name: '',
    mobile: '',
    levelSubjects: ['PSLE English'],
    location: '',
    lessonDuration: '1.5 Hours',
    customDuration: '',
    lessonFrequency: '1 Lesson/Week',
    customFrequency: '',
    preferredTime: '',
    tutorType: { partTime: true, fullTime: false, moeTeacher: false },
    budget: { type: 'marketRate', customAmount: '' },
    preferences: ''
  });

  return (
    <>
      <GuideSchema
        slug="psle-english"
        course={{
          name: 'PSLE English Tuition',
          description: 'One-to-one PSLE English tuition in Singapore, covering composition, comprehension, grammar and oral technique across all four papers.',
          educationalLevel: 'PSLE',
        }}
      />
      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16">
        <div className="mx-auto max-w-2xl lg:max-w-none lg:grid lg:grid-cols-[minmax(0,42rem)_15rem] lg:justify-center lg:gap-12">
          {/* Article column */}
          <div>
            <GuideHeader
              title="PSLE English Guide 2026: Master Primary School English"
              author="By the LionCity Tutors English Team"
              meta="Updated May 6, 2026 · 15 min read"
              imageSrc="/english-tuition.webp"
              imageAlt="A child reading and writing at a desk — the language skills across all four PSLE English papers."
            />

            <article className="space-y-12 text-gray-700 leading-relaxed">
              <p className="text-lg text-gray-800 leading-relaxed text-pretty">
                PSLE English spans four papers and every language skill a child has — writing, grammar, comprehension, listening and speaking. The good news is that each one responds to steady, deliberate practice. A daily reading habit and honest feedback on real work do more than any last-minute cramming.
              </p>

              <KeyTakeaways
                items={[
                  <>PSLE English is examined over four papers &mdash; Writing, Language Use &amp; Comprehension, Listening and Oral &mdash; for <span className="tabular-nums">200</span> marks, graded on the AL1&ndash;AL8 scale.</>,
                  <>Wide daily reading builds vocabulary and a feel for grammar faster than any worksheet.</>,
                  <>Composition and open-ended marks come from planning and precise language, not more words on the page.</>,
                  <>If your child reads and speaks well but underperforms on paper, that&rsquo;s the usual signal targeted help pays off.</>,
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
                <SectionHeading icon={FileText}>Understanding the PSLE English papers</SectionHeading>
                <p className="text-pretty">
                  PSLE English is set over four papers worth 200 marks in total. Each subject is now graded by Achievement Level (AL1 to AL8), where AL1 is the top band.
                </p>
                <GuideCard className="mt-4">
                  <h4 className="font-semibold text-gray-900 mb-4">PSLE English papers breakdown</h4>
                  <div className="space-y-5">
                    <div>
                      <h5 className="font-semibold text-gray-900">Paper 1: Writing &mdash; 55 marks, 1h 10min</h5>
                      <ul className="list-disc ml-5 mt-1.5 space-y-1 text-sm text-gray-700">
                        <li>Situational Writing (15 marks)</li>
                        <li>Continuous Writing (40 marks)</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-900">Paper 2: Language Use &amp; Comprehension &mdash; 95 marks, 1h 50min</h5>
                      <ul className="list-disc ml-5 mt-1.5 space-y-1 text-sm text-gray-700">
                        <li>Grammar, vocabulary, cloze and editing</li>
                        <li>Synthesis &amp; transformation</li>
                        <li>Visual text and comprehension (cloze and open-ended)</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-900">Paper 3: Listening Comprehension &mdash; 20 marks</h5>
                      <ul className="list-disc ml-5 mt-1.5 space-y-1 text-sm text-gray-700">
                        <li>Multiple-choice questions across varied text types</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-900">Paper 4: Oral Communication &mdash; 30 marks</h5>
                      <ul className="list-disc ml-5 mt-1.5 space-y-1 text-sm text-gray-700">
                        <li>Reading Aloud (10 marks)</li>
                        <li>Stimulus-based Conversation (20 marks)</li>
                      </ul>
                    </div>
                  </div>
                </GuideCard>
              </section>

              <section id="exam-dates" className="scroll-mt-24">
                <SectionHeading icon={CalendarDays}>2026 PSLE English exam timetable</SectionHeading>
                <ExamTimetable
                  examSlug="psle"
                  subjectSlugs={['english']}
                  caption="Official 2026 SEAB dates for PSLE English Language."
                />
              </section>

              <section id="timeline" className="scroll-mt-24">
                <SectionHeading icon={CalendarClock}>A 12-month PSLE English study plan</SectionHeading>
                <GuideTimeline items={timeline} />
              </section>

              <section id="writing" className="scroll-mt-24">
                <SectionHeading icon={PenLine}>Writing (Paper 1)</SectionHeading>
                <div className="space-y-4">
                  <TopicCard
                    title="Situational & continuous writing"
                    chips={["Situational Writing", "Continuous Writing", "Planning", "Vocabulary"]}
                    points={[
                      "Match the format, tone and purpose to the situational task (letter, email, report)",
                      "Plan the story before writing — a clear beginning, build-up and ending",
                      "Build a bank of vivid vocabulary and sentence openers, and actually use them",
                      "Leave time to reread and fix grammar, tense and spelling slips",
                    ]}
                  />
                </div>
              </section>

              <section id="language-use" className="scroll-mt-24">
                <SectionHeading icon={SpellCheck}>Language use &amp; grammar</SectionHeading>
                <div className="space-y-4">
                  <TopicCard
                    title="Grammar, cloze & transformation"
                    chips={["Grammar", "Cloze", "Editing", "Synthesis & Transformation"]}
                    points={[
                      "Drill the common rules (tenses, subject–verb agreement, prepositions, connectors)",
                      "Use context to fill grammar and comprehension cloze, not single-word guessing",
                      "Work the synthesis & transformation patterns until the sentence rules are automatic",
                      "Slow down on editing — hunt for spelling and grammar errors line by line",
                    ]}
                  />
                </div>
              </section>

              <section id="comprehension" className="scroll-mt-24">
                <SectionHeading icon={BookOpenText}>Comprehension</SectionHeading>
                <div className="space-y-4">
                  <TopicCard
                    title="Reading, inference & visual text"
                    chips={["Visual Text", "Comprehension Cloze", "Open-Ended", "Inference"]}
                    points={[
                      "Read the questions first, then read the passage with them in mind",
                      "Answer open-ended questions in full sentences that lift key words from the text",
                      "Support every inference answer with evidence from the passage",
                      "Decode visual texts by asking who it's for and what it wants",
                    ]}
                  />
                </div>
              </section>

              <section id="oral-listening" className="scroll-mt-24">
                <SectionHeading icon={Mic}>Oral &amp; listening</SectionHeading>
                <div className="space-y-4">
                  <TopicCard
                    title="Speaking, reading aloud & listening"
                    chips={["Reading Aloud", "Stimulus Conversation", "Listening"]}
                    points={[
                      "Read aloud with clear pronunciation, pacing and expression — practise daily",
                      "In conversation, give an opinion and then a reason and example",
                      "Take quick notes while listening for the detail each question needs",
                      "Speak in full, confident sentences rather than one-word replies",
                    ]}
                  />
                </div>
              </section>

              <section id="techniques" className="scroll-mt-24">
                <SectionHeading icon={Brain}>Study techniques that work</SectionHeading>
                <GuideCard>
                  <h4 className="font-semibold text-gray-900 mb-3">Habits that lift PSLE English marks</h4>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p><strong className="text-gray-900">Read widely:</strong></p>
                      <p>A daily reading habit builds vocabulary and a feel for correct grammar faster than any worksheet.</p>
                    </div>
                    <div>
                      <p><strong className="text-gray-900">Vocabulary journal:</strong></p>
                      <p>Collect strong words and phrases with an example sentence, then reuse them in writing.</p>
                    </div>
                    <div>
                      <p><strong className="text-gray-900">Feedback loop:</strong></p>
                      <p>Write regularly and act on the corrections — the second draft is where the learning happens.</p>
                    </div>
                    <div>
                      <p><strong className="text-gray-900">Speak out loud:</strong></p>
                      <p>Record reading-aloud and conversation practice, then listen back for pace and clarity.</p>
                    </div>
                  </div>
                </GuideCard>
              </section>

              <section id="exam-strategies" className="scroll-mt-24">
                <SectionHeading icon={Target}>Paper-by-paper exam strategy</SectionHeading>
                <div className="space-y-4">
                  <GuideCard>
                    <h4 className="font-semibold text-gray-900 mb-2">Paper 1 (Writing)</h4>
                    <ul className="list-disc ml-5 space-y-1 text-sm text-gray-700">
                      <li>Spend 5–10 minutes planning before writing</li>
                      <li>Check the situational-writing format and purpose carefully</li>
                      <li>Match language and tone to the audience</li>
                      <li>Leave time to review and edit</li>
                      <li>Watch the clock across both tasks</li>
                    </ul>
                  </GuideCard>
                  <GuideCard>
                    <h4 className="font-semibold text-gray-900 mb-2">Paper 2 (Language Use &amp; Comprehension)</h4>
                    <ul className="list-disc ml-5 space-y-1 text-sm text-gray-700">
                      <li>Read each question stem carefully</li>
                      <li>Use context, not gut feel, for cloze passages</li>
                      <li>Answer open-ended comprehension in full sentences</li>
                      <li>Check synthesis answers keep the original meaning</li>
                      <li>Pace yourself across the many sections</li>
                    </ul>
                  </GuideCard>
                  <GuideCard>
                    <h4 className="font-semibold text-gray-900 mb-2">Papers 3 &amp; 4 (Listening &amp; Oral)</h4>
                    <ul className="list-disc ml-5 space-y-1 text-sm text-gray-700">
                      <li>Read the options before each listening clip</li>
                      <li>Take brief notes as you listen</li>
                      <li>Read aloud with clear pronunciation and expression</li>
                      <li>In conversation, give an opinion with a reason and example</li>
                      <li>Stay calm and speak in full sentences</li>
                    </ul>
                  </GuideCard>
                </div>
              </section>

              <section id="mistakes" className="scroll-mt-24">
                <SectionHeading icon={TriangleAlert}>Common mistakes to avoid</SectionHeading>
                <GuideCard>
                  <h4 className="font-semibold text-gray-900 mb-3">Where PSLE English marks slip away</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-sm">
                    <div>
                      <ol className="list-decimal ml-5 space-y-1 text-gray-700">
                        <li>Poor time management</li>
                        <li>Wrong format in situational writing</li>
                        <li>Weak or repetitive vocabulary</li>
                        <li>Grammar, tense and spelling errors</li>
                        <li>Incomplete comprehension answers</li>
                      </ol>
                    </div>
                    <div>
                      <ol className="list-decimal ml-5 space-y-1 text-gray-700" start="6">
                        <li>Weak paragraph organisation</li>
                        <li>One-word oral responses</li>
                        <li>Not taking notes while listening</li>
                        <li>Answers unsupported by the text</li>
                        <li>Messy handwriting and presentation</li>
                      </ol>
                    </div>
                  </div>
                </GuideCard>
              </section>

              <section id="schedule" className="scroll-mt-24">
                <SectionHeading icon={CalendarDays}>A realistic weekly schedule</SectionHeading>
                <GuideCard>
                  <h4 className="font-semibold text-gray-900 mb-3">Recommended weekly rhythm (Primary 6)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                    <div>
                      <p className="font-semibold text-gray-900 mb-1.5">School days</p>
                      <ul className="list-disc ml-5 space-y-1 text-gray-700">
                        <li>20–30 minutes of reading for pleasure</li>
                        <li>Finish and check homework</li>
                        <li>A short grammar or cloze drill</li>
                        <li>Practise reading a passage aloud</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 mb-1.5">Weekends</p>
                      <ul className="list-disc ml-5 space-y-1 text-gray-700">
                        <li>One to two timed practice papers</li>
                        <li>Review and rewrite weak answers</li>
                        <li>Draft one composition and edit it</li>
                        <li>Rehearse stimulus-based conversation</li>
                      </ul>
                    </div>
                  </div>
                </GuideCard>
              </section>

              <section id="resources" className="scroll-mt-24">
                <SectionHeading icon={BookOpen}>Essential PSLE English resources</SectionHeading>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1.5">Recommended series</h4>
                    <ul className="list-disc ml-5 text-sm space-y-1 text-gray-700">
                      <li>Structured PSLE English practice papers</li>
                      <li>A thematic vocabulary and model-composition guide</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1.5">Practice materials</h4>
                    <ul className="list-disc ml-5 text-sm space-y-1 text-gray-700">
                      <li>PSLE past papers (last 5 years)</li>
                      <li>Top-school preliminary examination papers</li>
                      <li>Topical grammar and comprehension practice</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1.5">Reading materials</h4>
                    <ul className="list-disc ml-5 text-sm space-y-1 text-gray-700">
                      <li>Age-appropriate novels and short stories</li>
                      <li>Newspapers and children&rsquo;s magazines</li>
                      <li>Well-written online articles</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section id="tuition" className="scroll-mt-24">
                <SectionHeading icon={Users}>When to consider PSLE English tuition</SectionHeading>
                <p>Consider PSLE English tuition if your child:</p>
                <ul className="list-disc ml-6 space-y-1 mt-3 text-gray-700">
                  <li>Reads and speaks well but underperforms on paper</li>
                  <li>Struggles with composition planning or vocabulary</li>
                  <li>Makes recurring grammar and cloze errors</li>
                  <li>Freezes during oral or loses detail while listening</li>
                  <li>Is aiming for AL1–AL2 and wants steady feedback</li>
                  <li>Benefits from regular, marked writing practice</li>
                </ul>
                <GuideCard className="mt-4">
                  <p className="text-sm"><strong className="text-gray-900">Choose PSLE English tutors who:</strong> know the current four-paper format, give specific written feedback on compositions and open-ended answers, drill grammar and cloze without rote worksheets, and build a child&rsquo;s confidence in speaking.</p>
                </GuideCard>
              </section>

              <RelatedGuides slug="psle-english" />
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

      {/* Conversion block — the live tutor request form */}
      <section ref={formRef} className="form-section-gradient">
        <div className="max-w-4xl mx-auto px-6 py-16 sm:py-24">
          <motion.div
            className="form-card-container"
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <h2 className="section-title text-primary text-center mb-4">
              Ready to Find The Perfect Tutor?
            </h2>
            <p className="text-center text-text-default/80 mb-10 text-lg">
              Get matched with qualified tutors in {MATCH_TIME}. Just fill out the details below.
            </p>

            <FormBenefits />
            <div className="bg-background-card rounded-xl shadow-lg p-8">
              {status.submitted ? (
                <div className="text-center py-10">
                  <CheckCircle className="text-primary w-16 h-16 mx-auto mb-4" />
                  <h2 className="text-2xl font-semibold text-gray-900 mb-2">Thank you!</h2>
                  <p className="text-gray-600 mb-4">Our team will be in touch with suitable tutor profiles shortly via WhatsApp.</p>
                  <Button
                    className="bg-accent text-text-inverse hover:bg-accent/90"
                    onClick={resetForm}
                  >
                    Submit Another Request
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <FormStepper currentStep={currentStep} />
                  {status.error && <div className="bg-red-100 text-red-800 p-4 rounded-md mb-6">{status.error}</div>}

                  {currentStep === 1 && <Step1 nextStep={nextStep} formData={formData} handleChange={handleChange} handleLevelSubjectChange={handleLevelSubjectChange} addLevelSubject={addLevelSubject} removeLevelSubject={removeLevelSubject} errors={errors} />}
                  {currentStep === 2 && <Step2 nextStep={nextStep} prevStep={prevStep} formData={formData} handleChange={handleChange} errors={errors} />}
                  {currentStep === 3 && <Step3 prevStep={prevStep} formData={formData} handleChange={handleChange} status={status} errors={errors} />}
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
