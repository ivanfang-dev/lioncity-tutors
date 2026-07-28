import { getBreadcrumbs, getPage } from './links.mjs';

export const SITE_URL = 'https://www.lioncitytutors.com';

const absolute = (path) => `${SITE_URL}${path}`;

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
    author: { '@type': 'Organization', name: 'LionCity Tutors', url: SITE_URL },
    publisher: {
      '@type': 'Organization',
      name: 'LionCity Tutors',
      url: SITE_URL,
    },
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

export function buildCourseSchema({ slug, name, description, educationalLevel }) {
  const page = getPage(slug);
  if (!page) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'EducationalOccupationalProgram',
    name,
    description,
    educationalLevel,
    url: absolute(page.url),
    provider: { '@type': 'Organization', name: 'LionCity Tutors', url: SITE_URL },
  };
}
