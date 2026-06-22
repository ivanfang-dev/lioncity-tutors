"use client";

import Link from 'next/link';
import { useRef } from 'react';
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Step1, Step2, Step3 } from "@/components/FormSteps";
import FormStepper from "@/components/FormStepper";
import useTuitionRequestForm from "@/components/useTuitionRequestForm";
import FormBenefits from "@/components/FormBenefits";
import { CheckCircle } from "lucide-react";

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
    <main className="px-4 py-12 max-w-3xl mx-auto">


      <h1 className="text-3xl font-bold text-blue-800 mb-4">PSLE English Guide 2025: Master Primary School English</h1>
      <p className="text-sm text-gray-500 mb-8">Posted on June 14, 2025 • 15 min read</p>

      <article className="space-y-6 text-gray-700 leading-relaxed">
        <p className="text-lg font-medium text-gray-800">
          PSLE English is a crucial subject that tests students' language proficiency across multiple components. With the right preparation strategy, students can achieve excellent results. This comprehensive guide provides proven strategies for PSLE English success in 2025.
        </p>

        <section>
          <h2 className="text-2xl font-semibold text-blue-700 mb-3">Understanding PSLE English Structure</h2>
          <p>
            The PSLE English examination consists of four main components, each testing different aspects of language proficiency.
          </p>
          <div className="bg-blue-50 p-4 rounded-lg mt-3">
            <h4 className="font-semibold mb-2">PSLE English Components Breakdown:</h4>
            <div className="space-y-3">
              <div>
                <h5 className="font-semibold text-blue-600">Paper 1: Writing (55 marks, 1 hour 10 minutes)</h5>
                <ul className="list-disc ml-4 space-y-1 text-sm">
                  <li>Situational Writing (15 marks)</li>
                  <li>Continuous Writing (40 marks)</li>
                  <li>Tests writing skills and creativity</li>
                  <li>Focus on language use and organization</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-blue-600">Paper 2: Language Use and Comprehension (95 marks, 1 hour 50 minutes)</h5>
                <ul className="list-disc ml-4 space-y-1 text-sm">
                  <li>Grammar and Vocabulary (10 marks)</li>
                  <li>Grammar Cloze (10 marks)</li>
                  <li>Visual Text Comprehension (8 marks)</li>
                  <li>Comprehension Cloze (15 marks)</li>
                  <li>Comprehension Open-Ended (20 marks)</li>
                  <li>Editing for Spelling and Grammar (12 marks)</li>
                  <li>Synthesis and Transformation (10 marks)</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-blue-600">Paper 3: Listening Comprehension (20 marks, 35 minutes)</h5>
                <ul className="list-disc ml-4 space-y-1 text-sm">
                  <li>Multiple-choice questions</li>
                  <li>Tests listening and comprehension skills</li>
                  <li>Various text types and contexts</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-blue-600">Paper 4: Oral Communication (30 marks, 10 minutes)</h5>
                <ul className="list-disc ml-4 space-y-1 text-sm">
                  <li>Reading Aloud (10 marks)</li>
                  <li>Stimulus-based Conversation (20 marks)</li>
                  <li>Tests pronunciation and communication skills</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-blue-700 mb-3">12-Month PSLE English Preparation Timeline</h2>
          
          <div className="space-y-4">
            <div className="border-l-4 border-green-400 pl-4">
              <h4 className="font-semibold text-green-700">Primary 5 Term 4 to Primary 6 Term 1 (Foundation Phase)</h4>
              <ul className="list-disc ml-4 mt-2 space-y-1">
                <li>Master fundamental grammar rules</li>
                <li>Build vocabulary through reading</li>
                <li>Develop writing skills and techniques</li>
                <li>Practice comprehension strategies</li>
                <li>Work on pronunciation and oral skills</li>
              </ul>
            </div>

            <div className="border-l-4 border-yellow-400 pl-4">
              <h4 className="font-semibold text-yellow-700">Primary 6 Term 2 (Skill Development Phase)</h4>
              <ul className="list-disc ml-4 mt-2 space-y-1">
                <li>Complete P6 syllabus coverage</li>
                <li>Begin intensive practice with past year PSLE papers</li>
                <li>Develop time management skills</li>
                <li>Identify and strengthen weak areas</li>
                <li>Master exam techniques for each component</li>
              </ul>
            </div>

            <div className="border-l-4 border-orange-400 pl-4">
              <h4 className="font-semibold text-orange-700">Primary 6 Term 3 to Prelims (Application Phase)</h4>
              <ul className="list-disc ml-4 mt-2 space-y-1">
                <li>Daily practice with PSLE standard questions</li>
                <li>Focus on exam techniques and presentation</li>
                <li>Simulate exam conditions with full paper attempts</li>
                <li>Review and analyze all mistakes systematically</li>
                <li>Prepare for Preliminary Examinations</li>
              </ul>
            </div>

            <div className="border-l-4 border-red-400 pl-4">
              <h4 className="font-semibold text-red-700">Post-Prelims to PSLE (Mastery Phase)</h4>
              <ul className="list-disc ml-4 mt-2 space-y-1">
                <li>Intensive revision based on prelim performance</li>
                <li>Final consolidation of key concepts</li>
                <li>Practice papers under strict timing</li>
                <li>Mental preparation and stress management</li>
                <li>Maintain consistent study routine</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-blue-700 mb-3">PSLE English Components Mastery Guide</h2>
          
          <div className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-700 mb-2">✍️ Writing Skills</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <strong>Key Areas:</strong> Situational Writing, Continuous Writing, Grammar, Vocabulary
                </div>
                <div>
                  <strong>Study Strategy:</strong>
                  <ul className="list-disc ml-4 mt-1 space-y-1">
                    <li>Practice different text types for situational writing</li>
                    <li>Develop story planning and organization skills</li>
                    <li>Build vocabulary through reading and word lists</li>
                    <li>Master grammar rules and common errors</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-700 mb-2">📖 Comprehension Skills</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <strong>Key Areas:</strong> Visual Text, Comprehension Cloze, Open-Ended Questions
                </div>
                <div>
                  <strong>Study Strategy:</strong>
                  <ul className="list-disc ml-4 mt-1 space-y-1">
                    <li>Practice skimming and scanning techniques</li>
                    <li>Develop inference and deduction skills</li>
                    <li>Master vocabulary in context</li>
                    <li>Learn to identify key information</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-semibold text-purple-700 mb-2">🎤 Oral Communication</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <strong>Key Areas:</strong> Reading Aloud, Stimulus-based Conversation
                </div>
                <div>
                  <strong>Study Strategy:</strong>
                  <ul className="list-disc ml-4 mt-1 space-y-1">
                    <li>Practice pronunciation and intonation</li>
                    <li>Develop conversation skills</li>
                    <li>Learn to express opinions clearly</li>
                    <li>Build confidence in speaking</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-semibold text-yellow-700 mb-2">👂 Listening Skills</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <strong>Key Areas:</strong> Listening Comprehension, Note-taking
                </div>
                <div>
                  <strong>Study Strategy:</strong>
                  <ul className="list-disc ml-4 mt-1 space-y-1">
                    <li>Practice active listening techniques</li>
                    <li>Develop note-taking skills</li>
                    <li>Learn to identify key information</li>
                    <li>Practice with various audio materials</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-blue-700 mb-3">PSLE English Study Techniques</h2>
          <div className="bg-amber-50 p-5 rounded-lg">
            <h4 className="font-semibold mb-3">Proven PSLE English Study Methods:</h4>
            <div className="space-y-3 text-sm">
              <div>
                <p><strong>Reading Strategy:</strong></p>
                <p>Read widely across different genres. Keep a vocabulary journal and practice using new words in sentences.</p>
              </div>
              <div>
                <p><strong>Writing Practice:</strong></p>
                <p>Write regularly, focusing on different text types. Get feedback and revise your work.</p>
              </div>
              <div>
                <p><strong>Grammar Mastery:</strong></p>
                <p>Create grammar rules cards and practice identifying and correcting errors.</p>
              </div>
              <div>
                <p><strong>Oral Practice:</strong></p>
                <p>Record yourself reading and speaking, then review for improvement.</p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-blue-700 mb-3">PSLE English Exam Strategies</h2>
          <div className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-700 mb-2">Paper 1 (Writing) Strategy:</h4>
              <ul className="list-disc ml-4 space-y-1 text-sm">
                <li>Plan before writing (5-10 minutes)</li>
                <li>Check format requirements carefully</li>
                <li>Use appropriate language and tone</li>
                <li>Review and edit your work</li>
                <li>Manage time effectively</li>
              </ul>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-700 mb-2">Paper 2 (Language Use) Strategy:</h4>
              <ul className="list-disc ml-4 space-y-1 text-sm">
                <li>Read questions carefully</li>
                <li>Use elimination method for MCQs</li>
                <li>Show working for synthesis questions</li>
                <li>Check answers for accuracy</li>
                <li>Manage time per section</li>
              </ul>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-semibold text-purple-700 mb-2">Paper 3 & 4 (Listening & Oral) Strategy:</h4>
              <ul className="list-disc ml-4 space-y-1 text-sm">
                <li>Listen carefully to instructions</li>
                <li>Take notes during listening</li>
                <li>Speak clearly and confidently</li>
                <li>Use appropriate expressions</li>
                <li>Maintain good eye contact</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-blue-700 mb-3">Common PSLE English Mistakes to Avoid</h2>
          <div className="bg-red-50 p-4 rounded-lg">
            <h4 className="font-semibold text-red-700 mb-3">Top 10 PSLE English Pitfalls:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <ol className="list-decimal ml-4 space-y-1">
                  <li>Poor time management</li>
                  <li>Incorrect format in situational writing</li>
                  <li>Weak vocabulary usage</li>
                  <li>Grammar and spelling errors</li>
                  <li>Incomplete comprehension answers</li>
                </ol>
              </div>
              <div>
                <ol className="list-decimal ml-4 space-y-1" start="6">
                  <li>Poor paragraph organization</li>
                  <li>Weak oral presentation skills</li>
                  <li>Inadequate listening skills</li>
                  <li>Lack of supporting details</li>
                  <li>Poor handwriting and presentation</li>
                </ol>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-blue-700 mb-3">Creating Your PSLE English Study Schedule</h2>
          <div className="bg-indigo-50 p-5 rounded-lg">
            <h4 className="font-semibold mb-3">Recommended Weekly Schedule (Primary 6):</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p><strong>School Days:</strong></p>
                <ul className="list-disc ml-4 space-y-1">
                  <li>30-45 minutes reading practice</li>
                  <li>Complete homework thoroughly</li>
                  <li>Practice writing skills</li>
                  <li>Review grammar rules</li>
                </ul>
              </div>
              <div>
                <p><strong>Weekends:</strong></p>
                <ul className="list-disc ml-4 space-y-1">
                  <li>Complete 1-2 practice papers</li>
                  <li>Review and analyze mistakes</li>
                  <li>Focus on weak areas</li>
                  <li>Practice oral skills</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-blue-700 mb-3">Essential PSLE English Resources</h2>
          <div className="space-y-3">
            <div>
              <h4 className="font-semibold">Recommended Textbooks:</h4>
              <ul className="list-disc ml-4 text-sm space-y-1">
                <li>English Practice Papers (EPH)</li>
                <li>PSLE English Thematic Vocabulary (EPH)</li>
                <li>PSLE English Model Compositions (EPH)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Practice Materials:</h4>
              <ul className="list-disc ml-4 text-sm space-y-1">
                <li>PSLE past papers (last 5 years)</li>
                <li>School preliminary examination papers</li>
                <li>Topical practice books</li>
                <li>Online practice platforms</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Reading Materials:</h4>
              <ul className="list-disc ml-4 text-sm space-y-1">
                <li>Age-appropriate novels and stories</li>
                <li>Newspapers and magazines</li>
                <li>Online articles and blogs</li>
                <li>Educational websites</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-blue-700 mb-3">Mental Preparation for PSLE English</h2>
          <p>
            Language confidence is crucial for PSLE success. Here's how to build it:
          </p>
          <ul className="list-disc ml-6 space-y-2 mt-3">
            <li><strong>Read Widely:</strong> Develop a love for reading</li>
            <li><strong>Practice Speaking:</strong> Build confidence in communication</li>
            <li><strong>Stay Positive:</strong> Maintain a growth mindset</li>
            <li><strong>Take Breaks:</strong> Rest and recharge between study sessions</li>
            <li><strong>Seek Help:</strong> Don't hesitate to ask questions</li>
            <li><strong>Stay Calm:</strong> Practice relaxation techniques</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-blue-700 mb-3">When to Consider PSLE English Tuition</h2>
          <p>Consider professional PSLE English tuition if your child:</p>
          <ul className="list-disc ml-6 space-y-1 mt-3">
            <li>Struggles with language concepts</li>
            <li>Needs help with writing skills</li>
            <li>Requires structured practice and guidance</li>
            <li>Benefits from personalized attention</li>
            <li>Aims for A* grades</li>
            <li>Needs regular practice supervision</li>
          </ul>
          <div className="bg-blue-50 p-4 rounded-lg mt-4">
            <p><strong>Choose PSLE English tutors who:</strong> Have extensive experience with the PSLE syllabus, understand common student misconceptions, can teach both conceptual understanding and exam techniques, and provide structured practice programs.</p>
          </div>
        </section>

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
                Get matched with qualified tutors in 24 hours. Just fill out the details below.
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
      </article>
    </main>
    </>
  );
}