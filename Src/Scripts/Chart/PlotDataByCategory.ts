import { viewPlotsButton, saveLocalStorageButton } from "../Elements/Elements";
import {
	AnalyzeDataByCategory,
	ExtractStatusMessages,
	ExtractAllSolverTimes,
	ExtractAllSolverTimesNoFailedAndGapBelow1Percent
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
		saveLocalStorageButton.disabled = false;
	});
}

/**
 * Prepares and plots all the termination status messages per solver.
 * 
 * @param traceData - Array of objects containing the data to be analyzed and plotted.
 * @param type - The type of the chart to be created (e.g., 'line', 'bar', 'pie').
 * @param title - The title of the chart.
 */
export function PlotStatusMessages(
	traceData: object[],
	type: string,
	title: string
): void {
	viewPlotsButton.disabled = false;
	viewPlotsButton.addEventListener("click", () => {
		const data = ExtractStatusMessages(traceData);
		const solverNames = data.map((obj) => obj["SolverName"]);
		const statusKeys = Object.keys(data[0]).filter(
			(key) => key !== "SolverName"
		);

		console.log("Data for extracted messages: ", data);
		const colors = PickColor(20);

		const chartData = statusKeys.map((key, index) => ({
			label: key,
			data: data.map((obj) => obj[key] || 0),
			borderColor: colors[index % colors.length],
			backgroundColor: colors[index % colors.length],
			stack: "Stack 0"
		}));

		CreateChart(type, chartData, solverNames, title);
		saveLocalStorageButton.disabled = false;
	});
}

/**
 * Prepares and plots all the solver times without any failed results.
 *
 * @param traceData - Array of objects containing the data to be analyzed and plotted.
 */
export function PlotAllSolverTimes(traceData: object[]): void {
	viewPlotsButton.disabled = false;
	saveLocalStorageButton.disabled = false;
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

/**
 * Prepares and plots the absolute performance profile of solver time, where the instances have a primal gap <= 1.0% and not failed.
 *
 * @param traceData - Array of objects containing the data to be analyzed and plotted.
 */
export function PlotAbsolutePerformanceProfileSolverTimes(
	traceData: object[]
): void {
	viewPlotsButton.disabled = false;
	viewPlotsButton.addEventListener("click", () => {
		const absolutePerformanceProfileSolverTimes =
			ExtractAllSolverTimesNoFailedAndGapBelow1Percent(traceData);
		console.log("Data: ", absolutePerformanceProfileSolverTimes);

		const allLabels = [];
		const allXValues: string[] = [];

		const data = (
			Object.entries(absolutePerformanceProfileSolverTimes) as [
				string,
				{ time: number; InputFileName: string }[]
			][]
		).map(([key, values]) => {
			const bucketCounts: { [key: number]: number } = {};
			const uniqueKeys: number[] = [];

			// Group times into buckets.
			values.forEach(({ time }) => {
				let bucket: number;

				if (time < 0.1) bucket = 0.1;
				else if (time < 1) bucket = 1;
				else bucket = Math.floor(time) + 1;

				if (!bucketCounts[bucket]) {
					bucketCounts[bucket] = 0;
					uniqueKeys.push(bucket);
				}
				bucketCounts[bucket]++;
			});

			uniqueKeys.sort(((a: number, b: number) => a - b));

			let cumulativeCount = 0;
			const cumulativeCounts: { x: string; y: number }[] = [];

			// Create cumulative counts.
			uniqueKeys.forEach((key) => {
				cumulativeCount += bucketCounts[key];
				const label = `${key}s`;
				cumulativeCounts.push({ x: label, y: cumulativeCount });
			});

			return {
				label: key,
				data: cumulativeCounts,
				showLine: true
			};
		});

		// Update all labels.
		data.forEach((dataset) => {
			dataset.data.forEach((point) => {
				if (!allLabels.includes(point.x)) {
					allLabels.push(point.x);
				}
			});
		});

		/**
		 * Sorts the datasets based on the available labels.
		 * @returns An array of sorted datasets.
		 */
		const sortedDataSets = data.map((dataset) => {
			const sortedData = allLabels.map((label) => {
				const point = dataset.data.find((d) => d.x === label);
				return point || { x: label, y: null };
			});
			return { ...dataset, data: sortedData };
		});

		// Update all X axis values.
		sortedDataSets.forEach((dataset) => {
			dataset.data.forEach((point) => {
				if (!allXValues.includes(point.x)) {
					allXValues.push(point.x);
				}
			});
		});

		// Sort all X axis values.
		allXValues.sort((a, b) => parseFloat(a) - parseFloat(b));

		CreateChart(
			"line",
			sortedDataSets,
			allXValues,
			"Absolute performance profile (primal gap <= 1.0% and not failed)"
		);
	});
}
