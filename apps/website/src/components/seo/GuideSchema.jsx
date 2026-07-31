import {
  buildBreadcrumbSchema, buildArticleSchema, buildFaqSchema, buildCourseSchema,
  buildCollectionPageSchema,
} from '@/lib/seo/schema.mjs';

/**
 * Emits the JSON-LD for a cluster page. Renders nothing visible.
 *
 * @param {string} slug - registry slug
 * @param {object} [article] - { headline, description, datePublished, dateModified }
 * @param {object} [course] - { name, description, educationalLevel } for subject pages
 * @param {object} [collection] - { name, description, items } for resource pages
 * @param {Array<{question: string, answer: string}>} [faqs]
 */
export default function GuideSchema({ slug, article, course, collection, faqs }) {
  const schemas = [
    buildBreadcrumbSchema(slug),
    article ? buildArticleSchema({ slug, ...article }) : null,
    course ? buildCourseSchema({ slug, ...course }) : null,
    collection ? buildCollectionPageSchema({ slug, ...collection }) : null,
    buildFaqSchema(faqs),
  ].filter(Boolean);

  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
