import {
	ExtractFailedCount,
	ExtractStatusMessages,
	GetStatusKeys
} from "../Src/Scripts/DataProcessing/ChartsComputations/ComputeChartData";
import { TraceData } from "../Src/Scripts/Interfaces/Interfaces";

describe("Status messages of the termination charts", () => {
	const traceData: TraceData[] = [
		{ SolverName: "A", ModelStatus: "Infeasible" },
		{ SolverName: "A", ModelStatus: "Infeasible" },
		{ SolverName: "B", ModelStatus: "Optimal" },
		{ SolverName: "B", ModelStatus: "Infeasible" },
		{ SolverName: "B", ModelStatus: "Optimal" }
	];

	it("should count the statuses of every solver", () => {
		expect(ExtractStatusMessages(traceData, "ModelStatus")).toEqual([
			{ SolverName: "A", Infeasible: 2 },
			{ SolverName: "B", Optimal: 2, Infeasible: 1 }
		]);
	});

	it("should list the statuses of all solvers, not only of the first one", () => {
		const counts = ExtractStatusMessages(traceData, "ModelStatus");

		// Optimal only occurs for the second solver, and has to be shown as well.
		expect(GetStatusKeys(counts)).toEqual(["Infeasible", "Optimal"]);
	});

	it("should list every status once, in the order they are found", () => {
		expect(
			GetStatusKeys([
				{ SolverName: "A", Optimal: 1, Infeasible: 1 },
				{ SolverName: "B", Infeasible: 2, Unbounded: 1 },
				{ SolverName: "C", Optimal: 3 }
			])
		).toEqual(["Optimal", "Infeasible", "Unbounded"]);
	});

	it("should list nothing without data", () => {
		expect(GetStatusKeys([])).toEqual([]);
		expect(ExtractStatusMessages([], "ModelStatus")).toEqual([]);
	});
});

describe("Failed instances of the fail chart", () => {
	it("should count only the instances that failed", () => {
		const traceData: TraceData[] = [
			{ SolverName: "A", Fail: false },
			{ SolverName: "A", Fail: true },
			{ SolverName: "A", Fail: false },
			{ SolverName: "B", Fail: true },
			{ SolverName: "B", Fail: true }
		];

		expect(ExtractFailedCount(traceData)).toEqual([
			{ SolverName: "A", Failed: 1 },
			{ SolverName: "B", Failed: 2 }
		]);
	});

	it("should list a solver without failed instances, with 0", () => {
		const traceData: TraceData[] = [
			{ SolverName: "A", Fail: false },
			{ SolverName: "A", Fail: false }
		];

		expect(ExtractFailedCount(traceData)).toEqual([
			{ SolverName: "A", Failed: 0 }
		]);
	});

	it("should read Fail as text as well, like in data that was stored and read again", () => {
		const traceData = [
			{ SolverName: "A", Fail: "true" },
			{ SolverName: "A", Fail: "false" }
		] as unknown as TraceData[];

		expect(ExtractFailedCount(traceData)).toEqual([
			{ SolverName: "A", Failed: 1 }
		]);
	});

	it("should count nothing without data", () => {
		expect(ExtractFailedCount([])).toEqual([]);
	});
});
