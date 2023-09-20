import { viewPlotsButton, saveLocalStorageButton } from "../Elements/Elements";
import {
	AnalyzeDataByCategory,
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
 * Prepares and plots the absolute performance profile of solver time.
 * 
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

		const sortNumbers = (a: number, b: number) => a - b;

		const data = (
			Object.entries(absolutePerformanceProfileSolverTimes) as [
				string,
				{ time: number; InputFileName: string }[]
			][]
		).map(([key, values]) => {
			const bucketCounts: { [key: number]: number } = {};
			const uniqueKeys: number[] = [];

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

			uniqueKeys.sort(sortNumbers);

			let cumulativeCount = 0;
			const cumulativeCounts: { x: string; y: number }[] = [];

			uniqueKeys.forEach((key) => {
				cumulativeCount += bucketCounts[key];
				const label = `Up to ${key}s`;
				cumulativeCounts.push({ x: label, y: cumulativeCount });
			});

			return {
				label: key,
				data: cumulativeCounts,
				showLine: true
			};
		});

		const allLabels = [];

		data.forEach((dataset) => {
			dataset.data.forEach((point) => {
				if (!allLabels.includes(point.x)) {
					allLabels.push(point.x);
				}
			});
		});

		const sortedDataSets = data.map((dataset) => {
			const sortedData = allLabels.map((label) => {
				const point = dataset.data.find((d) => d.x === label);
				return point || { x: label, y: null };
			});
			return { ...dataset, data: sortedData };
		});

		const allXValues: string[] = [];
		sortedDataSets.forEach((dataset) => {
			dataset.data.forEach((point) => {
				if (!allXValues.includes(point.x)) {
					allXValues.push(point.x);
				}
			});
		});
		allXValues.sort(
			(a, b) => parseFloat(a.split(" ")[2]) - parseFloat(b.split(" ")[2])
		);

		console.log("Sorted data: ", sortedDataSets);
		CreateChart(
			"line",
			sortedDataSets,
			allXValues,
			"Absolute performance profile (number of instances with a primal gap <= 1.0% and not failed)"
		);
	});
}
