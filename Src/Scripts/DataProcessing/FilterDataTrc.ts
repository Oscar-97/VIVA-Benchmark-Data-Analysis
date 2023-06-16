/**
 * Extract the data from the trc file.
 * @param RawData The provided raw data.
 * @returns TrcData Contains the processed trc results.
 */
export function ExtractTrcData(RawData: string[]): object[] {
	const TrcData = [];
	const FirstLine = RawData[0].split(",");

	/**
	 * Check if headers are included in the .trc file.
	 * If they are found, include them, if not, use the custom headers.
	 */
	if (FirstLine[0].startsWith("*")) {
		/**
		 * Remove "* " from InputFileName.
		 */
		const Header = FirstLine.map((element: string) =>
			element.replace(/^[\*]/, "").trim()
		);

		for (let i = 1; i < RawData.length; i++) {
			const Obj = {};
			const CurrentLine = RawData[i].split(",");
			for (let j = 0; j < Header.length; j++) {
				Obj[Header[j]] = CurrentLine[j];
			}
			TrcData.push(Obj);
		}
	} else if (!FirstLine[0].startsWith("*")) {
		/**
		 * Standard order of headers:
		 * https://www.gamsworld.org/performance/trace.htm
		 */
		const DefaultHeaders = [
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
		const PreviousRow = {};

		for (let i = 0; i < RawData.length; i++) {
			const CurrentLine = RawData[i].split(",");
			const FileName = CurrentLine[0];
			const SolverName = CurrentLine[2];

			// Check if the combination of filename and solver has been used earlier.
			if (PreviousRow[FileName] === SolverName) {
				continue;
			}
			PreviousRow[FileName] = SolverName;

			const Obj = {};
			for (let j = 0; j < DefaultHeaders.length; j++) {
				Obj[DefaultHeaders[j]] = CurrentLine[j];
			}
			TrcData.push(Obj);
		}
	}
	return TrcData;
}

/**
 * Get the provided category and the corresponding data.
 * @param TrcData Contains the processed trc results.
 * @param DataCategory The data category to extract values from.
 * @returns DataCategoryResults The category results that will be returned.
 */
export function GetTrcDataCategory(
	TrcData: object[],
	DataCategory: string
): string[] {
	const DataCategoryResults = [];
	for (let i = 0; i < TrcData.length; i++) {
		DataCategoryResults.push(TrcData[i][DataCategory]);
	}
	return DataCategoryResults;
}
