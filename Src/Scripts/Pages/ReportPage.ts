import { RestartProgram } from "../App/Lifecycle";
import { ConvertToTraceFile } from "../DataProcessing/CreateData";
import {
	DestroyDataTable,
	DisplayDataTable
} from "../DataTable/DataTableWrapper";
import {
	GetFilteredRows,
	GetSelectedRows
} from "../DataTable/GetDataFromTable";
import { DisplayWarningNotification } from "../Elements/Events/DisplayAlertNotification";
import {
	clearDataTableButton,
	showSelectedRowsButton,
	viewTableButton
} from "../Elements/Elements";
import { TableLoadingAnimation } from "../Elements/LoadingAnimation";
import { TableMessages } from "../Constants/Messages";
import { TraceData } from "../Interfaces/Interfaces";
import { RegisterSaveToLocalStorage } from "./SaveToLocalStorage";

/**
 * This function manages the functionality of the buttons on the Report page of the application.
 *
 * @param {TraceData[]} traceData - Array of objects containing the result data.
 */
export function HandleReportPage(traceData: TraceData[]): void {
	/**
	 * Show the table when clicking on the "View Table" button.
	 */
	viewTableButton.addEventListener("click", () => {
		viewTableButton.disabled = true;
		TableLoadingAnimation();
		DisplayDataTable(traceData);
	});

	/**
	 * Shows the selected problems when clicking on the "View Selected Problems" button.
	 */
	showSelectedRowsButton.addEventListener("click", () => {
		showSelectedRowsButton.disabled = true;
		const traceDataFiltered = GetSelectedRows();

		if (traceDataFiltered.length === 0) {
			DisplayWarningNotification(TableMessages.TABLE_NO_ROWS);
			showSelectedRowsButton.disabled = false;
		} else {
			DisplayDataTable(traceDataFiltered);
		}
	});

	/**
	 * Save to local storage when clicking on the "Save Data" button.
	 * If the results have been filtered or if they have been selected,
	 * it remaps the object properties based on `ReversedTraceHeaderMap` before saving the data.
	 */
	RegisterSaveToLocalStorage(() => {
		return ConvertToTraceFile(GetFilteredRows());
	});

	/**
	 * Destroy the data table and reinitializes the program when clicking on "Clear Data Table".
	 */
	clearDataTableButton.addEventListener("click", () => {
		(
			document.getElementById("clearTableButtonInModal") as HTMLElement
		).addEventListener("click", () => {
			DisplayWarningNotification(TableMessages.TABLE_CLEARING);
			clearDataTableButton.disabled = true;
			setTimeout(() => {
				DestroyDataTable();
				RestartProgram();
			}, 5000);
		});
	});
}
