import { DEFAULT_OG_IMAGE } from '@/lib/seo/openGraph';
export const metadata = {
  title: 'PSLE Chinese Guide 2026: Marks, Timetable & Tips',
  description: 'PSLE Chinese guide for Singapore parents — exactly how marks are broken down across three papers, the 2026 exam timetable, and composition and oral strategy.',
  keywords: [
    'PSLE Chinese 2026',
    'PSLE Chinese Singapore',
    'PSLE Chinese guide',
    'PSLE Chinese marks breakdown',
    'Primary 6 Chinese preparation',
    'PSLE Chinese study tips',
    'PSLE Chinese tuition Singapore',
    'Chinese revision techniques',
    'PSLE composition',
    'PSLE comprehension',
    '华文会考'
  ],
  openGraph: {
    images: [DEFAULT_OG_IMAGE],
    title: 'PSLE Chinese Guide 2026: Marks, Timetable & Tips',
    description: 'How PSLE Chinese marks are broken down across three papers, the official 2026 exam timetable, and composition and oral strategy.',
    type: 'article',
    url: 'https://www.lioncitytutors.com/psle-chinese',
  },
  alternates: {
    canonical: 'https://www.lioncitytutors.com/psle-chinese',
  },
};

export default function PSLEChineseGuideLayout({ children }) {
  return children;
} 