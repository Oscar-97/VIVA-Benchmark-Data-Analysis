import { SelectAllButton } from "../Elements/Elements";

/**
 * Toggle the select and unselect all solvers button.
 */
export function ToggleSelection(): void {
  if (SelectAllButton.innerText === "Select All Solvers") {
    SelectAllSolvers();
    SelectAllButton.innerText = "Unselect All Solvers";
  } else if (SelectAllButton.innerText === "Unselect All Solvers") {
    UnselectAllSolvers();
    SelectAllButton.innerText = "Select All Solvers";
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
      try {
        Solver.click();
      } catch (err) {
        console.log(err);
      }
    }
  }
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
      try {
        Solver.click();
      } catch (err) {
        console.log(err);
      }
    }
  }
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
