import * as math from "mathjs";

// Problem - Direction
// https://github.com/coin-or/Paver/blob/783a6f5d0d3782a168d0ef529d01bcbda91ea8a4/src/paver/readgamstrace.py#L261-L262
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

// Problem & Solver - Primal Bound
// https://github.com/coin-or/Paver/blob/783a6f5d0d3782a168d0ef529d01bcbda91ea8a4/src/paver/readgamstrace.py#L275-L282
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

// Problem & Solver - Dual Bound
// https://github.com/coin-or/Paver/blob/783a6f5d0d3782a168d0ef529d01bcbda91ea8a4/src/paver/readgamstrace.py#L275-L282
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

// Solver- Termstatus
// https://github.com/coin-or/Paver/blob/783a6f5d0d3782a168d0ef529d01bcbda91ea8a4/src/paver/readgamstrace.py#L90-L103
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

// Solver - Primal and Dual Gap
// https://github.com/coin-or/Paver/blob/783a6f5d0d3782a168d0ef529d01bcbda91ea8a4/src/paver/utils.py#L46-L59
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

// Absolute difference.
export function CalculateDifference(a: number, b: number): number {
	const higher = Math.max(a, b);
	const lower = Math.min(a, b);
	return Number((higher - lower).toFixed(7));
}

// Solver - Gap[%]
// https://github.com/coin-or/Paver/blob/783a6f5d0d3782a168d0ef529d01bcbda91ea8a4/src/paver/utils.py#L21-L39
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
 * Get the statistics for a selected category.
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
	/**
	 * Get all the [Times[s]] from the results data.
	 */
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

	/**
	 * Calculate statistics.
	 */
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
 * Extract all solver times from each object per solver into an object.
 * Skip those Time[s] that are "NA" and NaN.
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
