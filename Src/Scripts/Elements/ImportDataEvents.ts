import {
	importDataButton,
	selectAllButton,
	filterSelectionButton,
	viewAllResultsButton,
	viewPlotsButton,
	deleteLocalStorageButton,
	saveLocalStorageButton
} from "./Elements";
import { DisplayAlertNotification } from "./DisplayAlertNotification";

/**
 * Click on the upload data button to start the process.
 */
export function ImportDataEvents(
	message: string,
	fileExtensionType?: string
): void {
	/**
	 * Remove existing Solvers and datatable after uploading a new result file.
	 * Set the file upload value to empty.
	 */
	try {
		document.querySelectorAll(".form-check").forEach((solver) => {
			solver.remove();
		});

		const tableElementWrapper = document.getElementById(
			"dataTableGenerated_wrapper"
		);
		if (tableElementWrapper) {
			tableElementWrapper.remove();
		}

		const tableElement = document.getElementById("dataTableGenerated");
		if (tableElement) {
			tableElement.remove();
		}
	} catch (err) {
		console.log("Could not remove elements: ", err);
	}

	/**
	 * Change the statuses of the buttons after uploading the data.
	 */
	if (document.title == "Report") {
		viewAllResultsButton.disabled = false;
		selectAllButton.disabled = false;
		selectAllButton.innerText === "Select All Solvers";
		filterSelectionButton.disabled = true;
		importDataButton.disabled = true;
		filterSelectionButton.disabled = true;
		importDataButton.disabled = true;
		if (fileExtensionType === "json") {
			deleteLocalStorageButton.disabled = false;
		}
	} else if (document.title != "Report") {
		viewPlotsButton.disabled = false;
		saveLocalStorageButton.disabled = false;
	}

	DisplayAlertNotification(message);
}
