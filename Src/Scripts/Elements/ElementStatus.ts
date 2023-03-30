import {
  FileInput,
  ImportDataButton,
  ViewAllResultsButton,
  FilterSelectionButton,
  SelectAllButton,
  SaveLocalStorageButton,
  DownloadConfigurationButtonLayer,
  DownloadCSVButtonLayer,
  DeleteLocalStorageButton,
  ClearTableButton,
  ViewPlotsButton,
} from "./Elements";

/**
 * Input values and button statuses when arriving/reloading to the table page.
 */
export function ElementStatus(): void {
  FileInput.value = "";
  ImportDataButton.disabled = true;
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
 * Input values and button statuses when arriving/reloading to the plot page.
 */
export function ElementStatusPlots(): void {
  FileInput.value = "";
  ViewPlotsButton.disabled = false;
}

/**
 * Button statuses when the table is displayed.
 */
export function ElementStatusWithTable(): void {
  SelectAllButton.disabled = false;
  FilterSelectionButton.disabled = false;
  SaveLocalStorageButton.disabled = false;
  DownloadConfigurationButtonLayer.disabled = false;
  DownloadCSVButtonLayer.disabled = false;
  DeleteLocalStorageButton.disabled = false;
  ClearTableButton.disabled = false;
}
