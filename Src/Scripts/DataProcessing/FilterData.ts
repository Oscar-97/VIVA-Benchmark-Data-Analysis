/**
 * Converts an array of strings into an array of objects representing .trc data.
 *
 * @param rawData - Array of strings, where each string is a comma-separated representation of a row of data.
 * @returns Array of objects, where each object represents a row of data from the .trc file.
 *
 * @remarks
 * This function takes an array of strings (representing rows of .trc data) as input.
 * It reads the first line to determine if it includes headers (prefixed with '*').
 * If headers are found, they are extracted and used as the keys for the resulting objects.
 * If not, default headers (specified in a constant array inside the function) are used.
 *
 * The function then iterates through each line of data, splitting it into separate elements
 * based on the comma delimiter, and creating an object from these elements with the corresponding headers as keys.
 *
 * If the header is "Obj" or "Obj_Est", it will be truncated if the value exceeds 25.
 *
 * @example
 * ```typescript
 * const rawData = [ "* Column1,Column2", "Value1,Value2", "Value3,Value4" ];
 * const result = ExtractTrcData(rawData);
 * // result = [
 * //   { "Column1": "Value1", "Column2": "Value2" },
 * //   { "Column1": "Value3", "Column2": "Value4" },
 * // ];
 * ```
 */
export function ExtractTrcData(rawData: string[]): object[] {
	const traceData = [];
	const firstLine = rawData[0].split(",");

	if (firstLine[0].startsWith("*")) {
		/**
		 * Remove "* " from InputFileName.
		 */
		const header = firstLine.map((element: string) =>
			element.replace(/^[\*]/, "").trim()
		);

		for (let i = 1; i < rawData.length; i++) {
			const obj = {};
			const currentLine = rawData[i].split(",");
			for (let j = 0; j < header.length; j++) {
				obj[header[j]] = currentLine[j];
			}
			traceData.push(obj);
		}
	} else if (!firstLine[0].startsWith("*")) {
		const defaultHeaders: string[] = [
			"InputFileName",
			"ModelType",
			"SolverName",
			"NLP",
			"MIP",
			"JulianDate",
			"Dir",
			"Equs",
			"Vars",
			"Disc",
			"NumberOfNonZeros",
			"NumberOfNonlinearNonZeros",
			"OptionFile",
			"ModelStatus",
			"TermStatus",
			"Obj",
			"Obj_Est",
			"Time[s]",
			"NumberOfIterations",
			"NumberOfDomainViolations",
			"Nodes[i]",
			"UserComment"
		];
		const previousRow = {};

		for (let i = 0; i < rawData.length; i++) {
			const currentLine = rawData[i].split(",");
			const fileName = currentLine[0];
			const solverName = currentLine[2];

			if (previousRow[fileName] === solverName) {
				continue;
			}
			previousRow[fileName] = solverName;

			const obj = {};
			for (let j = 0; j < defaultHeaders.length; j++) {
				let value = currentLine[j];

				if (
					(defaultHeaders[j] === "Obj" || defaultHeaders[j] === "Obj_Est") &&
					value.length > 25
				) {
					value = value.substring(0, 25);
				}

				obj[defaultHeaders[j]] = value;
			}
			traceData.push(obj);
		}
	}
	return traceData;
}
