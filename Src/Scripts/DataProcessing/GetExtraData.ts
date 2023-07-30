import * as math from "mathjs";
import { DisplayAlertNotification } from "../Elements/DisplayAlertNotification";

/**
 * Converts an array of strings into an array of objects representing instance information data.
 *
 * @param rawInstanceInfoData - Array of strings, where each string is a semicolon-separated representation of a row of data.
 * @returns Array of objects, where each object represents a row of instance information.
 *
 * @remarks
 * This function takes an array of strings (representing rows of instance information) as input.
 * It reads the first line to extract headers (split by ';'). These headers are used as the keys for the resulting objects.
 *
 * The function then iterates through each line of data, splitting it into separate elements
 * based on the semicolon delimiter, and creating an object from these elements with the corresponding headers as keys.
 * If a cell in the data is empty, it assigns an empty string to the corresponding object property.
 *
 * Finally, it displays a notification about successful loading of instance information.
 *
 * @example
 * ```typescript
 * const rawInstanceInfoData = [ "Column1;Column2", "Value1;Value2", ";Value4" ];
 * const result = GetInstanceInformation(rawInstanceInfoData);
 * // result = [
 * //   { "Column1": "Value1", "Column2": "Value2" },
 * //   { "Column1": "", "Column2": "Value4" },
 * // ];
 * ```
 */
export function GetInstanceInformation(
	rawInstanceInfoData: string[]
): object[] {
	const instanceInfo = [];
	const header = rawInstanceInfoData[0].split(";");

	for (let i = 1; i < rawInstanceInfoData.length; i++) {
		const obj = {};
		const currentLine = rawInstanceInfoData[i].split(";");
		for (let j = 0; j < header.length; j++) {
			obj[header[j]] = currentLine[j] || "";
		}
		instanceInfo.push(obj);
	}
	DisplayAlertNotification("Instance information succesfully loaded!");
	return instanceInfo;
}

/**
 * Extracts the best known primal and dual bounds from raw solu data.
 *
 * @param rawSoluData - Array of strings, each representing a line from a solu data file.
 * @returns Array of objects, each representing a processed line of data with associated primal and/or dual bounds.
 *
 * @remarks
 * This function processes an array of strings that represent raw solu data. Each string is parsed using a regular
 * expression pattern to extract the best known primal and dual bounds, as well as the file name.
 *
 * The function then generates an object for each line of data, with the file name and the primal and/or dual bounds
 * as properties of the object, depending on the keyword in the first column. The keyword "best" indicates a primal bound,
 * "bestdual" a dual bound, and "opt" indicates that the bound is both primal and dual.
 *
 * @example
 * ```typescript
 * const rawSoluData = [ "=best= FileName1 100", "=bestdual= FileName2 200", "=opt= FileName3 300" ];
 * const result = GetBestKnowBounds(rawSoluData);
 * // result = [
 * //   { "InputFileName": "FileName1", "PrimalBound Problem": 100 },
 * //   { "InputFileName": "FileName2", "DualBound Problem": 200 },
 * //   { "InputFileName": "FileName3", "PrimalBound Problem": 300, "DualBound Problem": 300 }
 * // ];
 * ```
 */
export function GetBestKnowBounds(rawSoluData: string[]): object[] {
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