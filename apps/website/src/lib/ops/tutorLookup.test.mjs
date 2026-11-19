import { test } from "node:test";
import assert from "node:assert/strict";
import { lookupQuery, lookupCard } from "./tutorLookup.mjs";

const matches = (query, value) => new RegExp(query.$regex, query.$options).test(value);

test("a name matches any word, ignoring case", () => {
  const q = lookupQuery("anusha");
  assert.ok(matches(q.fullName, "Anusha Balasingham"));
  assert.ok(matches(q.fullName, "Priya ANUSHA"));
  assert.ok(!matches(q.fullName, "Ann"));
});

test("a name matches from the start of a word", () => {
  const q = lookupQuery("tan");
  assert.ok(matches(q.fullName, "Ashley Tan Yixin"));
  assert.ok(matches(q.fullName, "Tanya Lim"));
  assert.ok(!matches(q.fullName, "Ariel Shtanger"));
});

test("regex characters in a name are taken literally", () => {
  const q = lookupQuery("a.b");
  assert.ok(matches(q.fullName, "a.b"));
  assert.ok(!matches(q.fullName, "axb"));
});

test("a phone number matches however it was stored", () => {
  for (const typed of ["91234567", "9123 4567", "+65 9123 4567", "6591234567"]) {
    const q = lookupQuery(typed);
    for (const stored of ["91234567", "+65 9123 4567", "9123-4567", "6591234567"]) {
      assert.ok(matches(q.contactNumber, stored), `${typed} vs ${stored}`);
    }
  }
});

test("part of a number matches", () => {
  assert.ok(matches(lookupQuery("4567").contactNumber, "+65 9123 4567"));
});

test("too short to search returns null", () => {
  assert.equal(lookupQuery(""), null);
  assert.equal(lookupQuery(" a "), null);
  assert.equal(lookupQuery("12"), null);
});

test("lookupCard lists rates, levels and regions taught", () => {
  const card = lookupCard({
    _id: "abc",
    fullName: "Jane",
    contactNumber: "91234567",
    hourlyRate: { primary: "40", secondary: "", jc: "$70/h" },
    teachingLevels: { primary: { mathematics: true }, secondary: { science: false }, jc: { physics: true } },
    locations: { north: true, east: false, online: true },
    responseStats: { contacted: 4, responded: 3 },
    stats: { placed: 2 },
    pausedAt: new Date(),
  });
  assert.equal(card.id, "abc");
  assert.deepEqual(card.rates, [{ label: "Primary", rate: "40" }, { label: "JC", rate: "$70/h" }]);
  assert.deepEqual(card.levels, ["Primary", "JC"]);
  assert.deepEqual(card.regions, ["north", "online"]);
  assert.deepEqual(card.replies, { contacted: 4, responded: 3 });
  assert.equal(card.placed, 2);
  assert.equal(card.paused, true);
});
