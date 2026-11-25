import { test, expect, Page } from "@playwright/test";
import {
	ClickDataMenuItem,
	ClickHelpMenuItem,
	ExpectNotification,
	ImportFiles,
	PageUrl,
	TestFile,
	ViewTable
} from "./Helpers";

/**
 * The space between the lowest text, field or button in a modal and the bottom of the modal.
 */
async function SpaceBelowContent(page: Page, modal: string): Promise<number> {
	return page.locator(`${modal} .modal-content`).evaluate((content) => {
		const bottom = content.getBoundingClientRect().bottom;
		let lowest = 0;
		for (const element of content.querySelectorAll("*")) {
			const box = element.getBoundingClientRect();
			// Text, fields and buttons: the innermost elements, and a button as a whole. A container ends where the
			// modal ends.
			const isContent =
				element.children.length === 0 ||
				element.matches("button, input, select");
			if (isContent && box.height > 0 && box.width > 0) {
				lowest = Math.max(lowest, box.bottom);
			}
		}
		return bottom - lowest;
	});
}

test.describe("Modals", () => {
	// The padding of a modal is 1rem (16px). The last paragraph or field must not add its own margin to it.
	const MAX_SPACE = 17;

	test("The file formats modal has no extra space at the bottom", async ({
		page
	}) => {
		await page.goto(PageUrl("report.html"));
		await ClickHelpMenuItem(page, "#fileFormatsHelpItem");
		await expect(page.locator("#fileFormatInformationModal")).toBeVisible();

		await expect
			.poll(() => SpaceBelowContent(page, "#fileFormatInformationModal"))
			.toBeLessThanOrEqual(MAX_SPACE);
	});

	test("The export modal has no extra space at the bottom", async ({
		page
	}) => {
		await page.goto(PageUrl("report.html"));
		await ImportFiles(page, [TestFile("shotALL.trc")]);
		await ExpectNotification(page, "Benchmarks loaded with following files");
		await ViewTable(page);
		await ClickDataMenuItem(page, "#configurationSettingsButton");
		await expect(page.locator("#configurationSettingsModal")).toBeVisible();

		await expect
			.poll(() => SpaceBelowContent(page, "#configurationSettingsModal"))
			.toBeLessThanOrEqual(MAX_SPACE);
	});
});
