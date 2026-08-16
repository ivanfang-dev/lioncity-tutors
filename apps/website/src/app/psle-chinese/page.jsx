"use client";

import { MATCH_TIME } from '@/data/promises';
import { useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Step1, Step2, Step3 } from "@/components/FormSteps";
import FormStepper from "@/components/FormStepper";
import FormBenefits from "@/components/FormBenefits";
import useTuitionRequestForm from "@/components/useTuitionRequestForm";
import { CheckCircle } from "lucide-react";
import TableOfContents from "@/components/TableOfContents";
import GuideSchema from '@/components/seo/GuideSchema';
import {
  GuideHeader, SectionHeading, GuideCard, TopicCard, GuideTimeline, KeyTakeaways, ICON_STROKE,
  RelatedGuides, ExamTimetable,
} from "@/components/guide";
import {
  FileText, CalendarClock, PenLine, BookOpenText, Mic, Brain, Target,
  TriangleAlert, CalendarDays, BookOpen, Users, ListChecks, HelpCircle,
} from "lucide-react";

const tableOfContents = [
  { id: "structure", label: "Exam & paper structure" },
  { id: "exam-dates", label: "2026 exam timetable" },
  { id: "timeline", label: "12-month study plan" },
  { id: "writing", label: "Writing" },
  { id: "comprehension", label: "Comprehension" },
  { id: "oral-listening", label: "Oral & listening" },
  { id: "techniques", label: "Study techniques that work" },
  { id: "exam-strategies", label: "Paper-by-paper strategy" },
  { id: "mistakes", label: "Common mistakes to avoid" },
  { id: "schedule", label: "Weekly study schedule" },
  { id: "resources", label: "Essential resources" },
  { id: "tuition", label: "When to consider tuition" },
  { id: "faq", label: "PSLE Chinese FAQs" },
];

/**
 * FAQ content for this page. Rendered as visible text AND emitted as
 * FAQPage JSON-LD via GuideSchema — both read from this one array.
 */
const PSLE_CHINESE_FAQS = [
  {
    // exact phrasing targets "psle chinese marks breakdown" (pos 10.5, page one, 0 clicks)
    // Figures are attributed, not asserted as bare fact: SEAB's own PDF was unreachable
    // (CloudFront-blocked) when this was written, so the split below is cross-checked
    // against tuition-industry sources only, not a primary SEAB document.
    question: 'How are PSLE Chinese marks broken down?',
    answer:
      "Tuition-industry guides put PSLE Chinese marks at roughly 200 across three papers: about 40 for Paper 1 Writing, about 90 for Paper 2 Language Use & Comprehension, and about 70 for Paper 3 (Oral 50 plus Listening 20). SEAB's official syllabus document is the definitive source for exact current weightings.",
  },
];

const timeline = [
  {
    title: "P5 Term 4 – P6 Term 1 · Foundation",
    points: [
      "Strengthen vocabulary and character recognition",
      "Secure basic sentence structures and common phrases",
      "Build a reading habit with Chinese storybooks",
      "Work on pronunciation and everyday oral expression",
    ],
  },
  {
    title: "P6 Term 2 · Skill-building",
    points: [
      "Finish the P6 syllabus",
      "Start topical practice with past-year questions",
      "Learn composition planning and comprehension technique",
      "Time each paper and log recurring weak areas",
    ],
  },
  {
    title: "P6 Term 3 to Prelims · Application",
    points: [
      "Daily practice at PSLE standard across the papers",
      "Attempt full papers under real exam timing",
      "Rehearse oral conversation across a range of topics",
      "Review mistakes and consolidate vocabulary and grammar",
    ],
  },
  {
    title: "Post-Prelims to PSLE · Consolidation",
    points: [
      "Target the weak areas surfaced by the prelim analysis",
      "Keep reading, writing and speaking warm daily",
      "Hold a steady routine — rest and calm matter now",
    ],
  },
];

export default function PSLEChinese() {
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
    levelSubjects: ['PSLE Chinese'],
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
        slug="psle-chinese"
        course={{
          name: 'PSLE Chinese Tuition',
          description: 'One-to-one PSLE Chinese tuition in Singapore, covering composition, comprehension and oral technique across all three papers.',
          educationalLevel: 'PSLE',
        }}
        faqs={PSLE_CHINESE_FAQS}
      />
      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16">
        <div className="mx-auto max-w-2xl lg:max-w-none lg:grid lg:grid-cols-[minmax(0,42rem)_15rem] lg:justify-center lg:gap-12">
          {/* Article column */}
          <div>
            <GuideHeader
              title="PSLE Chinese Guide 2026: Master Primary School Chinese"
              author="By the LionCity Tutors Chinese Team"
              meta="Updated May 13, 2026 · 12 min read"
              imageSrc="/chinese-tuition_optimized.webp"
              imageAlt="A child practising Chinese characters — the language skills across all three PSLE Chinese papers."
            />

            <article className="space-y-12 text-gray-700 leading-relaxed">
              <p className="text-lg text-gray-800 leading-relaxed text-pretty">
                PSLE Chinese rewards children who use the language, not just study it. Reading a little every day, speaking without fear of mistakes, and writing regularly build the vocabulary and fluency that the papers reward. With a steady plan through P5 and P6, strong results are well within reach.
              </p>

              <KeyTakeaways
                items={[
                  <>PSLE Chinese is examined over three papers &mdash; Writing, Language Use &amp; Comprehension, and Oral &amp; Listening &mdash; graded on the AL1&ndash;AL8 scale.</>,
                  <>Daily reading and speaking build vocabulary and fluency faster than rote memorisation.</>,
                  <>Composition marks come from planning and a bank of good phrases &mdash; used naturally, not stuffed in.</>,
                  <>If your child freezes in oral or struggles with comprehension, that&rsquo;s the usual signal targeted help pays off.</>,
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
                <SectionHeading icon={FileText}>Understanding the PSLE Chinese papers</SectionHeading>
                <p className="text-pretty">
                  PSLE Chinese is set over three papers assessing writing, language use, comprehension, listening and speaking. Each subject is now graded by Achievement Level (AL1 to AL8), where AL1 is the top band. See the FAQ below for the current per-paper mark weightings.
                </p>
                <GuideCard className="mt-4">
                  <h4 className="font-semibold text-gray-900 mb-4">PSLE Chinese papers breakdown</h4>
                  <div className="space-y-5">
                    <div>
                      <h5 className="font-semibold text-gray-900">Paper 1: Writing</h5>
                      <ul className="list-disc ml-5 mt-1.5 space-y-1 text-sm text-gray-700">
                        <li>Composition writing on a given topic</li>
                        <li>Tests vocabulary, sentence structure and organisation</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-900">Paper 2: Language Use &amp; Comprehension</h5>
                      <ul className="list-disc ml-5 mt-1.5 space-y-1 text-sm text-gray-700">
                        <li>Multiple-choice questions on language use</li>
                        <li>Comprehension passages with varied question types</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-900">Paper 3: Oral &amp; Listening Comprehension</h5>
                      <ul className="list-disc ml-5 mt-1.5 space-y-1 text-sm text-gray-700">
                        <li>Reading aloud and a video-based conversation</li>
                        <li>Listening comprehension based on audio clips</li>
                      </ul>
                    </div>
                  </div>
                </GuideCard>
              </section>

              <section id="exam-dates" className="scroll-mt-24">
                <SectionHeading icon={CalendarDays}>2026 PSLE Chinese exam timetable</SectionHeading>
                <ExamTimetable
                  examSlug="psle"
                  subjectSlugs={['mother-tongue']}
                  caption="Official 2026 SEAB dates for Mother Tongue Languages, which include Chinese."
                />
              </section>

              <section id="timeline" className="scroll-mt-24">
                <SectionHeading icon={CalendarClock}>A 12-month PSLE Chinese study plan</SectionHeading>
                <GuideTimeline items={timeline} />
              </section>

              <section id="writing" className="scroll-mt-24">
                <SectionHeading icon={PenLine}>Writing</SectionHeading>
                <div className="space-y-4">
                  <TopicCard
                    title="Composition & language use"
                    chips={["Composition Planning", "Vocabulary", "Sentence Structure", "Idioms"]}
                    points={[
                      "Build a bank of good phrases and idioms, and use them naturally",
                      "Plan the composition before writing — a clear beginning, middle and end",
                      "Practise a range of topics so no prompt feels unfamiliar",
                      "Reread to fix character, grammar and punctuation slips",
                    ]}
                  />
                </div>
              </section>

              <section id="comprehension" className="scroll-mt-24">
                <SectionHeading icon={BookOpenText}>Comprehension</SectionHeading>
                <div className="space-y-4">
                  <TopicCard
                    title="Reading & answering"
                    chips={["Reading Speed", "Understanding Passages", "Answering Technique"]}
                    points={[
                      "Read widely to lift reading speed and comprehension",
                      "Identify keywords and the main idea of each passage",
                      "Match the answer style to the question type",
                      "Support answers with evidence lifted from the passage",
                    ]}
                  />
                </div>
              </section>

              <section id="oral-listening" className="scroll-mt-24">
                <SectionHeading icon={Mic}>Oral &amp; listening</SectionHeading>
                <div className="space-y-4">
                  <TopicCard
                    title="Speaking, reading aloud & listening"
                    chips={["Pronunciation", "Fluency", "Conversation", "Listening for Detail"]}
                    points={[
                      "Read aloud daily to improve pronunciation and fluency",
                      "In conversation, give an opinion and then a reason and example",
                      "Practise speaking across a range of everyday topics",
                      "Take quick notes while listening for the detail each question needs",
                    ]}
                  />
                </div>
              </section>

              <section id="techniques" className="scroll-mt-24">
                <SectionHeading icon={Brain}>Study techniques that work</SectionHeading>
                <GuideCard>
                  <h4 className="font-semibold text-gray-900 mb-3">Habits that lift PSLE Chinese marks</h4>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p><strong className="text-gray-900">Flashcards:</strong></p>
                      <p>Use spaced flashcards to make vocabulary and characters stick.</p>
                    </div>
                    <div>
                      <p><strong className="text-gray-900">Phrase bank:</strong></p>
                      <p>Collect vivid phrases and idioms with an example sentence, then reuse them in writing.</p>
                    </div>
                    <div>
                      <p><strong className="text-gray-900">Role-play:</strong></p>
                      <p>Rehearse oral conversation with a partner or tutor so speaking feels natural.</p>
                    </div>
                    <div>
                      <p><strong className="text-gray-900">Daily journal:</strong></p>
                      <p>Write a few lines in Chinese each day — small, regular practice beats occasional cramming.</p>
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
                      <li>Read the topic and pictures carefully before planning</li>
                      <li>Spend a few minutes outlining the story arc</li>
                      <li>Use varied vocabulary and sentence patterns naturally</li>
                      <li>Leave time to reread and correct characters</li>
                    </ul>
                  </GuideCard>
                  <GuideCard>
                    <h4 className="font-semibold text-gray-900 mb-2">Paper 2 (Language Use &amp; Comprehension)</h4>
                    <ul className="list-disc ml-5 space-y-1 text-sm text-gray-700">
                      <li>Use context to choose language-use answers</li>
                      <li>Read the questions before the comprehension passage</li>
                      <li>Answer with evidence from the text</li>
                      <li>Pace yourself so every section gets attention</li>
                    </ul>
                  </GuideCard>
                  <GuideCard>
                    <h4 className="font-semibold text-gray-900 mb-2">Paper 3 (Oral &amp; Listening)</h4>
                    <ul className="list-disc ml-5 space-y-1 text-sm text-gray-700">
                      <li>Read aloud with clear pronunciation and expression</li>
                      <li>Give opinions with a reason and a personal example</li>
                      <li>Take brief notes during the listening clips</li>
                      <li>Stay calm and speak in full sentences</li>
                    </ul>
                  </GuideCard>
                </div>
              </section>

              <section id="mistakes" className="scroll-mt-24">
                <SectionHeading icon={TriangleAlert}>Common mistakes to avoid</SectionHeading>
                <GuideCard>
                  <h4 className="font-semibold text-gray-900 mb-3">Where PSLE Chinese marks slip away</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-sm">
                    <div>
                      <ol className="list-decimal ml-5 space-y-1 text-gray-700">
                        <li>Incorrect character writing</li>
                        <li>Grammatical errors</li>
                        <li>Weak composition structure</li>
                        <li>Misreading comprehension questions</li>
                        <li>Poor time management</li>
                      </ol>
                    </div>
                    <div>
                      <ol className="list-decimal ml-5 space-y-1 text-gray-700" start="6">
                        <li>Inaccurate pronunciation in oral</li>
                        <li>One-word conversation answers</li>
                        <li>Losing focus during listening</li>
                        <li>Leaving questions blank</li>
                        <li>Messy handwriting</li>
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
                        <li>15–20 minutes of Chinese reading</li>
                        <li>Finish and check homework</li>
                        <li>Add new words to the phrase bank</li>
                        <li>Read a short passage aloud</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 mb-1.5">Weekends</p>
                      <ul className="list-disc ml-5 space-y-1 text-gray-700">
                        <li>One to two timed practice papers</li>
                        <li>Review and reclassify mistakes</li>
                        <li>Draft one composition and edit it</li>
                        <li>Rehearse oral conversation topics</li>
                      </ul>
                    </div>
                  </div>
                </GuideCard>
              </section>

              <section id="resources" className="scroll-mt-24">
                <SectionHeading icon={BookOpen}>Essential PSLE Chinese resources</SectionHeading>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1.5">Recommended series</h4>
                    <ul className="list-disc ml-5 text-sm space-y-1 text-gray-700">
                      <li>Structured PSLE Chinese practice papers</li>
                      <li>A thematic vocabulary and model-composition guide</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1.5">Practice materials</h4>
                    <ul className="list-disc ml-5 text-sm space-y-1 text-gray-700">
                      <li>PSLE past papers (last 5 years)</li>
                      <li>Top-school preliminary examination papers</li>
                      <li>Topical comprehension and cloze practice</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1.5">Reading materials</h4>
                    <ul className="list-disc ml-5 text-sm space-y-1 text-gray-700">
                      <li>Age-appropriate Chinese storybooks</li>
                      <li>Children&rsquo;s newspapers and magazines</li>
                      <li>Age-appropriate Chinese audio and video clips</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section id="tuition" className="scroll-mt-24">
                <SectionHeading icon={Users}>When to consider PSLE Chinese tuition</SectionHeading>
                <p>Consider PSLE Chinese tuition if your child:</p>
                <ul className="list-disc ml-6 space-y-1 mt-3 text-gray-700">
                  <li>Struggles with character recognition and writing</li>
                  <li>Finds grammar and sentence structure difficult</li>
                  <li>Needs help with composition and oral skills</li>
                  <li>Loses comprehension marks despite knowing the words</li>
                  <li>Is aiming for AL1–AL2 and wants steady feedback</li>
                  <li>Benefits from a patient, supportive learning environment</li>
                </ul>
                <GuideCard className="mt-4">
                  <p className="text-sm"><strong className="text-gray-900">Choose PSLE Chinese tutors who:</strong> are strong native or near-native speakers, know the current syllabus and AL scoring, teach composition and oral technique rather than rote drilling, and make learning Chinese engaging for a primary-aged child.</p>
                </GuideCard>
              </section>

              <section id="faq" className="scroll-mt-24">
                <SectionHeading icon={HelpCircle}>PSLE Chinese FAQs</SectionHeading>
                <div className="space-y-6">
                  {PSLE_CHINESE_FAQS.map((faq) => (
                    <div key={faq.question}>
                      <h3 className="text-lg font-semibold text-gray-900">{faq.question}</h3>
                      <p className="mt-2 text-gray-700">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </section>

              <RelatedGuides slug="psle-chinese" />
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
