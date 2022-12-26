export function TableDisplayData(Instance: string, Solvers: string | any[], InstanceLabels: string | any[], DataLabels: any[], Problems: string | any[], ResultsData: any[], ComparisonArray: any[]) {
    /**
     * Check if comparison array is used or not used, then remove 8 elements from Datalabels and in each row of ResultsData.
     */
    let NewResultsData: any[][];
    let NewDataLabels: any[];
    console.log("NewDataLabels length: ", NewDataLabels);
    console.log("NewResultsData length: ", NewResultsData);

    /**
     * Remove DataLabels that are not used.
     * @param NewDataLabels New data labels.
     * @param StartLabel Starting label.
     * @param EndLabel Ending label.
     */
    NewDataLabels = [];
    ComparisonArray.forEach((element: string, index: number) => {
        if (element === "Used") {
            const StartLabel = index * 8;
            const EndLabel = index * 8 + 8;
            let tempArray = [];
            tempArray = DataLabels.slice(StartLabel, EndLabel);
            tempArray.forEach(element => {
                NewDataLabels.push(element);
            })
        }
    })

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
    })
    console.log("Columns to use: ", ColumnsToUse);
    NewResultsData = ResultsData.map((r: any[]) => ColumnsToUse.map(i => r[i]));
    console.log("NewResultsData after modifications: ", NewResultsData);

    /**
     * @param DataTableDiv Div that contains the data table.
     */
    const DataTableDiv = document.getElementById("dataTable") as HTMLDivElement;
    DataTableDiv.innerHTML = "";

    /**
     * @param InstanceSolversThead Thead for instance and solvers.
     */
    let InstanceSolversThead = "<thead class='thead-dark' <tr>" + "<th colspan='7'>" + Instance + "</th>";
    for (let i = 0; i < Solvers.length; i++) {
        InstanceSolversThead += "<th colspan='8'>" + Solvers[i] + "</th>";
    }
    InstanceSolversThead += "</tr></thead>";

    /**
     * @param ResultThead Thead for instance and data labels.
     */
    let ResultThead = "<thead class='thead-dark' id='datalabelsThead'><tr>";
    for (let i = 0; i < InstanceLabels.length; i++) {
        ResultThead += "<th scope='col'>" + InstanceLabels[i] + "</th>";
    }
    for (let i = 0; i < NewDataLabels.length; i++) {
        ResultThead += "<th>" + NewDataLabels[i] + "</th>";
    }
    ResultThead += "</tr></thead>";

    /**
     * @param NewResultsData Contains all the result data and the table tags.
     * @param ResultRow Result row, reset in every loop.
     */
    let DataTable = "<tbody>";
    console.log("Problems length: ", Problems.length)
    for (let i = 0; i < Problems.length; i++) {
        let ResultRow = "";
        NewResultsData[i].forEach((element: string) => {
            ResultRow += "<td>" + element + "</td>";
        })
        // Header for each row.
        DataTable += "<tr>" + "<th scope='row'>" + Problems[i] + "</th>" + ResultRow + "</tr>";
    }
    DataTable += "</tbody>";

    /**
     * Create the table element.
     * @param NewDataTable Table element which is built with InstanceSolversThead, ResultThead and DataTable.
     */
    const NewDataTable = document.createElement("table") as HTMLTableElement;
    NewDataTable.className = "table table-bordered table-sm";
    NewDataTable.id = "dataTableGenerated";
    NewDataTable.innerHTML = InstanceSolversThead + ResultThead + DataTable;

    /**
     * Add the data to the div.
     */
    DataTableDiv.appendChild(NewDataTable);

    /**
     * @param TableSearch Table search element.
     */
    const TableSearch = document.getElementById("tableSearch") as HTMLInputElement;
    if (!document.body.contains(TableSearch)) {
        const NewTableSearch = document.createElement('input') as HTMLInputElement;
        NewTableSearch.id = "tableSearch";
        NewTableSearch.type = "text";
        NewTableSearch.className = "form-control";
        NewTableSearch.placeholder = "Search for a problem...";
        document.getElementById("tableFilters").appendChild(NewTableSearch);
    }

    /**
     * @param DownloadCSVButton Download CSV button element.
     */
    const DownloadCSVButton = document.getElementById("downloadCSVButton") as HTMLButtonElement;
    if(!document.body.contains(DownloadCSVButton)) {
        const NewDownloadCSVButton = document.createElement('a') as HTMLAnchorElement;
        NewDownloadCSVButton.id = "downloadCSVButton";
        NewDownloadCSVButton.type = "button";
        NewDownloadCSVButton.className = "btn btn-success btn-sm";
        NewDownloadCSVButton.innerHTML = "Download CSV";
        document.getElementById("buttonField").appendChild(NewDownloadCSVButton);
    }
}