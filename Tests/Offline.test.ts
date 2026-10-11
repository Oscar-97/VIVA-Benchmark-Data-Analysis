import { chromium, Browser, BrowserContext, Page } from "playwright";
import * as fs from "fs";
import * as http from "http";
import * as path from "path";
import { AddressInfo } from "net";

const root = path.resolve(__dirname, "..");

const contentTypes: Record<string, string> = {
	".html": "text/html; charset=utf-8",
	".js": "text/javascript; charset=utf-8",
	".css": "text/css; charset=utf-8",
	".json": "application/json; charset=utf-8",
	".png": "image/png"
};

/**
 * Serves the application from the root folder. "/" is the report page, like on the hosting of the application.
 */
function StartServer(): Promise<http.Server> {
	const server = http.createServer((request, response) => {
		const requested = decodeURIComponent((request.url ?? "/").split("?")[0]);
		const file = path.join(root, requested === "/" ? "report.html" : requested);
		if (
			!file.startsWith(root) ||
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
	const source = fs.readFileSync(path.join(root, "service-worker.js"), "utf8");
	const cacheName = /const CACHE_NAME = "([^"]+)"/.exec(source)?.[1] ?? "";
	const list = /const filesToCache = \[([\s\S]*?)\];/.exec(source)?.[1] ?? "";
	const files = [...list.matchAll(/"([^"]+)"/g)].map((match) => match[1]);
	return { cacheName, files };
}

describe("Offline use", () => {
	let server: http.Server;
	let baseUrl: string;
	let browser: Browser;
	let context: BrowserContext;
	let page: Page;

	beforeAll(async () => {
		server = await StartServer();
		baseUrl = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
		browser = await chromium.launch({ headless: true });
		context = await browser.newContext({
			serviceWorkers: "allow",
			viewport: { width: 2560, height: 1440 }
		});
		page = await context.newPage();
	});

	/**
	 * Takes the application offline by stopping the server. Playwright's `context.setOffline` does not
	 * apply to the requests of the service worker, so it would hide files that are not in the cache.
	 */
	function GoOffline(): void {
		server.close();
		server.closeAllConnections();
	}

	afterAll(async () => {
		await browser.close();
		if (server.listening) {
			await new Promise((resolve) => server.close(resolve));
		}
	});

	test("The service worker caches every file it lists, in a cache with the generated name", async () => {
		await page.goto(`${baseUrl}/report.html`);
		await page.evaluate(async () => {
			await navigator.serviceWorker.ready;
		});

		const expected = ReadServiceWorker();
		expect(expected.files.length).toBeGreaterThan(10);

		const cached = await page.evaluate(async () => {
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

		// Only the cache of this version exists, and it holds exactly the listed files.
		expect(Object.keys(cached)).toEqual([expected.cacheName]);
		const listed = expected.files.map((file) =>
			file === "/" ? "/" : `/${file}`
		);
		expect([...cached[expected.cacheName]].sort()).toEqual([...listed].sort());
	}, 60000);

	test("The application works without a network connection, with demo data and a library", async () => {
		GoOffline();
		await page.reload();
		expect(await page.title()).toBe("Report");

		// The demo data is in a chunk of its own that has to come from the cache.
		await page.selectOption("#demoDataSelector", "Demo_1");
		await page.click("#demoModeButton");
		await page.waitForSelector("#dataTableGenerated_wrapper", {
			state: "visible",
			timeout: 60000
		});

		// So are the problem libraries. Start without the demo data that was just stored.
		await page.evaluate(() => {
			localStorage.clear();
			sessionStorage.clear();
		});
		await page.reload();
		await page.setInputFiles(
			'input[type="file"]',
			path.join(root, "Tests/TestData/library_test.trc")
		);
		await page.waitForTimeout(2000);
		await page.selectOption("#librarySelector", "MINLPLib");
		await page.click("#importDataButton");
		await page.waitForSelector("#viewTableButton:not([disabled])", {
			timeout: 20000
		});
		await page.click("#viewTableButton");
		await page.waitForSelector("#dataTableGenerated_wrapper", {
			state: "visible",
			timeout: 60000
		});
	}, 120000);
});
