import { NotifyDemoMode } from "../Actions/DemoMode";
import { Keys } from "../Constants/Keys";
import { InfoMessages, UserConfigurationMessages } from "../Constants/Messages";
import {
	deleteLocalStorageButton,
	downloadConfigurationButtonLayer,
	saveLocalStorageButton
} from "../Elements/Elements";
import { ImportDataEvents } from "../Elements/Events/ImportDataEvents";
import { InitializeScreenSizeToast } from "../Elements/Events/DisplayScreenSizeToast";
import {
	ElementStatesCompareSolversPage,
	ElementStatesPlotPage,
	ElementStatesTablePage
} from "../Elements/Events/ElementStatus";
import { GetUserConfiguration } from "../UserConfiguration/UserConfiguration";
import { ResetAppState, state } from "./AppState";
import { GetPageKind, PageKind } from "./CurrentPage";
import { ManageData } from "./ManageData";

/**
 * Sets the status of all buttons based on the kind of page that is shown.
 */
function SetElementStates(): void {
	switch (GetPageKind()) {
		case PageKind.TABLE:
			ElementStatesTablePage();
			break;
		case PageKind.COMPARE_SOLVERS:
			ElementStatesCompareSolversPage();
			break;
		case PageKind.PLOT:
			ElementStatesPlotPage();
			break;
	}
}

/**
 * Tries to retrieve stored configuration when arriving at
 * the page or refreshing the page. If data is found in local storage, the
 * unprocessedData and dataFileType are updated, the ImportDataEvents() function is
 * called with a success message, the "Delete Local Storage" and "Download
 * Configuration" buttons are enabled, and the ManageData() function is called.
 */
function RestoreStoredConfiguration(): void {
	try {
		[
			state.unprocessedData,
			state.dataFileType,
			state.defaultTime,
			state.gapLimit
		] = GetUserConfiguration();
		if (state.unprocessedData.length === 0) {
			throw new Error(UserConfigurationMessages.NO_STORED_CONFIG);
		}
		if (
			localStorage.getItem(Keys.DEMO_DATA) === "demo1" ||
			localStorage.getItem(Keys.DEMO_DATA) === "demo2"
		) {
			ImportDataEvents(
				InfoMessages.DEMO_MODE_MSG,
				"json",
				localStorage.getItem(Keys.DEMO_DATA) ?? undefined
			);
			NotifyDemoMode();
		} else {
			ImportDataEvents(InfoMessages.FOUND_STORED_CONFIG, "json");
		}
		saveLocalStorageButton.disabled = true;
		deleteLocalStorageButton.disabled = false;
		downloadConfigurationButtonLayer.disabled = false;
		sessionStorage.setItem(Keys.SAVED_STORAGE_NOTIFICATION, "true");
		ManageData();
	} catch (error) {
		console.info(UserConfigurationMessages.NO_STORED_CONFIG);
		console.warn("Warn: ", error);
	}
}

/**
 * Initializing the methods that are needed to run the system.
 * This occurs when the page is loaded, and again when the table is cleared.
 */
export function InitializeProgram(): void {
	ResetAppState();
	SetElementStates();

	/**
	 * Initializes the screen size toast and sets up the event listener for the screen size toast.
	 */
	InitializeScreenSizeToast();

	RestoreStoredConfiguration();
}
