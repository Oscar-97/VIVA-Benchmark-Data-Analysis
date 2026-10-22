import { test, expect } from "@playwright/test";
import { CollectPageErrors, PageUrl, PLOT_PAGES } from "./Helpers";

const PLOT_MENU = "xpath=/html/body/nav/div/div/ul[1]/li[2]";

test.describe("Navigation", () => {
	test("Navigation reaches every page, and the titles are correct", async ({
		page
	}) => {
		const errors = CollectPageErrors(page);
		await page.goto(PageUrl("report.html"));
		await expect(page).toHaveTitle("Report");

		for (const [index, { title }] of PLOT_PAGES.entries()) {
			await page.click(`${PLOT_MENU}/a`);
			await page.click(`${PLOT_MENU}/ul/li[${index + 1}]/a`);
			await expect(page).toHaveTitle(title);
		}

		await page.click("xpath=/html/body/nav/div/div/ul[1]/li[3]/a");
		await expect(page).toHaveTitle("Compare Solvers");

		await page.click("xpath=/html/body/nav/div/div/ul[1]/li[1]/a");
		await expect(page).toHaveTitle("Report");
		expect(errors).toEqual([]);
	});
});
