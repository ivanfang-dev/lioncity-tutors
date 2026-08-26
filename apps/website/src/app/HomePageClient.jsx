'use client';
import { MATCH_HOURS, MATCH_TIME, TUTOR_COUNT_LABEL, TUTOR_COUNT_NUM } from '@/data/promises';
import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion, useReducedMotion } from "framer-motion";
import { DURATION, EASE_STANDARD, LIFT, PRESS, STAGGER, enter } from "@/lib/motion";
import Image from 'next/image';
import MatchTimelineSection from "@/components/MatchTimelineSection";
import { TuitionRequestSteps } from "@/components/FormSteps";
import FormStepper from "@/components/FormStepper";
import FormBenefits from "@/components/FormBenefits";
import TutorPopup from "@/components/TutorPopup";
import MobileCTABar from "@/components/MobileCTABar";
import useTuitionRequestForm from "@/components/useTuitionRequestForm";
import { Star, CheckCircle, Award, Users, Clock, Shield, Quote, TrendingUp, MapPin, Mail, FileText, BookOpen, ArrowRight } from "lucide-react";

// Lazy-loaded sections
import dynamic from 'next/dynamic';
import ReviewStrip from "@/components/ReviewStrip";
import { TestimonialsColumn } from "@/components/ui/testimonials-columns";
import SubjectSpotlightSection from "@/components/SubjectSpotlightSection";
import FloatingTrustBadge from "@/components/FloatingTrustBadge";
import ScrollProgress from "@/components/ScrollProgress";

// Loading spinner component
const LoadingSpinner = () => (
  <div className="section-padding flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

const SuccessStories = dynamic(
  () => import('@/components/SuccessStoriesSection'), 
  { 
    ssr: false,
    loading: () => <LoadingSpinner />
  }
);

// Remove lazy loading from FAQSection (import directly)
import FAQSection from '@/components/FAQSection';

const HowitWorksSection = dynamic(
  () => import('@/components/HowItWorksSection'),
  {
    ssr: false,
    loading: () => <LoadingSpinner />
  }
);

// Runs before paint on the client, but falls back to useEffect during SSR so React
// doesn't warn about useLayoutEffect on the server.
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

// The count-up starts from the FINAL value, not from zero: the server-rendered HTML
// (and any crawler or no-JS visitor) must show the real figure. The reset to 0 happens
// in a layout effect, before the browser paints, so the animation is still seen.
const Counter = ({ end, duration = DURATION.draw, suffix = "", decimals = 0 }) => {
  const [count, setCount] = useState(end);
  const prefersReducedMotion = useReducedMotion();

  useIsomorphicLayoutEffect(() => {
    if (prefersReducedMotion) {
      setCount(end);
      return;
    }
    setCount(0);
    let frame;
    let startTime = null;
    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
      const currentValue = progress * end;
      setCount(decimals > 0 ? Number(currentValue.toFixed(decimals)) : Math.floor(currentValue));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [end, duration, decimals, prefersReducedMotion]);

  // No entrance fade here: the figure is server-rendered at its real value, and an
  // `initial: { opacity: 0 }` would ship it invisible to anyone whose JS never runs.
  // The count-up is the animation.
  return <span className="tabular-nums">{count}{suffix}</span>;
};

export default function HomePageClient() {
  const router = useRouter();
  const formRef = useRef(null);
  const faqRef = useRef(null);
  const resourcesRef = useRef(null);
  const main = useRef(null);

  const scrollToResources = () => resourcesRef.current?.scrollIntoView({ behavior: 'smooth' });

  const form = useTuitionRequestForm();
  const { currentStep, status, handleSubmit, resetForm } = form;

  const scrollToForm = () => formRef.current?.scrollIntoView({ behavior: 'smooth' });
  const scrollToFAQ = () => faqRef.current?.scrollIntoView({ behavior: 'smooth' });
  const testimonials = [
    { initials: 'M.T', name: 'Molly Tan', relation: 'Parent of Primary 3 and Primary 5 Student', text: "Suggestion of tutor is good. Able to match my requirement and tutor is very responsible in meeting my children's needs.", subject: 'Primary Chinese', location: 'Pasir Panjang Road' },
    { initials: 'A', name: 'Mrs Amanda', relation: 'Parent of Primary 2 Student', text: "Found this agency from carousel! Met our amazing tutor Mr Junaith. It’s been an amazing month, and we’re so happy with the sessions that he conducted, very professional, very supportive teacher towards his students!", subject: 'Primary Maths', location: 'Tiong Bahru' },
    { initials: 'D.L', name: 'David L.', relation: 'Parent of Primary 6 Student', text: 'No fees for parents. Tutor helped my son move up 3 grades in 2 months.', subject: 'PSLE Math', location: 'Jurong West' },
    { initials: 'M', name: 'Mrs Madushani', relation: 'Parent of Secondary 3 Student', text: "Fast and fuss-free. Just filled in the form and someone got back within the hour. Helped me find a Sec 3 E Math and Chem tutor for my son. So far the tutor is very patient and reliable. Fee also reasonable.", subject: 'Secondary 3 Math & Chemistry', location: 'Woodlands' },
    { initials: 'J', name: 'Mrs Juanita ', relation: 'Parent of Primary 5 Student', text: 'Mr. Jin YT is a dedicated tutor who has the patience to guide my special needs son. My son understands and enjoys his teachings.', subject: 'Primary 1 Maths and Science', location: 'Yuan Ching Road' },
    { initials: 'K.A', name: 'Kaveesha Archana', relation: 'Parent of JC1 Student', text: 'Really glad I found LionCity Tutors. I’ve already recommended them to a few friends. As a working parent, I appreciated how easy and stress-free the entire process was — they listened to our needs and quickly found us a tutor who was a great fit for my daughter. The tutor was not only well-versed in the subject matter but also very encouraging and engaging.', subject: 'H2 Chemistry', location: 'Woodlands' },
    { initials: 'A', name: 'Mrs Athikashri ', relation: 'Parent of Secondary 1 Student', text: 'The agency was very efficient in helping me find a tutor quickly. Communication and arrangements were smooth, and the overall experience was pleasant and hassle-free.', subject: 'Secondary 1 Maths', location: 'Sengkang Central' },
    { initials: 'M.M', name: 'Mrs Mardiana ', relation: 'Parent of Primary 3 Student', text: 'The agency made alot of effort to ensure my expectations and preferred choice of tutoring style aligned to whom they chose for my daughter to do a trial lesson. Happy to say they made a right selection and my daughter learns while enjoying the lesson with the tutor.', subject: 'Primary 3 Maths', location: 'Serangoon Ave 2' },
    { initials: 'R.R', name: 'Mrs Rahman', relation: 'Parent of JC1', text: 'Great follow-up and tutor matched to learning style. Highly recommended.', subject: 'H2 Chemistry', location: 'Woodlands' }
  ];

  const prefersReducedMotion = useReducedMotion();

  // `hidden` is deliberately empty. The hero is the whole pitch and the LCP element,
  // and a populated hidden state ships the headline, both CTAs and the trust chips at
  // opacity 0 in the server HTML — blank until hydration, blank forever if JS fails.
  // Resting visible and expressing the entrance as keyframes keeps the movement while
  // guaranteeing the hero is readable the moment the HTML lands. Travel only, no fade:
  // a replayed opacity flash is far more noticeable than a replayed 16px slide.
  const fadeUp = { hidden: {}, visible: { y: [16, 0] } };
  const fadeUpTransition = { duration: DURATION.base, ease: EASE_STANDARD };

  const whatsappMessage = `Hi LionCity Tutors! I'd like help finding a tutor.

Student level:
Subject(s):
Location:
Rate/hr:
Preferred days & timing: `;
  const whatsappHref = `https://wa.me/6588701152?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <>
      <ScrollProgress />
      <main ref={main} className="bg-background-default text-text-default">
        <TutorPopup />
        <MobileCTABar
          onRequest={scrollToForm}
          formRef={formRef}
          whatsappHref={whatsappHref}
        />
        <FloatingTrustBadge onGetStarted={scrollToForm} />
        {/* Hero Section */}
        <section className="relative flex items-center bg-background-default px-4 sm:px-6 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-background-subtle/40 to-background-default pointer-events-none" />

          <div className="relative max-w-7xl mx-auto w-full py-16 sm:py-20 md:py-24">
            <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
              {/* Text Content */}
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  // Empty hidden state, same reason as `fadeUp`: this container wraps
                  // the entire hero copy block, so an opacity here blanks all of it.
                  hidden: {},
                  visible: { transition: { staggerChildren: STAGGER } },
                }}
                // Copy first on every width. The photo used to be `order-1` on
                // mobile, which put a 300px image between the navbar and the
                // headline: a parent opening the site on a phone saw a stock-ish
                // photo and had to scroll ~470px before reaching "The Right
                // Tutor. Matched in hours." — the entire pitch, and the first
                // CTA, below the fold. The two-column desktop layout is
                // unaffected; only the stacking order changed.
                className="text-center lg:text-left order-1"
              >
                <motion.p
                  variants={fadeUp}
                  transition={fadeUpTransition}
                  className="text-sm font-semibold tracking-[0.22em] uppercase text-primary mb-5"
                >
                  PSLE · O/N-Level · JC
                </motion.p>

                <motion.h1
                  variants={fadeUp}
                  transition={fadeUpTransition}
                  className="text-gray-900 leading-[0.98] mb-6"
                >
                  <span className="block">The <span className="text-primary">Right</span> Tutor.</span>
                  <span className="block">
                    Matched in{' '}
                    <span className="relative inline-block whitespace-nowrap">
                      hours
                      <svg
                        className="hero-underline absolute left-[-2%] -bottom-[0.18em] w-[104%] h-[0.5em] overflow-visible text-accent"
                        viewBox="0 0 200 18"
                        preserveAspectRatio="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M3 12 C 40 4, 80 4, 110 9 C 140 14, 170 8, 197 6"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="7"
                          strokeLinecap="round"
                        />
                      </svg>
                    </span>
                    .
                  </span>
                </motion.h1>

                <motion.p
                  variants={fadeUp}
                  transition={fadeUpTransition}
                  className="text-lg sm:text-xl text-gray-600 leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0"
                >
                  Vetted, MOE-familiar tutors matched by hand — {' '}
                  <span className="font-semibold text-gray-900">within {MATCH_TIME}</span>. And parents never pay an agency fee.
                </motion.p>

                <motion.div
                  variants={fadeUp}
                  transition={fadeUpTransition}
                  className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start mb-8"
                >
                  <motion.div
                    {...PRESS}
                    className="w-full sm:w-auto"
                  >
                    <Button
                      size="cta"
                      // Shorter padding on mobile; label stays 18.7px/700 for WCAG large-text contrast.
                      className="text-[18.7px] font-bold bg-accent-fill hover:bg-accent-fill-hover text-white rounded-full shadow-md hover:shadow-lg transition-all duration-200 w-full sm:w-auto px-6 py-3.5 sm:px-8 sm:py-5"
                      onClick={scrollToForm}
                    >
                      Request tutors
                    </Button>
                  </motion.div>

                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noreferrer"
                    className="group inline-flex items-center justify-center gap-2 w-full sm:w-auto border border-gray-300 hover:border-primary bg-white text-gray-600 hover:text-primary font-medium px-5 py-2.5 rounded-full text-sm shadow-sm hover:shadow transition-all duration-200"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-[#25D366]" aria-hidden="true">
                      <path d="M12 2a10 10 0 0 0-8.6 15.05L2 22l5.1-1.33A10 10 0 1 0 12 2Zm5.4 14.2c-.23.64-1.34 1.22-1.85 1.26-.5.05-.97.23-3.27-.68-2.76-1.09-4.5-3.9-4.64-4.08-.13-.18-1.1-1.46-1.1-2.79 0-1.32.7-1.97.94-2.24.24-.27.52-.34.7-.34l.5.01c.16 0 .38-.06.59.45.23.55.77 1.9.84 2.04.07.14.11.3.02.48-.09.18-.13.29-.27.45l-.4.46c-.13.13-.27.28-.12.54.15.27.66 1.09 1.42 1.76.97.87 1.79 1.13 2.05 1.26.27.14.42.11.58-.07.16-.18.66-.78.84-1.04.18-.27.36-.22.59-.13.23.09 1.48.7 1.74.82.27.13.44.2.5.31.07.11.07.64-.16 1.27Z" />
                    </svg>
                    <span>Or message us on WhatsApp</span>
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </a>
                </motion.div>

                <motion.div
                  variants={fadeUp}
                  transition={fadeUpTransition}
                  // The three proof points used to sit in one wrapping row
                  // separated by literal "|" spans. Below ~560px the row wraps
                  // and every separator strands itself at the end of its line —
                  // "4.8/5 on Google |" — which reads as a rendering fault on
                  // the single most trust-bearing element of the page. Below sm
                  // the chips stack and the separators are simply not there;
                  // from sm up, where the row provably fits on one line, they
                  // come back and do their job.
                  className="inline-flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-x-3 gap-y-2 max-w-full bg-white px-4 py-3 sm:py-2 rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 text-sm text-gray-600 justify-center lg:justify-start"
                >
                  <div className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 shrink-0 text-rating fill-current" aria-hidden="true" />
                    <span className="font-medium tabular-nums">4.8/5 on Google</span>
                  </div>
                  <span aria-hidden="true" className="hidden sm:inline text-gray-300">|</span>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 shrink-0 text-primary" aria-hidden="true" />
                    <span className="font-medium tabular-nums">100+ families matched</span>
                  </div>
                  <span aria-hidden="true" className="hidden sm:inline text-gray-300">|</span>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 shrink-0 text-primary" aria-hidden="true" />
                    <span className="font-medium tabular-nums">{TUTOR_COUNT_LABEL}</span>
                  </div>
                </motion.div>
              </motion.div>

              {/* Image */}
              <motion.div
                animate={prefersReducedMotion ? undefined : { scale: [0.97, 1] }}
                transition={{ duration: DURATION.base, delay: STAGGER * 2, ease: EASE_STANDARD }}
                className="relative h-[260px] sm:h-[400px] md:h-[450px] lg:h-[520px] rounded-2xl overflow-hidden shadow-xl order-2"
              >
                <Image
                  src="/final.webp"
                  alt="A dedicated tutor helping a student."
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </motion.div>
            </div>
          </div>
        </section>
        
        <ReviewStrip />
        
        {/* Stats */}
        <section className="py-16 sm:py-20 md:py-24 bg-background-default">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            {/* The wrapper no longer animates: the four cards stagger themselves,
                and moving the container too meant every stat travelled twice. */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {[
                { icon: TrendingUp, end: 100, suffix: "+", label: "Successful Matches", sub: "Last 3 months" },
                { icon: Users, end: TUTOR_COUNT_NUM, suffix: "+", label: "Qualified Tutors", sub: "Vetted professionals" },
                { icon: Clock, end: MATCH_HOURS, suffix: "h", label: "Response Time", sub: "Average match time" },
                { icon: Star, end: 4.8, suffix: "/5", label: "Client Rating", sub: "From happy parents", decimals: 1 }
              ].map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={i}
                    {...enter(i, prefersReducedMotion)}
                    whileHover={{ y: LIFT.card }}
                    className="relative bg-white p-5 sm:p-6 md:p-8 rounded-2xl shadow-sm hover:shadow-lg border border-gray-100 transition-all duration-300 overflow-hidden group text-center"
                  >
                    {/* Unified subtle gradient on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="relative z-10">
                      <div className="mb-3 sm:mb-4 flex justify-center">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/8 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                        </div>
                      </div>
                      <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-2 tracking-tight">
                        <Counter end={stat.end} suffix={stat.suffix} decimals={stat.decimals || 0} />
                      </div>
                      <p className="text-sm sm:text-base font-semibold text-gray-800 mb-0.5">{stat.label}</p>
                      <p className="text-xs sm:text-sm text-gray-500">{stat.sub}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        <HowitWorksSection formRef={formRef} />
        
        {/* Social Proof */}
        <section className="section-padding bg-background-subtle relative">
          <div className="max-w-7xl z-10 mx-auto px-4 sm:px-6">
            <motion.div
              {...enter(0, prefersReducedMotion)}
              className="text-center mb-10"
            >
              <h2 className="text-primary">
                Trusted by Parents Across Singapore
              </h2>
              <p className="mt-4 text-gray-600 text-lg max-w-xl mx-auto">
                Verified reviews from families who found success with our tutors.
              </p>
            </motion.div>

            {/* The mask fades the top and bottom of the column, so a 25% fade
                against a 740px window spent ~370px of a phone screen on text
                that is too faint to read. On mobile the window is shorter and
                the fade is tighter, which puts more legible reviews in the same
                scroll distance; the desktop composition is unchanged. */}
            <div className="flex justify-center gap-6 [mask-image:linear-gradient(to_bottom,transparent,black_12%,black_88%,transparent)] sm:[mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[560px] sm:max-h-[740px] overflow-hidden">
              <TestimonialsColumn testimonials={testimonials.slice(0, 3)} duration={30} />
              <TestimonialsColumn testimonials={testimonials.slice(3, 6)} className="hidden md:block" duration={31} />
              <TestimonialsColumn testimonials={testimonials.slice(6, 9)} className="hidden lg:block" duration={33} />
            </div>

            <div className="mt-10 text-center">
              <Button
                onClick={() => window.open('https://search.google.com/local/reviews?placeid=ChIJz5sczNYR2jERc_4Ka3tDwyY','_blank')}
                size="cta"
                className="bg-transparent text-primary border-2 border-primary hover:bg-primary hover:text-white font-semibold py-3 rounded-full shadow-sm hover:shadow-md transition-all text-base"
              >
                Read More Google Reviews
              </Button>
            </div>
          </div>
        </section>
        
        <section className="bg-primary/5 py-8 border-y border-primary/10">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-5 text-center md:text-left">
                <div className="flex flex-col md:flex-row items-center gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Award className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-primary">Studying for Exams?</h3>
                        <p className="text-gray-600 text-sm">Free access to top school exam papers and revision notes.</p>
                    </div>
                </div>
                <Button
                    className="bg-white text-primary font-semibold ring-1 ring-inset ring-primary/20 hover:bg-primary hover:text-white transition-all shadow-sm"
                    onClick={scrollToResources}
                >
                    View Free Resources
                </Button>
            </div>
        </section>
        
        <MatchTimelineSection />
        <SuccessStories />
        <SubjectSpotlightSection/>

    {/* --- Form Section with Corrected Props --- */}
    <section ref={formRef} className="section-padding form-section-gradient">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
  
      <motion.div
          className="form-card-container"
          {...enter(0, prefersReducedMotion)}
      >
        <h2 className="text-center text-primary mb-4">
            Ready to Find The Perfect Tutor?
        </h2>
        <p className="text-center text-gray-600 mb-10 text-lg">
            Get matched with qualified tutors in {MATCH_TIME}. Just fill out the details below.
        </p>
        
        {/* Benefits */}
        <FormBenefits />
            <div className="bg-background-card rounded-xl shadow-lg p-5 sm:p-8">
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
                        
                        {/* Make sure you pass the consolidated handleChange to all steps */}
                        <TuitionRequestSteps form={form} />
                    </form>
                )}
            </div>
            </motion.div>
            </div>
        </section>
        
        {/* Free Resources */}
        <section ref={resourcesRef} className="section-padding bg-background-default px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div
              {...enter(0, prefersReducedMotion)}
              className="text-center mb-12"
            >
              <h2 className="text-primary mb-4">
                Access Our Free Resources
              </h2>
              <p className="text-gray-600 mt-4 text-lg max-w-2xl mx-auto">
                Unlock your potential with our comprehensive collection of educational materials
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Free Test Papers */}
              <motion.div
                {...enter(0, prefersReducedMotion)}
                whileHover={{ y: LIFT.cardStrong }}
                className="group relative p-8 bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-100 overflow-hidden"
                onClick={() => router.push("/free-test-papers")}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/3 to-primary/8 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative z-10 mb-6">
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <FileText className="w-7 h-7 text-primary" />
                  </div>
                </div>

                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    Free Test Papers
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-5">
                    Download comprehensive past year papers for all academic levels and subjects.
                  </p>
                  <div className="flex items-center text-primary font-medium">
                    <span>Browse Papers</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>

              {/* Free Notes */}
              <motion.div
                {...enter(1, prefersReducedMotion)}
                whileHover={{ y: LIFT.cardStrong }}
                className="group relative p-8 bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-100 overflow-hidden"
                onClick={() => router.push("/free-notes")}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/3 to-primary/8 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative z-10 mb-6">
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <BookOpen className="w-7 h-7 text-primary" />
                  </div>
                </div>

                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    Free Notes
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-5">
                    Access concise, high-quality revision notes curated from top schools.
                  </p>
                  <div className="flex items-center text-primary font-medium">
                    <span>View Notes</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <div ref={faqRef}>
          <FAQSection />
        </div>

        {/* Final CTA Banner */}
        <section className="bg-gradient-to-r from-primary to-primary/90 text-white py-16 sm:py-20 px-4 sm:px-6 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="mb-4 text-white">
              Ready to Find the Perfect Tutor?
            </h2>
            {/* Full white: white/80 on this blue is 3.77:1 and 18px/400 does not
                 qualify as WCAG large text (that needs 24px, or 18.66px bold). */}
            <p className="mb-8 text-white text-lg">
              Get 3 qualified tutor profiles in {MATCH_TIME} — absolutely free.
            </p>
            <motion.div {...PRESS}>
              <Button
                size="cta"
                className="text-[18.7px] font-bold bg-accent-fill hover:bg-accent-fill-hover text-white px-10 rounded-full shadow-lg hover:shadow-xl transition-all"
                onClick={scrollToForm}
              >
                Request My Tutor Now
              </Button>
            </motion.div>
          </div>
        </section>
      </main>
    </>
  );
}