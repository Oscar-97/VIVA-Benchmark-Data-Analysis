/**
 * Navigation bar.
 * @param FileInput Allows the user to select a benchmark results file for upload, located at the top of the page.
 * @param ImportDataButton Allows the user to upload the selected file, located at the top of the page.
 */
export const FileInput = document.getElementById('fileInput') as HTMLInputElement;
export const ImportDataButton = document.getElementById('importDataButton') as HTMLButtonElement;

/**
 * On both pages.
 * @param SelectAllButton Selects all solvers from the benchmark results file.
 */
export const SelectAllButton = document.getElementById("selectAllButton") as HTMLButtonElement;

/**
 * Table page.
 * @param ViewSelectionButton Displays a table with the currently selected solvers.
 * @param FilterSelectionButton Saves the currently marked rows.
 * @param SaveLocalStorageButton Save current table to the local storage.
 * @param DownloadCSVButton Download link the currently displayed table.
 * @param DownloadCSVButtonLayer Button element layer for the link.
 * @param InputSearch Input for searching for problems.
 * @param SolverAndProblemsHeader Badge with the text Solvers or Problems.
 */
export const ViewSelectionButton = document.getElementById("viewSelectionButton") as HTMLButtonElement;
export const FilterSelectionButton = document.getElementById("filterSelectionButton") as HTMLButtonElement;
export const SaveLocalStorageButton = document.getElementById("saveLocalStorage") as HTMLButtonElement;
export const DownloadCSVButton = document.getElementById("downloadCSVButton") as HTMLAnchorElement;
export const DownloadCSVButtonLayer = document.getElementById("downloadCSVButtonLayer") as HTMLButtonElement;
export const InputSearch = document.getElementById("tableSearch") as HTMLInputElement;
export const SolverAndProblemsHeader = document.getElementById('SolverAndProblemsHeader') as HTMLSpanElement;

/**
 * Plots page.
 * @param ViewPlotsButton Displays a plot with the currently selected solvers.
 * @param xMaxInput Max x value.
 * @param xMinInput Min x value.
 * @param yMaxInput Max y value.
 * @param yMinInput Min y value.
 */
export const ViewPlotsButton = document.getElementById('viewPlotsButton') as HTMLButtonElement;

export const xMaxInput = document.getElementById('xMaxInput') as HTMLInputElement;
export const xMinInput = document.getElementById('xMinInput') as HTMLInputElement;
export const yMaxInput = document.getElementById('yMaxInput') as HTMLInputElement;
export const yMinInput = document.getElementById('yMinInput') as HTMLInputElement;