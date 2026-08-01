import { getBreadcrumbs, getPage } from './links.mjs';

export const SITE_URL = 'https://www.lioncitytutors.com';

const absolute = (path) => `${SITE_URL}${path}`;

const ORG = { '@type': 'Organization', name: 'LionCity Tutors', url: SITE_URL };

/**
 * BreadcrumbList from an explicit trail. For pages outside the cluster
 * registry — the tutor-side pages belong to no exam hub, so they have no
 * registry entry to derive a trail from.
 *
 * @param {Array<{name: string, url: string}>} crumbs - root-first
 */
export function buildBreadcrumbTrail(crumbs) {
  if (!crumbs || crumbs.length === 0) return null;
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

export function buildBreadcrumbSchema(slug) {
  return buildBreadcrumbTrail(getBreadcrumbs(slug));
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
 * For a page whose subject is what something costs. Course would be wrong —
 * nobody enrols in a rate card — and Service is the type that carries an
 * offer, so the price range can be stated in the markup as well as the copy.
 *
 * `offers` are per-level price bands: { name, min, max }, in SGD per hour.
 *
 * @param {{slug: string, name: string, description: string, areaServed?: string,
 *          offers?: Array<{name: string, min: number, max: number}>}} args
 */
export function buildServiceSchema({ slug, name, description, areaServed = 'Singapore', offers }) {
  const page = getPage(slug);
  if (!page) return null;
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    serviceType: 'Private tuition',
    areaServed: { '@type': 'Country', name: areaServed },
    url: absolute(page.url),
    provider: ORG,
  };
  if (offers && offers.length > 0) {
    schema.offers = offers.map((offer) => ({
      '@type': 'Offer',
      name: offer.name,
      priceSpecification: {
        '@type': 'PriceSpecification',
        minPrice: offer.min,
        maxPrice: offer.max,
        priceCurrency: 'SGD',
        unitText: 'HOUR',
      },
    }));
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
