import { MergeData } from "../Src/Scripts/DataProcessing/MergeData";
import {
	ComputeVirtualTimes,
	ComputeVirtualTimesTraceData
} from "../Src/Scripts/DataProcessing/ResultComputations/ComputeVirtualSolvers";
import {
	CalculateGap,
	CalculateInstanceAttributes,
	CalculateSolveAttributes,
	ExtractUniqueProblems,
	SetFailValueAndReason
} from "../Src/Scripts/DataProcessing/ResultComputations/ComputeResults";
import { TraceData } from "../Src/Scripts/Interfaces/Interfaces";

describe("MergeData", () => {
	const traceData: TraceData[] = [
		{ InputFileName: "alan", SolverName: "SCIP" },
		{ InputFileName: "ex1223", SolverName: "SCIP" }
	];

	it("should merge the matching object by InputFileName", () => {
		const data = [{ InputFileName: "alan", PrimalBoundProblem: 2.925 }];
		const merged = MergeData(traceData, data);

		expect(merged[0]).toEqual({
			InputFileName: "alan",
			SolverName: "SCIP",
			PrimalBoundProblem: 2.925
		});
	});

	it("should merge the matching object by name", () => {
		const data = [{ name: "ex1223", DualBoundProblem: 4.5 }];
		const merged = MergeData(traceData, data);

		expect(merged[1]).toMatchObject({
			InputFileName: "ex1223",
			name: "ex1223",
			DualBoundProblem: 4.5
		});
	});

	it("should fill the properties missing in an unmatched object with null", () => {
		const data = [{ InputFileName: "alan", PrimalBoundProblem: 2.925 }];
		const merged = MergeData(traceData, data);

		expect(merged[1]).toEqual({
			InputFileName: "ex1223",
			SolverName: "SCIP",
			PrimalBoundProblem: null
		});
	});

	it("should keep one result per trace data object and the order", () => {
		const data = [
			{ InputFileName: "ex1223", PrimalBoundProblem: 1 },
			{ InputFileName: "alan", PrimalBoundProblem: 2 }
		];
		const merged = MergeData(traceData, data);

		expect(
			merged.map((row) => {
				return row.InputFileName;
			})
		).toEqual(["alan", "ex1223"]);
	});

	it("should use the first matching object if several match", () => {
		const data = [
			{ InputFileName: "alan", PrimalBoundProblem: 1 },
			{ InputFileName: "alan", PrimalBoundProblem: 2 }
		];

		expect(MergeData(traceData, data)[0]).toMatchObject({
			PrimalBoundProblem: 1
		});
	});

	it("should return the rows unchanged without data to merge", () => {
		const merged = MergeData(traceData, []);
		expect(merged).toEqual(traceData);
	});

	it("should merge the first matching entry, whether it matches by InputFileName or by name", () => {
		const data = [
			{ name: "alan", PrimalBoundProblem: 1 },
			{ InputFileName: "alan", PrimalBoundProblem: 2 },
			{ InputFileName: "ex1223", PrimalBoundProblem: 3 },
			{ InputFileName: "ex1223", PrimalBoundProblem: 4 }
		];
		const merged = MergeData(traceData, data);

		expect(merged[0]).toMatchObject({ PrimalBoundProblem: 1 });
		expect(merged[1]).toMatchObject({ PrimalBoundProblem: 3 });
	});

	it("should not modify its input", () => {
		const copy = JSON.parse(JSON.stringify(traceData));
		MergeData(traceData, [{ InputFileName: "alan", name: "alan" }]);
		expect(traceData).toEqual(copy);
	});
});

describe("ComputeVirtualTimesTraceData", () => {
	function Row(overrides: TraceData): TraceData {
		return {
			InputFileName: "p1",
			Direction: "min",
			SolverName: "SolverA",
			SolverTime: 2,
			NumberOfIterations: 10,
			NumberOfNodes: 1,
			NumberOfDomainViolations: 0,
			DualBoundSolver: 8,
			PrimalBoundSolver: 12,
			DualBoundProblem: 10,
			PrimalBoundProblem: 10,
			Fail: false,
			...overrides
		};
	}

	const twoSolvers: TraceData[] = [
		Row({}),
		Row({
			SolverName: "SolverB",
			SolverTime: 5,
			NumberOfIterations: 20,
			NumberOfNodes: 3,
			NumberOfDomainViolations: 1,
			DualBoundSolver: 9,
			PrimalBoundSolver: 11
		})
	];

	function Virtual(result: TraceData[], name: string): TraceData {
		const row = result.find((item) => {
			return item.SolverName === name;
		});
		if (!row) {
			throw new Error(`${name} not found`);
		}
		return row;
	}

	it("should create a best and a worst solver per problem", () => {
		const result = ComputeVirtualTimesTraceData(twoSolvers, 1000);

		expect(
			result.map((row) => {
				return [row.InputFileName, row.SolverName];
			})
		).toEqual([
			["p1", "Virtual Best Solver"],
			["p1", "Virtual Worst Solver"]
		]);
		expect(
			result.every((row) => {
				return row.SolverStatus === "Normal Completion";
			})
		).toBe(true);
	});

	it("should take the best and worst time, iterations, nodes and domain violations", () => {
		const result = ComputeVirtualTimesTraceData(twoSolvers, 1000);
		const best = Virtual(result, "Virtual Best Solver");
		const worst = Virtual(result, "Virtual Worst Solver");

		expect([best.SolverTime, worst.SolverTime]).toEqual([2, 5]);
		expect([best.NumberOfIterations, worst.NumberOfIterations]).toEqual([
			10, 20
		]);
		expect([best.NumberOfNodes, worst.NumberOfNodes]).toEqual([1, 3]);
		expect([
			best.NumberOfDomainViolations,
			worst.NumberOfDomainViolations
		]).toEqual([0, 1]);
	});

	it("should compute the gaps from the best and worst bounds for a minimization problem", () => {
		const result = ComputeVirtualTimesTraceData(twoSolvers, 1000);
		const best = Virtual(result, "Virtual Best Solver");
		const worst = Virtual(result, "Virtual Worst Solver");

		// Best: highest dual bound (9) and lowest primal bound (11).
		expect(best.DualGap).toBe(CalculateGap(9, 10, "min"));
		expect(best.PrimalGap).toBe(CalculateGap(11, 10, "min"));
		expect(best.DualGap).toBe(11.11);
		// Worst: lowest dual bound (8) and highest primal bound (12).
		expect(worst.DualGap).toBe(CalculateGap(8, 10, "min"));
		expect(worst.PrimalGap).toBe(CalculateGap(12, 10, "min"));
		expect(worst.DualGap).toBe(25);
	});

	it("should swap which bound is best for a maximization problem", () => {
		const result = ComputeVirtualTimesTraceData(
			twoSolvers.map((row) => {
				return { ...row, Direction: "max" };
			}),
			1000
		);
		const best = Virtual(result, "Virtual Best Solver");

		// Best: lowest dual bound (8) and highest primal bound (12).
		expect(best.DualGap).toBe(CalculateGap(8, 10, "max"));
		expect(best.PrimalGap).toBe(CalculateGap(12, 10, "max"));
		expect(best.Direction).toBe("max");
	});

	it("should use the default time for a missing solver time", () => {
		const result = ComputeVirtualTimesTraceData(
			[Row({}), Row({ SolverName: "SolverB", SolverTime: undefined })],
			1000
		);

		expect(Virtual(result, "Virtual Best Solver").SolverTime).toBe(2);
		expect(Virtual(result, "Virtual Worst Solver").SolverTime).toBe(1000);
	});

	it("should limit the worst time to the default time", () => {
		const result = ComputeVirtualTimesTraceData(
			[Row({}), Row({ SolverName: "SolverB", SolverTime: 5000 })],
			1000
		);

		expect(Virtual(result, "Virtual Worst Solver").SolverTime).toBe(1000);
	});

	it("should not consider failed results in the best and worst values", () => {
		const result = ComputeVirtualTimesTraceData(
			[
				...twoSolvers,
				Row({
					SolverName: "SolverC",
					SolverTime: 1,
					NumberOfIterations: 5,
					NumberOfNodes: 0,
					NumberOfDomainViolations: 9,
					DualBoundSolver: 10,
					PrimalBoundSolver: 10,
					Fail: true
				})
			],
			1000
		);
		const best = Virtual(result, "Virtual Best Solver");
		const worst = Virtual(result, "Virtual Worst Solver");

		// Only SolverA and SolverB count, SolverC failed.
		expect([best.SolverTime, worst.SolverTime]).toEqual([2, 5]);
		expect([best.NumberOfIterations, worst.NumberOfIterations]).toEqual([
			10, 20
		]);
		expect([best.NumberOfNodes, worst.NumberOfNodes]).toEqual([1, 3]);
		expect(worst.NumberOfDomainViolations).toBe(1);
		expect(best.DualGap).toBe(CalculateGap(9, 10, "min"));
		expect(best.PrimalGap).toBe(CalculateGap(11, 10, "min"));
	});
	it("should leave out problems where every solver failed", () => {
		const result = ComputeVirtualTimesTraceData(
			[
				Row({ InputFileName: "failed", Fail: true }),
				Row({ InputFileName: "failed", SolverName: "SolverB", Fail: true }),
				...twoSolvers
			],
			1000
		);

		expect(
			new Set(
				result.map((row) => {
					return row.InputFileName;
				})
			)
		).toEqual(new Set(["p1"]));
	});

	it("should handle several problems", () => {
		const result = ComputeVirtualTimesTraceData(
			[...twoSolvers, Row({ InputFileName: "p2", SolverTime: 7 })],
			1000
		);

		expect(result).toHaveLength(4);
		expect(
			result.filter((row) => {
				return row.InputFileName === "p2";
			})
		).toHaveLength(2);
	});

	it("should return nothing without data", () => {
		expect(ComputeVirtualTimesTraceData([], 1000)).toEqual([]);
	});
});

describe("ComputeVirtualTimes", () => {
	const data = {
		SolverA: [
			{ time: 1, InputFileName: "a" },
			{ time: 4, InputFileName: "b" }
		],
		SolverB: [
			{ time: 2, InputFileName: "a" },
			{ time: 3, InputFileName: "b" }
		]
	};

	it("should pick the best time per instance", () => {
		expect(ComputeVirtualTimes(data)["Virtual Best Solver"]).toEqual([
			{ time: 1, InputFileName: "a" },
			{ time: 3, InputFileName: "b" }
		]);
	});

	it("should pick the worst time per instance", () => {
		expect(ComputeVirtualTimes(data)["Virtual Worst Solver"]).toEqual([
			{ time: 2, InputFileName: "a" },
			{ time: 4, InputFileName: "b" }
		]);
	});

	it("should return empty lists without data", () => {
		expect(ComputeVirtualTimes({})).toEqual({
			"Virtual Best Solver": [],
			"Virtual Worst Solver": []
		});
	});
});

describe("SetFailValueAndReason", () => {
	// Arguments: status, direction, primal and dual bound of the solver, primal and dual bound of the problem.
	const OK = "Normal Completion";

	it("should fail without a termination status", () => {
		expect(SetFailValueAndReason("", "min", 1, 1, 1, 1)).toEqual([
			true,
			"No data"
		]);
	});

	it.each(["Capability Problems", "Unknown Error", "User Interrupt", "Error"])(
		"should fail for the termination status %s",
		(status) => {
			expect(SetFailValueAndReason(status, "min", 1, 1, 1, 1)).toEqual([
				true,
				`Termstatus is ${status}`
			]);
		}
	);

	it("should fail if the primal bound is better than the best known dual bound (min)", () => {
		expect(SetFailValueAndReason(OK, "min", 1, 0, 100, 100)).toEqual([
			true,
			"Primal bound contradicts best known dual bound"
		]);
	});

	it("should fail if the primal bound is better than the best known dual bound (max)", () => {
		expect(SetFailValueAndReason(OK, "max", 100, 200, 1, 1)).toEqual([
			true,
			"Primal bound contradicts best known dual bound"
		]);
	});

	it("should fail if the dual bound is better than the best known primal bound (min)", () => {
		expect(SetFailValueAndReason(OK, "min", 20, 15, 10, 5)).toEqual([
			true,
			"Dual bound contradicts best known primal bound"
		]);
	});

	it("should fail if the dual bound is better than the best known primal bound (max)", () => {
		expect(SetFailValueAndReason(OK, "max", 5, 5, 10, 100)).toEqual([
			true,
			"Dual bound contradicts best known primal bound"
		]);
	});

	it("should not fail a solver that proves a better dual bound than the best known one (min)", () => {
		// The dual bound 9 is above the best known dual bound 8, but below the best known primal bound 10.
		expect(SetFailValueAndReason(OK, "min", 10, 9, 10, 8)).toEqual([false, OK]);
	});

	it("should not fail a solver that proves a better dual bound than the best known one (max)", () => {
		// The dual bound 11 is below the best known dual bound 12, but above the best known primal bound 10.
		expect(SetFailValueAndReason(OK, "max", 10, 11, 10, 12)).toEqual([
			false,
			OK
		]);
	});

	it("should pass if the bounds agree", () => {
		expect(SetFailValueAndReason(OK, "min", 10, 10, 10, 10)).toEqual([
			false,
			OK
		]);
	});

	it("should ignore differences within the tolerance", () => {
		expect(
			SetFailValueAndReason(OK, "min", 10, 10, 10.00001, 10.00001)
		).toEqual([false, OK]);
	});

	it("should pass without checking the bounds that are infinite", () => {
		expect(SetFailValueAndReason(OK, "min", Infinity, -Infinity, 5, 5)).toEqual(
			[false, OK]
		);
		expect(SetFailValueAndReason(OK, "min", 1, 0, Infinity, Infinity)).toEqual([
			false,
			OK
		]);
	});
});
describe("ExtractUniqueProblems", () => {
	it("should keep the first object of each problem with only the problem properties", () => {
		const problems = ExtractUniqueProblems([
			{
				InputFileName: "a",
				Direction: "min",
				NumberOfVariables: 3,
				SolverName: "SolverA"
			},
			{
				InputFileName: "a",
				Direction: "max",
				NumberOfVariables: 9,
				SolverName: "SolverB"
			},
			{ InputFileName: "b", Direction: "max", SolverName: "SolverA" }
		]);

		expect(problems).toHaveLength(2);
		expect(problems[0]).toMatchObject({
			InputFileName: "a",
			Direction: "min",
			NumberOfVariables: 3
		});
		expect(problems[0]).not.toHaveProperty("SolverName");
		expect(problems[1]).toMatchObject({ InputFileName: "b" });
	});

	it("should return nothing without data", () => {
		expect(ExtractUniqueProblems([])).toEqual([]);
	});
});

describe("CalculateSolveAttributes", () => {
	it("should compute the statistics of numeric values and skip the others", () => {
		const result = CalculateSolveAttributes(
			[{ time: "1" }, { time: "2" }, { time: "3" }, { time: "n/a" }],
			["time"]
		);

		expect(result["time"]).toEqual({
			countValue: 3,
			avgValue: 2,
			minValue: 1,
			maxValue: 3,
			stdValue: 1,
			p10Value: 1.2,
			p25Value: 1.5,
			p50Value: 2,
			p75Value: 2.5,
			p90Value: 2.8
		});
	});

	it("should leave out keys without any numeric value", () => {
		const result = CalculateSolveAttributes(
			[{ time: "n/a" }, { other: 1 }],
			["time", "missing"]
		);

		expect(result).toEqual({});
	});
});

describe("CalculateInstanceAttributes", () => {
	it("should compute the statistics for every key except InputFileName", () => {
		const result = CalculateInstanceAttributes([
			{ InputFileName: "a", variables: 1 },
			{ InputFileName: "b", variables: 3 }
		]);

		expect(Object.keys(result)).toEqual(["variables"]);
		expect(result["variables"]).toMatchObject({
			countValue: 2,
			avgValue: 2,
			minValue: 1,
			maxValue: 3,
			p50Value: 2
		});
		expect(result["variables"]?.stdValue).toBeCloseTo(1.414214, 6);
	});

	it("should skip values that are not numbers", () => {
		const result = CalculateInstanceAttributes([
			{ InputFileName: "a", variables: 4, direction: "min" },
			{ InputFileName: "b", variables: "x", direction: "max" }
		]);

		expect(result["variables"]).toMatchObject({ countValue: 1, avgValue: 4 });
		expect(result).not.toHaveProperty("direction");
	});
});
