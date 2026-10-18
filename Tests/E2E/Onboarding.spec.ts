import { test, expect, Page } from "@playwright/test";
import {
	CollectPageErrors,
	ExpectNotification,
	ImportFiles,
	PageUrl,
	PLOT_PAGES,
	TestFile
} from "./Helpers";

const PAGES = [
	"report.html",
	"Src/Pages/compare_solvers.html",
	...PLOT_PAGES.map(({ name }) => `Src/Pages/${name}.html`)
];

/**
 * Drops a file on the page, as a user does with a file from the file manager.
 */
async function DropFile(
	page: Page,
	name: string,
	content: string
): Promise<void> {
	const dataTransfer = await page.evaluateHandle(
		({ name, content }) => {
			const transfer = new DataTransfer();
			transfer.items.add(new File([content], name));
			return transfer;
		},
		{ name, content }
	);
	await page.dispatchEvent("body", "dragenter", { dataTransfer });
	await page.dispatchEvent("body", "drop", { dataTransfer });
}

/**
 * The top or bottom edge of an element, relative to the page.
 */
async function EdgeOf(
	page: Page,
	selector: string,
	edge: "top" | "bottom"
): Promise<number> {
	return page.locator(selector).evaluate((element, side) => {
		return element.getBoundingClientRect()[side];
	}, edge);
}

test.describe("Empty state", () => {
	let errors: string[];

	test.beforeEach(({ page }) => {
		errors = CollectPageErrors(page);
	});

	test.afterEach(() => {
		expect(errors).toEqual([]);
	});

	for (const { file, controls } of [
		{ file: "Src/Pages/termination_status.html", controls: "#statusSelector" },
		{
			file: "Src/Pages/termination_status.html",
			controls: "#chartTypeSelector"
		},
		{ file: "Src/Pages/solution_quality.html", controls: "#categorySelector" }
	]) {
		test(`${file} shows ${controls} below the buttons and above the empty state`, async ({
			page
		}) => {
			await page.goto(PageUrl(file));
			const buttonsBottom = await EdgeOf(page, "#buttonContainer", "bottom");
			const controlTop = await EdgeOf(page, controls, "top");
			const emptyStateTop = await EdgeOf(page, "#emptyState", "top");
			expect(controlTop).toBeGreaterThanOrEqual(buttonsBottom);
			expect(controlTop).toBeLessThan(emptyStateTop);
		});
	}

	for (const file of PAGES) {
		test(`${file} explains how to load data, until data is loaded`, async ({
			page
		}) => {
			await page.goto(PageUrl(file));
			const emptyState = page.locator("#emptyState");
			await expect(emptyState).toBeVisible();
			await expect(emptyState).toContainText("Load benchmark data");

			await ImportFiles(page, [TestFile("shotALL.trc")]);

			await ExpectNotification(page, "Benchmarks loaded with following files");
			await expect(emptyState).toBeHidden();
		});
	}

	test("The table page shows the explanation again after the table is cleared", async ({
		page
	}) => {
		await page.goto(PageUrl("report.html"));
		await ImportFiles(page, [TestFile("shotALL.trc")]);
		await page.locator("#viewTableButton").click();
		await expect(page.locator("#dataTableGenerated_wrapper")).toBeVisible();

		await page.locator("#clearTableButton").click();
		await page.locator("#clearTableButtonInModal").click();

		await expect(page.locator("#emptyState")).toBeVisible();
	});

	for (const file of ["report.html", "Src/Pages/solver_time.html"]) {
		test(`The demo button of ${file} loads demo data`, async ({ page }) => {
			await page.goto(PageUrl(file));

			await page.locator("#emptyStateDemoButton").click();

			await ExpectNotification(page, "Using demo mode!");
			await expect(page.locator("#emptyState")).toBeHidden();
		});
	}
});

test.describe("Upload feedback", () => {
	test("A dropped file is checked and read like a chosen one, and the files are listed", async ({
		page
	}) => {
		const errors = CollectPageErrors(page);
		await page.goto(PageUrl("report.html"));

		await DropFile(page, "run.trc", "line");

		await expect(page.locator("#loadStatus")).toContainText(
			"Ready to upload: 1 file (4 B): run.trc"
		);
		await expect(page.locator("#importDataButton")).toBeEnabled();
		expect(
			await page.evaluate(() => document.body.classList.contains("drop-active"))
		).toBe(false);
		expect(errors).toEqual([]);
	});

	test("A dropped file with a wrong extension is refused", async ({ page }) => {
		const errors = CollectPageErrors(page);
		await page.goto(PageUrl("report.html"));

		await DropFile(page, "picture.png", "x");

		const message =
			"Invalid file extension. Only .trc, .json, .solu, and .csv allowed.";
		await ExpectNotification(page, message);
		await expect(page.locator("#loadStatus")).toBeEmpty();
		// The check stops the import with an error, as it does for a chosen file.
		expect(errors).toEqual([message]);
	});

	test("A file that is dragged over the page shows where to drop it", async ({
		page
	}) => {
		await page.goto(PageUrl("report.html"));
		const dataTransfer = await page.evaluateHandle(() => {
			const transfer = new DataTransfer();
			transfer.items.add(new File(["x"], "run.trc"));
			return transfer;
		});

		await page.dispatchEvent("body", "dragenter", { dataTransfer });
		await expect(page.locator("body")).toHaveClass(/drop-active/);

		await page.dispatchEvent("body", "dragleave", { dataTransfer });
		await expect(page.locator("body")).not.toHaveClass(/drop-active/);
	});

	test("A configuration file that is not valid leaves no line about files that are ready", async ({
		page
	}) => {
		const errors = CollectPageErrors(page);
		await page.goto(PageUrl("report.html"));

		await DropFile(page, "broken.json", "{ not json");

		await ExpectNotification(page, "broken.json: The file is not valid JSON.");
		await expect(page.locator("#loadStatus")).toBeEmpty();
		await expect(page.locator("#importDataButton")).toBeDisabled();
		expect(errors).toEqual([]);
	});
});

test.describe("Demo data and saved data", () => {
	async function SaveOwnData(page: Page): Promise<void> {
		await page.goto(PageUrl("report.html"));
		await ImportFiles(page, [TestFile("shotALL.trc")]);
		await page.locator("#viewTableButton").click();
		await expect(page.locator("#dataTableGenerated_wrapper")).toBeVisible();
		await page.locator("#saveLocalStorageButton").click();
		await page.reload();
		await ExpectNotification(page, "Found stored configuration!");
	}

	test("Asks before the saved data is replaced, and keeps it on cancel", async ({
		page
	}) => {
		await SaveOwnData(page);
		// The explanation is hidden when data is restored, so the button of the navigation bar is used.
		await page.locator("#demoModeButton").click();

		const modal = page.locator("#replaceDataModal");
		await expect(modal).toBeVisible();
		await modal.getByRole("button", { name: "Cancel" }).click();
		await expect(modal).toBeHidden();

		expect(
			await page.evaluate(() => [
				localStorage.getItem("DemoData"),
				localStorage.getItem("UserConfiguration") !== null
			])
		).toEqual([null, true]);
	});

	test("Replaces the saved data with the demo data when that is confirmed", async ({
		page
	}) => {
		await SaveOwnData(page);
		await page.locator("#demoModeButton").click();

		await page.locator("#replaceDataButtonInModal").click();

		// The page loads again with the demo data. The notification is not shown in a session that has
		// shown the one for the saved data, so the demo mode is recognized by the data and the disabled selector.
		await expect(page.locator("#demoDataSelector")).toBeDisabled();
		expect(
			await page.evaluate(() => localStorage.getItem("DemoData"))
		).not.toBeNull();
	});
});
