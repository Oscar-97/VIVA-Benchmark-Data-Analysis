import {
	AnalyzeDataByCategory,
	ExtractStatusMessages,
	ExtractAllSolverTimes,
	ExtractAllSolverTimesNoFailedAndGapBelow1Percent
} from "../DataProcessing/CalculateResults";
import { PickColor, CreateChart } from "./CreateChart";
import { StatisticsTable } from "../DataTable/DataTableBase";
import { gapTypeSelector } from "../Elements/Elements";

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
): {
	label: string;
	data: number[];
	borderColor: string;
	backgroundColor: string;
}[] {
	const data = AnalyzeDataByCategory(traceData, category);
	const colors = PickColor(20);
	const chartData = Object.entries(data).map(([key, value], index) => {
		return {
			label: key,
			data: [value.average],
			borderColor: colors[index % colors.length],
			backgroundColor: colors[index % colors.length]
		};
	});

	CreateChart(type, chartData, label, title);
	StatisticsTable(data, title);
	return chartData;
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
): {
	label: string;
	data: object[];
	borderColor: string;
	backgroundColor: string;
	stack: string;
}[] {
	const data = ExtractStatusMessages(traceData);
	const solverNames = data.map((obj) => {
		return obj["SolverName"];
	});
	const statusKeys = Object.keys(data[0]).filter((key) => {
		return key !== "SolverName";
	});
	const colors = PickColor(20);
	const chartData = statusKeys.map((key, index) => {
		return {
			label: key,
			data: data.map((obj) => {
				return obj[key] || 0;
			}),
			borderColor: colors[index % colors.length],
			backgroundColor: colors[index % colors.length],
			stack: "Stack 0"
		};
	});

	CreateChart(type, chartData, solverNames, title);
	return chartData;
}

/**
 * Prepares and plots all the solver times without any failed results.
 *
 * @param traceData - Array of objects containing the data to be analyzed and plotted.
 */
export function PlotAllSolverTimes(
	traceData: object[]
): { label: string; data: { x: string; y: number }[]; showLine: boolean }[] {
	const solverTimes = ExtractAllSolverTimes(traceData);
	const chartData = (
		Object.entries(solverTimes) as [
			string,
			{ time: number; InputFileName: string }[]
		][]
	).map(([key, values]) => {
		return {
			label: key,
			data: values.map(({ time, InputFileName: inputFileName }) => {
				return {
					x: inputFileName,
					y: time
				};
			}),
			showLine: false
		};
	});

	const scaleOptions = {
		x: {
			title: {
				display: true,
				text: "Instance name"
			}
		},
		y: {
			title: {
				display: true,
				text: "SolverTime [s]"
			}
		}
	};

	CreateChart("line", chartData, "InputFileName", "Solver times", scaleOptions);
	return chartData;
}

/**
 * Prepares and plots the absolute performance profile of solver time, where the instances have a gap <= 1.0% and not failed.
 *
 * @param traceData - Array of objects containing the data to be analyzed and plotted.
 */
export function PlotAbsolutePerformanceProfileSolverTimes(
	traceData: object[],
	defaultTime?: number | undefined,
	gapLimit?: number | undefined
): {
	data: ({ x: string; y: number } | { x: number; y: number })[];
	label: string;
	showLine: boolean;
}[] {
	const selectedGapType = gapTypeSelector.value;
	const absolutePerformanceProfileSolverTimes =
		ExtractAllSolverTimesNoFailedAndGapBelow1Percent(
			traceData,
			selectedGapType,
			defaultTime,
			gapLimit
		);
	const allLabels = [];
	const allXValues: number[] = [];
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

		uniqueKeys.sort((a: number, b: number) => {
			return a - b;
		});

		let cumulativeCount = 0;
		const cumulativeCounts: { x: number; y: number }[] = [];

		// Create cumulative counts.
		uniqueKeys.forEach((key) => {
			cumulativeCount += bucketCounts[key];
			cumulativeCounts.push({ x: key, y: cumulativeCount });
		});

		return {
			label: key,
			data: cumulativeCounts,
			showLine: true,
			spanGaps: true,
			stepped: true
		};
	});

	const chartData = data.map((dataset) => {
		// Update all labels with unique x values.
		dataset.data.forEach((point) => {
			if (!allLabels.includes(point.x)) {
				allLabels.push(point.x);
			}
		});

		// Sort the data based on the labels.
		const sortedData = allLabels
			.map((label) => {
				const point = dataset.data.find((d) => {
					return d.x === label;
				});
				return point || { x: label, y: null };
			})
			.sort((a, b) => {
				return parseFloat(a.x) - parseFloat(b.x);
			});

		// Update all X axis values from the sorted data.
		sortedData.forEach((point) => {
			if (!allXValues.includes(point.x)) {
				allXValues.push(point.x);
			}
		});

		return { ...dataset, data: sortedData };
	});

	const scaleOptions = {
		x: {
			title: {
				display: true,
				text: "SolverTime [s]"
			},
			type: "linear",
			min: 0,
			max: defaultTime ? Number(defaultTime) + 100 : 1100,
			ticks: {
				stepSize: 50
			}
		},
		y: {
			title: {
				display: true,
				text: "Number of instances"
			}
		}
	};

	CreateChart(
		"line",
		chartData,
		null,
		`Absolute performance profile (${selectedGapType} <= ${
			gapLimit || 0.01
		}% and not failed)`,
		scaleOptions
	);
	return chartData;
}
