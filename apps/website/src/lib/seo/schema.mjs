import { getBreadcrumbs, getPage } from './links.mjs';

export const SITE_URL = 'https://www.lioncitytutors.com';

const absolute = (path) => `${SITE_URL}${path}`;

const ORG = { '@type': 'Organization', name: 'LionCity Tutors', url: SITE_URL };

/**
 * The schema types a spoke may name via `schemaType` in the cluster registry.
 * Spokes that name nothing get Course. Anything outside this set has no
 * builder behind it, so the page would silently emit no content schema —
 * links.test.mjs fails the build instead.
 */
export const BUILDABLE_SCHEMA_TYPES = new Set(['Course', 'CollectionPage', 'Service']);

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

/**
 * A country by default, or a list of Places when a page names the estates it
 * covers. Never a LocalBusiness with an address: the agency has no premises in
 * the areas it serves, and claiming one is a spam signal.
 */
function buildAreaServed(areaServed) {
  return Array.isArray(areaServed)
    ? areaServed.map((place) => ({ '@type': 'Place', name: place }))
    : { '@type': 'Country', name: areaServed };
}

/**
 * For a page whose subject is what something costs. Course would be wrong —
 * nobody enrols in a rate card — and Service is the type that carries an
 * offer, so the price range can be stated in the markup as well as the copy.
 *
 * `offers` are per-level price bands: { name, min, max }, in SGD per hour.
 *
 * `areaServed` takes a country name, or a list of place names for a page that
 * serves specific estates rather than the whole country.
 *
 * @param {{slug: string, name: string, description: string,
 *          areaServed?: string | string[],
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
    areaServed: buildAreaServed(areaServed),
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
