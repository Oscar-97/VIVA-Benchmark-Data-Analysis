// Generates report.html and Src/Pages/*.html from Src/Templates.
//
//   node scripts/build-pages.mjs           writes the pages
//   node scripts/build-pages.mjs --check   fails if a page is not what the templates produce
//   node scripts/build-pages.mjs --out DIR writes the pages below DIR instead (to compare them)
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as prettier from "prettier";
import { PAGES } from "../Src/Templates/pages.mjs";
import { RenderPage } from "../Src/Templates/layout.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const check = process.argv.includes("--check");
const outIndex = process.argv.indexOf("--out");
const outDirectory =
  outIndex >= 0 ? path.resolve(process.argv[outIndex + 1]) : root;

async function FormatPage(page) {
  const formatted = await prettier.format(RenderPage(page), {
    parser: "html",
    endOfLine: "lf",
  });
  // Prettier 3 writes the doctype in lower case, the pages have always had it in upper case.
  return formatted.replace(/^<!doctype html>/i, "<!DOCTYPE html>");
}

const stale = [];
for (const page of PAGES) {
  const html = await FormatPage(page);
  const target = path.join(outDirectory, page.output);
  if (check) {
    const current = fs.existsSync(target)
      ? fs.readFileSync(target, "utf8").replace(/\r\n/g, "\n")
      : null;
    if (current !== html) {
      stale.push(page.output);
    }
  } else {
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, html);
  }
}

if (check) {
  if (stale.length > 0) {
    console.error(
      `These pages are not up to date with Src/Templates: ${stale.join(", ")}.\nRun "npm run build:pages".`,
    );
    process.exit(1);
  }
  console.log(`All ${PAGES.length} pages are up to date.`);
} else {
  console.log(`Wrote ${PAGES.length} pages to ${outDirectory}.`);
}
