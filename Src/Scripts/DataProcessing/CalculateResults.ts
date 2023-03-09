// Problem - Direction
// https://github.com/coin-or/Paver/blob/783a6f5d0d3782a168d0ef529d01bcbda91ea8a4/src/paver/readgamstrace.py#L261-L262
export function CalculateDirection(Direction) {
  if (Direction === "" || Direction === "NA") {
    Direction = 1;
  } else {
    Direction = 1 - 2 * parseInt(Direction);
  }
  return Direction;
}

// Problem & Solver - Primal Bound
// https://github.com/coin-or/Paver/blob/783a6f5d0d3782a168d0ef529d01bcbda91ea8a4/src/paver/readgamstrace.py#L275-L282
export function CalculatePrimalBound(PrimalBound: unknown, Direction: number): any {
  if (PrimalBound === "" || PrimalBound === "NA") {
    PrimalBound = Direction * Infinity;
  }
  return PrimalBound;
}

// Problem & Solver - Dual Bound
// https://github.com/coin-or/Paver/blob/783a6f5d0d3782a168d0ef529d01bcbda91ea8a4/src/paver/readgamstrace.py#L275-L282
export function CalculateDualBound(DualBound: unknown, Direction: number): any {
  if (DualBound === "" || DualBound === "NA") {
    DualBound = -1 * Direction * Infinity;
  }
  return DualBound;
}

// Solver- Termstatus
// https://github.com/coin-or/Paver/blob/783a6f5d0d3782a168d0ef529d01bcbda91ea8a4/src/paver/readgamstrace.py#L90-L103
export function SetTermStatus(TerminationStatus): any {
  switch (TerminationStatus) {
    case "1":
      TerminationStatus = "Normal";
      break;
    case "2":
      TerminationStatus = "IterationLimit";
      break;
    case "3":
      TerminationStatus = "TimeLimit";
      break;
    case "4":
    case "7":
    case "12":
      TerminationStatus = "Other";
      break;
    case "5":
      TerminationStatus = "OtherLimit";
      break;
    case "6":
      TerminationStatus = "CapabilityProblem";
      break;
    case "8":
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
export function CalculateGapSolver(
  Solver: number,
  Problem: number,
  tol = 1e-9
) {
  // Check if the values are equal within tolerance
  if (Problem === Solver || Math.abs(Solver - Problem) <= tol) {
    return 0.0;
  }

  // Check if either value is close to zero or infinity, or if the values have opposite signs
  if (
    Math.abs(Solver) <= tol ||
    Math.abs(Problem) <= tol ||
    Math.abs(Solver) >= Infinity ||
    Math.abs(Problem) >= Infinity ||
    Solver * Problem < 0.0
  ) {
    return Infinity;
  }

  // Compute and return the gap between the values
  return (
    (Solver - Problem) /
    Math.min(Math.abs(Solver), Math.abs(Problem))
  );
}

// Solver - Gap[%]
// https://github.com/coin-or/Paver/blob/783a6f5d0d3782a168d0ef529d01bcbda91ea8a4/src/paver/utils.py#L21-L39
export function CalculateGapPercentage(PrimalGap, DualGap) {
  let Gap: number;
  if (Math.abs(PrimalGap) >= Infinity || Math.abs(DualGap) >= Infinity) {
    if (PrimalGap === DualGap) {
      Gap = 0.0;
      return Gap;
    } else {
      Gap = PrimalGap - DualGap;
      return Gap;
    }
  } else {
    Gap =
      (PrimalGap - DualGap) /
      Math.max(Math.abs(PrimalGap), Math.abs(DualGap), 1.0);
    return Gap;
  }
}
