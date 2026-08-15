import { MATCH_TIME } from '@/data/promises';
import React, { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { DURATION, EASE_STANDARD, LIFT, enter } from "@/lib/motion";
import { ChevronDown } from "lucide-react";

// SEO & Best Practice: FAQ data is kept separate. No changes needed here.
const faqs = [
  {
    question: "How much does it cost to request a tutor?",
    answer: "Our matching service is completely free! You only pay the tutor's rate directly to them after the lessons begin."
  },
  {
    question: "How quickly will I receive tutor profiles?",
    answer: `We typically send you tutor profiles within ${MATCH_TIME} of your request. Our team works 7 days a week to ensure fast matching.`
  },
  {
    question: "What qualifications do your tutors have?",
    answer: "Our tutors range from university undergraduates to MOE teachers. All tutors are carefully vetted and have proven academic excellence."
  },
  {
    question: "Can I try a lesson before committing?",
    answer: "Yes! We offer trial lessons so you can ensure the tutor is the right fit for your child before making a long-term commitment."
  }
];

// Best Practice: Individual FAQ item is its own component for clarity.
function FAQItem({ faq, isOpen, onClick }) {
  const itemVariants = {
    open: {
      opacity: 1,
      height: "auto",
      transition: { duration: DURATION.base, ease: EASE_STANDARD }
    },
    closed: {
      opacity: 0,
      height: 0,
      transition: { duration: DURATION.fast, ease: EASE_STANDARD }
    }
  };

  return (
    <motion.details
      className={`bg-white rounded-2xl sm:rounded-3xl shadow-md hover:shadow-lg overflow-hidden border transition-all duration-300 ${
        isOpen ? 'border-primary/50' : 'border-border/50'
      }`}
      open={isOpen}
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      whileHover={{ y: LIFT.card }}
      transition={{ duration: DURATION.fast, ease: EASE_STANDARD }}
    >
      <summary
        className="w-full flex justify-between items-start sm:items-center gap-4 p-5 sm:p-6 md:p-8 text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 group"
      >
        <h3 className="text-base sm:text-lg md:text-xl font-semibold text-primary group-hover:text-accent transition-colors duration-300 leading-snug">
          {faq.question}
        </h3>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: DURATION.fast, ease: EASE_STANDARD }}
          className="flex-shrink-0"
        >
          <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${
            isOpen ? 'bg-primary/10' : 'bg-background-subtle'
          }`}>
            <ChevronDown className={`w-5 h-5 transition-colors duration-300 ${
              isOpen ? 'text-primary' : 'text-text-default/60'
            }`} />
          </div>
        </motion.div>
      </summary>
      
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial="closed"
            animate="open"
            exit="closed"
            variants={itemVariants}
            className="px-5 sm:px-6 md:px-8 text-text-default/90"
          >
            <div className="pb-5 sm:pb-6 md:pb-8 pt-2 text-base sm:text-lg leading-relaxed border-t border-border/30">
              {faq.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.details>
  );
}


export default function FAQSection() {
  const prefersReducedMotion = useReducedMotion();
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // SEO: Generate JSON-LD structured data for Google Rich Results.
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <section className="py-20 md:py-32 px-4 sm:px-6 bg-background-subtle">
      {/* Add the schema script to the head of your document */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="max-w-4xl mx-auto">
        <motion.div
          {...enter(0, prefersReducedMotion)}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-primary mb-4 tracking-tight">
            Frequently Asked<br className="sm:hidden" /> Questions
          </h2>
          <p className="text-lg md:text-xl text-text-default/80 max-w-2xl mx-auto">
            Everything you need to know about our tuition matching service
          </p>
        </motion.div>
        <motion.div 
          className="space-y-3 sm:space-y-4"
          {...enter(0, prefersReducedMotion)}
        >
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              faq={faq}
              isOpen={openIndex === index}
              onClick={() => toggleFAQ(index)}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}