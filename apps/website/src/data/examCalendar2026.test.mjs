import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { EXAM_CALENDAR_2026, getExam, getSubjectPapers } from './examCalendar2026.mjs';

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

describe('exam calendar 2026', () => {
  test('covers all four national exams', () => {
    assert.deepEqual(
      Object.keys(EXAM_CALENDAR_2026).sort(),
      ['a-level', 'n-level', 'o-level', 'psle'],
    );
  });

  test('every date is an ISO string in 2026 or 2027', () => {
    for (const exam of Object.values(EXAM_CALENDAR_2026)) {
      for (const subject of exam.subjects) {
        for (const paper of subject.papers) {
          assert.match(paper.date, ISO_DATE, `${subject.slug} ${paper.label}`);
          const year = Number(paper.date.slice(0, 4));
          assert.ok(year === 2026 || year === 2027, `${subject.slug} ${paper.label} year ${year}`);
        }
      }
    }
  });

  test('O-Level science practicals sit on the confirmed SEAB dates', () => {
    const practicalDate = (subjectSlug) =>
      getSubjectPapers('o-level', subjectSlug).find((p) => p.label.includes('Practical')).date;

    assert.equal(practicalDate('chemistry'), '2026-09-30');
    assert.equal(practicalDate('physics'), '2026-10-05');
    assert.equal(practicalDate('biology'), '2026-10-13');
  });

  test('A-Level sciences carry the revised code with legacy recorded', () => {
    const chem = getExam('a-level').subjects.find((s) => s.slug === 'h2-chemistry');
    assert.equal(chem.code, '9476');
    assert.equal(chem.legacyCode, '9729');
  });

  test('results windows follow their exam windows', () => {
    for (const exam of Object.values(EXAM_CALENDAR_2026)) {
      assert.ok(
        exam.resultsWindow.start > exam.examWindow.end,
        `${exam.slug} results must follow the exam`,
      );
    }
  });

  test('getExam returns undefined for an unknown slug', () => {
    assert.equal(getExam('gce-z-level'), undefined);
  });
});
