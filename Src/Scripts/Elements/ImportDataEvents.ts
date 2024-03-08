import {
	librarySelector,
	importDataButton,
	showSelectedRowsButton,
	viewTableButton,
	viewPlotsButton,
	deleteLocalStorageButton,
	saveLocalStorageButton,
	solverSelector,
	dataTableGeneratedWrapper,
	dataTableGenerated,
	compareSolversButton
} from "./Elements";
import { DisplayAlertNotification } from "./DisplayAlertNotification";
import { Keys } from "../Constants/Keys";
import { PageTitles } from "../Constants/PageTitles";

/**
 * This function handles events after a data import action. It removes existing data tables or charts and
 * adjusts the status of various interactive buttons based on the current page title and
 * the type of file extension of the imported data.
 *
 * @param {string} message - Message to be displayed as an alert notification after the data import.
 * @param {string} fileExtensionType - The file extension of the imported data (optional).
 *
 * @throws
 * This function may throw an error if it fails to remove the existing data tables.
 *
 * @example
 * ImportDataEvents("Loaded json file!", "json");
 */
export function ImportDataEvents(
	message: string,
	fileExtensionType?: string
): void {
	try {
		if (dataTableGeneratedWrapper) {
			dataTableGeneratedWrapper.remove();
		}

		if (dataTableGenerated) {
			dataTableGenerated.remove();
		}
	} catch (err) {
		console.error("Could not remove elements: ", err);
	}
	librarySelector.disabled = true;
	if (document.title === PageTitles.TABLE) {
		viewTableButton.disabled = false;
		showSelectedRowsButton.disabled = true;
		importDataButton.disabled = true;
		showSelectedRowsButton.disabled = true;
		if (fileExtensionType === "json") {
			deleteLocalStorageButton.disabled = false;
		}
	} else if (document.title === PageTitles.COMPARE_SOLVERS) {
		compareSolversButton.disabled = false;
		importDataButton.disabled = true;
		saveLocalStorageButton.disabled = true;
		if (fileExtensionType === "json") {
			deleteLocalStorageButton.disabled = false;
		}
	} else {
		viewPlotsButton.disabled = false;
		importDataButton.disabled = true;
		saveLocalStorageButton.disabled = true;
		if (fileExtensionType === "json") {
			deleteLocalStorageButton.disabled = false;
		}
	}

	if (!sessionStorage.getItem(Keys.SAVED_STORAGE_NOTIFICATION)) {
		DisplayAlertNotification(message);
	}
}

/**
 * This function fills the selector list with solvers from the currently loaded results.
 * @param {object[]} traceData - Array of objects containing the result data.
 */
export function FillSolverSelectorList(traceData: object[]): void {
	solverSelector.innerHTML = "";
	let isSelectedSet = false;

	const uniqueSolvers = traceData
		.map((solver) => {
			return solver["SolverName"];
		})
		.filter((solverName, index, self) => {
			return self.indexOf(solverName) === index;
		});

	uniqueSolvers.forEach((solver: string) => {
		const option = document.createElement("option");
		option.value = solver;
		option.textContent = solver;

		if (!isSelectedSet) {
			option.selected = true;
			isSelectedSet = true;
		}

		solverSelector.appendChild(option);
	});
}
