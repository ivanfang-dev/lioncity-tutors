import { subjectMentions, aliasRegex } from './subjectAliases.js';

// The "Multiple Subjects" pick step of the assignment wizard, kept pure so it can be tested without
// a bot. The owner ticks the subjects the parent actually asked for; matching reads that list
// directly (tutorMatcher.resolveSubjects) instead of regex-parsing the assignment title.

// Fewer than two isn't a multi-subject request — the owner should have picked that subject outright.
export const MIN_PICKED_SUBJECTS = 2;

// Toggle one subject in the picked list. Returns a new array; pick order is preserved because
// that's the order coverage is reported in.
export function toggleSubjectPick(picked, subject) {
  return picked.includes(subject)
    ? picked.filter(s => s !== subject)
    : [...picked, subject];
}

// One subject per row — the level lists run to 35-character names, so two columns would truncate.
// Buttons carry the subject's index rather than its name: callback_data caps at 64 bytes.
export function buildSubjectPickerKeyboard(levelSubjects, picked) {
  const rows = levelSubjects.map((subject, i) => [{
    text: `${picked.includes(subject) ? '✅' : '⬜'} ${subject}`,
    callback_data: `pick_subj_${i}`,
  }]);

  if (picked.length >= MIN_PICKED_SUBJECTS) {
    rows.push([{ text: `✅ Done — ${picked.length} subjects`, callback_data: 'confirm_subjects' }]);
  }
  rows.push([{ text: '❌ Cancel', callback_data: 'admin_panel' }]);
  return rows;
}

export function subjectPickerPrompt(picked) {
  const chosen = picked.length > 0 ? picked.join(', ') : 'none yet';
  const hint = picked.length < MIN_PICKED_SUBJECTS
    ? `_Tap at least ${MIN_PICKED_SUBJECTS} subjects._`
    : '_Tap to change, then press Done._';
  return '🎯 *Creating New Assignment*\n\nStep 3b of 11: Which subjects?\n\n'
    + `*Picked:* ${chosen}\n\n${hint}`;
}

// Display name for an assignment's subject. A "Multiple Subjects" assignment that named its
// subjects should show them; everything else reads as it always has.
export function formatSubject(assignment) {
  return assignment.subjects?.length > 0
    ? assignment.subjects.join(' + ')
    : assignment.subject;
}

// One parent request → the assignment documents to write. "One tutor" stays a single assignment
// carrying its subject list; "separate tutors" becomes one ordinary single-subject assignment per
// picked subject, linked by a shared siblingGroupId so outreach can tell they are the same family.
// Pure: the id generator is injected so the split is testable.
export function buildAssignmentDrafts(assignmentData, makeGroupId = () => crypto.randomUUID()) {
  const { subjectMode, subjects = [], ...rest } = assignmentData;

  if (subjectMode !== 'split' || subjects.length < MIN_PICKED_SUBJECTS) {
    const single = { ...rest };
    if (subjects.length > 0) single.subjects = subjects;
    return [single];
  }

  const siblingGroupId = makeGroupId();
  return subjects.map(subject => ({
    ...rest,
    subject,
    title: siblingTitle(rest.title, subject, subjects),
    siblingGroupId,
  }));
}

// Step 3c: one tutor for everything, or a tutor per subject. This is the only thing that tells the
// two apart — matching can't infer from a subject list whether the parent wanted one person.
export function subjectModeKeyboard(picked = []) {
  return [
    [{ text: '👤 One tutor for all', callback_data: 'subject_mode_one' }],
    [{ text: `👥 Separate tutors — ${Math.max(picked.length, MIN_PICKED_SUBJECTS)} assignments`, callback_data: 'subject_mode_split' }],
    [{ text: '❌ Cancel', callback_data: 'admin_panel' }],
  ];
}

export function subjectModePrompt(picked) {
  return '🎯 *Creating New Assignment*\n\nStep 3c of 11: One tutor, or one per subject?\n\n'
    + `*Subjects:* ${picked.join(', ')}\n\n`
    + '_One tutor prioritises tutors who teach all of them. Separate tutors posts each subject '
    + 'on its own, so they fill independently._';
}

// The title for one sibling of a split request. "P4 Maths and Science" split into Maths and Science
// should read "P4 Maths" and "P4 Science" — the owner's own wording, with the other subjects taken
// out, not the canonical name bolted on the end.
//
// Only narrows when the title names at least two of the picked subjects. Otherwise there is nothing
// to remove and every sibling would end up with the same title, so the subject is appended instead —
// the title travels alone as {{1}} in the WhatsApp template, and a Science assignment titled
// "P4 Maths and Science" reads like it covers both.
export function siblingTitle(title, subject, picked) {
  const mentioned = subjectMentions(title).filter(m => picked.includes(m.subject));
  const others = mentioned.filter(m => m.subject !== subject);
  if (mentioned.length - others.length < 1 || others.length < 1) {
    return `${title} (${subject})`;
  }

  let narrowed = title;
  for (const other of others) {
    narrowed = removeSubjectPhrase(narrowed, other.text);
  }
  const tidied = narrowed.replace(/\s+/g, ' ').trim();
  return tidied.length > 0 ? tidied : `${title} (${subject})`;
}

// Cut one subject out of a title, taking the word that joins it to its neighbour with it — so
// "Maths and Science" loses " and Science", not just "Science". Tries the joiner on each side
// before falling back to the bare word.
function removeSubjectPhrase(title, text) {
  const word = aliasRegex(text).source;
  const joiner = '\\s*(?:and|&|\\+|,|/)\\s*';
  for (const pattern of [`${joiner}${word}`, `${word}${joiner}`, word]) {
    const regex = new RegExp(pattern, 'i');
    if (regex.test(title)) return title.replace(regex, ' ');
  }
  return title;
}
