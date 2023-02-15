import {
  DisplayAlertNotification,
  DisplayWarningNotification,
  DisplayErrorNotification,
} from "../Elements/DisplayAlertNotification";
import { DownloadConfigurationButton } from "../Elements/Elements";

const UserData = {
  dataSet: [],
  fileExtensionType: "",
};

export function CreateUserConfiguration(
  RawData: string[],
  FileExtensionType: string
): void {
  UserData.dataSet = RawData;
  UserData.fileExtensionType = FileExtensionType;
  localStorage.setItem("UserConfiguration", JSON.stringify(UserData));
  DisplayAlertNotification("Saved configuration.");
}

export function GetUserConfiguration(): [string[], string] {
  const UserConfig = JSON.parse(localStorage.getItem("UserConfiguration"));
  const RawData = [];
  UserConfig.dataSet.forEach((value: string[]) => {
    RawData.push(value);
  });
  const FileExtensionType: string = UserConfig.fileExtensionType;
  console.log("RawData fron localStorage: ", RawData);
  console.log("FileType of saved data: ", FileExtensionType);
  return [RawData, FileExtensionType];
}

export function DeleteUserConfiguration(): void {
  localStorage.removeItem("UserConfiguration");
  DisplayWarningNotification("Deleted configuration.");
}

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
