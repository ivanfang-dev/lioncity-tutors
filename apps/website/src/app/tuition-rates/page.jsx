"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Step1, Step2, Step3 } from "../../components/FormSteps";
import { CheckCircle, ArrowRight, Star, BrainCircuit, GraduationCap, Atom } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

// --- Validation Logic ---
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

// --- Main Page Component ---
export default function TuitionRatesPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const initialFormData = {
    name: '', mobile: '', level: '', location: '',
    lessonDuration: '1.5 Hours', customDuration: '',
    lessonFrequency: '1 Lesson/Week', customFrequency: '',
    preferredTime: '',
    tutorType: { partTime: true, fullTime: false, moeTeacher: false },
    budget: { type: 'marketRate', customAmount: '' },
    preferences: ''
  };
  const [formData, setFormData] = useState(initialFormData);
  const [status, setStatus] = useState({ submitting: false, submitted: false, error: null });
  const [errors, setErrors] = useState({});
  const formRef = useRef(null);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  // --- Form Handling Logic ---
  const nextStep = () => {
      const newErrors = validateStep(currentStep, formData);
      setErrors(newErrors);
      if (Object.keys(newErrors).length === 0) setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
      setErrors({});
      setCurrentStep(prev => prev - 1);
  };

  const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      const inputValue = type === 'checkbox' ? checked : value;
      if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
      if (name.includes('.')) {
          const [parent, child] = name.split('.');
          setFormData(prev => ({ ...prev, [parent]: { ...prev[parent], [child]: inputValue } }));
      } else {
          setFormData(prev => ({ ...prev, [name]: inputValue }));
      }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const allErrors = { ...validateStep(1, formData), ...validateStep(2, formData) };
    if (Object.keys(allErrors).length > 0) {
        setErrors(allErrors);
        if (allErrors.name || allErrors.mobile || allErrors.level) setCurrentStep(1);
        else if (allErrors.location) setCurrentStep(2);
        return;
    }
    setStatus({ submitting: true, submitted: false, error: null });
    try {
      const response = await fetch('https://tuition-backend-afud.onrender.com/api/requestfortutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setFormData(initialFormData);
        setCurrentStep(1);
        setStatus({ submitting: false, submitted: true, error: null });
        setTimeout(() => {
            formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      } else {
        const errorText = await response.text();
        throw new Error(errorText || 'Form submission failed');
      }
    } catch (error) {
      setStatus({ submitting: false, submitted: false, error: error.message || 'An unexpected error occurred.' });
    }
  };

  const rateData = [
    {
      level: "Primary School",
      description: "Building strong foundational skills for PSLE success.",
      icon: Atom,
      tutorTypes: [
        { name: "Undergraduate", price: "$25 - $40", details: "Bright minds from top universities." },
        { name: "Full-Time Tutor", price: "$40 - $60", details: "Experienced and dedicated educators." },
        { name: "MOE-Trained Teacher", price: "$60 - $80", details: "Certified experts in the curriculum." },
      ]
    },
    {
      level: "Secondary School",
      description: "Navigating O/N-Levels with targeted strategies.",
      icon: BrainCircuit,
      tutorTypes: [
        { name: "Undergraduate", price: "$35 - $50", details: "Specialized knowledge and relatable." },
        { name: "Full-Time Tutor", price: "$50 - $70", details: "Proven track records of success." },
        { name: "MOE-Trained Teacher", price: "$70 - $90", details: "In-depth syllabus understanding." },
      ]
    },
    {
      level: "Junior College",
      description: "Mastering the demanding A-Level curriculum.",
      icon: GraduationCap,
      tutorTypes: [
        { name: "Undergraduate", price: "$50 - $70", details: "High-achievers in specific subjects." },
        { name: "Full-Time Tutor", price: "$70 - $90", details: "Expert guidance for A-Level excellence." },
        { name: "MOE-Trained Teacher", price: "$90 - $120", details: "Premier instruction and insights." },
      ]
    },
     {
      level: "IB / University Prep",
      description: "Specialized support for IB, IP, and university pathways.",
      icon: Star,
      tutorTypes: [
        { name: "Undergraduate", price: "$50 - $70", details: "Familiar with the IB/IP structure." },
        { name: "Full-Time Tutor", price: "$70 - $90", details: "Experienced in holistic development." },
        { name: "MOE-Trained Teacher", price: "$90 - $120", details: "Top-tier, specialized instructors." },
      ]
    },
  ];

  const faqData = [
    { q: "Are there any hidden fees?", a: "None. Our service is 100% free for parents. The rates listed are the tutor's hourly fees. We believe in complete transparency." },
    { q: "How is the final rate determined?", a: "The final rate depends on the tutor's experience, qualifications, and your location. We confirm the exact rate with you before you commit." },
    { q: "Can I request a tutor within a budget?", a: "Absolutely. Our form allows you to specify your budget, and we'll find the best match who meets your academic and financial needs." },
    { q: "What's the difference between tutor types?", a: "Undergraduates are relatable high-achievers from top universities. Full-Time Tutors are experienced professionals. MOE-Trained Teachers have official training and deep curriculum insight." }
  ];

  return (
    <>
      <div className="bg-background-default text-text-default">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          {/* --- Hero Section --- */}
          <motion.div
            className="text-center mb-24 md:mb-32"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-8xl font-bold tracking-tighter mb-6 text-primary">
              Invest in Excellence.
            </h1>
            <p className="text-lg md:text-xl text-text-default/80 max-w-3xl mx-auto mb-10">
              Access Singapore's elite tutors with clear, competitive rates. We provide unparalleled value by connecting you with educators who deliver real results, all with zero agency fees.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={scrollToForm}
                className="bg-accent hover:opacity-90 text-text-inverse font-bold px-8 py-7 rounded-full shadow-lg text-lg group"
              >
                Request a Tutor <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          </motion.div>

          {/* --- Rates Grid Section --- */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-24 md:mb-32">
            {rateData.map((card, index) => (
              <motion.div
                key={card.level}
                className="bg-background-card p-8 rounded-2xl shadow-lg border border-border transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
              >
                <div className="flex items-center gap-4 mb-5">
                  <div className="bg-background-subtle p-3 rounded-xl border border-border">
                    <card.icon className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-primary">{card.level}</h3>
                    <p className="text-text-default/70 text-sm">{card.description}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {card.tutorTypes.map(tutor => (
                    <div key={tutor.name} className="flex justify-between items-center bg-background-subtle p-4 rounded-lg border border-border">
                      <div>
                        <p className="font-semibold text-text-default">{tutor.name}</p>
                        <p className="text-xs text-text-default/60">{tutor.details}</p>
                      </div>
                      <p className="font-bold text-lg text-primary tracking-wide whitespace-nowrap pl-4">{tutor.price}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* --- FAQ Section --- */}
          <div className="max-w-3xl mx-auto mb-24 md:mb-32">
            <h2 className="text-4xl md:text-5xl font-bold text-center tracking-tighter mb-12 text-primary">
                Answering Your Questions
            </h2>
            <Accordion type="single" collapsible className="w-full">
                {faqData.map((faq, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.8 }}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                    >
                        <AccordionItem value={`item-${i+1}`} className="border-border">
                            <AccordionTrigger className="text-left text-lg font-semibold hover:no-underline text-text-default py-6">
                                {faq.q}
                            </AccordionTrigger>
                            <AccordionContent className="text-text-default/80 text-base pb-6">
                                {faq.a}
                            </AccordionContent>
                        </AccordionItem>
                    </motion.div>
                ))}
            </Accordion>
          </div>

          {/* --- Form / CTA Section --- */}
          <section ref={formRef} className="form-section-gradient">
              <div className="max-w-4xl mx-auto px-6 py-16 sm:py-24">
                <motion.div
                  className="form-card-container"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  <h2 className="text-4xl font-bold text-center text-primary mb-4">
                      Ready to Find The Perfect Tutor?
                  </h2>
                  <p className="text-center text-text-default/80 mb-10 text-lg">
                      Get matched with qualified tutors in 24 hours. Just fill out the details below.
                  </p>
                  <div className="bg-background-card rounded-xl shadow-lg p-8 border border-border">
                    {status.submitted ? (
                      <div className="text-center py-10">
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
                          <CheckCircle className="text-green-500 w-20 h-20 mx-auto mb-4" />
                        </motion.div>
                        <h2 className="text-2xl font-semibold mb-2 text-primary">Thank You!</h2>
                        <p className="text-text-default/80 mb-6">We've received your request and will send tutor profiles shortly.</p>
                        <Button
                          className="bg-accent text-text-inverse hover:opacity-90"
                          onClick={() => setStatus({ submitting: false, submitted: false, error: null })}
                        >
                          Make Another Request
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
                              <span className="text-sm font-medium text-primary">Step {currentStep} of 3</span>
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
              </div>
          </section>
        </main>
      </div>
    </>
  );
}