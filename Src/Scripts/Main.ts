// #region Imports
/**
 * Bootstrap.
 */
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";

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
	PlotStatusMessages,
	PlotAllSolverTimes,
	PlotAbsolutePerformanceProfileSolverTimes
} from "./Chart/ChartType";

/**
 * Dataprocessing.
 */
import { AddResultCategories } from "./DataProcessing/AddResultCategories";
import { CreateNewTraceData } from "./DataProcessing/CreateData";
import {
	FillSolverSelectorList,
	ImportDataEvents
} from "./Elements/ImportDataEvents";
import { ReadData, GetDataFileType } from "./DataProcessing/ReadData";
import { MergeData } from "./DataProcessing/MergeData";
import { ExtractTraceData } from "./DataProcessing/FilterData";
import {
	GetInstanceInformation,
	GetBestKnowBounds
} from "./DataProcessing/GetExtraData";

/**
 * DataTable.
 */
import {
	DisplayDataTable,
	DestroyDataTable
} from "./DataTable/DataTableWrapper";
import { UpdateResults } from "./DataTable/UpdateResults";

/**
 * Elements.
 */
import {
	ElementStatesTablePage,
	ElementStatesPlotPage,
	ElementStateDisplayedChart
} from "./Elements/ElementStatus";
import {
	fileInput,
	importDataButton,
	viewTableButton,
	filterSelectionButton,
	saveLocalStorageButton,
	downloadConfigurationButton,
	deleteLocalStorageButton,
	clearTableButton,
	downloadConfigurationButtonLayer,
	demoDataButton,
	viewPlotsButton,
	downloadChartDataButton,
	downloadCustomConfigurationButton,
	solverSelector,
	defaultTimeInput,
	downloadCustomConfigurationButtonLayer
} from "./Elements/Elements";
import {
	BodyFadeLoadingAnimation,
	TableLoadingAnimation
} from "./Elements/LoadingAnimation";

/**
 * User Configuration.
 */
import {
	CreateUserConfiguration,
	GetUserConfiguration,
	DeleteUserConfiguration,
	DownloadUserConfiguration,
	DownloadCustomizedUserConfiguration
} from "./UserConfiguration/UserConfiguration";

import { demoData } from "./DemoData";
import {
	DisplayErrorNotification,
	DisplayWarningNotification
} from "./Elements/DisplayAlertNotification";
import { ReleaseVersionTag } from "./Elements/ReleaseVersionTag";
//#endregion

/**
 * Fetches and displays the latest release of the application.
 */
ReleaseVersionTag();

/**
 * Fade effect on all children of the body element, except for nav.
 */
BodyFadeLoadingAnimation();

/**
 * Register service worker for PWA offline support.
 */
RegisterServiceWorker();

/**
 * @param dataFileType Type of file extension for the imported data. As of now, either .trc or .json. Text based files were removed.
 * @param defaultTime The default time for the absolute performance profile chart.
 * @param unprocessedData Raw data of the imported benchmark results.
 * @param unprocessedInstanceInformationData Unprocessed instanceinfo.csv containing properties.
 * @param unprocessedSolutionData Unprocessed minlplib.solu. Best known primal and dual bounds for each instance.
 * @param chartData Processed data used in the different charts.
 */
let dataFileType = "";
let defaultTime = undefined;
let unprocessedData: string[] = [];
let unprocessedInstanceInformationData: string[] = [];
let unprocessedSolutionData: string[] = [];
let chartData;

/**
 * Initializing the methods that are needed to run the system.
 */
function InitializeProgram(): void {
	/**
	 * Resets the dataFileType, defaultTime and the four arrays holding the raw data,
	 * raw instance info data, raw solution data, and chart data to their initial states.
	 * This occurs when the table is cleared and InitializeProgram() is run again.
	 */
	dataFileType = "";
	defaultTime = "";
	unprocessedData = [];
	unprocessedInstanceInformationData = [];
	unprocessedSolutionData = [];
	chartData = [];

	/**
	 * Sets the status of all buttons based on the current document title.
	 * Different functions, ElementStatus() and ElementStatusPlots(), are called
	 * depending on whether the title is "Report" or not.
	 */
	if (document.title === "Report") {
		ElementStatesTablePage();
	} else {
		ElementStatesPlotPage();
	}

	/**
	 * Tries to retrieve stored configuration when arriving at
	 * the page or refreshing the page. If data is found in local storage, the
	 * unprocessedData and dataFileType are updated, the ImportDataEvents() function is
	 * called with a success message, the "Delete Local Storage" and "Download
	 * Configuration" buttons are enabled, and the ManageData() function is called.
	 */
	try {
		[unprocessedData, dataFileType, defaultTime] = GetUserConfiguration();
		ImportDataEvents("Found cached benchmark file!", "json");
		saveLocalStorageButton.disabled = true;
		deleteLocalStorageButton.disabled = false;
		downloadConfigurationButtonLayer.disabled = false;
		sessionStorage.setItem("savedStorageNotification", "true");
		ManageData();
	} catch {
		console.info("No saved configuration data found.");
	}

	/**
	 * Arguably the actions the sequence of events below is not correct, as the "load" button actually acts as a confirm button.
	 */

	/**
	 * Adds an event listener to the file input field that sets the dataFileType
	 * variable and reads data into the unprocessedData, unprocessedInstanceInformationData, and unprocessedSolutionData
	 * arrays whenever the value of the file input field changes.
	 */
	fileInput.addEventListener("change", () => {
		dataFileType = GetDataFileType();
		ReadData(
			unprocessedData,
			unprocessedInstanceInformationData,
			unprocessedSolutionData
		);
	});

	/**
	 * Adds an event listener to the "Import Data" button that calls the
	 * ImportDataEvents() function with a success message and the ManageData()
	 * function whenever the button is clicked.
	 */
	importDataButton.addEventListener("click", () => {
		sessionStorage.removeItem("savedStorageNotification");
		ImportDataEvents("Benchmark file succesfully loaded!");
		ManageData();
	});

	/**
	 * Adds an event listener to the "Demo-Mode" button that loads a demo data set and savet it to local storage.
	 */
	if (document.title === "Report") {
		demoDataButton.addEventListener("click", () => {
			localStorage.setItem("UserConfiguration", JSON.stringify(demoData));
			location.reload();
		});
	}
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
	 * selectedValues holds the selected solvers.
	 */
	let selectedSolvers: string[];

	/**
	 * If the uploaded data file is of type JSON, it retrieves the user configuration
	 * and updates the unprocessedData and dataFileType variables.
	 */
	if (dataFileType === "json") {
		[unprocessedData, dataFileType, defaultTime] = GetUserConfiguration();
		traceData = ExtractTraceData(unprocessedData);
	}

	/**
	 * If the uploaded data file is of type TRC, it extracts the trace data from the unprocessedData,
	 * gets instance information if any, gets best known bounds if any, merges the data,
	 * and adds result categories to the trace data.
	 */
	if (dataFileType === "trc") {
		traceData = ExtractTraceData(unprocessedData);

		if (unprocessedInstanceInformationData.length !== 0) {
			instanceInfoData = GetInstanceInformation(
				unprocessedInstanceInformationData
			);
			traceData = MergeData(traceData, instanceInfoData);
		}

		if (unprocessedSolutionData.length !== 0) {
			soluData = GetBestKnowBounds(unprocessedSolutionData);
			traceData = MergeData(traceData, soluData);
		}
		AddResultCategories(traceData);
	}

	/**
	 * Fill the solver selector with solvers and update the values in selectedSolvers when the user selects them.
	 */
	FillSolverSelectorList(traceData);
	solverSelector.addEventListener("change", () => {
		selectedSolvers = Array.from(solverSelector.options)
			.filter((option) => {
				return option.selected;
			})
			.map((option) => {
				return option.value;
			});
	});

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
	 * Download a customized version of the user configuration.
	 */
	downloadCustomConfigurationButton.addEventListener("click", () => {
		console.log("clicked.")
		if (selectedSolvers === undefined) {
			DisplayWarningNotification("No solvers selected from the list.");
		}

		DownloadCustomizedUserConfiguration(
			traceData,
			selectedSolvers,
			Number(defaultTimeInput.value)
		);
	});

	/**
	 * If the document title is "Report", it handles the report page functionality using
	 * the traceData and traceDataFiltered variables.
	 */
	if (document.title === "Report") {
		HandleReportPage(traceData, traceDataFiltered);
	}

	/**
	 * If the document title is not "Report", it handles the plot page functionality using
	 * the traceData variable.
	 */
	if (document.title !== "Report") {
		HandlePlotPages(traceData);
	}
}

/**
 * This function manages the functionality of the buttons on the Report page of the application.
 *
 * @param {object[]} traceData - This parameter is an array of objects that represents the trace data.
 * @param {object[]} traceDataFiltered - This parameter is an array of objects that represents the filtered trace data.
 */
function HandleReportPage(
	traceData: object[],
	traceDataFiltered: object[]
): void {
	/**
	 * Show the table when clicking on the "View Table" button.
	 */
	viewTableButton.addEventListener("click", () => {
		viewTableButton.disabled = true;
		TableLoadingAnimation();
		DisplayDataTable(traceData);
	});

	/**
	 * Shows the selected problems when clicking on the "View Selected Problems" button.
	 */
	filterSelectionButton.addEventListener("click", () => {
		filterSelectionButton.disabled = true;
		traceDataFiltered = UpdateResults();

		if (traceDataFiltered.length === 0) {
			DisplayWarningNotification("No rows selected for filtering.");
			filterSelectionButton.disabled = false;
		} else {
			DisplayDataTable(traceDataFiltered);
		}
	});

	/**
	 * Save to local storage when clicking on the "Save Data" button.
	 */
	saveLocalStorageButton.addEventListener("click", () => {
		let newRawData = [];

		if (dataFileType === "trc") {
			dataFileType = "json";
		}

		if (traceDataFiltered.length === 0) {
			newRawData = CreateNewTraceData(traceData);
		} else {
			newRawData = CreateNewTraceData(traceDataFiltered);
		}
		CreateUserConfiguration(newRawData, dataFileType);
		deleteLocalStorageButton.disabled = false;
		downloadConfigurationButtonLayer.disabled = false;
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
 * This function manages the functionality of the buttons on the plot pages of the application.
 *
 * @param {object[]} traceData - This parameter is an array of objects that represents the trace data.
 */
function HandlePlotPages(traceData: object[]): void {
	/**
	 * Save to local storage when clicking on the "Save Data" button.
	 */
	saveLocalStorageButton.addEventListener("click", () => {
		if (dataFileType === "trc") {
			dataFileType = "json";
		}
		const newRawData: object[] = CreateNewTraceData(traceData);
		CreateUserConfiguration(newRawData, dataFileType);
		deleteLocalStorageButton.disabled = false;
		downloadConfigurationButtonLayer.disabled = false;
	});

	/**
	 * View chart/plot when clicking on the view plot button per page.
	 */
	viewPlotsButton.disabled = false;
	viewPlotsButton.addEventListener("click", () => {
		/**
		 * Check if the user is on the Absolute Performance Profile.
		 */
		if (document.title === "Absolute Performance Profile") {
			chartData = PlotAbsolutePerformanceProfileSolverTimes(
				traceData,
				defaultTime
			);
		}

		/**
		 * Check if the user is on the Average Solver Time page.
		 */
		if (document.title === "Average Solver Time") {
			chartData = PlotDataByCategory(
				traceData,
				"bar",
				"SolverTime",
				"SolverTime.average",
				"Average solver time"
			);
		}

		/**
		 * Check if the user is on the Solver Time page.
		 */
		if (document.title === "Solver Time") {
			chartData = PlotAllSolverTimes(traceData);
		}

		/**
		 * Check if the user is on the Number of Nodes page.
		 */
		if (document.title === "Number of Nodes") {
			chartData = PlotDataByCategory(
				traceData,
				"bar",
				"NumberOfNodes",
				"NumberOfNodes.average",
				"Average number of nodes"
			);
		}

		/**
		 * Check if the user is on the Number of Iterations page.
		 */
		if (document.title === "Number of Iterations") {
			chartData = PlotDataByCategory(
				traceData,
				"bar",
				"NumberOfIterations",
				"NumberOfiterations.average",
				"Average number of iterations"
			);
		}

		/**
		 * Check if the user is on the Termination Status page.
		 */
		if (document.title === "Termination Status") {
			chartData = PlotStatusMessages(
				traceData,
				"bar",
				"Termination status by type"
			);
		}
		ElementStateDisplayedChart();
	});

	/**
	 * Download the current chart data when clicking on the "Download Chart Data" button.
	 */
	downloadChartDataButton.addEventListener("click", () => {
		if (chartData) {
			const downloadAbleFile = JSON.stringify(chartData);
			const blob = new Blob([downloadAbleFile], { type: "application/json" });

			downloadChartDataButton.href = window.URL.createObjectURL(blob);
			downloadChartDataButton.download = "ChartData.json";
		} else {
			DisplayErrorNotification("No chart data found!");
		}
	});
}

/**
 * Run the program.
 */
InitializeProgram();
