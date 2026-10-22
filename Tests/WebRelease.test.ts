import { execFileSync } from "child_process";
import * as fs from "fs";
import * as path from "path";
import { pathToFileURL } from "url";

interface WebRelease {
	BuildRedirects: () => string;
	REDIRECTS_FILE: string;
	LEGACY: Record<string, string>;
}

const root = path.resolve(__dirname, "..");

/**
 * Loads the ES module that builds the redirects in a Node process, as jest runs the tests as CommonJS.
 */
function LoadWebRelease(): WebRelease {
	const url = pathToFileURL(path.join(root, "scripts/web-release.mjs")).href;
	const script = `import(${JSON.stringify(url)}).then((m) => console.log(JSON.stringify({ redirects: m.BuildRedirects(), file: m.REDIRECTS_FILE, legacy: m.LEGACY })))`;
	const output = execFileSync(process.execPath, ["-e", script], {
		encoding: "utf8"
	});
	const loaded = JSON.parse(output) as {
		redirects: string;
		file: string;
		legacy: Record<string, string>;
	};
	return {
		BuildRedirects: () => loaded.redirects,
		REDIRECTS_FILE: loaded.file,
		LEGACY: loaded.legacy
	};
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

describe("Web release redirects", () => {
	let webRelease: WebRelease;
	let rules: [string, string][];

	beforeAll(() => {
		webRelease = LoadWebRelease();
		rules = ParseRules(webRelease.BuildRedirects());
	});

	it("should be written to the file that Cloudflare Pages reads", () => {
		expect(webRelease.REDIRECTS_FILE).toBe("_redirects");
	});

	it("should only point to pages that exist", () => {
		expect(rules.length).toBeGreaterThan(0);
		for (const [, target] of rules) {
			expect(fs.existsSync(path.join(root, `${target.slice(1)}.html`))).toBe(
				true
			);
		}
	});

	it("should not redirect addresses that Cloudflare Pages already handles", () => {
		for (const [source] of rules) {
			expect(source.endsWith(".html")).toBe(false);
		}
		expect(rules.map(([source]) => source)).not.toContain("/");
	});

	it("should give every page in Src/Pages a short address", () => {
		const pages = fs
			.readdirSync(path.join(root, "Src/Pages"))
			.filter((name) => name.endsWith(".html"))
			.map((name) => name.replace(".html", ""));
		const sources = rules.map(([source]) => source);
		for (const page of pages) {
			expect(sources).toContain(`/${page}`);
		}
	});

	it("should send the old names of renamed pages to the current page", () => {
		for (const [oldName, name] of Object.entries(webRelease.LEGACY)) {
			expect(rules).toContainEqual([`/${oldName}`, `/Src/Pages/${name}`]);
			expect(rules).toContainEqual([
				`/Src/Pages/${oldName}`,
				`/Src/Pages/${name}`
			]);
		}
	});

	it("should have no chains, loops or duplicate sources", () => {
		const sources = rules.map(([source]) => source);
		expect(new Set(sources).size).toBe(sources.length);
		for (const [, target] of rules) {
			expect(sources).not.toContain(target);
		}
	});
});
