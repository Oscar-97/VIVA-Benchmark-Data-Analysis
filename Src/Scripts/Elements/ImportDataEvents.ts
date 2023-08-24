import {
	importDataButton,
	filterSelectionButton,
	viewTableButton,
	viewPlotsButton,
	deleteLocalStorageButton,
	saveLocalStorageButton
} from "./Elements";
import { DisplayAlertNotification } from "./DisplayAlertNotification";

/**
 * Handles events after a data import action. The function removes existing data tables and
 * adjusts the status of various interactive buttons based on the current page title and
 * the type of file extension of the imported data.
 *
 * @param message - Message to be displayed as an alert notification after the data import.
 * @param fileExtensionType - The file extension of the imported data (optional).
 *
 * @remarks
 *
 * This function should be invoked after a user imports data to the application, typically via
 * an 'upload data' button. It is designed to:
 *
 * 1. Remove any existing data tables displayed on the page.
 * 2. Enable or disable certain interactive buttons based on the title of the document
 *    (assumed to represent the current page of the application) and the type of file extension
 *    of the imported data.
 * 3. Display an alert notification message.
 *
 * @throws
 * This function may throw an error if it fails to remove the existing data tables.
 *
 * @example
 * ImportDataEvents("Data imported successfully!", ".csv"); // Example usage of ImportDataEvents function
 */
export function ImportDataEvents(
	message: string,
	fileExtensionType?: string
): void {
	try {
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

	if (document.title == "Report") {
		viewTableButton.disabled = false;
		filterSelectionButton.disabled = true;
		importDataButton.disabled = true;
		filterSelectionButton.disabled = true;
		if (fileExtensionType === "json") {
			deleteLocalStorageButton.disabled = false;
		}
	} else if (document.title != "Report") {
		viewPlotsButton.disabled = false;
		importDataButton.disabled = true;
		saveLocalStorageButton.disabled = true;
		if (fileExtensionType === "json") {
			deleteLocalStorageButton.disabled = false;
		}
	}

	if (!sessionStorage.getItem("savedStorageNotification")) {
		DisplayAlertNotification(message);
	}
}
