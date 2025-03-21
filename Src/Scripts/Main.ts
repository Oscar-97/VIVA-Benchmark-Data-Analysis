// #region Imports
/**
 * Bootstrap.
 */
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";

import { CreateFileFormatInformationModal } from "./Elements/Modals/InfoModal";
import { CreateConfigurationSettingsModal } from "./Elements/Modals/CustomizeDownloadModal";

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
	PlotFailCount,
	PlotStatusMessages
} from "./Chart/ChartType/BarCharts";

import { PlotPerformanceProfile } from "./Chart/ChartType/LineCharts";
import { PlotSolverTimes } from "./Chart/ChartType/LineCharts";
import { PlotSolutionTimes } from "./Chart/ChartType/BubbleCharts";

/**
 * Dataprocessing.
 */
import { ConvertToTraceFile } from "./DataProcessing/CreateData";
import {
	FillSolverSelectorList,
	ImportDataEvents
} from "./Elements/Events/ImportDataEvents";
import { ReadData, GetDataFileType } from "./DataProcessing/ReadData";
import { ExtractTraceData } from "./DataProcessing/FilterData";

/**
 * DataTable.
 */
import { ComparisonSummaryTable } from "./DataTable/DataTableBase";
import {
	DisplayDataTable,
	DestroyDataTable
} from "./DataTable/DataTableWrapper";
import { GetFilteredRows, GetSelectedRows } from "./DataTable/GetDataFromTable";

/**
 * Elements.
 */
import {
	PopulateCheckboxes,
	GetSelectedCheckboxValues
} from "./Elements/Events/DynamicCheckboxes";
import {
	ElementStatesTablePage,
	ElementStatesPlotPage,
	ElementStateDisplayedChart,
	ElementStatesCompareSolversPage,
	ElementStateDisplayedComparisonTable
} from "./Elements/Events/ElementStatus";
import {
	fileInput,
	importDataButton,
	viewTableButton,
	showSelectedRowsButton,
	saveLocalStorageButton,
	downloadConfigurationButton,
	deleteLocalStorageButton,
	clearDataTableButton,
	downloadConfigurationButtonLayer,
	demoDataButton,
	viewPlotsButton,
	downloadChartDataButton,
	solverSelector,
	defaultTimeInput,
	configurationSettingsButton,
	defaultTimeDirectInput,
	gapLimitDirectInput,
	gapLimitInput,
	compareSolversButton,
	gapTypeSelector,
	terminationTypeSelector,
	categorySelector,
	filterTypeSelector,
	performanceProfileSelector,
	chartTypeSelector,
	statusSelector
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
} from "./Elements/Events/DisplayAlertNotification";
import { ReleaseVersionTag } from "./Elements/ReleaseVersionTag";
import { CompareSolvers } from "./DataProcessing/ResultComputations/ComputeResults";
import { Keys } from "./Constants/Keys";
import {
	ChartMessages,
	ErrorMessages,
	InfoMessages,
	TableMessages,
	UserConfigurationMessages
} from "./Constants/Messages";
import { PageTitles } from "./Constants/PageTitles";
import { TraceData } from "./Interfaces/Interfaces";
import { Values } from "./Constants/Values";
import { ActivateDemoMode, NotifyDemoMode } from "./Actions/DemoMode";
import { ExtractAllSolverTimesGapType } from "./DataProcessing/ChartsComputations/ComputeChartData";
import { TraceHeaderMap } from "./Constants/TraceHeaders";
import { ClearDataTableModal } from "./Elements/Modals/ClearDataTableModal";
import { CreateDeleteDataModal } from "./Elements/Modals/DeleteDataModal";
import { ProcessData } from "./DataProcessing/ProcessTraceData";
import { PlotTerminationRelation } from "./Chart/ChartType/RadarCharts";
import { CreateScreenSizeToast } from "./Elements/Toasts/ScreenSizeToast";
import { InitializeScreenSizeToast } from "./Elements/Events/DisplayScreenSizeToast";
//#endregion

/**
 * Create modals.
 */
CreateFileFormatInformationModal();
CreateConfigurationSettingsModal();
CreateDeleteDataModal();
if (document.title === PageTitles.TABLE) {
	ClearDataTableModal();
}
/**
 * Toast component for screen size notification.
 */
CreateScreenSizeToast();

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
 * @param {number | string} defaultTime - The default time for the performance profile chart.
 * @param {number | string} gapLimit - Gap limit value for the performance profile chart.
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
let chartData = [];

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
	 * Initializes the screen size toast and sets up the event listener for the screen size toast.
	 */
	InitializeScreenSizeToast();

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
		if (
			localStorage.getItem(Keys.DEMO_DATA) === "demo1" ||
			localStorage.getItem(Keys.DEMO_DATA) === "demo2"
		) {
			ImportDataEvents(
				InfoMessages.DEMO_MODE_MSG,
				"json",
				localStorage.getItem(Keys.DEMO_DATA)
			);
			NotifyDemoMode();
		} else {
			ImportDataEvents(InfoMessages.FOUND_STORED_CONFIG, "json");
		}
		saveLocalStorageButton.disabled = true;
		deleteLocalStorageButton.disabled = false;
		downloadConfigurationButtonLayer.disabled = false;
		sessionStorage.setItem(Keys.SAVED_STORAGE_NOTIFICATION, "true");
		ManageData();
	} catch (error) {
		console.info(UserConfigurationMessages.NO_STORED_CONFIG);
		console.warn("Warn: ", error);
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
}

/**
 * Manage the benchmark results data.
 */
async function ManageData(): Promise<void> {
	/**
	 * Trace data results.
	 */
	let traceData: TraceData[] = [];

	/**
	 * instanceInfoData holds the instance properties.
	 * soluData holds the best known primal and dual bounds for each instance.
	 */
	// const instanceInfoData: object[] = [];
	// const soluData: object[] = [];

	/**
	 * selectedValues holds the selected solvers.
	 */
	const selectedSolvers: string[] = [];

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
		traceData = await ProcessData(
			unprocessedData,
			unprocessedInstanceInformationData,
			unprocessedSolutionData
		);
	}

	/**
	 * Handle and set up the common buttons for all pages.
	 */
	HandleCommonButtons(traceData, selectedSolvers);

	/**
	 * If the document title is "Report", it handles the report page functionality using
	 * the traceData variable.
	 */
	if (document.title === PageTitles.TABLE) {
		HandleReportPage(traceData);
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
 * This function manages the functionality of the common buttons on all pages of the application.
 * @param {TraceData[]} traceData - Array of objects containing the result data.
 * @param selectedSolvers  - selectedValues holds the selected solvers.
 */
function HandleCommonButtons(
	traceData: TraceData[],
	selectedSolvers: string[]
): void {
	/**
	 * Fill the solver selector with solvers and update the values in selectedSolvers when the user selects them.
	 */
	FillSolverSelectorList(traceData);
	document.getElementById("solverSelector").addEventListener("change", () => {
		const solverSelector = document.getElementById(
			"solverSelector"
		) as HTMLSelectElement;
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
		document
			.getElementById("deleteButtonInModal")
			.addEventListener("click", () => {
				DeleteUserConfiguration();
				deleteLocalStorageButton.disabled = true;
				downloadConfigurationButtonLayer.disabled = true;
			});
	});

	/**
	 * Download a customized version of the user configuration.
	 * Filters by the solvers selected in the form selector and gets
	 * the default time and gap percentage from the number input.
	 */
	document
		.getElementById("downloadCustomConfigurationButton")
		.addEventListener("click", () => {
			if (selectedSolvers.length === 0) {
				selectedSolvers[0] = solverSelector.value;
			}
			const customizedTraceData = traceData.filter((solver) => {
				return selectedSolvers.includes(solver["SolverName"]);
			});
			const newRawData: string[] = ConvertToTraceFile(customizedTraceData);

			defaultTime = Number(defaultTimeInput.value);
			if (!defaultTime) {
				defaultTime = Values.DEFAULT_TIME;
			}

			gapLimit = Number(gapLimitInput.value);
			if (!gapLimit) {
				gapLimit = Values.DEFAULT_GAP_LIMIT;
			}

			DownloadCustomizedUserConfiguration(newRawData, defaultTime, gapLimit);
		});
}

/**
 * This function manages the functionality of the buttons on the Report page of the application.
 *
 * @param {TraceData[]} traceData - Array of objects containing the result data.
 */
function HandleReportPage(traceData: TraceData[]): void {
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
		const traceDataFiltered = GetSelectedRows();

		if (traceDataFiltered.length === 0) {
			DisplayWarningNotification(TableMessages.TABLE_NO_ROWS);
			showSelectedRowsButton.disabled = false;
		} else {
			DisplayDataTable(traceDataFiltered);
		}
	});

	/**
	 * Save to local storage when clicking on the "Save Data" button.
	 * If the results have been filtered or if they have been selected,
	 * it remaps the object properties based on `ReversedTraceHeaderMap` before saving the data.
	 */
	saveLocalStorageButton.addEventListener("click", () => {
		if (dataFileType === "trc") {
			dataFileType = "json";
		}
		const newTraceData = GetFilteredRows();
		const newRawData = ConvertToTraceFile(newTraceData);

		CreateUserConfiguration(newRawData, dataFileType);
		deleteLocalStorageButton.disabled = false;
		downloadConfigurationButtonLayer.disabled = false;
		sessionStorage.setItem(Keys.ALERTED_STORAGE, "true");
	});

	/**
	 * Destroy the data table and reinitializes the program when clicking on "Clear Data Table".
	 */
	clearDataTableButton.addEventListener("click", () => {
		document
			.getElementById("clearTableButtonInModal")
			.addEventListener("click", () => {
				DisplayWarningNotification(TableMessages.TABLE_CLEARING);
				clearDataTableButton.disabled = true;
				setTimeout(() => {
					DestroyDataTable();
					InitializeProgram();
				}, 5000);
			});
	});
}

/**
 * This function manages the functionality of the buttons on the plot pages of the application.
 *
 * @param {TraceData[]} traceData - Array of objects containing the result data.
 */
function HandlePlotPages(traceData: TraceData[]): void {
	const defaultTimeInput = document.getElementById(
		"defaultTimeInput"
	) as HTMLInputElement;
	defaultTime = defaultTimeInput.value;
	if (!defaultTime) {
		defaultTime = Values.DEFAULT_TIME;
	}
	/**
	 * Save to local storage when clicking on the "Save Data" button.
	 */
	saveLocalStorageButton.addEventListener("click", () => {
		if (dataFileType === "trc") {
			dataFileType = "json";
		}
		const newRawData: string[] = ConvertToTraceFile(traceData);
		CreateUserConfiguration(newRawData, dataFileType);
		deleteLocalStorageButton.disabled = false;
		downloadConfigurationButtonLayer.disabled = false;
		sessionStorage.setItem(Keys.ALERTED_STORAGE, "true");
	});

	/**
	 * View chart/plot when clicking on the view plot button per page.
	 */
	viewPlotsButton.disabled = false;
	viewPlotsButton.addEventListener("click", () => {
		switch (document.title) {
			case PageTitles.PERFORMANCE_PROFILE: {
				defaultTime = defaultTimeDirectInput.value;
				gapLimit = gapLimitDirectInput.value;

				chartData = PlotPerformanceProfile(
					traceData,
					performanceProfileSelector.value,
					defaultTime,
					gapLimit
				);
				break;
			}
			case PageTitles.SOLVER_TIME_PER_SOLVER: {
				const filterType = filterTypeSelector.value;
				chartData = PlotDataByCategory(
					traceData,
					"SolverTime",
					"Average, min, max and std for solver time",
					defaultTime,
					filterType,
					`${defaultTime} is set as default time for NaN values.`
				);
				break;
			}
			case PageTitles.SOLVER_TIME: {
				chartData = PlotSolverTimes(traceData);
				break;
			}
			case PageTitles.NUMBER_OF_NODES: {
				chartData = PlotDataByCategory(
					traceData,
					"NumberOfNodes",
					"Average, min, max and std for number of nodes"
				);
				break;
			}
			case PageTitles.NUMBER_OF_ITERATIONS: {
				chartData = PlotDataByCategory(
					traceData,
					"NumberOfIterations",
					"Average, min, max and std for number of iterations"
				);
				break;
			}
			case PageTitles.TERMINATION_STATUS: {
				const statusType = statusSelector.value;
				const chartType = chartTypeSelector.value;

				statusSelector.addEventListener("change", () => {
					if (statusSelector.value === "Fail") {
						chartTypeSelector.value = "Bar";
						chartTypeSelector.disabled = true;
					} else {
						chartTypeSelector.disabled = false;
					}
				});

				chartTypeSelector.addEventListener("change", () => {
					if (
						chartTypeSelector.value === "Radar" &&
						statusSelector.value === "Fail"
					) {
						chartTypeSelector.value = "Bar";
						chartTypeSelector.disabled = true;
					}
				});

				if (chartType === "Bar") {
					if (statusType === "Fail") {
						chartData = PlotFailCount(traceData);
					} else {
						const type = statusType === "SolverStatus" ? "solver" : "model";
						chartData = PlotStatusMessages(
							traceData,
							statusType,
							`Termination count for ${type} status per solver`
						);
					}
				} else {
					const type = statusType === "SolverStatus" ? "solver" : "model";
					chartData = PlotTerminationRelation(
						traceData,
						statusType,
						`Distribution of ${type} terminations between solvers`
					);
				}
				break;
			}
			case PageTitles.SOLUTION_QUALITY: {
				const category = categorySelector.value;
				const categoryTitle = TraceHeaderMap[category];
				chartData = PlotDataByCategory(
					traceData,
					category,
					`Average, min, max and std for ${categoryTitle}`,
					null,
					null,
					"Infinite and NaN values are excluded from the calculations."
				);
				break;
			}
			case PageTitles.SOLUTION_TIME: {
				chartData = PlotSolutionTimes(traceData);
				break;
			}
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
 * @param {TraceData[]} traceData - Array of objects containing the result data.
 */
function HandleCompareSolversPage(traceData: TraceData[]): void {
	PopulateCheckboxes(traceData);

	/**
	 * Save to local storage when clicking on the "Save Data" button.
	 */
	saveLocalStorageButton.addEventListener("click", () => {
		if (dataFileType === "trc") {
			dataFileType = "json";
		}
		const newRawData: string[] = ConvertToTraceFile(traceData);
		CreateUserConfiguration(newRawData, dataFileType);
		deleteLocalStorageButton.disabled = false;
		downloadConfigurationButtonLayer.disabled = false;
		sessionStorage.setItem(Keys.ALERTED_STORAGE, "true");
	});

	/**
	 * Event listener for the compare solvers button.
	 */
	compareSolversButton.addEventListener("click", () => {
		defaultTime = defaultTimeDirectInput.value;
		gapLimit = gapLimitDirectInput.value;

		const solverTimes = ExtractAllSolverTimesGapType(
			traceData,
			gapTypeSelector.value,
			defaultTime,
			gapLimit,
			terminationTypeSelector.value
		);
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
