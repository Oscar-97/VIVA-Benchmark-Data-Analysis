/**
 * Default headers for the trace file.
 */
import { DEFAULT_HEADERS } from "../Constants/TraceHeaders";
import { TraceData } from "../Interfaces/Interfaces";

/**
 * This function extracts headers from the array with raw data results.
 * Headers start with an asterisk (*) and are comma-separated.
 *
 * @param {string[]} unprocessedData - Array of strings, where each string is a comma-separated representation of a row of data.
 * @returns An array of strings representing extracted headers.
 */
function ExtractHeaders(unprocessedData: string[]): string[] {
	let headers: string[] = [];
	for (const line of unprocessedData) {
		if (line.startsWith("*")) {
			const cleanLine = line.slice(1).trim();

			if (cleanLine === "") {
				break;
			}
			if (cleanLine.includes(",")) {
				headers = [
					...headers,
					...cleanLine.split(",").map((h) => {
						return h.trim();
					})
				];
			}
		} else {
			break;
		}
	}
	return headers.filter((header) => {
		return header;
	});
}

/**
 * Formats the value of a cell by its header: the objective values are written in exponential format
 * and the solver time is rounded to two decimals. Other values are kept, also when they are missing.
 */
function FormatCell(
	header: string,
	value: string | undefined
): string | undefined {
	if (header === "ObjectiveValue" || header === "ObjectiveValueEstimate") {
		return Number(value).toExponential(6);
	}
	if (header === "SolverTime") {
		return (Math.round(Number(value) * 100) / 100).toString();
	}
	return value;
}

/**
 * This function processes an array of raw data lines, using header names to create objects. If the line contains an asterisk (*), it is skipped.
 *
 * If the header is "ObjectiveValue" or "ObjectiveValueEstimate", it will be set to exponential format.
 *
 * @param {string[]} headers - Array of strings representing the headers/keys for the resulting objects.
 * @param {string[]} unprocessedData - Array of strings, where each string is a comma-separated representation of a row of data.
 * @param {number} startIdx - The index to start processing lines from unprocessedData.
 * @returns An array of objects created from the unprocessedData lines, where keys are taken from headers.
 */
function ProcessLines(
	headers: string[],
	unprocessedData: string[],
	startIdx: number
): object[] {
	const traceData = [];
	const previousRow: { [key: string]: string } = {};
	for (const line of unprocessedData.slice(Math.max(startIdx, 0))) {
		if (line.startsWith("*")) continue;

		const currentLine = line.split(",");
		// split always returns at least one element, a short line has no third one
		const fileName = currentLine[0] ?? "";
		const solverName = currentLine[2] ?? "";

		if (
			previousRow["fileName"] === fileName &&
			previousRow["solverName"] === solverName
		) {
			previousRow["fileName"] = "";
			previousRow["solverName"] = "solverName";
			continue;
		}
		previousRow[fileName] = fileName;
		previousRow[solverName] = solverName;

		if (
			currentLine.some((cell) => {
				return cell.trim() !== "";
			})
		) {
			// A row with fewer cells than headers keeps the missing cells undefined.
			const obj: { [key: string]: string | undefined } = {};
			for (const [j, header] of headers.entries()) {
				obj[header] = FormatCell(header, currentLine[j]);
			}
			traceData.push(obj);
		}
	}
	return traceData;
}

/**
 * This function converts an array of strings into an array of objects representing .trc data.
 *
 * @param {string[]} unprocessedData - Array of strings, where each string is a comma-separated representation of a row of data.
 * @returns Array of objects, where each object represents a row of data from the .trc file.
 *
 * @remarks
 * This function takes an array of strings (representing rows of .trc data) as input.
 * It reads the lines to determine if it includes headers (prefixed with '*').
 * If headers are found, they are extracted and used as the keys for the resulting objects.
 * If not, default headers are used.
 *
 * The function then iterates through each line of data by using the function ProcessLines, splitting it into separate elements
 * based on the comma delimiter, and creating an object from these elements with the corresponding headers as keys.
 *
 * @example
 * ```typescript
 * const unprocessedData = [ "* Column1,Column2", "Value1,Value2", "Value3,Value4" ];
 * const result = ExtractTraceData(unprocessedData);
 * // result = [
 * //   { "Column1": "Value1", "Column2": "Value2" },
 * //   { "Column1": "Value3", "Column2": "Value4" },
 * // ];
 * ```
 */
export function ExtractTraceData(unprocessedData: string[]): TraceData[] {
	const firstLine = unprocessedData[0];
	if (firstLine === undefined) {
		return [];
	}
	if (firstLine.startsWith("*")) {
		const headers = ExtractHeaders(unprocessedData);
		const startIdx = unprocessedData.findIndex((line) => {
			return !line.startsWith("*");
		});
		return ProcessLines(headers, unprocessedData, startIdx) as TraceData[];
	}
	return ProcessLines(DEFAULT_HEADERS, unprocessedData, 0) as TraceData[];
}
