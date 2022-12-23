export function TableDisplayData(Instance: string, Solvers: string | any[], InstanceLabels: string | any[], DataLabels: any[], Problems: string | any[], ResultsData: any[], ComparisonArray: any[]) {
    // Check if comparison array is used or not used, then remove 8 elements from Datalabels and in each row of ResultsData.
    let NewResultsData: any[][];
    let NewDataLabels: any[];
    console.log("NewDataLabels length: ", NewDataLabels);
    console.log("NewResultsData length: ", NewResultsData);

    // New data labels.
    NewDataLabels = [];
    ComparisonArray.forEach((element: string, index: number) => {
        if (element === "Used") {
            // Remove DataLabels that are not used.
            // Start index to end index.
            const StartLabel = index * 8;
            const EndLabel = index * 8 + 8;
            let tempArray = [];
            tempArray = DataLabels.slice(StartLabel, EndLabel);
            tempArray.forEach(element => {
                NewDataLabels.push(element);
            })
        }
    })

    // Set the columns to always use the instance data.
    const ColumnsToUse = [0, 1, 2, 3, 4, 5];
    // Check which solvers to use.
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

    // Empty the div that will contain the dataTable.
    const DataTableDiv = document.getElementById("dataTable");
    DataTableDiv.innerHTML = "";

    // Create thead with instance and solvers.
    let InstanceSolversThead = "<thead class='thead-dark' <tr>" + "<th colspan='7'>" + Instance + "</th>";
    for (let i = 0; i < Solvers.length; i++) {
        InstanceSolversThead += "<th colspan='8'>" + Solvers[i] + "</th>";
    }
    InstanceSolversThead += "</tr></thead>";

    // Create the thead with instance and data labels.
    let ResultThead = "<thead class='thead-dark' id='datalabelsThead'><tr>";
    for (let i = 0; i < InstanceLabels.length; i++) {
        ResultThead += "<th scope='col'>" + InstanceLabels[i] + "</th>";
    }
    for (let i = 0; i < NewDataLabels.length; i++) {
        ResultThead += "<th>" + NewDataLabels[i] + "</th>";
    }
    ResultThead += "</tr></thead>";

    let DataTable = "<tbody>";
    console.log("Problems length: ", Problems.length)
    for (let i = 0; i < Problems.length; i++) {
        // Result row. Reset in every loop.
        let ResultRow = "";
        NewResultsData[i].forEach((element: string) => {
            ResultRow += "<td>" + element + "</td>";
        })
        // Header for each row.
        DataTable += "<tr>" + "<th scope='row'>" + Problems[i] + "</th>" + ResultRow + "</tr>";
    }
    DataTable += "</tbody>";

    // Create the table element.
    const NewDataTable = document.createElement("table");
    NewDataTable.className = "table table-bordered table-sm";
    NewDataTable.id = "dataTableGenerated";
    NewDataTable.innerHTML = InstanceSolversThead + ResultThead + DataTable;

    // Add the data to the div.
    DataTableDiv.appendChild(NewDataTable);

    // Create a table search.
    const TableSearch = document.getElementById("tableSearch");
    if (!document.body.contains(TableSearch)) {
        const NewTableSearch = document.createElement('input');
        NewTableSearch.id = "tableSearch";
        NewTableSearch.type = "text";
        NewTableSearch.className = "form-control";
        NewTableSearch.placeholder = "Search for a problem...";
        document.getElementById("tableFilters").appendChild(NewTableSearch);
    }

    // Create a download CSV button.
    const DownloadCSVButton = document.getElementById("downloadCSVButton");
    if(!document.body.contains(DownloadCSVButton)) {
        const NewDownloadCSVButton = document.createElement('a');
        NewDownloadCSVButton.id = "downloadCSVButton";
        NewDownloadCSVButton.type = "button";
        NewDownloadCSVButton.className = "btn btn-success btn-sm";
        NewDownloadCSVButton.innerHTML = "Download CSV";
        document.getElementById("buttonField").appendChild(NewDownloadCSVButton);
    }
}