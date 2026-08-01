/**
 * FAQ content for /register-tutor. Rendered as visible text on the page AND
 * emitted as FAQPage JSON-LD, both from here.
 *
 * The page already ranks (position 13.0, 33 clicks — GSC, 3 months to
 * 2026-07-23) on a 37-character title and a 48-character description, with no
 * FAQ, no schema and no internal links. It is a supply-side page: every
 * question below is one a prospective tutor asks before signing up.
 *
 * Commission figures come from our own tutor terms
 * (/terms-and-conditions-for-tutors) and the answer says so. Rate figures are
 * read from the rate card rather than retyped, so this page cannot quote a
 * number /tuition-rates has since changed.
 */
import { overallRange } from '../tuition-rates/rates.mjs';

const { min: LOWEST_RATE, max: HIGHEST_RATE } = overallRange();

export const REGISTER_TUTOR_FAQS = [
  {
    question: 'Who can register as a tutor with LionCity Tutors?',
    answer:
      'Undergraduates, full-time tutors and MOE-trained teachers all register through the same form. You tell us the levels and subjects you teach, your qualifications and where you can travel, and we match you against assignments that fit rather than posting your profile publicly.',
  },
  {
    question: 'Does it cost anything to register as a tutor?',
    answer:
      'No. Registering and applying for assignments are free. We take a one-time commission only when an assignment you applied for is confirmed and lessons begin — equal to the first two weeks of lessons on a long-term assignment. Our tutor terms set out the short-term rates too.',
  },
  {
    question: 'What rate can I charge as a tutor?',
    answer:
      `You propose your own rate when you apply for an assignment. Our published rate card shows what parents in Singapore pay by level and tutor type, from $${LOWEST_RATE} an hour for an undergraduate at primary level to $${HIGHEST_RATE} for an MOE-trained teacher at JC.`,
  },
  {
    question: 'How soon will I get an assignment after registering?',
    answer:
      'It depends on your subjects, levels and location matching an open request — registering does not queue you for a placement. The practical step after registering is to browse the open assignments yourself and apply to the ones that fit your schedule.',
  },
];
