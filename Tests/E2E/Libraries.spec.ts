import { test, expect, Page } from "@playwright/test";
import {
	CollectPageErrors,
	ExpectNotification,
	ImportFiles,
	PageUrl,
	TestFile,
	ViewTable
} from "./Helpers";

/**
 * The cell of the table in the row (from 1) and the column (from 1).
 */
function Cell(
	page: Page,
	row: number,
	column: number
): ReturnType<Page["locator"]> {
	return page.locator(
		`table#dataTableGenerated > tbody > tr:nth-child(${row}) > td:nth-child(${column})`
	);
}

/**
 * Shows the ProblemDualBound (4) and ProblemPrimalBound (5) columns, which are hidden at first.
 */
async function ShowProblemCells(page: Page): Promise<void> {
	await page.locator('button:has-text("Settings")').click();
	await page
		.locator('.dt-button-collection :text("Column Visibility")')
		.click();
	await page.locator('.dt-button-collection li[data-cv-idx="3"] a').click();
	await page.locator('.dt-button-collection li[data-cv-idx="4"] a').click();
}

test.describe("Problem libraries", () => {
	const libraries = [
		{
			library: "MINLPLib",
			problem: "alkylation",
			row: 3,
			bound: "1.768807e+3"
		},
		{
			library: "MIPLIB_2017",
			problem: "50v-10",
			row: 2,
			bound: "3.311180e+3"
		},
		{
			library: "MIPLIB_2010",
			problem: "30_70_45_095_100",
			row: 1,
			bound: "3.000000e+0"
		}
	];

	for (const { library, problem, row, bound } of libraries) {
		test(`Use the ${library} option: ${problem} gets its bounds`, async ({
			page
		}) => {
			const errors = CollectPageErrors(page);
			await page.goto(PageUrl("report.html"));

			await ImportFiles(page, [TestFile("library_test.trc")], library);
			await ExpectNotification(
				page,
				"Benchmarks loaded with following files: library_test.trc"
			);
			await ViewTable(page);
			await ShowProblemCells(page);

			// The primal bound of the problem is in the column 5, the dual bound in the column 4.
			await expect(Cell(page, row, 5)).toHaveText(bound);
			await expect(Cell(page, row, 4)).toHaveText(bound);
			expect(errors).toEqual([]);
		});
	}

	test("The table is shown after the upload, with a summary of the data", async ({
		page
	}) => {
		const errors = CollectPageErrors(page);
		await page.goto(PageUrl("report.html"));

		await ImportFiles(page, [TestFile("library_test.trc")], "MINLPLib");

		await expect(page.locator("#dataTableGenerated_wrapper")).toBeVisible();
		await expect(page.locator("#loadStatus")).toContainText(
			/\d+ solvers? · \d+ instances? · bounds: MINLPLib/
		);
		expect(errors).toEqual([]);
	});

	test("An uploaded .solu file is shown as the source of the bounds", async ({
		page
	}) => {
		const errors = CollectPageErrors(page);
		await page.goto(PageUrl("report.html"));
		const selector = page.locator("#librarySelector");
		await expect(page.getByLabel("Best-known bounds")).toBeVisible();

		await page.setInputFiles('input[type="file"]', [
			TestFile("library_test.trc"),
			TestFile("minlp.solu")
		]);
		await expect(selector).toHaveValue("solu");
		await expect(selector).toBeDisabled();

		await page.setInputFiles('input[type="file"]', [
			TestFile("library_test.trc")
		]);
		await expect(selector).toHaveValue("none");
		await expect(selector).toBeEnabled();
		expect(errors).toEqual([]);
	});
});
