//#region Imports
import { TableFilters } from './Table/TableFilters';
import { TableDisplay, TableDisplayTrc } from './Table/TableDisplay';
import { UpdateProblemList, UpdateResultsData, UpdateResultsTrc } from "./Table/TableSaveSelection";
import { TableDownloadCSV } from "./Table/TableDownloadCSV";

import { CreateData, CreateDataTrc } from './DataProcessing/CreateData';
import { ImportDataEvents } from './DataProcessing/ImportDataEvents';
import { ReadData, ReadInstanceInformationData, GetFileType } from './DataProcessing/ReadData';
import { ExtractTrcData, GetTrcDataCategory } from './DataProcessing/FilterDataTrc';
import { GetInstanceInformation } from './DataProcessing/FilterDataTrcInfo';
import { GetInstance, GetSolvers, GetInstanceLabels, GetDataLabels, GetProblems, GetResults } from './DataProcessing/FilterDataTxt';
import { MergeData } from './DataProcessing/MergeData';

import { InitializePlots } from './Chart/InitializePlot';

import { SelectAllSolvers } from './Solvers/SelectAllSolvers';

import { CreateUserConfiguration, GetUserConfiguration, DeleteUserConfiguration } from './UserConfiguration/UserConfiguration';

import { FileInput, ImportDataButton, SelectAllButton, ViewAllResultsButton, ViewPlotsButton, FilterSelectionButton, SaveLocalStorageButton, DownloadCSVButton, InstanceDataInput, ImportInstanceDataButton, InputSearch, DeleteLocalStorageButton } from './Elements/Elements';
//#endregion

/**
 * Set the filename to be empty and declare an array to store the benchmarks in.
 * @param RawData Raw data of the imported benchmark results.
 * @param FileExtensionType Type of file extension for the imported data.
 */
FileInput.value = '';
InstanceDataInput.value = '';
let RawData = [];
let FileExtensionType = '';
let RawInstanceInfoData = [];
let InstanceInfoData = [];

/**
 * Try to retrieve stored config/data/state.
 */
try {
  [RawData, FileExtensionType] = GetUserConfiguration();
  ImportDataEvents("Found cached benchmark file!");
  ManageData();
} catch (err) {
  console.log("No data found in local storage: ", err);
}

/**
 * Read the data from the input file and set the file extension type.
 */
FileInput.addEventListener("change", () => {
  RawData = ReadData(RawData);
  FileExtensionType = GetFileType();
});

/**
 * Click on the upload data button to start the process.
 */
ImportDataButton.addEventListener("click", () => {
  ImportDataEvents("Benchmark file succesfully loaded!");
  ManageData();
});

/**
 * Sort the benchmark results file and display the relevant elements per page. 
 */
function ManageData() {
  /**
   * Setting the benchmark results file data.
   */
  console.log("The RawData: ", RawData);
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
  
  let ProblemListFiltered = [];
  let ResultsDataFiltered = [];

  /**
   * TrcData results file.
   * @param TrcData
   * @param TrcDataFiltered
   */
  let TrcData = [];
  let TrcDataFiltered = [];

  /**
   * Check which file format is used and add the data to correct categories.
   */
  if (FileExtensionType === "txt") {
    Instance = GetInstance(RawData);
    Solvers = GetSolvers(RawData);
    DataLabels = GetDataLabels(RawData);
    InstanceLabels = GetInstanceLabels(DataLabels);
    ProblemList = GetProblems(RawData);
    ResultsData = GetResults(RawData);

    TableFilters(Solvers, "Solvers");
  }
  else if (FileExtensionType === "trc") {
    TrcData = ExtractTrcData(RawData);
    console.log("Content of .trc file: ", TrcData);

    /**
     * Create the filters for problems.
     * TODO: Add functionality for this.
     * Only displayed at the moment.
     */
    //ProblemList = GetTrcDataCategory(TrcData, "filename");
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
        /**
         * Check if instancedata.csv is provided.
         * If not, use regular display data
         */
        if (InstanceInfoData.length === 0) {
          TableDisplayTrc(TrcData);
        } else {
          let MergedData = MergeData(TrcData, InstanceInfoData);
          TableDisplayTrc(MergedData);
        }
      }
    });

    /**
     * Shows the selected problems by modifying the ProblemList and ResultsData.
     */
    FilterSelectionButton.addEventListener("click", () => {

      FilterSelectionButton.disabled = true;
      if (FileExtensionType === "txt") {
        ProblemListFiltered = UpdateProblemList();
        ResultsDataFiltered = UpdateResultsData();
        
        console.log("ProblemListFiltered: ", ProblemListFiltered);
        console.log("ResultsDataFiltered: ", ResultsDataFiltered);

        TableDisplay(Instance, Solvers, InstanceLabels, DataLabels, ProblemListFiltered, ResultsDataFiltered);
      } else if (FileExtensionType === "trc") {
        TrcDataFiltered = UpdateResultsTrc();
        
        console.log("TrcData Filtered: ", TrcDataFiltered);

        TableDisplayTrc(TrcDataFiltered);
      }
    });

    /**
     * Save to local storage when clicking on the relevant button.
     */
    SaveLocalStorageButton.addEventListener("click", () => {
      if (FileExtensionType === "txt") {
        CreateData(Instance, Solvers, InstanceLabels, DataLabels, ProblemListFiltered, ResultsDataFiltered);
        CreateUserConfiguration(RawData, FileExtensionType);
      } else if (FileExtensionType === "trc") {
        /**
         * Save the modified NewRawData as user configuration.
         */
        let NewRawData = [];
        if (TrcDataFiltered.length === 0) {
          NewRawData = CreateDataTrc(TrcData);
        }
        else {
          NewRawData = CreateDataTrc(TrcDataFiltered);
        }
        CreateUserConfiguration(NewRawData, FileExtensionType);
      }
      console.log("Saved benchmarks.");
    })

    /**
     * Download the currently displayed table as a CSV.
     */
    DownloadCSVButton.addEventListener("click", () => {
      TableDownloadCSV();
    });

    /**
     * Import information regarding the problems from an 'instancedata.csv' file.
     */
    InstanceDataInput.addEventListener("change", () => {
      RawInstanceInfoData = ReadInstanceInformationData(RawInstanceInfoData);
    });

    /**
     * Convert instance information to objects.
     */
    ImportInstanceDataButton.addEventListener("click", () => {
      InstanceInfoData = GetInstanceInformation(RawInstanceInfoData);
    })

    /**
     * Delete stored data in local storage.
     */
    DeleteLocalStorageButton.addEventListener("click", () => {
      DeleteUserConfiguration();
    })
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