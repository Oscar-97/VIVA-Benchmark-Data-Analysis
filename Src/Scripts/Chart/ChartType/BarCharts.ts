import { CreateChart } from "../CreateChart";
import { StatisticsTable } from "../../DataTable/DataTableBase";
import { DataTablesConfigurationStats } from "../../DataTable/DataTableWrapper";
import { TraceData } from "../../Interfaces/Interfaces";
import {
	ComputeStatisticalMeasures,
	ExtractFailedCount,
	ExtractStatusMessages
} from "../../DataProcessing/ChartsComputations/ComputeChartData";

/**
 * This function prepares and plots data by a specific category.
 *
 * @param {TraceData[]} traceData - Array of objects containing the result data.
 * @param {string} category - The category by which the data should be analyzed.
 * @param {string} title - The title of the chart.
 */
export function PlotDataByCategory(
	traceData: TraceData[],
	category: string,
	title: string,
	defaultTime?: number | undefined,
	filterType?: string,
	subtitle?: string
): {
	label: string;
	data: number[];
	borderColor: string;
	backgroundColor: string;
}[] {
	const data = ComputeStatisticalMeasures(
		traceData,
		category,
		defaultTime,
		filterType
	);
	const solverNames = Object.keys(data).filter(
		(name) => name !== "Virtual Best Solver" && name !== "Virtual Worst Solver"
	);

	const averageData = {
		label: "Average",
		data: solverNames
			.filter(
				(name) =>
					name !== "Virtual Best Solver" && name !== "Virtual Worst Solver"
			)
			.map((name) => data[name].avgValue),
		borderColor: "#007bff",
		backgroundColor: "#007bffAA"
	};

	const minData = {
		label: "Min",
		data: solverNames
			.filter(
				(name) =>
					name !== "Virtual Best Solver" && name !== "Virtual Worst Solver"
			)
			.map((name) => data[name].minValue),
		borderColor: "#28a745",
		backgroundColor: "#28a745AA"
	};

	const maxData = {
		label: "Max",
		data: solverNames
			.filter(
				(name) =>
					name !== "Virtual Best Solver" && name !== "Virtual Worst Solver"
			)
			.map((name) => data[name].maxValue),
		borderColor: "#dc3545",
		backgroundColor: "#dc3545AA"
	};

	const stdData = {
		label: "Std",
		data: solverNames
			.filter(
				(name) =>
					name !== "Virtual Best Solver" && name !== "Virtual Worst Solver"
			)
			.map((name) => data[name].stdValue),
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
		annotationOptions = {
			annotations: {
				line1: {
					type: "line",
					yMin: data["Virtual Best Solver"].avgValue,
					yMax: data["Virtual Best Solver"].avgValue,
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
					yMin: data["Virtual Worst Solver"].avgValue,
					yMax: data["Virtual Worst Solver"].avgValue,
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
		"bar",
		chartData,
		solverNames,
		title,
		scaleOptions,
		zoomOptions,
		annotationOptions,
		subtitle
	);
	StatisticsTable(data, title);
	DataTablesConfigurationStats("#statisticsTable_inner");

	return chartData;
}

/**
 * This function prepares and plots all the termination status messages per solver.
 *
 * @param {TraceData[]} traceData - Array of objects containing the result data.
 * @param {string} statusType - The status type to be analyzed.
 * @param {string} title - The title of the chart.
 */
export function PlotStatusMessages(
	traceData: TraceData[],
	statusType: string,
	title: string
): {
	label: string;
	data: TraceData[];
	borderColor: string;
	backgroundColor: string;
}[] {
	const data = ExtractStatusMessages(traceData, statusType);
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

	CreateChart("bar", chartData, solverNames, title, scaleOptions, zoomOptions);
	return chartData;
}

/**
 * This function prepares and plots the fail count per solver.
 * @param {TraceData[]} traceData - Array of objects containing the result data.
 */
export function PlotFailCount(traceData: TraceData[]): {
	label: string;
	data: number[];
	borderColor: string;
	backgroundColor: string;
}[] {
	const data = ExtractFailedCount(traceData);
	const solverNames = data.map((obj) => {
		return obj["SolverName"];
	});
	const statusKeys = Object.keys(data[0]).filter((key) => {
		return key !== "SolverName";
	});

	const chartData = statusKeys.map((key) => {
		return {
			label: key,
			data: data.map((obj) => {
				return obj[key] || 0;
			}),
			borderColor: "#f5a2a3",
			backgroundColor: "#f5a2a3"
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
			mode: "y"
		},
		limits: {
			y: { min: 0 }
		}
	};

	CreateChart(
		"bar",
		chartData,
		solverNames,
		"Number of failed instances",
		scaleOptions,
		zoomOptions
	);
	return chartData;
}
