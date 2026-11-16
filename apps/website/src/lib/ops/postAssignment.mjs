// Fields a console post must have before it can go to the channel (the bot checks the same list).
export const REQUIRED_POST_FIELDS = ["title", "level", "subject", "location", "rate", "frequency"];

export function defaultTitle({ level, subject, location }) {
  return location === "Online" ? `${level} ${subject} (Online)` : `${level} ${subject} @ ${location}`;
}

export function missingPostFields(fields) {
  return REQUIRED_POST_FIELDS.filter((f) => !String(fields?.[f] ?? "").trim());
}
