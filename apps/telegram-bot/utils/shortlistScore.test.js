import { describe, test, expect } from '@jest/globals';
import { shortlistScore, shortlistReason } from './tutorMatcher.js';

// A single-subject Secondary Maths assignment with a $50 ceiling.
const assignment = {
  level: 'Secondary 3',
  subject: 'Mathematics',
  title: 'Sec 3 Maths',
  rate: '$50/hr',
};

// Baseline tutor: mid everything. Helpers override single dimensions so each test isolates one.
function tutor(overrides = {}) {
  return {
    _id: 'x',
    yearsOfExperience: '3-5 years',
    introduction: 'a'.repeat(200),
    teachingExperience: 'b'.repeat(200),
    trackRecord: 'c'.repeat(200),
    hourlyRate: { secondary: '$40/hr' },
    tutorType: 'Part-time Tutor',
    teachingLevels: { secondary: { mathematics: true } },
    responseStats: { contacted: 10, responded: 8 },
    ...overrides,
  };
}

describe('shortlistScore', () => {
  test('more experience ranks higher, all else equal', () => {
    const senior = shortlistScore(tutor({ yearsOfExperience: '10+ years' }), assignment);
    const junior = shortlistScore(tutor({ yearsOfExperience: '0-1 year' }), assignment);
    expect(senior).toBeGreaterThan(junior);
  });

  test('cheaper tutor (more budget comfort) ranks higher', () => {
    const cheap = shortlistScore(tutor({ hourlyRate: { secondary: '$30/hr' } }), assignment);
    const pricey = shortlistScore(tutor({ hourlyRate: { secondary: '$50/hr' } }), assignment);
    expect(cheap).toBeGreaterThan(pricey);
  });

  test('fuller profile (more commitment) ranks higher', () => {
    const full = shortlistScore(tutor(), assignment);
    const sparse = shortlistScore(tutor({ introduction: 'hi', teachingExperience: '', trackRecord: '' }), assignment);
    expect(full).toBeGreaterThan(sparse);
  });

  test('IGNORES responsiveness — a chronic ghost scores identically to a reliable replier', () => {
    // This is the whole point of the shortlist re-rank: they already replied, so response
    // history must not drag them down (unlike scoreTutor used for outreach ordering).
    const reliable = shortlistScore(tutor({ responseStats: { contacted: 20, responded: 20 } }), assignment);
    const ghost = shortlistScore(tutor({ responseStats: { contacted: 50, responded: 1 } }), assignment);
    expect(ghost).toBe(reliable);
  });

  test('for a multi-subject request, wider subject coverage ranks higher', () => {
    const multi = { level: 'Secondary 3', subject: 'Multiple Subjects', title: 'Maths and Physics', rate: '$50/hr' };
    const both = shortlistScore(
      tutor({ teachingLevels: { secondary: { mathematics: true, physics: true } } }),
      multi
    );
    const one = shortlistScore(
      tutor({ teachingLevels: { secondary: { mathematics: true } } }),
      multi
    );
    expect(both).toBeGreaterThan(one);
  });
});

describe('shortlistReason — owner rich-card line', () => {
  test('summarises experience, type and asking rate vs budget', () => {
    const line = shortlistReason(tutor({ yearsOfExperience: '5-10 years', hourlyRate: { secondary: '$40/hr' } }), assignment);
    expect(line).toBe('5-10 years exp · Part-time Tutor · asks $40/h vs $50/h budget');
  });

  test('flags a tutor over the budget ceiling', () => {
    const line = shortlistReason(tutor({ hourlyRate: { secondary: '$60/hr' } }), assignment);
    expect(line).toContain('⚠️ over');
  });

  test('handles a tutor who never listed a rate', () => {
    const line = shortlistReason(tutor({ hourlyRate: {} }), assignment);
    expect(line).toContain('rate not listed');
    expect(line).toContain('budget $50/h');
  });
});
