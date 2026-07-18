import { Suspense } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { shortlistDecided, shortlistedContacts, funnelCounts } from '@lioncity/shared/utils/outreachState.js';
import OpsHeader from '../../OpsHeader';
import Funnel from '../../Funnel';
import OutcomeButtons from '../../OutcomeButtons';
import ContactTimeline from './ContactTimeline';
import CandidateBreakdown from './CandidateBreakdown';
import PoolAttrition from './PoolAttrition';
import { loadAssignment, loadTutorsByIds, serializeAssignment } from '@/lib/ops/data';

// Everything known about one assignment: state, the tutors we touched and what they said, why the
// pool is the size it is, and — when the parent still owes us an answer — the buttons to record it.

function Section({ title, children }) {
  return (
    <section className="mt-6">
      <h2 className="mb-2 text-sm font-semibold text-[var(--color-text-default)]">{title}</h2>
      {children}
    </section>
  );
}

export default async function AssignmentPage({ params }) {
  const raw = await loadAssignment(params.assignmentId);
  if (!raw) notFound();

  const assignment = serializeAssignment(raw);
  const contacts = assignment.outreach?.contacts || [];
  const funnel = funnelCounts(assignment);
  const shortlisted = shortlistedContacts(assignment);

  const tutorsById = Object.fromEntries(
    await loadTutorsByIds(contacts.filter(c => c.status === 'Interested').map(c => c.tutorId))
  );

  // The same condition the queue uses to raise a "shortlist ready / parent silent" row — so the
  // buttons are here exactly when the row is there.
  const awaitingParent =
    assignment.outreach?.shortlistReleasedAt && !shortlistDecided(assignment) && assignment.status !== 'Filled';

  return (
    <>
      <OpsHeader
        title={assignment.title}
        subtitle={[assignment.level, assignment.location, assignment.rate].filter(Boolean).join(' · ')}
        backHref="/ops"
      />

      <div className="mx-auto max-w-3xl px-4 py-6">
        <div className="rounded-lg border border-[var(--color-border)] bg-white p-4">
          <p className="text-sm font-medium text-[var(--color-text-default)]">
            {assignment.status === 'Filled' ? 'Filled' : assignment.outreach?.status || assignment.status}
            {assignment.outreach?.waveCount > 0 && (
              <span className="font-normal text-[var(--color-text-tertiary)]">
                {' '}· {assignment.outreach.waveCount} wave{assignment.outreach.waveCount === 1 ? '' : 's'}
              </span>
            )}
          </p>
          <div className="mt-2">
            <Funnel funnel={funnel} />
          </div>
          {assignment.parentContact ? (
            <p className="mt-2 text-xs text-[var(--color-text-tertiary)]">Parent: {assignment.parentContact}</p>
          ) : (
            <p className="mt-2 text-xs text-[var(--color-error)]">No parent contact — relay unavailable.</p>
          )}
        </div>

        {awaitingParent && assignment.parentContact && (
          <Section title="Record the parent’s answer">
            <div className="rounded-lg border border-[var(--color-border)] bg-white p-4">
              <Link
                href={`/ops/relay/${assignment._id}?kind=shortlist`}
                className="block rounded-md bg-[var(--color-primary)] px-4 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-[#03649f]"
              >
                Send profiles via WhatsApp
              </Link>
              {shortlisted.length > 0 && (
                <OutcomeButtons
                  assignmentId={String(assignment._id)}
                  shortlisted={shortlisted.map(c => ({
                    tutorId: String(c.tutorId),
                    tutorName: c.tutorName,
                    shortlistRank: c.shortlistRank,
                  }))}
                />
              )}
            </div>
          </Section>
        )}

        <Section title="Interested tutors">
          <CandidateBreakdown contacts={contacts} tutorsById={tutorsById} level={assignment.level} />
        </Section>

        <Section title="Matching pool">
          {/* Streams in: costs a count per filter, so it must not delay the rest of the page. */}
          <Suspense fallback={
            <p className="rounded-lg border border-[var(--color-border)] bg-white p-4 text-sm text-[var(--color-text-tertiary)]">
              Working out the pool…
            </p>
          }>
            <PoolAttrition assignmentId={String(assignment._id)} />
          </Suspense>
        </Section>

        <Section title={`Contact timeline (${contacts.length})`}>
          <ContactTimeline contacts={contacts} />
        </Section>
      </div>
    </>
  );
}
