import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { HUBS, SPOKES } from './clusters.mjs';
import { getPage, getHubFor, getHubsFor, getSiblings, getBreadcrumbs, allSlugs } from './links.mjs';

const appDir = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'app');

describe('cluster registry integrity', () => {
  test('every spoke names a hub that exists', () => {
    for (const spoke of Object.values(SPOKES)) {
      assert.ok(HUBS[spoke.hub], `${spoke.slug} names missing hub ${spoke.hub}`);
    }
  });

  test('link reciprocity: every spoke is listed by its own hub', () => {
    for (const spoke of Object.values(SPOKES)) {
      assert.ok(
        HUBS[spoke.hub].spokes.includes(spoke.slug),
        `hub ${spoke.hub} does not list spoke ${spoke.slug}`,
      );
    }
  });

  test('link reciprocity: every slug a hub lists is a real spoke pointing back', () => {
    for (const hub of Object.values(HUBS)) {
      for (const slug of hub.spokes) {
        assert.ok(SPOKES[slug], `hub ${hub.slug} lists unknown spoke ${slug}`);
        const spoke = SPOKES[slug];
        const linked = spoke.hub === hub.slug || (spoke.alsoIn ?? []).includes(hub.slug);
        assert.ok(linked, `${slug} does not point back to ${hub.slug}`);
      }
    }
  });

  test('link reciprocity: every alsoIn hub lists the spoke too', () => {
    for (const spoke of Object.values(SPOKES)) {
      for (const hubSlug of spoke.alsoIn ?? []) {
        assert.ok(HUBS[hubSlug], `${spoke.slug} names missing alsoIn hub ${hubSlug}`);
        assert.ok(
          HUBS[hubSlug].spokes.includes(spoke.slug),
          `alsoIn hub ${hubSlug} does not list spoke ${spoke.slug}`,
        );
      }
    }
  });

  test('a spoke never lists its primary hub in alsoIn', () => {
    for (const spoke of Object.values(SPOKES)) {
      assert.ok(
        !(spoke.alsoIn ?? []).includes(spoke.hub),
        `${spoke.slug} repeats its primary hub in alsoIn`,
      );
    }
  });

  test('every url is unique and root-relative', () => {
    const urls = allSlugs().map((slug) => getPage(slug).url);
    assert.equal(new Set(urls).size, urls.length, 'duplicate url in registry');
    for (const url of urls) assert.ok(url.startsWith('/'), `${url} is not root-relative`);
  });

  test('every registry url resolves to a real route', () => {
    for (const slug of allSlugs()) {
      const { url } = getPage(slug);
      const routeDir = join(appDir, url.replace(/^\//, ''));
      assert.ok(
        existsSync(join(routeDir, 'page.jsx')) || existsSync(join(routeDir, 'page.js')),
        `${slug} -> ${url} has no page file`,
      );
    }
  });

  test('every entry carries non-empty anchor text', () => {
    for (const slug of allSlugs()) {
      const anchor = getPage(slug).anchor;
      assert.ok(anchor && anchor.trim().length > 0, `${slug} has no anchor text`);
    }
  });
});

describe('link helpers', () => {
  test('getHubFor returns the hub entry for a spoke', () => {
    assert.equal(getHubFor('o-level-physics').slug, 'o-level-prep');
  });

  test('getHubFor returns the hub itself when given a hub', () => {
    assert.equal(getHubFor('o-level-prep').slug, 'o-level-prep');
  });

  test('getSiblings excludes the page itself', () => {
    const siblings = getSiblings('o-level-physics');
    assert.ok(siblings.length > 0);
    assert.ok(!siblings.some((s) => s.slug === 'o-level-physics'));
  });

  test('getSiblings returns spokes when given a hub', () => {
    const siblings = getSiblings('o-level-prep');
    assert.ok(siblings.some((s) => s.slug === 'o-level-physics'));
  });

  test('getBreadcrumbs runs Home -> hub -> page for a spoke', () => {
    const crumbs = getBreadcrumbs('o-level-physics');
    assert.deepEqual(crumbs.map((c) => c.name), [
      'Home',
      HUBS['o-level-prep'].title,
      SPOKES['o-level-physics'].title,
    ]);
    assert.equal(crumbs[0].url, '/');
  });

  test('getBreadcrumbs runs Home -> hub for a hub', () => {
    const crumbs = getBreadcrumbs('o-level-prep');
    assert.equal(crumbs.length, 2);
    assert.equal(crumbs[1].url, HUBS['o-level-prep'].url);
  });

  test('unknown slug returns undefined rather than throwing', () => {
    assert.equal(getPage('not-a-page'), undefined);
    assert.equal(getHubFor('not-a-page'), undefined);
    assert.deepEqual(getSiblings('not-a-page'), []);
    assert.deepEqual(getBreadcrumbs('not-a-page'), []);
  });

  test('getHubsFor returns primary hub plus alsoIn hubs', () => {
    const hubs = getHubsFor('combined-science-overview').map((h) => h.slug);
    assert.deepEqual(hubs, ['o-level-prep', 'n-level-prep']);
  });

  test('getHubsFor returns a single hub for a normal spoke', () => {
    assert.deepEqual(getHubsFor('o-level-physics').map((h) => h.slug), ['o-level-prep']);
  });

  test('getHubsFor returns [] for an unknown slug', () => {
    assert.deepEqual(getHubsFor('not-a-page'), []);
  });
});

describe('commercial pages', () => {
  test('each subject-tuition page sits in the hub its traffic comes from', () => {
    const expected = {
      'math-tuition': ['o-level-prep', 'a-level-prep'],
      'science-tuition': ['o-level-prep', 'a-level-prep'],
      'chemistry-tuition': ['o-level-prep', 'a-level-prep'],
      'physics-tuition': ['o-level-prep', 'a-level-prep'],
      'biology-tuition': ['o-level-prep', 'a-level-prep'],
      'english-tuition': ['o-level-prep'],
      'chinese-tuition': ['psle-prep', 'o-level-prep'],
      'economics-tuition': ['a-level-prep'],
      'secondary-school-tuition': ['o-level-prep', 'n-level-prep'],
    };
    for (const [slug, hubs] of Object.entries(expected)) {
      assert.deepEqual(getHubsFor(slug).map((h) => h.slug), hubs, `${slug} hubs`);
    }
  });

  test('tuition-rates is surfaced by every exam-level hub', () => {
    assert.deepEqual(getHubsFor('tuition-rates').map((h) => h.slug), [
      'o-level-prep', 'a-level-prep', 'n-level-prep', 'psle-prep',
    ]);
  });

  test('only the rate card overrides the Course schema default', () => {
    const overridden = Object.values(SPOKES).filter((s) => s.schemaType);
    assert.deepEqual(overridden.map((s) => [s.slug, s.schemaType]), [['tuition-rates', 'Service']]);
  });
});
