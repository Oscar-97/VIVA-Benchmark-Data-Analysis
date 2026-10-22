import { test, expect, Page } from "@playwright/test";
import {
	ExpectNotification,
	ImportFiles,
	IsChartDrawn,
	PageUrl,
	PLOT_PAGES,
	TestFile,
	ViewTable
} from "./Helpers";

/**
 * Screenshots of the charts, the table and a modal, compared with the ones that are committed.
 *
 * How text and lines are drawn depends on the operating system, so the screenshots are only made on Linux, by the
 * workflow "Update screenshots", and only checked there (the project "visual" of playwright.config.ts).
 * One file is imported, so the order of the solvers, and with it the colors, is the same every time.
 */

const OPTIONS = {
	animations: "disabled",
	maxDiffPixelRatio: 0.01
} as const;

async function OpenWithData(page: Page, file: string): Promise<void> {
	await page.goto(PageUrl(file));
	await ImportFiles(page, [TestFile("shotALL.trc")]);
	await ExpectNotification(page, "Benchmarks loaded with following files");
}

async function ShowChart(page: Page): Promise<void> {
	await page.locator("#viewPlotsButton").click();
	await expect.poll(() => IsChartDrawn(page)).toBe(true);
}

test.describe("Screenshots", () => {
	for (const { name } of PLOT_PAGES) {
		test(`The chart of ${name}`, async ({ page }) => {
			await OpenWithData(page, `Src/Pages/${name}.html`);
			await ShowChart(page);

			await expect(page.locator("#myChart")).toHaveScreenshot(
				`chart-${name}.png`,
				OPTIONS
			);
		});
	}

	test("The chart of a plot page on a phone", async ({ page }) => {
		await page.setViewportSize({ width: 390, height: 844 });
		await OpenWithData(page, "Src/Pages/number_of_nodes.html");
		await ShowChart(page);
		// A notice about the screen size covers the chart until it is closed.
		await page.locator("#desktopToast .btn-close").click();
		await expect(page.locator("#desktopToast")).toBeHidden();

		await expect(page.locator("#myChart")).toHaveScreenshot(
			"chart-number_of_nodes-phone.png",
			OPTIONS
		);
	});

	test("The table of the report page", async ({ page }) => {
		await OpenWithData(page, "report.html");
		await ViewTable(page);

		await expect(page.locator("#dataTableGenerated_wrapper")).toHaveScreenshot(
			"table.png",
			OPTIONS
		);
	});

	test("The modal that asks to delete the data", async ({ page }) => {
		await OpenWithData(page, "report.html");
		await ViewTable(page);
		await page.locator("#saveLocalStorageButton").click();
		await page.locator("#deleteLocalStorageButton").click();

		const modal = page.locator("#deleteDataModal .modal-content");
		await expect(modal).toBeVisible();
		await expect(modal).toHaveScreenshot("modal-delete.png", OPTIONS);
	});
});
