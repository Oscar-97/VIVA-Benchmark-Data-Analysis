jest.mock("../Src/Scripts/Chart/CreateChart", () => ({
	CreateChart: jest.fn()
}));
jest.mock("../Src/Scripts/Elements/Elements", () => ({
	elements: {
		gapTypeSelector: { value: "PrimalGap" },
		defaultTimeDirectInput: { value: "" },
		gapLimitDirectInput: { value: "" }
	}
}));

import { CreateChart } from "../Src/Scripts/Chart/CreateChart";
import { PlotSolutionTimes } from "../Src/Scripts/Chart/ChartType/BubbleCharts";
import {
	GetRelativeTimes,
	PlotPerformanceProfile,
	PlotSolverTimes
} from "../Src/Scripts/Chart/ChartType/LineCharts";
import { PlotTerminationRelation } from "../Src/Scripts/Chart/ChartType/RadarCharts";
import { TraceData } from "../Src/Scripts/Interfaces/Interfaces";
import { At } from "./TestHelpers";

const createChart = jest.mocked(CreateChart);

beforeEach(() => {
	jest.clearAllMocks();
});

function CreatedChart(): Parameters<typeof CreateChart> {
	expect(createChart).toHaveBeenCalledTimes(1);
	return At(createChart.mock.calls, 0);
}

function Rows(rows: object[]): TraceData[] {
	return rows as unknown as TraceData[];
}

describe("PlotSolverTimes", () => {
	it("plots a point per instance and solver, without a line", () => {
		const chartData = PlotSolverTimes(
			Rows([
				{ SolverName: "A", InputFileName: "a", SolverTime: 1 },
				{ SolverName: "A", InputFileName: "b", SolverTime: 2 },
				{ SolverName: "B", InputFileName: "a", SolverTime: "NA" },
				{ SolverName: "B", InputFileName: "b", SolverTime: 4 }
			])
		);

		expect(chartData).toEqual([
			{
				label: "A",
				data: [
					{ x: "a", y: 1 },
					{ x: "b", y: 2 }
				],
				showLine: false
			},
			{ label: "B", data: [{ x: "b", y: 4 }], showLine: false }
		]);
		const [type, datasets, , title] = CreatedChart();
		expect(type).toBe("line");
		expect(datasets).toBe(chartData);
		expect(title).toBe("Solver time per Instance");
	});

	it("plots nothing for data without solvers", () => {
		expect(PlotSolverTimes([])).toEqual([]);
	});
});

describe("GetRelativeTimes", () => {
	it("divides the times by the best time of the instance among the real solvers", () => {
		const relative = GetRelativeTimes({
			A: [
				{ time: 2, InputFileName: "a" },
				{ time: 10, InputFileName: "b" }
			],
			B: [
				{ time: 4, InputFileName: "a" },
				{ time: 5, InputFileName: "b" }
			],
			"Virtual Best Solver": [
				{ time: 1, InputFileName: "a" },
				{ time: 1, InputFileName: "b" }
			]
		});

		expect(relative["A"]?.map((entry) => entry.time)).toEqual([1, 2]);
		expect(relative["B"]?.map((entry) => entry.time)).toEqual([2, 1]);
		// The virtual solvers do not count as the best time, but are made relative too.
		expect(relative["Virtual Best Solver"]?.map((entry) => entry.time)).toEqual(
			[0.5, 0.2]
		);
	});

	it("keeps the file names", () => {
		const relative = GetRelativeTimes({ A: [{ time: 3, InputFileName: "a" }] });
		expect(relative["A"]).toEqual([{ time: 1, InputFileName: "a" }]);
	});

	it("keeps a best time of 0 when a later solver is slower", () => {
		const relative = GetRelativeTimes({
			A: [{ time: 0, InputFileName: "a" }],
			B: [{ time: 5, InputFileName: "a" }]
		});

		// Without a positive best time the times cannot be divided, so they count as 1.
		// Before, the time of B replaced the 0 and A got 0 / 5 = 0.
		expect(relative["A"]?.map((entry) => entry.time)).toEqual([1]);
		expect(relative["B"]?.map((entry) => entry.time)).toEqual([1]);
	});

	it("is empty without data", () => {
		expect(GetRelativeTimes({})).toEqual({});
	});
});

describe("PlotPerformanceProfile", () => {
	const rows = Rows([
		{
			SolverName: "A",
			InputFileName: "a",
			SolverTime: 0.5,
			PrimalGap: 0,
			Fail: false
		},
		{
			SolverName: "A",
			InputFileName: "b",
			SolverTime: 3.2,
			PrimalGap: 0,
			Fail: false
		},
		{
			SolverName: "B",
			InputFileName: "a",
			SolverTime: 2,
			PrimalGap: 0,
			Fail: false
		},
		{
			SolverName: "B",
			InputFileName: "b",
			SolverTime: 6,
			PrimalGap: 0,
			Fail: false
		}
	]);

	function Profile(
		kind: string,
		defaultTime = 100,
		gapLimit = 1
	): ReturnType<typeof PlotPerformanceProfile> {
		return PlotPerformanceProfile(rows, kind, defaultTime, gapLimit);
	}

	function DataOf(
		chartData: ReturnType<typeof PlotPerformanceProfile>,
		label: string
	): { x: number; y: number }[] {
		return chartData.find((set) => set.label === label)?.data ?? [];
	}

	it("counts the solved instances over the time for the absolute profile", () => {
		const chartData = Profile("Absolute");

		expect(chartData.slice(0, 2).map((set) => set.label)).toEqual(["A", "B"]);
		// 0.5 s is in the bucket 1, 3.2 s in the bucket 4. The line goes on to the last bucket of any solver.
		expect(DataOf(chartData, "A")).toEqual([
			{ x: 1, y: 1 },
			{ x: 4, y: 2 },
			{ x: 7, y: 2 }
		]);
		expect(DataOf(chartData, "B")).toEqual([
			{ x: 3, y: 1 },
			{ x: 7, y: 2 }
		]);
	});

	it("never lets the cumulative count go down, and ends the lines of the solvers at the same time", () => {
		const chartData = Profile("Absolute");

		const ends = new Set<number | undefined>();
		for (const label of ["A", "B"]) {
			const data = DataOf(chartData, label);
			const counts = data.map((point) => point.y);
			expect(counts).toEqual([...counts].sort((a, b) => a - b));
			ends.add(data.at(-1)?.x);
		}
		expect(ends.size).toBe(1);
	});

	it("draws the absolute profile as a step line", () => {
		const [set] = Profile("Absolute");
		expect(set).toMatchObject({ showLine: true, stepped: true });
	});

	it("gives the fraction of the instances for the relative profile, ending at 1", () => {
		const chartData = Profile("Relative");

		// A is the best solver of both instances (ratio 1, bucket 2). B is 1.875 times slower on one, in the bucket 2, and 4 times slower on the other, in the bucket 5.
		expect(DataOf(chartData, "A")).toEqual([
			{ x: 2, y: 1 },
			{ x: 5, y: 1 }
		]);
		expect(DataOf(chartData, "B")).toEqual([
			{ x: 2, y: 0.5 },
			{ x: 5, y: 1 }
		]);
		expect(chartData[0]).toMatchObject({ stepped: "before" });
	});

	it("titles the chart and its axes by the kind of profile", () => {
		Profile("Relative");
		const [type, , labels, title, scales, , , subtitle] = CreatedChart();

		expect(type).toBe("line");
		expect(labels).toEqual([]);
		expect(title).toBe("Relative performance profile");
		expect(subtitle).toBe("PrimalGap <= 1% and not failed.");
		expect(scales).toMatchObject({
			x: { title: { text: "Performance Ratio" }, max: expect.any(Number) },
			y: { title: { text: "Fraction of instances solved" }, max: 1 }
		});
	});

	it("limits the time axis to the default time plus 10 for the absolute profile", () => {
		Profile("Absolute", 300);
		const [, , , title, scales] = CreatedChart();

		expect(title).toBe("Absolute performance profile");
		expect(scales).toMatchObject({
			x: { title: { text: "SolverTime [s]" }, max: 310 },
			y: { title: { text: "Number of instances" } }
		});
	});

	it("limits the ratio axis to 10 at most", () => {
		Profile("Relative");
		const [, , , , scales] = CreatedChart();

		expect((scales as { x: { max: number } }).x.max).toBeLessThanOrEqual(10);
	});
});

describe("PlotSolutionTimes", () => {
	it("makes a bubble per instance, with the radius from the solver time", () => {
		const chartData = PlotSolutionTimes(
			Rows([
				{
					SolverName: "A",
					NumberOfVariables: 10,
					NumberOfEquations: 20,
					SolverTime: 250
				},
				{
					SolverName: "A",
					NumberOfVariables: 30,
					NumberOfEquations: 40,
					SolverTime: 100
				},
				{ SolverName: "B", NumberOfVariables: 5, NumberOfEquations: 6 }
			])
		);

		expect(chartData).toEqual([
			{
				label: "A",
				clip: 1,
				data: [
					{ x: 10, y: 20, r: 2.5, solverTime: 250 },
					{ x: 30, y: 40, r: 1, solverTime: 100 }
				]
			},
			{
				label: "B",
				clip: 1,
				data: [{ x: 5, y: 6, r: 0, solverTime: 0 }]
			}
		]);
		const [type, datasets, , title, scales] = CreatedChart();
		expect(type).toBe("bubble");
		expect(datasets).toBe(chartData);
		expect(title).toBe("Solution time");
		expect(scales).toMatchObject({
			x: { title: { text: "Number Of Variables" } },
			y: { title: { text: "Number Of Equations" } }
		});
	});

	it("plots nothing for data without solvers", () => {
		expect(PlotSolutionTimes([])).toEqual([]);
	});
});

describe("PlotTerminationRelation", () => {
	it("has a data set per status, with a value for every solver", () => {
		const chartData = PlotTerminationRelation(
			Rows([
				{ SolverName: "A", SolverStatus: "Normal Completion" },
				{ SolverName: "A", SolverStatus: "Normal Completion" },
				{ SolverName: "B", SolverStatus: "Resource Interrupt" }
			]),
			"SolverStatus",
			"Terminations"
		);

		expect(chartData).toEqual([
			{ label: "Normal Completion", data: [2, 0] },
			{ label: "Resource Interrupt", data: [0, 1] }
		]);
		const [type, datasets, labels, title, scales, zoom] = CreatedChart();
		expect(type).toBe("radar");
		expect(datasets).toBe(chartData);
		expect(labels).toEqual(["A", "B"]);
		expect(title).toBe("Terminations");
		expect(scales).toBeUndefined();
		expect(zoom).toBeUndefined();
	});
});
