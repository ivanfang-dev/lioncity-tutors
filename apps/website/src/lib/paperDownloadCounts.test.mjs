import { test } from "node:test";
import assert from "node:assert/strict";
import { testPapers } from "../data/testPapers.mjs";
import { LEGACY_SUBJECT_ALIASES, foldCounts } from "./paperDownloadCounts.mjs";

const subjectNames = Object.values(testPapers).flatMap((level) => Object.keys(level));

test("every alias points at a subject the library actually has", () => {
  for (const [legacy, current] of Object.entries(LEGACY_SUBJECT_ALIASES)) {
    assert.ok(subjectNames.includes(current), `"${legacy}" maps to unknown subject "${current}"`);
  }
});

test("the three naming eras of a shelf fold into one subject", () => {
  const { perSubject } = foldCounts({
    subjects: [
      { _id: "P6 Math", n: 79 },
      { _id: "Primary 6 Math", n: 4 },
      { _id: "math", n: 7 },
    ],
  });
  assert.equal(perSubject["Primary 6 Math"], 90);
});

test("subject labels that name no shelf are dropped", () => {
  const { perSubject } = foldCounts({
    subjects: [
      { _id: "prelim", n: 39 },
      { _id: "General Paper", n: 37 },
    ],
  });
  assert.equal(perSubject.prelim, undefined);
  assert.equal(perSubject["General Paper"], 37);
});

test("case distinguishes the primary and secondary English shelves", () => {
  const { perSubject } = foldCounts({
    subjects: [
      { _id: "English", n: 14 },
      { _id: "english", n: 4 },
    ],
  });
  assert.equal(perSubject["Secondary 4 English"], 14);
  assert.equal(perSubject["Primary 6 English"], 4);
});

test("per-paper counts carry through, and totals are reported", () => {
  const { perPaper, total, families } = foldCounts({
    subjects: [{ _id: "General Paper", n: 3 }],
    papers: [{ _id: "papers/jc/gp-2025.pdf", n: 3 }],
    totals: [{ n: 800 }],
    families: [{ n: 229 }],
  });
  assert.equal(perPaper["papers/jc/gp-2025.pdf"], 3);
  assert.equal(total, 800);
  assert.equal(families, 229);
});

test("an empty result set does not throw", () => {
  const counts = foldCounts({});
  assert.deepEqual(counts, { perSubject: {}, perPaper: {}, total: 0, families: 0 });
});
