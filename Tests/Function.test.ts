import {
	CalculateDirection,
	CalculatePrimalBound,
	CalculateDualBound,
	CalculateGap,
	CalculateDifference,
	CalculateGapDifference,
	AnalyzeDataByCategory,
	ExtractAllSolverTimes
} from "../Src/Scripts/DataProcessing/CalculateResults";

jest.doMock("../Src/Scripts/DataProcessing/GetExtraData", () => ({
	DOMElement: jest.fn()
}));

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

	it("should return a number when PrimalBound is a numeric string", () => {
		expect(CalculatePrimalBound("123", "max")).toBe(123);
		expect(CalculatePrimalBound("123", "min")).toBe(123);
	});

	it("should return the same number when PrimalBound is a number", () => {
		expect(CalculatePrimalBound(123, "max")).toBe(123);
		expect(CalculatePrimalBound(123, "min")).toBe(123);
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

	it("should return a number when DualBound is a numeric string", () => {
		expect(CalculateDualBound("123", "max")).toBe(123);
		expect(CalculateDualBound("123", "min")).toBe(123);
	});

	it("should return the same number when DualBound is a number", () => {
		expect(CalculateDualBound(123, "max")).toBe(123);
		expect(CalculateDualBound(123, "min")).toBe(123);
	});
});

describe("CalculateGap", () => {
	it("should return 0.0 when a and b are equal within tolerance", () => {
		expect(CalculateGap(1, 1, "max")).toBe(0.0);
		expect(CalculateGap(1, 1, "min")).toBe(0.0);
		expect(CalculateGap(5.994797334158539, 5.994797334158539, "min")).toBe(0.0);
		expect(CalculateGap(16.3, 6.34028371962439, "min")).toBe(
			157.08628699924557
		);
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
});

describe("CalculateDifference", () => {
	it("should return the difference between a and b", () => {
		expect(CalculateDifference(1, 2)).toBeCloseTo(1.0, 7);
		expect(CalculateDifference(2, 1)).toBeCloseTo(1.0, 7);
		expect(CalculateDifference(-1, 1)).toBeCloseTo(2.0, 7);
		expect(CalculateDifference(1, -1)).toBeCloseTo(2.0, 7);
		expect(CalculateDifference(-1, -2)).toBeCloseTo(1.0, 7);
		expect(CalculateDifference(-2, -1)).toBeCloseTo(1.0, 7);
	});

	it("should return 0 when a and b are equal", () => {
		expect(CalculateDifference(1, 1)).toBe(0);
		expect(CalculateDifference(-1, -1)).toBe(0);
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
