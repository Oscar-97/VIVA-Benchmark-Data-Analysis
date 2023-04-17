import { DisplayAlertNotification } from "../Elements/DisplayAlertNotification";

export function GetInstanceInformation(
  RawInstanceInfoData: string[]
): object[] {
  const InstanceInfo = [];

  // Set header.
  const Header = RawInstanceInfoData[0].split(";");
  console.log("Header: ", Header);

  for (let i = 1; i < RawInstanceInfoData.length; i++) {
    const Obj = {};
    const CurrentLine = RawInstanceInfoData[i].split(";");
    // "Set value to empty if it's not existing."
    for (let j = 0; j < Header.length; j++) {
      Obj[Header[j]] = CurrentLine[j] || "";
    }
    InstanceInfo.push(Obj);
  }
  DisplayAlertNotification("Instance information succesfully loaded!");
  console.log("Instance info: ", InstanceInfo);
  return InstanceInfo;
}

export function GetInstancePrimalDualbounds(RawSoluData: any[]): object[] {
  const SoluData = [];
  const RegexPattern = /^=(.*?)=\s+(.*?)\s+(.*?)$/;

  for (let i = 0; i < RawSoluData.length; i++) {
    const Obj = {};
    const CurrentLine = RawSoluData[i].split("\n");
    const Match = RegexPattern.exec(CurrentLine);
    if (Match !== null) {
      Obj["InputFileName"] = Match[2];
      switch (Match[1]) {
        case "best":
          // Value in the third column is primal bound.
          Obj["PrimalBound Problem"] = Match[3];
          break;
        case "bestdual":
          // Value in the third column is dual bound.
          Obj["DualBound Problem"] = Match[3];
          break;
        case "opt":
          // Value in the third column is both primal and dual bound.
          Obj["PrimalBound Problem"] = Match[3];
          Obj["DualBound Problem"] = Match[3];
          break;
      }
    }
    SoluData.push(Obj);
  }

  console.log("SoluData: ", SoluData);
  return SoluData;
}
