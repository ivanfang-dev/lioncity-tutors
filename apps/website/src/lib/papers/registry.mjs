import { testPapers } from '@/data/testPapers.mjs';
import { paperKeyOf } from '@/lib/downloadKeys.mjs';

// One indexable page per paper. The library groups papers by level, subject and
// exam, but the shelf itself is a single URL — nothing in it can rank for the
// school-and-year queries people actually type ("nanyang p6 english 2024 sa2").
// This registry derives that structure from the data we already ship.

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

export function getPaperBySlug(level, slug) {
  return getAllPapers().find((p) => p.level === level && p.slug === slug) ?? null;
}

let byKey;

/** Lets the library rows link to a paper's own page without re-deriving slugs. */
export function getPaperUrlByKey(paperKey) {
  if (!paperKey) return null;
  if (!byKey) byKey = new Map(getAllPapers().map((p) => [p.paperKey, p.url]));
  return byKey.get(paperKey) ?? null;
}

/** Siblings from the same shelf first, then the same subject, capped at `limit`. */
export function getRelatedPapers(paper, limit = 6) {
  const all = getAllPapers().filter((p) => p.slug !== paper.slug);
  const sameShelf = all.filter((p) => p.subject === paper.subject && p.examKey === paper.examKey);
  const sameSubject = all.filter((p) => p.subject === paper.subject && p.examKey !== paper.examKey);
  return [...sameShelf, ...sameSubject].slice(0, limit);
}
