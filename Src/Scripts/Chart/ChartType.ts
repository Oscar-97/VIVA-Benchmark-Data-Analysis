import {
	AnalyzeDataByCategory,
	ExtractStatusMessages,
	ExtractAllSolverTimes,
	ExtractAllSolverTimesGapType
} from "../DataProcessing/CalculateResults";
import { CreateChart } from "./CreateChart";
import { StatisticsTable } from "../DataTable/DataTableBase";
import { gapTypeSelector } from "../Elements/Elements";
import { DataTablesConfigurationStats } from "../DataTable/DataTableWrapper";
import { TraceData } from "../Interfaces/Interfaces";
import {
	ComputeVirtualTimes,
	ComputeVirtualTimesTraceData
} from "../DataProcessing/ComputeVirtualSolvers";
import { Values } from "../Constants/Values";

/**
 * This function prepares and plots data by a specific category.
 *
 * @param {TraceData[]} traceData - Array of objects containing the result data.
 * @param {string} type - The type of the chart to be created (e.g., 'line', 'bar', 'pie').
 * @param {string} category - The category by which the data should be analyzed.
 * @param {string} title - The title of the chart.
 */
export function PlotDataByCategory(
	traceData: TraceData[],
	type: string,
	category: string,
	title: string,
	defaultTime?: number | undefined
): {
	label: string;
	data: number[];
	borderColor: string;
	backgroundColor: string;
}[] {
	const data = AnalyzeDataByCategory(traceData, category);
	const solverNames = Object.keys(data);

	const averageData = {
		label: "Average",
		data: solverNames.map((name) => data[name].avgValue),
		borderColor: "#007bff",
		backgroundColor: "#007bffAA"
	};

	const minData = {
		label: "Min",
		data: solverNames.map((name) => data[name].minValue),
		borderColor: "#28a745",
		backgroundColor: "#28a745AA"
	};

	const maxData = {
		label: "Max",
		data: solverNames.map((name) => data[name].maxValue),
		borderColor: "#dc3545",
		backgroundColor: "#dc3545AA"
	};

	const stdData = {
		label: "Std",
		data: solverNames.map((name) => data[name].stdValue),
		borderColor: "#6f42c1",
		backgroundColor: "#6f42c1AA"
	};

	const chartData = [averageData, minData, maxData, stdData];
	const scaleOptions = {
		x: {
			title: {
				display: true,
				text: "Solver name"
			}
		},
		y: {
			title: {
				display: true,
				text: "Count"
			}
		}
	};

	const zoomOptions = {
		pan: {
			enabled: false
		},
		zoom: {
			wheel: {
				enabled: true
			},
			pinch: {
				enabled: true
			},
			mode: "y",
			scaleMode: "y"
		},
		limits: {
			y: { min: 0 }
		}
	};

	let annotationOptions = null;

	/**
	 * Draw annotations for the virtual best and worst solvers if SolverTime is used.
	 */
	if (category === "SolverTime") {
		if (!defaultTime) {
			defaultTime = Values.DEFAULT_TIME;
		}
		const extraData = ComputeVirtualTimesTraceData(traceData, defaultTime);
		const virtualData = AnalyzeDataByCategory(extraData, category);
		annotationOptions = {
			annotations: {
				line1: {
					type: "line",
					yMin: virtualData["VirtualBestSolver"].avgValue,
					yMax: virtualData["VirtualBestSolver"].avgValue,
					borderColor: "rgb(124,252,0)",
					borderShadowColor: "rgba(0,0,0, 0)",
					shadowOffsetY: 2,
					borderWidth: 2,
					label: {
						content: "Virtual Best Average",
						display: true,
						position: "end"
					}
				},
				line2: {
					type: "line",
					yMin: virtualData["VirtualWorstSolver"].avgValue,
					yMax: virtualData["VirtualWorstSolver"].avgValue,
					borderColor: "rgb(255, 99, 132)",
					borderShadowColor: "rgba(0,0,0, 0)",
					shadowOffsetY: 2,
					borderWidth: 2,
					label: {
						content: "Virtual Worst Average",
						display: true,
						position: "end"
					}
				}
			}
		};
	}

	CreateChart(
		type,
		chartData,
		solverNames,
		title,
		scaleOptions,
		zoomOptions,
		annotationOptions
	);
	StatisticsTable(data, title);
	DataTablesConfigurationStats("#statisticsTable_inner");

	return chartData;
}

/**
 * This function prepares and plots all the termination status messages per solver.
 *
 * @param {TraceData[]} traceData - Array of objects containing the result data.
 * @param {string} type - The type of the chart to be created (e.g., 'line', 'bar', 'pie').
 * @param {string} title - The title of the chart.
 */
export function PlotStatusMessages(
	traceData: TraceData[],
	type: string,
	title: string
): {
	label: string;
	data: TraceData[];
	borderColor: string;
	backgroundColor: string;
}[] {
	const data = ExtractStatusMessages(traceData);
	const solverNames = data.map((obj) => {
		return obj["SolverName"];
	});
	const statusKeys = Object.keys(data[0]).filter((key) => {
		return key !== "SolverName";
	});

	const colorMapping: { [key: string]: string } = {
		Optimal: "#d5fa87",
		"Locally Optimal": "#778c4a",
		Unbounded: "#3131cc",
		Infeasible: "#05055c",
		"Locally Infeasible": "#15153b",
		"Intermediate Infeasible": "#23232e",
		"Feasible Solution": "#767694",
		"Integer Solution": "#ee02fa",
		"Intermediate Non-integer": "#883c8c",
		"Integer Infeasible": "#a671a8",
		"Lic Problem - No Solution": "#616060",
		"Error Unknown": "#0a0a0a",
		"Error No Solution": "#f5a2a3",
		"No Solution Returned": "#381414",
		"Solved Unique": "#30f522",
		Solved: "#92ff8a",
		"Solved Singular": "#085202",
		"Unbounded - No Solution": "#ff1c03",
		"Infeasible - No Solution": "#fa9287"
	};

	const chartData = statusKeys.map((key) => {
		return {
			label: key,
			data: data.map((obj) => {
				return obj[key] || 0;
			}),
			borderColor: colorMapping[key],
			backgroundColor: colorMapping[key]
		};
	});

	const scaleOptions = {
		x: {
			title: {
				display: true,
				text: "Solver name"
			}
		},
		y: {
			title: {
				display: true,
				text: "Termination count"
			}
		}
	};

	const zoomOptions = {
		pan: {
			enabled: false
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

	CreateChart(type, chartData, solverNames, title, scaleOptions, zoomOptions);
	return chartData;
}

/**
 * This function prepares and plots all the solver times without any failed results.
 *
 * @param {TraceData[]} traceData - Array of objects containing the result data.
 */
export function PlotAllSolverTimes(
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
		"Solver times",
		scaleOptions,
		zoomOptions
	);
	return chartData;
}

/**
 * This function prepares and plots the absolute performance profile of solver time, where the instances have a gap <= 1.0% and not failed.
 *
 * @param {TraceData[]} traceData - Array of objects containing the result data.
 */
export function PlotAbsolutePerformanceProfileSolverTimes(
	traceData: TraceData[],
	defaultTime?: number | undefined,
	gapLimit?: number | undefined
): {
	data: ({ x: string; y: number } | { x: number; y: number })[];
	label: string;
	showLine: boolean;
}[] {
	const selectedGapType = gapTypeSelector.value;
	const solverTimes = ExtractAllSolverTimesGapType(
		traceData,
		selectedGapType,
		defaultTime,
		gapLimit
	);

	const virtualSolvers = ComputeVirtualTimes(solverTimes);
	const combinedSolverTimes = {
		...solverTimes,
		...virtualSolvers
	};

	const allLabels = [];
	const allXValues: number[] = [];
	const data = (
		Object.entries(combinedSolverTimes) as [
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
		`Absolute performance profile (${selectedGapType} <= ${
			gapLimit || Values.DEFAULT_GAP_LIMIT
		}% and not failed)`,
		scaleOptions,
		zoomOptions
	);
	return chartData;
}
