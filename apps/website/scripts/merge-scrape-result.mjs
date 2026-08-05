// Merges a scrape-result-*.json (produced by scrape-sgtestpaper.mjs) into
// src/data/testPapers.mjs, inferring the subject bucket from the fileKey's
// folder segment and the exam-type bucket from the title. Anything it can't
// confidently classify is left out and printed for manual review, same as
// scrape-sgtestpaper.mjs does today.
//
// Usage:
//   node scripts/merge-scrape-result.mjs <scrape-result.json> [--write]
// Without --write it just prints what it *would* do (dry run).
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_PATH = path.join(__dirname, "..", "src", "data", "testPapers.mjs");

const args = process.argv.slice(2);
const write = args.includes("--write");
const inputPath = args.find((a) => !a.startsWith("--"));
if (!inputPath) {
  console.error("Usage: node scripts/merge-scrape-result.mjs <scrape-result.json> [--write]");
  process.exit(1);
}

// fileKey folder segment -> [level, subject name as it appears in testPapers.mjs]
const SUBJECT_BY_FOLDER = {
  "p6-english": ["primary", "Primary 6 English"],
  "p6-maths": ["primary", "Primary 6 Math"],
  "p6-science": ["primary", "Primary 6 Science"],
  "p6-chinese": ["primary", "Primary 6 Chinese"],
  "p5-english": ["primary", "Primary 5 English"],
  "p5-maths": ["primary", "Primary 5 Math"],
  "p5-science": ["primary", "Primary 5 Science"],
  "p5-chinese": ["primary", "Primary 5 Chinese"],
  amath: ["secondary", "Secondary 4 Math"],
  emath: ["secondary", "Secondary 4 E Math"],
  chemistry: ["secondary", "Secondary 4 Chemistry"],
  physics: ["secondary", "Secondary 4 Physics"],
  biology: ["secondary", "Secondary 4 Biology"],
  history: ["secondary", "Secondary 4 History"],
  geography: ["secondary", "Secondary 4 Geography"],
  "social-studies": ["secondary", "Secondary 4 Social Studies"],
  poa: ["secondary", "Secondary 4 POA"],
  gp: ["jc", "General Paper"],
  "h2-maths": ["jc", "JC2 H2 Maths"],
  "h2-chemistry": ["jc", "JC2 H2 Chemistry"],
  "h2-physics": ["jc", "JC2 H2 Physics"],
  "h2-biology": ["jc", "JC2 H2 Biology"],
  "h2-economics": ["jc", "JC2 H2 Economics"],
};

// Subjects whose testPapers.mjs buckets are split by paper number
// ('Prelim Paper 1' / 'Prelim Paper 2') instead of a flat exam-type key.
const PAPER_SPLIT_SUBJECTS = new Set(["Secondary 4 Math", "Secondary 4 Biology", "JC2 H2 Economics"]);

// For Primary 6 subjects only, "SA2" is the old name for what schools now
// call "Prelim" (PSLE terminology changed) — the same exam, not two
// different ones. Route SA2-titled P6 papers into the existing 'prelim'
// bucket instead of a separate 'sa2' one. Does not apply to P5 or below.
const P6_SA2_MEANS_PRELIM = true;

const EXAM_TYPE_PATTERNS = [
  [/\bprelim\b/i, "prelim", "Prelim"],
  [/\bwa\s?1\b/i, "wa1", "WA1"],
  [/\bwa\s?2\b/i, "wa2", "WA2"],
  [/\bsa\s?1\b/i, "sa1", "SA1"],
  [/\bsa\s?2\b/i, "sa2", "SA2"],
  [/\bca\s?1\b/i, "ca1", "CA1"],
  [/\bca\s?2\b/i, "ca2", "CA2"],
];

function detectExamType(title) {
  for (const [re, key, label] of EXAM_TYPE_PATTERNS) {
    if (re.test(title)) return { key, label };
  }
  return null;
}

function detectPaperNumber(title) {
  const m = title.match(/\bpaper\s?([12])\b/i);
  return m ? m[1] : null;
}

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Given text and the index of an opening bracket char, find the index of
// its matching closing bracket (handles {}, [] nesting together).
function findMatchingClose(text, openIndex) {
  const open = text[openIndex];
  const close = open === "{" ? "}" : "]";
  const pairs = { "{": "}", "[": "]" };
  const stack = [pairs[open]];
  for (let i = openIndex + 1; i < text.length; i++) {
    const ch = text[i];
    if (ch === "{" || ch === "[") {
      stack.push(pairs[ch]);
    } else if (ch === "}" || ch === "]") {
      const expected = stack.pop();
      if (ch !== expected) throw new Error(`Bracket mismatch at index ${i}`);
      if (stack.length === 0) return i;
    }
  }
  throw new Error(`No matching close bracket found for index ${openIndex}`);
}

function keyToken(key) {
  return /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : `'${key}'`;
}

function entryLine(indent, entry) {
  const escTitle = entry.title.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
  return `${indent}{ title: '${escTitle}', fileKey: '${entry.fileKey}' },`;
}

async function loadExistingFileKeys() {
  const mod = await import(DATA_PATH);
  const keys = new Set();
  const walk = (node) => {
    if (Array.isArray(node)) {
      for (const item of node) {
        if (item && typeof item === "object" && item.fileKey) keys.add(item.fileKey);
        else walk(item);
      }
    } else if (node && typeof node === "object") {
      for (const v of Object.values(node)) walk(v);
    }
  };
  walk(mod.testPapers);
  return keys;
}

function classify(entry) {
  const parts = entry.fileKey.split("/");
  // papers/<level>/<year>/<folder>/<filename>
  const folder = parts[3];
  const mapping = SUBJECT_BY_FOLDER[folder];
  if (!mapping) return { entry, reason: `unrecognized folder segment "${folder}" in fileKey` };
  const [level, subject] = mapping;

  const examType = detectExamType(entry.title);
  if (!examType) return { entry, reason: `couldn't detect exam type (prelim/wa1/wa2/sa1/sa2/ca1/ca2) in title` };

  let bucketKey = examType.key;
  if (P6_SA2_MEANS_PRELIM && /^Primary 6 /.test(subject) && bucketKey === "sa2") {
    bucketKey = "prelim";
  }
  if (PAPER_SPLIT_SUBJECTS.has(subject)) {
    const paperNum = detectPaperNumber(entry.title);
    if (!paperNum) {
      return { entry, reason: `${subject} splits buckets by paper number but no "Paper 1/2" found in title` };
    }
    bucketKey = `${examType.label} Paper ${paperNum}`;
  }

  return { entry, level, subject, bucketKey };
}

async function insertGroup(text, { level, subject, bucketKey, entries }) {
  const levelMatch = text.match(new RegExp(`\\n(\\s*)${level}:\\s*\\{`));
  if (!levelMatch) throw new Error(`Couldn't find level "${level}" in testPapers.mjs`);
  const levelOpenIdx = levelMatch.index + levelMatch[0].length - 1;
  const levelCloseIdx = findMatchingClose(text, levelOpenIdx);
  const levelIndent = levelMatch[1];

  const subjectNeedle = `'${subject}': {`;
  const subjectRelIdx = text.slice(levelOpenIdx, levelCloseIdx).indexOf(subjectNeedle);

  if (subjectRelIdx === -1) {
    // Subject doesn't exist yet under this level: create it right after the level's "{".
    const subjectIndent = levelIndent + "  ";
    const bucketIndent = subjectIndent + "  ";
    const entryIndent = bucketIndent + "  ";
    const entryLines = entries.map((e) => entryLine(entryIndent, e)).join("\n");
    const block = `\n${subjectIndent}'${subject}': {\n${bucketIndent}${keyToken(bucketKey)}: [\n${entryLines}\n${bucketIndent}]\n${subjectIndent}},`;
    return text.slice(0, levelOpenIdx + 1) + block + text.slice(levelOpenIdx + 1);
  }

  const subjectOpenIdx = levelOpenIdx + subjectRelIdx + subjectNeedle.length - 1;
  const subjectCloseIdx = findMatchingClose(text, subjectOpenIdx);
  const subjectBlock = text.slice(subjectOpenIdx, subjectCloseIdx);

  const bucketNeedle = new RegExp(`(^|[\\s,])${escapeRegExp(keyToken(bucketKey))}:\\s*\\[`);
  const bucketMatch = subjectBlock.match(bucketNeedle);

  if (!bucketMatch) {
    // Bucket doesn't exist yet on this subject: add it right after the subject's "{".
    const firstKeyMatch = subjectBlock.slice(1).match(/\n(\s*)\S/);
    const bucketIndent = firstKeyMatch ? firstKeyMatch[1] : levelIndent + "    ";
    const entryIndent = bucketIndent + "  ";
    const entryLines = entries.map((e) => entryLine(entryIndent, e)).join("\n");
    const block = `\n${bucketIndent}${keyToken(bucketKey)}: [\n${entryLines}\n${bucketIndent}],`;
    return text.slice(0, subjectOpenIdx + 1) + block + text.slice(subjectOpenIdx + 1);
  }

  const bucketOpenIdx = subjectOpenIdx + bucketMatch.index + bucketMatch[0].length - 1;
  const bucketCloseIdx = findMatchingClose(text, bucketOpenIdx);
  const bucketContent = text.slice(bucketOpenIdx + 1, bucketCloseIdx);

  const existingEntryLine = bucketContent.match(/\n(\s*)\{ title:/);
  const entryIndent = existingEntryLine ? existingEntryLine[1] : levelIndent + "      ";
  const entryLines = entries.map((e) => entryLine(entryIndent, e)).join("\n");

  const trimmedContent = bucketContent.replace(/\s*$/, "");
  const needsComma = trimmedContent.length > 0 && !trimmedContent.endsWith(",");
  const closingIndent = bucketContent.match(/\n(\s*)$/)?.[1] ?? levelIndent + "    ";
  const newContent =
    (trimmedContent ? trimmedContent + (needsComma ? "," : "") + "\n" : "\n") + entryLines + "\n" + closingIndent;

  return text.slice(0, bucketOpenIdx + 1) + newContent + text.slice(bucketCloseIdx);
}

const raw = JSON.parse(await readFile(inputPath, "utf8"));
const existingKeys = await loadExistingFileKeys();

const toInsert = [];
const skippedExisting = [];
const skippedUnclassified = [];

for (const entry of raw) {
  if (existingKeys.has(entry.fileKey)) {
    skippedExisting.push(entry);
    continue;
  }
  const result = classify(entry);
  if (result.reason) {
    skippedUnclassified.push(result);
  } else {
    toInsert.push(result);
  }
}

// Group by level+subject+bucketKey so each group is inserted in one shot.
const groups = new Map();
for (const item of toInsert) {
  const groupKey = `${item.level} ${item.subject} ${item.bucketKey}`;
  if (!groups.has(groupKey)) groups.set(groupKey, { level: item.level, subject: item.subject, bucketKey: item.bucketKey, entries: [] });
  groups.get(groupKey).entries.push(item.entry);
}

console.log(`${raw.length} entries in ${inputPath}`);
console.log(`  ${skippedExisting.length} already present (skipped)`);
console.log(`  ${toInsert.length} to insert across ${groups.size} bucket(s)`);
console.log(`  ${skippedUnclassified.length} couldn't be classified automatically\n`);

let text = await readFile(DATA_PATH, "utf8");
for (const group of groups.values()) {
  console.log(`-> ${group.level}.'${group.subject}'.${group.bucketKey}: +${group.entries.length}`);
  for (const e of group.entries) console.log(`     ${e.title}`);
  text = await insertGroup(text, group);
}

if (skippedUnclassified.length > 0) {
  console.log(`\nCouldn't classify (add to SUBJECT_BY_FOLDER / review manually):`);
  for (const { entry, reason } of skippedUnclassified) {
    console.log(`  "${entry.title}" (${entry.fileKey}) — ${reason}`);
  }
}

if (write) {
  if (groups.size === 0) {
    console.log("\nNothing to write.");
  } else {
    await writeFile(DATA_PATH, text);
    console.log(`\nWrote ${DATA_PATH}`);
  }
} else {
  console.log("\nDry run only — pass --write to apply.");
}
