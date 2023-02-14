import { DisplayAlertNotification } from "../Elements/DisplayAlertNotification";

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
  DisplayAlertNotification("Deleted configuration.");
}
