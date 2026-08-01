/**
 * FAQ content for /tuition-assignments. Rendered as visible text on the page
 * AND emitted as FAQPage JSON-LD, both from here.
 *
 * The page already ranks (position 15.6, 26 clicks — GSC, 3 months to
 * 2026-07-23) with no FAQ and no schema. The regional questions target
 * "tuition assignment east" (34.7), "tuition assignments east" (36.0),
 * "tuition assignment north east" (34.8) and "tuition assignments west"
 * (38.0) — low volume individually, one intent between them, and nothing on
 * the site addressed them.
 *
 * The commission figures come from our own tutor terms
 * (/terms-and-conditions-for-tutors) and the answer says so. Do not restate
 * them from memory anywhere else — link there instead.
 */
export const TUITION_ASSIGNMENTS_FAQS = [
  {
    question: 'Where can I find tuition assignments in Singapore?',
    answer:
      'On this page. Every open assignment we are hiring for is listed above with its level, subject, location and rate, and you can filter by level and subject or search by keyword. New assignments appear as parents request tutors, so the list changes through the week.',
  },
  {
    question: 'Are there tuition assignments in the east, west and north-east?',
    answer:
      'Yes — assignments are posted island-wide and each listing shows its location. There is no separate page per region: type an area into the search box above, such as Tampines, Jurong or Ang Mo Kio, and the list narrows to assignments whose location matches what you typed.',
  },
  {
    question: 'Do I need to register before applying for an assignment?',
    answer:
      'Yes. Applying asks for the email or phone number on your tutor profile so we can match the application to a vetted tutor. If we cannot find a profile, you are sent to the tutor registration form first, which takes a few minutes to complete.',
  },
  {
    question: 'How much commission does LionCity Tutors take?',
    answer:
      'For a long-term assignment the commission is a one-time amount equal to the first two weeks of lessons, collected from the client rather than deducted from you. Short-term assignments of 11 weeks or less are charged at 25% of lesson fees, capped by lesson count. Our tutor terms set out both in full.',
  },
  {
    question: 'What happens after I apply for an assignment?',
    answer:
      'You select the assignments you want, verify your profile, and propose the rate you would teach at. We put your profile forward to the parent, and if they choose you we confirm the assignment and pass on the schedule and contact details.',
  },
];
