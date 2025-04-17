/* eslint-disable max-lines */
import { test, expect, type Page, Download } from "@playwright/test";
import * as path from "path";

test.beforeEach(async ({ page }) => {
	const filePath = "../report.html";
	const absoluteFilePath: string = path.resolve(__dirname, filePath);
	const fileUrl = `file://${absoluteFilePath}`;
	await page.goto(fileUrl);
	await page.setViewportSize({ width: 1920, height: 1080 });
});

test.describe("Overall Application", () => {
	test("Page Navigation", async ({ page }) => {
		await expect(page).toHaveTitle("Report");
		await page.screenshot({ path: "TestScreenshots/reportpage.png" });

		await page.click("xpath=/html/body/nav/div/div/ul[1]/li[2]/a");
		await page.click("xpath=/html/body/nav/div/div/ul[1]/li[2]/ul/li[1]/a");

		await expect(page).toHaveTitle("Performance Profile");
		await page.screenshot({
			path: "TestScreenshots/absoluteperformanceprofilepage.png"
		});

		await page.click("xpath=/html/body/nav/div/div/ul[1]/li[2]/a");
		await page.click("xpath=/html/body/nav/div/div/ul[1]/li[2]/ul/li[2]/a");
		await expect(page).toHaveTitle("Solver Time per Solver");
		await page.screenshot({
			path: "TestScreenshots/averagesolvertimepage.png"
		});

		await page.click("xpath=/html/body/nav/div/div/ul[1]/li[2]/a");
		await page.click("xpath=/html/body/nav/div/div/ul[1]/li[2]/ul/li[3]/a");

		await expect(page).toHaveTitle("Solver Time per Instance");
		await page.screenshot({ path: "TestScreenshots/solvertimepage.png" });

		await page.click("xpath=/html/body/nav/div/div/ul[1]/li[2]/a");
		await page.click("xpath=/html/body/nav/div/div/ul[1]/li[2]/ul/li[4]/a");

		await expect(page).toHaveTitle("Number of Nodes");
		await page.screenshot({
			path: "TestScreenshots/numberofnodespage.png"
		});

		await page.click("xpath=/html/body/nav/div/div/ul[1]/li[2]/a");
		await page.click("xpath=/html/body/nav/div/div/ul[1]/li[2]/ul/li[5]/a");
		await expect(page).toHaveTitle("Number of Iterations");
		await page.screenshot({
			path: "TestScreenshots/numberofiterations.png"
		});

		await page.click("xpath=/html/body/nav/div/div/ul[1]/li[2]/a");
		await page.click("xpath=/html/body/nav/div/div/ul[1]/li[2]/ul/li[6]/a");
		await expect(page).toHaveTitle("Termination Status");
		await page.screenshot({
			path: "TestScreenshots/terminationstatus.png"
		});

		await page.click("xpath=/html/body/nav/div/div/ul[1]/li[2]/a");
		await page.click("xpath=/html/body/nav/div/div/ul[1]/li[2]/ul/li[7]/a");
		await expect(page).toHaveTitle("Solution Quality");
		await page.screenshot({
			path: "TestScreenshots/solutionquality.png"
		});

		await page.click("xpath=/html/body/nav/div/div/ul[1]/li[2]/a");
		await page.click("xpath=/html/body/nav/div/div/ul[1]/li[2]/ul/li[8]/a");
		await expect(page).toHaveTitle("Solution Time");
		await page.screenshot({
			path: "TestScreenshots/solutiontime.png"
		});

		await page.click("xpath=/html/body/nav/div/div/ul[1]/li[3]/a");
		await expect(page).toHaveTitle("Compare Solvers");
		await page.screenshot({
			path: "TestScreenshots/comparesolvers.png"
		});

		await page.click("xpath=/html/body/nav/div/div/ul[1]/li[1]/a");
		await expect(page).toHaveTitle("Report");
	});

	test.describe("Demo Modes", () => {
		test("Demo mode 1", async ({ page }) => {
			await page.selectOption("#demoDataSelector", "Demo_1");
			await page.click("#demoModeButton");
			await RunTableOperationsJSON(page, "Using demo mode!");
			expect(await page.locator("#demoDataSelector").isEnabled()).toBeFalsy();

			await page.locator("#deleteLocalStorageButton").click();
			await page.locator("#deleteButtonInModal").click();
			await CheckNotification(
				page,
				"#alertNotification",
				"Deleted configuration."
			);
		});

		test("Demo mode 2", async ({ page }) => {
			test.slow();
			await page.selectOption("#demoDataSelector", "Demo_2");
			await page.click("#demoModeButton");
			await RunTableOperationsJSON(page, "Using demo mode!");
			expect(await page.locator("#demoDataSelector").isEnabled()).toBeFalsy();

			await page.locator("#deleteLocalStorageButton").click();
			await page.locator("#deleteButtonInModal").click();
			await CheckNotification(
				page,
				"#alertNotification",
				"Deleted configuration."
			);
		});
	});

	test.describe("File Operations", () => {
		test("Handle multiple trace files", async ({ page }) => {
			await UploadFile(page, [
				"./Tests/TestData/shotALL.trc",
				"./Tests/TestData/scipALL.trc",
				"./Tests/TestData/pavitoALL.trc"
			]);
			await RunTableOperations(
				page,
				"Benchmarks loaded with following files: shotALL.trc, scipALL.trc, pavitoALL.trc"
			);
		});

		test("Handle instance information file", async ({ page }) => {
			await UploadFile(page, [
				"./Tests/TestData/shotALL.trc",
				"./Tests/TestData/instancedata.csv"
			]);
			await RunTableOperations(
				page,
				"Instance information succesfully loaded!"
			);
		});

		test("Handle solution file", async ({ page }) => {
			await UploadFile(page, [
				"./Tests/TestData/shotALL.trc",
				"./Tests/TestData/minlp.solu"
			]);
			await RunTableOperations(
				page,
				"Benchmarks loaded with following files: shotALL.trc, minlp.solu"
			);
		});

		test("Handle JSON-file", async ({ page }) => {
			await UploadFile(page, ["./Tests/TestData/UserConfiguration.json"]);
			await RunTableOperationsJSON(
				page,
				"Benchmarks loaded with following files: UserConfiguration.json"
			);
		});

		test("Save to, load from and remove local storage", async ({ page }) => {
			await page.evaluate(() => {
				localStorage.clear();
			});
			await UploadFile(page, ["./Tests/TestData/shotALL.trc"]);
			await RunTableOperations(
				page,
				"Benchmarks loaded with following files: shotALL.trc"
			);
			await page.locator("#saveLocalStorageButton").click();
			await page.reload();
			await CheckNotification(
				page,
				"#alertNotification",
				"Found stored configuration!"
			);
			const buttonIDs = [
				"#downloadConfigurationButtonLayer",
				"#deleteLocalStorageButton"
			];
			for (const selector of buttonIDs) {
				const button = await page.waitForSelector(selector);
				await button.waitForElementState("visible");
				const isEnabled = await button.isEnabled();
				expect(isEnabled).toBeTruthy();
			}
			await page.locator(buttonIDs[1]).click();
			await page.click("#deleteButtonInModal");
			await CheckNotification(
				page,
				"#alertNotification",
				"Deleted configuration."
			);
		});

		test("Loading wrong file format", async ({ page }) => {
			await page.waitForSelector("#fileInput");
			await page.click("#fileInput");
			await page.waitForSelector('input[type="file"]');
			await page.setInputFiles(
				'input[type="file"]',
				"./Tests/TestData/error.png"
			);
			await CheckNotification(
				page,
				"#alertNotification",
				"Invalid file extension. Only .trc, .json, .solu, and .csv allowed."
			);
		});
	});
});

test.describe("Table Page", () => {
	test.describe("Table Operations", () => {
		test("Select rows and filter table", async ({ page }) => {
			await UploadFile(page, ["./Tests/TestData/shotALL.trc"]);
			await RunTableOperations(
				page,
				"Benchmarks loaded with following files: shotALL.trc"
			);
			const rowSelectors = [
				"//html/body/div[4]/div/div[3]/div/div/div[2]/table/tbody/tr[1]",
				"//html/body/div[4]/div/div[3]/div/div/div[2]/table/tbody/tr[2]",
				"//html/body/div[4]/div/div[3]/div/div/div[2]/table/tbody/tr[3]"
			];
			await page.keyboard.down("Control");
			for (const selector of rowSelectors) {
				const row = await page.waitForSelector(selector);
				await row.click();
			}
			await page.locator("#showSelectedRowsButton").click();
			await page.waitForTimeout(2000);

			const rowCount = await page.$$eval(
				"table#dataTableGenerated" + " > tbody > tr",
				(rows) => {
					return rows.length;
				}
			);
			const expectedRowCount = 3;
			expect(rowCount).toBe(expectedRowCount);
		});

		test("Button status after viewing a table", async ({ page }) => {
			await UploadFile(page, ["./Tests/TestData/shotALL.trc"]);
			await RunTableOperations(
				page,
				"Benchmarks loaded with following files: shotALL.trc"
			);
			const buttonIDs = [
				"#showSelectedRowsButton",
				"#saveLocalStorageButton",
				"#downloadConfigurationButtonLayer",
				"#configurationSettingsButton",
				"#deleteLocalStorageButton",
				"#clearTableButton"
			];
			for (const selector of buttonIDs) {
				const button = await page.waitForSelector(selector);
				await button.waitForElementState("visible");
				const isEnabled = await button.isEnabled();
				expect(isEnabled).toBeTruthy();
			}
		});

		test("Download data", async ({ page }) => {
			await UploadFile(page, ["./Tests/TestData/shotALL.trc"]);
			await RunTableOperations(
				page,
				"Benchmarks loaded with following files: shotALL.trc"
			);

			page.on("download", async (download: Download) => {
				const downloadPath: string = path.join(
					__dirname,
					"downloads",
					download.suggestedFilename()
				);
				await download.saveAs(downloadPath);
				console.info(`File downloaded at: ${downloadPath}`);
			});

			await page.locator("#downloadConfigurationButton").click();
		});

		test("Sort table and hide columns", async ({ page }) => {
			await UploadFile(page, ["./Tests/TestData/shotALL.trc"]);
			await RunTableOperations(
				page,
				"Benchmarks loaded with following files: shotALL.trc"
			);

			await page
				.locator(
					"//html/body/div[4]/div/div[3]/div/div/div[1]/div/table/thead/tr/th[1]"
				)
				.click();

			const firstCellValueSorted = await page.locator(
				"//html/body/div[4]/div/div[3]/div/div/div[2]/table/tbody/tr[1]/td[1]"
			);
			const firstCellValueSortedText = await firstCellValueSorted?.innerText();
			expect(firstCellValueSortedText).toBe("watercontamination0303r");

			await page
				.locator("//html/body/div[4]/div/div[2]/div[1]/div/div[1]/button")
				.click();
			await page
				.locator(
					"//html/body/div[4]/div/div[2]/div[1]/div/div[1]/div[2]/div/div[2]/a"
				)
				.click();
			await page
				.locator(
					"//html/body/div[4]/div/div[2]/div[1]/div/div[1]/div[2]/div/a[2]"
				)
				.click();

			const firstHeaderValue = await page.locator(
				"//html/body/div[4]/div/div[3]/div/div/div[1]/div/table/thead/tr/th[1]"
			);
			const firstHeaderValueText = await firstHeaderValue?.innerText();
			expect(firstHeaderValueText).toBe("Problem");
		});

		test("Use pagination on the table", async ({ page }) => {
			await UploadFile(page, ["./Tests/TestData/shotALL.trc"]);
			await RunTableOperations(
				page,
				"Benchmarks loaded with following files: shotALL.trc"
			);
			await page
				.locator("//html/body/div[4]/div/div[4]/div[2]/div/ul/li[2]/a")
				.click();

			await page
				.locator("//html/body/div[4]/div/div[4]/div[2]/div/ul/li[7]/a")
				.click();

			await page
				.locator("//html/body/div[4]/div/div[4]/div[2]/div/ul/li[3]/a")
				.click();

			const currentPageValue = await page.locator(
				"//html/body/div[4]/div/div[4]/div[2]/div/ul/li[4]/a"
			);
			const currentPageValueText = await currentPageValue?.innerText();
			expect(currentPageValueText).toBe("30");
		});

		test("Search in the displayed data", async ({ page }) => {
			await UploadFile(page, ["./Tests/TestData/shotALL.trc"]);
			await RunTableOperations(
				page,
				"Benchmarks loaded with following files: shotALL.trc"
			);
			await page
				.locator("//html/body/div[4]/div/div[2]/div[2]/div/label/input")
				.type("watercontamination");
			const rowCount = await page.$$eval(
				"table#dataTableGenerated" + " > tbody > tr",
				(rows) => {
					return rows.length;
				}
			);
			const expectedRowCount = 4;
			expect(rowCount).toBe(expectedRowCount);
		});
	});

	test.describe("Problem Libraries Applied", () => {
		test("Use MINLPLib option", async ({ page }) => {
			test.slow();
			await page.waitForSelector("#fileInput");
			await page.click("#fileInput");
			await page.waitForSelector('input[type="file"]');
			await page.setInputFiles(
				'input[type="file"]',
				"./Tests/TestData/library_test.trc"
			);
			await page.selectOption("#librarySelector", "MINLPLib");
			await page.locator("#importDataButton").click();
			await RunTableOperations(
				page,
				"Benchmarks loaded with following files: library_test.trc"
			);
			await ShowProblemCells(page);

			const primalBoundProblemCellValue = await page.locator(
				"//html/body/div[4]/div/div[3]/div/div/div[2]/table/tbody/tr[3]/td[5]"
			);
			const dualBoundProblemCellValue = await page.locator(
				"//html/body/div[4]/div/div[3]/div/div/div[2]/table/tbody/tr[3]/td[4]"
			);

			// Check if 'alkylation' problem contains the values from MINLPLib.
			expect(await primalBoundProblemCellValue?.innerText()).toBe(
				"1.768807e+3"
			);
			expect(await dualBoundProblemCellValue?.innerText()).toBe("1.768807e+3");
		});

		test("Use MIPLIB 2017 option", async ({ page }) => {
			test.slow();
			await page.waitForSelector("#fileInput");
			await page.click("#fileInput");
			await page.waitForSelector('input[type="file"]');
			await page.setInputFiles(
				'input[type="file"]',
				"./Tests/TestData/library_test.trc"
			);
			await page.selectOption("#librarySelector", "MIPLIB_2017");
			await page.locator("#importDataButton").click();
			await RunTableOperations(
				page,
				"Benchmarks loaded with following files: library_test.trc"
			);
			await ShowProblemCells(page);

			const primalBoundProblemCellValue = await page.locator(
				"//html/body/div[4]/div/div[3]/div/div/div[2]/table/tbody/tr[2]/td[5]"
			);
			const dualBoundProblemCellValue = await page.locator(
				"//html/body/div[4]/div/div[3]/div/div/div[2]/table/tbody/tr[2]/td[4]"
			);

			// Check if '50v-10' problem contains the values from MIPLIB.
			expect(await primalBoundProblemCellValue?.innerText()).toBe(
				"3.311180e+3"
			);
			expect(await dualBoundProblemCellValue?.innerText()).toBe("3.311180e+3");
		});

		test("Use MIPLIB 2010 option", async ({ page }) => {
			test.slow();
			await page.waitForSelector("#fileInput");
			await page.click("#fileInput");
			await page.waitForSelector('input[type="file"]');
			await page.setInputFiles(
				'input[type="file"]',
				"./Tests/TestData/library_test.trc"
			);
			await page.selectOption("#librarySelector", "MIPLIB_2010");
			await page.locator("#importDataButton").click();
			await RunTableOperations(
				page,
				"Benchmarks loaded with following files: library_test.trc"
			);
			await ShowProblemCells(page);

			const primalBoundProblemCellValue = await page.locator(
				"//html/body/div[4]/div/div[3]/div/div/div[2]/table/tbody/tr[1]/td[5]"
			);
			const dualBoundProblemCellValue = await page.locator(
				"//html/body/div[4]/div/div[3]/div/div/div[2]/table/tbody/tr[1]/td[4]"
			);

			// Check if '30_70_45_095_100' problem contains the values from MIPLIB.
			expect(await primalBoundProblemCellValue?.innerText()).toBe(
				"3.000000e+0"
			);
			expect(await dualBoundProblemCellValue?.innerText()).toBe("3.000000e+0");
		});
	});
});

test.describe("Plot Pages", () => {
	test("Performance Profile Page", async ({ page }) => {
		await RunPlotOperations("../Src/Pages/performance_profile.html", page);
	});

	test("Solver Time per Solver Page", async ({ page }) => {
		await RunPlotOperations("../Src/Pages/solver_time_all.html", page);
		await page.waitForSelector("#statisticsTable", {
			state: "visible",
			timeout: 3000
		});
	});

	test("Solver Time per Instance Page", async ({ page }) => {
		await RunPlotOperations("../Src/Pages/solver_time.html", page);
		await page.waitForSelector("#statisticsTable", {
			state: "visible"
		});
	});

	test("Number of Nodes Page", async ({ page }) => {
		await RunPlotOperations("../Src/Pages/number_of_nodes.html", page);
		await page.waitForSelector("#statisticsTable", {
			state: "visible"
		});
	});

	test("Number of Iterations Page", async ({ page }) => {
		await RunPlotOperations("../Src/Pages/number_of_iterations.html", page);
		await page.waitForSelector("#statisticsTable", {
			state: "visible"
		});
	});

	test("Termination Status Page", async ({ page }) => {
		await RunPlotOperations("../Src/Pages/termination_status.html", page);
	});

	test("Solution Quality Page", async ({ page }) => {
		await RunPlotOperations("../Src/Pages/solution_quality.html", page);
		await page.waitForSelector("#statisticsTable", {
			state: "visible"
		});
	});

	test("Solution Time Page", async ({ page }) => {
		await RunPlotOperations("../Src/Pages/solution_time.html", page);
	});
});

test.describe("Compare Solvers Page", () => {
	test("Select solvers and compare them", async ({ page }) => {
		RunCompareSolversOperations(page);
		await page.locator("#scip").click();
		await page.locator("#shot").click();
		await page.locator("#compareSolversButton").click();
		await page.waitForSelector("#comparisonTable", {
			state: "visible",
			timeout: 3000
		});

		const cell1 = await page.locator(
			"//tbody/tr[td[contains(text(), 'Better')]]/td[contains(@class, 'table-success') and contains(text(), '102')]"
		);
		expect(await cell1?.innerText()).toBe("102");

		const cell2 = await page.locator(
			"//tbody/tr[td[contains(text(), 'Better')]]/td[contains(@class, 'table-success') and contains(text(), '183')]"
		);
		expect(await cell2?.innerText()).toBe("183");

		const cell3 = await page.locator(
			"//tbody/tr[td[contains(text(), 'Worse')]]/td[contains(@class, 'table-danger') and contains(text(), '183')]"
		);
		expect(await cell3?.innerText()).toBe("183");

		const cell4 = await page.locator(
			"//tbody/tr[td[contains(text(), 'Worse')]]/td[contains(@class, 'table-danger') and contains(text(), '102')]"
		);
		expect(await cell4?.innerText()).toBe("102");

		const cell5 = await page
			.locator(
				"//tbody/tr[td[contains(text(), 'Equal')]]/td[contains(@class, 'table-warning') and contains(text(), '4')]"
			)
			.nth(0);
		expect(await cell5?.innerText()).toBe("4");

		const cell6 = await page
			.locator(
				"//tbody/tr[td[contains(text(), 'Equal')]]/td[contains(@class, 'table-warning') and contains(text(), '4')]"
			)
			.nth(1);
		expect(await cell6?.innerText()).toBe("4");
	});

	test("Select one solver and try to compare", async ({ page }) => {
		RunCompareSolversOperations(page);
		await page.locator("#shot").click();
		await page.locator("#compareSolversButton").click();
		await CheckNotification(
			page,
			"#alertNotification",
			"Please select exactly two solvers to compare."
		);
	});

	test("Select three solvers and try to compare", async ({ page }) => {
		RunCompareSolversOperations(page);
		await page.locator("#shot").click();
		await page.locator("#scip").click();
		await page.locator("#pavito").click();
		await page.locator("#compareSolversButton").click();
		await CheckNotification(
			page,
			"#alertNotification",
			"Please select exactly two solvers to compare."
		);
	});
});

async function CheckNotification(
	page: Page,
	selector: string,
	expectedText: string
): Promise<void> {
	await page.waitForSelector(selector, { state: "visible", timeout: 10000 });
	await expect(page.locator(selector)).toBeVisible();
	await expect(page.locator(selector)).toHaveText(expectedText);
}

async function UploadFile(page: Page, fileNames: string[]): Promise<void> {
	await page.waitForSelector("#fileInput");
	await page.click("#fileInput");
	await page.waitForSelector('input[type="file"]');
	await page.setInputFiles('input[type="file"]', fileNames);
	await page.locator("#importDataButton").click();
}

async function RunTableOperations(
	page: Page,
	notification: string
): Promise<void> {
	await CheckNotification(page, "#alertNotification", notification);
	await page.locator("#viewTableButton").click();
	await page.waitForSelector("#dataTableGenerated_wrapper", {
		state: "visible",
		timeout: 60000
	});
}

async function RunTableOperationsJSON(
	page: Page,
	notification: string
): Promise<void> {
	await CheckNotification(page, "#alertNotification", notification);
	await page.waitForSelector("#dataTableGenerated_wrapper", {
		state: "visible",
		timeout: 60000
	});
}

async function ShowProblemCells(page: Page): Promise<void> {
	await page.locator("//html/body/div[4]/div/div[2]/div[1]/div/div[1]").click();
	await page
		.locator(
			"//html/body/div[4]/div/div[2]/div[1]/div/div[1]/div[2]/div/div[2]"
		)
		.click();
	await page
		.locator("//html/body/div[4]/div/div[2]/div[1]/div/div[1]/div[2]/div/a[4]")
		.click();
	await page
		.locator("//html/body/div[4]/div/div[2]/div[1]/div/div[1]/div[2]/div/a[5]")
		.click();
}

async function RunPlotOperations(filePath: string, page: Page): Promise<void> {
	const absoluteFilePath: string = path.resolve(__dirname, filePath);
	const fileUrl = `file://${absoluteFilePath}`;

	await page.goto(fileUrl);
	await UploadFile(page, ["./Tests/TestData/shotALL.trc"]);
	await CheckNotification(
		page,
		"#alertNotification",
		"Benchmarks loaded with following files: shotALL.trc"
	);
	await page.locator("#viewPlotsButton").click();
	await page.waitForSelector("#myChart", {
		state: "visible",
		timeout: 3000
	});
}

async function RunCompareSolversOperations(page: Page): Promise<void> {
	const filePath = "../Src/Pages/compare_solvers.html";
	const absoluteFilePath: string = path.resolve(__dirname, filePath);
	const fileUrl = `file://${absoluteFilePath}`;

	await page.goto(fileUrl);
	await UploadFile(page, [
		"./Tests/TestData/shotALL.trc",
		"./Tests/TestData/scipALL.trc",
		"./Tests/TestData/pavitoALL.trc"
	]);
	await CheckNotification(
		page,
		"#alertNotification",
		"Benchmarks loaded with following files: shotALL.trc, scipALL.trc, pavitoALL.trc"
	);
	await page.locator("#closeAlertButton").click();
	await page.waitForSelector("#solverOptions", {
		state: "visible",
		timeout: 3000
	});
}
