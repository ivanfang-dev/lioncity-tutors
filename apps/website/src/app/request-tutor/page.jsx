import GuideSchema from '@/components/seo/GuideSchema';
import { RelatedGuides } from '@/components/guide';
import { MATCH_TIME } from '@/data/promises';
import RequestForTutorClient from './client';

export default function RequestForTutor() {
  return (
    <>
      <GuideSchema
        slug="find-a-tutor"
        service={{
          name: 'Tutor matching in Singapore',
          description: `Tell us the level, subject and area and we hand-match a vetted tutor, usually within ${MATCH_TIME}. No agency fee for parents.`,
        }}
      />
      <RequestForTutorClient />
      {/* Outside the client component's Suspense boundary (it wraps
          useSearchParams), so this reciprocal-link block is part of the
          static server-rendered HTML rather than trapped behind hydration. */}
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 pb-16">
          <RelatedGuides slug="find-a-tutor" heading="Not sure yet? Explore first" showHub={false} />
        </div>
      </div>
    </>
  );
}
