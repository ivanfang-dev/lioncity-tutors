import { test } from "node:test";
import assert from "node:assert/strict";
import { REQUIRED_POST_FIELDS, defaultTitle, missingPostFields } from "./postAssignment.mjs";

const filled = {
  title: "Primary 4 Mathematics @ Bishan", level: "Primary 4", subject: "Mathematics",
  location: "Bishan", rate: "$45/h", frequency: "1x a week, 1.5h",
};

test("defaultTitle names level, subject and place", () => {
  assert.equal(defaultTitle({ level: "Primary 4", subject: "Mathematics", location: "Bishan" }), "Primary 4 Mathematics @ Bishan");
});

test("defaultTitle reads naturally for online lessons", () => {
  assert.equal(defaultTitle({ level: "Primary 4", subject: "Mathematics", location: "Online" }), "Primary 4 Mathematics (Online)");
});

test("missingPostFields lists blank and whitespace-only fields in form order", () => {
  assert.deepEqual(missingPostFields({ ...filled, frequency: "  ", rate: "" }), ["rate", "frequency"]);
});

test("missingPostFields is empty when everything is filled", () => {
  assert.deepEqual(missingPostFields(filled), []);
});

test("required fields match the bot's", () => {
  assert.deepEqual(REQUIRED_POST_FIELDS, ["title", "level", "subject", "location", "rate", "frequency"]);
});
