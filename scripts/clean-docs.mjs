// Removes the pages typedoc generated, so modules that no longer exist do not stay in Docs/.
// Docs/Images and Docs/.nojekyll are kept: the manifest and the web hosting use them.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const docs = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "Docs",
);
const GENERATED = [
  "assets",
  "classes",
  "enums",
  "functions",
  "interfaces",
  "media",
  "modules",
  "types",
  "variables",
];

for (const name of GENERATED) {
  fs.rmSync(path.join(docs, name), { recursive: true, force: true });
}
for (const name of ["index.html", "modules.html", "landing_page.html"]) {
  fs.rmSync(path.join(docs, name), { force: true });
}
