import * as fs from "fs";
import * as path from "path";

const root = path.resolve(__dirname, "..");

function ReadRootFile(name: string): string {
	return fs.readFileSync(path.join(root, name), "utf8");
}

describe("llms.txt", () => {
	const content = ReadRootFile("llms.txt");

	it("starts with an H1 header", () => {
		expect(content).toMatch(/^# \S/);
	});

	it("contains links", () => {
		expect(content).toMatch(/\[[^\]]+\]\([^)]+\)/);
	});
});

describe("robots.txt", () => {
	it("has a user agent and only valid lines", () => {
		const lines = ReadRootFile("robots.txt")
			.split(/\r?\n/)
			.filter((line) => line.trim() !== "" && !line.startsWith("#"));
		expect(lines).toContain("User-agent: *");
		for (const line of lines) {
			expect(line).toMatch(/^(User-agent|Allow|Disallow|Sitemap): \S+/);
		}
	});
});
