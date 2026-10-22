import { test, expect, Browser, BrowserContext, Page } from "@playwright/test";
import * as fs from "fs";
import * as http from "http";
import * as path from "path";
import { AddressInfo } from "net";
import { ImportFiles, ROOT, TestFile, ViewTable } from "./Helpers";

const contentTypes: Record<string, string> = {
	".html": "text/html; charset=utf-8",
	".js": "text/javascript; charset=utf-8",
	".css": "text/css; charset=utf-8",
	".json": "application/json; charset=utf-8",
	".png": "image/png"
};

/**
 * Serves the application from the root folder. "/" is the report page, like on the hosting of the application.
 * A file in `overrides`, by its path, is served with the given text instead.
 */
function StartServer(
	overrides: Map<string, string> = new Map()
): Promise<http.Server> {
	const server = http.createServer((request, response) => {
		const requested = decodeURIComponent(
			(request.url ?? "/").split("?")[0] ?? "/"
		);
		const override = overrides.get(requested);
		if (override !== undefined) {
			response.writeHead(200, {
				"Content-Type": "text/javascript; charset=utf-8"
			});
			response.end(override);
			return;
		}
		const file = path.join(ROOT, requested === "/" ? "report.html" : requested);
		if (
			!file.startsWith(ROOT) ||
			!fs.existsSync(file) ||
			fs.statSync(file).isDirectory()
		) {
			response.writeHead(404).end();
			return;
		}
		response.writeHead(200, {
			"Content-Type":
				contentTypes[path.extname(file)] ?? "application/octet-stream"
		});
		fs.createReadStream(file).pipe(response);
	});
	return new Promise((resolve) =>
		server.listen(0, "127.0.0.1", () => resolve(server))
	);
}

/**
 * Reads the cache name and the files to cache from the generated block of the service worker.
 */
function ReadServiceWorker(): { cacheName: string; files: string[] } {
	const source = fs.readFileSync(path.join(ROOT, "service-worker.js"), "utf8");
	const cacheName = /const CACHE_NAME = "([^"]+)"/.exec(source)?.[1] ?? "";
	const list = /const filesToCache = \[([\s\S]*?)\];/.exec(source)?.[1] ?? "";
	const files = [...list.matchAll(/"([^"]+)"/g)].flatMap((match) =>
		match[1] ? [match[1]] : []
	);
	return { cacheName, files };
}

// The second test needs the service worker that the first one installs, and takes the server away.
test.describe.configure({ mode: "serial" });

test.describe("Offline use", () => {
	let server: http.Server;
	let baseUrl: string;
	let context: BrowserContext;
	let page: Page;

	test.beforeAll(async ({ browser }: { browser: Browser }) => {
		server = await StartServer();
		baseUrl = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
		context = await browser.newContext({
			serviceWorkers: "allow",
			viewport: { width: 2560, height: 1440 }
		});
		page = await context.newPage();
	});

	test.afterAll(async () => {
		await context?.close();
		if (server?.listening) {
			await new Promise((resolve) => server.close(resolve));
		}
	});

	/**
	 * Takes the application offline by stopping the server. Playwright's `context.setOffline` does not
	 * apply to the requests of the service worker, so it would hide files that are not in the cache.
	 */
	function GoOffline(): void {
		server.close();
		server.closeAllConnections();
	}

	test("The service worker caches every file it lists, in a cache with the generated name", async () => {
		await page.goto(`${baseUrl}/report.html`);
		await page.evaluate(async () => {
			await navigator.serviceWorker.ready;
		});

		const expected = ReadServiceWorker();
		expect(expected.files.length).toBeGreaterThan(10);

		// The files are cached when the worker installs, so wait until they are all there.
		const listed = expected.files.map((file) =>
			file === "/" ? "/" : `/${file}`
		);
		await expect
			.poll(async () => {
				const cached = await ReadCaches(page);
				return {
					names: Object.keys(cached),
					files: [...(cached[expected.cacheName] ?? [])].sort()
				};
			})
			// Only the cache of this version exists, and it holds exactly the listed files.
			.toEqual({ names: [expected.cacheName], files: [...listed].sort() });
	});

	test("The application works without a network connection, with demo data and a library", async () => {
		GoOffline();
		await page.reload();
		expect(await page.title()).toBe("Report");

		// The demo data is in a chunk of its own that has to come from the cache.
		await page.selectOption("#demoDataSelector", "Demo_1");
		await page.click("#demoModeButton");
		await expect(page.locator("#dataTableGenerated_wrapper")).toBeVisible({
			timeout: 60_000
		});

		// So are the problem libraries. Start without the demo data that was just stored.
		await page.evaluate(() => {
			localStorage.clear();
			sessionStorage.clear();
		});
		await page.reload();
		await ImportFiles(page, [TestFile("library_test.trc")], "MINLPLib");
		await expect(page.locator("#viewTableButton")).toBeEnabled();
		await ViewTable(page);
	});
});

/**
 * The files of every cache of the page, by the name of the cache.
 */
async function ReadCaches(page: Page): Promise<Record<string, string[]>> {
	return page.evaluate(async () => {
		const names = await caches.keys();
		const result: Record<string, string[]> = {};
		for (const name of names) {
			const cache = await caches.open(name);
			result[name] = (await cache.keys()).map(
				(request) => new URL(request.url).pathname
			);
		}
		return result;
	});
}

test.describe("Update of the service worker", () => {
	test("A new version replaces the cache of the old one", async ({
		browser
	}) => {
		const overrides = new Map<string, string>();
		const server = await StartServer(overrides);
		const baseUrl = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
		const context = await browser.newContext({ serviceWorkers: "allow" });
		const page = await context.newPage();

		try {
			await page.goto(`${baseUrl}/report.html`);
			await page.evaluate(async () => {
				await navigator.serviceWorker.ready;
			});
			const current = ReadServiceWorker();
			await expect
				.poll(async () => Object.keys(await ReadCaches(page)))
				.toEqual([current.cacheName]);

			// The next version of the application has another name for its cache.
			const nextName = `${current.cacheName}-next`;
			const source = fs.readFileSync(
				path.join(ROOT, "service-worker.js"),
				"utf8"
			);
			overrides.set(
				"/service-worker.js",
				source.replace(current.cacheName, nextName)
			);
			await page.evaluate(async () => {
				const registration = await navigator.serviceWorker.ready;
				await registration.update();
			});

			// The new version fills its cache, and the old one is deleted when it takes over.
			await expect
				.poll(async () => {
					const cached = await ReadCaches(page);
					return {
						names: Object.keys(cached),
						files: cached[nextName]?.length ?? 0
					};
				})
				.toEqual({ names: [nextName], files: current.files.length });
		} finally {
			await context.close();
			server.closeAllConnections();
			await new Promise((resolve) => server.close(resolve));
		}
	});
});
