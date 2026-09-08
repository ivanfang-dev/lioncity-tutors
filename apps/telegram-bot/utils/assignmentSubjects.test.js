import { describe, test, expect } from '@jest/globals';
import {
  toggleSubjectPick,
  buildSubjectPickerKeyboard,
  subjectPickerPrompt,
  formatSubject,
  MIN_PICKED_SUBJECTS,
  buildAssignmentDrafts,
  siblingTitle,
  subjectModeKeyboard,
  subjectModePrompt,
} from './assignmentSubjects.js';

const primary = ['English Language', 'Chinese', 'Mathematics', 'Science', 'Art'];

// The Done button only exists once the pick is valid, so its presence is the readiness signal.
const doneButton = (rows) =>
  rows.flat().find(b => b.callback_data === 'confirm_subjects');

describe('toggleSubjectPick', () => {
  test('adds a subject that is not picked yet', () => {
    expect(toggleSubjectPick(['Mathematics'], 'Science')).toEqual(['Mathematics', 'Science']);
  });

  test('removes one that already is', () => {
    expect(toggleSubjectPick(['Mathematics', 'Science'], 'Mathematics')).toEqual(['Science']);
  });

  test('keeps pick order, which is the order the matcher reports coverage in', () => {
    const picked = ['Science', 'Mathematics'].reduce(toggleSubjectPick, []);
    expect(picked).toEqual(['Science', 'Mathematics']);
  });

  test('does not mutate the list it was given', () => {
    const picked = ['Mathematics'];
    toggleSubjectPick(picked, 'Science');
    expect(picked).toEqual(['Mathematics']);
  });
});

describe('buildSubjectPickerKeyboard', () => {
  test('one row per subject, ticked to match the picks', () => {
    const rows = buildSubjectPickerKeyboard(primary, ['Mathematics', 'Science']);
    expect(rows.slice(0, primary.length).map(r => r[0].text)).toEqual([
      '⬜ English Language',
      '⬜ Chinese',
      '✅ Mathematics',
      '✅ Science',
      '⬜ Art',
    ]);
  });

  test('carries the subject index, not its name — callback_data has 64 bytes to spend', () => {
    const rows = buildSubjectPickerKeyboard(primary, []);
    expect(rows[3][0].callback_data).toBe('pick_subj_3');
    const longest = buildSubjectPickerKeyboard(
      ['Character and Citizenship Education'], []
    )[0][0].callback_data;
    expect(Buffer.byteLength(longest)).toBeLessThanOrEqual(64);
  });

  test('offers Done once enough subjects are picked', () => {
    expect(doneButton(buildSubjectPickerKeyboard(primary, ['Mathematics', 'Science'])))
      .toMatchObject({ callback_data: 'confirm_subjects' });
  });

  test('withholds Done below the minimum — one subject is not a multi-subject request', () => {
    expect(doneButton(buildSubjectPickerKeyboard(primary, []))).toBeUndefined();
    expect(doneButton(buildSubjectPickerKeyboard(primary, ['Mathematics']))).toBeUndefined();
  });

  test('always offers a way out', () => {
    for (const picked of [[], ['Mathematics'], ['Mathematics', 'Science']]) {
      expect(buildSubjectPickerKeyboard(primary, picked).flat()
        .some(b => b.callback_data === 'admin_panel')).toBe(true);
    }
  });

  test('an unknown level has nothing to pick, so only the controls show', () => {
    expect(buildSubjectPickerKeyboard([], []).flat().map(b => b.callback_data))
      .toEqual(['admin_panel']);
  });
});

describe('subjectPickerPrompt', () => {
  test('names the picks back, in order, so the owner can check them', () => {
    expect(subjectPickerPrompt(['Mathematics', 'Science'])).toContain('Mathematics, Science');
  });

  test('asks for more while the pick is short of the minimum', () => {
    expect(subjectPickerPrompt([])).toContain(`at least ${MIN_PICKED_SUBJECTS}`);
    expect(subjectPickerPrompt(['Mathematics'])).toContain(`at least ${MIN_PICKED_SUBJECTS}`);
    expect(subjectPickerPrompt(['Mathematics', 'Science'])).not.toContain('at least');
  });
});

describe('formatSubject', () => {
  test('spells out the picked subjects instead of the placeholder', () => {
    expect(formatSubject({ subject: 'Multiple Subjects', subjects: ['Mathematics', 'Science'] }))
      .toBe('Mathematics + Science');
  });

  test('falls back to the stored subject when nothing was picked', () => {
    expect(formatSubject({ subject: 'Multiple Subjects' })).toBe('Multiple Subjects');
    expect(formatSubject({ subject: 'Multiple Subjects', subjects: [] })).toBe('Multiple Subjects');
  });

  test('leaves an ordinary single-subject assignment alone', () => {
    expect(formatSubject({ subject: 'Mathematics' })).toBe('Mathematics');
  });
});

describe('buildAssignmentDrafts', () => {
  const base = {
    title: 'P4 Maths and Science',
    level: 'Primary 4',
    subject: 'Multiple Subjects',
    subjects: ['Mathematics', 'Science'],
    location: 'Bishan',
    rate: '$40/hr',
    frequency: 'Twice a week',
  };
  const ids = () => { let n = 0; return () => `grp${++n}`; };

  test('one tutor stays a single assignment carrying the picked subjects', () => {
    const drafts = buildAssignmentDrafts({ ...base, subjectMode: 'one' }, ids());
    expect(drafts).toHaveLength(1);
    expect(drafts[0]).toMatchObject({
      title: 'P4 Maths and Science',
      subject: 'Multiple Subjects',
      subjects: ['Mathematics', 'Science'],
    });
    expect(drafts[0].siblingGroupId).toBeUndefined();
  });

  test('separate tutors becomes one assignment per subject', () => {
    const drafts = buildAssignmentDrafts({ ...base, subjectMode: 'split' }, ids());
    expect(drafts.map(d => d.subject)).toEqual(['Mathematics', 'Science']);
  });

  test('each split assignment is an ordinary single-subject one', () => {
    // Nothing downstream should treat a sibling specially — it carries a real subject, so the
    // matcher's normal path handles it and no title parsing or coverage logic gets involved.
    for (const draft of buildAssignmentDrafts({ ...base, subjectMode: 'split' }, ids())) {
      expect(draft.subjects).toBeUndefined();
      expect(draft.subjectMode).toBeUndefined();
    }
  });

  test('each sibling keeps the title, narrowed to its own subject', () => {
    expect(buildAssignmentDrafts({ ...base, subjectMode: 'split' }, ids()).map(d => d.title))
      .toEqual(['P4 Maths', 'P4 Science']);
  });

  test('siblings share one group id, and it is theirs alone', () => {
    const drafts = buildAssignmentDrafts({ ...base, subjectMode: 'split' }, ids());
    expect(drafts[0].siblingGroupId).toBe('grp1');
    expect(drafts[1].siblingGroupId).toBe('grp1');
    const other = buildAssignmentDrafts({ ...base, subjectMode: 'split' }, ids());
    expect(other[0].siblingGroupId).not.toBe(drafts[0].siblingGroupId + 'x');
  });

  test('the wizard mode never reaches the database', () => {
    expect(buildAssignmentDrafts({ ...base, subjectMode: 'one' }, ids())[0].subjectMode).toBeUndefined();
  });

  test('carries the rest of the assignment onto every sibling', () => {
    for (const draft of buildAssignmentDrafts({ ...base, subjectMode: 'split' }, ids())) {
      expect(draft).toMatchObject({ level: 'Primary 4', location: 'Bishan', rate: '$40/hr' });
    }
  });

  test('too few subjects to split falls back to a single assignment', () => {
    expect(buildAssignmentDrafts({ ...base, subjects: ['Mathematics'], subjectMode: 'split' }, ids()))
      .toHaveLength(1);
    expect(buildAssignmentDrafts({ ...base, subjects: [], subjectMode: 'split' }, ids()))
      .toHaveLength(1);
  });

  test('an ordinary single-subject assignment is untouched', () => {
    const single = { title: 'Sec 3 Maths', level: 'Secondary 3', subject: 'Mathematics', rate: '$50/hr' };
    expect(buildAssignmentDrafts(single, ids())).toEqual([single]);
  });
});

describe('subjectModeKeyboard', () => {
  test('offers exactly the two ways a multi-subject request gets staffed', () => {
    expect(subjectModeKeyboard().flat().map(b => b.callback_data))
      .toEqual(['subject_mode_one', 'subject_mode_split', 'admin_panel']);
  });

  test('says how many assignments splitting would create', () => {
    const split = subjectModeKeyboard().flat().find(b => b.callback_data === 'subject_mode_split');
    expect(split.text).toContain('2');
  });
});

describe('subjectModePrompt', () => {
  test('names the subjects the choice is about', () => {
    expect(subjectModePrompt(['Mathematics', 'Science'])).toContain('Mathematics, Science');
  });
});

describe('siblingTitle', () => {
  const both = ['Mathematics', 'Science'];

  test('drops the other subject and the word joining them', () => {
    expect(siblingTitle('P4 Maths and Science', 'Mathematics', both)).toBe('P4 Maths');
    expect(siblingTitle('P4 Maths and Science', 'Science', both)).toBe('P4 Science');
  });

  test('keeps the owner\'s own wording rather than the canonical name', () => {
    expect(siblingTitle('P4 Maths and Sci', 'Mathematics', both)).toBe('P4 Maths');
    expect(siblingTitle('P4 Math & Science', 'Science', both)).toBe('P4 Science');
  });

  test('keeps whatever else the title says', () => {
    expect(siblingTitle('Urgent P4 Maths and Science at Bishan', 'Science', both))
      .toBe('Urgent P4 Science at Bishan');
  });

  test('handles slashes and commas as joiners', () => {
    expect(siblingTitle('P4 Maths/Science', 'Science', both)).toBe('P4 Science');
    expect(siblingTitle('P5 Maths, Science and English', 'Science',
      ['Mathematics', 'Science', 'English Language'])).toBe('P5 Science');
    expect(siblingTitle('P5 Maths, Science and English', 'English Language',
      ['Mathematics', 'Science', 'English Language'])).toBe('P5 English');
  });

  test('falls back to appending when the title names no subjects', () => {
    expect(siblingTitle('P4 tuition at Bishan', 'Mathematics', both))
      .toBe('P4 tuition at Bishan (Mathematics)');
  });

  test('falls back to appending when the title names only one of them', () => {
    // Narrowing would leave both siblings with the same title, which is the thing to avoid.
    expect(siblingTitle('P4 Maths tuition', 'Mathematics', both)).toBe('P4 Maths tuition (Mathematics)');
    expect(siblingTitle('P4 Maths tuition', 'Science', both)).toBe('P4 Maths tuition (Science)');
  });

  test('does not mistake a substring for a subject', () => {
    // "Math" inside "Mathematics" must not be matched separately.
    expect(siblingTitle('P4 Mathematics and Science', 'Science', both)).toBe('P4 Science');
  });

  test('tidies up the whitespace it leaves behind', () => {
    expect(siblingTitle('P4  Maths  and  Science', 'Science', both)).toBe('P4 Science');
  });
});
