import { ExtractStatusMessages } from "../../DataProcessing/ChartsComputations/ComputeChartData";
import { TraceData } from "../../Interfaces/Interfaces";
import { CreateChart } from "../CreateChart";

/**
 * This function prepares and plots the termination relation of the solvers.
 * @param {TraceData[]} traceData - Array of objects containing the result data.
 * @param {string} statusType - The status type to be analyzed.
 * @param {string} title - The title of the chart.
 */
export function PlotTerminationRelation(
	traceData: TraceData[],
	statusType: string,
	title: string
): { label: string; data: number[] }[] {
	const data = ExtractStatusMessages(traceData, statusType);
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
			})
		};
	});

	CreateChart("radar", chartData, solverNames, title, undefined, undefined);
	return chartData;
}
