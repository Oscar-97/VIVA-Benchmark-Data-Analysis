import { PageTitles } from "../../Constants/PageTitles";
import { elements } from "../Elements";

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
	elements.loaderContainer.innerHTML = "";
	elements.dataTable.style.visibility = "hidden";
	elements.fileInput.value = "";
	elements.librarySelector.value = "none";
	elements.librarySelector.disabled = true;
	elements.importDataButton.disabled = true;
	elements.viewTableButton.disabled = true;
	elements.showSelectedRowsButton.disabled = true;
	elements.saveLocalStorageButton.disabled = true;
	elements.downloadConfigurationButtonLayer.disabled = true;
	elements.configurationSettingsButton.disabled = true;
	elements.deleteLocalStorageButton.disabled = true;
	elements.clearDataTableButton.disabled = true;
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
	elements.fileInput.value = "";
	elements.librarySelector.value = "none";
	elements.librarySelector.disabled = true;
	elements.viewPlotsButton.disabled = true;
	elements.saveLocalStorageButton.disabled = true;
	elements.downloadConfigurationButtonLayer.disabled = true;
	elements.configurationSettingsButton.disabled = true;
	elements.downloadChartDataButtonLayer.disabled = true;
	elements.deleteLocalStorageButton.disabled = true;
	if (document.title === PageTitles.PERFORMANCE_PROFILE) {
		elements.defaultTimeDirectInput.value = "";
		elements.gapLimitDirectInput.value = "";
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
	elements.fileInput.value = "";
	elements.librarySelector.value = "none";
	elements.librarySelector.disabled = true;
	elements.compareSolversButton.disabled = true;
	elements.saveLocalStorageButton.disabled = true;
	elements.downloadConfigurationButtonLayer.disabled = true;
	elements.configurationSettingsButton.disabled = true;
	elements.deleteLocalStorageButton.disabled = true;
}

/**
 * This function updates the status of several buttons when a data table is displayed.
 *
 * @remarks
 * It's designed to enable various interactive buttons (show selected rows, save local storage, download configuration,
 * delete local storage, clear table).
 */
export function ElementStateDisplayedTable(): void {
	elements.showSelectedRowsButton.disabled = false;
	elements.saveLocalStorageButton.disabled = false;
	elements.downloadConfigurationButtonLayer.disabled = false;
	elements.deleteLocalStorageButton.disabled = false;
	elements.clearDataTableButton.disabled = false;
}

/**
 * This function updates the status of several buttons when a data table is displayed.
 *
 * @remarks
 * It's designed to enable various interactive buttons (save local storage, download configuration,
 * download chart, delete local storage).
 */
export function ElementStateDisplayedChart(): void {
	elements.saveLocalStorageButton.disabled = false;
	elements.downloadConfigurationButtonLayer.disabled = false;
	elements.downloadChartDataButtonLayer.disabled = false;
	elements.deleteLocalStorageButton.disabled = false;
}

/**
 * This function updates the status of several buttons when a comparison table is displayed.
 *
 * @remarks
 * It's designed to enable various interactive buttons (save local storage,
 * download configuration, delete local storage).
 */
export function ElementStateDisplayedComparisonTable(): void {
	elements.saveLocalStorageButton.disabled = false;
	elements.downloadConfigurationButtonLayer.disabled = false;
	elements.deleteLocalStorageButton.disabled = false;
}
