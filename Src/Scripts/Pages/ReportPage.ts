import { RestartProgram } from "../App/Lifecycle";
import { Listen } from "../App/PageListeners";
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
import { elements } from "../Elements/Elements";
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
	Listen(elements.viewTableButton, "click", () => {
		elements.viewTableButton.disabled = true;
		TableLoadingAnimation();
		DisplayDataTable(traceData);
	});

	/**
	 * Shows the selected problems when clicking on the "View Selected Problems" button.
	 */
	Listen(elements.showSelectedRowsButton, "click", () => {
		elements.showSelectedRowsButton.disabled = true;
		const traceDataFiltered = GetSelectedRows();

		if (traceDataFiltered.length === 0) {
			DisplayWarningNotification(TableMessages.TABLE_NO_ROWS);
			elements.showSelectedRowsButton.disabled = false;
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
	 * Destroy the data table and reinitializes the program when confirming in the "Clear Data Table" modal.
	 */
	Listen(document.getElementById("clearTableButtonInModal"), "click", () => {
		DisplayWarningNotification(TableMessages.TABLE_CLEARING);
		elements.clearDataTableButton.disabled = true;
		setTimeout(() => {
			DestroyDataTable();
			RestartProgram();
		}, 5000);
	});
}
