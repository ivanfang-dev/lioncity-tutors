import { observedFor, PLACEMENT_SAMPLE } from './placements.mjs';
import { DEFAULT_OG_IMAGE } from '@/lib/seo/openGraph';

// Composed from the observed-budget data, not typed, so the SERP snippet
// cannot quote a figure the page no longer shows.
const observedBand = (id) => {
  const { medianMin, medianMax } = observedFor(id);
  return `$${medianMin}-${medianMax}`;
};

const TITLE = 'Tuition Rates in Singapore 2026 | LionCity Tutors';
const DESCRIPTION =
  `Singapore tuition rates by level and tutor type, plus what ${PLACEMENT_SAMPLE} real parents here actually budgeted — primary ${observedBand('primary')}, secondary ${observedBand('secondary')}, JC ${observedBand('jc')} an hour.`;

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
    'private tutor rates Singapore',
    'moe teacher tuition rate',
    'undergraduate tutor rate singapore',
    'jc chemistry tuition rate',
    'h2 math tuition rate',
    'average tuition rate singapore'
  ],
  openGraph: {
    images: [DEFAULT_OG_IMAGE],
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
