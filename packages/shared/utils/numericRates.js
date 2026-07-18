// Numeric parsing for the free-text rate strings that live on both sides of the platform (roadmap
// Phase 7). Rates are typed by humans — "$40-60/hr", "50", "$45 (PT), $60 (FT)" — and were regex-
// parsed on every query. This derives the numeric fields (tutor.rateNumeric, assignment.budgetNumeric)
// ONCE at write time so matching can read numbers instead of re-parsing text. Shared so the model
// hook, the intake flows, and the backfill scripts all derive identically.

// The per-level keys tutor.hourlyRate (and therefore rateNumeric) uses. Mirrors the hourlyRate
// subdocument in models/Tutor.js.
export const RATE_CATEGORIES = [
  'preschool', 'primary', 'secondary', 'jc', 'ib', 'music', 'polytechnic', 'university', 'professional',
];

// Pull every number out of a free-text money string. "$30-45/hr" → [30, 45]. Same behaviour as
// tutorMatcher's extractNumbers (kept in sync — this is the shared home going forward).
export function extractNumbers(text) {
  return (String(text ?? '').match(/\d+(?:\.\d+)?/g) || []).map(Number);
}

// A single rate string → { min, max }, or null when it holds no numbers. "$40-60/hr" → {40,60};
// "50" → {50,50}.
export function parseRateRange(text) {
  const nums = extractNumbers(text);
  if (nums.length === 0) return null;
  return { min: Math.min(...nums), max: Math.max(...nums) };
}

// A tutor's whole hourlyRate object → rateNumeric: { <category>: { min, max } } for every category
// that holds a parseable number. Categories with blank/unparseable rates are omitted (absent, not
// zeroed) so a missing rate stays "unknown" downstream rather than reading as $0.
export function deriveRateNumeric(hourlyRate) {
  const out = {};
  if (!hourlyRate) return out;
  for (const cat of RATE_CATEGORIES) {
    const range = parseRateRange(hourlyRate[cat]);
    if (range) out[cat] = range;
  }
  return out;
}

// An assignment's free-text rate → budgetNumeric: { partTime?, fullTime?, moe?, default? } where each
// value is the SPENDING CEILING (max) for that tutor-type band. Mirrors tutorMatcher.parseBudget's
// band detection exactly, so numeric-preferred matching agrees with the legacy text path.
//   "$30-45/hr (PT), $40-50/hr (FT)" → { partTime: 45, fullTime: 50 }
//   "$40-50/hr"                       → { default: 50 }
export function deriveBudgetNumeric(rateText) {
  const bands = {};
  for (const segment of String(rateText ?? '').split(',')) {
    const nums = extractNumbers(segment);
    if (nums.length === 0) continue;
    const ceiling = Math.max(...nums);
    if (/\b(pt|part|undergrad)\w*/i.test(segment)) bands.partTime = ceiling;
    else if (/\b(ft|full)\w*/i.test(segment)) bands.fullTime = ceiling;
    else if (/\b(moe|nie)\w*/i.test(segment)) bands.moe = ceiling;
    else bands.default = ceiling;
  }
  return bands;
}

// True when a derived numeric object actually carries a value — used to decide "use numeric" vs
// "fall back to text parsing" without a full deep-equality check.
export function hasNumericValue(obj) {
  return Boolean(obj) && Object.keys(obj).length > 0;
}
