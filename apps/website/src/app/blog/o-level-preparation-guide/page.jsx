import GuideSchema from '@/components/seo/GuideSchema';
import OLevelPrepGuideClient from './client';
import { O_LEVEL_FAQS } from './faqs.mjs';
import { DEFAULT_OG_IMAGE } from '@/lib/seo/openGraph';

export const metadata = {
  title: 'How to Prepare for O-Levels: 21 Tips From Tutors (2026)',
  description:
    'The study plan and 21 exam-tested tips our O-Level tutors actually use — timing rules, prelim recovery, and subject-by-subject strategy for the 2026 O-Levels.',
  keywords: [
    'O Level tips', 'O Level study tips', 'how to ace O Levels',
    'how to prepare for O Level', 'O Level preparation tips',
    'how to improve grades before O Levels', 'O Level exam preparation',
    'how to study for O Levels', 'O Level preparation 2026',
    'O Level timetable 2026', 'GCE O Level Singapore', 'L1R5 calculation',
    'O Level exam dates 2026', 'SEAB O Level',
  ],
  openGraph: {
    images: [DEFAULT_OG_IMAGE],
    title: 'How to Prepare for O-Levels: 21 Tips From Tutors (2026)',
    description:
      '21 exam-tested tips from our O-Level tutors, the 2026 timetable, a term-by-term study plan, and how to recover if prelims went badly.',
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
          headline: 'How to Prepare for O-Levels: 21 Tips From Tutors (2026)',
          description:
            '21 exam-tested tips from our O-Level tutors, the 2026 timetable, a term-by-term study plan, and how to recover if prelims went badly.',
          datePublished: '2026-01-10',
          dateModified: '2026-08-11',
        }}
        faqs={O_LEVEL_FAQS}
      />
      <OLevelPrepGuideClient />
    </>
  );
}
