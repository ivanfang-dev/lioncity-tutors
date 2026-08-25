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
