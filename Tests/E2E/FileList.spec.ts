import { test, expect } from "@playwright/test";
import { CollectPageErrors, PageUrl, TestFile } from "./Helpers";

test.describe("Chosen files", () => {
	test("The explanation lists the chosen files with their type and solver", async ({
		page
	}) => {
		const errors = CollectPageErrors(page);
		await page.goto(PageUrl("report.html"));
		const list = page.locator("#selectedFiles");
		await expect(list).toBeEmpty();

		await page.setInputFiles('input[type="file"]', [
			TestFile("shotALL.trc"),
			TestFile("instancedata.csv"),
			TestFile("minlp.solu")
		]);

		await expect(list.locator("li")).toHaveCount(3);
		await expect(list).toContainText("shotALL.trc");
		await expect(list).toContainText("Trace file, solver shot");
		await expect(list).toContainText("Instance information");
		await expect(list).toContainText("Best-known bounds");
		await expect(list.locator(".text-danger")).toHaveCount(0);
		expect(errors).toEqual([]);
	});

	test("The explanation says what stops the files from being uploaded", async ({
		page
	}) => {
		const errors = CollectPageErrors(page);
		await page.goto(PageUrl("report.html"));

		await page.setInputFiles('input[type="file"]', [
			TestFile("shotALL.trc"),
			TestFile("UserConfiguration.json")
		]);

		await expect(page.locator("#selectedFiles")).toContainText(
			"Cannot upload both .trc and .json files simultaneously."
		);
		await expect(page.locator("#importDataButton")).toBeDisabled();
		// The upload reports the same problem as an error.
		expect(errors).toEqual([
			"Cannot upload both .trc and .json files simultaneously."
		]);
	});

	test("A file that is not supported is named", async ({ page }) => {
		const errors = CollectPageErrors(page);
		await page.goto(PageUrl("report.html"));

		await page.setInputFiles('input[type="file"]', TestFile("error.png"));

		await expect(page.locator("#selectedFiles")).toContainText("error.png");
		await expect(page.locator("#selectedFiles")).toContainText(
			"Invalid file extension"
		);
		errors.length = 0;
	});

	test("The explanation is a button for choosing files", async ({ page }) => {
		await page.goto(PageUrl("report.html"));

		const chooser = page.waitForEvent("filechooser");
		await page.locator("#emptyStateChooseButton").click();

		expect((await chooser).isMultiple()).toBe(true);
	});

	test("The list goes away with the explanation when the files are uploaded", async ({
		page
	}) => {
		await page.goto(PageUrl("report.html"));
		await page.setInputFiles('input[type="file"]', TestFile("shotALL.trc"));
		await expect(page.locator("#selectedFiles li")).toHaveCount(1);

		await expect(page.locator("#importDataButton")).toBeEnabled();
		await page.locator("#importDataButton").click();

		await expect(page.locator("#emptyState")).toBeHidden();
	});
});
