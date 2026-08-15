import { DEFAULT_OG_IMAGE } from '@/lib/seo/openGraph';
import BlogClient from './client';

// The index's metadata lives here rather than in a shared blog/layout.jsx.
//
// It used to sit in the layout, because this page is a client component and cannot
// export metadata itself. But App Router metadata is INHERITED by every descendant,
// so `alternates.canonical: '/blog'` in the layout silently became the canonical for
// any post that did not declare its own — telling Google to index /blog instead of
// the post. /blog/benefits-of-private-tuition was live in that state.
//
// Keeping the canonical on the page, and splitting the client body into ./client.jsx,
// means it can only ever describe this URL. See the guard in blog-canonicals.test.mjs.
export const metadata = {
  title: 'Blog | LionCity Tutors',
  description:
    'Practical exam guides, study tips and parenting advice for Singapore families — PSLE, O-Level, A-Level and IB, from the LionCity Tutors team of tutors.',
  openGraph: {
    images: [DEFAULT_OG_IMAGE],
    title: 'Blog | LionCity Tutors',
    description:
      'Explore expert tips, guides, and insights on tuition, exam preparation, and education in Singapore. LionCity Tutors’ blog helps parents and students make informed decisions for academic success.',
    url: 'https://www.lioncitytutors.com/blog',
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.lioncitytutors.com/blog',
  },
};

export default function BlogIndex() {
  return <BlogClient />;
}
