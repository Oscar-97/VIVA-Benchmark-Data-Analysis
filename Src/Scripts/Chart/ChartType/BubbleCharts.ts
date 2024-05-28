import { TraceData } from "../../Interfaces/Interfaces";
import { CreateChart } from "../CreateChart";

/**
 * This function prepares and plots the solution times of the solvers based on the number of variables and equations.
 * @param {TraceData[]} traceData - Array of objects containing the result data.
 */
export function PlotSolutionTimes(traceData: TraceData[]): object[] {
	const data = traceData.reduce((acc, obj) => {
		const bubbleSize = Math.round((obj.SolverTime / 100) * 100) / 100;
		if (!acc[obj.SolverName]) {
			acc[obj.SolverName] = {
				label: obj.SolverName,
				data: [],
				clip: 1
			};
		}

		acc[obj.SolverName].data.push({
			x: obj.NumberOfVariables,
			y: obj.NumberOfEquations,
			r: bubbleSize,
			solverTime: obj.SolverTime
		});

		return acc;
	}, {});

	const chartData = Object.values(data);

	const scaleOptions = {
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
		}
	};

	CreateChart(
		"bubble",
		chartData,
		null,
		"Solution time",
		scaleOptions,
		zoomOptions,
		null,
		"The radius of the bubble is obtained by dividing the SolverTime by 100 for easier scaling."
	);
	return chartData as object[];
}
