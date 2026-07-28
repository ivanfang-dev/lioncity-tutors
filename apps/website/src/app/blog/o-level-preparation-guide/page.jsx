import OLevelPrepGuideClient from './client';

export const metadata = {
  title: 'Ultimate O-Level Prep Guide (2026) - A1 Study Strategies | LionCity Tutors',
  description: 'The definitive 2026 O-Level preparation guide for Singapore students. Master the L1R5 system, subject strategies for English, A-Math, and Sciences, and proven study techniques.',
  keywords: [
    'O Level preparation 2026',
    'GCE O Level Singapore',
    'O Level study guide',
    'L1R5 calculation',
    'how to score A1 O Level',
    'O Level Additional Mathematics tips',
    'Combined Science study plan',
    'O Level English essay',
    'Singapore O Level subjects',
    'SEAB O Level',
    'O Level tuition'
  ],
  openGraph: {
    title: 'Ultimate O-Level Prep Guide (2026) - A1 Study Strategies | LionCity Tutors',
    description: 'The definitive 2026 O-Level preparation guide for Singapore students. Master the L1R5 system, subject strategies, and proven study techniques.',
    url: 'https://www.lioncitytutors.com/blog/o-level-preparation-guide',
    type: 'article',
  },
  alternates: {
    canonical: 'https://www.lioncitytutors.com/blog/o-level-preparation-guide',
  },
};

export default function OLevelPrepGuidePage() {
  return <OLevelPrepGuideClient />;
} 