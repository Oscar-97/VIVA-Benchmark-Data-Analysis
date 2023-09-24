import {
	fileInput,
	importDataButton,
	viewTableButton,
	filterSelectionButton,
	saveLocalStorageButton,
	downloadConfigurationButtonLayer,
	deleteLocalStorageButton,
	clearTableButton,
	viewPlotsButton,
	downloadChartDataButtonLayer,
	loaderContainer,
	dataTable
} from "./Elements";

/**
 * Resets the status of several elements to their initial state when the user first arrives at,
 * or reloads, the table page.
 *
 * @remarks
 *
 * This function is typically called when the table page is first loaded or refreshed. It's designed to:
 * 1. Clear the loader container's inner HTML.
 * 2. Hide the data table.
 * 3. Clear the file input's value.
 * 4. Disable various interactive buttons (import data, view all results, filter selection,
 *    save local storage, download configuration, delete local storage, clear table).
 */
export function ElementStatus(): void {
	loaderContainer.innerHTML = "";
	dataTable.style.visibility = "hidden";
	fileInput.value = "";
	importDataButton.disabled = true;
	viewTableButton.disabled = true;
	filterSelectionButton.disabled = true;
	saveLocalStorageButton.disabled = true;
	downloadConfigurationButtonLayer.disabled = true;
	deleteLocalStorageButton.disabled = true;
	clearTableButton.disabled = true;
}

/**
 * Resets the status of several elements to their initial state when the user first arrives at,
 * or reloads, the plot page.
 *
 * @remarks
 *
 * This function is typically called when the plot page is first loaded or refreshed. It's designed to:
 * 1. Clear the file input's value.
 * 2. Disable various interactive buttons (view plots, save local storage, download configuration, delete local storage).
 */
export function ElementStatusPlots(): void {
	fileInput.value = "";
	viewPlotsButton.disabled = true;
	saveLocalStorageButton.disabled = true;
	downloadConfigurationButtonLayer.disabled = true;
	downloadChartDataButtonLayer.disabled = true;
	deleteLocalStorageButton.disabled = true;
}

/**
 * Updates the status of several buttons when a data table is displayed.
 *
 * @remarks
 *
 * This function is typically called after a data table is generated and displayed on the page.
 * It's designed to enable various interactive buttons (filter selection, save local storage, download configuration,
 *    delete local storage, clear table).
 */
export function ElementStatusWithTable(): void {
	filterSelectionButton.disabled = false;
	saveLocalStorageButton.disabled = false;
	downloadConfigurationButtonLayer.disabled = false;
	deleteLocalStorageButton.disabled = false;
	clearTableButton.disabled = false;
}

/**
 * Updates the status of several buttons when a data table is displayed.
 *
 * @remarks
 *
 * This function is typically called after a chart is generated and displayed on the page.
 * It's designed to enable various interactive buttons (save local storage, download configuration,
 * delete local storage).
 */
export function ElementStatusWithCharts(): void {
	saveLocalStorageButton.disabled = false;
	downloadConfigurationButtonLayer.disabled = false;
	downloadChartDataButtonLayer.disabled = false;
	deleteLocalStorageButton.disabled = false;
}
