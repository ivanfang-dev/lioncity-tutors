import { RelatedGuides } from '@/components/guide';
import { MATCH_TIME } from '@/data/promises';

const TITLE = 'Secondary School Tuition Singapore | LionCity Tutors';
const DESCRIPTION =
  `Secondary school tuition in Singapore for Sec 1 to Sec 5, across the O-Level and N-Level tracks. Tutors hand-matched in ${MATCH_TIME}, with no agency fee for parents.`;

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    'secondary school tuition Singapore',
    'secondary tuition rates',
    'O-Level preparation',
    'secondary school tutor',
    'Sec 1-4 tuition',
    'N-Level tuition',
    'O-Level math tuition',
    'secondary science tuition'
  ],
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: 'https://www.lioncitytutors.com/secondary-school-tuition',
    type: 'website',
    images: [
      {
        url: 'https://www.lioncitytutors.com/jc-tuition_optimized.webp',
        alt: 'Secondary School Tuition Singapore',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: ['https://www.lioncitytutors.com/jc-tuition_optimized.webp'],
  },
  alternates: {
    canonical: 'https://www.lioncitytutors.com/secondary-school-tuition',
  },
};

/**
 * RelatedGuides lives in the layout because the page itself is a client
 * component and this needs to be server-rendered. GuideSchema is NOT here —
 * it moved to page.jsx, because this layout also wraps the o-level-tuition
 * and n-level-tuition sub-routes, and having it here duplicated the
 * BreadcrumbList + Course JSON-LD on every one of those pages.
 */
export default function SecondarySchoolTuitionLayout({ children }) {
  return (
    <>
      {children}
      <div className="mx-auto max-w-3xl px-4 sm:px-6 pb-16">
        <RelatedGuides slug="secondary-school-tuition" heading="Guides for secondary students" />
      </div>
    </>
  );
}
