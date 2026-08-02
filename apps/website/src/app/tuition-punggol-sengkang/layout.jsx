import { MATCH_TIME } from '@/data/promises';
import { regionFor } from '@/data/regions.mjs';

const region = regionFor('tuition-punggol-sengkang');

// Phase 1 title formula: front-loaded, under 60 characters.
const TITLE = 'Tuition in Punggol & Sengkang 2026 | LionCity Tutors';
const DESCRIPTION =
  `${region.tutorCount} tutors cover Punggol, Sengkang, Hougang, Serangoon and Kovan. We hand-match primary, secondary and JC tutors within ${MATCH_TIME} — no agency fee for parents.`;

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    'tuition punggol',
    'home tuition sengkang',
    'punggol tutor',
    'tuition hougang',
    'tuition serangoon',
    'primary school tuition punggol',
  ],
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: 'https://www.lioncitytutors.com/tuition-punggol-sengkang',
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.lioncitytutors.com/tuition-punggol-sengkang',
  },
};

export default function PunggolSengkangLayout({ children }) {
  return children;
}
