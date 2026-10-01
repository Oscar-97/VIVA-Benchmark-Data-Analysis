import { SolverTimeEntry, TraceData } from "../../Interfaces/Interfaces";
import { CalculateGap } from "./ComputeResults";

/**
 * This function computes the virtual best and worst solvers from the provided trace data.
 * Failed results are not considered in the computation.
 * @param {TraceData[]} traceData - Array of objects containing the result data.
 * @param {number} defaultTime - The default time for non-numeric solver times.
 * @returns {TraceData[]} - Array of objects containing the best and worst solvers.
 */
export function ComputeVirtualTimesTraceData(
	traceData: TraceData[],
	defaultTime: number
): TraceData[] {
	const groupedByProblem = traceData.reduce(
		(acc, item) => {
			const fileName = item["InputFileName"] as string;
			acc[fileName] = acc[fileName] || [];
			const solverTime =
				isNaN(Number(item["SolverTime"])) || item["SolverTime"] === undefined
					? defaultTime
					: (item["SolverTime"] as number);
			acc[fileName].push({ ...item, SolverTime: solverTime });
			return acc;
		},
		{} as Record<string, TraceData[]>
	);

	const noFailedResults = Object.entries(groupedByProblem).reduce(
		(acc, [key, items]) => {
			const filteredItems = items.filter(
				(item) => item["Fail"] != null && item["Fail"].toString() === "false"
			);
			if (filteredItems.length > 0) {
				acc[key] = filteredItems;
			}
			return acc;
		},
		{} as Record<string, TraceData[]>
	);

	const result: TraceData[] = [];

	Object.keys(noFailedResults).forEach((fileName) => {
		const times = groupedByProblem[fileName].map(
			(item) => item["SolverTime"] as number
		);
		const bestTime = Math.min(...times);
		let worstTime = Math.max(...times);
		if (worstTime > defaultTime) {
			worstTime = defaultTime;
		}

		const solverIterations = groupedByProblem[fileName].map(
			(item) => item["NumberOfIterations"] as number
		);
		const bestIterations = Math.min(...solverIterations);
		const worstIterations = Math.max(...solverIterations);

		const solverNodes = groupedByProblem[fileName].map(
			(item) => item["NumberOfNodes"] as number
		);
		const bestNodes = Math.min(...solverNodes);
		const worstNodes = Math.max(...solverNodes);

		const solverDomainViolations = groupedByProblem[fileName].map(
			(item) => item["NumberOfDomainViolations"] as number
		);
		const bestDomainViolations = Math.min(...solverDomainViolations);
		const worstDomainViolations = Math.max(...solverDomainViolations);

		const dualBoundSolver = groupedByProblem[fileName].map((item) =>
			Number(item["DualBoundSolver"])
		);
		const primalBoundSolver = groupedByProblem[fileName].map((item) =>
			Number(item["PrimalBoundSolver"])
		);

		let bestDualboundSolver: number, bestPrimalBoundSolver: number;
		let worstDualboundSolver: number, worstPrimalBoundSolver: number;

		const direction = groupedByProblem[fileName][0].Direction;
		if (direction === "min") {
			bestDualboundSolver = Math.max(...dualBoundSolver);
			bestPrimalBoundSolver = Math.min(...primalBoundSolver);

			worstDualboundSolver = Math.min(...dualBoundSolver);
			worstPrimalBoundSolver = Math.max(...primalBoundSolver);
		} else {
			bestDualboundSolver = Math.min(...dualBoundSolver);
			bestPrimalBoundSolver = Math.max(...primalBoundSolver);

			worstDualboundSolver = Math.max(...dualBoundSolver);
			worstPrimalBoundSolver = Math.min(...primalBoundSolver);
		}

		const dualBoundProblem = Number(
			groupedByProblem[fileName][0].DualBoundProblem
		);
		const primalBoundProblem = Number(
			groupedByProblem[fileName][0].PrimalBoundProblem
		);

		const bestDualGap = CalculateGap(
			bestDualboundSolver,
			dualBoundProblem,
			direction as string
		);
		const worstDualGap = CalculateGap(
			worstDualboundSolver,
			dualBoundProblem,
			direction as string
		);

		const bestPrimalGap = CalculateGap(
			bestPrimalBoundSolver,
			primalBoundProblem,
			direction as string
		);
		const worstPrimalGap = CalculateGap(
			worstPrimalBoundSolver,
			primalBoundProblem,
			direction as string
		);

		const bestSolverGap = CalculateGap(
			bestPrimalBoundSolver,
			worstDualboundSolver,
			direction as string
		);
		const worstSolverGap = CalculateGap(
			worstPrimalBoundSolver,
			worstDualboundSolver,
			direction as string
		);

		result.push({
			InputFileName: fileName,
			Direction: direction as string,
			SolverName: "Virtual Best Solver",
			SolverTime: bestTime,
			PrimalGap: bestPrimalGap,
			DualGap: bestDualGap,
			Gap_Solver: bestSolverGap,
			SolverStatus: "Normal Completion",
			NumberOfDomainViolations: bestDomainViolations,
			NumberOfNodes: bestNodes,
			NumberOfIterations: bestIterations
		});
		result.push({
			InputFileName: fileName,
			Direction: direction as string,
			SolverName: "Virtual Worst Solver",
			SolverTime: worstTime,
			PrimalGap: worstPrimalGap,
			DualGap: worstDualGap,
			Gap_Solver: worstSolverGap,
			SolverStatus: "Normal Completion",
			NumberOfDomainViolations: worstDomainViolations,
			NumberOfNodes: worstNodes,
			NumberOfIterations: worstIterations
		});
	});

	return result;
}

/**
 * This function computes the best and worst solver times for the data strucutre used in the performance profile chart.
 * @param {object} data - The data structure containing the filtered and extracted solver times.
 * @returns An object containing the best and worst solver times for the performance profile chart.
 */
export function ComputeVirtualTimes(data: Record<string, SolverTimeEntry[]>): {
	"Virtual Best Solver": SolverTimeEntry[];
	"Virtual Worst Solver": SolverTimeEntry[];
} {
	const bestWorst: {
		"Virtual Best Solver": SolverTimeEntry[];
		"Virtual Worst Solver": SolverTimeEntry[];
	} = { "Virtual Best Solver": [], "Virtual Worst Solver": [] };
	const bestEntries: Record<string, SolverTimeEntry> = {};
	const worstEntries: Record<string, SolverTimeEntry> = {};

	for (const group of Object.values(data)) {
		for (const entry of group) {
			const { time } = entry;
			const fileName = entry.InputFileName;

			if (!bestEntries[fileName] || time < bestEntries[fileName].time) {
				bestEntries[fileName] = { time, InputFileName: fileName };
			}

			if (!worstEntries[fileName] || time > worstEntries[fileName].time) {
				worstEntries[fileName] = { time, InputFileName: fileName };
			}
		}
	}

	// All best counts all best times
	for (const [, record] of Object.entries(bestEntries)) {
		bestWorst["Virtual Best Solver"].push(record);
	}

	// But all the worst times are counted instead of just the worst time...
	for (const [, record] of Object.entries(worstEntries)) {
		bestWorst["Virtual Worst Solver"].push(record);
	}
	return bestWorst;
}
