import * as math from "mathjs";

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
	if (direction == -1) {
		direction = "max";
		return direction;
	} else {
		direction = "min";
		return direction;
	}
}

/**
 * Converts the `primalBound` argument into a corresponding numerical value based on its type and value.
 * This function is used to calculate the primal bound of an optimization problem, which can either be a maximization or minimization problem.
 *
 * @export
 * @param {(number | string)} primalBound - The primal bound of the problem. This value can be a number or a string.
 * If it's a string, it can represent a number, 'NA', 'nan', 'inf', '+inf', '-inf', '-nan', or an empty string.
 *
 * @param {string} direction - The optimization direction, which can either be 'max' for maximization problems or 'min' for minimization problems.
 *
 * @returns {(number | string)} - Returns a numerical value based on the input `primalBound`.
 * If the primal bound is an empty string, 'NA', 'nan', or '-nan', it returns `-Infinity` for 'max' direction and `Infinity` for 'min' direction.
 * If the primal bound is 'inf' or '+inf', it returns `Infinity`, and for '-inf', it returns `-Infinity`.
 * Otherwise, it converts the primal bound into a number using `math.bignumber(primalBound).toNumber()`.
 */
export function CalculatePrimalBound(
	primalBound: number | string,
	direction: string
): number | string {
	if (typeof primalBound === "string") {
		if (
			primalBound === "" ||
			primalBound === "NA" ||
			primalBound === "nan" ||
			primalBound === "-nan"
		) {
			if (direction === "max") {
				primalBound = -1 * Infinity;
			} else if (direction === "min") {
				primalBound = Infinity;
			}
		} else if (
			primalBound.toLowerCase() === "inf" ||
			primalBound.toLowerCase() === "+inf"
		) {
			primalBound = Infinity;
		} else if (primalBound.toLocaleLowerCase() === "-inf") {
			primalBound = -1 * Infinity;
		} else {
			primalBound = math.bignumber(primalBound).toNumber();
		}
	}
	return primalBound;
}

/**
 * Converts the `dualBound` argument into a corresponding numerical value based on its type and value.
 * This function is used to calculate the dual bound of an optimization problem, which can either be a maximization or minimization problem.
 *
 * @export
 * @param {(number | string)} dualBound - The dual bound of the problem. This value can be a number or a string.
 * If it's a string, it can represent a number, 'NA', 'nan', 'inf', '+inf', '-inf', '-nan', or an empty string.
 *
 * @param {string} direction - The optimization direction, which can either be 'max' for maximization problems or 'min' for minimization problems.
 *
 * @returns {(number | string)} - Returns a numerical value based on the input `dualBound`.
 * If the dual bound is an empty string, 'NA', 'nan', or '-nan', it returns `Infinity` for 'max' direction and `-Infinity` for 'min' direction.
 * If the dual bound is 'inf' or '+inf', it returns `Infinity`, and for '-inf', it returns `-Infinity`.
 * Otherwise, it converts the dual bound into a number using `math.bignumber(dualBound).toNumber()`.
 */
export function CalculateDualBound(
	dualBound: number | string,
	direction: string
): number | string {
	if (typeof dualBound === "string") {
		if (
			dualBound === "" ||
			dualBound === "NA" ||
			dualBound === "nan" ||
			dualBound === "-nan"
		) {
			if (direction === "max") {
				dualBound = Infinity;
			} else if (direction === "min") {
				dualBound = -1 * Infinity;
			}
		} else if (
			dualBound.toLowerCase() === "inf" ||
			dualBound.toLowerCase() === "+inf"
		) {
			dualBound = Infinity;
		} else if (dualBound.toLowerCase() === "-inf") {
			dualBound = -1 * Infinity;
		} else {
			dualBound = math.bignumber(dualBound).toNumber();
		}
	}
	return dualBound;
}

/**
 * Calculates the gap between two numbers, `a` and `b`, based on the given direction `dir` and tolerance `tol`.
 *
 * @export
 * @param {number} a - The first number for the calculation.
 * @param {number} b - The second number for the calculation.
 * @param {string} dir - The direction of the calculation. If "max", the values of `a` and `b` are switched.
 * @param {number} [tol=1e-9] - The tolerance level to check if `a` and `b` are approximately equal.
 *
 * @returns {number} - Returns the gap between `a` and `b`.
 * If `a` and `b` are approximately equal (within `tol`), it returns 0.
 * If the minimum absolute value of `a` and `b` is less than `tol`, or if either `a` or `b` is Infinity, or if `a` and `b` have different signs, or if either `a` or `b` is NaN, it returns Infinity.
 * Otherwise, it returns the relative difference between `a` and `b` divided by the minimum absolute value of `a` and `b`, rounded to 7 decimal places.
 */
export function CalculateGap(
	a: number,
	b: number,
	dir: string,
	tol = 1e-9
): number {
	// If dir is negative, switch the values to do DualBound - PrimalBound.
	if (dir === "max") {
		[a, b] = [b, a];
	}

	// Check if the values are equal within tolerance
	if (math.abs(a - b) < tol) {
		return 0.0;
	}

	if (
		math.min(math.abs(a), math.abs(b)) < tol ||
		a === Infinity ||
		b === Infinity ||
		a * b < 0
	) {
		return Infinity;
	}

	if (isNaN(a) || isNaN(b)) {
		return Infinity;
	}

	// Compute and return the gap between the values
	return Number(((a - b) / math.min(math.abs(a), math.abs(b))).toFixed(7));
}

/**
 * Calculates the absolute difference between two numbers, `a` and `b`, to a precision of 7 decimal places.
 *
 * @export
 * @param {number} a - The first number for the calculation.
 * @param {number} b - The second number for the calculation.
 *
 * @returns {number} - Returns the absolute difference between `a` and `b`, rounded to 7 decimal places.
 * The function first determines the larger (higher) and smaller (lower) number between `a` and `b`,
 * then subtracts the lower from the higher to get the absolute difference.
 */
export function CalculateDifference(a: number, b: number): number {
	const higher = Math.max(a, b);
	const lower = Math.min(a, b);
	return Number((higher - lower).toFixed(7));
}

/**
 * Calculates the gap percentage between two numbers, `a` and `b`, based on the given direction `dir`.
 *
 * @export
 * @param {number} a - The first number for the calculation.
 * @param {number} b - The second number for the calculation.
 * @param {string} dir - The direction of the calculation. If "max", the values of `a` and `b` are switched.
 *
 * @returns {number} - Returns the gap percentage between `a` and `b`.
 * If either `a` or `b` is Infinity, it returns either 0 (if both are equal) or the subtraction of `a` and `b` multiplied by 100, rounded to 7 decimal places.
 * Otherwise, it returns the relative difference between `a` and `b` divided by the maximum absolute value of `a` and `b` or 1.0, then multiplied by 100, rounded to 7 decimal places.
 */
export function CalculateGapPercentage(
	a: number,
	b: number,
	dir: string
): number {
	// If dir is negative, switch the values to do DualBound - PrimalBound.
	if (dir === "max") {
		[a, b] = [b, a];
	}

	if (Math.abs(a) === Infinity || Math.abs(b) === Infinity) {
		if (a === b) {
			return 0.0;
		} else {
			return Number((a - b * 100).toFixed(7));
		}
	} else {
		return Number(
			(((a - b) / math.max(math.abs(a), math.abs(b), 1.0)) * 100).toFixed(7)
		);
	}
}

/**
 * This function sets a termination status message based on an input parameter 'terminationStatus'.
 *
 * @param {number | string} terminationStatus - A number or string input that represents the initial termination status.
 *                                              This is then processed to define the final termination status message.
 *
 * @returns {string} terminationStatus - The calculated termination status message in form of a string.
 *                                       The possible return values include 'Normal', 'IterationLimit', 'TimeLimit',
 *                                       'Other', 'OtherLimit', 'CapabilityProblem', 'UserInterrupt', and 'Error'.
 */
export function SetTermStatus(terminationStatus: number | string): string {
	if (typeof terminationStatus === "string") {
		terminationStatus = parseInt(terminationStatus);
	}
	switch (terminationStatus) {
		case 1:
			terminationStatus = "Normal";
			break;
		case 2:
			terminationStatus = "IterationLimit";
			break;
		case 3:
			terminationStatus = "TimeLimit";
			break;
		case 4:
		case 7:
		case 12:
			terminationStatus = "Other";
			break;
		case 5:
			terminationStatus = "OtherLimit";
			break;
		case 6:
			terminationStatus = "CapabilityProblem";
			break;
		case 8:
			terminationStatus = "UserInterrupt";
			break;
		default:
			terminationStatus = "Error";
			break;
	}
	return terminationStatus;
}

/**
 * `AnalyzeDataByCategory` function extracts the values of the specified category for each solver from the results data,
 * calculates the statistical measures, and returns these statistics in a structured format.
 *
 * @param {any[]} resultsData - The array of result objects where each object corresponds to a particular solver's output.
 * @param {string} category - The category whose values are to be analyzed. The category could be time, memory, etc.
 *
 * @returns {object} An object with solver names as keys. Each key points to an object that represents the statistical
 * measures (average, min, max, standard deviation, sum, 10th percentile, 25th percentile, 50th percentile, 75th percentile,
 * and 90th percentile) calculated from the values of the specified category for the corresponding solver. If the value of
 * the category is not a finite number, the instance is not added to the final result.
 */
export function AnalyzeDataByCategory(
	resultsData: any[],
	category: string
): {
	[SolverName: string]: {
		average: number;
		min: number;
		max: number;
		std: number;
		sum: number;
		percentile_10: number;
		percentile_25: number;
		percentile_50: number;
		percentile_75: number;
		percentile_90: number;
	};
} {
	const solverTimes: { [SolverName: string]: number[] } = resultsData.reduce(
		(acc, curr) => {
			const parsedValue = Number(curr[category]);

			if (isFinite(parsedValue)) {
				if (!acc[curr.SolverName]) {
					acc[curr.SolverName] = [];
				}
				acc[curr.SolverName].push(parsedValue);
			}
			return acc;
		},
		{}
	);

	const solverTimeStats: {
		[SolverName: string]: {
			average: number;
			min: number;
			max: number;
			std: number;
			sum: number;
			percentile_10: number;
			percentile_25: number;
			percentile_50: number;
			percentile_75: number;
			percentile_90: number;
		};
	} = {};

	for (const solverName in solverTimes) {
		if (Object.prototype.hasOwnProperty.call(solverTimes, solverName)) {
			const times = solverTimes[solverName];
			const avgValue = Number(math.format(math.mean(times), { precision: 7 }));
			const minValue = Number(math.format(math.min(times), { precision: 7 }));
			const maxValue = Number(math.format(math.max(times), { precision: 7 }));
			const stdValue = Number(math.format(math.std(times), { precision: 7 }));
			const sumValue = Number(math.format(math.sum(times), { precision: 7 }));
			const p10Value = Number(
				math.format(math.quantileSeq(times, 0.1), { precision: 7 })
			);
			const p25Value = Number(
				math.format(math.quantileSeq(times, 0.25), { precision: 7 })
			);
			const p50Value = Number(
				math.format(math.quantileSeq(times, 0.5), { precision: 7 })
			);
			const p75Value = Number(
				math.format(math.quantileSeq(times, 0.75), { precision: 7 })
			);
			const p90Value = Number(
				math.format(math.quantileSeq(times, 0.9), { precision: 7 })
			);

			solverTimeStats[solverName] = {
				average: avgValue,
				min: minValue,
				max: maxValue,
				std: stdValue,
				sum: sumValue,
				percentile_10: p10Value,
				percentile_25: p25Value,
				percentile_50: p50Value,
				percentile_75: p75Value,
				percentile_90: p90Value
			};
		}
	}
	return solverTimeStats;
}

/**
 * `ExtractAllSolverTimes` function is used to structure trace data (log of the solver) into a more accessible object
 * structure. It takes an array of objects (traceData) and returns an object.
 *
 * The returned object has a unique key for each solver and the value is an array of objects, each containing a 'time'
 * and 'InputFileName'.
 *
 * @param {object[]} traceData - An array of objects where each object represents an instance of trace data.
 *
 * @returns {object} - An object with solver names as keys. Each key points to an array of objects where each object
 * contains 'time' and 'InputFileName' property of the corresponding solver. If the time value is 'NA' or is not a number,
 * the instance is not added to the final result.
 */
export function ExtractAllSolverTimes(traceData: object[]): object {
	const result = traceData.reduce(
		(
			acc: { [key: string]: { time: number; InputFileName: string }[] },
			obj: any
		): { [key: string]: { time: number; InputFileName: string }[] } => {
			if (!acc[obj.SolverName]) {
				acc[obj.SolverName] = [];
			}
			if (obj["Time[s]"] !== "NA") {
				const time = math.bignumber(obj["Time[s]"]).toNumber();
				if (!isNaN(time)) {
					const inputFileName = obj["InputFileName"];
					acc[obj.SolverName].push({ time, InputFileName: inputFileName });
				}
			}
			return acc;
		},
		{}
	);

	return result;
}
