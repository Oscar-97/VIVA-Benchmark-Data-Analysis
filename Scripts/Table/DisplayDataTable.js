export function DisplayDataTable(Instance, Solvers, InstanceLabels, DataLabels, Problems, ResultsData, ComparisonArray) {
    
    // Solvers already fixed. Instancelabels are okay. Problems can be kept as they are.
    // Check if comparison array is used or notused, then remove 8 elements from Datalabels and in each row of ResultsData.
    let NewResultsData = ResultsData;
    let NewDataLabels = DataLabels;
    console.log("NewDataLabels length: ", NewDataLabels);
    console.log("NewResultsData length: ", NewResultsData);
    
    // New data labels.
    NewDataLabels = [];
    ComparisonArray.forEach( (element, index) => {
        if (element === "Used") {
            // Remove DataLabels that are not used.
            // Start index to end index.
            let StartLabel = index * 8;
            let EndLabel = index * 8 + 8;
            let tempArray = [];
            tempArray = DataLabels.slice(StartLabel , EndLabel);
            tempArray.forEach ( element => {
                NewDataLabels.push(element);
            })
        }
    })

    // New results data.
    // Set the columns to always use the instance data.
    let ColumnsToUse = [0, 1, 2, 3, 4, 5];
    
    // Check which solvers to use.
    ComparisonArray.forEach( (element, index) => {
        let StartValue = index * 8 + 6;
        let EndValue = index * 8 + 14;
        if (element === "Used") {
            for (var i = StartValue; i < EndValue; i++){
                ColumnsToUse.push(i);
            }
        }
    })
    let UniqueColumns = [...new Set(ColumnsToUse)];
    console.log("Columns to use: ", UniqueColumns);
    NewResultsData = ResultsData.map(r => UniqueColumns.map(i => r[i]));
    console.log("NewResultsData after modifications: ", NewResultsData);

    // Creating the table with results data.
    const DivToUse = document.getElementById("dataTable");
    // Clear it.
    DivToUse.innerHTML = "";
    
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
    // for (var i = 0; i < DataLabels.length; i++) {
    //     ResultThead += "<th>" + DataLabels[i]+ "</th>";
    // }
    for (var i = 0; i < NewDataLabels.length; i++) {
        ResultThead += "<th>" + NewDataLabels[i]+ "</th>";
    }

    // Add the data to the div.
    DivToUse.appendChild(NewDataTable);

    let tableData = "";
    console.log("Problems length: ", Problems.length)
    for (var i = 0; i < Problems.length; i++) {
        // Result row. Reset in every loop.
        let resultRow = "";
        /* Working */
        // ResultsData[i].forEach( element => {
        //     resultRow += "<td>" + element + "</td>";
        // })
        NewResultsData[i].forEach( element => {
            resultRow += "<td>" + element + "</td>";
        })
        // Header for each row.
        tableData += "<tr>" + "<th scope='row'>"+ Problems[i] + "</th>" + resultRow + "</tr>";
    }
    // Create the table.
    NewDataTable.innerHTML = InstanceSolversThead + "<thead class='thead-dark'><tr>" + ResultThead + "</tr></thead>" 
    + "<tbody>" + tableData + "</tbody>";

    NewResultsData = [];
    NewDataLabels = [];
}