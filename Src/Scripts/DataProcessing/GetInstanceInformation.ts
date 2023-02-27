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

export function GetInstancePrimalDualbounds(RawSoluData: any[]): string[] {
  const SoluData = [];
  const RegexPattern = /^=(.*?)=\s+(.*?)\s+(.*?)$/;

  for (let i = 0; i < RawSoluData.length; i++) {
    const Obj = {};
    const CurrentLine = RawSoluData[i].split("\n");
    const Match = RegexPattern.exec(CurrentLine);
    //console.log("Matches: ", Match[1], Match[2], Match[3])
    if (Match !== null) {
      Obj["InputFileName"] = Match[2];
      switch (Match[1]) {
        case "best":
          // Value in the third column is primal bound.
          Obj["PrimalBoundProblem"] = Match[3];
          Obj["DualBoundProblem"] = "";
          break;
        case "bestdual":
          // Value in the third column is dual bound.
          Obj["PrimalBoundProblem"] = "";
          Obj["DualBoundProblem"] = Match[3];
          break;
        case "opt":
          // Value in the third column is both primal and dual bound.
          Obj["PrimalBoundProblem"] = Match[3];
          Obj["DualBoundProblem"] = Match[3];
          break;
      }
    }
    SoluData.push(Obj);
  }

  console.log("SoluData: ", SoluData);
  return SoluData;
}
