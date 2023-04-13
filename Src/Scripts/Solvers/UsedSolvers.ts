/**
 * Compare checked solvers versus full list of solvers.
 * @param CheckedSolvers
 * @param Solvers
 * @returns The ComparisonArray, which contains Used and not Used status on the solvers found in the benchmark results file.
 */
export function GetComparisonArray(CheckedSolvers: string[], Solvers: string[]): string[] {
  const ComparisonArray = [];
  for (let i = 0; i < Solvers.length; i++) {
    if (CheckedSolvers.includes(Solvers[i])) {
      ComparisonArray[i] = "Used";
    } else {
      ComparisonArray[i] = "NotUsed";
    }
  }
  console.log(ComparisonArray);
  return ComparisonArray;
}

/**
 * @returns Get the solvers that are marked as checked.
 */
export function GetCheckedSolvers(): string[] {
  const FilterSolvers = document.getElementsByTagName("input");
  const CheckedSolvers = [];
  for (const Solver of FilterSolvers) {
    if (Solver.checked) {
      CheckedSolvers.push(Solver.id);
    }
  }
  console.log(CheckedSolvers);
  return CheckedSolvers;
}
