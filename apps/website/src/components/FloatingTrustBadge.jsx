'use client';
import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { DURATION, EASE_STANDARD } from '@/lib/motion';
import { Star, X } from 'lucide-react';

export default function FloatingTrustBadge({ onGetStarted }) {
  const prefersReducedMotion = useReducedMotion();
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Desktop only, and deliberately so.
    //
    // This card is `max-w-sm` pinned to the bottom-right. On a desktop viewport
    // that is a small corner card. On a 390px phone it resolves to 366x222 —
    // 94% of the screen width and the entire bottom quarter of the viewport —
    // parked over the thumb zone. Measured on the live page it covered the
    // floating WhatsApp button outright, overlapped the back-to-top control,
    // and sat directly on top of the request form's first fields. A promo card
    // obscuring the conversion form is worse than no promo card, and everything
    // it says (4.8/5, 100+ families, the CTA) is already on the page twice: in
    // the hero trust chips and in the blue review strip below them.
    //
    // Gated on hover + fine pointer rather than width alone, so a touch laptop
    // or a tablet in landscape is treated as the touch device it is.
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(min-width: 1024px) and (hover: hover) and (pointer: fine)").matches) return;

    // Show badge after 10 seconds (after TutorPopup has had time to show)
    const timer = setTimeout(() => {
      if (!isDismissed) {
        setIsVisible(true);
      }
    }, 10000);

    return () => clearTimeout(timer);
  }, [isDismissed]);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
  };

  // Same reasoning as TutorPopup: no AnimatePresence. If the exit animation's
  // unmount fails to fire, this leaves an invisible card pinned over the bottom-right
  // corner — swallowing taps in exactly the thumb zone, with nothing visible to blame.
  if (!isVisible) return null;

  // Rests VISIBLE and animates as keyframes. An `initial: { opacity: 0 }` here is a
  // trap: framer drives this with rAF, which is paused in a background tab and
  // throttled under load, so the element would sit at opacity 0 while still being a
  // 384x222 click target parked in the thumb zone.
  return (
        <motion.div
          initial={{ opacity: 1, y: 0 }}
          animate={prefersReducedMotion ? undefined : { opacity: [0, 1], y: [24, 0] }}
          transition={{ duration: DURATION.base, ease: EASE_STANDARD }}
          className="fixed bottom-6 right-6 z-40 max-w-sm"
        >
          <div className="bg-white rounded-3xl shadow-2xl p-6 border border-border/50 relative overflow-hidden">
            {/* Gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
            
            {/* Close button */}
            <button
              onClick={handleDismiss}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors z-10"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>

            <div className="relative z-10">
              {/* Stars */}
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-rating fill-current" />
                ))}
              </div>

              {/* Text */}
              <h3 className="text-lg font-semibold text-primary mb-2">
                Trusted by 100+ Families
              </h3>
              <p className="text-sm text-text-default/80 mb-4">
                Join parents across Singapore who found their perfect tutor with us. Zero fees, fast matching!
              </p>

              {/* CTA */}
              <button
                onClick={() => {
                  if (onGetStarted) {
                    onGetStarted();
                  }
                  handleDismiss();
                }}
                className="inline-flex items-center gap-2 bg-accent-fill hover:bg-accent-fill-hover text-white font-bold px-5 py-2.5 rounded-full text-[18.7px] transition-all duration-300 hover:scale-105"
              >
                Get Started Free
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>

            {/* Decorative element */}
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full blur-2xl" />
          </div>
        </motion.div>
  );
}
