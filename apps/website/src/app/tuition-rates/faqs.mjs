/**
 * Answer blocks and FAQ content for /tuition-rates.
 *
 * The rate queries this page targets ("math tuition rates", "maths tutor
 * rates", "secondary tuition rates", "o level tuition rates" — GSC, 3 months
 * to 2026-07-23) all sit at position 58-69 with zero clicks. They are
 * answerable questions with a number in the answer, which is the shape that
 * wins a snippet, so every answer below leads with the figure.
 *
 * Figures are composed from rates.mjs rather than typed, so the prose cannot
 * drift from the rate card. Every answer carrying a figure also carries the
 * attribution: these are our rates, dated, not an industry benchmark.
 *
 * RATE_ANSWERS render as answer-block sections with the matching rate table
 * beneath; SERVICE_FAQS render as the FAQ list. Both feed the FAQPage JSON-LD,
 * so the visible text and the markup can never disagree.
 */
import { rangeFor, RATES_REVIEWED, bandFor, priceLabel, TUTOR_TYPE_PROSE } from './rates.mjs';
import { observedSpan } from './placements.mjs';

/** "$35 to $90 an hour" — prose form of a level's full span. */
const span = (id) => {
  const { min, max } = rangeFor(id);
  return `$${min} to $${max} an hour`;
};

/** "undergraduate tutors are $35 - $50, full-time tutors $50 - $70 and ..." */
const byType = (id) =>
  bandFor(id)
    .rates.map((rate, index) =>
      `${TUTOR_TYPE_PROSE[rate.type]}${index === 0 ? ' are' : ''} ${priceLabel(rate)}`,
    )
    .join(', ')
    .replace(/, ([^,]*)$/, ' and $1');

const ours = `LionCity Tutors' own rates, reviewed ${RATES_REVIEWED}`;

export const RATE_ANSWERS = [
  {
    id: 'math-rates',
    label: 'Maths tuition rates',
    band: null,
    question: 'How much does math tuition cost in Singapore?',
    answer:
      `Maths tuition is priced by level and by how experienced the tutor is, not by subject. Primary maths runs ${span('primary')}, secondary ${span('secondary')}, and JC ${span('jc')} for H1 and H2 Mathematics. Those are ${ours}, not an industry-wide benchmark.`,
  },
  {
    id: 'primary-rates',
    label: 'Primary school rates',
    band: 'primary',
    question: 'How much does primary school tuition cost?',
    answer:
      `Primary tuition runs ${span('primary')}: ${byType('primary')}. The same band covers P1 through to PSLE year, and parents pay the tutor's fee with no agency fee on top. ${ours}.`,
  },
  {
    id: 'secondary-rates',
    label: 'Secondary school rates',
    band: 'secondary',
    question: 'What are typical secondary school tuition rates?',
    answer:
      `Secondary school tuition runs ${span('secondary')}: ${byType('secondary')}. O-Level and N-Level students sit in the same band — the tutor's experience and your location move the rate, not the exam. ${ours}.`,
  },
  {
    id: 'jc-rates',
    label: 'O-Level and JC rates',
    band: 'jc',
    question: 'What do O-Level and JC tutors charge?',
    answer:
      `O-Level tutors charge the secondary band, ${span('secondary')}. JC and A-Level tutors charge ${span('jc')}: ${byType('jc')}. The step up reflects how few tutors handle H2 content confidently. ${ours}.`,
  },
  {
    id: 'ib-rates',
    label: 'IB and IP rates',
    band: 'ib',
    question: 'What do IB and IP tutors charge?',
    answer:
      `IB, IP and university preparation sit at ${span('ib')}, the same band as JC: ${byType('ib')}. The premium buys a tutor who knows the IB assessment structure and internal assessments rather than the national syllabus. ${ours}.`,
  },
  {
    id: 'jc-chemistry-rates',
    label: 'JC Chemistry',
    band: 'jc',
    question: 'How much does JC Chemistry tuition cost?',
    answer:
      `JC Chemistry sits in the same band as every other H1 and H2 subject, ${span('jc')}: ${byType('jc')}. Subject does not move the rate here — level and tutor experience do. Parents booking JC tuition with us typically budget ${observedSpan('jc')}. ${ours}.`,
  },
  {
    id: 'h2-math-rates',
    label: 'H2 Maths',
    band: 'jc',
    question: 'What do H2 Maths tutors charge?',
    answer:
      `H2 Maths tutors charge the same JC band as every other subject, ${span('jc')}: ${byType('jc')}. It's the level and the tutor's experience that set the rate, not the subject. Parents booking JC tuition with us typically budget ${observedSpan('jc')}. ${ours}.`,
  },
  {
    id: 'psle-science-rates',
    label: 'PSLE Science',
    band: 'primary',
    question: 'How much is PSLE Science tuition?',
    answer:
      `PSLE Science sits in the primary band like every other subject, ${span('primary')}: ${byType('primary')}. Subject does not move the rate here — level and tutor experience do. Parents booking primary tuition with us typically budget ${observedSpan('primary')}. ${ours}.`,
  },
  {
    id: 'o-level-chemistry-rates',
    label: 'O-Level Chemistry',
    band: 'secondary',
    question: 'What does O-Level Chemistry tuition cost?',
    answer:
      `O-Level Chemistry sits in the secondary band like every other subject, ${span('secondary')}: ${byType('secondary')}. Subject does not move the rate here — level and tutor experience do. Parents booking secondary tuition with us typically budget ${observedSpan('secondary')}. ${ours}.`,
  },
];

/**
 * Service questions, carried over from the accordion this page used to hide
 * them in. Same wording — they were accurate; they were just invisible to
 * anything that does not run JavaScript.
 */
export const SERVICE_FAQS = [
  {
    question: 'Are there any hidden fees?',
    answer:
      "None. Our service is 100% free for parents. The rates listed are the tutor's hourly fees. We believe in complete transparency.",
  },
  {
    question: 'How is the final rate determined?',
    answer:
      "The final rate depends on the tutor's experience, qualifications, and your location. We confirm the exact rate with you before you commit.",
  },
  {
    question: 'Can I request a tutor within a budget?',
    answer:
      "Absolutely. Our form allows you to specify your budget, and we'll find the best match who meets your academic and financial needs.",
  },
];

/** Everything the page shows as a question, in the order it appears. */
export const TUITION_RATES_FAQS = [
  ...RATE_ANSWERS.map(({ question, answer }) => ({ question, answer })),
  ...SERVICE_FAQS,
];
