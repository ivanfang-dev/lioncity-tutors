"use client";

import { Button } from "@/components/ui/button";
import { TuitionRequestSteps } from "@/components/FormSteps";
import FormStepper from "@/components/FormStepper";
import useTuitionRequestForm from "@/components/useTuitionRequestForm";
import FormBenefits from "@/components/FormBenefits";
import { CheckCircle } from "lucide-react";

// The tutor request form for the level pages (primary, secondary, O/N-Level, JC) —
// the only interactive part, so those pages can stay server components.
export default function LevelRequestForm({ levelSubjects }) {
  const form = useTuitionRequestForm(levelSubjects ? { levelSubjects } : undefined);
  const { currentStep, status, handleSubmit, resetForm } = form;

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
            <TuitionRequestSteps form={form} />
          </form>
        )}
      </div>
    </>
  );
}
