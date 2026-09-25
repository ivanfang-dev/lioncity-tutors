"use client";

import { MATCH_TIME } from '@/data/promises';
import { motion } from "framer-motion";
import { enter } from "@/lib/motion";
import { Button } from "@/components/ui/button";
import { TuitionRequestSteps } from "@/components/FormSteps";
import FormStepper from "@/components/FormStepper";
import useTuitionRequestForm from "@/components/useTuitionRequestForm";
import FormBenefits from "@/components/FormBenefits";
import { CheckCircle } from "lucide-react";

// The tutor request form at the foot of a subject guide — the only interactive part,
// so the guide page itself can stay a server component.
export default function GuideRequestForm({ levelSubjects }) {
  const form = useTuitionRequestForm({ levelSubjects });
  const { currentStep, status, handleSubmit, resetForm } = form;

  return (
    <section className="form-section-gradient">
      <div className="max-w-4xl mx-auto px-6 py-16 sm:py-24">
        <motion.div
          className="form-card-container"
          {...enter()}
        >
          <h2 className="section-title text-primary text-center mb-4">
            Ready to Find The Perfect Tutor?
          </h2>
          <p className="text-center text-text-default/80 mb-10 text-lg">
            Get matched with qualified tutors in {MATCH_TIME}. Just fill out the details below.
          </p>

          <FormBenefits />
          <div className="bg-background-card rounded-xl shadow-lg p-8">
            {status.submitted ? (
              <div className="text-center py-10">
                <CheckCircle className="text-primary w-16 h-16 mx-auto mb-4" />
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">Thank you!</h2>
                <p className="text-gray-600 mb-4">Our team will be in touch with suitable tutor profiles shortly via WhatsApp.</p>
                <Button
                  className="bg-accent-fill text-text-inverse hover:bg-accent-fill-hover"
                  onClick={resetForm}
                >
                  Submit Another Request
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <FormStepper currentStep={currentStep} />
                {status.error && <div className="bg-red-100 text-red-800 p-4 rounded-md mb-6">{status.error}</div>}

                <TuitionRequestSteps form={form} />
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
