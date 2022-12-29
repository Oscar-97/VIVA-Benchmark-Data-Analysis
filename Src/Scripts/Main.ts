import { TableFilters } from './Table/TableFilters';
import { TableDisplay } from './Table/TableDisplay';
import { UpdateProblemList, UpdateResultsData } from "./Table/TableSaveSelection";
import { TableDownloadCSV } from "./Table/TableDownloadCSV";
import { TableSearch } from "./Table/TableSearch";
import { ImportDataEvents } from './DataProcessing/ImportDataEvents';
import { ReadData } from './DataProcessing/ReadData';
import { GetInstanceAndSolvers, GetDataLabels, GetProblems } from './DataProcessing/FilterData';
import { InitializePlots } from './Chart/InitializePlot';
import { SelectAllSolvers } from './Solvers/SelectAllSolvers';
import { FileInput, ImportDataButton, SelectAllButton, ViewSelectionButton, ViewPlotsButton, FilterSelectionButton, DownloadCSVButton, InputSearch } from './Elements/Elements';

/**
 * Set the filename to be empty.
 */
FileInput.value = '';
/**
 * Storage of the imported benchmark results.
 */
let RawData = [];

/**
 * Click on the upload data button to start the process.
 */
ImportDataButton.addEventListener("click", () => {
  ImportDataEvents();
  ManageData();
});

/**
 * Read the data from the input file.
 */
FileInput.addEventListener('change', () => {
  RawData = ReadData(RawData);
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
  console.log("Solvers: \n", Solvers)
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
     * TODO:
     * Make it possible to shot the original data after modifying it.
     */
    ViewSelectionButton.addEventListener("click", () => {
      TableDisplay(Instance, Solvers, InstanceLabels, DataLabels, ProblemList, ResultsData);
    });

    /**
     * Shows the selected problems by modifying the ProblemList and ResultsData.
     */
    FilterSelectionButton.addEventListener("click", () => {
      ProblemList = UpdateProblemList(ProblemList);
      ResultsData = UpdateResultsData(ResultsData);
      console.log("ProblemList: ", ProblemList);
      console.log("ResultsData: ", ResultsData);
      TableDisplay(Instance, Solvers, InstanceLabels, DataLabels, ProblemList, ResultsData);
    });

    DownloadCSVButton.addEventListener("click", () => {
      TableDownloadCSV();
    });

    // InputSearch.value = "";
    // InputSearch.oninput = () => {
    //   TableSearch();
    // }
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