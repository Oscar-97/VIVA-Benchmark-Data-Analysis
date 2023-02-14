import { DisplayAlertNotification } from "../Elements/DisplayAlertNotification";

export function GetInstanceInformation(
  RawInstanceInfoData: string[]
): string[] {
  const InstanceInfo = [];

  // Set header.
  const Header = RawInstanceInfoData[0].split(";");
  console.log("Header: ", Header);

  for (let i = 1; i < RawInstanceInfoData.length; i++) {
    const Obj = {};
    const currentLine = RawInstanceInfoData[i].split(";");
    // "Set value to empty if it's not existing."
    for (let j = 0; j < Header.length; j++) {
      Obj[Header[j]] = currentLine[j] || "";
    }
    InstanceInfo.push(Obj);
  }
  DisplayAlertNotification("Instance information succesfully loaded!");
  console.log("Instance info: ", InstanceInfo);
  return InstanceInfo;
}
