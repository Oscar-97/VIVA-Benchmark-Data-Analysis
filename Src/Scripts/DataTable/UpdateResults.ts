/**
 * Update the problemlist with the selected rows.
 * @returns ProblemList
 */
export function UpdateProblemList(): string[] {
	/**
	 * @params Rows Select all rows with the class "selected".
	 * @params data Store the data for the selected rows.
	 */
	//
	const rows = document.querySelectorAll(".row-selected-problems");
	const problemList: string[] = [];

	for (let i = 0; i < rows.length; i++) {
		const row = rows[i] as HTMLTableRowElement;

		if (row.tagName === "TR") {
			const cell = row.cells[0];
			const cellData = cell.textContent;
			problemList.push(cellData);
		}
	}
	return problemList;
}

/**
 * Update the results data with the selected rows.
 * @returns ResultsData
 */
export function UpdateResultsData(): string[] {
	// select all rows with the class "selected"
	/**
	 * @params rows Select all rows with the class "selected".
	 * @params data Store the data for the selected rows.
	 */
	const rows = document.querySelectorAll(".row-selected-problems");
	const resultsData = [];

	for (let i = 0; i < rows.length; i++) {
		const row = rows[i] as HTMLTableRowElement;

		if (row.tagName === "TR") {
			const cells = row.cells as HTMLCollectionOf<HTMLTableCellElement>;
			const rowData = [];
			for (let j = 1; j < cells.length; j++) {
				const cellData = cells[j].textContent;
				rowData.push(cellData);
			}
			resultsData.push(rowData);
		}
	}
	return resultsData;
}

/**
 * Update the trc data with the selected rows.
 * @returns TrcData
 */
export function UpdateResultsTrc(): object[] {
	const headers = Array.from(document.querySelectorAll(".thead-dark th")).map(
		(header) => header.textContent
	);

	const traceData = Array.from(
		document.querySelectorAll(".row-selected-problems")
	).map((row) =>
		Array.from(row.querySelectorAll("td")).reduce((obj, cell, j) => {
			obj[headers[j]] = cell.textContent;
			return obj;
		}, {})
	);

	return traceData;
}
