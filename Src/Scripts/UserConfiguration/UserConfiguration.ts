import {
	DisplayAlertNotification,
	DisplayWarningNotification,
	DisplayErrorNotification
} from "../Elements/DisplayAlertNotification";
import { downloadConfigurationButton } from "../Elements/Elements";

/**
 * UserData consists of dataset and file extension.
 */
export const userData = {
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
	try {
		localStorage.setItem("UserConfiguration", JSON.stringify(userData));
	} catch (error) {
		switch (error.name) {
			case "QuotaExceededError":
				DisplayErrorNotification("Local storage is full. Please clear.");
				break;
			case "SecurityError":
				DisplayErrorNotification(
					"Local storage is disabled. Please enable it in your browser settings."
				);
				break;
			case "InvalidAccessError":
				DisplayErrorNotification(
					"Local storage cannot be accessed. Please try again."
				);
				break;
			default:
				DisplayErrorNotification("Error occured: " + error);
				break;
		}
	}
	DisplayAlertNotification("Saved configuration.");
}

/**
 * This function retrieves the user configuration from the browser's local storage.
 * The user is notified if no saved configuration was found and the flag is stored to the session storage.
 *
 * @returns An array that includes the raw data and the data file type.
 *
 * @example
 * GetUserConfiguration();
 * // This will return an array that includes the raw data and the data file type from local storage.
 */
export function GetUserConfiguration(): [string[], string] {
	let userConfig: { dataSet: string[][]; dataFileType: string };
	try {
		userConfig = JSON.parse(localStorage.getItem("UserConfiguration"));
		if (
			!userConfig ||
			!userConfig.dataSet ||
			!Array.isArray(userConfig.dataSet)
		) {
			throw new Error("No saved configuration data found.");
		}
	} catch (error) {
		switch (error.message) {
			case "SecurityError":
				DisplayErrorNotification(
					"Local storage is disabled. Please enable it in your browser settings."
				);
				break;
			case "No saved configuration data found.":
				if (sessionStorage.getItem("alertedStorage")) {
					console.log(
						"User has previously visited this page in this session/tab."
					);
				} else {
					DisplayWarningNotification("No saved configuration data found.");
					sessionStorage.setItem("alertedStorage", "true");
				}
				break;
			default:
				DisplayErrorNotification("Error occured: " + error);
				break;
		}
	}
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
	try {
		localStorage.removeItem("UserConfiguration");
	} catch (error) {
		switch (error.name) {
			case "SecurityError":
				DisplayErrorNotification(
					"Local storage is disabled. Please enable it in your browser settings."
				);
				break;
			default:
				DisplayErrorNotification("Error occured: " + error);
				break;
		}
	}
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
