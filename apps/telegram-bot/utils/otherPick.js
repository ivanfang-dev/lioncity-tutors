// "Placed someone else": the owner filled an assignment with a registered tutor who never came
// through outreach — someone they rang personally. Recording it against the real tutor (not a
// typed name) is what keeps the Placement, the day-30 check-in and the tutor's track record.
//
// Stateless on purpose. The prompt is sent with force_reply and carries the assignment id as
// "(pick:<id>)"; the owner's reply brings it back on reply_to_message. Same trick as the
// "(wa:<digits>)" relay, and for the same reason: no session to lose on a Vercel cold start, and
// a reply can only ever answer the prompt it was attached to.

const TAG = /\(pick:([0-9a-f]{24})\)/i;
const MIN_QUERY_LENGTH = 2;

export function otherPickPrompt(assignment) {
  return (
    `Who did you place on ${assignment.title}?\n` +
    `Reply to this message with their name (part of it is fine).\n` +
    `(pick:${assignment._id})`
  );
}

// The assignment a reply is answering, or null when the message isn't one of our prompts.
export function parseOtherPickTag(text) {
  if (typeof text !== 'string') return null;
  const m = text.match(TAG);
  return m ? m[1] : null;
}

// A case-insensitive fullName filter, or null when the input is too short to narrow the pool.
// Escaped so a name saved as "Tan (Ms)" or "J. Lee" is searched literally.
export function tutorNameSearch(text) {
  const q = typeof text === 'string' ? text.trim() : '';
  if (q.length < MIN_QUERY_LENGTH) return null;
  return { $regex: q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' };
}

// One result row. Experience and type are there to tell two tutors with the same name apart.
export function otherPickButton(assignmentId, tutor) {
  const details = [tutor.yearsOfExperience, tutor.tutorType].filter(Boolean).join(' · ');
  return {
    text: `✅ ${tutor.fullName?.trim() || 'Tutor'}${details ? ` — ${details}` : ''}`,
    callback_data: `setother_${assignmentId}_${tutor._id}`,
  };
}
