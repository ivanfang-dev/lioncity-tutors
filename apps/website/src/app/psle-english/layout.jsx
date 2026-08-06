import { DEFAULT_OG_IMAGE } from '@/lib/seo/openGraph';
export const metadata = {
  title: 'PSLE English Guide 2026: Papers, Timetable & Tips',
  description: 'PSLE English guide for Singapore parents — the 2026 exam timetable across all four papers, composition and oral strategy, and the AL1–AL8 scoring system.',
  keywords: [
    'PSLE English 2026',
    'PSLE English Singapore',
    'PSLE English guide',
    'Primary 6 English preparation',
    'PSLE English study tips',
    'PSLE English tuition Singapore',
    'English revision techniques',
    'PSLE composition',
    'PSLE comprehension'
  ],
  openGraph: {
    images: [DEFAULT_OG_IMAGE],
    title: 'PSLE English Guide 2026: Papers, Timetable & Tips',
    description: 'The official 2026 PSLE English exam timetable across all four papers, composition and oral strategy, for Singapore parents.',
    type: 'article',
    url: 'https://www.lioncitytutors.com/psle-english',
  },
  alternates: {
    canonical: 'https://www.lioncitytutors.com/psle-english',
  },
};

export default function PSLEEnglishGuideLayout({ children }) {
  return children;
} 