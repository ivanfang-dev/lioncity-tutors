import GuideSchema from '@/components/seo/GuideSchema';
import OLevelPrepGuideClient from './client';
import { O_LEVEL_FAQS } from './faqs.mjs';

export const metadata = {
  title: 'O-Level Preparation Guide 2026: Complete Study Plan',
  description:
    'Full GCE O-Level prep guide for 2026 — the official exam timetable, subject-by-subject strategies, a term-by-term plan, and the mistakes that cost students an A1.',
  keywords: [
    'O Level preparation 2026', 'O Level timetable 2026', 'GCE O Level Singapore',
    'O Level study guide', 'L1R5 calculation', 'how to score A1 O Level',
    'O Level preparation tips', 'how to improve grades before O Levels',
    'O Level exam dates 2026', 'SEAB O Level',
  ],
  openGraph: {
    title: 'O-Level Preparation Guide 2026: Complete Study Plan',
    description:
      'The official 2026 O-Level timetable, subject strategies and a term-by-term revision plan for Singapore students.',
    url: 'https://www.lioncitytutors.com/blog/o-level-preparation-guide',
    type: 'article',
  },
  alternates: {
    canonical: 'https://www.lioncitytutors.com/blog/o-level-preparation-guide',
  },
};

export default function OLevelPrepGuidePage() {
  return (
    <>
      <GuideSchema
        slug="o-level-prep"
        article={{
          headline: 'O-Level Preparation Guide 2026: Complete Study Plan',
          description:
            'The official 2026 O-Level timetable, subject strategies and a term-by-term revision plan for Singapore students.',
          datePublished: '2026-01-10',
          dateModified: '2026-07-27',
        }}
        faqs={O_LEVEL_FAQS}
      />
      <OLevelPrepGuideClient />
    </>
  );
}
