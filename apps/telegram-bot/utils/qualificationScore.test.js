import { describe, test, expect } from '@jest/globals';
import {
  educationTier,
  prestigeSignal,
  trackRecordFactor,
  shortlistScore,
} from './tutorMatcher.js';

describe('educationTier', () => {
  test('ranks postgraduate above undergraduate above school-leaver', () => {
    const phd = educationTier({ highestEducation: 'PhD' });
    const masters = educationTier({ highestEducation: "Master's Degree" });
    const bachelors = educationTier({ highestEducation: "Bachelor's Degree" });
    const undergrad = educationTier({ highestEducation: 'Undergraduate' });
    const alevel = educationTier({ highestEducation: 'A-Level' });
    expect(phd).toBeGreaterThanOrEqual(masters);
    expect(masters).toBeGreaterThan(bachelors);
    expect(bachelors).toBeGreaterThan(undergrad);
    expect(undergrad).toBeGreaterThan(alevel);
  });

  test('matches case-insensitively and ignores surrounding wording', () => {
    expect(educationTier({ highestEducation: 'bachelors degree (hons)' }))
      .toBe(educationTier({ highestEducation: "Bachelor's Degree" }));
  });

  test('an unset or unrecognised value scores neutral-low, never NaN', () => {
    expect(educationTier({})).toBe(0);
    expect(educationTier({ highestEducation: 'Something else' })).toBe(0);
  });
});

describe('prestigeSignal', () => {
  test('recognises a named school in either school field', () => {
    expect(prestigeSignal({ previousSchools: 'Raffles Institution' })).toBeGreaterThan(0);
    expect(prestigeSignal({ currentSchool: 'NUS' })).toBeGreaterThan(0);
  });

  test('an ex-MOE teacher is credited', () => {
    expect(prestigeSignal({ previousSchools: 'Ex-MOE teacher, 8 years' })).toBeGreaterThan(0);
  });

  test('two named institutions score above one', () => {
    const both = prestigeSignal({ currentSchool: 'NUS', previousSchools: 'Hwa Chong Institution' });
    const one = prestigeSignal({ currentSchool: 'NUS' });
    expect(both).toBeGreaterThan(one);
  });

  test('caps at 1 so a long school list cannot dominate the score', () => {
    expect(prestigeSignal({
      previousSchools: 'RI, HCI, NUS, NTU, SMU, ACS(I), Oxford',
    })).toBeLessThanOrEqual(1);
  });

  test('an unlisted school scores zero rather than penalising', () => {
    expect(prestigeSignal({ currentSchool: 'Some Private Academy' })).toBe(0);
  });
});

describe('trackRecordFactor', () => {
  test('a never-placed tutor is neutral, not penalised', () => {
    expect(trackRecordFactor({})).toBe(0);
    expect(trackRecordFactor({ stats: { placed: 0 } })).toBe(0);
  });

  test('more placements score higher', () => {
    expect(trackRecordFactor({ stats: { placed: 8, survived30d: 8 } }))
      .toBeGreaterThan(trackRecordFactor({ stats: { placed: 1, survived30d: 1 } }));
  });

  test('placements that survived 30 days count for more than ones that did not', () => {
    expect(trackRecordFactor({ stats: { placed: 5, survived30d: 5 } }))
      .toBeGreaterThan(trackRecordFactor({ stats: { placed: 5, survived30d: 0 } }));
  });

  test('never exceeds 1, however many placements', () => {
    expect(trackRecordFactor({ stats: { placed: 500, survived30d: 500 } })).toBeLessThanOrEqual(1);
  });
});

describe('shortlistScore folds the new dimensions in', () => {
  const base = {
    _id: 'x',
    yearsOfExperience: '3-5 years',
    introduction: 'a'.repeat(200),
    teachingExperience: 'b'.repeat(200),
    trackRecord: 'c'.repeat(200),
    hourlyRate: { secondary: '$40/hr' },
    tutorType: 'Part-time Tutor',
    teachingLevels: { secondary: { mathematics: true } },
  };
  const assignment = { level: 'Secondary 3', subject: 'Mathematics', title: 'Sec 3 Maths', rate: '$50/hr' };

  test('a better-qualified tutor outranks an identical one without the degree', () => {
    const grad = shortlistScore({ ...base, highestEducation: "Master's Degree" }, assignment);
    const plain = shortlistScore(base, assignment);
    expect(grad).toBeGreaterThan(plain);
  });

  test('a named school lifts an otherwise identical tutor', () => {
    const exRi = shortlistScore({ ...base, previousSchools: 'Raffles Institution' }, assignment);
    expect(exRi).toBeGreaterThan(shortlistScore(base, assignment));
  });

  test('a proven tutor outranks an identical unproven one', () => {
    const proven = shortlistScore({ ...base, stats: { placed: 10, survived30d: 9 } }, assignment);
    expect(proven).toBeGreaterThan(shortlistScore(base, assignment));
  });

  test('a strongly-credentialled junior can outrank a bare senior', () => {
    const credentialled = shortlistScore({
      ...base,
      yearsOfExperience: '1-3 years',
      highestEducation: "Bachelor's Degree",
      previousSchools: 'Raffles Institution',
      currentSchool: 'NUS',
      stats: { placed: 6, survived30d: 6 },
    }, assignment);
    const bareSenior = shortlistScore({ ...base, yearsOfExperience: '10+ years' }, assignment);
    expect(credentialled).toBeGreaterThan(bareSenior);
  });

  test('stays within 0..1 so downstream comparisons keep their meaning', () => {
    const maxed = shortlistScore({
      ...base,
      yearsOfExperience: '10+ years',
      highestEducation: 'PhD',
      currentSchool: 'NUS',
      previousSchools: 'Raffles Institution, Hwa Chong Institution',
      hourlyRate: { secondary: '$20/hr' },
      stats: { placed: 50, survived30d: 50 },
      profileFeatures: { qualityGrade: 5 },
    }, assignment);
    expect(maxed).toBeGreaterThan(0);
    expect(maxed).toBeLessThanOrEqual(1);
  });
});
