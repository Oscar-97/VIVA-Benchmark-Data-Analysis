import { test, expect, Page } from "@playwright/test";
import {
	CollectPageErrors,
	ExpectNotification,
	ImportFiles,
	PageUrl,
	PLOT_PAGES,
	TestFile
} from "./Helpers";

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

		await ImportFiles(page, [TestFile("shotALL.trc")]);
		await ExpectNotification(page, "Benchmarks loaded with following files");
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
		await ImportFiles(page, [TestFile("shotALL.trc")]);
		await ExpectNotification(page, "Benchmarks loaded with following files");
		await page.locator("#dataMenuButton").click();
		await expect(
			page.locator("#dataMenu .dropdown-menu .dropdown-item")
		).toHaveCount(4);
	});

	test("Opening a menu of the navigation bar closes the Data menu", async ({
		page
	}) => {
		// The navigation bar is expanded, and its menus open when the pointer is over them.
		await page.setViewportSize({ width: 1500, height: 900 });
		await page.goto(PageUrl("report.html"));
		await ImportFiles(page, [TestFile("shotALL.trc")]);
		await ExpectNotification(page, "Benchmarks loaded with following files");

		await page.locator("#dataMenuButton").click();
		const dataMenu = page.locator("#dataMenu .dropdown-menu");
		await expect(dataMenu).toBeVisible();

		await page.locator(`${PLOT_MENU}/a`).hover();
		await expect(page.locator(`${PLOT_MENU}/ul`)).toBeVisible();
		await expect(dataMenu).toBeHidden();
	});

	test.describe("The Help menu fits on the screen", () => {
		/**
		 * The position of the Help menu on the page, and of the theme button that follows it.
		 */
		async function Boxes(page: Page): Promise<{
			menu: { left: number; right: number; bottom: number };
			theme: { top: number };
			width: number;
		}> {
			return page.evaluate(() => {
				const menu = document
					.getElementById("helpMenu")
					?.getBoundingClientRect();
				const theme = document
					.getElementById("themeToggleButton")
					?.getBoundingClientRect();
				if (!menu || !theme) {
					throw new Error("The Help menu is missing.");
				}
				return {
					menu: { left: menu.left, right: menu.right, bottom: menu.bottom },
					theme: { top: theme.top },
					width: document.documentElement.clientWidth
				};
			});
		}

		test("On a wide screen it opens on hover and ends at the right edge of the page", async ({
			page
		}) => {
			await page.setViewportSize({ width: 1480, height: 770 });
			await page.goto(PageUrl("report.html"));

			await page.locator("#helpMenuButton").hover();
			await expect(page.locator("#fileFormatsHelpItem")).toBeVisible();

			const { menu, width } = await Boxes(page);
			expect(menu.left).toBeGreaterThanOrEqual(0);
			expect(menu.right).toBeLessThanOrEqual(width);
		});

		test("On a wide screen it also opens on a click", async ({ page }) => {
			await page.setViewportSize({ width: 1480, height: 770 });
			await page.goto(PageUrl("report.html"));

			await page.locator("#helpMenuButton").click();
			await expect(page.locator("#demoMinlpMenuItem")).toBeVisible();

			const { menu, width } = await Boxes(page);
			expect(menu.left).toBeGreaterThanOrEqual(0);
			expect(menu.right).toBeLessThanOrEqual(width);
		});

		for (const width of [390, 675, 1000]) {
			test(`With the collapsed navigation bar (${width}px) it opens below its item and moves the next item down`, async ({
				page
			}) => {
				await page.setViewportSize({ width, height: 780 });
				await page.goto(PageUrl("report.html"));
				await page.locator(".navbar-toggler").click();

				const before = (await Boxes(page)).theme.top;
				await page.locator("#helpMenuButton").click();
				await expect(page.locator("#demoMinlpMenuItem")).toBeVisible();

				const { menu, theme, width: pageWidth } = await Boxes(page);
				expect(menu.left).toBeGreaterThanOrEqual(0);
				expect(menu.right).toBeLessThanOrEqual(pageWidth);
				// As wide as the upload field and the library selector at most.
				expect(menu.right - menu.left).toBeLessThanOrEqual(500);
				expect(theme.top).toBeGreaterThanOrEqual(menu.bottom);
				expect(theme.top).toBeGreaterThan(before);
			});
		}
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
