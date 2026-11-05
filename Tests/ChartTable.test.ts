jest.mock("../Src/Scripts/Elements/Elements", () => ({
	FindElement: jest.fn(() => null)
}));

import { DescribeChart } from "../Src/Scripts/Chart/ChartDescription";
import {
	BuildChartTable,
	MAX_TABLE_ROWS
} from "../Src/Scripts/Chart/ChartTable";

describe("BuildChartTable", () => {
	it("should make a row of values for every data set of a bar chart, with the labels as columns", () => {
		const table = BuildChartTable(
			[
				{ label: "scip", data: [3, 0.5] },
				{ label: "shot", data: [4, 1.25] }
			],
			["Failed", "Solved"]
		);

		expect(table.headers).toEqual(["Data set", "Failed", "Solved"]);
		expect(table.rows).toEqual([
			["scip", "3", "0.5"],
			["shot", "4", "1.25"]
		]);
		expect(table.truncated).toBe(false);
	});

	it("should number the columns that have no label, and leave out the values that are missing", () => {
		const table = BuildChartTable(
			[{ label: "a", data: [1, 2, 3] }, { data: [4] }],
			["only"]
		);

		expect(table.headers).toEqual(["Data set", "only", "2", "3"]);
		expect(table.rows).toEqual([
			["a", "1", "2", "3"],
			["Data set 2", "4", "", ""]
		]);
	});

	it("should make a row for every point of a line chart", () => {
		const table = BuildChartTable(
			[
				{
					label: "scip",
					data: [
						{ x: 1, y: 0.25 },
						{ x: "alan", y: 3 }
					]
				},
				{ label: "shot", data: [{ x: 2, y: 0.5 }] }
			],
			[]
		);

		expect(table.headers).toEqual(["Data set", "X", "Y"]);
		expect(table.rows).toEqual([
			["scip", "1", "0.25"],
			["scip", "alan", "3"],
			["shot", "2", "0.5"]
		]);
	});

	it("should add the size of the points of a bubble chart", () => {
		const table = BuildChartTable(
			[{ label: "bubbles", data: [{ x: 1, y: 2, r: 5 }] }],
			[]
		);

		expect(table.headers).toEqual(["Data set", "X", "Y", "Size"]);
		expect(table.rows).toEqual([["bubbles", "1", "2", "5"]]);
	});

	it("should round the numbers to six significant digits, and write the ones that are not finite as they are", () => {
		const table = BuildChartTable(
			[{ label: "a", data: [1 / 3, Infinity, 123456789] }],
			[]
		);

		expect(table.rows).toEqual([["a", "0.333333", "Infinity", "123457000"]]);
	});

	it("should stop at the most rows, and say so", () => {
		const points = Array.from({ length: MAX_TABLE_ROWS + 5 }, (_, index) => ({
			x: index,
			y: index
		}));

		const table = BuildChartTable([{ label: "many", data: points }], []);

		expect(table.rows).toHaveLength(MAX_TABLE_ROWS);
		expect(table.truncated).toBe(true);
	});

	it("should have only the header for a chart without data sets", () => {
		expect(BuildChartTable([], [])).toEqual({
			headers: ["Data set"],
			rows: [],
			truncated: false
		});
	});
});

describe("DescribeChart", () => {
	const scales = {
		x: { title: { text: "Performance Ratio" } },
		y: { title: { text: ["Fraction of", "instances solved"] } }
	};

	it("should tell the kind of chart, the axes and the data sets", () => {
		expect(
			DescribeChart(
				"line",
				"Absolute performance profile",
				["scip", "shot"],
				scales
			)
		).toBe(
			"Line chart: Absolute performance profile. X axis: Performance Ratio. " +
				"Y axis: Fraction of instances solved. Data sets: scip, shot. " +
				"The values are in the table that Show as table opens."
		);
	});

	it("should leave out what the chart does not have", () => {
		const text = DescribeChart("radar", "Termination", [], {
			r: { grid: {} }
		});

		expect(text).toBe(
			"Radar chart: Termination. The values are in the table that Show as table opens."
		);
	});

	it("should call a chart of a kind that it does not know a chart", () => {
		expect(DescribeChart("polar", "Other", [])).toMatch(/^Chart: Other\./);
	});

	it("should name the first twelve data sets, and count the others", () => {
		const labels = Array.from({ length: 15 }, (_, index) => `s${index + 1}`);

		const text = DescribeChart("bar", "Many", labels);

		expect(text).toContain("s12, and 3 more.");
		expect(text).not.toContain("s13");
	});
});
