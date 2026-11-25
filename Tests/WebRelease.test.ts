import { execFileSync } from "child_process";
import * as fs from "fs";
import * as path from "path";
import { pathToFileURL } from "url";

interface WebFile {
	name: string;
	source: string;
}

interface WebRelease {
	redirects: string;
	file: string;
	legacy: Record<string, string>;
	routes: Record<string, string>;
	files: WebFile[];
	outputs: Record<string, string>;
}

const root = path.resolve(__dirname, "..");

/**
 * Loads the ES module that builds the web release in a Node process, as jest runs the tests as CommonJS.
 */
function LoadWebRelease(): WebRelease {
	const url = pathToFileURL(path.join(root, "scripts/web-release.mjs")).href;
	const pages = pathToFileURL(path.join(root, "Src/Templates/pages.mjs")).href;
	const script = `Promise.all([import(${JSON.stringify(url)}), import(${JSON.stringify(pages)})]).then(([m, p]) => console.log(JSON.stringify({
		redirects: m.BuildRedirects(),
		file: m.REDIRECTS_FILE,
		legacy: m.LEGACY,
		routes: m.ROUTES,
		files: m.BuildWebFiles(),
		outputs: Object.fromEntries(p.PAGES.map((page) => [page.name, page.output]))
	})))`;
	const output = execFileSync(process.execPath, ["-e", script], {
		encoding: "utf8",
		cwd: root,
		maxBuffer: 64 * 1024 * 1024
	});
	return JSON.parse(output) as WebRelease;
}

/**
 * The rules of the redirect file as [source, target] pairs.
 */
function ParseRules(content: string): [string, string][] {
	return content
		.split("\n")
		.filter((line) => line.trim() !== "")
		.map((line) => {
			const [source = "", target = ""] = line.split(" ");
			return [source, target];
		});
}

describe("Web release", () => {
	let webRelease: WebRelease;
	let rules: [string, string][];

	beforeAll(() => {
		webRelease = LoadWebRelease();
		rules = ParseRules(webRelease.redirects);
	});

	function WebFile(name: string): string {
		const found = webRelease.files.find((file) => file.name === name);
		if (found === undefined) {
			throw new Error(`The web release has no file ${name}.`);
		}
		return found.source;
	}

	describe("addresses", () => {
		it("should give every page its own short address", () => {
			const pages = Object.keys(webRelease.outputs);
			expect(Object.keys(webRelease.routes).sort()).toEqual(pages.sort());
			const routes = Object.values(webRelease.routes);
			expect(new Set(routes).size).toBe(routes.length);
			for (const route of routes) {
				expect(route).toMatch(/^\/[a-z]+(-[a-z]+)*(\/[a-z]+(-[a-z]+)*)?$/);
				expect(route).not.toContain("_");
			}
		});

		it("should have the addresses of the table, the plots and the comparison", () => {
			expect(webRelease.routes["report"]).toBe("/table");
			expect(webRelease.routes["performance_profile"]).toBe(
				"/plots/performance-profile"
			);
			expect(webRelease.routes["compare_solvers"]).toBe("/compare");
		});

		it("should have a file for every address, which Cloudflare Pages serves without the extension", () => {
			const names = webRelease.files.map((file) => file.name);
			for (const route of Object.values(webRelease.routes)) {
				expect(names).toContain(`${route.slice(1)}.html`);
			}
		});
	});

	describe("redirects", () => {
		it("should be written to the file that Cloudflare Pages reads", () => {
			expect(webRelease.file).toBe("_redirects");
			expect(webRelease.files.map((file) => file.name)).toContain("_redirects");
		});

		it("should only point to the addresses of the pages", () => {
			const routes = Object.values(webRelease.routes);
			expect(rules.length).toBeGreaterThan(0);
			for (const [, target] of rules) {
				expect(routes).toContain(target);
			}
		});

		it("should send the addresses of the repository to the short addresses", () => {
			for (const [name, output] of Object.entries(webRelease.outputs)) {
				const route = webRelease.routes[name];
				expect(rules).toContainEqual([`/${output}`, route]);
				expect(rules).toContainEqual([
					`/${output.replace(".html", "")}`,
					route
				]);
			}
		});

		it("should send the old names of renamed pages to the current page", () => {
			for (const [oldName, name] of Object.entries(webRelease.legacy)) {
				const route = webRelease.routes[name];
				expect(rules).toContainEqual([`/${oldName}`, route]);
				expect(rules).toContainEqual([`/Src/Pages/${oldName}`, route]);
			}
		});

		it("should have no chains, loops or duplicate sources", () => {
			const sources = rules.map(([source]) => source);
			expect(new Set(sources).size).toBe(sources.length);
			for (const [, target] of rules) {
				expect(sources).not.toContain(target);
			}
			expect(sources).not.toContain("/");
		});
	});

	describe("pages", () => {
		const pageFiles = (): WebFile[] =>
			webRelease.files.filter((file) => file.name.endsWith(".html"));

		/**
		 * The links and the loaded files of a page, as "file: address".
		 */
		const addressesOf = (file: WebFile): string[] =>
			[...file.source.matchAll(/\b(?:href|src)="([^"]*)"/g)].map(
				(match) => `${file.name}: ${match[1] ?? ""}`
			);

		it("should link to the short addresses, and to no file of the repository", () => {
			for (const file of pageFiles()) {
				const addresses = addressesOf(file);
				expect(
					addresses.filter((entry) => /report|Src\/Pages/.test(entry))
				).toEqual([]);
				for (const route of [
					"/table",
					"/compare",
					"/plots/performance-profile"
				]) {
					expect(addresses).toContain(`${file.name}: ${route}`);
				}
			}
		});

		it("should load the files with absolute addresses, as the folders of the pages differ", () => {
			const relative = pageFiles()
				.flatMap(addressesOf)
				.filter((entry) => !/: (\/|https?:\/\/|mailto:|#)/.test(entry));
			expect(relative).toEqual([]);
		});

		it("should only link to files that exist", () => {
			const names = webRelease.files.map((file) => file.name);
			const missing = pageFiles()
				.flatMap(addressesOf)
				.filter((entry) => /: \/[^/]/.test(entry))
				.filter((entry) => {
					const address = (entry.split(": ")[1] ?? "").replace(/[#?].*$/, "");
					return !(
						names.includes(`${address.slice(1)}.html`) ||
						fs.existsSync(path.join(root, address)) ||
						fs.existsSync(path.join(root, `${address}.html`))
					);
				});
			expect(missing).toEqual([]);
		});

		it("should serve the table at the root address as well", () => {
			expect(WebFile("index.html")).toBe(WebFile("table.html"));
		});
	});

	describe("manifest and service worker", () => {
		it("should start the application at the table and open the short addresses", () => {
			const manifest = JSON.parse(WebFile("manifest.json")) as {
				start_url: string;
				shortcuts: { url: string }[];
			};
			const routes = Object.values(webRelease.routes);
			expect(manifest.start_url).toBe("/table");
			expect(manifest.shortcuts.length).toBeGreaterThan(0);
			for (const { url } of manifest.shortcuts) {
				expect(routes).toContain(url);
			}
		});

		it("should cache the pages by their short addresses", () => {
			const source = WebFile("service-worker.js");
			const block = /const filesToCache = \[([\s\S]*?)\];/.exec(source)?.[1];
			const entries = [...(block ?? "").matchAll(/"([^"]+)"/g)].map(
				(match) => match[1]
			);
			for (const route of Object.values(webRelease.routes)) {
				expect(entries).toContain(route.slice(1));
			}
			expect(entries).not.toContain("report.html");
			expect(entries.filter((entry) => entry?.startsWith("Src/Pages"))).toEqual(
				[]
			);
			expect(source).toContain('cache.match("table")');
		});
	});
});
