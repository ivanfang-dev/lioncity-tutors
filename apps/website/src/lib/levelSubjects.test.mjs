import test from 'node:test';
import assert from 'node:assert/strict';
import { LEVEL_SUBJECT_MAPPINGS } from '@lioncity/shared/client-exports.js';
import {
  LEVELS, emptyStudent, yearsFor, subjectsFor, selectLevel, selectYear,
  studentError, toLevelSubjects, fromLegacy,
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

  await t.test('text-only levels have no chips', () => {
    assert.deepEqual(subjectsFor('ite-poly', 'ITE'), []);
    assert.deepEqual(subjectsFor('other', ''), []);
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
    assert.equal(band({ level: 'ib-igcse', year: 'IGCSE', subjects: ['Mathematics'] }), 'ib');
  });
});

test('fromLegacy keeps what an old draft typed', () => {
  assert.deepEqual(fromLegacy(['Sec 3 A Math', '', 'Sec 3 Chem']), [student({ level: 'other', other: 'Sec 3 A Math; Sec 3 Chem' })]);
  assert.deepEqual(fromLegacy(['']), [student({})]);
  assert.deepEqual(fromLegacy(undefined), [student({})]);
});
