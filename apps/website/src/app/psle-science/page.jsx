"use client";

import { MATCH_TIME } from '@/data/promises';
import { useRef } from "react";
import { motion } from "framer-motion";
import { enter } from "@/lib/motion";
import { Button } from "@/components/ui/button";
import { TuitionRequestSteps } from "@/components/FormSteps";
import FormStepper from "@/components/FormStepper";
import useTuitionRequestForm from "@/components/useTuitionRequestForm";
import FormBenefits from "@/components/FormBenefits";
import { CheckCircle } from "lucide-react";
import TableOfContents from "@/components/TableOfContents";
import Link from 'next/link';
import GuideSchema from '@/components/seo/GuideSchema';
import {
  GuideHeader, SectionHeading, GuideCard, TopicCard, GuideTimeline, KeyTakeaways, ICON_STROKE,
  RelatedGuides, ExamTimetable,
} from "@/components/guide";
import {
  FileText, CalendarClock, FlaskConical, Search, Brain, Target,
  TriangleAlert, CalendarDays, BookOpen, Users, ListChecks,
} from "lucide-react";

const tableOfContents = [
  { id: "structure", label: "Exam & paper structure" },
  { id: "exam-dates", label: "2026 exam timetable" },
  { id: "timeline", label: "12-month study plan" },
  { id: "themes", label: "The five syllabus themes" },
  { id: "process-skills", label: "Process skills & answering" },
  { id: "techniques", label: "Study techniques that work" },
  { id: "exam-strategies", label: "Booklet-by-booklet strategy" },
  { id: "mistakes", label: "Common mistakes to avoid" },
  { id: "schedule", label: "Weekly study schedule" },
  { id: "resources", label: "Essential resources" },
  { id: "tuition", label: "When to consider tuition" },
];

const timeline = [
  {
    title: "P5 Term 4 – P6 Term 1 · Foundation",
    points: [
      "Consolidate the concepts and vocabulary from P3–P5",
      "Build a scientific keyword bank across the five themes",
      "Learn a consistent way to structure open-ended answers",
      "Focus on understanding principles, not rote facts",
    ],
  },
  {
    title: "P6 Term 2 · Skill-building",
    points: [
      "Finish the P6 syllabus",
      "Start topical practice with past-year questions",
      "Practise reading evidence from diagrams, tables and graphs",
      "Time each booklet and log recurring weak themes",
    ],
  },
  {
    title: "P6 Term 3 to Prelims · Application",
    points: [
      "Daily mixed-theme practice at PSLE standard",
      "Attempt full papers under real exam timing",
      "Rework every open-ended answer to full marks",
      "Review mistakes and sort them by cause",
    ],
  },
  {
    title: "Post-Prelims to PSLE · Consolidation",
    points: [
      "Target the weak themes surfaced by the prelim analysis",
      "Keep concepts warm with short daily practice",
      "Hold a steady routine — rest and calm matter now",
    ],
  },
];

export default function PSLEScience() {
  const formRef = useRef(null);
  const form = useTuitionRequestForm({ levelSubjects: ['PSLE Science'] });
  const { currentStep, status, handleSubmit, resetForm } = form;

  return (
    <>
      <GuideSchema
        slug="psle-science"
        course={{
          name: 'PSLE Science Tuition',
          description: 'One-to-one PSLE Science tuition in Singapore, covering the five syllabus themes and open-ended answering technique.',
          educationalLevel: 'PSLE',
        }}
      />
      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16">
        <div className="mx-auto max-w-2xl lg:max-w-none lg:grid lg:grid-cols-[minmax(0,42rem)_15rem] lg:justify-center lg:gap-12">
          {/* Article column */}
          <div>
            <GuideHeader
              title="PSLE Science Guide 2026: Master Primary School Science"
              author="By the LionCity Tutors Science Team"
              meta="Updated May 9, 2026 · 10 min read"
              imageSrc="/science-tuition.webp"
              imageAlt="A child exploring a hands-on experiment — the concepts and process skills at the heart of PSLE Science."
            />

            <article className="space-y-12 text-gray-700 leading-relaxed">
              <p className="text-lg text-gray-800 leading-relaxed text-pretty">
                PSLE Science is less about memorising facts and more about explaining them. The open-ended questions reward children who can read the evidence in front of them, use the right concept word, and link their answer back to what was asked. Built on the five syllabus themes and steady practice, that skill is very teachable.
              </p>

              <KeyTakeaways
                items={[
                  <>PSLE Science is one paper of two booklets &mdash; Booklet A (multiple-choice, 56 marks) and Booklet B (open-ended, 44 marks) &mdash; graded on the AL1&ndash;AL8 scale.</>,
                  <>The syllabus is built on five themes: diversity, cycles, systems, energy and interactions.</>,
                  <>Open-ended marks are won with structure and keywords &mdash; a clear claim, the evidence, and the reasoning that links them.</>,
                  <>If your child knows the facts but keeps losing marks on open-ended answers, that&rsquo;s the usual signal targeted help pays off.</>,
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
                <SectionHeading icon={FileText}>Understanding the PSLE Science paper</SectionHeading>
                <p className="text-pretty">
                  PSLE Science is set as a single paper of two booklets, worth 100 marks over 1 hour 45 minutes. Each subject is now graded by Achievement Level (AL1 to AL8), where AL1 is the top band.
                </p>
                <GuideCard className="mt-4">
                  <h4 className="font-semibold text-gray-900 mb-4">PSLE Science paper breakdown</h4>
                  <div className="space-y-5">
                    <div>
                      <h5 className="font-semibold text-gray-900">Booklet A &mdash; 56 marks</h5>
                      <ul className="list-disc ml-5 mt-1.5 space-y-1 text-sm text-gray-700">
                        <li>Multiple-choice questions</li>
                        <li>Tests knowledge and understanding of concepts</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-900">Booklet B &mdash; 44 marks</h5>
                      <ul className="list-disc ml-5 mt-1.5 space-y-1 text-sm text-gray-700">
                        <li>A set of open-ended questions</li>
                        <li>Tests application of concepts and process skills</li>
                        <li>Where most of the technique marks are won or lost</li>
                      </ul>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 pt-3">
                    The 2026 syllabus is a revised format per SEAB &mdash; exact question counts are not yet confirmed against an official published source, so they are left out here. The paper duration above is the official SEAB time.
                  </p>
                </GuideCard>
              </section>

              <section id="exam-dates" className="scroll-mt-24">
                <SectionHeading icon={CalendarDays}>2026 PSLE Science exam timetable</SectionHeading>
                <ExamTimetable
                  examSlug="psle"
                  subjectSlugs={['science']}
                  caption="Official 2026 SEAB date for PSLE Science."
                />
              </section>

              <section id="timeline" className="scroll-mt-24">
                <SectionHeading icon={CalendarClock}>A 12-month PSLE Science study plan</SectionHeading>
                <GuideTimeline items={timeline} />
              </section>

              <section id="themes" className="scroll-mt-24">
                <SectionHeading icon={FlaskConical}>The five syllabus themes</SectionHeading>
                <div className="space-y-4">
                  <TopicCard
                    title="Diversity"
                    chips={["Living & Non-living", "Materials", "Classification"]}
                    points={[
                      "Classify living and non-living things by observable characteristics",
                      "Group materials by properties (flexibility, waterproofness, ability to conduct)",
                      "Justify why a material is suited to a particular use",
                    ]}
                  />
                  <TopicCard
                    title="Cycles"
                    chips={["Life Cycles", "Water Cycle", "Reproduction", "Matter"]}
                    points={[
                      "Sequence and compare the life cycles of plants and animals",
                      "Explain the water cycle through evaporation, condensation and the role of heat",
                      "Predict what happens when a stage of a cycle is disrupted",
                    ]}
                  />
                  <TopicCard
                    title="Systems"
                    chips={["Plant System", "Human Systems", "Electrical System"]}
                    points={[
                      "Relate each part of the plant and human systems to its function",
                      "Build and reason about simple and parallel electrical circuits",
                      "Explain how a system fails when one part is blocked or removed",
                    ]}
                  />
                  <TopicCard
                    title="Energy"
                    chips={["Forms of Energy", "Heat", "Light", "Photosynthesis"]}
                    points={[
                      "Identify energy forms and describe conversions in everyday devices",
                      "Explain heat gain and loss and how temperature changes",
                      "Apply light concepts (reflection, shadows, how we see)",
                    ]}
                  />
                  <TopicCard
                    title="Interactions"
                    chips={["Forces", "Magnets", "Environment", "Food Chains"]}
                    points={[
                      "Identify the forces at work (friction, gravity, spring, magnetic) in a situation",
                      "Read food chains and food webs and predict the effect of a change",
                      "Explain how living things interact with and adapt to their environment",
                    ]}
                  />
                </div>
              </section>

              <section id="process-skills" className="scroll-mt-24">
                <SectionHeading icon={Search}>Process skills &amp; answering open-ended questions</SectionHeading>
                <GuideCard>
                  <h4 className="font-semibold text-gray-900 mb-3">How Booklet B marks are actually awarded</h4>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p><strong className="text-gray-900">Claim → Evidence → Reasoning:</strong></p>
                      <p>Structure each answer around a clear claim, the evidence from the question, and the reasoning that links them.</p>
                    </div>
                    <div>
                      <p><strong className="text-gray-900">Use the keyword:</strong></p>
                      <p>Marks go to the correct concept word &mdash; &ldquo;evaporation&rdquo;, &ldquo;condensation&rdquo;, &ldquo;friction&rdquo; &mdash; not a general description.</p>
                    </div>
                    <div>
                      <p><strong className="text-gray-900">Answer the actual question:</strong></p>
                      <p>Re-read the stem and make sure the last line ties back to exactly what was asked.</p>
                    </div>
                    <div>
                      <p><strong className="text-gray-900">Read the data first:</strong></p>
                      <p>Diagrams, tables and graphs usually carry the evidence the answer needs &mdash; study them before writing.</p>
                    </div>
                  </div>
                </GuideCard>
              </section>

              <section id="techniques" className="scroll-mt-24">
                <SectionHeading icon={Brain}>Study techniques that work</SectionHeading>
                <GuideCard>
                  <h4 className="font-semibold text-gray-900 mb-3">Habits that lift PSLE Science marks</h4>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p><strong className="text-gray-900">Concept mapping:</strong></p>
                      <p>Link the five themes so ideas connect rather than sit in isolation.</p>
                    </div>
                    <div>
                      <p><strong className="text-gray-900">Keyword bank:</strong></p>
                      <p>Keep a running list of concept keywords, each with a one-line meaning and a worked example.</p>
                    </div>
                    <div>
                      <p><strong className="text-gray-900">Explain out loud:</strong></p>
                      <p>Teaching a concept back is the fastest way to expose a shaky understanding.</p>
                    </div>
                    <div>
                      <p><strong className="text-gray-900">Everyday science:</strong></p>
                      <p>Tie concepts to real things at home — the kettle, the fridge, the plants outside.</p>
                    </div>
                  </div>
                </GuideCard>
              </section>

              <section id="exam-strategies" className="scroll-mt-24">
                <SectionHeading icon={Target}>Booklet-by-booklet exam strategy</SectionHeading>
                <div className="space-y-4">
                  <GuideCard>
                    <h4 className="font-semibold text-gray-900 mb-2">Booklet A (MCQ)</h4>
                    <ul className="list-disc ml-5 space-y-1 text-sm text-gray-700">
                      <li>Read each stem carefully and underline the keyword</li>
                      <li>Eliminate the clearly wrong options first</li>
                      <li>Don&rsquo;t overthink — the obvious science is usually right</li>
                      <li>Flag and return rather than stalling on one question</li>
                    </ul>
                  </GuideCard>
                  <GuideCard>
                    <h4 className="font-semibold text-gray-900 mb-2">Booklet B (open-ended)</h4>
                    <ul className="list-disc ml-5 space-y-1 text-sm text-gray-700">
                      <li>Study every diagram, table and graph before writing</li>
                      <li>Answer with the Claim–Evidence–Reasoning structure</li>
                      <li>Use precise concept keywords, not vague phrases</li>
                      <li>Make the final sentence answer the exact question asked</li>
                    </ul>
                  </GuideCard>
                </div>
              </section>

              <section id="mistakes" className="scroll-mt-24">
                <SectionHeading icon={TriangleAlert}>Common mistakes to avoid</SectionHeading>
                <GuideCard>
                  <h4 className="font-semibold text-gray-900 mb-3">Where PSLE Science marks slip away</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-sm">
                    <div>
                      <ol className="list-decimal ml-5 space-y-1 text-gray-700">
                        <li>Misreading the question</li>
                        <li>Vague or incomplete answers</li>
                        <li>Missing the required concept keyword</li>
                        <li>Not linking the answer back to the question</li>
                        <li>Poor time management</li>
                      </ol>
                    </div>
                    <div>
                      <ol className="list-decimal ml-5 space-y-1 text-gray-700" start="6">
                        <li>Conceptual errors across themes</li>
                        <li>Ignoring data in tables or graphs</li>
                        <li>Assuming without evidence from the question</li>
                        <li>Messy presentation and handwriting</li>
                        <li>Leaving open-ended questions blank</li>
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
                        <li>Finish and check homework</li>
                        <li>Add new keywords to the concept bank</li>
                        <li>Revisit one theme&rsquo;s concept map</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 mb-1.5">Weekends</p>
                      <ul className="list-disc ml-5 space-y-1 text-gray-700">
                        <li>One to two timed practice papers</li>
                        <li>Review and reclassify mistakes</li>
                        <li>Rework open-ended answers to full marks</li>
                        <li>Target the week&rsquo;s weak theme</li>
                      </ul>
                    </div>
                  </div>
                </GuideCard>
              </section>

              <section id="resources" className="scroll-mt-24">
                <SectionHeading icon={BookOpen}>Essential PSLE Science resources</SectionHeading>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1.5">Free from us</h4>
                    <ul className="list-disc ml-5 text-sm space-y-1 text-gray-700">
                      <li>
                        <Link href="/free-notes" className="text-primary underline underline-offset-2">PSLE Science notes on matter and materials</Link>
                        {' '}&mdash; the three states, measuring volume by displacement, the three application models PSLE reuses, and the H.A.N.D.S.O.M.E. method for open-ended answers
                      </li>
                      <li>
                        <Link href="/free-test-papers" className="text-primary underline underline-offset-2">Free test papers</Link>
                        {' '}&mdash; Primary 6 Science prelim and school papers, to sit whole and to time
                      </li>
                      <li>
                        <Link href="/how-to-study/psle-science" className="text-primary underline underline-offset-2">How to study for PSLE Science</Link>
                        {' '}&mdash; how the open-ended paper is marked, and the keywords it expects
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1.5">Recommended series</h4>
                    <ul className="list-disc ml-5 text-sm space-y-1 text-gray-700">
                      <li>My Pals Are Here! Science (Marshall Cavendish)</li>
                      <li>A structured PSLE Science revision guide organised by theme</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1.5">Practice materials</h4>
                    <ul className="list-disc ml-5 text-sm space-y-1 text-gray-700">
                      <li>PSLE past papers (last 5 years)</li>
                      <li>Top-school preliminary examination papers</li>
                      <li>Topical open-ended practice by theme</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section id="tuition" className="scroll-mt-24">
                <SectionHeading icon={Users}>When to consider PSLE Science tuition</SectionHeading>
                <p>Consider PSLE Science tuition if your child:</p>
                <ul className="list-disc ml-6 space-y-1 mt-3 text-gray-700">
                  <li>Knows the facts but keeps losing marks on open-ended questions</li>
                  <li>Struggles to use the right concept keyword</li>
                  <li>Finds it hard to read evidence from diagrams and data</li>
                  <li>Needs structured practice and feedback on answers</li>
                  <li>Is aiming for AL1–AL2 and wants to sharpen technique</li>
                  <li>Benefits from someone marking answers the way examiners do</li>
                </ul>
                <GuideCard className="mt-4">
                  <p className="text-sm"><strong className="text-gray-900">Choose PSLE Science tutors who:</strong> know the current five-theme syllabus, teach Claim–Evidence–Reasoning and precise keywords, mark open-ended answers rigorously, and keep a curious primary-aged child engaged.</p>
                </GuideCard>
              </section>

              <RelatedGuides slug="psle-science" />
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
            {...enter()}
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
                    className="bg-accent-fill text-text-inverse hover:bg-accent-fill-hover"
                    onClick={resetForm}
                  >
                    Submit Another Request
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <FormStepper currentStep={currentStep} />
                  {status.error && <div className="bg-red-100 text-red-800 p-4 rounded-md mb-6">{status.error}</div>}

                  <TuitionRequestSteps form={form} />
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
