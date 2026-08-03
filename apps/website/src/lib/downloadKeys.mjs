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
