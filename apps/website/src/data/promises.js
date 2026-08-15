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

/**
 * MEASURED match timings — not promises.
 *
 * These are medians computed from the assignments collection (`outreach.startedAt`,
 * `outreach.contacts[].respondedAt`, `outreach.contacts[].relayedToParentAt` measured
 * against `createdAt`), rounded down/coarsened so a single slow match cannot contradict
 * the page. They are the only measured figures published on the site, so they carry a
 * higher bar than marketing copy: if you change the wording, re-run the numbers first.
 *
 * Last computed: 2026-08-15.
 *   request → tutors messaged   median <1 min   (n=32)
 *   request → first tutor yes   median 17 min   (n=27)
 *   request → profiles relayed  median 2h 05m   (n=10, 100% inside the 6-hour promise)
 *
 * The published values sit at or behind the measured medians on purpose — never ahead.
 * MATCH_HOURS above remains the promise; these describe what typically happens.
 */
export const MEASURED_AS_OF = 'August 2026';

export const MATCH_TIMELINE = [
  {
    time: '0:00',
    label: 'You send the request',
    detail: 'The form takes about three minutes. WhatsApp works too.'
  },
  {
    time: '0:01',
    label: 'Tutors are messaged',
    detail: 'Filtered by level, subject and location, then contacted directly — usually inside a minute.'
  },
  {
    time: '0:17',
    label: 'The first tutor says yes',
    detail: 'Replies typically start landing while you are still reading this page.'
  },
  {
    time: '~2 hrs',
    label: 'Your shortlist reaches you',
    detail: `Two to three profiles on WhatsApp, ranked by fit. We promise ${MATCH_TIME}; the median is about two.`
  }
];
