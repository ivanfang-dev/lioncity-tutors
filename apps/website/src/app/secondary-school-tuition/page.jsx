"use client";

import React, { useRef } from "react";
import Link from 'next/link';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Step1, Step2, Step3 } from "@/components/FormSteps";
import FormStepper from "@/components/FormStepper";
import useTuitionRequestForm from "@/components/useTuitionRequestForm";
import FormBenefits from "@/components/FormBenefits";
import { CheckCircle } from "lucide-react";
import GuideSchema from "@/components/seo/GuideSchema";

export default function SecondarySchoolTuition() {
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
    levelSubjects: [''],
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
    <main>
      <GuideSchema
        slug="secondary-school-tuition"
        course={{
          name: 'Secondary School Tuition in Singapore',
          description:
            'One-to-one secondary school tuition from Sec 1 to Sec 5, covering both the O-Level and N-Level tracks.',
          educationalLevel: 'GCE O-Level and N-Level',
        }}
      />
      <div className="p-6 max-w-5xl mx-auto space-y-12">
        {/* Hero Section */}
        <section className="text-center space-y-4">
          {/* The explicit space matters: <br> is a visual break but not a word
              separator, so without it the heading extracts as
              "…in SingaporeO-Level & N-Level…" for crawlers and screen readers. */}
          <h1 className="text-4xl font-bold text-primary">Secondary School Tuition in Singapore{' '}<br />O-Level &amp; N-Level Specialist Tutors</h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Achieve academic success with Singapore&apos;s top O-Level and N-Level tutors. We help students in Express, Normal Academic (N(A)), and Normal Technical (N(T)) streams build confidence, master key concepts, and excel in their exams.
          </p>
          <div className="my-8 relative w-full max-w-3xl mx-auto aspect-video overflow-hidden rounded-xl shadow-lg">
            <Image
              src="/secondary-tuition.webp"
              alt="Secondary school tuition in Singapore - Students learning with experienced tutors"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
              priority
            />
          </div>
        </section>

        {/* O-Level vs N-Level Info Section */}
        <section className="bg-gradient-to-br from-blue-50 to-sky-50 p-8 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-semibold text-primary mb-4 text-center">O-Level vs N-Level: Which Pathway?</h2>
          <p className="text-gray-700 max-w-3xl mx-auto text-center mb-4">
            Singapore&apos;s secondary school system offers multiple pathways to success. <strong>O-Level</strong> (Express) is the direct route to Junior College or Polytechnic, while <strong>N-Level</strong> (Normal Academic &amp; Technical) provides flexible options to progress to O-Levels, ITE, or Polytechnic. Our tutors are experienced in both streams and tailor lessons to each student&apos;s needs.
          </p>
        </section>

        {/* Feature Cards for O-Level and N-Level Tuition */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="border-t-4 border-t-primary shadow-lg">
            <CardContent className="p-8 flex flex-col h-full">
              <h3 className="font-bold text-2xl text-primary mb-4">O-Level Tuition</h3>
              <p className="text-gray-700 mb-4">Comprehensive support for all O-Level subjects, including English, Math, Sciences, Humanities, and more. Our tutors help students master exam techniques, tackle challenging topics, and achieve top grades for JC or Poly entry.</p>
              <ul className="list-disc pl-5 mb-6 text-gray-600">
                <li>Experienced O-Level specialist tutors</li>
                <li>Express stream &amp; IP support</li>
                <li>Exam strategies &amp; past year paper practice</li>
                <li>Customised lesson plans</li>
              </ul>
              <Link href="/secondary-school-tuition/o-level-tuition" className="mt-auto">
                <Button className="bg-primary hover:bg-primary/90 text-white w-full">Learn More</Button>
              </Link>
            </CardContent>
          </Card>
          <Card className="border-t-4 border-t-[#F17720] shadow-lg">
            <CardContent className="p-8 flex flex-col h-full">
              <h3 className="font-bold text-2xl text-[#d9691c] mb-4">N-Level Tuition</h3>
              <p className="text-gray-700 mb-4">Specialised tuition for Normal Academic (N(A)) and Normal Technical (N(T)) students. We focus on building strong foundations, exam confidence, and helping students progress to O-Levels, ITE, or Polytechnic.</p>
              <ul className="list-disc pl-5 mb-6 text-gray-600">
                <li>Expert N(A) &amp; N(T) tutors</li>
                <li>All core and elective N-Level subjects</li>
                <li>Step-by-step concept mastery</li>
                <li>Support for progression to O-Levels or ITE</li>
              </ul>
              <Link href="/secondary-school-tuition/n-level-tuition" className="mt-auto">
                <Button className="bg-accent-fill hover:bg-accent-fill-hover text-white w-full">Learn More</Button>
              </Link>
            </CardContent>
          </Card>
        </section>

        {/* Tutor Request Form Section */}
        <section ref={formRef} className="bg-gradient-to-br from-blue-50 to-sky-50 p-8 rounded-2xl shadow-lg">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-primary mb-2">Request a Secondary School Tutor</h2>
            <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">
              Fill in the details below and our team will match you with the best O-Level or N-Level tutor — fast, free, and no obligation.
            </p>
            <FormBenefits />
            <div className="bg-white rounded-xl shadow-lg p-8">
              {status.submitted ? (
                <div className="text-center py-10">
                  <CheckCircle className="text-primary w-16 h-16 mx-auto mb-4" />
                  <h3 className="text-2xl font-semibold mb-2 text-gray-900">Thank You!</h3>
                  <p className="text-gray-600 mb-6">Our team will be in touch with suitable tutor profiles shortly via WhatsApp.</p>
                  <Button
                    onClick={resetForm}
                    className="text-[18.7px] font-bold bg-accent-fill text-white px-6 py-2 rounded-full hover:bg-accent-fill-hover transition-colors"
                  >
                    Submit Another Request
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <FormStepper currentStep={currentStep} />
                  {status.error && (
                    <div className="bg-red-100 text-red-800 p-4 rounded-md mb-6">
                      <p className="font-semibold">Submission Error</p>
                      <p className="text-sm">{status.error}</p>
                    </div>
                  )}
                  {currentStep === 1 && <Step1 nextStep={nextStep} formData={formData} handleChange={handleChange} handleLevelSubjectChange={handleLevelSubjectChange} addLevelSubject={addLevelSubject} removeLevelSubject={removeLevelSubject} errors={errors} />}
                  {currentStep === 2 && <Step2 nextStep={nextStep} prevStep={prevStep} formData={formData} handleChange={handleChange} errors={errors} />}
                  {currentStep === 3 && <Step3 prevStep={prevStep} formData={formData} handleChange={handleChange} status={status} errors={errors} />}
                </form>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
