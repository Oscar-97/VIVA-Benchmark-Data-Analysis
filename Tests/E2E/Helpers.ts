import { expect, Page } from "@playwright/test";
import * as path from "path";

/**
 * The folder of the repository. The tests open the pages from there, through file://.
 */
export const ROOT = path.resolve(__dirname, "../..");

export const TEST_DATA = path.join(ROOT, "Tests", "TestData");

/**
 * The path of a file in Tests/TestData.
 */
export function TestFile(name: string): string {
	return path.join(TEST_DATA, name);
}

/**
 * The three benchmark files that most of the tests use.
 */
export const THREE_TRACES = ["shotALL.trc", "scipALL.trc", "pavitoALL.trc"].map(
	TestFile
);

/**
 * The URL of a page of the application, from its path in the repository, for example "Src/Pages/solver_time.html".
 */
export function PageUrl(file: string): string {
	return `file://${path.join(ROOT, file)}`;
}

/**
 * The plot pages, and whether they show a table with statistics below the chart.
 */
export const PLOT_PAGES: {
	name: string;
	title: string;
	statistics: boolean;
}[] = [
	{
		name: "performance_profile",
		title: "Performance Profile",
		statistics: false
	},
	{
		name: "solver_time_all",
		title: "Solver Time per Solver",
		statistics: true
	},
	{
		name: "solver_time",
		title: "Solver Time per Instance",
		statistics: false
	},
	{ name: "number_of_nodes", title: "Number of Nodes", statistics: true },
	{
		name: "number_of_iterations",
		title: "Number of Iterations",
		statistics: true
	},
	{
		name: "termination_status",
		title: "Termination Status",
		statistics: false
	},
	{ name: "solution_quality", title: "Solution Quality", statistics: true },
	{ name: "solution_time", title: "Solution Time", statistics: false }
];

/**
 * Collects the errors that the page throws, to be checked at the end of a test.
 */
export function CollectPageErrors(page: Page): string[] {
	const errors: string[] = [];
	page.on("pageerror", (error) => errors.push(error.message));
	return errors;
}

/**
 * Selects the files to import and imports them, when the application has read them.
 */
export async function ImportFiles(
	page: Page,
	files: string[],
	library?: string
): Promise<void> {
	await page.setInputFiles('input[type="file"]', files);
	if (library) {
		await page.selectOption("#librarySelector", library);
	}
	const importButton = page.locator("#importDataButton");
	await expect(importButton).toBeEnabled();
	// The application enables the button before it has read the files, and adds the lines of a file to the data
	// when it is read. Reading the files here as well, and then letting the browser finish the tasks that are
	// waiting, makes sure that the data is complete when the button is used.
	await page.evaluate(async () => {
		const input = document.querySelector(
			'input[type="file"]'
		) as HTMLInputElement;
		await Promise.all(Array.from(input.files ?? []).map((file) => file.text()));
		await new Promise((resolve) => setTimeout(resolve, 0));
	});
	// On a narrow screen the navigation is collapsed, and the button is in it: the click is sent to the button.
	if (await importButton.isVisible()) {
		await importButton.click();
	} else {
		await importButton.dispatchEvent("click");
	}
}

/**
 * Checks that the notification is shown and has the text. Whitespace is ignored.
 */
export async function ExpectNotification(
	page: Page,
	text: string
): Promise<void> {
	const notification = page.locator("#alertNotification");
	await expect(notification).toBeVisible();
	await expect(notification).toContainText(text.replace(/\s+/g, " "));
}

/**
 * Opens the table of the imported data.
 */
export async function ViewTable(page: Page): Promise<void> {
	await page.locator("#viewTableButton").click();
	await expect(page.locator("#dataTableGenerated_wrapper")).toBeVisible({
		timeout: 60_000
	});
}

/**
 * Whether the chart on the page has been drawn: the canvas has at least one pixel that is not transparent.
 */
export async function IsChartDrawn(page: Page): Promise<boolean> {
	return page.evaluate(() => {
		const canvas = document.getElementById("myChart") as HTMLCanvasElement;
		const context = canvas.getContext("2d");
		if (!context || canvas.width === 0) return false;
		const pixels = context.getImageData(0, 0, canvas.width, canvas.height);
		return pixels.data.some((value, index) => index % 4 === 3 && value > 0);
	});
}

/**
 * The data of the chart that is shown, in the form that the page offers for download.
 */
export async function ReadChartData(
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
