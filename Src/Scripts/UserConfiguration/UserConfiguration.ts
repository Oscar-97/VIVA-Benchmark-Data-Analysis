import {
  DisplayAlertNotification,
  DisplayWarningNotification,
  DisplayErrorNotification,
} from "../Elements/DisplayAlertNotification";
import { DownloadConfigurationButton } from "../Elements/Elements";

/**
 * UserData consists of dataset, file extension type and checked solvers.
 */
const UserData = {
  dataSet: [],
  dataFileType: "",
  checkedSolvers: [],
};

/**
 * Create the user configuration and store it to localStorage.
 */
export function CreateUserConfiguration(
  RawData: string[],
  DataFileType: string,
  CheckedSolvers: string[]
): void {
  UserData.dataSet = RawData;
  UserData.dataFileType = DataFileType;
  UserData.checkedSolvers = CheckedSolvers;
  localStorage.setItem("UserConfiguration", JSON.stringify(UserData));
  DisplayAlertNotification("Saved configuration.");
}

/**
 * Get the user configuration from localStorage, item is called UserConfiguration.
 * @returns 
 */
export function GetUserConfiguration(): [string[], string, string[]] {
  const UserConfig = JSON.parse(localStorage.getItem("UserConfiguration"));
  const RawData = [];
  UserConfig.dataSet.forEach((value: string[]) => {
    RawData.push(value);
  });
  
  const DataFileType: string = UserConfig.dataFileType;
  
  const CheckedSolvers = [];
  UserConfig.checkedSolvers.forEach((value: string[]) => {
    CheckedSolvers.push(value);
  });

  console.log("RawData fron localStorage: ", RawData);
  console.log("FileType of saved data: ", DataFileType);
  console.log("Checked solvers: ", CheckedSolvers);
  return [RawData, DataFileType, CheckedSolvers];
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
  const UserConfig = JSON.parse(localStorage.getItem("UserConfiguration"));
  if (UserConfig) {
    const DownloadAbleFile = JSON.stringify(UserConfig);
    const blob = new Blob([DownloadAbleFile], { type: "application/json" });

    DownloadConfigurationButton.href = window.URL.createObjectURL(blob);
    DownloadConfigurationButton.download = "UserConfiguration.json";
  } else {
    DisplayErrorNotification("No saved configuration found!");
  }
}
