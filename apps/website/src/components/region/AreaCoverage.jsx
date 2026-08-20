import { Chip } from '@/components/guide';
import { TOTAL_TUTORS, REGIONS_REVIEWED } from '@/data/regions.mjs';

/** The coverage strip beneath the hero: tutor count, areas, review date. */
export default function AreaCoverage({ region }) {
  return (
    <div className="mb-16 rounded-2xl border border-border bg-background-card p-6 sm:p-8 shadow-sm">
      <p className="text-lg font-semibold text-primary">
        {region.tutorCount} of our {TOTAL_TUTORS} tutors cover {region.name}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {region.areas.map((area) => (
          <Chip key={area}>{area}</Chip>
        ))}
      </div>
      <p className="mt-4 text-xs text-text-secondary">Tutor coverage, reviewed {REGIONS_REVIEWED}.</p>
    </div>
  );
}
