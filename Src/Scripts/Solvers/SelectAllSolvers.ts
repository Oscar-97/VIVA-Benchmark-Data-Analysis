import { SelectAllButton } from "../Elements/Elements";

/**
 * Toggle the select and unselect all solvers button.
 */
let SelectAllStatus = true;
export function ToggleSelection(): void {
  SelectAllStatus = !SelectAllStatus;
  if (SelectAllStatus) {
    SelectAllSolvers();
  } else {
    UnselectAllSolvers();
  }
}

/**
 * Select all solvers by clicking on all inputs inside the checkboxContainer.
 */
function SelectAllSolvers(): void {
  const CheckboxContainer = document.getElementById(
    "checkboxContainer"
  ) as HTMLDivElement;
  const FilterSolvers = CheckboxContainer.getElementsByTagName("input");
  for (const Solver of FilterSolvers) {
    if (!Solver.checked) {
      Solver.click();
    }
  }
  SelectAllButton.innerText = "Unselect All Solvers";
}

/**
 * Unselect all solvers by clicking on the checked input boxes.
 */
function UnselectAllSolvers(): void {
  const CheckboxContainer = document.getElementById(
    "checkboxContainer"
  ) as HTMLDivElement;
  const FilterSolvers = CheckboxContainer.getElementsByTagName("input");
  for (const Solver of FilterSolvers) {
    if (Solver.checked) {
      Solver.click();
    }
  }
  SelectAllButton.innerText = "Select All Solvers";
}

/**
 * Select checked solvers from localStorage by using the ID of the input.
 */
export function SelectSavedSolvers(CheckedSolvers: string[]): void {
  CheckedSolvers.forEach((id) => {
    const SolverCheckbox = document.getElementById(id) as HTMLInputElement;
    if (SolverCheckbox) {
      SolverCheckbox.checked = true;
    }
  });
}
