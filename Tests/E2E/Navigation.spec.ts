import { test, expect } from "@playwright/test";
import { CollectPageErrors, PageUrl, PLOT_PAGES } from "./Helpers";

const PLOT_MENU = "xpath=/html/body/nav/div/div/ul[1]/li[2]";

test.describe("Navigation", () => {
	test("Navigation reaches every page, and the titles are correct", async ({
		page
	}) => {
		const errors = CollectPageErrors(page);
		await page.goto(PageUrl("report.html"));
		await expect(page).toHaveTitle("Results Table – VIVA");

		for (const [index, { title }] of PLOT_PAGES.entries()) {
			await page.click(`${PLOT_MENU}/a`);
			await page.click(`${PLOT_MENU}/ul/li[${index + 1}]/a`);
			await expect(page).toHaveTitle(`${title} – VIVA`);
		}

		await page.click("xpath=/html/body/nav/div/div/ul[1]/li[3]/a");
		await expect(page).toHaveTitle("Compare Solvers – VIVA");

		await page.click("xpath=/html/body/nav/div/div/ul[1]/li[1]/a");
		await expect(page).toHaveTitle("Results Table – VIVA");
		expect(errors).toEqual([]);
	});

	test("The data actions are grouped in the Data menu", async ({ page }) => {
		await page.goto(PageUrl("report.html"));
		await expect(
			page.locator("#buttonContainer > #saveLocalStorageButton")
		).toHaveCount(0);

		await page.locator("#dataMenuButton").click();
		const items = page.locator("#dataMenu .dropdown-menu .dropdown-item");
		await expect(items).toHaveText([
			/Save to browser/,
			/Export configuration\s+\(\.json\)/,
			/Export with options/,
			/Remove saved data/,
			/Clear table view/
		]);
		await expect(page.locator("#deleteLocalStorageButton")).toHaveClass(
			/text-danger/
		);

		await page.goto(PageUrl("Src/Pages/solver_time.html"));
		await page.locator("#dataMenuButton").click();
		await expect(
			page.locator("#dataMenu .dropdown-menu .dropdown-item")
		).toHaveCount(4);
	});

	test("The navigation marks the current page as a link", async ({ page }) => {
		await page.goto(PageUrl("report.html"));
		const current = page.locator('nav a[aria-current="page"]');
		await expect(current).toHaveCount(1);
		await expect(current).toContainText("Table");
		await expect(current).toHaveAttribute("href", /.+/);

		for (const { name, title } of PLOT_PAGES) {
			await page.goto(PageUrl(`Src/Pages/${name}.html`));
			await expect(current).toHaveCount(1);
			await expect(current).toHaveText(new RegExp(title.replace(/ /g, "\\s+")));
			await expect(page.locator("#navbarDropdownMenuLink")).toHaveAttribute(
				"aria-current",
				"true"
			);
		}

		await page.goto(PageUrl("Src/Pages/compare_solvers.html"));
		await expect(current).toHaveCount(1);
		await expect(current).toContainText("Compare Solvers");
		await expect(page.locator("#navbarDropdownMenuLink")).not.toHaveAttribute(
			"aria-current",
			/.*/
		);
	});
});
