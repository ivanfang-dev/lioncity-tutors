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
import { Star, CheckCircle, Award, Users, Clock, Shield, Quote, TrendingUp, MapPin, Phone, Mail } from "lucide-react";

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
        <section className="relative min-h-[85vh] sm:min-h-[90vh] flex items-center justify-center bg-background-default px-4 sm:px-6 overflow-hidden">
          {/* Subtle gradient background */}
          <div className="absolute inset-0 bg-gradient-to-b from-background-subtle/30 to-background-default pointer-events-none" />
          
          <div className="relative max-w-7xl mx-auto w-full py-12 sm:py-16 md:py-20">
            <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
              {/* Text Content */}
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.15,
                    },
                  },
                }}
                className="text-center lg:text-left order-2 lg:order-1"
              >
                <motion.h1
                  variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-primary leading-[1.1] tracking-tight mb-4 sm:mb-6"
                >
                  Find Your Perfect Tutor.
                  <span className="block text-text-default/80 mt-2">Zero Agency Fees.</span>
                </motion.h1>
                
                <motion.p
                  variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="text-lg sm:text-xl md:text-2xl text-text-default/80 leading-relaxed mb-6 sm:mb-8 max-w-2xl mx-auto lg:mx-0"
                >
                  Connect with top-rated, MOE-familiar tutors for PSLE, O-Level, and JC subjects. Get qualified profiles within 24 hours.
                </motion.p>

                <motion.div
                  variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 justify-center lg:justify-start mb-6 sm:mb-8"
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full sm:w-auto"
                  >
                    <Button
                      className="relative bg-accent hover:bg-accent/90 text-white font-semibold px-6 sm:px-8 py-4 sm:py-5 rounded-full text-base sm:text-lg shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto overflow-hidden group"
                      onClick={scrollToForm}
                    >
                      <span className="relative z-10">Get Started</span>
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-accent to-primary"
                        initial={{ x: '-100%' }}
                        whileHover={{ x: 0 }}
                        transition={{ duration: 0.3 }}
                      />
                    </Button>
                  </motion.div>
                  
                  <motion.a
                    href="https://wa.me/6588701152?text=Hi%20LionCity%20Tutors%2C%20I%27m%20looking%20for%20a%20tutor."
                    target="_blank"
                    rel="noreferrer"
                    whileHover={{ x: 5 }}
                    className="text-accent font-medium flex items-center gap-2 transition-all duration-300 text-base sm:text-lg w-full sm:w-auto justify-center group"
                  >
                    <Phone className="w-5 h-5" />
                    <span>Chat on WhatsApp</span>
                    <motion.svg 
                      className="w-5 h-5" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </motion.svg>
                  </motion.a>
                </motion.div>
                
                <motion.div
                  variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-wrap items-center gap-4 sm:gap-6 justify-center lg:justify-start text-sm sm:text-base"
                >
                  <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <span className="text-text-default font-medium">4.8/5 on Google</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-text-default/70">
                    <CheckCircle className="w-4 h-4 text-accent" />
                    <span>100+ families matched</span>
                  </div>
                </motion.div>
              </motion.div>

              {/* Image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] rounded-3xl overflow-hidden shadow-2xl order-1 lg:order-2"
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
        
        {/* Stats - Enhanced Mobile */}
        <section className="py-16 sm:py-20 md:py-24 bg-background-default">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true, amount: 0.2 }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8"
            >
              {[
                { icon: TrendingUp, end: 100, suffix: "+", label: "Successful Matches", sub: "Last 3 months", color: "from-blue-500/10 to-primary/10" },
                { icon: Users, end: 300, suffix: "+", label: "Qualified Tutors", sub: "Vetted professionals", color: "from-purple-500/10 to-accent/10" },
                { icon: Clock, end: 24, suffix: "h", label: "Response Time", sub: "Average match time", color: "from-green-500/10 to-primary/10" },
                { icon: Star, end: 4.8, suffix: "/5", label: "Client Rating", sub: "From happy parents", decimals: 1, color: "from-yellow-500/10 to-accent/10" }
              ].map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -4, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="relative bg-white p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl shadow-md hover:shadow-xl border border-border/50 transition-all duration-300 overflow-hidden group"
                  >
                    {/* Gradient background on hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                    
                    <div className="relative z-10 text-center">
                      <div className="mb-3 sm:mb-4 flex justify-center">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary group-hover:text-accent transition-colors duration-300" />
                        </div>
                      </div>
                      <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-2 sm:mb-3 tracking-tight">
                        <Counter end={stat.end} suffix={stat.suffix} decimals={stat.decimals || 0} />
                      </div>
                      <p className="text-sm sm:text-base md:text-lg font-semibold text-primary mb-1">{stat.label}</p>
                      <p className="text-xs sm:text-sm text-text-default/70">{stat.sub}</p>
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
          <div className="container z-10 mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true }}
              className="flex flex-col items-center justify-center max-w-[540px] mx-auto"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter -mt-10 text-center lg:whitespace-nowrap">
                Trusted by Parents Across Singapore
              </h2>
              <p className="text-center mt-5 opacity-75">
                Verified reviews from families who found success with our tutors.
              </p>
            </motion.div>

            <div className="flex justify-center gap-6 mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[740px] overflow-hidden">
              <TestimonialsColumn testimonials={testimonials.slice(0, 3)} duration={30} />
              <TestimonialsColumn testimonials={testimonials.slice(3, 6)} className="hidden md:block" duration={31} />
              <TestimonialsColumn testimonials={testimonials.slice(6, 9)} className="hidden lg:block" duration={33} />
            </div>

            <div className="mt-12 text-center">
              <Button
                onClick={() => window.open('https://search.google.com/local/reviews?placeid=ChIJz5sczNYR2jERc_4Ka3tDwyY','_blank')}
                className="bg-transparent text-primary border-2 border-primary hover:bg-primary hover:text-text-inverse font-semibold px-8 py-3 rounded-xl shadow-md text-base"
              >
                Read More Google Reviews
              </Button>
            </div>
          </div>
        </section>
        
        <section className="bg-primary/10 py-8">
            <div className="max-w-4xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between text-center md:text-left">
                <div className="flex items-center">
                    <span className="text-3xl mr-4">📚</span>
                    <div>
                        <h3 className="font-bold text-lg text-primary">Studying for Exams?</h3>
                        <p className="text-primary/80">We offer free access to top school exam papers and revision notes.</p>
                    </div>
                </div>
                <Button 
                    className="bg-background-card text-primary font-semibold mt-4 md:mt-0 ring-1 ring-inset ring-border hover:bg-primary/10"
                    onClick={scrollToResources}
                >
                    Show Me The Resources
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
        <p className="text-center text-text-default/80 mb-10 text-lg">
            Get matched with qualified tutors in 24 hours. Just fill out the details below.
        </p>
        
        {/* The existing benefits icons */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-8 mb-8">
            <div className="flex items-center text-emerald-600">
                <span className="text-2xl mr-2">✅</span>
                <span className="font-medium">Matched within 24 hours</span>
            </div>
            <div className="flex items-center text-emerald-600">
                <span className="text-2xl mr-2">✅</span>
                <span className="font-medium">No hidden fees, ever</span>
            </div>
        </div>
            <div className="bg-background-card rounded-xl shadow-lg p-8">
                {status.submitted ? (
                    <div className="text-center py-10">
                        <CheckCircle className="text-green-500 w-16 h-16 mx-auto mb-4" />
                        <h2 className="text-2xl font-semibold mb-2">Thank you!</h2>
                        <p className="text-text-default/80 mb-4">Our team will be in touch with suitable tutor profiles shortly via WhatsApp.</p>
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
                                <div className="bg-primary h-2 rounded-full transition-all duration-500" style={{ width: `${((currentStep - 1) / 2) * 100}%` }} />
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
        
        {/* Enhanced Quick Links Section */}

          <section ref={resourcesRef} className="section-padding relative overflow-hidden bg-background-default px-4 sm:px-6">
           {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-10 left-10 w-20 h-20 bg-blue-600 rounded-full blur-xl"></div>
            <div className="absolute top-32 right-20 w-16 h-16 bg-purple-500 rounded-full blur-lg"></div>
            <div className="absolute bottom-20 left-1/3 w-24 h-24 bg-pink-500 rounded-full blur-xl"></div>
          </div>

          <div className="relative max-w-6xl mx-auto">
            {/* Section Header */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                Access Our Free Resources
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 mx-auto rounded-full"></div>
              <p className="text-slate-600 mt-4 text-lg max-w-2xl mx-auto">
                Unlock your potential with our comprehensive collection of educational materials
              </p>
            </motion.div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

              {/* Free Test Papers */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative p-8 bg-background-card rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border border-border overflow-hidden"
                onClick={() => router.push("/free-test-papers")}
              >
                {/* Card Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-white to-amber-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Icon Container */}
                <div className="relative z-10 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl">📊</span>
                  </div>
                </div>

                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-amber-800 mb-3 group-hover:text-amber-900 transition-colors">
                    Free Test Papers
                  </h3>
                  <p className="text-amber-700/80 leading-relaxed mb-4">
                    Download comprehensive past year papers for all academic levels and subjects.
                  </p>
                  <div className="flex items-center text-amber-600 font-medium group-hover:text-amber-700 transition-colors">
                    <span>Browse Papers</span>
                    <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>

                {/* Hover Effect Border */}
              <div className="absolute inset-0 rounded-2xl border-2 border-amber-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </motion.div>

              {/* Free Notes */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative p-8 bg-background-card rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border border-border overflow-hidden"
                onClick={() => router.push("/free-notes")}
              >
                {/* Card Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Icon Container */}
                <div className="relative z-10 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl">📚</span>
                  </div>
                </div>

                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-blue-800 mb-3 group-hover:text-blue-900 transition-colors">
                    Free Notes
                  </h3>
                  <p className="text-blue-700/80 leading-relaxed mb-4">
                    Access concise, high-quality revision notes curated from top schools.
                  </p>
                  <div className="flex items-center text-blue-600 font-medium group-hover:text-blue-700 transition-colors">
                    <span>View Notes</span>
                    <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>

                {/* Hover Effect Border */}
                <div className="absolute inset-0 rounded-2xl border-2 border-blue-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </motion.div>
            </div>
            
          </div>
        </section>

        {/* FAQ */}
        <div ref={faqRef}>
          <FAQSection />
        </div>

        {/* Final CTA Banner */}
        <section className="bg-primary text-text-inverse py-10 px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-text-inverse">Ready to Find the Perfect Tutor?</h2>
          <p className="mb-6">Get 3 qualified tutor profiles in 24 hours – absolutely free.</p>
          <Button 
            className="bg-accent text-text-inverse font-bold px-8 py-3 hover:bg-accent/90 transition-colors" 
            onClick={scrollToForm}
          >
            Request My Tutor Now
          </Button>
        </section>
      </main>
    </>
  );
}