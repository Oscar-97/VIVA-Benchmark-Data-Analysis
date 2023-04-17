/**
 * Update the problemlist with the selected rows.
 * @returns ProblemList
 */
export function UpdateProblemList(): string[] {
  /**
   * @params Rows Select all rows with the class "selected".
   * @params data Store the data for the selected rows.
   */
  //
  const Rows = document.querySelectorAll(".row-selected-problems");
  console.log("Rows ProblemList: ", Rows);
  const ProblemList: string[] = [];

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
export function UpdateResultsData(): string[] {
  // select all rows with the class "selected"
  /**
   * @params rows Select all rows with the class "selected".
   * @params data Store the data for the selected rows.
   */
  const Rows = document.querySelectorAll(".row-selected-problems");
  console.log("Rows ResultsData: ", Rows);
  const ResultsData = [];

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
export function UpdateResultsTrc(): object[] {
  /**
   * Create the keys from the table headers.
   */
  const Headers = document.querySelectorAll("th");
  const ResultData = {};
  for (let i = 0; i < Headers.length; i++) {
    ResultData[Headers[i].innerText] = "";
  }

  /**
   * Set the values as the selected rows.
   */
  const Rows = document.querySelectorAll(".row-selected-problems");
  const TrcData = [];

  Rows.forEach(function (row) {
    const Obj = Object.assign({}, ResultData);
    const Cells = row.querySelectorAll("td");
    Cells.forEach((cell, j) => {
      Obj[Headers[j].innerText] = cell.innerText;
    });
    TrcData.push(Obj);
  });
  return TrcData;
}
