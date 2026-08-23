import { Tutor } from '../../../packages/shared/server-exports.js';
import { shortlistScore, shortlistReason } from './tutorMatcher.js';
import { notifyOwner, opsButtonRow } from './ownerAlert.js';
import { escapeMd } from './markdown.js';

// A tutor who says yes (or applies) after the shortlist has already gone out. Their reply used to
// be dropped on the floor because outreach was Fulfilled. Now it's recorded, scored against the
// released shortlist, and surfaced to the owner when it beats the weakest tutor on it.

// Fields shortlistScore and the alert blurb read.
const TUTOR_SELECT =
  'fullName yearsOfExperience introduction teachingExperience trackRecord hourlyRate ' +
  'tutorType teachingLevels highestEducation currentSchool previousSchools stats profileFeatures';

// Where a late candidate lands against the released shortlist. `stronger` means they outscore the
// weakest tutor already on it — the only case worth interrupting the owner for.
export function lateInterestOutcome(candidate, shortlisted) {
  const others = shortlisted.filter(s => String(s.tutorId) !== String(candidate.tutorId));
  if (others.length === 0) {
    return { stronger: true, weakest: null, wouldRank: 1 };
  }
  const weakest = others.reduce((lo, s) => (s.score < lo.score ? s : lo));
  const wouldRank = others.filter(s => s.score >= candidate.score).length + 1;
  return { stronger: candidate.score > weakest.score, weakest, wouldRank };
}

// The rank to stamp when the owner adds a bench tutor to the shortlist — after everyone still ON
// it. Rejected contacts are skipped: after a reject → re-release cycle they keep the dead
// shortlist's ranks, and counting those made the first tutor on a fresh shortlist "#4".
// Same filter handleLateInterest below uses to decide who the shortlist currently is.
export function nextShortlistRank(contacts) {
  const ranks = (contacts || [])
    .filter(c => c.shortlistRank != null && !c.parentRejectedAt)
    .map(c => c.shortlistRank);
  return ranks.length ? Math.max(...ranks) + 1 : 1;
}

// Score a late candidate against the released shortlist and alert the owner if they beat it.
// Best-effort: the interest is already recorded, so any failure here costs an alert, not the reply.
export async function handleLateInterest(assignment, contact) {
  const contacts = assignment.outreach?.contacts || [];
  const shortlisted = contacts.filter(c => c.shortlistRank != null && !c.parentRejectedAt && c.tutorId);

  const ids = [contact.tutorId, ...shortlisted.map(c => c.tutorId)];
  const tutors = await Tutor.find({ _id: { $in: ids } }).select(TUTOR_SELECT).lean();
  const tutorById = new Map(tutors.map(t => [t._id.toString(), t]));

  const candidateTutor = tutorById.get(contact.tutorId.toString());
  if (!candidateTutor) return { alerted: false, stronger: false };

  const scoreOf = (c) => {
    const t = tutorById.get(c.tutorId.toString());
    return t ? shortlistScore(t, assignment, c.quotedRate ?? null) : null;
  };
  const candidate = {
    tutorId: contact.tutorId,
    tutorName: candidateTutor.fullName || 'Tutor',
    score: shortlistScore(candidateTutor, assignment, contact.quotedRate ?? null),
  };
  const scored = shortlisted
    .map(c => ({ tutorId: c.tutorId, tutorName: c.tutorName, shortlistRank: c.shortlistRank, score: scoreOf(c) }))
    .filter(s => s.score != null);

  const outcome = lateInterestOutcome(candidate, scored);
  if (!outcome.stronger) {
    console.log(`Late interest from ${candidate.tutorName} on ${assignment._id}: below shortlist, held as bench`);
    return { alerted: false, stronger: false };
  }

  const reason = shortlistReason(candidateTutor, assignment, contact.quotedRate ?? null);
  const beats = outcome.weakest
    ? `Outranks #${outcome.weakest.shortlistRank} ${escapeMd(outcome.weakest.tutorName)} — would sit at #${outcome.wouldRank}.`
    : 'No one is on the shortlist yet.';

  const rows = [[{
    text: `➕ Add ${candidate.tutorName} to shortlist`,
    callback_data: `addshort_${assignment._id}_${contact.tutorId}`,
  }]];
  const opsRow = opsButtonRow(assignment._id);
  if (opsRow) rows.push(opsRow);

  await notifyOwner(
    `⭐ *Stronger tutor available* — *${escapeMd(assignment.title)}*\n` +
    `*${escapeMd(candidate.tutorName)}* said yes after the shortlist went out.\n` +
    `    ${escapeMd(reason)}\n\n${beats}`,
    { inline_keyboard: rows }
  );
  return { alerted: true, stronger: true };
}
