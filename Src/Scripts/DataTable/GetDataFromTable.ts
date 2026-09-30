import $ from "jquery";
import { ReversedTraceHeaderMap } from "../Constants/TraceHeaders";
import { TraceData } from "../Interfaces/Interfaces";

/**
 * This function collects data from the selected rows in an HTML table and returns it as an array of objects.
 *
 * @returns An array of objects, each representing a row of data from the table. The keys in each object correspond to the table's headers, and the values correspond to the cell data in the corresponding row.
 *
 * @remarks
 * This function fetches all the headers from the HTML table with class `.thead-dark th` and stores them in an array.
 * It then selects all rows with the `.row-selected-problems` class and for each row, it creates an object.
 * The keys of this object are the headers and the values are the corresponding cells' text content.
 * This way, it effectively converts the table data into a more easily manipulable format.
 */
export function GetSelectedRows(): object[] {
	const headers = Array.from(document.querySelectorAll(".thead-dark th")).map(
		(header) => {
			return header.textContent;
		}
	);

	const traceData = Array.from(
		document.querySelectorAll(".row-selected-problems")
	).map((row) => {
		return Array.from(row.querySelectorAll("td")).reduce(
			(obj: Record<string, string>, cell, j) => {
				obj[headers[j] ?? ""] = cell.textContent ?? "";
				return obj;
			},
			{} as Record<string, string>
		);
	});

	return traceData;
}

/**
 * This function collects data from the filtered rows in the datatable and returns it as an array of objects.
 * @returns An array of objects, each representing a row of data from the table. The keys in each object correspond to the table's headers,
 * and the values correspond to the cell data in the corresponding row.
 */
export function GetFilteredRows(): TraceData[] {
	function RemapObjectProperties(objects: any[]): TraceData[] {
		return objects.map((obj) => {
			const remappedObj: Record<string, any> = {};
			for (const key in obj) {
				const newKey =
					key in ReversedTraceHeaderMap
						? ReversedTraceHeaderMap[key as keyof typeof ReversedTraceHeaderMap]
						: key;
				remappedObj[newKey] = obj[key];
			}
			return remappedObj;
		});
	}

	const table = $("#dataTableGenerated").DataTable();
	const data = table.rows({ search: "applied" }).data().toArray();
	const headers: string[] = table
		.columns()
		.header()
		.toArray()
		.map((header: HTMLElement) => $(header).text());
	const objects = data.map((row) => {
		return headers.reduce(
			(obj: Record<string, any>, header, index) => {
				obj[header] = row[index];
				return obj;
			},
			{} as Record<string, any>
		);
	});

	return RemapObjectProperties(objects);
}
