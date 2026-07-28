# SEO Cluster Phase 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the hub-and-spoke internal link graph, structured data, and 2026 exam-timetable content across the four exam prep guides and their subject spokes, so striking-distance pages move from positions 10–21 into the top 10.

**Architecture:** A single data registry (`src/lib/seo/clusters.mjs`) declares every hub, spoke and anchor text. Pure helpers derive links, breadcrumbs and siblings from it. Two components consume the helpers — `RelatedGuides` (visual, built on existing `components/guide` primitives) and `GuideSchema` (non-visual JSON-LD). A separate factual module (`src/data/examCalendar2026.mjs`) holds SEAB exam dates so timetable content is written once and reused.

**Tech Stack:** Next.js 14 App Router, React 18, Tailwind 4, `lucide-react` icons. Tests use Node 22's built-in test runner (`node --test`) — **no new dependencies**.

## Global Constraints

- **No new npm dependencies.** Node 22.20 is installed; `node --test` is stable and sufficient.
- **Registry and data modules use `.mjs`** so plain Node can import them without the website adopting `"type": "module"` (which would break `next.config.js`-adjacent tooling). Next 14 resolves explicit `.mjs` imports fine.
- **Path alias:** `@/*` → `apps/website/src/*` (from `jsconfig.json`).
- **Brand colours:** `#0474BA` blue, `#F17720` orange. Do not introduce other accent colours.
- **Prep guide URLs do not change.** They stay at `/blog/*`. No redirects, no moves.
- **Do not add a `Co-Authored-By: Claude` trailer to any commit.**
- **Answer-block convention:** every FAQ entry and new section opens with a question-shaped heading, then a self-contained 40–60 word direct answer as the first paragraph, then detail.
- **Factual sourcing:** exam dates come only from `src/data/examCalendar2026.mjs`. Never inline a date in a page. Figures from secondary sources are labelled indicative and dated.
- **Titles** under 60 characters, **meta descriptions** 150–160 characters.
- All work happens in `apps/website/`.

---

### Task 1: Exam calendar data module

The factual foundation. Every timetable section on every page reads from this one module, so a date correction happens in exactly one place.

**Files:**
- Create: `apps/website/src/data/examCalendar2026.mjs`
- Test: `apps/website/src/data/examCalendar2026.test.mjs`
- Modify: `apps/website/package.json` (add `test` script)

**Interfaces:**
- Produces: `EXAM_CALENDAR_2026` (object keyed by exam slug), `getExam(slug)`, `getSubjectPapers(examSlug, subjectSlug)`.
  - `getExam(slug)` returns `{ slug, label, examWindow: {start, end}, resultsWindow: {start, end}, subjects: Subject[] }` or `undefined`.
  - `Subject` is `{ slug, name, code, legacyCode?, papers: Paper[] }`.
  - `Paper` is `{ label, date, time?, note? }` where `date` is an ISO `YYYY-MM-DD` string.

- [ ] **Step 1: Add the test script to `apps/website/package.json`**

In the `"scripts"` block, add:

```json
"test": "node --test 'src/**/*.test.mjs'"
```

The pattern is single-quoted so the shell passes it through literally and Node
expands it internally, discovering `*.test.mjs` recursively.

**Do not use a bare directory argument** (`node --test src/`). Verified on Node
22.20: it treats the path as a module to execute and fails with
`Cannot find module '.../src'`.

- [ ] **Step 2: Write the failing test**

Create `apps/website/src/data/examCalendar2026.test.mjs`:

```js
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { EXAM_CALENDAR_2026, getExam, getSubjectPapers } from './examCalendar2026.mjs';

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

describe('exam calendar 2026', () => {
  test('covers all four national exams', () => {
    assert.deepEqual(
      Object.keys(EXAM_CALENDAR_2026).sort(),
      ['a-level', 'n-level', 'o-level', 'psle'],
    );
  });

  test('every date is an ISO string in 2026 or 2027', () => {
    for (const exam of Object.values(EXAM_CALENDAR_2026)) {
      for (const subject of exam.subjects) {
        for (const paper of subject.papers) {
          assert.match(paper.date, ISO_DATE, `${subject.slug} ${paper.label}`);
          const year = Number(paper.date.slice(0, 4));
          assert.ok(year === 2026 || year === 2027, `${subject.slug} ${paper.label} year ${year}`);
        }
      }
    }
  });

  test('O-Level science practicals sit on the confirmed SEAB dates', () => {
    const practicalDate = (subjectSlug) =>
      getSubjectPapers('o-level', subjectSlug).find((p) => p.label.includes('Practical')).date;

    assert.equal(practicalDate('chemistry'), '2026-09-30');
    assert.equal(practicalDate('physics'), '2026-10-05');
    assert.equal(practicalDate('biology'), '2026-10-13');
  });

  test('A-Level sciences carry the revised code with legacy recorded', () => {
    const chem = getExam('a-level').subjects.find((s) => s.slug === 'h2-chemistry');
    assert.equal(chem.code, '9476');
    assert.equal(chem.legacyCode, '9729');
  });

  test('results windows follow their exam windows', () => {
    for (const exam of Object.values(EXAM_CALENDAR_2026)) {
      assert.ok(
        exam.resultsWindow.start > exam.examWindow.end,
        `${exam.slug} results must follow the exam`,
      );
    }
  });

  test('getExam returns undefined for an unknown slug', () => {
    assert.equal(getExam('gce-z-level'), undefined);
  });
});
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `cd apps/website && npm test`
Expected: FAIL — cannot find module `./examCalendar2026.mjs`.

- [ ] **Step 4: Write the data module**

Create `apps/website/src/data/examCalendar2026.mjs`. All dates below are transcribed from SEAB's official 2026 examination calendars (retrieved 2026-07-26, calendars "Updated as at 13 February 2026"). Source URLs are recorded in the module header so a future editor can re-verify.

```js
/**
 * 2026 Singapore national examination dates.
 *
 * Single source of truth for every timetable surface on the site. Never inline
 * an exam date in a page — import from here so a correction lands everywhere.
 *
 * Sources (retrieved 2026-07-26, calendars updated as at 13 February 2026):
 *   https://file.go.gov.sg/2026-psle-exam-cal.pdf
 *   https://file.go.gov.sg/2026-o-level-exam-cal.pdf
 *   https://file.go.gov.sg/2026-n-level-exam-cal.pdf
 *   https://file.go.gov.sg/2026-a-level-exam-cal.pdf
 *   https://www.seab.gov.sg/important-dates-for-candidates/
 */

export const EXAM_CALENDAR_2026 = {
  psle: {
    slug: 'psle',
    label: 'PSLE',
    examWindow: { start: '2026-08-12', end: '2026-09-30' },
    resultsWindow: { start: '2026-11-24', end: '2026-11-25' },
    subjects: [
      {
        slug: 'english',
        name: 'English Language',
        papers: [
          { label: 'Oral', date: '2026-08-12', time: '0800–1330h', note: 'Also held 13 August' },
          { label: 'Listening Comprehension', date: '2026-09-15', time: '1115–1150h' },
          { label: 'Paper 1 (Writing)', date: '2026-09-24', time: '0815–0925h' },
          { label: 'Paper 2 (Comprehension)', date: '2026-09-24', time: '1030–1220h' },
        ],
      },
      {
        slug: 'math',
        name: 'Mathematics',
        papers: [
          { label: 'Paper 1', date: '2026-09-25', time: '0815–0925h' },
          { label: 'Paper 2', date: '2026-09-25', time: '1030–1150h' },
        ],
      },
      {
        slug: 'mother-tongue',
        name: 'Mother Tongue Languages',
        papers: [
          { label: 'Oral', date: '2026-08-13', time: '0800–1330h' },
          { label: 'Listening Comprehension', date: '2026-09-15', time: '0900–0935h' },
          { label: 'Paper 1', date: '2026-09-28', time: '0815–0905h' },
          { label: 'Paper 2', date: '2026-09-28', time: '1015–1155h' },
        ],
      },
      {
        slug: 'science',
        name: 'Science',
        papers: [{ label: 'Paper 1', date: '2026-09-29', time: '0815–1000h' }],
      },
      {
        slug: 'higher-mother-tongue',
        name: 'Higher Mother Tongue',
        papers: [
          { label: 'Paper 1', date: '2026-09-30', time: '0815–0905h' },
          { label: 'Paper 2', date: '2026-09-30', time: '1015–1135h' },
        ],
      },
    ],
  },

  'o-level': {
    slug: 'o-level',
    label: 'GCE O-Level',
    examWindow: { start: '2026-06-02', end: '2026-11-10' },
    resultsWindow: { start: '2027-01-13', end: '2027-01-15' },
    subjects: [
      {
        slug: 'english',
        name: 'English Language',
        code: '1184',
        papers: [
          { label: 'Oral', date: '2026-07-13', note: 'Also held 14 and 17 July' },
          { label: 'Listening Comprehension', date: '2026-10-15', time: '1400–1445h' },
          { label: 'Paper 1', date: '2026-10-19', time: '1330–1520h' },
          { label: 'Paper 2', date: '2026-10-19', time: '1605–1755h' },
        ],
      },
      {
        slug: 'math',
        name: 'Mathematics (E-Math)',
        code: '4052',
        papers: [
          { label: 'Paper 1', date: '2026-10-21', time: '1400–1615h' },
          { label: 'Paper 2', date: '2026-10-23', time: '1430–1645h' },
        ],
      },
      {
        slug: 'additional-math',
        name: 'Additional Mathematics (A-Math)',
        code: '4049',
        papers: [
          { label: 'Paper 1', date: '2026-10-26', time: '1400–1615h' },
          { label: 'Paper 2', date: '2026-10-28', time: '0800–1015h' },
        ],
      },
      {
        slug: 'chemistry',
        name: 'Chemistry',
        code: '6092',
        papers: [
          { label: 'Paper 3 (Practical)', date: '2026-09-30', note: 'Four shifts, 0800–1650h' },
          { label: 'Paper 2', date: '2026-10-27', time: '1400–1545h' },
          { label: 'Paper 1 (MCQ)', date: '2026-11-06', time: '0800–0900h' },
        ],
      },
      {
        slug: 'physics',
        name: 'Physics',
        code: '6091',
        papers: [
          { label: 'Paper 3 (Practical)', date: '2026-10-05', note: 'Four shifts, 0800–1650h' },
          { label: 'Paper 2', date: '2026-10-29', time: '1400–1545h' },
          { label: 'Paper 1 (MCQ)', date: '2026-11-06', time: '1430–1530h' },
        ],
      },
      {
        slug: 'biology',
        name: 'Biology',
        code: '6093',
        papers: [
          { label: 'Paper 3 (Practical)', date: '2026-10-13', note: 'Four shifts, 0800–1650h' },
          { label: 'Paper 2', date: '2026-10-30', time: '0800–0945h' },
          { label: 'Paper 1 (MCQ)', date: '2026-11-10', time: '1400–1500h' },
        ],
      },
      {
        slug: 'combined-science-phy-chem',
        name: 'Combined Science (Physics/Chemistry)',
        code: '5086',
        papers: [
          { label: 'Paper 3 (Chemistry)', date: '2026-10-27', time: '1400–1515h' },
          { label: 'Paper 2 (Physics)', date: '2026-10-29', time: '1400–1515h' },
          { label: 'Paper 1 (MCQ)', date: '2026-11-10', time: '0800–0900h' },
        ],
      },
      {
        slug: 'combined-science-phy-bio',
        name: 'Combined Science (Physics/Biology)',
        code: '5087',
        papers: [
          { label: 'Paper 2 (Physics)', date: '2026-10-29', time: '1400–1515h' },
          { label: 'Paper 4 (Biology)', date: '2026-10-30', time: '0800–0915h' },
          { label: 'Paper 1 (MCQ)', date: '2026-11-10', time: '0800–0900h' },
        ],
      },
      {
        slug: 'combined-science-chem-bio',
        name: 'Combined Science (Chemistry/Biology)',
        code: '5088',
        papers: [
          { label: 'Paper 3 (Chemistry)', date: '2026-10-27', time: '1400–1515h' },
          { label: 'Paper 4 (Biology)', date: '2026-10-30', time: '0800–0915h' },
          { label: 'Paper 1 (MCQ)', date: '2026-11-10', time: '0800–0900h' },
        ],
      },
      {
        slug: 'mother-tongue',
        name: 'Mother Tongue Languages',
        papers: [
          { label: 'Written papers', date: '2026-06-02', time: '0800–1230h' },
          { label: 'Listening Comprehension', date: '2026-07-07', time: '1400–1630h' },
        ],
      },
    ],
  },

  'n-level': {
    slug: 'n-level',
    label: 'GCE N-Level',
    examWindow: { start: '2026-07-13', end: '2026-10-13' },
    resultsWindow: { start: '2026-12-17', end: '2026-12-21' },
    subjects: [],
  },

  'a-level': {
    slug: 'a-level',
    label: 'GCE A-Level',
    examWindow: { start: '2026-06-02', end: '2026-11-27' },
    resultsWindow: { start: '2027-02-19', end: '2027-02-23' },
    subjects: [
      {
        slug: 'general-paper',
        name: 'General Paper',
        code: '8881',
        papers: [
          { label: 'Paper 1', date: '2026-11-02', time: '0800–0930h' },
          { label: 'Paper 2', date: '2026-11-04', time: '0800–0930h' },
        ],
      },
      {
        slug: 'h2-math',
        name: 'H2 Mathematics',
        code: '9758',
        papers: [
          { label: 'Paper 1', date: '2026-11-03', time: '0800–1100h' },
          { label: 'Paper 2', date: '2026-11-06', time: '0800–1100h' },
        ],
      },
      {
        slug: 'h1-math',
        name: 'H1 Mathematics',
        code: '8865',
        papers: [{ label: 'Paper 1', date: '2026-11-03', time: '0800–1100h' }],
      },
      {
        slug: 'h2-chemistry',
        name: 'H2 Chemistry',
        code: '9476',
        legacyCode: '9729',
        papers: [
          { label: 'Paper 4 (Practical)', date: '2026-10-14', note: 'Three shifts, 0800–1700h' },
          { label: 'Paper 2', date: '2026-11-10', time: '1400–1600h' },
          { label: 'Paper 3', date: '2026-11-12', time: '0800–1000h' },
        ],
      },
      {
        slug: 'h2-physics',
        name: 'H2 Physics',
        code: '9478',
        legacyCode: '9749',
        papers: [
          { label: 'Paper 4 (Practical)', date: '2026-10-19', note: 'Three shifts, 0800–1700h' },
          { label: 'Paper 2', date: '2026-11-13', time: '0800–1000h' },
          { label: 'Paper 3', date: '2026-11-17', time: '1400–1600h' },
        ],
      },
      {
        slug: 'h2-biology',
        name: 'H2 Biology',
        code: '9477',
        legacyCode: '9744',
        papers: [
          { label: 'Paper 4 (Practical)', date: '2026-10-22', note: 'Three shifts, 0800–1700h' },
          { label: 'Paper 2', date: '2026-11-18', time: '0800–1000h' },
        ],
      },
      {
        slug: 'h2-economics',
        name: 'H2 Economics',
        code: '9570',
        papers: [
          { label: 'Paper 1', date: '2026-11-05', time: '1400–1630h' },
          { label: 'Paper 2', date: '2026-11-16', time: '0800–1030h' },
        ],
      },
      {
        slug: 'h1-economics',
        name: 'H1 Economics',
        code: '8843',
        papers: [{ label: 'Paper 1', date: '2026-11-05', time: '1400–1700h' }],
      },
    ],
  },
};

export function getExam(slug) {
  return EXAM_CALENDAR_2026[slug];
}

export function getSubjectPapers(examSlug, subjectSlug) {
  const exam = getExam(examSlug);
  if (!exam) return [];
  const subject = exam.subjects.find((s) => s.slug === subjectSlug);
  return subject ? subject.papers : [];
}
```

- [ ] **Step 5: Run the tests to verify they pass**

Run: `cd apps/website && npm test`
Expected: PASS — 6 tests in `examCalendar2026.test.mjs`.

- [ ] **Step 6: Commit**

```bash
git add apps/website/package.json apps/website/src/data/examCalendar2026.mjs apps/website/src/data/examCalendar2026.test.mjs
git commit -m "Add 2026 SEAB exam calendar data module

Single source of truth for exam dates, transcribed from SEAB's official
2026 calendars. Adds node --test as the website test runner."
```

**Note for the implementer:** `n-level.subjects` is intentionally empty — the N-Level timetable is extracted in Task 9. The test only asserts shape over whatever subjects exist, so an empty array passes.

---

### Task 2: Cluster registry and link helpers

**Files:**
- Create: `apps/website/src/lib/seo/clusters.mjs`
- Create: `apps/website/src/lib/seo/links.mjs`
- Test: `apps/website/src/lib/seo/links.test.mjs`

**Interfaces:**
- Produces from `clusters.mjs`: `HUBS`, `SPOKES`.
  - Hub entry: `{ slug, url, title, anchor, spokes: string[] }`
  - Spoke entry: `{ slug, url, hub, title, anchor, blurb }`
- Produces from `links.mjs`: `getPage(slug)`, `getHubFor(slug)`, `getSiblings(slug)`, `getBreadcrumbs(slug)`, `allSlugs()`.
  - `getBreadcrumbs(slug)` returns `[{ name, url }]` ordered root-first, always starting `{ name: 'Home', url: '/' }`.

- [ ] **Step 1: Write the failing test**

Create `apps/website/src/lib/seo/links.test.mjs`:

```js
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { HUBS, SPOKES } from './clusters.mjs';
import { getPage, getHubFor, getSiblings, getBreadcrumbs, allSlugs } from './links.mjs';

const appDir = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'app');

describe('cluster registry integrity', () => {
  test('every spoke names a hub that exists', () => {
    for (const spoke of Object.values(SPOKES)) {
      assert.ok(HUBS[spoke.hub], `${spoke.slug} names missing hub ${spoke.hub}`);
    }
  });

  test('link reciprocity: every spoke is listed by its own hub', () => {
    for (const spoke of Object.values(SPOKES)) {
      assert.ok(
        HUBS[spoke.hub].spokes.includes(spoke.slug),
        `hub ${spoke.hub} does not list spoke ${spoke.slug}`,
      );
    }
  });

  test('link reciprocity: every slug a hub lists is a real spoke pointing back', () => {
    for (const hub of Object.values(HUBS)) {
      for (const slug of hub.spokes) {
        assert.ok(SPOKES[slug], `hub ${hub.slug} lists unknown spoke ${slug}`);
        assert.equal(SPOKES[slug].hub, hub.slug, `${slug} does not point back to ${hub.slug}`);
      }
    }
  });

  test('every url is unique and root-relative', () => {
    const urls = allSlugs().map((slug) => getPage(slug).url);
    assert.equal(new Set(urls).size, urls.length, 'duplicate url in registry');
    for (const url of urls) assert.ok(url.startsWith('/'), `${url} is not root-relative`);
  });

  test('every registry url resolves to a real route', () => {
    for (const slug of allSlugs()) {
      const { url } = getPage(slug);
      const routeDir = join(appDir, url.replace(/^\//, ''));
      assert.ok(
        existsSync(join(routeDir, 'page.jsx')) || existsSync(join(routeDir, 'page.js')),
        `${slug} -> ${url} has no page file`,
      );
    }
  });

  test('every entry carries non-empty anchor text', () => {
    for (const slug of allSlugs()) {
      const anchor = getPage(slug).anchor;
      assert.ok(anchor && anchor.trim().length > 0, `${slug} has no anchor text`);
    }
  });
});

describe('link helpers', () => {
  test('getHubFor returns the hub entry for a spoke', () => {
    assert.equal(getHubFor('o-level-physics').slug, 'o-level-prep');
  });

  test('getHubFor returns the hub itself when given a hub', () => {
    assert.equal(getHubFor('o-level-prep').slug, 'o-level-prep');
  });

  test('getSiblings excludes the page itself', () => {
    const siblings = getSiblings('o-level-physics');
    assert.ok(siblings.length > 0);
    assert.ok(!siblings.some((s) => s.slug === 'o-level-physics'));
  });

  test('getSiblings returns spokes when given a hub', () => {
    const siblings = getSiblings('o-level-prep');
    assert.ok(siblings.some((s) => s.slug === 'o-level-physics'));
  });

  test('getBreadcrumbs runs Home -> hub -> page for a spoke', () => {
    const crumbs = getBreadcrumbs('o-level-physics');
    assert.deepEqual(crumbs.map((c) => c.name), [
      'Home',
      HUBS['o-level-prep'].title,
      SPOKES['o-level-physics'].title,
    ]);
    assert.equal(crumbs[0].url, '/');
  });

  test('getBreadcrumbs runs Home -> hub for a hub', () => {
    const crumbs = getBreadcrumbs('o-level-prep');
    assert.equal(crumbs.length, 2);
    assert.equal(crumbs[1].url, HUBS['o-level-prep'].url);
  });

  test('unknown slug returns undefined rather than throwing', () => {
    assert.equal(getPage('not-a-page'), undefined);
    assert.equal(getHubFor('not-a-page'), undefined);
    assert.deepEqual(getSiblings('not-a-page'), []);
    assert.deepEqual(getBreadcrumbs('not-a-page'), []);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `cd apps/website && npm test`
Expected: FAIL — cannot find module `./clusters.mjs`.

- [ ] **Step 3: Write `clusters.mjs`**

Create `apps/website/src/lib/seo/clusters.mjs`. Anchor text lives here, not at call sites, because it carries the ranking signal and must stay consistent everywhere a page is linked.

```js
/**
 * The site's hub-and-spoke link graph.
 *
 * Adding a page means adding one entry here and listing its slug on the hub.
 * `links.test.mjs` enforces reciprocity and that every url resolves to a real
 * route, so a half-finished entry fails the build rather than shipping quietly.
 */

export const HUBS = {
  'o-level-prep': {
    slug: 'o-level-prep',
    url: '/blog/o-level-preparation-guide',
    title: 'O-Level Preparation Guide',
    anchor: 'complete O-Level preparation guide',
    spokes: [
      'o-level-english', 'o-level-math', 'o-level-physics', 'o-level-chemistry',
      'o-level-biology', 'combined-science-overview', 'combined-chemistry-physics',
      'combined-chemistry-biology', 'combined-physics-biology', 'o-level-tuition',
    ],
  },
  'a-level-prep': {
    slug: 'a-level-prep',
    url: '/blog/a-level-preparation-guide',
    title: 'A-Level Preparation Guide',
    anchor: 'complete A-Level preparation guide',
    spokes: [
      'a-level-math', 'a-level-physics', 'a-level-chemistry', 'a-level-biology',
      'a-level-general-paper', 'jc-tuition',
    ],
  },
  'n-level-prep': {
    slug: 'n-level-prep',
    url: '/blog/n-level-preparation-guide',
    title: 'N-Level Preparation Guide',
    anchor: 'complete N-Level preparation guide',
    spokes: ['n-level-tuition'],
  },
  'psle-prep': {
    slug: 'psle-prep',
    url: '/blog/psle-preparation-guide',
    title: 'PSLE Preparation Guide',
    anchor: 'complete PSLE preparation guide',
    spokes: ['psle-math', 'psle-english', 'psle-science', 'psle-chinese', 'primary-school-tuition'],
  },
  'ib-igcse': {
    slug: 'ib-igcse',
    url: '/guides/ib-igcse',
    title: 'IB & IGCSE Guide',
    anchor: 'IB and IGCSE subject guide hub',
    spokes: [
      'ibdp-biology', 'ibdp-chemistry', 'ibdp-physics',
      'igcse-biology', 'igcse-chemistry', 'igcse-physics',
    ],
  },
};

export const SPOKES = {
  // --- O-Level cluster ---
  'o-level-english': {
    slug: 'o-level-english', url: '/o-level-english', hub: 'o-level-prep',
    title: 'O-Level English', anchor: 'O-Level English paper strategies',
    blurb: 'Essay, comprehension and oral technique, paper by paper.',
  },
  'o-level-math': {
    slug: 'o-level-math', url: '/o-level-math', hub: 'o-level-prep',
    title: 'O-Level Maths', anchor: 'O-Level E-Math and A-Math guide',
    blurb: 'E-Math and A-Math topics, with the marks most often dropped.',
  },
  'o-level-physics': {
    slug: 'o-level-physics', url: '/o-level-physics', hub: 'o-level-prep',
    title: 'O-Level Physics', anchor: 'O-Level Physics topic guide',
    blurb: 'Kinematics, electricity and practical skills, paper by paper.',
  },
  'o-level-chemistry': {
    slug: 'o-level-chemistry', url: '/o-level-chemistry', hub: 'o-level-prep',
    title: 'O-Level Chemistry', anchor: 'O-Level Chemistry topic guide',
    blurb: 'Mole calculations, organic chemistry and qualitative analysis.',
  },
  'o-level-biology': {
    slug: 'o-level-biology', url: '/o-level-biology', hub: 'o-level-prep',
    title: 'O-Level Biology', anchor: 'O-Level Biology topic guide',
    blurb: 'Cells, physiology and genetics with exam-ready phrasing.',
  },
  'combined-science-overview': {
    slug: 'combined-science-overview', url: '/combined-science-overview', hub: 'o-level-prep',
    title: 'Combined Science', anchor: 'O-Level Combined Science overview',
    blurb: 'How the three Combined Science pairings differ, and which to pick.',
  },
  'combined-chemistry-physics': {
    slug: 'combined-chemistry-physics', url: '/combined-chemistry-physics', hub: 'o-level-prep',
    title: 'Combined Chemistry/Physics', anchor: 'Combined Science Chemistry and Physics guide',
    blurb: 'Syllabus 5086 topic coverage and paper structure.',
  },
  'combined-chemistry-biology': {
    slug: 'combined-chemistry-biology', url: '/combined-chemistry-biology', hub: 'o-level-prep',
    title: 'Combined Chemistry/Biology', anchor: 'Combined Science Chemistry and Biology guide',
    blurb: 'Syllabus 5088 topic coverage and paper structure.',
  },
  'combined-physics-biology': {
    slug: 'combined-physics-biology', url: '/combined-physics-biology', hub: 'o-level-prep',
    title: 'Combined Physics/Biology', anchor: 'Combined Science Physics and Biology guide',
    blurb: 'Syllabus 5087 topic coverage and paper structure.',
  },
  'o-level-tuition': {
    slug: 'o-level-tuition', url: '/secondary-school-tuition/o-level-tuition', hub: 'o-level-prep',
    title: 'O-Level Tuition', anchor: 'O-Level tuition in Singapore',
    blurb: 'Find a tutor matched to your subjects and target grade.',
  },

  // --- A-Level cluster ---
  'a-level-math': {
    slug: 'a-level-math', url: '/a-level-math', hub: 'a-level-prep',
    title: 'A-Level Maths', anchor: 'H2 Mathematics topic guide',
    blurb: 'H1 and H2 Mathematics topics with worked exam technique.',
  },
  'a-level-physics': {
    slug: 'a-level-physics', url: '/a-level-physics', hub: 'a-level-prep',
    title: 'A-Level Physics', anchor: 'H2 Physics topic guide',
    blurb: 'Revised 9478 syllabus coverage, practical and paper strategy.',
  },
  'a-level-chemistry': {
    slug: 'a-level-chemistry', url: '/a-level-chemistry', hub: 'a-level-prep',
    title: 'A-Level Chemistry', anchor: 'H2 Chemistry topic guide',
    blurb: 'Revised 9476 syllabus coverage, practical and paper strategy.',
  },
  'a-level-biology': {
    slug: 'a-level-biology', url: '/a-level-biology', hub: 'a-level-prep',
    title: 'A-Level Biology', anchor: 'H2 Biology topic guide',
    blurb: 'Revised 9477 syllabus coverage, practical and paper strategy.',
  },
  'a-level-general-paper': {
    slug: 'a-level-general-paper', url: '/a-level-general-paper', hub: 'a-level-prep',
    title: 'General Paper', anchor: 'A-Level General Paper guide',
    blurb: 'Paper 1 essays and Paper 2 comprehension, with mark schemes.',
  },
  'jc-tuition': {
    slug: 'jc-tuition', url: '/jc-tuition', hub: 'a-level-prep',
    title: 'JC Tuition', anchor: 'JC tuition in Singapore',
    blurb: 'Find an H1/H2 tutor for your subject combination.',
  },

  // --- N-Level cluster ---
  'n-level-tuition': {
    slug: 'n-level-tuition', url: '/secondary-school-tuition/n-level-tuition', hub: 'n-level-prep',
    title: 'N-Level Tuition', anchor: 'N-Level tuition in Singapore',
    blurb: 'Support for N(A) and N(T) candidates, including the O-Level route.',
  },

  // --- PSLE cluster ---
  'psle-math': {
    slug: 'psle-math', url: '/psle-math', hub: 'psle-prep',
    title: 'PSLE Maths', anchor: 'PSLE Mathematics guide',
    blurb: 'Heuristics, model drawing and Paper 2 problem sums.',
  },
  'psle-english': {
    slug: 'psle-english', url: '/psle-english', hub: 'psle-prep',
    title: 'PSLE English', anchor: 'PSLE English guide',
    blurb: 'Composition, comprehension and oral across both papers.',
  },
  'psle-science': {
    slug: 'psle-science', url: '/psle-science', hub: 'psle-prep',
    title: 'PSLE Science', anchor: 'PSLE Science guide',
    blurb: 'Open-ended answering technique and the themes examined.',
  },
  'psle-chinese': {
    slug: 'psle-chinese', url: '/psle-chinese', hub: 'psle-prep',
    title: 'PSLE Chinese', anchor: 'PSLE Chinese guide',
    blurb: 'Paper weightings, oral technique and vocabulary building.',
  },
  'primary-school-tuition': {
    slug: 'primary-school-tuition', url: '/primary-school-tuition', hub: 'psle-prep',
    title: 'Primary Tuition', anchor: 'primary school tuition in Singapore',
    blurb: 'Find a primary tutor from P1 through to PSLE.',
  },

  // --- IB & IGCSE cluster ---
  'ibdp-biology': {
    slug: 'ibdp-biology', url: '/ibdp-biology', hub: 'ib-igcse',
    title: 'IBDP Biology', anchor: 'IB Diploma Biology guide',
    blurb: 'HL and SL coverage, internal assessment and paper strategy.',
  },
  'ibdp-chemistry': {
    slug: 'ibdp-chemistry', url: '/ibdp-chemistry', hub: 'ib-igcse',
    title: 'IBDP Chemistry', anchor: 'IB Diploma Chemistry guide',
    blurb: 'HL and SL coverage, internal assessment and paper strategy.',
  },
  'ibdp-physics': {
    slug: 'ibdp-physics', url: '/ibdp-physics', hub: 'ib-igcse',
    title: 'IBDP Physics', anchor: 'IB Diploma Physics guide',
    blurb: 'HL and SL coverage, internal assessment and paper strategy.',
  },
  'igcse-biology': {
    slug: 'igcse-biology', url: '/igcse-biology', hub: 'ib-igcse',
    title: 'IGCSE Biology', anchor: 'IGCSE Biology guide',
    blurb: 'Core and extended syllabus with practical paper technique.',
  },
  'igcse-chemistry': {
    slug: 'igcse-chemistry', url: '/igcse-chemistry', hub: 'ib-igcse',
    title: 'IGCSE Chemistry', anchor: 'IGCSE Chemistry guide',
    blurb: 'Core and extended syllabus with practical paper technique.',
  },
  'igcse-physics': {
    slug: 'igcse-physics', url: '/igcse-physics', hub: 'ib-igcse',
    title: 'IGCSE Physics', anchor: 'IGCSE Physics guide',
    blurb: 'Core and extended syllabus with practical paper technique.',
  },
};
```

- [ ] **Step 4: Write `links.mjs`**

Create `apps/website/src/lib/seo/links.mjs`:

```js
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
```

- [ ] **Step 5: Run the tests**

Run: `cd apps/website && npm test`

Expected: the route-existence test **FAILS** for `ib-igcse` (`/guides/ib-igcse` does not exist yet). Every other test passes. This is the correct failure — it is the test telling you Task 8 is outstanding.

- [ ] **Step 6: Create a placeholder route so the suite is green**

Create `apps/website/src/app/guides/ib-igcse/page.jsx`. Task 8 replaces this with the real hub.

```jsx
export const metadata = {
  title: 'IB & IGCSE Guides Singapore | LionCity Tutors',
  description: 'Subject guides for IB Diploma and IGCSE students in Singapore, covering Biology, Chemistry and Physics at both HL and SL.',
  alternates: { canonical: 'https://www.lioncitytutors.com/guides/ib-igcse' },
};

export default function IbIgcseHub() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold text-gray-900">IB &amp; IGCSE Guides</h1>
    </main>
  );
}
```

- [ ] **Step 7: Run the tests to verify they pass**

Run: `cd apps/website && npm test`
Expected: PASS — all tests across both test files.

- [ ] **Step 8: Commit**

```bash
git add apps/website/src/lib/seo apps/website/src/app/guides/ib-igcse
git commit -m "Add SEO cluster registry with enforced link reciprocity

Declares hubs, spokes and anchor text in one place. Tests assert every
spoke and hub reference each other and that every url resolves to a real
route, so the graph cannot silently rot."
```

---

### Task 3: RelatedGuides component

**Files:**
- Create: `apps/website/src/components/guide/RelatedGuides.jsx`
- Modify: `apps/website/src/components/guide/index.js`

**Interfaces:**
- Consumes: `getHubFor`, `getSiblings`, `getPage` from `@/lib/seo/links.mjs`.
- Produces: default export `RelatedGuides({ slug, heading, showHub })`.
  - `slug` (required) — registry slug of the current page.
  - `heading` (optional) — section heading, defaults to `'Continue your revision'`.
  - `showHub` (optional, default `true`) — render the link up to the hub. Pass `false` on hub pages.
  - Renders `null` when `slug` is unknown, so a typo degrades to nothing rather than crashing a page.

- [ ] **Step 1: Write the component**

This is a server component (no `'use client'`) — it renders static links, so it must not ship JS.

```jsx
import Link from 'next/link';
import { ArrowUpRight, Compass } from 'lucide-react';
import { getHubFor, getSiblings, getPage } from '@/lib/seo/links.mjs';
import { ICON_STROKE } from './constants';

/**
 * Reciprocal cluster links, derived entirely from the SEO registry.
 *
 * Anchor text comes from the registry rather than the call site so the same
 * page is described consistently everywhere it is linked.
 *
 * @param {string} slug - registry slug of the page rendering this block
 * @param {string} [heading]
 * @param {boolean} [showHub] - pass false on a hub page
 */
export default function RelatedGuides({ slug, heading = 'Continue your revision', showHub = true }) {
  const page = getPage(slug);
  if (!page) return null;

  const hub = getHubFor(slug);
  const siblings = getSiblings(slug);
  if (!hub && siblings.length === 0) return null;

  const isHub = hub && hub.slug === slug;

  return (
    <section aria-labelledby={`related-${slug}`} className="mt-16 border-t border-gray-100 pt-10">
      <h2 id={`related-${slug}`} className="flex items-center gap-2 text-2xl font-bold text-gray-900 mb-6">
        <Compass className="h-6 w-6 text-[#0474BA]" strokeWidth={ICON_STROKE} aria-hidden="true" />
        {heading}
      </h2>

      {showHub && hub && !isHub ? (
        <Link
          href={hub.url}
          className="group mb-6 flex items-start justify-between gap-4 rounded-xl border border-[#0474BA]/20 bg-[#0474BA]/5 p-5 transition-colors hover:border-[#0474BA]/50"
        >
          <span>
            <span className="block font-semibold text-[#0474BA]">{hub.anchor}</span>
            <span className="mt-1 block text-sm text-gray-600">
              Timetable, subject choices and the full revision plan in one place.
            </span>
          </span>
          <ArrowUpRight
            className="mt-1 h-5 w-5 shrink-0 text-[#0474BA] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            strokeWidth={ICON_STROKE}
            aria-hidden="true"
          />
        </Link>
      ) : null}

      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {siblings.map((s) => (
          <li key={s.slug}>
            <Link
              href={s.url}
              className="group block h-full rounded-xl border border-gray-200 p-5 transition-all hover:-translate-y-0.5 hover:border-[#F17720] hover:shadow-md"
            >
              <span className="block font-semibold text-gray-900 group-hover:text-[#F17720]">
                {s.anchor}
              </span>
              <span className="mt-1 block text-sm text-gray-600">{s.blurb}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

- [ ] **Step 2: Export it from the guide barrel**

In `apps/website/src/components/guide/index.js`, add alongside the existing exports:

```js
export { default as RelatedGuides } from './RelatedGuides';
```

- [ ] **Step 3: Verify it compiles**

Run: `cd apps/website && npm run build`
Expected: build succeeds. The component is not yet rendered anywhere, so this only proves it compiles and its imports resolve — importantly, that Next resolves the `.mjs` import from a `.jsx` file.

- [ ] **Step 4: Commit**

```bash
git add apps/website/src/components/guide/RelatedGuides.jsx apps/website/src/components/guide/index.js
git commit -m "Add RelatedGuides component driven by the cluster registry"
```

---

### Task 4: GuideSchema component

**Files:**
- Create: `apps/website/src/components/seo/GuideSchema.jsx`
- Test: `apps/website/src/lib/seo/schema.test.mjs`
- Create: `apps/website/src/lib/seo/schema.mjs`

The JSON-LD objects are built by pure functions in `schema.mjs` so they can be tested without rendering React. The component is a thin wrapper that serialises them.

**Interfaces:**
- Produces from `schema.mjs`: `buildBreadcrumbSchema(slug)`, `buildArticleSchema({ slug, headline, description, datePublished, dateModified })`, `buildFaqSchema(faqs)`.
  - `faqs` is `Array<{ question: string, answer: string }>`.
  - `buildFaqSchema([])` returns `null` so callers can skip rendering.
- Produces from `GuideSchema.jsx`: default export `GuideSchema({ slug, article, faqs })`.

- [ ] **Step 1: Write the failing test**

Create `apps/website/src/lib/seo/schema.test.mjs`:

```js
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildBreadcrumbSchema, buildArticleSchema, buildFaqSchema, buildCourseSchema,
} from './schema.mjs';

const SITE = 'https://www.lioncitytutors.com';

describe('breadcrumb schema', () => {
  test('emits absolute urls in order with 1-based positions', () => {
    const schema = buildBreadcrumbSchema('o-level-physics');
    assert.equal(schema['@type'], 'BreadcrumbList');
    assert.equal(schema.itemListElement.length, 3);
    assert.deepEqual(
      schema.itemListElement.map((i) => i.position),
      [1, 2, 3],
    );
    assert.equal(schema.itemListElement[0].item, `${SITE}/`);
    assert.equal(schema.itemListElement[2].item, `${SITE}/o-level-physics`);
  });

  test('returns null for an unknown slug', () => {
    assert.equal(buildBreadcrumbSchema('not-a-page'), null);
  });
});

describe('article schema', () => {
  test('carries headline, dates and a canonical url', () => {
    const schema = buildArticleSchema({
      slug: 'o-level-prep',
      headline: 'O-Level Preparation Guide 2026',
      description: 'A complete plan.',
      datePublished: '2026-01-10',
      dateModified: '2026-07-27',
    });
    assert.equal(schema['@type'], 'Article');
    assert.equal(schema.headline, 'O-Level Preparation Guide 2026');
    assert.equal(schema.dateModified, '2026-07-27');
    assert.equal(schema.mainEntityOfPage['@id'], `${SITE}/blog/o-level-preparation-guide`);
    assert.equal(schema.publisher.name, 'LionCity Tutors');
  });
});

describe('faq schema', () => {
  test('maps each entry to a Question with an accepted answer', () => {
    const schema = buildFaqSchema([
      { question: 'When are the 2026 O-Levels?', answer: 'Papers run from 2 June to 10 November 2026.' },
    ]);
    assert.equal(schema['@type'], 'FAQPage');
    assert.equal(schema.mainEntity[0]['@type'], 'Question');
    assert.equal(schema.mainEntity[0].name, 'When are the 2026 O-Levels?');
    assert.equal(
      schema.mainEntity[0].acceptedAnswer.text,
      'Papers run from 2 June to 10 November 2026.',
    );
  });

  test('returns null when there are no faqs', () => {
    assert.equal(buildFaqSchema([]), null);
    assert.equal(buildFaqSchema(undefined), null);
  });
});

describe('course schema', () => {
  test('describes a subject page as an educational program', () => {
    const schema = buildCourseSchema({
      slug: 'o-level-physics',
      name: 'O-Level Physics Tuition',
      description: 'One-to-one O-Level Physics tuition in Singapore.',
      educationalLevel: 'GCE O-Level',
    });
    assert.equal(schema['@type'], 'Course');
    assert.equal(schema.name, 'O-Level Physics Tuition');
    assert.equal(schema.educationalLevel, 'GCE O-Level');
    assert.equal(schema.url, `${SITE}/o-level-physics`);
    assert.equal(schema.provider.name, 'LionCity Tutors');
  });

  test('returns null for an unknown slug', () => {
    assert.equal(buildCourseSchema({ slug: 'not-a-page', name: 'x' }), null);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `cd apps/website && npm test`
Expected: FAIL — cannot find module `./schema.mjs`.

- [ ] **Step 3: Write `schema.mjs`**

```js
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
    // Course is a CreativeWork subtype, so it validly carries educationalLevel.
    // EducationalOccupationalProgram descends from Intangible and does NOT.
    '@type': 'Course',
    name,
    description,
    educationalLevel,
    url: absolute(page.url),
    provider: { '@type': 'Organization', name: 'LionCity Tutors', url: SITE_URL },
  };
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `cd apps/website && npm test`
Expected: PASS.

- [ ] **Step 5: Write the component**

Create `apps/website/src/components/seo/GuideSchema.jsx`:

```jsx
import {
  buildBreadcrumbSchema, buildArticleSchema, buildFaqSchema, buildCourseSchema,
} from '@/lib/seo/schema.mjs';

/**
 * Emits the JSON-LD for a cluster page. Renders nothing visible.
 *
 * @param {string} slug - registry slug
 * @param {object} [article] - { headline, description, datePublished, dateModified }
 * @param {object} [course] - { name, description, educationalLevel } for subject pages
 * @param {Array<{question: string, answer: string}>} [faqs]
 */
export default function GuideSchema({ slug, article, course, faqs }) {
  const schemas = [
    buildBreadcrumbSchema(slug),
    article ? buildArticleSchema({ slug, ...article }) : null,
    course ? buildCourseSchema({ slug, ...course }) : null,
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
```

- [ ] **Step 6: Verify the build**

Run: `cd apps/website && npm run build`
Expected: build succeeds.

- [ ] **Step 7: Commit**

```bash
git add apps/website/src/lib/seo/schema.mjs apps/website/src/lib/seo/schema.test.mjs apps/website/src/components/seo/GuideSchema.jsx
git commit -m "Add GuideSchema with tested JSON-LD builders

Breadcrumb, Article and FAQPage schema built by pure functions so the
output is unit-tested without rendering React."
```

---

### Task 5: ExamTimetable component

Shared by every hub and subject page, so the timetable is written once.

**Files:**
- Create: `apps/website/src/components/guide/ExamTimetable.jsx`
- Modify: `apps/website/src/components/guide/index.js`

**Interfaces:**
- Consumes: `getExam` from `@/data/examCalendar2026.mjs`.
- Produces: default export `ExamTimetable({ examSlug, subjectSlugs, caption })`.
  - `subjectSlugs` optional — when omitted, renders every subject for that exam.
  - Renders `null` for an unknown `examSlug` or when no subjects match.

- [ ] **Step 1: Write the component**

```jsx
import { getExam } from '@/data/examCalendar2026.mjs';

const LONG_DATE = new Intl.DateTimeFormat('en-SG', {
  weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC',
});

/** Formats an ISO date as e.g. "Mon, 5 Oct 2026". */
function formatDate(iso) {
  return LONG_DATE.format(new Date(`${iso}T00:00:00Z`));
}

/**
 * Official 2026 examination timetable, read from the SEAB data module.
 *
 * @param {string} examSlug - 'psle' | 'o-level' | 'n-level' | 'a-level'
 * @param {string[]} [subjectSlugs] - restrict to these subjects, in this order
 * @param {string} [caption]
 */
export default function ExamTimetable({ examSlug, subjectSlugs, caption }) {
  const exam = getExam(examSlug);
  if (!exam) return null;

  const subjects = subjectSlugs
    ? subjectSlugs.map((s) => exam.subjects.find((x) => x.slug === s)).filter(Boolean)
    : exam.subjects;

  if (subjects.length === 0) return null;

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
        {caption ? (
          <caption className="mb-3 text-left text-sm text-gray-600">{caption}</caption>
        ) : null}
        <thead>
          <tr className="border-b-2 border-gray-200 text-gray-900">
            <th scope="col" className="py-2 pr-4 font-semibold">Subject</th>
            <th scope="col" className="py-2 pr-4 font-semibold">Paper</th>
            <th scope="col" className="py-2 pr-4 font-semibold">Date</th>
            <th scope="col" className="py-2 font-semibold">Time</th>
          </tr>
        </thead>
        <tbody>
          {subjects.flatMap((subject) =>
            subject.papers.map((paper, i) => (
              <tr key={`${subject.slug}-${paper.label}`} className="border-b border-gray-100">
                {i === 0 ? (
                  <th
                    scope="rowgroup"
                    rowSpan={subject.papers.length}
                    className="py-2 pr-4 align-top font-medium text-gray-900"
                  >
                    {subject.name}
                    {subject.code ? (
                      <span className="block text-xs font-normal text-gray-500">
                        Syllabus {subject.code}
                      </span>
                    ) : null}
                  </th>
                ) : null}
                <td className="py-2 pr-4 text-gray-700">{paper.label}</td>
                <td className="py-2 pr-4 tabular-nums text-gray-700">{formatDate(paper.date)}</td>
                <td className="py-2 tabular-nums text-gray-700">{paper.time ?? paper.note ?? '—'}</td>
              </tr>
            )),
          )}
        </tbody>
      </table>
    </div>
  );
}
```

- [ ] **Step 2: Export from the barrel**

In `apps/website/src/components/guide/index.js`:

```js
export { default as ExamTimetable } from './ExamTimetable';
```

- [ ] **Step 3: Verify the build**

Run: `cd apps/website && npm run build`
Expected: build succeeds.

- [ ] **Step 4: Commit**

```bash
git add apps/website/src/components/guide/ExamTimetable.jsx apps/website/src/components/guide/index.js
git commit -m "Add ExamTimetable component reading from the SEAB data module"
```

---

### Task 6: Rebuild the O-Level hub page

The flagship: 6,270 impressions at position 16.2, ranking for `o level tips` (19.0), `o level preparation tips` (17.0), `how to prepare for o level` (19.4), `how to improve grades before o levels` (17.3), `o level tutorial` (18.0).

**Files:**
- Modify: `apps/website/src/app/blog/o-level-preparation-guide/page.jsx`
- Modify: `apps/website/src/app/blog/o-level-preparation-guide/client.jsx:396-420` (replace the hardcoded subject-guide grid)

- [ ] **Step 1: Rewrite the metadata**

Replace the `metadata` export in `page.jsx`. Title is 58 characters; description is 158.

```js
export const metadata = {
  title: 'O-Level Preparation Guide 2026: Complete Study Plan',
  description:
    'Full GCE O-Level prep guide for 2026 — the official exam timetable, subject-by-subject strategies, a term-by-term plan, and the mistakes that cost students an A1.',
  keywords: [
    'O Level preparation 2026', 'O Level timetable 2026', 'GCE O Level Singapore',
    'O Level study guide', 'L1R5 calculation', 'how to score A1 O Level',
    'O Level preparation tips', 'how to improve grades before O Levels',
    'O Level exam dates 2026', 'SEAB O Level',
  ],
  openGraph: {
    title: 'O-Level Preparation Guide 2026: Complete Study Plan',
    description:
      'The official 2026 O-Level timetable, subject strategies and a term-by-term revision plan for Singapore students.',
    url: 'https://www.lioncitytutors.com/blog/o-level-preparation-guide',
    type: 'article',
  },
  alternates: {
    canonical: 'https://www.lioncitytutors.com/blog/o-level-preparation-guide',
  },
};
```

- [ ] **Step 2: Add schema to the page shell**

`page.jsx` becomes:

```jsx
import GuideSchema from '@/components/seo/GuideSchema';
import OLevelPrepGuideClient from './client';
import { O_LEVEL_FAQS } from './faqs.mjs';

// ... metadata export from Step 1 ...

export default function OLevelPrepGuidePage() {
  return (
    <>
      <GuideSchema
        slug="o-level-prep"
        article={{
          headline: 'O-Level Preparation Guide 2026: Complete Study Plan',
          description:
            'The official 2026 O-Level timetable, subject strategies and a term-by-term revision plan for Singapore students.',
          datePublished: '2026-01-10',
          dateModified: '2026-07-27',
        }}
        faqs={O_LEVEL_FAQS}
      />
      <OLevelPrepGuideClient />
    </>
  );
}
```

- [ ] **Step 3: Create the FAQ content module**

Create `apps/website/src/app/blog/o-level-preparation-guide/faqs.mjs`. Each answer is self-contained and 40–60 words, per the answer-block convention — these are written to be liftable into an AI answer or a featured snippet.

Each entry targets a query this page already ranks for. Write the file exactly as
below — the answers are already within the 40–60 word band and are phrased to be
liftable into an AI answer or featured snippet without surrounding context.

```js
/**
 * FAQ content for the O-Level hub. Rendered as visible text on the page AND
 * emitted as FAQPage JSON-LD — the two must always match, so both read from here.
 *
 * Query positions at time of writing (GSC, 3 months to 2026-07-23) are noted so a
 * future editor can tell which phrasing is load-bearing.
 */
export const O_LEVEL_FAQS = [
  {
    // targets "o level exam dates 2026"
    question: 'When are the 2026 O-Level exams?',
    answer:
      'The 2026 GCE O-Level examinations run from 2 June to 10 November 2026. Mother Tongue written papers are sat first on 2 June, oral examinations follow in July, and the main written period begins on 15 October. Results are released between 13 and 15 January 2027.',
  },
  {
    // targets "o level preparation tips" (pos 17.0, 217 impressions, 0 clicks)
    question: 'What are the best O-Level preparation tips?',
    answer:
      'Work past papers by topic rather than by year, so weak areas surface early. Mark your own scripts against the official SEAB mark scheme instead of model answers. Start full timed papers ten weeks before the exam. Most lost marks come from method and presentation, not missing knowledge.',
  },
  {
    // targets "how to improve grades before o levels" (pos 17.3, 201 impressions)
    question: 'How can I improve my grades before the O-Levels?',
    answer:
      'In the final months grades move fastest by fixing how you answer, not by learning new content. Drill only your two weakest topics, rewrite answers that lost method marks, and sit complete papers under exam timing. Presentation and working alone are often worth a full grade.',
  },
  {
    question: 'How many subjects should I take for O-Level?',
    answer:
      'Most Singapore students take six to eight O-Level subjects. Only your L1 and five relevant subjects count toward L1R5, so a seventh or eighth subject rarely improves your aggregate. Take an extra subject only when a specific JC or polytechnic course requires it.',
  },
  {
    question: 'How is L1R5 calculated?',
    answer:
      'L1R5 adds your first language grade to your five best relevant subject grades, producing an aggregate between 6 and 30. A lower score is better. Either English or Higher Mother Tongue can serve as L1. From the 2028 cohort, JC admission moves from L1R5 to L1R4.',
  },
];
```

**Constraints:** every date above already matches `examCalendar2026.mjs` — if you
change one, change both. Do not add grade boundaries; SEAB does not publish them.
The final L1R4 sentence is sourced from a secondary site — **verify it against an
MOE page before shipping, and delete that sentence if you cannot.**

- [ ] **Step 4: Add the timetable and FAQ sections to `client.jsx`**

Add two new sections, and add their entries to the existing `tableOfContents` array:

- `{ id: 'timetable', label: '2026 O-Level exam timetable' }` — placed directly after the existing structure section. Renders `<ExamTimetable examSlug="o-level" caption="Official 2026 GCE O-Level timetable, as published by SEAB." />` under an H2 reading "When are the 2026 O-Level exams?", preceded by the 40–60 word answer paragraph.
- `{ id: 'faq', label: 'O-Level FAQs' }` — placed just before the CTA. Renders `O_LEVEL_FAQS` as `<h3>` question + answer paragraph pairs. Do not use an accordion that hides answers behind JS — the text must be in the served HTML.

- [ ] **Step 4b: Add the Sec 3 → Sec 4 timeline section**

Add `{ id: 'sec3-sec4-timeline', label: 'Sec 3 to Sec 4 timeline' }` to the table of
contents, placed after the timetable section.

Use the existing `GuideTimeline` component from `@/components/guide` — it is already
the house pattern for this shape (see `a-level-biology/page.jsx`, which passes an
array of `{ title, points }`). Do not build a new timeline.

Open the section with an H2 reading **"What should I be doing from Sec 3 to Sec 4?"**
followed by a 40–60 word answer paragraph, then the timeline with these six phases:

```jsx
const sec3ToSec4 = [
  {
    title: 'Sec 3 Term 1–2 · Foundation',
    points: [
      'Lock in subject combination and confirm which subjects count toward L1R5',
      'Build the A-Math and Chemistry foundations that Sec 4 assumes',
      'Fix note-taking and filing habits now — Sec 4 offers no time for it',
    ],
  },
  {
    title: 'Sec 3 Term 3–4 · Consolidation',
    points: [
      'Start topical past-paper practice on completed topics',
      'Identify the two weakest topics per subject and address them while there is slack',
      'Sit end-of-year exams as a diagnostic rather than a verdict',
    ],
  },
  {
    title: 'Sec 4 Term 1 · Syllabus completion',
    points: [
      'Finish remaining syllabus content by the end of term',
      'Begin weekly timed sections, not yet full papers',
      'Book any needed tuition now — availability tightens sharply after March',
    ],
  },
  {
    title: 'Sec 4 Term 2 · Full-paper practice',
    points: [
      'Move to complete papers under exam timing',
      'Mark against the official SEAB mark scheme and log every method mark lost',
      'Prepare Mother Tongue papers — they are sat on 2 June, before everything else',
    ],
  },
  {
    title: 'Sec 4 Term 3 · Prelims and orals',
    points: [
      'Sit prelims as a rehearsal for pacing, not as a predictor of the final grade',
      'English and Mother Tongue orals fall in July — practise aloud, not silently',
      'Rebuild the revision plan around whatever prelims exposed',
    ],
  },
  {
    title: 'Sec 4 Term 4 · Final run',
    points: [
      'Science practicals come first: Chemistry 30 Sep, Physics 5 Oct, Biology 13 Oct',
      'Written papers begin 15 October and run to 10 November',
      'Taper new content two weeks out and shift entirely to past papers and rest',
    ],
  },
];
```

**Constraint:** the dates in the final phase must match `examCalendar2026.mjs`.

- [ ] **Step 5: Replace the hardcoded subject grid with RelatedGuides**

In `client.jsx`, delete the hardcoded array at lines 396–420 (the `In-Depth O-Level Subject Guides` block with its six inline `{ title, desc, href }` objects) and replace the whole section with:

```jsx
<RelatedGuides slug="o-level-prep" heading="In-depth O-Level subject guides" showHub={false} />
```

This picks up all ten registry spokes instead of the six that were hardcoded, and the anchor text now matches what the spokes use for themselves.

- [ ] **Step 6: Verify the rendered HTML**

Source grep is not sufficient — titles and JSON-LD are composed at runtime.

```bash
cd apps/website && npm run build && npm start &
sleep 8
curl -s localhost:3000/blog/o-level-preparation-guide > /tmp/olevel.html
grep -o '<title>[^<]*</title>' /tmp/olevel.html
grep -c 'application/ld+json' /tmp/olevel.html          # expect 3
grep -o '"@type":"FAQPage"' /tmp/olevel.html            # expect 1 match
grep -c 'href="/o-level-physics"' /tmp/olevel.html      # expect >= 1
grep -o '30 Sep 2026' /tmp/olevel.html                  # chemistry practical present
kill %1
```

Expected: title matches Step 1 exactly; three JSON-LD blocks; FAQPage present; links to all ten spokes present; timetable dates rendered.

- [ ] **Step 7: Commit**

```bash
git add apps/website/src/app/blog/o-level-preparation-guide
git commit -m "Rebuild O-Level hub: timetable, FAQs, schema and cluster links

Adds the official 2026 timetable and five FAQ blocks targeting queries
this page already ranks 17-19 for, and replaces the hardcoded six-item
subject grid with the full ten-spoke registry."
```

---

### Task 7: Wire the O-Level spokes

Ten pages, each currently with zero internal links.

**Files (modify):**
`o-level-english`, `o-level-math`, `o-level-physics`, `o-level-chemistry`, `o-level-biology`, `combined-science-overview`, `combined-chemistry-physics`, `combined-chemistry-biology`, `combined-physics-biology`, `secondary-school-tuition/o-level-tuition` — each `page.jsx`.

- [ ] **Step 1: Apply the same four changes to each page**

For every page in the list:

1. Import `GuideSchema` and render it at the top of the returned fragment, with `slug` set to that page's registry slug and `faqs` where the page has an FAQ section. Subject pages get no `article` prop — they take a `course` prop instead:

```jsx
<GuideSchema
  slug="o-level-physics"
  course={{
    name: 'O-Level Physics Tuition',
    description: 'One-to-one O-Level Physics tuition in Singapore, covering the full 6091 syllabus and the Paper 3 practical.',
    educationalLevel: 'GCE O-Level',
  }}
  faqs={O_LEVEL_PHYSICS_FAQS}
/>
```
2. Import `RelatedGuides` from `@/components/guide` and render `<RelatedGuides slug="<slug>" />` immediately before the page's closing CTA.
3. Rewrite `metadata.title` to the formula — under 60 chars, front-loaded with the primary keyword, ending `| LionCity Tutors` only if it fits.
4. Add a subject timetable where the subject exists in the calendar module, e.g. on `/o-level-physics`:
   `<ExamTimetable examSlug="o-level" subjectSlugs={['physics']} caption="Official 2026 SEAB dates for O-Level Physics." />`

- [ ] **Step 2: Add a targeted FAQ to the three highest-impression spokes**

Only these three, using the answer-block convention:

- `/o-level-chemistry` (4,205 impressions, pos 14.5) — three FAQs, one targeting qualitative analysis technique, one on the practical paper, one on mole calculations.
- `/o-level-physics` (2,032 impressions, pos 19.7) — three FAQs, with one explicitly titled **"What are the most common Physics mistakes at O-Level?"** to target `common physics mistakes o level` (pos 14.6, 145 impressions).
- `/o-level-math` (2,015 impressions, pos 35.0) — three FAQs, with one titled **"How do you score A1 in O-Level Maths?"** to target `tips for scoring a1 in o level math` (pos 15.4).

- [ ] **Step 3: Verify the rendered HTML for all ten**

```bash
cd apps/website && npm run build && npm start &
sleep 8
for p in o-level-english o-level-math o-level-physics o-level-chemistry o-level-biology \
         combined-science-overview combined-chemistry-physics combined-chemistry-biology \
         combined-physics-biology secondary-school-tuition/o-level-tuition; do
  html=$(curl -s "localhost:3000/$p")
  echo "$p | ld+json: $(grep -c 'application/ld+json' <<< "$html") | hub link: $(grep -c 'blog/o-level-preparation-guide' <<< "$html")"
done
kill %1
```

Expected: every page reports at least 1 JSON-LD block and at least 1 link back to the hub. **A zero in the hub-link column means the reciprocity the registry promises is not actually rendering** — fix before committing.

- [ ] **Step 4: Commit**

```bash
git add apps/website/src/app/o-level-* apps/website/src/app/combined-* apps/website/src/app/secondary-school-tuition/o-level-tuition
git commit -m "Wire O-Level spokes into the cluster

Adds reciprocal hub links, breadcrumb schema, subject timetables and
targeted FAQs to ten pages that previously had zero internal links."
```

---

### Task 8: A-Level cluster, including the revised syllabus content

The differentiated content. 2026 is simultaneously the first examination year of the revised science syllabuses and the final year of the legacy ones.

**Files:**
- Modify: `apps/website/src/app/blog/a-level-preparation-guide/{page.jsx,client.jsx}`
- Create: `apps/website/src/app/blog/a-level-preparation-guide/faqs.mjs`
- Modify: `a-level-math`, `a-level-physics`, `a-level-chemistry`, `a-level-biology`, `a-level-general-paper`, `jc-tuition` — each `page.jsx`

- [ ] **Step 1: Verify the syllabus mark changes before writing them**

Open the official syllabus PDFs and confirm the three figures carried in the spec:

```bash
cd /private/tmp/claude-501/-Users-ivan-lioncity-tutors/50c77d5f-26d3-4a81-8864-1c1d3f6dd826/scratchpad
curl -sL -o 9476_sy.pdf "https://www.seab.gov.sg/files/A%20Level%20Syllabus%20Sch%20Cddts/2026/9476_y26_sy.pdf"
curl -sL -o 9478_sy.pdf "https://www.seab.gov.sg/files/A%20Level%20Syllabus%20Sch%20Cddts/2026/9478_y26_sy.pdf"
gs -q -dNOPAUSE -dBATCH -sDEVICE=txtwrite -o 9476_sy.txt 9476_sy.pdf
gs -q -dNOPAUSE -dBATCH -sDEVICE=txtwrite -o 9478_sy.txt 9478_sy.pdf
grep -iE "paper 3|practical|marks|weighting" 9476_sy.txt | head -40
```

Confirm: practical 55 → 50 marks at 20% weighting; Chemistry Paper 3 80 → 75 marks with Section A 60 → 55; Physics 9478 spreadsheet expectation. **Any figure you cannot confirm in the PDF is omitted from the content — do not publish it on the strength of the secondary source.**

- [ ] **Step 2: Rewrite the hub metadata**

Title (57 chars): `A-Level Preparation Guide 2026: H1 & H2 Study Plan`

Description (156 chars): `Complete 2026 GCE A-Level guide — the official timetable, the revised H2 science syllabuses, and a JC1-to-JC2 revision plan for Singapore students.`

This page sits at position 31.8 and ranks for `how to study for a levels singapore` (20.6, 379 impressions), `a level preparation` (22.9), `how to prepare for a levels` (24.2) and `o level exam preparation` (25.2).

- [ ] **Step 3: Write the revised-syllabus section on the hub**

Under an H2 reading **"What changed in the 2026 A-Level science syllabuses?"**, open with the 40–60 word answer: school candidates sit revised codes 9476 Chemistry, 9478 Physics and 9477 Biology from 2026; the legacy codes 9729, 9749 and 9744 have their final examination in 2026 and remain only for private and repeat candidates.

Then a table of old code → new code per subject, and the confirmed mark changes from Step 1.

Add a callout for retakers: a candidate sitting a legacy paper in 2026 has no further attempt on that syllabus and must move to the revised one.

- [ ] **Step 4: Create `faqs.mjs` for the A-Level hub**

Five entries, following the answer-block convention:

1. "When are the 2026 A-Level exams?" — 2 June to 27 November 2026, results 19–23 February 2027.
2. "How should I study for the A-Levels in Singapore?" — targets `how to study for a levels singapore` (pos 20.6, the largest striking-distance query on the site).
3. "What changed in the revised H2 science syllabuses?" — as Step 3.
4. "Which H2 subject combination should I take?"
5. "How many hours a week should a JC student revise?"

- [ ] **Step 5: Apply schema, RelatedGuides and timetables to the six spokes**

Same four changes as Task 7 Step 1, with subject timetables drawn from the `a-level` calendar entry. On `a-level-physics`, `a-level-chemistry` and `a-level-biology`, add a short revised-syllabus note linking back to the hub section.

`/a-level-general-paper` (2,881 impressions, pos 20.9) additionally gets two FAQs targeting `a level gp paper 1` (19.7) and `a level general paper questions` (20.7).

- [ ] **Step 6: Verify the rendered HTML**

```bash
cd apps/website && npm run build && npm start &
sleep 8
for p in blog/a-level-preparation-guide a-level-math a-level-physics a-level-chemistry \
         a-level-biology a-level-general-paper jc-tuition; do
  html=$(curl -s "localhost:3000/$p")
  echo "$p | ld+json: $(grep -c 'application/ld+json' <<< "$html") | hub link: $(grep -c 'a-level-preparation-guide' <<< "$html")"
done
curl -s localhost:3000/blog/a-level-preparation-guide | grep -o '9476' | head -1   # revised code present
kill %1
```

- [ ] **Step 7: Commit**

```bash
git add apps/website/src/app/blog/a-level-preparation-guide apps/website/src/app/a-level-* apps/website/src/app/jc-tuition
git commit -m "Wire A-Level cluster and document the 2026 syllabus transition

Covers the revised 9476/9478/9477 syllabuses in their first examination
year alongside the legacy codes' final year, with figures verified
against the SEAB syllabus PDFs."
```

---

### Task 9: PSLE cluster

`/blog/psle-preparation-guide` sits at position 62.7 with 680 impressions and 0 clicks; `psle preparation` has 533 impressions at position 66. `/psle-chinese` ranks 10.5 for `psle chinese marks breakdown`.

**Files:**
- Modify: `apps/website/src/app/blog/psle-preparation-guide/{page.jsx,client.jsx}`
- Create: `apps/website/src/app/blog/psle-preparation-guide/faqs.mjs`
- Modify: `psle-math`, `psle-english`, `psle-science`, `psle-chinese`, `primary-school-tuition` — each `page.jsx`

- [ ] **Step 1: Rewrite the hub metadata**

Title (56 chars): `PSLE Preparation Guide 2026: Timetable & Study Plan`

Description (155 chars): `Complete PSLE 2026 guide — official oral, listening and written exam dates, subject-by-subject strategies, and an AL scoring explainer for parents.`

- [ ] **Step 2: Add the timetable section**

`<ExamTimetable examSlug="psle" caption="Official 2026 PSLE timetable, as published by SEAB." />` under an H2 reading "When is the PSLE in 2026?", with the answer paragraph stating oral on 12–13 August, listening comprehension on 15 September, written papers 24–30 September, and results 24–25 November 2026.

Competitors ranking for `PSLE timetable 2026` are tuition sites, not authorities — this is a winnable SERP.

- [ ] **Step 3: Write five FAQs**

Covering PSLE timing, AL score bands, what a good AL score is, revision hours, and Higher Mother Tongue. Do not state AL cut-off points for named schools as official.

- [ ] **Step 4: Add schema, RelatedGuides and per-subject timetables to the five spokes**

On `/psle-chinese`, add an FAQ titled **"How are PSLE Chinese marks broken down?"** to target `psle chinese marks breakdown` (pos 10.5) — a page-one ranking currently earning zero clicks.

- [ ] **Step 5: Verify the rendered HTML**

Same loop as Task 7 Step 3, over `blog/psle-preparation-guide psle-math psle-english psle-science psle-chinese primary-school-tuition`.

- [ ] **Step 6: Commit**

```bash
git add apps/website/src/app/blog/psle-preparation-guide apps/website/src/app/psle-* apps/website/src/app/primary-school-tuition
git commit -m "Wire PSLE cluster with the official 2026 timetable and FAQs"
```

---

### Task 10: N-Level cluster

`/blog/n-level-preparation-guide` is the site's best-positioned guide (position 9.0, 1,851 impressions, 26 clicks) and ranks 10.8 for `gce n level meaning` and 10.6 for `n level meaning` — both page-one, both zero clicks. This is the clearest title-and-snippet failure on the site.

**Files:**
- Modify: `apps/website/src/app/blog/n-level-preparation-guide/{page.jsx,client.jsx}`
- Create: `apps/website/src/app/blog/n-level-preparation-guide/faqs.mjs`
- Modify: `apps/website/src/app/secondary-school-tuition/n-level-tuition/page.jsx`
- Modify: `apps/website/src/data/examCalendar2026.mjs` (fill in `n-level.subjects`)

- [ ] **Step 1: Extract the N-Level timetable**

```bash
cd /private/tmp/claude-501/-Users-ivan-lioncity-tutors/50c77d5f-26d3-4a81-8864-1c1d3f6dd826/scratchpad
grep -E "ENGLISH|MATHEMATICS|SCIENCE|MOTHER|MALAY|CHINESE|TAMIL" n-level.txt | sed 's/  */ /g' | sort -u
```

Populate `n-level.subjects` in the calendar module in the same shape as the O-Level entry. The existing tests will validate the ISO dates automatically.

- [ ] **Step 2: Rewrite the metadata to answer the query directly**

The page ranks for `n level meaning` but its title does not answer that question. Title (59 chars): `N-Level Guide 2026: What N(A) and N(T) Mean & How to Prep`

Description (157 chars): `What the GCE N-Level is, how N(A) and N(T) differ, the 2026 exam timetable, and how to progress to O-Level or Polytechnic through the PFP and DPP routes.`

- [ ] **Step 3: Add a definition section at the top**

Under an H2 reading **"What does GCE N-Level mean?"**, place a 40–60 word direct answer defining the Singapore-Cambridge GCE Normal Level, the N(A) and N(T) tracks, when each is sat, and what each leads to. This directly targets `gce n level meaning` (144 impressions) and `n level meaning` (101 impressions), both ranking ~10.7 with zero clicks.

Place it above the fold, before the existing content.

- [ ] **Step 4: Add the timetable, FAQs, schema and RelatedGuides**

FAQs should cover N(A) vs N(T), the N-to-O-Level progression year, PFP and DPP routes, and 2026 dates.

- [ ] **Step 5: Verify the rendered HTML**

```bash
cd apps/website && npm run build && npm start &
sleep 8
curl -s localhost:3000/blog/n-level-preparation-guide > /tmp/nlevel.html
grep -o '<title>[^<]*</title>' /tmp/nlevel.html
grep -io 'what does gce n-level mean' /tmp/nlevel.html
grep -c 'application/ld+json' /tmp/nlevel.html
kill %1
```

- [ ] **Step 6: Commit**

```bash
git add apps/website/src/app/blog/n-level-preparation-guide apps/website/src/app/secondary-school-tuition/n-level-tuition apps/website/src/data/examCalendar2026.mjs
git commit -m "Rebuild N-Level guide around the definition queries it ranks for

Page sits at position 10.6-10.8 for 'n level meaning' with zero clicks;
adds a direct definition answer, the 2026 timetable and FAQ schema."
```

---

### Task 11: Build the IB/IGCSE hub

Six orphaned pages with no hub. `/ibdp-physics` already ranks 11.0 and `/igcse-chemistry` 12.8 with no internal support at all.

**Files:**
- Modify: `apps/website/src/app/guides/ib-igcse/page.jsx` (replace the Task 2 placeholder)
- Modify: `ibdp-biology`, `ibdp-chemistry`, `ibdp-physics`, `igcse-biology`, `igcse-chemistry`, `igcse-physics` — each `page.jsx`
- Modify: `apps/website/public/sitemap.xml`

- [ ] **Step 1: Build the real hub page**

Replace the placeholder with a full hub: `GuideHeader`, an introduction explaining how IB Diploma and IGCSE differ from the Singapore national track, `<RelatedGuides slug="ib-igcse" showHub={false} />` listing all six spokes, `GuideSchema` with an `article` prop, and four FAQs covering IB vs A-Level, HL vs SL choice, IGCSE vs O-Level, and university recognition in Singapore.

Note `ibdp physics guide 2025` ranks at position 6.0 — refresh any 2025 references to 2026.

- [ ] **Step 2: Wire the six spokes**

Same four changes as Task 7 Step 1, using `ib-igcse` as the hub.

- [ ] **Step 3: Add the hub to the sitemap**

`apps/website/public/sitemap.xml` is hand-maintained and **begins with a UTF-8 BOM — preserve it.** Add:

```xml
  <url>
    <loc>https://www.lioncitytutors.com/guides/ib-igcse</loc>
    <lastmod>2026-07-27T00:00:00+08:00</lastmod>
    <priority>0.8</priority>
  </url>
```

Do not touch other `lastmod` values in this task — a blanket date sweep is a separate decision.

- [ ] **Step 4: Verify**

```bash
cd apps/website && npm test && npm run build && npm start &
sleep 8
for p in guides/ib-igcse ibdp-biology ibdp-chemistry ibdp-physics igcse-biology igcse-chemistry igcse-physics; do
  html=$(curl -s "localhost:3000/$p")
  echo "$p | ld+json: $(grep -c 'application/ld+json' <<< "$html") | hub link: $(grep -c 'guides/ib-igcse' <<< "$html")"
done
kill %1
head -c 3 public/sitemap.xml | xxd | head -1    # expect efbbbf (BOM intact)
```

- [ ] **Step 5: Commit**

```bash
git add apps/website/src/app/guides/ib-igcse apps/website/src/app/ibdp-* apps/website/src/app/igcse-* apps/website/public/sitemap.xml
git commit -m "Add IB/IGCSE hub and wire its six previously orphaned spokes"
```

---

### Task 12: Full-cluster verification

- [ ] **Step 1: Run the whole test suite**

Run: `cd apps/website && npm test`
Expected: PASS, including the reciprocity and route-existence tests now covering every cluster page.

- [ ] **Step 2: Assert no cluster page is a dead end**

```bash
cd apps/website && npm run build && npm start &
sleep 8
fail=0
for slug in o-level-english o-level-math o-level-physics o-level-chemistry o-level-biology \
            combined-science-overview combined-chemistry-physics combined-chemistry-biology \
            combined-physics-biology a-level-math a-level-physics a-level-chemistry \
            a-level-biology a-level-general-paper jc-tuition psle-math psle-english \
            psle-science psle-chinese primary-school-tuition ibdp-biology ibdp-chemistry \
            ibdp-physics igcse-biology igcse-chemistry igcse-physics; do
  html=$(curl -s "localhost:3000/$slug")
  links=$(grep -o 'href="/[a-z0-9/-]*"' <<< "$html" | sort -u | wc -l)
  ld=$(grep -c 'application/ld+json' <<< "$html")
  if [ "$links" -lt 2 ] || [ "$ld" -lt 1 ]; then echo "FAIL $slug links=$links ld=$ld"; fail=1; fi
done
[ "$fail" -eq 0 ] && echo "All cluster pages linked and marked up"
kill %1
```

Expected: `All cluster pages linked and marked up`. Every page named here started Phase 1 with **zero** internal links.

- [ ] **Step 3: Validate the JSON-LD parses**

```bash
cd apps/website && npm start &
sleep 8
for p in blog/o-level-preparation-guide blog/a-level-preparation-guide \
         blog/psle-preparation-guide blog/n-level-preparation-guide guides/ib-igcse; do
  curl -s "localhost:3000/$p" \
    | grep -o '<script type="application/ld+json">[^<]*</script>' \
    | sed 's/<[^>]*>//g' \
    | while read -r json; do echo "$json" | node -e 'JSON.parse(require("fs").readFileSync(0,"utf8")); console.log("ok")'; done
done
kill %1
```

Expected: `ok` for every block. A parse failure means an unescaped character in FAQ copy.

- [ ] **Step 4: Confirm every title is under 60 characters**

```bash
cd apps/website && npm start &
sleep 8
for p in blog/o-level-preparation-guide blog/a-level-preparation-guide blog/psle-preparation-guide \
         blog/n-level-preparation-guide guides/ib-igcse; do
  t=$(curl -s "localhost:3000/$p" | grep -o '<title>[^<]*</title>' | sed 's/<[^>]*>//g')
  echo "${#t} | $t"
done
kill %1
```

Expected: every length under 60. Longer titles get truncated in the SERP, which is the CTR problem this phase exists to fix.

- [ ] **Step 5: Commit any fixes and record the baseline**

```bash
git add -A apps/website
git commit -m "Phase 1 verification fixes"
```

Record today's position and CTR for the twelve striking-distance queries from the spec. Re-export GSC in four weeks and compare — that is the measure of whether Phase 1 worked.

---

## Post-Phase-1 notes

- **Not yet done:** Phase 2 (`/free-test-papers`, `/free-notes`) and Phase 3 (commercial pages). Separate plans.
- **Still open from the spec:** the L1R5 → L1R4 change from the 2028 cohort remains sourced from a secondary site. Verify against MOE before it appears in published copy.
- **Expected timing:** metadata and CTR changes typically show in GSC within 2–3 weeks; ranking movement from internal linking takes 4–8 weeks. Do not judge Phase 1 before four weeks of data.
