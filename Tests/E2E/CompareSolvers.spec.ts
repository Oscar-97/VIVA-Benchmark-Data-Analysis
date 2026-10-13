import { test, expect, Page } from "@playwright/test";
import {
	CollectPageErrors,
	ExpectNotification,
	ImportFiles,
	PageUrl,
	THREE_TRACES
} from "./Helpers";

/**
 * The cell with the number in the row that has the label, for example the 102 solved better.
 */
function CountCell(
	page: Page,
	label: string,
	color: string,
	count: string
): ReturnType<Page["locator"]> {
	return page.locator(
		`xpath=//tbody/tr[td[contains(text(), '${label}')]]/td[contains(@class, '${color}') and contains(text(), '${count}')]`
	);
}

test.describe("Compare solvers page", () => {
	let errors: string[];

	test.beforeEach(async ({ page }) => {
		errors = CollectPageErrors(page);
		await page.goto(PageUrl("Src/Pages/compare_solvers.html"));
		await ImportFiles(page, THREE_TRACES);
		await ExpectNotification(
			page,
			"Benchmarks loaded with following files: shotALL.trc, scipALL.trc, pavitoALL.trc"
		);
		await expect(page.locator("#solverOptions")).toBeVisible();
	});

	test.afterEach(() => {
		expect(errors).toEqual([]);
	});

	test("Select solvers and compare them", async ({ page }) => {
		await page.locator("#scip").check();
		await page.locator("#shot").check();
		await page.locator("#compareSolversButton").click();
		await expect(page.locator("#comparisonTable")).toBeVisible();

		// The counts of one solver are the counts of the other the other way around.
		await expect(CountCell(page, "Better", "table-success", "102")).toHaveText(
			"102"
		);
		await expect(CountCell(page, "Better", "table-success", "183")).toHaveText(
			"183"
		);
		await expect(CountCell(page, "Worse", "table-danger", "183")).toHaveText(
			"183"
		);
		await expect(CountCell(page, "Worse", "table-danger", "102")).toHaveText(
			"102"
		);
		// Both solvers are equal on 4 instances, which is in the table once for each of them.
		await expect(CountCell(page, "Equal", "table-warning", "4")).toHaveText([
			"4",
			"4"
		]);
	});

	test("Select one solver and try to compare", async ({ page }) => {
		await page.locator("#shot").check();
		await page.locator("#compareSolversButton").click();

		await ExpectNotification(
			page,
			"Please select exactly two solvers to compare."
		);
	});

	test("Selecting a third solver is not possible", async ({ page }) => {
		for (const solver of ["#shot", "#scip", "#pavito"]) {
			await page.locator(solver).click();
		}

		await expect(
			page.locator('#solverOptions input[type="checkbox"]:checked')
		).toHaveCount(2);
	});
});
