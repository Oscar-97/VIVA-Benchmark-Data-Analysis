import { chromium, Browser, Page, BrowserContext } from "playwright";
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

	async function waitForElementAndClick(
		page: Page,
		selector: string
	): Promise<void> {
		await page.waitForSelector(selector, { state: "visible", timeout: 10000 });

		const element = await page.$(selector);
		const isDisabled = await element?.getAttribute("disabled");

		if (!isDisabled) {
			await element?.click();
		} else {
			console.log(
				`The element ${selector} is still disabled after waiting 5 seconds.`
			);
		}
	}

	async function checkNotification(
		page: Page,
		selector: string,
		expectedText: string
	): Promise<void> {
		await page.waitForSelector(selector, { state: "visible", timeout: 3000 });

		const notificationElement = await page.$(selector);

		const isVisible = await notificationElement?.isVisible();
		expect(isVisible).toBeTruthy();

		const notificationText = await notificationElement?.innerText();
		expect(notificationText).toBe(expectedText);
	}

	async function uploadFile(page: Page, fileNames: string[]): Promise<void> {
		await page.waitForSelector("#fileInput");
		await page.click("#fileInput");
		await page.waitForSelector('input[type="file"]');
		await page.setInputFiles('input[type="file"]', fileNames);
		await waitForElementAndClick(page, "#importDataButton");
	}

	describe("Navigation between pages", () => {
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
			const averageSolverTimeTitle = await page.title();
			expect(averageSolverTimeTitle).toBe("Average Solver Time");
			await page.screenshot({
				path: "TestScreenshots/averagesolvertimepage.png"
			});

			await page.click("xpath=/html/body/nav/div/div/ul[1]/li[2]/a");
			await page.click("xpath=/html/body/nav/div/div/ul[1]/li[2]/ul/li[2]/a");
			await page.waitForTimeout(2000);
			const solverTimeTitle = await page.title();
			expect(solverTimeTitle).toBe("Solver Time");
			await page.screenshot({ path: "TestScreenshots/solvertimepage.png" });

			await page.click("xpath=/html/body/nav/div/div/ul[1]/li[2]/a");
			await page.click("xpath=/html/body/nav/div/div/ul[1]/li[2]/ul/li[3]/a");
			await page.waitForTimeout(2000);
			const numberOfNodesTitle = await page.title();
			expect(numberOfNodesTitle).toBe("Number of Nodes");
			await page.screenshot({
				path: "TestScreenshots/numberofnodespage.png"
			});

			await page.click("xpath=/html/body/nav/div/div/ul[1]/li[2]/a");
			await page.click("xpath=/html/body/nav/div/div/ul[1]/li[2]/ul/li[4]/a");
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

		test("Handle multiple trace files", async () => {
			await page.goto(fileUrl);
			await uploadFile(page, [
				"./solvedata/TraceFiles/shotALL.trc",
				"./solvedata/TraceFiles/scipALL.trc",
				"./solvedata/TraceFiles/pavitoALL.trc"
			]);
			await checkNotification(
				page,
				"#alertNotification",
				"Benchmark file succesfully loaded!"
			);
			await waitForElementAndClick(page, "#viewAllResultsButton");

			await page.waitForSelector("#dataTableGenerated_wrapper", {
				state: "visible",
				timeout: 10000
			});
		}, 20000);

		test("Instance information and best known bound values files", async () => {
			await page.goto(fileUrl);
			await uploadFile(page, [
				"./solvedata/TraceFiles/shotALL.trc",
				"./solvedata/TraceFiles/minlp.solu",
				"./solvedata/TraceFiles/instancedata.csv"
			]);
			await checkNotification(
				page,
				"#alertNotification",
				"Instance information succesfully loaded!"
			);
			await waitForElementAndClick(page, "#viewAllResultsButton");

			await page.waitForSelector("#dataTableGenerated_wrapper", {
				state: "visible",
				timeout: 10000
			});
		}, 20000);

		test("Handle JSON-file", async () => {
			await page.goto(fileUrl);
			await uploadFile(page, ["./solvedata/UserConfiguration.json"]);
			await checkNotification(
				page,
				"#alertNotification",
				"Benchmark file succesfully loaded!"
			);
			await waitForElementAndClick(page, "#viewAllResultsButton");

			await page.waitForSelector("#dataTableGenerated_wrapper", {
				state: "visible",
				timeout: 5000
			});
		}, 10000);

		test("Handle text file", async () => {
			await page.goto(fileUrl);
			await uploadFile(page, ["./solvedata/solvedata.txt"]);
			await checkNotification(
				page,
				"#alertNotification",
				"Benchmark file succesfully loaded!"
			);
			await waitForElementAndClick(page, "#viewAllResultsButton");

			await page.waitForSelector("#dataTableGenerated_wrapper", {
				state: "visible",
				timeout: 5000
			});
		}, 10000);

		test("Save to, load from and remove local storage ", async () => {
			await page.goto(fileUrl);
			await page.evaluate(() => {
				localStorage.clear();
			});
			await uploadFile(page, ["./solvedata/TraceFiles/shotALL.trc"]);
			await checkNotification(
				page,
				"#alertNotification",
				"Benchmark file succesfully loaded!"
			);
			await waitForElementAndClick(page, "#viewAllResultsButton");

			await page.waitForSelector("#dataTableGenerated_wrapper", {
				state: "visible",
				timeout: 10000
			});
			await waitForElementAndClick(page, "#saveLocalStorageButton");
			await page.reload();
			await page.waitForTimeout(500);
			await checkNotification(
				page,
				"#alertNotification",
				"Found cached benchmark file!"
			);
			const buttonIDs = [
				"#viewAllResultsButton",
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
			await checkNotification(
				page,
				"#alertNotification",
				"Deleted configuration."
			);
		}, 20000);

		test("Loading wrong file format", async () => {
			await page.goto(fileUrl);
			await page.waitForSelector("#fileInput");
			await page.click("#fileInput");
			await page.waitForSelector('input[type="file"]');
			await page.setInputFiles('input[type="file"]', "./solvedata/error.png");
			await checkNotification(
				page,
				"#alertNotification",
				"No .txt, .trc or .json files found."
			);
		}, 10000);

		test("Interacting with filters", async () => {
			await page.goto(fileUrl);
			await uploadFile(page, ["./solvedata/TraceFiles/shotALL.trc"]);
			await checkNotification(
				page,
				"#alertNotification",
				"Benchmark file succesfully loaded!"
			);
			await waitForElementAndClick(page, "#viewAllResultsButton");
			await page.waitForSelector("#dataTableGenerated_wrapper", {
				state: "visible",
				timeout: 10000
			});
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
			waitForElementAndClick(page, "#filterSelectionButton");
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
		}, 20000);

		test("Button status after viewing a table", async () => {
			await page.goto(fileUrl);
			await uploadFile(page, ["./solvedata/TraceFiles/shotALL.trc"]);
			await checkNotification(
				page,
				"#alertNotification",
				"Benchmark file succesfully loaded!"
			);
			await waitForElementAndClick(page, "#viewAllResultsButton");
			await page.waitForSelector("#dataTableGenerated_wrapper", {
				state: "visible",
				timeout: 10000
			});
			await page.waitForTimeout(5000);
			const buttonIDs = [
				"#viewAllResultsButton",
				"#filterSelectionButton",
				"#saveLocalStorageButton",
				"#downloadConfigurationButtonLayer",
				"#downloadCSVButtonLayer",
				"#deleteLocalStorageButton",
				"#clearTableButton"
			];
			for (const selector of buttonIDs) {
				const button = await page.waitForSelector(selector);
				await button.waitForElementState("visible");
				const isEnabled = await button.isEnabled();
				expect(isEnabled).toBeTruthy();
			}
		}, 20000);
	});

	describe.only("Plot Pages", () => {
		describe("Average Solver Time Page", () => {
			const filePath = "../Src/Pages/average_solver_time.html";
			const absoluteFilePath: string = path.resolve(__dirname, filePath);
			const fileUrl = `file://${absoluteFilePath}`;

			test("Average Solver Time Bar Chart", async () => {
				await page.goto(fileUrl);
				await uploadFile(page, ["./solvedata/TraceFiles/shotALL.trc"]);
				await checkNotification(
					page,
					"#alertNotification",
					"Benchmark file succesfully loaded!"
				);
				await waitForElementAndClick(page, "#viewPlotsButton");
				await page.waitForSelector("#myChart", {
					state: "visible",
					timeout: 3000
				});
				await page.waitForSelector("#statisticsTable", {
					state: "visible",
					timeout: 3000
				});
			}, 10000);
		});

		describe("Solver Time Page", () => {
			const filePath = "../Src/Pages/solver_time.html";
			const absoluteFilePath: string = path.resolve(__dirname, filePath);
			const fileUrl = `file://${absoluteFilePath}`;

			test("Solver Time Line Plot", async () => {
				await page.goto(fileUrl);
				await uploadFile(page, ["./solvedata/TraceFiles/shotALL.trc"]);
				await checkNotification(
					page,
					"#alertNotification",
					"Benchmark file succesfully loaded!"
				);
				await waitForElementAndClick(page, "#viewPlotsButton");
				await page.waitForSelector("#myChart", {
					state: "visible",
					timeout: 3000
				});
			}, 10000);

			test.todo(
				"Save Plot as Image" //, async () => {
				// await page.goto(fileUrl);
				// await uploadFile(page, ["./solvedata/TraceFiles/shotALL.trc"]);
				// await checkNotification(
				// 	page,
				// 	"#alertNotification",
				// 	"Benchmark file succesfully loaded!"
				// );
				// await waitForElementAndClick(page, "#viewPlotsButton");
				// await page.waitForSelector("#myChart", {
				// 	state: "visible",
				// 	timeout: 3000
				// });
				//}, 10000
			);
		});

		describe("Number of Nodes Page", () => {
			const filePath = "../Src/Pages/number_of_nodes.html";
			const absoluteFilePath: string = path.resolve(__dirname, filePath);
			const fileUrl = `file://${absoluteFilePath}`;

			test("Number of Nodes Bar Chart", async () => {
				await page.goto(fileUrl);
				await uploadFile(page, ["./solvedata/TraceFiles/shotALL.trc"]);
				await checkNotification(
					page,
					"#alertNotification",
					"Benchmark file succesfully loaded!"
				);
				await waitForElementAndClick(page, "#viewPlotsButton");
				await page.waitForSelector("#myChart", {
					state: "visible",
					timeout: 3000
				});
				await page.waitForSelector("#statisticsTable", {
					state: "visible",
					timeout: 3000
				});
			}, 10000);
		});

		describe("Number of Iterations Page", () => {
			const filePath = "../Src/Pages/number_of_iterations.html";
			const absoluteFilePath: string = path.resolve(__dirname, filePath);
			const fileUrl = `file://${absoluteFilePath}`;

			test("Number of Iterations Bar Chart", async () => {
				await page.goto(fileUrl);
				await uploadFile(page, ["./solvedata/TraceFiles/shotALL.trc"]);
				await checkNotification(
					page,
					"#alertNotification",
					"Benchmark file succesfully loaded!"
				);
				await waitForElementAndClick(page, "#viewPlotsButton");
				await page.waitForSelector("#myChart", {
					state: "visible",
					timeout: 3000
				});
				await page.waitForSelector("#statisticsTable", {
					state: "visible",
					timeout: 3000
				});
			}, 10000);
		});
	});
});
