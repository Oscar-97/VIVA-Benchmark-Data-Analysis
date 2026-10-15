import { NotifyDemoMode } from "../Actions/DemoMode";
import { Keys } from "../Constants/Keys";
import { InfoMessages, UserConfigurationMessages } from "../Constants/Messages";
import { elements } from "../Elements/Elements";
import { SetEmptyStateVisible } from "../Elements/EmptyState";
import { ClearLoadStatus } from "../Elements/LoadStatus";
import { ImportDataEvents } from "../Elements/Events/ImportDataEvents";
import { InitializeScreenSizeToast } from "../Elements/Events/DisplayScreenSizeToast";
import {
	ElementStatesCompareSolversPage,
	ElementStatesPlotPage,
	ElementStatesTablePage
} from "../Elements/Events/ElementStatus";
import { GetUserConfiguration } from "../UserConfiguration/UserConfiguration";
import { ApplyStoredConfiguration, ResetAppState } from "./AppState";
import { GetPageKind, PageKind } from "./CurrentPage";
import { ManageData } from "./ManageData";
import { ResetPageListeners } from "./PageListeners";

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
	const config = GetUserConfiguration(false);
	if (!config) {
		console.info(UserConfigurationMessages.NO_STORED_CONFIG);
		return;
	}
	ApplyStoredConfiguration(config);

	try {
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
		elements.saveLocalStorageButton.disabled = true;
		elements.deleteLocalStorageButton.disabled = false;
		elements.downloadConfigurationButtonLayer.disabled = false;
		sessionStorage.setItem(Keys.SAVED_STORAGE_NOTIFICATION, "true");
		ManageData();
	} catch (error) {
		console.error("Could not restore the stored configuration: ", error);
	}
}

/**
 * Initializing the methods that are needed to run the system.
 * This occurs when the page is loaded, and again when the table is cleared.
 */
export function InitializeProgram(): void {
	ResetPageListeners();
	ResetAppState();
	SetElementStates();
	SetEmptyStateVisible(true);
	ClearLoadStatus();

	/**
	 * Initializes the screen size toast and sets up the event listener for the screen size toast.
	 */
	InitializeScreenSizeToast();

	RestoreStoredConfiguration();
}
