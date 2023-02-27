import {
    FileInput,
    ImportDataButton,
    ViewAllResultsButton,
    FilterSelectionButton,
    SelectAllButton,
    SaveLocalStorageButton,
    DownloadConfigurationButton,
    DownloadConfigurationButtonLayer,
    DownloadCSVButton,
    DownloadCSVButtonLayer,
    DeleteLocalStorageButton,
    ClearTableButton,
  } from "./Elements";

/**
 * Input values and button statuses when arriving/reloading to the page.
 */
export function ElementStatus(): void {
    FileInput.value = "";
    ImportDataButton.disabled = false;
    ViewAllResultsButton.disabled = true;
    FilterSelectionButton.disabled = true;
    SelectAllButton.disabled = true;
    SaveLocalStorageButton.disabled = true;
    DownloadCSVButtonLayer.disabled = true;
    DownloadConfigurationButtonLayer.disabled = true;
    DeleteLocalStorageButton.disabled = true;
    ClearTableButton.disabled = true;
}

/**
 * Button statuses when the table is displayed.
 */
export function ElementStatusWithTable() {
    SelectAllButton.disabled = false;
    FilterSelectionButton.disabled = false;
    SaveLocalStorageButton.disabled = false;
    DownloadConfigurationButtonLayer.disabled = false;
    DownloadCSVButtonLayer.disabled = false;
    DeleteLocalStorageButton.disabled = false;
    ClearTableButton.disabled = false;
}