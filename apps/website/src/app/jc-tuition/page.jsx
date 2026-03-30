"use client";

import React, { useState, useRef } from "react";
import Link from 'next/link';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Step1, Step2, Step3 } from "@/components/FormSteps";
import { CheckCircle } from "lucide-react"; // Imported for consistency in the success message

// Validation logic for form steps - This is the new function added.
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
    }

    if (step === 2) {
        if (!data.location.trim()) newErrors.location = "Location is required.";
    }
    return newErrors;
};

export default function JCTuition() {
  const [activeStream, setActiveStream] = useState('science');
  const [currentStep, setCurrentStep] = useState(1);
  const initialFormData = {
    name: '',
    mobile: '',
    level: 'JC Level', // Set a default value as it's a JC page
    location: '',
    lessonDuration: '2 Hours', // Default for JC
    customDuration: '',
    lessonFrequency: '1 Lesson/Week',
    customFrequency: '',
    preferredTime: '',
    tutorType: {
      partTime: true, // Default to true as per previous working forms
      fullTime: false,
      moeTeacher: false
    },
    budget: {
      type: 'marketRate',
      customAmount: ''
    },
    genderPreference: 'No preference',
    bilingualRequired: 'No',
    preferences: ''
  };

  const [formData, setFormData] = useState(initialFormData);
  const [status, setStatus] = useState({
    submitting: false,
    submitted: false,
    error: null
  });

  // --- Start of ADDED/MODIFIED LOGIC ---
  const [errors, setErrors] = useState({});
  const formRef = useRef(null); // Ref for scrolling into view

  const nextStep = () => {
      const newErrors = validateStep(currentStep, formData);
      setErrors(newErrors);

      if (Object.keys(newErrors).length === 0) {
          setCurrentStep(prev => prev + 1);
      }
  };

  const prevStep = () => {
      setErrors({}); // Clear errors when going back
      setCurrentStep(prev => prev - 1);
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    
    // Clear error for the field being edited
    if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: null }));
    }

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prevData => ({
        ...prevData,
        [parent]: {
          ...prevData[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prevData => ({
        ...prevData,
        [name]: value
      }));
    }
  };
  
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    if (name.includes('.')) {
      const [objectName, field] = name.split('.');
      setFormData(prevData => ({
        ...prevData,
        [objectName]: { ...prevData[objectName], [field]: checked }
      }));
    } else {
      setFormData(prevData => ({ ...prevData, [name]: checked }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Full validation before submission
    const step1Errors = validateStep(1, formData);
    const step2Errors = validateStep(2, formData);
    const allErrors = { ...step1Errors, ...step2Errors };

    if (Object.keys(allErrors).length > 0) {
        setErrors(allErrors);
        // Go to the first step that has an error
        if (Object.keys(step1Errors).length > 0) {
            setCurrentStep(1);
        } else if (Object.keys(step2Errors).length > 0) {
            setCurrentStep(2);
        }
        return; // Stop submission if there are errors
    }

    setStatus({ submitting: true, submitted: false, error: null });
    
    try {
      const response = await fetch('https://tuition-backend-afud.onrender.com/api/requestfortutor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData) // Your existing payload structure is fine
      });
      if (response.ok) {
        setFormData(initialFormData);
        setCurrentStep(1);
        setStatus({ submitting: false, submitted: true, error: null });
        formRef.current?.scrollIntoView({ behavior: 'smooth' });
      } else {
        const errorText = await response.text();
        throw new Error(errorText || 'Form submission failed');
      }
    } catch (error) {
      setStatus({ submitting: false, submitted: false, error: error.message || 'Failed to submit the form. Please try again.' });
    }
  };
  // --- End of ADDED/MODIFIED LOGIC ---


  return (
    <>
      <div className="p-6 max-w-5xl mx-auto space-y-12">
        {/* Section 1: Headline */}
        <section className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-blue-800">Achieve Top A-Level Results with Singapore's Trusted JC Tutors</h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Support from experienced educators who know how to help your child thrive – academically and confidently.
          </p>
          <div className="my-8 relative w-full max-w-3xl mx-auto aspect-video overflow-hidden rounded-xl shadow-lg"> 
            <Image 
              src="/jc-tuition_optimized.webp" 
              alt="JC tuition in Singapore - Students learning with experienced tutors"
              fill
              className="object-cover"
              sizes="100vw"
              placeholder="blur"
              blurDataURL="/jc-tuition_optimized.webp"
              priority 
            />
          </div>

          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Whether your child is just starting JC1 or preparing for the A-Level crunch, our dedicated tutors offer targeted support tailored to every subject and stream. We don't just teach—we coach, mentor, and elevate.
          </p>
        </section>

        {/* Tutor Request Form Section */}
        <section ref={formRef} className="bg-gradient-to-br from-blue-50 to-sky-50 p-8 rounded-2xl shadow-lg">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-primary mb-4">Request a JC Tutor</h2>
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
                  <h2 className="text-2xl font-semibold mb-2 text-gray-900">Thank you!</h2>
                  <p className="text-gray-600 mb-4">Our team will be in touch with suitable tutor profiles shortly via WhatsApp.</p>
                  <button
                    onClick={() => setStatus({ submitting: false, submitted: false, error: null })}
                    className="bg-[#F17720] text-white px-6 py-2 rounded-full hover:bg-[#d9691c] transition-colors font-semibold"
                  >
                    Submit Another Request
                  </button>
                </div>
              ) : (
                <form id="mainForm" onSubmit={handleSubmit}>
                  {/* --- Progress Bar --- */}
                  <div className="mb-8">
                    <div className="flex justify-between mb-1">
                      <span className={`text-sm font-medium ${currentStep >= 1 ? 'text-primary' : 'text-gray-400'}`}>About You</span>
                      <span className={`text-sm font-medium ${currentStep >= 2 ? 'text-primary' : 'text-gray-400'}`}>Lesson Details</span>
                      <span className={`text-sm font-medium ${currentStep >= 3 ? 'text-primary' : 'text-gray-400'}`}>Tutor Preferences</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-500 ease-in-out"
                        style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  {status.error && (
                    <div className="bg-red-100 text-red-800 p-4 rounded-md mb-6">
                      <p className="font-semibold">Submission Error</p>
                      <p className="text-sm">{status.error}</p>
                    </div>
                  )}
                  {/* --- Conditional Step Rendering (Now passing errors prop) --- */}
                  {currentStep === 1 && (
                    <Step1 
                      nextStep={nextStep} 
                      formData={formData} 
                      handleChange={handleChange} 
                      errors={errors} 
                    />
                  )}
                  {currentStep === 2 && (
                    <Step2 
                      nextStep={nextStep} 
                      prevStep={prevStep} 
                      formData={formData} 
                      handleChange={handleChange} 
                      errors={errors}
                    />
                  )}
                  {currentStep === 3 && (
                    <Step3 
                      prevStep={prevStep} 
                      formData={formData} 
                      handleChange={handleChange}
                      handleCheckboxChange={handleCheckboxChange}
                      status={status}
                      errors={errors}
                    />
                  )}
                </form>
              )}
            </div>
          </div>
        </section>

        {/* Section 2: Why A-Levels Matter */}
        <section className="bg-gradient-to-br from-blue-50 to-sky-50 p-12 rounded-2xl">
          <h2 className="text-2xl md:text-3xl font-semibold mb-8 text-primary text-center">Why A-Level Success Matters for Your Child's Future</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🎓</span>
              </div>
              <h3 className="font-bold text-xl text-primary text-center mb-4">Unlock University Doors</h3>
              <p className="text-gray-600 text-center">Secure admission to top local and overseas universities with strong A-Level results</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">💼</span>
              </div>
              <h3 className="font-bold text-xl text-primary text-center mb-4">Set Stage for Success</h3>
              <p className="text-gray-600 text-center">Build a strong foundation for a rewarding career in your chosen field</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🧠</span>
              </div>
              <h3 className="font-bold text-xl text-primary text-center mb-4">Master Essential Skills</h3>
              <p className="text-gray-600 text-center">Develop critical thinking and problem-solving abilities that go beyond the exam hall</p>
            </div>
          </div>
        </section>

        {/* Section 3: Our Approach */}
        <section>
          <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-primary text-center">Our Comprehensive JC Tuition Approach</h2>
          <p className="text-gray-600 text-center max-w-3xl mx-auto mb-8">
            Our approach blends academic expertise with motivational support—so students improve not just in grades, but in confidence and exam-readiness.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-l-4 border-l-emerald-500 shadow-lg hover:shadow-xl transition-shadow duration-200">
              <CardContent className="p-8">
                <h3 className="font-bold text-xl text-emerald-700 mb-4">Customised Lessons for Science & Arts Students</h3>
                <p className="text-gray-600">Tailored programs that adapt to your child's learning style and academic goals, ensuring optimal progress in their chosen stream.</p>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-blue-500 shadow-lg hover:shadow-xl transition-shadow duration-200">
              <CardContent className="p-8">
                <h3 className="font-bold text-xl text-blue-700 mb-4">Elite Tutors with Proven Results</h3>
                <p className="text-gray-600">Highly qualified educators with track records of helping students achieve significant grade improvements and academic excellence.</p>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-purple-500 shadow-lg hover:shadow-xl transition-shadow duration-200">
              <CardContent className="p-8">
                <h3 className="font-bold text-xl text-purple-700 mb-4">Exclusive Notes, Practice Papers & Mock Exams</h3>
                <p className="text-gray-600">Access to comprehensive study materials and regular practice tests to ensure thorough preparation and confidence building.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Section 4: Subjects We Cover */}
        <section>
          <h2 className="text-2xl md:text-3xl font-semibold mb-8 text-primary text-center">Comprehensive A-Level Subjects Coverage</h2>
         
          {/* Stream Tabs */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex rounded-lg border border-gray-200 p-1 bg-gray-50">
              <button 
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  activeStream === 'science' 
                    ? 'bg-primary text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => setActiveStream('science')}
              >
                Science Stream
              </button>
              <button 
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  activeStream === 'arts' 
                    ? 'bg-primary text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => setActiveStream('arts')}
              >
                Arts Stream
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {activeStream === 'science' ? (
              <>
                {/* H2 Mathematics */}
                <Card className="border-t-4 border-t-emerald-500 shadow-lg">
                  <CardContent className="p-8">
                    <h3 className="font-bold text-xl text-emerald-700 mb-6">H2 Mathematics</h3>
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-semibold text-emerald-600 mb-3">Pure Mathematics</h4>
                        <ul className="text-gray-600 space-y-3">
                          <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                            <span>Functions & Graphs</span>
                          </li>
                          <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                            <span>Sequences & Series</span>
                          </li>
                          <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                            <span>Vectors & Complex Numbers</span>
                          </li>
                          <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                            <span>Calculus & Integration</span>
                          </li>
                          <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                            <span>Differential Equations</span>
                          </li>
                          <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                            <span>Mathematical Induction</span>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-emerald-600 mb-3">Statistics & Probability</h4>
                        <ul className="text-gray-600 space-y-3">
                          <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                            <span>Probability & Statistics</span>
                          </li>
                          <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                            <span>Hypothesis Testing</span>
                          </li>
                          <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                            <span>Correlation & Regression</span>
                          </li>
                          <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                            <span>Normal Distribution</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* H2 Chemistry */}
                <Card className="border-t-4 border-t-blue-500 shadow-lg">
                  <CardContent className="p-8">
                    <h3 className="font-bold text-xl text-blue-700 mb-6">H2 Chemistry</h3>
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-semibold text-blue-600 mb-3">Physical Chemistry</h4>
                        <ul className="text-gray-600 space-y-3">
                          <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            <span>Atomic Structure & Chemical Bonding</span>
                          </li>
                          <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            <span>Chemical Energetics & Thermodynamics</span>
                          </li>
                          <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            <span>Chemical Kinetics & Equilibria</span>
                          </li>
                          <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            <span>Electrochemistry</span>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-blue-600 mb-3">Organic Chemistry</h4>
                        <ul className="text-gray-600 space-y-3">
                          <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            <span>Hydrocarbons & Functional Groups</span>
                          </li>
                          <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            <span>Organic Reactions & Mechanisms</span>
                          </li>
                          <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            <span>Polymers & Biomolecules</span>
                          </li>
                          <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            <span>Organic Analysis</span>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-blue-600 mb-3">Inorganic Chemistry</h4>
                        <ul className="text-gray-600 space-y-3">
                          <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            <span>Periodic Table & Periodicity</span>
                          </li>
                          <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            <span>Transition Elements & Complexes</span>
                          </li>
                          <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            <span>Chemical Analysis</span>
                          </li>
                          <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            <span>Environmental Chemistry</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* H2 Physics */}
                <Card className="border-t-4 border-t-purple-500 shadow-lg">
                  <CardContent className="p-8">
                    <h3 className="font-bold text-xl text-purple-700 mb-6">H2 Physics</h3>
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-semibold text-purple-600 mb-3">Mechanics</h4>
                        <ul className="text-gray-600 space-y-3">
                          <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                            <span>Kinematics & Dynamics</span>
                          </li>
                          <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                            <span>Forces & Motion</span>
                          </li>
                          <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                            <span>Work, Energy & Power</span>
                          </li>
                          <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                            <span>Circular Motion & Gravitation</span>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-purple-600 mb-3">Waves & Oscillations</h4>
                        <ul className="text-gray-600 space-y-3">
                          <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                            <span>Wave Properties & Behavior</span>
                          </li>
                          <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                            <span>Superposition & Interference</span>
                          </li>
                          <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                            <span>Standing Waves & Resonance</span>
                          </li>
                          <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                            <span>Sound & Light Waves</span>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-purple-600 mb-3">Electricity & Magnetism</h4>
                        <ul className="text-gray-600 space-y-3">
                          <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                            <span>Electric Fields & Potential</span>
                          </li>
                          <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                            <span>Current & Circuits</span>
                          </li>
                          <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                            <span>Magnetic Fields & Forces</span>
                          </li>
                          <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                            <span>Electromagnetic Induction</span>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-purple-600 mb-3">Modern Physics</h4>
                        <ul className="text-gray-600 space-y-3">
                          <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                            <span>Quantum Physics</span>
                          </li>
                          <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                            <span>Nuclear Physics</span>
                          </li>
                          <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                            <span>Particle Physics</span>
                          </li>
                          <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                            <span>Special Relativity</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* H2 Biology */}
                <Card className="border-t-4 border-t-emerald-500 shadow-lg">
                  <CardContent className="p-8">
                    <h3 className="font-bold text-xl text-emerald-700 mb-6">H2 Biology</h3>
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-semibold text-emerald-600 mb-3">Cell Biology</h4>
                        <ul className="text-gray-600 space-y-3">
                          <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                            <span>Cell Structure & Function</span>
                          </li>
                          <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                            <span>Cell Membranes & Transport</span>
                          </li>
                          <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                            <span>Cell Division & Reproduction</span>
                          </li>
                          <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                            <span>Cell Communication</span>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-emerald-600 mb-3">Genetics & Evolution</h4>
                        <ul className="text-gray-600 space-y-3">
                          <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                            <span>DNA & Protein Synthesis</span>
                          </li>
                          <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                            <span>Inheritance & Variation</span>
                          </li>
                          <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                            <span>Genetic Engineering</span>
                          </li>
                          <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                            <span>Evolution & Natural Selection</span>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-emerald-600 mb-3">Ecology & Environment</h4>
                        <ul className="text-gray-600 space-y-3">
                          <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                            <span>Ecosystems & Communities</span>
                          </li>
                          <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                            <span>Population Dynamics</span>
                          </li>
                          <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                            <span>Conservation Biology</span>
                          </li>
                          <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                            <span>Environmental Issues</span>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-emerald-600 mb-3">Human Physiology</h4>
                        <ul className="text-gray-600 space-y-3">
                          <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                            <span>Nervous & Endocrine Systems</span>
                          </li>
                          <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                            <span>Circulatory & Respiratory Systems</span>
                          </li>
                          <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                            <span>Digestive & Excretory Systems</span>
                          </li>
                          <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                            <span>Immune System & Disease</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* H2 Computing */}
                <Card className="border-t-4 border-t-blue-500 shadow-lg">
                  <CardContent className="p-8">
                    <h3 className="font-bold text-xl text-blue-700 mb-6">H2 Computing</h3>
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-semibold text-blue-600 mb-3">Programming & Algorithms</h4>
                        <ul className="text-gray-600 space-y-3">
                          <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            <span>Python Programming</span>
                          </li>
                          <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            <span>Algorithm Design & Analysis</span>
                          </li>
                          <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            <span>Data Structures</span>
                          </li>
                          <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            <span>Object-Oriented Programming</span>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-blue-600 mb-3">Computer Architecture</h4>
                        <ul className="text-gray-600 space-y-3">
                          <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            <span>Hardware Components</span>
                          </li>
                          <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            <span>Operating Systems</span>
                          </li>
                          <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            <span>Networks & Security</span>
                          </li>
                          <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            <span>Database Systems</span>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-blue-600 mb-3">Software Development</h4>
                        <ul className="text-gray-600 space-y-3">
                          <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            <span>Software Engineering</span>
                          </li>
                          <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            <span>Web Development</span>
                          </li>
                          <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            <span>Mobile App Development</span>
                          </li>
                          <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            <span>Project Management</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <>
                {/* H2 Art */}
                <Card className="border-t-4 border-t-emerald-500 shadow-lg">
                  <CardContent className="p-8">
                    <h3 className="font-bold text-xl text-emerald-700 mb-6">H2 Art</h3>
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-semibold text-emerald-600 mb-3">Studio Practice</h4>
                        <ul className="text-gray-600 space-y-3">
                          <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                            <span>Drawing & Painting</span>
                          </li>
                          <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                            <span>Sculpture & Installation</span>
                          </li>
                          <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                            <span>Digital Art & Media</span>
                          </li>
                          <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                            <span>Mixed Media & Experimental Art</span>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-emerald-600 mb-3">Art History & Theory</h4>
                        <ul className="text-gray-600 space-y-3">
                          <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                            <span>Modern & Contemporary Art</span>
                          </li>
                          <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                            <span>Art Criticism & Analysis</span>
                          </li>
                          <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                            <span>Cultural & Social Context</span>
                          </li>
                          <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                            <span>Art Movements & Styles</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* H2 China Studies */}
                <Card className="border-t-4 border-t-blue-500 shadow-lg">
                  <CardContent className="p-8">
                    <h3 className="font-bold text-xl text-blue-700 mb-6">H2 China Studies in English</h3>
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-semibold text-blue-600 mb-3">Chinese History & Culture</h4>
                        <ul className="text-gray-600 space-y-3">
                          <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            <span>Ancient Chinese Civilization</span>
                          </li>
                          <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            <span>Imperial China</span>
                          </li>
                          <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            <span>Modern Chinese History</span>
                          </li>
                          <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            <span>Cultural Traditions & Values</span>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-blue-600 mb-3">Contemporary China</h4>
                        <ul className="text-gray-600 space-y-3">
                          <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            <span>Political System & Governance</span>
                          </li>
                          <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            <span>Economic Development</span>
                          </li>
                          <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            <span>Social Changes & Issues</span>
                          </li>
                          <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            <span>International Relations</span>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-blue-600 mb-3">Chinese Literature & Arts</h4>
                        <ul className="text-gray-600 space-y-3">
                          <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            <span>Classical Literature</span>
                          </li>
                          <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            <span>Modern Literature</span>
                          </li>
                          <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            <span>Visual Arts & Architecture</span>
                          </li>
                          <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            <span>Performing Arts</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* H2 Economics */}
                <Card className="border-t-4 border-t-purple-500 shadow-lg">
                  <CardContent className="p-8">
                    <h3 className="font-bold text-xl text-purple-700 mb-6">H2 Economics</h3>
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-semibold text-purple-600 mb-3">Microeconomics</h4>
                        <ul className="text-gray-600 space-y-3">
                          <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                            <span>Market Structures</span>
                          </li>
                          <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                            <span>Price Theory</span>
                          </li>
                          <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                            <span>Consumer Behavior</span>
                          </li>
                          <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                            <span>Production & Costs</span>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-purple-600 mb-3">Macroeconomics</h4>
                        <ul className="text-gray-600 space-y-3">
                          <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                            <span>National Income</span>
                          </li>
                          <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                            <span>Fiscal Policy</span>
                          </li>
                          <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                            <span>Monetary Policy</span>
                          </li>
                          <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                            <span>Economic Growth</span>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-purple-600 mb-3">International Economics</h4>
                        <ul className="text-gray-600 space-y-3">
                          <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                            <span>International Trade</span>
                          </li>
                          <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                            <span>Exchange Rates</span>
                          </li>
                          <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                            <span>Balance of Payments</span>
                          </li>
                          <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                            <span>Globalization</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* H2 Geography */}
                <Card className="border-t-4 border-t-emerald-500 shadow-lg">
                  <CardContent className="p-8">
                    <h3 className="font-bold text-xl text-emerald-700 mb-6">H2 Geography</h3>
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-semibold text-emerald-600 mb-3">Physical Geography</h4>
                        <ul className="text-gray-600 space-y-3">
                          <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                            <span>Plate Tectonics</span>
                          </li>
                          <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                            <span>Weather & Climate</span>
                          </li>
                          <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                            <span>Hydrology</span>
                          </li>
                          <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                            <span>Ecosystems</span>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-emerald-600 mb-3">Human Geography</h4>
                        <ul className="text-gray-600 space-y-3">
                          <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                            <span>Population Studies</span>
                          </li>
                          <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                            <span>Urban Development</span>
                          </li>
                          <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                            <span>Economic Systems</span>
                          </li>
                          <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                            <span>Cultural Geography</span>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-emerald-600 mb-3">Environmental Management</h4>
                        <ul className="text-gray-600 space-y-3">
                          <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                            <span>Resource Management</span>
                          </li>
                          <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                            <span>Environmental Issues</span>
                          </li>
                          <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                            <span>Sustainability</span>
                          </li>
                          <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                            <span>Conservation</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* H2 History */}
                <Card className="border-t-4 border-t-blue-500 shadow-lg">
                  <CardContent className="p-8">
                    <h3 className="font-bold text-xl text-blue-700 mb-6">H2 History</h3>
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-semibold text-blue-600 mb-3">International History</h4>
                        <ul className="text-gray-600 space-y-3">
                          <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            <span>Cold War</span>
                          </li>
                          <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            <span>Decolonization</span>
                          </li>
                          <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            <span>Global Conflicts</span>
                          </li>
                          <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            <span>International Relations</span>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-blue-600 mb-3">Southeast Asian History</h4>
                        <ul className="text-gray-600 space-y-3">
                          <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            <span>Colonial Period</span>
                          </li>
                          <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            <span>Nationalism</span>
                          </li>
                          <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            <span>Modern Development</span>
                          </li>
                          <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            <span>Regional Integration</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* H2 Literature */}
                <Card className="border-t-4 border-t-purple-500 shadow-lg">
                  <CardContent className="p-8">
                    <h3 className="font-bold text-xl text-purple-700 mb-6">H2 Literature in English</h3>
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-semibold text-purple-600 mb-3">Literary Analysis</h4>
                        <ul className="text-gray-600 space-y-3">
                          <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                            <span>Poetry Analysis</span>
                          </li>
                          <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                            <span>Prose Analysis</span>
                          </li>
                          <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                            <span>Drama Analysis</span>
                          </li>
                          <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                            <span>Literary Devices</span>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-purple-600 mb-3">Critical Approaches</h4>
                        <ul className="text-gray-600 space-y-3">
                          <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                            <span>Literary Theory</span>
                          </li>
                          <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                            <span>Comparative Analysis</span>
                          </li>
                          <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                            <span>Cultural Studies</span>
                          </li>
                          <li className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                            <span>Gender Studies</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

              </>
            )}
          </div>
        </section>

        {/* Section 5: A-Level Study Guides */}
        <section className="bg-gradient-to-br from-blue-50 to-indigo-50 p-12 rounded-2xl">
          <h2 className="text-2xl md:text-3xl font-semibold mb-8 text-primary text-center">Comprehensive A-Level Study Guides</h2>
          <p className="text-gray-600 text-center max-w-3xl mx-auto mb-8">
            Access our detailed subject-specific guides to help you excel in your A-Level journey. Each guide is crafted by experienced educators to provide comprehensive coverage of the syllabus.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/a-level-physics" className="block">
              <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] cursor-pointer">
                <CardContent className="p-6">
                  <h3 className="font-bold text-xl text-primary mb-2">A-Level Physics Guide</h3>
                  <p className="text-gray-600">Master key concepts, formulas, and practical skills for A-Level Physics success.</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/a-level-chemistry" className="block">
              <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] cursor-pointer">
                <CardContent className="p-6">
                  <h3 className="font-bold text-xl text-primary mb-2">A-Level Chemistry Guide</h3>
                  <p className="text-gray-600">Comprehensive coverage of H1/H2 chemistry concepts.</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/a-level-biology" className="block">
              <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] cursor-pointer">
                <CardContent className="p-6">
                  <h3 className="font-bold text-xl text-primary mb-2">A-Level Biology Guide</h3>
                  <p className="text-gray-600">In-depth understanding of biological systems and processes.</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/a-level-math" className="block">
              <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] cursor-pointer">
                <CardContent className="p-6">
                  <h3 className="font-bold text-xl text-primary mb-2">A-Level Math Guide</h3>
                  <p className="text-gray-600">Master calculus, statistics, and mathematical concepts.</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/a-level-general-paper" className="block">
              <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] cursor-pointer">
                <CardContent className="p-6">
                  <h3 className="font-bold text-xl text-primary mb-2">A-Level General Paper Guide</h3>
                  <p className="text-gray-600">Learn how to tackle essays and comprehension with ease.</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/blog/a-level-preparation-guide" className="block">
              <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] cursor-pointer">
                <CardContent className="p-6">
                  <h3 className="font-bold text-xl text-primary mb-2">A-Level Preparation Guide</h3>
                  <p className="text-gray-600">Essential tips and strategies for A-Level success.</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </section>

        {/* Section 5: Success Stories */}
        <section className="bg-gradient-to-r from-blue-50 to-sky-50 p-12 rounded-2xl">
          <h2 className="text-2xl md:text-3xl font-semibold mb-8 text-primary text-center">Success Stories from Our JC Students</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="flex items-start space-x-4">
                <span className="text-3xl">📈</span>
                <div>
                  <strong className="text-emerald-700 text-lg">Wei Jie (JC2):</strong>
                  <p className="text-gray-600 mt-2">Improved from U grade to A in H2 Mathematics</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="flex items-start space-x-4">
                <span className="text-3xl">🎯</span>
                <div>
                  <strong className="text-blue-700 text-lg">Sarah (JC1):</strong>
                  <p className="text-gray-600 mt-2">Achieved top 10% in school for H2 Physics</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 6: Teaching Methods */}
        <section>
          <h2 className="text-2xl md:text-3xl font-semibold mb-8 text-primary text-center">Our Proven Teaching Methods</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-xl font-bold text-emerald-700 mb-4">📚 Advanced Learning</h3>
              <p className="text-gray-600">
                In-depth coverage of complex topics with clear explanations and practical applications.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-xl font-bold text-blue-700 mb-4">🎯 Exam Strategies</h3>
              <p className="text-gray-600">
                Proven techniques for tackling different question types and managing exam time effectively.
              </p>
            </div>
          </div>
        </section>

        {/* Section 7: Testimonials */}
        <section>
          <h2 className="text-2xl md:text-3xl font-semibold mb-8 text-primary text-center">What Parents Say About Our JC Tuition</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <blockquote className="bg-gradient-to-br from-indigo-50 to-emerald-50 p-8 rounded-xl border-l-4 border-l-emerald-500 shadow-lg">
              <p className="italic text-lg mb-4">"We saw our daughter's confidence grow week by week. By the time A-Levels arrived, she was ready—not just academically, but mentally."</p>
              <cite className="text-emerald-700 font-semibold text-lg">– Mrs. Tan, Mother of a JC2 Student (RI)</cite>
            </blockquote>
            <blockquote className="bg-gradient-to-br from-purple-50 to-blue-50 p-8 rounded-xl border-l-4 border-l-blue-500 shadow-lg">
              <p className="italic text-lg mb-4">"LionCity Tutors helped my son move from consistent 'S' grades to an A in H2 Chemistry. Worth every cent."</p>
              <cite className="text-blue-700 font-semibold text-lg">– Mr. Lim</cite>
            </blockquote>
          </div>
        </section>

        {/* Section 8: Service Areas */}
        <section className="bg-gray-50 p-6 rounded-2xl">
          <h2 className="text-2xl font-semibold mb-6 text-primary text-center">JC Tuition Available Across Singapore</h2>
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

        {/* Section 9: Final CTA - Option 3: High-Impact & Contrasting */}
        <section className="text-center space-y-6 bg-gradient-to-r from-primary to-primary/90 text-white py-14 px-8 rounded-2xl shadow-xl">
            <h2 className="text-3xl md:text-4xl font-bold text-white">Start Your Journey To A-Level Success Today</h2>
            <p className="text-white/80 text-lg max-w-2xl mx-auto">
                Experience the difference with our handpicked tutors. We&apos;ll match you within 24 hours.
            </p>
            <Button
                onClick={() => formRef.current?.scrollIntoView({ behavior: 'smooth' })}
                className="text-lg px-10 py-4 bg-[#F17720] text-white hover:bg-[#d9691c] font-bold rounded-full shadow-lg transform hover:scale-105 transition-all duration-200"
            >
                Request a JC Tutor Now
            </Button>
        </section>
      </div>
    </>
  );
}