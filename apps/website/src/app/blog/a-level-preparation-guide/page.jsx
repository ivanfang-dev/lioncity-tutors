import GuideSchema from '@/components/seo/GuideSchema';
import ALevelPrepClient from './client';
import { A_LEVEL_FAQS } from './faqs.mjs';
import { DEFAULT_OG_IMAGE } from '@/lib/seo/openGraph';

export const metadata = {
  title: 'A-Level Preparation Guide 2026: H1 & H2 Study Plan',
  description:
    'Complete 2026 GCE A-Level guide — the official exam timetable, the revised H2 science syllabuses, and a full JC1-to-JC2 revision plan for Singapore students.',
  keywords: ['A-Level Preparation', 'A-Level Singapore', 'JC Tuition', 'A-Level Study Guide', 'LionCity Tutors', 'H2 Math', 'H2 Chemistry', 'H2 Physics', 'H1 General Paper', 'A-Level Economics', 'Singapore Education', 'A-Level 2026'],
  openGraph: {
    images: [DEFAULT_OG_IMAGE],
    title: 'A-Level Preparation Guide 2026: H1 & H2 Study Plan',
    description:
      'The official 2026 A-Level timetable, the revised H2 science syllabuses and a JC1-to-JC2 revision plan for Singapore students.',
    url: 'https://www.lioncitytutors.com/blog/a-level-preparation-guide',
    type: 'article',
  },
  alternates: {
    canonical: 'https://www.lioncitytutors.com/blog/a-level-preparation-guide',
  },
};

export default function ALevelPreparationPage() {
  return (
    <>
      <GuideSchema
        slug="a-level-prep"
        article={{
          headline: 'A-Level Preparation Guide 2026: H1 & H2 Study Plan',
          description:
            'The official 2026 A-Level timetable, the revised H2 science syllabuses and a JC1-to-JC2 revision plan for Singapore students.',
          datePublished: '2026-01-10',
          dateModified: '2026-07-28',
        }}
        faqs={A_LEVEL_FAQS}
      />
      <ALevelPrepClient />
    </>
  );
}
