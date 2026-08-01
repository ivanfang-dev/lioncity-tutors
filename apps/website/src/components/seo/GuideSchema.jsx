import {
  buildBreadcrumbSchema, buildBreadcrumbTrail, buildArticleSchema, buildFaqSchema,
  buildCourseSchema, buildCollectionPageSchema, buildServiceSchema,
} from '@/lib/seo/schema.mjs';

/**
 * Emits the JSON-LD for a page. Renders nothing visible.
 *
 * A page passes whichever content type describes it: `course` for a subject
 * page, `collection` for a folder of downloads, `service` for a page about
 * price. The registry's `schemaType` says which one a spoke is expected to
 * carry, and verify-seo-cluster.mjs checks the rendered HTML against it.
 *
 * @param {string} [slug] - registry slug; omit for a page outside the registry
 * @param {Array<{name: string, url: string}>} [breadcrumbs] - explicit trail,
 *   for pages with no registry entry to derive one from
 * @param {object} [article] - { headline, description, datePublished, dateModified }
 * @param {object} [course] - { name, description, educationalLevel } for subject pages
 * @param {object} [collection] - { name, description, items } for resource pages
 * @param {object} [service] - { name, description, offers } for pages about price
 * @param {Array<{question: string, answer: string}>} [faqs]
 */
export default function GuideSchema({
  slug, breadcrumbs, article, course, collection, service, faqs,
}) {
  const schemas = [
    breadcrumbs ? buildBreadcrumbTrail(breadcrumbs) : buildBreadcrumbSchema(slug),
    article ? buildArticleSchema({ slug, ...article }) : null,
    course ? buildCourseSchema({ slug, ...course }) : null,
    collection ? buildCollectionPageSchema({ slug, ...collection }) : null,
    service ? buildServiceSchema({ slug, ...service }) : null,
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
