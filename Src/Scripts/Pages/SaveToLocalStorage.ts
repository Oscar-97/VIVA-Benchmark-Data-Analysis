import { state } from "../App/AppState";
import {
	deleteLocalStorageButton,
	downloadConfigurationButtonLayer,
	saveLocalStorageButton
} from "../Elements/Elements";
import { Keys } from "../Constants/Keys";
import { CreateUserConfiguration } from "../UserConfiguration/UserConfiguration";

/**
 * Save to local storage when clicking on the "Save Data" button.
 * A freshly loaded .trc file is stored as json, as the stored data is converted to a trace file.
 *
 * @param {() => string[]} getRawData - Returns the raw data that should be stored when the button is clicked.
 */
export function RegisterSaveToLocalStorage(getRawData: () => string[]): void {
	saveLocalStorageButton.addEventListener("click", () => {
		if (state.dataFileType === "trc") {
			state.dataFileType = "json";
		}
		CreateUserConfiguration(getRawData(), state.dataFileType);
		deleteLocalStorageButton.disabled = false;
		downloadConfigurationButtonLayer.disabled = false;
		sessionStorage.setItem(Keys.ALERTED_STORAGE, "true");
	});
}
