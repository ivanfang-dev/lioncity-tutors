import { DEFAULT_OG_IMAGE } from '@/lib/seo/openGraph';
export const metadata = {
    title: 'Blog | LionCity Tutors',
    description: "Practical exam guides, study tips and parenting advice for Singapore families — PSLE, O-Level, A-Level and IB, from the LionCity Tutors team of tutors.",
    openGraph: {
      images: [DEFAULT_OG_IMAGE],
      title: 'Blog | LionCity Tutors',
      description: 'Explore expert tips, guides, and insights on tuition, exam preparation, and education in Singapore. LionCity Tutors’ blog helps parents and students make informed decisions for academic success.',
      url: 'https://www.lioncitytutors.com/blog',
      type: 'website',
    },
    alternates: {
      canonical: 'https://www.lioncitytutors.com/blog',
    },
  };

export default function BlogLayout({ children }) {
    return children;
} 