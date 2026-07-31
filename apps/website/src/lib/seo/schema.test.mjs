import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildBreadcrumbSchema, buildArticleSchema, buildFaqSchema, buildCourseSchema,
  buildCollectionPageSchema,
} from './schema.mjs';

const SITE = 'https://www.lioncitytutors.com';

describe('breadcrumb schema', () => {
  test('emits absolute urls in order with 1-based positions', () => {
    const schema = buildBreadcrumbSchema('o-level-physics');
    assert.equal(schema['@type'], 'BreadcrumbList');
    assert.equal(schema.itemListElement.length, 3);
    assert.deepEqual(
      schema.itemListElement.map((i) => i.position),
      [1, 2, 3],
    );
    assert.equal(schema.itemListElement[0].item, `${SITE}/`);
    assert.equal(schema.itemListElement[2].item, `${SITE}/o-level-physics`);
  });

  test('returns null for an unknown slug', () => {
    assert.equal(buildBreadcrumbSchema('not-a-page'), null);
  });
});

describe('article schema', () => {
  test('carries headline, dates and a canonical url', () => {
    const schema = buildArticleSchema({
      slug: 'o-level-prep',
      headline: 'O-Level Preparation Guide 2026',
      description: 'A complete plan.',
      datePublished: '2026-01-10',
      dateModified: '2026-07-27',
    });
    assert.equal(schema['@type'], 'Article');
    assert.equal(schema.headline, 'O-Level Preparation Guide 2026');
    assert.equal(schema.dateModified, '2026-07-27');
    assert.equal(schema.mainEntityOfPage['@id'], `${SITE}/blog/o-level-preparation-guide`);
    assert.equal(schema.publisher.name, 'LionCity Tutors');
  });
});

describe('faq schema', () => {
  test('maps each entry to a Question with an accepted answer', () => {
    const schema = buildFaqSchema([
      { question: 'When are the 2026 O-Levels?', answer: 'Papers run from 2 June to 10 November 2026.' },
    ]);
    assert.equal(schema['@type'], 'FAQPage');
    assert.equal(schema.mainEntity[0]['@type'], 'Question');
    assert.equal(schema.mainEntity[0].name, 'When are the 2026 O-Levels?');
    assert.equal(
      schema.mainEntity[0].acceptedAnswer.text,
      'Papers run from 2 June to 10 November 2026.',
    );
  });

  test('returns null when there are no faqs', () => {
    assert.equal(buildFaqSchema([]), null);
    assert.equal(buildFaqSchema(undefined), null);
  });
});

describe('course schema', () => {
  test('describes a subject page as an educational program', () => {
    const schema = buildCourseSchema({
      slug: 'o-level-physics',
      name: 'O-Level Physics Tuition',
      description: 'One-to-one O-Level Physics tuition in Singapore.',
      educationalLevel: 'GCE O-Level',
    });
    assert.equal(schema['@type'], 'Course');
    assert.equal(schema.name, 'O-Level Physics Tuition');
    assert.equal(schema.educationalLevel, 'GCE O-Level');
    assert.equal(schema.url, `${SITE}/o-level-physics`);
    assert.equal(schema.provider.name, 'LionCity Tutors');
  });

  test('returns null for an unknown slug', () => {
    assert.equal(buildCourseSchema({ slug: 'not-a-page', name: 'x' }), null);
  });
});

describe('collection page schema', () => {
  const args = {
    slug: 'free-test-papers',
    name: 'Free Test Papers',
    description: 'Prelim and past year papers by level and subject.',
    items: [
      { name: 'O-Level prelim papers', url: '/free-test-papers#o-level' },
      { name: 'JC and A-Level prelim papers', url: '/free-test-papers#a-level' },
    ],
  };

  test('describes the page as a collection with a numbered item list', () => {
    const schema = buildCollectionPageSchema(args);
    assert.equal(schema['@type'], 'CollectionPage');
    assert.equal(schema.url, `${SITE}/free-test-papers`);
    assert.equal(schema.mainEntity['@type'], 'ItemList');
    assert.deepEqual(schema.mainEntity.itemListElement.map((i) => i.position), [1, 2]);
    assert.equal(
      schema.mainEntity.itemListElement[0].url,
      `${SITE}/free-test-papers#o-level`,
    );
    assert.equal(schema.publisher.name, 'LionCity Tutors');
  });

  test('omits the item list when there are no items', () => {
    const schema = buildCollectionPageSchema({ ...args, items: [] });
    assert.equal(schema.mainEntity, undefined);
    assert.equal(schema['@type'], 'CollectionPage');
  });

  test('returns null for an unknown slug', () => {
    assert.equal(buildCollectionPageSchema({ slug: 'not-a-page', name: 'x' }), null);
  });
});
