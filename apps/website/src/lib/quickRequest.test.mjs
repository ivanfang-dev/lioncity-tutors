import { test } from "node:test";
import assert from "node:assert/strict";
import {
  quickRequestPayload,
  shouldOfferTutor,
  dismissTutorOffer,
  markTutorRequested,
} from "./quickRequest.mjs";

const memoryStorage = () => {
  const data = new Map();
  return {
    getItem: (k) => (data.has(k) ? data.get(k) : null),
    setItem: (k, v) => data.set(k, String(v)),
  };
};
const stores = () => ({ session: memoryStorage(), local: memoryStorage() });

test("builds a request the backend accepts from a download lead", () => {
  const payload = quickRequestPayload({
    phone: "+65 9123 4567",
    email: "mum@example.com",
    level: "Secondary School",
    subject: "A Math",
    paperTitle: "2025 Sec 4 A Math Prelim",
    source: "test papers",
  });
  assert.equal(payload.name, "Parent (test papers)");
  assert.equal(payload.mobile, "91234567");
  assert.equal(payload.level, "Secondary School A Math");
  assert.deepEqual(payload.levelSubjects, ["Secondary School A Math"]);
  assert.match(payload.preferences, /2025 Sec 4 A Math Prelim/);
  assert.match(payload.preferences, /mum@example\.com/);
});

test("returns null without a usable phone or subject", () => {
  assert.equal(quickRequestPayload({ phone: "123", level: "JC", subject: "GP", source: "free notes" }), null);
  assert.equal(quickRequestPayload({ phone: "91234567", level: "", subject: "", source: "free notes" }), null);
});

test("keeps an overseas number as typed digits", () => {
  const payload = quickRequestPayload({ phone: "+60 12 345 6789", level: "JC", subject: "GP", source: "free notes" });
  assert.equal(payload.mobile, "60123456789");
});

test("offers only to parents", () => {
  const s = stores();
  assert.equal(shouldOfferTutor({ role: "parent", level: "JC", subject: "GP" }, s), true);
  assert.equal(shouldOfferTutor({ role: "student", level: "JC", subject: "GP" }, s), false);
  assert.equal(shouldOfferTutor({ role: "", level: "JC", subject: "GP" }, s), false);
});

test("stays hidden after No thanks", () => {
  const s = stores();
  dismissTutorOffer(s);
  assert.equal(shouldOfferTutor({ role: "parent", level: "JC", subject: "GP" }, s), false);
});

test("is offered once per level and subject", () => {
  const s = stores();
  markTutorRequested({ level: "JC", subject: "GP" }, s);
  assert.equal(shouldOfferTutor({ role: "parent", level: "JC", subject: "GP" }, s), false);
  assert.equal(shouldOfferTutor({ role: "parent", level: "JC", subject: "H2 Maths" }, s), true);
});

test("still offers when storage is unavailable", () => {
  const broken = { getItem() { throw new Error("blocked"); }, setItem() { throw new Error("blocked"); } };
  const s = { session: broken, local: broken };
  dismissTutorOffer(s);
  assert.equal(shouldOfferTutor({ role: "parent", level: "JC", subject: "GP" }, s), true);
});

test("does not repeat the level when the subject already names it", () => {
  const payload = quickRequestPayload({ phone: "91234567", level: "Primary School", subject: "Primary 6 English", source: "test papers" });
  assert.equal(payload.level, "Primary 6 English");
});
