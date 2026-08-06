import { DEFAULT_OG_IMAGE } from '@/lib/seo/openGraph';
export const metadata = {
  title: 'PSLE Math Guide 2026: Heuristics & Exam Timetable',
  description: 'PSLE Mathematics guide for Singapore parents — the 2026 exam timetable, heuristics like model drawing, and the AL1–AL8 scoring system explained clearly.',
  keywords: [
    'PSLE Math 2026',
    'PSLE Math Singapore',
    'PSLE Math guide',
    'Primary 6 Math preparation',
    'PSLE Math study tips',
    'PSLE Math tuition Singapore',
    'Math revision techniques',
    'PSLE problem solving',
    'PSLE heuristics'
  ],
  openGraph: {
    images: [DEFAULT_OG_IMAGE],
    title: 'PSLE Math Guide 2026: Heuristics & Exam Timetable',
    description: 'The official 2026 PSLE Maths exam timetable, heuristics like model drawing, and the AL1–AL8 scoring system explained for Singapore parents.',
    type: 'article',
    url: 'https://www.lioncitytutors.com/psle-math',
  },
  alternates: {
    canonical: 'https://www.lioncitytutors.com/psle-math',
  },
};

export default function PSLEMathGuideLayout({ children }) {
  return children;
} 