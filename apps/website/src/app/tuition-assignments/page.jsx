import { Suspense } from 'react';
import TuitionAssignmentsClient from './TuitionAssignmentsClient';

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

export async function generateMetadata({ searchParams }) {
  const levelFilter = searchParams.level || '';
  const subjectFilter = searchParams.subject || '';

  const titleParts = [
    levelFilter,
    subjectFilter,
    'Tuition Assignments in Singapore',
  ].filter(Boolean);
  
  const pageTitle = `${titleParts.join(' ')} | LionCity Tutors`;
  const pageDescription = `Find the latest home tuition jobs for ${levelFilter || 'all levels'} and ${subjectFilter || 'all subjects'} in Singapore. Apply instantly and start tutoring with LionCity Tutors.`;
  const canonicalUrl = `https://www.lioncitytutors.com/tuition-assignments${levelFilter ? `?level=${levelFilter}` : ''}${subjectFilter ? `&subject=${subjectFilter}` : ''}`;

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: [
      'tuition assignments Singapore',
      'tutoring jobs',
      levelFilter ? `${levelFilter} tutor jobs` : null,
      subjectFilter ? `${subjectFilter} tuition assignments` : null,
      'private tutor opportunities',
      'home tutoring jobs Singapore'
    ].filter(Boolean),
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: canonicalUrl,
      type: 'website',
    },
    twitter: {
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
    <Suspense fallback={<div>Loading assignments...</div>}>
      <TuitionAssignmentsClient initialAssignments={initialAssignments} />
    </Suspense>
  );
}