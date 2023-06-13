import {
	ImportDataButton,
	SelectAllButton,
	FilterSelectionButton,
	ViewAllResultsButton,
	ViewPlotsButton,
	DeleteLocalStorageButton,
	SaveLocalStorageButton
} from "./Elements";
import { DisplayAlertNotification } from "./DisplayAlertNotification";

/**
 * Click on the upload data button to start the process.
 */
export function ImportDataEvents(
	Message: string,
	FileExtensionType?: string
): void {
	/**
	 * Remove existing Solvers and datatable after uploading a new result file.
	 * Set the file upload value to empty.
	 */
	try {
		document.querySelectorAll(".form-check").forEach((solver) => {
			solver.remove();
		});

		const TableElementWrapper = document.getElementById(
			"dataTableGenerated_wrapper"
		);
		if (TableElementWrapper) {
			TableElementWrapper.remove();
		}

		const TableElement = document.getElementById("dataTableGenerated");
		if (TableElement) {
			TableElement.remove();
		}
	} catch (err) {
		console.log(err);
	}

	/**
	 * Change the statuses of the buttons after uploading the data.
	 */
	if (document.title == "Report") {
		ViewAllResultsButton.disabled = false;
		SelectAllButton.disabled = false;
		SelectAllButton.innerText === "Select All Solvers";
		FilterSelectionButton.disabled = true;
		ImportDataButton.disabled = true;
		FilterSelectionButton.disabled = true;
		ImportDataButton.disabled = true;
		if (FileExtensionType === "json") {
			DeleteLocalStorageButton.disabled = false;
		}
	} else if (document.title != "Report") {
		ViewPlotsButton.disabled = false;
		SaveLocalStorageButton.disabled = false;
	}

	// Display alert with message.
	DisplayAlertNotification(Message);
}
