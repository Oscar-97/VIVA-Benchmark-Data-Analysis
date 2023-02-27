//#region Imports
import { TableFilters } from "./DataTable/DataTableFilters";
import {
  TableDisplay,
  TableDisplayTrc,
  DestroyDataTable,
} from "./DataTable/DataTableWrapper";
import {
  UpdateProblemList,
  UpdateResultsData,
  UpdateResultsTrc,
} from "./DataTable/UpdateResults";
import { TableDownloadCSV } from "./DataTable/DownloadCSV";
import { CreateData, CreateDataTrc } from "./DataProcessing/CreateData";
import { ImportDataEvents } from "./Elements/ImportDataEvents";
import { ReadData, GetDataFileType } from "./DataProcessing/ReadData";
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
import {
  MergeData
} from "./DataProcessing/MergeData";
import { InitializePlots } from "./Chart/InitializePlot";
import {
  ToggleSelection,
  SelectSavedSolvers,
} from "./Solvers/SelectAllSolvers";
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
  DeleteLocalStorageButton,
  ClearTableButton,
} from "./Elements/Elements";
import { GetCheckedSolvers } from "./Solvers/UsedSolvers";
import { ElementStatus } from "./Elements/ElementStatus";
//#endregion

/**
 * Set the filename to be empty and declare an array to store the benchmarks in.
 * @param RawData Raw data of the imported benchmark results.
 * @param CheckedSolvers Array containing checked solvers.
 * @param DataFileType Type of file extension for the imported data.
 * @param RawInstanceInfoData Unprocessed instanceinfo.csv containing properties.
 * @param RawSoluData Unprocessed minlplib.solu. Best known primal and dual bounds for each instance.
 */
let RawData = [];
let CheckedSolvers = [];
let DataFileType = "";
const RawInstanceInfoData = [];
const RawSoluData = [];

/**
 * Set all button status from new method after refreshing.
 */
ElementStatus();

/**
 * Try to retrieve stored config/data/state when arriving to the page, or refreshing the page.
 */
try {
  [RawData, DataFileType, CheckedSolvers] = GetUserConfiguration();
  ImportDataEvents("Found cached benchmark file!", "json");
  ManageData();
} catch (err) {
  console.log("No data found in local storage: ", err);
}

/**
 * Read the data from the input file and set the file extension type.
 */
FileInput.addEventListener("change", () => {
  DataFileType = GetDataFileType();
  ReadData(RawData, RawInstanceInfoData, RawSoluData);
});

/**
 * Click on the upload data button to continue the process.
 */
ImportDataButton.addEventListener("click", () => {
  ImportDataEvents("Benchmark file succesfully loaded!");
  ManageData();
});

/**
 * Sort the benchmark results file and display the relevant elements per page.
 */
function ManageData(): void {
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

  let SoluData = [];
  let InstanceInfoData = [];

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
   * Run if the uploaded file is json.
   */
  if (DataFileType == "json") {
    [RawData, DataFileType, CheckedSolvers] = GetUserConfiguration();
  }

   /**
   * Check which file format is used, add the data to correct categories and create the solver filters. Select solvers if they are found in localStorage.
   */
  if (DataFileType === "txt") {
    Instance = GetInstance(RawData);
    Solvers = GetSolvers(RawData);
    DataLabels = GetDataLabels(RawData);
    InstanceLabels = GetInstanceLabels(DataLabels);
    ProblemList = GetProblems(RawData);
    ResultsData = GetResults(RawData);
    TableFilters(Solvers, "Solvers");
  } else if (DataFileType === "trc") {
    TrcData = ExtractTrcData(RawData);

    if (RawInstanceInfoData.length !== 0) {
      InstanceInfoData = GetInstanceInformation(RawInstanceInfoData);
      TrcData = MergeData(TrcData, InstanceInfoData);
    }

    if (RawSoluData.length !== 0) {
      SoluData = GetInstancePrimalDualbounds(RawSoluData);
      TrcData = MergeData(TrcData, SoluData);
    }
    Solvers = GetTrcDataCategory(TrcData, "SolverName");
    TableFilters(Solvers, "Solvers");
  }

  if (CheckedSolvers.length !== 0) {
    SelectSavedSolvers(CheckedSolvers);
  }

  /**
   * Select all checkboxes button functionality.
   */
  SelectAllButton.addEventListener("click", () => {
    ToggleSelection();
  });

  /**
   * Check if the user is on the Report page.
   */
  if (document.title == "Report") {
    /**
     * Shows all problems depending on the uploaded file.
     */
    ViewAllResultsButton.addEventListener("click", () => {
      if (DataFileType === "txt") {
        TableDisplay(
          Instance,
          Solvers,
          InstanceLabels,
          DataLabels,
          ProblemList,
          ResultsData
        );
      } else if (DataFileType === "trc") {
        TableDisplayTrc(TrcData);
      } else if (DataFileType === "json") {
        [RawData, DataFileType] = GetUserConfiguration();
        TrcData = ExtractTrcData(RawData);
        TableDisplayTrc(TrcData);
      }
    });

    /**
     * Shows the selected problems by modifying the ProblemList and ResultsData.
     */
    FilterSelectionButton.addEventListener("click", () => {
      FilterSelectionButton.disabled = true;
      if (DataFileType === "txt") {
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
      } else if (DataFileType === "trc") {
        TrcDataFiltered = UpdateResultsTrc();

        console.log("TrcData Filtered: ", TrcDataFiltered);

        TableDisplayTrc(TrcDataFiltered);
      }
    });

    /**
     * Save to local storage when clicking on the relevant button.
     */
    SaveLocalStorageButton.addEventListener("click", () => {
      if (DataFileType === "txt") {
        CreateData(
          Instance,
          Solvers,
          InstanceLabels,
          DataLabels,
          ProblemListFiltered,
          ResultsDataFiltered
        );
        CheckedSolvers = GetCheckedSolvers();
        CreateUserConfiguration(RawData, DataFileType, CheckedSolvers);
      } else if (DataFileType === "trc" || DataFileType === "json") {
        /**
         * Save the modified NewRawData as user configuration.
         */
        let NewRawData = [];
        if (TrcDataFiltered.length === 0) {
          NewRawData = CreateDataTrc(TrcData);
        } else {
          NewRawData = CreateDataTrc(TrcDataFiltered);
        }
        CheckedSolvers = GetCheckedSolvers();
        CreateUserConfiguration(NewRawData, DataFileType, CheckedSolvers);
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
     * Delete stored data in local storage.
     */
    DeleteLocalStorageButton.addEventListener("click", () => {
      DeleteUserConfiguration();
    });

    /**
     * Clear table action.
     */
    ClearTableButton.addEventListener("click", () => {
      DestroyDataTable();
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
