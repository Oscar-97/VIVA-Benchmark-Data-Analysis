// The web release (Cloudflare Pages): the pages are served at short addresses, such as /table and
// /plots/performance-profile, and the old addresses are redirected to them.
//
// The pages are files at the short addresses (plots/performance-profile.html), and Cloudflare Pages serves
// /plots/performance-profile for them, so no rewrite rules are needed. The ZIP release keeps the files of
// the repository (report.html, Src/Pages/*.html) and is not changed by this.
import fs from "node:fs";
import path from "node:path";
import { PAGES } from "../Src/Templates/pages.mjs";

export const REDIRECTS_FILE = "_redirects";

/**
 * The address of every page in the web release. A new page needs an address here.
 */
export const ROUTES = {
  report: "/table",
  performance_profile: "/plots/performance-profile",
  solver_time_all: "/plots/solver-time-per-solver",
  solver_time: "/plots/solver-time-per-instance",
  number_of_nodes: "/plots/number-of-nodes",
  number_of_iterations: "/plots/number-of-iterations",
  termination_status: "/plots/termination-status",
  solution_quality: "/plots/solution-quality",
  solution_time: "/plots/solution-time",
  compare_solvers: "/compare",
};

/**
 * Old page name -> current page name. Keep an entry when a page is renamed, so old links keep working.
 */
export const LEGACY = {
  average_solver_time: "solver_time_all",
  absolute_performance_profile: "performance_profile",
};

/**
 * The address of a page in the web release.
 */
export function RouteOf(page) {
  const route = ROUTES[page.name];
  if (route === undefined) {
    throw new Error(`The page ${page.name} has no address in ROUTES.`);
  }
  return route;
}

/**
 * Where the repository has the file of the page, as an address, for example /Src/Pages/solver_time.html.
 */
function SourceOf(page) {
  return `/${page.output}`;
}

/**
 * Returns the content of the redirect file. The old addresses of every page go to its short address: the
 * pages as they are in the repository (/report, /Src/Pages/<name>), their short names (/<name>) and the
 * names of pages that were renamed, with and without ".html".
 */
export function BuildRedirects(pages = PAGES) {
  const rules = [];
  for (const page of pages) {
    const route = RouteOf(page);
    const source = SourceOf(page);
    const olds = new Set([
      source,
      source.replace(/\.html$/, ""),
      `/${page.name}`,
    ]);
    for (const [oldName, name] of Object.entries(LEGACY)) {
      if (name === page.name) {
        olds.add(`/${oldName}`);
        olds.add(`/Src/Pages/${oldName}`);
        olds.add(`/Src/Pages/${oldName}.html`);
      }
    }
    for (const old of olds) {
      rules.push(`${old} ${route} 301`);
    }
  }
  return `${rules.join("\n")}\n`;
}

/**
 * The address in the web release of the file that a link points to. The link is relative to the file that has
 * it, and becomes absolute, as the same page is served from another folder now. A page becomes its short
 * address, and the other files lose ".html" like Cloudflare Pages serves them.
 */
export function ToWebPath(value, from, pages = PAGES) {
  if (/^([a-z][a-z0-9+.-]*:|\/|#)/i.test(value)) {
    return value;
  }
  const [, file = "", rest = ""] = /^([^#?]*)(.*)$/.exec(value) ?? [];
  if (file === "") {
    return value;
  }
  const target = path.posix.join("/", path.posix.dirname(from), file);
  const page = pages.find((candidate) => SourceOf(candidate) === target);
  const address = page ? RouteOf(page) : target.replace(/\.html$/, "");
  return `${address}${rest}`;
}

/**
 * The content of a page for the web release: the links and the files it loads are absolute.
 */
export function ToWebPage(html, from, pages = PAGES) {
  return html.replace(
    /\b(href|src)="([^"]*)"/g,
    (match, attribute, value) =>
      `${attribute}="${ToWebPath(value, from, pages)}"`,
  );
}

/**
 * The web manifest: it starts at the table, and its shortcuts open the short addresses.
 */
export function ToWebManifest(text, pages = PAGES) {
  const manifest = JSON.parse(text);
  const report = pages.find((page) => page.name === "report");
  manifest.start_url = RouteOf(report);
  for (const shortcut of manifest.shortcuts ?? []) {
    shortcut.url = ToWebPath(shortcut.url, "manifest.json", pages);
  }
  return `${JSON.stringify(manifest, null, "\t")}\n`;
}

/**
 * The service worker of the web release caches the pages by their short addresses, as that is what the browser
 * requests. The block that the build writes lists the files of the repository.
 */
export function ToWebServiceWorker(text, pages = PAGES) {
  return text.replace(
    /"((?:Src\/Pages\/\w+|report)\.html)"/g,
    (match, file) =>
      `"${ToWebPath(file, "service-worker.js", pages).slice(1)}"`,
  );
}

/**
 * The files of the web release that are not copied as they are: the pages at their short addresses, the entry
 * page "/" (a copy of the table, as a redirect would be cached as a redirected response, which the browser
 * refuses to use for a navigation), the manifest, the service worker and the redirects.
 */
export function BuildWebFiles(pages = PAGES) {
  const read = (file) => fs.readFileSync(file, "utf8");
  const report = pages.find((page) => page.name === "report");
  const files = pages.map((page) => ({
    name: `${RouteOf(page).slice(1)}.html`,
    source: ToWebPage(read(page.output), page.output, pages),
  }));
  files.push({
    name: "index.html",
    source: ToWebPage(read(report.output), report.output, pages),
  });
  files.push({
    name: "manifest.json",
    source: ToWebManifest(read("manifest.json"), pages),
  });
  files.push({
    name: "service-worker.js",
    source: ToWebServiceWorker(read("service-worker.js"), pages),
  });
  files.push({ name: REDIRECTS_FILE, source: BuildRedirects(pages) });
  return files;
}
