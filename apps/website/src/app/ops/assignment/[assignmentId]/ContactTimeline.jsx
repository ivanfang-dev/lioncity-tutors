// The contact timeline: every tutor this assignment touched, in the order we touched them —
// wave, channel, how fast they answered, what they said. This is the record that answers "why is
// this assignment stuck?", which Telegram scrollback can't.

const STATUS_TONE = {
  Interested: 'text-[#15803d]',
  Declined: 'text-[var(--color-text-tertiary)]',
  Sent: 'text-[var(--color-text-tertiary)]',
};

const STATUS_LABEL = {
  Interested: 'Interested',
  Declined: 'Declined',
  Sent: 'No reply yet',
};

// Reply speed, computed from the contact's own timestamps. Phase 4 will store this on the contact
// (responseLatencyMins); until then the two dates are the only source.
function latency(contact) {
  if (!contact.respondedAt || !contact.sentAt) return null;
  const mins = Math.round((new Date(contact.respondedAt) - new Date(contact.sentAt)) / 60000);
  if (mins < 1) return '<1m';
  if (mins < 60) return `${mins}m`;
  return `${Math.round(mins / 60)}h`;
}

export default function ContactTimeline({ contacts }) {
  if (contacts.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-[var(--color-border)] bg-white p-6 text-center text-sm text-[var(--color-text-tertiary)]">
        No tutors contacted yet.
      </p>
    );
  }

  // Oldest first: the funnel reads top-down in the order outreach actually happened.
  const ordered = [...contacts].sort((a, b) => new Date(a.sentAt) - new Date(b.sentAt));

  return (
    <ul className="grid gap-2">
      {ordered.map((contact, i) => {
        const speed = latency(contact);
        return (
          <li
            key={contact.tutorId || i}
            className="rounded-lg border border-[var(--color-border)] bg-white p-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-[var(--color-text-default)]">
                  {contact.shortlistRank != null && (
                    <span className="mr-1.5 rounded bg-[#0474BA]/10 px-1.5 py-0.5 text-[11px] font-semibold text-[#03649f]">
                      #{contact.shortlistRank}
                    </span>
                  )}
                  {contact.tutorName || 'Tutor'}
                </p>
                <p className="mt-0.5 text-xs tabular-nums text-[var(--color-text-tertiary)]">
                  wave {contact.wave ?? '—'} · {contact.channel || 'whatsapp'}
                  {speed && ` · replied in ${speed}`}
                  {contact.reminderCount > 0 && ` · ${contact.reminderCount} reminder${contact.reminderCount === 1 ? '' : 's'}`}
                </p>
              </div>
              <span className={`shrink-0 text-xs font-medium ${STATUS_TONE[contact.status] || ''}`}>
                {STATUS_LABEL[contact.status] || contact.status}
              </span>
            </div>

            {(contact.parentPickedAt || contact.parentRejectedAt) && (
              <p className="mt-1.5 text-xs text-[var(--color-text-secondary)]">
                {contact.parentPickedAt
                  ? '✅ Parent picked this tutor'
                  : `Parent passed${contact.parentRejectReason ? ` — ${contact.parentRejectReason}` : ''}`}
              </p>
            )}
          </li>
        );
      })}
    </ul>
  );
}
