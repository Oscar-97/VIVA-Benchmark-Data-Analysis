import {
	comparisonTableDiv,
	dataTable,
	instanceAttributesTableDiv,
	solveAttributesTableDiv,
	solverComparisonModal,
	solverComparisonModalBody,
	solverComparisonModalLabel,
	statisticsTableDiv
} from "../Elements/Elements";
import { TraceHeaderMap } from "../Constants/TraceHeaders";
import "bootstrap/dist/css/bootstrap.min.css";
import Modal from "bootstrap/js/dist/modal";
import { Captions } from "../Constants/Messages";
import {
	CalculateInstanceAttributes,
	CalculateSolveAttributes,
	ExtractUniqueProblems
} from "../DataProcessing/CalculateResults";

/**
 * This function sorts the keys by an enumeration and then by alphabetical order for non-enumeration keys.
 *
 * @param obj - The object whose keys are to be sorted.
 *
 * @returns An array of strings representing the sorted keys of the object.
 * First, the keys that are present in the `TraceHeaderMap` enum are sorted based on their order in the enum.
 * Then, the remaining keys not in the enum are sorted alphabetically.
 */
function SortKeysByEnum(obj: object): string[] {
	const enumKeys: string[] = Object.keys(TraceHeaderMap);
	const objKeys: string[] = Object.keys(obj);

	const sortedEnumKeys: string[] = objKeys
		.filter((key: string) => {
			return enumKeys.includes(key);
		})
		.sort((a: string, b: string) => {
			return enumKeys.indexOf(a) - enumKeys.indexOf(b);
		});

	const nonEnumKeys: string[] = objKeys
		.filter((key: string) => {
			return !enumKeys.includes(key);
		})
		.sort();

	return [...sortedEnumKeys, ...nonEnumKeys];
}

/**
 * This function dynamically creates and displays a HTML table based on the provided trace data.
 *
 @param {object[]} traceData - Array of objects containing the result data.
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
 *   {Solver: "SolverA", SolverTime: 10, ObjectiveValue: 100},
 *   {Solver: "SolverB", SolverTime: 20, ObjectiveValue: 200}
 * ];
 * TableDataTrc(traceData);
 * ```
 * This example will generate a table with two rows and three columns (Solver, SolverTime, and ObjectiveValue).
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
 * This function dynamically creates and displays a HTML table based on solver's time statistics.
 *
 * @param solverTimeStats - An object where each key is the name of a solver and each value is another object that holds statistical metrics (average, min, max, std, sum, and percentiles) for the solver's runtime.
 * @param {string} title - A string that will be used as the table caption.
 *
 * @remarks
 * The table is added to the 'statisticsTable' HTML div.
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
	const statisticsTable = document.createElement("table");
	statisticsTable.id = "statisticsTable_inner";
	statisticsTable.classList.add(
		"table",
		"table-bordered",
		"table-hover",
		"table-sm"
	);

	const tableCaption = document.createElement("caption");
	tableCaption.textContent = title + " statistics.";
	statisticsTable.appendChild(tableCaption);

	const header = statisticsTable.createTHead();
	header.classList.add("table-light");
	const headerRow = header.insertRow();
	const headers = [
		"Solver",
		"Average",
		"Min",
		"Max",
		"Std. Dev",
		"Sum",
		"10th %",
		"25th %",
		"50th %",
		"75th %",
		"90th %"
	];
	headers.forEach((headerText) => {
		const headerCell = document.createElement("th");
		headerCell.textContent = headerText;
		headerRow.appendChild(headerCell);
	});

	/**
	 * Create value table rows.
	 */
	const tableBody = statisticsTable.createTBody();
	const dataKeys = Object.keys(solverTimeStats);
	dataKeys.forEach((dataKey) => {
		const row = tableBody.insertRow();
		const nameCell = row.insertCell();
		nameCell.textContent = dataKey;
		nameCell.style.fontWeight = "bold";

		const dataValues = Object.values(solverTimeStats[dataKey]);
		dataValues.forEach((dataValue) => {
			const cell = row.insertCell();
			cell.textContent = dataValue.toString();
		});
	});

	statisticsTableDiv.appendChild(statisticsTable);
}

/**
 * This function dynamically creates and displays a HTML table based on the comparison summary of two solvers.
 * The cell values are clickable and display a list of instances where the solver time was better, worse, or equal, depending on the clicked cell.
 *
 * @param comparisonSummary - An object that holds the comparison summary of two solvers.
 * The object has three keys: better, worse, and equal, and each key holds the number of instances where the first solver was better, worse, or equal to the second solver.
 * @param comparisonSummaryInverse - Inverse comparison summary of the two solvers.
 * @param {string} solver1Name - The name of the first solver.
 * @param {string} solver2Name - The name of the second solver.
 *
 * @remarks
 * The table is added to the 'comparisonTableContainer' HTML div.
 */
interface ComparisonSummary {
	better: number;
	worse: number;
	equal: number;
	details: ComparisonDetail;
}

interface ComparisonDetail {
	InputFileName: string;
	time1: number;
	time2: number;
	comparison: string;
}

export function ComparisonSummaryTable(
	comparisonSummary: ComparisonSummary,
	comparisonSummaryInverse: ComparisonSummary,
	solver1Name: string,
	solver2Name: string
): void {
	if (!comparisonTableDiv) return;

	comparisonTableDiv.innerHTML = "";

	const comparisonTable: HTMLTableElement = document.createElement("table");
	comparisonTable.classList.add(
		"table",
		"table-bordered",
		"table-hover",
		"table-sm"
	);

	const tableCaption: HTMLTableCaptionElement =
		document.createElement("caption");
	tableCaption.textContent = Captions.COMPARISON_TABLE_CAPTION;
	comparisonTable.appendChild(tableCaption);

	const header: HTMLTableSectionElement = comparisonTable.createTHead();
	header.classList.add("table-light");

	const headerRow: HTMLTableRowElement = header.insertRow();
	const headers: string[] = ["Comparison", solver1Name, solver2Name];
	headers.forEach((headerText) => {
		const headerCell: HTMLTableCellElement = document.createElement("th");
		headerCell.textContent = headerText;
		headerRow.appendChild(headerCell);
	});

	const tableBody: HTMLTableSectionElement = comparisonTable.createTBody();
	const comparisons: string[] = ["Better", "Worse", "Equal"];
	comparisons.forEach((comparison) => {
		const row: HTMLTableRowElement = document.createElement("tr");
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

	comparisonTableDiv.appendChild(comparisonTable);
}

/**
 * This function creates a cell element with the specified text content.
 *
 * @param text - The text content of the cell.
 * @returns The created cell element.
 */
function CreateCell(text: string): HTMLTableCellElement {
	const td = document.createElement("td");
	td.classList.add("fw-bold");
	td.textContent = text;
	return td;
}

/**
 * This function creates a clickable cell element with the specified text content and comparison type.
 *
 * @param value - The text content of the cell.
 * @param comparisonType - The comparison type of the cell.
 * @param details - The details of the comparison.
 * @returns The created clickable cell element.
 */
function CreateClickableCell(
	value: number,
	comparisonType: string,
	details: ComparisonDetail | undefined
): HTMLTableCellElement {
	const td: HTMLTableCellElement = document.createElement("td");

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

/**
 * This function displays a modal with the details of the comparison of two solvers.
 *
 * @param comparisonType - The comparison type of the details to be displayed.
 * @param details - An array of objects representing the details of the comparison.
 *
 * @remarks
 * The modal is added to the 'solverComparisonModal' HTML div.
 */
function DisplayDetails(comparisonType: string, details): void {
	const filteredDetails = details.filter(
		(detail) => detail.comparison === comparisonType.toLowerCase()
	);

	if (solverComparisonModalLabel)
		solverComparisonModalLabel.innerHTML = `<i class="bi bi-clock-history"></i> ${Captions.COMPARSION_MODAL_LABEL} ${comparisonType}`;
	if (solverComparisonModalBody) {
		solverComparisonModalBody.innerHTML = "";
		const listGroup = document.createElement("ul");
		listGroup.className = "list-group";

		filteredDetails.forEach((detail: ComparisonDetail) => {
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

/**
 * This function dynamically creates and displays a HTML table based on the problem statistics.
 * The table contains the statistics of the number of equations, variables, discrete variables, non-zeros, nonlinear non-zeros, primal bound problem, and dual bound problem.
 * @param {object[]} traceData - Array of objects containing the result data.
 */
export function InstanceAttributesTable(traceData: object[]): void {
	console.log(traceData);
	instanceAttributesTableDiv.innerHTML = "";
	const instanceAttributesTable = document.createElement("table");
	instanceAttributesTable.id = "instanceAttributesTable_inner";
	instanceAttributesTable.classList.add(
		"table",
		"table-bordered",
		"table-hover",
		"table-sm"
	);

	const tableCaption = document.createElement("caption");
	tableCaption.textContent = Captions.INSTANCE_ATTRIBUTES_TABLE_CAPTION;
	instanceAttributesTable.appendChild(tableCaption);

	const uniqueData = ExtractUniqueProblems(traceData);
	const calculationResults = CalculateInstanceAttributes(uniqueData);

	const header = instanceAttributesTable.createTHead();
	header.classList.add("table-light");
	const headerRow = header.insertRow();
	const headers = [
		"Instance attribute",
		"Count",
		"Average",
		"Min",
		"Max",
		"Std. Dev",
		"10th %",
		"25th %",
		"50th %",
		"75th %",
		"90th %"
	];
	headers.forEach((headerText) => {
		const headerCell = document.createElement("th");
		headerCell.textContent = headerText;
		headerRow.appendChild(headerCell);
	});

	const tableBody = instanceAttributesTable.createTBody();
	Object.entries(calculationResults).forEach(([key, values]) => {
		const row = tableBody.insertRow();
		const nameCell = row.insertCell();
		nameCell.textContent = key;
		nameCell.style.fontWeight = "bold";

		Object.entries(values).forEach(([value]) => {
			const cell = row.insertCell();
			cell.textContent = String(value);
		});
	});

	instanceAttributesTableDiv.appendChild(instanceAttributesTable);
}

/**
 * This function dynamically creates and displays a HTML table based on the solve attributes.
 * @param {object[]} traceData - Array of objects containing the result data.
 */
export function SolveAttributesTable(traceData: object[]): void {
	solveAttributesTableDiv.innerHTML = "";
	const solveAttributesTable = document.createElement("table");
	solveAttributesTable.id = "solveAttributesTable_inner";
	solveAttributesTable.classList.add(
		"table",
		"table-bordered",
		"table-hover",
		"table-sm"
	);

	const tableCaption = document.createElement("caption");
	tableCaption.textContent = Captions.SOLVE_ATTRIBUTES_TABLE_CAPTION;
	solveAttributesTable.appendChild(tableCaption);

	const specificKeys = [
		"JulianDate",
		"SolverStatus",
		"PrimalBoundSolver",
		"DualBoundSolver",
		"PrimalGap",
		"DualGap",
		"Gap_Solver",
		"SolverTime",
		"NumberOfIterations",
		"NumberOfDomainViolations",
		"NumberOfNodes"
	];
	const statistics = CalculateSolveAttributes(traceData, specificKeys);

	const header = solveAttributesTable.createTHead();
	header.classList.add("table-light");
	const headerRow = header.insertRow();
	const headers = [
		"Solve attribute",
		"Count",
		"Average",
		"Min",
		"Max",
		"Std. Dev",
		"10th %",
		"25th %",
		"50th %",
		"75th %",
		"90th %"
	];

	headers.forEach((headerText) => {
		const headerCell = document.createElement("th");
		headerCell.textContent = headerText;
		headerRow.appendChild(headerCell);
	});

	const tableBody = solveAttributesTable.createTBody();
	Object.entries(statistics).forEach(([key, values]) => {
		const row = tableBody.insertRow();
		const nameCell = row.insertCell();
		nameCell.textContent = key;
		nameCell.style.fontWeight = "bold";

		Object.entries(values).forEach(([value]) => {
			const cell = row.insertCell();
			cell.textContent = String(value);
		});
	});

	solveAttributesTableDiv.appendChild(solveAttributesTable);
}
