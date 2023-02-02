/**
 * Update the problemlist with the selected rows.
 * @returns ProblemList
 */
export function UpdateProblemList() {
    /**
     * @params Rows Select all rows with the class "selected".
     * @params data Store the data for the selected rows.
     */
    // 
    const Rows = document.querySelectorAll(".row-selected-problems");
    console.log("Rows ProblemList: ", Rows);
    const ProblemList: any[] = [];

    for (let i = 0; i < Rows.length; i++) {

        const row = Rows[i] as HTMLTableRowElement;

        if (row.tagName === "TR") {
            const cell = row.cells[0];
            const cellData = cell.textContent;
            ProblemList.push(cellData);
        }
    }
    return ProblemList;
}

/**
 * Update the results data with the selected rows.
 * @returns ResultsData
 */
export function UpdateResultsData() {
    // select all rows with the class "selected"
    /**
     * @params rows Select all rows with the class "selected".
     * @params data Store the data for the selected rows.
     */
    const Rows = document.querySelectorAll(".row-selected-problems");
    console.log("Rows ResultsData: ", Rows);
    const ResultsData: any[] = [];

    for (let i = 0; i < Rows.length; i++) {

        const Row = Rows[i] as HTMLTableRowElement;

        if (Row.tagName === "TR") {
            const Cells = Row.cells as HTMLCollectionOf<HTMLTableCellElement>;
            const RowData = [];
            for (let j = 1; j < Cells.length; j++) {
                const CellData = Cells[j].textContent;
                RowData.push(CellData);
            }
            ResultsData.push(RowData);
        }
    }
    return ResultsData;
}

/**
 * Update the trc data with the selected rows.
 * @returns TrcData
 */
export function UpdateResultsTrc() {
    /**
     * Create the keys from the table headers.
     */
    let Headers = document.querySelectorAll("th");
    let ResultData = {};
    for (let i = 0; i < Headers.length; i++) {
        ResultData[Headers[i].innerText] = "";
    }

    /**
     * Set the values as the selected rows.
     */
    let Rows = document.querySelectorAll(".row-selected-problems");
    let TrcData = [];

    Rows.forEach(function (row) {
        let Obj = Object.assign({}, ResultData);
        let Cells = row.querySelectorAll("td");
        Cells.forEach((cell, j) => {
            Obj[Headers[j].innerText] = cell.innerText;
        });
        TrcData.push(Obj);
    });
    return TrcData;
}