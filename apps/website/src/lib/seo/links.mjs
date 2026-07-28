import { HUBS, SPOKES } from './clusters.mjs';

/** A hub or spoke entry, or undefined when the slug is unknown. */
export function getPage(slug) {
  return HUBS[slug] ?? SPOKES[slug];
}

export function allSlugs() {
  return [...Object.keys(HUBS), ...Object.keys(SPOKES)];
}

/** The hub a page belongs to. Given a hub, returns that hub. */
export function getHubFor(slug) {
  if (HUBS[slug]) return HUBS[slug];
  const spoke = SPOKES[slug];
  return spoke ? HUBS[spoke.hub] : undefined;
}

/** Sibling spokes in the same cluster, excluding the page itself. */
export function getSiblings(slug) {
  const hub = getHubFor(slug);
  if (!hub) return [];
  return hub.spokes.filter((s) => s !== slug).map((s) => SPOKES[s]);
}

/** Breadcrumb trail, root-first, always starting at Home. */
export function getBreadcrumbs(slug) {
  const page = getPage(slug);
  if (!page) return [];
  const crumbs = [{ name: 'Home', url: '/' }];
  const hub = getHubFor(slug);
  if (hub) crumbs.push({ name: hub.title, url: hub.url });
  if (SPOKES[slug]) crumbs.push({ name: page.title, url: page.url });
  return crumbs;
}
