import { describe, test, expect } from '@jest/globals';
import {
  toggleSubjectPick,
  buildSubjectPickerKeyboard,
  subjectPickerPrompt,
  formatSubject,
  MIN_PICKED_SUBJECTS,
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
