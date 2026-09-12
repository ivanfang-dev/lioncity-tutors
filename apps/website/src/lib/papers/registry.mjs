// Relative, not aliased: next.config.mjs imports this to generate the redirect
// map, and it runs in plain node where the `@/` webpack alias does not exist.
import { testPapers } from '../../data/testPapers.mjs';
import { paperKeyOf } from '../downloadKeys.mjs';

// Structure for the paper library, derived from the data we already ship: every
// paper gets a level, subject, exam, year and school parsed out of its title,
// and `getPaperGroups()` below folds those into the pages we actually publish.

const LEVEL_LABELS = {
  primary: 'Primary',
  secondary: 'Secondary',
  jc: 'Junior College',
};

const EXAM_LABELS = {
  wa1: 'WA1',
  wa2: 'WA2',
  sa1: 'SA1',
  sa2: 'SA2',
  prelim: 'Prelim',
};

// Trailing segments that name the document, not the school that set it.
const DESCRIPTOR =
  /^(test\s*papers?(\s*&\s*answers?)?|worked\s*solutions?|solutions?|answers?|answer\s*key|exam\s*papers?|paper)$/i;

// A separate solutions document, as opposed to a paper that ships with answers.
const SOLUTIONS_DOC = /worked\s*solutions?|\bsolutions\b|\(\s*answers?\s*\)/i;
const WITH_ANSWERS = /with\s*answers?|with\s*answer\s*key|test\s*paper\s*&\s*answers?/i;

function kebab(value) {
  return value
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function examLabelFor(key) {
  return EXAM_LABELS[key] ?? key.replace(/\b\w/g, (c) => c.toUpperCase());
}

// Titles and headings read better with the abbreviation parents actually use.
function shortenSubject(subject) {
  return subject
    .replace(/^Primary (\d)/, 'P$1')
    .replace(/^Secondary (\d)/, 'Sec $1');
}

// Strips the parenthetical asides and the document descriptor, leaving the school.
// The whole-string descriptor test runs first, so "Test Paper & Answers" is
// rejected outright rather than trimmed down to a plausible-looking "Test Paper &".
function cleanSchool(value) {
  const bare = value.replace(/\([^)]*\)/g, ' ').replace(/\s+/g, ' ').trim();
  if (!bare || DESCRIPTOR.test(bare)) return null;
  const trimmed = bare
    .replace(/\s*&\s*answers?$/i, '')
    .replace(/\s+(test\s*papers?|exam\s*papers?|papers?|solutions?|answers?|answer\s*key)$/i, '')
    .replace(/\s*[&,-]$/, '')
    .trim();
  return trimmed && !DESCRIPTOR.test(trimmed) ? trimmed : null;
}

/**
 * School names sit in different places depending on who typed the title:
 * usually the last " - " segment, but behind the descriptor when the row is a
 * solutions file ("… 2025 Raffles - Worked Solutions").
 */
function parseSchool(title, year) {
  const segments = title.split(/\s+-\s+/).map((s) => s.trim()).filter(Boolean);
  for (let i = segments.length - 1; i >= 0; i -= 1) {
    const school = cleanSchool(segments[i]);
    if (school && !(year && school === String(year))) {
      // The first segment carries the subject and year too; keep only the tail.
      if (i === 0 && year) {
        const tail = segments[0].split(String(year))[1];
        return tail ? cleanSchool(tail) : null;
      }
      return school;
    }
  }
  return null;
}

function describe({ subject, examLabel, year, school, isSolutions }) {
  const what = isSolutions ? 'Worked solutions' : 'Exam paper';
  const where = school ? ` from ${school}` : '';
  const when = year ? ` ${year}` : '';
  return `${what} for ${subject}${when} ${examLabel}${where}. Free to download from LionCity Tutors.`;
}

function build() {
  const papers = [];
  const seen = new Map();

  const walk = (node, level, subject, examKey) => {
    if (Array.isArray(node)) {
      for (const paper of node) {
        if (!paper?.title) continue;
        const title = paper.title.replace(/\s+/g, ' ').trim();
        const year = Number(title.match(/\b(20\d{2})\b/)?.[1]) || null;
        const isSolutions = SOLUTIONS_DOC.test(title);
        const school = parseSchool(title, year);
        const examLabel = examLabelFor(examKey);

        // Titles repeat across shelves; the suffix keeps every URL distinct.
        const base = kebab(title);
        const count = (seen.get(base) ?? 0) + 1;
        seen.set(base, count);
        const slug = count === 1 ? base : `${base}-${count}`;

        papers.push({
          slug,
          url: `/free-test-papers/${level}/${slug}`,
          level,
          levelLabel: LEVEL_LABELS[level] ?? level,
          subject,
          shortSubject: shortenSubject(subject),
          subjectSlug: kebab(subject),
          examKey,
          examLabel,
          year,
          school,
          title,
          isSolutions,
          hasAnswers: WITH_ANSWERS.test(title),
          description: describe({ subject, examLabel, year, school, isSolutions }),
          paperKey: paperKeyOf(paper),
          downloadUrl: paper.downloadUrl ?? null,
          fileKey: paper.fileKey ?? null,
        });
      }
      return;
    }
    if (node && typeof node === 'object') {
      for (const [key, value] of Object.entries(node)) {
        walk(value, level, subject, examKey ? `${examKey} - ${key}` : key);
      }
    }
  };

  for (const [level, subjects] of Object.entries(testPapers)) {
    for (const [subject, value] of Object.entries(subjects)) {
      walk(value, level, subject, '');
    }
  }
  return papers;
}

let cached;

export function getAllPapers() {
  if (!cached) cached = build();
  return cached;
}

// ── Groups ───────────────────────────────────────────────────────────────────
// One page per paper gave 196 URLs that differed from each other by a school
// name swapped five times — 98.2% identical, and Google left them all in
// "Discovered – currently not indexed". Grouping on subject x exam x year gives
// 37 pages that differ structurally: different subject, exam, year, school list
// and count. It is also the shape freetestpaper.com ranks with.

/** Papers that belong together on one page: same subject, same exam, same year. */
function groupKeyFor(paper) {
  return `${paper.level}|${paper.subject}|${paper.examLabel}|${paper.year}`;
}

function buildGroups() {
  const byGroup = new Map();
  for (const paper of getAllPapers()) {
    const key = groupKeyFor(paper);
    if (!byGroup.has(key)) byGroup.set(key, []);
    byGroup.get(key).push(paper);
  }

  return [...byGroup.values()].map((papers) => {
    const [first] = papers;
    const slug = `${kebab(first.shortSubject)}-${first.year}-${kebab(first.examLabel)}`;
    // Schools repeat when one school set both a paper and its solutions.
    const schools = [...new Set(papers.map((p) => p.school).filter(Boolean))];
    const heading = `${first.shortSubject} ${first.year} ${first.examLabel} Papers`;

    return {
      slug,
      url: `/free-test-papers/${first.level}/${slug}`,
      level: first.level,
      levelLabel: first.levelLabel,
      subject: first.subject,
      shortSubject: first.shortSubject,
      examKey: first.examKey,
      examLabel: first.examLabel,
      year: first.year,
      heading,
      schools,
      papers,
      description:
        `${papers.length} free ${first.subject} ${first.year} ${first.examLabel} ` +
        `paper${papers.length === 1 ? '' : 's'} from ${schools.length} Singapore ` +
        `school${schools.length === 1 ? '' : 's'} — ${schools.slice(0, 4).join(', ')}` +
        `${schools.length > 4 ? ' and more' : ''}. Free to download.`,
    };
  });
}

let cachedGroups;

export function getPaperGroups() {
  if (!cachedGroups) cachedGroups = buildGroups();
  return cachedGroups;
}

export function getGroupBySlug(level, slug) {
  return getPaperGroups().find((g) => g.level === level && g.slug === slug) ?? null;
}

let groupUrlByPaperKey;

/** Where a single paper now lives: its group's page. */
export function getGroupUrlByPaperKey(paperKey) {
  if (!paperKey) return null;
  if (!groupUrlByPaperKey) {
    groupUrlByPaperKey = new Map();
    for (const group of getPaperGroups()) {
      for (const paper of group.papers) groupUrlByPaperKey.set(paper.paperKey, group.url);
    }
  }
  return groupUrlByPaperKey.get(paperKey) ?? null;
}

/**
 * The retired per-paper URLs, each pointing at the group that replaced it.
 * Generated rather than hand-written so it cannot drift from the data.
 */
export function getRetiredPaperRedirects() {
  return getPaperGroups().flatMap((group) =>
    group.papers
      .filter((paper) => paper.url !== group.url)
      .map((paper) => ({ source: paper.url, destination: group.url, permanent: true })),
  );
}
