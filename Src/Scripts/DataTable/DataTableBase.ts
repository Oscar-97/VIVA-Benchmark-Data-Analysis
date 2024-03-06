import {
	comparisonTableDiv,
	dataTable,
	solverComparisonModal,
	solverComparisonModalBody,
	solverComparisonModalLabel,
	statisticsTableDiv
} from "../Elements/Elements";
import { TraceHeaderMap } from "../Constants/TraceHeaders";
import "bootstrap/dist/css/bootstrap.min.css";
import Modal from "bootstrap/js/dist/modal";
import { Captions } from "../Constants/Messages";
/**
 * Sorts the keys by an enumeration and then by alphabetical order for non-enumeration keys.
 *
 * @param obj - The object whose keys are to be sorted.
 * @returns An array of strings representing the sorted keys of the object.
 *          First, the keys that are present in the `TraceHeaderMap` enum are sorted based on their order in the enum.
 *          Then, the remaining keys not in the enum are sorted alphabetically.
 */
function SortKeysByEnum(obj): string[] {
	const enumKeys = Object.keys(TraceHeaderMap);
	const objKeys = Object.keys(obj);

	const sortedEnumKeys = objKeys
		.filter((key) => {
			return enumKeys.includes(key);
		})
		.sort((a, b) => {
			return enumKeys.indexOf(a) - enumKeys.indexOf(b);
		});

	const nonEnumKeys = objKeys
		.filter((key) => {
			return !enumKeys.includes(key);
		})
		.sort();

	return [...sortedEnumKeys, ...nonEnumKeys];
}

/**
 * Function to dynamically create and display a HTML table based on the provided trace data.
 *
 * @param {object[]} traceData - An array of objects where each object represents a row in the table, and the keys/values within the object represent columns and cell values.
 *
 * @returns The function doesn't return anything.
 *
 * @remarks
 * This function generates a new table to display trace data. The table is added to the 'dataTable' HTML div.
 * For each object in the traceData array, it creates a row with the values from the object in the columns of the row.
 * The objects are sorted to assert that keys that have been manipulated get in the correct order.
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
	 * Div that contains the data table.
	 */
	const dataTableDiv = dataTable;
	dataTableDiv.innerHTML = "";

	const dataTableHeaders = document.createElement("thead");
	dataTableHeaders.classList.add("thead-dark");

	/**
	 * Thead created from the categories.
	 */
	const headerRow = document.createElement("tr");
	const sortedKeys = SortKeysByEnum(traceData[0]);

	for (const key of sortedKeys) {
		const th = document.createElement("th");
		th.textContent = TraceHeaderMap[key as keyof typeof TraceHeaderMap] || key;
		headerRow.appendChild(th);
	}
	dataTableHeaders.appendChild(headerRow);

	/**
	 * Add the results.
	 * The content of the data table.
	 */
	const dataTableContent = document.createElement("tbody");
	for (const obj of traceData) {
		const resultRow = document.createElement("tr");
		const sortedKeys = SortKeysByEnum(obj);
		for (const key of sortedKeys) {
			const value = obj[key];
			const td = document.createElement("td");
			if (value !== null && value !== undefined && !Number.isNaN(value)) {
				td.textContent = value.toString();
			} else if (Number.isNaN(value)) {
				td.textContent = "NaN";
			} else {
				td.textContent = "-";
			}
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
 * @param solverTimeStats - An object where each key is the name of a solver and each value is another object that holds statistical metrics (average, min, max, std, sum, and percentiles) for the solver's runtime.
 * @param {string} title - A string that will be used as the table caption.
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
	statisticsTableDiv.innerHTML = "";
	statisticsTableDiv.classList.add("table-responsive", "me-3", "ms-1");

	const statisticsTable = document.createElement("table");
	statisticsTable.classList.add(
		"table",
		"table-bordered",
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

/**
 * Function to dynamically create and display a HTML table based on the comparison summary of two solvers.
 * The cell values are clickable and display a list of instances where the solver time was better, worse, or equal, depending on the clicked cell.
 *
 * @param comparisonSummary - An object that holds the comparison summary of two solvers.
 * The object has three keys: better, worse, and equal, and each key holds the number of instances where the first solver was better, worse, or equal to the second solver.
 * @param comparisonSummaryInverse - Inverse comparison summary of the two solvers.
 * @param {string} solver1Name - The name of the first solver.
 * @param {string} solver2Name - The name of the second solver.
 *
 * @remarks
 * This function generates a new table displaying the comparison summary of two solvers. The table is added to the 'comparisonTableContainer' HTML div.
 */
export function ComparisonSummaryTable(
	comparisonSummary,
	comparisonSummaryInverse,
	solver1Name: string,
	solver2Name: string
): void {
	if (!comparisonTableDiv) return;

	comparisonTableDiv.innerHTML = "";
	comparisonTableDiv.classList.add("table-responsive", "me-3", "ms-1");

	const comparisonTable = document.createElement("table");
	comparisonTable.classList.add(
		"table",
		"table-bordered",
		"table-hover",
		"table-sm"
	);

	const tableCaption = document.createElement("caption");
	tableCaption.textContent = Captions.COMPARISON_TABLE_CAPTION;
	comparisonTable.appendChild(tableCaption);

	const header = document.createElement("thead");
	header.classList.add("table-light");

	const headerRow = document.createElement("tr");
	headerRow.appendChild(document.createElement("th"));
	headerRow.appendChild(CreateHeaderCell(solver1Name));
	headerRow.appendChild(CreateHeaderCell(solver2Name));
	header.appendChild(headerRow);

	comparisonTable.appendChild(header);

	const tableBody = document.createElement("tbody");
	const comparisons = ["Better", "Worse", "Equal"];
	comparisons.forEach((comparison) => {
		const row = document.createElement("tr");
		row.appendChild(CreateCell(comparison));

		let value1: number, value2: number;
		switch (comparison) {
			case "Better":
				value1 = comparisonSummary.better;
				value2 = comparisonSummaryInverse.better;
				break;
			case "Worse":
				value1 = comparisonSummary.worse;
				value2 = comparisonSummaryInverse.worse;
				break;
			case "Equal":
				value1 = comparisonSummary.equal;
				value2 = comparisonSummaryInverse.equal;
				break;
		}

		row.appendChild(
			CreateClickableCell(value1, comparison, comparisonSummary.details)
		);
		row.appendChild(
			CreateClickableCell(value2, comparison, comparisonSummaryInverse.details)
		);

		tableBody.appendChild(row);
	});

	comparisonTable.appendChild(tableBody);
	comparisonTableDiv.appendChild(comparisonTable);
}

function CreateHeaderCell(text: string): HTMLTableCellElement {
	const th = document.createElement("th");
	th.textContent = text;
	return th;
}

function CreateCell(text: string): HTMLTableCellElement {
	const td = document.createElement("td");
	td.classList.add("fw-bold");
	td.textContent = text;
	return td;
}

function CreateClickableCell(
	value,
	comparisonType,
	details
): HTMLTableCellElement {
	const td = document.createElement("td");

	switch (comparisonType) {
		case "Better":
			td.classList.add("table-success");
			break;
		case "Worse":
			td.classList.add("table-danger");
			break;
		case "Equal":
			td.classList.add("table-warning");
			break;
	}
	td.textContent = value.toString();
	td.style.cursor = "pointer";
	td.onclick = (): void => DisplayDetails(comparisonType, details);
	return td;
}

function DisplayDetails(comparisonType, details): void {
	const filteredDetails = details.filter(
		(detail) => detail.comparison === comparisonType.toLowerCase()
	);

	if (solverComparisonModalLabel)
		solverComparisonModalLabel.innerHTML = `<i class="bi bi-clock-history"></i> ${Captions.COMPARSION_MODAL_LABEL} ${comparisonType}`;
	if (solverComparisonModalBody) {
		solverComparisonModalBody.innerHTML = "";
		const listGroup = document.createElement("ul");
		listGroup.className = "list-group";

		filteredDetails.forEach((detail) => {
			const listItem = document.createElement("li");
			listItem.className = "list-group-item";
			listItem.innerHTML = `${detail.InputFileName}, <b>${detail.time1}</b> compared to <b>${detail.time2}</b>`;
			listGroup.appendChild(listItem);
		});

		solverComparisonModalBody.appendChild(listGroup);
	}

	const modal = new Modal(solverComparisonModal, {
		keyboard: true
	});
	modal.show();
}
