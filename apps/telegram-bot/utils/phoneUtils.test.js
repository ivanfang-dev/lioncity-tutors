import { describe, test, expect } from '@jest/globals';
import { normalizePhone, generatePhoneVariations } from '../../../packages/shared/utils/phoneUtils.js';

describe('phoneUtils (shared)', () => {
  test('reduces every written form to the bare 8-digit local number', () => {
    expect(normalizePhone('91234567')).toBe('91234567');
    expect(normalizePhone('9123 4567')).toBe('91234567');
    expect(normalizePhone('  9123-4567 ')).toBe('91234567');
    expect(normalizePhone('+65 9123 4567')).toBe('91234567');
    expect(normalizePhone('6591234567')).toBe('91234567');
    expect(normalizePhone('+6591234567')).toBe('91234567');
  });

  // The 65 prefix is only a country code when digits remain past 8. Stripping it
  // unconditionally turned the landline 65123456 into 123456 and lost the match.
  test('keeps an 8-digit landline that happens to start with 65', () => {
    expect(normalizePhone('65123456')).toBe('65123456');
    expect(normalizePhone('6512 3456')).toBe('65123456');
  });

  test('coerces non-string input rather than discarding it', () => {
    expect(normalizePhone(91234567)).toBe('91234567');
    expect(normalizePhone(null)).toBe('');
    expect(normalizePhone(undefined)).toBe('');
    expect(normalizePhone('')).toBe('');
  });

  test('generatePhoneVariations covers the stored shapes and the original input', () => {
    const v = generatePhoneVariations('+65 9123 4567');
    expect(v).toContain('91234567');
    expect(v).toContain('6591234567');
    expect(v).toContain('9123 4567');
    expect(v).toContain('9123-4567');
    expect(v).toContain('+65 9123 4567');
    expect(new Set(v).size).toBe(v.length);
  });

  test('generatePhoneVariations returns nothing for unusable input', () => {
    expect(generatePhoneVariations(null)).toEqual([]);
    expect(generatePhoneVariations('')).toEqual([]);
  });
});
