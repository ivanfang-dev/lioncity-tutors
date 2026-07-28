"use client";

import { MATCH_TIME } from '@/data/promises';
import React, { useRef } from "react";
import Link from 'next/link';
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Step1, Step2, Step3 } from "@/components/FormSteps";
import FormStepper from "@/components/FormStepper";
import useTuitionRequestForm from "@/components/useTuitionRequestForm";
import FormBenefits from "@/components/FormBenefits";
import { CheckCircle } from "lucide-react";
import GuideSchema from '@/components/seo/GuideSchema';
import { RelatedGuides } from '@/components/guide';

// Validation logic for form steps

export default function OLevelTuition() {
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
    levelSubjects: ['O-Level'],
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
          slug="o-level-tuition"
          course={{
            name: 'O-Level Tuition',
            description: 'Hand-matched, vetted O-Level tutors in Singapore across all subjects and streams — parents never pay an agency fee.',
            educationalLevel: 'GCE O-Level',
          }}
        />
        <div className="p-6 max-w-5xl mx-auto space-y-12">
          {/* Section 1: Headline */}
          <section className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-blue-800">O-Level Excellence: Expert Secondary School Tuition by Singapore's Top Tutors</h1>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Trusted by over 200 families. We help your child build confidence and achieve their academic potential.
            </p>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Whether your child is in Sec 1-4 or preparing for O-Levels, our experienced tutors deliver structured, engaging lessons that build confidence and boost grades — at every level. Because strong foundations make all the difference.
            </p>
          </section>
  
          {/* Tutor Request Form Section */}
        <section ref={formRef} className="bg-gradient-to-br from-blue-50 to-sky-50 p-8 rounded-2xl shadow-lg">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-primary mb-4">Request an O-Level Tutor</h2>
            <FormBenefits />
            <div className="bg-white rounded-xl shadow-lg p-8">
              {status.submitted ? (
                <div className="text-center py-10">
                  <CheckCircle className="text-primary w-16 h-16 mx-auto mb-4" />
                  <h2 className="text-2xl font-semibold mb-2 text-gray-900">Thank you!</h2>
                  <p className="text-gray-600 mb-4">Our team will be in touch with suitable tutor profiles shortly via WhatsApp.</p>
                  <Button
                    onClick={resetForm}
                    className="bg-[#F17720] text-white px-6 py-2 rounded-full hover:bg-[#d9691c] transition-colors"
                  >
                    Submit Another Request
                  </Button>
                </div>
              ) : (
                <form id="mainForm" onSubmit={handleSubmit}>
                  <FormStepper currentStep={currentStep} />
                  {status.error && (
                    <div className="bg-red-100 text-red-800 p-4 rounded-md mb-6">
                      <p className="font-semibold">Submission Error</p>
                      <p className="text-sm">{status.error}</p>
                    </div>
                  )}
                  {currentStep === 1 && <Step1 nextStep={nextStep} formData={formData} handleChange={handleChange} handleLevelSubjectChange={handleLevelSubjectChange} addLevelSubject={addLevelSubject} removeLevelSubject={removeLevelSubject} errors={errors} />}
                  {currentStep === 2 && <Step2 nextStep={nextStep} prevStep={prevStep} formData={formData} handleChange={handleChange} errors={errors} />}
                  {currentStep === 3 && <Step3 prevStep={prevStep} formData={formData} handleChange={handleChange} handleCheckboxChange={handleChange} status={status} errors={errors} />}
                </form>
              )}
            </div>
          </div>
        </section>
  
          {/* Section 2: Why O-Levels Matter */}
          <section className="bg-gradient-to-br from-blue-50 to-sky-50 p-12 rounded-2xl">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-primary text-center">Why O-Level Success Matters</h2>
            <p className="text-gray-600 text-center max-w-3xl mx-auto mb-8">
              The O-Level years are crucial for your child's academic journey. Strong results open doors to top JCs, polytechnics, and future career paths. We help your child build the skills and confidence needed to excel.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl">🎓</span>
                </div>
                <h3 className="font-bold text-xl text-primary text-center mb-4">Pathway to Success</h3>
                <p className="text-gray-600 text-center">Secure admission to top JCs and polytechnics with strong O-Level results</p>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl">💼</span>
                </div>
                <h3 className="font-bold text-xl text-primary text-center mb-4">Future Opportunities</h3>
                <p className="text-gray-600 text-center">Build a strong foundation for future academic and career success</p>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl">🧠</span>
                </div>
                <h3 className="font-bold text-xl text-primary text-center mb-4">Essential Skills</h3>
                <p className="text-gray-600 text-center">Develop critical thinking and problem-solving abilities that last a lifetime</p>
              </div>
            </div>
          </section>
  
          {/* Section 3: Subjects We Cover */}
          <section>
            <h2 className="text-2xl md:text-3xl font-semibold mb-8 text-primary text-center">Comprehensive O-Level Subjects</h2>
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
                          <span>English Language</span>
                        </li>
                        <li className="flex items-center space-x-3">
                          <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                          <span>Chinese Language / Higher Chinese</span>
                        </li>
                        <li className="flex items-center space-x-3">
                          <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                          <span>Malay Language / Higher Malay</span>
                        </li>
                        <li className="flex items-center space-x-3">
                          <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                          <span>Tamil Language / Higher Tamil</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
  
              {/* Pure Sciences */}
              <Card className="border-t-4 border-t-blue-500 shadow-lg">
                <CardContent className="p-8">
                  <h3 className="font-bold text-xl text-blue-700 mb-6">Pure Sciences</h3>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-blue-600 mb-3">Core Sciences</h4>
                      <ul className="text-gray-600 space-y-3">
                        <li className="flex items-center space-x-3">
                          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                          <span>Physics</span>
                        </li>
                        <li className="flex items-center space-x-3">
                          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                          <span>Chemistry</span>
                        </li>
                        <li className="flex items-center space-x-3">
                          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                          <span>Biology</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
  
              {/* Combined Sciences */}
              <Card className="border-t-4 border-t-purple-500 shadow-lg">
                <CardContent className="p-8">
                  <h3 className="font-bold text-xl text-purple-700 mb-6">Combined Sciences</h3>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-purple-600 mb-3">Science Combinations</h4>
                      <ul className="text-gray-600 space-y-3">
                        <li className="flex items-center space-x-3">
                          <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                          <span>Science (Physics/Chemistry)</span>
                        </li>
                        <li className="flex items-center space-x-3">
                          <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                          <span>Science (Chemistry/Biology)</span>
                        </li>
                        <li className="flex items-center space-x-3">
                          <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                          <span>Science (Physics/Biology)</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
  
              {/* Combined Humanities */}
              <Card className="border-t-4 border-t-rose-500 shadow-lg">
                <CardContent className="p-8">
                  <h3 className="font-bold text-xl text-rose-700 mb-6">Combined Humanities</h3>
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
                          <span>History</span>
                        </li>
                        <li className="flex items-center space-x-3">
                          <span className="w-2 h-2 bg-rose-500 rounded-full"></span>
                          <span>Geography</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
  
              {/* Literature */}
              <Card className="border-t-4 border-t-amber-500 shadow-lg">
                <CardContent className="p-8">
                  <h3 className="font-bold text-xl text-amber-700 mb-6">Literature</h3>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-amber-600 mb-3">Available Options</h4>
                      <ul className="text-gray-600 space-y-3">
                        <li className="flex items-center space-x-3">
                          <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                          <span>Literature in English</span>
                        </li>
                        <li className="flex items-center space-x-3">
                          <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                          <span>Literature in Chinese</span>
                        </li>
                        <li className="flex items-center space-x-3">
                          <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                          <span>Literature in Malay</span>
                        </li>
                        <li className="flex items-center space-x-3">
                          <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                          <span>Literature in Tamil</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
  
              {/* Arts & Applied Subjects */}
              <Card className="border-t-4 border-t-cyan-500 shadow-lg">
                <CardContent className="p-8">
                  <h3 className="font-bold text-xl text-cyan-700 mb-6">Arts & Applied Subjects</h3>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-cyan-600 mb-3">Creative & Technical</h4>
                      <ul className="text-gray-600 space-y-3">
                        <li className="flex items-center space-x-3">
                          <span className="w-2 h-2 bg-cyan-500 rounded-full"></span>
                          <span>Art</span>
                        </li>
                        <li className="flex items-center space-x-3">
                          <span className="w-2 h-2 bg-cyan-500 rounded-full"></span>
                          <span>Music</span>
                        </li>
                        <li className="flex items-center space-x-3">
                          <span className="w-2 h-2 bg-cyan-500 rounded-full"></span>
                          <span>Drama</span>
                        </li>
                        <li className="flex items-center space-x-3">
                          <span className="w-2 h-2 bg-cyan-500 rounded-full"></span>
                          <span>Design and Technology</span>
                        </li>
                        <li className="flex items-center space-x-3">
                          <span className="w-2 h-2 bg-cyan-500 rounded-full"></span>
                          <span>Food and Nutrition</span>
                        </li>
                        <li className="flex items-center space-x-3">
                          <span className="w-2 h-2 bg-cyan-500 rounded-full"></span>
                          <span>Principles of Accounts</span>
                        </li>
                        <li className="flex items-center space-x-3">
                          <span className="w-2 h-2 bg-cyan-500 rounded-full"></span>
                          <span>Computing</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
  
          {/* Section 4: O-Level Study Guides */}
          <section className="bg-gradient-to-br from-blue-50 to-indigo-50 p-12 rounded-2xl">
            <h2 className="text-2xl md:text-3xl font-semibold mb-8 text-primary text-center">Comprehensive O-Level Study Guides</h2>
            <p className="text-gray-600 text-center max-w-3xl mx-auto mb-8">
              Access our detailed subject-specific guides to help you excel in your O-Level journey. Each guide is crafted by experienced educators to provide comprehensive coverage of the syllabus.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Link href="/o-level-physics" className="block group">
                <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] cursor-pointer border-2 border-transparent group-hover:border-indigo-500">
                  <CardContent className="p-6 relative">
                    <div className="absolute top-4 right-4 text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                    <h3 className="font-bold text-xl text-primary mb-2 group-hover:text-primary">O-Level Physics Guide</h3>
                    <p className="text-gray-600">Master key concepts, formulas, and practical skills for O-Level Physics success.</p>
                    <div className="mt-4 text-sm text-primary font-medium flex items-center">
                      View Guide
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/o-level-chemistry" className="block group">
                <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] cursor-pointer border-2 border-transparent group-hover:border-indigo-500">
                  <CardContent className="p-6 relative">
                    <div className="absolute top-4 right-4 text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                    <h3 className="font-bold text-xl text-primary mb-2 group-hover:text-primary">O-Level Chemistry Guide</h3>
                    <p className="text-gray-600">Comprehensive coverage of chemical concepts and practical skills.</p>
                    <div className="mt-4 text-sm text-primary font-medium flex items-center">
                      View Guide
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/o-level-biology" className="block group">
                <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] cursor-pointer border-2 border-transparent group-hover:border-indigo-500">
                  <CardContent className="p-6 relative">
                    <div className="absolute top-4 right-4 text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                    <h3 className="font-bold text-xl text-primary mb-2 group-hover:text-primary">O-Level Biology Guide</h3>
                    <p className="text-gray-600">In-depth understanding of biological systems and processes.</p>
                    <div className="mt-4 text-sm text-primary font-medium flex items-center">
                      View Guide
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/o-level-math" className="block group">
                <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] cursor-pointer border-2 border-transparent group-hover:border-indigo-500">
                  <CardContent className="p-6 relative">
                    <div className="absolute top-4 right-4 text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                    <h3 className="font-bold text-xl text-primary mb-2 group-hover:text-primary">O-Level Math Guide</h3>
                    <p className="text-gray-600">Master E-Math and A-Math concepts with step-by-step guidance.</p>
                    <div className="mt-4 text-sm text-primary font-medium flex items-center">
                      View Guide
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/blog/o-level-preparation-guide" className="block group">
                <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] cursor-pointer border-2 border-transparent group-hover:border-indigo-500">
                  <CardContent className="p-6 relative">
                    <div className="absolute top-4 right-4 text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                    <h3 className="font-bold text-xl text-primary mb-2 group-hover:text-primary">O-Level Preparation Guide</h3>
                    <p className="text-gray-600">Essential tips and strategies for O-Level success.</p>
                    <div className="mt-4 text-sm text-primary font-medium flex items-center">
                      View Guide
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </section>
  
          {/* Section 5: Teaching Methods */}
          <section>
            <h2 className="text-2xl md:text-3xl font-semibold mb-8 text-primary text-center">Our Proven Teaching Methods</h2>
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
  
          {/* Section 6: Success Stories */}
          <section className="bg-gradient-to-r from-blue-50 to-sky-50 p-12 rounded-2xl">
            <h2 className="text-2xl md:text-3xl font-semibold mb-8 text-primary text-center">Success Stories from Our Secondary School Students</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-xl shadow-lg">
                <div className="flex items-start space-x-4">
                  <span className="text-3xl">📈</span>
                  <div>
                    <strong className="text-emerald-700 text-lg">Ryan (Sec 4):</strong>
                    <p className="text-gray-600 mt-2">Jumped from C5 to A2 in Additional Mathematics in just 4 months</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-lg">
                <div className="flex items-start space-x-4">
                  <span className="text-3xl">🎯</span>
                  <div>
                    <strong className="text-blue-700 text-lg">Sarah (Sec 3):</strong>
                    <p className="text-gray-600 mt-2">Achieved top 10% in school for English Literature after weekly writing clinics</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
  
          {/* Section 9: Service Areas */}
          <section className="bg-gray-50 p-6 rounded-2xl">
            <h2 className="text-2xl font-semibold mb-6 text-primary text-center">Secondary School Tuition Available Across Singapore</h2>
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
                  <span>Sembawang</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-emerald-400">•</span>
                  <span>Tampines</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-purple-400">•</span>
                  <span>Woodlands</span>
                </div>
              </div>
            </div>
          </section>
  
          <RelatedGuides slug="o-level-tuition" />

          {/* Section 10: Final CTA */}
          <section className="text-center space-y-6 bg-gradient-to-r from-primary to-primary/90 text-white py-14 px-8 rounded-2xl shadow-xl">
            <h2 className="text-3xl md:text-4xl font-bold text-white">Start Your Journey To O-Level Success Today</h2>
            <p className="text-white/80 text-lg max-w-2xl mx-auto">
              Experience the difference with our handpicked tutors. We&apos;ll match you within {MATCH_TIME}.
            </p>
            <Button
              onClick={() => formRef.current?.scrollIntoView({ behavior: 'smooth' })}
              className="text-base sm:text-lg px-8 sm:px-10 py-3 sm:py-4 bg-[#F17720] text-white hover:bg-[#d9691c] font-bold rounded-full shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              Get an O-Level Tutor Now
            </Button>
            <p className="text-sm text-white/60 mt-4">Improved grades • Expert tutors • Proven results</p>
          </section>
        </div>
      </>
    );
  }