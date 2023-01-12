import { TableFilters } from './Table/TableFilters';
import { TableDisplay } from './Table/TableDisplay';
import { UpdateProblemList, UpdateResultsData } from "./Table/TableSaveSelection";
import { TableDownloadCSV } from "./Table/TableDownloadCSV";
import { TableSearch } from "./Table/TableSearch";
import { CreateData } from './DataProcessing/CreateData';
import { ImportDataEvents } from './DataProcessing/ImportDataEvents';
import { ReadData } from './DataProcessing/ReadData';
import { GetInstanceAndSolvers, GetDataLabels, GetProblems } from './DataProcessing/FilterData';
import { InitializePlots } from './Chart/InitializePlot';
import { SelectAllSolvers } from './Solvers/SelectAllSolvers';
import { FileInput, ImportDataButton, SelectAllButton, ViewSelectionButton, ViewPlotsButton, FilterSelectionButton, SaveLocalStorageButton, DownloadCSVButton, InputSearch } from './Elements/Elements';

/**
 * Set the filename to be empty and declare an array to store the benchmarks in.
 * @param RawData Raw data of the imported benchmark results.
 */
FileInput.value = '';
let RawData = [];

/**
 * Try to retrieve stored data.
 */
try {
  //RawData = JSON.parse(localStorage.getItem('myData'));
  SelectAllButton.disabled = false;
  ViewSelectionButton.disabled = false;
  ManageData();
} catch {
  console.log("No data found in local storage.");
}

/**
 * Read the data from the input file.
 */
FileInput.addEventListener('change', () => {
  RawData = ReadData(RawData);
});


/**
 * Click on the upload data button to start the process. Store the data in localStorage.
 */
ImportDataButton.addEventListener("click", () => {
  ImportDataEvents();
  ManageData();
});

/**
 * Sort the benchmark results file and display the relevant elements per page. 
 */
function ManageData() {
  /**
   * Setting the benchmark results file data.
   * @param SolvedData Data from the benchmark results file.
   */
  const SolvedData = RawData;
  console.log("The SolvedData: ", SolvedData);

  /**
   * First row of the benchmark results file.
   * @param Instance The column where the instance is located. Instance is at index 0.
   * @param Solvers The columns where the solvers are located. Solvers are in the rest of the indices.
   * Second row of the benchmark results file.
   * @param DataLabels The data labels.
   * @param InstanceLabels The instance categories.
   * Third row and onwards of the benchmark results file.
   * @param FirstProblem The first problem = 3.
   * Problems and the results kept separate.
   * @param ProblemList List of the problems.
   * @param ResultsData List of results.
   */
  const Instance = GetInstanceAndSolvers(SolvedData[0]).shift();
  const Solvers = GetInstanceAndSolvers(SolvedData[0]).slice(1);
  const DataLabels = GetDataLabels(SolvedData[1]);
  const InstanceLabels = DataLabels.splice(0, 7);
  let FirstProblem = 3;

  let ProblemList = [];
  for (var i = FirstProblem; i < SolvedData.length; i++) {
    ProblemList.push(GetProblems(SolvedData[i])[0]);
  }

  let ResultsData = [];
  for (FirstProblem; FirstProblem < SolvedData.length; FirstProblem++) {
    ResultsData.push(GetProblems(SolvedData[FirstProblem]).slice(1));
  }

  //#region Printing information of the data.
  console.log("Total number of rows in the data file: \n" + SolvedData.length);
  console.log("Solvers: \n", Solvers);
  console.log("Instance: \n", Instance);
  console.log("Instance categories: \n", InstanceLabels);
  console.log("Number of data labels: \n", DataLabels.length, " and data labels: ", DataLabels);
  console.log("All problems: \n", ProblemList);
  console.log("All results: \n", ResultsData);
  //#endregion

  /**
   * Create the solver filters, displayed in the element with the id: tableFilters.
   * @param TableFilters Filters for the table.;
   */
  TableFilters(Solvers);

  /**
   * Select all checkboxes button functionality.
   */
  SelectAllButton.addEventListener("click", () => {
    SelectAllSolvers();
  });

  /**
   * Check if the user us is on the Report page.
   */
  if (document.title == "Report") {
    /**
     * Shows all problems.
     */
    ViewSelectionButton.addEventListener("click", () => {
      TableDisplay(Instance, Solvers, InstanceLabels, DataLabels, ProblemList, ResultsData);
    });

    /**
     * Shows the selected problems by modifying the ProblemList and ResultsData.
     */
    FilterSelectionButton.addEventListener("click", () => {

      console.log("Problemlist: ", ProblemList);
      console.log("ResultsData: ", ResultsData);
      let ProblemListFiltered = [];
      let ResultsDataFiltered = [];
      ProblemListFiltered = UpdateProblemList();
      ResultsDataFiltered = UpdateResultsData();
  
      console.log("ProblemListFiltered: ", ProblemListFiltered);
      console.log("ResultsDataFiltered: ", ResultsDataFiltered);
      TableDisplay(Instance, Solvers, InstanceLabels, DataLabels, ProblemListFiltered, ResultsDataFiltered);
      //console.clear();

      /**
       * TODO:
       * Add the following to a NewSolvedData.
       */
      let output = CreateData(Instance, Solvers, InstanceLabels, DataLabels, ProblemListFiltered, ResultsDataFiltered);
      console.log(output);
    });

    /**
     * Save to local storage when clicking on the relevant button.
     * Make the visible data to 1 new SolvedData.
     */
    // SaveLocalStorageButton.addEventListener("click", () => {
    //   localStorage.setItem('SavedBenchmarkResults', JSON.stringify(SolvedData));
    //   console.log("Saved benchmarks:\n", SolvedData);
    // })

    /**
     * Download the currently displayed table as a CSV.
     */
    DownloadCSVButton.addEventListener("click", () => {
      TableDownloadCSV();
    });
  }

  /**
   * Check if the user us is on the Plots page.
   */
  if (document.title == "Plots") {
    ViewPlotsButton.addEventListener("click", () => {
      InitializePlots(Solvers, ResultsData);
    });
  }
}