import { chromium, Browser, Page, BrowserContext, Download } from "playwright";
import * as path from "path";

describe("UI tests", () => {
	let browser: Browser;
	let context: BrowserContext;
	let page: Page;

	beforeAll(async () => {
		browser = await chromium.launch({ headless: true });
		context = await browser.newContext();
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
			console.log(`The element ${selector} is still disabled.`);
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
		expect(notificationText).toContain(expectedText);
	}

	async function UploadFile(page: Page, fileNames: string[]): Promise<void> {
		await page.waitForSelector("#fileInput");
		await page.click("#fileInput");
		await page.waitForSelector('input[type="file"]');
		await page.setInputFiles('input[type="file"]', fileNames);
		await WaitForElementAndClick(page, "#importDataButton");
	}

	describe.only("Overall Application", () => {
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
			const absolutePerformanceProfileTitle = await page.title();
			expect(absolutePerformanceProfileTitle).toBe("Absolute Performance Profile");
			await page.screenshot({
				path: "TestScreenshots/absoluteperformanceprofilepage.png"
			});

			await page.click("xpath=/html/body/nav/div/div/ul[1]/li[2]/a");
			await page.click("xpath=/html/body/nav/div/div/ul[1]/li[2]/ul/li[2]/a");
			await page.waitForTimeout(2000);
			const averageSolverTimeTitle = await page.title();
			expect(averageSolverTimeTitle).toBe("Average Solver Time");
			await page.screenshot({
				path: "TestScreenshots/averagesolvertimepage.png"
			});

			await page.click("xpath=/html/body/nav/div/div/ul[1]/li[2]/a");
			await page.click("xpath=/html/body/nav/div/div/ul[1]/li[2]/ul/li[3]/a");
			await page.waitForTimeout(2000);
			const solverTimeTitle = await page.title();
			expect(solverTimeTitle).toBe("Solver Time");
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

		test("Handle multiple trace files", async () => {
			await UploadFile(page, [
				"./TestData/TraceFiles/shotALL.trc",
				"./TestData/TraceFiles/scipALL.trc",
				"./TestData/TraceFiles/pavitoALL.trc"
			]);
			await RunTableOperations(page, "Benchmark file succesfully loaded!");
		}, 60000);

		test("Instance information and best known bound values files", async () => {
			await UploadFile(page, [
				"./TestData/TraceFiles/shotALL.trc",
				"./TestData/TraceFiles/minlp.solu",
				"./TestData/TraceFiles/instancedata.csv"
			]);
			await RunTableOperations(
				page,
				"Instance information succesfully loaded!"
			);
		}, 60000);

		test("Handle JSON-file", async () => {
			await UploadFile(page, ["./TestData/UserConfiguration.json"]);
			await RunTableOperations(page, "Benchmark file succesfully loaded!");
		}, 60000);

		test("Save to, load from and remove local storage", async () => {
			await page.evaluate(() => {
				localStorage.clear();
			});
			await UploadFile(page, ["./TestData/TraceFiles/shotALL.trc"]);
			await RunTableOperations(page, "Benchmark file succesfully loaded!");
			await WaitForElementAndClick(page, "#saveLocalStorageButton");
			await page.reload();
			await page.waitForTimeout(1000);
			await CheckNotification(
				page,
				"#alertNotification",
				"Found cached benchmark file!"
			);
			const buttonIDs = [
				"#viewTableButton",
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
			const deleteLocalStorageButton = await page.$(buttonIDs[2]);
			await deleteLocalStorageButton?.click();
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
			await page.setInputFiles('input[type="file"]', "./TestData/error.png");
			await CheckNotification(
				page,
				"#alertNotification",
				"Invalid file extension. Only .trc, .json, .solu, and .csv allowed."
			);
		}, 60000);

		test("Select rows and filter table", async () => {
			await UploadFile(page, ["./TestData/TraceFiles/shotALL.trc"]);
			await RunTableOperations(page, "Benchmark file succesfully loaded!");
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
			WaitForElementAndClick(page, "#filterSelectionButton");
			await page.waitForTimeout(5000);
			await page.waitForSelector("#dataTableGenerated_wrapper", {
				state: "visible",
				timeout: 10000
			});
			await page.keyboard.up("Control");

			const rowCount = await page.$$eval(
				"table#dataTableGenerated" + " > tbody > tr",
				(rows) => rows.length
			);
			const expectedRowCount = 3;
			expect(rowCount).toBe(expectedRowCount);
		}, 60000);

		test("Button status after viewing a table", async () => {
			await UploadFile(page, ["./TestData/TraceFiles/shotALL.trc"]);
			await RunTableOperations(page, "Benchmark file succesfully loaded!");
			await page.waitForTimeout(5000);
			const buttonIDs = [
				"#filterSelectionButton",
				"#saveLocalStorageButton",
				"#downloadConfigurationButtonLayer",
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
			await UploadFile(page, ["./TestData/TraceFiles/shotALL.trc"]);
			await RunTableOperations(page, "Benchmark file succesfully loaded!");

			page.on("download", async (download: Download) => {
				const downloadPath: string = path.join(
					__dirname,
					"downloads",
					download.suggestedFilename()
				);
				await download.saveAs(downloadPath);
				console.log(`File downloaded at: ${downloadPath}`);
			});

			await WaitForElementAndClick(page, "#downloadConfigurationButton");
		}, 60000);

		test("Sort table and hide columns", async () => {
			await UploadFile(page, ["./TestData/TraceFiles/shotALL.trc"]);
			await RunTableOperations(page, "Benchmark file succesfully loaded!");
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
			expect(firstHeaderValueText).toBe("InputFileName");
		}, 60000);

		test("Use pagination on the table", async () => {
			await UploadFile(page, ["./TestData/TraceFiles/shotALL.trc"]);
			await RunTableOperations(page, "Benchmark file succesfully loaded!");

			await WaitForElementAndClick(
				page,
				"//html/body/div[4]/div/div[4]/div[2]/div/ul/li[9]/a"
			);
			await WaitForElementAndClick(
				page,
				"//html/body/div[4]/div/div[4]/div[2]/div/ul/li[9]/a"
			);
			await WaitForElementAndClick(
				page,
				"//html/body/div[4]/div/div[4]/div[2]/div/ul/li[1]/a"
			);

			const currentPageValue = await page.$(
				"//html/body/div[4]/div/div[4]/div[2]/div/ul/li[3]/a"
			);
			const currentPageValueText = await currentPageValue?.innerText();
			expect(currentPageValueText).toBe("2");
		}, 60000);

		test("Search in the displayed data", async () => {
			await UploadFile(page, ["./TestData/TraceFiles/shotALL.trc"]);
			await RunTableOperations(page, "Benchmark file succesfully loaded!");
			await page
				.locator("//html/body/div[4]/div/div[2]/div[2]/div/label/input")
				.type("watercontamination");
			const rowCount = await page.$$eval(
				"table#dataTableGenerated" + " > tbody > tr",
				(rows) => rows.length
			);
			const expectedRowCount = 4;
			expect(rowCount).toBe(expectedRowCount);
		}, 60000);
	});

	describe("Plot Pages", () => {
		async function RunPlotOperations(filePath: string): Promise<void> {
			const absoluteFilePath: string = path.resolve(__dirname, filePath);
			const fileUrl = `file://${absoluteFilePath}`;

			await page.goto(fileUrl);
			await UploadFile(page, ["./TestData/TraceFiles/shotALL.trc"]);
			await CheckNotification(
				page,
				"#alertNotification",
				"Benchmark file succesfully loaded!"
			);
			await WaitForElementAndClick(page, "#viewPlotsButton");

			await page.waitForSelector("#myChart", {
				state: "visible",
				timeout: 3000
			});
		}

		test("Average Solver Time Page", async () => {
			await RunPlotOperations("../Src/Pages/average_solver_time.html");
			await page.waitForSelector("#statisticsTable", {
				state: "visible",
				timeout: 3000
			});
		}, 10000);

		test("Solver Time Page", async () => {
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
	});
});
