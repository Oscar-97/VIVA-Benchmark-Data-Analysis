import { chromium, Browser, BrowserContext, Page } from "playwright";
import * as path from "path";
import { At } from "./TestHelpers";

const root = path.resolve(__dirname, "..");
const traces = ["shotALL.trc", "scipALL.trc", "pavitoALL.trc"].map((name) =>
	path.join(root, "Tests/TestData", name)
);
const instances = { shot: 335, scip: 335, pavito: 332 };

/**
 * The plot pages, and whether they show a table with statistics below the chart.
 */
const plotPages: [string, boolean][] = [
	["performance_profile", false],
	["solver_time_all", true],
	["solver_time", false],
	["number_of_nodes", true],
	["number_of_iterations", true],
	["termination_status", false],
	["solution_quality", true],
	["solution_time", false]
];

describe("Pages with data", () => {
	let browser: Browser;
	let context: BrowserContext;

	beforeAll(async () => {
		browser = await chromium.launch({ headless: true });
		context = await browser.newContext({
			viewport: { width: 2560, height: 1440 },
			acceptDownloads: true
		});
	});

	afterAll(async () => {
		await browser.close();
	});

	/**
	 * Opens a page of the application, imports the three traces and returns the page and the errors it throws.
	 */
	async function OpenWithData(
		file: string
	): Promise<{ page: Page; errors: string[] }> {
		const page = await context.newPage();
		const errors: string[] = [];
		page.on("pageerror", (error) => errors.push(error.message));
		await page.goto(`file://${path.join(root, file)}`);
		await page.setInputFiles('input[type="file"]', traces);
		// The files are read in the background, the import button is used when they are read.
		await page.waitForFunction(
			() =>
				!(document.getElementById("importDataButton") as HTMLButtonElement)
					.disabled
		);
		await page.waitForTimeout(1500);
		await page.click("#importDataButton");
		await page.waitForTimeout(2500);
		return { page, errors };
	}

	/**
	 * The data of the chart that is shown, in the form that the page offers for download.
	 */
	async function ReadChartData(
		page: Page
	): Promise<{ label: string; data: number[] }[]> {
		return page.evaluate(async () => {
			const link = document.getElementById(
				"downloadChartDataButton"
			) as HTMLAnchorElement;
			link.click();
			return (await fetch(link.href)).json();
		});
	}

	test.each(plotPages)(
		"%s draws a chart without errors",
		async (name, hasStatistics) => {
			const { page, errors } = await OpenWithData(`Src/Pages/${name}.html`);
			await page.click("#viewPlotsButton");
			await page.waitForTimeout(2000);

			const drawn = await page.evaluate(() => {
				const canvas = document.getElementById("myChart") as HTMLCanvasElement;
				const context = canvas.getContext("2d");
				if (!context || canvas.width === 0) return false;
				const pixels = context.getImageData(0, 0, canvas.width, canvas.height);
				return pixels.data.some((value, index) => index % 4 === 3 && value > 0);
			});
			const statisticsRows = await page.$$eval(
				"#statisticsTable tbody tr",
				(rows) => rows.length
			);

			expect(errors).toEqual([]);
			expect(drawn).toBe(true);
			if (hasStatistics) {
				expect(statisticsRows).toBeGreaterThan(0);
			}
			await page.close();
		},
		60000
	);

	test("The termination status charts account for every instance of every solver", async () => {
		const { page, errors } = await OpenWithData(
			"Src/Pages/termination_status.html"
		);

		for (const status of ["ModelStatus", "SolverStatus"]) {
			await page.selectOption("#statusSelector", status);
			await page.click("#viewPlotsButton");
			await page.waitForTimeout(1500);
			const chart = await ReadChartData(page);

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
		await page.close();
	}, 60000);

	test("The fail chart counts the instances that failed", async () => {
		const { page, errors } = await OpenWithData(
			"Src/Pages/termination_status.html"
		);
		await page.selectOption("#statusSelector", "Fail");
		await page.click("#viewPlotsButton");
		await page.waitForTimeout(1500);
		const chart = await ReadChartData(page);

		expect(chart.map((set) => set.label)).toEqual(["Failed"]);
		// One of the three solvers has 9 failed instances.
		expect([...At(chart, 0).data].sort((a, b) => a - b)).toEqual([0, 0, 9]);
		expect(errors).toEqual([]);
		await page.close();
	}, 60000);

	test("Compare solvers compares two solvers and asks for exactly two", async () => {
		const { page, errors } = await OpenWithData(
			"Src/Pages/compare_solvers.html"
		);
		const boxes = await page.$$('#solverOptions input[type="checkbox"]');
		expect(boxes).toHaveLength(3);

		const comparisonTables = (): Promise<number> =>
			page.$$eval("#comparisonTable table", (tables) => tables.length);

		// No solver, and one solver: an error, and no comparison (this used to throw).
		await page.click("#compareSolversButton");
		await page.waitForTimeout(1000);
		expect(await comparisonTables()).toBe(0);

		await At(boxes, 0).check();
		await page.click("#compareSolversButton");
		await page.waitForTimeout(1000);
		expect(await comparisonTables()).toBe(0);

		// Two solvers: the comparison.
		await At(boxes, 1).check();
		await page.click("#compareSolversButton");
		await page.waitForTimeout(1500);
		expect(await comparisonTables()).toBe(1);

		// The page does not let a third solver be selected.
		await At(boxes, 2).click();
		expect(
			await page.$$eval(
				'#solverOptions input[type="checkbox"]:checked',
				(checked) => checked.length
			)
		).toBe(2);
		expect(errors).toEqual([]);
		await page.close();
	}, 60000);

	test("The report page shows the table", async () => {
		const { page, errors } = await OpenWithData("report.html");
		await page.click("#viewTableButton");
		await page.waitForSelector("#dataTableGenerated_wrapper", {
			state: "visible",
			timeout: 60000
		});

		expect(
			await page.$$eval("#dataTableGenerated tbody tr", (rows) => rows.length)
		).toBe(10);
		expect(errors).toEqual([]);
		await page.close();
	}, 90000);
});
