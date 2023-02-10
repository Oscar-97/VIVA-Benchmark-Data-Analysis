import { DisplayAlertNotification } from "../Elements/DisplayAlertNotification";

export function GetInstanceInformation(RawData: string[]) {
    const InstanceInfo = [];
    const FirstLine = RawData[0].split(";");

    // Set headers.
    const Header = FirstLine.map((element: string) => element.replace(/^[\*]/, "").trim());
    console.log("Header: ", Header);

    for (let i = 1; i < RawData.length; i++) {
        const Obj = {};
        const currentLine = RawData[i].split(",");
        for (let j = 0; j < Header.length; j++) {
            Obj[Header[j]] = currentLine[j];
        }
        InstanceInfo.push(Obj);
    }
    DisplayAlertNotification("Instance information succesfully loaded!");
    return InstanceInfo;
}