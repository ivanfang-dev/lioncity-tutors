"use client";

import React, { useState, useRef } from "react";
import Link from 'next/link';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Step1, Step2, Step3 } from "@/components/FormSteps";
import { CheckCircle } from "lucide-react";

const validateStep = (step, data) => {
  const newErrors = {};
  if (step === 1) {
    if (!data.name.trim()) newErrors.name = "Name is required.";
    if (!data.mobile.trim()) {
      newErrors.mobile = "Mobile number is required.";
    } else if (!/^[689]\d{7}$/.test(data.mobile.trim())) {
      newErrors.mobile = "Please enter a valid 8-digit Singapore mobile number.";
    }
    if (!data.level.trim()) newErrors.level = "Level & Subject are required.";
    if (!data.location.trim()) newErrors.location = "Location is required.";
  }
  return newErrors;
};

export default function SecondarySchoolTuition() {
  const [currentStep, setCurrentStep] = useState(1);
  const initialFormData = {
    name: '',
    mobile: '',
    level: '',
    location: '',
    lessonDuration: '1.5 Hours',
    customDuration: '',
    lessonFrequency: '1 Lesson/Week',
    customFrequency: '',
    preferredTime: '',
    tutorType: { partTime: true, fullTime: false, moeTeacher: false },
    budget: { type: 'marketRate', customAmount: '' },
    preferences: ''
  };
  const [formData, setFormData] = useState(initialFormData);
  const [status, setStatus] = useState({ submitting: false, submitted: false, error: null });
  const [errors, setErrors] = useState({});
  const formRef = useRef(null);

  const nextStep = () => {
    const newErrors = validateStep(currentStep, formData);
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    setErrors({});
    setCurrentStep(prev => prev - 1);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === 'checkbox' ? checked : value;
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({ ...prev, [parent]: { ...prev[parent], [child]: inputValue } }));
    } else {
      setFormData(prev => ({ ...prev, [name]: inputValue }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const step1Errors = validateStep(1, formData);
    if (Object.keys(step1Errors).length > 0) {
      setErrors(step1Errors);
      setCurrentStep(1);
      return;
    }
    setStatus({ submitting: true, submitted: false, error: null });
    try {
      const response = await fetch('https://tuition-backend-afud.onrender.com/api/requestfortutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Form submission failed');
      }
      setFormData(initialFormData);
      setCurrentStep(1);
      setStatus({ submitting: false, submitted: true, error: null });
      formRef.current?.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
      setStatus({ submitting: false, submitted: false, error: error.message });
    }
  };

  return (
    <main>
      <div className="p-6 max-w-5xl mx-auto space-y-12">
        {/* Hero Section */}
        <section className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-primary">Secondary School Tuition in Singapore<br />O-Level &amp; N-Level Specialist Tutors</h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Achieve academic success with Singapore&apos;s top O-Level and N-Level tutors. We help students in Express, Normal Academic (N(A)), and Normal Technical (N(T)) streams build confidence, master key concepts, and excel in their exams.
          </p>
          <div className="my-8 relative w-full max-w-3xl mx-auto aspect-video overflow-hidden rounded-xl shadow-lg">
            <Image
              src="/secondary-tuition.webp"
              alt="Secondary school tuition in Singapore - Students learning with experienced tutors"
              fill
              className="object-cover"
              sizes="100vw"
              placeholder="blur"
              blurDataURL="/secondary-tuition.webp"
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
                <Button className="bg-[#F17720] hover:bg-[#d9691c] text-white w-full">Learn More</Button>
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
            <div className="flex justify-center gap-6 sm:gap-10 mb-8 flex-wrap">
              <div className="flex items-center gap-2 text-gray-600">
                <CheckCircle className="w-5 h-5 text-primary" />
                <span className="font-medium">Matched within 24 hours</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <CheckCircle className="w-5 h-5 text-primary" />
                <span className="font-medium">No hidden fees, ever</span>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-8">
              {status.submitted ? (
                <div className="text-center py-10">
                  <CheckCircle className="text-primary w-16 h-16 mx-auto mb-4" />
                  <h3 className="text-2xl font-semibold mb-2 text-gray-900">Thank You!</h3>
                  <p className="text-gray-600 mb-6">Our team will be in touch with suitable tutor profiles shortly via WhatsApp.</p>
                  <Button
                    onClick={() => setStatus({ submitting: false, submitted: false, error: null })}
                    className="bg-[#F17720] text-white px-6 py-2 rounded-full hover:bg-[#d9691c] transition-colors"
                  >
                    Submit Another Request
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="mb-8">
                    <div className="flex justify-between mb-1">
                      {["Your Details", "Lesson Details", "Tutor Preferences"].map((step, i) => (
                        <span key={i} className={`text-sm font-medium ${currentStep >= i + 1 ? 'text-primary' : 'text-gray-400'}`}>{step}</span>
                      ))}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-500 ease-in-out"
                        style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
                      />
                    </div>
                  </div>
                  {status.error && (
                    <div className="bg-red-100 text-red-800 p-4 rounded-md mb-6">
                      <p className="font-semibold">Submission Error</p>
                      <p className="text-sm">{status.error}</p>
                    </div>
                  )}
                  {currentStep === 1 && <Step1 nextStep={nextStep} formData={formData} handleChange={handleChange} errors={errors} />}
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
