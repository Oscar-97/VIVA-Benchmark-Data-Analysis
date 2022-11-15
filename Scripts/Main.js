import { ImportData } from './DataProcessing/ImportData.js';
import { DisplayData } from './Table/DisplayData.js';
import { GetInstanceAndSolvers, GetDataLabels, GetProblems } from './DataProcessing/FilterData.js';
import { CreateChart } from './Chart/CreateChart.js';

// Alternative 1.
let SolvedData = ImportData("solvedata.txt"); // Path to local file.

 // Total rows of the raw data.
console.clear();
console.log("Total number of rows in the data file: " + SolvedData.length);

/* 
TODO:
Output the filtered data to the console to check that it is 
somewhat correct when using the filter function.
Needs to be a lot more dynamic/flexible when importing the data when the number of solvers i changed.
Count the number of data labels until they repeat, then assign the value to each one of the respective data results.
Example: array[1-4], array[5-9], array[9-14]
*/

// INSTANCE: Index on datalabel array -> match resultarray? name -> alan, vars -> 8. name -> batch, vars -> 46
// Maybe call the array Instance? and assign: #Vars #Disc #Equs Dir Dual bound Primal bound I to it.
// Solvers: From the data label Termstatus -> normal etc.

// First row of the data:
// Instance and Solvers.
let InstanceAndSolvers = GetInstanceAndSolvers(SolvedData[0]);
console.log("Size of filtered columns: ", InstanceAndSolvers.length);
console.log("Instance and the solvers: \n", InstanceAndSolvers);

// Second row of the data:
// Data labels.
let DataLabels = GetDataLabels(SolvedData[1]);
console.log("Number of filtered data labels: ", DataLabels.length);
console.log("Data labels: ", DataLabels);

// Only instance categories.
let InstanceArrayCategories = DataLabels.splice(1, 6);
console.log("Instance categories: ", InstanceArrayCategories)

// Third row of the data:
// Problem and the results.
let ProblemAndResults = GetProblems(SolvedData[3]);
console.log("Filtered results for problem: ", ProblemAndResults[0], "results: ", ProblemAndResults.slice(1));

// Test to print a few problems and the corresponding results for three different solvers ('Scp280s@1', 'aecp@1', 'sbb@1'):
let UsedSolvers = [InstanceAndSolvers[1], InstanceAndSolvers[2], InstanceAndSolvers[6]];
console.log("Solvers: \n", UsedSolvers);

// The problems from the specified row.
let FirstProblem = 3;
let LastProblem = SolvedData.length - FirstProblem;

// TODO: Create a function for something like in this test example.
//#region Get filtered results for dual bound for the solvers:

// Solver: Scp2804s@1
let B = 8; // Column for the results. Make dynamic.
let Scp2804_data = [];
console.log("Scp280s@1")
for (FirstProblem; FirstProblem <= LastProblem; FirstProblem++) {
  // Insert to array:
  Scp2804_data.push(GetProblems(SolvedData[FirstProblem])[B]);
}
FirstProblem = 3; // Temp reset
console.log("Size of Scp2804_data: ", Scp2804_data.length);
console.log("- - - - -");

// Solver: aecp@1
let C = 16; // Column for the results. Make dynamic.
let aecp_data = [];
console.log("aecp@1")
for (FirstProblem; FirstProblem <= LastProblem; FirstProblem++) {
  // Insert to array:
  aecp_data.push(GetProblems(SolvedData[FirstProblem])[C]);
}
FirstProblem = 3; // Temp reset.
console.log("Size of aecp_data: ", aecp_data.length);
console.log("- - - - -");

// Solver: sbb@1
let D = 48; // Column for the results. Make dynamic.
let sbb_data = [];
console.log("sbb@1")
for (FirstProblem; FirstProblem <= LastProblem; FirstProblem++) {
  console.log(GetProblems(SolvedData[FirstProblem])[D])
  // Insert to array:
  sbb_data.push(GetProblems(SolvedData[FirstProblem])[D]);
}
FirstProblem = 3; // Temp reset
console.log("Size of sbb_data: ", sbb_data.length);
console.log("- - - - -");

// Create a chart (with Chart.js) using the "filtered" data. Displayed in report.html.
CreateChart("Number of non null/empty results.", UsedSolvers, Scp2804_data, aecp_data, sbb_data);
//#endregion

// List of problems:
let ProblemList = [];
for (var i = FirstProblem; i < SolvedData.length; i++) {
  console.log(GetProblems(SolvedData[i])[0]);
  ProblemList.push(GetProblems(SolvedData[i])[0]);
}
console.log("Problem list: ", ProblemList.length)

// TODO:
// Display data in BS4 table.
DisplayData(UsedSolvers, ProblemList, Scp2804_data, aecp_data, sbb_data);