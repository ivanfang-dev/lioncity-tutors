"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { Check, X } from "lucide-react";
import { DURATION, EASE_STANDARD } from "@/lib/motion";
import { MATCH_TIME } from "@/data/promises";
import { normalizeSgMobile } from "@/lib/phone";

/**
 * The last-chance tutor request.
 *
 * This used to fire on a 6-second timer, which put a full-screen overlay over the
 * hero before a first-time parent had finished reading the headline — the loudest
 * "cheap tuition agency" signal on a site whose product is trust. It now waits for a
 * visitor who is either leaving or has read most of the page:
 *
 *   - fine pointer (desktop): exit intent — the cursor leaves through the top of the
 *     viewport, toward the tab bar or the close button;
 *   - coarse pointer (touch): there is no exit intent to detect, so it waits until
 *     the visitor has scrolled past PROMPT_AFTER_SCROLL of the page.
 *
 * Either way it never appears before MIN_DWELL_MS, so a stray early mouse-out cannot
 * ambush someone who just arrived.
 */

/** Set once the visitor submits or dismisses; survives navigation within the session. */
const ACTION_KEY = "popupActionTaken";
/** Handoff to /request-tutor. sessionStorage, never the URL — see handleSubmit. */
export const PREFILL_KEY = "tutorRequestPrefill";

const MIN_DWELL_MS = 8000;
const PROMPT_AFTER_SCROLL = 0.6;

const BENEFITS = [
  "Free for parents — you pay the tutor directly",
  `Matching profiles within ${MATCH_TIME}`,
  "No obligation — decide once you have seen them"
];

export default function TutorPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [values, setValues] = useState({ name: "", mobile: "" });
  const [mobileError, setMobileError] = useState(null);
  const router = useRouter();
  const prefersReducedMotion = useReducedMotion();

  const panelRef = useRef(null);
  const nameRef = useRef(null);
  const mobileRef = useRef(null);
  const returnFocusRef = useRef(null);
  const armedAt = useRef(0);

  const markActioned = useCallback(() => {
    try {
      sessionStorage.setItem(ACTION_KEY, "true");
    } catch {
      /* Private mode or storage disabled — the popup simply may show again. */
    }
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    markActioned();
  }, [markActioned]);

  // ── Arming: decide when this visitor has earned the prompt ────────────────
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (sessionStorage.getItem(ACTION_KEY)) return;
    } catch {
      /* Unreadable storage is not a reason to skip the prompt. */
    }

    armedAt.current = Date.now();
    const dwellMet = () => Date.now() - armedAt.current >= MIN_DWELL_MS;
    const open = () => setIsOpen(true);

    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;

    if (coarsePointer) {
      const onScroll = () => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        if (max <= 0) return;
        if (window.scrollY / max >= PROMPT_AFTER_SCROLL && dwellMet()) {
          open();
          window.removeEventListener("scroll", onScroll);
        }
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
    }

    // `mouseout` with no relatedTarget and a y at or above the viewport top means
    // the cursor left through the top edge — the browser chrome, not the page.
    const onMouseOut = (event) => {
      if (event.relatedTarget || event.clientY > 0) return;
      if (!dwellMet()) return;
      open();
      document.removeEventListener("mouseout", onMouseOut);
    };
    document.addEventListener("mouseout", onMouseOut);
    return () => document.removeEventListener("mouseout", onMouseOut);
  }, []);

  // ── Dialog behaviour: focus, escape, scroll lock, focus trap ──────────────
  useEffect(() => {
    if (!isOpen) return;

    returnFocusRef.current = document.activeElement;
    nameRef.current?.focus();

    // Lock the background. The lock goes on <html>, not <body>: this document scrolls
    // on the documentElement, so `body { overflow: hidden }` alone does nothing and
    // the page happily scrolls behind the dialog. Padding on <body> compensates for
    // the vanishing scrollbar so the page does not jump sideways.
    const { body, documentElement } = document;
    const scrollbar = window.innerWidth - documentElement.clientWidth;
    const prevHtmlOverflow = documentElement.style.overflow;
    const prevPadding = body.style.paddingRight;
    documentElement.style.overflow = "hidden";
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }
      if (event.key !== "Tab") return;

      const focusables = panelRef.current?.querySelectorAll(
        'button, input, a[href], [tabindex]:not([tabindex="-1"])'
      );
      if (!focusables?.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      documentElement.style.overflow = prevHtmlOverflow;
      body.style.paddingRight = prevPadding;
      returnFocusRef.current?.focus?.();
    };
  }, [isOpen, close]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "mobile" && mobileError) setMobileError(null);
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Validate here, with the same parser the request form uses. Without this
    // the popup accepted any string and handed it over as a prefill, and the
    // form on the next page then rejected the very value this one had just
    // told the visitor was fine — asking them to re-type a number they had
    // already given us once.
    const mobile = normalizeSgMobile(values.mobile);
    if (!mobile) {
      setMobileError("That doesn't look like a Singapore mobile number — it should be 8 digits starting with 8 or 9.");
      mobileRef.current?.focus();
      return;
    }
    setMobileError(null);

    markActioned();
    // The name and number travel in sessionStorage, not a query string: a URL
    // carrying a parent's phone number ends up in browser history, in the referrer
    // sent to any third party, and in server logs.
    try {
      sessionStorage.setItem(PREFILL_KEY, JSON.stringify({ ...values, mobile }));
    } catch {
      /* If storage fails the visitor simply retypes two fields on the next page. */
    }
    setIsOpen(false);
    router.push("/request-tutor#form");
  };

  const panelMotion = prefersReducedMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 } }
    : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 } };

  // Deliberately NOT wrapped in AnimatePresence. An exit animation keeps this
  // full-screen overlay mounted while it fades, and if the unmount ever fails to
  // fire the page is left with an invisible `inset-0` sheet at `pointer-events:
  // auto` — every click on the site swallowed, with nothing on screen to explain
  // why. A dismissal should be instant anyway; there is no exit worth that risk.
  if (!isOpen) return null;

  return (
    // The overlay scrolls, and the panel is top-aligned until there is room to
    // centre it. Centring unconditionally in a non-scrolling `inset-0` box means
    // that the moment the panel is taller than the viewport it is clipped at
    // BOTH ends with no way to reach either — which is the normal case on a
    // phone the instant the keyboard opens and takes ~45% of the screen: the
    // name field gets focus on mount, so the submit button was unreachable.
    <div
      className="fixed inset-0 z-[100] flex items-start sm:items-center justify-center overflow-y-auto overscroll-contain bg-black/40 p-4 py-8 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="tutor-popup-title"
            aria-describedby="tutor-popup-description"
            className="relative my-auto w-full max-w-lg shrink-0 rounded-xl bg-background-card p-5 shadow-xl sm:p-8"
            {...panelMotion}
            transition={{ duration: DURATION.base, ease: EASE_STANDARD }}
          >
            {/* 44x44 target — the old close control was a 16x32 hit area. */}
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="absolute right-2 top-2 flex h-11 w-11 items-center justify-center rounded-full text-text-tertiary transition-colors hover:bg-muted hover:text-text-default"
            >
              <X className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
            </button>

            <h2
              id="tutor-popup-title"
              className="pr-12 text-2xl font-bold tracking-tight text-primary text-balance"
            >
              Still looking for a tutor?
            </h2>
            <p
              id="tutor-popup-description"
              className="mt-3 text-base leading-relaxed text-text-secondary text-pretty"
            >
              Leave your number and a real person will send you matching tutor
              profiles, usually within {MATCH_TIME}.
            </p>

            <ul className="mt-6 space-y-2.5">
              {BENEFITS.map((benefit) => (
                <li key={benefit} className="flex items-start gap-3">
                  <span
                    className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary/10"
                    aria-hidden="true"
                  >
                    <Check className="h-3 w-3 text-primary" strokeWidth={2.5} />
                  </span>
                  <span className="text-sm leading-relaxed text-text-default">
                    {benefit}
                  </span>
                </li>
              ))}
            </ul>

            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              {/* Real labels. Placeholders alone disappear the moment someone types,
                  and leave a screen reader with an unnamed field. */}
              <div>
                <label
                  htmlFor="tutor-popup-name"
                  className="block text-sm font-medium text-text-default"
                >
                  Your name
                </label>
                <input
                  ref={nameRef}
                  id="tutor-popup-name"
                  type="text"
                  name="name"
                  autoComplete="name"
                  required
                  value={values.name}
                  onChange={handleChange}
                  className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2.5 text-base text-text-default shadow-xs outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
                />
              </div>

              <div>
                <label
                  htmlFor="tutor-popup-mobile"
                  className="block text-sm font-medium text-text-default"
                >
                  Mobile number
                </label>
                <input
                  ref={mobileRef}
                  id="tutor-popup-mobile"
                  type="tel"
                  name="mobile"
                  inputMode="tel"
                  autoComplete="tel"
                  required
                  aria-invalid={mobileError ? "true" : undefined}
                  aria-describedby={mobileError ? "tutor-popup-mobile-error" : undefined}
                  value={values.mobile}
                  onChange={handleChange}
                  className={`mt-1.5 w-full rounded-md border bg-background px-3 py-2.5 text-base text-text-default shadow-xs outline-none transition-colors focus-visible:ring-2 ${
                    mobileError
                      ? "border-error focus-visible:border-error focus-visible:ring-error/40"
                      : "border-input focus-visible:border-ring focus-visible:ring-ring/40"
                  }`}
                />
                {mobileError && (
                  <p id="tutor-popup-mobile-error" className="mt-1.5 text-sm text-error-text">
                    {mobileError}
                  </p>
                )}
              </div>

              {/* accent-fill at 18.7px/700 — the smallest compliant label the brand
                  orange can carry. The old button was white on #FF6900 at 16px/600,
                  which measured 2.89:1 and failed AA outright. */}
              <button
                type="submit"
                className="w-full rounded-full bg-accent-fill px-8 py-4 text-[18.7px] font-bold text-white shadow-md transition-all duration-200 hover:bg-accent-fill-hover hover:shadow-lg"
              >
                Request tutors
              </button>
            </form>

            <p className="mt-4 text-center text-xs text-text-tertiary">
              We only use your number to send tutor profiles.
            </p>
      </motion.div>
    </div>
  );
}
