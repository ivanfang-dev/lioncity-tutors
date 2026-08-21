/**
 * LionCity Tutors' own rate card.
 *
 * This is the only place the figures live. The visible tables, the answer
 * blocks that quote a range, and the Service/Offer JSON-LD all read from here,
 * so a rate can never be updated in one place and stale in another.
 *
 * These are our rates, not an industry benchmark — every place they surface
 * says so, and RATES_REVIEWED dates them.
 */

/** Human-readable review date, shown wherever the figures are attributed. */
export const RATES_REVIEWED = 'July 2026';

export const TUTOR_TYPES = ['Undergraduate', 'Full-Time Tutor', 'MOE-Trained Teacher'];

/** Mid-sentence form of each tutor type. "MOE" must not be lower-cased. */
export const TUTOR_TYPE_PROSE = {
  'Undergraduate': 'undergraduate tutors',
  'Full-Time Tutor': 'full-time tutors',
  'MOE-Trained Teacher': 'MOE-trained teachers',
};

export const RATE_CARD = [
  {
    id: 'primary',
    level: 'Primary School',
    description: 'Building strong foundational skills for PSLE success.',
    rates: [
      { type: 'Undergraduate', min: 25, max: 40, details: 'Bright minds from top universities.' },
      { type: 'Full-Time Tutor', min: 40, max: 60, details: 'Experienced and dedicated educators.' },
      { type: 'MOE-Trained Teacher', min: 60, max: 80, details: 'Certified experts in the curriculum.' },
    ],
  },
  {
    id: 'secondary',
    level: 'Secondary School',
    description: 'Navigating O/N-Levels with targeted strategies.',
    rates: [
      { type: 'Undergraduate', min: 35, max: 50, details: 'Specialised knowledge and relatable.' },
      { type: 'Full-Time Tutor', min: 50, max: 70, details: 'Proven track records of success.' },
      { type: 'MOE-Trained Teacher', min: 70, max: 90, details: 'In-depth syllabus understanding.' },
    ],
  },
  {
    id: 'jc',
    level: 'Junior College',
    description: 'Mastering the demanding A-Level curriculum.',
    rates: [
      { type: 'Undergraduate', min: 50, max: 70, details: 'High-achievers in specific subjects.' },
      { type: 'Full-Time Tutor', min: 70, max: 90, details: 'Expert guidance for A-Level excellence.' },
      { type: 'MOE-Trained Teacher', min: 90, max: 120, details: 'Premier instruction and insights.' },
    ],
  },
  {
    id: 'ib',
    level: 'IB / University Prep',
    description: 'Specialised support for IB, IP and university pathways.',
    rates: [
      { type: 'Undergraduate', min: 50, max: 70, details: 'Familiar with the IB/IP structure.' },
      { type: 'Full-Time Tutor', min: 70, max: 90, details: 'Experienced in holistic development.' },
      { type: 'MOE-Trained Teacher', min: 90, max: 120, details: 'Top-tier, specialised instructors.' },
    ],
  },
];

/** "$25 - $40" — one place decides how a rate is written. */
export const priceLabel = ({ min, max }) => `$${min} - $${max}`;

export const bandFor = (id) => RATE_CARD.find((band) => band.id === id);

/** The full span across every level and tutor type, for prose and for Offer. */
export const overallRange = () => {
  const all = RATE_CARD.flatMap((band) => band.rates);
  return { min: Math.min(...all.map((r) => r.min)), max: Math.max(...all.map((r) => r.max)) };
};

/** The span within one level, e.g. Secondary is $35-$90 across tutor types. */
export const rangeFor = (id) => {
  const { rates } = bandFor(id);
  return { min: Math.min(...rates.map((r) => r.min)), max: Math.max(...rates.map((r) => r.max)) };
};

/**
 * Maps the request form's free-text level ("Secondary 3 A-Math", "P4 Science") to a
 * RATE_CARD id. Returns null for an unrecognised level.
 */
export const bandForLevelText = (text) => {
  const t = String(text || '').toLowerCase();
  if (!t.trim()) return null;
  // Most specific first: "IB", "IP" and "IGCSE" all also contain level words.
  if (/\b(ib|ibdp|igcse|ip|integrated programme|university|uni|poly|polytechnic)\b/.test(t)) return 'ib';
  if (/\b(jc|jc1|jc2|j1|j2|junior college|a[- ]?level|a[- ]?lvl|h1|h2|h3)\b/.test(t)) return 'jc';
  if (/\b(sec|secondary|s[1-5]|sec[1-5]|o[- ]?level|n[- ]?level|express|normal academic|normal technical)\b/.test(t)) return 'secondary';
  if (/\b(pri|primary|p[1-6]|psle|lower pri|upper pri)\b/.test(t)) return 'primary';
  return null;
};

/** The rate span for one tutor type across a set of bands. */
export const spanFor = (bandIds, type) => {
  const ids = bandIds && bandIds.length ? bandIds : RATE_CARD.map((b) => b.id);
  const rows = ids
    .map((id) => bandFor(id)?.rates.find((r) => r.type === type))
    .filter(Boolean);
  if (!rows.length) return null;
  return { min: Math.min(...rows.map((r) => r.min)), max: Math.max(...rows.map((r) => r.max)) };
};

/** "$35–$50/hr" — the form's compact form of a span (en dash, no spaces). */
export const hourlyLabel = ({ min, max }) => `$${min}–$${max}/hr`;
