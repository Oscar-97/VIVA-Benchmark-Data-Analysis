import { test, expect } from "@playwright/test";
import { CollectPageErrors, PageUrl } from "./Helpers";

test.describe("Theme", () => {
	test("follows the system theme, and the toggle is remembered", async ({
		page
	}) => {
		const errors = CollectPageErrors(page);
		await page.emulateMedia({ colorScheme: "dark" });
		await page.goto(PageUrl("report.html"));
		const html = page.locator("html");
		await expect(html).toHaveAttribute("data-bs-theme", "dark");

		const toggle = page.locator("#themeToggleButton");
		await expect(toggle).toHaveAttribute("aria-pressed", "true");
		await toggle.click();
		await expect(html).toHaveAttribute("data-bs-theme", "light");
		await expect(toggle).toHaveAttribute("aria-pressed", "false");

		await page.reload();
		await expect(html).toHaveAttribute("data-bs-theme", "light");
		expect(errors).toEqual([]);
	});

	test("is light without a stored choice and a light system", async ({
		page
	}) => {
		await page.emulateMedia({ colorScheme: "light" });
		await page.goto(PageUrl("report.html"));
		await expect(page.locator("html")).toHaveAttribute(
			"data-bs-theme",
			"light"
		);
	});
});
