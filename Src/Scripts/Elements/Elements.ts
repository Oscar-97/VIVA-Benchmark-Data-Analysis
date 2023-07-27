/**
 * Navigation bar.
 * @param FileInput Allows the user to select a benchmark results file for upload, located at the top of the page.
 * @param ImportDataButton Allows the user to upload the selected file, located at the top of the page.
 */
export const FileInput = document.getElementById(
	"fileInput"
) as HTMLInputElement;
export const ImportDataButton = document.getElementById(
	"importDataButton"
) as HTMLButtonElement;

/**
 * On both pages.
 * @param SelectAllButton Selects all solvers from the benchmark results file.
 */
export const AlertNotification = document.getElementById(
	"alertNotification"
) as HTMLDivElement;
export const SelectAllButton = document.getElementById(
	"selectAllButton"
) as HTMLButtonElement;

/**
 * Table page.
 * @param ViewSelectionButton Displays a table with the currently selected solvers.
 * @param FilterSelectionButton Saves the currently marked rows.
 */
export const ViewAllResultsButton = document.getElementById(
	"viewAllResultsButton"
) as HTMLButtonElement;
export const FilterSelectionButton = document.getElementById(
	"filterSelectionButton"
) as HTMLButtonElement;

/**
 * @param SaveLocalStorageButton Save current table data to the local storage.
 * @param DownloadConfigurationButton Download current configuration.
 * @param DownloadCSVButton Download link the currently displayed table.
 * @param DownloadCSVButtonLayer Button element layer for the link.
 */
export const SaveLocalStorageButton = document.getElementById(
	"saveLocalStorageButton"
) as HTMLButtonElement;
export const DownloadConfigurationButton = document.getElementById(
	"downloadConfigurationButton"
) as HTMLAnchorElement;
export const DownloadConfigurationButtonLayer = document.getElementById(
	"downloadConfigurationButtonLayer"
) as HTMLButtonElement;
export const DownloadCSVButton = document.getElementById(
	"downloadCSVButton"
) as HTMLAnchorElement;
export const DownloadCSVButtonLayer = document.getElementById(
	"downloadCSVButtonLayer"
) as HTMLButtonElement;

/**
 * @param DeleteLocalStorageButton Delete current saved table data from local storage.
 * @param ClearTableButton Clear current settings.
 * @param InputSearch Input for searching for problems.
 * @param SolverAndProblemsHeader Badge with the text Solvers or Problems.
 */
export const DeleteLocalStorageButton = document.getElementById(
	"deleteLocalStorageButton"
) as HTMLButtonElement;
export const ClearTableButton = document.getElementById(
	"clearTableButton"
) as HTMLButtonElement;
export const SolverAndProblemsHeader = document.getElementById(
	"solverAndProblemsHeader"
) as HTMLSpanElement;

/**
 * @param Loading animation container.
 */
export const LoaderContainer = document.getElementById(
	"loaderContainer"
) as HTMLDivElement;
export const DataTable = document.getElementById("dataTable") as HTMLDivElement;

/**
 * Plots page.
 * @param ViewPlotsButton Displays a plot with the currently selected solvers.
 * @param xMaxInput Max x value.
 * @param xMinInput Min x value.
 * @param yMaxInput Max y value.
 * @param yMinInput Min y value.
 */
export const ViewPlotsButton = document.getElementById(
	"viewPlotsButton"
) as HTMLButtonElement;
