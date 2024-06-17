import { Values } from "../../Constants/Values";
import {
	ExtractAllSolverTimes,
	ExtractAllSolverTimesGapType
} from "../../DataProcessing/ChartsComputations/ComputeChartData";
import { gapTypeSelector } from "../../Elements/Elements";
import { TraceData } from "../../Interfaces/Interfaces";
import { CreateChart } from "../CreateChart";

/**
 * This function prepares and plots all the solver times without any failed results.
 *
 * @param {TraceData[]} traceData - Array of objects containing the result data.
 */
export function PlotSolverTimes(
	traceData: TraceData[]
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

	const zoomOptions = {
		pan: {
			enabled: true,
			mode: "y",
			modiferKey: "ctrl"
		},
		zoom: {
			wheel: {
				enabled: true
			},
			pinch: {
				enabled: true
			},
			mode: "y"
		},
		limits: {
			y: { min: 0 }
		}
	};

	CreateChart(
		"line",
		chartData,
		"InputFileName",
		"Solver time per Instance",
		scaleOptions,
		zoomOptions
	);
	return chartData;
}

/**
 * This function prepares and plots the absolute or relative performance profile of solver time.
 *
 * @param {TraceData[]} traceData - Array of objects containing the result data.
 */
export function PlotPerformanceProfile(
	traceData: TraceData[],
	performanceProfile: string,
	defaultTime?: number | undefined,
	gapLimit?: number | undefined
): {
	data: ({ x: string; y: number } | { x: number; y: number })[];
	label: string;
	showLine: boolean;
}[] {
	const selectedGapType = gapTypeSelector.value;
	let solverTimes = ExtractAllSolverTimesGapType(
		traceData,
		selectedGapType,
		defaultTime,
		gapLimit
	);

	if (performanceProfile === "Relative") {
		solverTimes = GetRelativeTimes(solverTimes);
	}

	const allLabels = [];
	const allXValues: number[] = [];
	const data = (
		Object.entries(solverTimes) as [
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
			max: defaultTime ? Number(defaultTime) + 10 : Values.DEFAULT_TIME + 10,
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

	const zoomOptions = {
		pan: {
			enabled: true,
			mode: "xy",
			modiferKey: "ctrl"
		},
		zoom: {
			wheel: {
				enabled: true
			},
			pinch: {
				enabled: true
			},
			mode: "xy"
		},
		limits: {
			y: { min: 0 }
		}
	};

	CreateChart(
		"line",
		chartData,
		null,
		`${performanceProfile} performance profile`,
		scaleOptions,
		zoomOptions,
		null,
		`${selectedGapType} <= ${
			gapLimit || Values.DEFAULT_GAP_LIMIT
		}% and not failed.`
	);
	return chartData;
}

function GetRelativeTimes(data): object {
	const bestSolverTimes: { [key: string]: number } = {};
	data["Virtual Best Solver"].forEach((entry) => {
		bestSolverTimes[entry.InputFileName] = entry.time;
	});

	const result = {};

	Object.keys(data).forEach((solver) => {
		if (solver !== "Virtual Best Solver" && solver !== "Virtual Worst Solver") {
			result[solver] = data[solver].map((entry) => {
				const bestTime = bestSolverTimes[entry.InputFileName];
				return {
					...entry,
					time: entry.time / bestTime
				};
			});
		} else {
			result[solver] = data[solver];
		}
	});

	return result;
}
