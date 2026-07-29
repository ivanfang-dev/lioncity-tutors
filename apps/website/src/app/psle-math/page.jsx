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
  FileText, CalendarClock, Calculator, Shapes, BarChart3, Brain, Target,
  TriangleAlert, CalendarDays, BookOpen, Users, ListChecks,
} from "lucide-react";

const tableOfContents = [
  { id: "structure", label: "Exam & paper structure" },
  { id: "exam-dates", label: "2026 exam timetable" },
  { id: "timeline", label: "12-month study plan" },
  { id: "numbers", label: "Numbers & algebra" },
  { id: "geometry", label: "Geometry & measurement" },
  { id: "statistics", label: "Statistics & data" },
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
      "Consolidate the concepts carried over from P1–P5",
      "Secure mental computation and number sense",
      "Build a consistent, step-by-step way of showing working",
      "Prioritise accuracy in the four operations",
    ],
  },
  {
    title: "P6 Term 2 · Skill-building",
    points: [
      "Finish the P6 syllabus",
      "Start topical practice with past-year questions",
      "Learn the core heuristics (model drawing, working backwards)",
      "Time each section and log recurring weak topics",
    ],
  },
  {
    title: "P6 Term 3 to Prelims · Application",
    points: [
      "Daily mixed-topic practice at PSLE standard",
      "Attempt full papers under real exam timing",
      "Review every mistake and sort it by type",
      "Rehearse clear presentation for Paper 2 long-answer questions",
    ],
  },
  {
    title: "Post-Prelims to PSLE · Consolidation",
    points: [
      "Target the weak areas surfaced by the prelim analysis",
      "Keep skills warm with short daily practice sets",
      "Hold a steady routine — sleep, breaks and calm matter now",
    ],
  },
];

export default function PSLEMath() {
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
    levelSubjects: ['PSLE Math'],
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
        slug="psle-math"
        course={{
          name: 'PSLE Mathematics Tuition',
          description: 'One-to-one PSLE Mathematics tuition in Singapore, covering heuristics, model drawing and Paper 1 & 2 technique.',
          educationalLevel: 'PSLE',
        }}
      />
      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16">
        <div className="mx-auto max-w-2xl lg:max-w-none lg:grid lg:grid-cols-[minmax(0,42rem)_15rem] lg:justify-center lg:gap-12">
          {/* Article column */}
          <div>
            <GuideHeader
              title="PSLE Maths Guide 2026: Master Primary School Mathematics"
              author="By the LionCity Tutors Mathematics Team"
              meta="Updated May 5, 2026 · 12 min read"
              imageSrc="/math-tuition.webp"
              imageAlt="Handwritten working and equations — the problem-solving at the heart of PSLE Mathematics."
            />

            <article className="space-y-12 text-gray-700 leading-relaxed">
              <p className="text-lg text-gray-800 leading-relaxed text-pretty">
                PSLE Mathematics rewards clear thinking far more than raw speed. Most of the paper tests whether a child can read a problem carefully, choose the right method, and show their working cleanly. With a steady plan through P5 and P6, and honest practice on the question types that keep coming back, strong results are well within reach.
              </p>

              <KeyTakeaways
                items={[
                  <>PSLE Maths is two equally-weighted papers &mdash; Paper 1 (no calculator, <span className="tabular-nums">50</span> marks) and Paper 2 (calculator allowed, <span className="tabular-nums">50</span> marks) &mdash; graded on the AL1&ndash;AL8 scale.</>,
                  <>Most lost marks come from careless slips and misread questions, not gaps in knowledge &mdash; checking work is itself a scoring skill.</>,
                  <>Heuristics like model drawing and working backwards are what turn hard word problems into method marks.</>,
                  <>If your child understands topics alone but freezes on multi-step problems, that&rsquo;s the usual signal targeted help pays off.</>,
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
                <SectionHeading icon={FileText}>Understanding the PSLE Maths papers</SectionHeading>
                <p className="text-pretty">
                  PSLE Mathematics is set over two papers, worth 100 marks in total. Each subject is now graded by Achievement Level (AL1 to AL8), where AL1 is the top band &mdash; the aggregate score is the sum of a child&rsquo;s four subject ALs.
                </p>
                <GuideCard className="mt-4">
                  <h4 className="font-semibold text-gray-900 mb-4">PSLE Maths papers breakdown</h4>
                  <div className="space-y-5">
                    <div>
                      <h5 className="font-semibold text-gray-900">Paper 1 &mdash; 50 marks, 1 hour 10 minutes (no calculator)</h5>
                      <ul className="list-disc ml-5 mt-1.5 space-y-1 text-sm text-gray-700">
                        <li>Booklet A: multiple-choice questions</li>
                        <li>Booklet B: short-answer questions</li>
                        <li>Tests core concepts and mental computation</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-900">Paper 2 &mdash; 50 marks, 1 hour 20 minutes (calculator allowed)</h5>
                      <ul className="list-disc ml-5 mt-1.5 space-y-1 text-sm text-gray-700">
                        <li>Short-answer and longer structured questions</li>
                        <li>Rewards problem-solving, heuristics and clear working</li>
                        <li>Method marks are awarded for correct steps</li>
                      </ul>
                    </div>
                  </div>
                </GuideCard>
              </section>

              <section id="exam-dates" className="scroll-mt-24">
                <SectionHeading icon={CalendarDays}>2026 PSLE Maths exam timetable</SectionHeading>
                <ExamTimetable
                  examSlug="psle"
                  subjectSlugs={['math']}
                  caption="Official 2026 SEAB dates for PSLE Mathematics."
                />
              </section>

              <section id="timeline" className="scroll-mt-24">
                <SectionHeading icon={CalendarClock}>A 12-month PSLE Maths study plan</SectionHeading>
                <GuideTimeline items={timeline} />
              </section>

              <section id="numbers" className="scroll-mt-24">
                <SectionHeading icon={Calculator}>Numbers &amp; algebra</SectionHeading>
                <div className="space-y-4">
                  <TopicCard
                    title="Numbers, fractions & proportion"
                    chips={["Whole Numbers", "Fractions", "Decimals", "Percentage", "Ratio", "Rate", "Algebra"]}
                    points={[
                      "Convert fluently between fractions, decimals and percentages without a calculator",
                      "Draw bar models for ratio, fraction and before–after problems",
                      "Set up simple algebraic expressions for unknowns and simplify them",
                      "Rehearse the recurring PSLE types (equal-fractions, unchanged-quantity, repeated-identity)",
                    ]}
                  />
                </div>
              </section>

              <section id="geometry" className="scroll-mt-24">
                <SectionHeading icon={Shapes}>Geometry &amp; measurement</SectionHeading>
                <div className="space-y-4">
                  <TopicCard
                    title="Shape, space & measurement"
                    chips={["Angles", "Triangles", "Quadrilaterals", "Area & Perimeter", "Circles", "Volume", "Nets"]}
                    points={[
                      "State and apply angle properties (on a line, at a point, in triangles and parallel lines)",
                      "Break composite figures into rectangles, triangles and parts of circles",
                      "Track units carefully and convert between cm, m, ml and litres",
                      "Visualise nets and solids to answer volume and surface questions",
                    ]}
                  />
                </div>
              </section>

              <section id="statistics" className="scroll-mt-24">
                <SectionHeading icon={BarChart3}>Statistics &amp; data</SectionHeading>
                <div className="space-y-4">
                  <TopicCard
                    title="Reading & interpreting data"
                    chips={["Tables", "Bar & Line Graphs", "Pie Charts", "Average"]}
                    points={[
                      "Read values accurately off tables, bar graphs, line graphs and pie charts",
                      "Use the average = total ÷ number relationship in both directions",
                      "Combine information from two representations within one question",
                      "Sense-check a computed answer against what the graph shows",
                    ]}
                  />
                </div>
              </section>

              <section id="techniques" className="scroll-mt-24">
                <SectionHeading icon={Brain}>Study techniques that work</SectionHeading>
                <GuideCard>
                  <h4 className="font-semibold text-gray-900 mb-3">Habits that lift PSLE Maths marks</h4>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p><strong className="text-gray-900">Show every step:</strong></p>
                      <p>Write working line by line &mdash; method marks are awarded even when the final answer is wrong.</p>
                    </div>
                    <div>
                      <p><strong className="text-gray-900">Error log by type:</strong></p>
                      <p>Sort mistakes into careless, conceptual or method, and review the pattern weekly.</p>
                    </div>
                    <div>
                      <p><strong className="text-gray-900">Deliberate heuristics practice:</strong></p>
                      <p>Practise model drawing, working backwards and guess-and-check on the hard problems, not just the easy ones.</p>
                    </div>
                    <div>
                      <p><strong className="text-gray-900">Timed mixed sets:</strong></p>
                      <p>Once a topic is solid, mix it with others under time so recall stays quick under pressure.</p>
                    </div>
                  </div>
                </GuideCard>
              </section>

              <section id="exam-strategies" className="scroll-mt-24">
                <SectionHeading icon={Target}>Paper-by-paper exam strategy</SectionHeading>
                <div className="space-y-4">
                  <GuideCard>
                    <h4 className="font-semibold text-gray-900 mb-2">Paper 1 (no calculator)</h4>
                    <ul className="list-disc ml-5 space-y-1 text-sm text-gray-700">
                      <li>Clear Booklet A steadily &mdash; mark and return to any MCQ you stall on</li>
                      <li>Show working in Booklet B even for short answers</li>
                      <li>Double-check mental calculations, especially with fractions and decimals</li>
                      <li>Watch units and any rounding instructions</li>
                      <li>Use spare time to recheck, not to rush ahead</li>
                    </ul>
                  </GuideCard>
                  <GuideCard>
                    <h4 className="font-semibold text-gray-900 mb-2">Paper 2 (calculator allowed)</h4>
                    <ul className="list-disc ml-5 space-y-1 text-sm text-gray-700">
                      <li>Read the whole paper first and start with your surest questions</li>
                      <li>Set out working in clear, labelled steps for the long-answer marks</li>
                      <li>Draw and label models and diagrams &mdash; they earn method marks</li>
                      <li>Key numbers into the calculator twice to catch slips</li>
                      <li>Check every answer for reasonableness and correct units</li>
                    </ul>
                  </GuideCard>
                </div>
              </section>

              <section id="mistakes" className="scroll-mt-24">
                <SectionHeading icon={TriangleAlert}>Common mistakes to avoid</SectionHeading>
                <GuideCard>
                  <h4 className="font-semibold text-gray-900 mb-3">Where PSLE Maths marks slip away</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-sm">
                    <div>
                      <ol className="list-decimal ml-5 space-y-1 text-gray-700">
                        <li>Careless calculation slips</li>
                        <li>Misreading what the question asks</li>
                        <li>Not showing working</li>
                        <li>Wrong or missing units</li>
                        <li>Poor time management</li>
                      </ol>
                    </div>
                    <div>
                      <ol className="list-decimal ml-5 space-y-1 text-gray-700" start="6">
                        <li>Rounding at the wrong stage</li>
                        <li>Not checking answers for reasonableness</li>
                        <li>Confusing similar problem types</li>
                        <li>Incomplete final statements</li>
                        <li>Messy, hard-to-follow working</li>
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
                        <li>30–45 minutes of focused practice</li>
                        <li>Finish and check homework thoroughly</li>
                        <li>Revisit that day&rsquo;s class examples</li>
                        <li>A few minutes of mental-math drills</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 mb-1.5">Weekends</p>
                      <ul className="list-disc ml-5 space-y-1 text-gray-700">
                        <li>One to two timed practice papers</li>
                        <li>Review and reclassify every mistake</li>
                        <li>Targeted practice on the week&rsquo;s weak topic</li>
                        <li>Update summary and heuristics notes</li>
                      </ul>
                    </div>
                  </div>
                </GuideCard>
              </section>

              <section id="resources" className="scroll-mt-24">
                <SectionHeading icon={BookOpen}>Essential PSLE Maths resources</SectionHeading>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1.5">Recommended series</h4>
                    <ul className="list-disc ml-5 text-sm space-y-1 text-gray-700">
                      <li>My Pals Are Here! Maths (Marshall Cavendish)</li>
                      <li>Shaping Maths (Marshall Cavendish)</li>
                      <li>Problem-solving and heuristics guides for extra depth</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1.5">Practice materials</h4>
                    <ul className="list-disc ml-5 text-sm space-y-1 text-gray-700">
                      <li>PSLE past papers (last 5 years)</li>
                      <li>Top-school preliminary examination papers</li>
                      <li>Topical practice organised by heuristic</li>
                      <li>Online practice platforms (e.g. KooBits) — kept in moderation</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section id="tuition" className="scroll-mt-24">
                <SectionHeading icon={Users}>When to consider PSLE Maths tuition</SectionHeading>
                <p>Consider PSLE Maths tuition if your child:</p>
                <ul className="list-disc ml-6 space-y-1 mt-3 text-gray-700">
                  <li>Understands topics alone but stalls on multi-step word problems</li>
                  <li>Struggles to choose the right heuristic for a problem</li>
                  <li>Keeps losing marks to careless errors under time pressure</li>
                  <li>Needs structured, supervised practice to stay consistent</li>
                  <li>Is aiming for AL1–AL2 and wants to close the last gap</li>
                  <li>Benefits from personalised feedback on presentation</li>
                </ul>
                <GuideCard className="mt-4">
                  <p className="text-sm"><strong className="text-gray-900">Choose PSLE Maths tutors who:</strong> know the current syllabus and AL scoring, teach heuristics and clear presentation rather than just answers, spot recurring error patterns, and keep a primary-aged child engaged and confident.</p>
                </GuideCard>
              </section>

              <RelatedGuides slug="psle-math" />
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
            <h2 className="text-4xl font-bold text-center text-primary mb-4">
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
