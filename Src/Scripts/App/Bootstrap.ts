import { BodyFadeLoadingAnimation } from "../Elements/LoadingAnimation";
import { ClearDataTableModal } from "../Elements/Modals/ClearDataTableModal";
import { CreateConfigurationSettingsModal } from "../Elements/Modals/CustomizeDownloadModal";
import { CreateDeleteDataModal } from "../Elements/Modals/DeleteDataModal";
import { CreateFileFormatInformationModal } from "../Elements/Modals/InfoModal";
import { ReleaseVersionTag } from "../Elements/ReleaseVersionTag";
import { CreateScreenSizeToast } from "../Elements/Toasts/ScreenSizeToast";
import { RegisterServiceWorker } from "../PWA/PWA-utils";
import { RegisterGlobalListeners } from "./GlobalListeners";
import { InitializeProgram } from "./InitializeProgram";
import { GetPageKind, PageKind } from "./CurrentPage";
import { SetRestartHandler } from "./Lifecycle";

/**
 * Create modals.
 */
function CreateModals(): void {
	CreateFileFormatInformationModal();
	CreateConfigurationSettingsModal();
	CreateDeleteDataModal();
	if (GetPageKind() === PageKind.TABLE) {
		ClearDataTableModal();
	}
}

/**
 * Starts the application: creates the page components, initializes the program
 * and registers the listeners that live as long as the page.
 */
export function Bootstrap(): void {
	CreateModals();

	/**
	 * Toast component for screen size notification.
	 */
	CreateScreenSizeToast();

	/**
	 * Fetches and displays the latest release of the application.
	 */
	ReleaseVersionTag();

	/**
	 * Fade effect on all children of the body element, except for nav.
	 */
	BodyFadeLoadingAnimation();

	/**
	 * Register service worker for PWA offline support.
	 */
	RegisterServiceWorker();

	SetRestartHandler(InitializeProgram);
	InitializeProgram();
	RegisterGlobalListeners();
}
