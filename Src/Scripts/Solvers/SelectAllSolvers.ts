import { SelectAllButton } from "../Elements/Elements";

/**
 * Select all solvers by clicking on all inputs inside the checkboxContainer.
 */
export function SelectAllSolvers() {
    let CheckboxContainer = document.getElementById("checkboxContainer");
    let FilterSolvers = CheckboxContainer.getElementsByTagName("input");
    for (let Solver of FilterSolvers) {
        if (!Solver.checked) {
            Solver.click();
        }
    }
    SelectAllButton.disabled = true;
}