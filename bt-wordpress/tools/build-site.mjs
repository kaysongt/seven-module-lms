/**
 * Inlines fonts and images into the homepage as data URIs.
 *
 * The Artifact CSP blocks every external host, so the published page has to be
 * fully self-contained. Keeping the template and the assets separate means the
 * source stays readable and the page can be regenerated after any edit.
 *
 * Usage: node tools/build-site.mjs
 */

import { readFileSync, writeFileSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const ASSETS = join(ROOT, "site/assets");
const SRC = join(ROOT, "site/index.src.html");
const OUT = join(ROOT, "site/index.html");

const MIME = {
  woff2: "font/woff2",
  jpg: "image/jpeg",
  png: "image/png",
};

function dataUri(file) {
  const ext = file.split(".").pop();
  const mime = MIME[ext];
  if (!mime) throw new Error(`No MIME type registered for .${ext}`);
  const bytes = readFileSync(join(ASSETS, file));
  return `data:${mime};base64,${bytes.toString("base64")}`;
}

const REPLACEMENTS = {
  FONT_FRAUNCES: "fraunces.woff2",
  FONT_MANROPE: "manrope.woff2",
  IMG_HERO: "hero-worship.jpg",
  IMG_WELCOME: "welcome.jpg",
  IMG_COMMUNITY: "community.jpg",
  IMG_LOGO_WHITE: "logo-white.png",
};

let html = readFileSync(SRC, "utf8");

for (const [token, file] of Object.entries(REPLACEMENTS)) {
  const placeholder = `{{${token}}}`;
  if (!html.includes(placeholder)) {
    console.warn(`  ! ${placeholder} is unused`);
    continue;
  }
  html = html.replaceAll(placeholder, dataUri(file));
}

const leftover = html.match(/\{\{[A-Z_]+\}\}/g);
if (leftover) throw new Error(`Unresolved placeholders: ${[...new Set(leftover)].join(", ")}`);

writeFileSync(OUT, html, "utf8");

const kb = (bytes) => `${(bytes / 1024).toFixed(0)} KB`;
console.log(`Wrote ${OUT}`);
console.log(`  template: ${kb(statSync(SRC).size)}`);
console.log(`  page:     ${kb(statSync(OUT).size)}`);
