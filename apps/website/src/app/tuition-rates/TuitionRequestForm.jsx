"use client";

import { MATCH_TIME } from '@/data/promises';
import React from "react";
import { motion } from "framer-motion";
import { enter } from "@/lib/motion";
import { Button } from "@/components/ui/button";
import { TuitionRequestSteps } from "../../components/FormSteps";
import FormStepper from "../../components/FormStepper";
import useTuitionRequestForm from "../../components/useTuitionRequestForm";
import { CheckCircle } from "lucide-react";

/**
 * The request-a-tutor form at the foot of /tuition-rates.
 *
 * The interactive half of the page. Everything above it — the rate tables,
 * the answer blocks and the FAQ — is server-rendered in page.jsx so the
 * figures are in the HTML without waiting for JavaScript.
 */
export default function TuitionRequestForm() {
  const form = useTuitionRequestForm();
  const { currentStep, status, handleSubmit, resetForm } = form;

  return (
    <section id="request" className="form-section-gradient scroll-mt-24">
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
          <div className="bg-background-card rounded-xl shadow-lg p-8 border border-border">
            {status.submitted ? (
              <div className="text-center py-10">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
                  <CheckCircle className="text-green-500 w-20 h-20 mx-auto mb-4" />
                </motion.div>
                <h2 className="section-title text-primary mb-2">Thank You!</h2>
                <p className="text-text-default/80 mb-6">We&apos;ve received your request and will send tutor profiles shortly.</p>
                <Button
                  className="bg-accent-fill text-text-inverse hover:bg-accent-fill-hover"
                  onClick={resetForm}
                >
                  Make Another Request
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
