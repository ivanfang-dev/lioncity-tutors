// Fields a console post must have before it can go to the channel (the bot checks the same list).
export const REQUIRED_POST_FIELDS = ["title", "level", "subject", "location", "rate", "frequency"];

// One subject, a list, or nothing → trimmed, de-duplicated list.
export function subjectList(value) {
  return [...new Set([].concat(value ?? []).map((s) => String(s).trim()).filter(Boolean))];
}

export function defaultTitle({ level, subject, location }) {
  const subjects = subjectList(subject).join(" & ");
  return location === "Online" ? `${level} ${subjects} (Online)` : `${level} ${subjects} @ ${location}`;
}

export function missingPostFields(fields) {
  return REQUIRED_POST_FIELDS.filter((f) => !subjectList(fields?.[f]).length);
}

// Whether a loaded assignment is the request being searched; a new request must not inherit it.
export function assignmentMatchesSearch(assignment, { level, subject, location }) {
  const covered = [assignment.subject, ...(assignment.subjects || [])];
  const searched = subjectList(subject);
  return assignment.level === level && assignment.location === location
    && searched.length > 0 && searched.every((s) => covered.includes(s));
}
