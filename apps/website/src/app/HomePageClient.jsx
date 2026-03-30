'use client';
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion, useScroll, useTransform, useAnimation } from "framer-motion";
import Image from 'next/image';
import UniqueFeaturesSection from "@/components/UniqueFeaturesSection";
import { Step1, Step2, Step3 } from "@/components/FormSteps";
import TutorPopup from "@/components/TutorPopup";
import useTuitionRequestForm from "@/components/useTuitionRequestForm";
import { Star, CheckCircle, Award, Users, Clock, Shield, Quote, TrendingUp, MapPin, Phone, Mail, FileText, BookOpen, ArrowRight } from "lucide-react";

// Lazy-loaded sections
import dynamic from 'next/dynamic';
import ReviewStrip from "@/components/ReviewStrip";
import { TestimonialsColumn } from "@/components/ui/testimonials-columns";
import SubjectSpotlightSection from "@/components/SubjectSpotlightSection";
import FloatingTrustBadge from "@/components/FloatingTrustBadge";
import ScrollProgress from "@/components/ScrollProgress";
import BackToTop from "@/components/BackToTop";

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

const Counter = ({ end, duration = 2.5, suffix = "", decimals = 0 }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let startTime = null;
    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
      const currentValue = progress * end;
      setCount(decimals > 0 ? Number(currentValue.toFixed(decimals)) : Math.floor(currentValue));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [end, duration, decimals]);
  return <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{count}{suffix}</motion.span>;
};


export default function HomePageClient() {
  const router = useRouter();
  const formRef = useRef(null);
  const faqRef = useRef(null);
  const resourcesRef = useRef(null);
  const main = useRef(null);

  const scrollToResources = () => resourcesRef.current?.scrollIntoView({ behavior: 'smooth' });

  const {
    currentStep,
    formData,
    errors,
    status,
    nextStep,
    prevStep,
    handleChange,
    handleSubmit,
    resetForm
  } = useTuitionRequestForm({
      name: '', mobile: '', level: '', location: '',
      lessonDuration: '1.5 Hours', customDuration: '',
      lessonFrequency: '1 Lesson/Week', customFrequency: '',
      preferredTime: '',
      tutorType: { partTime: true, fullTime: false, moeTeacher: false },
      budget: { type: 'marketRate', customAmount: '' },
      preferences: ''
  });

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

  return (
    <>
      <ScrollProgress />
      <BackToTop />
      <main ref={main} className="bg-background-default text-text-default">
        <TutorPopup />
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
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: { staggerChildren: 0.12 },
                  },
                }}
                className="text-center lg:text-left order-2 lg:order-1"
              >
                <motion.h1
                  variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-primary leading-[1.1] tracking-tight mb-4 sm:mb-6"
                >
                  Find Your Perfect Tutor.
                  <span className="block text-gray-600 mt-2">Zero Agency Fees.</span>
                </motion.h1>

                <motion.p
                  variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="text-lg sm:text-xl text-gray-600 leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0"
                >
                  Connect with top-rated, MOE-familiar tutors for PSLE, O-Level, and JC subjects. Get qualified profiles within 24 hours.
                </motion.p>

                <motion.div
                  variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start mb-8"
                >
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full sm:w-auto"
                  >
                    <Button
                      className="bg-[#F17720] hover:bg-[#d9691c] text-white font-semibold px-8 py-5 rounded-full text-base sm:text-lg shadow-md hover:shadow-lg transition-all duration-200 w-full sm:w-auto"
                      onClick={scrollToForm}
                    >
                      Get Started Free
                    </Button>
                  </motion.div>

                  <a
                    href="https://wa.me/6588701152?text=Hi%20LionCity%20Tutors%2C%20I%27m%20looking%20for%20a%20tutor."
                    target="_blank"
                    rel="noreferrer"
                    className="text-gray-600 hover:text-primary font-medium flex items-center gap-2 transition-colors text-base w-full sm:w-auto justify-center"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Or chat on WhatsApp</span>
                  </a>
                </motion.div>

                <motion.div
                  variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="inline-flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100 text-sm text-gray-600 justify-center lg:justify-start"
                >
                  <div className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-amber-400 fill-current" />
                    <span className="font-medium">4.8/5 on Google</span>
                  </div>
                  <span className="text-gray-300">|</span>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    <span className="font-medium">100+ families matched</span>
                  </div>
                </motion.div>
              </motion.div>

              {/* Image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="relative h-[300px] sm:h-[400px] md:h-[450px] lg:h-[520px] rounded-2xl overflow-hidden shadow-xl order-1 lg:order-2"
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
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true, amount: 0.2 }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8"
            >
              {[
                { icon: TrendingUp, end: 100, suffix: "+", label: "Successful Matches", sub: "Last 3 months" },
                { icon: Users, end: 300, suffix: "+", label: "Qualified Tutors", sub: "Vetted professionals" },
                { icon: Clock, end: 24, suffix: "h", label: "Response Time", sub: "Average match time" },
                { icon: Star, end: 4.8, suffix: "/5", label: "Client Rating", sub: "From happy parents", decimals: 1 }
              ].map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -4 }}
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
            </motion.div>
          </div>
        </section>

        <HowitWorksSection formRef={formRef} />
        
        {/* Social Proof */}
        <section className="section-padding bg-background-subtle relative">
          <div className="max-w-7xl z-10 mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true }}
              className="text-center mb-10"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-primary">
                Trusted by Parents Across Singapore
              </h2>
              <p className="mt-4 text-gray-600 text-lg max-w-xl mx-auto">
                Verified reviews from families who found success with our tutors.
              </p>
            </motion.div>

            <div className="flex justify-center gap-6 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[740px] overflow-hidden">
              <TestimonialsColumn testimonials={testimonials.slice(0, 3)} duration={30} />
              <TestimonialsColumn testimonials={testimonials.slice(3, 6)} className="hidden md:block" duration={31} />
              <TestimonialsColumn testimonials={testimonials.slice(6, 9)} className="hidden lg:block" duration={33} />
            </div>

            <div className="mt-10 text-center">
              <Button
                onClick={() => window.open('https://search.google.com/local/reviews?placeid=ChIJz5sczNYR2jERc_4Ka3tDwyY','_blank')}
                className="bg-transparent text-primary border-2 border-primary hover:bg-primary hover:text-white font-semibold px-8 py-3 rounded-full shadow-sm hover:shadow-md transition-all text-base"
              >
                Read More Google Reviews
              </Button>
            </div>
          </div>
        </section>
        
        <section className="bg-primary/5 py-8 border-y border-primary/10">
            <div className="max-w-4xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
                <div className="flex items-center gap-4">
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
        
        <UniqueFeaturesSection />
        <SuccessStories />
        <SubjectSpotlightSection/>

    {/* --- Form Section with Corrected Props --- */}
    <section ref={formRef} className="section-padding form-section-gradient"> 
      <div className="max-w-4xl mx-auto px-6"> 
  
      <motion.div
          className="form-card-container"
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.3 }}
      >
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-primary mb-4">
            Ready to Find The Perfect Tutor?
        </h2>
        <p className="text-center text-gray-600 mb-10 text-lg">
            Get matched with qualified tutors in 24 hours. Just fill out the details below.
        </p>
        
        {/* Benefits */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-8 mb-8">
            <div className="flex items-center gap-2 text-gray-600">
                <CheckCircle className="w-4 h-4 text-primary" />
                <span className="font-medium text-sm">Matched within 24 hours</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
                <CheckCircle className="w-4 h-4 text-primary" />
                <span className="font-medium text-sm">No hidden fees, ever</span>
            </div>
        </div>
            <div className="bg-background-card rounded-xl shadow-lg p-8">
                {status.submitted ? (
                    <div className="text-center py-10">
                        <CheckCircle className="text-primary w-16 h-16 mx-auto mb-4" />
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Thank you!</h2>
                        <p className="text-gray-600 mb-4">Our team will be in touch with suitable tutor profiles shortly via WhatsApp.</p>
                        <Button 
                            className="bg-accent text-text-inverse hover:bg-accent/90" 
                            onClick={resetForm}
                        >
                            Submit Another Request
                        </Button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="mb-8">
                            {/* Desktop: Text labels */}
                            <div className="hidden sm:flex justify-between mb-1">
                                {["Your Details", "Lesson Details", "Tutor Preferences"].map((step, i) => (
                                    <span key={i} className={`text-sm font-medium ${currentStep >= i + 1 ? 'text-primary' : 'text-gray-400'}`}>{step}</span>
                                ))}
                            </div>
                            
                            {/* Mobile: Numbered circles */}
                            <div className="flex sm:hidden justify-between px-4 mb-4">
                                {[1, 2, 3].map((num) => (
                                    <div key={num} className="flex flex-col items-center gap-1">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                                            currentStep >= num ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
                                        }`}>
                                            {num}
                                        </div>
                                        <span className="text-xs text-gray-500">Step {num}</span>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-primary h-2 rounded-full transition-all duration-500" style={{ width: `${(currentStep / 3) * 100}%` }} />
                            </div>
                        </div>
                        {status.error && <div className="bg-red-100 text-red-800 p-4 rounded-md mb-6">{status.error}</div>}
                        
                        {/* Make sure you pass the consolidated handleChange to all steps */}
                        {currentStep === 1 && <Step1 nextStep={nextStep} formData={formData} handleChange={handleChange} errors={errors} />}
                        {currentStep === 2 && <Step2 nextStep={nextStep} prevStep={prevStep} formData={formData} handleChange={handleChange} errors={errors} />}
                        {currentStep === 3 && <Step3 prevStep={prevStep} formData={formData} handleChange={handleChange} handleCheckboxChange={handleChange} status={status} errors={errors} />}
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
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                Access Our Free Resources
              </h2>
              <p className="text-gray-600 mt-4 text-lg max-w-2xl mx-auto">
                Unlock your potential with our comprehensive collection of educational materials
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Free Test Papers */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -6 }}
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
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -6 }}
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
        <section className="bg-gradient-to-r from-primary to-primary/90 text-white py-16 sm:py-20 px-6 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-white">
              Ready to Find the Perfect Tutor?
            </h2>
            <p className="mb-8 text-white/80 text-lg">
              Get 3 qualified tutor profiles in 24 hours — absolutely free.
            </p>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button
                className="bg-[#F17720] hover:bg-[#d9691c] text-white font-bold px-10 py-4 rounded-full text-lg shadow-lg hover:shadow-xl transition-all"
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