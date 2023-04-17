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
   */
  const DataTableHeaders = document.createElement("thead");
  DataTableHeaders.className = "thead-dark";
  const tr1 = document.createElement("tr");
  tr1.innerHTML = "<th colspan='7'>" + Instance + "</th>";
  for (let i = 0; i < Solvers.length; i++) {
    const th = document.createElement("th");
    th.colSpan = 8;
    th.innerHTML = Solvers[i];
    tr1.appendChild(th);
  }
  DataTableHeaders.appendChild(tr1);

  const tr2 = document.createElement("tr");
  for (let i = 0; i < InstanceLabels.length; i++) {
    const th = document.createElement("th");
    th.innerHTML = InstanceLabels[i];
    tr2.appendChild(th);
  }
  for (let i = 0; i < NewDataLabels.length; i++) {
    const th = document.createElement("th");
    th.innerHTML = NewDataLabels[i];
    tr2.appendChild(th);
  }
  DataTableHeaders.appendChild(tr2);

  /**
   * @param DataTableContent The content of the data table.
   * @param NewResultsData Contains all the result data and the table tags.
   */
  const DataTableContent = document.createElement("tbody");
  for (let i = 0; i < Problems.length; i++) {
    const tr3 = document.createElement("tr");
    const th3 = document.createElement("th");
    th3.scope = "row";
    th3.innerHTML = Problems[i];
    tr3.appendChild(th3);
    NewResultsData[i].forEach((element: string) => {
      const td3 = document.createElement("td");
      td3.innerHTML = element;
      tr3.appendChild(td3);
    });
    DataTableContent.appendChild(tr3);
  }

  /**
   * Create the table element.
   * @param NewDataTable Table element which is will contain all new content.
   */
  const NewDataTable = document.createElement("table") as HTMLTableElement;
  NewDataTable.className = "table table-bordered table-sm";
  NewDataTable.id = "dataTableGenerated";
  NewDataTable.appendChild(DataTableHeaders);
  NewDataTable.appendChild(DataTableContent);

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

  const DataTableHeaders = document.createElement("thead");
  DataTableHeaders.classList.add("thead-dark");

  /**
   * @param DataTableHeaders Thead created from the categories.
   */
  const headerRow = document.createElement("tr");
  for (const key of Object.keys(TrcData[0])) {
    if (key !== undefined) {
      const th = document.createElement("th");
      th.textContent = key;
      headerRow.appendChild(th);
    }
  }
  DataTableHeaders.appendChild(headerRow);

  /**
   * Add the results.
   * @param DataTableContent The content of the data table.
   */
  const DataTableContent = document.createElement("tbody");
  for (const obj of TrcData) {
    for (const Solver of CheckedSolvers) {
      if (Object.values(obj).includes(Solver)) {
        const Results = Object.values(obj);
        const resultRow = document.createElement("tr");
        for (let i = 0; i < Results.length; i++) {
          const td = document.createElement("td");
          td.textContent = Results[i];
          resultRow.appendChild(td);
        }
        DataTableContent.appendChild(resultRow);
      }
    }
  }

  /**
   * Data table body.
   */
  const NewDataTable = document.createElement("table");
  NewDataTable.classList.add("table", "table-bordered", "table-sm");
  NewDataTable.id = "dataTableGenerated";
  NewDataTable.appendChild(DataTableHeaders);
  NewDataTable.appendChild(DataTableContent);

  /**
   * Add the table to the div.
   */
  DataTableDiv.appendChild(NewDataTable);
}

export function StatisticsTable(SolverTimeStats: {
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
}, Title: string): void {
  /**
   * @param StatisticsTableDiv Div that contains the statistics table.
   */
  const StatisticsTableDiv = document.getElementById(
    "statisticsTable"
  ) as HTMLDivElement;
  StatisticsTableDiv.innerHTML = "";
  
  const NewStatisticsTable = document.createElement("table");
  NewStatisticsTable.classList.add("table", "table-bordered", "table-sm", "border-dark", "border-2");

  const TableCaption = document.createElement("caption");
  TableCaption.textContent = Title + " statistics.";

  const Header = document.createElement("thead")
  Header.classList.add("table-dark");
  
  const HeaderRow = document.createElement("tr");
  const DataLabel = document.createElement("th");
  DataLabel.textContent = "Summary";
  DataLabel.scope = "col";
  
  Header.appendChild(HeaderRow);
  HeaderRow.appendChild(DataLabel);

  NewStatisticsTable.appendChild(TableCaption);
  NewStatisticsTable.appendChild(Header);

  /**
   * Iterate ove each key in the SolverTimeStats and create a new table header element.
   */
  const UsedCategories: string[] = [];
  for (const ObjKey of Object.keys(SolverTimeStats)) {
    const Keys = Object.keys(SolverTimeStats[ObjKey]);
    Keys.forEach((key) => {
      if (!UsedCategories.includes(key)) {
        const th = document.createElement("th");
        th.textContent = key;
        th.scope = "col";
        HeaderRow.appendChild(th);
        UsedCategories.push(key);
      }
    });
  }

  /**
   * Create value table rows.
   */
  const DataKeys = Object.keys(SolverTimeStats);
  DataKeys.forEach((dataKey) => {
    const ValuesRow = document.createElement("tr");
    const DataType = document.createElement("th");
    DataType.scope = "row";
    DataType.textContent = dataKey;
    ValuesRow.appendChild(DataType);
    const DataValues = Object.values(SolverTimeStats[dataKey]);
    DataValues.forEach((dataValue) => {
      const td = document.createElement("td");
      td.textContent = dataValue.toString();
      ValuesRow.appendChild(td);
    });
    NewStatisticsTable.appendChild(ValuesRow);
  });

  /**
   * Add the final table to the div.
   */
  StatisticsTableDiv.appendChild(NewStatisticsTable);
}
