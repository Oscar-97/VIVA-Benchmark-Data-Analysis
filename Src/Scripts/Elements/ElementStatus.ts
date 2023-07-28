import {
	fileInput,
	importDataButton,
	viewAllResultsButton,
	filterSelectionButton,
	selectAllButton,
	saveLocalStorageButton,
	downloadConfigurationButtonLayer,
	downloadCSVButtonLayer,
	deleteLocalStorageButton,
	clearTableButton,
	viewPlotsButton,
	solverAndProblemsHeader,
	loaderContainer,
	dataTable
} from "./Elements";

/**
 * Input values and button statuses when arriving/reloading to the table page.
 */
export function ElementStatus(): void {
	loaderContainer.innerHTML = "";
	dataTable.style.visibility = "hidden";
	fileInput.value = "";
	importDataButton.disabled = true;
	viewAllResultsButton.disabled = true;
	filterSelectionButton.disabled = true;
	selectAllButton.disabled = true;
	selectAllButton.hidden = true;
	selectAllButton.innerText = "Select All Solvers";
	saveLocalStorageButton.disabled = true;
	downloadCSVButtonLayer.disabled = true;
	downloadConfigurationButtonLayer.disabled = true;
	deleteLocalStorageButton.disabled = true;
	clearTableButton.disabled = true;
	solverAndProblemsHeader.hidden = true;
	try {
		const filterCheckboxesContainer =
			document.getElementById("checkboxContainer");
		filterCheckboxesContainer.remove();
	} catch (err) {
		console.log("Could not remove solver checkboxes: ", err);
	}
}

/**
 * Input values and button statuses when arriving/reloading to the plot page.
 */
export function ElementStatusPlots(): void {
	fileInput.value = "";
	viewPlotsButton.disabled = true;
	saveLocalStorageButton.disabled = true;
	downloadConfigurationButtonLayer.disabled = true;
	deleteLocalStorageButton.disabled = true;
}

/**
 * Button statuses when the table is displayed.
 */
export function ElementStatusWithTable(): void {
	selectAllButton.disabled = false;
	filterSelectionButton.disabled = false;
	saveLocalStorageButton.disabled = false;
	downloadConfigurationButtonLayer.disabled = false;
	downloadCSVButtonLayer.disabled = false;
	deleteLocalStorageButton.disabled = false;
	clearTableButton.disabled = false;
}
