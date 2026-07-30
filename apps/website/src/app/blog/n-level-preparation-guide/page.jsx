import GuideSchema from '@/components/seo/GuideSchema';
import NLevelPrepClient from './client';
import { N_LEVEL_FAQS } from './faqs.mjs';

export const metadata = {
  title: 'N-Level Guide 2026: What N(A) and N(T) Mean & How to Prep',
  description:
    'What the GCE N-Level is, how N(A) and N(T) differ, the official 2026 exam timetable, and the PFP and DPP routes to polytechnic after Secondary 4 in Singapore.',
  keywords: [
    'N Level meaning', 'GCE N Level meaning', 'N Level Singapore', 'N(A) vs N(T)',
    'N Level preparation 2026', 'N Level timetable 2026', 'PFP route', 'DPP route',
    'N Level to O Level', 'Normal Academic', 'Normal Technical',
  ],
  openGraph: {
    title: 'N-Level Guide 2026: What N(A) and N(T) Mean & How to Prep',
    description:
      'What the GCE N-Level is, how the N(A) and N(T) tracks differ, and the official 2026 examination timetable.',
    url: 'https://www.lioncitytutors.com/blog/n-level-preparation-guide',
    type: 'article',
  },
  alternates: {
    canonical: 'https://www.lioncitytutors.com/blog/n-level-preparation-guide',
  },
};

export default function NLevelPreparationPage() {
  return (
    <>
      <GuideSchema
        slug="n-level-prep"
        article={{
          headline: 'N-Level Guide 2026: What N(A) and N(T) Mean & How to Prep',
          description:
            'What the GCE N-Level is, how the N(A) and N(T) tracks differ, the official 2026 examination timetable, and the routes available after Secondary 4.',
          datePublished: '2026-01-10',
          dateModified: '2026-07-29',
        }}
        faqs={N_LEVEL_FAQS}
      />
      <NLevelPrepClient />
    </>
  );
}
