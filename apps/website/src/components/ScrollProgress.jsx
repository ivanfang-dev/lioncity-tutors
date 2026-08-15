'use client';
import React from 'react';
import { motion, useScroll, useSpring, useReducedMotion } from 'framer-motion';

export default function ScrollProgress() {
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  // The spring lags the scroll by design, but that lag IS the motion — under reduced
  // motion the bar tracks the scroll position exactly instead of easing toward it.
  const smoothed = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });
  const scaleX = prefersReducedMotion ? scrollYProgress : smoothed;

  return (
    // Solid Harbour Blue, not a blue→orange→blue gradient. Orange is the rationed
    // action signal (DESIGN.md § The Rationed Orange Rule); a progress bar is not an
    // action, so it has no claim on the budget.
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-primary origin-left z-50"
      style={{ scaleX }}
    />
  );
}
