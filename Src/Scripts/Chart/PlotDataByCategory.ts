import { viewPlotsButton } from "../Elements/Elements";
import {
	AnalyzeDataByCategory,
	ExtractAllSolverTimes
} from "../DataProcessing/CalculateResults";
import { PickColor, CreateChart } from "./CreateChart";
import { StatisticsTable } from "../DataTable/DataTableBase";

/**
 * Prepares and plots data by a specific category.
 *
 * @param traceData - Array of objects containing the data to be analyzed and plotted.
 * @param type - The type of the chart to be created (e.g., 'line', 'bar', 'pie').
 * @param category - The category by which the data should be analyzed.
 * @param label - The label for the data.
 * @param title - The title of the chart.
 */
export function PlotDataByCategory(
	traceData: object[],
	type: string,
	category: string,
	label: string,
	title: string
): void {
	viewPlotsButton.disabled = false;
	viewPlotsButton.addEventListener("click", () => {
		const data = AnalyzeDataByCategory(traceData, category);
		console.log("Data for category", category, ": ", data);

		const colors = PickColor(20);
		const chartData = Object.entries(data).map(([key, value], index) => ({
			label: key,
			data: [value.average],
			borderColor: colors[index % colors.length],
			backgroundColor: colors[index % colors.length]
		}));

		console.log("Data for chart", label, ": ", chartData);
		CreateChart(type, chartData, label, title);
		StatisticsTable(data, title);
	});
}

/**
 * Prepares and plots all the solver times without any failed results.
 *
 * @param traceData - Array of objects containing the data to be analyzed and plotted.
 */
export function PlotAllSolverTimes(traceData: object[]): void {
	viewPlotsButton.disabled = false;
	viewPlotsButton.addEventListener("click", () => {
		const solverTimes = ExtractAllSolverTimes(traceData);
		const data = (
			Object.entries(solverTimes) as [
				string,
				{ time: number; InputFileName: string }[]
			][]
		).map(([key, values]) => ({
			label: key,
			data: values.map(({ time, InputFileName: inputFileName }) => ({
				x: inputFileName,
				y: time
			})),
			showLine: false
		}));

		CreateChart("line", data, "InputFileName", "Solver times");
	});
}
