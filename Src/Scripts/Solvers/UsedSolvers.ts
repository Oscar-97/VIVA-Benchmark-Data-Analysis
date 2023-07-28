/**
 * Compare checked solvers versus full list of solvers.
 * @param checkedSolvers
 * @param solvers
 * @returns The ComparisonArray, which contains Used and not Used status on the solvers found in the benchmark results file.
 */
export function GetComparisonArray(
	checkedSolvers: string[],
	solvers: string[]
): string[] {
	const comparisonArray = [];
	for (let i = 0; i < solvers.length; i++) {
		if (checkedSolvers.includes(solvers[i])) {
			comparisonArray[i] = "Used";
		} else {
			comparisonArray[i] = "NotUsed";
		}
	}
	return comparisonArray;
}

/**
 * @returns Get the solvers that are marked as checked.
 */
export function GetCheckedSolvers(): string[] {
	const filterSolvers = document.getElementsByTagName("input");
	const checkedSolvers = [];
	for (const solver of filterSolvers) {
		if (solver.checked) {
			checkedSolvers.push(solver.id);
		}
	}
	return checkedSolvers;
}
