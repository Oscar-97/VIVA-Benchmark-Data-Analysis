// #region Imports
/**
 * Chart.
 */
import { CreateChart, PickColor } from "./Chart/CreateChart";

/**
 * Dataprocessing.
 */
import {
  AnalyzeDataByCategory,
  ExtractAllSolverTimes,
} from "./DataProcessing/CalculateResults";
import { CreateData, CreateDataTrc } from "./DataProcessing/CreateData";
import { ImportDataEvents } from "./Elements/ImportDataEvents";
import { ReadData, GetDataFileType } from "./DataProcessing/ReadData";
import { MergeData } from "./DataProcessing/MergeData";
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

/**
 * DataTable.
 */
import { StatisticsTable } from "./DataTable/DataTableBase";
import { TableFilters } from "./DataTable/DataTableFilters";
import { TableDownloadCSV } from "./DataTable/DownloadCSV";
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

/**
 * Elements.
 */
import { ElementStatus, ElementStatusPlots } from "./Elements/ElementStatus";
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

/**
 * Solvers.
 */
import { GetCheckedSolvers } from "./Solvers/UsedSolvers";
import {
  ToggleSelection,
  SelectSavedSolvers,
} from "./Solvers/SelectAllSolvers";

/**
 * User Configuration.
 */
import {
  CreateUserConfiguration,
  GetUserConfiguration,
  DeleteUserConfiguration,
  DownloadUserConfiguration,
} from "./UserConfiguration/UserConfiguration";
//#endregion

/**
 * @param DataFileType Type of file extension for the imported data.
 * @param RawData Raw data of the imported benchmark results.
 * @param CheckedSolvers Array containing checked solvers.
 * @param RawInstanceInfoData Unprocessed instanceinfo.csv containing properties.
 * @param RawSoluData Unprocessed minlplib.solu. Best known primal and dual bounds for each instance.
 */
let DataFileType = "";
let RawData: string[] = [];
let CheckedSolvers: string[] = [];
let RawInstanceInfoData: string[] = [];
let RawSoluData: string[] = [];

/**
 * Initializing the methods that are needed to run the system.
 */
function InitializeProgram(): void {
  /**
   * Values reset after clearing table and running InitializeProgram() again.
   */
  RawData = [];
  CheckedSolvers = [];
  DataFileType = "";
  RawInstanceInfoData = [];
  RawSoluData = [];

  /**
   * Set all button status from new method after refreshing.
   */
  if (document.title == "Report") {
    ElementStatus();
  } else if (
    document.title === "Average Solver Time" ||
    document.title === "Solver Time" ||
    document.title === "Number of Nodes" ||
    document.title === "Number of Iterations"
  ) {
    ElementStatusPlots();
  }

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
}

/**
 * Sort the benchmark results file and display the relevant elements per page.
 */
function ManageData(): void {
  /**
   * TXT file.
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
  let ProblemList: string[] = [];
  let ResultsData: string[] = [];

  let ProblemListFiltered: string[] = [];
  let ResultsDataFiltered: string[] = [];

  /**
   * TRC file.
   * @param TrcData Trace data results.
   * @param TrcDataFiltered Filtered trace data results.
   */
  let TrcData: object[] = [];
  let TrcDataFiltered: object[] = [];

  /**
   * SOLU and CSV file.
   * @param InstanceInfoData Instance properties.
   * @param SoluData Best known primal and dual bounds for each instance.
   */
  let InstanceInfoData: object[] = [];
  let SoluData: object[] = [];

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
    if (document.title == "Report") {
      TableFilters(Solvers, "Solvers");
    }
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
    if (document.title == "Report") {
      TableFilters(Solvers, "Solvers");
    }
  }

  if (CheckedSolvers.length !== 0 && document.title == "Report") {
    SelectSavedSolvers(CheckedSolvers);
  }

  /**
   * Check if the user is on the Report page.
   */
  if (document.title == "Report") {
    /**
     * Select all checkboxes button functionality.
     */
    SelectAllButton.addEventListener("click", () => {
      console.log("Clicked Select All Solvers.");
      ToggleSelection();
    });

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
      InitializeProgram();
    });
  }

  /**
   * Check if the user is on the Average Solver Time page.
   */
  if (document.title == "Average Solver Time") {
    /**
     *  Get the average solver times without any failed results.
     */
    ViewPlotsButton.disabled = false;
    ViewPlotsButton.addEventListener("click", () => {
      const Category = "Time[s]";
      const AverageTimesData = AnalyzeDataByCategory(TrcData, Category);
      console.log("TimesData: ", AverageTimesData);

      const Type = "bar";
      const Label = "Time[s].average";
      const Title = "Average solver time";
      const AverageTime = Object.entries(AverageTimesData).map(
        ([key, value]) => ({
          label: key,
          data: [value.average],
          borderColor: PickColor(),
          backgroundColor: PickColor(),
        })
      );

      console.log("Data: ", AverageTime);
      CreateChart(Type, AverageTime, Label, Title);
      StatisticsTable(AverageTimesData, Title);
    });
  }

  /**
   * Check if the user is on the Solver Time page.
   */
  if (document.title == "Solver Time") {
    /**
     * Get all the solver times without any failed results.
     */
    ViewPlotsButton.disabled = false;
    ViewPlotsButton.addEventListener("click", () => {
      const SolverTimes = ExtractAllSolverTimes(TrcData);
      const Data = (Object.entries(SolverTimes) as [string, number[]][]).map(
        ([key, values]) => ({
          label: key,
          data: values.map((val, index) => ({ x: index, y: val })),
        })
      );
      console.log("Data structure: ", Data);

      const Type = "scatter";
      const Label = "";
      const Title = "Solver times";

      CreateChart(Type, Data, Label, Title);
    });
  }

  /**
   * Check if the user is on the Number of Nodes page.
   */
  if (document.title == "Number of Nodes") {
    /**
     * Get the average number of nodes.
     */
    ViewPlotsButton.disabled = false;
    ViewPlotsButton.addEventListener("click", () => {
      const Category = "Nodes[i]";
      const NodesData = AnalyzeDataByCategory(TrcData, Category);
      console.log("NodeData: ", NodesData);

      const Type = "bar";
      const Label = "Nodes[i].average";
      const Title = "Average number of nodes";
      const AverageNodes = Object.entries(NodesData).map(([key, value]) => ({
        label: key,
        data: [value.average],
        borderColor: PickColor(),
        backgroundColor: PickColor(),
      }));

      console.log("Data: ", AverageNodes);
      CreateChart(Type, AverageNodes, Label, Title);
      StatisticsTable(NodesData, Title);
    });
  }

  /**
   * Check if the user is on the Number of Iterations page.
   */
  if (document.title == "Number of Iterations") {
    /**
     * Get the average number of iterations.
     */
    ViewPlotsButton.disabled = false;
    ViewPlotsButton.addEventListener("click", () => {
      const Category = "NumberOfIterations";
      const IterationsData = AnalyzeDataByCategory(TrcData, Category);
      console.log("IterationsData: ", IterationsData);

      const Type = "bar";
      const Label = "NumberOfiterations.average";
      const Title = "Average number if iterations";
      const AverageNbrItr = Object.entries(IterationsData).map(
        ([key, value]) => ({
          label: key,
          data: [value.average],
          borderColor: PickColor(),
          backgroundColor: PickColor(),
        })
      );

      console.log("Data: ", AverageNbrItr);
      CreateChart(Type, AverageNbrItr, Label, Title);
      StatisticsTable(IterationsData, Title);
    });
  }
}

/**
 * Run the program.
 */
InitializeProgram();
