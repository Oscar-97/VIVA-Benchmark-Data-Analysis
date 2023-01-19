import { TableFilters } from './Table/TableFilters';
import { TableDisplay, TableDisplayTrc } from './Table/TableDisplay';
import { UpdateProblemList, UpdateResultsData, UpdateResultsTrc } from "./Table/TableSaveSelection";
import { TableDownloadCSV } from "./Table/TableDownloadCSV";
import { CreateData } from './DataProcessing/CreateData';
import { ImportDataEvents } from './DataProcessing/ImportDataEvents';
import { ReadData, GetFileType } from './DataProcessing/ReadData';
import { ExtractTrcData, GetTrcDataCategory } from './DataProcessing/FilterDataTrc';
import { GetInstance, GetSolvers, GetInstanceLabels, GetDataLabels, GetProblems, GetResults } from './DataProcessing/FilterDataTxt';
import { InitializePlots } from './Chart/InitializePlot';
import { SelectAllSolvers } from './Solvers/SelectAllSolvers';
import { FileInput, ImportDataButton, SelectAllButton, ViewAllResultsButton, ViewPlotsButton, FilterSelectionButton, SaveLocalStorageButton, DownloadCSVButton, InputSearch } from './Elements/Elements';

/**
 * Set the filename to be empty and declare an array to store the benchmarks in.
 * @param RawData Raw data of the imported benchmark results.
 * @param FileExtensionType Type of file extension for the imported data.
 */
FileInput.value = '';
let RawData = [];
let FileExtensionType = '';

/**
 * TODO: 
 * Try to retrieve stored data.
 */
try {
  //RawData = JSON.parse(localStorage.getItem('myData'));
  SelectAllButton.disabled = false;
  ViewAllResultsButton.disabled = false;
  ManageData();
} catch {
  console.log("No data found in local storage.");
}

/**
 * Read the data from the input file and set the file extension type.
 */
FileInput.addEventListener('change', () => {
  RawData = ReadData(RawData);
  FileExtensionType = GetFileType();
});


/**
 * Click on the upload data button to start the process.
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
  console.log("File extension: ", FileExtensionType);

  /**
   * First row of the benchmark results file.
   * @param Instance The column where the instance is located. Instance is at index 0.
   * @param Solvers The columns where the solvers are located. Solvers are in the rest of the indices.
   * 
   * Second row of the benchmark results file.
   * @param DataLabels The data labels.
   * @param InstanceLabels The instance categories.
   * 
   * Problems and the results kept separate.
   * @param ProblemList List of the problems.
   * @param ResultsData List of results.
   */
  let Instance: string;
  let Solvers: string[] = [];
  let DataLabels: string[];
  let InstanceLabels: string[];
  let ProblemList = [];
  let ResultsData = [];

  let TrcData = [];
  let ModelTypes = [];
  let Directions = [];
  let ModelStatuses = [];
  let SolverStatuses = [];
  let ObjectiveValues = [];
  let SolverTimes = [];

  /**
   * Check which file format is used.
   */
  if (FileExtensionType === "txt") {
    Instance = GetInstance(SolvedData);
    Solvers = GetSolvers(SolvedData);
    DataLabels = GetDataLabels(SolvedData);
    InstanceLabels = GetInstanceLabels(DataLabels);
    ProblemList = GetProblems(SolvedData);
    ResultsData = GetResults(SolvedData);

    TableFilters(Solvers, "Solvers");
  } else if (FileExtensionType === "trc") {
    TrcData = ExtractTrcData(SolvedData);
    console.log("Content of .trc file: ", TrcData);
    ProblemList = GetTrcDataCategory(TrcData, "InputFileName");
    ModelTypes = GetTrcDataCategory(TrcData, "ModelType");
    Solvers = GetTrcDataCategory(TrcData, "SolverName");
    Directions = GetTrcDataCategory(TrcData, "Direction");
    ModelStatuses = GetTrcDataCategory(TrcData, "ModelStatus");
    SolverStatuses = GetTrcDataCategory(TrcData, "SolverStatus");
    ObjectiveValues = GetTrcDataCategory(TrcData, "ObjectiveValue");
    SolverTimes = GetTrcDataCategory(TrcData, "SolverTime");

    /**
     * Create the filters for problems.
     * TODO: Add functionality for this.
     * Only displayed at the moment.
     */
    //TableFilters(ProblemList, "Problems");
  }

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
     * Shows all problems depending on the uploaded file.
     */
    ViewAllResultsButton.addEventListener("click", () => {
      if (FileExtensionType === "txt") {
        TableDisplay(Instance, Solvers, InstanceLabels, DataLabels, ProblemList, ResultsData);
      }
      else if (FileExtensionType === "trc") {
        //TableDisplayTrc(ProblemList, ModelTypes, Solvers, Directions, ModelStatuses, SolverStatuses, ObjectiveValues, SolverTimes);
        TableDisplayTrc(TrcData);
      }
    });

    /**
     * Shows the selected problems by modifying the ProblemList and ResultsData.
     */
    FilterSelectionButton.addEventListener("click", () => {

      FilterSelectionButton.disabled = true;
      if (FileExtensionType === "txt") {
        let ProblemListFiltered = [];
        let ResultsDataFiltered = [];
        ProblemListFiltered = UpdateProblemList();
        ResultsDataFiltered = UpdateResultsData();

        console.log("ProblemListFiltered: ", ProblemListFiltered);
        console.log("ResultsDataFiltered: ", ResultsDataFiltered);
        TableDisplay(Instance, Solvers, InstanceLabels, DataLabels, ProblemListFiltered, ResultsDataFiltered);
      } else if (FileExtensionType === "trc") {
        let TrcDataFiltered = [];
        TrcDataFiltered = UpdateResultsTrc();
        console.log("TrcData Filtered: ", TrcDataFiltered);
        TableDisplayTrc(TrcDataFiltered);
      }

      /**
       * TODO:
       * Add the following to a NewSolvedData.
       */
      //let output = CreateData(Instance, Solvers, InstanceLabels, DataLabels, ProblemListFiltered, ResultsDataFiltered);
      //console.log(output);
    });

    /**
     * TODO:
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