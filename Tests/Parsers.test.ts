jest.mock("../Src/Scripts/Elements/Elements", () => ({
	elements: {
		librarySelector: { value: "none" },
		defaultTimeDirectInput: {},
		gapLimitDirectInput: {}
	}
}));

jest.mock("../Src/Scripts/Elements/Events/DisplayAlertNotification", () => ({
	DisplayAlertNotification: jest.fn(),
	DisplayWarningNotification: jest.fn(),
	DisplayErrorNotification: jest.fn()
}));

import * as fs from "fs";
import * as path from "path";
import { InfoMessages } from "../Src/Scripts/Constants/Messages";
import { ConvertToTraceFile } from "../Src/Scripts/DataProcessing/CreateData";
import { ExtractTraceData } from "../Src/Scripts/DataProcessing/FilterData";
import { ProcessData } from "../Src/Scripts/DataProcessing/ProcessTraceData";
import { SplitIntoLines } from "../Src/Scripts/DataProcessing/ReadData";
import {
	GetBestKnownBounds,
	GetInstanceInformation
} from "../Src/Scripts/DataProcessing/ReadMetaData";
import { DisplayAlertNotification } from "../Src/Scripts/Elements/Events/DisplayAlertNotification";
import { TraceData } from "../Src/Scripts/Interfaces/Interfaces";
import { At } from "./TestHelpers";

/**
 * Reads a file of the test data the way the application does when a user selects it.
 */
function ReadTestFile(
	name: string,
	extension: "trc" | "csv" | "solu"
): string[] {
	return SplitIntoLines(
		extension,
		fs.readFileSync(path.join(__dirname, "TestData", name), "utf8")
	);
}

describe("SplitIntoLines", () => {
	it("should split on the line endings of Windows and Unix", () => {
		expect(SplitIntoLines("solu", "a\r\nb\nc")).toEqual(["a", "b", "c"]);
	});

	it("should leave no carriage return at the end of a line of any file type", () => {
		for (const extension of ["trc", "csv", "solu"] as const) {
			const lines = SplitIntoLines(extension, "first;line\r\nsecond;line\r\n");
			expect(lines).toEqual(["first;line", "second;line", ""]);
		}
	});

	it("should trim the lines of a trace file, but not those of the other files", () => {
		expect(SplitIntoLines("trc", "  a,b  \n c ")).toEqual(["a,b", "c"]);
		expect(SplitIntoLines("solu", "  a,b  \n c ")).toEqual(["  a,b  ", " c "]);
	});

	it("should return one empty line for an empty file", () => {
		expect(SplitIntoLines("trc", "")).toEqual([""]);
	});
});

describe("ExtractTraceData", () => {
	it("should use the header lines as the keys", () => {
		expect(ExtractTraceData(["* A,B,C", "1,2,3", "x,y,z"])).toEqual([
			{ A: "1", B: "2", C: "3" },
			{ A: "x", B: "y", C: "z" }
		]);
	});

	it("should skip comment lines between the rows", () => {
		expect(ExtractTraceData(["* A,B", "1,2", "* a comment", "3,4"])).toEqual([
			{ A: "1", B: "2" },
			{ A: "3", B: "4" }
		]);
	});

	it("should use the default headers if there are no header lines", () => {
		const [row] = ExtractTraceData(["alan,MINLP,shot,NONE,CPLEX,43381.77"]);

		expect(row).toMatchObject({
			InputFileName: "alan",
			ModelType: "MINLP",
			SolverName: "shot",
			NLP: "NONE",
			MIP: "CPLEX",
			JulianDate: "43381.77"
		});
	});

	it("should leave the cells undefined that a short row does not have", () => {
		const [row] = ExtractTraceData(["* A,B,C", "1,2"]);

		expect(row).toEqual({ A: "1", B: "2", C: undefined });
		expect(Object.keys(row ?? {})).toEqual(["A", "B", "C"]);
	});

	it("should skip empty rows", () => {
		expect(ExtractTraceData(["* A,B", "1,2", ",", "", "3,4"])).toEqual([
			{ A: "1", B: "2" },
			{ A: "3", B: "4" }
		]);
	});

	it("should write the objective values in exponential format", () => {
		const [row] = ExtractTraceData([
			"* ObjectiveValue,ObjectiveValueEstimate,Other",
			"2.925,-26,2.925"
		]);

		expect(row).toEqual({
			ObjectiveValue: "2.925000e+0",
			ObjectiveValueEstimate: "-2.600000e+1",
			Other: "2.925"
		});
	});

	it("should round the solver time to two decimals", () => {
		const rows = ExtractTraceData([
			"* SolverName,SolverTime",
			"shot,0.041120867",
			"scip,900.079934052"
		]);

		expect(rows.map((row) => row.SolverTime)).toEqual(["0.04", "900.08"]);
	});

	it("should return nothing for an empty file or a file with only header lines", () => {
		expect(ExtractTraceData([])).toEqual([]);
		expect(ExtractTraceData(["* A,B,C"])).toEqual([]);
	});
});

describe("GetInstanceInformation", () => {
	beforeEach(() => jest.clearAllMocks());

	it("should rename the bounds and use the first line as the keys", () => {
		expect(
			GetInstanceInformation(["name;primalbound;dualbound", "alan;2.925;2.9"])
		).toEqual([
			{ name: "alan", PrimalBoundProblem: "2.925", DualBoundProblem: "2.9" }
		]);
	});

	it("should fill the cells that a short row does not have with an empty text", () => {
		expect(GetInstanceInformation(["a;b;c", "1;2", "3;4;5;6"])).toEqual([
			{ a: "1", b: "2", c: "" },
			{ a: "3", b: "4", c: "5" }
		]);
	});

	it("should tell the user that the information is loaded", () => {
		GetInstanceInformation(["a;b", "1;2"]);

		expect(DisplayAlertNotification).toHaveBeenCalledWith(
			InfoMessages.INSTANCE_INFO_LOADED
		);
	});

	it("should return nothing, and say nothing, for an empty file or a header only", () => {
		expect(GetInstanceInformation([])).toEqual([]);
		expect(GetInstanceInformation(["a;b;c"])).toEqual([]);
		expect(DisplayAlertNotification).toHaveBeenCalledTimes(1);
	});

	it("should read the instance data of the test files without a carriage return in the names", () => {
		const information = GetInstanceInformation(
			ReadTestFile("instancedata.csv", "csv")
		);
		const names = information.flatMap((row) => Object.keys(row));

		expect(information.length).toBeGreaterThan(1000);
		expect(names.some((name) => name.includes("\r"))).toBe(false);
		expect(information).toContainEqual(
			expect.objectContaining({ name: "alan" })
		);
	});
});

describe("GetBestKnownBounds", () => {
	it("should read primal, dual and optimal bounds", () => {
		expect(
			GetBestKnownBounds([
				"=best=      primalOnly      116329.67",
				"=bestdual=  dualOnly        -5",
				"=opt=       both            2.925",
				"=inf=       infeasible      0"
			])
		).toEqual([
			{ InputFileName: "primalOnly", PrimalBoundProblem: "1.163297e+5" },
			{ InputFileName: "dualOnly", DualBoundProblem: "-5.000000e+0" },
			{
				InputFileName: "both",
				PrimalBoundProblem: "2.925000e+0",
				DualBoundProblem: "2.925000e+0"
			},
			{
				InputFileName: "infeasible",
				PrimalBoundProblem: Infinity,
				DualBoundProblem: Infinity
			}
		]);
	});

	it("should not fail on lines that are not a bound", () => {
		expect(() =>
			GetBestKnownBounds(["", "nonsense", "=best= only"])
		).not.toThrow();
		expect(GetBestKnownBounds([])).toEqual([]);
	});

	it("should read the .solu file of the test files", () => {
		const bounds = GetBestKnownBounds(ReadTestFile("minlp.solu", "solu"));

		expect(bounds).toContainEqual({
			InputFileName: "alan",
			PrimalBoundProblem: "2.925000e+0",
			DualBoundProblem: "2.925000e+0"
		});
		expect(bounds).toContainEqual({
			InputFileName: "4stufen",
			PrimalBoundProblem: "1.163297e+5"
		});
	});
});

describe("ConvertToTraceFile", () => {
	it("should write a header line and a line per row", () => {
		const rows: TraceData[] = [
			{ InputFileName: "a", SolverName: "s1" },
			{ InputFileName: "b", SolverName: "s2" }
		];

		expect(ConvertToTraceFile(rows)).toEqual([
			"* InputFileName,SolverName",
			"a,s1",
			"b,s2"
		]);
	});

	it("should return nothing without rows", () => {
		expect(ConvertToTraceFile([])).toEqual([]);
	});

	it("should give the same rows back when the lines are read again", () => {
		const rows = ExtractTraceData([
			"* InputFileName,SolverName,ObjectiveValue,SolverTime,Fail",
			"alan,shot,2.925,0.041120867,false",
			"ball,scip,-26,900.079934052,true"
		]);

		expect(ExtractTraceData(ConvertToTraceFile(rows))).toEqual(rows);
	});
});

describe("ProcessData with the test files", () => {
	const traces = {
		shot: ReadTestFile("shotALL.trc", "trc"),
		scip: ReadTestFile("scipALL.trc", "trc"),
		pavito: ReadTestFile("pavitoALL.trc", "trc")
	};

	function Count(rows: TraceData[], solver: string): number {
		return rows.filter((row) => row.SolverName === solver).length;
	}

	it("should read every instance of the three traces", async () => {
		const rows = await ProcessData(
			[...traces.shot, ...traces.scip, ...traces.pavito],
			[],
			[]
		);

		expect(Count(rows, "shot")).toBe(335);
		expect(Count(rows, "scip")).toBe(335);
		expect(Count(rows, "pavito")).toBe(332);
		expect(rows).toHaveLength(335 + 335 + 332);
	});

	it("should give every row a direction, statuses, gaps and a fail value", async () => {
		const rows = await ProcessData(traces.shot, [], []);

		for (const row of rows) {
			expect(["min", "max"]).toContain(row.Direction);
			expect(typeof row.Fail).toBe("boolean");
			expect(row.SolverStatus).toEqual(expect.any(String));
			expect(row.ModelStatus).toEqual(expect.any(String));
			expect(row).toHaveProperty("Gap_Solver");
		}
	});

	it("should find the instances that failed", async () => {
		const rows = await ProcessData(
			[...traces.shot, ...traces.scip, ...traces.pavito],
			[],
			[]
		);
		const failed = (solver: string): number =>
			rows.filter((row) => row.SolverName === solver && row.Fail === true)
				.length;

		expect([failed("shot"), failed("scip"), failed("pavito")]).toEqual([
			0, 0, 9
		]);
	});

	it("should add the instance information and the best known bounds", async () => {
		const rows = await ProcessData(
			traces.shot,
			ReadTestFile("instancedata.csv", "csv"),
			ReadTestFile("minlp.solu", "solu")
		);
		const alan = rows.find((row) => row.InputFileName === "alan");

		expect(alan).toMatchObject({
			InputFileName: "alan",
			SolverName: "shot",
			Direction: "min",
			ModelStatus: "Integer Solution",
			SolverStatus: "Normal Completion",
			ObjectiveValue: "2.925000e+0",
			SolverTime: "0.04",
			// from the .solu file ("opt")
			PrimalBoundProblem: "2.925000e+0",
			DualBoundProblem: "2.925000e+0",
			// from the instance information
			application: "Portfolio Optimization"
		});
		expect(alan?.Fail).toBe(false);
	});

	it("should keep every row when the information does not cover the instance", async () => {
		const rows = await ProcessData(
			ReadTestFile("library_test.trc", "trc"),
			[],
			ReadTestFile("miplib.solu", "solu")
		);

		expect(rows.map((row) => row.InputFileName)).toEqual([
			"alkylation",
			"50v-10",
			"30_70_45_095_100"
		]);
		expect(At(rows, 0).SolverName).toBe("testSolver");
	});
});
