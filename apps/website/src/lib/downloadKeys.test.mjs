import { test } from "node:test";
import assert from "node:assert/strict";
import { getAllFileKeys, isKnownFileKey } from "./downloadKeys.mjs";

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
