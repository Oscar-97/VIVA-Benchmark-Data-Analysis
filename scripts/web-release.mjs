// The redirects of the web release (Cloudflare Pages reads them from the file _redirects).
//
// Cloudflare Pages already serves /x for x.html and redirects /x.html to /x, so only the short
// addresses of the pages and the addresses of the pages that were renamed need a rule.
import { PAGES } from "../Src/Templates/pages.mjs";

export const REDIRECTS_FILE = "_redirects";

/**
 * Old page name -> current page name. Keep an entry when a page is renamed, so old links keep working.
 */
export const LEGACY = {
  average_solver_time: "solver_time_all",
  absolute_performance_profile: "performance_profile",
};

/**
 * Returns the content of the redirect file: "/<name>" goes to "/Src/Pages/<name>" for every page in
 * Src/Pages, and the old names of renamed pages go to the current page.
 */
export function BuildRedirects(pages = PAGES) {
  const names = pages
    .filter((page) => page.output.startsWith("Src/Pages/"))
    .map((page) => page.name);
  const rules = names.map((name) => `/${name} /Src/Pages/${name} 301`);
  for (const [oldName, name] of Object.entries(LEGACY)) {
    rules.push(`/${oldName} /Src/Pages/${name} 301`);
    rules.push(`/Src/Pages/${oldName} /Src/Pages/${name} 301`);
  }
  return `${rules.join("\n")}\n`;
}
