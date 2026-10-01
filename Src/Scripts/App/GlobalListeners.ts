import { ActivateDemoMode } from "../Actions/DemoMode";
import { Keys } from "../Constants/Keys";
import { InfoMessages } from "../Constants/Messages";
import { GetDataFileType, ReadData } from "../DataProcessing/ReadData";
import {
	demoDataButton,
	fileInput,
	importDataButton
} from "../Elements/Elements";
import { ImportDataEvents } from "../Elements/Events/ImportDataEvents";
import { RequestPWANotificationPermission } from "../PWA/PWA-utils";
import { state } from "./AppState";
import { GetPageKind, PageKind } from "./CurrentPage";
import { ManageData } from "./ManageData";

/**
 * Registers the event listeners for importing data and starting the demo mode.
 * The listeners read the shared state when they run, so they are registered once
 * and keep working after the program has been initialized again.
 *
 * Arguably the actions sequence of the events below is not correct, as the "load" button actually acts as a confirm button.
 */
export function RegisterGlobalListeners(): void {
	/**
	 * Adds an event listener to the file input field that sets the dataFileType
	 * variable and reads data into the unprocessedData, unprocessedInstanceInformationData, and unprocessedSolutionData
	 * arrays whenever the value of the file input field changes.
	 */
	fileInput.addEventListener("change", () => {
		state.dataFileType = GetDataFileType();
		ReadData(
			state.unprocessedData,
			state.unprocessedInstanceInformationData,
			state.unprocessedSolutionData
		);
	});

	/**
	 * Adds an event listener to the "Import Data" button that calls the
	 * ImportDataEvents() function with a success message containing the list of files loaded
	 * and the ManageData() function whenever the button is clicked.
	 *
	 * It also requests permission for push notifications.
	 */
	importDataButton.addEventListener("click", () => {
		sessionStorage.removeItem(Keys.SAVED_STORAGE_NOTIFICATION);
		const fileNames = fileInput.files
			? Array.from(fileInput.files)
					.map((file) => {
						return file.name;
					})
					.join(", ")
			: "";
		ImportDataEvents(InfoMessages.LOADED_FILES.concat(fileNames));
		ManageData();
		RequestPWANotificationPermission();
	});

	/**
	 * Adds an event listener to the "Demo-Mode" button that loads a demo data set and savet it to local storage.
	 */
	if (GetPageKind() === PageKind.TABLE) {
		demoDataButton.addEventListener("click", () => {
			ActivateDemoMode();
		});
	}
}
