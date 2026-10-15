jest.mock("../Src/Scripts/Elements/Elements", () => ({ elements: {} }));

import {
	DescribeFiles,
	FormatFileSize
} from "../Src/Scripts/Elements/LoadStatus";

function FileOf(name: string, size: number): File {
	return new File(["x".repeat(size)], name);
}

describe("FormatFileSize", () => {
	it.each([
		[0, "0 B"],
		[999, "999 B"],
		[1000, "1.0 kB"],
		[1500, "1.5 kB"],
		[12_345, "12 kB"],
		[2_500_000, "2.5 MB"],
		[3_000_000_000, "3.0 GB"],
		[5_000_000_000_000, "5000 GB"]
	])("should write %d bytes as %s", (bytes, text) => {
		expect(FormatFileSize(bytes)).toBe(text);
	});
});

describe("DescribeFiles", () => {
	it("should name a single file with its size", () => {
		expect(DescribeFiles([FileOf("run.trc", 1500)])).toBe(
			"1 file (1.5 kB): run.trc"
		);
	});

	it("should add the sizes of the files", () => {
		expect(DescribeFiles([FileOf("a.trc", 400), FileOf("b.trc", 700)])).toBe(
			"2 files (1.1 kB): a.trc, b.trc"
		);
	});

	it("should count the files after the fourth", () => {
		const files = ["a", "b", "c", "d", "e", "f"].map((name) =>
			FileOf(`${name}.trc`, 10)
		);

		expect(DescribeFiles(files)).toBe(
			"6 files (60 B): a.trc, b.trc, c.trc, d.trc, and 2 more"
		);
	});
});
