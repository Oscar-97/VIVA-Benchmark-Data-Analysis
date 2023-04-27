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
  SolverAndProblemsHeader,
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
  SelectAllButton.innerText = "Select All Solvers";
  SaveLocalStorageButton.disabled = true;
  DownloadCSVButtonLayer.disabled = true;
  DownloadConfigurationButtonLayer.disabled = true;
  DeleteLocalStorageButton.disabled = true;
  ClearTableButton.disabled = true;
  SolverAndProblemsHeader.hidden = true;
  try {
    const FilterCheckboxesContainer =
      document.getElementById("checkboxContainer");
    FilterCheckboxesContainer.remove();
  } catch (err) {
    console.log("Could not remove solver checkboxes: ", err);
  }
}

/**
 * Input values and button statuses when arriving/reloading to the plot page.
 */
export function ElementStatusPlots(): void {
  FileInput.value = "";
  ViewPlotsButton.disabled = true;
  DeleteLocalStorageButton.disabled = true;
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
