import AxeBuilder from "@axe-core/playwright";
import { test, expect } from "@playwright/test";
import { ImportFiles, PageUrl, TestFile } from "./Helpers";

const FIREFOX =
	"Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:130.0) Gecko/20100101 Firefox/130.0";

test.describe("The note on files that are opened from the file system", () => {
	test("is not shown in a browser that gives the files one origin", async ({
		page
	}) => {
		await page.goto(PageUrl("report.html"));
		await expect(page.locator("#emptyState")).toBeVisible();
		await expect(page.locator("#fileStorageNote")).toBeHidden();
	});

	test.describe("in Firefox", () => {
		test.use({ userAgent: FIREFOX });

		test("is shown in the empty state, breaks no accessibility rule, and goes with the empty state", async ({
			page
		}) => {
			await page.goto(PageUrl("report.html"));
			const note = page.locator("#fileStorageNote");
			await expect(note).toBeVisible();
			await expect(note).toContainText("Open VIVA from a web server");

			// Axe reads the colors while the content fades in, and then finds text that is nearly transparent.
			await page.waitForFunction(() =>
				[...document.querySelectorAll("body > :not(nav, hr)")].every(
					(element) => getComputedStyle(element).opacity === "1"
				)
			);
			const { violations } = await new AxeBuilder({ page })
				.withTags(["wcag2a", "wcag2aa"])
				.analyze();
			expect(violations.map(({ id }) => id)).toEqual([]);

			await ImportFiles(page, [TestFile("shotALL.trc")]);
			await expect(page.locator("#emptyState")).toBeHidden();
			await expect(note).toBeHidden();
		});

		test("is shown on a plot page too", async ({ page }) => {
			await page.goto(PageUrl("Src/Pages/performance_profile.html"));
			await expect(page.locator("#fileStorageNote")).toBeVisible();
		});
	});
});
