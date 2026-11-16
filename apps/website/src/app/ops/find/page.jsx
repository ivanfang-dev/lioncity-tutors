import OpsHeader from '../OpsHeader';
import FindForm from './FindForm';
import TutorResultCard from './TutorResultCard';
import PostPanel from './PostPanel';
import { findTutors } from '@/lib/ops/botApi';
import { loadAssignment } from '@/lib/ops/data';
import { assignmentMatchesSearch } from '@/lib/ops/postAssignment.mjs';

// Hand-pick tutors for an assignment (posted or not) and message them directly.

const UNMAPPABLE_COPY = {
  level: 'That level isn’t one the matcher knows.',
  location: 'That location isn’t mapped to a tutor region.',
  subject: 'That subject isn’t one tutors can list for this level.',
};

// Opening message pre-filled into each WhatsApp chat.
function outreachMessage({ level, subject, location }) {
  const where = location === 'Online' ? 'online' : `at ${location}`;
  return `Hi, Ivan from LionCity Tutors here. Would you be keen to tutor ${level} ${subject} ${where}?`;
}

async function search(criteria) {
  try {
    return { data: await findTutors(criteria) };
  } catch (err) {
    console.error('ops find-tutors failed:', err);
    return { error: true };
  }
}

export default async function FindPage({ searchParams }) {
  const criteria = {
    level: searchParams?.level || '',
    subject: searchParams?.subject || '',
    location: searchParams?.location || '',
    rate: searchParams?.rate || '',
    minExperience: searchParams?.minExperience || '',
    nearby: searchParams?.nearby === '1' ? '1' : '',
  };
  const assignmentId = searchParams?.assignmentId || '';
  const ready = criteria.level && criteria.subject && criteria.location;
  const [{ data, error }, loaded] = await Promise.all([
    ready ? search(criteria) : {},
    assignmentId ? loadAssignment(assignmentId) : null,
  ]);
  const results = data?.results || [];
  // A stale assignmentId (carried by the form into a new search) is ignored once the criteria change.
  const assignment = loaded && (!ready || assignmentMatchesSearch(loaded, criteria)) ? loaded : null;
  const canPost = ready && !assignment && !error && !data?.unmappable;

  // What auto-outreach already did with each tutor on this assignment, keyed by tutor id.
  const contactStatus = new Map(
    (assignment?.outreach?.contacts || []).map(c => [String(c.tutorId), c.status])
  );

  return (
    <>
      <OpsHeader
        title="Find tutors"
        subtitle={assignment ? `Contact history from ${assignment.title}` : 'Best matches first · nothing is sent automatically'}
        backHref={assignment ? `/ops/assignment/${assignment._id}` : '/ops'}
      />

      <div className="mx-auto max-w-3xl px-4 py-6">
        <FindForm initial={{ ...criteria, assignmentId: assignment ? String(assignment._id) : '' }} />

        {ready && (
          <section aria-labelledby="results" className="mt-6">
            <div className="mb-3 flex items-baseline justify-between gap-3">
              <h2 id="results" className="text-sm font-semibold text-[var(--color-text-default)]">
                {error
                  ? 'Search failed'
                  : `${results.length} match${results.length === 1 ? '' : 'es'}`}
              </h2>
              {/* The panel sits below a long list; this jumps to it. */}
              {canPost && (
                <a href="#post-heading" className="text-sm font-medium text-[var(--color-primary)] hover:underline">
                  📢 Post to channel ↓
                </a>
              )}
            </div>

            {error ? (
              <p role="alert" className="rounded-lg border border-[var(--color-error)]/30 bg-[var(--color-error)]/5 p-3 text-sm text-[var(--color-error)]">
                Couldn’t reach the matcher. Try again in a moment.
              </p>
            ) : data?.unmappable ? (
              <p className="rounded-lg border border-dashed border-[var(--color-border)] bg-white p-6 text-center text-sm text-[var(--color-text-tertiary)]">
                {UNMAPPABLE_COPY[data.unmappable]}
              </p>
            ) : results.length === 0 ? (
              <p className="rounded-lg border border-dashed border-[var(--color-border)] bg-white p-6 text-center text-sm text-[var(--color-text-tertiary)]">
                {criteria.nearby
                  ? 'No tutors match, even in nearby regions. Try a higher rate or less experience.'
                  : 'No tutors match. Tick “Include nearby regions”, or try a higher rate or less experience.'}
              </p>
            ) : (
              <ul className="grid gap-3">
                {results.map((tutor, i) => (
                  <TutorResultCard
                    key={tutor.id}
                    tutor={tutor}
                    rank={i + 1}
                    contactStatus={contactStatus.get(tutor.id)}
                    message={outreachMessage(criteria)}
                  />
                ))}
              </ul>
            )}
          </section>
        )}

        {/* Channel post for a fresh search; once posted, the assignmentId in the URL hides it. */}
        {canPost && (
          <PostPanel key={`${criteria.level}|${criteria.subject}|${criteria.location}|${criteria.rate}`} criteria={criteria} />
        )}
        {assignment?.channelMessageId && (
          <p className="mt-6 text-sm text-[var(--color-text-secondary)]">📢 Posted to the channel</p>
        )}
      </div>
    </>
  );
}
