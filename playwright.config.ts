import { defineConfig, devices } from "@playwright/test";

const onCI = Boolean(process.env["CI"]);

/**
 * The browser tests. They open the pages through file:// (the application works from the file system)
 * and, for the offline test, from a server that the test starts itself. Run `npm run build` first.
 */
export default defineConfig({
	testDir: "Tests/E2E",
	testMatch: "**/*.spec.ts",
	outputDir: "test-results",
	// The same folder on every operating system: the snapshots of the data are the same on all of them,
	// and the screenshots are made on Linux only, see the workflow that updates them.
	snapshotPathTemplate: "{testDir}/__snapshots__/{testFileName}/{arg}{ext}",
	fullyParallel: true,
	forbidOnly: onCI,
	retries: onCI ? 2 : 0,
	...(onCI ? { workers: 2 } : {}),
	timeout: 60_000,
	expect: {
		timeout: 15_000
	},
	reporter: onCI
		? [["list"], ["html", { open: "never", outputFolder: "playwright-report" }]]
		: [["list"]],
	use: {
		...devices["Desktop Chrome"],
		viewport: { width: 2560, height: 1440 },
		acceptDownloads: true,
		trace: "on-first-retry",
		screenshot: "only-on-failure"
	},
	projects: [
		{ name: "chromium", testIgnore: "**/Visual.spec.ts" },
		// The screenshots are compared on Linux only, where they are made.
		{ name: "visual", testMatch: "**/Visual.spec.ts" }
	]
});
