export function TableSearch() {
    const SearchInput = document.getElementById("tableSearch");
    const SearchValue = SearchInput.value.toUpperCase();
    const TableToSearch = document.getElementById("dataTableGenerated");
    const TableRow = TableToSearch.getElementsByTagName("tr");
    let DataCell, FoundProblem;

    // Ignore the two first header rows.
    for (let i = 2; i < TableRow.length; i++) {
        DataCell = TableRow[i].getElementsByTagName("th");
        for (let j = 0; j < DataCell.length; j++) {
            if (DataCell[j].innerHTML.toUpperCase().indexOf(SearchValue) > -1) {
                FoundProblem = true;
            }
        }
        if (FoundProblem) {
            TableRow[i].style.display = "";
            FoundProblem = false;
        } else {
            TableRow[i].style.display = "none";
        }
    }
}