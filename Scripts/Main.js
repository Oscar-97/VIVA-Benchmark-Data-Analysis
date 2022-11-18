import { ImportData } from './DataProcessing/ImportData.js';
import { DisplayDataTable } from './Table/DisplayDataTable.js'
import { GetInstanceAndSolvers, GetDataLabels, GetProblems } from './DataProcessing/FilterData.js';
import { CreateChart } from './Chart/CreateChart.js';

// Import the data.
let SolvedData = ImportData("solvedata2.txt"); // Path to local file.

 // Total rows of the raw data.
console.clear();
console.log("Total number of rows in the data file: \n" + SolvedData.length);

// INSTANCE: Index on datalabel array -> match resultarray? name -> alan, vars -> 8. name -> batch, vars -> 46
// Maybe call the array Instance? and assign: #Vars #Disc #Equs Dir Dual bound Primal bound I to it.
// Solvers: From the data label Termstatus -> normal etc.

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
// Send to display data.
DisplayDataTable(Instance, Solvers, InstanceLabels, DataLabels, ProblemList, ResultsData);

// TODO: Add filters:

// TODO: Create charts from filters:

// Old example.
// //#region Get filtered results for dual bound for the solvers:
// // Solver: Scp2804s@1
// let B = 8; // Column for the results. Make dynamic.
// let Scp2804_data = [];
// console.log("Scp280s@1")
// for (FirstProblem; FirstProblem <= LastProblem; FirstProblem++) {
//   // Insert to array:
//   Scp2804_data.push(GetProblems(SolvedData[FirstProblem])[B]);
// }
// FirstProblem = 3; // Temp reset
// console.log("Size of Scp2804_data: ", Scp2804_data.length);
// console.log("- - - - -");

// // Solver: aecp@1
// let C = 16; // Column for the results. Make dynamic.
// let aecp_data = [];
// console.log("aecp@1")
// for (FirstProblem; FirstProblem <= LastProblem; FirstProblem++) {
//   // Insert to array:
//   aecp_data.push(GetProblems(SolvedData[FirstProblem])[C]);
// }
// FirstProblem = 3; // Temp reset.
// console.log("Size of aecp_data: ", aecp_data.length);
// console.log("- - - - -");

// // Solver: sbb@1
// let D = 48; // Column for the results. Make dynamic.
// let sbb_data = [];
// console.log("sbb@1")
// for (FirstProblem; FirstProblem <= LastProblem; FirstProblem++) {
//   //console.log(GetProblems(SolvedData[FirstProblem])[D])
//   // Insert to array:
//   sbb_data.push(GetProblems(SolvedData[FirstProblem])[D]);
// }
// FirstProblem = 3; // Temp reset
// console.log("Size of sbb_data: ", sbb_data.length);
// console.log("- - - - -");

// // Create a chart (with Chart.js) using the "filtered" data. Displayed in report.html.
// CreateChart("Number of non null/empty results.", Solvers, Scp2804_data, aecp_data, sbb_data);
// //#endregion