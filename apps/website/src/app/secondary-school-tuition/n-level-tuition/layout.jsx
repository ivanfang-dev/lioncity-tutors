import { DEFAULT_OG_IMAGE } from '@/lib/seo/openGraph';
export const metadata = {
    title: 'N-Level Tuition Singapore | N(A) and N(T) Home Tutors',
    description: 'N-Level tuition in Singapore for N(A) and N(T) students — hand-matched tutors for English, Maths and Combined Science, plus the official 2026 exam dates.',
    keywords: [
      'N Level tuition Singapore',
      'N Level home tutor',
      'N(A) tuition',
      'N(T) tuition',
      'Normal Academic tuition',
      'Normal Technical tuition',
      'N Level Maths tuition',
      'N Level English tuition',
      'Combined Science tuition',
      'Sec 4 N Level tuition'
    ],
    openGraph: {
      images: [DEFAULT_OG_IMAGE],
      title: 'N-Level Tuition Singapore | N(A) and N(T) Home Tutors',
      description: 'N-Level tuition in Singapore for N(A) and N(T) students, with hand-matched tutors for English, Maths and Combined Science.',
      url: 'https://www.lioncitytutors.com/secondary-school-tuition/n-level-tuition',
      type: 'website',
    },
    twitter: {
      images: [DEFAULT_OG_IMAGE.url],
      card: 'summary_large_image',
      title: 'N-Level Tuition Singapore | N(A) and N(T) Home Tutors',
      description: 'N-Level tuition in Singapore for N(A) and N(T) students, with hand-matched tutors for English, Maths and Combined Science.',
    },
    alternates: {
      canonical: 'https://www.lioncitytutors.com/secondary-school-tuition/n-level-tuition',
    },
  };


export default function NLevelTuitionLayout({ children }) {
    return children;
  } 