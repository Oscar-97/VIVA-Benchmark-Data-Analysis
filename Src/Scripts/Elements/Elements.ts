/**
 * Elements that the user can interact with.
 * @param FileInput Allows the user to select a benchmark results file for upload, located at the top of the page.
 * @param ImportDataButton Allows the user to upload the selected file, located at the top of the page.
 * 
 * @param SelectAllButton Selects all solvers from the benchmark results file.
 * @param ViewSelectionButton Displays a table with the currently selected solvers.
 * @param FilterSelectionButton Saves the currently marked rows.
 * @param ViewPlotsButton Displays a plot with the currently selected solvers.
 * 
 * @param DownloadCSVButton Downloads the currently displayed table.
 * @param InputSearch Input for searching for problems.
 */
export const FileInput = document.getElementById('fileInput') as HTMLInputElement;
export const ImportDataButton = document.getElementById('importDataButton') as HTMLButtonElement;

export const SelectAllButton = document.getElementById("selectAllButton") as HTMLButtonElement;
export const ViewSelectionButton = document.getElementById("viewSelectionButton") as HTMLButtonElement;
export const FilterSelectionButton = document.getElementById("filterSelectionButton") as HTMLButtonElement;
export const ViewPlotsButton = document.getElementById('viewPlotsButton') as HTMLButtonElement;

export const DownloadCSVButton = document.getElementById("downloadCSVButton") as HTMLAnchorElement;
export const InputSearch = document.getElementById("tableSearch") as HTMLInputElement;

export const xMaxInput = document.getElementById('xMaxInput') as HTMLInputElement;
export const xMinInput = document.getElementById('xMinInput') as HTMLInputElement;
export const yMaxInput = document.getElementById('yMaxInput') as HTMLInputElement;
export const yMinInput = document.getElementById('yMinInput') as HTMLInputElement;