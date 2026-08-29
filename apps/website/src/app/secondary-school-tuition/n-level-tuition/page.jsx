"use client";

import { MATCH_TIME } from '@/data/promises';
import React, { useRef } from "react";
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TuitionRequestSteps } from "@/components/FormSteps";
import FormStepper from "@/components/FormStepper";
import useTuitionRequestForm from "@/components/useTuitionRequestForm";
import FormBenefits from "@/components/FormBenefits";
import { CheckCircle } from "lucide-react";
import GuideSchema from "@/components/seo/GuideSchema";
import { RelatedGuides } from "@/components/guide";

// Validation logic for form steps

export default function NLevelTuition() {
  const formRef = useRef(null);
  const form = useTuitionRequestForm({ levelSubjects: ['N-Level'] });
  const { currentStep, status, handleSubmit, resetForm } = form;

  return (
    <>
      <GuideSchema
        slug="n-level-tuition"
        course={{
          name: 'N-Level Tuition Singapore',
          description:
            'One-to-one N-Level tuition in Singapore for Normal (Academic) and Normal (Technical) students, covering English, Mathematics and Combined Science.',
          educationalLevel: 'GCE N-Level',
        }}
      />
      <div className="p-6 max-w-5xl mx-auto space-y-12">
        {/* Section 1: Headline */}
        <section className="text-center space-y-4">
          <h1 className="page-title text-primary">N-Level Tuition: Expert Guidance for Normal Academic & Technical Streams</h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Trusted by over 200 families. We help N(A) and N(T) students build confidence, master key concepts, and achieve their best results.
          </p>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Whether your child is in Sec 1-4 or preparing for the N-Level exams, our experienced tutors deliver structured, engaging lessons that build confidence and boost grades. We support every step, from foundational skills to exam strategies.
          </p>
        </section>

        {/* Tutor Request Form Section */}
        <section ref={formRef} className="bg-gradient-to-br from-blue-50 to-sky-50 p-8 rounded-2xl shadow-lg">
          <div className="max-w-4xl mx-auto">
            <h2 className="section-title text-primary text-center mb-4">Request an N-Level Tutor</h2>

            <FormBenefits />

            <div className="bg-white rounded-xl shadow-lg p-8">
              {status.submitted ? (
                <div className="text-center py-10">
                  <CheckCircle className="text-primary w-16 h-16 mx-auto mb-4" />
                  <h2 className="text-2xl font-semibold mb-2 text-gray-900">Thank you!</h2>
                  <p className="text-gray-600 mb-4">Our team will be in touch with suitable tutor profiles shortly via WhatsApp.</p>
                  <Button
                    onClick={resetForm}
                    className="h-auto text-[18.7px] font-bold bg-accent-fill text-white px-6 py-2 rounded-full hover:bg-accent-fill-hover transition-colors"
                  >
                    Submit Another Request
                  </Button>
                </div>
              ) : (
                <form id="mainForm" onSubmit={handleSubmit}>
                  {/* --- Progress Bar --- */}
                  <FormStepper currentStep={currentStep} />
                  {status.error && (
                    <div className="bg-red-100 text-red-800 p-4 rounded-md mb-6">
                      <p className="font-semibold">Submission Error</p>
                      <p className="text-sm">{status.error}</p>
                    </div>
                  )}
                  {/* --- Conditional Step Rendering (with errors prop) --- */}
                  <TuitionRequestSteps form={form} />                </form>
              )}
            </div>
          </div>
        </section>

        {/* Section 2: Why N-Levels Matter */}
        <section className="bg-gradient-to-br from-blue-50 to-sky-50 p-6 sm:p-12 rounded-2xl">
          <h2 className="section-title text-primary mb-4 text-center">Why N-Level Success Matters</h2>
          <p className="text-gray-600 text-center max-w-3xl mx-auto mb-8">
            The N-Level exams are a key milestone for students in the Normal Academic and Normal Technical streams. Good results open doors to O-Levels, ITE, and Polytechnic pathways. We help your child build the skills and confidence needed to excel.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🎓</span>
              </div>
              <h3 className="font-bold text-xl text-primary text-center mb-4">Pathway to Progression</h3>
              <p className="text-gray-600 text-center">Qualify for O-Levels, ITE, or Polytechnic with strong N-Level results</p>
            </div>
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">💼</span>
              </div>
              <h3 className="font-bold text-xl text-primary text-center mb-4">Future Opportunities</h3>
              <p className="text-gray-600 text-center">Build a strong foundation for future academic and career success</p>
            </div>
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🧠</span>
              </div>
              <h3 className="font-bold text-xl text-primary text-center mb-4">Essential Skills</h3>
              <p className="text-gray-600 text-center">Develop critical thinking and problem-solving abilities that last a lifetime</p>
            </div>
          </div>
        </section>

        {/* Section 3: Subjects We Cover (N-Level) */}
        <section>
          <h2 className="section-title text-primary mb-8 text-center">Comprehensive N-Level Subjects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Languages */}
            <Card className="border-t-4 border-t-emerald-500 shadow-lg">
              <CardContent className="p-8">
                <h3 className="font-bold text-xl text-emerald-700 mb-6">Languages</h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-emerald-600 mb-3">Core Languages</h4>
                    <ul className="text-gray-600 space-y-3">
                      <li className="flex items-center space-x-3">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                        <span>English Language (N(A) & N(T))</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                        <span>Mother Tongue Languages (Chinese, Malay, Tamil)</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Mathematics */}
            <Card className="border-t-4 border-t-blue-500 shadow-lg">
              <CardContent className="p-8">
                <h3 className="font-bold text-xl text-blue-700 mb-6">Mathematics</h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-blue-600 mb-3">N(A) & N(T) Math</h4>
                    <ul className="text-gray-600 space-y-3">
                      <li className="flex items-center space-x-3">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        <span>Mathematics (N(A))</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        <span>Mathematics (N(T))</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Science */}
            <Card className="border-t-4 border-t-purple-500 shadow-lg">
              <CardContent className="p-8">
                <h3 className="font-bold text-xl text-purple-700 mb-6">Science</h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-purple-600 mb-3">N(A) & N(T) Science</h4>
                    <ul className="text-gray-600 space-y-3">
                      <li className="flex items-center space-x-3">
                        <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                        <span>Science (N(A))</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                        <span>Science (N(T))</span>
                      </li>
                    </ul>
                    <p className="mt-4 text-sm text-gray-600">
                      Free to download:{' '}
                      <Link href="/free-notes" className="text-primary underline underline-offset-2">
                        N(T)-Level Science notes for the Food Matters module
                      </Link>
                      {' '}&mdash; the four food tests, digestion and enzymes, preservation chemistry, and the
                      list of what syllabus 5148 leaves out.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Humanities */}
            <Card className="border-t-4 border-t-rose-500 shadow-lg">
              <CardContent className="p-8">
                <h3 className="font-bold text-xl text-rose-700 mb-6">Humanities</h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-rose-600 mb-3">Core Components</h4>
                    <ul className="text-gray-600 space-y-3">
                      <li className="flex items-center space-x-3">
                        <span className="w-2 h-2 bg-rose-500 rounded-full"></span>
                        <span>Social Studies</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <span className="w-2 h-2 bg-rose-500 rounded-full"></span>
                        <span>Geography</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <span className="w-2 h-2 bg-rose-500 rounded-full"></span>
                        <span>History</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Electives & Applied Subjects */}
            <Card className="border-t-4 border-t-cyan-500 shadow-lg">
              <CardContent className="p-8">
                <h3 className="font-bold text-xl text-cyan-700 mb-6">Electives & Applied Subjects</h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-cyan-600 mb-3">Creative & Technical</h4>
                    <ul className="text-gray-600 space-y-3">
                      <li className="flex items-center space-x-3">
                        <span className="w-2 h-2 bg-cyan-500 rounded-full"></span>
                        <span>Design & Technology</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <span className="w-2 h-2 bg-cyan-500 rounded-full"></span>
                        <span>Food & Nutrition</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <span className="w-2 h-2 bg-cyan-500 rounded-full"></span>
                        <span>Principles of Accounts</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <span className="w-2 h-2 bg-cyan-500 rounded-full"></span>
                        <span>Computer Applications (N(T))</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Section 4 (guides and resources) is now rendered by <RelatedGuides>
            further down, which sources all five cluster spokes and their anchor
            text from src/lib/seo/clusters.mjs. The previous hardcoded three-card
            grid covered only three of them and duplicated those links. */}

        {/* Section 5: Teaching Methods */}
        <section>
          <h2 className="section-title text-primary mb-8 text-center">Our Proven Teaching Methods</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-xl font-bold text-emerald-700 mb-4">📚 Interactive Learning</h3>
              <p className="text-gray-600">
                Engaging activities and real-world examples to make complex concepts accessible and memorable.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-xl font-bold text-blue-700 mb-4">🎯 Targeted Practice</h3>
              <p className="text-gray-600">
                Customized exercises and past year papers to strengthen weak areas and build exam confidence.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-xl font-bold text-purple-700 mb-4">🧭 Continuous Feedback</h3>
              <p className="text-gray-600">
                Regular progress updates and goal-setting with parents to keep learning on track.
              </p>
            </div>
          </div>
        </section>

        {/* Section 9: Service Areas */}
        <section className="bg-gray-50 p-6 rounded-2xl">
          <h2 className="section-title text-primary mb-6 text-center">N-Level Tuition Available Across Singapore</h2>
          <p className="text-gray-700 text-center mb-6">
            Our experienced tutors serve families island-wide, including:
          </p>
          <div className="max-w-2xl mx-auto">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <span className="text-blue-400">•</span>
                <span>Ang Mo Kio</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-emerald-400">•</span>
                <span>Bedok</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-purple-400">•</span>
                <span>Bishan</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-blue-400">•</span>
                <span>Bukit Timah</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-emerald-400">•</span>
                <span>Clementi</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-purple-400">•</span>
                <span>Hougang</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-blue-400">•</span>
                <span>Jurong</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-emerald-400">•</span>
                <span>Pasir Ris</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-purple-400">•</span>
                <span>Punggol</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-blue-400">•</span>
                <span>Sengkang</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-emerald-400">•</span>
                <span>Tampines</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-purple-400">•</span>
                <span>Toa Payoh</span>
              </div>
            </div>
          </div>
        </section>

        {/* Cluster links, from the SEO registry */}
        <RelatedGuides slug="n-level-tuition" heading="N-Level guides and resources" />

        {/* Section 10: Final CTA - UPDATED */}
        <section className="text-center space-y-6 bg-gradient-to-r from-primary to-primary/90 text-white p-6 sm:p-12 rounded-2xl shadow-xl">
            <h2 className="section-title text-white">Start Your Journey To N-Level Success Today</h2>
            <p className="text-text-inverse text-lg max-w-2xl mx-auto">
                Experience the difference with our handpicked tutors. We'll match you within {MATCH_TIME}.
            </p>
            <div className="pt-4">
                <Button 
                    onClick={() => formRef.current?.scrollIntoView({ behavior: 'smooth' })}
                    className="h-auto text-[18.7px] font-bold max-w-full whitespace-normal px-6 sm:px-10 py-3 sm:py-4 bg-accent-fill text-white hover:bg-accent-fill-hover rounded-full shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                    Get an N-Level Tutor Now
                </Button>
            </div>
        </section>
      </div>
    </>
  );
}