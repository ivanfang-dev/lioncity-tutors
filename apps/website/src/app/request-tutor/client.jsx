"use client";

import { MATCH_TIME } from '@/data/promises';
import React, { Suspense, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { Info, CheckCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Step1, Step2, Step3 } from "@/components/FormSteps";
import FormStepper from "@/components/FormStepper";
import useTuitionRequestForm from "@/components/useTuitionRequestForm";
import { PREFILL_KEY } from "@/components/TutorPopup";

function RequestForTutorContent(){
  const searchParams = useSearchParams();
  const formRef = useRef(null);
  const {
    currentStep,
    formData,
    setFormData,
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
    genderPreference: 'No preference',
    bilingualRequired: 'No',
    preferences: ''
  });

  // Pre-fill name/mobile handed over from the exit-intent popup.
  //
  // sessionStorage is read first and cleared immediately: a name and phone number in
  // a query string would persist in browser history, leak in the referrer sent to any
  // third-party asset, and land in server access logs. The URL parameters are still
  // honoured so older links and bookmarks keep working, but nothing we build writes
  // them any more.
  useEffect(() => {
    let stored = null;
    try {
      const raw = sessionStorage.getItem(PREFILL_KEY);
      if (raw) {
        stored = JSON.parse(raw);
        sessionStorage.removeItem(PREFILL_KEY);
      }
    } catch {
      /* Unparseable or unavailable storage falls through to the URL parameters. */
    }

    const name = stored?.name || searchParams.get('name');
    const mobile = stored?.mobile || searchParams.get('mobile');
    if (name || mobile) {
      setFormData(prevData => ({
        ...prevData,
        name: name || prevData.name,
        mobile: mobile || prevData.mobile,
      }));
    }
  }, [searchParams, setFormData]);

  return (
    <>
    <main>
    <div className="bg-gray-50 min-h-screen">
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
                      <p className="text-sm text-gray-600">Tutor profiles within {MATCH_TIME}</p>
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

export default function RequestForTutorClient() {
  return (
    <Suspense fallback={<div>Loading form...</div>}>
      <RequestForTutorContent />
    </Suspense>
  );
}