// This is now a Server Component (no 'use client')

import GuideSchema from '@/components/seo/GuideSchema';
import PSLEPreparationGuideClient from './client'; // Adjust the path if you name it differently
import { PSLE_FAQS } from './faqs.mjs';

// === CRITICAL SEO METADATA ===
export const metadata = {
  title: 'PSLE Preparation Guide 2026: Timetable & Study Plan',
  description:
    'Complete PSLE 2026 guide — official oral, listening and written exam dates, subject-by-subject strategies, and an AL scoring explainer for Singapore parents.',
  keywords: [
    'PSLE preparation guide',
    'PSLE 2026',
    'PSLE timetable 2026',
    'psle preparation',
    'Singapore PSLE',
    'AL scoring system',
    'PSLE tips for parents',
    'PSLE math heuristics',
    'PSLE science keywords',
    'how to prepare for PSLE'
  ],
  openGraph: {
    title: 'PSLE Preparation Guide 2026: Timetable & Study Plan',
    description: 'The official 2026 PSLE timetable, subject-by-subject strategies and an AL scoring explainer for Singapore parents.',
    url: 'https://www.lioncitytutors.com/blog/psle-preparation-guide',
    type: 'article',
  },
  alternates: {
    canonical: 'https://www.lioncitytutors.com/blog/psle-preparation-guide',
  },
};
// === END OF METADATA ===

// This page component now just renders the client component
export default function PSLEPreparationGuidePage() {
  return (
    <>
      <GuideSchema
        slug="psle-prep"
        article={{
          headline: 'PSLE Preparation Guide 2026: Timetable & Study Plan',
          description:
            'The official 2026 PSLE timetable, subject-by-subject strategies and an AL scoring explainer for Singapore parents.',
          datePublished: '2026-01-15',
          dateModified: '2026-07-28',
        }}
        faqs={PSLE_FAQS}
      />
      <PSLEPreparationGuideClient />
    </>
  );
}