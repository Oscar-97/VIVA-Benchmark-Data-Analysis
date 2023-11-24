import {
	fileInput,
	importDataButton,
	viewTableButton,
	showSelectedRowsButton,
	saveLocalStorageButton,
	downloadConfigurationButtonLayer,
	configurationSettingsButton,
	deleteLocalStorageButton,
	clearTableButton,
	viewPlotsButton,
	downloadChartDataButtonLayer,
	loaderContainer,
	dataTable,
	defaultTimeDirectInput,
	primalGapDirectInput
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
export function ElementStatesTablePage(): void {
	loaderContainer.innerHTML = "";
	dataTable.style.visibility = "hidden";
	fileInput.value = "";
	importDataButton.disabled = true;
	viewTableButton.disabled = true;
	showSelectedRowsButton.disabled = true;
	saveLocalStorageButton.disabled = true;
	downloadConfigurationButtonLayer.disabled = true;
	configurationSettingsButton.disabled = true;
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
export function ElementStatesPlotPage(): void {
	fileInput.value = "";
	viewPlotsButton.disabled = true;
	saveLocalStorageButton.disabled = true;
	downloadConfigurationButtonLayer.disabled = true;
	configurationSettingsButton.disabled = true;
	downloadChartDataButtonLayer.disabled = true;
	deleteLocalStorageButton.disabled = true;
	if (document.title === "Absolute Performance Profile") {
		defaultTimeDirectInput.value = "";
		primalGapDirectInput.value = "";
	}
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
export function ElementStateDisplayedTable(): void {
	showSelectedRowsButton.disabled = false;
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
export function ElementStateDisplayedChart(): void {
	saveLocalStorageButton.disabled = false;
	downloadConfigurationButtonLayer.disabled = false;
	downloadChartDataButtonLayer.disabled = false;
	deleteLocalStorageButton.disabled = false;
}
