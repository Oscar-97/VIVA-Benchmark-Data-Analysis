/**
 * Extract the data from the trc file.
 * @param rawData The provided raw data.
 * @returns TrcData Contains the processed trc results.
 */
export function ExtractTrcData(rawData: string[]): object[] {
	const traceData = [];
	const firstLine = rawData[0].split(",");

	/**
	 * Check if headers are included in the .trc file.
	 * If they are found, include them, if not, use the custom headers.
	 */
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
		/**
		 * Standard order of headers:
		 * https://www.gamsworld.org/performance/trace.htm
		 */
		const defaultHeaders = [
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
			"Obj Est",
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

			// Check if the combination of filename and solver has been used earlier.
			if (previousRow[fileName] === solverName) {
				continue;
			}
			previousRow[fileName] = solverName;

			const obj = {};
			for (let j = 0; j < defaultHeaders.length; j++) {
				obj[defaultHeaders[j]] = currentLine[j];
			}
			traceData.push(obj);
		}
	}
	return traceData;
}

/**
 * Get the provided category and the corresponding data.
 * @param traceData Contains the processed trc results.
 * @param dataCategory The data category to extract values from.
 * @returns DataCategoryResults The category results that will be returned.
 */
export function GetTrcDataCategory(
	traceData: object[],
	dataCategory: string
): string[] {
	const dataCategoryResults = [];
	for (let i = 0; i < traceData.length; i++) {
		dataCategoryResults.push(traceData[i][dataCategory]);
	}
	return dataCategoryResults;
}
