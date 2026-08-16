import Link from 'next/link';
import { DEFAULT_OG_IMAGE } from '@/lib/seo/openGraph';

export const metadata = {
  title: '404 Not Found | LionCity Tutors',
  description: "Sorry, the page you're looking for doesn't exist or may have moved. Head back to the LionCity Tutors homepage to find a tutor or browse our free guides.",
  openGraph: {
    images: [DEFAULT_OG_IMAGE],
    title: '404 Not Found | LionCity Tutors',
    description: "Sorry, the page you're looking for doesn't exist or may have moved. Head back to the LionCity Tutors homepage to find a tutor or browse our free guides.",
    url: 'https://www.lioncitytutors.com/404',
    type: 'website',
  },
};

export default function NotFound() {
  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-white px-6 py-12 text-center">
        <h1 className="page-title text-primary mb-4">404</h1>
        <p className="text-xl font-semibold text-gray-800 mb-2">Oops! Page not found.</p>
        <p className="text-gray-600 mb-6">
          The page you're looking for doesn't exist or may have moved.
        </p>
        <Link
          href="/"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Go back to Home
        </Link>
      </div>
    </>
  );
}
