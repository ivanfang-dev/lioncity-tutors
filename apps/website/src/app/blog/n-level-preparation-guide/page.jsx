import GuideSchema from '@/components/seo/GuideSchema';
import NLevelPrepClient from './client';
import { N_LEVEL_FAQS } from './faqs.mjs';
import { DEFAULT_OG_IMAGE } from '@/lib/seo/openGraph';

// Searchers mostly want dates, so lead with them. Dates match examCalendar2026.mjs.
const N_LEVEL_TITLE = 'N-Level 2026 Dates, Timetable & Results Day | N(A) vs N(T)';
const N_LEVEL_DESCRIPTION =
  '2026 N-Level exams: 13 July – 13 October. Results: 17–21 December 2026. Full SEAB timetable for N(A) and N(T), what each track means, and routes after Sec 4.';

export const metadata = {
  title: N_LEVEL_TITLE,
  description: N_LEVEL_DESCRIPTION,
  keywords: [
    'N Level meaning', 'GCE N Level meaning', 'N Level Singapore', 'N(A) vs N(T)',
    'N Level preparation 2026', 'N Level timetable 2026', 'PFP route', 'DPP route',
    'N Level to O Level', 'Normal Academic', 'Normal Technical',
  ],
  openGraph: {
    images: [DEFAULT_OG_IMAGE],
    title: N_LEVEL_TITLE,
    description: N_LEVEL_DESCRIPTION,
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
          headline: N_LEVEL_TITLE,
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
