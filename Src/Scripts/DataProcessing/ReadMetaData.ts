import { InfoMessages } from "../Constants/Messages";
import { DisplayAlertNotification } from "../Elements/Events/DisplayAlertNotification";

/**
 * This function converts an array of strings into an array of objects representing instance information data.
 *
 * @param {string[]} unprocessedInstanceInformationData - Array of strings, where each string is a semicolon-separated representation of a row of data.
 * @returns Array of objects, where each object represents a row of instance information.
 *
 * @remarks
 * The function takes an array of strings (representing rows of instance information) as input.
 * It reads the first line to extract headers (split by ';'). These headers are used as the keys for the resulting objects.
 *
 * The function then iterates through each line of data, splitting it into separate elements
 * based on the semicolon delimiter, and creating an object from these elements with the corresponding headers as keys.
 * If the headers are named PrimalBound or Dualbound, they are renamed to PrimalBoundProblem and DualBoundProblem.
 * If a cell in the data is empty, it assigns an empty string to the corresponding object property.
 *
 * Finally, it displays a notification about successful loading of instance information.
 *
 * @example
 * ```typescript
 * const unprocessedInstanceInformationData = [ "Column1;Column2", "Value1;Value2", ";Value4" ];
 * const result = GetInstanceInformation(unprocessedInstanceInformationData);
 * // result = [
 * //   { "Column1": "Value1", "Column2": "Value2" },
 * //   { "Column1": "", "Column2": "Value4" },
 * // ];
 * ```
 */
export function GetInstanceInformation(
	unprocessedInstanceInformationData: string[]
): object[] {
	const instanceInfo = [];
	const [headerLine, ...rows] = unprocessedInstanceInformationData;
	if (headerLine === undefined) {
		return [];
	}

	const header = headerLine.split(";").map((x) => {
		if (x === "primalbound") {
			return "PrimalBoundProblem";
		}
		if (x === "dualbound") {
			return "DualBoundProblem";
		}
		return x;
	});

	for (const row of rows) {
		const obj: { [key: string]: string } = {};
		const currentLine = row.split(";");
		for (const [j, name] of header.entries()) {
			obj[name] = currentLine[j] || "";
		}
		instanceInfo.push(obj);
	}
	DisplayAlertNotification(InfoMessages.INSTANCE_INFO_LOADED);
	return instanceInfo;
}

/**
 * This function the best known primal and dual bounds from raw solu data.
 *
 * @param {string[]} unprocessedSolutionData - Array of strings, each representing a line from a solu data file.
 * @returns Array of objects, each representing a processed line of data with associated primal and/or dual bounds.
 *
 * @remarks
 * It processes an array of strings that represent raw solu data. Each string is parsed using a regular
 * expression pattern to extract the best known primal and dual bounds, as well as the file name.
 *
 * The function then generates an object for each line of data, with the file name and the primal and/or dual bounds
 * as properties of the object, depending on the keyword in the first column. The keyword "inf" indicates infinity, "best" a primal bound,
 * "bestdual" a dual bound, and "opt" indicates that the bound is both primal and dual.
 *
 * @example
 * ```typescript
 * const unprocessedSolutionData = [ "=best= FileName1 100", "=bestdual= FileName2 200", "=opt= FileName3 300" ];
 * const result = GetBestKnownBounds(unprocessedSolutionData);
 * // result = [
 * //   { "InputFileName": "FileName1", "PrimalBound Problem": 100 },
 * //   { "InputFileName": "FileName2", "DualBound Problem": 200 },
 * //   { "InputFileName": "FileName3", "PrimalBound Problem": 300, "DualBound Problem": 300 }
 * // ];
 * ```
 */

export function GetBestKnownBounds(
	unprocessedSolutionData: string[]
): object[] {
	const soluData = [];
	const regexPattern = /^=(.*?)=\s+(.*?)\s+(.*?)$/;

	for (const line of unprocessedSolutionData) {
		const obj: {
			InputFileName?: string;
			PrimalBoundProblem?: number | string;
			DualBoundProblem?: number | string;
		} = {};
		const match = regexPattern.exec(line);
		if (match !== null) {
			// All three groups take part in a match, the last two can be empty.
			const [, keyword = "", fileName = "", value = ""] = match;
			obj["InputFileName"] = fileName;
			const exponential = Number(value).toExponential(6);
			switch (keyword) {
				case "inf":
					obj["PrimalBoundProblem"] = Infinity;
					obj["DualBoundProblem"] = Infinity;
					break;
				case "best":
					obj["PrimalBoundProblem"] = exponential;
					break;
				case "bestdual":
					obj["DualBoundProblem"] = exponential;
					break;
				case "opt":
					obj["PrimalBoundProblem"] = exponential;
					obj["DualBoundProblem"] = exponential;
					break;
				default:
					break;
			}
		}
		soluData.push(obj);
	}
	return soluData;
}
