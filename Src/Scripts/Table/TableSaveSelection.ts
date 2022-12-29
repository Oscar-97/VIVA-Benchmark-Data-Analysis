// Add the following to a new SolvedData
// Instance + Used solvers
// Instance categories and DataLabels
// Then add the selected solvers from below.

export function UpdateProblemList(ProblemList) {
    // select all rows with the class "selected"
    const rows = document.querySelectorAll(".row-selected-problems");

    // create an array to store the data for the selected rows
    const data: any[] = [];

    // loop through the rows
    for (let i = 0; i < rows.length; i++) {
        // get the current row element
        const row = rows[i] as HTMLTableRowElement;

        // make sure the element is a table row element
        if (row.tagName === "TR") {
            // get the first cell in the row
            const cell = row.cells[0];

            // get the cell data
            const cellData = cell.textContent;

            // add the cell data to the data array
            data.push(cellData);
        }
    }
    return ProblemList = data;
}

export function UpdateResultsData(ResultsData) {
    // select all rows with the class "selected"
    const rows = document.querySelectorAll(".row-selected-problems");

    // create an array to store the data for the selected rows
    const data: any[] = [];

    // loop through the rows
    for (let i = 0; i < rows.length; i++) {
        // get the current row element
        const row = rows[i] as HTMLTableRowElement;

        // make sure the element is a table row element
        if (row.tagName === "TR") {
            // get the cells in the row
            const cells = row.cells as HTMLCollectionOf<HTMLTableCellElement>;

            // create an object to store the data for the row
            const rowData = [];

            // loop through the cells in the row
            for (let j = 1; j < cells.length; j++) {
                // get the cell data
                const cellData = cells[j].textContent;

                // add the cell data to the row data object
                rowData.push(cellData);
            }

            // add the row data object to the array
            data.push(rowData);
        }

    }
    return ResultsData = data;
}