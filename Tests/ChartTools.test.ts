jest.mock("../Src/Scripts/Elements/Elements", () => ({
	FindElement: jest.fn()
}));

import {
	ChartFileName,
	DescribeChartTools
} from "../Src/Scripts/Chart/ChartTools";

describe("ChartFileName", () => {
	it.each([
		["Performance Profile", "viva-performance-profile.png"],
		[
			"Average, min, max and std for solver time",
			"viva-average-min-max-and-std-for-solver-time.png"
		],
		["  Solver time per Instance!  ", "viva-solver-time-per-instance.png"],
		["Gap [%] (primal)", "viva-gap-primal.png"]
	])("should make the name %j from the title", (title, name) => {
		expect(ChartFileName(title)).toBe(name);
	});

	it("should name a chart without a usable title", () => {
		expect(ChartFileName("")).toBe("viva-chart.png");
		expect(ChartFileName("???")).toBe("viva-chart.png");
	});
});

describe("DescribeChartTools", () => {
	it("should explain the zoom and count the data sets", () => {
		expect(DescribeChartTools(3, 12, true)).toBe(
			"Scroll or pinch to zoom. 3 of 12 data sets shown."
		);
	});

	it("should leave out the zoom for a chart that cannot be zoomed", () => {
		expect(DescribeChartTools(4, 4, false)).toBe("4 of 4 data sets shown.");
	});

	it("should not count a single data set", () => {
		expect(DescribeChartTools(1, 1, true)).toBe("Scroll or pinch to zoom.");
		expect(DescribeChartTools(1, 1, false)).toBe("");
	});
});
