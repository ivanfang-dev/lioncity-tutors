import { execSync } from 'node:child_process';
import path from 'node:path';
import { HUBS, SPOKES } from '@/lib/seo/clusters.mjs';

const SITE_URL = 'https://www.lioncitytutors.com';

// Non-registry public pages not covered by the hub/spoke registry.
// Excludes: /ops/*, /api/*, /not-found (soft-404, never indexable), and the
// three /guides/* pages that canonicalise to their /blog/* twin (see Task 7
// in docs/seo-action-plan.md).
const NON_REGISTRY_PAGES = [
  { path: '/', priority: 1.0 },
  { path: '/blog', priority: 0.7 },
  { path: '/blog/benefits-of-private-tuition', priority: 0.6 },
  { path: '/blog/focus-and-concentration-issues', priority: 0.6 },
  { path: '/blog/improve-primary-english-composition', priority: 0.6 },
  { path: '/blog/navigating-psle-anxiety', priority: 0.6 },
  { path: '/blog/pinpointing-learning-gaps', priority: 0.6 },
  { path: '/blog/what-to-look-for-in-a-tutor', priority: 0.6 },
  { path: '/contact-us', priority: 0.5 },
  { path: '/guides', priority: 0.6 },
  { path: '/register-tutor', priority: 0.6 },
  { path: '/tuition-assignments', priority: 0.6 },
  { path: '/privacy-policy', priority: 0.1 },
  { path: '/terms-and-conditions-for-clients', priority: 0.1 },
  { path: '/terms-and-conditions-for-tutors', priority: 0.1 },
];

// Runs at build time (this route has no dynamic segments, so Next statically
// generates it once), where the full git history is available. Falls back to
// omitting lastModified rather than guessing — never stamp every URL with
// the build date.
function lastModifiedFor(routePath) {
  const filePath = path.join(process.cwd(), 'src/app', routePath === '/' ? '' : routePath, 'page.jsx');
  try {
    const iso = execSync(`git log -1 --format=%aI -- "${filePath}"`, {
      encoding: 'utf8',
      cwd: process.cwd(),
    }).trim();
    return iso || undefined;
  } catch {
    return undefined;
  }
}

export default function sitemap() {
  const registryPages = [
    ...Object.values(HUBS).map((h) => ({ path: h.url, priority: 0.9 })),
    ...Object.values(SPOKES).map((s) => ({ path: s.url, priority: 0.7 })),
  ];

  return [...registryPages, ...NON_REGISTRY_PAGES].map(({ path: routePath, priority }) => {
    const lastModified = lastModifiedFor(routePath);
    return {
      url: `${SITE_URL}${routePath}`,
      ...(lastModified ? { lastModified } : {}),
      priority,
    };
  });
}
