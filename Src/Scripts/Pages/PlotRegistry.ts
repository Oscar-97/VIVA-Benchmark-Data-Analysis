import { state } from "../App/AppState";
import {
	PlotDataByCategory,
	PlotFailCount,
	PlotStatusMessages
} from "../Chart/ChartType/BarCharts";
import {
	PlotPerformanceProfile,
	PlotSolverTimes
} from "../Chart/ChartType/LineCharts";
import { PlotSolutionTimes } from "../Chart/ChartType/BubbleCharts";
import { PlotTerminationRelation } from "../Chart/ChartType/RadarCharts";
import {
	categorySelector,
	chartTypeSelector,
	defaultTimeDirectInput,
	filterTypeSelector,
	gapLimitDirectInput,
	performanceProfileSelector,
	statusSelector
} from "../Elements/Elements";
import { PageTitles } from "../Constants/PageTitles";
import { TraceHeaderMap } from "../Constants/TraceHeaders";
import { TraceData } from "../Interfaces/Interfaces";

/**
 * Plots the chart of a plot page and returns the data that was plotted.
 */
export type PlotFunction = (traceData: TraceData[]) => object[];

function PlotPerformanceProfilePage(traceData: TraceData[]): object[] {
	state.defaultTime = Number(defaultTimeDirectInput.value);
	state.gapLimit = Number(gapLimitDirectInput.value);

	return PlotPerformanceProfile(
		traceData,
		performanceProfileSelector.value,
		state.defaultTime,
		state.gapLimit
	);
}

function PlotSolverTimePerSolverPage(traceData: TraceData[]): object[] {
	const filterType = filterTypeSelector.value;
	return PlotDataByCategory(
		traceData,
		"SolverTime",
		"Average, min, max and std for solver time",
		state.defaultTime,
		filterType,
		`${state.defaultTime} is set as default time for NaN values.`
	);
}

function PlotSolverTimePage(traceData: TraceData[]): object[] {
	return PlotSolverTimes(traceData);
}

function PlotNumberOfNodesPage(traceData: TraceData[]): object[] {
	return PlotDataByCategory(
		traceData,
		"NumberOfNodes",
		"Average, min, max and std for number of nodes"
	);
}

function PlotNumberOfIterationsPage(traceData: TraceData[]): object[] {
	return PlotDataByCategory(
		traceData,
		"NumberOfIterations",
		"Average, min, max and std for number of iterations"
	);
}

function PlotTerminationStatusPage(traceData: TraceData[]): object[] {
	const statusType = statusSelector.value;
	const chartType = chartTypeSelector.value;

	statusSelector.addEventListener("change", () => {
		if (statusSelector.value === "Fail") {
			chartTypeSelector.value = "Bar";
			chartTypeSelector.disabled = true;
		} else {
			chartTypeSelector.disabled = false;
		}
	});

	chartTypeSelector.addEventListener("change", () => {
		if (
			chartTypeSelector.value === "Radar" &&
			statusSelector.value === "Fail"
		) {
			chartTypeSelector.value = "Bar";
			chartTypeSelector.disabled = true;
		}
	});

	const type = statusType === "SolverStatus" ? "solver" : "model";
	if (chartType === "Bar") {
		if (statusType === "Fail") {
			return PlotFailCount(traceData);
		}
		return PlotStatusMessages(
			traceData,
			statusType,
			`Termination count for ${type} status per solver`
		);
	}
	return PlotTerminationRelation(
		traceData,
		statusType,
		`Distribution of ${type} terminations between solvers`
	);
}

function PlotSolutionQualityPage(traceData: TraceData[]): object[] {
	const category = categorySelector.value;
	const categoryTitle = TraceHeaderMap[category as keyof typeof TraceHeaderMap];
	return PlotDataByCategory(
		traceData,
		category,
		`Average, min, max and std for ${categoryTitle}`,
		undefined,
		undefined,
		"Infinite and NaN values are excluded from the calculations."
	);
}

function PlotSolutionTimePage(traceData: TraceData[]): object[] {
	return PlotSolutionTimes(traceData);
}

/**
 * The plot function of each plot page, by page title.
 */
const plotRegistry: Partial<Record<string, PlotFunction>> = {
	[PageTitles.PERFORMANCE_PROFILE]: PlotPerformanceProfilePage,
	[PageTitles.SOLVER_TIME_PER_SOLVER]: PlotSolverTimePerSolverPage,
	[PageTitles.SOLVER_TIME]: PlotSolverTimePage,
	[PageTitles.NUMBER_OF_NODES]: PlotNumberOfNodesPage,
	[PageTitles.NUMBER_OF_ITERATIONS]: PlotNumberOfIterationsPage,
	[PageTitles.TERMINATION_STATUS]: PlotTerminationStatusPage,
	[PageTitles.SOLUTION_QUALITY]: PlotSolutionQualityPage,
	[PageTitles.SOLUTION_TIME]: PlotSolutionTimePage
};

/**
 * Gets the function that plots the chart of the page with the given title.
 *
 * @param title - The page title. Defaults to the title of the current document.
 * @returns The plot function, or undefined if the page does not have a chart.
 */
export function GetPlotFunction(
	title: string = document.title
): PlotFunction | undefined {
	return plotRegistry[title];
}
