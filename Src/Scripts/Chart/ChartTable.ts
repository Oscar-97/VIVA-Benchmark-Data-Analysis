import { FindElement } from "../Elements/Elements";

/**
 * The most rows that the table of a chart shows. Every point of a line chart is a row.
 */
export const MAX_TABLE_ROWS = 20000;

/**
 * What the table of a chart needs from a data set.
 */
export interface TableDataset {
	label?: unknown;
	data: unknown[];
}

/**
 * The content of the table of a chart.
 */
export interface ChartTableContent {
	headers: string[];
	rows: string[][];
	/** Whether there were more rows than the table shows. */
	truncated: boolean;
}

/**
 * The data that the table of the shown chart is made of.
 */
export interface ChartTableSource {
	data: readonly TableDataset[];
	labels: readonly string[];
	title: string;
}

/**
 * A value as text for the table: numbers have at most six significant digits.
 */
function FormatValue(value: unknown): string {
	if (typeof value === "number") {
		return Number.isFinite(value)
			? String(Number(value.toPrecision(6)))
			: String(value);
	}
	return value === null || value === undefined ? "" : String(value);
}

function LabelOf(dataset: TableDataset, index: number): string {
	return typeof dataset.label === "string" && dataset.label !== ""
		? dataset.label
		: `Data set ${index + 1}`;
}

function IsPoint(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null && "x" in value;
}

/**
 * Makes the table of a chart from its data sets. The data sets of a bar or radar chart have a value for every
 * label, so the labels are the columns. The data sets of a line or bubble chart are points, so every point
 * is a row.
 *
 * @param datasets - The data sets of the chart.
 * @param labels - The labels of the chart, which the values of a bar or radar chart belong to.
 */
export function BuildChartTable(
	datasets: readonly TableDataset[],
	labels: readonly string[]
): ChartTableContent {
	const hasPoints = datasets.some((dataset) => dataset.data.some(IsPoint));
	return hasPoints
		? BuildPointTable(datasets)
		: BuildValueTable(datasets, labels);
}

function BuildValueTable(
	datasets: readonly TableDataset[],
	labels: readonly string[]
): ChartTableContent {
	const columns = Math.max(
		0,
		...datasets.map((dataset) => dataset.data.length)
	);
	const headers = [
		"Data set",
		...Array.from(
			{ length: columns },
			(_, index) => labels[index] ?? String(index + 1)
		)
	];
	const rows = datasets
		.slice(0, MAX_TABLE_ROWS)
		.map((dataset, index) => [
			LabelOf(dataset, index),
			...Array.from({ length: columns }, (_, column) =>
				FormatValue(dataset.data[column])
			)
		]);
	return { headers, rows, truncated: datasets.length > MAX_TABLE_ROWS };
}

function BuildPointTable(datasets: readonly TableDataset[]): ChartTableContent {
	const hasSize = datasets.some((dataset) =>
		dataset.data.some((point) => IsPoint(point) && "r" in point)
	);
	const headers = ["Data set", "X", "Y", ...(hasSize ? ["Size"] : [])];
	const rows: string[][] = [];
	let truncated = false;
	datasets.forEach((dataset, index) => {
		const name = LabelOf(dataset, index);
		for (const point of dataset.data) {
			if (!IsPoint(point)) {
				continue;
			}
			if (rows.length >= MAX_TABLE_ROWS) {
				truncated = true;
				return;
			}
			rows.push([
				name,
				FormatValue(point["x"]),
				FormatValue(point["y"]),
				...(hasSize ? [FormatValue(point["r"])] : [])
			]);
		}
	});
	return { headers, rows, truncated };
}

/**
 * Makes the HTML table of the content. The text is set as text, as it comes from the data.
 */
export function RenderTable(
	content: ChartTableContent,
	title: string
): HTMLTableElement {
	const table = document.createElement("table");
	table.className = "table table-sm table-striped mb-0";

	const caption = document.createElement("caption");
	caption.textContent = content.truncated
		? `Data of the chart ${title}. The first ${MAX_TABLE_ROWS} rows.`
		: `Data of the chart ${title}.`;
	table.append(caption);

	const head = table.createTHead().insertRow();
	for (const header of content.headers) {
		const cell = document.createElement("th");
		cell.scope = "col";
		cell.textContent = header;
		head.append(cell);
	}

	const body = table.createTBody();
	for (const row of content.rows) {
		const tableRow = body.insertRow();
		for (const value of row) {
			tableRow.insertCell().textContent = value;
		}
	}
	return table;
}

let open = false;
let wired = false;

/**
 * Shows the table of the chart in its place below the chart when it is open, or empties and hides the place.
 */
function Refresh(getSource: () => ChartTableSource | null): void {
	const container = FindElement<HTMLElement>("chartDataTableContainer");
	const button = FindElement<HTMLButtonElement>("chartTableToggleButton");
	if (!container) {
		return;
	}
	const source = open ? getSource() : null;
	if (source) {
		container.replaceChildren(
			RenderTable(BuildChartTable(source.data, source.labels), source.title)
		);
	} else {
		container.replaceChildren();
	}
	container.hidden = !source;
	if (button) {
		button.setAttribute("aria-expanded", String(source !== null));
		button.replaceChildren(
			Object.assign(document.createElement("i"), { className: "bi bi-table" }),
			source ? " Hide table" : " Show as table"
		);
	}
}

/**
 * Connects the button that shows the values of the chart as a table, and brings the table in line with the chart
 * that is shown now. The button is connected once, as the page keeps it while the chart is drawn again.
 *
 * @param getSource - The data of the chart that is shown now, if any.
 */
export function ConnectChartTable(
	getSource: () => ChartTableSource | null
): void {
	if (!wired) {
		const button = FindElement<HTMLButtonElement>("chartTableToggleButton");
		if (button) {
			wired = true;
			button.addEventListener("click", () => {
				open = !open;
				Refresh(getSource);
			});
		}
	}
	Refresh(getSource);
}
