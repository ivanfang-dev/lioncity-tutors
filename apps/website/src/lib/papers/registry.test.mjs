import test from 'node:test';
import assert from 'node:assert/strict';
import { getPaperGroups, getRenamedGroupRedirects } from './registry.mjs';

test('renamed subjects redirect their old group URLs to live groups', () => {
  const live = new Set(getPaperGroups().map((g) => g.url));
  const redirects = getRenamedGroupRedirects();

  assert.ok(redirects.some((r) => r.source === '/free-test-papers/secondary/sec-4-math-2025-prelim-paper-1'));
  for (const { source, destination, permanent } of redirects) {
    assert.ok(live.has(destination), `${destination} is not a live group`);
    assert.ok(!live.has(source), `${source} is still a live group`);
    assert.equal(permanent, true);
  }
});

test('A-Math groups use the A Math name', () => {
  const aMath = getPaperGroups().filter((g) => g.subject === 'Secondary 4 A Math');
  assert.ok(aMath.length > 0);
  for (const g of aMath) assert.match(g.heading, /^Sec 4 A Math /);
});
