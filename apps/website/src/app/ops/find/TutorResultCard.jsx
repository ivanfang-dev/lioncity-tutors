import { normalizePhone } from '@lioncity/shared/utils/phoneUtils.js';
import ExpandableText from './ExpandableText';

function Meta({ label, children }) {
  return (
    <div className="flex gap-1.5">
      <dt className="text-[var(--color-text-tertiary)]">{label}</dt>
      <dd className="tabular-nums text-[var(--color-text-default)]">{children}</dd>
    </div>
  );
}

// Some tutors typed a bare number ("50"); show it as a rate.
function formatRate(rate) {
  if (!rate) return '—';
  return /^\d+(\.\d+)?$/.test(rate.trim()) ? `$${rate.trim()}/h` : rate;
}

// One ranked tutor: the numbers the parent filters on, the profile text, and buttons that open a
// chat in the owner's own WhatsApp/Telegram (no API, nothing sent automatically).
const REGION_LABELS = {
  north: 'North', south: 'South', east: 'East', west: 'West', central: 'Central',
  northeast: 'Northeast', northwest: 'Northwest', online: 'Online',
};

// Auto-outreach's contact status on the assignment we came from → tag shown on the card.
const CONTACT_TAGS = {
  Interested: { label: 'Already said yes', className: 'bg-[#0474BA]/10 text-[#03649f]' },
  Declined: { label: 'Already said no', className: 'bg-[var(--color-gray-100)] text-[var(--color-text-secondary)]' },
  Sent: { label: 'Messaged, no reply', className: 'bg-[#F17720]/10 text-[#b8540f]' },
};

export default function TutorResultCard({ tutor, rank, contactStatus, message }) {
  const tag = CONTACT_TAGS[contactStatus];
  const phone = normalizePhone(tutor.contactNumber);
  const { contacted, responded } = tutor.replies;

  return (
    // min-w-0 + anywhere-wrap: a pasted URL in a profile must not widen every card in the grid.
    <li className="min-w-0 rounded-lg border border-[var(--color-border)] bg-white p-4 [overflow-wrap:anywhere]">
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-xs font-semibold text-[var(--color-text-tertiary)]">#{rank}</span>
        <p className="text-sm font-semibold text-[var(--color-text-default)]">{tutor.fullName}</p>
        {tag && (
          <span className={`rounded px-1.5 py-0.5 text-xs font-semibold ${tag.className}`}>{tag.label}</span>
        )}
        {tutor.nearbyRegion && (
          <span className="rounded bg-[var(--color-gray-100)] px-1.5 py-0.5 text-xs font-semibold text-[var(--color-text-secondary)]">
            Nearby · {REGION_LABELS[tutor.nearbyRegion] || tutor.nearbyRegion}
          </span>
        )}
        {tutor.placed > 0 && (
          <span className="rounded bg-[#0474BA]/10 px-1.5 py-0.5 text-xs font-semibold text-[#03649f]">
            Placed {tutor.placed}×
          </span>
        )}
        {tutor.overBudget && (
          <span className="rounded bg-[#F17720]/10 px-1.5 py-0.5 text-xs font-semibold text-[#b8540f]">
            ⚠️ Over budget
          </span>
        )}
      </div>

      <dl className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
        <Meta label="Experience">{tutor.yearsOfExperience || '—'}</Meta>
        <Meta label="Type">{tutor.tutorType || '—'}</Meta>
        <Meta label="Asks">{formatRate(tutor.askingRate)}</Meta>
        <Meta label="Replies">{contacted ? `${responded}/${contacted}` : 'new'}</Meta>
        {tutor.highestEducation && <Meta label="Education">{tutor.highestEducation}</Meta>}
      </dl>

      <div className="mt-3 grid gap-2">
        <ExpandableText label="Introduction" text={tutor.introduction} />
        <ExpandableText label="Teaching experience" text={tutor.teachingExperience} />
        <ExpandableText label="Track record & achievements" text={tutor.trackRecord} />
      </div>

      {phone && (
        <div className="mt-3 grid grid-cols-2 gap-2">
          <a
            href={`https://wa.me/65${phone}${message ? `?text=${encodeURIComponent(message)}` : ''}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md bg-[#25D366] px-3 py-2 text-center text-sm font-semibold text-white hover:opacity-90"
          >
            WhatsApp
          </a>
          <a
            href={`https://t.me/+65${phone}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md bg-[#229ED9] px-3 py-2 text-center text-sm font-semibold text-white hover:opacity-90"
          >
            Telegram
          </a>
        </div>
      )}
    </li>
  );
}
