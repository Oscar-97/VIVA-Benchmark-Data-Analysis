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
import {
	RegisterServiceWorker,
	RequestPWANotificationPermission
} from "./PWA/PWA-utils";

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
	GetBestKnownBounds
} from "./DataProcessing/GetExtraData";

/**
 * DataTable.
 */
import { ComparisonSummaryTable } from "./DataTable/DataTableBase";
import {
	DisplayDataTable,
	DestroyDataTable
} from "./DataTable/DataTableWrapper";
import { UpdateResults } from "./DataTable/UpdateResults";

/**
 * Elements.
 */
import {
	PopulateCheckboxes,
	GetSelectedCheckboxValues
} from "./Elements/DynamicCheckboxes";
import {
	ElementStatesTablePage,
	ElementStatesPlotPage,
	ElementStateDisplayedChart,
	ElementStatesCompareSolversPage,
	ElementStateDisplayedComparisonTable
} from "./Elements/ElementStatus";
import {
	fileInput,
	librarySelector,
	importDataButton,
	viewTableButton,
	showSelectedRowsButton,
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
	configurationSettingsButton,
	defaultTimeDirectInput,
	gapLimitDirectInput,
	gapLimitInput,
	compareSolversButton,
	demoDataSelector
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
import {
	DisplayErrorNotification,
	DisplayWarningNotification
} from "./Elements/DisplayAlertNotification";
import { ReleaseVersionTag } from "./Elements/ReleaseVersionTag";
import { ReversedTraceHeaderMap } from "./Constants/TraceHeaders";
import {
	ExtractAllSolverTimes,
	CompareSolvers
} from "./DataProcessing/CalculateResults";
import { Keys } from "./Constants/Keys";
import {
	ChartMessages,
	ErrorMessages,
	InfoMessages,
	TableMessages,
	UserConfigurationMessages
} from "./Constants/Messages";
import { PageTitles } from "./Constants/PageTitles";
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
 * @param {string} dataFileType - Type of file extension for the imported data. As of now, either one or more .trc or a single .json. Text based files were removed.
 * @param {number | string} defaultTime - The default time for the absolute performance profile chart.
 * @param {number | string} gapLimit - Gap limit value for the absolute performance profile chart.
 * @param {string[]} unprocessedData - Raw data of the imported benchmark results.
 * @param {string[]} unprocessedInstanceInformationData - Unprocessed instanceinfo.csv containing properties.
 * @param {string[]} unprocessedSolutionData - Unprocessed minlplib.solu. Best known primal and dual bounds for each instance.
 * @param chartData - Processed data used in the different charts.
 */
let dataFileType = "";
let defaultTime = undefined;
let gapLimit = undefined;
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
	gapLimit = "";
	unprocessedData = [];
	unprocessedInstanceInformationData = [];
	unprocessedSolutionData = [];
	chartData = [];

	/**
	 * Sets the status of all buttons based on the current document title.
	 * Different functions, ElementStatus() and ElementStatusPlots(), are called
	 * depending on whether the title is "Report" or not.
	 */
	if (document.title === PageTitles.TABLE) {
		ElementStatesTablePage();
	} else if (document.title === PageTitles.COMPARE_SOLVERS) {
		ElementStatesCompareSolversPage();
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
		[unprocessedData, dataFileType, defaultTime, gapLimit] =
			GetUserConfiguration();
		if (localStorage.getItem(Keys.DEMO_DATA) === "true") {
			ImportDataEvents(InfoMessages.DEMO_MODE_MSG, "json");
			NotifyDemoMode();
		} else {
			ImportDataEvents(InfoMessages.FOUND_STORED_CONFIG, "json");
		}
		saveLocalStorageButton.disabled = true;
		deleteLocalStorageButton.disabled = false;
		downloadConfigurationButtonLayer.disabled = false;
		sessionStorage.setItem(Keys.SAVED_STORAGE_NOTIFICATION, "true");
		ManageData();
	} catch {
		console.info(UserConfigurationMessages.NO_STORED_CONFIG);
	}

	/**
	 * Arguably the actions sequence of the events below is not correct, as the "load" button actually acts as a confirm button.
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
	 * ImportDataEvents() function with a success message containing the list of files loaded
	 * and the ManageData() function whenever the button is clicked.
	 *
	 * It also requests permission for push notifications.
	 */
	importDataButton.addEventListener("click", () => {
		sessionStorage.removeItem(Keys.SAVED_STORAGE_NOTIFICATION);
		const fileNames = Array.from(fileInput.files)
			.map((file) => {
				return file.name;
			})
			.join(", ");
		ImportDataEvents(InfoMessages.LOADED_FILES.concat(fileNames));
		ManageData();
		RequestPWANotificationPermission();
	});

	/**
	 * Adds an event listener to the "Demo-Mode" button that loads a demo data set and savet it to local storage.
	 */
	if (document.title === PageTitles.TABLE) {
		demoDataButton.addEventListener("click", () => {
			ActivateDemoMode();
		});
	}

	async function ActivateDemoMode(): Promise<void> {
		const module = await import(
			/* webpackChunkName: "demoData" */ "./Datasets/DemoData"
		);
		if (demoDataSelector.value === "Demo_1") {
			localStorage.setItem(
				Keys.USER_CONFIGURATION,
				JSON.stringify(module.DEMO_DATA)
			);
		} else if (demoDataSelector.value === "Demo_2") {
			localStorage.setItem(
				Keys.USER_CONFIGURATION,
				JSON.stringify(module.DEMO_DATA_2)
			);
		}
		localStorage.setItem(Keys.DEMO_DATA, "true");
		location.reload();
	}

	function NotifyDemoMode(): void {
		ImportDataEvents(InfoMessages.DEMO_MODE_MSG, "json");
		if (document.title === PageTitles.TABLE) {
			demoDataButton.style.color = "#198754";
			demoDataButton.disabled = true;
			demoDataSelector.disabled = true;
		}
	}
}

/**
 * Manage the benchmark results data.
 */
async function ManageData(): Promise<void> {
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
	let selectedSolvers: string[] = [];

	/**
	 * If the uploaded data file is of type JSON, it retrieves the user configuration
	 * and updates the unprocessedData and dataFileType variables.
	 */
	if (dataFileType === "json") {
		[unprocessedData, dataFileType, defaultTime, gapLimit] =
			GetUserConfiguration();
		traceData = ExtractTraceData(unprocessedData);
	}

	/**
	 * If the uploaded data file is of type TRC, it extracts the trace data from the unprocessedData,
	 * gets instance information if any, gets best known bounds if any .solu file is loaded or a library is selected,
	 * merges the data, and adds result categories to the trace data.
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
			soluData = GetBestKnownBounds(unprocessedSolutionData);
		} else if (librarySelector.value === "MINLPLib") {
			const module = await import(
				/* webpackChunkName: "minlplib-dataset" */ "./Datasets/MINLPLib"
			);
			soluData = module.MINLPLIB_SOLUTION_DATA;
		} else if (librarySelector.value === "MIPLIB_2017") {
			const module = await import(
				/* webpackChunkName: "miplib2017-dataset" */ "./Datasets/MIPLIB_2017"
			);
			soluData = module.MIPLIB_2017_SOLUTION_DATA;
		} else if (librarySelector.value === "MIPLIB_2010") {
			const module = await import(
				/* webpackChunkName: "miplib2010-dataset" */ "./Datasets/MIPLIB_2010"
			);
			soluData = module.MIPLIB_2010_SOLUTION_DATA;
		}

		if (soluData) {
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
	configurationSettingsButton.disabled = false;

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
	 * Filters by the solvers selected in the form selector and gets
	 * the default time and gap percentage from the number input.
	 */
	downloadCustomConfigurationButton.addEventListener("click", () => {
		if (selectedSolvers.length === 0) {
			selectedSolvers[0] = solverSelector.value;
		}
		const customizedTraceData = traceData.filter((solver) => {
			return selectedSolvers.includes(solver["SolverName"]);
		});
		const newRawData: string[] = CreateNewTraceData(customizedTraceData);

		defaultTime = Number(defaultTimeInput.value);
		if (!defaultTime) {
			defaultTime = 1000;
		}

		gapLimit = Number(gapLimitInput.value);
		if (!gapLimit) {
			gapLimit = 0.01;
		}

		DownloadCustomizedUserConfiguration(newRawData, defaultTime, gapLimit);
	});

	/**
	 * If the document title is "Report", it handles the report page functionality using
	 * the traceData and traceDataFiltered variables.
	 */
	if (document.title === PageTitles.TABLE) {
		HandleReportPage(traceData, traceDataFiltered);
		if (dataFileType === "json") {
			viewTableButton.click();
		}
	}

	/**
	 * If the document title is "Compare Solvers", it handles the compare solvers page functionality using
	 * the traceData variable.
	 */
	if (document.title === PageTitles.COMPARE_SOLVERS) {
		HandleCompareSolversPage(traceData);
	}

	/**
	 * If the document title is not "Report", it handles the plot page functionality using
	 * the traceData variable.
	 */
	if (
		document.title !== PageTitles.TABLE &&
		document.title !== PageTitles.COMPARE_SOLVERS
	) {
		HandlePlotPages(traceData);
		if (dataFileType === "json") {
			viewPlotsButton.click();
		}
	}
}

/**
 * This function manages the functionality of the buttons on the Report page of the application.
 *
 * @param {object[]} traceData - Array of objects containing the result data.
 * @param {object[]} traceDataFiltered - Array of objects containing the filtered result data.
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
	showSelectedRowsButton.addEventListener("click", () => {
		showSelectedRowsButton.disabled = true;
		traceDataFiltered = UpdateResults();

		if (traceDataFiltered.length === 0) {
			DisplayWarningNotification(TableMessages.TABLE_NO_ROWS);
			showSelectedRowsButton.disabled = false;
		} else {
			DisplayDataTable(traceDataFiltered);
		}
	});

	/**
	 * Save to local storage when clicking on the "Save Data" button.
	 * If the results have been filtered it remaps the object properties
	 * based on `ReversedTraceHeaderMap` before saving the data.
	 */
	saveLocalStorageButton.addEventListener("click", () => {
		function RemapObjectProperties(traceData: object[]): object[] {
			return traceData.map((obj) => {
				const remappedObj = {};
				for (const key in obj) {
					const newKey = ReversedTraceHeaderMap[key] || key;
					remappedObj[newKey] = obj[key];
				}
				return remappedObj;
			});
		}

		let newRawData = [];

		if (dataFileType === "trc") {
			dataFileType = "json";
		}

		if (traceDataFiltered.length === 0) {
			newRawData = CreateNewTraceData(traceData);
		} else {
			const remappedData = RemapObjectProperties(traceDataFiltered);
			newRawData = CreateNewTraceData(remappedData);
		}
		CreateUserConfiguration(newRawData, dataFileType);
		deleteLocalStorageButton.disabled = false;
		downloadConfigurationButtonLayer.disabled = false;
	});

	/**
	 * Destroy the data table and reinitializes the program when clicking on "Clear Data Table".
	 */
	clearTableButton.addEventListener("click", () => {
		DisplayWarningNotification(TableMessages.TABLE_CLEARING);
		clearTableButton.disabled = true;
		setTimeout(() => {
			DestroyDataTable();
			InitializeProgram();
		}, 5000);
	});
}

/**
 * This function manages the functionality of the buttons on the plot pages of the application.
 *
 * @param {object[]} traceData - Array of objects containing the result data.
 */
function HandlePlotPages(traceData: object[]): void {
	/**
	 * Save to local storage when clicking on the "Save Data" button.
	 */
	saveLocalStorageButton.addEventListener("click", () => {
		if (dataFileType === "trc") {
			dataFileType = "json";
		}
		const newRawData: string[] = CreateNewTraceData(traceData);
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
		if (document.title === PageTitles.ABSOLUTE_PERFORMANCE_PROFILE) {
			defaultTime = defaultTimeDirectInput.value;
			gapLimit = gapLimitDirectInput.value;

			chartData = PlotAbsolutePerformanceProfileSolverTimes(
				traceData,
				defaultTime,
				gapLimit
			);
		}

		/**
		 * Check if the user is on the Average Solver Time page.
		 */
		if (document.title === PageTitles.AVERAGE_SOLVER_TIME) {
			chartData = PlotDataByCategory(
				traceData,
				"bar",
				"SolverTime",
				"Average, min, max and std for solver time"
			);
		}

		/**
		 * Check if the user is on the Solver Time page.
		 */
		if (document.title === PageTitles.SOLVER_TIME) {
			chartData = PlotAllSolverTimes(traceData);
		}

		/**
		 * Check if the user is on the Number of Nodes page.
		 */
		if (document.title === PageTitles.NUMBER_OF_NODES) {
			chartData = PlotDataByCategory(
				traceData,
				"bar",
				"NumberOfNodes",
				"Average, min, max and std for number of nodes"
			);
		}

		/**
		 * Check if the user is on the Number of Iterations page.
		 */
		if (document.title === PageTitles.NUMBER_OF_ITERATIONS) {
			chartData = PlotDataByCategory(
				traceData,
				"bar",
				"NumberOfIterations",
				"Average, min, max and std for number of iterations"
			);
		}

		/**
		 * Check if the user is on the Termination Status page.
		 */
		if (document.title === PageTitles.TERMINATION_STATUS) {
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
			DisplayErrorNotification(ChartMessages.NO_CHART_DATA);
		}
	});
}

/**
 * This function manages the functionality of the buttons on the compare solvers page of the application.
 * It also handles the comparison of the solvers.
 *
 * @param {object[]} traceData - Array of objects containing the result data.
 */
function HandleCompareSolversPage(traceData: object[]): void {
	const solverTimes = ExtractAllSolverTimes(traceData);
	PopulateCheckboxes(solverTimes);

	/**
	 * Save to local storage when clicking on the "Save Data" button.
	 */
	saveLocalStorageButton.addEventListener("click", () => {
		if (dataFileType === "trc") {
			dataFileType = "json";
		}
		const newRawData: string[] = CreateNewTraceData(traceData);
		CreateUserConfiguration(newRawData, dataFileType);
		deleteLocalStorageButton.disabled = false;
		downloadConfigurationButtonLayer.disabled = false;
	});

	/**
	 * Event listener for the compare solvers button.
	 */
	compareSolversButton.addEventListener("click", () => {
		const selectedSolvers = GetSelectedCheckboxValues();
		if (selectedSolvers.length !== 2) {
			DisplayErrorNotification(ErrorMessages.SELECT_SOLVER_AMOUNT);
		}
		const comparisonSummary = CompareSolvers(
			selectedSolvers[0],
			selectedSolvers[1],
			solverTimes
		);
		const inverseComparisonSummary = CompareSolvers(
			selectedSolvers[1],
			selectedSolvers[0],
			solverTimes
		);
		ComparisonSummaryTable(
			comparisonSummary,
			inverseComparisonSummary,
			selectedSolvers[0],
			selectedSolvers[1]
		);
		ElementStateDisplayedComparisonTable();
	});
}

/**
 * Run the program.
 */
InitializeProgram();
