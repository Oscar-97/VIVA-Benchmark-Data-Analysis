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
		return Array.from(row.querySelectorAll("td")).reduce((obj, cell, j) => {
			obj[headers[j]] = cell.textContent;
			return obj;
		}, {});
	});

	return traceData;
}

/**
 * This function collects data from the filtered rows in the datatable and returns it as an array of objects.
 * @returns An array of objects, each representing a row of data from the table. The keys in each object correspond to the table's headers,
 * and the values correspond to the cell data in the corresponding row.
 */
export function GetFilteredRows(): TraceData[] {
	function RemapObjectProperties(objects): TraceData[] {
		return objects.map((obj) => {
			const remappedObj = {};
			for (const key in obj) {
				const newKey = ReversedTraceHeaderMap[key] || key;
				remappedObj[newKey] = obj[key];
			}
			return remappedObj;
		});
	}

	const table = $("#dataTableGenerated").DataTable();
	const data = table.rows({ search: "applied" }).data().toArray();
	const headers = table
		.columns()
		.header()
		// @ts-ignore-line
		.toArray()
		.map((header) => $(header).text());
	const objects = data.map((row) => {
		return headers.reduce((obj, header, index) => {
			obj[header] = row[index];
			return obj;
		}, {});
	});

	return RemapObjectProperties(objects);
}
