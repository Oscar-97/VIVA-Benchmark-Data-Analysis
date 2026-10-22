const selectors = {
	defaultTimeDirectInput: { value: "1200" },
	gapLimitDirectInput: { value: "0.05" },
	performanceProfileSelector: { value: "PrimalGap" },
	filterTypeSelector: { value: "None" },
	statusSelector: { value: "ModelStatus", disabled: false },
	chartTypeSelector: { value: "Bar", disabled: false },
	categorySelector: { value: "ObjectiveValue" },
	saveLocalStorageButton: { id: "save" },
	deleteLocalStorageButton: { disabled: true },
	downloadConfigurationButtonLayer: { disabled: true }
};

jest.mock("../Src/Scripts/Elements/Elements", () => ({
	elements: selectors
}));

const listeners: {
	target: unknown;
	type: string;
	handler: () => void;
}[] = [];

jest.mock("../Src/Scripts/App/PageListeners", () => ({
	Listen: (target: unknown, type: string, handler: () => void): void => {
		listeners.push({ target, type, handler });
	}
}));

jest.mock("../Src/Scripts/Chart/ChartType/BarCharts", () => ({
	PlotDataByCategory: jest.fn(() => [{ chart: "category" }]),
	PlotFailCount: jest.fn(() => [{ chart: "fail" }]),
	PlotStatusMessages: jest.fn(() => [{ chart: "status" }])
}));
jest.mock("../Src/Scripts/Chart/ChartType/LineCharts", () => ({
	PlotPerformanceProfile: jest.fn(() => [{ chart: "profile" }]),
	PlotSolverTimes: jest.fn(() => [{ chart: "times" }])
}));
jest.mock("../Src/Scripts/Chart/ChartType/BubbleCharts", () => ({
	PlotSolutionTimes: jest.fn(() => [{ chart: "bubble" }])
}));
jest.mock("../Src/Scripts/Chart/ChartType/RadarCharts", () => ({
	PlotTerminationRelation: jest.fn(() => [{ chart: "radar" }])
}));
jest.mock("../Src/Scripts/UserConfiguration/UserConfiguration", () => ({
	CreateUserConfiguration: jest.fn()
}));

import { state } from "../Src/Scripts/App/AppState";
import {
	PlotDataByCategory,
	PlotFailCount,
	PlotStatusMessages
} from "../Src/Scripts/Chart/ChartType/BarCharts";
import { PlotPerformanceProfile } from "../Src/Scripts/Chart/ChartType/LineCharts";
import { PlotTerminationRelation } from "../Src/Scripts/Chart/ChartType/RadarCharts";
import { PageTitles } from "../Src/Scripts/Constants/PageTitles";
import { Keys } from "../Src/Scripts/Constants/Keys";
import { GetPlotFunction } from "../Src/Scripts/Pages/PlotRegistry";
import { RegisterSaveToLocalStorage } from "../Src/Scripts/Pages/SaveToLocalStorage";
import { CreateUserConfiguration } from "../Src/Scripts/UserConfiguration/UserConfiguration";
import { TraceData } from "../Src/Scripts/Interfaces/Interfaces";
import { At } from "./TestHelpers";

const traceData: TraceData[] = [{ SolverName: "A" }];

beforeEach(() => {
	jest.clearAllMocks();
	listeners.length = 0;
	selectors.statusSelector.value = "ModelStatus";
	selectors.chartTypeSelector.value = "Bar";
	selectors.chartTypeSelector.disabled = false;
	state.defaultTime = undefined;
	state.gapLimit = undefined;
});

describe("GetPlotFunction", () => {
	it("has a plot function for every plot page", () => {
		const titles = [
			PageTitles.PERFORMANCE_PROFILE,
			PageTitles.SOLVER_TIME_PER_SOLVER,
			PageTitles.SOLVER_TIME,
			PageTitles.NUMBER_OF_NODES,
			PageTitles.NUMBER_OF_ITERATIONS,
			PageTitles.TERMINATION_STATUS,
			PageTitles.SOLUTION_QUALITY,
			PageTitles.SOLUTION_TIME
		];
		for (const title of titles) {
			expect(GetPlotFunction(title)).toBeInstanceOf(Function);
		}
	});

	it("has none for a page without a chart", () => {
		expect(GetPlotFunction("Report")).toBeUndefined();
		expect(GetPlotFunction("")).toBeUndefined();
	});

	it("returns the data that was plotted", () => {
		const plot = GetPlotFunction(PageTitles.NUMBER_OF_NODES);
		expect(plot?.(traceData)).toEqual([{ chart: "category" }]);
		expect(PlotDataByCategory).toHaveBeenCalledWith(
			traceData,
			"NumberOfNodes",
			expect.stringContaining("number of nodes")
		);
	});
});

describe("the performance profile page", () => {
	it("reads the default time and the gap limit from the inputs into the state", () => {
		GetPlotFunction(PageTitles.PERFORMANCE_PROFILE)?.(traceData);

		expect(state.defaultTime).toBe(1200);
		expect(state.gapLimit).toBe(0.05);
		expect(PlotPerformanceProfile).toHaveBeenCalledWith(
			traceData,
			"PrimalGap",
			1200,
			0.05
		);
	});
});

describe("the solution quality page", () => {
	it("plots the selected category with its title", () => {
		GetPlotFunction(PageTitles.SOLUTION_QUALITY)?.(traceData);

		expect(PlotDataByCategory).toHaveBeenCalledWith(
			traceData,
			"ObjectiveValue",
			expect.stringContaining("Average, min, max and std for"),
			undefined,
			undefined,
			expect.stringContaining("excluded")
		);
	});
});

describe("the termination status page", () => {
	const plot = (): object[] | undefined =>
		GetPlotFunction(PageTitles.TERMINATION_STATUS)?.(traceData);

	it("counts the model statuses in a bar chart", () => {
		plot();
		expect(PlotStatusMessages).toHaveBeenCalledWith(
			traceData,
			"ModelStatus",
			expect.stringContaining("model")
		);
	});

	it("counts the solver statuses in a bar chart", () => {
		selectors.statusSelector.value = "SolverStatus";
		plot();
		expect(PlotStatusMessages).toHaveBeenCalledWith(
			traceData,
			"SolverStatus",
			expect.stringContaining("solver")
		);
	});

	it("counts the failed instances for the fail status", () => {
		selectors.statusSelector.value = "Fail";
		expect(plot()).toEqual([{ chart: "fail" }]);
		expect(PlotFailCount).toHaveBeenCalledWith(traceData);
	});

	it("draws the relation between the solvers in a radar chart", () => {
		selectors.chartTypeSelector.value = "Radar";
		expect(plot()).toEqual([{ chart: "radar" }]);
		expect(PlotTerminationRelation).toHaveBeenCalledWith(
			traceData,
			"ModelStatus",
			expect.stringContaining("model")
		);
	});

	it("allows only a bar chart for the fail status", () => {
		plot();
		const statusChange = listeners.find(
			(listener) => listener.target === selectors.statusSelector
		);

		selectors.statusSelector.value = "Fail";
		selectors.chartTypeSelector.value = "Radar";
		statusChange?.handler();
		expect(selectors.chartTypeSelector.value).toBe("Bar");
		expect(selectors.chartTypeSelector.disabled).toBe(true);

		selectors.statusSelector.value = "ModelStatus";
		statusChange?.handler();
		expect(selectors.chartTypeSelector.disabled).toBe(false);
	});

	it("goes back to a bar chart when radar is chosen for the fail status", () => {
		plot();
		const chartChange = listeners.find(
			(listener) => listener.target === selectors.chartTypeSelector
		);

		selectors.statusSelector.value = "Fail";
		selectors.chartTypeSelector.value = "Radar";
		chartChange?.handler();
		expect(selectors.chartTypeSelector.value).toBe("Bar");
		expect(selectors.chartTypeSelector.disabled).toBe(true);
	});

	it("keeps the radar chart for the other statuses", () => {
		plot();
		const chartChange = listeners.find(
			(listener) => listener.target === selectors.chartTypeSelector
		);

		selectors.chartTypeSelector.value = "Radar";
		chartChange?.handler();
		expect(selectors.chartTypeSelector.value).toBe("Radar");
		expect(selectors.chartTypeSelector.disabled).toBe(false);
	});
});

describe("RegisterSaveToLocalStorage", () => {
	const session = new Map<string, string>();

	beforeEach(() => {
		session.clear();
		Object.defineProperty(globalThis, "sessionStorage", {
			value: {
				setItem: (key: string, value: string): void => {
					session.set(key, value);
				}
			},
			configurable: true
		});
		selectors.deleteLocalStorageButton.disabled = true;
		selectors.downloadConfigurationButtonLayer.disabled = true;
	});

	function Click(): void {
		const listener = At(listeners, 0);
		expect(listener.target).toBe(selectors.saveLocalStorageButton);
		expect(listener.type).toBe("click");
		listener.handler();
	}

	it("stores the data and enables the buttons that use it", () => {
		state.dataFileType = "json";
		RegisterSaveToLocalStorage(() => ["a", "b"]);

		Click();

		expect(CreateUserConfiguration).toHaveBeenCalledWith(["a", "b"], "json");
		expect(selectors.deleteLocalStorageButton.disabled).toBe(false);
		expect(selectors.downloadConfigurationButtonLayer.disabled).toBe(false);
		expect(session.get(Keys.ALERTED_STORAGE)).toBe("true");
	});

	it("stores a freshly loaded trace file as json", () => {
		state.dataFileType = "trc";
		RegisterSaveToLocalStorage(() => ["a"]);

		Click();

		expect(state.dataFileType).toBe("json");
		expect(CreateUserConfiguration).toHaveBeenCalledWith(["a"], "json");
	});

	it("reads the data when the button is clicked, not when it is registered", () => {
		const getRawData = jest.fn(() => ["a"]);
		RegisterSaveToLocalStorage(getRawData);
		expect(getRawData).not.toHaveBeenCalled();

		Click();

		expect(getRawData).toHaveBeenCalledTimes(1);
	});
});
