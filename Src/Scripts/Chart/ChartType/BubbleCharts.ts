import { TraceData } from "../../Interfaces/Interfaces";
import {
	ChartScaleOptions,
	ChartZoomOptions,
	CreateChart
} from "../CreateChart";

/**
 * A solver and its instances, as the data set of a bubble chart.
 */
interface BubbleDataset {
	label: string;
	data: {
		x: number | undefined;
		y: number | undefined;
		r: number;
		solverTime: number;
	}[];
	clip: number;
}

/**
 * This function prepares and plots the solution times of the solvers based on the number of variables and equations.
 * @param {TraceData[]} traceData - Array of objects containing the result data.
 */
export function PlotSolutionTimes(traceData: TraceData[]): object[] {
	const data = traceData.reduce((acc: Record<string, BubbleDataset>, obj) => {
		const solverTime = obj.SolverTime ?? 0;
		const bubbleSize = Math.round((solverTime / 100) * 100) / 100;
		const solverName = obj.SolverName as string;
		if (!acc[solverName]) {
			acc[solverName] = {
				label: solverName,
				data: [],
				clip: 1
			};
		}

		acc[solverName].data.push({
			x: obj.NumberOfVariables,
			y: obj.NumberOfEquations,
			r: bubbleSize,
			solverTime: solverTime
		});

		return acc;
	}, {});

	const chartData = Object.values(data);

	const scaleOptions: ChartScaleOptions = {
		x: {
			title: {
				display: true,
				text: "Number Of Variables"
			}
		},
		y: {
			title: {
				display: true,
				text: "Number Of Equations"
			}
		}
	};

	const zoomOptions: ChartZoomOptions = {
		pan: {
			enabled: true,
			mode: "xy"
		},
		zoom: {
			wheel: {
				enabled: true
			},
			pinch: {
				enabled: true
			},
			mode: "xy"
		}
	};

	CreateChart(
		"bubble",
		chartData,
		[],
		"Solution time",
		scaleOptions,
		zoomOptions,
		undefined,
		"The radius of the bubble is obtained by dividing the SolverTime by 100 for easier scaling."
	);
	return chartData as object[];
}
