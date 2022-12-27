//import { ImportData } from './DataProcessing/ImportData.js'; // Only for accessing files without using upload.
const jq = require('jquery');
const DataTables = require('datatables.net-bs5');
const Buttons = require('datatables.net-buttons-bs5');
// const ButtonsColVis = require('datatables.net-buttons/js/buttons.colVis.js');
// const ColReorder = require('datatables.net-colreorder-bs5');
const RowReorder = require('datatables.net-rowreorder-bs5');
const Select = require('datatables.net-select-bs5');

import { TableDisplayData } from './Table/TableDisplayData';
import { TableFilters } from './Table/TableFilters';
import { TableSearch } from './Table/TableSearch';
import { TableDownloadCSV } from './Table/TableDownloadCSV';
import { GetInstanceAndSolvers, GetDataLabels, GetProblems } from './DataProcessing/FilterData';
import { CreateChart } from './Chart/CreateChart';

/**
 * Elements that the user can interact with.
 * @param FileInput Allows the user to select a benchmark results file for upload, located at the top of the page.
 * @param ImportDataButton Allows the user to upload the selected file, located at the top of the page.
 * @param SelectAllButton Selects all solvers from the benchmark results file.
 * @param ViewSelectionButton Displays a table with the currently selected solvers.
 * @param ViewPlotsButton Displays a plot with the currently selected solvers.
 */
const FileInput = document.getElementById('fileInput') as HTMLInputElement;
const ImportDataButton = document.getElementById('importDataButton') as HTMLButtonElement;
const SelectAllButton = document.getElementById("selectAllButton") as HTMLButtonElement;
const ViewSelectionButton = document.getElementById("viewSelectionButton") as HTMLButtonElement;
const ViewPlotsButton = document.getElementById('viewPlotsButton') as HTMLButtonElement;

FileInput.value = '';

/**
 * Storage of the imported benchmark results.
 */
const RawData = [];

/**
 * Click on the upload data button to start the process.
 */
ImportDataButton.addEventListener("click", function () {
  
  // Remove existing Solvers and the search bar when uploading a new result file.
  try {
    document.querySelectorAll('.form-check').forEach(solver => {solver.remove();});
    document.getElementById('tableSearch').remove();
    document.getElementById('downloadCSVButton').remove();
    document.getElementById('dataTableGenerated_wrapper').remove();
  }
  catch {}

  // Change the statuses of the buttons after uploading the data.
  SelectAllButton.disabled = false;
  if (document.title == "Report") {
    ViewSelectionButton.disabled = false;
  } else if (document.title == "Plots") {
    ViewPlotsButton.disabled = false;
  }
  ImportDataButton.disabled = true;
  
  // Run the remaining functions.
  ManageData();
});

/**
 * Read the data from the input file.
 */
FileInput.addEventListener('change', function () {
  ImportDataButton.disabled = false;
  let Reader = new FileReader();
  Reader.addEventListener('load', function () {
    RawData.length = 0;
    // Split the file's text into an array of lines
    let lines = (<string>Reader.result).split('\n');
    // Iterate over the lines array and process each line as needed. 
    // Skip the last line, as it is always empty in the benchmark results file.
    for (let i = 0; i < lines.length-1; i++) {
      let line = lines[i];
      RawData.push(line);
    }
  });
  // Read the file as text
  Reader.readAsText(FileInput.files[0]);
});

/**
 * @returns Get the solvers that are marked as checked.
 */
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

/**
 * Compare checked solvers versus full list of solvers.
 * @param CheckedSolvers 
 * @param Solvers 
 * @returns The ComparisonArray, which contains Used and not Used status on the solvers found in the benchmark results file.
 */
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

/**
 * Sort the benchmark results file and display the relevant elements per page. 
 */
function ManageData() {
  // Import the data.
  //const SolvedData = ImportData("../../solvedata.txt"); // TEMP: Path to local file without upload.
  
  /**
   * Setting the benchmark results file data.
   * @param SolvedData Data from the benchmark results file.
   */
  const SolvedData = RawData;

  /**
   * First row of the benchmark results file.
   * @param Instance The column where the instance is located. Instance is at index 0.
   * @param Solvers The columns where the solvers are located. Solvers are in the rest of the indices.
   * Second row of the benchmark results file.
   * @param DataLabels The data labels.
   * @param InstanceLabels The instance categories.
   * Third row and onwards of the benchmark results file.
   * @param ProblemAndResults The problems and the results.
   * @param FirstProblem The first problem = 3.
   */
  const Instance = GetInstanceAndSolvers(SolvedData[0]).shift();
  const Solvers = GetInstanceAndSolvers(SolvedData[0]).slice(1);
  const DataLabels = GetDataLabels(SolvedData[1]);
  const InstanceLabels = DataLabels.splice(0, 7);
  const ProblemAndResults = GetProblems(SolvedData[3]);
  let FirstProblem = 3;
  
  /**
   * @param ProblemList List of the problems.
   */
  const ProblemList = []; 
  for (var i = FirstProblem; i < SolvedData.length; i++) {
    ProblemList.push(GetProblems(SolvedData[i])[0]);
  }

  /**
   * @param ResultsData List of results.
   */
  const ResultsData = [];
  for (FirstProblem; FirstProblem < SolvedData.length; FirstProblem++) {
    ResultsData.push(GetProblems(SolvedData[FirstProblem]).slice(1));
  }

  //#region Printing information of the data.
  console.log("Total number of rows in the data file: \n" + SolvedData.length);
  console.log("Solvers: \n", Solvers)
  console.log("Number of filtered data labels: \n", DataLabels.length);
  console.log("Data labels: \n", DataLabels);
  console.log("Instance categories: \n", InstanceLabels)
  console.log("Filtered results for problem: \n", ProblemAndResults[0], "results: ", ProblemAndResults.slice(1));
  //#endregion

  /**
   * Create the solver filters, displayed in the element with the id: tableFilters.
   * @param TableFilters Filters for the table.;
   */
  TableFilters(Solvers);

  /**
   * Select all checkboxes button functionality.
   */
  SelectAllButton.addEventListener("click", function () {
    let FilterSolvers = document.getElementsByTagName("input");
    for (let Solver of FilterSolvers) {
      if (!Solver.checked && Solver.id != "fileInput") {
        Solver.click();
      }
    }
    SelectAllButton.disabled = true;
  })

  /**
   * Check if the user us is on the Report page.
   */
  if (document.title == "Report") {
    ViewSelectionButton.addEventListener("click", function () {
      let CheckedSolvers = GetCheckedSolvers();
      let ComparisonArray = GetComparisonArray(CheckedSolvers, Solvers);

      /**
       * @param TableDisplayData Display the data in the div with the id "dataTable" when clicking on the view selection button.
       * @param TableSearch Create the input search element after generating the table.
       * @param TableDownloadCSV Create a save CSV button after generating the table.
       */
      TableDisplayData(Instance, CheckedSolvers, InstanceLabels, DataLabels, ProblemList, ResultsData, ComparisonArray);
      SelectAllButton.disabled = false;

      // @ts-ignore
      jq("#dataTableGenerated").DataTable(
        {
          // colReorder: true,
          rowReorder: true,
          buttons: ['copy'],
          // columnDefs: [ {
          //     orderable: false,
          //     className: 'select-checkbox',
          //     targets: 0
          //     } ],
          select: {
              style: 'os',
              blurable: true,
              className: 'row-selected-problems'
              }
        }
      );

      const InputSearch = document.getElementById("tableSearch") as HTMLInputElement;
      InputSearch.value = "";
      InputSearch.oninput = () => {
        TableSearch();
      }

      const DownloadCSVButton = document.getElementById("downloadCSVButton") as HTMLButtonElement;
      DownloadCSVButton.addEventListener("click", () => TableDownloadCSV());
    })
  }

  /**
   * Check if the user us is on the Plots page.
   */
  if (document.title == "Plots") {
    const ViewPlotsButton = document.getElementById('viewPlotsButton') as HTMLButtonElement;
    ViewPlotsButton.addEventListener("click", function () {
      let CheckedSolvers = GetCheckedSolvers();
      let ComparisonArray = GetComparisonArray(CheckedSolvers, Solvers);

      /**
       * @param CreateChart Filter and display the data in plots when clicking on the view plots button.
       */
      CreateChart(Solvers, ResultsData, ComparisonArray);
      SelectAllButton.disabled = false;
    })
  }
}