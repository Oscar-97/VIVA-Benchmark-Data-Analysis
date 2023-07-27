// #region Imports
/**
 * jQuery (Fade in animation)
 */
const jq = require("jquery");

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
	FileInput,
	ImportDataButton,
	SelectAllButton,
	ViewAllResultsButton,
	FilterSelectionButton,
	SaveLocalStorageButton,
	DownloadConfigurationButton,
	DownloadCSVButton,
	DeleteLocalStorageButton,
	ClearTableButton,
	DownloadConfigurationButtonLayer
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

jq(document).ready(function () {
	jq("body > :not(nav)").css("opacity", "1");
	jq("hr").css("opacity", "0.25");
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
	DataFileType = "";
	RawData = [];
	CheckedSolvers = [];
	RawInstanceInfoData = [];
	RawSoluData = [];

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
		[RawData, DataFileType, CheckedSolvers] = GetUserConfiguration();
		ImportDataEvents("Found cached benchmark file!", "json");
		DeleteLocalStorageButton.disabled = false;
		DownloadConfigurationButtonLayer.disabled = false;
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
	 * TRC file.
	 * @param TrcData Trace data results.
	 * @param TrcDataFiltered Filtered trace data results.
	 */
	let TrcData: object[] = [];
	const TrcDataFiltered: object[] = [];

	/**
	 * SOLU and CSV file.
	 * @param InstanceInfoData Instance properties.
	 * @param SoluData Best known primal and dual bounds for each instance.
	 */
	let InstanceInfoData: object[] = [];
	let SoluData: object[] = [];

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

	const ProblemListFiltered: string[] = [];
	const ResultsDataFiltered: string[] = [];

	/**
	 * Run if the uploaded file is json.
	 */
	if (DataFileType == "json") {
		[RawData, DataFileType, CheckedSolvers] = GetUserConfiguration();
	}

	/**
	 * Check which file format is used, add the data to correct categories and create the solver filters. Select solvers if they are found in localStorage.
	 */
	if (DataFileType === "trc") {
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
		AddResultCategories(TrcData);
	}

	if (DataFileType === "txt") {
		Instance = GetInstance(RawData);
		Solvers = GetSolvers(RawData);
		DataLabels = GetDataLabels(RawData);
		InstanceLabels = GetInstanceLabels(DataLabels);
		ProblemList = GetProblems(RawData);
		ResultsData = GetResults(RawData);

		SelectAllButton.hidden = false;

		if (CheckedSolvers.length !== 0) {
			SelectSavedSolvers(CheckedSolvers);
		}
	}

	/**
	 * Download the current configuration.
	 */
	DownloadConfigurationButton.addEventListener("click", () => {
		DownloadUserConfiguration();
	});

	/**
	 * Delete stored data in local storage.
	 */
	DeleteLocalStorageButton.addEventListener("click", () => {
		DeleteUserConfiguration();
		DeleteLocalStorageButton.disabled = true;
		DownloadConfigurationButtonLayer.disabled = true;
	});

	/**
	 * Check if the user is on the Report page.
	 */
	if (document.title == "Report") {
		HandleReportPage(
			Solvers,
			Instance,
			InstanceLabels,
			DataLabels,
			ProblemList,
			ResultsData,
			ProblemListFiltered,
			ResultsDataFiltered,
			TrcData,
			TrcDataFiltered
		);
	}

	/**
	 * Save to local storage functionality on the plot pages.
	 */
	if (document.title != "Report") {
		SaveLocalStorageButton.addEventListener("click", () => {
			if (DataFileType === "trc" || DataFileType === "json") {
				let NewRawData = [];
				NewRawData = CreateDataTrc(TrcData);

				CreateUserConfiguration(NewRawData, DataFileType);
			}
			DeleteLocalStorageButton.disabled = false;
			DownloadConfigurationButtonLayer.disabled = false;
		});

		HandlePlotPages(TrcData);
	}
}

/**
 * Handle report(table) page button functions.
 */
function HandleReportPage(
	Solvers,
	Instance,
	InstanceLabels,
	DataLabels,
	ProblemList,
	ResultsData,
	ProblemListFiltered,
	ResultsDataFiltered,
	TrcData,
	TrcDataFiltered
): void {
	if (DataFileType === "txt") {
		TableFilters(Solvers, "Solvers");

		if (CheckedSolvers.length !== 0) {
			SelectSavedSolvers(CheckedSolvers);
		}
	}

	/**
	 * Select all checkboxes button functionality.
	 */
	SelectAllButton.addEventListener("click", () => {
		ToggleSelection();
	});

	/**
	 * Shows all problems depending on the uploaded file.
	 */
	ViewAllResultsButton.addEventListener("click", () => {
		LoadingAnimation();
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
			TableDisplayTrc(TrcDataFiltered);
		}
	});

	/**
	 * Save to local storage when clicking on the relevant button.
	 */
	SaveLocalStorageButton.addEventListener("click", () => {
		if (DataFileType === "txt") {
			CheckedSolvers = GetCheckedSolvers();
			CreateUserConfiguration(RawData, DataFileType, CheckedSolvers);
		} else if (DataFileType === "trc" || DataFileType === "json") {
			let NewRawData = [];
			if (TrcDataFiltered.length === 0) {
				NewRawData = CreateDataTrc(TrcData);
			} else {
				NewRawData = CreateDataTrc(TrcDataFiltered);
			}
			CreateUserConfiguration(NewRawData, DataFileType, CheckedSolvers);
		}
	});

	/**
	 * Download the currently displayed table as a CSV.
	 */
	DownloadCSVButton.addEventListener("click", () => {
		TableDownloadCSV();
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
 * Hande plot pages button functions.
 */
function HandlePlotPages(TrcData: object[]): void {
	/**
	 * Save to local storage functionality on the plot pages.
	 */
	if (document.title != "Report") {
		/**
		 * Save to local storage when clicking on the relevant button.
		 */
		SaveLocalStorageButton.addEventListener("click", () => {
			if (DataFileType === "trc" || DataFileType === "json") {
				let NewRawData = [];
				NewRawData = CreateDataTrc(TrcData);

				CreateUserConfiguration(NewRawData, DataFileType);
			}
			DeleteLocalStorageButton.disabled = false;
			DownloadConfigurationButtonLayer.disabled = false;
		});
	}

	/**
	 * Check if the user is on the Average Solver Time page.
	 */
	if (document.title == "Average Solver Time") {
		PlotDataByCategory(
			TrcData,
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
		PlotAllSolverTimes(TrcData);
	}

	/**
	 * Check if the user is on the Number of Nodes page.
	 */
	if (document.title == "Number of Nodes") {
		PlotDataByCategory(
			TrcData,
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
			TrcData,
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
