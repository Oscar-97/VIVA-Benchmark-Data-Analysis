export function TableSearch() {
    const SearchInput = document.getElementById("tableSearch") as HTMLInputElement;
    const SearchValue = SearchInput.value.toUpperCase();
    const TableToSearch = document.getElementById("dataTableGenerated") as HTMLTableElement;
    const TableRow = TableToSearch.getElementsByTagName("tr") as HTMLCollectionOf<HTMLTableRowElement>;
    let DataCell: string | any[] | HTMLCollectionOf<HTMLTableCellElement>, FoundProblem: boolean;

    // Ignore the two first header rows.
    /**
     * @param DataCell Each cell in the table.
     * @param FoundProblem If false, changes the table cell display attribute to be hidden.
     */
    for (let i = 2; i < TableRow.length; i++) {
        DataCell = TableRow[i].getElementsByTagName("th") as HTMLCollectionOf<HTMLTableCellElement>;
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