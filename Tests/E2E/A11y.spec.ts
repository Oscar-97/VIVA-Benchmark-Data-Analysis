import AxeBuilder from "@axe-core/playwright";
import { test, expect } from "@playwright/test";
import { PageUrl, PLOT_PAGES } from "./Helpers";

/**
 * The accessibility rules (WCAG 2 A and AA) that the pages are known to break. A page that breaks another rule
 * fails the test. Remove a rule from the list when the pages are fixed, so that they cannot break it again.
 */
const KNOWN_VIOLATIONS = ["color-contrast", "link-name"];

const PAGES = [
	"report.html",
	"Src/Pages/compare_solvers.html",
	...PLOT_PAGES.map(({ name }) => `Src/Pages/${name}.html`)
];

test.describe("Accessibility", () => {
	for (const file of PAGES) {
		test(`${file} breaks no other rule than the known ones`, async ({
			page
		}) => {
			await page.goto(PageUrl(file));

			const { violations } = await new AxeBuilder({ page })
				.withTags(["wcag2a", "wcag2aa"])
				.analyze();

			const unexpected = violations
				.filter(({ id }) => !KNOWN_VIOLATIONS.includes(id))
				.map(({ id, help, nodes }) => ({
					id,
					help,
					targets: nodes.map((node) => node.target)
				}));
			expect(unexpected).toEqual([]);
		});
	}
});
