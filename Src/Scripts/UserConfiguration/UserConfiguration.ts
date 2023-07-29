import {
	DisplayAlertNotification,
	DisplayWarningNotification,
	DisplayErrorNotification
} from "../Elements/DisplayAlertNotification";
import { downloadConfigurationButton } from "../Elements/Elements";

/**
 * UserData consists of dataset and file extension.
 */
const userData = {
	dataSet: [],
	dataFileType: ""
};

/**
 * This function creates a user configuration and stores it in the browser's local storage.
 *
 * @param rawData - An array of strings representing raw data to be saved.
 * @param dataFileType - A string representing the type of data file.
 *
 * @example
 * CreateUserConfiguration(["raw data 1", "raw data 2"], "trc");
 * // This will store the given raw data and data file type in the userData object, and then save the userData object in local storage.
 */
export function CreateUserConfiguration(
	rawData: string[],
	dataFileType: string
): void {
	userData.dataSet = rawData;
	userData.dataFileType = dataFileType;
	localStorage.setItem("UserConfiguration", JSON.stringify(userData));
	DisplayAlertNotification("Saved configuration.");
}

/**
 * This function retrieves the user configuration from the browser's local storage.
 *
 * @returns An array that includes the raw data and the data file type.
 *
 * @example
 * GetUserConfiguration();
 * // This will return an array that includes the raw data and the data file type from local storage.
 */
export function GetUserConfiguration(): [string[], string] {
	const userConfig = JSON.parse(localStorage.getItem("UserConfiguration"));
	const rawData = [];
	userConfig.dataSet.forEach((value: string[]) => {
		rawData.push(value);
	});

	const dataFileType: string = userConfig.dataFileType;

	console.log("RawData fron localStorage: ", rawData);
	console.log("FileType of saved data: ", dataFileType);
	return [rawData, dataFileType];
}

/**
 * This function deletes the user configuration from the browser's local storage.
 */
export function DeleteUserConfiguration(): void {
	localStorage.removeItem("UserConfiguration");
	DisplayWarningNotification("Deleted configuration.");
}

/**
 * This function downloads the user configuration saved in the local storage as a JSON file.
 * If there is no saved user configuration in the local storage, it will display an error notification.
 *
 * @remarks
 * The function assumes the existence of a global variable or a previously defined `downloadConfigurationButton`
 * which should be a reference to an HTML anchor (`<a>`) element used to trigger the file download.
 *
 * @example
 * DownloadUserConfiguration();
 * // This will initiate the download of the user configuration stored in local storage, if present.
 * // If no configuration is found, it will call DisplayErrorNotification function with the provided error message.
 */
export function DownloadUserConfiguration(): void {
	const userConfig = JSON.parse(localStorage.getItem("UserConfiguration"));
	if (userConfig) {
		const downloadAbleFile = JSON.stringify(userConfig);
		const blob = new Blob([downloadAbleFile], { type: "application/json" });

		downloadConfigurationButton.href = window.URL.createObjectURL(blob);
		downloadConfigurationButton.download = "UserConfiguration.json";
	} else {
		DisplayErrorNotification("No saved configuration found!");
	}
}
