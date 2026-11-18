// The owner's own "messaged this tutor" log (Tutor.manualContacts), kept per search, not per assignment.
// Pure helpers; entries older than the TTL are hidden on read and pruned on write.

export const MANUAL_CONTACT_TTL_MS = 14 * 24 * 60 * 60 * 1000;

// "Primary 2 Mathematics & Science, Canberra"
export function searchLabel({ level, subject, location }) {
  return `${level} ${[].concat(subject || []).join(' & ')}, ${location}`;
}

// Unexpired entries, newest first.
export function activeManualContacts(list, now = new Date()) {
  const cutoff = now.getTime() - MANUAL_CONTACT_TTL_MS;
  return (list || [])
    .filter(e => new Date(e.at).getTime() > cutoff)
    .sort((a, b) => new Date(b.at) - new Date(a.at));
}

// Log a message; the same search again just refreshes its time.
export function withMessaged(list, label, now = new Date()) {
  const active = activeManualContacts(list, now);
  const same = active.find(e => e.label === label);
  if (same) return active.map(e => (e === same ? { ...e, at: now } : e));
  return [{ at: now, label }, ...active];
}

export function withReply(list, entryId, reply, now = new Date()) {
  return activeManualContacts(list, now).map(e =>
    String(e._id) === String(entryId) ? { ...e, reply, repliedAt: now } : e
  );
}

export function messagedAgo(at, now = new Date()) {
  const days = Math.floor((now.getTime() - new Date(at).getTime()) / (24 * 60 * 60 * 1000));
  return days < 1 ? 'today' : `${days}d ago`;
}
