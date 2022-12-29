import { SelectAllButton } from "../Elements/Elements";

export function SelectAllSolvers() {
    let FilterSolvers = document.getElementsByTagName("input");
    for (let Solver of FilterSolvers) {
        if (!Solver.checked && Solver.id != "fileInput") {
            Solver.click();
        }
    }
    SelectAllButton.disabled = true;
}