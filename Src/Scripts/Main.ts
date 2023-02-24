//#region Imports
import { TableFilters } from "./DataTable/DataTableFilters";
import { TableDisplay, TableDisplayTrc } from "./DataTable/DataTableWrapper";
import {
  UpdateProblemList,
  UpdateResultsData,
  UpdateResultsTrc,
} from "./DataTable/UpdateResults";
import { TableDownloadCSV } from "./DataTable/DownloadCSV";

import { CreateData, CreateDataTrc } from "./DataProcessing/CreateData";
import { ImportDataEvents } from "./DataProcessing/ImportDataEvents";
import {
  ReadData,
  ReadInstanceInformationData,
  ReadSoluData,
  GetDataFileType,
} from "./DataProcessing/ReadData";
import {
  ExtractTrcData,
  GetTrcDataCategory,
} from "./DataProcessing/FilterDataTrc";
import {
  GetInstanceInformation,
  GetInstancePrimalDualbounds,
} from "./DataProcessing/GetInstanceInformation";
import {
  GetInstance,
  GetSolvers,
  GetInstanceLabels,
  GetDataLabels,
  GetProblems,
  GetResults,
} from "./DataProcessing/FilterDataTxt";
import { MergeData } from "./DataProcessing/MergeData";

import { InitializePlots } from "./Chart/InitializePlot";

import { SelectAllSolvers } from "./Solvers/SelectAllSolvers";

import {
  CreateUserConfiguration,
  GetUserConfiguration,
  DeleteUserConfiguration,
  DownloadUserConfiguration,
} from "./UserConfiguration/UserConfiguration";

import {
  FileInput,
  ImportDataButton,
  SelectAllButton,
  ViewAllResultsButton,
  ViewPlotsButton,
  FilterSelectionButton,
  SaveLocalStorageButton,
  DownloadConfigurationButton,
  DownloadCSVButton,
  InstanceDataInput,
  ImportInstanceDataButton,
  DeleteLocalStorageButton,
} from "./Elements/Elements";
import { DisplayErrorNotification } from "./Elements/DisplayAlertNotification";
//#endregion

/**
 * Set the filename to be empty and declare an array to store the benchmarks in.
 * @param RawData Raw data of the imported benchmark results.
 * @param FileExtensionType Type of file extension for the imported data.
 * @param RawInstanceInfoData Unprocessed instanceinfo.csv containing properties.
 * @param InstanceInfoData Properties for instances.
 * @param RawSoluData Unprocessed minlplib.solu.
 * @param SoluData Best known primal and dual bounds for each instance.
 */
FileInput.value = "";
InstanceDataInput.value = "";
let RawData = [];
let FileExtensionType = "";
let RawInstanceInfoData = [];
let InstanceInfoData = [];
const RawSoluData = [];
const SoluData = [];

/**
 * TODO:
 * Set all button status from new method after refreshing.
 */

/**
 * Try to retrieve stored config/data/state when arriving to or refreshing the page.
 */
try {
  [RawData, FileExtensionType] = GetUserConfiguration();
  ImportDataEvents("Found cached benchmark file!", FileExtensionType);
  ManageData();
} catch (err) {
  console.log("No data found in local storage: ", err);
}

/**
 * Read the data from the input file and set the file extension type.
 */
FileInput.addEventListener("change", () => {
  FileExtensionType = GetDataFileType();
  // if (FileExtensionType === "txt" || FileExtensionType === "trc" || FileExtensionType === "json") {
  //   RawData = ReadData(RawData);
  // } else if (FileExtensionType === "csv") {
  //   RawInstanceInfoData = ReadInstanceInformationData(RawInstanceInfoData);
  // } else if (FileExtensionType === "solu") {
  //   RawSoluData = ReadSoluData(RawSoluData);
  // } else {
  //   DisplayErrorNotification(
  //     "Invalid file extension. Please use a .trc or .txt file for results. Use a .csv file for instance data information and .solu file for best known primal and dual bounds for each instance."
  //   );
  // }
  ReadData(RawData, RawInstanceInfoData, RawSoluData);
  console.log("RawData: ", RawData);
  console.log("RawInstanceInfoData: ", RawInstanceInfoData);
  console.log("RawSoluData: ", RawSoluData);
});

/**
 * Click on the upload data button to continue the process.
 */
ImportDataButton.addEventListener("click", () => {
  // if (FileExtensionType === "txt" || FileExtensionType === "trc" || FileExtensionType === "json") {
  //   ImportDataEvents("Benchmark file succesfully loaded!", FileExtensionType);
  //   ManageData();
  // // } else if (FileExtensionType === "csv") {
  // //   InstanceInfoData = GetInstanceInformation(RawInstanceInfoData);
  // } else if (FileExtensionType === "solu") {
  //   SoluData = GetInstancePrimalDualbounds(RawSoluData);
  // }
  ImportDataEvents("Benchmark file succesfully loaded!", FileExtensionType);
  console.log(FileExtensionType, "is the filetype.");
  ManageData();
});

/**
 * Sort the benchmark results file and display the relevant elements per page.
 */
function ManageData(): void {
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
  } else if (FileExtensionType === "trc") {
    TrcData = ExtractTrcData(RawData);
    ProblemList = GetTrcDataCategory(TrcData, "filename");
    console.log("Content of .trc file: ", TrcData);
    if (RawInstanceInfoData.length !== 0) {
      InstanceInfoData = GetInstanceInformation(RawInstanceInfoData);
    }
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
        TableDisplay(
          Instance,
          Solvers,
          InstanceLabels,
          DataLabels,
          ProblemList,
          ResultsData
        );
      } else if (FileExtensionType === "trc") {
        /**
         * Check if instancedata.csv is provided.
         * If not, use regular display data
         */
        if (InstanceInfoData.length === 0) {
          TableDisplayTrc(TrcData);
        } else {
          const MergedData: string[] = MergeData(TrcData, InstanceInfoData);
          if (MergedData.length === 0) {
            TableDisplayTrc(TrcData);
          } else {
            TableDisplayTrc(MergedData);
          }
        }
      } else if (FileExtensionType === "json") {
        console.log("Clicked view all results after uploading json file.");
        [RawData, FileExtensionType] = GetUserConfiguration();
        TrcData = ExtractTrcData(RawData);
        TableDisplayTrc(TrcData);
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

        TableDisplay(
          Instance,
          Solvers,
          InstanceLabels,
          DataLabels,
          ProblemListFiltered,
          ResultsDataFiltered
        );
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
        CreateData(
          Instance,
          Solvers,
          InstanceLabels,
          DataLabels,
          ProblemListFiltered,
          ResultsDataFiltered
        );
        CreateUserConfiguration(RawData, FileExtensionType);
      } else if (FileExtensionType === "trc" || FileExtensionType === "json") {
        /**
         * Save the modified NewRawData as user configuration.
         */
        let NewRawData = [];
        if (TrcDataFiltered.length === 0) {
          NewRawData = CreateDataTrc(TrcData);
        } else {
          NewRawData = CreateDataTrc(TrcDataFiltered);
        }
        CreateUserConfiguration(NewRawData, FileExtensionType);
      }
      console.log("Saved benchmarks.");
    });

    /**
     * Download the current configuration.
     */
    DownloadConfigurationButton.addEventListener("click", () => {
      DownloadUserConfiguration();
    });

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
    });

    /**
     * Delete stored data in local storage.
     */
    DeleteLocalStorageButton.addEventListener("click", () => {
      DeleteUserConfiguration();
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
