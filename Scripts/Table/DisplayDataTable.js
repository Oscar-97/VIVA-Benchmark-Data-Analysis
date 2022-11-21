export function DisplayDataTable(Instance, Solvers, InstanceLabels, DataLabels, Problems, ResultsData) {
    // Create the table element.
    const NewDataTable = document.createElement("table");
    NewDataTable.className="table table-bordered";

    let InstanceSolversThead = "<thead class='thead-dark'><tr>" + "<th colspan='7'>" + Instance + "</th>"
    for (var i = 0; i < Solvers.length; i++){
        // Create thead.
        InstanceSolversThead += "<th colspan='8'>" + Solvers[i] + "</th>";
    }

    InstanceSolversThead +=  "</tr></thead>"
    console.log(InstanceSolversThead)
    // Create the table header.
    let ResultThead = "";
    // Instance labels.
    for (var i = 0; i < InstanceLabels.length; i++){
        ResultThead += "<th scope='col'>" + InstanceLabels[i]+ "</th>";
    }
    // Data labels.
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
    NewDataTable.innerHTML = InstanceSolversThead + "<thead class='thead-dark'><tr>" + ResultThead + "</tr></thead>" 
    + "<tbody>" + tableData + "</tbody>";

    console.log("Length of ResultsData: ", ResultsData.length)
}