/**
 * Canonical motion tokens.
 *
 * DESIGN.md § Motion is normative: one easing family, three durations, one stagger.
 * Before this file existed the home page ran 8 distinct durations and 5 easing
 * families across 6 components — inconsistent easing is the single most reliable
 * tell that a page was assembled rather than authored, because it is felt even by
 * people who cannot name it.
 *
 * Import these instead of typing a number. If a value here is wrong, it is wrong in
 * one place.
 *
 * See also `hero-underline` in globals.css, the one motion that is deliberately
 * outside this scale: it is the signature moment and owns `DURATION.draw`.
 */

/** cubic-bezier(0.4, 0, 0.2, 1) — lifts, colour, entrances. The default. */
export const EASE_STANDARD = [0.4, 0, 0.2, 1];

/** cubic-bezier(0.65, 0, 0.35, 1) — reserved for the hand-drawn stroke. */
export const EASE_DRAW = [0.65, 0, 0.35, 1];

/** Exits leave faster than entrances arrive. */
export const EASE_EXIT = [0, 0, 0.2, 1];

export const DURATION = {
  /** 0.2s — small transitions: nav reveal, arrow nudge, chevron rotate. */
  fast: 0.2,
  /** 0.3s — hover lifts, colour shifts, entrances. */
  base: 0.3,
  /** 0.9s — the hero underline and the match-timeline stroke. Nothing else. */
  draw: 0.9
};

/** Gap between staggered siblings entering as a group. */
export const STAGGER = 0.08;

/** Cards rise on interest; they never rest lifted. */
export const LIFT = { card: -4, cardStrong: -6 };

/** Primary CTA press: confident, springy, never a bounce. */
export const PRESS = { whileHover: { scale: 1.03 }, whileTap: { scale: 0.97 } };

/**
 * The standard scroll entrance.
 *
 * Written as a keyframe list ENDING on the resting value, with `initial` already at
 * rest, so the reveal is pure enhancement: if the observer never fires — slow JS, a
 * background tab, throttling — the content still renders correctly rather than
 * stranded at opacity 0. `amount: 'some'` triggers on the first visible pixel.
 *
 * Movement only, no fade. These entrances are server-rendered as inline styles, and
 * an opacity keyframe would flash any element that is already on screen when it
 * triggers. Travel alone reads as arrival and cannot hide content.
 *
 * @param {number} index sibling position, for the stagger
 * @param {boolean} reduced result of framer's `useReducedMotion()`
 */
export function enter(index = 0, reduced = false) {
  if (reduced) return {};
  return {
    initial: { y: 0 },
    whileInView: { y: [16, 0] },
    viewport: { once: true, amount: 'some' },
    transition: {
      duration: DURATION.base,
      delay: index * STAGGER,
      ease: EASE_STANDARD
    }
  };
}
