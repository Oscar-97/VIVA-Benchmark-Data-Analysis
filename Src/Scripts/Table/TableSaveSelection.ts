
export function UpdateProblemList() {
    /**
     * @params rows Select all rows with the class "selected".
     * @params data Store the data for the selected rows.
     */
    // 
    const rows = document.querySelectorAll(".row-selected-problems");
    console.log("Rows ProblemList: ", rows);
    const data: any[] = [];

    for (let i = 0; i < rows.length; i++) {

        const row = rows[i] as HTMLTableRowElement;

        if (row.tagName === "TR") {
            const cell = row.cells[0];
            const cellData = cell.textContent;
            data.push(cellData);
        }
    }
    return data;
}

export function UpdateResultsData() {
    // select all rows with the class "selected"
    /**
     * @params rows Select all rows with the class "selected".
     * @params data Store the data for the selected rows.
     */
    const rows = document.querySelectorAll(".row-selected-problems");
    console.log("Rows ResultsData: ", rows);
    const data: any[] = [];

    for (let i = 0; i < rows.length; i++) {

        const row = rows[i] as HTMLTableRowElement;

        if (row.tagName === "TR") {
            const cells = row.cells as HTMLCollectionOf<HTMLTableCellElement>;
            const rowData = [];
            for (let j = 1; j < cells.length; j++) {
                const cellData = cells[j].textContent;
                rowData.push(cellData);
            }
            data.push(rowData);
        }
    }
    return data;
}