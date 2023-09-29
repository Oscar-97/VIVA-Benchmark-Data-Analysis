/**
 * Default headers for the trace file.
 */
const defaultHeaders: string[] = [
	"InputFileName",
	"ModelType",
	"SolverName",
	"NLP",
	"MIP",
	"JulianDate",
	"Direction",
	"NumberOfEquations",
	"NumberOfVariables",
	"NumberOfDiscreteVariables",
	"NumberOfNonZeros",
	"NumberOfNonlinearNonZeros",
	"OptionFile",
	"ModelStatus",
	"TermStatus",
	"ObjectiveValue",
	"ObjectiveValueEstimate",
	"SolverTime",
	"NumberOfIterations",
	"NumberOfDomainViolations",
	"NumberOfNodes",
	"UserComment"
];

/**
 * Extracts headers from the array with raw data results.
 * Headers start with an asterisk (*) and are comma-separated.
 *
 * @param unprocessedData - Array of strings, where each string is a comma-separated representation of a row of data.
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
				headers = [...headers, ...cleanLine.split(",").map((h) => h.trim())];
			}
		} else {
			break;
		}
	}
	return headers.filter((header) => header);
}

/**
 * Processes an array of raw data lines, using header names to create objects. If the line contains an asterisk (*), it is skipped.
 *
 * If the header is "ObjectiveValue" or "ObjectiveValueEstimate", it will be set to exponential format.
 *
 * @param headers - Array of strings representing the headers/keys for the resulting objects.
 * @param unprocessedData - Array of strings, where each string is a comma-separated representation of a row of data.
 * @param startIdx - The index to start processing lines from unprocessedData.
 * @returns An array of objects created from the unprocessedData lines, where keys are taken from headers.
 */
function ProcessLines(
	headers: string[],
	unprocessedData: string[],
	startIdx: number
): object[] {
	const traceData = [];
	const previousRow = {};
	for (let i = Math.max(startIdx, 0); i < unprocessedData.length; i++) {
		if (unprocessedData[i].startsWith("*")) continue;

		const currentLine = unprocessedData[i].split(",");
		const fileName = currentLine[0];
		const solverName = currentLine[2];

		if (previousRow[fileName] === solverName) {
			continue;
		}
		previousRow[fileName] = solverName;

		if (currentLine.some((cell) => cell.trim() !== "")) {
			const obj = {};
			for (let j = 0; j < headers.length; j++) {
				let value = currentLine[j];

				if (
					headers[j] === "ObjectiveValue" ||
					headers[j] === "ObjectiveValueEstimate"
				) {
					value = Number(value).toExponential(6);
				}

				if (headers[j] === "SolverTime") {
					value = (Math.round(Number(value) * 100) / 100).toString();
				}

				obj[headers[j]] = value;
			}
			traceData.push(obj);
		}
	}
	return traceData;
}

/**
 * Converts an array of strings into an array of objects representing .trc data.
 *
 * @param unprocessedData - Array of strings, where each string is a comma-separated representation of a row of data.
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
export function ExtractTraceData(unprocessedData: string[]): object[] {
	const firstLine = unprocessedData[0].split(",");
	let traceData: object[] = [];

	if (firstLine[0].startsWith("*")) {
		const headers = ExtractHeaders(unprocessedData);
		const startIdx = unprocessedData.findIndex((line) => !line.startsWith("*"));
		traceData = ProcessLines(headers, unprocessedData, startIdx);
	} else if (!firstLine[0].startsWith("*")) {
		traceData = ProcessLines(defaultHeaders, unprocessedData, 0);
	}
	return traceData;
}
