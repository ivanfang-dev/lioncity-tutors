/**
 * Canonical public promises.
 *
 * These two figures appear on ~40 pages. They MUST have exactly one value each —
 * a parent who opens two pages and sees different numbers stops trusting both.
 * Import from here rather than retyping the number.
 *
 * Anything stated outside this app must be changed in lockstep:
 *   - apps/telegram-bot/utils/parentMessage.js  (parent expectation message)
 *   - apps/website/DESIGN.md, apps/website/PRODUCT.md
 *
 * See DESIGN.md § "The promise is fixed — keep it that way".
 */

/** Match-time promise, as a number of hours. Use for counters and "N-hour" compounds. */
export const MATCH_HOURS = 6;

/** Match-time promise in prose, e.g. "matched within 6 hours". */
export const MATCH_TIME = `${MATCH_HOURS} hours`;

/** Tutor roster size, as a number. Use for counters. */
export const TUTOR_COUNT_NUM = 400;

/** Tutor roster size with the plus, e.g. "400+". */
export const TUTOR_COUNT = `${TUTOR_COUNT_NUM}+`;

/** Full trust-marker phrase, e.g. "400+ vetted tutors". */
export const TUTOR_COUNT_LABEL = `${TUTOR_COUNT} vetted tutors`;
