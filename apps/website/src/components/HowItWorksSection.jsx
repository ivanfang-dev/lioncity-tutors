'use client';

import { MATCH_TIME } from '@/data/promises';
import React, { useRef } from 'react';
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import Image from 'next/image';

// Register GSAP plugins only on the client side
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

export default function HowItWorksSection({ formRef }) {
  const containerRef = useRef(null);

  const steps = [
    { 
      number: "01", 
      title: "Submit Your Request", 
      description: "Tell us exactly what you need—subject, level, location, and your goals. Our simple form takes less than three minutes to complete.", 
      highlight: {
        before: "Tell us exactly what you need—",
        text: "subject, level, location. ",
        after: "Our simple form takes less than three minutes to complete."
      },
      bgColor: "bg-slate-100", 
      textColor: "text-white",
      accentColor: "text-white",
      image: '/combined-chemistry-biology.webp',
      bgOverlay: "bg-black/40"
    },
    { 
      number: "02", 
      title: "Receive Curated Profiles", 
      description: `Within ${MATCH_TIME}, we send you a shortlist of 2-3 highly qualified tutors whose experience and teaching style are a perfect match.`, 
      highlight: {
        before: `Within ${MATCH_TIME}, we send you a shortlist of 2-3 `,
        text: "highly qualified tutors",
        after: " whose experience and teaching style are a perfect match."
      },
      bgColor: "bg-primary", 
      textColor: "text-white", 
      accentColor: "text-white",
      image: '/jc-tuition_optimized.webp',
      bgOverlay: "bg-black/40"
    },
    { 
      number: "03", 
      title: "Start Learning", 
      description: "Choose the tutor you're most confident in and schedule your first lesson. We handle all the coordination, and our service is always free for you.",
      highlight: {
        before: "Choose the tutor you're most confident in and schedule your first lesson. We handle all the coordination, and our service is ",
        text: "always free for you.",
        after: ""
      }, 
      bgColor: "bg-[#FF6B00]", 
      textColor: "text-white", 
      accentColor: "text-white",
      image: '/english-tuition.webp',
      bgOverlay: "bg-black/50"
    }
  ];

  useGSAP(() => {
    const panels = gsap.utils.toArray('.panel');
    if (panels.length <= 1) return;

    ScrollTrigger.matchMedia({
      "(min-width: 768px) and (prefers-reduced-motion: no-preference)": function() {
        const horizontalAnimation = gsap.to(panels, {
          xPercent: -100 * (panels.length - 1),
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            pin: true,
            scrub: 0.5, 
            snap: 1 / (panels.length - 1),
            end: () => "+=" + (containerRef.current.offsetWidth * (panels.length - 1)),
            invalidateOnRefresh: true, 
          }
        });

        panels.forEach((panel, i) => {
          const title = panel.querySelector(".step-title");
          const description = panel.querySelector(".step-description");

          // ✨ NEW LOGIC: Animate the first panel based on vertical scroll
          if (i === 0) {
            let splitTitle = new SplitText(title, { type: "words,chars" });
            let splitDesc = new SplitText(description, { type: "words" });

            const tl = gsap.timeline({
              scrollTrigger: {
                trigger: panel,
                start: "top 60%", // Start when panel top hits 60% from top of viewport
                end: "bottom 70%",
                toggleActions: "play reverse play reverse",
              }
            });

            tl.from(splitTitle.chars, {
                opacity: 0,
                y: 20,
                duration: 0.5,
                ease: "power2.out",
                stagger: 0.02
              })
              .from(splitDesc.words, {
                opacity: 0,
                y: 20,
                duration: 0.8,
                ease: "power2.out",
                stagger: 0.05
              }, "-=0.4");

          } else {
            // ✨ ORIGINAL LOGIC: Animate other panels based on horizontal scroll
            const ctaButton = panel.querySelector(".cta-button-container");
            let splitTitle = new SplitText(title, { type: "words,chars" });
            let splitDesc = new SplitText(description, { type: "words" });
            
            const tl = gsap.timeline({
              scrollTrigger: {
                trigger: panel,
                containerAnimation: horizontalAnimation,
                start: "left 60%",
                end: "right 80%",
                toggleActions: "play reverse play reverse",
              }
            });

            tl.from(splitTitle.chars, {
                opacity: 0,
                y: 20,
                duration: 0.5,
                ease: "power2.out",
                stagger: 0.02
              })
              .from(splitDesc.words, {
                opacity: 0,
                y: 20,
                duration: 0.8,
                ease: "power2.out",
                stagger: 0.05
              }, "-=0.4");

            if (ctaButton) {
              tl.from(ctaButton, {
                y: 30,
                opacity: 0,
                duration: 0.6,
                ease: "power2.out"
              }, "-=0.3");
            }
          }
        });
      }
    });
}, { scope: containerRef });

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // Use CSS classes for elements that will be animated for performance
  const animatedTextClass = "will-change-transform-opacity";


  return (
    <section className="relative overflow-hidden bg-white">
      {/* Intro panel */}
      <div className="w-full flex flex-col justify-center items-center text-center py-16 md:py-32 px-4">
        <h2 className="text-3xl md:text-5xl font-bold text-slate-800 mb-3 md:mb-4">
          Your Simple Path to the Perfect Tutor
        </h2>
        <p className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto mb-6 md:mb-8">
          Our process is designed to be transparent, efficient, and tailored to your needs.
        </p>
        <motion.div
          className="hidden md:block"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown className="w-8 h-8 text-slate-500" />
        </motion.div>
      </div>

      {/* Mobile: Card-based layout, Desktop: Horizontal scrolling */}
      <div ref={containerRef} className="md:h-screen w-full md:overflow-hidden">
        {/* Mobile Layout */}
        <div className="md:hidden px-4 pb-12 space-y-6">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-2xl overflow-hidden shadow-lg border border-slate-200"
            >
              {/* Image Section */}
              {step.image && (
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={step.image}
                    alt=""
                    fill
                    className="object-cover scale-105"
                    sizes="(max-width: 768px) 100vw, 100vw"
                  />
                  <div className={`absolute inset-0 ${step.bgOverlay}`} />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full w-12 h-12 flex items-center justify-center">
                    <span className="text-primary font-bold text-lg">{step.number}</span>
                  </div>
                </div>
              )}
              
              {/* Content Section */}
              <div className="p-6">
                <h3 className="text-2xl font-bold text-slate-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-base text-slate-600 leading-relaxed">
                  {step.highlight.text ? (
                    <>
                      {step.highlight.before}
                      <span className="font-semibold text-primary">{step.highlight.text}</span>
                      {step.highlight.after}
                    </>
                  ) : (
                    step.description
                  )}
                </p>
                {index === 2 && (
                  <div className="mt-6">
                    <Button
                      onClick={scrollToForm}
                      className="w-full bg-accent-fill hover:bg-accent-fill-hover text-white font-bold text-[18.7px] py-3 rounded-xl"
                    >
                      Request a Tutor Now
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Desktop Layout - Horizontal Scroll */}
        <div className="hidden md:flex md:h-full md:w-[300vw]">
          {steps.map((step, index) => {
            const isDarkBg = index > 0;
            const activeDotClass = isDarkBg ? 'bg-white' : 'bg-primary';
            const inactiveDotClass = isDarkBg ? 'bg-white/50' : 'bg-slate-400';

            return (
              <div 
                key={index}
                className="panel w-screen h-full flex-shrink-0 flex items-center justify-center p-8 bg-cover bg-center relative"
                style={{ perspective: '1000px' }} 
              >
                {/* Background Image & Overlay */}
                {step.image && (
                  <>
                    <Image
                      src={step.image}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="100vw"
                    />
                    <div className={`absolute inset-0 ${step.bgOverlay}`} />
                  </>
                )}

                <div className={`absolute inset-0 flex items-center justify-center text-9xl font-extrabold ${step.accentColor} opacity-10 pointer-events-none`}>
                  {step.number}
                </div>
                <div className="max-w-4xl mx-auto text-center z-10 px-4">
                  <h2 className={`step-title text-7xl font-bold mb-6 leading-tight ${step.textColor}`}>
                    {step.title}
                  </h2>
                  <p className={`step-description text-3xl leading-relaxed max-w-3xl mx-auto mb-8 ${step.textColor}`}>
                    {step.highlight.text ? (
                      <>
                        {step.highlight.before}
                        <span className="font-bold text-accent">{step.highlight.text}</span>
                        {step.highlight.after}
                      </>
                    ) : (
                      step.description
                    )}
                  </p>
                  {index === 2 && (
                    <div className="cta-button-container mt-8">
                      <Button
                        onClick={scrollToForm}
                        size="lg"
                        className="bg-white text-accent-fill hover:bg-white/90 font-bold text-[18.7px] px-8 py-6 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105"
                      >
                        Request a Tutor Now
                      </Button>
                    </div>
                  )}
                </div>
                
                {/* Navigation indicator */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
                  {steps.map((_, i) => (
                    <div
                      key={i}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        i === index ? `${activeDotClass} scale-125` : inactiveDotClass
                      }`}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}