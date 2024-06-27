import { TraceData } from "../../Interfaces/Interfaces";
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
	const groupedByProblem = traceData.reduce((acc, item) => {
		acc[item["InputFileName"]] = acc[item["InputFileName"]] || [];
		const solverTime =
			isNaN(item["SolverTime"]) || item["SolverTime"] === undefined
				? defaultTime
				: item["SolverTime"];
		acc[item["InputFileName"]].push({ ...item, SolverTime: solverTime });
		return acc;
	}, {} as Record<string, TraceData[]>);

	const noFailedResults = Object.entries(groupedByProblem).reduce(
		(acc, [key, items]) => {
			const filteredItems = items.filter(
				(item) => item["Fail"].toString() === "false"
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
		const times = groupedByProblem[fileName].map((item) => item["SolverTime"]);
		const bestTime = Math.min(...times);
		let worstTime = Math.max(...times);
		if (worstTime > defaultTime) {
			worstTime = defaultTime;
		}

		const solverIterations = groupedByProblem[fileName].map(
			(item) => item["NumberOfIterations"]
		);
		const bestIterations = Math.min(...solverIterations);
		const worstIterations = Math.max(...solverIterations);

		const solverNodes = groupedByProblem[fileName].map(
			(item) => item["NumberOfNodes"]
		);
		const bestNodes = Math.min(...solverNodes);
		const worstNodes = Math.max(...solverNodes);

		const solverDomainViolations = groupedByProblem[fileName].map(
			(item) => item["NumberOfDomainViolations"]
		);
		const bestDomainViolations = Math.min(...solverDomainViolations);
		const worstDomainViolations = Math.max(...solverDomainViolations);

		const dualBoundSolver = groupedByProblem[fileName].map(
			(item) => item["DualBoundSolver"]
		);
		const primalBoundSolver = groupedByProblem[fileName].map(
			(item) => item["PrimalBoundSolver"]
		);

		let bestDualboundSolver: number, bestPrimalBoundSolver: number;
		let worstDualboundSolver: number, worstPrimalBoundSolver: number;

		const direction = groupedByProblem[fileName][0].Direction;
		if (direction === "min") {
			bestDualboundSolver = Math.max(Number(...dualBoundSolver));
			bestPrimalBoundSolver = Math.min(Number(...primalBoundSolver));

			worstDualboundSolver = Math.min(Number(...dualBoundSolver));
			worstPrimalBoundSolver = Math.max(Number(...primalBoundSolver));
		} else {
			bestDualboundSolver = Math.min(Number(...dualBoundSolver));
			bestPrimalBoundSolver = Math.max(Number(...primalBoundSolver));

			worstDualboundSolver = Math.max(Number(...dualBoundSolver));
			worstPrimalBoundSolver = Math.min(Number(...primalBoundSolver));
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
			direction
		);
		const worstDualGap = CalculateGap(
			worstDualboundSolver,
			dualBoundProblem,
			direction
		);

		const bestPrimalGap = CalculateGap(
			bestPrimalBoundSolver,
			primalBoundProblem,
			direction
		);
		const worstPrimalGap = CalculateGap(
			worstPrimalBoundSolver,
			primalBoundProblem,
			direction
		);

		const bestSolverGap = CalculateGap(
			bestPrimalBoundSolver,
			worstDualboundSolver,
			direction
		);
		const worstSolverGap = CalculateGap(
			worstPrimalBoundSolver,
			worstDualboundSolver,
			direction
		);

		result.push({
			InputFileName: fileName,
			Direction: direction,
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
			Direction: direction,
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
export function ComputeVirtualTimes(data): {
	"Virtual Best Solver": object[];
	"Virtual Worst Solver": object[];
} {
	const bestWorst = { "Virtual Best Solver": [], "Virtual Worst Solver": [] };
	const bestEntries: object = {};
	const worstEntries: object = {};

	for (const group of Object.values(data)) {
		/* eslint-disable  @typescript-eslint/no-explicit-any */
		for (const entry of group as any[]) {
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
