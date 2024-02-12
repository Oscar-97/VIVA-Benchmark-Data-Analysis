import {
	librarySelector,
	importDataButton,
	showSelectedRowsButton,
	viewTableButton,
	viewPlotsButton,
	deleteLocalStorageButton,
	saveLocalStorageButton,
	solverSelector
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
		console.error("Could not remove elements: ", err);
	}
	librarySelector.disabled = true;
	if (document.title === "Report") {
		viewTableButton.disabled = false;
		showSelectedRowsButton.disabled = true;
		importDataButton.disabled = true;
		showSelectedRowsButton.disabled = true;
		if (fileExtensionType === "json") {
			deleteLocalStorageButton.disabled = false;
		}
	} else if (document.title !== "Report") {
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

/**
 * Fills the selector list with solvers from the currently loaded results.
 * @param traceData - Array of objects, where each object represents a row of data.
 */
export function FillSolverSelectorList(traceData: object[]): void {
	solverSelector.innerHTML = "";
	let isSelectedSet = false;

	const uniqueSolvers = traceData
		.map((solver) => {
			return solver["SolverName"];
		}) // First, extract all usernames
		.filter((solverName, index, self) => {
			return self.indexOf(solverName) === index;
		}); // Then filter out duplicates

	uniqueSolvers.forEach((solver: string) => {
		const option = document.createElement("option");
		option.value = solver; // Assuming the value is also the UserName
		option.textContent = solver;

		if (!isSelectedSet) {
			option.selected = true;
			isSelectedSet = true; // Ensure only the first option is set as selected
		}

		solverSelector.appendChild(option);
	});
}
