import { test, expect, Page } from "@playwright/test";
import {
	ExpectNotification,
	ImportFiles,
	IsChartDrawn,
	PageUrl,
	PLOT_PAGES,
	ReadChartData,
	TestFile,
	THREE_TRACES,
	ViewTable
} from "./Helpers";

const PAGES = [
	"report.html",
	"Src/Pages/compare_solvers.html",
	...PLOT_PAGES.map(({ name }) => `Src/Pages/${name}.html`)
];

/**
 * Collects what the browser reports about the Content-Security-Policy of the pages: a blocked script, style,
 * image or request. The application is expected to need nothing that the policy does not allow.
 */
function CollectViolations(page: Page): string[] {
	const violations: string[] = [];
	page.on("console", (message) => {
		if (/Content Security Policy/i.test(message.text())) {
			violations.push(message.text());
		}
	});
	return violations;
}

test.describe("Content-Security-Policy", () => {
	for (const file of PAGES) {
		test(`${file} has a policy, and nothing on the page is blocked by it`, async ({
			page
		}) => {
			const violations = CollectViolations(page);
			await page.goto(PageUrl(file));
			await expect(
				page.locator('meta[http-equiv="Content-Security-Policy"]')
			).toHaveCount(1);
			// The theme script is the one inline script, and the policy allows it by its hash.
			await expect(page.locator("html")).toHaveAttribute("data-bs-theme", /.+/);
			expect(violations).toEqual([]);
		});
	}

	test("A chart page with data, its table and its download are not blocked", async ({
		page
	}) => {
		const violations = CollectViolations(page);
		await page.goto(PageUrl("Src/Pages/performance_profile.html"));
		await ImportFiles(page, [TestFile("shotALL.trc")]);
		await ExpectNotification(page, "Benchmarks loaded with following files");
		await expect.poll(() => IsChartDrawn(page)).toBe(true);
		await page.locator("#chartTableToggleButton").click();
		await expect(page.locator("#chartDataTableContainer")).toBeVisible();

		expect((await ReadChartData(page)).length).toBeGreaterThan(0);
		expect(violations).toEqual([]);
	});

	test("The table page with data is not blocked", async ({ page }) => {
		const violations = CollectViolations(page);
		await page.goto(PageUrl("report.html"));
		await ImportFiles(page, THREE_TRACES);
		await ViewTable(page);

		expect(violations).toEqual([]);
	});

	test("The policy blocks an inline script that it does not know", async ({
		page
	}) => {
		const violations = CollectViolations(page);
		await page.goto(PageUrl("report.html"));
		await page.evaluate(() => {
			const script = document.createElement("script");
			script.textContent = "document.title = 'injected';";
			document.head.appendChild(script);
		});

		expect(await page.title()).not.toBe("injected");
		await expect.poll(() => violations.length).toBeGreaterThan(0);
	});
});
