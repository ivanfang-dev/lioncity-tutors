"use client";

import { Button } from "@/components/ui/button";
import { Step1, Step2, Step3 } from "@/components/FormSteps";
import FormStepper from "@/components/FormStepper";
import useTuitionRequestForm from "@/components/useTuitionRequestForm";
import FormBenefits from "@/components/FormBenefits";
import { CheckCircle } from "lucide-react";

/**
 * The request form, split out of page.jsx so the page itself can be a server
 * component. Everything above it on the page is static content that should be
 * server-rendered rather than shipped as JS — see the note in layout.jsx.
 */
export default function SecondaryTutorRequestForm() {
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
    resetForm,
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
    <>
      <FormBenefits />
      <div className="bg-white rounded-xl shadow-lg p-8">
        {status.submitted ? (
          <div className="text-center py-10">
            <CheckCircle className="text-primary w-16 h-16 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold mb-2 text-gray-900">Thank You!</h3>
            <p className="text-gray-600 mb-6">Our team will be in touch with suitable tutor profiles shortly via WhatsApp.</p>
            <Button
              onClick={resetForm}
              className="h-auto text-[18.7px] font-bold bg-accent-fill text-white px-6 py-2 rounded-full hover:bg-accent-fill-hover transition-colors"
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
    </>
  );
}
