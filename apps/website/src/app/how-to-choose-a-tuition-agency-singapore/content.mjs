/**
 * Answer blocks, comparison table and FAQs for
 * /how-to-choose-a-tuition-agency-singapore.
 *
 * This is the site's first parent-decision page: comparison-intent queries
 * ("tuition agency vs tuition centre", "is a tuition agency worth it") rather
 * than exam-prep queries. LionCity Tutors charges parents no agency fee, which
 * is the honest angle a fee-charging competitor cannot copy — every answer
 * below says so plainly rather than disparaging any named competitor.
 *
 * Figures compose from rates.mjs and promises.js rather than being typed, so
 * this page can never quote a price or a match time the rest of the site no
 * longer uses. AGENCY_ANSWERS + AGENCY_FAQS feed the FAQPage JSON-LD via
 * ALL_FAQS, so visible text and markup cannot disagree — the same discipline
 * as tuition-rates/faqs.mjs.
 */
import { overallRange } from '../tuition-rates/rates.mjs';
import { MATCH_TIME } from '../../data/promises';

const { min, max } = overallRange();

export const AGENCY_ANSWERS = [
  {
    id: 'how-agencies-charge',
    label: 'How agencies charge',
    question: 'How do tuition agencies in Singapore charge?',
    answer:
      "Most Singapore tuition agencies charge in one of three ways: a cut of the tutor's first month of fees, a flat placement fee once a match is confirmed, or a markup added on top of the tutor's hourly rate. LionCity Tutors uses none of these — we take nothing from parents, and the rate you pay is the tutor's own.",
  },
  {
    id: 'agency-or-diy',
    label: 'Agency or DIY?',
    question: 'Should I use an agency or find a tutor myself?',
    answer:
      "If you already have a trusted recommendation from another parent, you don't need an agency — go straight to that tutor. An agency earns its place when you don't have a lead: it can vet candidates, propose a match fast, and replace a tutor that isn't working, at no cost to you here.",
  },
  {
    id: 'what-agencies-do',
    label: 'What agencies do',
    question: 'What does a tuition agency actually do?',
    answer:
      "A tuition agency should vet a tutor's qualifications and teaching history before proposing them, match based on your child's level and personality fit, arrange a replacement if the first match doesn't work out, and handle rate discussions so you don't have to negotiate directly with the tutor. Expect all four before you commit.",
  },
  {
    id: 'how-fast',
    label: 'How fast to expect',
    question: 'How quickly should an agency find a tutor?',
    answer:
      `Most agencies take days to propose a candidate. LionCity Tutors hand-matches within ${MATCH_TIME} of your request, because a stalled search is the main reason parents give up and start searching alone. Ask any agency you're considering what their actual turnaround time is, not just what they promise.`,
  },
  {
    id: 'warning-signs',
    label: 'Warning signs',
    question: 'What are the warning signs of a bad tuition agency?',
    answer:
      'Watch for a fee charged before any tutor is proposed, no written profile of the tutor before you commit, no stated replacement policy if the match fails, unverified claims of MOE training, and pressure to sign up for a package of lessons upfront. Any one of these is reason to walk away.',
  },
  {
    id: 'agency-centre-or-tutor',
    label: 'Agency vs centre vs tutor',
    question: 'Agency, tuition centre, or private tutor?',
    answer:
      'Each suits a different situation: an agency is fastest when you need a vetted one-to-one match without doing the legwork yourself, a tuition centre suits a child who works well in a group, and an independent tutor works if you already have a trusted recommendation. The table below compares them directly.',
  },
];

/**
 * Agency cost figures come from LionCity's own rate card (overallRange), the
 * only figures on this page that are our own data. Centre and independent-
 * tutor figures are market estimates and are labelled "Typically" in the
 * cell — see the indicative-data note rendered under the table in page.jsx.
 */
export const COMPARISON = {
  caption:
    'Agency, tuition centre and independent tutor compared, by typical cost, time to start, vetting, replacement policy and schedule flexibility.',
  columns: ['Typical cost', 'Time to start', 'Vetting', "Replacement if it doesn't work", 'Schedule flexibility'],
  rows: [
    {
      name: 'Agency',
      cells: [
        `$${min} – $${max}/hr — the tutor's rate, no agency fee here`,
        `Within ${MATCH_TIME}`,
        'Vetted by the agency before being proposed to you',
        'Agency arranges a replacement at no extra cost',
        'Set directly between you and the tutor',
      ],
    },
    {
      name: 'Tuition centre',
      cells: [
        'Typically $200 – $400/month per subject',
        'Enrolment plus the next available class slot',
        "Centre vets its own teaching staff",
        'Reassigned to a different class group',
        'Fixed to the centre’s class timetable',
      ],
    },
    {
      name: 'Independent tutor',
      cells: [
        'Typically $25 – $150/hr, negotiated directly',
        'As fast as the tutor can start',
        'Self-reported — you verify credentials yourself',
        'You find and vet a new tutor yourself',
        'Most flexible — arranged directly with the tutor',
      ],
    },
  ],
};

export const AGENCY_FAQS = [
  {
    question: 'Do I pay the agency or the tutor?',
    answer:
      "You pay the tutor directly, at the hourly rate agreed before lessons start. LionCity Tutors doesn't add a fee on top or take a cut of what you pay the tutor.",
  },
  {
    question: "What happens if my child doesn't get along with the tutor?",
    answer:
      "Tell us and we'll propose a replacement at no extra cost. A personality mismatch in the first few sessions is common and isn't something you need to push through.",
  },
  {
    question: 'Are tuition agencies in Singapore regulated?',
    answer:
      'No. Agencies that match parents with tutors are not licensed by MOE. MOE registration applies to tuition centres that enrol 10 or more students on a physical premises, not to agencies that place independent tutors.',
  },
  {
    question: 'How do I verify a tutor is really MOE-trained?',
    answer:
      "Ask to see their MOE service record or teaching certificate directly. A reputable agency will already have checked this before proposing the tutor, and should be willing to show you what it verified.",
  },
];

/** Everything the page shows as a question, in the order it appears. */
export const ALL_FAQS = [
  ...AGENCY_ANSWERS.map(({ question, answer }) => ({ question, answer })),
  ...AGENCY_FAQS,
];
