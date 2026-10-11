// Writes the list of files to cache and the name of the cache into service-worker.js.
//
// The cache name contains a hash of the files in the list. When any of them changes, the name changes,
// the browser installs the new service worker with a new cache and the old cache is deleted when it
// activates. With a fixed name, installed users would keep the files of the first version for ever.
//
//   node scripts/build-service-worker.mjs          writes the block
//   node scripts/build-service-worker.mjs --check  fails if the block is not what the files produce
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PAGES } from "../Src/Templates/pages.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const serviceWorkerPath = path.join(root, "service-worker.js");
const packageJson = JSON.parse(
  fs.readFileSync(path.join(root, "package.json"), "utf8"),
);
const check = process.argv.includes("--check");

const START = "// @generated-start";
const END = "// @generated-end";

/**
 * The files of the application that are cached when it is installed, relative to the root folder.
 */
function ListFilesToCache() {
  const distribution = fs
    .readdirSync(path.join(root, "Dist"))
    .filter((name) => /\.(js|css)$/.test(name))
    .sort()
    .map((name) => `Dist/${name}`);
  const icons = fs
    .readdirSync(path.join(root, "Src/CSS"))
    .filter((name) => /\.png$/.test(name))
    .sort()
    .map((name) => `Src/CSS/${name}`);
  const pages = PAGES.map((page) => page.output).sort((a, b) =>
    a === "report.html" ? -1 : b === "report.html" ? 1 : a.localeCompare(b),
  );
  const files = ["manifest.json", ...pages, ...distribution, ...icons];

  for (const file of files) {
    if (!fs.existsSync(path.join(root, file))) {
      throw new Error(
        `${file} is cached by the service worker but does not exist. Run "npm run build".`,
      );
    }
  }
  return ["/", ...files];
}

/**
 * Hashes the names and the contents of the files. The line endings of text files are ignored, as git
 * changes them depending on the operating system.
 */
function HashFiles(files) {
  const hash = crypto.createHash("sha256");
  for (const file of files.filter((name) => name !== "/")) {
    let content = fs.readFileSync(path.join(root, file));
    if (/\.(html|js|css|json)$/.test(file)) {
      content = Buffer.from(content.toString("utf8").replace(/\r\n/g, "\n"));
    }
    hash.update(file).update("\0").update(content).update("\0");
  }
  return hash.digest("hex").slice(0, 12);
}

function RenderBlock() {
  const files = ListFilesToCache();
  const cacheName = `VIVA-cache-${packageJson.version}-${HashFiles(files)}`;
  return `${START}
// This block is written by scripts/build-service-worker.mjs (npm run build). Do not edit it by hand.
const CACHE_NAME = "${cacheName}";
const filesToCache = [
${files.map((file) => `\t"${file}"`).join(",\n")}
];
${END}`;
}

const current = fs
  .readFileSync(serviceWorkerPath, "utf8")
  .replace(/\r\n/g, "\n");
const start = current.indexOf(START);
const end = current.indexOf(END);
if (start < 0 || end < start) {
  throw new Error(`service-worker.js needs the lines "${START}" and "${END}".`);
}
const updated =
  current.slice(0, start) + RenderBlock() + current.slice(end + END.length);

if (check) {
  if (updated !== current) {
    console.error(
      'The service worker is not up to date with the files it caches.\nRun "npm run build".',
    );
    process.exit(1);
  }
  console.log("The service worker is up to date.");
} else {
  fs.writeFileSync(serviceWorkerPath, updated);
  console.log("Wrote the cache list and name of service-worker.js.");
}
