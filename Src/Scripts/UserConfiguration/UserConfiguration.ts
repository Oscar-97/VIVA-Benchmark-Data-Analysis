import { Keys } from "../Constants/Keys";
import { UserConfigurationMessages } from "../Constants/Messages";
import {
	DisplayAlertNotification,
	DisplayWarningNotification,
	DisplayErrorNotification
} from "../Elements/Events/DisplayAlertNotification";
import {
	downloadConfigurationButton,
	downloadCustomConfigurationButton
} from "../Elements/Elements";
import { UserData } from "../Interfaces/Interfaces";

/**
 * This object is used to store the user configuration.
 */
export const userData: UserData = {
	dataSet: [],
	dataFileType: "",
	defaultTime: undefined,
	gapLimit: undefined
};

/**
 * This function creates a user configuration and stores it in the browser's local storage.
 *
 * @param {string[]} dataSet - An array of strings representing raw data to be saved.
 * @param {string} dataFileType - A string representing the type of data file.
 * @param {number} defaultTime - Default time used in the the absolute performance profile chart.
 * @param {number} gapLimit - Gap limit used in the the absolute performance profile chart.
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
	userData.dataSet = dataSet;
	userData.dataFileType = dataFileType;
	userData.defaultTime = defaultTime;
	userData.gapLimit = gapLimit;
	try {
		localStorage.setItem(Keys.USER_CONFIGURATION, JSON.stringify(userData));
	} catch (error) {
		switch (error.name) {
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
				DisplayErrorNotification("Error occured: " + error);
				break;
		}
	}
	DisplayAlertNotification(UserConfigurationMessages.STORE_SUCCESS);
}

/**
 * This function retrieves the user configuration from the browser's local storage.
 * The user is notified if no saved configuration was found and the flag is stored to the session storage.
 *
 * @throws This function may throw an error if it fails to parse the user configuration from the local storage.
 *
 * @returns An array that includes the raw data, data file type, default time, and gap limit.
 */
export function GetUserConfiguration(): [string[], string, number, number] {
	let userConfig: UserData;
	try {
		userConfig = JSON.parse(localStorage.getItem("UserConfiguration"));
	} catch (error) {
		switch (error.message) {
			case "SecurityError":
				DisplayErrorNotification(UserConfigurationMessages.SECURITY_ERROR);
				break;
			case UserConfigurationMessages.NO_STORED_CONFIG:
				if (sessionStorage.getItem(Keys.ALERTED_STORAGE)) {
					console.info(UserConfigurationMessages.PREVIOUSLY_VISITED);
				} else {
					DisplayWarningNotification(
						UserConfigurationMessages.NO_STORED_CONFIG
					);
					sessionStorage.setItem(Keys.ALERTED_STORAGE, "true");
				}
				break;
			default:
				DisplayErrorNotification(error);
				break;
		}
	}
	const unprocessedData = [];
	userConfig.dataSet.forEach((value) => {
		unprocessedData.push(value);
	});

	const dataFileType = userConfig.dataFileType;
	const defaultTime = userConfig.defaultTime;
	const gapLimit = userConfig.gapLimit;
	return [unprocessedData, dataFileType, defaultTime, gapLimit];
}

/**
 * This function deletes the user configuration from the browser's local storage.
 */
export function DeleteUserConfiguration(): void {
	try {
		localStorage.removeItem(Keys.USER_CONFIGURATION);
		localStorage.removeItem(Keys.DEMO_DATA);
	} catch (error) {
		switch (error.name) {
			case "SecurityError":
				DisplayErrorNotification(UserConfigurationMessages.SECURITY_ERROR);
				break;
			default:
				DisplayErrorNotification("Error occured: " + error);
				break;
		}
	}
	DisplayWarningNotification(UserConfigurationMessages.DELETED_CONFIG);
}

/**
 * This function downloads the user configuration saved in the local storage as a JSON file.
 * If there is no saved user configuration in the local storage, it will display an error notification.
 *
 * @remarks
 * The function assumes the existence of a previously defined `downloadConfigurationButton`
 * which should be a reference to an HTML anchor (`<a>`) element used to trigger the file download.
 */
export function DownloadUserConfiguration(): void {
	const userConfig = JSON.parse(localStorage.getItem(Keys.USER_CONFIGURATION));
	if (userConfig) {
		const downloadAbleFile = JSON.stringify(userConfig);
		const blob = new Blob([downloadAbleFile], { type: "application/json" });

		downloadConfigurationButton.href = window.URL.createObjectURL(blob);
		downloadConfigurationButton.download = "UserConfiguration.json";
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
 * @param {string[]} newRawData -  Array of strings, where each string is a comma-separated representation of a row of data.
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
	userData.dataSet = newRawData;
	userData.dataFileType = "json";
	userData.defaultTime = defaultTime;
	userData.gapLimit = gapLimit;

	const downloadAbleFile = JSON.stringify(userData);
	const blob = new Blob([downloadAbleFile], { type: "application/json" });

	downloadCustomConfigurationButton.href = window.URL.createObjectURL(blob);
	downloadCustomConfigurationButton.download = "UserConfiguration.json";
}
