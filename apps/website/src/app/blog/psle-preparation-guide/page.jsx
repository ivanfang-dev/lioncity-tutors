// This is now a Server Component (no 'use client')

import PSLEPreparationGuideClient from './client'; // Adjust the path if you name it differently

// === CRITICAL SEO METADATA ===
export const metadata = {
  title: 'The Ultimate Parent’s Guide to PSLE Preparation (2026) | LionCity Tutors',
  description: 'A complete, strategic roadmap for Singapore parents to navigate the PSLE syllabus, support their child emotionally, and unlock their full potential in 2026.',
  keywords: [
    'PSLE preparation guide',
    'PSLE 2026',
    'Singapore PSLE',
    'AL scoring system',
    'PSLE tips for parents',
    'PSLE math heuristics',
    'PSLE science keywords',
    'how to prepare for PSLE'
  ],
  openGraph: {
    title: 'The Ultimate Parent’s Guide to PSLE Preparation (2026) | LionCity Tutors',
    description: 'A complete roadmap for parents to navigate the PSLE syllabus, support their child emotionally, and unlock their full potential.',
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
    <PSLEPreparationGuideClient />
  );
}