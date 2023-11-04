import {
	DisplayAlertNotification,
	DisplayWarningNotification,
	DisplayErrorNotification
} from "../Elements/DisplayAlertNotification";
import {
	downloadConfigurationButton,
	downloadCustomConfigurationButton
} from "../Elements/Elements";

/**
 * UserData consists of dataset and file extension.
 */
interface UserData {
	dataSet: string[] | object[];
	dataFileType: string;
	defaultTime?: number | undefined;
}

export const userData: UserData = {
	dataSet: [],
	dataFileType: "",
	defaultTime: undefined
};

/**
 * This function creates a user configuration and stores it in the browser's local storage.
 *
 * @param dataSet - An array of strings representing raw data to be saved.
 * @param dataFileType - A string representing the type of data file.
 * @param defaultTime - Default time used in the the absolute performance profile chart.
 *
 * @example
 * CreateUserConfiguration(["raw data 1", "raw data 2"], "trc");
 * // This will store the given raw data and data file type in the userData object, and then save the userData object in local storage.
 */
export function CreateUserConfiguration(
	dataSet: string[],
	dataFileType: string,
	defaultTime?: number
): void {
	userData.dataSet = dataSet;
	userData.dataFileType = dataFileType;
	userData.defaultTime = defaultTime;
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
export function GetUserConfiguration(): [string[], string, number] {
	let userConfig: UserData;
	try {
		userConfig = JSON.parse(localStorage.getItem("UserConfiguration"));
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
	return [unprocessedData, dataFileType, defaultTime];
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

/**
 * This function downloads a customized user configuration as a JSON file.
 *
 * @remarks
 * The function assumes the existence of a global variable or a previously defined `downloadCustomConfigurationButton`
 * which should be a reference to an HTML anchor (`<a>`) element used to trigger the file download.
 *
 * @param traceData - Array of objects, where each object represents a row of data.
 * @param selectedValues - Array or string of selected solvers.
 * @param defaultTime  - Default time that will be used on all results with missing SolverTime or with a failed status.
 *
 * @example
 * DownloadCustomizedUserConfiguration(traceData, selectedSolvers, Number(defaultTimeInput.textContent));
 * This will initiate the download of a customized user configuration.
 */
export function DownloadCustomizedUserConfiguration(
	traceData: string[],
	defaultTime: number
): void {
	userData.dataSet = traceData;
	userData.dataFileType = "json";
	userData.defaultTime = defaultTime;

	const downloadAbleFile = JSON.stringify(userData);
	const blob = new Blob([downloadAbleFile], { type: "application/json" });

	downloadCustomConfigurationButton.href = window.URL.createObjectURL(blob);
	downloadCustomConfigurationButton.download = "UserConfiguration.json";
}
