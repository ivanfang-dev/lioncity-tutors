'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, X } from 'lucide-react';

export default function FloatingTrustBadge({ onGetStarted }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
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

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 100, scale: 0.8 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
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
                className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-white font-medium px-5 py-2.5 rounded-full text-sm transition-all duration-300 hover:scale-105"
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
      )}
    </AnimatePresence>
  );
}
