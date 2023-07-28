export function TableData(
	instance: string,
	solvers: string | string[],
	instanceLabels: string | string[],
	dataLabels: string[],
	problems: string | string[],
	resultsData: string[],
	comparisonArray: string[]
): void {
	/**
	 * Remove DataLabels that are not used.
	 * @param NewDataLabels New data labels.
	 * @param StartLabel Starting label.
	 * @param EndLabel Ending label.
	 */
	const newDataLabels = [];
	comparisonArray.forEach((element: string, index: number) => {
		if (element === "Used") {
			const startLabel = index * 8;
			const endLabel = index * 8 + 8;
			let tempArray = [];
			tempArray = dataLabels.slice(startLabel, endLabel);
			tempArray.forEach((element) => {
				newDataLabels.push(element);
			});
		}
	});

	/**
	 * Check which solvers to use.
	 * @param ColumnsToUse Set the columns to always use the instance data.
	 */
	const columnsToUse = [0, 1, 2, 3, 4, 5];
	comparisonArray.forEach((element: string, index: number) => {
		const startValue = index * 8 + 6;
		const endValue = index * 8 + 14;
		if (element === "Used") {
			for (let i = startValue; i < endValue; i++) {
				columnsToUse.push(i);
			}
		}
	});
	const newResultsData = resultsData.map((r: string) =>
		columnsToUse.map((i) => r[i])
	);

	/**
	 * @param DataTableDiv Div that contains the data table.
	 */
	const dataTableDiv = document.getElementById("dataTable") as HTMLDivElement;
	dataTableDiv.innerHTML = "";

	/**
	 * @param DataTableHeaders Thead created from instance and solvers on the first row, data labels on the second row.
	 */
	const dataTableHeaders = document.createElement("thead");
	dataTableHeaders.className = "thead-dark";
	const tr1 = document.createElement("tr");
	tr1.innerHTML = "<th colspan='7'>" + instance + "</th>";
	for (let i = 0; i < solvers.length; i++) {
		const th = document.createElement("th");
		th.colSpan = 8;
		th.innerHTML = solvers[i];
		tr1.appendChild(th);
	}
	dataTableHeaders.appendChild(tr1);

	const tr2 = document.createElement("tr");
	for (let i = 0; i < instanceLabels.length; i++) {
		const th = document.createElement("th");
		th.innerHTML = instanceLabels[i];
		tr2.appendChild(th);
	}
	for (let i = 0; i < newDataLabels.length; i++) {
		const th = document.createElement("th");
		th.innerHTML = newDataLabels[i];
		tr2.appendChild(th);
	}
	dataTableHeaders.appendChild(tr2);

	/**
	 * @param DataTableContent The content of the data table.
	 * @param NewResultsData Contains all the result data and the table tags.
	 */
	const dataTableContent = document.createElement("tbody");
	for (let i = 0; i < problems.length; i++) {
		const tr3 = document.createElement("tr");
		const th3 = document.createElement("th");
		th3.scope = "row";
		th3.innerHTML = problems[i];
		tr3.appendChild(th3);
		newResultsData[i].forEach((element: string) => {
			const td3 = document.createElement("td");
			td3.innerHTML = element;
			tr3.appendChild(td3);
		});
		dataTableContent.appendChild(tr3);
	}

	/**
	 * Create the table element.
	 * @param NewDataTable Table element which is will contain all new content.
	 */
	const newDataTable = document.createElement("table") as HTMLTableElement;
	newDataTable.className = "table table-bordered table-sm";
	newDataTable.id = "dataTableGenerated";
	newDataTable.appendChild(dataTableHeaders);
	newDataTable.appendChild(dataTableContent);

	/**
	 * Add the table to the div.
	 */
	dataTableDiv.appendChild(newDataTable);
}

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
	/**
	 * @param StatisticsTableDiv Div that contains the statistics table.
	 */
	const statisticsTableDiv = document.getElementById(
		"statisticsTable"
	) as HTMLDivElement;
	statisticsTableDiv.innerHTML = "";

	const newStatisticsTable = document.createElement("table");
	newStatisticsTable.classList.add(
		"table",
		"table-bordered",
		"table-sm",
		"border-dark",
		"border-2"
	);

	const tableCaption = document.createElement("caption");
	tableCaption.textContent = title + " statistics.";

	const header = document.createElement("thead");
	header.classList.add("table-dark");

	const headerRow = document.createElement("tr");
	const dataLabel = document.createElement("th");
	dataLabel.textContent = "Summary";
	dataLabel.scope = "col";

	header.appendChild(headerRow);
	headerRow.appendChild(dataLabel);

	newStatisticsTable.appendChild(tableCaption);
	newStatisticsTable.appendChild(header);

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
		newStatisticsTable.appendChild(valuesRow);
	});

	/**
	 * Add the final table to the div.
	 */
	statisticsTableDiv.appendChild(newStatisticsTable);
}
