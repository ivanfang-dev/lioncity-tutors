import { getLevelCategory } from '@lioncity/shared/utils/levelCategory.js';

// The inputs behind each interested tutor's score, shown raw. Phase 6 adds the recorded component
// breakdown (and with it, bars); until the decision log exists, the honest thing is to show the
// fields the score is computed FROM rather than invent a visualisation of numbers we didn't store.

export default function CandidateBreakdown({ contacts, tutorsById, level }) {
  const candidates = contacts
    .filter(c => c.status === 'Interested')
    .sort((a, b) => (a.shortlistRank ?? Infinity) - (b.shortlistRank ?? Infinity));

  if (candidates.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-[var(--color-border)] bg-white p-6 text-center text-sm text-[var(--color-text-tertiary)]">
        No interested tutors yet.
      </p>
    );
  }

  const levelCategory = getLevelCategory(level);

  return (
    <ul className="grid gap-2">
      {candidates.map(contact => {
        const tutor = tutorsById[contact.tutorId?.toString()];
        const rate = tutor?.hourlyRate?.[levelCategory] || tutor?.hourlyRate?.secondary;
        const stats = tutor?.responseStats;

        return (
          <li key={contact.tutorId} className="rounded-lg border border-[var(--color-border)] bg-white p-3">
            <p className="text-sm font-medium text-[var(--color-text-default)]">
              {contact.shortlistRank != null && (
                <span className="mr-1.5 rounded bg-[#0474BA]/10 px-1.5 py-0.5 text-[11px] font-semibold text-[#03649f]">
                  #{contact.shortlistRank}
                </span>
              )}
              {contact.tutorName || tutor?.fullName || 'Tutor'}
              {contact.shortlistRank == null && (
                <span className="ml-1.5 text-xs font-normal text-[var(--color-text-tertiary)]">backup</span>
              )}
            </p>

            {tutor ? (
              <dl className="mt-1.5 grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
                <div className="flex gap-1.5">
                  <dt className="text-[var(--color-text-tertiary)]">Experience</dt>
                  <dd className="text-[var(--color-text-default)]">{tutor.yearsOfExperience || '—'}</dd>
                </div>
                <div className="flex gap-1.5">
                  <dt className="text-[var(--color-text-tertiary)]">Type</dt>
                  <dd className="text-[var(--color-text-default)]">{tutor.tutorType || '—'}</dd>
                </div>
                <div className="flex gap-1.5">
                  <dt className="text-[var(--color-text-tertiary)]">Asks</dt>
                  <dd className="tabular-nums text-[var(--color-text-default)]">{rate || '—'}</dd>
                </div>
                <div className="flex gap-1.5">
                  <dt className="text-[var(--color-text-tertiary)]">Replies</dt>
                  <dd className="tabular-nums text-[var(--color-text-default)]">
                    {stats?.contacted ? `${stats.responded || 0}/${stats.contacted}` : 'new'}
                  </dd>
                </div>
              </dl>
            ) : (
              <p className="mt-1.5 text-xs text-[var(--color-text-tertiary)]">
                Tutor profile no longer available.
              </p>
            )}
          </li>
        );
      })}
    </ul>
  );
}
