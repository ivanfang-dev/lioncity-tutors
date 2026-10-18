import { MATCH_TIME } from '@/data/promises';
import React, { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { DURATION, EASE_STANDARD, enter } from "@/lib/motion";
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
    <details className="group/faq" open={isOpen}>
      {/* The toggle handler belongs on the <summary>, not on the <details>.
          On the parent it also caught every click that bubbled up from the
          ANSWER, so on a phone — where selecting text means touching the
          paragraph — reading an answer collapsed it. `preventDefault` still
          suppresses the native toggle so React stays the single source of
          truth for `open`. */}
      <summary
        onClick={(e) => {
          e.preventDefault();
          onClick();
        }}
        className="flex w-full cursor-pointer list-none items-start justify-between gap-4 py-5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 [&::-webkit-details-marker]:hidden group"
      >
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 group-hover:text-primary-deep transition-colors duration-200 leading-snug">
          {faq.question}
        </h3>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: DURATION.fast, ease: EASE_STANDARD }}
          className="flex-shrink-0"
        >
          <ChevronDown className={`mt-0.5 h-5 w-5 transition-colors duration-200 ${isOpen ? 'text-primary' : 'text-gray-400'}`} aria-hidden="true" />
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
            className="overflow-hidden text-gray-600"
          >
            <div className="max-w-2xl pb-6 leading-relaxed text-pretty">
              {faq.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </details>
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
    <section className="section-padding bg-background-subtle">
      {/* Add the schema script to the head of your document */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <h2 className="text-balance text-gray-900">Questions parents ask</h2>
          <p className="mt-4 text-lg leading-relaxed text-gray-600 text-pretty">
            Anything else? Message us on WhatsApp and a person replies.
          </p>
        </div>
        <motion.div
          className="divide-y divide-gray-300 border-y border-gray-300 lg:col-span-8"
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