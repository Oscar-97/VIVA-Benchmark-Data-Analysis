export function TableSearch() {
    let SearchInput = document.getElementById("tableSearch");
    let SearchValue = SearchInput.value.toUpperCase();
    let TableToSearch = document.getElementById("dataTableGenerated");
    let tr = TableToSearch.getElementsByTagName("tr");
    let td, found;

    for (let i = 2; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("th");
        for (let j = 0; j < td.length; j++) {
            if (td[j].innerHTML.toUpperCase().indexOf(SearchValue) > -1) {
                found = true;
            }
        }
        if (found) {
            tr[i].style.display = "";
            found = false;
        } else {
            tr[i].style.display = "none";
        }
    }
}