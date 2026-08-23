import { describe, test, expect } from '@jest/globals';
import {
  EDUCATION_LEVELS, LEVEL_SUBJECT_MAPPINGS, RATE_MAPPINGS, SUBJECTS,
  getSubjectsForLevel, isValidLevelSubjectCombination,
} from '../../../packages/shared/client-exports.js';

describe('education levels (shared)', () => {
  // EDUCATION_LEVELS is declared separately from the two maps because the picker
  // order differs. These pin all three to the same set of levels.
  test('every level has both a subject list and a rate band', () => {
    for (const level of EDUCATION_LEVELS) {
      expect(LEVEL_SUBJECT_MAPPINGS[level]).toBeDefined();
      expect(RATE_MAPPINGS[level]).toBeDefined();
    }
    expect(Object.keys(LEVEL_SUBJECT_MAPPINGS).sort()).toEqual([...EDUCATION_LEVELS].sort());
    expect(Object.keys(RATE_MAPPINGS).sort()).toEqual([...EDUCATION_LEVELS].sort());
  });

  test('every rate band carries all three tutor tiers', () => {
    for (const level of EDUCATION_LEVELS) {
      expect(Object.keys(RATE_MAPPINGS[level])).toEqual([
        'PT (Part-Time)', 'FT (Full-Time)', 'MOE (Ex-MOE)',
      ]);
    }
  });

  // Levels share frozen arrays, so a stray mutation would silently corrupt siblings.
  test('shared subject arrays cannot be mutated', () => {
    expect(Object.isFrozen(LEVEL_SUBJECT_MAPPINGS['Primary 3'])).toBe(true);
    expect(() => LEVEL_SUBJECT_MAPPINGS['Primary 3'].push('Astrophysics')).toThrow();
    expect(LEVEL_SUBJECT_MAPPINGS['Primary 4']).not.toContain('Astrophysics');
  });

  test('SUBJECTS is the sorted union of every level plus the special categories', () => {
    expect(SUBJECTS).toEqual([...SUBJECTS].sort());
    expect(new Set(SUBJECTS).size).toBe(SUBJECTS.length);
    expect(SUBJECTS).toContain('All Subjects');
    expect(SUBJECTS).toContain('H2 Chemistry');
  });

  test('level/subject validation still honours levels and special categories', () => {
    expect(isValidLevelSubjectCombination('Secondary 3', 'Additional Mathematics')).toBe(true);
    expect(isValidLevelSubjectCombination('Primary 1', 'Physics')).toBe(false);
    expect(isValidLevelSubjectCombination('Primary 1', 'All Subjects')).toBe(true);
    expect(getSubjectsForLevel('not a level')).toEqual([
      'Multiple Subjects', 'All Subjects', 'Exam Preparation', 'Homework Support', 'Other',
    ]);
  });

  test('Junior College 1 carries Project Work and JC2 does not', () => {
    expect(LEVEL_SUBJECT_MAPPINGS['Junior College 1']).toContain('Project Work');
    expect(LEVEL_SUBJECT_MAPPINGS['Junior College 2']).not.toContain('Project Work');
  });
});
