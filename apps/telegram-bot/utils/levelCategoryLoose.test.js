import { describe, test, expect } from '@jest/globals';
import { getLevelCategory, getLevelCategoryLoose } from '../../../packages/shared/utils/levelCategory.js';

// getLevelCategoryLoose backs the website rate hint (roadmap Phase 8): parents type levels in SG
// shorthand, and the strict getLevelCategory (which the matcher uses on canonical dropdown values)
// only recognizes the full words. These cover the shorthand it must additionally accept.
describe('getLevelCategoryLoose', () => {
  test('still resolves the canonical forms the strict matcher accepts', () => {
    expect(getLevelCategoryLoose('Secondary 3 A-Math')).toBe('secondary');
    expect(getLevelCategoryLoose('Primary 4 Chinese')).toBe('primary');
    expect(getLevelCategoryLoose('Junior College 1 H2 Chemistry')).toBe('jc');
  });

  test('resolves common Primary shorthand', () => {
    expect(getLevelCategoryLoose('P4 Chinese')).toBe('primary');
    expect(getLevelCategoryLoose('p 6 Maths')).toBe('primary');
    expect(getLevelCategoryLoose('Pri 5 Science')).toBe('primary');
    expect(getLevelCategoryLoose('Pri Science')).toBe('primary');
  });

  test('resolves common Secondary shorthand', () => {
    expect(getLevelCategoryLoose('Sec 3 A-Math')).toBe('secondary');
    expect(getLevelCategoryLoose('S3 Physics')).toBe('secondary');
    expect(getLevelCategoryLoose('sec chemistry')).toBe('secondary');
  });

  test('resolves common JC / Poly / Uni / Kindergarten shorthand', () => {
    expect(getLevelCategoryLoose('JC1 H2 Chem')).toBe('jc');
    expect(getLevelCategoryLoose('J2 Econs')).toBe('jc');
    expect(getLevelCategoryLoose('JC Maths')).toBe('jc');
    expect(getLevelCategoryLoose('Poly Engineering Maths')).toBe('polytechnic');
    expect(getLevelCategoryLoose('Uni Calculus')).toBe('university');
    expect(getLevelCategoryLoose('K2 Phonics')).toBe('preschool');
  });

  test('does NOT false-match a subject that merely starts with a level letter', () => {
    // No leading level number → not a level. The hint stays hidden rather than guessing wrong.
    expect(getLevelCategoryLoose('Physics')).toBeNull();
    expect(getLevelCategoryLoose('Science')).toBeNull();
    expect(getLevelCategoryLoose('Chinese')).toBeNull();
    expect(getLevelCategoryLoose('Piano')).toBeNull();
    expect(getLevelCategoryLoose('')).toBeNull();
    expect(getLevelCategoryLoose(undefined)).toBeNull();
  });

  test('leaves the strict matcher unchanged — shorthand is loose-only', () => {
    expect(getLevelCategory('Sec 3')).toBeNull();
    expect(getLevelCategory('P4')).toBeNull();
    expect(getLevelCategory('Secondary 3')).toBe('secondary');
  });
});
