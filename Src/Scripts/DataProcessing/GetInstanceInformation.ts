import * as math from "mathjs";
import { DisplayAlertNotification } from "../Elements/DisplayAlertNotification";

export function GetInstanceInformation(
	rawInstanceInfoData: string[]
): object[] {
	const instanceInfo = [];
	const header = rawInstanceInfoData[0].split(";");

	for (let i = 1; i < rawInstanceInfoData.length; i++) {
		const obj = {};
		const currentLine = rawInstanceInfoData[i].split(";");
		// "Set value to empty if it's not existing."
		for (let j = 0; j < header.length; j++) {
			obj[header[j]] = currentLine[j] || "";
		}
		instanceInfo.push(obj);
	}
	DisplayAlertNotification("Instance information succesfully loaded!");
	return instanceInfo;
}

export function GetInstancePrimalDualbounds(rawSoluData: string[]): object[] {
	const soluData = [];
	const regexPattern = /^=(.*?)=\s+(.*?)\s+(.*?)$/;

	for (let i = 0; i < rawSoluData.length; i++) {
		const obj = {};
		const match = regexPattern.exec(rawSoluData[i]);
		if (match !== null) {
			obj["InputFileName"] = match[2];
			switch (match[1]) {
				case "best":
					// Value in the third column is primal bound.
					obj["PrimalBound Problem"] = math.bignumber(match[3]).toNumber();
					break;
				case "bestdual":
					// Value in the third column is dual bound.
					obj["DualBound Problem"] = math.bignumber(match[3]).toNumber();
					break;
				case "opt":
					// Value in the third column is both primal and dual bound.
					obj["PrimalBound Problem"] = math.bignumber(match[3]).toNumber();
					obj["DualBound Problem"] = math.bignumber(match[3]).toNumber();
					break;
			}
		}
		soluData.push(obj);
	}

	return soluData;
}
