import { SelectAllButton } from "../Elements/Elements";

/**
 * Select all solvers by clicking on all inputs inside the checkboxContainer.
 */
export function SelectAllSolvers(): void {
  const CheckboxContainer = document.getElementById("checkboxContainer");
  const FilterSolvers = CheckboxContainer.getElementsByTagName("input");
  for (const Solver of FilterSolvers) {
    if (!Solver.checked) {
      Solver.click();
    }
  }
  SelectAllButton.disabled = true;
}
