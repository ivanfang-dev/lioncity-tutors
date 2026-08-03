import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";

const ENV_KEYS = ["R2_ACCOUNT_ID", "R2_ACCESS_KEY_ID", "R2_SECRET_ACCESS_KEY", "R2_BUCKET_NAME"];

beforeEach(() => {
  process.env.R2_ACCOUNT_ID = "testaccount";
  process.env.R2_ACCESS_KEY_ID = "testkeyid";
  process.env.R2_SECRET_ACCESS_KEY = "testsecret";
  process.env.R2_BUCKET_NAME = "lioncity-papers";
});

test("presignDownload returns a signed URL for the bucket object", async () => {
  const { presignDownload } = await import("./r2.mjs");
  const url = await presignDownload(
    "papers/secondary/2025/history/acsi-2025-hist-prelim-p1-qp.pdf",
    "ACSI 2025 HIST PRELIM P1 QP.pdf"
  );
  const u = new URL(url);
  assert.equal(u.host, "testaccount.r2.cloudflarestorage.com");
  assert.ok(u.pathname.startsWith("/lioncity-papers/papers/secondary/2025/history/"));
  assert.equal(u.searchParams.get("X-Amz-Expires"), "300");
  assert.ok(u.searchParams.get("X-Amz-Signature"), "has a signature");
  assert.match(u.searchParams.get("response-content-disposition"), /^attachment; filename=/);
});

test("presignDownload respects expiresIn override", async () => {
  const { presignDownload } = await import("./r2.mjs");
  const url = await presignDownload("notes/jc/gp/j1/x.pdf", "x.pdf", { expiresIn: 60 });
  assert.equal(new URL(url).searchParams.get("X-Amz-Expires"), "60");
});

test("presignDownload throws when env vars are missing", async () => {
  const { presignDownload } = await import("./r2.mjs");
  for (const key of ENV_KEYS) delete process.env[key];
  await assert.rejects(() => presignDownload("papers/x.pdf", "x.pdf"), /Missing R2 environment variables/);
});
