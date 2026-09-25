import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeSgMobile, isSgMobile, formatSgMobile, normalizeLeadPhone } from './phone.mjs';
import { normalizePhone, generatePhoneVariations } from '@lioncity/shared/utils/phoneUtils.js';

test('normalizeSgMobile', async (t) => {
  await t.test('accepts the format the placeholder demonstrates', () => {
    // "e.g., 9123 4567" is what the field shows the visitor. The old regex
    // tested the raw string and rejected it — this is the bug that motivated
    // the module, so it gets the first test.
    assert.equal(normalizeSgMobile('9123 4567'), '91234567');
  });

  await t.test('accepts what autoComplete="tel" fills in', () => {
    assert.equal(normalizeSgMobile('+6591234567'), '91234567');
    assert.equal(normalizeSgMobile('+65 9123 4567'), '91234567');
    assert.equal(normalizeSgMobile('+65 9123-4567'), '91234567');
  });

  await t.test('accepts a bare local number unchanged', () => {
    assert.equal(normalizeSgMobile('91234567'), '91234567');
    assert.equal(normalizeSgMobile('81234567'), '81234567');
    assert.equal(normalizeSgMobile('61234567'), '61234567');
  });

  await t.test('absorbs incidental punctuation and whitespace', () => {
    assert.equal(normalizeSgMobile('  9123 4567  '), '91234567');
    assert.equal(normalizeSgMobile('9123-4567'), '91234567');
    assert.equal(normalizeSgMobile('9123.4567'), '91234567');
    assert.equal(normalizeSgMobile('(65) 9123 4567'), '91234567');
    assert.equal(normalizeSgMobile('9123 4567'), '91234567'); // non-breaking space
  });

  await t.test('handles the other country-code spellings', () => {
    assert.equal(normalizeSgMobile('006591234567'), '91234567');
    assert.equal(normalizeSgMobile('06591234567'), '91234567');
    assert.equal(normalizeSgMobile('6591234567'), '91234567');
  });

  await t.test('does not mistake a local 6-number for a country code', () => {
    // '65123456' is 8 digits starting with 6 — a number the site has always
    // accepted. Stripping a "65" prefix here would corrupt it into '123456'.
    assert.equal(normalizeSgMobile('65123456'), '65123456');
  });

  await t.test('still rejects everything the old rule rejected', () => {
    assert.equal(normalizeSgMobile('12345678'), null);  // wrong leading digit
    assert.equal(normalizeSgMobile('9123456'), null);   // too short
    assert.equal(normalizeSgMobile('912345678'), null); // too long
    assert.equal(normalizeSgMobile('abcdefgh'), null);
    assert.equal(normalizeSgMobile(''), null);
    assert.equal(normalizeSgMobile('   '), null);
  });

  await t.test('is safe on non-string input', () => {
    assert.equal(normalizeSgMobile(null), null);
    assert.equal(normalizeSgMobile(undefined), null);
    assert.equal(normalizeSgMobile(91234567), null);
    assert.equal(normalizeSgMobile({}), null);
  });
});

test('isSgMobile mirrors normalizeSgMobile', () => {
  assert.equal(isSgMobile('+65 9123 4567'), true);
  assert.equal(isSgMobile('12345678'), false);
});

test('formatSgMobile', async (t) => {
  await t.test('groups an accepted number for display', () => {
    assert.equal(formatSgMobile('+6591234567'), '9123 4567');
  });

  await t.test('returns null rather than echoing an invalid number', () => {
    assert.equal(formatSgMobile('12345678'), null);
  });
});

test('normalizeLeadPhone', async (t) => {
  await t.test('reduces any written Singapore mobile to 8 digits', () => {
    assert.equal(normalizeLeadPhone('+65 9123 4567'), '91234567');
    assert.equal(normalizeLeadPhone('9123-4567'), '91234567');
  });

  await t.test('keeps overseas numbers the gate always accepted', () => {
    assert.equal(normalizeLeadPhone('+60 12-345 6789'), '60123456789');
  });

  await t.test('rejects fewer than 8 digits and non-strings', () => {
    assert.equal(normalizeLeadPhone('1234 567'), null);
    assert.equal(normalizeLeadPhone(''), null);
    assert.equal(normalizeLeadPhone(undefined), null);
  });
});

// The bot matches tutor replies with the shared normalizePhone, so every number the site
// accepts must reduce to the same 8 digits on both sides.
test('site parsing agrees with the shared matcher', async (t) => {
  const numbers = ['61234567', '80000001', '91234567', '98765432', '65123456'];
  const formats = [
    (n) => n,
    (n) => `+65${n}`,
    (n) => `+65 ${n.slice(0, 4)} ${n.slice(4)}`,
    (n) => `0065 ${n}`,
    (n) => `065-${n.slice(0, 4)}-${n.slice(4)}`,
    (n) => `(+65) ${n.slice(0, 4)}.${n.slice(4)}`,
    (n) => `${n.slice(0, 4)} ${n.slice(4)}`,
  ];
  for (const n of numbers) {
    await t.test(n, () => {
      for (const format of formats) {
        const raw = format(n);
        assert.equal(normalizeSgMobile(raw), n, raw);
        assert.equal(normalizePhone(raw), n, raw);
        assert.ok(generatePhoneVariations(normalizeSgMobile(raw)).includes(n), raw);
      }
    });
  }
});
