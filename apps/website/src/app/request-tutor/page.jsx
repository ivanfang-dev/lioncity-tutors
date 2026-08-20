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
      {/* Outside the client component's Suspense boundary (it wraps
          useSearchParams), so the page's only <h1> is part of the static
          server-rendered HTML rather than trapped behind hydration. */}
      {/* `px-4` is not cosmetic here: this block had no horizontal padding at
          all, so the h1 ran from x=0 to x=390 on a phone with the text touching
          both screen edges. Neutral surface rather than the old blue-tinted
          gradient — DESIGN.md § The No Blue Wash Rule: trust comes from the blue
          ink, not from bathing the surface in it. */}
      <div className="bg-background-subtle border-b border-border py-6 sm:py-8 px-4 sm:px-6 text-center">
        <h1 className="page-title text-primary mb-2">Request a Tutor in Singapore</h1>
        <p className="text-text-secondary text-sm sm:text-base max-w-xl mx-auto text-pretty">
          Complete this form — 100% free, fast response guaranteed.
        </p>
      </div>
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
