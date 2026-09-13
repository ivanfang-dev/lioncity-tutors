import { describe, test, expect } from '@jest/globals';
import {
  otherPickPrompt,
  parseOtherPickTag,
  tutorNameSearch,
  otherPickButton,
} from './otherPick.js';

const assignment = { _id: '6a959c9f45d93378037aba31', title: 'Secondary 1 Maths' };

describe('otherPickPrompt / parseOtherPickTag', () => {
  // The owner's reply carries no state of its own — the assignment rides in the prompt text and
  // comes back on reply_to_message, so a Vercel cold start between prompt and reply loses nothing.
  test('round-trips the assignment id through the prompt text', () => {
    expect(parseOtherPickTag(otherPickPrompt(assignment))).toBe('6a959c9f45d93378037aba31');
  });

  test('names the assignment in the prompt', () => {
    expect(otherPickPrompt(assignment)).toContain('Secondary 1 Maths');
  });

  test('ignores a message that is not a pick prompt', () => {
    expect(parseOtherPickTag('Which tutor did the parent choose?')).toBeNull();
    expect(parseOtherPickTag('(wa:6591234567)')).toBeNull();
  });

  test('rejects a tag that is not a valid ObjectId', () => {
    expect(parseOtherPickTag('(pick:not-an-id)')).toBeNull();
    expect(parseOtherPickTag('(pick:6a959c9f)')).toBeNull();
  });

  test('handles missing text', () => {
    expect(parseOtherPickTag(undefined)).toBeNull();
    expect(parseOtherPickTag(null)).toBeNull();
  });
});

describe('tutorNameSearch', () => {
  test('matches case-insensitively on a partial name', () => {
    const q = tutorNameSearch('wei chang');
    expect(new RegExp(q.$regex, q.$options).test('Lim Wei Chang')).toBe(true);
  });

  test('trims surrounding whitespace', () => {
    const q = tutorNameSearch('  Lim  ');
    expect(new RegExp(q.$regex, q.$options).test('Lim Wei Chang')).toBe(true);
  });

  // Owners type names the way they're saved in their phone — "Tan (Ms)", "J. Lee" — and an
  // unescaped regex either throws on the bracket or quietly matches the wrong people on the dot.
  test('treats regex metacharacters literally', () => {
    const q = tutorNameSearch('Tan (Ms)');
    const re = new RegExp(q.$regex, q.$options);
    expect(re.test('Tan (Ms)')).toBe(true);
    expect(re.test('Tan Ms')).toBe(false);
    expect(new RegExp(tutorNameSearch('J. Lee').$regex, 'i').test('Jx Lee')).toBe(false);
  });

  test('refuses input too short to narrow the pool', () => {
    expect(tutorNameSearch('')).toBeNull();
    expect(tutorNameSearch(' a ')).toBeNull();
    expect(tutorNameSearch(undefined)).toBeNull();
  });
});

describe('otherPickButton', () => {
  const tutor = { _id: '6a8620153a829c46edab32f7', fullName: 'Lim Wei Chang', yearsOfExperience: '3-5 years', tutorType: 'Parttime' };

  test('labels the tutor with enough to tell two namesakes apart', () => {
    expect(otherPickButton(assignment._id, tutor).text).toBe('✅ Lim Wei Chang — 3-5 years · Parttime');
  });

  // Real tutor records carry stray whitespace ("Lim Wei Chang ") — it showed as a double space.
  test('trims the stored name', () => {
    expect(otherPickButton(assignment._id, { ...tutor, fullName: 'Lim Wei Chang ' }).text)
      .toBe('✅ Lim Wei Chang — 3-5 years · Parttime');
  });

  test('drops missing details instead of printing blanks', () => {
    expect(otherPickButton(assignment._id, { _id: tutor._id, fullName: 'Lim Wei Chang' }).text)
      .toBe('✅ Lim Wei Chang');
  });

  // Telegram rejects the whole keyboard if any callback_data exceeds 64 bytes.
  test('fits callback_data inside Telegram\'s 64-byte limit', () => {
    const { callback_data } = otherPickButton(assignment._id, tutor);
    expect(callback_data).toBe(`setother_${assignment._id}_${tutor._id}`);
    expect(Buffer.byteLength(callback_data)).toBeLessThanOrEqual(64);
  });
});
