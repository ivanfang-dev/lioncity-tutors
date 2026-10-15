import { Suspense } from 'react';
import { BACKEND_URL } from '@/lib/backend';
import Link from 'next/link';
import { HelpCircle } from 'lucide-react';
import GuideSchema from '@/components/seo/GuideSchema';
import { SectionHeading } from '@/components/guide';
import TuitionAssignmentsClient from './TuitionAssignmentsClient';
import { TUITION_ASSIGNMENTS_FAQS } from './faqs.mjs';
import { DEFAULT_OG_IMAGE } from '@/lib/seo/openGraph';

// Fetches a backend assignment list, cached for 5 minutes; [] on any failure.
async function getAssignments(path = '/api/assignments') {
  try {
    const response = await fetch(`${BACKEND_URL}${path}`, {
      next: { revalidate: 300 }
    });
    if (!response.ok) {
        console.error('Failed to fetch assignments:', response.statusText);
        return [];
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching assignments:', error);
    return [];
  }
}

const PAGE_TITLE = 'Tuition Assignments in Singapore | LionCity Tutors';
const PAGE_DESCRIPTION = 'Open home tuition assignments across Singapore — every level and subject, with the location and rate on each listing. Apply online in minutes as a vetted tutor.';
const CANONICAL_URL = 'https://www.lioncitytutors.com/tuition-assignments';

// One URL for the page: ?level= / ?subject= links show the same list, so they canonicalise here.
export const metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  keywords: [
    'tuition assignments Singapore',
    'tuition assignment east',
    'tuition assignments west',
    'tutoring jobs Singapore',
    'private tutor opportunities',
    'home tutoring jobs Singapore'
  ],
  openGraph: {
    images: [DEFAULT_OG_IMAGE],
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: CANONICAL_URL,
    type: 'website',
  },
  twitter: {
    images: [DEFAULT_OG_IMAGE.url],
    card: 'summary_large_image',
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
  },
  alternates: {
    canonical: CANONICAL_URL,
  },
};

// ?apply=<id> comes from assignment emails; read here so the list stays server-rendered.
export default async function TuitionAssignmentsPage({ searchParams }) {
  const [initialAssignments, recentlyClosed] = await Promise.all([
    getAssignments(),
    getAssignments('/api/assignments/recently-closed'),
  ]);

  return (
    <>
      <GuideSchema
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Tuition Assignments', url: '/tuition-assignments' },
        ]}
        faqs={TUITION_ASSIGNMENTS_FAQS}
      />

      <Suspense fallback={<div>Loading assignments...</div>}>
        <TuitionAssignmentsClient initialAssignments={initialAssignments} recentlyClosed={recentlyClosed} applyAssignmentId={searchParams?.apply || null} />
      </Suspense>

      {/* Server-rendered so the answers are in the HTML whatever the listing
          above is doing — it depends on a backend fetch that can come back
          empty. */}
      <section aria-labelledby="assignment-faq" className="mx-auto max-w-3xl px-4 sm:px-6 py-16">
        <SectionHeading id="assignment-faq" icon={HelpCircle}>
          Tuition assignments: common questions
        </SectionHeading>
        <div className="space-y-6">
          {TUITION_ASSIGNMENTS_FAQS.map((faq) => (
            <div key={faq.question}>
              <h3 className="text-lg font-semibold text-gray-900">{faq.question}</h3>
              <p className="mt-2 text-gray-700 leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900">New to LionCity Tutors?</h2>
          <p className="mt-2 text-gray-700 leading-relaxed">
            Applying needs a vetted tutor profile, so{' '}
            <Link href="/register-tutor" className="font-semibold text-[#0474BA] underline underline-offset-2">
              register as a tutor
            </Link>{' '}
            first — it takes a few minutes. The{' '}
            <Link href="/terms-and-conditions-for-tutors" className="font-semibold text-[#0474BA] underline underline-offset-2">
              tutor terms
            </Link>{' '}
            set out commission in full, and{' '}
            <Link href="/tuition-rates" className="font-semibold text-[#0474BA] underline underline-offset-2">
              tuition rates in Singapore
            </Link>{' '}
            shows what parents expect to pay by level.
          </p>
        </div>
      </section>
    </>
  );
}
