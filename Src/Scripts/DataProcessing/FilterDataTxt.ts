/**
 * Get Instance
 */
export function GetInstance(solvedData: string[]): string {
	const instance = ExtractInstanceAndSolvers(solvedData[0]).shift();
	return instance;
}

/**
 * Get Solvers
 */
export function GetSolvers(solvedData: string[]): string[] {
	const solvers = ExtractInstanceAndSolvers(solvedData[0]).slice(1);
	return solvers;
}

/**
 * Get InstanceLabels
 */
export function GetInstanceLabels(dataLabels: string[]): string[] {
	const instanceLabels = dataLabels.splice(0, 7);
	return instanceLabels;
}

/**
 * Get DataLabels
 */
export function GetDataLabels(solvedData: string[]): string[] {
	// Get the solver categories.
	let dataLabels = solvedData[1].split(" ");
	// Remove extra 'bound' in array when splitting.
	const tempData = dataLabels.filter(function (value) {
		return value != "bound";
	});
	// Remove "|" and "#".
	const tempData2 = tempData.map(function (value) {
		return value.replace(/[I| #]/g, "");
	});
	// Remove blanks.
	const tempData3 = tempData2.filter((item) => item);

	// Add back 'bound/I' with function, and clean up the rest of the content.
	for (let i = 0; i < tempData3.length; i++)
		if (tempData3[i] === "Primal") {
			tempData3[i] = "Primal bound";
		} else if (tempData3[i] === "Dual") {
			tempData3[i] = "Dual bound";
		} else if (tempData3[i] === "Nodes") {
			tempData3[i] = "Nodes I";
		}
	dataLabels = tempData3;
	return dataLabels;
}

/**
 * Get Problems
 */
export function GetProblems(solvedData: string[]): string[] {
	const problemList = [];

	for (let i = 3; i < solvedData.length; i++) {
		problemList.push(ExtractProblemsAndResults(solvedData[i])[0]);
	}
	return problemList;
}

/**
 * Get ResultList
 */
export function GetResults(solvedData: string[]): string[] {
	const resultsData = [];

	for (let i = 3; i < solvedData.length; i++) {
		resultsData.push(ExtractProblemsAndResults(solvedData[i]).slice(1));
	}

	return resultsData;
}

/**
 * Extract the instance and solvers.
 */
function ExtractInstanceAndSolvers(data: string): string[] {
	const tempData = data.split("|");
	const instanceAndSolvers = tempData.filter((item) => item);
	for (let i = instanceAndSolvers.length - 1; i >= 0; i--) {
		instanceAndSolvers[i] = instanceAndSolvers[i].replace(/\s+/g, "");
	}
	return instanceAndSolvers;
}

/**
 * Extract the problems and results.
 */
function ExtractProblemsAndResults(data: string): string[] {
	// Remove blanks.
	let problemsAndResults = data.replace(/\s+/g, " ").split(" ");
	// Remove "|".
	const tempData = problemsAndResults.map(function (value) {
		return value.replace(/[|]/g, "");
	});
	problemsAndResults = tempData;
	return problemsAndResults;
}
