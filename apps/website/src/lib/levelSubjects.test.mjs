import test from 'node:test';
import assert from 'node:assert/strict';
import { LEVEL_SUBJECT_MAPPINGS } from '@lioncity/shared/client-exports.js';
import {
  LEVELS, emptyStudent, yearsFor, subjectsFor, selectLevel, selectYear,
  studentError, toLevelSubjects, fromLegacy, subjectGroups, needsArrangement, tutorArrangement,
  normalizeStudent,
} from './levelSubjects.mjs';
import { bandForLevelText } from '../app/tuition-rates/rates.mjs';

const student = (fields) => ({ ...emptyStudent(), ...fields });

test('subject chips use the shared subject names', async (t) => {
  for (const level of LEVELS) {
    for (const year of level.years.filter((y) => y.canonical)) {
      await t.test(`${year.name}`, () => {
        const offered = LEVEL_SUBJECT_MAPPINGS[year.canonical];
        assert.ok(offered, `${year.canonical} is not a shared level`);
        for (const subject of subjectsFor(level.id, year.id)) {
          assert.ok(offered.includes(subject.name), `${subject.name} is not offered at ${year.canonical}`);
        }
      });
    }
  }

  await t.test('every curated chip shows for at least one year', () => {
    for (const level of LEVELS) {
      const shown = new Set(level.years.flatMap((y) => subjectsFor(level.id, y.id).map((s) => s.name)));
      for (const subject of level.subjects) {
        assert.ok(shown.has(subject.name), `${level.id}: ${subject.name} never shows`);
      }
    }
  });
});

test('subjectsFor', async (t) => {
  await t.test('lower primary has no Science', () => {
    const names = subjectsFor('primary', 'P2').map((s) => s.name);
    assert.ok(!names.includes('Science'));
    assert.ok(subjectsFor('primary', 'P5').some((s) => s.name === 'Science'));
  });

  await t.test('upper secondary offers E-Math and A-Math, not plain Math', () => {
    const names = subjectsFor('secondary', 'S3').map((s) => s.name);
    assert.ok(names.includes('Elementary Mathematics'));
    assert.ok(names.includes('Additional Mathematics'));
    assert.ok(!names.includes('Mathematics'));
    assert.ok(subjectsFor('secondary', 'S1').some((s) => s.name === 'Mathematics'));
  });

  await t.test('upper secondary leads with the nine most-asked subjects', () => {
    const upfront = subjectsFor('secondary', 'S3').filter((s) => !s.more).map((s) => s.label);
    assert.deepEqual(upfront, [
      'E-Math', 'A-Math', 'Physics', 'Chemistry', 'Biology',
      'Combined (Phy/Chem)', 'Combined (Chem/Bio)', 'English', 'Chinese',
    ]);
    assert.ok(subjectsFor('secondary', 'S3').some((s) => s.more && s.label === 'POA'));
  });

  await t.test('text-only levels have no chips', () => {
    assert.deepEqual(subjectsFor('ite-poly', 'ITE'), []);
    assert.deepEqual(subjectsFor('other', ''), []);
  });
});

test('subjectGroups', async (t) => {
  const shape = (groups) => groups.map((g) => [g.label, g.subjects.map((s) => s.label)]);

  await t.test('long lists are grouped, math first', () => {
    assert.deepEqual(shape(subjectGroups('secondary', 'S3', false)), [
      ['Math', ['E-Math', 'A-Math']],
      ['Sciences', ['Physics', 'Chemistry', 'Biology', 'Combined (Phy/Chem)', 'Combined (Chem/Bio)']],
      ['Languages', ['English', 'Chinese']],
    ]);
  });

  await t.test('More subjects fills out the groups', () => {
    assert.deepEqual(shape(subjectGroups('secondary', 'S3', true)).slice(2), [
      ['Languages', ['English', 'Chinese', 'Malay', 'Tamil']],
      ['Humanities & others', ['Literature', 'History', 'Geography', 'POA']],
    ]);
  });

  await t.test('short lists stay one plain grid', () => {
    assert.deepEqual(shape(subjectGroups('primary', 'P5', false)), [
      [null, ['Math', 'Science', 'English', 'Chinese', 'Malay', 'Tamil']],
    ]);
    assert.deepEqual(shape(subjectGroups('secondary', 'S1', false)), [
      [null, ['Math', 'Science', 'English', 'Chinese']],
    ]);
  });
});

test('tutor arrangement', async (t) => {
  await t.test('asked only once a child has two or more subjects', () => {
    assert.equal(needsArrangement(student({ level: 'primary', year: 'P6', subjects: ['Mathematics'] })), false);
    assert.equal(needsArrangement(student({ level: 'primary', year: 'P6', subjects: ['Mathematics', 'Science'] })), true);
    assert.equal(needsArrangement(student({ level: 'primary', year: 'P6', subjects: ['Mathematics'], other: 'Hindi' })), true);
  });

  await t.test('one child reads plainly', () => {
    const s = student({ level: 'primary', year: 'P6', subjects: ['Mathematics', 'Science'], arrangement: 'split' });
    assert.equal(tutorArrangement([s]), 'Separate tutors are fine');
  });

  await t.test('siblings are labelled, skipping unanswered or single-subject children', () => {
    assert.equal(tutorArrangement([
      student({ level: 'primary', year: 'P6', subjects: ['Mathematics', 'Science'], arrangement: 'one' }),
      student({ level: 'primary', year: 'P2', subjects: ['Chinese'], arrangement: 'split' }),
      student({ level: 'secondary', year: 'S3', subjects: ['Physics', 'Chemistry'] }),
    ]), 'Child 1: One tutor for all');
  });

  await t.test('nothing answered sends nothing', () => {
    assert.equal(tutorArrangement([student({ level: 'primary', year: 'P6', subjects: ['Mathematics', 'Science'] })]), '');
  });
});

test('selectLevel and selectYear', async (t) => {
  await t.test('changing level clears what belonged to the old one', () => {
    const s = student({ level: 'secondary', year: 'S3', stream: 'G3', subjects: ['Physics'], other: 'notes' });
    assert.deepEqual(selectLevel(s, 'primary'), student({ level: 'primary', other: 'notes' }));
  });

  await t.test('reselecting the same level keeps everything', () => {
    const s = student({ level: 'secondary', year: 'S3', subjects: ['Physics'] });
    assert.deepEqual(selectLevel(s, 'secondary'), s);
  });

  await t.test('changing year drops subjects the new year does not offer', () => {
    const s = student({ level: 'secondary', year: 'S3', subjects: ['Additional Mathematics', 'English Language'] });
    assert.deepEqual(selectYear(s, 'S1').subjects, ['English Language']);
  });
});

test('studentError', async (t) => {
  await t.test('asks for each missing piece in order', () => {
    assert.match(studentError(student({})), /level/i);
    assert.match(studentError(student({ level: 'primary' })), /year/i);
    assert.match(studentError(student({ level: 'primary', year: 'P6' })), /subject/i);
  });

  await t.test('stream is optional', () => {
    assert.equal(studentError(student({ level: 'secondary', year: 'S3', subjects: ['Physics'] })), null);
  });

  await t.test('Other text stands in for a subject chip', () => {
    assert.equal(studentError(student({ level: 'primary', year: 'P6', other: 'Hindi' })), null);
  });

  await t.test('text-only levels need the text', () => {
    assert.match(studentError(student({ level: 'ite-poly', year: 'ITE' })), /course/i);
    assert.equal(studentError(student({ level: 'ite-poly', year: 'ITE', other: 'Nitec Electrical' })), null);
    assert.match(studentError(student({ level: 'other' })), /tell us/i);
    assert.equal(studentError(student({ level: 'other', other: 'University calculus' })), null);
  });
});

test('toLevelSubjects', async (t) => {
  await t.test('one line per subject, with the stream', () => {
    const s = student({ level: 'secondary', year: 'S3', stream: 'G3', subjects: ['Additional Mathematics', 'Chemistry'] });
    assert.deepEqual(toLevelSubjects([s]), [
      'Secondary 3 Additional Mathematics (G3 / Express)',
      'Secondary 3 Chemistry (G3 / Express)',
    ]);
  });

  await t.test('Other text follows the chips under the same level', () => {
    const s = student({ level: 'primary', year: 'P6', subjects: ['Mathematics'], other: ' Hindi ' });
    assert.deepEqual(toLevelSubjects([s]), ['Primary 6 Mathematics', 'Primary 6 Hindi']);
  });

  await t.test('text-only levels and siblings', () => {
    assert.deepEqual(toLevelSubjects([
      student({ level: 'ite-poly', year: 'ITE', other: 'Nitec Electrical Engineering' }),
      student({ level: 'other', other: 'Adult conversational Mandarin' }),
    ]), ['ITE Nitec Electrical Engineering', 'Adult conversational Mandarin']);
  });

  await t.test('skips unfinished entries', () => {
    assert.deepEqual(toLevelSubjects([student({}), student({ level: 'primary', year: 'P4' })]), []);
  });

  await t.test('lines land in the right rate band', () => {
    const band = (fields) => bandForLevelText(toLevelSubjects([student(fields)])[0]);
    assert.equal(band({ level: 'primary', year: 'P6', subjects: ['Science'] }), 'primary');
    assert.equal(band({ level: 'secondary', year: 'S4', subjects: ['Physics'] }), 'secondary');
    assert.equal(band({ level: 'secondary', year: 'S3', stream: 'IP', subjects: ['Physics'] }), 'ib');
    assert.equal(band({ level: 'jc', year: 'J1', subjects: ['H2 Mathematics'] }), 'jc');
    assert.equal(band({ level: 'igcse', year: 'Y10', subjects: ['Mathematics'] }), 'ib');
    assert.equal(band({ level: 'ib', year: 'MYP4', subjects: ['Physics'] }), 'ib');
    assert.equal(band({ level: 'ib', year: 'DP2', subjects: ['Chemistry'] }), 'ib');
  });
});

test('IB and IGCSE grades', async (t) => {
  await t.test('each grade carries both names', () => {
    assert.deepEqual(yearsFor('igcse').map((y) => y.label), ['Year 10 / G9', 'Year 11 / G10']);
    assert.deepEqual(yearsFor('ib').map((y) => y.label), [
      'MYP 1 / G6', 'MYP 2 / G7', 'MYP 3 / G8', 'MYP 4 / G9', 'MYP 5 / G10', 'DP 1 / G11', 'DP 2 / G12',
    ]);
  });

  await t.test('the grade is required', () => {
    assert.match(studentError(student({ level: 'ib', subjects: ['Physics'] })), /year/i);
  });

  await t.test('lines name the programme and grade', () => {
    assert.deepEqual(toLevelSubjects([
      student({ level: 'igcse', year: 'Y11', subjects: ['Mathematics'] }),
      student({ level: 'ib', year: 'MYP4', subjects: ['Physics'] }),
      student({ level: 'ib', year: 'DP1', subjects: ['Chemistry'] }),
    ]), ['IGCSE Year 11 Mathematics', 'IB MYP 4 Physics', 'IB DP 1 Chemistry']);
  });
});

test('normalizeStudent', async (t) => {
  await t.test('fills fields an older draft lacks', () => {
    const { arrangement, ...old } = student({ level: 'primary', year: 'P6', subjects: ['Science'] });
    assert.deepEqual(normalizeStudent(old), student({ level: 'primary', year: 'P6', subjects: ['Science'] }));
  });

  await t.test('moves the old combined IB / IGCSE choice to its programme, grade cleared', () => {
    assert.deepEqual(normalizeStudent(student({ level: 'ib-igcse', year: 'IGCSE', subjects: ['Mathematics'] })),
      student({ level: 'igcse', subjects: ['Mathematics'] }));
    assert.deepEqual(normalizeStudent(student({ level: 'ib-igcse', year: 'DP', subjects: ['Physics'] })),
      student({ level: 'ib', subjects: ['Physics'] }));
  });
});

test('fromLegacy keeps what an old draft typed', () => {
  assert.deepEqual(fromLegacy(['Sec 3 A Math', '', 'Sec 3 Chem']), [student({ level: 'other', other: 'Sec 3 A Math; Sec 3 Chem' })]);
  assert.deepEqual(fromLegacy(['']), [student({})]);
  assert.deepEqual(fromLegacy(undefined), [student({})]);
});
