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
): { data: { x: number; y: number }[]; label: string; showLine: boolean }[] {
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

	const data = (
		Object.entries(solverTimes) as [
			string,
			{ time: number; InputFileName: string }[]
		][]
	).map(([key, values]) => {
		const totalInstances = values.length;
		let cumulativeCounts: { x: number; y: number }[];

		const bucketCounts: { [key: number]: number } = {};
		values.forEach(({ time }) => {
			let bucket: number;
			if (time < 0.1) bucket = 0.1;
			else if (time < 1) bucket = 1;
			else bucket = Math.floor(time) + 1;

			bucketCounts[bucket] = (bucketCounts[bucket] || 0) + 1;
		});

		if (performanceProfile === "Absolute") {
			let cumulativeCount = 0;
			cumulativeCounts = Object.entries(bucketCounts)
				.sort(([a], [b]) => Number(a) - Number(b))
				.map(([bucket, count]) => {
					cumulativeCount += count;
					return { x: Number(bucket), y: cumulativeCount };
				});
		} else {
			let cumulativeCount = 0;
			cumulativeCounts = Object.entries(bucketCounts)
				.sort(([a], [b]) => Number(a) - Number(b))
				.map(([bucket, count]) => {
					cumulativeCount += count;
					return {
						x: Number(bucket),
						y: cumulativeCount / totalInstances
					};
				});

			if (
				cumulativeCounts.length > 0 &&
				cumulativeCounts[cumulativeCounts.length - 1].y < 1
			) {
				cumulativeCounts.push({
					x: cumulativeCounts[cumulativeCounts.length - 1].x,
					y: 1
				});
			}
		}

		return {
			label: key,
			data: cumulativeCounts,
			showLine: true,
			spanGaps: true,
			stepped: performanceProfile === "Absolute" ? true : "before"
		};
	});

	const maxX = Math.max(
		...data.flatMap((dataset) => dataset.data.map((point) => point.x))
	);

	const chartData = data.map((dataset) => {
		if (dataset.data[dataset.data.length - 1].x < maxX) {
			dataset.data.push({
				x: maxX,
				y: dataset.data[dataset.data.length - 1].y
			});
		}
		return dataset;
	});

	const scaleOptions = {
		x: {
			title: {
				display: true,
				text:
					performanceProfile === "Relative"
						? "Performance Ratio"
						: "SolverTime [s]"
			},
			type: "linear",
			min: 0,
			max:
				performanceProfile === "Relative"
					? Math.min(maxX, 10)
					: defaultTime
					? Number(defaultTime) + 10
					: Values.DEFAULT_TIME + 10,
			ticks: {
				stepSize: performanceProfile === "Relative" ? 0.5 : 50
			}
		},
		y: {
			title: {
				display: true,
				text:
					performanceProfile === "Relative"
						? "Fraction of instances solved"
						: "Number of instances"
			},
			min: 0,
			max: performanceProfile === "Relative" ? 1 : undefined
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
			y: { min: 0, max: performanceProfile === "Relative" ? 1 : undefined }
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

/**
 * This function gets the relative times of the solver times.
 */
export function GetRelativeTimes(data: object): object {
	const bestSolverTimes: { [key: string]: number } = {};
	Object.keys(data).forEach((solver) => {
		if (solver !== "Virtual Best Solver" && solver !== "Virtual Worst Solver") {
			data[solver].forEach((entry) => {
				const fileName = entry.InputFileName;
				if (
					!bestSolverTimes[fileName] ||
					entry.SolverTime < bestSolverTimes[fileName]
				) {
					bestSolverTimes[fileName] = entry.SolverTime;
				}
			});
		}
	});

	const result: { [key: string]: any[] } = {};

	Object.keys(data).forEach((solver) => {
		result[solver] = data[solver].map((entry) => {
			const bestTime = bestSolverTimes[entry.InputFileName] || 1;

			return {
				...entry,
				SolverTime: bestTime > 0 ? entry.SolverTime / bestTime : 1
			};
		});
	});

	return result;
}
