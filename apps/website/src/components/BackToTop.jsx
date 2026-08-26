'use client';
import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { DURATION, EASE_STANDARD } from '@/lib/motion';

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button when page is scrolled down 400px
      setIsVisible(window.scrollY > 400);
    };

    toggleVisibility();
    window.addEventListener('scroll', toggleVisibility, { passive: true });
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? 'auto' : 'smooth'
    });
  };

  // No AnimatePresence. Its exit animation kept this button mounted at `opacity: 0`
  // with `pointer-events: auto` after scrolling back to the top — an invisible 45x45
  // target in the bottom-left corner that silently scrolled the page whenever someone
  // clicked there. An enter-only animation cannot strand anything.
  if (!isVisible) return null;

  return (
    <motion.button
      initial={{ opacity: 1, scale: 1, y: 0 }}
      animate={prefersReducedMotion ? undefined : { opacity: [0, 1], scale: [0.8, 1], y: [16, 0] }}
      transition={{ duration: DURATION.base, ease: EASE_STANDARD }}
      onClick={scrollToTop}
      className="floating-chrome fixed safe-bottom safe-left z-40 w-12 h-12 sm:w-14 sm:h-14 bg-primary hover:bg-primary/90 text-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-300 group"
      aria-label="Back to top"
    >
      <ArrowUp className="w-5 h-5 sm:w-6 sm:h-6 group-hover:-translate-y-1 transition-transform duration-300" />
    </motion.button>
  );
}
