'use client';
import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { DURATION, EASE_STANDARD } from '@/lib/motion';

/**
 * The persistent mobile path to the request form.
 *
 * This replaces TutorPopup's coarse-pointer branch. That branch armed on scroll
 * depth (60% of the page) because a phone has no exit intent to detect — but the
 * home page is ~17 phone screens and the form sits at 74%, so 60% depth meant
 * "reading", not "leaving". Worse, `scrollToForm()` travels straight through the
 * threshold, so the one group the modal reliably caught was the people who had
 * just tapped "Request tutors" — it opened over the form they were being sent to.
 *
 * A bar cannot make that mistake: it never interrupts, and it is always one tap
 * from the form. It also closes the gap it was masking — between the hero CTA and
 * the form there were ~5 screens of narrative with nothing to act on, and the
 * navbar CTA is `hidden lg:flex`, so mobile had no CTA at all in between.
 */

/** Show once the hero's own CTA has scrolled away, so the two never compete. */
const SHOW_AFTER_PX = 640;

/**
 * Set while the bar is on screen. globals.css uses it to drop the floating
 * WhatsApp and back-to-top buttons on small screens: all three live in the same
 * band, and the bar carries WhatsApp itself.
 */
const CHROME_FLAG = 'mobileCtaBar';

export default function MobileCTABar({ onRequest, formRef, whatsappHref }) {
  const prefersReducedMotion = useReducedMotion();
  const [pastHero, setPastHero] = useState(false);
  const [formInView, setFormInView] = useState(false);

  useEffect(() => {
    const onScroll = () => setPastHero(window.scrollY > SHOW_AFTER_PX);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Stand down at the form. Covering the fields with a button that scrolls to
  // those same fields is noise, and the bar sits exactly over the first inputs.
  useEffect(() => {
    const el = formRef?.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setFormInView(entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [formRef]);

  const isVisible = pastHero && !formInView;

  useEffect(() => {
    const { dataset } = document.documentElement;
    if (isVisible) dataset[CHROME_FLAG] = 'on';
    else delete dataset[CHROME_FLAG];
    return () => {
      delete document.documentElement.dataset[CHROME_FLAG];
    };
  }, [isVisible]);

  // No AnimatePresence, for the same reason as TutorPopup and BackToTop: an exit
  // animation keeps this mounted while it fades, and a fixed full-width bar that
  // fails to unmount swallows every tap across the bottom of the screen with
  // nothing visible to blame it on.
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 1, y: 0 }}
      animate={prefersReducedMotion ? undefined : { opacity: [0, 1], y: [16, 0] }}
      transition={{ duration: DURATION.base, ease: EASE_STANDARD }}
      className="fixed inset-x-0 bottom-0 z-40 lg:hidden border-t border-gray-200 bg-white/95 backdrop-blur-md px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-4px_16px_rgba(0,0,0,0.06)]"
    >
      <div className="mx-auto flex max-w-md items-center gap-3">
        {/* 18.7px/700 is the smallest label brand orange can carry at AA — white
            on accent-fill is 2.89:1, which only clears the 3:1 large-text bar. */}
        <button
          type="button"
          onClick={onRequest}
          className="min-w-0 flex-1 rounded-full bg-accent-fill px-5 py-3.5 text-[18.7px] font-bold text-white shadow-md transition-colors hover:bg-accent-fill-hover"
        >
          Request tutors
        </button>

        <a
          href={whatsappHref}
          target="_blank"
          rel="noreferrer"
          aria-label="Message us on WhatsApp"
          className="flex h-[52px] w-[52px] flex-shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-[#25D366] shadow-sm transition-colors hover:border-primary"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6" aria-hidden="true">
            <path d="M12 2a10 10 0 0 0-8.6 15.05L2 22l5.1-1.33A10 10 0 1 0 12 2Zm5.4 14.2c-.23.64-1.34 1.22-1.85 1.26-.5.05-.97.23-3.27-.68-2.76-1.09-4.5-3.9-4.64-4.08-.13-.18-1.1-1.46-1.1-2.79 0-1.32.7-1.97.94-2.24.24-.27.52-.34.7-.34l.5.01c.16 0 .38-.06.59.45.23.55.77 1.9.84 2.04.07.14.11.3.02.48-.09.18-.13.29-.27.45l-.4.46c-.13.13-.27.28-.12.54.15.27.66 1.09 1.42 1.76.97.87 1.79 1.13 2.05 1.26.27.14.42.11.58-.07.16-.18.66-.78.84-1.04.18-.27.36-.22.59-.13.23.09 1.48.7 1.74.82.27.13.44.2.5.31.07.11.07.64-.16 1.27Z" />
          </svg>
        </a>
      </div>
    </motion.div>
  );
}
