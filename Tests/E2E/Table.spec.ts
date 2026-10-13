import { test, expect, Page } from "@playwright/test";
import * as fs from "fs";
import {
	CollectPageErrors,
	ExpectNotification,
	ImportFiles,
	PageUrl,
	TestFile,
	ViewTable
} from "./Helpers";

const SHOT_LOADED = "Benchmarks loaded with following files: shotALL.trc";
const FIRST_CELL =
	"table#dataTableGenerated > tbody > tr:first-child > td:first-child";
const ROWS = "table#dataTableGenerated > tbody > tr";

test.describe("Table page", () => {
	let errors: string[];

	test.beforeEach(async ({ page }) => {
		errors = CollectPageErrors(page);
		await page.goto(PageUrl("report.html"));
	});

	test.afterEach(() => {
		expect(errors).toEqual([]);
	});

	/**
	 * Imports the files, expects the notification and shows the table.
	 */
	async function ImportAndView(
		page: Page,
		files: string[],
		notification: string
	): Promise<void> {
		await ImportFiles(page, files.map(TestFile));
		await ExpectNotification(page, notification);
		await ViewTable(page);
	}

	/**
	 * Deletes the stored configuration, through the modal that asks for it.
	 */
	async function DeleteConfiguration(page: Page): Promise<void> {
		await page.locator("#deleteLocalStorageButton").click();
		await page.locator("#deleteButtonInModal").click();
	}

	for (const demo of ["Demo_1", "Demo_2"]) {
		test(`Demo mode: ${demo}`, async ({ page }) => {
			await page.selectOption("#demoDataSelector", demo);
			await page.click("#demoModeButton");
			await ExpectNotification(page, "Using demo mode!");
			await expect(page.locator("#dataTableGenerated_wrapper")).toBeVisible({
				timeout: 60_000
			});
			await expect(page.locator("#demoDataSelector")).toBeDisabled();

			await DeleteConfiguration(page);

			// The message that the configuration is deleted can be hidden by the fading out of the one before it,
			// when the data is slow to load, so what is checked is that the data is gone.
			await expect
				.poll(() =>
					page.evaluate(() => [
						localStorage.getItem("DemoData"),
						localStorage.getItem("UserConfiguration")
					])
				)
				.toEqual([null, null]);
		});
	}

	test("Handle multiple trace files", async ({ page }) => {
		await ImportAndView(
			page,
			["shotALL.trc", "scipALL.trc", "pavitoALL.trc"],
			"Benchmarks loaded with following files: shotALL.trc, scipALL.trc, pavitoALL.trc"
		);
	});

	test("Handle instance information file", async ({ page }) => {
		await ImportAndView(
			page,
			["shotALL.trc", "instancedata.csv"],
			"Instance information succesfully loaded!"
		);
	});

	test("Handle solution file", async ({ page }) => {
		await ImportAndView(
			page,
			["shotALL.trc", "minlp.solu"],
			"Benchmarks loaded with following files: shotALL.trc, minlp.solu"
		);
	});

	test("Handle JSON-file", async ({ page }) => {
		await ImportFiles(page, [TestFile("UserConfiguration.json")]);
		await ExpectNotification(
			page,
			"Benchmarks loaded with following files: UserConfiguration.json"
		);
		await expect(page.locator("#dataTableGenerated_wrapper")).toBeVisible({
			timeout: 60_000
		});
	});

	test("Save to, load from and remove local storage", async ({ page }) => {
		await ImportAndView(page, ["shotALL.trc"], SHOT_LOADED);
		await page.locator("#saveLocalStorageButton").click();
		await page.reload();

		await ExpectNotification(page, "Found stored configuration!");
		await expect(
			page.locator("#downloadConfigurationButtonLayer")
		).toBeEnabled();
		await expect(page.locator("#deleteLocalStorageButton")).toBeEnabled();

		await DeleteConfiguration(page);
		await ExpectNotification(page, "Deleted configuration.");
	});

	test("Loading wrong file format", async ({ page }) => {
		await page.setInputFiles('input[type="file"]', TestFile("error.png"));
		const message =
			"Invalid file extension. Only .trc, .json, .solu, and .csv allowed.";
		await ExpectNotification(page, message);

		// The import stops with an error, which is the only one that is expected.
		expect(errors).toEqual([message]);
		errors.length = 0;
	});

	test("Select rows and filter table", async ({ page }) => {
		await ImportAndView(page, ["shotALL.trc"], SHOT_LOADED);

		const rows = page.locator(ROWS);
		for (const index of [0, 1, 2]) {
			await rows.nth(index).click({ modifiers: ["Control"] });
		}
		await page.locator("#showSelectedRowsButton").click();

		await expect(rows).toHaveCount(3);
	});

	test("Button status after viewing a table", async ({ page }) => {
		await ImportAndView(page, ["shotALL.trc"], SHOT_LOADED);

		for (const selector of [
			"#showSelectedRowsButton",
			"#saveLocalStorageButton",
			"#downloadConfigurationButtonLayer",
			"#configurationSettingsButton",
			"#deleteLocalStorageButton",
			"#clearTableButton"
		]) {
			await expect(page.locator(selector)).toBeVisible();
			await expect(page.locator(selector)).toBeEnabled();
		}
	});

	test("Download data", async ({ page }) => {
		await ImportAndView(page, ["shotALL.trc"], SHOT_LOADED);
		await page.locator("#saveLocalStorageButton").click();

		const [download] = await Promise.all([
			page.waitForEvent("download"),
			page.locator("#downloadConfigurationButton").click()
		]);

		expect(download.suggestedFilename()).toBe("UserConfiguration.json");
		const downloaded = JSON.parse(
			fs.readFileSync((await download.path()) ?? "", "utf8")
		) as { dataSet: unknown[]; dataFileType: string };
		expect(downloaded.dataFileType).toBe("json");
		expect(downloaded.dataSet.length).toBeGreaterThan(0);
	});

	test("Sort table and hide columns", async ({ page }) => {
		await ImportAndView(page, ["shotALL.trc"], SHOT_LOADED);
		const header = (title: string): ReturnType<Page["locator"]> =>
			page.locator(`th:visible:has(.dt-column-title:text-is("${title}"))`);

		await expect(page.locator(FIRST_CELL)).toHaveText("alan");

		// Problem is sorted ascending by default, clicking the header sorts descending.
		await header("Problem").click();
		await expect(page.locator(FIRST_CELL)).toHaveText(
			"watercontamination0303r"
		);

		await page.locator('button:has-text("Settings")').click();
		await page
			.locator('.dt-button-collection :text("Column Visibility")')
			.click();
		await page.locator('.dt-button-collection :text("2: Direction")').click();

		await expect(header("Direction")).toHaveCount(0);
		await expect(header("Problem")).toHaveCount(1);
	});

	test("Use pagination on the table", async ({ page }) => {
		await ImportAndView(page, ["shotALL.trc"], SHOT_LOADED);

		const activePage = page.locator(".dt-paging li.active button");
		await page.locator('.dt-paging button:text-is("2")').click();
		await expect(activePage).toHaveText("2");

		// The last page button is the total page count.
		const lastPageButton = page.locator(".dt-paging li:last-child button");
		const lastPage = await lastPageButton.innerText();
		expect(Number(lastPage)).toBeGreaterThan(2);
		await lastPageButton.click();
		await expect(activePage).toHaveText(lastPage);
	});

	test("Search in the displayed data", async ({ page }) => {
		await ImportAndView(page, ["shotALL.trc"], SHOT_LOADED);

		await page.locator(".dt-search input").fill("watercontamination");

		await expect(page.locator(ROWS)).toHaveCount(4);
	});
});
