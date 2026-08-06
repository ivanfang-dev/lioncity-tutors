import { MATCH_TIME } from '@/data/promises';
import { regionFor } from '@/data/regions.mjs';
import { DEFAULT_OG_IMAGE } from '@/lib/seo/openGraph';

const region = regionFor('tuition-jurong-bukit-batok');

// Phase 1 title formula: front-loaded, under 60 characters.
const TITLE = 'Tuition in Jurong & Bukit Batok 2026 | LionCity Tutors';
const DESCRIPTION =
  `${region.tutorCount} tutors cover Jurong, Bukit Batok, Choa Chu Kang, Tengah and Clementi. We hand-match primary to H2 tutors within ${MATCH_TIME} — no agency fee for parents.`;

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    'tuition jurong',
    'home tuition bukit batok',
    'jurong tutor',
    'tuition choa chu kang',
    'tuition clementi',
    'jc tuition jurong',
  ],
  openGraph: {
    images: [DEFAULT_OG_IMAGE],
    title: TITLE,
    description: DESCRIPTION,
    url: 'https://www.lioncitytutors.com/tuition-jurong-bukit-batok',
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.lioncitytutors.com/tuition-jurong-bukit-batok',
  },
};

export default function JurongBukitBatokLayout({ children }) {
  return children;
}
