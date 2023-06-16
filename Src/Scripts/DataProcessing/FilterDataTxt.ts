/**
 * Get Instance
 */
export function GetInstance(SolvedData: string[]): string {
	const Instance = ExtractInstanceAndSolvers(SolvedData[0]).shift();
	return Instance;
}

/**
 * Get Solvers
 */
export function GetSolvers(SolvedData: string[]): string[] {
	const Solvers = ExtractInstanceAndSolvers(SolvedData[0]).slice(1);
	return Solvers;
}

/**
 * Get InstanceLabels
 */
export function GetInstanceLabels(DataLabels: string[]): string[] {
	const InstanceLabels = DataLabels.splice(0, 7);
	return InstanceLabels;
}

/**
 * Get DataLabels
 */
export function GetDataLabels(SolvedData: string[]): string[] {
	// Get the solver categories.
	let DataLabels = SolvedData[1].split(" ");
	// Remove extra 'bound' in array when splitting.
	const TempData = DataLabels.filter(function (value) {
		return value != "bound";
	});
	// Remove "|" and "#".
	const TempData2 = TempData.map(function (value) {
		return value.replace(/[I| #]/g, "");
	});
	// Remove blanks.
	const TempData3 = TempData2.filter((item) => item);

	// Add back 'bound/I' with function, and clean up the rest of the content.
	for (let i = 0; i < TempData3.length; i++)
		if (TempData3[i] === "Primal") {
			TempData3[i] = "Primal bound";
		} else if (TempData3[i] === "Dual") {
			TempData3[i] = "Dual bound";
		} else if (TempData3[i] === "Nodes") {
			TempData3[i] = "Nodes I";
		}
	DataLabels = TempData3;
	return DataLabels;
}

/**
 * Get Problems
 */
export function GetProblems(SolvedData: string[]): string[] {
	const ProblemList = [];

	for (let i = 3; i < SolvedData.length; i++) {
		ProblemList.push(ExtractProblemsAndResults(SolvedData[i])[0]);
	}
	return ProblemList;
}

/**
 * Get ResultList
 */
export function GetResults(SolvedData: string[]): string[] {
	const ResultsData = [];

	for (let i = 3; i < SolvedData.length; i++) {
		ResultsData.push(ExtractProblemsAndResults(SolvedData[i]).slice(1));
	}

	return ResultsData;
}

/**
 * Extract the instance and solvers.
 */
function ExtractInstanceAndSolvers(data: string): string[] {
	const TempData = data.split("|");
	const InstanceAndSolvers = TempData.filter((item) => item);
	for (let i = InstanceAndSolvers.length - 1; i >= 0; i--) {
		InstanceAndSolvers[i] = InstanceAndSolvers[i].replace(/\s+/g, "");
	}
	return InstanceAndSolvers;
}

/**
 * Extract the problems and results.
 */
function ExtractProblemsAndResults(data: string): string[] {
	// Remove blanks.
	let ProblemsAndResults = data.replace(/\s+/g, " ").split(" ");
	// Remove "|".
	const TempData = ProblemsAndResults.map(function (value) {
		return value.replace(/[|]/g, "");
	});
	ProblemsAndResults = TempData;
	return ProblemsAndResults;
}
