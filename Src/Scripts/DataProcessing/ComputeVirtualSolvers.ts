import { TraceData } from "../Interfaces/Interfaces";

/**
 *	This function computes the best and worst solver times data with the TraceData interface.
 * @param {TraceData[]} traceData - Array of objects containing the result data.
 * @param {number} defaultTime - The default time for non-numeric solver times.
 * @returns {TraceData[]} - Array of objects containing the best and worst solver times.
 */
export function ComputeVirtualTimesTraceData(
	traceData: TraceData[],
	defaultTime: number
): TraceData[] {
	const groupedByFileName = traceData.reduce((acc, item) => {
		acc[item.InputFileName] = acc[item.InputFileName] || [];
		const solverTime =
			isNaN(item.SolverTime) || item.SolverTime === undefined
				? defaultTime
				: item.SolverTime;
		acc[item.InputFileName].push({ ...item, SolverTime: solverTime });
		return acc;
	}, {} as Record<string, TraceData[]>);

	const result: TraceData[] = [];

	Object.keys(groupedByFileName).forEach((fileName) => {
		const times = groupedByFileName[fileName].map((item) => item.SolverTime);
		const bestTime = Math.min(...times);
		const worstTime = Math.max(...times);

		result.push({
			InputFileName: fileName,
			SolverName: "VirtualBestSolver",
			SolverTime: bestTime,
			PrimalGap: 0,
			DualGap: 0
		});
		result.push({
			InputFileName: fileName,
			SolverName: "VirtualWorstSolver",
			SolverTime: worstTime,
			PrimalGap: 0,
			DualGap: 0
		});
	});
	return result;
}

/**
 * This function computes the best and worst solver times for the data strucutre used in the absolute performance profile chart.
 * @param {object} data - The data structure containing the filtered and extracted solver times.
 * @returns An object containing the best and worst solver times for the absolute performance profile chart.
 */
export function ComputeVirtualTimes(data: object): object {
	const bestWorst = { "Virtual Best Solver": [], "Virtual Worst Solver": [] };
	const bestEntries: object = {};
	const worstEntries: object = {};

	for (const group of Object.values(data)) {
		for (const entry of group) {
			// eslint-disable-next-line @typescript-eslint/naming-convention
			const { time, InputFileName } = entry;

			if (
				!bestEntries[InputFileName] ||
				time < bestEntries[InputFileName].time
			) {
				bestEntries[InputFileName] = { time, InputFileName };
			}

			if (
				!worstEntries[InputFileName] ||
				time > worstEntries[InputFileName].time
			) {
				worstEntries[InputFileName] = { time, InputFileName };
			}
		}
	}

	for (const [, record] of Object.entries(bestEntries)) {
		bestWorst["Virtual Best Solver"].push(record);
	}

	for (const [, record] of Object.entries(worstEntries)) {
		bestWorst["Virtual Worst Solver"].push(record);
	}
	return bestWorst;
}
