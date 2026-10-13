import { test, expect, Page } from "@playwright/test";
import * as fs from "fs";
import {
	THREE_TRACES,
	CollectPageErrors,
	ExpectNotification,
	ImportFiles,
	PageUrl,
	PLOT_PAGES,
	TestFile,
	ViewTable
} from "./Helpers";

const PAGES = [
	"report.html",
	"Src/Pages/compare_solvers.html",
	...PLOT_PAGES.map(({ name }) => `Src/Pages/${name}.html`)
];

/**
 * The messages of the console with the level error, which a page writes when something fails.
 */
function CollectConsoleErrors(page: Page): string[] {
	const messages: string[] = [];
	page.on("console", (message) => {
		if (message.type() === "error") {
			messages.push(message.text());
		}
	});
	return messages;
}

test.describe("Pages", () => {
	for (const file of PAGES) {
		test(`${file} loads without errors`, async ({ page }) => {
			const errors = CollectPageErrors(page);
			const consoleErrors = CollectConsoleErrors(page);

			await page.goto(PageUrl(file));
			await expect(page.locator("#fileInput")).toBeVisible();

			expect(errors).toEqual([]);
			expect(consoleErrors).toEqual([]);
		});

		test(`${file} fits a phone without scrolling sideways`, async ({
			page
		}) => {
			await page.setViewportSize({ width: 390, height: 844 });
			await page.goto(PageUrl(file));
			await expect(page.locator("nav").first()).toBeVisible();

			const overflow = await page.evaluate(
				() =>
					document.documentElement.scrollWidth -
					document.documentElement.clientWidth
			);
			expect(overflow).toBeLessThanOrEqual(0);
		});
	}
});

test.describe("Modals", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto(PageUrl("report.html"));
		await ImportFiles(page, [TestFile("shotALL.trc")]);
		await ExpectNotification(page, "Benchmarks loaded with following files");
		await ViewTable(page);
	});

	test("The help modal explains the file formats, and closes", async ({
		page
	}) => {
		await page.locator('button[name="Help"]').click();

		const modal = page.locator("#fileFormatInformationModal");
		await expect(modal).toBeVisible();
		await expect(modal).toContainText("Result File Formats and Headers");

		await modal.locator(".btn-close").click();
		await expect(modal).toBeHidden();
	});

	test("Cancelling the delete modal keeps the stored data", async ({
		page
	}) => {
		await page.locator("#saveLocalStorageButton").click();
		await page.locator("#deleteLocalStorageButton").click();
		const modal = page.locator("#deleteDataModal");
		await expect(modal).toBeVisible();

		await modal.getByRole("button", { name: "Cancel" }).click();

		await expect(modal).toBeHidden();
		expect(
			await page.evaluate(() => localStorage.getItem("UserConfiguration"))
		).not.toBeNull();
	});

	test("Clearing the table asks first, and removes the table", async ({
		page
	}) => {
		await page.locator("#clearTableButton").click();
		const modal = page.locator("#clearDataTableModal");
		await expect(modal).toBeVisible();

		await modal.getByRole("button", { name: "Cancel" }).click();
		await expect(modal).toBeHidden();
		await expect(page.locator("#dataTableGenerated_wrapper")).toBeVisible();

		await page.locator("#clearTableButton").click();
		await page.locator("#clearTableButtonInModal").click();

		await expect(page.locator("#dataTableGenerated_wrapper")).toHaveCount(0);
	});
});

test.describe("Saved data", () => {
	test("A downloaded configuration gives the same table when it is uploaded", async ({
		page,
		browser
	}, testInfo) => {
		await page.goto(PageUrl("report.html"));
		await ImportFiles(page, [TestFile("shotALL.trc")]);
		await ExpectNotification(page, "Benchmarks loaded with following files");
		await ViewTable(page);
		const firstRows = await page
			.locator("#dataTableGenerated tbody tr")
			.allInnerTexts();
		await page.locator("#saveLocalStorageButton").click();

		const [download] = await Promise.all([
			page.waitForEvent("download"),
			page.locator("#downloadConfigurationButton").click()
		]);
		// The application only takes files with the extension of their type.
		const file = testInfo.outputPath(download.suggestedFilename());
		await download.saveAs(file);
		expect(fs.statSync(file).size).toBeGreaterThan(0);

		// Another browser profile, which knows nothing about the first.
		const context = await browser.newContext();
		const other = await context.newPage();
		await other.goto(PageUrl("report.html"));
		await ImportFiles(other, [file]);
		await ExpectNotification(other, "Benchmarks loaded with following files");
		await expect(other.locator("#dataTableGenerated_wrapper")).toBeVisible({
			timeout: 60_000
		});

		expect(
			await other.locator("#dataTableGenerated tbody tr").allInnerTexts()
		).toEqual(firstRows);
		await context.close();
	});
});

test.describe("Customized download", () => {
	test("Downloads the instances of the selected solver, with the default time and gap limit", async ({
		page
	}, testInfo) => {
		await page.goto(PageUrl("report.html"));
		await ImportFiles(page, THREE_TRACES);
		await ExpectNotification(page, "Benchmarks loaded with following files");
		await ViewTable(page);

		await page.locator("#configurationSettingsButton").click();
		await page.locator("#solverSelector").selectOption("scip");
		await page.locator("#defaultTimeInput").fill("500");
		await page.locator("#gapLimitInput").fill("0.5");
		const [download] = await Promise.all([
			page.waitForEvent("download"),
			page.locator("#downloadCustomConfigurationButton").click()
		]);

		const file = testInfo.outputPath(download.suggestedFilename());
		await download.saveAs(file);
		const configuration = JSON.parse(fs.readFileSync(file, "utf8")) as {
			dataSet: string[];
			dataFileType: string;
			defaultTime: number;
			gapLimit: number;
		};
		expect(download.suggestedFilename()).toBe("UserConfiguration.json");
		expect(configuration).toMatchObject({
			dataFileType: "json",
			defaultTime: 500,
			gapLimit: 0.5
		});
		// Only the 335 instances of scip, and no line of the other solvers.
		const solverLines = configuration.dataSet.filter((line) =>
			line.includes("scip")
		);
		expect(solverLines.length).toBeGreaterThanOrEqual(335);
		expect(configuration.dataSet.some((line) => line.includes("shot"))).toBe(
			false
		);
		expect(configuration.dataSet.some((line) => line.includes("pavito"))).toBe(
			false
		);
	});
});
