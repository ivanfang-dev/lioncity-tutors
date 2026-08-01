import {
  buildBreadcrumbSchema, buildBreadcrumbTrail, buildArticleSchema, buildFaqSchema,
  buildCourseSchema, buildServiceSchema,
} from '@/lib/seo/schema.mjs';

/**
 * Emits the JSON-LD for a page. Renders nothing visible.
 *
 * @param {string} [slug] - registry slug; omit for a page outside the registry
 * @param {Array<{name: string, url: string}>} [breadcrumbs] - explicit trail,
 *   for pages with no registry entry to derive one from
 * @param {object} [article] - { headline, description, datePublished, dateModified }
 * @param {object} [course] - { name, description, educationalLevel } for subject pages
 * @param {object} [service] - { name, description, offers } for pages about price
 * @param {Array<{question: string, answer: string}>} [faqs]
 */
export default function GuideSchema({ slug, breadcrumbs, article, course, service, faqs }) {
  const schemas = [
    breadcrumbs ? buildBreadcrumbTrail(breadcrumbs) : buildBreadcrumbSchema(slug),
    article ? buildArticleSchema({ slug, ...article }) : null,
    course ? buildCourseSchema({ slug, ...course }) : null,
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
