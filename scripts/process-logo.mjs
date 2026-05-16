/**
 * VASSIA Candles & Scents — brand asset processor.
 *
 * The source logos have a solid white background. This script keys out the
 * white to transparency (with anti-aliased edges) and produces:
 *
 *   public/brand/logo.png        dark wordmark, transparent bg  (light sections)
 *   public/brand/logo-light.png  ivory wordmark, transparent bg (dark sections)
 *   public/brand/mark.png        one-letter "V" mark, transparent
 *   app/icon.png                 256x256 favicon from the mark
 *
 * Re-run any time with:  npm run logo
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SRC_WORDMARK = path.join(ROOT, "..", "Vassia Candles & Scents Logo 16x10.png");
const SRC_MARK = path.join(ROOT, "..", "One-Letter Vassia Candles & Scents Logo 4x4.png");

const IVORY = { r: 0xfa, g: 0xf6, b: 0xef };

/**
 * Convert a white-background PNG to transparent.
 * Pixel alpha is derived from darkness: white -> 0, dark -> 255, so
 * anti-aliased glyph edges stay smooth. Optionally recolor the ink.
 */
async function keyWhite(srcPath, outPath, recolor /* {r,g,b} | null */) {
  const img = sharp(srcPath).ensureAlpha();
  const { data, info } = await img
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const out = Buffer.alloc(width * height * 4);

  for (let i = 0, o = 0; i < data.length; i += channels, o += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    // Perceived luminance 0..255 (255 = white)
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    // Alpha: fully opaque for ink, fades out as it approaches white.
    let alpha = 255 - lum;
    // Lift faint anti-alias halo, then clamp.
    alpha = Math.round(Math.min(255, Math.max(0, (alpha - 8) * 1.12)));

    if (recolor) {
      out[o] = recolor.r;
      out[o + 1] = recolor.g;
      out[o + 2] = recolor.b;
    } else {
      // Keep original ink tone (near-black), normalized to crisp ink.
      out[o] = r;
      out[o + 1] = g;
      out[o + 2] = b;
    }
    out[o + 3] = alpha;
  }

  let pipeline = sharp(out, { raw: { width, height, channels: 4 } }).png({
    compressionLevel: 9,
  });
  // Trim transparent margins so the logo sits flush in layouts.
  pipeline = pipeline.trim({ threshold: 1 });
  await pipeline.toFile(outPath);
  console.log("  ✓", path.relative(ROOT, outPath));
}

async function favicon(srcPath, outPath) {
  const img = sharp(srcPath).ensureAlpha();
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const out = Buffer.alloc(width * height * 4);
  for (let i = 0, o = 0; i < data.length; i += channels, o += 4) {
    const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    out[o] = 0x1a;
    out[o + 1] = 0x18;
    out[o + 2] = 0x15;
    out[o + 3] = Math.round(Math.min(255, Math.max(0, (255 - lum - 8) * 1.12)));
  }
  await sharp(out, { raw: { width, height, channels: 4 } })
    .trim({ threshold: 1 })
    .resize(256, 256, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toFile(outPath);
  console.log("  ✓", path.relative(ROOT, outPath));
}

async function main() {
  for (const f of [SRC_WORDMARK, SRC_MARK]) {
    if (!existsSync(f)) {
      console.error("✗ Missing source asset:", f);
      console.error("  Place the brand logo files in the parent folder.");
      process.exit(1);
    }
  }

  await mkdir(path.join(ROOT, "public", "brand"), { recursive: true });

  console.log("Processing VASSIA brand assets…");
  await keyWhite(SRC_WORDMARK, path.join(ROOT, "public/brand/logo.png"), null);
  await keyWhite(
    SRC_WORDMARK,
    path.join(ROOT, "public/brand/logo-light.png"),
    IVORY,
  );
  await keyWhite(SRC_MARK, path.join(ROOT, "public/brand/mark.png"), null);
  await favicon(SRC_MARK, path.join(ROOT, "app/icon.png"));
  console.log("Done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
