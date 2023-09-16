import {
	CalculateDirection,
	CalculatePrimalBound,
	CalculateDualBound,
	CalculateGap,
	CalculateGapDifference,
	AnalyzeDataByCategory,
	ExtractAllSolverTimes
} from "../Src/Scripts/DataProcessing/CalculateResults";

jest.doMock("../Src/Scripts/DataProcessing/GetExtraData", () => ({
	DOMElement: jest.fn()
}));

/**
 * Mockup data.
 */
const mockupTraceData = [
	{
		SolverName: "TestSolver1",
		SolverTime: "0.041120867",
		InputFileName: "TestInstance",
		PrimalBound: 1.33594e1,
		DualBound: 1.96894e1,
		UserComment: "This is will get filtered."
	},
	{
		SolverName: "TestSolver1",
		SolverTime: "0.560621249",
		InputFileName: "TestInstance_B",
		PrimalBound: -5.96e3,
		DualBound: -3.153852e4,
		UserComment: "This is will get filtered."
	},
	{
		SolverName: "TestSolver2",
		SolverTime: "900.971",
		InputFileName: "TestInstance_X",
		PrimalBound: -5.905217,
		DualBound: 1.43358e1,
		UserComment: "This is will get filtered."
	},
	{
		SolverName: "TestSolver2",
		SolverTime: "5.922",
		InputFileName: "TestInstance_Y",
		PrimalBound: 1.13389e2,
		DualBound: -2.0423e4,
		UserComment: "This is will get filtered."
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
		Direction: "min",
		Gap_Solver: 0.0,
		Gap_Problem: 0.00,
		PrimalGap: 0.00,
		DualGap: 0.00,
	},
	{
		SolverName: "baron",
		InputFileName: "alan",
		PrimalBoundSolver: 2.925,
		DualBoundSolver: 2.922078,
		PrimalBoundProblem: 2.925,
		DualBoundProblem: 2.925,
		Gap_Solver: 0.10,
		Gap_Problem: 0.00,
		PrimalGap: 0.00,
		DualGap: 0.10,
		Direction: "min",
	},
	{
		SolverName: "baron",
		InputFileName: "smallinvDAXr1b150-165",
		PrimalBoundSolver: 8.813741e+01,
		DualBoundSolver: 8.808250e+01,
		PrimalBoundProblem: 8.810493e+01,
		DualBoundProblem: 8.810493e+01,
		Gap_Solver: 0.06,
		Gap_Problem: 0,
		PrimalGap: 0.04,
		DualGap: 0.03,
		Direction: "min",
	},
	{
		SolverName: "Scp2804s",
		InputFileName: "pedigree_ex485",
		PrimalBoundSolver: -2.184812e4,
		DualBoundSolver: -2.226831e4,
		PrimalBoundProblem: -2.193157e4,
		DualBoundProblem: -2.193157e4,
		Gap_Solver: 1.92,
		Gap_Problem: 0.00,
		PrimalGap: 0.38,
		DualGap: 1.54,
		Direction: "min",
	},
	{
		SolverName: "Scp2804s",
		InputFileName: "syn30h",
		PrimalBoundSolver: 1.381603e+02,
		DualBoundSolver: 1.384918e+02,
		PrimalBoundProblem: 1.381598e+02,
		DualBoundProblem: 1.381598e+02,
		Gap_Solver: 0.24,
		Gap_Problem: 0.00,
		PrimalGap: 0.00,
		DualGap: 0.24,
		Direction: "max",
	}
];

/**
 * Test calculations to get correct gap values according to existing benchmarks.
 */
describe("Gap values from real benchmarks.", () => {
	describe("Gap_Solver", () => {
		it("Solver Scp2804s and problem alan", () => {
			expect(CalculateGap(
				minlpBenchmarksData[0]["PrimalBoundSolver"], 
				minlpBenchmarksData[0]["DualBoundSolver"],  
				minlpBenchmarksData[0]["Direction"]
			)).toBe(minlpBenchmarksData[0]["Gap_Solver"]);
		})
	
		it("Solver baron and problem alan", () => {
			expect(CalculateGap(
				minlpBenchmarksData[1]["PrimalBoundSolver"], 
				minlpBenchmarksData[1]["DualBoundSolver"],  
				minlpBenchmarksData[1]["Direction"]
			)).toBe(minlpBenchmarksData[1]["Gap_Solver"]);
		})
	
		it("Solver baron and problem smallinvDAXr1b150-165", () => {
			expect(CalculateGap(
				minlpBenchmarksData[2]["PrimalBoundSolver"], 
				minlpBenchmarksData[2]["DualBoundSolver"],  
				minlpBenchmarksData[2]["Direction"]
			)).toBe(minlpBenchmarksData[2]["Gap_Solver"]);
		})
	
		it("Solver Scp2804s and problem pedigree_ex485", () => {
			expect(CalculateGap(
				minlpBenchmarksData[3]["PrimalBoundSolver"], 
				minlpBenchmarksData[3]["DualBoundSolver"],  
				minlpBenchmarksData[3]["Direction"]
			)).toBe(minlpBenchmarksData[3]["Gap_Solver"]);
		})

		it("Solver Scp2804s and problem syn30h", () => {
			expect(CalculateGap(
				minlpBenchmarksData[4]["PrimalBoundSolver"], 
				minlpBenchmarksData[4]["DualBoundSolver"],  
				minlpBenchmarksData[4]["Direction"]
			)).toBe(minlpBenchmarksData[4]["Gap_Solver"]);
		})
	})
	
	describe("Gap_Problem", () => {
		it("Solver Scp2804s and problem alan", () => {
			expect(CalculateGap(
				minlpBenchmarksData[0]["PrimalBoundProblem"], 
				minlpBenchmarksData[0]["DualBoundProblem"],  
				minlpBenchmarksData[0]["Direction"]
			)).toBe(minlpBenchmarksData[0]["Gap_Problem"]);
		});
	
		it("Solver baron and problem alan", () => {
			expect(CalculateGap(
				minlpBenchmarksData[1]["PrimalBoundProblem"], 
				minlpBenchmarksData[1]["DualBoundProblem"],  
				minlpBenchmarksData[1]["Direction"]
			)).toBe(minlpBenchmarksData[1]["Gap_Problem"]);
		});
	
		it("Solver baron and problem smallinvDAXr1b150-165", () => {
			expect(CalculateGap(
				minlpBenchmarksData[2]["PrimalBoundProblem"], 
				minlpBenchmarksData[2]["DualBoundProblem"],  
				minlpBenchmarksData[2]["Direction"]
			)).toBe(minlpBenchmarksData[2]["Gap_Problem"]);
		});
	
		it("Solver Scp2804s and problem pedigree_ex485", () => {
			expect(CalculateGap(
				minlpBenchmarksData[3]["PrimalBoundProblem"], 
				minlpBenchmarksData[3]["DualBoundProblem"],  
				minlpBenchmarksData[3]["Direction"]
			)).toBe(minlpBenchmarksData[3]["Gap_Problem"]);
		});

		it("Solver Scp2804s and problem syn30h", () => {
			expect(CalculateGap(
				minlpBenchmarksData[4]["PrimalBoundProblem"], 
				minlpBenchmarksData[4]["DualBoundProblem"],  
				minlpBenchmarksData[4]["Direction"]
			)).toBe(minlpBenchmarksData[4]["Gap_Problem"]);
		});
	});
	
	describe("PrimalGap", () => {
		it("Solver Scp2804s and problem alan", () => {
			expect(CalculateGap(
				minlpBenchmarksData[0]["PrimalBoundSolver"], 
				minlpBenchmarksData[0]["PrimalBoundProblem"],
				minlpBenchmarksData[0]["Direction"]
			)).toBe(minlpBenchmarksData[0]["PrimalGap"]);
		});
	
		it("Solver baron and problem alan", () => {
			expect(CalculateGap(
				minlpBenchmarksData[1]["PrimalBoundSolver"], 
				minlpBenchmarksData[1]["PrimalBoundProblem"],
				minlpBenchmarksData[1]["Direction"]
			)).toBe(minlpBenchmarksData[1]["PrimalGap"]);
		});
	
		it("Solver baron and problem smallinvDAXr1b150-165", () => {
			expect(CalculateGap(
				minlpBenchmarksData[2]["PrimalBoundSolver"], 
				minlpBenchmarksData[2]["PrimalBoundProblem"],
				minlpBenchmarksData[2]["Direction"]
			)).toBe(minlpBenchmarksData[2]["PrimalGap"]);
		});
	
		it("Solver Scp2804s and problem pedigree_ex485", () => {
			expect(CalculateGap(
				minlpBenchmarksData[3]["PrimalBoundSolver"], 
				minlpBenchmarksData[3]["PrimalBoundProblem"],
				minlpBenchmarksData[3]["Direction"]
			)).toBe(minlpBenchmarksData[3]["PrimalGap"]);
		});

		it("Solver Scp2804s and problem syn30h", () => {
			expect(CalculateGap(
				minlpBenchmarksData[4]["PrimalBoundSolver"], 
				minlpBenchmarksData[4]["PrimalBoundProblem"],
				minlpBenchmarksData[4]["Direction"]
			)).toBe(minlpBenchmarksData[4]["PrimalGap"]);
		});
	})
	
	describe("DualGap", () => {
		it("Solver Scp2804s and problem alan", () => {
			expect(CalculateGap(
				minlpBenchmarksData[0]["DualBoundSolver"], 
				minlpBenchmarksData[0]["DualBoundProblem"],
				minlpBenchmarksData[0]["Direction"]
			)).toBe(minlpBenchmarksData[0]["DualGap"]);
		});
	
		it("Solver baron and problem alan", () => {
			expect(CalculateGap(
				minlpBenchmarksData[1]["DualBoundSolver"], 
				minlpBenchmarksData[1]["DualBoundProblem"],
				minlpBenchmarksData[1]["Direction"]
			)).toBe(minlpBenchmarksData[1]["DualGap"]);
		});
	
		it("Solver baron and problem smallinvDAXr1b150-165", () => {
			expect(CalculateGap(
				minlpBenchmarksData[2]["DualBoundSolver"], 
				minlpBenchmarksData[2]["DualBoundProblem"],
				minlpBenchmarksData[2]["Direction"]
			)).toBe(minlpBenchmarksData[2]["DualGap"]);
		});
	
		it("Solver Scp2804s and problem pedigree_ex485", () => {
			expect(CalculateGap(
				minlpBenchmarksData[3]["DualBoundSolver"], 
				minlpBenchmarksData[3]["DualBoundProblem"],
				minlpBenchmarksData[3]["Direction"]
			)).toBe(minlpBenchmarksData[3]["DualGap"]);
		});

		it("Solver Scp2804s and problem syn30h", () => {
			expect(CalculateGap(
				minlpBenchmarksData[4]["DualBoundSolver"], 
				minlpBenchmarksData[4]["DualBoundProblem"],
				minlpBenchmarksData[4]["Direction"]
			)).toBe(minlpBenchmarksData[4]["DualGap"]);
		});
	});
});

/**
 * Test functions with mockup data.
 */
describe("Coverage in functions with mockup data.", () => {
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
				expect(CalculatePrimalBound(testCase, "max")).toBe(-Infinity);
			});
		});
	
		it('should return Infinity when PrimalBound is "", "NA", "nan", "-nan" and Direction is "min"', () => {
			const testCases = ["", "NA", "nan", "-nan"];
			testCases.forEach((testCase) => {
				expect(CalculatePrimalBound(testCase, "min")).toBe(Infinity);
			});
		});
	
		it('should return Infinity when PrimalBound is "inf" or "+inf" regardless of Direction', () => {
			const testCases = ["inf", "+inf"];
			testCases.forEach((testCase) => {
				expect(CalculatePrimalBound(testCase, "max")).toBe(Infinity);
				expect(CalculatePrimalBound(testCase, "min")).toBe(Infinity);
			});
		});
	
		it('should return -Infinity when PrimalBound is "-inf" regardless of Direction', () => {
			expect(CalculatePrimalBound("-inf", "max")).toBe(-Infinity);
			expect(CalculatePrimalBound("-inf", "min")).toBe(-Infinity);
		});
	
		it("should return the same number when PrimalBound is a number", () => {
			expect(CalculatePrimalBound(123, "max")).toBe(1.23e2);
			expect(CalculatePrimalBound(123, "min")).toBe(1.23e2);
		});
	});
	
	describe("CalculateDualBound", () => {
		it('should return Infinity when DualBound is "", "NA", "nan", "-nan" and Direction is "max"', () => {
			const testCases = ["", "NA", "nan", "-nan"];
			testCases.forEach((testCase) => {
				expect(CalculateDualBound(testCase, "max")).toBe(Infinity);
			});
		});
	
		it('should return -Infinity when DualBound is "", "NA", "nan", "-nan" and Direction is "min"', () => {
			const testCases = ["", "NA", "nan", "-nan"];
			testCases.forEach((testCase) => {
				expect(CalculateDualBound(testCase, "min")).toBe(-Infinity);
			});
		});
	
		it('should return Infinity when DualBound is "inf" or "+inf" regardless of Direction', () => {
			const testCases = ["inf", "+inf"];
			testCases.forEach((testCase) => {
				expect(CalculateDualBound(testCase, "max")).toBe(Infinity);
				expect(CalculateDualBound(testCase, "min")).toBe(Infinity);
			});
		});
	
		it('should return -Infinity when DualBound is "-inf" regardless of Direction', () => {
			expect(CalculateDualBound("-inf", "max")).toBe(-Infinity);
			expect(CalculateDualBound("-inf", "min")).toBe(-Infinity);
		});
	
		it("should return the same number when DualBound is a number", () => {
			expect(CalculateDualBound(123, "max")).toBe(1.23e2);
			expect(CalculateDualBound(123, "min")).toBe(1.23e2);
		});
	});
	
	describe("CalculateGap", () => {
		it("should return 0.0 when a and b are equal within tolerance", () => {
			expect(CalculateGap(1, 1, "max")).toBe(0.0);
			expect(CalculateGap(1, 1, "min")).toBe(0.0);
			expect(CalculateGap(5.994797334158539, 5.994797334158539, "min")).toBe(0.0);
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
					mockupTraceData[0].PrimalBound as number,
					mockupTraceData[0].DualBound as number,
					"max"
				)
			).toBeCloseTo(47.38);
			expect(
				CalculateGap(
					mockupTraceData[1].PrimalBound as number,
					mockupTraceData[1].DualBound as number,
					"min"
				)
			).toBeCloseTo(429.17);
			expect(
				CalculateGap(
					mockupTraceData[2].PrimalBound as number,
					mockupTraceData[2].DualBound as number,
					"max"
				)
			).toBe(Infinity);
			expect(
				CalculateGap(
					mockupTraceData[3].PrimalBound as number,
					mockupTraceData[3].DualBound as number,
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
	
	describe("CalculateGapDifference", () => {
		it("should return 0.0 when both numbers are Infinity", () => {
			expect(CalculateGapDifference(Infinity, Infinity)).toBe(0.0);
		});
	
		it("should return the difference between a and b when either a or b is Infinity but not both", () => {
			expect(CalculateGapDifference(Infinity, 10)).toBe(Infinity - 10);
		});
	
		it("should return the correct gap difference when neither a nor b is Infinity", () => {
			expect(CalculateGapDifference(0, 0.1)).toBe(-0.1);
			expect(CalculateGapDifference(0.09, 0.07)).toBe(0.02);
		});
	});
	
	describe("ExtractAllSolverTimes", () => {
		test("Extracts solver times correctly.", () => {
			const result = ExtractAllSolverTimes(mockupTraceData);
	
			expect(
				(result as { [key: string]: { time: number; InputFileName: string }[] })
					.TestSolver1
			).toHaveLength(2);
			expect(
				(result as { [key: string]: { time: number; InputFileName: string }[] })
					.TestSolver1[0]
			).toHaveProperty("time", 0.041120867);
			expect(
				(result as { [key: string]: { time: number; InputFileName: string }[] })
					.TestSolver1[0]
			).toHaveProperty("InputFileName", "TestInstance");
			expect(
				(result as { [key: string]: { time: number; InputFileName: string }[] })
					.TestSolver1[1]
			).toHaveProperty("time", 0.560621249);
			expect(
				(result as { [key: string]: { time: number; InputFileName: string }[] })
					.TestSolver1[1]
			).toHaveProperty("InputFileName", "TestInstance_B");
	
			expect(
				(result as { [key: string]: { time: number; InputFileName: string }[] })
					.TestSolver2
			).toHaveLength(2);
			expect(
				(result as { [key: string]: { time: number; InputFileName: string }[] })
					.TestSolver2[0]
			).toHaveProperty("time", 900.971);
			expect(
				(result as { [key: string]: { time: number; InputFileName: string }[] })
					.TestSolver2[0]
			).toHaveProperty("InputFileName", "TestInstance_X");
			expect(
				(result as { [key: string]: { time: number; InputFileName: string }[] })
					.TestSolver2[1]
			).toHaveProperty("time", 5.922);
			expect(
				(result as { [key: string]: { time: number; InputFileName: string }[] })
					.TestSolver2[1]
			).toHaveProperty("InputFileName", "TestInstance_Y");
		});
	});
	
	describe("AnalyzeDataByCategory", () => {
		const category = "SolverTime";
	
		test("Calculate the statistics table correctly.", () => {
			const result = AnalyzeDataByCategory(mockupTraceData, category);
	
			expect(result).toEqual({
				TestSolver1: {
					average: expect.any(Number),
					min: expect.any(Number),
					max: expect.any(Number),
					std: expect.any(Number),
					sum: expect.any(Number),
					percentile_10: expect.any(Number),
					percentile_25: expect.any(Number),
					percentile_50: expect.any(Number),
					percentile_75: expect.any(Number),
					percentile_90: expect.any(Number)
				},
				TestSolver2: {
					average: expect.any(Number),
					min: expect.any(Number),
					max: expect.any(Number),
					std: expect.any(Number),
					sum: expect.any(Number),
					percentile_10: expect.any(Number),
					percentile_25: expect.any(Number),
					percentile_50: expect.any(Number),
					percentile_75: expect.any(Number),
					percentile_90: expect.any(Number)
				}
			});
	
			expect(result.TestSolver1).toEqual({
				average: 0.3008711,
				min: 0.04112087,
				max: 0.5606212,
				std: 0.3673422,
				sum: 0.6017421,
				percentile_10: 0.09307091,
				percentile_25: 0.170996,
				percentile_50: 0.3008711,
				percentile_75: 0.4307462,
				percentile_90: 0.5086712
			});
	
			expect(result.TestSolver2).toEqual({
				average: 453.4465,
				min: 5.922,
				max: 900.971,
				std: 632.8952,
				sum: 906.893,
				percentile_10: 95.4269,
				percentile_25: 229.6843,
				percentile_50: 453.4465,
				percentile_75: 677.2088,
				percentile_90: 811.4661
			});
		});
	});
})