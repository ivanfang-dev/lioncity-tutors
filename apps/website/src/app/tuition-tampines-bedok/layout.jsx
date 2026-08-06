import { MATCH_TIME } from '@/data/promises';
import { regionFor } from '@/data/regions.mjs';
import { DEFAULT_OG_IMAGE } from '@/lib/seo/openGraph';

const region = regionFor('tuition-tampines-bedok');

// Phase 1 title formula: front-loaded, under 60 characters.
const TITLE = 'Tuition in Tampines & Bedok 2026 | LionCity Tutors';
const DESCRIPTION =
  `${region.tutorCount} tutors cover Tampines, Bedok, Pasir Ris, Simei and Marine Parade. We hand-match primary, secondary and JC tutors within ${MATCH_TIME} — no agency fee for parents.`;

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    'tuition tampines',
    'home tuition bedok',
    'tampines tutor',
    'tuition pasir ris',
    'tuition simei',
    'primary school tuition tampines',
  ],
  openGraph: {
    images: [DEFAULT_OG_IMAGE],
    title: TITLE,
    description: DESCRIPTION,
    url: 'https://www.lioncitytutors.com/tuition-tampines-bedok',
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.lioncitytutors.com/tuition-tampines-bedok',
  },
};

export default function TampinesBedokLayout({ children }) {
  return children;
}
