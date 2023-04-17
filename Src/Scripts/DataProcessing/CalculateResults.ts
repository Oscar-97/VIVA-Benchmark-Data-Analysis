import * as math from "mathjs";
// Problem - Direction
// https://github.com/coin-or/Paver/blob/783a6f5d0d3782a168d0ef529d01bcbda91ea8a4/src/paver/readgamstrace.py#L261-L262
export function CalculateDirection(Direction: number | string): number {
  if (Direction === "" || Direction === "NA") {
    Direction = 1;
  } else {
    if (typeof Direction === "number") {
      Direction = 1 - 2 * Direction;
    } else if (typeof Direction === "string") {
      Direction = 1 - 2 * parseFloat(Direction);
    }
  }
  return Direction;
}

// Problem & Solver - Primal Bound
// https://github.com/coin-or/Paver/blob/783a6f5d0d3782a168d0ef529d01bcbda91ea8a4/src/paver/readgamstrace.py#L275-L282
export function CalculatePrimalBound(
  PrimalBound: number | string,
  Direction: number
): number {
  if (PrimalBound === "" || PrimalBound === "NA") {
    PrimalBound = Direction * Infinity;
  } else if (typeof PrimalBound === "string") {
    PrimalBound = parseFloat(PrimalBound);
  }
  return PrimalBound;
}

// Problem & Solver - Dual Bound
// https://github.com/coin-or/Paver/blob/783a6f5d0d3782a168d0ef529d01bcbda91ea8a4/src/paver/readgamstrace.py#L275-L282
export function CalculateDualBound(
  DualBound: number | string,
  Direction: number
): number {
  if (DualBound === "" || DualBound === "NA") {
    DualBound = -1 * Direction * Infinity;
  } else if (typeof DualBound === "string") {
    DualBound = parseFloat(DualBound);
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
export function CalculateGap(a: number, b: number, tol = 1e-9): number {
  // Check if the values are equal within tolerance
  if (a === b || Math.abs(a - b) <= tol) {
    return 0.0;
  }

  // Check if either value is close to zero or infinity, or if the values have opposite signs
  if (
    Math.abs(a) <= tol ||
    Math.abs(b) <= tol ||
    Math.abs(a) >= Infinity ||
    Math.abs(b) >= Infinity ||
    a * b < 0.0
  ) {
    return Infinity;
  }

  // Compute and return the gap between the values
  return (a - b) / Math.min(Math.abs(a), Math.abs(b));
}

// Solver - Gap[%]
// https://github.com/coin-or/Paver/blob/783a6f5d0d3782a168d0ef529d01bcbda91ea8a4/src/paver/utils.py#L21-L39
export function CalculateGapPercentage(a: number, b: number): number {
  let Gap: number;
  if (Math.abs(a) >= Infinity || Math.abs(b) >= Infinity) {
    if (a === b) {
      Gap = 0.0;
      return Gap;
    } else {
      Gap = a - b;
      return Gap;
    }
  } else {
    Gap = (a - b) / Math.max(Math.abs(a), Math.abs(b), 1.0);
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
      const parsedValue = parseFloat(curr[Category]);

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
 * Extract all solver times to a separate array.
 */
export function ExtractAllSolverTimes(TrcData: object[]) {
  const result = TrcData.reduce(
    (acc: { [key: string]: number[] }, obj: { [key: string]: any }) => {
      if (!acc[obj["SolverName"]]) {
        acc[obj["SolverName"]] = [];
      }
      const time = parseFloat(obj["Time[s]"]);
      if (!isNaN(time)) {
        acc[obj["SolverName"]].push(time);
      }
      return acc;
    },
    {}
  );

  return result;
}
