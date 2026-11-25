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

	test("The page shows the limits that the comparison uses, and what to do", async ({
		page
	}) => {
		await expect(page.locator("#defaultTimeDirectInput")).toHaveValue("1000");
		await expect(page.locator("#gapLimitDirectInput")).toHaveValue("0.01");
		await expect(page.locator("#compareHint")).toBeVisible();
		await expect(page.locator("#compareHint")).toContainText(
			"Tick two solvers"
		);

		await page.locator("#shot").check();
		await page.locator("#scip").check();
		await page.locator("#compareSolversButton").click();
		await expect(page.locator("#comparisonTable table")).toBeVisible();
		await expect(page.locator("#compareHint")).toBeHidden();
	});

	test("The caption of the comparison says what it was made with", async ({
		page
	}) => {
		await page.locator("#terminationTypeSelector").selectOption("3");
		await page.locator("#gapTypeSelector").selectOption("DualGap");
		await page.locator("#defaultTimeDirectInput").fill("500");
		await page.locator("#gapLimitDirectInput").fill("5");
		await page.locator("#shot").check();
		await page.locator("#scip").check();
		await page.locator("#compareSolversButton").click();

		await expect(page.locator("#comparisonTable caption")).toContainText(
			"Settings: Resource Interrupt, Dual Gap <= 5 %, time limit 500 s."
		);
	});

	test("The button compares when exactly two solvers are ticked", async ({
		page
	}) => {
		const button = page.locator("#compareSolversButton");
		await expect(button).toBeDisabled();
		await expect(button).toHaveAttribute("title", /Tick two solvers/);

		await page.locator("#shot").check();
		await expect(button).toBeDisabled();

		await page.locator("#scip").check();
		await expect(button).toBeEnabled();
		await expect(button).toHaveAttribute(
			"title",
			"Compare the selected solvers."
		);

		await page.locator("#scip").uncheck();
		await expect(button).toBeDisabled();
	});

	test("The error of a third solver is gone after a correct comparison", async ({
		page
	}) => {
		await page.locator("#shot").check();
		await page.locator("#scip").check();
		await page.locator("#pavito").click();
		await ExpectNotification(
			page,
			"Please select exactly two solvers to compare."
		);

		await page.locator("#compareSolversButton").click();
		await expect(page.locator("#comparisonTable table")).toBeVisible();
		await expect(page.locator("#alertNotification")).toBeHidden();
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

/**
 * The space between the last control and the line below the buttons.
 */
async function GapBelowControls(page: Page, control: string): Promise<number> {
	return page.evaluate((id) => {
		const input = document.querySelector(id);
		const line = document.querySelector("#buttonContainer ~ hr");
		return line && input
			? line.getBoundingClientRect().top - input.getBoundingClientRect().bottom
			: -1;
	}, control);
}

test.describe("Compare solvers page without data", () => {
	test("has no empty row for the solvers between the inputs and the line", async ({
		page
	}) => {
		await page.goto(PageUrl("Src/Pages/compare_solvers.html"));
		await expect(page.locator("#gapTypeSelector")).toBeVisible();
		await expect(page.locator("#solverOptions")).toBeHidden();
		const gap = await GapBelowControls(page, "#gapTypeSelector");

		// The same space as on a page with a row of controls only.
		await page.goto(PageUrl("Src/Pages/solution_quality.html"));
		const reference = await GapBelowControls(page, "#categorySelector");
		expect(gap).toBeGreaterThanOrEqual(0);
		expect(Math.abs(gap - reference)).toBeLessThanOrEqual(2);
	});
});
