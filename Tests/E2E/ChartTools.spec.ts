import { test, expect, Page } from "@playwright/test";
import {
	CollectPageErrors,
	ExpectNotification,
	ImportFiles,
	IsChartDrawn,
	PageUrl,
	THREE_TRACES
} from "./Helpers";

/**
 * Opens a plot page with the three traces, and shows the chart.
 */
async function ShowChart(page: Page, file: string): Promise<void> {
	await page.goto(PageUrl(file));
	await ImportFiles(page, THREE_TRACES);
	await ExpectNotification(page, "Benchmarks loaded with following files");
	await page.locator("#viewPlotsButton").click();
	await expect.poll(() => IsChartDrawn(page)).toBe(true);
}

test.describe("Chart tools", () => {
	let errors: string[];

	test.beforeEach(({ page }) => {
		errors = CollectPageErrors(page);
	});

	test.afterEach(() => {
		expect(errors).toEqual([]);
	});

	test("are hidden until a chart is drawn", async ({ page }) => {
		await page.goto(PageUrl("Src/Pages/solver_time.html"));

		await expect(page.locator("#chartTools")).toBeHidden();
	});

	test("describe the chart for a screen reader", async ({ page }) => {
		await ShowChart(page, "Src/Pages/solver_time.html");

		const canvas = page.locator("#myChart");
		await expect(canvas).toHaveAttribute("role", "img");
		await expect(canvas).toHaveAttribute(
			"aria-label",
			/^Solver time per Instance\. Data sets: .*shot/
		);
	});

	test("show and hide the data sets, and count the ones that are shown", async ({
		page
	}) => {
		await ShowChart(page, "Src/Pages/solver_time.html");
		const status = page.locator("#chartToolsStatus");
		await expect(status).toContainText("Scroll or pinch to zoom.");
		await expect(status).toContainText(/(\d+) of \1 data sets shown\./);
		await expect(page.locator("#showAllSeriesButton")).toBeDisabled();

		await page.locator("#hideAllSeriesButton").click();

		await expect(status).toContainText(/0 of \d+ data sets shown\./);
		await expect(page.locator("#hideAllSeriesButton")).toBeDisabled();
		await expect(page.locator("#showAllSeriesButton")).toBeEnabled();

		await page.locator("#showAllSeriesButton").click();

		await expect(status).toContainText(/(\d+) of \1 data sets shown\./);
		await expect(page.locator("#hideAllSeriesButton")).toBeEnabled();
	});

	test("keep count when a data set is hidden with the legend", async ({
		page
	}) => {
		await ShowChart(page, "Src/Pages/solver_time.html");
		const chart = page.locator("#myChart");
		const box = await chart.boundingBox();
		if (!box) throw new Error("The chart has no size.");

		// The legend is centered below the title, and its first entry is left of the middle.
		await page.mouse.click(box.x + box.width / 2 - 60, box.y + 60);

		await expect(page.locator("#chartToolsStatus")).toContainText(
			/\d+ of \d+ data sets shown\./
		);
		await expect(page.locator("#showAllSeriesButton")).toBeEnabled();
	});

	test("reset the zoom, and only offer to when the chart is zoomed", async ({
		page
	}) => {
		await ShowChart(page, "Src/Pages/solver_time.html");
		const reset = page.locator("#resetZoomButton");
		await expect(reset).toBeDisabled();
		const box = await page.locator("#myChart").boundingBox();
		if (!box) throw new Error("The chart has no size.");

		await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
		await page.mouse.wheel(0, -400);

		await expect(reset).toBeEnabled();

		await reset.click();

		await expect(reset).toBeDisabled();
	});

	test("keep the zoom and the hidden data sets when the theme changes", async ({
		page
	}) => {
		await ShowChart(page, "Src/Pages/solver_time.html");
		const reset = page.locator("#resetZoomButton");
		const box = await page.locator("#myChart").boundingBox();
		if (!box) throw new Error("The chart has no size.");
		await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
		await page.mouse.wheel(0, -400);
		await expect(reset).toBeEnabled();
		await page.locator("#hideAllSeriesButton").click();

		await page.locator("#themeToggleButton").click();

		await expect(reset).toBeEnabled();
		await expect(page.locator("#chartToolsStatus")).toContainText(
			/0 of \d+ data sets shown\./
		);
	});

	test("download the chart as an image", async ({ page }) => {
		await ShowChart(page, "Src/Pages/solver_time.html");

		const [download] = await Promise.all([
			page.waitForEvent("download"),
			page.locator("#downloadChartImageButton").click()
		]);

		expect(download.suggestedFilename()).toBe(
			"viva-solver-time-per-instance.png"
		);
		const stream = await download.createReadStream();
		const chunks: Buffer[] = [];
		for await (const chunk of stream) {
			chunks.push(chunk as Buffer);
		}
		// The first bytes of every PNG file.
		expect([...Buffer.concat(chunks).subarray(0, 4)]).toEqual([
			0x89, 0x50, 0x4e, 0x47
		]);
	});

	test("leave out the zoom on a chart that cannot be zoomed", async ({
		page
	}) => {
		await ShowChart(page, "Src/Pages/termination_status.html");
		await page.selectOption("#chartTypeSelector", "Radar");
		await page.locator("#viewPlotsButton").click();

		await expect(page.locator("#resetZoomButton")).toBeHidden();
		await expect(page.locator("#downloadChartImageButton")).toBeVisible();
	});
});
