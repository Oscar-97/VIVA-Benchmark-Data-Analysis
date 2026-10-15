import AxeBuilder from "@axe-core/playwright";
import { test, expect, Page } from "@playwright/test";
import { PageUrl, PLOT_PAGES } from "./Helpers";

/**
 * The accessibility rules (WCAG 2 A and AA) that the pages are known to break. A page that breaks another rule
 * fails the test. Remove a rule from the list when the pages are fixed, so that they cannot break it again.
 */
const KNOWN_VIOLATIONS: string[] = [];

const PAGES = [
	"report.html",
	"Src/Pages/compare_solvers.html",
	...PLOT_PAGES.map(({ name }) => `Src/Pages/${name}.html`)
];

/**
 * Waits for the fade-in of the content, and returns the rules that the page breaks, with their elements.
 * Axe reads the colors while the content fades in, and then finds text that is nearly transparent.
 */
async function BrokenRules(
	page: Page
): Promise<{ id: string; help: string; targets: unknown[] }[]> {
	await page.waitForFunction(() =>
		[...document.querySelectorAll("body > :not(nav, hr)")].every(
			(element) => getComputedStyle(element).opacity === "1"
		)
	);
	const { violations } = await new AxeBuilder({ page })
		.withTags(["wcag2a", "wcag2aa"])
		.analyze();
	return violations
		.filter(({ id }) => !KNOWN_VIOLATIONS.includes(id))
		.map(({ id, help, nodes }) => ({
			id,
			help,
			targets: nodes.map((node) => node.target)
		}));
}

test.describe("Accessibility", () => {
	for (const file of PAGES) {
		test(`${file} breaks no other rule than the known ones`, async ({
			page
		}) => {
			await page.goto(PageUrl(file));
			expect(await BrokenRules(page)).toEqual([]);
		});
	}
	test("The empty page, in the dark theme, breaks no other rule than the known ones", async ({
		browser
	}) => {
		const context = await browser.newContext({ colorScheme: "dark" });
		const page = await context.newPage();
		await page.goto(PageUrl("report.html"));
		await expect(page.locator("#emptyState")).toBeVisible();

		expect(await BrokenRules(page)).toEqual([]);

		await context.close();
	});
});
