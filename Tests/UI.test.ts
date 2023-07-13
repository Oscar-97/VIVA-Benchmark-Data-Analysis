import { chromium, Browser, Page, BrowserContext } from "playwright";
import * as path from "path";

describe("UI tests", () => {
	let browser: Browser;
	let context: BrowserContext;
	let page: Page;

	beforeAll(async () => {
		browser = await chromium.launch();
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
	) {
		await page.waitForSelector(selector, { state: "visible", timeout: 5000 });

		const notificationElement = await page.$(selector);

		const isVisible = await notificationElement?.isVisible();
		expect(isVisible).toBeTruthy();

		const notificationText = await notificationElement?.innerText();
		expect(notificationText).toBe(expectedText);
	}

	async function uploadFile(page: Page, fileNames: string[]) {
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
			try {
				await page.goto(fileUrl);
				const tableTitle = await page.title();
				expect(tableTitle).toBe("Report");
				await page.screenshot({ path: "TestScreenshots/reportpage.png" });

				await page.click("xpath=/html/body/nav/div/div/ul[1]/li[2]/ul/li[1]/a");
				await page.waitForTimeout(2000);
				const averageSolverTimeTitle = await page.title();
				expect(averageSolverTimeTitle).toBe("Average Solver Time");

				await page.click("xpath=/html/body/nav/div/div/ul[1]/li[2]/ul/li[2]/a");
				await page.waitForTimeout(2000);
				const solverTimeTitle = await page.title();
				expect(solverTimeTitle).toBe("Solver Time");

				await page.click("xpath=/html/body/nav/div/div/ul[1]/li[2]/ul/li[3]/a");
				await page.waitForTimeout(2000);
				const numberOfNodesTitle = await page.title();
				expect(numberOfNodesTitle).toBe("Number of Nodes");

				await page.click("xpath=/html/body/nav/div/div/ul[1]/li[2]/ul/li[4]/a");
				await page.waitForTimeout(2000);
				const numberOfIterationsTitle = await page.title();
				expect(numberOfIterationsTitle).toBe("Number of Iterations");

				await page.click("xpath=/html/body/nav/div/div/ul[1]/li[1]/a");
				await page.waitForTimeout(2000);
				expect(tableTitle).toBe("Report");
			} catch (error) {
				console.error(error);
				throw error;
			}
		}, 30000);
	});

	describe("Table Page", () => {
		const filePath = "../report.html";
		const absoluteFilePath: string = path.resolve(__dirname, filePath);
		const fileUrl = `file://${absoluteFilePath}`;

		test("Handle multiple trace files", async () => {
			try {
				await page.goto(fileUrl);
				await uploadFile(page, [
					"./solvedata/TraceFiles/shotALL.trc",
					"./solvedata/TraceFiles/scipALL.trc",
					"./solvedata/TraceFiles/pavitoALL.trc"
				]);
				await page.screenshot({ path: "TestScreenshots/multiplefiles1.png" });
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
			} catch (error) {
				console.error(error);
				throw error;
			}
		}, 30000);

		test("Instance information and best known bound values files", async () => {
			try {
				await page.goto(fileUrl);
				await uploadFile(page, [
					"./solvedata/TraceFiles/shotALL.trc",
					"./solvedata/TraceFiles/minlp.solu",
					"./solvedata/TraceFiles/instancedata.csv"
				]);
				await page.screenshot({ path: "TestScreenshots/multiplefiles2.png" });
				await checkNotification(
					page,
					"#alertNotification",
					"Instance information succesfully loaded!"
				);
				await waitForElementAndClick(page, "#viewAllResultsButton");

				await page.waitForSelector("#dataTableGenerated_wrapper", {
					state: "visible",
					timeout: 5000
				});
			} catch (error) {
				console.error(error);
				throw error;
			}
		}),
			30000;

		test("Handle JSON-file", async () => {
			try {
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
			} catch (error) {
				console.error(error);
				throw error;
			}
		}, 30000);

		test("Handle text file", async () => {
			try {
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
			} catch (error) {
				console.error(error);
				throw error;
			}
		}, 30000);

		test("Saving to and loading from local storage ", async () => {
			try {
				await page.goto(fileUrl);
				// TODO: Test local storage.
			} catch (error) {
				console.error(error);
				throw error;
			}
		}, 30000);

		test("Loading wrong file format", async () => {
			try {
				await page.goto(fileUrl);
				await uploadFile(page, ["./solvedata/error.png"]);
				await checkNotification(
					page,
					"#alertNotification",
					"No .txt, .trc or .json files found."
				);
			} catch (error) {
				console.error(error);
				throw error;
			}
		}, 30000);

		test("Interacting with filters", async () => {
			try {
				await page.goto(fileUrl);
				await uploadFile(page, ["./solvedata/TraceFiles/shotALL.trc"]);
				await checkNotification(
					page,
					"#alertNotification",
					"Benchmark file succesfully loaded!"
				);
				await waitForElementAndClick(page, "#viewAllResultsButton");
				// TODO: Test filtering.
			} catch (error) {
				console.error(error);
				throw error;
			}
		}, 30000);

		test("Button functionality", async () => {
			try {
				await page.goto(fileUrl);
				await uploadFile(page, ["./solvedata/TraceFiles/shotALL.trc"]);
				await checkNotification(
					page,
					"#alertNotification",
					"Benchmark file succesfully loaded!"
				);
				await waitForElementAndClick(page, "#viewAllResultsButton");
				// TODO: Test all buttons on tabel page
			} catch (error) {
				console.error(error);
				throw error;
			}
		}, 30000);
	});

	describe("Plot Pages", () => {
		describe("Average Solver Time Page", () => {
			test("", async () => {}, 20000);
		});

		describe("Solver Time Page", () => {
			test("", async () => {}, 20000);
		});

		describe("Number of Nodes Page", () => {
			test("", async () => {}, 20000);
		});

		describe("Number of Iterations Page", () => {
			test("", async () => {}, 20000);
		});
	});
});
