import { ImportData } from './DataProcessing/ImportData.js';
import { DisplayDataTable } from './Table/DisplayDataTable.js'
import { GetInstanceAndSolvers, GetDataLabels, GetProblems } from './DataProcessing/FilterData.js';
import { CreateChart } from './Chart/CreateChart.js';

// Import the data.
let SolvedData = ImportData("solvedata2.txt"); // Path to local file.

 // Total rows of the raw data.
console.clear();
console.log("Total number of rows in the data file: \n" + SolvedData.length);

//#region First row of the raw data:
// Instance is at Index 0.
let Instance = GetInstanceAndSolvers(SolvedData[0]).shift();
console.log("Size of filtered columns: \n", Instance.length);
console.log("Instance and the solvers: \n", Instance);

// Solvers are in the rest of the indices.
let Solvers = GetInstanceAndSolvers(SolvedData[0]).slice(1);
console.log("Solvers: \n", Solvers)
//#endregion

//#region Second row of the data:
// Data labels.
let DataLabels = GetDataLabels(SolvedData[1]);
console.log("Number of filtered data labels: ", DataLabels.length);
console.log("Data labels: \n", DataLabels);

// Only instance categories.
let InstanceLabels = DataLabels.splice(0, 6);
console.log("Instance categories: \n", InstanceLabels)
//#endregion

//#region Third row and onwards of the data:
// Problem and the results.
let ProblemAndResults = GetProblems(SolvedData[3]);
console.log("Filtered results for problem: \n", ProblemAndResults[0], "results: ", ProblemAndResults.slice(1));

// The problems from the specified row.
let FirstProblem = 3; // Always consistent.
// let LastProblem = SolvedData.length - FirstProblem;
console.log("SolvedData.length: ", SolvedData.length)

// List of problems:
let ProblemList = [];
for (var i = FirstProblem; i < SolvedData.length; i++) {
  // Insert to array:
  ProblemList.push(GetProblems(SolvedData[i])[0]);
}
console.log("ProblemList.length: ", ProblemList.length)
//#endregion

let ResultsData = [];
for (FirstProblem; FirstProblem < SolvedData.length; FirstProblem++) {
  // Insert to array:
  ResultsData.push(GetProblems(SolvedData[FirstProblem]).slice(1));
}
console.log("ResultsData.length: ", ResultsData.length)
// Display the data in the div with the id "dataTable".
DisplayDataTable(Instance, Solvers, InstanceLabels, DataLabels, ProblemList, ResultsData);

// TODO: Add event on clicking on filters.

// TODO: Create charts from filters.