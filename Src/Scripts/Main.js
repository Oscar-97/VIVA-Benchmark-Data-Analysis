//import { ImportData } from './DataProcessing/ImportData.js'; // Only for accessing files without using upload.
import { TableDisplayData } from './Table/TableDisplayData.js';
import { TableFilters } from './Table/TableFilters.js';
import { TableSearch } from './Table/TableSearch.js';
import { TableDownloadCSV } from './Table/TableDownloadCSV.js';
import { GetInstanceAndSolvers, GetDataLabels, GetProblems } from './DataProcessing/FilterData.js';
import { CreateChart } from './Chart/CreateChart.js';

// Set input value for file upload to empty at load.
document.getElementById('fileInput').value='';

// Get the elements.
const FileInput = document.getElementById('fileInput');
const ImportDataButton = document.getElementById('importDataButton');
const SelectAllButton = document.getElementById("selectAllButton");
const ViewSelectionButton = document.getElementById("viewSelectionButton");

// Store all RawData here.
const RawData = [];

// Click on the upload data button to start the process.
ImportDataButton.addEventListener("click", function () {
  
  // Remove existing Solvers and the search bar when uploading a new result file.
  try {
    document.querySelectorAll('.form-check').forEach(solver => {solver.remove();});
    document.getElementById('tableSearch').remove();
    document.getElementById('downloadCSVButton').remove();
  }
  catch {}

  // Change the statuses of the buttons after uploading the data.
  SelectAllButton.disabled = false;
  if (document.title == "Report") {
    ViewSelectionButton.disabled = false;
  } else if (document.title == "Plots") {
    viewPlotsButton.disabled = false;
  }
  ImportDataButton.disabled = true;
  
  // Run the remaining functions.
  ManageData();
});

// Read the data from the input file.
FileInput.addEventListener('change', function () {
  ImportDataButton.disabled = false;
  let Reader = new FileReader();
  Reader.addEventListener('load', function () {
    RawData.length = 0;
    // Split the file's text into an array of lines
    let lines = Reader.result.split('\n');
    // Iterate over the lines array and process each line as needed
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];
      RawData.push(line);
    }
  });
  // Read the file as text
  Reader.readAsText(FileInput.files[0]);
});

// Get the solvers that are marked as checked.
function GetCheckedSolvers() {
  let FilterSolvers = document.getElementsByTagName("input");
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
function GetComparisonArray(CheckedSolvers, Solvers) {
  const ComparisonArray = [];
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

// Sort the text file and display the relevant elements per page.
function ManageData() {
  // Import the data.
  //const SolvedData = ImportData("../../solvedata.txt"); // TEMP: Path to local file without upload.
  const SolvedData = RawData;

  // First row of the data:
  const Instance = GetInstanceAndSolvers(SolvedData[0]).shift(); // Instance is at Index 0.
  const Solvers = GetInstanceAndSolvers(SolvedData[0]).slice(1); // Solvers are in the rest of the indices.

  // Second row of the data:
  const DataLabels = GetDataLabels(SolvedData[1]); // Data labels.
  const InstanceLabels = DataLabels.splice(0, 7); // Only instance categories.

  // Third row and onwards of the data:
  const ProblemAndResults = GetProblems(SolvedData[3]); // Problem and the results.
  let FirstProblem = 3; // The problems from the specified row.
  
  // List of problems.
  const ProblemList = []; 
  for (var i = FirstProblem; i < SolvedData.length; i++) {
    ProblemList.push(GetProblems(SolvedData[i])[0]);
  }

  // List of results.
  const ResultsData = [];
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

  // Create the solver filters, displayed in the element with the id: tableFilters.
  TableFilters(Solvers);

  // Select all checkboxes button functionality.
  SelectAllButton.addEventListener("click", function () {
    let FilterSolvers = document.getElementsByTagName("input");
    for (let Solver of FilterSolvers) {
      if (!Solver.checked && Solver.id != "fileInput") {
        Solver.click();
      }
    }
    SelectAllButton.disabled = true;
  })

  // Display the data in the div with the id "dataTable" when clicking on the view selection button
  if (document.title == "Report") {
    ViewSelectionButton.addEventListener("click", function () {
      let CheckedSolvers = GetCheckedSolvers();
      let ComparisonArray = GetComparisonArray(CheckedSolvers, Solvers);

      TableDisplayData(Instance, CheckedSolvers, InstanceLabels, DataLabels, ProblemList, ResultsData, ComparisonArray);
      SelectAllButton.disabled = false;

      // Create the input search element after generating the table.
      const InputSearch = document.getElementById("tableSearch");
      InputSearch.value = "";
      InputSearch.oninput = () => {
        TableSearch();
      }

      // Create a save CSV button after generating the table.
      const DownloadCSVButton = document.getElementById("downloadCSVButton");
      DownloadCSVButton.addEventListener("click", TableDownloadCSV(DownloadCSVButton));
    })
  }

  // Filter and display the data in plots when clicking on the view plots button.
  if (document.title == "Plots") {
    const ViewPlotsButton = document.getElementById('viewPlotsButton');
    ViewPlotsButton.addEventListener("click", function () {
      let CheckedSolvers = GetCheckedSolvers();
      let ComparisonArray = GetComparisonArray(CheckedSolvers, Solvers);

      console.log("Sending to CreateChart.");
      CreateChart(Solvers, ResultsData, ComparisonArray);
      SelectAllButton.disabled = false;
    })
  }
}