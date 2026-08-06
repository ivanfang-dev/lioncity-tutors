import { Suspense } from 'react';
import Link from 'next/link';
import { HelpCircle } from 'lucide-react';
import GuideSchema from '@/components/seo/GuideSchema';
import { SectionHeading } from '@/components/guide';
import TuitionAssignmentsClient from './TuitionAssignmentsClient';
import { TUITION_ASSIGNMENTS_FAQS } from './faqs.mjs';
import { DEFAULT_OG_IMAGE } from '@/lib/seo/openGraph';

// Helper function to fetch data on the server
async function getAssignments() {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
    // Using fetch with revalidation for fresh data (cache for 5 minutes)
    const response = await fetch(`${backendUrl}/api/assignments`, {
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

const TITLE_SUFFIX = ' | LionCity Tutors';

export async function generateMetadata({ searchParams }) {
  const levelFilter = searchParams.level || '';
  const subjectFilter = searchParams.subject || '';
  const filtered = Boolean(levelFilter || subjectFilter);

  // "Singapore" only fits in the unfiltered title; with both filters applied
  // the string would run past 60 characters and truncate in the SERP.
  const pageTitle = filtered
    ? `${[levelFilter, subjectFilter, 'Tuition Assignments'].filter(Boolean).join(' ')}${TITLE_SUFFIX}`
    : `Tuition Assignments in Singapore${TITLE_SUFFIX}`;

  const pageDescription = filtered
    ? `Open ${[levelFilter, subjectFilter].filter(Boolean).join(' ')} home tuition assignments in Singapore, with the location and rate on every listing. Apply online in minutes as a vetted tutor.`
    : 'Open home tuition assignments across Singapore — every level and subject, with the location and rate on each listing. Apply online in minutes as a vetted tutor.';

  const query = new URLSearchParams();
  if (levelFilter) query.set('level', levelFilter);
  if (subjectFilter) query.set('subject', subjectFilter);
  const suffix = query.toString() ? `?${query}` : '';
  const canonicalUrl = `https://www.lioncitytutors.com/tuition-assignments${suffix}`;

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: [
      'tuition assignments Singapore',
      'tuition assignment east',
      'tuition assignments west',
      'tutoring jobs Singapore',
      levelFilter ? `${levelFilter} tutor jobs` : null,
      subjectFilter ? `${subjectFilter} tuition assignments` : null,
      'private tutor opportunities',
      'home tutoring jobs Singapore'
    ].filter(Boolean),
    openGraph: {
      images: [DEFAULT_OG_IMAGE],
      title: pageTitle,
      description: pageDescription,
      url: canonicalUrl,
      type: 'website',
    },
    twitter: {
      images: [DEFAULT_OG_IMAGE.url],
      card: 'summary_large_image',
      title: pageTitle,
      description: pageDescription,
    },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default async function TuitionAssignmentsPage() {
  const initialAssignments = await getAssignments();

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
        <TuitionAssignmentsClient initialAssignments={initialAssignments} />
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
