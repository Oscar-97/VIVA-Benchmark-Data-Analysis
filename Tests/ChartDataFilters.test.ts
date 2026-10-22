jest.mock("../Src/Scripts/Elements/Elements", () => ({
	elements: {
		defaultTimeDirectInput: { value: "" },
		gapLimitDirectInput: { value: "" }
	}
}));

import {
	ComputeStatisticalMeasures,
	ExtractAllSolverTimes,
	ExtractAllSolverTimesGapType
} from "../Src/Scripts/DataProcessing/ChartsComputations/ComputeChartData";
import { elements } from "../Src/Scripts/Elements/Elements";
import { Values } from "../Src/Scripts/Constants/Values";
import { TraceData } from "../Src/Scripts/Interfaces/Interfaces";

function Rows(rows: object[]): TraceData[] {
	return rows as unknown as TraceData[];
}

/** The number of rows that a filter keeps per solver: every row has one node, so the sum is the count. */
function KeptPerSolver(
	rows: TraceData[],
	filterType: string
): Record<string, number | undefined> {
	const stats = ComputeStatisticalMeasures(
		rows,
		"NumberOfNodes",
		undefined,
		filterType
	);
	return Object.fromEntries(
		Object.entries(stats).map(([solver, value]) => [solver, value.sumValue])
	);
}

describe("ComputeStatisticalMeasures: filter types", () => {
	const rows = Rows([
		{
			SolverName: "A",
			NumberOfNodes: 1,
			SolverStatus: "Normal Completion",
			SolverTime: 5,
			PrimalGap: 0.5,
			DualGap: 0.5
		},
		{
			SolverName: "A",
			NumberOfNodes: 1,
			SolverStatus: "Normal Completion",
			SolverTime: 50,
			PrimalGap: 5,
			DualGap: 5
		},
		{
			SolverName: "A",
			NumberOfNodes: 1,
			SolverStatus: "Resource Interrupt",
			SolverTime: 5,
			PrimalGap: 0.5,
			DualGap: 0.5
		},
		{
			SolverName: "B",
			NumberOfNodes: 1,
			SolverStatus: "Normal Completion",
			SolverTime: 5,
			PrimalGap: 50,
			DualGap: 50
		}
	]);

	it.each([
		["no_fail_by_all_solver", { A: 2, B: 1 }],
		["time_greater_than_10_by_at_least_one_solver_and_no_fail", { A: 1, B: 1 }],
		["solver_primal_gap_less_than_or_equal_to_1_percent_and_no_fail", { A: 1 }],
		[
			"solver_primal_gap_less_than_or_equal_to_10_percent_and_no_fail",
			{ A: 2 }
		],
		[
			"solver_dual_gap_less_than_or_equal_to_1_percent_and_not_failed",
			{ A: 1 }
		],
		[
			"solver_dual_gap_less_than_or_equal_to_10_percent_and_not_failed",
			{ A: 2 }
		],
		["None", { A: 3, B: 1 }],
		["an_unknown_filter", { A: 3, B: 1 }]
	])("filter %s", (filterType, expected) => {
		expect(KeptPerSolver(rows, filterType)).toEqual(expected);
	});

	it("does not change the data that it is given", () => {
		const copy = structuredClone(rows);
		KeptPerSolver(rows, "no_fail_by_all_solver");
		expect(rows).toEqual(copy);
	});

	it("leaves out the instances whose value is not a finite number", () => {
		const stats = ComputeStatisticalMeasures(
			Rows([
				{ SolverName: "A", ObjectiveValue: "1" },
				{ SolverName: "A", ObjectiveValue: "Infinity" },
				{ SolverName: "A", ObjectiveValue: "x" },
				{ SolverName: "A", ObjectiveValue: "3" }
			]),
			"ObjectiveValue"
		);
		expect(stats["A"]?.sumValue).toBe(4);
		expect(stats["A"]?.minValue).toBe(1);
		expect(stats["A"]?.maxValue).toBe(3);
	});
});

describe("ExtractAllSolverTimes", () => {
	it("skips times that are missing, NA or not numbers, but keeps the solver", () => {
		const result = ExtractAllSolverTimes(
			Rows([
				{ SolverName: "A", InputFileName: "a", SolverTime: 1.5 },
				{ SolverName: "A", InputFileName: "b", SolverTime: "NA" },
				{ SolverName: "A", InputFileName: "c", SolverTime: "x" },
				{ SolverName: "A", InputFileName: "d" },
				{ SolverName: "B", InputFileName: "a", SolverTime: "NA" }
			])
		);
		expect(result).toEqual({
			A: [{ time: 1.5, InputFileName: "a" }],
			B: []
		});
	});
});

describe("ExtractAllSolverTimesGapType", () => {
	const rows = Rows([
		{
			SolverName: "A",
			InputFileName: "a",
			SolverTime: 1,
			PrimalGap: 0,
			SolverStatus: "Normal Completion"
		},
		{
			SolverName: "A",
			InputFileName: "b",
			SolverTime: 2,
			PrimalGap: 0.5,
			SolverStatus: "Normal Completion"
		},
		{
			SolverName: "A",
			InputFileName: "c",
			SolverTime: 3,
			PrimalGap: 0,
			SolverStatus: "Resource Interrupt"
		}
	]);

	function Times(
		gapLimit?: number,
		terminationStatus?: string
	): Record<string, string[] | undefined> {
		const result = ExtractAllSolverTimesGapType(
			rows,
			"PrimalGap",
			100,
			gapLimit,
			terminationStatus
		);
		return Object.fromEntries(
			Object.entries(result).map(([solver, times]) => [
				solver,
				times.map((entry) => entry.InputFileName)
			])
		);
	}

	it("keeps the instances within the gap limit, of any status without a selector", () => {
		expect(Times(0.1)).toEqual({ A: ["a", "c"] });
		expect(Times(1)).toEqual({ A: ["a", "b", "c"] });
	});

	it("keeps only the selected termination status", () => {
		expect(Times(1, "1")).toEqual({ A: ["a", "b"] });
		expect(Times(1, "3")).toEqual({ A: ["c"] });
	});

	it("uses 0.01 and writes it to the input when the gap limit is missing or negative", () => {
		expect(Times(undefined)).toEqual({ A: ["a", "c"] });
		expect(elements.gapLimitDirectInput.value).toBe("0.01");
		elements.gapLimitDirectInput.value = "";
		expect(Times(-1)).toEqual({ A: ["a", "c"] });
		expect(elements.gapLimitDirectInput.value).toBe("0.01");
	});

	it("uses the default time when the time given is missing or negative", () => {
		ExtractAllSolverTimesGapType(rows, "PrimalGap", -5, 1);
		expect(elements.defaultTimeDirectInput.value).toBe(
			Values.DEFAULT_TIME.toString()
		);
	});

	it("gives an instance without a time the default time", () => {
		const result = ExtractAllSolverTimesGapType(
			Rows([{ SolverName: "A", InputFileName: "a", PrimalGap: 0 }]),
			"PrimalGap",
			42,
			1
		);
		expect(result["A"]).toContainEqual({ time: 42, InputFileName: "a" });
	});
});
