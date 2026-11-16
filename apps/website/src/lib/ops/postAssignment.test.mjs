import { test } from "node:test";
import assert from "node:assert/strict";
import { REQUIRED_POST_FIELDS, defaultTitle, missingPostFields, assignmentMatchesSearch, subjectList } from "./postAssignment.mjs";

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

test("assignmentMatchesSearch: same level, subject and location", () => {
  const a = { level: "Primary 4", subject: "Mathematics", location: "Bishan" };
  assert.equal(assignmentMatchesSearch(a, { level: "Primary 4", subject: "Mathematics", location: "Bishan", rate: "$60" }), true);
});

test("assignmentMatchesSearch: a new search for a different request does not match", () => {
  const a = { level: "Primary 4", subject: "Mathematics", location: "Bishan" };
  assert.equal(assignmentMatchesSearch(a, { level: "Secondary 3", subject: "Chemistry", location: "Tampines" }), false);
  assert.equal(assignmentMatchesSearch(a, { level: "Primary 4", subject: "Mathematics", location: "Tampines" }), false);
});

test("assignmentMatchesSearch: any picked subject of a multi-subject assignment matches", () => {
  const a = { level: "Primary 4", subject: "Multiple Subjects", subjects: ["Mathematics", "Science"], location: "Bishan" };
  assert.equal(assignmentMatchesSearch(a, { level: "Primary 4", subject: "Science", location: "Bishan" }), true);
});

test("subjectList normalises one subject, a list, or nothing", () => {
  assert.deepEqual(subjectList("Science"), ["Science"]);
  assert.deepEqual(subjectList(["Science", " Science ", ""]), ["Science"]);
  assert.deepEqual(subjectList(undefined), []);
});

test("defaultTitle joins several subjects with &", () => {
  assert.equal(
    defaultTitle({ level: "Primary 4", subject: ["Mathematics", "Science"], location: "Bishan" }),
    "Primary 4 Mathematics & Science @ Bishan",
  );
});

test("assignmentMatchesSearch: a subject list matches when every searched subject is on the assignment", () => {
  const a = { level: "Primary 4", subject: "Multiple Subjects", subjects: ["Mathematics", "Science"], location: "Bishan" };
  const search = (subject) => ({ level: "Primary 4", subject, location: "Bishan" });
  assert.equal(assignmentMatchesSearch(a, search(["Science"])), true);
  assert.equal(assignmentMatchesSearch(a, search(["Mathematics", "Science"])), true);
  assert.equal(assignmentMatchesSearch(a, search(["Mathematics", "English"])), false);
});

test("missingPostFields treats an empty subject list as missing", () => {
  assert.deepEqual(missingPostFields({ ...filled, subject: [] }), ["subject"]);
});
