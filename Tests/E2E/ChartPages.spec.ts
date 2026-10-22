import { test, expect, Page } from "@playwright/test";
import { At } from "../TestHelpers";
import {
	CollectPageErrors,
	ExpectNotification,
	ImportFiles,
	IsChartDrawn,
	PageUrl,
	PLOT_PAGES,
	ReadChartData,
	THREE_TRACES,
	ViewTable
} from "./Helpers";

const instances = { shot: 335, scip: 335, pavito: 332 };

/**
 * Opens a page of the application and imports the three traces. Returns the errors that the page throws.
 */
async function OpenWithData(page: Page, file: string): Promise<string[]> {
	const errors = CollectPageErrors(page);
	await page.goto(PageUrl(file));
	await ImportFiles(page, THREE_TRACES);
	await ExpectNotification(page, "Benchmarks loaded with following files");
	return errors;
}

/**
 * Shows the chart and waits until the data of the chart can be read.
 */
async function ShowChart(
	page: Page
): Promise<{ label: string; data: number[] }[]> {
	await page.locator("#viewPlotsButton").click();
	await expect.poll(() => IsChartDrawn(page)).toBe(true);
	return ReadChartData(page);
}

test.describe("Pages with data", () => {
	for (const { name, statistics } of PLOT_PAGES) {
		test(`${name} draws a chart without errors`, async ({ page }) => {
			const errors = await OpenWithData(page, `Src/Pages/${name}.html`);
			await page.locator("#viewPlotsButton").click();

			await expect.poll(() => IsChartDrawn(page)).toBe(true);
			if (statistics) {
				await expect(
					page.locator("#statisticsTable tbody tr").first()
				).toBeVisible();
			}
			expect(errors).toEqual([]);
		});
	}

	test("The termination status charts account for every instance of every solver", async ({
		page
	}) => {
		const errors = await OpenWithData(
			page,
			"Src/Pages/termination_status.html"
		);

		for (const status of ["ModelStatus", "SolverStatus"]) {
			await page.selectOption("#statusSelector", status);
			const chart = await ShowChart(page);

			// Each data set is a status and has a value per solver, so the values of a solver add up to its instances.
			const solverCount = At(chart, 0).data.length;
			const totals = Array.from({ length: solverCount }, (_, solver) =>
				chart.reduce(
					(sum, statusData) => sum + (statusData.data[solver] ?? 0),
					0
				)
			);
			const ascending = (a: number, b: number): number => a - b;
			expect(totals.sort(ascending)).toEqual(
				Object.values(instances).sort(ascending)
			);
		}
		expect(errors).toEqual([]);
	});

	test("The fail chart counts the instances that failed", async ({ page }) => {
		const errors = await OpenWithData(
			page,
			"Src/Pages/termination_status.html"
		);
		await page.selectOption("#statusSelector", "Fail");
		const chart = await ShowChart(page);

		expect(chart.map((set) => set.label)).toEqual(["Failed"]);
		// One of the three solvers has 9 failed instances.
		expect([...At(chart, 0).data].sort((a, b) => a - b)).toEqual([0, 0, 9]);
		expect(errors).toEqual([]);
	});

	test("Compare solvers compares two solvers and asks for exactly two", async ({
		page
	}) => {
		const errors = await OpenWithData(page, "Src/Pages/compare_solvers.html");
		const boxes = page.locator('#solverOptions input[type="checkbox"]');
		await expect(boxes).toHaveCount(3);
		const comparisonTables = page.locator("#comparisonTable table");

		// No solver, and one solver: an error, and no comparison (this used to throw).
		await page.locator("#compareSolversButton").click();
		await ExpectNotification(
			page,
			"Please select exactly two solvers to compare."
		);
		await expect(comparisonTables).toHaveCount(0);

		await boxes.nth(0).check();
		await page.locator("#compareSolversButton").click();
		await expect(comparisonTables).toHaveCount(0);

		// Two solvers: the comparison.
		await boxes.nth(1).check();
		await page.locator("#compareSolversButton").click();
		await expect(comparisonTables).toHaveCount(1);

		// The page does not let a third solver be selected.
		await boxes.nth(2).click();
		await expect(
			page.locator('#solverOptions input[type="checkbox"]:checked')
		).toHaveCount(2);
		expect(errors).toEqual([]);
	});

	test("The report page shows the table", async ({ page }) => {
		const errors = await OpenWithData(page, "report.html");
		await ViewTable(page);

		await expect(page.locator("#dataTableGenerated tbody tr")).toHaveCount(10);
		expect(errors).toEqual([]);
	});
});
