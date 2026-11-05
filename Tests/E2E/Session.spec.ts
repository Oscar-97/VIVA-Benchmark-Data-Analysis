import { test, expect } from "@playwright/test";
import {
	ClickDataMenuItem,
	CollectPageErrors,
	ExpectNotification,
	ImportFiles,
	IsChartDrawn,
	PageUrl,
	TestFile,
	ViewTable
} from "./Helpers";

const INDICATOR = "#sessionIndicator";

test.describe("Data of the session", () => {
	test("The data follows the user to the other pages", async ({ page }) => {
		const errors = CollectPageErrors(page);
		await page.goto(PageUrl("report.html"));
		await expect(page.locator(INDICATOR)).toBeHidden();

		await ImportFiles(page, [TestFile("shotALL.trc")]);
		await ViewTable(page);
		await expect(page.locator(INDICATOR)).toBeVisible();
		await expect(page.locator(INDICATOR)).toContainText("1 solver");

		await page.goto(PageUrl("Src/Pages/performance_profile.html"));
		await ExpectNotification(page, "Restored the data of this session.");
		await expect(page.locator("#emptyState")).toBeHidden();
		await expect(page.locator(INDICATOR)).toBeVisible();
		await expect.poll(() => IsChartDrawn(page)).toBe(true);

		await page.goto(PageUrl("report.html"));
		await expect(page.locator("#dataTableGenerated_wrapper")).toBeVisible();
		expect(errors).toEqual([]);
	});

	test("The data of the session can be saved in the browser from another page", async ({
		page
	}) => {
		await page.goto(PageUrl("report.html"));
		await ImportFiles(page, [TestFile("shotALL.trc")]);
		await ViewTable(page);

		await page.goto(PageUrl("Src/Pages/performance_profile.html"));
		await expect.poll(() => IsChartDrawn(page)).toBe(true);
		await ClickDataMenuItem(page, "#saveLocalStorageButton");
		await expect(page.locator(INDICATOR)).toBeHidden();

		// The saved data is what is shown from now on.
		await page.goto(PageUrl("report.html"));
		await ExpectNotification(page, "Found stored configuration!");
		await expect(page.locator("#dataTableGenerated_wrapper")).toBeVisible();
	});

	test("Clearing the data of the session shows the empty page again", async ({
		page
	}) => {
		await page.goto(PageUrl("report.html"));
		await ImportFiles(page, [TestFile("shotALL.trc")]);
		await ViewTable(page);

		await page.locator("#clearSessionDataButton").click();

		await expect(page.locator("#emptyState")).toBeVisible();
		await expect(page.locator(INDICATOR)).toBeHidden();
		await page.goto(PageUrl("Src/Pages/solver_time.html"));
		await expect(page.locator("#emptyState")).toBeVisible();
	});

	test("New data replaces the data of the session", async ({ page }) => {
		await page.goto(PageUrl("report.html"));
		await ImportFiles(page, [TestFile("shotALL.trc")]);
		await ViewTable(page);

		await page.goto(PageUrl("Src/Pages/solver_time.html"));
		await expect(page.locator("#emptyState")).toBeHidden();
		await page.reload();
		await expect(page.locator(INDICATOR)).toContainText("1 solver");
	});
});
