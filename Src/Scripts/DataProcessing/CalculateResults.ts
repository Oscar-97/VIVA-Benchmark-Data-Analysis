// Problem - Direction
export function CalculateDirection(Direction) {
  if (Direction === "" || Direction === "NA") {
    Direction = 1;
  } else {
    Direction = 1 - 2 * parseInt(Direction);
  }
  return Direction;
}

// Problem & Solver - Primal Bound
export function CalculatePrimalBound(PrimalBound, Direction) {
  if (PrimalBound === "" || PrimalBound === "NA") {
    PrimalBound = Direction * Infinity;
  }
  return PrimalBound;
}

// Problem & Solver - Dual Bound
export function CalculateDualBound(DualBound, Direction) {
  if (DualBound === "" || DualBound === "NA") {
    DualBound = -1 * Direction * Infinity;
  }
  return DualBound;
}

// Solver- Termstatus
export function SetTermStatus(TerminationStatus) {
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
export function CalculatePrimalAndDualGapSolver(
  DualBound: number,
  PrimalBound: number,
  tol = 1e-9
) {
  // Check if the values are equal within tolerance
  if (PrimalBound === DualBound || Math.abs(DualBound - PrimalBound) <= tol) {
    return 0.0;
  }

  // Check if either value is close to zero or infinity, or if the values have opposite signs
  if (
    Math.abs(DualBound) <= tol ||
    Math.abs(PrimalBound) <= tol ||
    Math.abs(DualBound) >= Infinity ||
    Math.abs(PrimalBound) >= Infinity ||
    DualBound * PrimalBound < 0.0
  ) {
    return Infinity;
  }

  // Compute and return the gap between the values
  return (
    (DualBound - PrimalBound) /
    Math.min(Math.abs(DualBound), Math.abs(PrimalBound))
  );
}

// Solver - Gap[%]
export function CalculateGap(PrimalGap, DualGap) {
  // TODO:
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
