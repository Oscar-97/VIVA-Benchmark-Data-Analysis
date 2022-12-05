import { ImportData } from './DataProcessing/ImportData.js';
import { TableDisplayData } from './Table/TableDisplayData.js';
import { TableFilters } from './Table/TableFilters.js';
import { TableSearch } from './Table/TableSearch.js';
import { GetInstanceAndSolvers, GetDataLabels, GetProblems } from './DataProcessing/FilterData.js';
import { CreateChart } from './Chart/CreateChart.js';

// Get the solvers that are marked as checked.
function GetCheckedSolvers() {
  FilterSolvers = document.getElementsByTagName("input");
  let CheckedSolvers = []
  for (let Solver of FilterSolvers) {
    if (Solver.checked) {
      CheckedSolvers.push(Solver.id);
    }
  }
  console.log(CheckedSolvers);
  return CheckedSolvers;
}

// Compare checked solvers versus full list of solvers.
function GetComparisonArray(CheckedSolvers) {
  for (let i = 0; i < Solvers.length; i++) {
    if (CheckedSolvers.includes(Solvers[i])) {
      ComparisonArray[i] = "Used";
    }
    else {
      ComparisonArray[i] = "NotUsed";
    }
  }
  console.log(ComparisonArray);
  return ComparisonArray;
}

// Vars.
let FilterSolvers;
const ComparisonArray = [];

// Import the data.
const SolvedData = ImportData("../solvedata.txt"); // TEMP: Path to local file.

//First row of the data:
const Instance = GetInstanceAndSolvers(SolvedData[0]).shift(); // Instance is at Index 0.
const Solvers = GetInstanceAndSolvers(SolvedData[0]).slice(1); // Solvers are in the rest of the indices.

// Second row of the data:
const DataLabels = GetDataLabels(SolvedData[1]); // Data labels.
const InstanceLabels = DataLabels.splice(0, 7); // Only instance categories.

// Third row and onwards of the data:
const ProblemAndResults = GetProblems(SolvedData[3]); // Problem and the results.
let FirstProblem = 3; // The problems from the specified row.
const ProblemList = []; // List of problems.

for (var i = FirstProblem; i < SolvedData.length; i++) {
  ProblemList.push(GetProblems(SolvedData[i])[0]);
}
const ResultsData = []; // List of results.
for (FirstProblem; FirstProblem < SolvedData.length; FirstProblem++) {
  ResultsData.push(GetProblems(SolvedData[FirstProblem]).slice(1));
}

//#region Printing information of the data.
console.log("Total number of rows in the data file: \n" + SolvedData.length);
console.log("Solvers: \n", Solvers)
console.log("Number of filtered data labels: ", DataLabels.length);
console.log("Data labels: \n", DataLabels);
console.log("Instance categories: \n", InstanceLabels)
console.log("Filtered results for problem: \n", ProblemAndResults[0], "results: ", ProblemAndResults.slice(1));
//#endregion

// Create the solver filters.
TableFilters(Solvers);

// Select all checkboxes.
const ViewDataTableButton = document.getElementById("selectAllButton");
ViewDataTableButton.addEventListener("click", function () {
  FilterSolvers = document.getElementsByTagName("input");
  for (let Solver of FilterSolvers) {
    if (!Solver.checked) {
      Solver.click();
    }
  }
  ViewDataTableButton.disabled = true;
})

// Display the data in the div with the id "dataTable"
if (document.title == "Report") {
  const ViewSelectionButton = document.getElementById("viewSelectionButton");
  ViewSelectionButton.addEventListener("click", function () {
    let CheckedSolvers = GetCheckedSolvers();
    let ComparisonArray = GetComparisonArray(CheckedSolvers);

    TableDisplayData(Instance, CheckedSolvers, InstanceLabels, DataLabels, ProblemList, ResultsData, ComparisonArray);
    ViewDataTableButton.disabled = false;
    
    // Create the input search element.
    const InputSearch = document.getElementById("tableSearch");
    InputSearch.value = "";
    InputSearch.oninput = () => {
      TableSearch();
    }
  })
}

// Filter and display the data in plots.
if (document.title == "Plots") {
  const ViewPlotsButton = document.getElementById('viewPlotsButton');
  ViewPlotsButton.addEventListener("click", function () {
    let CheckedSolvers = GetCheckedSolvers();
    let ComparisonArray = GetComparisonArray(CheckedSolvers);
    
    console.log("Sending to CreateChart.");
    CreateChart(Solvers, ResultsData, ComparisonArray);
  })
}