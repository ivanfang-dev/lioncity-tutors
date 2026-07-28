# SEO Cluster Phase 1 — Execution Status

**Branch:** `seo-cluster-phase-1` (branched from `main` at `cbad024`)
**Last updated:** 2026-07-27
**Plan:** [2026-07-27-seo-cluster-phase-1.md](./2026-07-27-seo-cluster-phase-1.md)
**Spec:** [../specs/2026-07-26-site-wide-seo-restructure-design.md](../specs/2026-07-26-site-wide-seo-restructure-design.md)

> This file exists because the execution workspace (`.superpowers/sdd/`) is
> git-ignored. The ledger, task briefs and implementer reports do **not** travel
> with the repo. This file is the portable record of where execution got to.

## Task status

| Task | State | Commits |
| --- | --- | --- |
| 1 · Exam calendar data module | ✅ complete, reviewed clean | `a13220d` |
| 2 · Cluster registry + link helpers | ✅ complete, reviewed clean | `97272ae` |
| 3 · RelatedGuides component | ✅ complete, reviewed clean | `0254238` |
| 4 · GuideSchema component | ✅ complete, clean after 1 fix round | `e0b2f56`, `70d872c` |
| 5 · ExamTimetable component | ✅ complete, reviewed clean | `a9732b0` |
| 6 · O-Level hub rebuild | ✅ complete, clean after 1 fix round | `c28d967`, `03c5280` |
| 7 · O-Level spokes | ⚠️ implemented, **NOT reviewed** | `ddbd333`, partly reverted by `db94a42` |
| 7b · Dual-level Combined Science | ⏳ **next up** — brief written, never dispatched | — |
| 8 · A-Level cluster + syllabus transition | ⏳ pending | — |
| 9 · PSLE cluster | ⏳ pending | — |
| 10 · N-Level cluster | ⏳ pending | — |
| 11 · IB/IGCSE hub | ⏳ pending | — |
| 12 · Full-cluster verification | ⏳ pending | — |

## Resume here

**Next action: run Task 7b**, then review Task 7 and 7b together as one package
(their diffs interleave across the same files, so a single review is cheaper and
more coherent than two).

The full Task 7b brief is committed at
[../briefs/2026-07-27-task-7b-dual-level-combined-science.md](../briefs/2026-07-27-task-7b-dual-level-combined-science.md).

Review base for the combined Task 7 + 7b package is `03c5280`.

## Task 7: what landed and what was pulled back

Task 7 wired ten O-Level spoke pages that previously had **zero internal links**:
schema, `RelatedGuides`, subject timetables, rewritten metadata, plus three-entry
FAQ modules on `/o-level-chemistry`, `/o-level-physics` and `/o-level-math`.

Six of those pages are done and rendering correctly. **Four were reverted** by
`db94a42`: `combined-science-overview`, `combined-chemistry-physics`,
`combined-chemistry-biology`, `combined-physics-biology`.

Reason: those pages are **N-Level** content (syllabus 5105–5107, heavy N(A)
references — `/combined-physics-biology` alone has 23), but the registry placed
them under the O-Level hub, so Task 7 wrote O-Level titles and `Course` schema onto
N-Level body copy. Each page then contradicted itself, which is worse for search
than leaving them alone.

The registry still lists them as `o-level-prep` spokes, so hub links and the
reciprocity tests are unaffected — only their on-page metadata and wiring is
deferred to Task 7b.

**Task 7 was never reviewed.** Its reviewer was never dispatched, because the
Combined Science problem surfaced first. Review it alongside 7b.

## Corrections made to the plan during execution

The plan file has been amended in place; these are recorded so nobody re-litigates
them.

1. **`node --test src/` does not work on Node 22.20** — it treats the path as a
   module and fails with `Cannot find module`. The working form is
   `node --test 'src/**/*.test.mjs'`. Verified directly. (`cbae052`)
2. **Subject-page schema type changed from `EducationalOccupationalProgram` to
   `Course`** — `educationalLevel` is only valid on `CreativeWork` and its
   subtypes. `EducationalOccupationalProgram` descends from `Intangible`, so the
   exam-level signal would have been silently dropped on every subject page.
   `Course` is a `CreativeWork` subtype and has Google rich-result support.
   Verified against schema.org. (`d969b2e`)
3. **O-Level meta description trimmed 162 → 158 chars** to fit the 150–160 band.
   (`ff43813`)
4. **Task 7b added** to the plan for dual-level Combined Science. (`752449e`)

## Deferred minor findings

Carry these into the final whole-branch review; none block progress.

- `RelatedGuides` renders an empty `<ul>` when a hub has no siblings. Live today for
  `n-level-prep`, which has a single spoke.
- The hub-box description in `RelatedGuides` is one static string reused for all
  hubs; it reads oddly for the `ib-igcse` hub. Address in Task 11.
- `Article` schema has no `image` field. Repo precedent (`biology-tuition/page.jsx`)
  includes one; Google's Article rich results expect one.
- Pre-existing: several pages cite outdated syllabus codes in body copy (e.g.
  `/o-level-math` says E-Math is 4016; the calendar and SEAB say 4052). Not
  introduced by this work, but worth a content pass.

## Open factual items

- The revised A-Level science mark changes (practical 55 → 50; Chemistry Paper 3
  80 → 75) still come from a **secondary source**. Task 8 Step 1 downloads the SEAB
  syllabus PDFs to confirm them, and omits any figure that does not check out.
- **Closed during execution:** the L1R5 → L1R4 change from the 2028 cohort was
  verified against `moe.gov.sg` during Task 6 and is no longer an open item.

## How to verify the branch on a fresh machine

```bash
npm install
cd apps/website
npm test          # expect 26 passing
npm run build     # expect success
```

Rendered-HTML checks matter more than source greps here — titles and JSON-LD are
composed at runtime:

```bash
cd apps/website && npm start &
curl -s localhost:3000/blog/o-level-preparation-guide > /tmp/o.html
grep -o '<title>[^<]*</title>' /tmp/o.html
grep -o '<script type="application/ld+json"' /tmp/o.html | wc -l   # expect 3
```
