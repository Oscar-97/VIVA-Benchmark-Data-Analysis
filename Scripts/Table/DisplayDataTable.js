export function DisplayDataTable(Instance, Solvers, InstanceLabels, DataLabels, Problems, ResultsData) {
    // Create the table element.
    const NewDataTable = document.createElement("table");
    NewDataTable.className="table table-bordered";

    // Create the table header.
    let ResultThead = "";
    for (var i = 0; i < InstanceLabels.length; i++){
        ResultThead += "<th scope='col'>" + InstanceLabels[i]+ "</th>";
    }
    for (var i = 0; i < DataLabels.length; i++) {
        ResultThead += "<th>" + DataLabels[i]+ "</th>";
    }

    // Add the data to the div.
    const DivToUse = document.getElementById("dataTable");
    DivToUse.appendChild(NewDataTable);

    let tableData = "";
    console.log("Problems length: ", Problems.length)
    for (var i = 0; i < Problems.length; i++) {
        // Result row. Reset in every loop.
        let resultRow = "";
        ResultsData[i].forEach( element => {
            resultRow += "<td>" + element + "</td>";
        })
        // Header for each row.
        tableData += "<tr>" + "<th scope='row'>"+ Problems[i] + "</th>" + resultRow + "</tr>";
    }
    // Create the table.
    NewDataTable.innerHTML = "<thead><tr>" + ResultThead + "</tr></thead>" 
    + "<tbody>" + tableData + "</tbody>";

    console.log("Length of ResultsData: ", ResultsData.length)
    console.log("Data in non functioning index", ResultsData[404])
}