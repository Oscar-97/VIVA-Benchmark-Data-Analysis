export function TableData(
  Instance: string,
  Solvers: string | string[],
  InstanceLabels: string | string[],
  DataLabels: string[],
  Problems: string | string[],
  ResultsData: string[],
  ComparisonArray: string[]
): void {
  /**
   * Remove DataLabels that are not used.
   * @param NewDataLabels New data labels.
   * @param StartLabel Starting label.
   * @param EndLabel Ending label.
   */
  const NewDataLabels = [];
  ComparisonArray.forEach((element: string, index: number) => {
    if (element === "Used") {
      const StartLabel = index * 8;
      const EndLabel = index * 8 + 8;
      let tempArray = [];
      tempArray = DataLabels.slice(StartLabel, EndLabel);
      tempArray.forEach((element) => {
        NewDataLabels.push(element);
      });
    }
  });

  /**
   * Check which solvers to use.
   * @param ColumnsToUse Set the columns to always use the instance data.
   */
  const ColumnsToUse = [0, 1, 2, 3, 4, 5];
  ComparisonArray.forEach((element: string, index: number) => {
    const StartValue = index * 8 + 6;
    const EndValue = index * 8 + 14;
    if (element === "Used") {
      for (let i = StartValue; i < EndValue; i++) {
        ColumnsToUse.push(i);
      }
    }
  });
  console.log("Columns to use: ", ColumnsToUse);
  const NewResultsData = ResultsData.map((r: string) =>
    ColumnsToUse.map((i) => r[i])
  );
  console.log("NewResultsData after modifications: ", NewResultsData);

  /**
   * @param DataTableDiv Div that contains the data table.
   */
  const DataTableDiv = document.getElementById("dataTable") as HTMLDivElement;
  DataTableDiv.innerHTML = "";

  /**
   * @param DataTableHeaders Thead created from instance and solvers on the first row, data labels on the second row.
   * Thead for instance and solvers.
   */
  let DataTableHeaders =
    "<thead class='thead-dark' <tr>" + "<th colspan='7'>" + Instance + "</th>";
  for (let i = 0; i < Solvers.length; i++) {
    DataTableHeaders += "<th colspan='8'>" + Solvers[i] + "</th>";
  }
  DataTableHeaders += "</tr> <tr>";

  for (let i = 0; i < InstanceLabels.length; i++) {
    DataTableHeaders += "<th>" + InstanceLabels[i] + "</th>";
  }
  for (let i = 0; i < NewDataLabels.length; i++) {
    DataTableHeaders += "<th>" + NewDataLabels[i] + "</th>";
  }
  DataTableHeaders += "</tr></thead>";

  /**
   * @param DataTableContent The content of the data table.
   * @param ResultRow Result row, reset in every loop.
   * @param NewResultsData Contains all the result data and the table tags.
   */
  let DataTableContent = "<tbody>";
  console.log("Problems length: ", Problems.length);
  for (let i = 0; i < Problems.length; i++) {
    let ResultRow = "";
    NewResultsData[i].forEach((element: string) => {
      ResultRow += "<td>" + element + "</td>";
    });
    /**
     * Header for each row.
     */
    DataTableContent +=
      "<tr>" + "<th scope='row'>" + Problems[i] + "</th>" + ResultRow + "</tr>";
  }
  DataTableContent += "</tbody>";

  /**
   * Create the table element.
   * @param NewDataTable Table element which is built with InstanceSolversThead, ResultThead and DataTable.
   */
  const NewDataTable = document.createElement("table") as HTMLTableElement;
  NewDataTable.className = "table table-bordered table-sm";
  NewDataTable.id = "dataTableGenerated";
  //NewDataTable.innerHTML = DataTableHeaders + ResultThead + DataTableContent;
  NewDataTable.innerHTML = DataTableHeaders + DataTableContent;

  /**
   * Add the table to the div.
   */
  DataTableDiv.appendChild(NewDataTable);
}

export function TableDataTrc(TrcData: string[], CheckedSolvers): void {
  /**
   * @param DataTableDiv Div that contains the data table.
   */
  const DataTableDiv = document.getElementById("dataTable") as HTMLDivElement;
  DataTableDiv.innerHTML = "";

  /**
   * @param DataTableHeaders Thead created from the categories.
   */
  let DataTableHeaders = "<thead class='thead-dark'> <tr>";

  /**
   * Add headers.
   */
  for (const key of Object.keys(TrcData[0])) {
    if (key !== undefined) {
      DataTableHeaders += "<th>" + `${key}` + "</th>";
    }
  }
  DataTableHeaders += "</tr> </thead>";

  /**
   * Add the results.
   * @param DataTableContent The content of the data table.
   */
  let DataTableContent = "<tbody>";
  for (const obj of TrcData) {
    {
      for (const Solver of CheckedSolvers) {
        if (Object.values(obj).includes(Solver)) {
          const Results = Object.values(obj);
          let ResultRow = "";
          for (let i = 0; i < Results.length; i++) {
            ResultRow += "<td>" + Results[i] + "</td>";
          }
          DataTableContent += "<tr>" + ResultRow + "</tr>";
        } else {
          continue;
        }
      }
    }
  }

  /**
   * Data table body.
   */
  DataTableContent += "</tbody>";

  const NewDataTable = document.createElement("table") as HTMLTableElement;
  NewDataTable.className = "table table-bordered table-sm";
  NewDataTable.id = "dataTableGenerated";
  NewDataTable.innerHTML = DataTableHeaders + DataTableContent;

  /**
   * Add the table to the div.
   */
  DataTableDiv.appendChild(NewDataTable);
}
