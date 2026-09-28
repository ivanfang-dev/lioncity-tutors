import { describe, test, expect } from '@jest/globals';
import { findMatchingTutorsScored } from './tutorMatcher.js';

// Ranking uses the extracted qualityGrade in place of the length-based commitmentScore when present.
const assignment = {
  level: 'Secondary 3',
  subject: 'Mathematics',
  title: 'Sec 3 Maths',
  location: 'Bishan',
  rate: '$50/hr',
};

function tutor(id, { text, qualityGrade }) {
  const filler = text ? 'x'.repeat(200) : '';
  return {
    _id: id,
    fullName: id,
    yearsOfExperience: '3-5 years',
    hourlyRate: { secondary: '$40/hr' },
    tutorType: 'Part-time Tutor',
    responseStats: { contacted: 10, responded: 8 },
    introduction: filler, teachingExperience: filler, trackRecord: filler,
    profileFeatures: qualityGrade == null ? undefined : { qualityGrade },
  };
}

// A: long profile (high commitmentScore) but a mediocre extracted grade.
// B: blank profile (commitmentScore 0) but a top extracted grade.
const A = tutor('A', { text: true, qualityGrade: 2 });
const B = tutor('B', { text: false, qualityGrade: 5 });

function fakeModel(docs) {
  const chain = { select: () => chain, sort: () => chain, limit: () => chain, lean: async () => docs };
  return { countDocuments: async () => docs.length, find: () => chain };
}

describe('qualityGrade scoring', () => {
  test('the extracted grade replaces commitmentScore, so high-grade B overtakes A', async () => {
    const scored = await findMatchingTutorsScored(assignment, 40, { model: fakeModel([A, B]) });
    expect(scored.map(s => s.tutor._id)).toEqual(['B', 'A']);
  });

  test('a tutor with no extracted grade falls back to commitmentScore', async () => {
    const noGrade = tutor('C', { text: true, qualityGrade: null }); // high commitment, no grade
    const blankNoGrade = tutor('D', { text: false, qualityGrade: null }); // low commitment, no grade
    const scored = await findMatchingTutorsScored(assignment, 40, { model: fakeModel([blankNoGrade, noGrade]) });
    expect(scored.map(s => s.tutor._id)).toEqual(['C', 'D']); // commitment ordering for ungraded tutors
  });
});
