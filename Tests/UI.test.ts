/* eslint-disable max-lines */
import { chromium, Browser, Page, BrowserContext, Download } from "playwright";
import * as path from "path";

describe("UI tests", () => {
	let browser: Browser;
	let context: BrowserContext;
	let page: Page;

	beforeAll(async () => {
		browser = await chromium.launch({ headless: true });
		context = await browser.newContext({
			viewport: { width: 2560, height: 1440 }
		});
		page = await context.newPage();
	});

	afterAll(async () => {
		await browser.close();
	});

	async function WaitForElementAndClick(
		page: Page,
		selector: string
	): Promise<void> {
		await page.waitForSelector(selector, { state: "visible", timeout: 20000 });

		const element = await page.$(selector);
		const isDisabled = await element?.getAttribute("disabled");

		if (!isDisabled) {
			await element?.click();
		} else {
			console.error(`The element ${selector} is still disabled.`);
		}
	}

	async function CheckNotification(
		page: Page,
		selector: string,
		expectedText: string
	): Promise<void> {
		await page.waitForSelector(selector, { state: "visible", timeout: 10000 });

		const notificationElement = await page.$(selector);

		const isVisible = await notificationElement?.isVisible();
		expect(isVisible).toBeTruthy();

		const notificationText = await notificationElement?.innerText();
		const normalizedText = notificationText?.trim().replace(/\s+/g, " ");
		expect(normalizedText).toContain(expectedText);
	}

	async function UploadFile(page: Page, fileNames: string[]): Promise<void> {
		await page.waitForSelector("#fileInput");
		await page.click("#fileInput");
		await page.waitForSelector('input[type="file"]');
		await page.setInputFiles('input[type="file"]', fileNames);
		await WaitForElementAndClick(page, "#importDataButton");
	}

	describe("Overall Application", () => {
		const filePath = "../report.html";
		const absoluteFilePath: string = path.resolve(__dirname, filePath);
		const fileUrl = `file://${absoluteFilePath}`;

		test("Check that navigation works and the titles are correct", async () => {
			await page.goto(fileUrl);
			const tableTitle = await page.title();
			expect(tableTitle).toBe("Report");
			await page.screenshot({ path: "TestScreenshots/reportpage.png" });

			await page.click("xpath=/html/body/nav/div/div/ul[1]/li[2]/a");
			await page.click("xpath=/html/body/nav/div/div/ul[1]/li[2]/ul/li[1]/a");
			await page.waitForTimeout(2000);
			const performanceProfileTitle = await page.title();
			expect(performanceProfileTitle).toBe("Performance Profile");
			await page.screenshot({
				path: "TestScreenshots/absoluteperformanceprofilepage.png"
			});

			await page.click("xpath=/html/body/nav/div/div/ul[1]/li[2]/a");
			await page.click("xpath=/html/body/nav/div/div/ul[1]/li[2]/ul/li[2]/a");
			await page.waitForTimeout(2000);
			const averageSolverTimeTitle = await page.title();
			expect(averageSolverTimeTitle).toBe("Solver Time per Solver");
			await page.screenshot({
				path: "TestScreenshots/averagesolvertimepage.png"
			});

			await page.click("xpath=/html/body/nav/div/div/ul[1]/li[2]/a");
			await page.click("xpath=/html/body/nav/div/div/ul[1]/li[2]/ul/li[3]/a");
			await page.waitForTimeout(2000);
			const solverTimeTitle = await page.title();
			expect(solverTimeTitle).toBe("Solver Time per Instance");
			await page.screenshot({ path: "TestScreenshots/solvertimepage.png" });

			await page.click("xpath=/html/body/nav/div/div/ul[1]/li[2]/a");
			await page.click("xpath=/html/body/nav/div/div/ul[1]/li[2]/ul/li[4]/a");
			await page.waitForTimeout(2000);
			const numberOfNodesTitle = await page.title();
			expect(numberOfNodesTitle).toBe("Number of Nodes");
			await page.screenshot({
				path: "TestScreenshots/numberofnodespage.png"
			});

			await page.click("xpath=/html/body/nav/div/div/ul[1]/li[2]/a");
			await page.click("xpath=/html/body/nav/div/div/ul[1]/li[2]/ul/li[5]/a");
			await page.waitForTimeout(2000);
			const numberOfIterationsTitle = await page.title();
			expect(numberOfIterationsTitle).toBe("Number of Iterations");
			await page.screenshot({
				path: "TestScreenshots/numberofiterations.png"
			});

			await page.click("xpath=/html/body/nav/div/div/ul[1]/li[2]/a");
			await page.click("xpath=/html/body/nav/div/div/ul[1]/li[2]/ul/li[6]/a");
			await page.waitForTimeout(2000);
			const terminationStatusTitle = await page.title();
			expect(terminationStatusTitle).toBe("Termination Status");
			await page.screenshot({
				path: "TestScreenshots/terminationstatus.png"
			});

			await page.click("xpath=/html/body/nav/div/div/ul[1]/li[2]/a");
			await page.click("xpath=/html/body/nav/div/div/ul[1]/li[2]/ul/li[7]/a");
			await page.waitForTimeout(2000);
			const solutionQualityTitle = await page.title();
			expect(solutionQualityTitle).toBe("Solution Quality");
			await page.screenshot({
				path: "TestScreenshots/solutionquality.png"
			});

			await page.click("xpath=/html/body/nav/div/div/ul[1]/li[2]/a");
			await page.click("xpath=/html/body/nav/div/div/ul[1]/li[2]/ul/li[8]/a");
			await page.waitForTimeout(2000);
			const solutionTimeTitle = await page.title();
			expect(solutionTimeTitle).toBe("Solution Time");
			await page.screenshot({
				path: "TestScreenshots/solutiontime.png"
			});

			await page.click("xpath=/html/body/nav/div/div/ul[1]/li[3]/a");
			await page.waitForTimeout(2000);
			const compareSolversTitle = await page.title();
			expect(compareSolversTitle).toBe("Compare Solvers");
			await page.screenshot({
				path: "TestScreenshots/comparesolvers.png"
			});

			await page.click("xpath=/html/body/nav/div/div/ul[1]/li[1]/a");
			await page.waitForTimeout(2000);
			expect(tableTitle).toBe("Report");
		}, 30000);
	});

	describe("Table Page", () => {
		const filePath = "../report.html";
		const absoluteFilePath: string = path.resolve(__dirname, filePath);
		const fileUrl = `file://${absoluteFilePath}`;

		beforeEach(async () => {
			await page.goto(fileUrl);
		});

		async function RunTableOperations(
			page: Page,
			notification: string
		): Promise<void> {
			await CheckNotification(page, "#alertNotification", notification);
			await WaitForElementAndClick(page, "#viewTableButton");

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

		test("Demo mode 1", async () => {
			await page.selectOption("#demoDataSelector", "Demo_1");
			await page.click("#demoModeButton");
			await RunTableOperationsJSON(page, "Using demo mode!");
			const deleteLocalStorageButton = await page.$(
				"#deleteLocalStorageButton"
			);
			expect(await page.locator("#demoDataSelector").isEnabled()).toBeFalsy();
			await deleteLocalStorageButton?.click();
			await page.click("#deleteButtonInModal");
			await page.waitForTimeout(500);
			await CheckNotification(
				page,
				"#alertNotification",
				"Deleted configuration."
			);
		}, 60000);

		test.skip("Demo mode 2", async () => {
			await page.selectOption("#demoDataSelector", "Demo_2");
			await page.click("#demoModeButton");
			await RunTableOperationsJSON(page, "Using demo mode!");
			const deleteLocalStorageButton = await page.$(
				"#deleteLocalStorageButton"
			);
			expect(await page.locator("#demoDataSelector").isEnabled()).toBeFalsy();
			await deleteLocalStorageButton?.click();
			await page.click("deleteButtonInModal");
			await page.waitForTimeout(500);
			await CheckNotification(
				page,
				"#alertNotification",
				"Deleted configuration."
			);
		}, 60000);

		test("Handle multiple trace files", async () => {
			await UploadFile(page, [
				"./Tests/TestData/shotALL.trc",
				"./Tests/TestData/scipALL.trc",
				"./Tests/TestData/pavitoALL.trc"
			]);
			await RunTableOperations(
				page,
				"Benchmarks loaded with following files: shotALL.trc, scipALL.trc, pavitoALL.trc"
			);
		}, 60000);

		test("Handle instance information file", async () => {
			await UploadFile(page, [
				"./Tests/TestData/shotALL.trc",
				"./Tests/TestData/instancedata.csv"
			]);
			await RunTableOperations(
				page,
				"Instance information succesfully loaded!"
			);
		}, 60000);

		test("Handle solution file", async () => {
			await UploadFile(page, [
				"./Tests/TestData/shotALL.trc",
				"./Tests/TestData/minlp.solu"
			]);
			await RunTableOperations(
				page,
				"Benchmarks loaded with following files: shotALL.trc, minlp.solu"
			);
		}, 60000);

		test("Handle JSON-file", async () => {
			await UploadFile(page, ["./Tests/TestData/UserConfiguration.json"]);
			await RunTableOperationsJSON(
				page,
				"Benchmarks loaded with following files: UserConfiguration.json"
			);
		}, 60000);

		test("Save to, load from and remove local storage", async () => {
			await page.evaluate(() => {
				localStorage.clear();
			});
			await UploadFile(page, ["./Tests/TestData/shotALL.trc"]);
			await RunTableOperations(
				page,
				"Benchmarks loaded with following files: shotALL.trc"
			);
			await WaitForElementAndClick(page, "#saveLocalStorageButton");
			await page.reload();
			await page.waitForTimeout(3000);
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
			await page.waitForTimeout(3000);
			const deleteLocalStorageButton = await page.$(buttonIDs[1]);
			await deleteLocalStorageButton?.click();
			await page.click("#deleteButtonInModal");
			await page.waitForTimeout(500);
			await CheckNotification(
				page,
				"#alertNotification",
				"Deleted configuration."
			);
		}, 60000);

		test("Loading wrong file format", async () => {
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
		}, 60000);

		test("Select rows and filter table", async () => {
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
			await page.waitForTimeout(5000);
			WaitForElementAndClick(page, "#showSelectedRowsButton");
			await page.waitForTimeout(5000);
			await page.waitForSelector("#dataTableGenerated_wrapper", {
				state: "visible",
				timeout: 10000
			});
			await page.keyboard.up("Control");

			const rowCount = await page.$$eval(
				"table#dataTableGenerated" + " > tbody > tr",
				(rows) => {
					return rows.length;
				}
			);
			const expectedRowCount = 3;
			expect(rowCount).toBe(expectedRowCount);
		}, 60000);

		test("Button status after viewing a table", async () => {
			await UploadFile(page, ["./Tests/TestData/shotALL.trc"]);
			await RunTableOperations(
				page,
				"Benchmarks loaded with following files: shotALL.trc"
			);
			await page.waitForTimeout(5000);
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
		}, 60000);

		test("Download data", async () => {
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

			await WaitForElementAndClick(page, "#downloadConfigurationButton");
		}, 60000);

		test("Sort table and hide columns", async () => {
			await UploadFile(page, ["./Tests/TestData/shotALL.trc"]);
			await RunTableOperations(
				page,
				"Benchmarks loaded with following files: shotALL.trc"
			);
			await WaitForElementAndClick(
				page,
				"//html/body/div[4]/div/div[3]/div/div/div[1]/div/table/thead/tr/th[1]"
			);

			const firstCellValueSorted = await page.$(
				"//html/body/div[4]/div/div[3]/div/div/div[2]/table/tbody/tr[1]/td[1]"
			);
			const firstCellValueSortedText = await firstCellValueSorted?.innerText();
			expect(firstCellValueSortedText).toBe("watercontamination0303r");

			await WaitForElementAndClick(
				page,
				"//html/body/div[4]/div/div[2]/div[1]/div/div[1]/button"
			);
			await WaitForElementAndClick(
				page,
				"//html/body/div[4]/div/div[2]/div[1]/div/div[1]/div[2]/div/div[2]/a"
			);

			await WaitForElementAndClick(
				page,
				"//html/body/div[4]/div/div[2]/div[1]/div/div[1]/div[2]/div/a[2]"
			);

			const firstHeaderValue = await page.$(
				"//html/body/div[4]/div/div[3]/div/div/div[1]/div/table/thead/tr/th[1]"
			);
			const firstHeaderValueText = await firstHeaderValue?.innerText();
			expect(firstHeaderValueText).toBe("Problem");
		}, 60000);

		test("Use pagination on the table", async () => {
			await UploadFile(page, ["./Tests/TestData/shotALL.trc"]);
			await RunTableOperations(
				page,
				"Benchmarks loaded with following files: shotALL.trc"
			);

			await WaitForElementAndClick(
				page,
				"//html/body/div[4]/div/div[4]/div[2]/div/ul/li[2]/a"
			);
			await WaitForElementAndClick(
				page,
				"//html/body/div[4]/div/div[4]/div[2]/div/ul/li[7]/a"
			);
			await WaitForElementAndClick(
				page,
				"//html/body/div[4]/div/div[4]/div[2]/div/ul/li[3]/a"
			);

			const currentPageValue = await page.$(
				"//html/body/div[4]/div/div[4]/div[2]/div/ul/li[4]/a"
			);
			const currentPageValueText = await currentPageValue?.innerText();
			expect(currentPageValueText).toBe("30");
		}, 60000);

		test("Search in the displayed data", async () => {
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
		}, 60000);

		// test("Use MINLPLib option", async () => {
		// 	await page.waitForSelector("#fileInput");
		// 	await page.click("#fileInput");
		// 	await page.waitForSelector('input[type="file"]');
		// 	await page.setInputFiles(
		// 		'input[type="file"]',
		// 		"./Tests/TestData/library_test.trc"
		// 	);
		// 	await page.waitForTimeout(2000);
		// 	await page.selectOption("#librarySelector", "MINLPLib");
		// 	await WaitForElementAndClick(page, "#importDataButton");
		// 	await RunTableOperations(
		// 		page,
		// 		"Benchmarks loaded with following files: library_test.trc"
		// 	);

		// 	await ShowProblemCells();

		// 	const primalBoundProblemCellValue = await page.$(
		// 		"//html/body/div[4]/div/div[3]/div/div/div[2]/table/tbody/tr[3]/td[5]"
		// 	);
		// 	const dualBoundProblemCellValue = await page.$(
		// 		"//html/body/div[4]/div/div[3]/div/div/div[2]/table/tbody/tr[3]/td[4]"
		// 	);

		// 	// Check if 'alkylation' problem contains the values from MINLPLib.
		// 	expect(await primalBoundProblemCellValue?.innerText()).toBe(
		// 		"1.768807e+3"
		// 	);
		// 	expect(await dualBoundProblemCellValue?.innerText()).toBe("1.768807e+3");
		// }, 60000);

		// test("Use MIPLIB 2017 option", async () => {
		// 	await page.waitForSelector("#fileInput");
		// 	await page.click("#fileInput");
		// 	await page.waitForSelector('input[type="file"]');
		// 	await page.setInputFiles(
		// 		'input[type="file"]',
		// 		"./Tests/TestData/library_test.trc"
		// 	);
		// 	await page.waitForTimeout(2000);
		// 	await page.selectOption("#librarySelector", "MIPLIB_2017");
		// 	await WaitForElementAndClick(page, "#importDataButton");
		// 	await RunTableOperations(
		// 		page,
		// 		"Benchmarks loaded with following files: library_test.trc"
		// 	);

		// 	await ShowProblemCells();
		// 	const primalBoundProblemCellValue = await page.$(
		// 		"//html/body/div[4]/div/div[3]/div/div/div[2]/table/tbody/tr[2]/td[5]"
		// 	);
		// 	const dualBoundProblemCellValue = await page.$(
		// 		"//html/body/div[4]/div/div[3]/div/div/div[2]/table/tbody/tr[2]/td[4]"
		// 	);

		// 	// Check if '50v-10' problem contains the values from MIPLIB.
		// 	expect(await primalBoundProblemCellValue?.innerText()).toBe(
		// 		"3.311180e+3"
		// 	);
		// 	expect(await dualBoundProblemCellValue?.innerText()).toBe("3.311180e+3");
		// }, 60000);

		// test("Use MIPLIB 2010 option", async () => {
		// 	await page.waitForSelector("#fileInput");
		// 	await page.click("#fileInput");
		// 	await page.waitForSelector('input[type="file"]');
		// 	await page.setInputFiles(
		// 		'input[type="file"]',
		// 		"./Tests/TestData/library_test.trc"
		// 	);
		// 	await page.waitForTimeout(2000);
		// 	await page.selectOption("#librarySelector", "MIPLIB_2010");
		// 	await WaitForElementAndClick(page, "#importDataButton");
		// 	await RunTableOperations(
		// 		page,
		// 		"Benchmarks loaded with following files: library_test.trc"
		// 	);

		// 	await ShowProblemCells();
		// 	const primalBoundProblemCellValue = await page.$(
		// 		"//html/body/div[4]/div/div[3]/div/div/div[2]/table/tbody/tr[1]/td[5]"
		// 	);
		// 	const dualBoundProblemCellValue = await page.$(
		// 		"//html/body/div[4]/div/div[3]/div/div/div[2]/table/tbody/tr[1]/td[4]"
		// 	);

		// 	// Check if '30_70_45_095_100' problem contains the values from MIPLIB.
		// 	expect(await primalBoundProblemCellValue?.innerText()).toBe(
		// 		"3.000000e+0"
		// 	);
		// 	expect(await dualBoundProblemCellValue?.innerText()).toBe("3.000000e+0");
		// }, 60000);
	});

	describe("Problem Libraries", () => {
		async function RunTableOperations(
			page: Page,
			notification: string
		): Promise<void> {
			await CheckNotification(page, "#alertNotification", notification);
			await WaitForElementAndClick(page, "#viewTableButton");

			await page.waitForSelector("#dataTableGenerated_wrapper", {
				state: "visible",
				timeout: 60000
			});
		}

		async function ShowProblemCells(): Promise<void> {
			await WaitForElementAndClick(
				page,
				"//html/body/div[4]/div/div[2]/div[1]/div/div[1]"
			);
			await WaitForElementAndClick(
				page,
				"//html/body/div[4]/div/div[2]/div[1]/div/div[1]/div[2]/div/div[2]"
			);
			await WaitForElementAndClick(
				page,
				"//html/body/div[4]/div/div[2]/div[1]/div/div[1]/div[2]/div/a[4]"
			);
			await WaitForElementAndClick(
				page,
				"//html/body/div[4]/div/div[2]/div[1]/div/div[1]/div[2]/div/a[5]"
			);
		}
		test("Use MINLPLib option", async () => {
			await page.waitForSelector("#fileInput");
			await page.click("#fileInput");
			await page.waitForSelector('input[type="file"]');
			await page.setInputFiles(
				'input[type="file"]',
				"./Tests/TestData/library_test.trc"
			);
			await page.waitForTimeout(2000);
			await page.selectOption("#librarySelector", "MINLPLib");
			await WaitForElementAndClick(page, "#importDataButton");
			await RunTableOperations(
				page,
				"Benchmarks loaded with following files: library_test.trc"
			);

			await ShowProblemCells();

			const primalBoundProblemCellValue = await page.$(
				"//html/body/div[4]/div/div[3]/div/div/div[2]/table/tbody/tr[3]/td[5]"
			);
			const dualBoundProblemCellValue = await page.$(
				"//html/body/div[4]/div/div[3]/div/div/div[2]/table/tbody/tr[3]/td[4]"
			);

			// Check if 'alkylation' problem contains the values from MINLPLib.
			expect(await primalBoundProblemCellValue?.innerText()).toBe(
				"1.768807e+3"
			);
			expect(await dualBoundProblemCellValue?.innerText()).toBe("1.768807e+3");
		}, 60000);

		test("Use MIPLIB 2017 option", async () => {
			await page.waitForSelector("#fileInput");
			await page.click("#fileInput");
			await page.waitForSelector('input[type="file"]');
			await page.setInputFiles(
				'input[type="file"]',
				"./Tests/TestData/library_test.trc"
			);
			await page.waitForTimeout(2000);
			await page.selectOption("#librarySelector", "MIPLIB_2017");
			await WaitForElementAndClick(page, "#importDataButton");
			await RunTableOperations(
				page,
				"Benchmarks loaded with following files: library_test.trc"
			);

			await ShowProblemCells();
			const primalBoundProblemCellValue = await page.$(
				"//html/body/div[4]/div/div[3]/div/div/div[2]/table/tbody/tr[2]/td[5]"
			);
			const dualBoundProblemCellValue = await page.$(
				"//html/body/div[4]/div/div[3]/div/div/div[2]/table/tbody/tr[2]/td[4]"
			);

			// Check if '50v-10' problem contains the values from MIPLIB.
			expect(await primalBoundProblemCellValue?.innerText()).toBe(
				"3.311180e+3"
			);
			expect(await dualBoundProblemCellValue?.innerText()).toBe("3.311180e+3");
		}, 60000);

		test("Use MIPLIB 2010 option", async () => {
			await page.waitForSelector("#fileInput");
			await page.click("#fileInput");
			await page.waitForSelector('input[type="file"]');
			await page.setInputFiles(
				'input[type="file"]',
				"./Tests/TestData/library_test.trc"
			);
			await page.waitForTimeout(2000);
			await page.selectOption("#librarySelector", "MIPLIB_2010");
			await WaitForElementAndClick(page, "#importDataButton");
			await RunTableOperations(
				page,
				"Benchmarks loaded with following files: library_test.trc"
			);

			await ShowProblemCells();
			const primalBoundProblemCellValue = await page.$(
				"//html/body/div[4]/div/div[3]/div/div/div[2]/table/tbody/tr[1]/td[5]"
			);
			const dualBoundProblemCellValue = await page.$(
				"//html/body/div[4]/div/div[3]/div/div/div[2]/table/tbody/tr[1]/td[4]"
			);

			// Check if '30_70_45_095_100' problem contains the values from MIPLIB.
			expect(await primalBoundProblemCellValue?.innerText()).toBe(
				"3.000000e+0"
			);
			expect(await dualBoundProblemCellValue?.innerText()).toBe("3.000000e+0");
		}, 60000);
	});

	describe("Plot Pages", () => {
		async function RunPlotOperations(filePath: string): Promise<void> {
			const absoluteFilePath: string = path.resolve(__dirname, filePath);
			const fileUrl = `file://${absoluteFilePath}`;

			await page.goto(fileUrl);
			await UploadFile(page, ["./Tests/TestData/shotALL.trc"]);
			await CheckNotification(
				page,
				"#alertNotification",
				"Benchmarks loaded with following files: shotALL.trc"
			);
			await WaitForElementAndClick(page, "#viewPlotsButton");

			await page.waitForSelector("#myChart", {
				state: "visible",
				timeout: 3000
			});
		}

		test("Performance Profile Page", async () => {
			await RunPlotOperations("../Src/Pages/performance_profile.html");
		}, 10000);

		test("Solver Time per Solver Page", async () => {
			await RunPlotOperations("../Src/Pages/solver_time_all.html");
			await page.waitForSelector("#statisticsTable", {
				state: "visible",
				timeout: 3000
			});
		}, 10000);

		test("Solver Time per Instance Page", async () => {
			RunPlotOperations("../Src/Pages/solver_time.html");
		}, 10000);

		test("Number of Nodes Page", async () => {
			await RunPlotOperations("../Src/Pages/number_of_nodes.html");
			await page.waitForSelector("#statisticsTable", {
				state: "visible",
				timeout: 3000
			});
		}, 10000);

		test("Number of Iterations Page", async () => {
			await RunPlotOperations("../Src/Pages/number_of_iterations.html");
			await page.waitForSelector("#statisticsTable", {
				state: "visible",
				timeout: 3000
			});
		}, 10000);

		test("Termination Status Page", async () => {
			await RunPlotOperations("../Src/Pages/termination_status.html");
		}, 10000);

		test("Solution Quality Page", async () => {
			await RunPlotOperations("../Src/Pages/solution_quality.html");
			await page.waitForSelector("#statisticsTable", {
				state: "visible",
				timeout: 3000
			});
		}, 10000);

		test("Solution Time Page", async () => {
			await RunPlotOperations("../Src/Pages/solution_time.html");
		}, 10000);
	});

	describe("Compare Solvers Page", () => {
		async function RunCompareSolversOperations(): Promise<void> {
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
			await page.waitForTimeout(2000);
			const closeButton = await page.$("#closeAlertButton");
			closeButton?.click();
			await page.waitForTimeout(1000);
			await page.waitForSelector("#solverOptions", {
				state: "visible",
				timeout: 3000
			});
			await page.waitForTimeout(1000);
		}

		test("Select solvers and compare them", async () => {
			RunCompareSolversOperations();

			await WaitForElementAndClick(page, "#scip");
			await WaitForElementAndClick(page, "#shot");

			await WaitForElementAndClick(page, "#compareSolversButton");
			await page.waitForSelector("#comparisonTable", {
				state: "visible",
				timeout: 3000
			});

			// TODO: Column order is not set. Update to some better paths later on.
			const cell1 = await page.$(
				"//tbody/tr[td[contains(text(), 'Better')]]/td[contains(@class, 'table-success') and contains(text(), '102')]"
			);
			expect(await cell1?.innerText()).toBe("102");

			const cell2 = await page.$(
				"//tbody/tr[td[contains(text(), 'Better')]]/td[contains(@class, 'table-success') and contains(text(), '183')]"
			);
			expect(await cell2?.innerText()).toBe("183");

			const cell3 = await page.$(
				"//tbody/tr[td[contains(text(), 'Worse')]]/td[contains(@class, 'table-danger') and contains(text(), '183')]"
			);
			expect(await cell3?.innerText()).toBe("183");

			const cell4 = await page.$(
				"//tbody/tr[td[contains(text(), 'Worse')]]/td[contains(@class, 'table-danger') and contains(text(), '102')]"
			);
			expect(await cell4?.innerText()).toBe("102");

			const cell5 = await page.$(
				"//tbody/tr[td[contains(text(), 'Equal')]]/td[contains(@class, 'table-warning') and contains(text(), '4')]"
			);
			expect(await cell5?.innerText()).toBe("4");

			const cell6 = await page.$(
				"//tbody/tr[td[contains(text(), 'Equal')]]/td[contains(@class, 'table-warning') and contains(text(), '4')]"
			);
			expect(await cell6?.innerText()).toBe("4");
		}, 10000);

		test("Select one solver and try to compare", async () => {
			RunCompareSolversOperations();
			await WaitForElementAndClick(page, "#shot");
			await WaitForElementAndClick(page, "#compareSolversButton");
			await CheckNotification(
				page,
				"#alertNotification",
				"Please select exactly two solvers to compare."
			);
		}, 60000);

		test("Select three solvers and try to compare", async () => {
			await WaitForElementAndClick(page, "#shot");
			await WaitForElementAndClick(page, "#scip");
			await WaitForElementAndClick(page, "#pavito");
			await WaitForElementAndClick(page, "#compareSolversButton");
			await CheckNotification(
				page,
				"#alertNotification",
				"Please select exactly two solvers to compare."
			);
		}, 10000);
	});
});
