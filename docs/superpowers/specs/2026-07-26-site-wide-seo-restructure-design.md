# Site-Wide SEO Restructure — Design

**Date:** 2026-07-26
**Status:** Approved for planning
**Baseline data:** Google Search Console export, last 3 months (2026-04-24 → 2026-07-23)

## Goal

Move the pages that already rank in positions 10–21 into the top 10, and fix the
sitewide CTR failure that is costing clicks on rankings we already hold. Build a
hub-and-spoke internal link graph so authority compounds across the exam clusters
instead of dead-ending on individual subject pages.

## Non-goals

Ranking for head commercial terms (`math tuition singapore`, position 77;
`o level tuition`, position 71) is explicitly **out of scope**. Those positions
reflect a domain-authority gap, not an on-page gap, and no amount of metadata or
content work moves page 8 to page 1. Phase 3 touches those pages to capture
long-tail variants and wire them into the link graph, not to contest head terms.

## Baseline: what the data says

Site totals over the window: **617 clicks / 85,562 impressions / average position 45**
(CTR 0.72%). Of the 102 clicks GSC exposes at query level, **85 are branded**
(`lioncity tutors`, `lion city tutors`, `lion tutoring`, `city tutors`). Non-brand
organic discovery is effectively nil.

Three distinct problems, in order of fixability:

### 1. Internal linking is broken (highest leverage, lowest cost)

21 of 28 subject pages contain **zero internal links**. They neither link to each
other nor back to the four exam prep guides, so they receive link equity from
navigation only and pass none onward. No subject page links to any prep guide.

| Page | Impressions | Position | Internal links |
| --- | --- | --- | --- |
| `/o-level-chemistry` | 4,205 | 14.5 | 0 |
| `/a-level-chemistry` | 2,919 | 18.1 | 0 |
| `/a-level-general-paper` | 2,881 | 20.9 | 0 |
| `/a-level-biology` | 2,348 | 9.9 | 0 |
| `/o-level-physics` | 2,032 | 19.7 | 0 |
| `/o-level-math` | 2,015 | 35.0 | 0 |

### 2. CTR fails even where rankings are adequate

Every striking-distance query has **zero clicks**, including queries ranking on
page one:

| Query | Position | Impressions | Clicks |
| --- | --- | --- | --- |
| `gce n level meaning` | 10.8 | 144 | 0 |
| `n level meaning` | 10.6 | 101 | 0 |
| `psle chinese marks breakdown` | 10.5 | 54 | 0 |
| `common physics mistakes o level` | 14.6 | 145 | 0 |
| `tips for scoring a1 in o level math` | 15.4 | 52 | 0 |
| `o level preparation tips` | 17.0 | 217 | 0 |
| `how to improve grades before o levels` | 17.3 | 201 | 0 |
| `o level tutorial` | 18.0 | 221 | 0 |
| `o level tips` | 19.0 | 226 | 0 |
| `how to prepare for o level` | 19.4 | 211 | 0 |
| `a level gp paper 1` | 19.7 | 91 | 0 |
| `how to study for a levels singapore` | 20.6 | 379 | 0 |

A page-one ranking earning zero clicks is a title and snippet problem, and it pays
out within roughly two weeks of a fix — faster than any rank movement.

### 3. Structured data is largely absent

Only 6 pages emit any JSON-LD. The four exam prep guides — the intended cluster
hubs — emit none: no `Article`, no `FAQPage`, no `BreadcrumbList`.

## Architecture

### Cluster registry

`src/lib/seo/clusters.js` is the single source of truth for the site's link graph.
Every page in a cluster declares its identity, its hub, and the anchor text other
pages use when linking to it.

```js
'o-level-physics': {
  url: '/o-level-physics',
  hub: 'o-level-prep',
  title: 'O-Level Physics',
  anchor: 'O-Level Physics topic guide',   // how siblings link here
  blurb: 'Kinematics, electricity and practical skills, paper by paper.',
  targetQueries: ['common physics mistakes o level', 'physics o level'],
}
```

Hubs declare their spokes in display order. Related-link blocks, breadcrumbs,
JSON-LD and the sitemap all derive from this file. Adding a page later is one
registry entry rather than edits across 28 files.

Anchor text lives in the registry rather than at call sites because anchor text
carries most of the ranking signal in an internal link, and it must stay consistent
across every page that links to a given target.

### Components

**`<RelatedGuides slug="..." />`** — renders, from the registry: a link up to the
cluster hub, links across to sibling spokes, and a link to the relevant conversion
page. Built on the existing `src/components/guide` primitives so it inherits the
established design system rather than introducing a competing style.

**`<GuideSchema />`** — emits JSON-LD per page:

| Schema type | Applied to |
| --- | --- |
| `BreadcrumbList` | every page in a cluster |
| `Article` | the four exam prep guides |
| `FAQPage` | any page carrying an FAQ block |
| `EducationalOccupationalProgram` | subject pages |

### Cluster map

| Hub | Spokes |
| --- | --- |
| `/blog/o-level-preparation-guide` | o-level-math, o-level-english, o-level-physics, o-level-chemistry, o-level-biology, combined-science-overview, combined-chemistry-physics, combined-chemistry-biology, combined-physics-biology, secondary-school-tuition/o-level-tuition |
| `/blog/a-level-preparation-guide` | a-level-math, a-level-physics, a-level-chemistry, a-level-biology, a-level-general-paper, jc-tuition |
| `/blog/n-level-preparation-guide` | secondary-school-tuition/n-level-tuition, plus shared O-Level subject spokes |
| `/blog/psle-preparation-guide` | psle-math, psle-english, psle-science, psle-chinese, primary-school-tuition |
| **New: `/guides/ib-igcse`** | ibdp-biology, ibdp-chemistry, ibdp-physics, igcse-biology, igcse-chemistry, igcse-physics |

The IB/IGCSE hub does not exist today. Those six pages are orphaned, and two already
rank without help (`/ibdp-physics` position 11.0, `/igcse-chemistry` position 12.8).

Prep guide URLs stay at `/blog/*`. Moving them to `/guides/*` would be a marginally
better signal but risks ranking loss on a page carrying 6,270 impressions; not worth it.

## Content conventions

### Answer-block convention (for AI citation and featured snippets)

Every FAQ entry and every new section follows a fixed shape:

1. A **question-shaped H2 or H3** matching real query phrasing.
2. A **self-contained 40–60 word direct answer** as the first paragraph — no
   preamble, no hedging, readable in isolation.
3. Supporting detail below.

Answers must contain specific verifiable facts: real exam dates, real subject
codes, real L1R5 figures, real grade boundaries. Hedged marketing prose is never
extracted into AI answers or snippets; specific factual sentences are.

### Metadata formulas

Titles: `{Primary keyword} {Year}: {Specific benefit} | LionCity Tutors`,
front-loaded, under 60 characters.

Meta descriptions: lead with the concrete deliverable, 150–160 characters, no
marketing filler.

Applied to all 56 pages, prioritised by impression volume.

## Verified source data

All dates below were extracted from SEAB's official 2026 examination calendar PDFs
and the SEAB/MOE key-dates pages, retrieved 2026-07-26. Calendars are marked
"Updated as at 13 February 2026".

Sources:
- `https://www.seab.gov.sg/important-dates-for-candidates/`
- `https://www.moe.gov.sg/national-exams-dates`
- `https://file.go.gov.sg/2026-o-level-exam-cal.pdf`
- `https://file.go.gov.sg/2026-a-level-exam-cal.pdf`
- `https://file.go.gov.sg/2026-n-level-exam-cal.pdf`
- `https://file.go.gov.sg/2026-psle-exam-cal.pdf`

### Overall 2026 windows

| Exam | Examination period | Results released |
| --- | --- | --- |
| PSLE | 12 Aug – 30 Sep 2026 | 24 – 25 Nov 2026 |
| GCE N-Level | 13 Jul – 13 Oct 2026 | 17 – 21 Dec 2026 |
| GCE O-Level | 2 Jun – 10 Nov 2026 | 13 – 15 Jan 2027 |
| GCE A-Level | 2 Jun – 27 Nov 2026 | 19 – 23 Feb 2027 |

Mid-year MTL/MTLB results: 20 – 24 Aug 2026. Private candidate registration for all
GCE levels ran 7 – 20 Apr 2026.

### PSLE 2026

- Oral: Wed 12 Aug and Thu 13 Aug 2026, 0800–1330h
- Listening Comprehension: Tue 15 Sep 2026
- English P1 0815–0925h, P2 1030–1220h: Thu 24 Sep 2026
- Mathematics P1 0815–0925h, P2 1030–1150h: Fri 25 Sep 2026
- Mother Tongue P1 0815–0905h, P2 1015–1155h: Mon 28 Sep 2026
- Science P1 0815–1000h: Tue 29 Sep 2026
- Higher Mother Tongue P1 0815–0905h, P2 1015–1135h: Wed 30 Sep 2026
- Marking exercise: 12 – 14 Oct 2026

### O-Level 2026 (core subjects)

| Subject | Code | Papers |
| --- | --- | --- |
| English Language | 1184 | Oral 13/14/17 Jul; LC 15 Oct 1400–1445h; P1 19 Oct 1330–1520h; P2 19 Oct 1605–1755h |
| Mathematics (E-Math) | 4052 | P1 21 Oct 1400–1615h; P2 23 Oct 1430–1645h |
| Additional Mathematics | 4049 | P1 26 Oct 1400–1615h; P2 28 Oct 0800–1015h |
| Chemistry | 6092 | P2 27 Oct 1400–1545h; P1 6 Nov 0800–0900h |
| Physics | 6091 | P2 29 Oct 1400–1545h; P1 6 Nov 1430–1530h |
| Biology | 6093 | P2 30 Oct 0800–0945h; P1 10 Nov 1400–1500h |
| Combined Science (Phy/Chem) | 5086 | P3 27 Oct; P2 29 Oct; P1 10 Nov 0800–0900h |
| Combined Science (Phy/Bio) | 5087 | P2 29 Oct; P4 30 Oct; P1 10 Nov 0800–0900h |
| Combined Science (Chem/Bio) | 5088 | P3 27 Oct; P4 30 Oct; P1 10 Nov 0800–0900h |

Mother Tongue written papers: 2 Jun 2026. Mother Tongue LC: 7 Jul 2026.

### A-Level 2026 (core subjects)

| Subject | Code | Papers |
| --- | --- | --- |
| General Paper | 8881 | P1 2 Nov 0800–0930h; P2 4 Nov 0800–0930h |
| H2 Mathematics | 9758 | P1 3 Nov 0800–1100h; P2 6 Nov 0800–1100h |
| H1 Mathematics | 8865 | P1 3 Nov 0800–1100h |
| H2 Chemistry | 9729 / 9476 | Practical 14 Oct (3 shifts); P2 10 Nov 1400–1600h; P3 12 Nov 0800–1000h |
| H2 Physics | 9749 / 9478 | Practical 19 Oct (3 shifts); P2 13 Nov 0800–1000h; P3 17 Nov 1400–1600h |
| H2 Biology | 9744 / 9477 | Practical 22 Oct (3 shifts); P2 18 Nov 0800–1000h |
| H2 Economics | 9570 | P1 5 Nov 1400–1630h; P2 16 Nov 0800–1030h |
| H1 Economics | 8843 | P1 5 Nov 1400–1700h |
| H2 Further Mathematics | 9649 | P1 16 Nov 1400–1700h |

## Phasing

**Phase 1 — Guide cluster.** Registry, both components, reciprocal links, schema and
metadata across 4 hubs plus ~24 spokes. Bespoke content: 2026 exam timetable
sections, subject-count guidance, Sec 3 → Sec 4 timeline, and FAQ blocks targeting
the striking-distance queries each page already ranks for. Builds the missing
IB/IGCSE hub.

**Phase 2 — Resources and conversion.** `/free-test-papers` is the site's top click
driver (134 clicks) and `o level prelim papers` sits at position 7.9 — the closest
available top-3 win.

**Phase 3 — Commercial pages.** Metadata, schema, and links into the cluster graph.
Long-tail capture only.

## Verification

- A test asserting link-graph reciprocity: every spoke links its hub, every hub
  lists its spokes, every registry entry resolves to a real route.
- A test asserting every cluster page emits valid `BreadcrumbList` JSON-LD, and
  that pages declaring FAQs emit matching `FAQPage` entries.
- Rendered-HTML verification via `next start` and `curl`, not source grep, since
  titles and JSON-LD are composed at runtime.
- Post-deploy: re-export GSC after ~4 weeks and compare position and CTR for the
  twelve striking-distance queries listed above.

## Items to confirm

1. **A-Level revised syllabus codes.** The 2026 calendar lists both legacy and
   revised science codes (Chemistry 9729 and 9476, Physics 9749 and 9478, Biology
   9744 and 9477). Which cohort sits which paper should be confirmed before the
   content states it — this is a genuine content opportunity if competitors have
   not covered the transition, but it must be correct.
2. **O-Level science practical dates.** Not yet extracted; needed for the subject
   page timetables. Will pull from the same PDF during implementation.
3. **Grade boundaries and L1R5 figures.** SEAB does not publish grade boundaries.
   Any figures used must be described as typical or indicative, never as official.
4. **Post-secondary entry scores.** The existing O-Level guide cites cut-off point
   ranges; these should be re-checked against current MOE JAE data before reuse.
