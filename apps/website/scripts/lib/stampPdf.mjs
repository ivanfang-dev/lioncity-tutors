// Stamps a PDF with the LionCity Tutors cover page + per-page banner.
// Pure JS (pdf-lib) so the upload pipeline has no Python/venv dependency.
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PDFDocument } from "pdf-lib";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ASSETS_DIR = path.join(__dirname, "..", "assets");
const BANNER_PATH = path.join(ASSETS_DIR, "banner.png");
const COVER_PATH = path.join(ASSETS_DIR, "cover_page.pdf");

let cachedBannerBytes;
let cachedCoverBytes;

async function getBannerBytes() {
  if (!cachedBannerBytes) cachedBannerBytes = await readFile(BANNER_PATH);
  return cachedBannerBytes;
}

async function getCoverBytes() {
  if (!cachedCoverBytes) cachedCoverBytes = await readFile(COVER_PATH);
  return cachedCoverBytes;
}

/**
 * @param {Buffer|Uint8Array} inputBytes - original PDF
 * @returns {Promise<Buffer>} stamped PDF (cover page prepended, banner on every page)
 */
export async function stampPdfBuffer(inputBytes) {
  const [srcDoc, coverDoc, bannerBytes] = await Promise.all([
    PDFDocument.load(inputBytes),
    PDFDocument.load(await getCoverBytes()),
    getBannerBytes(),
  ]);

  const bannerImage = await srcDoc.embedPng(bannerBytes);
  const bannerAspect = bannerImage.height / bannerImage.width;

  for (const page of srcDoc.getPages()) {
    const { width } = page.getSize();
    const bannerHeight = width * bannerAspect;
    page.drawImage(bannerImage, {
      x: 0,
      y: page.getHeight() - bannerHeight,
      width,
      height: bannerHeight,
    });
  }

  const [coverPage] = await srcDoc.copyPages(coverDoc, [0]);
  srcDoc.insertPage(0, coverPage);

  const outBytes = await srcDoc.save();
  return Buffer.from(outBytes);
}
