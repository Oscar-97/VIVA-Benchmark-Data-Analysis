// #region Imports
/**
 * jQuery (Fade in animation)
 */
import $ from "jquery";

/**
 * Bootstrap.
 */
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

/**
 * DataTables and extensions.
 */
import "datatables.net-bs5/css/dataTables.bootstrap5.min.css";
import "datatables.net-buttons-bs5/css/buttons.bootstrap5.min.css";
import "datatables.net-fixedcolumns-bs5/css/fixedColumns.bootstrap5.min.css";
import "datatables.net-searchpanes-bs5/css/searchPanes.bootstrap5.min.css";
import "datatables.net-select-bs5/css/select.bootstrap5.min.css";
import "datatables.net-searchbuilder-bs5/css/searchBuilder.bootstrap5.css";
import "datatables.net-datetime/dist/dataTables.dateTime.min.css";

/**
 * CSS.
 */
import "../css/style.css";

/**
 * PWA Setup.
 */
import { RegisterServiceWorker } from "./PWA_Setup";

/**
 * Chart.
 */
import {
	PlotDataByCategory,
	PlotAllSolverTimes
} from "./Chart/PlotDataByCategory";

/**
 * Dataprocessing.
 */
import { AddResultCategories } from "./DataProcessing/AddResultCategories";
import { CreateDataTrc } from "./DataProcessing/CreateData";
import { ImportDataEvents } from "./Elements/ImportDataEvents";
import { ReadData, GetDataFileType } from "./DataProcessing/ReadData";
import { MergeData } from "./DataProcessing/MergeData";
import {
	ExtractTrcData,
	GetTrcDataCategory
} from "./DataProcessing/FilterDataTrc";
import {
	GetInstanceInformation,
	GetInstancePrimalDualbounds
} from "./DataProcessing/GetInstanceInformation";
import {
	GetInstance,
	GetSolvers,
	GetInstanceLabels,
	GetDataLabels,
	GetProblems,
	GetResults
} from "./DataProcessing/FilterDataTxt";

/**
 * DataTable.
 */
import { TableFilters } from "./DataTable/DataTableFilters";
import { TableDownloadCSV } from "./DataTable/DownloadCSV";
import {
	TableDisplay,
	TableDisplayTrc,
	DestroyDataTable
} from "./DataTable/DataTableWrapper";
import {
	UpdateProblemList,
	UpdateResultsData,
	UpdateResultsTrc
} from "./DataTable/UpdateResults";

/**
 * Elements.
 */
import { ElementStatus, ElementStatusPlots } from "./Elements/ElementStatus";
import {
	fileInput,
	importDataButton,
	selectAllButton,
	viewAllResultsButton,
	filterSelectionButton,
	saveLocalStorageButton,
	downloadConfigurationButton,
	downloadCSVButton,
	deleteLocalStorageButton,
	clearTableButton,
	downloadConfigurationButtonLayer
} from "./Elements/Elements";
import { LoadingAnimation } from "./Elements/LoadingAnimation";

/**
 * Solvers.
 */
import { GetCheckedSolvers } from "./Solvers/UsedSolvers";
import {
	ToggleSelection,
	SelectSavedSolvers
} from "./Solvers/SelectAllSolvers";

/**
 * User Configuration.
 */
import {
	CreateUserConfiguration,
	GetUserConfiguration,
	DeleteUserConfiguration,
	DownloadUserConfiguration
} from "./UserConfiguration/UserConfiguration";
//#endregion

$(function () {
	$("body > :not(nav)").css("opacity", "1");
	$("hr").css("opacity", "0.25");
});

/**
 * Register service worker for PWA offline support.
 */
RegisterServiceWorker();

/**
 * @param DataFileType Type of file extension for the imported data.
 * @param RawData Raw data of the imported benchmark results.
 * @param CheckedSolvers Array containing checked solvers.
 * @param RawInstanceInfoData Unprocessed instanceinfo.csv containing properties.
 * @param RawSoluData Unprocessed minlplib.solu. Best known primal and dual bounds for each instance.
 */
let dataFileType = "";
let rawData: string[] = [];
let checkedSolvers: string[] = [];
let rawInstanceInfoData: string[] = [];
let rawSoluData: string[] = [];

/**
 * Initializing the methods that are needed to run the system.
 */
function InitializeProgram(): void {
	/**
	 * Values reset after clearing table and running InitializeProgram() again.
	 */
	dataFileType = "";
	rawData = [];
	checkedSolvers = [];
	rawInstanceInfoData = [];
	rawSoluData = [];

	/**
	 * Set all button status from new method after refreshing.
	 */
	if (document.title == "Report") {
		ElementStatus();
	} else {
		ElementStatusPlots();
	}

	/**
	 * Try to retrieve stored config/data/state when arriving to the page, or refreshing the page.
	 */
	try {
		[rawData, dataFileType, checkedSolvers] = GetUserConfiguration();
		ImportDataEvents("Found cached benchmark file!", "json");
		deleteLocalStorageButton.disabled = false;
		downloadConfigurationButtonLayer.disabled = false;
		ManageData();
	} catch (err) {
		console.log("No data found in local storage: ", err);
	}

	/**
	 * Read the data from the input file and set the file extension type.
	 */
	fileInput.addEventListener("change", () => {
		dataFileType = GetDataFileType();
		ReadData(rawData, rawInstanceInfoData, rawSoluData);
	});

	/**
	 * Click on the upload data button to continue the process.
	 */
	importDataButton.addEventListener("click", () => {
		ImportDataEvents("Benchmark file succesfully loaded!");
		ManageData();
	});
}

/**
 * Sort the benchmark results file and display the relevant elements per page.
 */
function ManageData(): void {
	/**
	 * TRC file.
	 * @param TrcData Trace data results.
	 * @param TrcDataFiltered Filtered trace data results.
	 */
	let traceData: object[] = [];
	const traceDataFiltered: object[] = [];

	/**
	 * SOLU and CSV file.
	 * @param InstanceInfoData Instance properties.
	 * @param SoluData Best known primal and dual bounds for each instance.
	 */
	let instanceInfoData: object[] = [];
	let soluData: object[] = [];

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
	let instance: string;
	let solvers: string[] = [];
	let dataLabels: string[];
	let instanceLabels: string[];
	let problemList: string[] = [];
	let resultsData: string[] = [];

	const problemListFiltered: string[] = [];
	const resultsDataFiltered: string[] = [];

	/**
	 * Run if the uploaded file is json.
	 */
	if (dataFileType == "json") {
		[rawData, dataFileType, checkedSolvers] = GetUserConfiguration();
	}

	/**
	 * Check which file format is used, add the data to correct categories and create the solver filters. Select solvers if they are found in localStorage.
	 */
	if (dataFileType === "trc") {
		traceData = ExtractTrcData(rawData);

		if (rawInstanceInfoData.length !== 0) {
			instanceInfoData = GetInstanceInformation(rawInstanceInfoData);
			traceData = MergeData(traceData, instanceInfoData);
		}

		if (rawSoluData.length !== 0) {
			soluData = GetInstancePrimalDualbounds(rawSoluData);
			traceData = MergeData(traceData, soluData);
		}

		solvers = GetTrcDataCategory(traceData, "SolverName");
		AddResultCategories(traceData);
	}

	if (dataFileType === "txt") {
		instance = GetInstance(rawData);
		solvers = GetSolvers(rawData);
		dataLabels = GetDataLabels(rawData);
		instanceLabels = GetInstanceLabels(dataLabels);
		problemList = GetProblems(rawData);
		resultsData = GetResults(rawData);

		selectAllButton.hidden = false;

		if (checkedSolvers.length !== 0) {
			SelectSavedSolvers(checkedSolvers);
		}
	}

	/**
	 * Download the current configuration.
	 */
	downloadConfigurationButton.addEventListener("click", () => {
		DownloadUserConfiguration();
	});

	/**
	 * Delete stored data in local storage.
	 */
	deleteLocalStorageButton.addEventListener("click", () => {
		DeleteUserConfiguration();
		deleteLocalStorageButton.disabled = true;
		downloadConfigurationButtonLayer.disabled = true;
	});

	/**
	 * Check if the user is on the Report page.
	 */
	if (document.title == "Report") {
		HandleReportPage(
			solvers,
			instance,
			instanceLabels,
			dataLabels,
			problemList,
			resultsData,
			problemListFiltered,
			resultsDataFiltered,
			traceData,
			traceDataFiltered
		);
	}

	/**
	 * Save to local storage functionality on the plot pages.
	 */
	if (document.title != "Report") {
		saveLocalStorageButton.addEventListener("click", () => {
			if (dataFileType === "trc" || dataFileType === "json") {
				let newRawData = [];
				newRawData = CreateDataTrc(traceData);

				CreateUserConfiguration(newRawData, dataFileType);
			}
			deleteLocalStorageButton.disabled = false;
			downloadConfigurationButtonLayer.disabled = false;
		});

		HandlePlotPages(traceData);
	}
}

/**
 * Handle report(table) page button functions.
 */
function HandleReportPage(
	solvers,
	instance,
	instanceLabels,
	dataLabels,
	problemList,
	resultsData,
	problemListFiltered,
	resultsDataFiltered,
	traceData,
	traceDataFiltered
): void {
	if (dataFileType === "txt") {
		TableFilters(solvers, "Solvers");

		if (checkedSolvers.length !== 0) {
			SelectSavedSolvers(checkedSolvers);
		}
	}

	/**
	 * Select all checkboxes button functionality.
	 */
	selectAllButton.addEventListener("click", () => {
		ToggleSelection();
	});

	/**
	 * Shows all problems depending on the uploaded file.
	 */
	viewAllResultsButton.addEventListener("click", () => {
		LoadingAnimation();
		if (dataFileType === "txt") {
			TableDisplay(
				instance,
				solvers,
				instanceLabels,
				dataLabels,
				problemList,
				resultsData
			);
		} else if (dataFileType === "trc") {
			TableDisplayTrc(traceData);
		} else if (dataFileType === "json") {
			[rawData, dataFileType] = GetUserConfiguration();
			traceData = ExtractTrcData(rawData);
			TableDisplayTrc(traceData);
		}
	});

	/**
	 * Shows the selected problems by modifying the ProblemList and ResultsData.
	 */
	filterSelectionButton.addEventListener("click", () => {
		filterSelectionButton.disabled = true;
		if (dataFileType === "txt") {
			problemListFiltered = UpdateProblemList();
			resultsDataFiltered = UpdateResultsData();

			TableDisplay(
				instance,
				solvers,
				instanceLabels,
				dataLabels,
				problemListFiltered,
				resultsDataFiltered
			);
		} else if (dataFileType === "trc") {
			traceDataFiltered = UpdateResultsTrc();
			TableDisplayTrc(traceDataFiltered);
		}
	});

	/**
	 * Save to local storage when clicking on the relevant button.
	 */
	saveLocalStorageButton.addEventListener("click", () => {
		if (dataFileType === "txt") {
			checkedSolvers = GetCheckedSolvers();
			CreateUserConfiguration(rawData, dataFileType, checkedSolvers);
		} else if (dataFileType === "trc" || dataFileType === "json") {
			let newRawData = [];
			if (traceDataFiltered.length === 0) {
				newRawData = CreateDataTrc(traceData);
			} else {
				newRawData = CreateDataTrc(traceDataFiltered);
			}
			CreateUserConfiguration(newRawData, dataFileType, checkedSolvers);
		}
	});

	/**
	 * Download the currently displayed table as a CSV.
	 */
	downloadCSVButton.addEventListener("click", () => {
		TableDownloadCSV();
	});

	/**
	 * Clear table action.
	 */
	clearTableButton.addEventListener("click", () => {
		DestroyDataTable();
		InitializeProgram();
	});
}

/**
 * Hande plot pages button functions.
 */
function HandlePlotPages(traceData: object[]): void {
	/**
	 * Save to local storage functionality on the plot pages.
	 */
	if (document.title != "Report") {
		/**
		 * Save to local storage when clicking on the relevant button.
		 */
		saveLocalStorageButton.addEventListener("click", () => {
			if (dataFileType === "trc" || dataFileType === "json") {
				let newRawData = [];
				newRawData = CreateDataTrc(traceData);

				CreateUserConfiguration(newRawData, dataFileType);
			}
			deleteLocalStorageButton.disabled = false;
			downloadConfigurationButtonLayer.disabled = false;
		});
	}

	/**
	 * Check if the user is on the Average Solver Time page.
	 */
	if (document.title == "Average Solver Time") {
		PlotDataByCategory(
			traceData,
			"bar",
			"Time[s]",
			"Time[s].average",
			"Average solver time"
		);
	}

	/**
	 * Check if the user is on the Solver Time page.
	 */
	if (document.title == "Solver Time") {
		PlotAllSolverTimes(traceData);
	}

	/**
	 * Check if the user is on the Number of Nodes page.
	 */
	if (document.title == "Number of Nodes") {
		PlotDataByCategory(
			traceData,
			"bar",
			"Nodes[i]",
			"Nodes[i].average",
			"Average number of nodes"
		);
	}

	/**
	 * Check if the user is on the Number of Iterations page.
	 */
	if (document.title == "Number of Iterations") {
		PlotDataByCategory(
			traceData,
			"bar",
			"NumberOfIterations",
			"NumberOfiterations.average",
			"Average number of iterations"
		);
	}
}

/**
 * Run the program.
 */
InitializeProgram();
