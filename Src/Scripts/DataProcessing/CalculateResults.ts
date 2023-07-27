import * as math from "mathjs";

// Problem - Direction
// https://github.com/coin-or/Paver/blob/783a6f5d0d3782a168d0ef529d01bcbda91ea8a4/src/paver/readgamstrace.py#L261-L262
export function CalculateDirection(Direction: number | string): string {
	Direction = 1 - 2 * Number(Direction);
	if (Direction == -1) {
		Direction = "max";
		return Direction;
	} else {
		Direction = "min";
		return Direction;
	}
}

// Problem & Solver - Primal Bound
// https://github.com/coin-or/Paver/blob/783a6f5d0d3782a168d0ef529d01bcbda91ea8a4/src/paver/readgamstrace.py#L275-L282
export function CalculatePrimalBound(
	PrimalBound: number | string,
	Direction: string
): number | string {
	if (typeof PrimalBound === "string") {
		if (
			PrimalBound === "" ||
			PrimalBound === "NA" ||
			PrimalBound === "nan" ||
			PrimalBound === "-nan"
		) {
			if (Direction === "max") {
				PrimalBound = -1 * Infinity;
			} else if (Direction === "min") {
				PrimalBound = Infinity;
			}
		} else if (
			PrimalBound.toLowerCase() === "inf" ||
			PrimalBound.toLowerCase() === "+inf"
		) {
			PrimalBound = Infinity;
		} else if (PrimalBound.toLocaleLowerCase() === "-inf") {
			PrimalBound = -1 * Infinity;
		} else {
			PrimalBound = math.bignumber(PrimalBound).toNumber();
		}
	}
	return PrimalBound;
}

// Problem & Solver - Dual Bound
// https://github.com/coin-or/Paver/blob/783a6f5d0d3782a168d0ef529d01bcbda91ea8a4/src/paver/readgamstrace.py#L275-L282
export function CalculateDualBound(
	DualBound: number | string,
	Direction: string
): number | string {
	if (typeof DualBound === "string") {
		if (
			DualBound === "" ||
			DualBound === "NA" ||
			DualBound === "nan" ||
			DualBound === "-nan"
		) {
			if (Direction === "max") {
				DualBound = Infinity;
			} else if (Direction === "min") {
				DualBound = -1 * Infinity;
			}
		} else if (
			DualBound.toLowerCase() === "inf" ||
			DualBound.toLowerCase() === "+inf"
		) {
			DualBound = Infinity;
		} else if (DualBound.toLowerCase() === "-inf") {
			DualBound = -1 * Infinity;
		} else {
			DualBound = math.bignumber(DualBound).toNumber();
		}
	}
	return DualBound;
}

// Solver- Termstatus
// https://github.com/coin-or/Paver/blob/783a6f5d0d3782a168d0ef529d01bcbda91ea8a4/src/paver/readgamstrace.py#L90-L103
export function SetTermStatus(TerminationStatus: number | string): string {
	if (typeof TerminationStatus === "string") {
		TerminationStatus = parseInt(TerminationStatus);
	}
	switch (TerminationStatus) {
		case 1:
			TerminationStatus = "Normal";
			break;
		case 2:
			TerminationStatus = "IterationLimit";
			break;
		case 3:
			TerminationStatus = "TimeLimit";
			break;
		case 4:
		case 7:
		case 12:
			TerminationStatus = "Other";
			break;
		case 5:
			TerminationStatus = "OtherLimit";
			break;
		case 6:
			TerminationStatus = "CapabilityProblem";
			break;
		case 8:
			TerminationStatus = "UserInterrupt";
			break;
		default:
			TerminationStatus = "Error";
			break;
	}
	return TerminationStatus;
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
	const Higher = Math.max(a, b);
	const Lower = Math.min(a, b);
	return Number((Higher - Lower).toFixed(7));
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
	ResultsData: any[],
	Category: string
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
	const SolverTimes: { [SolverName: string]: number[] } = ResultsData.reduce(
		(acc, curr) => {
			const parsedValue = Number(curr[Category]);

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
	const SolverTimeStats: {
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

	for (const SolverName in SolverTimes) {
		if (Object.prototype.hasOwnProperty.call(SolverTimes, SolverName)) {
			const times = SolverTimes[SolverName];
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

			SolverTimeStats[SolverName] = {
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
	return SolverTimeStats;
}

/**
 * Extract all solver times from each object per solver into an object.
 * Skip those Time[s] that are "NA" and NaN.
 */
export function ExtractAllSolverTimes(TrcData: object[]): object {
	const Result = TrcData.reduce(
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
					const InputFileName = obj["InputFileName"];
					acc[obj.SolverName].push({ time, InputFileName });
				}
			}
			return acc;
		},
		{}
	);

	return Result;
}
