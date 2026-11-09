import * as fs from "fs";
import * as path from "path";
import { test, expect, Locator, Page } from "@playwright/test";
import {
	ExpectNotification,
	ImportFiles,
	IsChartDrawn,
	PageUrl,
	ROOT,
	TestFile,
	THREE_TRACES,
	ViewTable
} from "./Helpers";

/**
 * The documentation names the buttons and the settings of the pages in bold. These tests read the names from the
 * documentation, and check that the pages have them, so a renamed button cannot stay in the documentation.
 */
const README = fs.readFileSync(
	path.join(ROOT, "Src", "Docs", "README.md"),
	"utf8"
);

interface Documented {
	label: string;
	nested: string[];
}

/**
 * The text of a section of the documentation, from its heading to the next one.
 */
function Section(title: string): string {
	const start = README.indexOf(`### ${title}`);
	expect(start, `The section ${title} is in the documentation`).toBeGreaterThan(
		-1
	);
	const rest = README.slice(start + 4);
	const end = rest.search(/\r?\n##+ /);
	return end === -1 ? rest : rest.slice(0, end);
}

/**
 * The names in bold at the start of the list items of a section. The items below one are its submenu.
 */
function DocumentedLabels(title: string): Documented[] {
	const labels: Documented[] = [];
	for (const line of Section(title).split(/\r?\n/)) {
		const match = /^(\s*)- \*\*(.+?)\*\*/.exec(line);
		const [, indent, label] = match ?? [];
		if (indent === undefined || label === undefined) {
			continue;
		}
		if (indent.length === 0) {
			labels.push({ label, nested: [] });
		} else {
			labels.at(-1)?.nested.push(label);
		}
	}
	expect(labels.length, `The section ${title} names something`).toBeGreaterThan(
		0
	);
	return labels;
}

/**
 * A pattern for the text of an element that is the name. *n* in a name is a number, as in "Show *n* rows".
 * The version after "Releases" is allowed, as it is part of that item.
 */
function TextOf(label: string): RegExp {
	const escaped = label
		.replace("*n*", "<NUMBER>")
		.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
		.replace("<NUMBER>", "\\d+")
		.replace(/ /g, "\\s+");
	return new RegExp(`^\\s*${escaped}(\\s+v\\d[\\d.]*)?\\s*$`);
}

/**
 * The elements in the scope with the name as their text.
 */
function Named(page: Page, scope: string, label: string): Locator {
	return page.locator(scope).filter({ hasText: TextOf(label) });
}

/**
 * Closes the menus that are open, and waits until they are. A menu of the table closes with a click next to it, and
 * the next button cannot be used while it covers it.
 */
async function CloseMenus(page: Page): Promise<void> {
	const open = page.locator(".dt-button-collection, .dropdown-menu.show");
	await expect(async () => {
		if ((await open.count()) > 0) {
			await page.keyboard.press("Escape");
			// The top left corner of the page is the navigation bar, next to its first item.
			await page.mouse.click(2, 2);
		}
		await expect(open).toHaveCount(0, { timeout: 1000 });
	}).toPass();
}

/**
 * Checks that the page has everything that the section names, and its submenus after opening the item.
 */
async function ExpectDocumented(
	page: Page,
	title: string,
	scope: string,
	nestedScope: string
): Promise<void> {
	for (const { label, nested } of DocumentedLabels(title)) {
		const item = Named(page, scope, label);
		expect(
			await item.count(),
			`${label} (section ${title}) is on the page`
		).toBeGreaterThan(0);

		if (nested.length > 0) {
			// An item of a closed menu has the same text as a button that is shown, so the one that is shown is used.
			await item.and(page.locator(":visible")).first().click();
			for (const name of nested) {
				await expect(
					Named(page, nestedScope, name),
					`${name} is in the submenu of ${label} (section ${title})`
				).not.toHaveCount(0);
			}
			await CloseMenus(page);
		}
	}
}

/**
 * Opens the report page with the data of one solver, and shows the table.
 */
async function OpenTable(page: Page): Promise<void> {
	await page.goto(PageUrl("report.html"));
	await ImportFiles(page, [TestFile("shotALL.trc")]);
	await ExpectNotification(page, "Benchmarks loaded with following files");
	await ViewTable(page);
}

test.describe("The names in the documentation are on the pages", () => {
	test("The start page (1.1)", async ({ page }) => {
		await page.goto(PageUrl("report.html"));

		await ExpectDocumented(
			page,
			"1.1 The Start Page",
			"#emptyState button",
			"#emptyState button"
		);
	});

	test("The Data menu (1.2)", async ({ page }) => {
		await OpenTable(page);

		await ExpectDocumented(
			page,
			"1.2 Data Menu",
			"#dataMenu .dropdown-item",
			"#dataMenu .dropdown-item"
		);
	});

	test("The table page (1.3)", async ({ page }) => {
		await OpenTable(page);

		await ExpectDocumented(
			page,
			"1.3 Table Page Button Functionality",
			"#buttonContainer button, .dt-buttons button",
			".dt-button-collection li, .dt-button-collection a"
		);
	});

	test("The plot pages (1.4)", async ({ page }) => {
		await page.goto(PageUrl("Src/Pages/performance_profile.html"));
		await ImportFiles(page, THREE_TRACES);
		await expect.poll(() => IsChartDrawn(page)).toBe(true);

		await ExpectDocumented(
			page,
			"1.4 Plot Pages Buttons Functionality",
			"#buttonContainer button, #chartTools button",
			"#chartTools button"
		);
	});

	test("The Compare Solvers page (1.6)", async ({ page }) => {
		await page.goto(PageUrl("Src/Pages/compare_solvers.html"));
		await ImportFiles(page, THREE_TRACES);
		await ExpectNotification(page, "Benchmarks loaded with following files");

		await ExpectDocumented(
			page,
			"1.6 Compare Solvers Page Buttons Functionality",
			"#buttonContainer button",
			"#buttonContainer button"
		);
	});

	test("The navigation bar (1.7)", async ({ page }) => {
		// The navigation bar is expanded on a wide screen, and the menus can be opened.
		await page.setViewportSize({ width: 1500, height: 900 });
		await OpenTable(page);

		await ExpectDocumented(
			page,
			"1.7 Navigation Bar",
			"nav a, nav button, nav label, nav span",
			"nav .dropdown-item"
		);
	});
});

test.describe("The settings in the documentation are on the pages (1.5)", () => {
	const settings: { page: string; labels: string[] }[] = [
		{
			page: "performance_profile",
			labels: ["Profile type", "Time limit (s)", "Gap limit (%)", "Gap type"]
		},
		{ page: "solver_time_all", labels: ["Filter type"] },
		{ page: "termination_status", labels: ["Status Type", "Chart Type"] },
		{ page: "solution_quality", labels: ["Category Type"] }
	];

	for (const { page: name, labels } of settings) {
		test(`${name}: ${labels.join(", ")}`, async ({ page }) => {
			await page.goto(PageUrl(`Src/Pages/${name}.html`));
			const documented = Section("1.5 Settings of the Plot Pages");

			for (const label of labels) {
				expect(documented, `${label} is in the documentation`).toContain(
					`**${label}**`
				);
				await expect(
					page.locator("label").filter({ hasText: TextOf(label) }),
					`${label} is on the page ${name}`
				).not.toHaveCount(0);
			}
		});
	}

	test("compare_solvers: the settings of the comparison (1.6)", async ({
		page
	}) => {
		await page.goto(PageUrl("Src/Pages/compare_solvers.html"));
		const documented = Section(
			"1.6 Compare Solvers Page Buttons Functionality"
		);

		for (const label of [
			"Termination Status",
			"Time limit (s)",
			"Gap limit (%)",
			"Gap type"
		]) {
			expect(documented, `${label} is in the documentation`).toContain(
				`**${label}**`
			);
			await expect(
				page.locator("label").filter({ hasText: TextOf(label) })
			).not.toHaveCount(0);
		}
	});
});
