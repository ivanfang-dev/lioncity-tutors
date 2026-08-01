import { rangeFor } from './rates.mjs';

// Composed from the rate card, not typed, so the SERP snippet cannot quote a
// price the page no longer charges.
const band = (id) => {
  const { min, max } = rangeFor(id);
  return `$${min}-$${max}`;
};

const TITLE = 'Tuition Rates in Singapore 2026 | LionCity Tutors';
const DESCRIPTION =
  `Singapore tuition rates by level and tutor type — primary ${band('primary')}, secondary ${band('secondary')} and JC ${band('jc')} an hour. Our own rate card, and no agency fee for parents.`;

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    'tuition rates Singapore',
    'math tuition rates',
    'maths tutor rates',
    'secondary tuition rates',
    'secondary school tuition rates',
    'o level tuition rates',
    'JC tuition rates',
    'private tutor rates Singapore'
  ],
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: 'https://www.lioncitytutors.com/tuition-rates',
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.lioncitytutors.com/tuition-rates',
  },
};

export default function TuitionRatesLayout({ children }) {
  return children;
}
