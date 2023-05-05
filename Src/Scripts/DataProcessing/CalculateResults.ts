import * as math from "mathjs";
//import { bignumber } from "mathjs";

// Problem - Direction
// https://github.com/coin-or/Paver/blob/783a6f5d0d3782a168d0ef529d01bcbda91ea8a4/src/paver/readgamstrace.py#L261-L262
export function CalculateDirection(Direction: number | string): number | string {
  if (Direction === "" || Direction === "NA") {
    return "min";
  } else if (Direction === -1) {
    return "max";
  }
  else {
    const bigDirection = math.bignumber(Direction);
    const result = math.bignumber(1).minus(bigDirection.times(2));
    return result.toNumber();
  }
}

// Problem & Solver - Primal Bound
// https://github.com/coin-or/Paver/blob/783a6f5d0d3782a168d0ef529d01bcbda91ea8a4/src/paver/readgamstrace.py#L275-L282
export function CalculatePrimalBound(
  PrimalBound: number | string,
  Direction: number
): number {
  if (typeof PrimalBound === "string") {
    if (
      PrimalBound === "" ||
      PrimalBound === "NA" ||
      PrimalBound === "nan" ||
      PrimalBound === "-nan"
    ) {
      PrimalBound = Direction * Infinity;
    } else if (PrimalBound.toLowerCase() === "inf" || PrimalBound.toLowerCase() === "+inf") {
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
  Direction: number
): number {
  if (typeof DualBound === "string") {
    if (
      DualBound === "" ||
      DualBound === "NA" ||
      DualBound === "nan" ||
      DualBound === "-nan"
    ) {
      DualBound = -1 * Direction * Infinity;
    } else if (DualBound.toLowerCase() === "inf" || DualBound.toLowerCase() === "+inf") {
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
export function CalculateGap(a: number, b: number, dir: number, tol = 1e-9): number {
  // If dir is negative, switch the values.
  if (dir === -1) {
    a === b;
    b === a;
  }
  
  // Check if the values are equal within tolerance
  if (a === b || math.abs(a - b) <= tol) {
    return 0.0;
  }

  // Check if either value is close to zero or infinity, or if the values have opposite signs
  try {
    if (
      math.abs(a) <= tol ||
      math.abs(b) <= tol ||
      math.abs(a) >= Infinity ||
      math.abs(b) >= Infinity ||
      a * b < 0.0
    ) {
      return Infinity;
    }
  } catch (e) {
    console.log("A ", a, " B ", b);
    console.log(e);
  }

  // Compute and return the gap between the values
  return (a - b) / math.min(math.abs(a), math.abs(b));
}

// Solver - Gap[%]
// https://github.com/coin-or/Paver/blob/783a6f5d0d3782a168d0ef529d01bcbda91ea8a4/src/paver/utils.py#L21-L39
export function CalculateGapPercentage(a: number, b: number): number {
  let Gap: number;
  if (math.abs(a) >= Infinity || math.abs(b) >= Infinity) {
    if (a === b) {
      Gap = 0.0;
      return Gap;
    } else {
      Gap = a - b;
      return Gap;
    }
  } else {
    Gap = (a - b) / math.max(math.abs(a), math.abs(b), 1.0);
    return Gap;
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
      const avgValue = math.mean(times);
      const minValue = math.min(times);
      const maxValue = math.max(times);
      const stdValue = Number(math.std(times));
      const sumValue = math.sum(times);
      const p10Value = Number(math.quantileSeq(times, 0.1));
      const p25Value = Number(math.quantileSeq(times, 0.25));
      const p50Value = Number(math.quantileSeq(times, 0.5));
      const p75Value = Number(math.quantileSeq(times, 0.75));
      const p90Value = Number(math.quantileSeq(times, 0.9));

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
        percentile_90: p90Value,
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
  const result = TrcData.reduce(
    (
      acc: { [key: string]: number[] },
      obj: any
    ): { [key: string]: number[] } => {
      if (!acc[obj.SolverName]) {
        acc[obj.SolverName] = [];
      }
      if (obj["Time[s]"] !== "NA") {
        const time = math.bignumber(obj["Time[s]"]).toNumber();
        if (!isNaN(time)) {
          acc[obj.SolverName].push(time);
        }
      }
      return acc;
    },
    {}
  );

  return result;
}
