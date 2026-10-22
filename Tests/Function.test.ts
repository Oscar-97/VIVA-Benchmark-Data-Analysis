/* eslint-disable max-lines */
jest.mock("../Src/Scripts/Elements/Elements", () => ({
	elements: {
		defaultTimeDirectInput: jest.fn(),
		gapLimitDirectInput: jest.fn()
	}
}));

jest.doMock("../Src/Scripts/DataProcessing/ReadMetaData", () => {
	return {
		DOMElement: jest.fn()
	};
});

import {
	CalculateDirection,
	CalculatePrimalBound,
	CalculateDualBound,
	CalculateGap,
	CompareSolvers,
	SetModelStatus,
	SetSolverStatus
} from "../Src/Scripts/DataProcessing/ResultComputations/ComputeResults";

import {
	ComputeStatisticalMeasures,
	ExtractAllSolverTimes,
	ExtractAllSolverTimesGapType
} from "../Src/Scripts/DataProcessing/ChartsComputations/ComputeChartData";

import {
	ApplyStoredConfiguration,
	ResetAppState,
	state
} from "../Src/Scripts/App/AppState";
import { GetPageKind, PageKind } from "../Src/Scripts/App/CurrentPage";
import { Listen, ResetPageListeners } from "../Src/Scripts/App/PageListeners";
import { PageTitles } from "../Src/Scripts/Constants/PageTitles";
import { At } from "./TestHelpers";

/**
 * Mockup data.
 */
const mockupTraceData = [
	{
		SolverName: "TestSolver1",
		SolverTime: 0.041120867,
		InputFileName: "TestInstance",
		PrimalBound: 1.33594e1,
		DualBound: 1.96894e1,
		UserComment: "This is will get filtered.",
		Fail: false
	},
	{
		SolverName: "TestSolver1",
		SolverTime: 0.560621249,
		InputFileName: "TestInstance_B",
		PrimalBound: -5.96e3,
		DualBound: -3.153852e4,
		UserComment: "This is will get filtered.",
		Fail: false
	},
	{
		SolverName: "TestSolver2",
		SolverTime: 900.971,
		InputFileName: "TestInstance_X",
		PrimalBound: -5.905217,
		DualBound: 1.43358e1,
		UserComment: "This is will get filtered.",
		Fail: false
	},
	{
		SolverName: "TestSolver2",
		SolverTime: 5.922,
		InputFileName: "TestInstance_Y",
		PrimalBound: 1.13389e2,
		DualBound: -2.0423e4,
		UserComment: "This is will get filtered.",
		Fail: false
	}
];

/**
 * Test: PrimalGap, DualGap, Gap Problem, Gap Solver (Gap in benchmarks).
 * Data obtained from: https://andreaslundell.github.io/minlpbenchmarks/2020-06-SHOTpaper/PaverReports/Commercial/solvedata.html
 */
const minlpBenchmarksData = [
	{
		SolverName: "Scp2804s",
		InputFileName: "alan",
		PrimalBoundSolver: 2.925,
		DualBoundSolver: 2.925,
		PrimalBoundProblem: 2.925,
		DualBoundProblem: 2.925,
		Gap_Solver: 0.0,
		Gap_Problem: 0.0,
		PrimalGap: 0.0,
		DualGap: 0.0,
		Direction: "min"
	},
	{
		SolverName: "baron",
		InputFileName: "alan",
		PrimalBoundSolver: 2.925,
		DualBoundSolver: 2.922078,
		PrimalBoundProblem: 2.925,
		DualBoundProblem: 2.925,
		Gap_Solver: 0.1,
		Gap_Problem: 0.0,
		PrimalGap: 0.0,
		DualGap: 0.1,
		Direction: "min"
	},
	{
		SolverName: "baron",
		InputFileName: "smallinvDAXr1b150-165",
		PrimalBoundSolver: 8.813741e1,
		DualBoundSolver: 8.80825e1,
		PrimalBoundProblem: 8.810493e1,
		DualBoundProblem: 8.810493e1,
		Gap_Solver: 0.06,
		Gap_Problem: 0,
		PrimalGap: 0.04,
		DualGap: 0.03,
		Direction: "min"
	},
	{
		SolverName: "Scp2804s",
		InputFileName: "pedigree_ex485",
		PrimalBoundSolver: -2.184812e4,
		DualBoundSolver: -2.226831e4,
		PrimalBoundProblem: -2.193157e4,
		DualBoundProblem: -2.193157e4,
		Gap_Solver: 1.92,
		Gap_Problem: 0.0,
		PrimalGap: 0.38,
		DualGap: 1.54,
		Direction: "min"
	},
	{
		SolverName: "Scp2804s",
		InputFileName: "syn30h",
		PrimalBoundSolver: 1.381603e2,
		DualBoundSolver: 1.384918e2,
		PrimalBoundProblem: 1.381598e2,
		DualBoundProblem: 1.381598e2,
		Gap_Solver: 0.24,
		Gap_Problem: 0.0,
		PrimalGap: 0.0,
		DualGap: 0.24,
		Direction: "max"
	},
	{
		SolverName: "Scp2804s",
		InputFileName: "ball_mk4_15",
		PrimalBoundSolver: Infinity,
		DualBoundSolver: -Infinity,
		PrimalBoundProblem: Infinity,
		DualBoundProblem: 2.121536e1,
		Gap_Solver: Infinity,
		Gap_Problem: Infinity,
		PrimalGap: Infinity,
		DualGap: Infinity,
		Direction: "min"
	},
	{
		SolverName: "Scp2804s",
		InputFileName: "flay06m",
		PrimalBoundSolver: 6.693264e1,
		DualBoundSolver: 60,
		PrimalBoundProblem: 6.69328e1,
		DualBoundProblem: 6.517733e1,
		Gap_Solver: 11.55,
		Gap_Problem: 2.69,
		PrimalGap: 0,
		DualGap: 8.63,
		Direction: "min"
	},
	{
		SolverName: "aecp",
		InputFileName: "gams01",
		PrimalBoundSolver: 2.842727e4,
		DualBoundSolver: -1.170954e5,
		PrimalBoundProblem: 2.13802e4,
		DualBoundProblem: 1.851874e3,
		Gap_Solver: Infinity,
		Gap_Problem: 1054.52,
		PrimalGap: 32.96,
		DualGap: Infinity,
		Direction: "min"
	},
	{
		SolverName: "aecp",
		InputFileName: "tls12",
		PrimalBoundSolver: Infinity,
		DualBoundSolver: 9.207843,
		PrimalBoundProblem: 1.088e2,
		DualBoundProblem: 7.788233,
		Gap_Solver: Infinity,
		Gap_Problem: 1296.98,
		PrimalGap: Infinity,
		DualGap: 18.23,
		Direction: "min"
	},
	{
		SolverName: "aoa",
		InputFileName: "st_miqp4",
		PrimalBoundSolver: Infinity,
		DualBoundSolver: Infinity,
		PrimalBoundProblem: -4.574e3,
		DualBoundProblem: -4.574e3,
		Gap_Solver: Infinity,
		Gap_Problem: 0,
		PrimalGap: Infinity,
		DualGap: Infinity,
		Direction: "min"
	}
];

/**
 * Test calculations to get correct gap values according to existing benchmarks.
 */
describe("Gap computation from real benchmarks.", () => {
	describe("Gap_Solver", () => {
		it("Solver Scp2804s and problem alan", () => {
			expect(
				CalculateGap(
					At(minlpBenchmarksData, 0)["PrimalBoundSolver"],
					At(minlpBenchmarksData, 0)["DualBoundSolver"],
					At(minlpBenchmarksData, 0)["Direction"]
				)
			).toBe(At(minlpBenchmarksData, 0)["Gap_Solver"]);
		});

		it("Solver baron and problem alan", () => {
			expect(
				CalculateGap(
					At(minlpBenchmarksData, 1)["PrimalBoundSolver"],
					At(minlpBenchmarksData, 1)["DualBoundSolver"],
					At(minlpBenchmarksData, 1)["Direction"]
				)
			).toBe(At(minlpBenchmarksData, 1)["Gap_Solver"]);
		});

		it("Solver baron and problem smallinvDAXr1b150-165", () => {
			expect(
				CalculateGap(
					At(minlpBenchmarksData, 2)["PrimalBoundSolver"],
					At(minlpBenchmarksData, 2)["DualBoundSolver"],
					At(minlpBenchmarksData, 2)["Direction"]
				)
			).toBe(At(minlpBenchmarksData, 2)["Gap_Solver"]);
		});

		it("Solver Scp2804s and problem pedigree_ex485", () => {
			expect(
				CalculateGap(
					At(minlpBenchmarksData, 3)["PrimalBoundSolver"],
					At(minlpBenchmarksData, 3)["DualBoundSolver"],
					At(minlpBenchmarksData, 3)["Direction"]
				)
			).toBe(At(minlpBenchmarksData, 3)["Gap_Solver"]);
		});

		it("Solver Scp2804s and problem syn30h", () => {
			expect(
				CalculateGap(
					At(minlpBenchmarksData, 4)["PrimalBoundSolver"],
					At(minlpBenchmarksData, 4)["DualBoundSolver"],
					At(minlpBenchmarksData, 4)["Direction"]
				)
			).toBe(At(minlpBenchmarksData, 4)["Gap_Solver"]);
		});

		it("Solver Scp2804s and problem ball_mk4_15", () => {
			expect(
				CalculateGap(
					At(minlpBenchmarksData, 5)["PrimalBoundSolver"],
					At(minlpBenchmarksData, 5)["DualBoundSolver"],
					At(minlpBenchmarksData, 5)["Direction"]
				)
			).toBe(At(minlpBenchmarksData, 5)["Gap_Solver"]);
		});

		it("Solver Scp2804s and problem flay06m", () => {
			expect(
				CalculateGap(
					At(minlpBenchmarksData, 6)["PrimalBoundSolver"],
					At(minlpBenchmarksData, 6)["DualBoundSolver"],
					At(minlpBenchmarksData, 6)["Direction"]
				)
			).toBe(At(minlpBenchmarksData, 6)["Gap_Solver"]);
		});

		it("Solver aecp and problem gams01", () => {
			expect(
				CalculateGap(
					At(minlpBenchmarksData, 7)["PrimalBoundSolver"],
					At(minlpBenchmarksData, 7)["DualBoundSolver"],
					At(minlpBenchmarksData, 7)["Direction"]
				)
			).toBe(At(minlpBenchmarksData, 7)["Gap_Solver"]);
		});

		it("Solver aecp and problem tls12", () => {
			expect(
				CalculateGap(
					At(minlpBenchmarksData, 8)["PrimalBoundSolver"],
					At(minlpBenchmarksData, 8)["DualBoundSolver"],
					At(minlpBenchmarksData, 8)["Direction"]
				)
			).toBe(At(minlpBenchmarksData, 8)["Gap_Solver"]);
		});

		it("Solver aoa and problem st_miqp4", () => {
			expect(
				CalculateGap(
					At(minlpBenchmarksData, 9)["PrimalBoundSolver"],
					At(minlpBenchmarksData, 9)["DualBoundSolver"],
					At(minlpBenchmarksData, 9)["Direction"]
				)
			).toBe(At(minlpBenchmarksData, 9)["Gap_Solver"]);
		});
	});

	describe("Gap_Problem", () => {
		it("Solver Scp2804s and problem alan", () => {
			expect(
				CalculateGap(
					At(minlpBenchmarksData, 0)["PrimalBoundProblem"],
					At(minlpBenchmarksData, 0)["DualBoundProblem"],
					At(minlpBenchmarksData, 0)["Direction"]
				)
			).toBe(At(minlpBenchmarksData, 0)["Gap_Problem"]);
		});

		it("Solver baron and problem alan", () => {
			expect(
				CalculateGap(
					At(minlpBenchmarksData, 1)["PrimalBoundProblem"],
					At(minlpBenchmarksData, 1)["DualBoundProblem"],
					At(minlpBenchmarksData, 1)["Direction"]
				)
			).toBe(At(minlpBenchmarksData, 1)["Gap_Problem"]);
		});

		it("Solver baron and problem smallinvDAXr1b150-165", () => {
			expect(
				CalculateGap(
					At(minlpBenchmarksData, 2)["PrimalBoundProblem"],
					At(minlpBenchmarksData, 2)["DualBoundProblem"],
					At(minlpBenchmarksData, 2)["Direction"]
				)
			).toBe(At(minlpBenchmarksData, 2)["Gap_Problem"]);
		});

		it("Solver Scp2804s and problem pedigree_ex485", () => {
			expect(
				CalculateGap(
					At(minlpBenchmarksData, 3)["PrimalBoundProblem"],
					At(minlpBenchmarksData, 3)["DualBoundProblem"],
					At(minlpBenchmarksData, 3)["Direction"]
				)
			).toBe(At(minlpBenchmarksData, 3)["Gap_Problem"]);
		});

		it("Solver Scp2804s and problem syn30h", () => {
			expect(
				CalculateGap(
					At(minlpBenchmarksData, 4)["PrimalBoundProblem"],
					At(minlpBenchmarksData, 4)["DualBoundProblem"],
					At(minlpBenchmarksData, 4)["Direction"]
				)
			).toBe(At(minlpBenchmarksData, 4)["Gap_Problem"]);
		});

		it("Solver Scp2804s and problem ball_mk4_15", () => {
			expect(
				CalculateGap(
					At(minlpBenchmarksData, 5)["PrimalBoundProblem"],
					At(minlpBenchmarksData, 5)["DualBoundProblem"],
					At(minlpBenchmarksData, 5)["Direction"]
				)
			).toBe(At(minlpBenchmarksData, 5)["Gap_Problem"]);
		});

		it("Solver Scp2804s and problem flay06m", () => {
			expect(
				CalculateGap(
					At(minlpBenchmarksData, 6)["PrimalBoundProblem"],
					At(minlpBenchmarksData, 6)["DualBoundProblem"],
					At(minlpBenchmarksData, 6)["Direction"]
				)
			).toBe(At(minlpBenchmarksData, 6)["Gap_Problem"]);
		});

		it("Solver aecp and problem gams01", () => {
			expect(
				CalculateGap(
					At(minlpBenchmarksData, 7)["PrimalBoundProblem"],
					At(minlpBenchmarksData, 7)["DualBoundProblem"],
					At(minlpBenchmarksData, 7)["Direction"]
				)
			).toBe(At(minlpBenchmarksData, 7)["Gap_Problem"]);
		});

		it("Solver aecp and problem tls12", () => {
			expect(
				CalculateGap(
					At(minlpBenchmarksData, 8)["PrimalBoundProblem"],
					At(minlpBenchmarksData, 8)["DualBoundProblem"],
					At(minlpBenchmarksData, 8)["Direction"]
				)
			).toBe(At(minlpBenchmarksData, 8)["Gap_Problem"]);
		});

		it("Solver aoa and problem st_miqp4", () => {
			expect(
				CalculateGap(
					At(minlpBenchmarksData, 9)["PrimalBoundProblem"],
					At(minlpBenchmarksData, 9)["DualBoundProblem"],
					At(minlpBenchmarksData, 9)["Direction"]
				)
			).toBe(At(minlpBenchmarksData, 9)["Gap_Problem"]);
		});
	});

	describe("PrimalGap", () => {
		it("Solver Scp2804s and problem alan", () => {
			expect(
				CalculateGap(
					At(minlpBenchmarksData, 0)["PrimalBoundSolver"],
					At(minlpBenchmarksData, 0)["PrimalBoundProblem"],
					At(minlpBenchmarksData, 0)["Direction"]
				)
			).toBe(At(minlpBenchmarksData, 0)["PrimalGap"]);
		});

		it("Solver baron and problem alan", () => {
			expect(
				CalculateGap(
					At(minlpBenchmarksData, 1)["PrimalBoundSolver"],
					At(minlpBenchmarksData, 1)["PrimalBoundProblem"],
					At(minlpBenchmarksData, 1)["Direction"]
				)
			).toBe(At(minlpBenchmarksData, 1)["PrimalGap"]);
		});

		it("Solver baron and problem smallinvDAXr1b150-165", () => {
			expect(
				CalculateGap(
					At(minlpBenchmarksData, 2)["PrimalBoundSolver"],
					At(minlpBenchmarksData, 2)["PrimalBoundProblem"],
					At(minlpBenchmarksData, 2)["Direction"]
				)
			).toBe(At(minlpBenchmarksData, 2)["PrimalGap"]);
		});

		it("Solver Scp2804s and problem pedigree_ex485", () => {
			expect(
				CalculateGap(
					At(minlpBenchmarksData, 3)["PrimalBoundSolver"],
					At(minlpBenchmarksData, 3)["PrimalBoundProblem"],
					At(minlpBenchmarksData, 3)["Direction"]
				)
			).toBe(At(minlpBenchmarksData, 3)["PrimalGap"]);
		});

		it("Solver Scp2804s and problem syn30h", () => {
			expect(
				CalculateGap(
					At(minlpBenchmarksData, 4)["PrimalBoundSolver"],
					At(minlpBenchmarksData, 4)["PrimalBoundProblem"],
					At(minlpBenchmarksData, 4)["Direction"]
				)
			).toBe(At(minlpBenchmarksData, 4)["PrimalGap"]);
		});

		it("Solver Scp2804s and problem ball_mk4_15", () => {
			expect(
				CalculateGap(
					At(minlpBenchmarksData, 5)["PrimalBoundSolver"],
					At(minlpBenchmarksData, 5)["PrimalBoundProblem"],
					At(minlpBenchmarksData, 5)["Direction"]
				)
			).toBe(At(minlpBenchmarksData, 5)["PrimalGap"]);
		});

		it("Solver Scp2804s and problem flay06m", () => {
			expect(
				CalculateGap(
					At(minlpBenchmarksData, 6)["PrimalBoundSolver"],
					At(minlpBenchmarksData, 6)["PrimalBoundProblem"],
					At(minlpBenchmarksData, 6)["Direction"]
				)
			).toBe(At(minlpBenchmarksData, 6)["PrimalGap"]);
		});

		it("Solver aecp and problem gams01", () => {
			expect(
				CalculateGap(
					At(minlpBenchmarksData, 7)["PrimalBoundSolver"],
					At(minlpBenchmarksData, 7)["PrimalBoundProblem"],
					At(minlpBenchmarksData, 7)["Direction"]
				)
			).toBe(At(minlpBenchmarksData, 7)["PrimalGap"]);
		});

		it("Solver aecp and problem tls12", () => {
			expect(
				CalculateGap(
					At(minlpBenchmarksData, 8)["PrimalBoundSolver"],
					At(minlpBenchmarksData, 8)["PrimalBoundProblem"],
					At(minlpBenchmarksData, 8)["Direction"]
				)
			).toBe(At(minlpBenchmarksData, 8)["PrimalGap"]);
		});

		it("Solver aoa and problem st_miqp4", () => {
			expect(
				CalculateGap(
					At(minlpBenchmarksData, 9)["PrimalBoundSolver"],
					At(minlpBenchmarksData, 9)["PrimalBoundProblem"],
					At(minlpBenchmarksData, 9)["Direction"]
				)
			).toBe(At(minlpBenchmarksData, 9)["PrimalGap"]);
		});
	});

	describe("DualGap", () => {
		it("Solver Scp2804s and problem alan", () => {
			expect(
				CalculateGap(
					At(minlpBenchmarksData, 0)["DualBoundSolver"],
					At(minlpBenchmarksData, 0)["DualBoundProblem"],
					At(minlpBenchmarksData, 0)["Direction"]
				)
			).toBe(At(minlpBenchmarksData, 0)["DualGap"]);
		});

		it("Solver baron and problem alan", () => {
			expect(
				CalculateGap(
					At(minlpBenchmarksData, 1)["DualBoundSolver"],
					At(minlpBenchmarksData, 1)["DualBoundProblem"],
					At(minlpBenchmarksData, 1)["Direction"]
				)
			).toBe(At(minlpBenchmarksData, 1)["DualGap"]);
		});

		it("Solver baron and problem smallinvDAXr1b150-165", () => {
			expect(
				CalculateGap(
					At(minlpBenchmarksData, 2)["DualBoundSolver"],
					At(minlpBenchmarksData, 2)["DualBoundProblem"],
					At(minlpBenchmarksData, 2)["Direction"]
				)
			).toBe(At(minlpBenchmarksData, 2)["DualGap"]);
		});

		it("Solver Scp2804s and problem pedigree_ex485", () => {
			expect(
				CalculateGap(
					At(minlpBenchmarksData, 3)["DualBoundSolver"],
					At(minlpBenchmarksData, 3)["DualBoundProblem"],
					At(minlpBenchmarksData, 3)["Direction"]
				)
			).toBe(At(minlpBenchmarksData, 3)["DualGap"]);
		});

		it("Solver Scp2804s and problem syn30h", () => {
			expect(
				CalculateGap(
					At(minlpBenchmarksData, 4)["DualBoundSolver"],
					At(minlpBenchmarksData, 4)["DualBoundProblem"],
					At(minlpBenchmarksData, 4)["Direction"]
				)
			).toBe(At(minlpBenchmarksData, 4)["DualGap"]);
		});

		it("Solver Scp2804s and problem ball_mk4_15", () => {
			expect(
				CalculateGap(
					At(minlpBenchmarksData, 5)["DualBoundSolver"],
					At(minlpBenchmarksData, 5)["DualBoundProblem"],
					At(minlpBenchmarksData, 5)["Direction"]
				)
			).toBe(At(minlpBenchmarksData, 5)["DualGap"]);
		});

		it("Solver Scp2804s and problem flay06m", () => {
			expect(
				CalculateGap(
					At(minlpBenchmarksData, 6)["DualBoundSolver"],
					At(minlpBenchmarksData, 6)["DualBoundProblem"],
					At(minlpBenchmarksData, 6)["Direction"]
				)
			).toBe(At(minlpBenchmarksData, 6)["DualGap"]);
		});

		it("Solver aecp and problem gams01", () => {
			expect(
				CalculateGap(
					At(minlpBenchmarksData, 7)["DualBoundSolver"],
					At(minlpBenchmarksData, 7)["DualBoundProblem"],
					At(minlpBenchmarksData, 7)["Direction"]
				)
			).toBe(At(minlpBenchmarksData, 7)["DualGap"]);
		});

		it("Solver aecp and problem tls12", () => {
			expect(
				CalculateGap(
					At(minlpBenchmarksData, 8)["DualBoundSolver"],
					At(minlpBenchmarksData, 8)["DualBoundProblem"],
					At(minlpBenchmarksData, 8)["Direction"]
				)
			).toBe(At(minlpBenchmarksData, 8)["DualGap"]);
		});

		it("Solver aoa and problem st_miqp4", () => {
			expect(
				CalculateGap(
					At(minlpBenchmarksData, 9)["DualBoundSolver"],
					At(minlpBenchmarksData, 9)["DualBoundProblem"],
					At(minlpBenchmarksData, 9)["Direction"]
				)
			).toBe(At(minlpBenchmarksData, 9)["DualGap"]);
		});
	});
});

/**
 * Test functions with mockup data.
 */
describe("Coverage in computation functions with mockup data.", () => {
	describe("CalculateDirection", () => {
		it('should return "max" when Direction is 1 or "1"', () => {
			const testCases = [1, "1"];
			testCases.forEach((testCase) => {
				expect(CalculateDirection(testCase)).toBe("max");
			});
		});

		it('should return "min" when Direction is any other number or numeric string', () => {
			const testCases = [-1, "-1", 0, "0"];
			testCases.forEach((testCase) => {
				expect(CalculateDirection(testCase)).toBe("min");
			});
		});
	});

	describe("CalculatePrimalBound", () => {
		it('should return -Infinity when PrimalBound is "", "NA", "nan", "-nan" and Direction is "max"', () => {
			const testCases = ["", "NA", "nan", "-nan"];
			testCases.forEach((testCase) => {
				expect(CalculatePrimalBound(testCase, "max")).toBe("-Infinity");
			});
		});

		it('should return Infinity when PrimalBound is "", "NA", "nan", "-nan" and Direction is "min"', () => {
			const testCases = ["", "NA", "nan", "-nan"];
			testCases.forEach((testCase) => {
				expect(CalculatePrimalBound(testCase, "min")).toBe("Infinity");
			});
		});

		it('should return Infinity when PrimalBound is "inf" or "+inf" regardless of Direction', () => {
			const testCases = ["inf", "+inf"];
			testCases.forEach((testCase) => {
				expect(CalculatePrimalBound(testCase, "max")).toBe("Infinity");
				expect(CalculatePrimalBound(testCase, "min")).toBe("Infinity");
			});
		});

		it('should return -Infinity when PrimalBound is "-inf" regardless of Direction', () => {
			expect(CalculatePrimalBound("-inf", "max")).toBe("-Infinity");
			expect(CalculatePrimalBound("-inf", "min")).toBe("-Infinity");
		});

		it("should return the same number when PrimalBound is a number", () => {
			expect(CalculatePrimalBound(123, "max")).toBe("1.230000e+2");
			expect(CalculatePrimalBound(123, "min")).toBe("1.230000e+2");
		});
	});

	describe("CalculateDualBound", () => {
		it('should return Infinity when DualBound is "", "NA", "nan", "-nan" and Direction is "max"', () => {
			const testCases = ["", "NA", "nan", "-nan"];
			testCases.forEach((testCase) => {
				expect(CalculateDualBound(testCase, "max")).toBe("Infinity");
			});
		});

		it('should return -Infinity when DualBound is "", "NA", "nan", "-nan" and Direction is "min"', () => {
			const testCases = ["", "NA", "nan", "-nan"];
			testCases.forEach((testCase) => {
				expect(CalculateDualBound(testCase, "min")).toBe("-Infinity");
			});
		});

		it('should return Infinity when DualBound is "inf" or "+inf" regardless of Direction', () => {
			const testCases = ["inf", "+inf"];
			testCases.forEach((testCase) => {
				expect(CalculateDualBound(testCase, "max")).toBe("Infinity");
				expect(CalculateDualBound(testCase, "min")).toBe("Infinity");
			});
		});

		it('should return -Infinity when DualBound is "-inf" regardless of Direction', () => {
			expect(CalculateDualBound("-inf", "max")).toBe("-Infinity");
			expect(CalculateDualBound("-inf", "min")).toBe("-Infinity");
		});

		it("should return the same number when DualBound is a number", () => {
			expect(CalculateDualBound(123, "max")).toBe("1.230000e+2");
			expect(CalculateDualBound(123, "min")).toBe("1.230000e+2");
		});
	});

	describe("CalculateGap", () => {
		it("should return 0.0 when a and b are equal within tolerance", () => {
			expect(CalculateGap(1, 1, "max")).toBe(0.0);
			expect(CalculateGap(1, 1, "min")).toBe(0.0);
			expect(CalculateGap(5.994797334158539, 5.994797334158539, "min")).toBe(
				0.0
			);
			expect(CalculateGap(16.3, 6.34028371962439, "min")).toBe(157.09);
		});

		it("should return 0.0 if the absolute value of b subtacted from a is less than tolerance", () => {
			expect(CalculateGap(1, 1.0000000001, "max")).toBe(0.0);
			expect(CalculateGap(1, 1.0000000001, "min")).toBe(0.0);
		});

		it("should return Infinity when the minimum absolute value of a and b is less than tolerance", () => {
			expect(CalculateGap(0, 1, "max")).toBe(Infinity);
			expect(CalculateGap(0, 1, "min")).toBe(Infinity);
			expect(CalculateGap(1, 0, "max")).toBe(Infinity);
			expect(CalculateGap(1, 0, "min")).toBe(Infinity);
		});

		it("should return Infinity when either a or b is Infinity", () => {
			expect(CalculateGap(Infinity, 1, "max")).toBe(Infinity);
			expect(CalculateGap(Infinity, 1, "min")).toBe(Infinity);
			expect(CalculateGap(1, Infinity, "max")).toBe(Infinity);
			expect(CalculateGap(1, Infinity, "min")).toBe(Infinity);
		});

		it("should return Infinity when a and b have different signs", () => {
			expect(CalculateGap(-1, 1, "max")).toBe(Infinity);
			expect(CalculateGap(-1, 1, "min")).toBe(Infinity);
			expect(CalculateGap(1, -1, "max")).toBe(Infinity);
			expect(CalculateGap(1, -1, "min")).toBe(Infinity);
		});

		it("should return the gap between a and b when none of the above conditions are met", () => {
			expect(
				CalculateGap(
					At(mockupTraceData, 0).PrimalBound as number,
					At(mockupTraceData, 0).DualBound as number,
					"max"
				)
			).toBeCloseTo(47.38);
			expect(
				CalculateGap(
					At(mockupTraceData, 1).PrimalBound as number,
					At(mockupTraceData, 1).DualBound as number,
					"min"
				)
			).toBeCloseTo(429.17);
			expect(
				CalculateGap(
					At(mockupTraceData, 2).PrimalBound as number,
					At(mockupTraceData, 2).DualBound as number,
					"max"
				)
			).toBe(Infinity);
			expect(
				CalculateGap(
					At(mockupTraceData, 3).PrimalBound as number,
					At(mockupTraceData, 3).DualBound as number,
					"min"
				)
			).toBe(Infinity);
		});

		it("should return Infinity when a and b have different signs", () => {
			expect(CalculateGap(-1, 1, "max")).toBe(Infinity);
			expect(CalculateGap(-1, 1, "min")).toBe(Infinity);
			expect(CalculateGap(1, -1, "max")).toBe(Infinity);
			expect(CalculateGap(1, -1, "min")).toBe(Infinity);
		});
	});

	describe("ExtractAllSolverTimes", () => {
		test("Extracts solver times correctly.", () => {
			const times = ExtractAllSolverTimes(
				mockupTraceData.map((data) => ({
					...data,
					SolverTime: data.SolverTime
				}))
			);
			const solver1 = times["TestSolver1"] ?? [];
			const solver2 = times["TestSolver2"] ?? [];

			expect(At(solver1, 1)).toHaveProperty("time", 0.560621249);
			expect(At(solver1, 1)).toHaveProperty("InputFileName", "TestInstance_B");

			expect(solver2).toHaveLength(2);
			expect(At(solver2, 0)).toHaveProperty("time", 900.971);
			expect(At(solver2, 0)).toHaveProperty("InputFileName", "TestInstance_X");
			expect(At(solver2, 1)).toHaveProperty("time", 5.922);
			expect(At(solver2, 1)).toHaveProperty("InputFileName", "TestInstance_Y");
		});
	});

	describe("ExtractAllSolverTimesGapType", () => {
		it("should return an empty object if traceData is empty", () => {
			const result = ExtractAllSolverTimesGapType([], "PrimalGap");
			expect(result).toEqual({});
		});
	});

	describe("ComputeStatisticalMeasures", () => {
		const category = "SolverTime";

		test("Calculate the statistics table correctly.", () => {
			const result = ComputeStatisticalMeasures(mockupTraceData, category);

			expect(result).toEqual({
				TestSolver1: {
					avgValue: expect.any(Number),
					minValue: expect.any(Number),
					maxValue: expect.any(Number),
					stdValue: expect.any(Number),
					sumValue: expect.any(Number),
					p10Value: expect.any(Number),
					p25Value: expect.any(Number),
					p50Value: expect.any(Number),
					p75Value: expect.any(Number),
					p90Value: expect.any(Number)
				},
				TestSolver2: {
					avgValue: expect.any(Number),
					minValue: expect.any(Number),
					maxValue: expect.any(Number),
					stdValue: expect.any(Number),
					sumValue: expect.any(Number),
					p10Value: expect.any(Number),
					p25Value: expect.any(Number),
					p50Value: expect.any(Number),
					p75Value: expect.any(Number),
					p90Value: expect.any(Number)
				},
				"Virtual Best Solver": {
					avgValue: expect.any(Number),
					minValue: expect.any(Number),
					maxValue: expect.any(Number),
					stdValue: expect.any(Number),
					sumValue: expect.any(Number),
					p10Value: expect.any(Number),
					p25Value: expect.any(Number),
					p50Value: expect.any(Number),
					p75Value: expect.any(Number),
					p90Value: expect.any(Number)
				},
				"Virtual Worst Solver": {
					avgValue: expect.any(Number),
					minValue: expect.any(Number),
					maxValue: expect.any(Number),
					stdValue: expect.any(Number),
					sumValue: expect.any(Number),
					p10Value: expect.any(Number),
					p25Value: expect.any(Number),
					p50Value: expect.any(Number),
					p75Value: expect.any(Number),
					p90Value: expect.any(Number)
				}
			});

			expect(result.TestSolver1).toEqual({
				avgValue: 0.3008711,
				minValue: 0.04112087,
				maxValue: 0.5606212,
				stdValue: 0.3673422,
				sumValue: 0.6017421,
				p10Value: 0.09307091,
				p25Value: 0.170996,
				p50Value: 0.3008711,
				p75Value: 0.4307462,
				p90Value: 0.5086712
			});

			expect(result.TestSolver2).toEqual({
				avgValue: 453.4465,
				minValue: 5.922,
				maxValue: 900.971,
				stdValue: 632.8952,
				sumValue: 906.893,
				p10Value: 95.4269,
				p25Value: 229.6843,
				p50Value: 453.4465,
				p75Value: 677.2088,
				p90Value: 811.4661
			});

			expect(result["Virtual Best Solver"]).toEqual({
				avgValue: 226.8737,
				maxValue: 900.971,
				minValue: 0.04112087,
				p10Value: 0.196971,
				p25Value: 0.4307462,
				p50Value: 3.241311,
				p75Value: 229.6843,
				p90Value: 632.4563,
				stdValue: 449.4061,
				sumValue: 907.4947
			});

			expect(result["Virtual Worst Solver"]).toEqual({
				avgValue: 226.8737,
				maxValue: 900.971,
				minValue: 0.04112087,
				p10Value: 0.196971,
				p25Value: 0.4307462,
				p50Value: 3.241311,
				p75Value: 229.6843,
				p90Value: 632.4563,
				stdValue: 449.4061,
				sumValue: 907.4947
			});
		});
	});
});

/**
 * Quick check for status mapping.
 */
describe("Status mapping", () => {
	describe("SetModelStatus", () => {
		it("should return Optimal if the value is 1", () => {
			expect(SetModelStatus(1)).toBe("Optimal");
		});

		it("should return Locally Optimal if the value is 2", () => {
			expect(SetModelStatus(2)).toBe("Locally Optimal");
		});

		it("should return Unbounded if the value is 3", () => {
			expect(SetModelStatus(3)).toBe("Unbounded");
		});

		it("should return Infeasible if the value is 4", () => {
			expect(SetModelStatus(4)).toBe("Infeasible");
		});

		it("should return Locally Infeasible if the value is 5", () => {
			expect(SetModelStatus(5)).toBe("Locally Infeasible");
		});

		it("should return Intermediate Infeasible if the value is 6", () => {
			expect(SetModelStatus(6)).toBe("Intermediate Infeasible");
		});

		it("should return Feasible Solution if the value is 7", () => {
			expect(SetModelStatus(7)).toBe("Feasible Solution");
		});

		it("should return Integer Solution if the value is 8", () => {
			expect(SetModelStatus(8)).toBe("Integer Solution");
		});

		it("should return Intermediate Non-integer if the value is 9", () => {
			expect(SetModelStatus(9)).toBe("Intermediate Non-integer");
		});

		it("should return Integer Infeasible if the value is 10", () => {
			expect(SetModelStatus(10)).toBe("Integer Infeasible");
		});

		it("should return Lic Problem - No Solution if the value is 11", () => {
			expect(SetModelStatus(11)).toBe("Lic Problem - No Solution");
		});

		it("should return Error Unknown if the value is 12", () => {
			expect(SetModelStatus(12)).toBe("Error Unknown");
		});

		it("should return Error No Solution if the value is 13", () => {
			expect(SetModelStatus(13)).toBe("Error No Solution");
		});

		it("should return No Solution Returned if the value is 14", () => {
			expect(SetModelStatus(14)).toBe("No Solution Returned");
		});

		it("should return Solved Unique if the value is 15", () => {
			expect(SetModelStatus(15)).toBe("Solved Unique");
		});

		it("should return Solved if the value is 16", () => {
			expect(SetModelStatus(16)).toBe("Solved");
		});

		it("should return Solved Singular if the value is 17", () => {
			expect(SetModelStatus(17)).toBe("Solved Singular");
		});

		it("should return Unbounded - No Solution if the value is 18", () => {
			expect(SetModelStatus(18)).toBe("Unbounded - No Solution");
		});

		it("should return Infeasible - No Solution if the value is 19", () => {
			expect(SetModelStatus(19)).toBe("Infeasible - No Solution");
		});

		it("should return Unknown Error if the value is not in the statusMap", () => {
			expect(SetModelStatus(0)).toBe("Unknown Error");
			expect(SetModelStatus("invalid")).toBe("Unknown Error");
		});
	});

	describe("SetSolverStatus", () => {
		it("should return Normal Completion if the value is 1", () => {
			expect(SetSolverStatus(1)).toBe("Normal Completion");
		});

		it("should return Iteration Interrupt if the value is 2", () => {
			expect(SetSolverStatus(2)).toBe("Iteration Interrupt");
		});

		it("should return Resource Interrupt if the value is 3", () => {
			expect(SetSolverStatus(3)).toBe("Resource Interrupt");
		});

		it("should return Terminated By Solver if the value is 4", () => {
			expect(SetSolverStatus(4)).toBe("Terminated By Solver");
		});

		it("should return Evaluation Interrupt if the value is 5", () => {
			expect(SetSolverStatus(5)).toBe("Evaluation Interrupt");
		});

		it("should return Capability Problems if the value is 6", () => {
			expect(SetSolverStatus(6)).toBe("Capability Problems");
		});

		it("should return Licensing Problems if the value is 7", () => {
			expect(SetSolverStatus(7)).toBe("Licensing Problems");
		});

		it("should return User Interrupt if the value is 8", () => {
			expect(SetSolverStatus(8)).toBe("User Interrupt");
		});

		it("should return Error Setup Failure if the value is 9", () => {
			expect(SetSolverStatus(9)).toBe("Error Setup Failure");
		});

		it("should return Error Solver Failure if the value is 10", () => {
			expect(SetSolverStatus(10)).toBe("Error Solver Failure");
		});

		it("should return Error Internal Solver Failure if the value is 11", () => {
			expect(SetSolverStatus(11)).toBe("Error Internal Solver Failure");
		});

		it("should return Solve Processing Skipped if the value is 12", () => {
			expect(SetSolverStatus(12)).toBe("Solve Processing Skipped");
		});

		it("should return Error System Failure if the value is 13", () => {
			expect(SetSolverStatus(13)).toBe("Error System Failure");
		});

		it("should return Unknown Error if the value is not in the statusMap", () => {
			expect(SetSolverStatus(0)).toBe("Unknown Error");
			expect(SetSolverStatus("invalid")).toBe("Unknown Error");
		});
	});
});

describe("CompareSolvers", () => {
	const solverTimes = {
		Solver1: [
			{ InputFileName: "File1", time: 10 },
			{ InputFileName: "File2", time: 25 },
			{ InputFileName: "File3", time: 30 }
		],
		Solver2: [
			{ InputFileName: "File1", time: 15 },
			{ InputFileName: "File2", time: 20 },
			{ InputFileName: "File3", time: 29 }
		]
	};

	it("should return the correct comparison summary", () => {
		const expectedSummary = {
			better: 1,
			worse: 2,
			equal: 0,
			details: [
				{
					InputFileName: "File1",
					time1: 10,
					time2: 15,
					comparison: "better"
				},
				{
					InputFileName: "File2",
					time1: 25,
					time2: 20,
					comparison: "worse"
				},
				{
					InputFileName: "File3",
					time1: 30,
					time2: 29,
					comparison: "worse"
				}
			]
		};

		const comparisonSummary = CompareSolvers("Solver1", "Solver2", solverTimes);

		expect(comparisonSummary).toEqual(expectedSummary);
	});
});

describe("GetPageKind", () => {
	it("should recognize the table page", () => {
		expect(GetPageKind(PageTitles.TABLE)).toBe(PageKind.TABLE);
	});

	it("should recognize the compare solvers page", () => {
		expect(GetPageKind(PageTitles.COMPARE_SOLVERS)).toBe(
			PageKind.COMPARE_SOLVERS
		);
	});

	it("should treat every other page as a plot page", () => {
		expect(GetPageKind(PageTitles.PERFORMANCE_PROFILE)).toBe(PageKind.PLOT);
		expect(GetPageKind(PageTitles.SOLUTION_TIME)).toBe(PageKind.PLOT);
		expect(GetPageKind("An unknown page")).toBe(PageKind.PLOT);
	});
});

describe("ResetAppState", () => {
	it("should reset all values of the shared state", () => {
		state.dataFileType = "trc";
		state.defaultTime = 10;
		state.gapLimit = 0.5;
		state.unprocessedData = ["data"];
		state.unprocessedInstanceInformationData = ["instances"];
		state.unprocessedSolutionData = ["solutions"];
		state.chartData = [{ label: "chart" }];

		ResetAppState();

		expect(state).toEqual({
			dataFileType: "",
			defaultTime: undefined,
			gapLimit: undefined,
			unprocessedData: [],
			unprocessedInstanceInformationData: [],
			unprocessedSolutionData: [],
			chartData: []
		});
	});

	it("should keep the same state object so imported references stay valid", () => {
		const reference = state;
		ResetAppState();
		expect(state).toBe(reference);
	});
});

describe("Page listeners", () => {
	function CreateTarget(): HTMLElement {
		return new EventTarget() as HTMLElement;
	}

	it("should call a registered listener", () => {
		const target = CreateTarget();
		const handler = jest.fn();
		Listen(target, "click", handler);
		target.dispatchEvent(new Event("click"));
		expect(handler).toHaveBeenCalledTimes(1);
	});

	it("should remove all registered listeners when reset", () => {
		const target = CreateTarget();
		const otherTarget = CreateTarget();
		const handler = jest.fn();
		const otherHandler = jest.fn();
		Listen(target, "click", handler);
		Listen(otherTarget, "click", otherHandler);

		ResetPageListeners();
		target.dispatchEvent(new Event("click"));
		otherTarget.dispatchEvent(new Event("click"));

		expect(handler).not.toHaveBeenCalled();
		expect(otherHandler).not.toHaveBeenCalled();
	});

	it("should keep working for listeners registered after a reset", () => {
		const target = CreateTarget();
		const handler = jest.fn();
		ResetPageListeners();
		Listen(target, "click", handler);
		target.dispatchEvent(new Event("click"));
		expect(handler).toHaveBeenCalledTimes(1);
	});

	it("should ignore elements that do not exist", () => {
		expect(() => Listen(null, "click", jest.fn())).not.toThrow();
	});
});

describe("ApplyStoredConfiguration", () => {
	it("should copy a stored configuration to the state", () => {
		ResetAppState();
		ApplyStoredConfiguration({
			dataSet: ["line"],
			dataFileType: "json",
			defaultTime: 500,
			gapLimit: 0.5
		});

		expect(state).toMatchObject({
			unprocessedData: ["line"],
			dataFileType: "json",
			defaultTime: 500,
			gapLimit: 0.5
		});
		ResetAppState();
	});
});
