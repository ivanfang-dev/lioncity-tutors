import { test } from "node:test";
import assert from "node:assert/strict";
import {
  getAllFileKeys,
  isKnownFileKey,
  getAllPaperKeys,
  isKnownPaperKey,
  paperKeyOf,
  downloadFilename,
} from "./downloadKeys.mjs";

test("collects fileKeys from papers and notes", () => {
  const keys = getAllFileKeys();
  assert.ok(keys.length >= 37, `expected >= 37 keys, got ${keys.length}`);
  assert.ok(keys.some((k) => k.startsWith("papers/")));
  assert.ok(keys.some((k) => k.startsWith("notes/")));
});

test("every fileKey is a slugified pdf path", () => {
  for (const key of getAllFileKeys()) {
    assert.match(key, /^(papers|notes)\/[a-z0-9/-]+\.pdf$/, `bad key: ${key}`);
  }
});

test("fileKeys are unique", () => {
  const keys = getAllFileKeys();
  assert.equal(new Set(keys).size, keys.length);
});

test("isKnownFileKey rejects unknown keys", () => {
  assert.equal(isKnownFileKey("papers/../../etc/passwd"), false);
  assert.equal(isKnownFileKey("papers/nope.pdf"), false);
  assert.equal(isKnownFileKey(getAllFileKeys()[0]), true);
});

test("every paper has a key, and keys are unique", () => {
  const keys = getAllPaperKeys();
  assert.ok(keys.length >= 196, `expected >= 196 papers, got ${keys.length}`);
  assert.equal(new Set(keys).size, keys.length, "paper keys must be unique");
  assert.ok(keys.every(Boolean), "no paper may be missing a key");
});

test("paperKeyOf prefers the R2 key over the legacy Drive URL", () => {
  assert.equal(paperKeyOf({ fileKey: "papers/a.pdf", downloadUrl: "https://x" }), "papers/a.pdf");
  assert.equal(paperKeyOf({ downloadUrl: "https://x" }), "https://x");
  assert.equal(paperKeyOf({}), null);
  assert.equal(paperKeyOf(undefined), null);
});

test("isKnownPaperKey rejects keys we do not serve", () => {
  assert.equal(isKnownPaperKey("papers/nope.pdf"), false);
  assert.equal(isKnownPaperKey("https://evil.example/x"), false);
  assert.equal(isKnownPaperKey(""), false);
  assert.equal(isKnownPaperKey(undefined), false);
  assert.equal(isKnownPaperKey(getAllPaperKeys()[0]), true);
});

test("downloadFilename leads with the brand and ends in .pdf", () => {
  const name = downloadFilename("notes/jc/physics/jc-h2-physics-9478-master-study-notes.pdf");
  assert.ok(name.startsWith("LionCity Tutors - "), name);
  assert.ok(name.endsWith(".pdf"), name);
  assert.ok(name.includes("9478"), name);
});

test("downloadFilename strips characters filesystems reject", () => {
  for (const key of getAllFileKeys()) {
    const name = downloadFilename(key);
    assert.doesNotMatch(name, /[:/\\"*?<>|]/, `illegal character in: ${name}`);
    // eslint-disable-next-line no-control-regex
    assert.doesNotMatch(name, /[\u0000-\u001f]/, `control character in: ${name}`);
    assert.ok(name.length <= 124, `too long: ${name}`);
    assert.doesNotMatch(name, /\s{2,}/, `double space in: ${name}`);
  }
});

test("downloadFilename keeps real hyphens intact", () => {
  const name = downloadFilename("notes/secondary/o-level/english/o-level-english-language-study-guide.pdf");
  assert.ok(name.includes("O-Level"), name);
  assert.ok(!name.includes("O - Level"), name);
});

test("downloadFilename falls back to the key for anything untitled", () => {
  assert.equal(downloadFilename("notes/unknown/thing.pdf"), "thing.pdf");
});
