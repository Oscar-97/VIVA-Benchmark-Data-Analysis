import { execFileSync } from "child_process";
import * as path from "path";

/**
 * Runs the check of one of the generators and returns what it prints.
 */
function RunCheck(script: string): string {
	const scriptPath = path.resolve(__dirname, "../scripts", script);
	try {
		return execFileSync(process.execPath, [scriptPath, "--check"], {
			encoding: "utf8",
			stdio: "pipe"
		});
	} catch (error) {
		const failure = error as { stderr?: string };
		throw new Error(failure.stderr ?? String(error), { cause: error });
	}
}

describe("Generated files", () => {
	it("should have pages that are what Src/Templates produces", () => {
		// The pages (report.html and Src/Pages/*.html) are generated, so they must not be edited by hand.
		expect(RunCheck("build-pages.mjs")).toContain("up to date");
	}, 60000);

	it("should have a service worker that lists the files and has the cache name that the build produces", () => {
		// Run "npm run build" after changing a page or anything in Dist.
		expect(RunCheck("build-service-worker.mjs")).toContain("up to date");
	}, 60000);
});
