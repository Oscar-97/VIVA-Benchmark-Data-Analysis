jest.mock("../Src/Scripts/Chart/CreateChart", () => ({
	CreateChart: jest.fn()
}));
jest.mock("../Src/Scripts/DataTable/DataTableBase", () => ({
	StatisticsTable: jest.fn()
}));
jest.mock("../Src/Scripts/DataTable/DataTableWrapper", () => ({
	DataTablesConfigurationStats: jest.fn()
}));
jest.mock("../Src/Scripts/Elements/Elements", () => ({
	elements: {}
}));

import { CreateChart } from "../Src/Scripts/Chart/CreateChart";
import {
	PlotDataByCategory,
	PlotFailCount,
	PlotStatusMessages
} from "../Src/Scripts/Chart/ChartType/BarCharts";
import { StatisticsTable } from "../Src/Scripts/DataTable/DataTableBase";
import { DataTablesConfigurationStats } from "../Src/Scripts/DataTable/DataTableWrapper";
import { TraceData } from "../Src/Scripts/Interfaces/Interfaces";
import { At } from "./TestHelpers";

const createChart = jest.mocked(CreateChart);

beforeEach(() => {
	jest.clearAllMocks();
});

/** The arguments of the one chart that was created. */
function CreatedChart(): Parameters<typeof CreateChart> {
	expect(createChart).toHaveBeenCalledTimes(1);
	return At(createChart.mock.calls, 0);
}

describe("PlotDataByCategory", () => {
	const traceData = [
		{ SolverName: "A", NumberOfNodes: 2 },
		{ SolverName: "A", NumberOfNodes: 4 },
		{ SolverName: "B", NumberOfNodes: 10 }
	] as unknown as TraceData[];

	it("plots the average, min, max and std of every solver as bars", () => {
		const chartData = PlotDataByCategory(traceData, "NumberOfNodes", "Nodes");

		expect(chartData.map((set) => set.label)).toEqual([
			"Average",
			"Min",
			"Max",
			"Std"
		]);
		expect(At(chartData, 0).data).toEqual([3, 10]);
		expect(At(chartData, 1).data).toEqual([2, 10]);
		expect(At(chartData, 2).data).toEqual([4, 10]);
		expect(At(chartData, 3).data).toEqual([1.414214, 0]);

		const [type, datasets, labels, title] = CreatedChart();
		expect(type).toBe("bar");
		expect(datasets).toBe(chartData);
		expect(labels).toEqual(["A", "B"]);
		expect(title).toBe("Nodes");
	});

	it("gives every data set its own color", () => {
		const chartData = PlotDataByCategory(traceData, "NumberOfNodes", "Nodes");
		const colors = chartData.map((set) => set.borderColor);
		expect(new Set(colors).size).toBe(colors.length);
	});

	it("shows the statistics in a table with the same title", () => {
		PlotDataByCategory(traceData, "NumberOfNodes", "Nodes");

		expect(StatisticsTable).toHaveBeenCalledWith(
			expect.objectContaining({ A: expect.any(Object), B: expect.any(Object) }),
			"Nodes"
		);
		expect(DataTablesConfigurationStats).toHaveBeenCalledWith(
			"#statisticsTable_inner"
		);
	});

	it("passes the subtitle on", () => {
		PlotDataByCategory(
			traceData,
			"NumberOfNodes",
			"Nodes",
			undefined,
			undefined,
			"A subtitle"
		);

		expect(At(CreatedChart(), 7)).toBe("A subtitle");
	});

	it("has no annotations for a category other than the solver time", () => {
		PlotDataByCategory(traceData, "NumberOfNodes", "Nodes");

		expect(CreatedChart()[6]).toBeUndefined();
	});

	describe("for the solver time", () => {
		const times = [
			{ SolverName: "A", InputFileName: "a", SolverTime: 1, Fail: false },
			{ SolverName: "A", InputFileName: "b", SolverTime: 3, Fail: false },
			{ SolverName: "B", InputFileName: "a", SolverTime: 2, Fail: false },
			{ SolverName: "B", InputFileName: "b", SolverTime: 6, Fail: false }
		] as unknown as TraceData[];

		it("draws the virtual solvers as lines, not as bars", () => {
			const chartData = PlotDataByCategory(times, "SolverTime", "Times", 100);
			const [, , labels, , , , annotations] = CreatedChart();

			expect(labels).toEqual(["A", "B"]);
			expect(At(chartData, 0).data).toHaveLength(2);
			const lines = Object.values(
				(annotations as { annotations: Record<string, { yMin: number }> })
					.annotations
			);
			expect(lines).toHaveLength(2);
			// The best time per instance is 1 and 3, the worst 2 and 6.
			expect(At(lines, 0).yMin).toBe(2);
			expect(At(lines, 1).yMin).toBe(4);
		});
	});

	it("plots nothing for data without solvers", () => {
		const chartData = PlotDataByCategory([], "NumberOfNodes", "Nodes");

		for (const set of chartData) {
			expect(set.data).toEqual([]);
		}
		expect(At(CreatedChart(), 2)).toEqual([]);
	});
});

describe("PlotStatusMessages", () => {
	const traceData = [
		{ SolverName: "A", ModelStatus: "Infeasible" },
		{ SolverName: "A", ModelStatus: "Infeasible" },
		{ SolverName: "B", ModelStatus: "Optimal" },
		{ SolverName: "B", ModelStatus: "Strange" }
	] as unknown as TraceData[];

	it("has a data set per status, with the count of every solver", () => {
		const chartData = PlotStatusMessages(traceData, "ModelStatus", "Status");

		expect(chartData.map((set) => [set.label, set.data])).toEqual([
			["Infeasible", [2, 0]],
			["Optimal", [0, 1]],
			["Strange", [0, 1]]
		]);
		const [type, datasets, labels, title] = CreatedChart();
		expect(type).toBe("bar");
		expect(datasets).toBe(chartData);
		expect(labels).toEqual(["A", "B"]);
		expect(title).toBe("Status");
	});

	it("colors the known statuses, and gives an unknown one the default color", () => {
		const chartData = PlotStatusMessages(traceData, "ModelStatus", "Status");

		expect(At(chartData, 0).backgroundColor).toBe("#05055c");
		expect(At(chartData, 1).backgroundColor).toBe("#d5fa87");
		expect(At(chartData, 2).backgroundColor).toBe("rgba(0, 0, 0, 0.1)");
	});

	it("plots nothing for data without solvers", () => {
		expect(PlotStatusMessages([], "ModelStatus", "Status")).toEqual([]);
	});
});

describe("PlotFailCount", () => {
	it("plots the number of failed instances of every solver", () => {
		const chartData = PlotFailCount([
			{ SolverName: "A", Fail: true },
			{ SolverName: "A", Fail: true },
			{ SolverName: "B", Fail: false }
		]);

		expect(chartData).toEqual([
			{
				label: "Failed",
				data: [2, 0],
				borderColor: "#f5a2a3",
				backgroundColor: "#f5a2a3"
			}
		]);
		const [type, , labels, title] = CreatedChart();
		expect(type).toBe("bar");
		expect(labels).toEqual(["A", "B"]);
		expect(title).toBe("Number of failed instances");
	});
});
