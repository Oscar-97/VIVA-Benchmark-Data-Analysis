import { PageTitles } from "../Constants/PageTitles";
import {
	fileInput,
	librarySelector,
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
	gapLimitDirectInput,
	compareSolversButton
} from "./Elements";

/**
 * This function resets the status of several elements to their initial state when the user first arrives at,
 * or reloads, the table page.
 *
 * @remarks
 *
 * This function is called when the table page is first loaded or refreshed. It's designed to:
 * 1. Clear the loader container's inner HTML.
 * 2. Hide the data table.
 * 3. Clear the file input's value.
 * 4. Set the library selector value to "none".
 * 4. Disable various interactive buttons.
 */
export function ElementStatesTablePage(): void {
	loaderContainer.innerHTML = "";
	dataTable.style.visibility = "hidden";
	fileInput.value = "";
	librarySelector.value = "none";
	librarySelector.disabled = true;
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
 * This function resets the status of several elements to their initial state when the user first arrives at,
 * or reloads, the plot page.
 *
 * @remarks
 * This function is typically called when the plot page is first loaded or refreshed. It's designed to:
 * 1. Clear the file input's value.
 * 2. Set the library selector value to "none".
 * 3. Disable various interactive buttons.
 */
export function ElementStatesPlotPage(): void {
	fileInput.value = "";
	librarySelector.value = "none";
	librarySelector.disabled = true;
	viewPlotsButton.disabled = true;
	saveLocalStorageButton.disabled = true;
	downloadConfigurationButtonLayer.disabled = true;
	configurationSettingsButton.disabled = true;
	downloadChartDataButtonLayer.disabled = true;
	deleteLocalStorageButton.disabled = true;
	if (document.title === PageTitles.ABSOLUTE_PERFORMANCE_PROFILE) {
		defaultTimeDirectInput.value = "";
		gapLimitDirectInput.value = "";
	}
}

/**
 * This function resets the status of several elements to their initial state when the user first arrives at,
 * or reloads, the compare solvers page.
 *
 * @remarks
 * This function is typically called when the compare solvers page is first loaded or refreshed. It's designed to:
 * 1. Clear the file input's value.
 * 2. Set the library selector value to "none".
 * 3. Disable various interactive buttons.
 */
export function ElementStatesCompareSolversPage(): void {
	fileInput.value = "";
	librarySelector.value = "none";
	librarySelector.disabled = true;
	compareSolversButton.disabled = true;
	saveLocalStorageButton.disabled = true;
	downloadConfigurationButtonLayer.disabled = true;
	configurationSettingsButton.disabled = true;
	deleteLocalStorageButton.disabled = true;
}

/**
 * This function updates the status of several buttons when a data table is displayed.
 *
 * @remarks
 * It's designed to enable various interactive buttons (show selected rows, save local storage, download configuration,
 * delete local storage, clear table).
 */
export function ElementStateDisplayedTable(): void {
	showSelectedRowsButton.disabled = false;
	saveLocalStorageButton.disabled = false;
	downloadConfigurationButtonLayer.disabled = false;
	deleteLocalStorageButton.disabled = false;
	clearTableButton.disabled = false;
}

/**
 * This function updates the status of several buttons when a data table is displayed.
 *
 * @remarks
 * It's designed to enable various interactive buttons (save local storage, download configuration,
 * download chart, delete local storage).
 */
export function ElementStateDisplayedChart(): void {
	saveLocalStorageButton.disabled = false;
	downloadConfigurationButtonLayer.disabled = false;
	downloadChartDataButtonLayer.disabled = false;
	deleteLocalStorageButton.disabled = false;
}

/**
 * This function updates the status of several buttons when a comparison table is displayed.
 *
 * @remarks
 * It's designed to enable various interactive buttons (save local storage,
 * download configuration, delete local storage).
 */
export function ElementStateDisplayedComparisonTable(): void {
	saveLocalStorageButton.disabled = false;
	downloadConfigurationButtonLayer.disabled = false;
	deleteLocalStorageButton.disabled = false;
}
