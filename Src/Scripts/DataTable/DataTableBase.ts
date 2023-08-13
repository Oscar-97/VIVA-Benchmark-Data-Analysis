/**
 * Function to dynamically create and display a HTML table based on the provided trace data.
 *
 * @param traceData An array of objects where each object represents a row in the table, and the keys/values within the object represent columns and cell values.
 *
 * @returns The function doesn't return anything.
 *
 * @remarks
 * This function generates a new table to display trace data. The table is added to the 'dataTable' HTML div.
 * For each object in the traceData array, it creates a row with the values from the object in the columns of the row.
 * Note: this function directly manipulates the DOM and doesn't return anything.
 *
 * @example
 * ```typescript
 * const traceData = [
 *   {Solver: "SolverA", Runtime: 10, ObjectiveValue: 100},
 *   {Solver: "SolverB", Runtime: 20, ObjectiveValue: 200}
 * ];
 * TableDataTrc(traceData);
 * ```
 * This example will generate a table with two rows and three columns (Solver, Runtime, and ObjectiveValue).
 */
export function TableDataTrc(traceData: object[]): void {
	/**
	 * @param DataTableDiv Div that contains the data table.
	 */
	const dataTableDiv = document.getElementById("dataTable") as HTMLDivElement;
	dataTableDiv.innerHTML = "";

	const dataTableHeaders = document.createElement("thead");
	dataTableHeaders.classList.add("thead-dark");

	/**
	 * @param DataTableHeaders Thead created from the categories.
	 */
	const headerRow = document.createElement("tr");
	for (const key of Object.keys(traceData[0])) {
		if (key !== undefined) {
			const th = document.createElement("th");
			th.textContent = key;
			headerRow.appendChild(th);
		}
	}
	dataTableHeaders.appendChild(headerRow);

	/**
	 * Add the results.
	 * @param DataTableContent The content of the data table.
	 */
	const dataTableContent = document.createElement("tbody");
	for (const obj of traceData) {
		const results = Object.values(obj);
		const resultRow = document.createElement("tr");
		for (let i = 0; i < results.length; i++) {
			const td = document.createElement("td");
			td.textContent = results[i];
			resultRow.appendChild(td);
		}
		dataTableContent.appendChild(resultRow);
	}

	/**
	 * Data table body.
	 */
	const newDataTable = document.createElement("table");
	newDataTable.classList.add("table", "table-bordered", "table-sm");
	newDataTable.id = "dataTableGenerated";
	newDataTable.appendChild(dataTableHeaders);
	newDataTable.appendChild(dataTableContent);

	/**
	 * Add the table to the div.
	 */
	dataTableDiv.appendChild(newDataTable);
}

/**
 * Function to dynamically create and display a HTML table based on solver's time statistics.
 *
 * @param solverTimeStats An object where each key is the name of a solver and each value is another object that holds statistical metrics (average, min, max, std, sum, and percentiles) for the solver's runtime.
 * @param title A string that will be used as the table caption.
 *
 * @remarks
 * This function generates a new table displaying statistical metrics for different solvers. The table is added to the 'statisticsTable' HTML div.
 * For each solver, it creates a row with the solver's name in the first column, and the solver's statistics in the subsequent columns.
 * Note: this function directly manipulates the DOM and doesn't return anything.
 */
export function StatisticsTable(
	solverTimeStats: {
		[SolverName: string]: {
			average: number;
			min: number;
			max: number;
			std: number;
			sum: number;
			percentile_10: number;
			percentile_25: number;
			percentile_50: number;
			percentile_75: number;
			percentile_90: number;
		};
	},
	title: string
): void {
	const statisticsTableDiv = document.getElementById(
		"statisticsTable"
	) as HTMLDivElement;
	statisticsTableDiv.innerHTML = "";

	const statisticsTable = document.createElement("table");
	statisticsTable.classList.add(
		"table",
		"table-bordered",
		"table-responsive",
		"table-hover",
		"table-sm"
	);

	const tableCaption = document.createElement("caption");
	tableCaption.textContent = title + " statistics.";

	const header = document.createElement("thead");
	header.classList.add("table-light");

	const headerRow = document.createElement("tr");
	const dataLabel = document.createElement("th");
	dataLabel.textContent = "Solver";
	dataLabel.scope = "col";

	header.appendChild(headerRow);
	headerRow.appendChild(dataLabel);

	statisticsTable.appendChild(tableCaption);
	statisticsTable.appendChild(header);

	const tableBody = document.createElement("tbody");

	/**
	 * Iterate over each key in the SolverTimeStats and create a new table header element.
	 */
	const usedCategories: string[] = [];
	for (const objKey of Object.keys(solverTimeStats)) {
		const keys = Object.keys(solverTimeStats[objKey]);
		keys.forEach((key) => {
			if (!usedCategories.includes(key)) {
				const th = document.createElement("th");
				th.textContent = key;
				th.scope = "col";
				headerRow.appendChild(th);
				usedCategories.push(key);
			}
		});
	}

	/**
	 * Create value table rows.
	 */
	const dataKeys = Object.keys(solverTimeStats);
	dataKeys.forEach((dataKey) => {
		const valuesRow = document.createElement("tr");
		const dataType = document.createElement("th");
		dataType.scope = "row";
		dataType.textContent = dataKey;
		valuesRow.appendChild(dataType);
		const dataValues = Object.values(solverTimeStats[dataKey]);
		dataValues.forEach((dataValue) => {
			const td = document.createElement("td");
			td.textContent = dataValue.toString();
			valuesRow.appendChild(td);
		});
		tableBody.appendChild(valuesRow);
	});

	statisticsTable.appendChild(tableBody);
	statisticsTableDiv.appendChild(statisticsTable);
}
