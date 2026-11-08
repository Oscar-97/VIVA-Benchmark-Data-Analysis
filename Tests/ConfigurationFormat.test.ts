import * as fs from "fs";
import * as path from "path";
import { UserData } from "../Src/Scripts/Interfaces/Interfaces";
import { ToStoredConfiguration } from "../Src/Scripts/UserConfiguration/StoredConfiguration";
import {
	CONFIGURATION_VERSION,
	IsSupportedVersion,
	LinesToRows,
	ReadDataSet,
	RowsToLines,
	UpgradeConfiguration
} from "../Src/Scripts/UserConfiguration/ConfigurationFormat";
import { DEFAULT_HEADERS } from "../Src/Scripts/Constants/TraceHeaders";

describe("LinesToRows", () => {
	it("should name the values of a row with the columns of the header", () => {
		expect(
			LinesToRows([
				"* InputFileName,SolverName,SolverTime,Fail",
				"alan,shot,0.04,false",
				"ball,scip,900.08,true"
			])
		).toEqual([
			{
				InputFileName: "alan",
				SolverName: "shot",
				SolverTime: 0.04,
				Fail: false
			},
			{
				InputFileName: "ball",
				SolverName: "scip",
				SolverTime: 900.08,
				Fail: true
			}
		]);
	});

	it("should use the default columns when there is no header", () => {
		const [row] = LinesToRows(["alan,MINLP,shot"]);

		expect(row).toEqual({
			[DEFAULT_HEADERS[0] ?? ""]: "alan",
			[DEFAULT_HEADERS[1] ?? ""]: "MINLP",
			[DEFAULT_HEADERS[2] ?? ""]: "shot"
		});
	});

	it("should keep as text what would not give the same text back as a number", () => {
		const [row] = LinesToRows([
			"* A,B,C,D,E,F",
			"0.000000e+0,007,-0,1e+3,1.797693134862316e+308,Infinity"
		]);

		expect(row).toEqual({
			A: "0.000000e+0",
			B: "007",
			C: "-0",
			D: "1e+3",
			// The value that solvers write for infinity is more than a number can be, and it is kept as it is.
			E: "1.797693134862316e+308",
			F: "Infinity"
		});
	});

	it("should leave out the columns that a short row does not have, and the cells after the last column", () => {
		expect(LinesToRows(["* A,B", "1", "1,2,3"])).toEqual([
			{ A: 1 },
			{ A: 1, B: 2 }
		]);
	});

	it("should skip empty lines and header lines in between", () => {
		expect(LinesToRows(["* A", "", ",,", "* B", "7"])).toEqual([{ A: 7 }]);
	});

	it("should read a header that is split over several lines", () => {
		expect(LinesToRows(["* A,B", "* C", "1,2,3"])).toEqual([
			{ A: 1, B: 2, C: 3 }
		]);
	});

	it("should keep an empty cell as an empty text", () => {
		expect(LinesToRows(["* A,B", "x,"])).toEqual([{ A: "x", B: "" }]);
	});

	it("should have no rows for no lines", () => {
		expect(LinesToRows([])).toEqual([]);
	});
});

describe("RowsToLines", () => {
	it("should write a header line and a line for every row", () => {
		expect(
			RowsToLines([
				{ InputFileName: "alan", SolverTime: 0.04, Fail: false },
				{ InputFileName: "ball", SolverTime: 900.08, Fail: true }
			])
		).toEqual([
			"* InputFileName,SolverTime,Fail",
			"alan,0.04,false",
			"ball,900.08,true"
		]);
	});

	it("should take the columns in the order in which they first appear, and leave a missing value empty", () => {
		expect(RowsToLines([{ A: 1 }, { B: 2, A: 3 }])).toEqual([
			"* A,B",
			"1,",
			"3,2"
		]);
	});

	it("should write nothing for no rows, or rows without columns", () => {
		expect(RowsToLines([])).toEqual([]);
		expect(RowsToLines([{}])).toEqual([]);
	});
});

describe("the rows and the lines", () => {
	it("should give the same lines back", () => {
		const lines = [
			"* InputFileName,ObjectiveValue,SolverTime,Fail,FailReason",
			"alan,2.925000e+0,0.04,false,Normal Completion",
			"ball_mk3_10,1.797693e+308,0.95,false,",
			"batch,-0.5,900.08,true,Resource Interrupt"
		];

		expect(RowsToLines(LinesToRows(lines))).toEqual(lines);
	});
});

describe("ReadDataSet", () => {
	it("should give the lines of version 1 as they are", () => {
		expect(ReadDataSet(["a", "b"])).toEqual(["a", "b"]);
	});

	it("should make the lines of the rows of version 2", () => {
		expect(ReadDataSet([{ A: 1 }, { A: 2 }])).toEqual(["* A", "1", "2"]);
	});

	it("should read an empty data set as no lines", () => {
		expect(ReadDataSet([])).toEqual([]);
	});

	it.each([
		["not a list", "x"],
		["a list of numbers", [1, 2]],
		["a mix of lines and rows", ["a", { A: 1 }]],
		["rows that have a list as a value", [{ A: [1] }]],
		["null", null],
		["a list with a list", [["a"]]]
	])("should not read %s", (_, value) => {
		expect(ReadDataSet(value)).toBeUndefined();
	});
});

describe("IsSupportedVersion", () => {
	it.each([undefined, 1, 2])("should read version %s", (version) => {
		expect(IsSupportedVersion(version)).toBe(true);
	});

	it.each([0, 3, 1.5, "2", null, NaN])(
		"should not read version %s",
		(version) => {
			expect(IsSupportedVersion(version)).toBe(false);
		}
	);

	it("should know the current version", () => {
		expect(CONFIGURATION_VERSION).toBe(2);
		expect(IsSupportedVersion(CONFIGURATION_VERSION)).toBe(true);
	});
});

describe("UpgradeConfiguration", () => {
	it("should give a configuration of version 1 the current format", () => {
		expect(
			UpgradeConfiguration({
				dataSet: ["* A,B", "x,1"],
				dataFileType: "json",
				defaultTime: 500
			})
		).toEqual({
			version: 2,
			dataSet: [{ A: "x", B: 1 }],
			dataFileType: "json",
			defaultTime: 500
		});
	});

	it("should leave a configuration of the current format as it is", () => {
		const current = {
			version: 2,
			dataSet: [{ A: "x", B: 1 }],
			dataFileType: "json"
		};

		expect(UpgradeConfiguration(current)).toEqual(current);
	});

	it("should not upgrade what cannot be read", () => {
		expect(
			UpgradeConfiguration({
				version: 3,
				dataSet: [{ A: 1 }],
				dataFileType: "x"
			})
		).toBeUndefined();
		expect(
			UpgradeConfiguration({
				dataSet: ["a", { A: 1 }] as unknown as object[],
				dataFileType: "x"
			})
		).toBeUndefined();
	});
});

describe("the examples of the documentation", () => {
	const readme = fs.readFileSync(
		path.join(__dirname, "..", "Src", "Docs", "README.md"),
		"utf8"
	);
	const section = readme.slice(readme.indexOf("### 2.2 .json"));
	const examples = [...section.matchAll(/```json\r?\n([\s\S]*?)```/g)].map(
		(match) => JSON.parse(match[1] ?? "") as UserData
	);

	it("should have an example of version 2 and one of version 1", () => {
		expect(examples.map((example) => example.version)).toEqual([2, undefined]);
	});

	it.each([
		[0, 4],
		[1, 3]
	])(
		"should be read by the application (example %i has %i lines with the header)",
		(index, lineCount) => {
			const example = examples[index];
			const configuration = example
				? ToStoredConfiguration(example)
				: undefined;

			expect(configuration?.dataFileType).toBe("json");
			expect(configuration?.dataSet[0]).toMatch(/^\* InputFileName,/);
			expect(configuration?.dataSet).toHaveLength(lineCount);
		}
	);

	it("should give both examples the same rows for the same solver runs", () => {
		const [current, old] = examples.map((example) =>
			LinesToRows(ToStoredConfiguration(example)?.dataSet ?? [])
		);

		expect(current?.[0]).toMatchObject({
			InputFileName: "alan",
			SolverTime: 0.142,
			Fail: false
		});
		expect(old?.[0]).toEqual({
			InputFileName: "alan",
			ModelType: "MINLP",
			SolverName: "knitro",
			Direction: "min",
			SolverTime: 0.142,
			Fail: false
		});
	});
});
