import * as math from "mathjs";
import { Values } from "../../Constants/Values";
import { StatisticsColumns, TraceData } from "../../Interfaces/Interfaces";
import { ComputeVirtualTimesTraceData } from "../ResultComputations/ComputeVirtualSolvers";
import {
	defaultTimeDirectInput,
	gapLimitDirectInput
} from "../../Elements/Elements";

/**
 * This function extracts the values of the specified category for each solver from the results data,
 * calculates the statistical measures, and returns these statistics in a structured format.
 *
 * @param {TraceData[]} resultsData - The array of result objects where each object corresponds to a particular solver's output.
 * @param {string} category - The category whose values are to be analyzed. The category could be time, memory, etc.
 *
 * @returns {object} An object with solver names as keys. Each key points to an object that represents the statistical
 * measures (average, min, max, standard deviation, sum, 10th percentile, 25th percentile, 50th percentile, 75th percentile,
 * and 90th percentile) calculated from the values of the specified category for the corresponding solver. If the value of
 * the category is not a finite number, the instance is not added to the final result.
 */
export function ComputeStatisticalMeasures(
	resultsData: TraceData[],
	category: string,
	defaultTime?: number | undefined,
	filterType?: string
): {
	[SolverName: string]: StatisticsColumns;
} {
	let data: TraceData[];
	if (filterType && filterType !== "None") {
		resultsData = FilterByType(filterType, resultsData);
	}

	if (category === "SolverTime") {
		if (!defaultTime) {
			defaultTime = Values.DEFAULT_TIME;
		}
		const virtualData = ComputeVirtualTimesTraceData(resultsData, defaultTime);
		data = [...resultsData, ...virtualData];
	} else {
		data = resultsData;
	}
	if (
		category !== "NumberOfNodes" &&
		category !== "NumberOfIterations" &&
		category !== "SolverTime"
	) {
		data = data.filter((obj) => isFinite(Number(obj[category])));
	}
	const categoryValues = data.reduce((acc, curr) => {
		const parsedValue = Number(curr[category]);
		if (!isNaN(parsedValue)) {
			if (!acc[curr["SolverName"]]) {
				acc[curr["SolverName"]] = [];
			}
			acc[curr["SolverName"]].push(parsedValue);
		}
		return acc;
	}, {});

	const solverCategoryStats: {
		[SolverName: string]: StatisticsColumns;
	} = {};

	for (const solverName in categoryValues) {
		if (Object.prototype.hasOwnProperty.call(categoryValues, solverName)) {
			const values = categoryValues[solverName];
			const avgValue = Number(math.format(math.mean(values), { precision: 7 }));
			const minValue = Number(math.format(math.min(values), { precision: 7 }));
			const maxValue = Number(math.format(math.max(values), { precision: 7 }));
			const stdValue = Number(math.format(math.std(values), { precision: 7 }));
			const sumValue = Number(math.format(math.sum(values), { precision: 7 }));
			const p10Value = Number(
				math.format(math.quantileSeq(values, 0.1), { precision: 7 })
			);
			const p25Value = Number(
				math.format(math.quantileSeq(values, 0.25), { precision: 7 })
			);
			const p50Value = Number(
				math.format(math.quantileSeq(values, 0.5), { precision: 7 })
			);
			const p75Value = Number(
				math.format(math.quantileSeq(values, 0.75), { precision: 7 })
			);
			const p90Value = Number(
				math.format(math.quantileSeq(values, 0.9), { precision: 7 })
			);

			solverCategoryStats[solverName] = {
				avgValue: avgValue,
				minValue: minValue,
				maxValue: maxValue,
				stdValue: stdValue,
				sumValue: sumValue,
				p10Value: p10Value,
				p25Value: p25Value,
				p50Value: p50Value,
				p75Value: p75Value,
				p90Value: p90Value
			};
		}
	}
	return solverCategoryStats;
}

/**
 * This function filters the data based on the filter type provided.
 * @param filterType
 */
// eslint-disable-next-line complexity
function FilterByType(
	filterType: string,
	categoryValues: TraceData[]
): TraceData[] {
	switch (filterType) {
		case "no_fail_by_all_solver":
			return (categoryValues = categoryValues.filter(
				(obj) => obj["SolverStatus"] === "Normal Completion"
			));
		case "time_greater_than_10_by_at_least_one_solver_and_no_fail":
			return (categoryValues = categoryValues.filter(
				(obj) =>
					obj["SolverTime"] <= 10 && obj["SolverStatus"] === "Normal Completion"
			));
			return (categoryValues = categoryValues.filter(
				(obj) =>
					obj["PrimalGap"] <= 0.1002 &&
					obj["SolverStatus"] === "Normal Completion"
			));
		case "solver_primal_gap_less_than_or_equal_to_1_percent_and_no_fail":
			return (categoryValues = categoryValues.filter(
				(obj) =>
					obj["PrimalGap"] <= 1 && obj["SolverStatus"] === "Normal Completion"
			));
		case "solver_primal_gap_less_than_or_equal_to_10_percent_and_no_fail":
			return (categoryValues = categoryValues.filter(
				(obj) =>
					obj["PrimalGap"] <= 10 && obj["SolverStatus"] === "Normal Completion"
			));
		case "solver_dual_gap_less_than_or_equal_to_1_percent_and_not_failed":
			return (categoryValues = categoryValues.filter(
				(obj) =>
					obj["DualGap"] <= 1 && obj["SolverStatus"] === "Normal Completion"
			));
		case "solver_dual_gap_less_than_or_equal_to_10_percent_and_not_failed":
			return (categoryValues = categoryValues.filter(
				(obj) =>
					obj["DualGap"] <= 10 && obj["SolverStatus"] === "Normal Completion"
			));
		default:
			return categoryValues;
	}
}

/**
 * This function extracts the values of the termination message for each instance per solver, from the results data.
 *
 * @param {TraceData[]} traceData - Array of objects containing the result data.
 * @returns  {string[]} - An object with solver names as keys. Each solver contains a counter of the instance status messages.
 */

export function ExtractStatusMessages(traceData: TraceData[]): string[] {
	const result = [];
	const nameErrorMap = new Map();

	traceData.forEach((obj) => {
		const existingEntry = nameErrorMap.get(obj["SolverName"]);

		if (existingEntry) {
			existingEntry[obj["SolverStatus"]] =
				(existingEntry[obj["SolverStatus"]] || 0) + 1;
		} else {
			const newEntry = {
				SolverName: obj["SolverName"],
				[obj["SolverStatus"]]: 1
			};
			nameErrorMap.set(obj["SolverName"], newEntry);
			result.push(newEntry);
		}
	});
	return result;
}

/**
 * This function is used to structure trace data (log of the solver) into a more accessible object
 * structure. It takes an array of objects (traceData) and returns an object.
 *
 * The returned object has a unique key for each solver and the value is an array of objects, each containing a 'time'
 * and 'InputFileName'.
 *
 * @param {TraceData[]} traceData - Array of objects containing the result data.
 *
 * @returns {object} - An object with solver names as keys. Each key points to an array of objects where each object
 * contains 'time' and 'InputFileName' property of the corresponding solver. If the time value is 'NA' or is not a number,
 * the instance is not added to the final result.
 */
export function ExtractAllSolverTimes(traceData: TraceData[]): object {
	const result = traceData.reduce(
		(
			acc: { [key: string]: { time: number; InputFileName: string }[] },
			obj: object
		): { [key: string]: { time: number; InputFileName: string }[] } => {
			if (!acc[obj["SolverName"]]) {
				acc[obj["SolverName"]] = [];
			}
			if (obj["SolverTime"] !== "NA") {
				const time = Number(obj["SolverTime"]);
				if (!isNaN(time)) {
					const inputFileName = obj["InputFileName"];
					acc[obj["SolverName"]].push({ time, InputFileName: inputFileName });
				}
			}
			return acc;
		},
		{}
	);
	return result;
}

/**
 * This function Extracts solver times based on the specified gap type, default time, gap limit, and termination status.
 *
 * The returned object has a unique key for each solver and the value is an array of objects, each containing a 'time'
 * and 'InputFileName'.
 *
 * @param {TraceData[]} traceData - Array of objects containing the result data.
 *
 * @returns {object} - An object with solver names as keys. Each key points to an array of objects where each object
 * contains 'time' and 'InputFileName' property of the corresponding solver.
 */
export function ExtractAllSolverTimesGapType(
	traceData: TraceData[],
	selectedGapType: string,
	defaultTime?: number | undefined,
	gapLimit?: number | undefined,
	terminationStatusSelector?: string
): object {
	let defaultTimeFallback: number;
	let gapLimitToCompare: number;
	let terminationStatus: string;

	if (!gapLimit || gapLimit < 0) {
		gapLimitToCompare = 0.01;
		gapLimitDirectInput.value = "0.01";
	} else {
		gapLimitToCompare = gapLimit;
	}

	if (!defaultTime || defaultTime < 0) {
		defaultTimeFallback = Values.DEFAULT_TIME;
		defaultTimeDirectInput.value = Values.DEFAULT_TIME.toString();
	} else {
		defaultTimeFallback = defaultTime;
	}

	if (!terminationStatusSelector) {
		terminationStatus = undefined;
	} else {
		const statusMap: { [key: number]: string } = {
			1: "Normal Completion",
			2: "Iteration Interrupt",
			3: "Resource Interrupt",
			4: "Terminated By Solver",
			5: "Evaluation Interrupt",
			6: "Capability Problems",
			7: "Licensing Problems",
			8: "User Interrupt",
			9: "Error Setup Failure",
			10: "Error Solver Failure",
			11: "Error Internal Solver Failure",
			12: "Solve Processing Skipped",
			13: "Error System Failure"
		};
		terminationStatus = statusMap[terminationStatusSelector];
	}

	const virtualData = ComputeVirtualTimesTraceData(
		traceData,
		defaultTimeFallback
	);
	const combinedData = [...traceData, ...virtualData];
	const filteredData = combinedData.reduce(
		(
			acc: { [key: string]: { time: number; InputFileName: string }[] },
			obj: object
		): { [key: string]: { time: number; InputFileName: string }[] } => {
			if (!acc[obj["SolverName"]]) {
				acc[obj["SolverName"]] = [];
			}
			if (!isNaN(obj["SolverTime"])) {
				if (
					obj[selectedGapType] <= gapLimitToCompare &&
					obj["SolverStatus"] === terminationStatus
				) {
					acc[obj["SolverName"]].push({
						time: Number(obj["SolverTime"]),
						InputFileName: obj["InputFileName"]
					});
				} else if (
					obj[selectedGapType] <= gapLimitToCompare &&
					terminationStatus === undefined
				) {
					acc[obj["SolverName"]].push({
						time: Number(obj["SolverTime"]),
						InputFileName: obj["InputFileName"]
					});
				}
			} else {
				acc[obj["SolverName"]].push({
					time: defaultTimeFallback,
					InputFileName: obj["InputFileName"]
				});
			}
			return acc;
		},
		{}
	);

	const result = filteredData;
	return result;
}
