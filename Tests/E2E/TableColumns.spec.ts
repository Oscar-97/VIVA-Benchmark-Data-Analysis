import { test, expect, Page } from "@playwright/test";
import { CollectPageErrors, PageUrl, ViewTable } from "./Helpers";

const ROWS = "table#dataTableGenerated > tbody > tr";

/**
 * The header of a visible column of the table, by its title.
 */
function Header(page: Page, title: string): ReturnType<Page["locator"]> {
	return page.locator(`th:visible:has(.dt-column-title:text-is("${title}"))`);
}

test.describe("The columns of the table", () => {
	let errors: string[];

	test.beforeEach(async ({ page }) => {
		errors = CollectPageErrors(page);
		await page.goto(PageUrl("report.html"));
		await page.locator("#emptyStateDemoButton").click();
		await ViewTable(page);
	});

	test.afterEach(() => {
		expect(errors).toEqual([]);
	});

	test("The Columns button shows and hides columns", async ({ page }) => {
		await expect(Header(page, "Direction")).toHaveCount(1);

		await page.locator('.dt-buttons button:has-text("Columns")').click();
		await page.locator('.dt-button-collection :text("2: Direction")').click();

		await expect(Header(page, "Direction")).toHaveCount(0);
	});

	test("Numbers are to the right and text to the left", async ({ page }) => {
		const column = await page.evaluate(() =>
			[...document.querySelectorAll("#dataTableGenerated thead th")].findIndex(
				(th) => th.textContent?.trim() === "SolverDualBound"
			)
		);

		await expect(
			page.locator(`${ROWS} > td:nth-child(${column + 1})`).first()
		).toHaveCSS("text-align", /right|end/);
		await expect(page.locator(`${ROWS} > td:nth-child(1)`).first()).toHaveCSS(
			"text-align",
			/left|start/
		);
	});

	test("Numbers with an exponent are sorted by their value", async ({
		page
	}) => {
		const header = Header(page, "SolverDualBound");
		const column = await page.evaluate(() =>
			[...document.querySelectorAll("#dataTableGenerated thead th")].findIndex(
				(th) => th.textContent?.trim() === "SolverDualBound"
			)
		);

		await header.click();

		await expect(header).toHaveAttribute("aria-sort", "ascending");
		// -1.064118e+5 is before -1.000000e+4, though its characters come after.
		const values = (
			await page
				.locator(`${ROWS} > td:nth-child(${column + 1})`)
				.allInnerTexts()
		)
			.map(Number)
			.filter((value) => !Number.isNaN(value));
		expect(values.length).toBeGreaterThan(1);
		expect(values).toEqual([...values].sort((a, b) => a - b));

		await header.click();

		await expect(header).toHaveAttribute("aria-sort", "descending");
		const descending = (
			await page
				.locator(`${ROWS} > td:nth-child(${column + 1})`)
				.allInnerTexts()
		)
			.map(Number)
			.filter((value) => !Number.isNaN(value));
		expect(descending).toEqual([...descending].sort((a, b) => b - a));
	});
});
