import {
	DisplayAlertNotification,
	DisplayWarningNotification,
	DisplayErrorNotification
} from "../Elements/DisplayAlertNotification";
import { downloadConfigurationButton } from "../Elements/Elements";

/**
 * UserData consists of dataset, file extension type and checked solvers.
 */
const userData = {
	dataSet: [],
	dataFileType: "",
	checkedSolvers: []
};

/**
 * Create the user configuration and store it to localStorage.
 */
export function CreateUserConfiguration(
	rawData: string[],
	dataFileType: string,
	checkedSolvers?: string[]
): void {
	userData.dataSet = rawData;
	userData.dataFileType = dataFileType;
	if (checkedSolvers) {
		userData.checkedSolvers = checkedSolvers;
	}
	localStorage.setItem("UserConfiguration", JSON.stringify(userData));
	DisplayAlertNotification("Saved configuration.");
}

/**
 * Get the user configuration from localStorage, item is called UserConfiguration.
 * @returns
 */
export function GetUserConfiguration(): [string[], string, string[]] {
	const userConfig = JSON.parse(localStorage.getItem("UserConfiguration"));
	const rawData = [];
	userConfig.dataSet.forEach((value: string[]) => {
		rawData.push(value);
	});

	const dataFileType: string = userConfig.dataFileType;

	const checkedSolvers = [];
	if (userConfig.checkedSolvers) {
		userConfig.checkedSolvers.forEach((value: string[]) => {
			checkedSolvers.push(value);
		});
	}

	console.log("RawData fron localStorage: ", rawData);
	console.log("FileType of saved data: ", dataFileType);
	console.log("Checked solvers: ", checkedSolvers);
	return [rawData, dataFileType, checkedSolvers];
}

/**
 * Delete the user configuration.
 */
export function DeleteUserConfiguration(): void {
	localStorage.removeItem("UserConfiguration");
	DisplayWarningNotification("Deleted configuration.");
}

/**
 * Download user configuration as a .json file. Can be uploaded as a result file.
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
