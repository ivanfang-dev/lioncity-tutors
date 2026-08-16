import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { MATCH_TIME } from '@/data/promises';

/** The masthead for a regional tuition page: H1, value line, primary CTA. */
export default function RegionHero({ region }) {
  return (
    <div className="text-center mb-16">
      <h1 className="page-title text-primary mb-6">
        Tuition in {region.headline}
      </h1>
      <p className="text-lg md:text-xl text-text-default/80 max-w-3xl mx-auto mb-10 text-pretty">
        Tell us the level and subject and we hand-match a vetted tutor covering {region.name},
        usually within {MATCH_TIME} &mdash; no agency fee for parents.
      </p>
      <Link
        href="/request-tutor"
        className="group inline-flex items-center gap-2 bg-accent hover:opacity-90 text-text-inverse font-bold px-8 py-4 rounded-full shadow-lg text-lg"
      >
        Request a Tutor
        <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
      </Link>
    </div>
  );
}
