export function DisplayData(Solvers, Problems, data1, data2, data3) {
    // let displayDataElement = document.getElementById('main'); 
    // displayDataElement.innerHTML = filteredData;

    // Create the table header.
    let ResultThead = "";
    for (var i = 0; i < Solvers.length; i++) {
        ResultThead += "<th>" + Solvers[i]+ "</th>";
    }
    console.log(ResultThead)
    const NewDataTable = document.createElement("table");
    NewDataTable.innerHTML = "<tr><th>Instance</th>" + ResultThead + "</tr>";

    // Add the data to the div.
    const DivToUse = document.getElementById("main");
    DivToUse.appendChild(NewDataTable);

    let ResultRow1 = "";
    let ResultRow2 = "";
    let ResultRow3 = "";
    let ResultRow4 = "";

    for (var i = 0; i < Problems.length; i++) {
        //console.log(Problems[i]);
        ResultRow1 += "<td>" + Problems[i] + "</td>";
        ResultRow2 += "<td>" + data1[i] + "</td>";
        ResultRow3 += "<td>" + data2[i] + "</td>";
        ResultRow4 += "<td>" + data3[i] + "</td>";
    }
}