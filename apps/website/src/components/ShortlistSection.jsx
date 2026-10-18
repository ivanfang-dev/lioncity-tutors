import { MATCH_TIME } from '@/data/promises';
import { PHYSICS_SHORTLIST } from '@/data/shortlists';
import ShortlistArtifact from '@/components/ShortlistArtifact';

const POINTS = [
  ['Vetted before you see them', 'Every tutor is interviewed and reference-checked before we send a profile.'],
  ['Ranked by fit', 'Filtered by level, subject and area, then ranked, so the best match is the first one you read.'],
  ['Not the right fit?', 'Tell us and we send more. Rematching costs you nothing.'],
];

/**
 * The home page's answer to "are these tutors any good?": the shortlist a parent receives, shown whole.
 * On phones the artifact sits between the claim and the points, so the proof arrives before the detail.
 */
export default function ShortlistSection() {
  return (
    <section className="section-padding bg-background-default">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:gap-x-16 lg:gap-y-10">
        <div className="lg:col-span-5 lg:row-start-1 lg:self-end">
          <h2 className="text-gray-900 text-balance">This is what lands on your WhatsApp.</h2>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-gray-600 text-pretty">
            Two to three tutor profiles, within {MATCH_TIME}. You see who they are, what they have taught and what they
            charge before anyone comes to your home.
          </p>
        </div>

        <div className="lg:col-span-7 lg:col-start-6 lg:row-span-2 lg:row-start-1">
          <ShortlistArtifact shortlist={PHYSICS_SHORTLIST} subject="physics" />
        </div>

        <dl className="divide-y divide-gray-200 border-y border-gray-200 lg:col-span-5 lg:row-start-2 lg:self-start">
          {POINTS.map(([term, detail]) => (
            <div key={term} className="py-5">
              <dt className="font-semibold text-gray-900">{term}</dt>
              <dd className="mt-1 leading-relaxed text-gray-600 text-pretty">{detail}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
