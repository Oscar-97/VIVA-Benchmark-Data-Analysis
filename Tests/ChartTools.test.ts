jest.mock("../Src/Scripts/Elements/Elements", () => ({
	FindElement: jest.fn()
}));

import {
	ChartFileName,
	DescribeChartTools,
	ImagePixelRatio,
	MAX_IMAGE_SIDE
} from "../Src/Scripts/Chart/ChartTools";

describe("ChartFileName", () => {
	const date = new Date(2026, 9, 29);

	it.each([
		["Performance Profile", "viva_performance_profile_2026-10-29.png"],
		[
			"Average, min, max and std for solver time",
			"viva_average_min_max_and_std_for_solver_time_2026-10-29.png"
		],
		[
			"  Solver time per Instance!  ",
			"viva_solver_time_per_instance_2026-10-29.png"
		],
		["Gap [%] (primal)", "viva_gap_primal_2026-10-29.png"]
	])("should make the name %j from the title and the date", (title, name) => {
		expect(ChartFileName(title, date)).toBe(name);
	});

	it("should name a chart without a usable title", () => {
		expect(ChartFileName("", date)).toBe("viva_chart_2026-10-29.png");
		expect(ChartFileName("???", date)).toBe("viva_chart_2026-10-29.png");
	});

	it("should write the month and the day with two digits", () => {
		expect(ChartFileName("Chart", new Date(2027, 0, 5))).toBe(
			"viva_chart_2027-01-05.png"
		);
	});

	it("should use today when no date is given", () => {
		expect(ChartFileName("Chart")).toMatch(
			/^viva_chart_\d{4}-\d{2}-\d{2}\.png$/
		);
	});
});

describe("ImagePixelRatio", () => {
	it("should multiply the ratio of the screen by the scale", () => {
		expect(ImagePixelRatio(1, 1, 1000, 500)).toBe(1);
		expect(ImagePixelRatio(2, 1, 1000, 500)).toBe(2);
		expect(ImagePixelRatio(3, 1.5, 1000, 500)).toBe(4.5);
	});

	it("should not make the image smaller than on the screen", () => {
		expect(ImagePixelRatio(0.5, 2, 1000, 500)).toBe(2);
	});

	it("should stop before the longest side is more than a canvas can have", () => {
		const ratio = ImagePixelRatio(3, 2, 4000, 1000);

		expect(ratio).toBe(MAX_IMAGE_SIDE / 4000);
		expect(ratio * 4000).toBeLessThanOrEqual(MAX_IMAGE_SIDE);
	});

	it("should not divide by an empty chart", () => {
		expect(Number.isFinite(ImagePixelRatio(2, 1, 0, 0))).toBe(true);
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
