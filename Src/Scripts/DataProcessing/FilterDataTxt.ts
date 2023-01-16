/**
 * Get Instance
 */
export function GetInstance(SolvedData: string[]) {
    let Instance = ExtractInstanceAndSolvers(SolvedData[0]).shift();
    console.log("Instance: \n", Instance);
    return Instance;
}

/**
 * Get Solvers
 */
export function GetSolvers(SolvedData: string[]) {
    let Solvers = ExtractInstanceAndSolvers(SolvedData[0]).slice(1);
    console.log("Solvers: \n", Solvers);
    return Solvers;
}

/**
 * Get InstanceLabels
 */
export function GetInstanceLabels(DataLabels: string[]) {
    let InstanceLabels = DataLabels.splice(0, 7);
    console.log("Instance labels: \n", InstanceLabels);
    return InstanceLabels;
}

/**
 * Get DataLabels
 */
export function GetDataLabels(SolvedData: string[]) {
    // Get the solver names.
    let DataLabels = SolvedData[1].split(" ");
    // Remove extra 'bound' in array when splitting.
    let TempData = DataLabels.filter(function (value) {
        return value != "bound";
    });
    // Remove "|" and "#".
    let TempData2 = TempData.map(function (value) {
        return value.replace(/[I| #]/g, '');
    });
    // Remove blanks.
    let TempData3 = TempData2.filter(item => item);

    // Add back 'bound/I' with function, and clean up the rest of the content.
    for (var i = 0; i < TempData3.length; i++)
        if (TempData3[i] === "Primal") {
            TempData3[i] = "Primal bound";
        } else if (TempData3[i] === "Dual") {
            TempData3[i] = "Dual bound";
        } else if (TempData3[i] === "Nodes") {
            TempData3[i] = "Nodes I";
        }
    DataLabels = TempData3;
    console.log("Number of data labels: ", DataLabels.length, " and data labels: ", DataLabels);
    return DataLabels;
}

/**
 * Get Problems
 */
export function GetProblems(SolvedData: string[]) {
    let ProblemList = [];
    
    for (var i = 3; i < SolvedData.length; i++) {
        ProblemList.push(ExtractProblemsAndResults(SolvedData[i])[0]);
    }
    console.log("All problems: \n", ProblemList);
    return ProblemList;
}

/**
 * Get ResultList
 */
export function GetResults(SolvedData: string[]) {
    let ResultsData = [];

    for (var i = 3; i < SolvedData.length; i++) {
      ResultsData.push(ExtractProblemsAndResults(SolvedData[i]).slice(1));
    }

    console.log("All results: \n", ResultsData);
    return ResultsData;
}

/**
 * Extract the instance and solvers.
 */
function ExtractInstanceAndSolvers(data: string) {
    let TempData = data.split("\|");
    let InstanceAndSolvers = TempData.filter(item => item);
    for (var i = InstanceAndSolvers.length - 1; i >= 0; i--) {
        InstanceAndSolvers[i] = InstanceAndSolvers[i].replace(/\s+/g, "");
    }
    return InstanceAndSolvers;
}

/**
 * Extract the problems and results.
 */
function ExtractProblemsAndResults(data: string) {
    // Remove blanks.
    let ProblemsAndResults = data.replace(/\s+/g, ' ').split(" ");
    // Remove "|".
    let TempData = ProblemsAndResults.map(function (value) {
        return value.replace(/[|]/g, '');
    });
    ProblemsAndResults = TempData;
    return ProblemsAndResults;
}