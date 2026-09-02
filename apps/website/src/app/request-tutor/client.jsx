"use client";

import { MATCH_TIME } from '@/data/promises';
import React, { Suspense, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { Check, Info, CheckCircle, Loader2 } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { DURATION, EASE_STANDARD } from "@/lib/motion";
import { Button } from "@/components/ui/button";
import { TuitionRequestSteps } from "@/components/FormSteps";
import FormStepper from "@/components/FormStepper";
import useTuitionRequestForm from "@/components/useTuitionRequestForm";
import { PREFILL_KEY } from "@/components/TutorPopup";

function RequestForTutorContent(){
  const searchParams = useSearchParams();
  const formRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  const form = useTuitionRequestForm();
  const { currentStep, status, handleSubmit, resetForm, setFormData } = form;

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
    {/* `min-h-dvh`, not `min-h-screen`: `100vh` on mobile Safari is the tall
        layout viewport measured with the address bar collapsed, so a
        `min-h-screen` panel always overshoots the real screen by ~60-100px and
        introduces a stretch of dead scroll below the content. */}
    <div className="bg-gray-50 min-h-dvh">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          
          {/* Left Column: Form */}
          <div className="lg:col-span-2">
            <section ref={formRef} className="form-section-gradient">
                {/* Rests VISIBLE and expresses the entrance as keyframes.
                    `initial={{opacity:0}}` is server-rendered as an inline style,
                    so the entire form shipped invisible and stayed that way
                    until framer-motion's observer fired. On a 390px viewport
                    this reproduced every time: the card measured opacity 0.103
                    two seconds after load — the primary conversion form on the
                    page whose only job is that form, effectively blank, with the
                    visitor given nothing to blame. `amount: 0.3` made it worse
                    by demanding 30% of a very tall card be on screen at once.
                    See DESIGN.md § Motion, "Never ship a hidden start state". */}
                <motion.div
                    className="form-card-container"
                    initial={{ opacity: 1, y: 0 }}
                    animate={prefersReducedMotion ? undefined : { y: [16, 0] }}
                    transition={{ duration: DURATION.base, ease: EASE_STANDARD }}
                >
                    <div className="bg-background-card rounded-xl shadow-lg p-5 sm:p-8">
                        {status.submitted ? (
                            <div className="text-center py-10">
                                <CheckCircle className="text-green-500 w-16 h-16 mx-auto mb-4" />
                                <h2 className="section-title text-primary mb-2">Thank you!</h2>
                                <p className="text-text-default/80 mb-4">We'll send you tutor profiles shortly.</p>
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
            </section>
          </div>

          {/* Right Column: Trust Indicators & Info.
              `top-24` clears the sticky navbar — at `top-8` this column slid
              under it on desktop. On mobile the grid collapses and it simply
              follows the form, which is the right order on a page whose one job
              is the form. */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24 space-y-4 sm:space-y-6">

              {/* Trust Indicators */}
              <div className="bg-white rounded-xl shadow-lg p-5 sm:p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Why Choose Us?</h3>
                <div className="space-y-4">
                  {[
                    { title: '100+ Successful Matches', body: 'Helped over 100 students find qualified tutors' },
                    { title: '100% Free Service', body: 'No hidden fees or charges' },
                    { title: 'Fast Response', body: `Tutor profiles within ${MATCH_TIME}` },
                  ].map(({ title, body }) => (
                    <div key={title} className="flex items-start gap-3">
                      {/* A drawn icon at a consistent stroke, not a "✓" text
                          glyph — the glyph rendered at a different weight and
                          baseline on every platform and could not be aligned. */}
                      <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary/10" aria-hidden="true">
                        <Check className="h-3 w-3 text-primary" strokeWidth={2.5} />
                      </span>
                      <div>
                        <h4 className="font-semibold text-primary">{title}</h4>
                        <p className="text-sm text-text-secondary">{body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Info. Tokens throughout — the stock `blue-50/600/700/800`
                  ramp is a different blue from Harbour Blue and read as a second,
                  unowned brand colour sitting next to the real one. */}
              <div className="bg-primary/5 border border-primary/10 rounded-xl p-5 sm:p-6">
                <div className="flex items-start gap-3">
                  <Info className="text-primary mt-0.5 flex-shrink-0" size={20} aria-hidden="true" />
                  <div>
                    <h4 className="font-semibold text-primary-deep mb-2">How It Works</h4>
                    <ol className="text-sm text-text-secondary space-y-1 list-decimal pl-4 marker:text-primary marker:font-semibold">
                      <li>Fill out this form</li>
                      <li>We match you with suitable tutors</li>
                      <li>Review tutor profiles &amp; choose</li>
                      <li>Start learning</li>
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
    <Suspense
      fallback={
        // Reserves roughly the form's height so the page does not jolt when the
        // real card replaces it, instead of collapsing to one line of raw text.
        <div className="bg-gray-50 min-h-dvh">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            <div className="h-[640px] rounded-xl bg-white shadow-lg animate-pulse" />
          </div>
        </div>
      }
    >
      <RequestForTutorContent />
    </Suspense>
  );
}