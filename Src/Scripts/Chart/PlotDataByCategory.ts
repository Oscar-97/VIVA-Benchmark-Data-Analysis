import { viewPlotsButton } from "../Elements/Elements";
import {
	AnalyzeDataByCategory,
	ExtractAllSolverTimes
} from "../DataProcessing/CalculateResults";
import { PickColor, CreateChart } from "./CreateChart";
import { StatisticsTable } from "../DataTable/DataTableBase";

/**
 * Plot by result category
 * @param traceData Current TrcData.
 * @param type Type of plot.
 * @param category Name of the category.
 * @param label Label for the plot.
 * @param title Title for the plot.
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
 * Plot all the solver times without any failed results.
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
