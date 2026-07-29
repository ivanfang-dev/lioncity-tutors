/**
 * FAQ content for the PSLE hub. Rendered as visible text on the page AND
 * emitted as FAQPage JSON-LD — the two must always match, so both read from here.
 *
 * FAQ[0]'s answer also doubles as the intro paragraph for the "When is the
 * PSLE in 2026?" timetable section, so it must stand alone as a complete,
 * self-contained answer to that exact question.
 *
 * Dates are sourced from apps/website/src/data/examCalendar2026.mjs — never
 * hardcode a date here without updating that module first.
 */
export const PSLE_FAQS = [
  {
    // also used as the timetable section's intro paragraph; targets "psle timetable 2026"
    question: 'When is the PSLE in 2026?',
    answer:
      'The 2026 PSLE runs across three windows. Oral examinations for English and Mother Tongue are held on 12–13 August, listening comprehension follows on 15 September, and the written papers for all subjects run from 24 to 30 September. Results are released on 24–25 November 2026.',
  },
  {
    question: 'What are the PSLE Achievement Level (AL) score bands?',
    answer:
      "Each PSLE subject is graded on an Achievement Level scale from AL1 (a raw score of 90 and above) down to AL8 (below 20), across eight bands. A child's PSLE Score sums the AL for English, Mathematics, Science and Mother Tongue, giving a total between 4 and 32, where a lower score is better.",
  },
  {
    question: 'What is considered a good PSLE AL score?',
    answer:
      "There is no single good score — it depends on the secondary schools you are targeting. A PSLE Score in the single digits is highly competitive island-wide, and the mid-teens suits many mainstream schools comfortably. Each school's actual posting range is published by MOE only after results are out, so treat any earlier number as a guide, not a guarantee.",
  },
  {
    question: 'How many hours a week should my child revise for PSLE?',
    answer:
      'Most PSLE candidates do well on 45 minutes to an hour of focused practice on school days, rising to two to three hours across the weekend for timed papers and review. Quality and consistency matter more than raw hours — a tired child grinding through a fourth hour learns less than one who stops and rests.',
  },
  {
    question: 'What is Higher Mother Tongue and who should take it?',
    answer:
      "Higher Mother Tongue (HMT) is an optional, more demanding syllabus for pupils with strong aptitude, usually taken up on a school's recommendation after Primary 4. It is graded separately as Distinction, Merit or Pass, does not count towards the PSLE Score, but can break ties for secondary posting and support Higher Mother Tongue eligibility at secondary level.",
  },
];
