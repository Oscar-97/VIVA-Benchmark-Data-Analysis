/* eslint-disable max-lines */
import { CalculateGap } from "../Src/Scripts/DataProcessing/ResultComputations/ComputeResults";
import { At } from "./TestHelpers";

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
