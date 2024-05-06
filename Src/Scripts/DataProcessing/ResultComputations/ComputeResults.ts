import * as math from "mathjs";
import {
	defaultTimeDirectInput,
	gapLimitDirectInput
} from "../../Elements/Elements";
import {
	ComparisonSummary,
	StatisticsColumns,
	TraceData
} from "../../Interfaces/Interfaces";
import { Values } from "../../Constants/Values";
import { ComputeVirtualTimes } from "./ComputeVirtualSolvers";

/**
 * This function calculates a direction, based on an input parameter 'direction'.
 *
 * @param {number | string} direction - A number or string input that represents the initial direction value.
 *                                      This is then processed to calculate the final direction.
 *
 * @returns {string} direction - The calculated direction value in form of a string. It can be either 'max' or 'min'.
 */
export function CalculateDirection(direction: number | string): string {
	direction = 1 - 2 * Number(direction);
	if (direction === -1) {
		direction = "max";
		return direction;
	} else {
		direction = "min";
		return direction;
	}
}

/**
 * This function is used to calculate the primal bound of an optimization problem, which can either be a maximization or minimization problem.
 *
 * @export
 * @param {(number | string)} primalBound - The primal bound of the problem. This value can be a number or a string.
 * If it's a string, it can represent a number, 'NA', 'nan', 'inf', '+inf', '-inf', '-nan', or an empty string.
 *
 * @param {string} direction - The optimization direction, which can either be 'max' for maximization problems or 'min' for minimization problems.
 *
 * @returns {(number | string)} - Returns a numerical value based on the input `primalBound`.
 * If the primal bound is an empty string, 'na', 'nan', or '-nan', it returns `-Infinity` for 'max' direction and `Infinity` for 'min' direction.
 * If the primal bound is 'inf' or '+inf', it returns `Infinity`, and for '-inf', it returns `-Infinity`.
 * Otherwise, it converts the primal bound into a number.
 */
export function CalculatePrimalBound(
	primalBound: number | string,
	direction: string
): number | string {
	if (typeof primalBound === "string") {
		switch (primalBound.toLowerCase()) {
			case "":
			case "na":
			case "nan":
			case "-nan":
				primalBound = direction === "max" ? -Infinity : Infinity;
				break;
			case "inf":
			case "+inf":
				primalBound = Infinity;
				break;
			case "-inf":
				primalBound = -Infinity;
				break;
			default:
				primalBound = Number(primalBound);
		}
	}
	return primalBound.toExponential(6);
}

/**
 * This function is used to calculate the dual bound of an optimization problem, which can either be a maximization or minimization problem.
 *
 * @export
 * @param {(number | string)} dualBound - The dual bound of the problem. This value can be a number or a string.
 * If it's a string, it can represent a number, 'NA', 'nan', 'inf', '+inf', '-inf', '-nan', or an empty string.
 *
 * @param {string} direction - The optimization direction, which can either be 'max' for maximization problems or 'min' for minimization problems.
 *
 * @returns {(number | string)} - Returns a numerical value based on the input `dualBound`.
 * If the dual bound is an empty string, 'na', 'nan', or '-nan', it returns `Infinity` for 'max' direction and `-Infinity` for 'min' direction.
 * If the dual bound is 'inf' or '+inf', it returns `Infinity`, and for '-inf', it returns `-Infinity`.
 * Otherwise, it converts the dual bound into a number.
 */
export function CalculateDualBound(
	dualBound: number | string,
	direction: string
): number | string {
	if (typeof dualBound === "string") {
		switch (dualBound.toLowerCase()) {
			case "":
			case "na":
			case "nan":
			case "-nan":
				dualBound = direction === "max" ? Infinity : -Infinity;
				break;
			case "inf":
			case "+inf":
				dualBound = Infinity;
				break;
			case "-inf":
				dualBound = -Infinity;
				break;
			default:
				dualBound = Number(dualBound);
		}
	}
	return dualBound.toExponential(6);
}

/**
 * This function calculates the gap between two numbers, `a` and `b`, based on the given direction `dir` and tolerance `tol`.
 *
 * @param {number} a - The first number for the calculation.
 * @param {number} b - The second number for the calculation.
 * @param {string} dir - The direction of the calculation. If "max", the values of `a` and `b` are switched.
 * @param {number} tol - The tolerance level to check if `a` and `b` are approximately equal.
 *
 * @returns {number} - Returns the gap between `a` and `b`.
 * If `a` and `b` are approximately equal (within `tol`), it returns 0.
 * If the minimum absolute value of `a` and `b` is less than `tol`, or if either `a` or `b` is Infinity,
 * or if `a` and `b` have different signs, or if either `a` or `b` is NaN, it returns Infinity.
 * Otherwise, it returns the relative difference between `a` and `b` divided by the minimum absolute
 * value of `a` and `b`, rounded to 7 decimal places.
 * If the result is -0, it converts it to 0.
 */
export function CalculateGap(
	a: number | string,
	b: number | string,
	dir: string,
	tol = Values.TOLERANCE_LEVEL
): number {
	function AreValuesEffectivelyEqual(
		a: number,
		b: number,
		tol: number
	): boolean {
		return Math.abs(a - b) < tol;
	}

	function IsGapCalculationNotApplicable(
		a: number,
		b: number,
		tol: number
	): boolean {
		return (
			isNaN(a) ||
			isNaN(b) ||
			Math.min(Math.abs(a), Math.abs(b)) < tol ||
			(a === Infinity && b === Infinity) ||
			a === Infinity ||
			b === Infinity ||
			a * b < 0
		);
	}

	function ComputeGap(a: number, b: number): number {
		const gap = Math.abs((a - b) / Math.min(Math.abs(a), Math.abs(b)));
		return Math.round(gap * 10000) / 100;
	}

	// Adjusts a and b based on the direction.
	if (dir === "max") {
		[a, b] = [b, a];
	}

	// Check if the values are effectively equal.
	if (AreValuesEffectivelyEqual(Number(a), Number(b), tol)) {
		return 0.0;
	}

	// Check if the gap calculation is not applicable.
	if (IsGapCalculationNotApplicable(Number(a), Number(b), tol)) {
		return Infinity;
	}

	// Compute and return the gap.
	return ComputeGap(Number(a), Number(b));
}

/**
 * This function sets a model status message based on an input parameter 'modelStatus'.
 *
 * @param {number | string} modelStatus - A number or string input that represents the initial model status.
 *
 * @returns {string} modelStatus - The calculated model status message in form of a string.
 */
export function SetModelStatus(modelStatus: number | string): string {
	const statusMap: { [key: number]: string } = {
		1: "Optimal",
		2: "Locally Optimal",
		3: "Unbounded",
		4: "Infeasible",
		5: "Locally Infeasible",
		6: "Intermediate Infeasible",
		7: "Feasible Solution",
		8: "Integer Solution",
		9: "Intermediate Non-integer",
		10: "Integer Infeasible",
		11: "Lic Problem - No Solution",
		12: "Error Unknown",
		13: "Error No Solution",
		14: "No Solution Returned",
		15: "Solved Unique",
		16: "Solved",
		17: "Solved Singular",
		18: "Unbounded - No Solution",
		19: "Infeasible - No Solution"
	};

	if (typeof modelStatus === "string") {
		modelStatus = parseInt(modelStatus);
	}
	return statusMap[modelStatus] || "Unknown Error";
}

/**
 * This function sets a solver status message based on an input parameter 'solverStatus'.
 *
 * @param {number | string} solverStatus - A number or string input that represents the initial solver status.
 *
 * @returns {string} solverStatus - The calculated solver status message in form of a string.
 */
export function SetSolverStatus(solverStatus: number | string): string {
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

	if (typeof solverStatus === "string") {
		solverStatus = parseInt(solverStatus);
	}
	return statusMap[solverStatus] || "Unknown Error";
}

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
export function AnalyzeDataByCategory(
	resultsData: TraceData[],
	category: string,
	filterType?: string
): {
	[SolverName: string]: StatisticsColumns;
} {
	if (filterType && filterType !== "None") {
		resultsData = FilterByType(filterType, resultsData);
		console.log("Filtered values: ", resultsData, "Filter type: ", filterType);
	}

	const categoryValues = resultsData.reduce((acc, curr) => {
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
 * TODO: Still in progress, verify the filter types and update the function accordingly.
 * @param filterType
 */
function FilterByType(
	filterType: string,
	categoryValues: TraceData[]
): TraceData[] {
	console.log(categoryValues);
	switch (filterType) {
		case "no_fail_by_all_solver":
			return (categoryValues = categoryValues.filter(
				(obj) => obj["SolverStatus"] === "Normal Completion"
			));
		case "time_greater_than_10_by_at_least_one_solver_and_no_fail":
			return (categoryValues = categoryValues.filter(
				(obj) =>
					obj["SolverTime"] > 10 && obj["SolverStatus"] === "Normal Completion"
			));
		case "gap_less_than_or_equal_to_0.1002_percent_and_no_fail":
			return (categoryValues = categoryValues.filter(
				(obj) =>
					obj["PrimalDualGap"] <= 0.1002 &&
					obj["SolverStatus"] === "Normal Completion"
			));
		case "gap_less_than_or_equal_to_1_percent_and_no_fail":
			return (categoryValues = categoryValues.filter(
				(obj) =>
					obj["PrimalDualGap"] <= 1 &&
					obj["SolverStatus"] === "Normal Completion"
			));
		case "gap_less_than_or_equal_to_10_percent_and_no_fail":
			return (categoryValues = categoryValues.filter(
				(obj) =>
					obj["PrimalDualGap"] <= 10 &&
					obj["SolverStatus"] === "Normal Completion"
			));
		case "within_0.1002_percent_of_known_optimal_value_and_no_fail":
			return (categoryValues = categoryValues.filter(
				(obj) =>
					obj["PrimalDualGap"] <= 0.1002 &&
					obj["SolverStatus"] === "Normal Completion"
			));
		case "within_1_percent_of_known_optimal_value_and_no_fail":
			return (categoryValues = categoryValues.filter(
				(obj) =>
					obj["PrimalDualGap"] <= 1 &&
					obj["SolverStatus"] === "Normal Completion"
			));
		case "within_10_percent_of_known_optimal_value_and_no_fail":
			return (categoryValues = categoryValues.filter(
				(obj) =>
					obj["PrimalDualGap"] <= 10 &&
					obj["SolverStatus"] === "Normal Completion"
			));
		case "no_fail":
			return (categoryValues = categoryValues.filter(
				(obj) => obj["SolverStatus"] === "Normal Completion"
			));
		case "time_greater_than_10_by_at_least_one_solver_and_no_fail":
			return (categoryValues = categoryValues.filter(
				(obj) =>
					obj["SolverTime"] > 10 && obj["SolverStatus"] === "Normal Completion"
			));
		case "gap_less_than_or_equal_to_0.1002_percent_and_not_failed":
			return (categoryValues = categoryValues.filter(
				(obj) =>
					obj["PrimalDualGap"] <= 0.1002 &&
					obj["SolverStatus"] === "Normal Completion"
			));
		case "gap_less_than_or_equal_to_1_percent_and_not_failed":
			return (categoryValues = categoryValues.filter(
				(obj) =>
					obj["PrimalDualGap"] <= 1 &&
					obj["SolverStatus"] === "Normal Completion"
			));
		case "gap_less_than_or_equal_to_10_percent_and_not_failed":
			return (categoryValues = categoryValues.filter(
				(obj) =>
					obj["PrimalDualGap"] <= 10 &&
					obj["SolverStatus"] === "Normal Completion"
			));
		case "within_0.1002_percent_of_known_optimal_value_and_not_failed":
			return (categoryValues = categoryValues.filter(
				(obj) =>
					obj["PrimalDualGap"] <= 0.1002 &&
					obj["SolverStatus"] === "Normal Completion"
			));
		case "within_1_percent_of_known_optimal_value_and_not_failed":
			return (categoryValues = categoryValues.filter(
				(obj) =>
					obj["PrimalDualGap"] <= 1 &&
					obj["SolverStatus"] === "Normal Completion"
			));
		case "within_10_percent_of_known_optimal_value_and_not_failed":
			return (categoryValues = categoryValues.filter(
				(obj) =>
					obj["PrimalDualGap"] <= 10 &&
					obj["SolverStatus"] === "Normal Completion"
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
 * This function is used to structure trace data (log of the solver) into a more accessible object
 * structure. It takes an array of objects (traceData) and returns an object.
 *
 * The returned object has a unique key for each solver and the value is an array of objects, each containing a 'time'
 * and 'InputFileName'. All results with missing SolverTime, or with a failed status, get a default value of 1000.
 * A fail is if the termination or solver status is not "Normal Completion".
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
	let defaultMaximumTime: number;
	let primalGapToCompare: number;
	let terminationStatus: string;

	if (!gapLimit || gapLimit < 0) {
		primalGapToCompare = 0.01;
		gapLimitDirectInput.value = "0.01";
	} else {
		primalGapToCompare = gapLimit;
	}

	if (!defaultTime || defaultTime < 0) {
		defaultMaximumTime = Values.DEFAULT_TIME;
		defaultTimeDirectInput.value = Values.DEFAULT_TIME.toString();
	} else {
		defaultMaximumTime = defaultTime;
	}

	if (!terminationStatusSelector) {
		terminationStatus = "Normal Completion";
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

	let filteredSolvers = traceData.reduce(
		(
			acc: { [key: string]: { time: number; InputFileName: string }[] },
			obj: object
		): { [key: string]: { time: number; InputFileName: string }[] } => {
			if (!acc[obj["SolverName"]]) {
				acc[obj["SolverName"]] = [];
			}
			if (!isNaN(Number(obj["SolverTime"]))) {
				if (
					obj[selectedGapType] <= primalGapToCompare &&
					Number(obj["SolverTime"]) <= defaultMaximumTime &&
					obj["SolverStatus"] === terminationStatus
				) {
					acc[obj["SolverName"]].push({
						time: Number(obj["SolverTime"]),
						InputFileName: obj["InputFileName"]
					});
				}
			} else {
				acc[obj["SolverName"]].push({
					time: defaultMaximumTime,
					InputFileName: obj["InputFileName"]
				});
			}
			return acc;
		},
		{}
	);
	const virtualSolvers = ComputeVirtualTimes(filteredSolvers);
	const result = { ...filteredSolvers, ...virtualSolvers };
	return result;
}

/**
 * This function is used to structure trace data (log of the solver) into a more accessible object
 * structure. It takes an array of objects (traceData) and returns an object.
 *
 * The returned object has a unique key for each solver and the value is an array of objects, each containing a 'time'
 * @param {string} solver1 - The name of the first solver to compare.
 * @param {string} solver2 - The name of the second solver to compare.
 * @param solverTimes - An object with 'time' and 'InputFileName' properties.
 * @returns {object} - An object with solver names as keys. Each key points to an array of objects where each object
 * contains 'time1', 'time2', 'InputFileName', 'comparison' property of the corresponding solver.
 */
export function CompareSolvers(
	solver1: string,
	solver2: string,
	solverTimes: object
): ComparisonSummary {
	const results1 = solverTimes[solver1];
	const results2 = solverTimes[solver2];

	const comparisonSummary = { better: 0, worse: 0, equal: 0, details: [] };

	results1.forEach((result1: { InputFileName: string; time: number }) => {
		const result2 = results2.find(
			(r: { InputFileName: string }) =>
				r.InputFileName === result1.InputFileName
		);
		if (result2) {
			if (result1.time < result2.time) {
				comparisonSummary.better++;
				comparisonSummary.details.push({
					InputFileName: result1.InputFileName,
					time1: result1.time,
					time2: result2.time,
					comparison: "better"
				});
			} else if (result1.time > result2.time) {
				comparisonSummary.worse++;
				comparisonSummary.details.push({
					InputFileName: result1.InputFileName,
					time1: result1.time,
					time2: result2.time,
					comparison: "worse"
				});
			} else {
				comparisonSummary.equal++;
				comparisonSummary.details.push({
					InputFileName: result1.InputFileName,
					time1: result1.time,
					time2: result2.time,
					comparison: "equal"
				});
			}
		}
	});

	return comparisonSummary;
}

/**
 * Extracts unique objects from the given traceData array based on the "InputFileName" property.
 * @param traceData - The array of objects to extract unique objects from.
 * @returns An array of unique objects based on the "InputFileName" property.
 */
export function ExtractUniqueProblems(traceData: TraceData[]): object[] {
	const unique: object = {};
	traceData.forEach((item) => {
		if (!unique[item["InputFileName"]]) {
			unique[item["InputFileName"]] = {
				InputFileName: item["InputFileName"],
				Direction: item["Direction"],
				NumberOfEquations: item["NumberOfEquations"],
				NumberOfVariables: item["NumberOfVariables"],
				NumberOfDiscreteVariables: item["NumberOfDiscreteVariables"],
				NumberOfNonZeros: item["NumberOfNonZeros"],
				NumberOfNonlinearNonZeros: item["NumberOfNonlinearNonZeros"],
				PrimalBoundProblem: item["PrimalBoundProblem"],
				DualBoundProblem: item["DualBoundProblem"]
			};
		}
	});
	return Object.values(unique);
}

/**
 * This function applies statistical calculations for the instance attributes.
 * @param data - The data to apply calculations to.
 * @returns An object containing the calculated statistics.
 */
export function CalculateInstanceAttributes(data: object[]): {
	[key: string]: StatisticsColumns;
} {
	const results: {
		[key: string]: StatisticsColumns;
	} = {};
	const keys = Object.keys(data[0]).filter((key) => key !== "InputFileName");

	keys.forEach((key) => {
		const values: number[] = data
			.map((item) => Number(item[key]))
			.filter((value) => !isNaN(value));

		if (values.length > 0) {
			const avgValue = math.format(math.mean(values), { precision: 7 });
			const minValue = math.format(math.min(values), { precision: 7 });
			const maxValue = math.format(math.max(values), { precision: 7 });
			const stdValue = math.format(math.std(values), { precision: 7 });
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

			const countValue = values.length;

			results[key] = {
				countValue,
				avgValue: Number(avgValue),
				minValue: Number(minValue),
				maxValue: Number(maxValue),
				stdValue: Number(stdValue),
				p10Value: Number(p10Value),
				p25Value: Number(p25Value),
				p50Value: Number(p50Value),
				p75Value: Number(p75Value),
				p90Value: Number(p90Value)
			};
		}
	});

	return results;
}

/**
 * This function applies statistical calculations for the solve attributes.
 * @param data - The data to apply calculations to.
 * @param specificKeys - The keys to calculate the metrics for.
 * @returns An object containing the calculated statistics.
 */
export function CalculateSolveAttributes(
	data: object[],
	specificKeys: string[]
): {
	[key: string]: StatisticsColumns;
} {
	const results: {
		[key: string]: StatisticsColumns;
	} = {};

	specificKeys.forEach((key) => {
		const values: number[] = data
			.map((item) => parseFloat(item[key]))
			.filter((value) => !isNaN(value));

		if (values.length > 0) {
			results[key] = {
				countValue: values.length,
				avgValue: Number(math.format(math.mean(values), { precision: 7 })),
				minValue: Number(math.format(math.min(values), { precision: 7 })),
				maxValue: Number(math.format(math.max(values), { precision: 7 })),
				stdValue: Number(math.format(math.std(values), { precision: 7 })),
				p10Value: Number(
					math.format(math.quantileSeq(values, 0.1), { precision: 7 })
				),
				p25Value: Number(
					math.format(math.quantileSeq(values, 0.25), { precision: 7 })
				),
				p50Value: Number(
					math.format(math.quantileSeq(values, 0.5), { precision: 7 })
				),
				p75Value: Number(
					math.format(math.quantileSeq(values, 0.75), { precision: 7 })
				),
				p90Value: Number(
					math.format(math.quantileSeq(values, 0.9), { precision: 7 })
				)
			};
		}
	});

	return results;
}
