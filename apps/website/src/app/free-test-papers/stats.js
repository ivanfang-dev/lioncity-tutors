/**
 * Counts derived from testPapers.js at build time.
 *
 * Every number shown on /free-test-papers comes from here rather than being
 * typed into the copy, so the page can never claim more papers than it hosts.
 */
import { testPapers } from '@/data/testPapers.mjs';

/** Every paper under a node, however deeply the subject nests its exam types. */
const flatten = (node) =>
  Array.isArray(node) ? node : Object.values(node ?? {}).flatMap(flatten);

export const papersIn = (level) => flatten(testPapers[level]);

const allPapers = Object.keys(testPapers).flatMap(papersIn);

const years = [...new Set(allPapers.map((p) => p.title.match(/20\d\d/)?.[0]).filter(Boolean))].sort();

/** Subjects that actually have a paper — the empty "coming soon" ones don't count. */
const subjectsWithPapers = Object.values(testPapers).flatMap((level) =>
  Object.entries(level).filter(([, subject]) => flatten(subject).length > 0),
);

export const paperStats = {
  total: allPapers.length,
  subjects: subjectsWithPapers.length,
  firstYear: years[0],
  lastYear: years[years.length - 1],
};
