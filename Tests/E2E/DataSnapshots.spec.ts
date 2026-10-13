import { test, expect, Page } from "@playwright/test";
import {
	ExpectNotification,
	ImportFiles,
	IsChartDrawn,
	PageUrl,
	ReadChartData,
	TestFile,
	THREE_TRACES,
	ViewTable
} from "./Helpers";

/**
 * Snapshots of what the application computes and shows, as text: they do not depend on the operating
 * system or on how a browser draws, so they are checked on every machine. After a change that is meant
 * to change them, run `npm run test:ui:update` and look at the difference in the pull request.
 *
 * The application adds the lines of a file when it has read it, so the order of the solvers, and of the rows
 * with the same problem, depends on which file is read first. The snapshots are of what does not depend on it:
 * the data sets of a chart are in the order of their labels, the rows of a statistics table in the order of the
 * solvers, and what is shown for a solver comes from importing only its file.
 */

const SOLVERS = ["shot", "scip", "pavito"];

type Chart = { label: string; data: unknown[] }[];
type Table = string[][];

async function OpenWithFiles(
	page: Page,
	file: string,
	files: string[]
): Promise<void> {
	await page.goto(PageUrl(file));
	await ImportFiles(page, files);
	await ExpectNotification(page, "Benchmarks loaded with following files");
}

/**
 * Shows the chart, and returns its data sets, one on each line, with the label and the data. The colors are
 * left out, they are not data.
 */
async function ChartSnapshot(page: Page): Promise<string> {
	await page.locator("#viewPlotsButton").click();
	await expect.poll(() => IsChartDrawn(page)).toBe(true);
	const chart: Chart = await ReadChartData(page);
	// The virtual solvers are left out: their lines changed with the order in which the files were read, which
	// is not what a snapshot should depend on. The solvers themselves do not change.
	const sets = chart
		.filter(({ label }) => !label.startsWith("Virtual"))
		.map(({ label, data }) => ({ label, data }))
		.sort((a, b) => a.label.localeCompare(b.label));
	return sets.map((set) => JSON.stringify(set)).join("\n") + "\n";
}

/**
 * The text of the cells of a table, row by row.
 */
async function ReadTable(page: Page, selector: string): Promise<Table> {
	return page
		.locator(selector)
		.evaluate((element) =>
			[...element.querySelectorAll("tr")].map((row) =>
				[...row.querySelectorAll("th, td")].map((cell) =>
					(cell as HTMLElement).innerText.trim()
				)
			)
		);
}

function TableSnapshot(table: Table): string {
	return JSON.stringify(table, null, 1) + "\n";
}

test.describe("Data snapshots", () => {
	for (const name of ["performance_profile", "solver_time", "solution_time"]) {
		test(`The chart data of ${name}`, async ({ page }) => {
			await OpenWithFiles(page, `Src/Pages/${name}.html`, THREE_TRACES);

			expect(await ChartSnapshot(page)).toMatchSnapshot(`chart-${name}.txt`);
		});
	}

	for (const name of [
		"solver_time_all",
		"number_of_nodes",
		"number_of_iterations",
		"solution_quality"
	]) {
		test(`The statistics of ${name}`, async ({ page }) => {
			await OpenWithFiles(page, `Src/Pages/${name}.html`, THREE_TRACES);
			await page.locator("#viewPlotsButton").click();
			await expect(
				page.locator("#statisticsTable tbody tr").first()
			).toBeVisible();

			const [header, ...rows] = await ReadTable(page, "#statisticsTable");
			rows.sort((a, b) => (a[0] ?? "").localeCompare(b[0] ?? ""));

			expect(TableSnapshot([header ?? [], ...rows])).toMatchSnapshot(
				`statistics-${name}.json`
			);
		});
	}

	for (const solver of SOLVERS) {
		for (const status of ["ModelStatus", "SolverStatus", "Fail"]) {
			test(`The ${status} chart of ${solver}`, async ({ page }) => {
				await OpenWithFiles(page, "Src/Pages/termination_status.html", [
					TestFile(`${solver}ALL.trc`)
				]);
				await page.selectOption("#statusSelector", status);

				expect(await ChartSnapshot(page)).toMatchSnapshot(
					`termination-${status}-${solver}.txt`
				);
			});
		}
	}

	test("The first page of the table of one solver", async ({ page }) => {
		await OpenWithFiles(page, "report.html", [TestFile("shotALL.trc")]);
		await ViewTable(page);

		const table = await ReadTable(page, "#dataTableGenerated");

		expect(table.length).toBeGreaterThan(10);
		expect(TableSnapshot(table)).toMatchSnapshot("table-shot.json");
	});

	test("The navigation of a plot page", async ({ page }) => {
		await page.goto(PageUrl("Src/Pages/solver_time.html"));

		await expect(page.locator("nav").first()).toMatchAriaSnapshot({
			name: "navigation.aria.yml"
		});
	});
});
