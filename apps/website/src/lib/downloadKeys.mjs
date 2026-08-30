import { testPapers } from "../data/testPapers.mjs";
import { notesData } from "../data/notesData.mjs";

function collect(node, out) {
  if (Array.isArray(node)) {
    for (const item of node) if (item && item.fileKey) out.push(item.fileKey);
    return out;
  }
  if (node && typeof node === "object") {
    for (const value of Object.values(node)) collect(value, out);
  }
  return out;
}

let cachedSet;

export function getAllFileKeys() {
  const out = [];
  collect(testPapers, out);
  collect(notesData, out);
  return out;
}

export function isKnownFileKey(key) {
  if (!cachedSet) cachedSet = new Set(getAllFileKeys());
  return cachedSet.has(key);
}

const BRAND = "LionCity Tutors";

/** Titles by fileKey, for both papers and notes. */
function collectTitles(node, out) {
  if (Array.isArray(node)) {
    for (const item of node) if (item?.fileKey && item.title) out.set(item.fileKey, item.title);
    return out;
  }
  if (node && typeof node === "object") {
    for (const value of Object.values(node)) collectTitles(value, out);
  }
  return out;
}

let cachedTitles;

export function titleForKey(key) {
  if (!cachedTitles) {
    cachedTitles = new Map();
    collectTitles(testPapers, cachedTitles);
    collectTitles(notesData, cachedTitles);
  }
  return cachedTitles.get(key) ?? null;
}

/**
 * What the reader's browser saves the file as. The R2 key is a storage slug —
 * served as-is it lands in a Downloads folder as
 * "jc-h2-physics-9478-master-study-notes.pdf", and reads like a leaked file
 * when a student forwards it on. The brand leads because chat apps and file
 * lists truncate the end, so a prefix is the only position that always
 * survives. Falls back to the key's last segment for anything untitled.
 */
export function downloadFilename(key) {
  const title = titleForKey(key);
  if (!title) return key.split("/").pop();
  const clean = title
    .replace(/[:/\\]+/g, " - ")
    .replace(/["*?<>|]/g, "")
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u001f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return `${BRAND} - ${clean}`.slice(0, 120).trim() + ".pdf";
}

/** Stable per-paper identity: the R2 key when we host it, the source URL otherwise. */
export function paperKeyOf(paper) {
  return paper?.fileKey || paper?.downloadUrl || null;
}

function collectPaperKeys(node, out) {
  if (Array.isArray(node)) {
    for (const item of node) {
      const key = paperKeyOf(item);
      if (key) out.push(key);
    }
    return out;
  }
  if (node && typeof node === "object") {
    for (const value of Object.values(node)) collectPaperKeys(value, out);
  }
  return out;
}

let cachedPaperKeys;

export function getAllPaperKeys() {
  return collectPaperKeys(testPapers, []);
}

export function isKnownPaperKey(key) {
  if (!key) return false;
  if (!cachedPaperKeys) cachedPaperKeys = new Set(getAllPaperKeys());
  return cachedPaperKeys.has(key);
}
