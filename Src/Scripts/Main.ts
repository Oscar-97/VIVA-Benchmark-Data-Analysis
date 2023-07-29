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
import { ExtractTrcData } from "./DataProcessing/FilterData";
import {
	GetInstanceInformation,
	GetBestKnowBounds
} from "./DataProcessing/GetExtraData";

/**
 * DataTable.
 */
import {
	TableDisplayTrc,
	DestroyDataTable
} from "./DataTable/DataTableWrapper";
import { UpdateResultsTrc } from "./DataTable/UpdateResults";

/**
 * Elements.
 */
import { ElementStatus, ElementStatusPlots } from "./Elements/ElementStatus";
import {
	fileInput,
	importDataButton,
	viewAllResultsButton,
	filterSelectionButton,
	saveLocalStorageButton,
	downloadConfigurationButton,
	deleteLocalStorageButton,
	clearTableButton,
	downloadConfigurationButtonLayer
} from "./Elements/Elements";
import { LoadingAnimation } from "./Elements/LoadingAnimation";

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

/**
 * Fade effect on all children of the body element, except for nav.
 */
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
let rawInstanceInfoData: string[] = [];
let rawSoluData: string[] = [];

/**
 * Initializing the methods that are needed to run the system.
 */
function InitializeProgram(): void {
	/**
	 * Resets the dataFileType and the three arrays holding the raw data,
	 * raw instance info data, and raw solution data to their initial states.
	 * This occurs when the table is cleared and InitializeProgram() is run again.
	 */
	dataFileType = "";
	rawData = [];
	rawInstanceInfoData = [];
	rawSoluData = [];

	/**
	 * Sets the status of all buttons based on the current document title.
	 * Different functions, ElementStatus() and ElementStatusPlots(), are called
	 * depending on whether the title is "Report" or not.
	 */
	if (document.title == "Report") {
		ElementStatus();
	} else {
		ElementStatusPlots();
	}

	/**
	 * Tries to retrieve stored configuration when arriving at
	 * the page or refreshing the page. If data is found in local storage, the
	 * rawData and dataFileType are updated, the ImportDataEvents() function is
	 * called with a success message, the "Delete Local Storage" and "Download
	 * Configuration" buttons are enabled, and the ManageData() function is called.
	 */
	try {
		[rawData, dataFileType] = GetUserConfiguration();
		ImportDataEvents("Found cached benchmark file!", "json");
		deleteLocalStorageButton.disabled = false;
		downloadConfigurationButtonLayer.disabled = false;
		ManageData();
	} catch (err) {
		console.log("No data found in local storage: ", err);
	}

	/**
	 * Adds an event listener to the file input field that sets the dataFileType
	 * variable and reads data into the rawData, rawInstanceInfoData, and rawSoluData
	 * arrays whenever the value of the file input field changes.
	 */
	fileInput.addEventListener("change", () => {
		dataFileType = GetDataFileType();
		ReadData(rawData, rawInstanceInfoData, rawSoluData);
	});

	/**
	 * Adds an event listener to the "Import Data" button that calls the
	 * ImportDataEvents() function with a success message and the ManageData()
	 * function whenever the button is clicked.
	 */
	importDataButton.addEventListener("click", () => {
		ImportDataEvents("Benchmark file succesfully loaded!");
		ManageData();
	});
}

/**
 * Manage the benchmark results data.
 */
function ManageData(): void {
	/**
	 * Trace data results and filtered trace data results.
	 */
	let traceData: object[] = [];
	const traceDataFiltered: object[] = [];

	/**
	 * instanceInfoData holds the instance properties.
	 * soluData holds the best known primal and dual bounds for each instance.
	 */
	let instanceInfoData: object[] = [];
	let soluData: object[] = [];

	/**
	 * If the uploaded data file is of type JSON, it retrieves the user configuration
	 * and updates the rawData and dataFileType variables.
	 */
	if (dataFileType == "json") {
		[rawData, dataFileType] = GetUserConfiguration();
	}

	/**
	 * If the uploaded data file is of type TRC, it extracts the trace data from the rawData,
	 * gets instance information if any, gets best known bounds if any, merges the data,
	 * and adds result categories to the trace data.
	 */
	if (dataFileType === "trc") {
		traceData = ExtractTrcData(rawData);

		if (rawInstanceInfoData.length !== 0) {
			instanceInfoData = GetInstanceInformation(rawInstanceInfoData);
			traceData = MergeData(traceData, instanceInfoData);
		}

		if (rawSoluData.length !== 0) {
			soluData = GetBestKnowBounds(rawSoluData);
			traceData = MergeData(traceData, soluData);
		}
		AddResultCategories(traceData);
	}

	/**
	 * Download the current configuration when clicking on the "Download Configuration" button.
	 */
	downloadConfigurationButton.addEventListener("click", () => {
		DownloadUserConfiguration();
	});

	/**
	 * Delete stored data in local storage when clicking in the "Delete Data" button.
	 */
	deleteLocalStorageButton.addEventListener("click", () => {
		DeleteUserConfiguration();
		deleteLocalStorageButton.disabled = true;
		downloadConfigurationButtonLayer.disabled = true;
	});

	/**
	 * If the document title is "Report", it handles the report page functionality using
	 * the traceData and traceDataFiltered variables.
	 */
	if (document.title == "Report") {
		HandleReportPage(traceData, traceDataFiltered);
	}

	/**
	 * If the document title is not "Report", it adds an event listener to the
	 * "Save Local Storage" button that creates a new data configuration if the
	 * dataFileType is either "trc" or "json", saves it to local storage, and enables
	 * the "Delete Local Storage" and "Download Configuration" buttons when the button is clicked.
	 * Also, it handles the plot page functionality using the traceData variable.
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
 * This function manages the functionality of the buttons on the Report page of the application.
 *
 * @param {object[]} traceData - This parameter is an array of objects that represents the trace data.
 * @param {object[]} traceDataFiltered - This parameter is an array of objects that represents the filtered trace data.
 */
function HandleReportPage(traceData: object[], traceDataFiltered: any[]): void {
	/**
	 * Show the table when clicking on the "View Table" button.
	 */
	viewAllResultsButton.addEventListener("click", () => {
		viewAllResultsButton.disabled = true;
		LoadingAnimation();
		if (dataFileType === "trc") {
			TableDisplayTrc(traceData);
		} else if (dataFileType === "json") {
			[rawData, dataFileType] = GetUserConfiguration();
			traceData = ExtractTrcData(rawData);
			TableDisplayTrc(traceData);
		}
	});

	/**
	 * Shows the selected problems when clicking on the "View Selected Problems" button.
	 */
	filterSelectionButton.addEventListener("click", () => {
		filterSelectionButton.disabled = true;
		if (dataFileType === "trc") {
			traceDataFiltered = UpdateResultsTrc();
			TableDisplayTrc(traceDataFiltered);
		}
	});

	/**
	 * Save to local storage when clicking on the "Save Data" button.
	 */
	saveLocalStorageButton.addEventListener("click", () => {
		if (dataFileType === "trc" || dataFileType === "json") {
			let newRawData = [];
			if (traceDataFiltered.length === 0) {
				newRawData = CreateDataTrc(traceData);
			} else {
				newRawData = CreateDataTrc(traceDataFiltered);
			}
			CreateUserConfiguration(newRawData, dataFileType);
		}
	});

	/**
	 * Destroy the data table and reinitializes the program when clicking on "Clear Data Table".
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
