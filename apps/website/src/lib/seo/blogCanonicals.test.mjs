import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

// Regression guard for a bug that was live in production: blog/layout.jsx declared
// `alternates.canonical: '.../blog'`, and App Router metadata is inherited by every
// descendant. Any post that did not declare its own canonical therefore told Google
// to index /blog instead of itself, which kept it out of the index entirely.
// /blog/benefits-of-private-tuition sat in that state.
//
// These tests fail if either half of the fix is undone.

const BLOG_DIR = path.join(process.cwd(), "src/app/blog");
const SITE = "https://www.lioncitytutors.com";

// Comments discuss canonicals too (this fix is documented in blog/page.jsx), so they
// have to come out before matching or the test reads prose instead of code.
function code(file) {
  return fs
    .readFileSync(file, "utf8")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/^\s*\/\/.*$/gm, "");
}

function postSlugs() {
  return fs
    .readdirSync(BLOG_DIR, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name);
}

test("no layout re-introduces an inherited canonical across all blog posts", () => {
  const layout = path.join(BLOG_DIR, "layout.jsx");
  if (!fs.existsSync(layout)) return;
  const src = code(layout);
  assert.ok(
    !/canonical/.test(src),
    "blog/layout.jsx must not declare a canonical: App Router inherits it into every " +
      "post, overriding each post's own URL. Put the index's canonical on blog/page.jsx."
  );
});

test("every blog post declares its own self-referencing canonical", () => {
  const missing = [];
  const wrong = [];

  for (const slug of postSlugs()) {
    const file = path.join(BLOG_DIR, slug, "page.jsx");
    if (!fs.existsSync(file)) continue;
    const src = code(file);
    const match = src.match(/canonical:\s*['"`]([^'"`]+)['"`]/);
    if (!match) {
      missing.push(slug);
      continue;
    }
    const expected = `${SITE}/blog/${slug}`;
    if (match[1].replace(/\/$/, "") !== expected) {
      wrong.push(`${slug} -> ${match[1]} (expected ${expected})`);
    }
  }

  assert.deepEqual(missing, [], `blog posts with no canonical of their own: ${missing.join(", ")}`);
  assert.deepEqual(wrong, [], `blog posts pointing their canonical elsewhere: ${wrong.join("; ")}`);
});

test("the blog index canonicalises to /blog", () => {
  const src = code(path.join(BLOG_DIR, "page.jsx"));
  const match = src.match(/canonical:\s*['"`]([^'"`]+)['"`]/);
  assert.ok(match, "blog/page.jsx must declare its own canonical");
  assert.equal(match[1], `${SITE}/blog`);
});
