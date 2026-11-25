import { test, expect } from "@playwright/test";
import { CollectPageErrors, PageUrl, ViewTable } from "./Helpers";

test.describe("Numbers in the locale of the browser", () => {
	const locales = [
		{ locale: "en-US", entries: /of 6,635 entries/ },
		// Swedish groups the thousands with a (non-breaking) space.
		{ locale: "sv-SE", entries: /of 6\s635 entries/ }
	];

	for (const { locale, entries } of locales) {
		test(`The table counts the entries as ${locale} does`, async ({
			browser
		}) => {
			const context = await browser.newContext({ locale });
			const page = await context.newPage();
			const errors = CollectPageErrors(page);
			await page.goto(PageUrl("report.html"));
			await page.locator("#emptyStateDemoMinlpButton").click();
			await ViewTable(page);

			await expect(page.locator("#dataTableGenerated_info")).toHaveText(
				entries
			);
			expect(errors).toEqual([]);
			await context.close();
		});
	}
});
