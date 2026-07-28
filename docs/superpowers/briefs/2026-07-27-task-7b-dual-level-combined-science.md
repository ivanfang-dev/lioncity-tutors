# Task 7b: Dual-level Combined Science

## Why this task exists

Task 7 discovered that the four Combined Science pages are **N-Level** content
(syllabus codes 5105–5107, with heavy N(A) references in the body copy) while the
SEO registry placed them under the **O-Level** hub. Task 7 then wrote O-Level
metadata and schema onto that N-Level body copy, so those four pages currently
contradict themselves. That must not ship.

Both code sets are real, confirmed against SEAB's official 2026 calendars:

- **O-Level Combined Science:** 5086 (Phy/Chem), 5087 (Phy/Bio), 5088 (Chem/Bio)
- **N-Level Combined Science:** 5105 (Phy/Chem), 5106 (Phy/Bio), 5107 (Chem/Bio)

The site owner's decision: **cover both levels on each page, and link the pages from
both hubs.** `/combined-science-overview` is the site's third-best page (2,901
impressions, position 15.1) and ranks for `combined science o level`, so the O-Level
demand is worth capturing — but the existing N-Level material stays.

## Files

- Modify: `apps/website/src/lib/seo/clusters.mjs`
- Modify: `apps/website/src/lib/seo/links.mjs`
- Modify: `apps/website/src/lib/seo/links.test.mjs`
- Modify: `apps/website/src/data/examCalendar2026.mjs`
- Modify: `apps/website/src/app/combined-science-overview/page.jsx`
- Modify: `apps/website/src/app/combined-chemistry-physics/page.jsx`
- Modify: `apps/website/src/app/combined-chemistry-biology/page.jsx`
- Modify: `apps/website/src/app/combined-physics-biology/page.jsx`

---

## Part 1 — Registry: let a spoke belong to more than one hub

`hub` remains the single **primary** hub. It stays the source of the breadcrumb
trail and of the RelatedGuides "up" link, because a page must have exactly one
canonical parent. Add a new **optional** `alsoIn: string[]` naming additional hubs
that should also surface the page.

Reciprocity becomes: a spoke must appear in the `spokes` array of its primary hub
**and** in the `spokes` array of every hub named in its `alsoIn`.

### Step 1: Extend the reciprocity test first (TDD)

In `links.test.mjs`, amend the existing reciprocity tests so they cover `alsoIn`,
and add one new test. The existing three integrity tests must keep passing
unchanged in intent.

Add this test to the `cluster registry integrity` describe block:

```js
test('link reciprocity: every alsoIn hub lists the spoke too', () => {
  for (const spoke of Object.values(SPOKES)) {
    for (const hubSlug of spoke.alsoIn ?? []) {
      assert.ok(HUBS[hubSlug], `${spoke.slug} names missing alsoIn hub ${hubSlug}`);
      assert.ok(
        HUBS[hubSlug].spokes.includes(spoke.slug),
        `alsoIn hub ${hubSlug} does not list spoke ${spoke.slug}`,
      );
    }
  }
});

test('a spoke never lists its primary hub in alsoIn', () => {
  for (const spoke of Object.values(SPOKES)) {
    assert.ok(
      !(spoke.alsoIn ?? []).includes(spoke.hub),
      `${spoke.slug} repeats its primary hub in alsoIn`,
    );
  }
});
```

The existing test `'link reciprocity: every slug a hub lists is a real spoke pointing back'`
currently asserts `SPOKES[slug].hub === hub.slug` for every slug a hub lists. That
assertion is now too strict — a hub may legitimately list a spoke whose *primary*
hub is a different one. Change that assertion to accept either relationship:

```js
test('link reciprocity: every slug a hub lists is a real spoke pointing back', () => {
  for (const hub of Object.values(HUBS)) {
    for (const slug of hub.spokes) {
      assert.ok(SPOKES[slug], `hub ${hub.slug} lists unknown spoke ${slug}`);
      const spoke = SPOKES[slug];
      const linked = spoke.hub === hub.slug || (spoke.alsoIn ?? []).includes(hub.slug);
      assert.ok(linked, `${slug} does not point back to ${hub.slug}`);
    }
  }
});
```

Run `cd apps/website && npm test`. The two new tests must FAIL at this point
(nothing declares `alsoIn` yet, so they pass vacuously — if they pass, that is
expected; the real check is Step 2's data change). Record the actual output.

### Step 2: Declare the dual membership

In `clusters.mjs`, add `alsoIn: ['n-level-prep']` to these four spoke entries,
leaving their existing `hub: 'o-level-prep'` untouched:

`combined-science-overview`, `combined-chemistry-physics`,
`combined-chemistry-biology`, `combined-physics-biology`

Then add those same four slugs to the `n-level-prep` hub's `spokes` array, after
the existing `n-level-tuition` entry.

Also update the four spokes' `blurb` values so they no longer imply a single level.
Use exactly these:

- `combined-science-overview`: `How the three Combined Science pairings work at both O-Level and N-Level.`
- `combined-chemistry-physics`: `Syllabus 5086 (O-Level) and 5105 (N-Level) topics and paper structure.`
- `combined-chemistry-biology`: `Syllabus 5088 (O-Level) and 5107 (N-Level) topics and paper structure.`
- `combined-physics-biology`: `Syllabus 5087 (O-Level) and 5106 (N-Level) topics and paper structure.`

Run the tests. All must pass, including the two new ones now doing real work.

### Step 3: Add a helper for hub membership

In `links.mjs`, add:

```js
/** Every hub that surfaces this page: its primary hub first, then any alsoIn hubs. */
export function getHubsFor(slug) {
  const page = getPage(slug);
  if (!page) return [];
  if (HUBS[slug]) return [HUBS[slug]];
  return [HUBS[page.hub], ...(page.alsoIn ?? []).map((s) => HUBS[s])].filter(Boolean);
}
```

Do **not** change `getHubFor`, `getBreadcrumbs`, or `getSiblings` — breadcrumbs and
the RelatedGuides "up" link must keep using the single primary hub.

Add a test:

```js
test('getHubsFor returns primary hub plus alsoIn hubs', () => {
  const hubs = getHubsFor('combined-science-overview').map((h) => h.slug);
  assert.deepEqual(hubs, ['o-level-prep', 'n-level-prep']);
});

test('getHubsFor returns a single hub for a normal spoke', () => {
  assert.deepEqual(getHubsFor('o-level-physics').map((h) => h.slug), ['o-level-prep']);
});

test('getHubsFor returns [] for an unknown slug', () => {
  assert.deepEqual(getHubsFor('not-a-page'), []);
});
```

Remember to add `getHubsFor` to the import list at the top of the test file.

---

## Part 2 — Calendar: add N-Level Combined Science

`EXAM_CALENDAR_2026['n-level'].subjects` is currently `[]`. Add exactly these three
subjects to it (a later task adds the remaining N-Level subjects; do not invent any
others).

Dates are transcribed from the SEAB 2026 N-Level calendar. N-Level Combined Science
papers are numbered by component: **P1/P2 Physics, P3/P4 Chemistry, P5/P6 Biology.**

```js
{
  slug: 'combined-science-phy-chem',
  name: 'Combined Science (Physics/Chemistry)',
  code: '5105',
  papers: [
    { label: 'Papers 1 & 2 (Physics)', date: '2026-10-06', time: '0800–0915h' },
    { label: 'Papers 3 & 4 (Chemistry)', date: '2026-10-08', time: '0800–0915h' },
  ],
},
{
  slug: 'combined-science-phy-bio',
  name: 'Combined Science (Physics/Biology)',
  code: '5106',
  papers: [
    { label: 'Papers 1 & 2 (Physics)', date: '2026-10-06', time: '0800–0915h' },
    { label: 'Papers 5 & 6 (Biology)', date: '2026-10-12', time: '0800–0915h' },
  ],
},
{
  slug: 'combined-science-chem-bio',
  name: 'Combined Science (Chemistry/Biology)',
  code: '5107',
  papers: [
    { label: 'Papers 3 & 4 (Chemistry)', date: '2026-10-08', time: '0800–0915h' },
    { label: 'Papers 5 & 6 (Biology)', date: '2026-10-12', time: '0800–0915h' },
  ],
},
```

Note the subject slugs deliberately match the O-Level ones — they are namespaced by
exam, so `getSubjectPapers('n-level', 'combined-science-phy-chem')` and
`getSubjectPapers('o-level', 'combined-science-phy-chem')` return different papers.
Verify both return non-empty and different arrays before moving on.

The existing calendar tests will now validate these dates automatically. Run the
suite.

---

## Part 3 — The four pages: cover both levels

Read each page fully before editing. These pages already use the `components/guide`
design system and import `@/data/promises` — preserve all existing imports and
structure. You are **adding** an O-Level dimension, not deleting the N-Level content.

For each of the four pages:

### 3a. Metadata naming both levels

Rewrite `title` and `description` so both levels are explicit. Titles **under 60
characters**, descriptions **150–160 characters inclusive**. Verify every string
programmatically by reading it back out of the file and printing its length — do
not eyeball this. Two earlier tasks shipped over-length strings.

Suggested title shapes (adjust to fit the limit, keep the level pair):
- `/combined-science-overview` → `Combined Science Guide 2026: O-Level & N-Level`
- `/combined-chemistry-physics` → `Combined Physics/Chemistry 2026: O & N-Level Guide`
- `/combined-chemistry-biology` → `Combined Chemistry/Biology 2026: O & N-Level Guide`
- `/combined-physics-biology` → `Combined Physics/Biology 2026: O & N-Level Guide`

### 3b. An O-Level section alongside the existing N-Level content

Add a clearly headed section covering the O-Level version of that subject pairing:
its syllabus code (5086/5087/5088 as appropriate), how its paper structure differs
from the N-Level one, and who sits it. Follow the answer-block convention: a
question-shaped H2, then a **self-contained 40–60 word** direct answer as the first
paragraph, then detail. Count the words.

Where the existing copy says or implies "this is the N-Level syllabus" without
qualification, adjust the wording so a reader is not misled into thinking the page
covers only one level. Do not delete N-Level material.

### 3c. Both timetables

Render two `ExamTimetable` calls per page, each clearly labelled by level:

```jsx
<ExamTimetable
  examSlug="o-level"
  subjectSlugs={['combined-science-phy-chem']}
  caption="Official 2026 SEAB dates — O-Level Combined Science (Physics/Chemistry), syllabus 5086."
/>
<ExamTimetable
  examSlug="n-level"
  subjectSlugs={['combined-science-phy-chem']}
  caption="Official 2026 SEAB dates — N-Level Combined Science (Physics/Chemistry), syllabus 5105."
/>
```

Use the subject slug matching each page's pairing. `/combined-science-overview`
shows all three pairings for both levels (omit `subjectSlugs` is NOT correct there,
because the O-Level exam has many non-Combined subjects — pass the three
combined-science slugs explicitly).

### 3d. Fix the schema `educationalLevel`

Task 7 set `course.educationalLevel` on these pages to `'GCE O-Level'`. Since they
now cover both, set it to `'GCE O-Level and N-Level'`. Keep everything else in the
`course` prop.

---

## Verification

Do all of it and put the real output in your report.

1. `cd apps/website && npm test` — all tests pass, and the count is higher than 26
   (you added tests). State the exact number.
2. Confirm `getSubjectPapers('o-level','combined-science-phy-chem')` and
   `getSubjectPapers('n-level','combined-science-phy-chem')` return different,
   non-empty arrays. Print both.
3. `cd apps/website && npm run build` — success.
4. Start the server and curl each of the four pages. For each, report:
   - the number of real `<script type="application/ld+json"` tags,
   - whether it links to `/blog/o-level-preparation-guide`,
   - whether it links to `/blog/n-level-preparation-guide`,
   - whether both an O-Level code (5086/5087/5088) and an N-Level code
     (5105/5106/5107) appear in the rendered text.
   Every page must satisfy all four. Report any that do not, plainly.
5. Print a table of every title and description you wrote with its measured length.
6. Kill the server.

Commit on branch `seo-cluster-phase-1`. No `Co-Authored-By: Claude` trailer.
