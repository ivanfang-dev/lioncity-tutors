/**
 * Singapore mobile number parsing.
 *
 * The request form used to test the raw input against /^[689]\d{7}$/ directly,
 * which rejected almost every natural way of writing the number — including the
 * one its own placeholder demonstrated ("e.g., 9123 4567") and the one the
 * browser fills into an `autoComplete="tel"` field ("+6591234567"). A parent who
 * typed exactly what the field showed them was told their number was invalid, on
 * the required field in step 1.
 *
 * The accepted SET of numbers is deliberately unchanged (8 digits, leading 6, 8
 * or 9). Only the accepted FORMATS are widened. This is a parsing fix, not a
 * loosening of validation — nobody who passed before fails now.
 */

/** Digits 6, 8 and 9 are the local prefixes the site has always accepted. */
const LOCAL_MOBILE = /^[689]\d{7}$/;

/** Country-code prefixes people paste, longest first so "0065" wins over "65". */
const COUNTRY_PREFIXES = ['0065', '065', '65'];

/**
 * Reduce a written Singapore mobile number to its bare 8-digit local form.
 *
 * @param {unknown} raw - whatever the visitor typed or the browser autofilled
 * @returns {string|null} the 8-digit local number, or null if it is not one
 *
 * @example
 * normalizeSgMobile('9123 4567')     // '91234567'
 * normalizeSgMobile('+65 9123-4567') // '91234567'
 * normalizeSgMobile('12345678')      // null
 */
export function normalizeSgMobile(raw) {
  if (typeof raw !== 'string') return null;

  // Keep digits only. This absorbs spaces (normal and non-breaking), hyphens,
  // en/em dashes, dots, parentheses and a leading "+" in one step.
  const digits = raw.replace(/\D/g, '');
  if (!digits) return null;

  // Already a bare local number: accept it before considering country codes, so
  // a genuine 6-prefixed local number is never mistaken for a "65" country code.
  if (LOCAL_MOBILE.test(digits)) return digits;

  for (const prefix of COUNTRY_PREFIXES) {
    if (!digits.startsWith(prefix)) continue;
    const rest = digits.slice(prefix.length);
    if (LOCAL_MOBILE.test(rest)) return rest;
  }

  return null;
}

/** True when `raw` is a Singapore mobile number in any accepted written form. */
export function isSgMobile(raw) {
  return normalizeSgMobile(raw) !== null;
}

/**
 * Display form: "9123 4567". Used when echoing a number back to the visitor,
 * never for storage — what we send onward is always the bare 8 digits, so the
 * backend and the WhatsApp outreach see one consistent shape.
 */
export function formatSgMobile(raw) {
  const local = normalizeSgMobile(raw);
  return local ? `${local.slice(0, 4)} ${local.slice(4)}` : null;
}
