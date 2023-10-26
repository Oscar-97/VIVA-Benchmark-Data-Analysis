/**
 * Collects data from the selected rows in an HTML table and returns it as an array of objects.
 *
 * @returns An array of objects, each representing a row of data from the table. The keys in each object correspond to the table's headers, and the values correspond to the cell data in the corresponding row.
 *
 * @remarks
 * This function fetches all the headers from the HTML table with class `.thead-dark th` and stores them in an array.
 * It then selects all rows with the `.row-selected-problems` class and for each row, it creates an object.
 * The keys of this object are the headers and the values are the corresponding cells' text content.
 * This way, it effectively "translates" the table data into a more easily manipulable format (an array of objects).
 */
export function UpdateResults(): object[] {
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
