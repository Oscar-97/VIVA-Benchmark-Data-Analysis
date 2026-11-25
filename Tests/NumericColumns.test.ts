import {
	FindNumericColumns,
	GetSortValue
} from "../Src/Scripts/DataTable/NumericColumns";

describe("FindNumericColumns", () => {
	const rows = [
		{ problem: "a", gap: 1.5, bound: Infinity, status: "ok", flag: false },
		{ problem: "b", gap: 0, bound: -3, status: 4, flag: true },
		{ problem: "c", gap: NaN, bound: undefined, status: "ok", flag: false }
	];
	const keys = ["problem", "gap", "bound", "status", "flag", "other"];

	it("finds the columns with only numbers, also infinity and NaN", () => {
		expect([...FindNumericColumns(rows, keys)]).toEqual(["gap", "bound"]);
	});

	it("leaves out a column of text, of booleans and one with text among the numbers", () => {
		const numeric = FindNumericColumns(rows, keys);

		expect(numeric.has("problem")).toBe(false);
		expect(numeric.has("flag")).toBe(false);
		expect(numeric.has("status")).toBe(false);
	});

	it("takes the texts that are written as numbers for numbers", () => {
		const numeric = FindNumericColumns(
			[
				{ bound: "1.510000e+2" },
				{ bound: -3.5 },
				{ bound: "-Infinity" },
				{ bound: "NaN" }
			],
			["bound"]
		);

		expect(numeric.has("bound")).toBe(true);
	});

	it("leaves out a column with a text that is not a number, or an empty one", () => {
		expect(FindNumericColumns([{ x: "1" }, { x: "NA" }], ["x"]).has("x")).toBe(
			false
		);
		expect(FindNumericColumns([{ x: "1" }, { x: " " }], ["x"]).has("x")).toBe(
			false
		);
	});

	it("leaves out a column without any number, and a table without rows", () => {
		expect(FindNumericColumns(rows, ["other"]).size).toBe(0);
		expect(FindNumericColumns([], keys).size).toBe(0);
	});

	it("does not count missing values against a column", () => {
		const numeric = FindNumericColumns(
			[{ time: 1 }, { time: null }, { time: undefined }],
			["time"]
		);

		expect(numeric.has("time")).toBe(true);
	});
});

describe("GetSortValue", () => {
	it("is the number", () => {
		expect(GetSortValue(151)).toBe(151);
		expect(GetSortValue(-106411.8)).toBe(-106411.8);
		expect(GetSortValue(0)).toBe(0);
		expect(GetSortValue(1.5e21)).toBe(1.5e21);
	});

	it("is the number that a text is written as", () => {
		expect(GetSortValue("1.510000e+2")).toBe(151);
		expect(GetSortValue("-1.064118e+5")).toBe(-106411.8);
	});

	it("puts infinity at the ends, as finite numbers", () => {
		expect(GetSortValue(Infinity)).toBe(Number.MAX_VALUE);
		expect(GetSortValue("Infinity")).toBe(Number.MAX_VALUE);
		expect(GetSortValue(-Infinity)).toBe(-Number.MAX_VALUE);
		expect(GetSortValue("-Infinity")).toBe(-Number.MAX_VALUE);
	});

	it("puts NaN and a missing value with the smallest", () => {
		expect(GetSortValue(NaN)).toBe(-Number.MAX_VALUE);
		expect(GetSortValue("NaN")).toBe(-Number.MAX_VALUE);
		expect(GetSortValue(undefined)).toBe(-Number.MAX_VALUE);
		expect(GetSortValue(null)).toBe(-Number.MAX_VALUE);
	});
});
