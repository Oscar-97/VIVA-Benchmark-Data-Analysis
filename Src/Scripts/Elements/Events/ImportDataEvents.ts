import { elements } from "../Elements";
import { DisplayAlertNotification } from "./DisplayAlertNotification";
import { Keys } from "../../Constants/Keys";
import { PageTitles } from "../../Constants/PageTitles";
import { TraceData } from "../../Interfaces/Interfaces";

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
	fileExtensionType?: string,
	demoModeName?: string
): void {
	elements.librarySelector.disabled = true;
	if (document.title === PageTitles.TABLE) {
		TablePageElements(fileExtensionType, demoModeName);
	} else if (document.title === PageTitles.COMPARE_SOLVERS) {
		CompareSolversPageElements(fileExtensionType);
	} else {
		PlotPagesElements(fileExtensionType);
	}

	if (!sessionStorage.getItem(Keys.SAVED_STORAGE_NOTIFICATION)) {
		DisplayAlertNotification(message);
	}
}

/**
 * Manage the elements on the table page after data import.
 */
function TablePageElements(
	fileExtensionType?: string,
	demoModeName?: string
): void {
	try {
		if (elements.dataTableGeneratedWrapper) {
			elements.dataTableGeneratedWrapper.remove();
		}

		if (elements.dataTableGenerated) {
			elements.dataTableGenerated.remove();
		}
	} catch (err) {
		console.error("Could not remove elements: ", err);
	}

	if (demoModeName === "demo1") {
		elements.demoDataSelector.value = "Demo_1";
	}

	if (demoModeName === "demo2") {
		elements.demoDataSelector.value = "Demo_2";
	}
	elements.viewTableButton.disabled = false;
	elements.showSelectedRowsButton.disabled = true;
	elements.importDataButton.disabled = true;
	elements.showSelectedRowsButton.disabled = true;
	if (fileExtensionType === "json") {
		elements.deleteLocalStorageButton.disabled = false;
	}
}

/**
 * Manage the elements on the compare solvers page after data import.
 * @param fileExtensionType
 */
function CompareSolversPageElements(fileExtensionType?: string): void {
	elements.compareSolversButton.disabled = false;
	elements.importDataButton.disabled = true;
	elements.saveLocalStorageButton.disabled = true;
	if (fileExtensionType === "json") {
		elements.deleteLocalStorageButton.disabled = false;
	}
}

/**
 *  Manage the elements on the plot pages after data import.
 */
function PlotPagesElements(fileExtensionType: string | undefined): void {
	elements.viewPlotsButton.disabled = false;
	elements.importDataButton.disabled = true;
	elements.saveLocalStorageButton.disabled = true;
	if (fileExtensionType === "json") {
		elements.deleteLocalStorageButton.disabled = false;
	}
}

/**
 * This function fills the selector list with solvers from the currently loaded results.
 * @param {TraceData[]} traceData - Array of objects containing the result data.
 */
export function FillSolverSelectorList(traceData: TraceData[]): void {
	const solverSelector = document.getElementById("solverSelector");
	if (solverSelector) {
		solverSelector.innerHTML = "";
	}
	let isSelectedSet = false;

	const uniqueSolvers = traceData
		.map((solver) => {
			return solver["SolverName"];
		})
		.filter((solverName, index, self) => {
			return self.indexOf(solverName) === index;
		});

	uniqueSolvers
		.filter((solver): solver is string => solver !== undefined)
		.forEach((solver: string) => {
			const option = document.createElement("option");
			option.value = solver;
			option.textContent = solver;

			if (!isSelectedSet) {
				option.selected = true;
				isSelectedSet = true;
			}

			const solverSelectorElement = document.getElementById("solverSelector");
			if (solverSelectorElement) {
				solverSelectorElement.appendChild(option);
			}
		});
}
