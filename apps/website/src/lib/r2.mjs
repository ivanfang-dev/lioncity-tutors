import { AwsClient } from "aws4fetch";

// Presigns a GET against the private R2 bucket. Reads env at call time so the
// same module works in Next.js routes, scripts and tests.
export async function presignDownload(fileKey, filename, { expiresIn = 300 } = {}) {
  const { R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME } = process.env;
  if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET_NAME) {
    throw new Error("Missing R2 environment variables");
  }
  const client = new AwsClient({
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
    service: "s3",
    region: "auto",
  });
  const encodedKey = fileKey.split("/").map(encodeURIComponent).join("/");
  const url = new URL(`https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${R2_BUCKET_NAME}/${encodedKey}`);
  url.searchParams.set("X-Amz-Expires", String(expiresIn));
  if (filename) {
    url.searchParams.set(
      "response-content-disposition",
      `attachment; filename="${filename.replace(/["\\]/g, "")}"`
    );
  }
  const signed = await client.sign(new Request(url, { method: "GET" }), { aws: { signQuery: true } });
  return signed.url;
}
