import { Keys } from "../Constants/Keys";
import { UserConfigurationMessages } from "../Constants/Messages";
import {
	DisplayAlertNotification,
	DisplayWarningNotification,
	DisplayErrorNotification
} from "../Elements/Events/DisplayAlertNotification";
import { elements } from "../Elements/Elements";
import { StoredConfiguration, UserData } from "../Interfaces/Interfaces";
import {
	CONFIGURATION_VERSION,
	LinesToRows,
	UpgradeConfiguration
} from "./ConfigurationFormat";
import { ToStoredConfiguration } from "./StoredConfiguration";

/**
 * This object is used to store the user configuration.
 */
export const userData: UserData = {
	version: CONFIGURATION_VERSION,
	dataSet: [],
	dataFileType: "",
	defaultTime: undefined,
	gapLimit: undefined
};

/**
 * This function creates a user configuration and stores it in the browser's local storage.
 *
 * @param {string[]} dataSet - The lines of a trace file, which are saved as rows with the names of the columns.
 * @param {string} dataFileType - A string representing the type of data file.
 * @param {number} defaultTime - Default time used in the the performance profile chart.
 * @param {number} gapLimit - Gap limit used in the the performance profile chart.
 *
 * @throws This function may throw an error if it fails to store the user configuration in the local storage.
 *
 * @example
 * CreateUserConfiguration(["raw data 1", "raw data 2"], "trc", 1500, 0.01);
 */
export function CreateUserConfiguration(
	dataSet: string[],
	dataFileType: string,
	defaultTime?: number,
	gapLimit?: number
): void {
	userData.version = CONFIGURATION_VERSION;
	userData.dataSet = LinesToRows(dataSet);
	userData.dataFileType = dataFileType;
	userData.defaultTime = defaultTime;
	userData.gapLimit = gapLimit;
	try {
		localStorage.setItem(Keys.USER_CONFIGURATION, JSON.stringify(userData));
	} catch (error) {
		switch ((error as { name: string }).name) {
			case "QuotaExceededError":
				DisplayErrorNotification(UserConfigurationMessages.QUOTA_EXCEEDED);
				break;
			case "SecurityError":
				DisplayErrorNotification(UserConfigurationMessages.SECURITY_ERROR);
				break;
			case "InvalidAccessError":
				DisplayErrorNotification(UserConfigurationMessages.INVALID_ACCESS);
				break;
			default:
				DisplayErrorNotification("An error occurred: " + error);
				break;
		}
	}
	DisplayAlertNotification(UserConfigurationMessages.STORE_SUCCESS);
}

/**
 * Notifies the user that the stored configuration could not be read.
 * A missing configuration is only reported once per session, and not at all when `notifyMissing` is false.
 */
function NotifyConfigurationReadError(
	error: unknown,
	notifyMissing: boolean
): void {
	switch ((error as { message: string }).message) {
		case "SecurityError":
			DisplayErrorNotification(UserConfigurationMessages.SECURITY_ERROR);
			break;
		case UserConfigurationMessages.NO_STORED_CONFIG:
			if (!notifyMissing || sessionStorage.getItem(Keys.ALERTED_STORAGE)) {
				console.info(UserConfigurationMessages.PREVIOUSLY_VISITED);
			} else {
				DisplayWarningNotification(UserConfigurationMessages.NO_STORED_CONFIG);
				sessionStorage.setItem(Keys.ALERTED_STORAGE, "true");
			}
			break;
		default:
			DisplayErrorNotification(String(error));
			break;
	}
}

/**
 * This function retrieves the user configuration from the browser's local storage.
 * The user is notified if no saved configuration was found and the flag is stored to the session storage.
 *
 * @param notifyMissing - Whether a missing configuration is reported. A visitor who has not saved anything yet
 * has nothing to report on arriving at the page, so the start of the application passes false.

 * @returns The raw data, data file type, default time and gap limit,
 * or undefined if there is no stored configuration with data in it.
 */
export function GetUserConfiguration(
	notifyMissing = true
): StoredConfiguration | undefined {
	let userConfig: UserData;
	try {
		const userConfigString = localStorage.getItem(Keys.USER_CONFIGURATION);
		if (!userConfigString) {
			throw new Error(UserConfigurationMessages.NO_STORED_CONFIG);
		}
		userConfig = JSON.parse(userConfigString);
	} catch (error) {
		NotifyConfigurationReadError(error, notifyMissing);
		return undefined;
	}

	return ToStoredConfiguration(userConfig);
}

/**
 * This function puts the removed user configuration back into the browser's local storage.
 *
 * @param removed - The keys and values that were removed.
 * @param onRestore - Called when the data is back.
 */
function RestoreUserConfiguration(
	removed: [string, string][],
	onRestore?: () => void
): void {
	try {
		for (const [key, value] of removed) {
			localStorage.setItem(key, value);
		}
	} catch (error) {
		DisplayErrorNotification("An error occurred: " + error);
		return;
	}
	onRestore?.();
	DisplayAlertNotification(UserConfigurationMessages.RESTORED_CONFIG);
}

/**
 * This function deletes the user configuration from the browser's local storage.
 * The notification offers to undo the removal.
 *
 * @param onRestore - Called when the removal is undone.
 */
export function DeleteUserConfiguration(onRestore?: () => void): void {
	const removed: [string, string][] = [];
	try {
		for (const key of [Keys.USER_CONFIGURATION, Keys.DEMO_DATA]) {
			const value = localStorage.getItem(key);
			if (value !== null) {
				removed.push([key, value]);
			}
			localStorage.removeItem(key);
		}
	} catch (error) {
		removed.length = 0;
		switch ((error as { name: string }).name) {
			case "SecurityError":
				DisplayErrorNotification(UserConfigurationMessages.SECURITY_ERROR);
				break;
			default:
				DisplayErrorNotification("An error occurred: " + error);
				break;
		}
	}
	if (removed.length === 0) {
		DisplayWarningNotification(UserConfigurationMessages.DELETED_CONFIG);
		return;
	}
	DisplayWarningNotification(UserConfigurationMessages.DELETED_CONFIG, {
		label: "Undo",
		onClick: () => RestoreUserConfiguration(removed, onRestore)
	});
}

/**
 * This function downloads the user configuration saved in the local storage as a JSON file.
 * If there is no saved user configuration in the local storage, it will display an error notification.
 * A configuration that was saved in an earlier format is downloaded in the current format.
 *
 * @remarks
 * The function assumes the existence of a previously defined `downloadConfigurationButton`
 * which should be a reference to an HTML anchor (`<a>`) element used to trigger the file download.
 */
export function DownloadUserConfiguration(): void {
	const userConfigString = localStorage?.getItem(Keys.USER_CONFIGURATION);
	const userConfig = userConfigString
		? UpgradeConfiguration(JSON.parse(userConfigString))
		: undefined;
	if (userConfig) {
		const downloadAbleFile = JSON.stringify(userConfig);
		const blob = new Blob([downloadAbleFile], { type: "application/json" });

		elements.downloadConfigurationButton.href =
			window.URL.createObjectURL(blob);
		elements.downloadConfigurationButton.download = "UserConfiguration.json";
	} else {
		DisplayErrorNotification(UserConfigurationMessages.NO_STORED_CONFIG);
	}
}

/**
 * This function downloads a customized user configuration as a JSON file.
 *
 * @remarks
 * The function assumes the existence of a previously defined `downloadCustomConfigurationButton`
 * which should be a reference to an HTML anchor (`<a>`) element used to trigger the file download.
 *
 * @param {string[]} newRawData - The lines of a trace file, which are saved as rows with the names of the columns.
 * @param {number} defaultTime - Default time that will be used on all results with missing SolverTime or with a failed status.
 *
 * @example
 * DownloadCustomizedUserConfiguration(traceData, 1200, 0.02;
 */
export function DownloadCustomizedUserConfiguration(
	newRawData: string[],
	defaultTime: number,
	gapLimit: number
): void {
	userData.version = CONFIGURATION_VERSION;
	userData.dataSet = LinesToRows(newRawData);
	userData.dataFileType = "json";
	userData.defaultTime = defaultTime;
	userData.gapLimit = gapLimit;

	const downloadAbleFile = JSON.stringify(userData);
	const blob = new Blob([downloadAbleFile], { type: "application/json" });

	if (elements.downloadCustomConfigurationButton) {
		elements.downloadCustomConfigurationButton.href =
			window.URL.createObjectURL(blob);
		elements.downloadCustomConfigurationButton.download =
			"UserConfiguration.json";
	}
}
