import { test } from "node:test";
import assert from "node:assert/strict";
import {
  MANUAL_CONTACT_TTL_MS, searchLabel, activeManualContacts, withMessaged, withReply, messagedAgo,
} from "./manualContacts.mjs";

const DAY = 24 * 60 * 60 * 1000;
const now = new Date("2026-11-18T10:00:00Z");
const daysAgo = n => new Date(now.getTime() - n * DAY);

test("searchLabel names the level, subjects and place", () => {
  assert.equal(
    searchLabel({ level: "Primary 2", subject: ["Mathematics", "Science"], location: "Canberra" }),
    "Primary 2 Mathematics & Science, Canberra"
  );
});

test("entries expire after 14 days", () => {
  assert.equal(MANUAL_CONTACT_TTL_MS, 14 * DAY);
  const list = [
    { _id: "old", at: daysAgo(15), label: "a" },
    { _id: "new", at: daysAgo(1), label: "b" },
    { _id: "newest", at: daysAgo(0), label: "c" },
  ];
  assert.deepEqual(activeManualContacts(list, now).map(e => e._id), ["newest", "new"]);
});

test("activeManualContacts handles a tutor with no log", () => {
  assert.deepEqual(activeManualContacts(undefined, now), []);
});

test("withMessaged adds an entry and drops expired ones", () => {
  const list = withMessaged([{ at: daysAgo(20), label: "old" }], "P2 Maths, Canberra", now);
  assert.equal(list.length, 1);
  assert.equal(list[0].label, "P2 Maths, Canberra");
  assert.equal(list[0].at.getTime(), now.getTime());
});

test("withMessaged on the same search refreshes the entry and keeps its reply", () => {
  const list = withMessaged(
    [{ _id: "x", at: daysAgo(3), label: "P2 Maths, Canberra", reply: "yes", repliedAt: daysAgo(2) }],
    "P2 Maths, Canberra",
    now
  );
  assert.equal(list.length, 1);
  assert.equal(list[0].at.getTime(), now.getTime());
  assert.equal(list[0].reply, "yes");
});

test("withReply sets the reply on one entry", () => {
  const list = withReply(
    [{ _id: "a", at: daysAgo(1), label: "a" }, { _id: "b", at: daysAgo(1), label: "b" }],
    "b",
    "no",
    now
  );
  assert.equal(list[0].reply, undefined);
  assert.equal(list[1].reply, "no");
  assert.equal(list[1].repliedAt.getTime(), now.getTime());
});

test("messagedAgo reads as today or days ago", () => {
  assert.equal(messagedAgo(daysAgo(0.2), now), "today");
  assert.equal(messagedAgo(daysAgo(1.5), now), "1d ago");
  assert.equal(messagedAgo(daysAgo(6), now), "6d ago");
});
