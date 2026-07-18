import { describe, test, expect } from '@jest/globals';
import { validateExtraction, parseJson, hasExtractableText, RESPONSE_SCHEMA } from './profileExtractor.js';

// The extractor stores NOTHING on a malformed response (roadmap Phase 9), so these strict-validation
// tests are the guard that a bad Gemini reply can never reach ranking.
const valid = {
  qualityGrade: 4,
  qualityReason: 'Specific A-Math results at named schools.',
  subjectsClaimed: [{ subject: 'Mathematics', level: 'Secondary', evidence: 'Raised student from C6 to A1' }],
  seniority: 'experienced',
  redFlags: [],
};

describe('validateExtraction', () => {
  test('accepts a well-formed object and returns a normalized payload', () => {
    expect(validateExtraction(valid)).toEqual(valid);
  });

  test('rejects a missing or out-of-range qualityGrade', () => {
    expect(validateExtraction({ ...valid, qualityGrade: 0 })).toBeNull();
    expect(validateExtraction({ ...valid, qualityGrade: 6 })).toBeNull();
    expect(validateExtraction({ ...valid, qualityGrade: '4' })).toBeNull();
    expect(validateExtraction({ ...valid, qualityGrade: undefined })).toBeNull();
    expect(validateExtraction({ ...valid, qualityGrade: NaN })).toBeNull();
  });

  test('rounds a fractional grade to an integer', () => {
    expect(validateExtraction({ ...valid, qualityGrade: 3.7 }).qualityGrade).toBe(4);
  });

  test('rejects an invalid seniority band', () => {
    expect(validateExtraction({ ...valid, seniority: 'senior' })).toBeNull();
    expect(validateExtraction({ ...valid, seniority: undefined })).toBeNull();
  });

  test('rejects non-objects', () => {
    expect(validateExtraction(null)).toBeNull();
    expect(validateExtraction('nope')).toBeNull();
    expect(validateExtraction([valid])).toBeNull();
  });

  test('coerces and bounds subjectsClaimed, dropping claims with no subject', () => {
    const out = validateExtraction({
      ...valid,
      subjectsClaimed: [
        { subject: 'Physics', level: 'JC', evidence: 'x' },
        { level: 'Secondary', evidence: 'no subject → dropped' },
        'garbage',
      ],
    });
    expect(out.subjectsClaimed).toEqual([{ subject: 'Physics', level: 'JC', evidence: 'x' }]);
  });

  test('defaults missing optional arrays/reason to empty', () => {
    const out = validateExtraction({ qualityGrade: 2, seniority: 'undergrad' });
    expect(out).toEqual({ qualityGrade: 2, qualityReason: '', subjectsClaimed: [], seniority: 'undergrad', redFlags: [] });
  });

  test('keeps only string redFlags', () => {
    const out = validateExtraction({ ...valid, redFlags: ['vague claim', 42, '', null, ' padded '] });
    expect(out.redFlags).toEqual(['vague claim', 'padded']);
  });

  test('does not carry through unexpected keys', () => {
    const out = validateExtraction({ ...valid, injected: 'DROP TABLE', extractedAt: 'spoofed' });
    expect(out).not.toHaveProperty('injected');
    expect(out).not.toHaveProperty('extractedAt');
  });
});

describe('parseJson', () => {
  test('parses a bare object', () => {
    expect(parseJson('{"a":1}')).toEqual({ a: 1 });
  });
  test('strips ```json fences', () => {
    expect(parseJson('```json\n{"a":1}\n```')).toEqual({ a: 1 });
  });
  test('recovers an object embedded in stray prose', () => {
    expect(parseJson('Sure! {"a":1} hope that helps')).toEqual({ a: 1 });
  });
  test('returns null on unparseable text', () => {
    expect(parseJson('not json at all')).toBeNull();
    expect(parseJson('')).toBeNull();
    expect(parseJson(null)).toBeNull();
  });
});

// Regression: gemini-2.5-flash under responseMimeType alone returned this body for a real tutor —
// the `}` closing the first subjectsClaimed element is missing, so the whole extraction was dropped.
// parseJson cannot recover it (the brace-block fallback re-extracts the same broken text), which is
// why generation is now schema-constrained. This documents the shape that motivated RESPONSE_SCHEMA.
describe('malformed model output that motivated RESPONSE_SCHEMA', () => {
  const malformed = `{
  "qualityGrade": 4,
  "qualityReason": "Specific achievements, though formal experience is limited.",
  "subjectsClaimed": [
    {
      "subject": "General Paper",
      "level": "JC",
      "evidence": "Achieved A grade in General Paper"
    ,
    {
      "subject": "Economics",
      "level": "JC (H1)",
      "evidence": "Helped students improve from D to B"
    }
  ],
  "seniority": "undergrad",
  "redFlags": []
}`;

  test('parseJson returns null rather than throwing or half-parsing', () => {
    expect(parseJson(malformed)).toBeNull();
  });

  test('schema covers every key validateExtraction requires, with a matching seniority enum', () => {
    for (const key of Object.keys(valid)) {
      expect(RESPONSE_SCHEMA.properties).toHaveProperty(key);
      expect(RESPONSE_SCHEMA.required).toContain(key);
    }
    // A schema enum that drifts from SENIORITY would let the model emit a value validateExtraction
    // then rejects — silently costing the tutor their features.
    expect([...RESPONSE_SCHEMA.properties.seniority.enum].sort())
      .toEqual(['early', 'experienced', 'undergrad', 'veteran']);
  });
});

describe('hasExtractableText', () => {
  test('true when the profile has meaningful free text', () => {
    expect(hasExtractableText({ introduction: 'I have taught Secondary Maths for six years.' })).toBe(true);
  });
  test('false for empty or near-empty profiles', () => {
    expect(hasExtractableText({})).toBe(false);
    expect(hasExtractableText({ introduction: '   ', trackRecord: '' })).toBe(false);
    expect(hasExtractableText({ introduction: 'hi' })).toBe(false);
  });
});
