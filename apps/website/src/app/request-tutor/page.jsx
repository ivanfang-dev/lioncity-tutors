"use client";

import React, { Suspense, useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { Info, CheckCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Step1, Step2, Step3 } from "@/components/FormSteps";

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


function RequestForTutorContent(){
  const searchParams = useSearchParams();
  const formRef = useRef(null);
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
    tutorType: {
      partTime: true,
      fullTime: false,
      moeTeacher: false
    },
    budget: {
      type: 'marketRate', // 'marketRate' or 'custom'
      customAmount: ''
    },
    genderPreference: 'No preference',
    bilingualRequired: 'No',
    preferences: ''
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({
    submitting: false,
    submitted: false,
    error: null
  });

  // This hook reads the URL parameters on page load and pre-fills the form data.
  useEffect(() => {
    const name = searchParams.get('name');
    const mobile = searchParams.get('mobile');

    // Update the state only if any of the URL parameters exist
    if (name || mobile ) {
      setFormData(prevData => ({
        ...prevData,
        name: name || prevData.name,
        mobile: mobile || prevData.mobile,
      }));
    }
  }, [searchParams]);

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
      const { name, value, type, checked } = e.target;
      const inputValue = type === 'checkbox' ? checked : value;

      // Clear the specific error when the user starts typing
      if (errors[name]) {
          setErrors(prev => ({ ...prev, [name]: null }));
      }

      if (name.includes('.')) {
          const [parent, child] = name.split('.');
          setFormData(prev => ({
              ...prev,
              [parent]: { ...prev[parent], [child]: inputValue }
          }));
      } else {
          setFormData(prev => ({ ...prev, [name]: inputValue }));
      }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
     // Final validation check on all fields before submitting
      const step1Errors = validateStep(1, formData);
      const step2Errors = validateStep(2, formData);
      const allErrors = { ...step1Errors, ...step2Errors }; // Combine errors from all steps

      if (Object.keys(allErrors).length > 0) {
          setErrors(allErrors);
          // If there are errors from Step 1, automatically go back to it
          if (Object.keys(step1Errors).length > 0) {
              setCurrentStep(1);
          } else if (Object.keys(step2Errors).length > 0) {
              setCurrentStep(2)
          }
          return; // Stop submission
      }
    setStatus({ submitting: true, submitted: false, error: null });

    try {
      const response = await fetch('https://tuition-backend-afud.onrender.com/api/requestfortutor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setFormData(initialFormData);
        setCurrentStep(1); // Reset to first step
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setStatus({ submitting: false, submitted: true, error: null });
      } else {
        const errorText = await response.text();
        throw new Error(errorText || 'Form submission failed');
      }
    }
    catch (error) {
      setStatus({ submitting: false, submitted: false, error: error.message || 'Failed to submit the form. Please try again.' });
    }
  };

  return (
    <>
    <main>
    <div className="bg-gray-50 min-h-screen">
      {/* Compact Header */}
      <div className="bg-gradient-to-r from-blue-50 via-white to-blue-50 py-6 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-blue-800 mb-2">Find Your Ideal Tutor Today!</h2>
        <p className="text-gray-600 text-sm max-w-xl mx-auto">Complete this form - 100% Free, Fast Response Guaranteed</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Form */}
          <div className="lg:col-span-2">
            <section ref={formRef} className="form-section-gradient">
                <motion.div
                    className="form-card-container"
                    initial={{ opacity: 0, y: 50, scale: 0.95 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <div className="bg-background-card rounded-xl shadow-lg p-8">
                        {status.submitted ? (
                            <div className="text-center py-10">
                                <CheckCircle className="text-green-500 w-16 h-16 mx-auto mb-4" />
                                <h2 className="text-2xl font-semibold mb-2">Thank you!</h2>
                                <p className="text-text-default/80 mb-4">We'll send you tutor profiles shortly.</p>
                                <Button
                                    className="bg-accent text-text-inverse hover:bg-accent/90"
                                    onClick={() => setStatus({ submitting: false, submitted: false, error: null })}
                                >
                                    Submit Another Request
                                </Button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <div className="mb-8">
                                    <div className="hidden sm:flex justify-between mb-1">
                                        {["Your Details", "Lesson Details", "Tutor Preferences"].map((step, i) => (
                                            <span key={i} className={`text-sm font-medium ${currentStep >= i + 1 ? 'text-primary' : 'text-gray-400'}`}>{step}</span>
                                        ))}
                                    </div>
                                    <div className="flex sm:hidden justify-center mb-1">
                                        <span className="text-sm font-medium text-primary">
                                            Step {currentStep} of 3
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div className="bg-primary h-2 rounded-full transition-all duration-500" style={{ width: `${((currentStep - 1) / 2) * 100}%` }} />
                                    </div>
                                </div>
                                {status.error && <div className="bg-red-100 text-red-800 p-4 rounded-md mb-6">{status.error}</div>}

                                {currentStep === 1 && <Step1 nextStep={nextStep} formData={formData} handleChange={handleChange} errors={errors} />}
                                {currentStep === 2 && <Step2 nextStep={nextStep} prevStep={prevStep} formData={formData} handleChange={handleChange} errors={errors} />}
                                {currentStep === 3 && <Step3 prevStep={prevStep} formData={formData} handleChange={handleChange} status={status} errors={errors} />}
                            </form>
                        )}
                    </div>
                </motion.div>
            </section>
          </div>

          {/* Right Column: Trust Indicators & Info */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              
              {/* Trust Indicators */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Why Choose Us?</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="text-green-500 mt-1">✓</div>
                    <div>
                      <h4 className="font-semibold text-blue-600">100+ Successful Matches</h4>
                      <p className="text-sm text-gray-600">Helped over 100 students find qualified tutors</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="text-green-500 mt-1">✓</div>
                    <div>
                      <h4 className="font-semibold text-blue-600">100% Free Service</h4>
                      <p className="text-sm text-gray-600">No hidden fees or charges</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="text-green-500 mt-1">✓</div>
                    <div>
                      <h4 className="font-semibold text-blue-600">Fast Response</h4>
                      <p className="text-sm text-gray-600">Tutor profiles within 24 hours</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="bg-blue-50 rounded-xl p-6">
                <div className="flex items-start space-x-3">
                  <Info className="text-blue-600 mt-1" size={20} />
                  <div>
                    <h4 className="font-semibold text-blue-800 mb-2">How It Works</h4>
                    <ol className="text-sm text-blue-700 space-y-1">
                      <li>1. Fill out this form</li>
                      <li>2. We match you with suitable tutors</li>
                      <li>3. Review tutor profiles & choose</li>
                      <li>4. Start learning!</li>
                    </ol>
                  </div>
                </div>
              </div>

            </div>
          </div>
          
        </div>
      </div>
    </div>
    </main>
    </>
  );

}

export default function RequestForTutor() {
  return (
    <Suspense fallback={<div>Loading form...</div>}>
      <RequestForTutorContent />
    </Suspense>
  );
}