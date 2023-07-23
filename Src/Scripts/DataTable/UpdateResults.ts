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
	const Rows = document.querySelectorAll(".row-selected-problems");
	const ProblemList: string[] = [];

	for (let i = 0; i < Rows.length; i++) {
		const row = Rows[i] as HTMLTableRowElement;

		if (row.tagName === "TR") {
			const cell = row.cells[0];
			const cellData = cell.textContent;
			ProblemList.push(cellData);
		}
	}
	return ProblemList;
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
	const Rows = document.querySelectorAll(".row-selected-problems");
	const ResultsData = [];

	for (let i = 0; i < Rows.length; i++) {
		const Row = Rows[i] as HTMLTableRowElement;

		if (Row.tagName === "TR") {
			const Cells = Row.cells as HTMLCollectionOf<HTMLTableCellElement>;
			const RowData = [];
			for (let j = 1; j < Cells.length; j++) {
				const CellData = Cells[j].textContent;
				RowData.push(CellData);
			}
			ResultsData.push(RowData);
		}
	}
	return ResultsData;
}

/**
 * Update the trc data with the selected rows.
 * @returns TrcData
 */
export function UpdateResultsTrc(): object[] {
	const Headers = Array.from(document.querySelectorAll(".thead-dark th")).map(
		(header) => header.textContent
	);

	const TrcData = Array.from(
		document.querySelectorAll(".row-selected-problems")
	).map((row) =>
		Array.from(row.querySelectorAll("td")).reduce((Obj, cell, j) => {
			Obj[Headers[j]] = cell.textContent;
			return Obj;
		}, {})
	);

	return TrcData;
}
