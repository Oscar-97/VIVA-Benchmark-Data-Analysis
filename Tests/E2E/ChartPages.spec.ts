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

test.describe("Solution quality scale", () => {
	test("The chart can be shown on a logarithmic scale", async ({ page }) => {
		const errors = await OpenWithData(page, "Src/Pages/solution_quality.html");
		await expect.poll(() => IsChartDrawn(page)).toBe(true);
		await expect(page.locator("#scaleSelector")).toHaveValue("linear");

		await page.locator("#scaleSelector").selectOption("logarithmic");
		await page.locator("#viewPlotsButton").click();

		await expect.poll(() => IsChartDrawn(page)).toBe(true);
		expect(errors).toEqual([]);
	});

	test("The statistics have no long rows of digits", async ({ page }) => {
		const errors = await OpenWithData(page, "Src/Pages/solution_quality.html");
		await expect.poll(() => IsChartDrawn(page)).toBe(true);

		const cells = await page
			.locator("#statisticsTable_inner tbody td")
			.allInnerTexts();
		expect(cells.length).toBeGreaterThan(0);
		expect(cells.filter((cell) => /\d{13,}/.test(cell))).toEqual([]);
		expect(errors).toEqual([]);
	});
});

test.describe("Table of a chart with many solvers", () => {
	test("The names of the data sets and the headers stay in view when the table scrolls", async ({
		page
	}) => {
		const errors = CollectPageErrors(page);
		// Narrow enough that the table, with a column for each of the 20 solvers, is wider than the page.
		await page.setViewportSize({ width: 800, height: 900 });
		await page.goto(PageUrl("report.html"));
		await page.locator("#emptyStateDemoMinlpButton").click();
		await ViewTable(page);
		await page.goto(PageUrl("Src/Pages/solution_quality.html"));
		await expect.poll(() => IsChartDrawn(page)).toBe(true);
		await page.locator("#chartTableToggleButton").click();
		const container = page.locator("#chartDataTableContainer");
		await expect(container).toBeVisible();

		const positions = await container.evaluate((element) => {
			element.scrollLeft = 400;
			element.scrollTop = 50;
			const box = element.getBoundingClientRect();
			const header = element.querySelector("thead th:first-child");
			const name = element.querySelector("tbody tr:last-child td:first-child");
			const column = element.querySelector("thead th:last-child");
			return {
				scrolled: element.scrollLeft > 0,
				headerLeft: header?.getBoundingClientRect().left,
				nameLeft: name?.getBoundingClientRect().left,
				columnTop: column?.getBoundingClientRect().top,
				boxLeft: box.left,
				boxTop: box.top
			};
		});

		expect(positions.scrolled).toBe(true);
		expect(positions.headerLeft).toBeCloseTo(positions.boxLeft, 0);
		expect(positions.nameLeft).toBeCloseTo(positions.boxLeft, 0);
		expect(positions.columnTop).toBeCloseTo(positions.boxTop, 0);
		expect(errors).toEqual([]);
	});
});

test.describe("Chart for assistive technology", () => {
	test("The chart is described, with its kind, axes and data sets", async ({
		page
	}) => {
		const errors = await OpenWithData(
			page,
			"Src/Pages/performance_profile.html"
		);
		await expect.poll(() => IsChartDrawn(page)).toBe(true);

		const canvas = page.locator("#myChart");
		await expect(canvas).toHaveAttribute("role", "img");
		await expect(canvas).toHaveAttribute(
			"aria-label",
			/^Line chart: .*performance profile\. X axis: .+\. Y axis: .+\. Data sets: .*shot.*\./
		);
		expect(errors).toEqual([]);
	});

	for (const { name } of PLOT_PAGES) {
		test(`The values of the chart of ${name} are in a table`, async ({
			page
		}) => {
			const errors = await OpenWithData(page, `Src/Pages/${name}.html`);
			await expect.poll(() => IsChartDrawn(page)).toBe(true);
			const toggle = page.locator("#chartTableToggleButton");
			const container = page.locator("#chartDataTableContainer");
			await expect(container).toBeHidden();
			await expect(toggle).toHaveAttribute("aria-expanded", "false");

			await toggle.click();

			await expect(container).toBeVisible();
			await expect(toggle).toHaveAttribute("aria-expanded", "true");
			await expect(toggle).toContainText("Hide table");
			await expect(container.locator("thead th").first()).toHaveText(
				"Data set"
			);
			await expect(container.locator("tbody tr").first()).toBeVisible();
			expect(await container.locator("tbody tr").count()).toBeGreaterThan(0);

			await toggle.click();

			await expect(container).toBeHidden();
			await expect(toggle).toContainText("Show as table");
			expect(errors).toEqual([]);
		});
	}

	test("The table has a row for every data set of a bar chart, and follows a new chart", async ({
		page
	}) => {
		await OpenWithData(page, "Src/Pages/termination_status.html");
		await expect.poll(() => IsChartDrawn(page)).toBe(true);
		await page.locator("#chartTableToggleButton").click();
		const rows = page.locator("#chartDataTableContainer tbody tr");
		await expect(rows.first()).toBeVisible();
		const before = await page
			.locator("#chartDataTableContainer caption")
			.innerText();

		await page.locator("#viewPlotsButton").click();

		// The table stays open, and shows the data of the chart that was drawn again.
		await expect(page.locator("#chartDataTableContainer")).toBeVisible();
		await expect(page.locator("#chartDataTableContainer caption")).toHaveText(
			before
		);
	});
});

test.describe("Pages with data", () => {
	test("The chart is drawn after the upload, without the view button", async ({
		page
	}) => {
		await page.goto(PageUrl("Src/Pages/performance_profile.html"));
		await ImportFiles(page, THREE_TRACES);

		await expect.poll(() => IsChartDrawn(page)).toBe(true);
		await expect(page.locator("#viewPlotsButton")).toContainText("Update plot");
	});

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

		// No solver, and one solver: the button is not available, and there is no comparison (this used to throw).
		await expect(page.locator("#compareSolversButton")).toBeDisabled();
		await expect(comparisonTables).toHaveCount(0);

		await boxes.nth(0).check();
		await expect(page.locator("#compareSolversButton")).toBeDisabled();
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
