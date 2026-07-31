import { getBreadcrumbs, getPage } from './links.mjs';

export const SITE_URL = 'https://www.lioncitytutors.com';

const absolute = (path) => `${SITE_URL}${path}`;

const ORG = { '@type': 'Organization', name: 'LionCity Tutors', url: SITE_URL };

export function buildBreadcrumbSchema(slug) {
  const crumbs = getBreadcrumbs(slug);
  if (crumbs.length === 0) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: absolute(crumb.url),
    })),
  };
}

export function buildArticleSchema({ slug, headline, description, datePublished, dateModified }) {
  const page = getPage(slug);
  if (!page) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    description,
    datePublished,
    dateModified,
    mainEntityOfPage: { '@type': 'WebPage', '@id': absolute(page.url) },
    author: ORG,
    publisher: ORG,
  };
}

export function buildFaqSchema(faqs) {
  if (!faqs || faqs.length === 0) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };
}

/**
 * For resource pages — a page whose point is the collection it lists, not a
 * subject it teaches. Course would be wrong: nobody enrols in a folder of past
 * papers. `items` are the on-page groupings, each linking to its own section.
 *
 * @param {{slug: string, name: string, description: string,
 *          items?: Array<{name: string, url: string}>}} args
 */
export function buildCollectionPageSchema({ slug, name, description, items }) {
  const page = getPage(slug);
  if (!page) return null;
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name,
    description,
    url: absolute(page.url),
    publisher: ORG,
  };
  if (items && items.length > 0) {
    schema.mainEntity = {
      '@type': 'ItemList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        url: absolute(item.url),
      })),
    };
  }
  return schema;
}

export function buildCourseSchema({ slug, name, description, educationalLevel }) {
  const page = getPage(slug);
  if (!page) return null;
  return {
    '@context': 'https://schema.org',
    // Course is a CreativeWork subtype, so it properly supports educationalLevel.
    // EducationalOccupationalProgram is Intangible and doesn't accept educationalLevel.
    '@type': 'Course',
    name,
    description,
    educationalLevel,
    url: absolute(page.url),
    provider: ORG,
  };
}
