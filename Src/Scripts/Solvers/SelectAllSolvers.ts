import { selectAllButton } from "../Elements/Elements";

/**
 * Toggle the select and unselect all solvers button.
 */
export function ToggleSelection(): void {
	if (selectAllButton.innerText === "Select All Solvers") {
		SelectAllSolvers();
		selectAllButton.innerText = "Unselect All Solvers";
	} else if (selectAllButton.innerText === "Unselect All Solvers") {
		UnselectAllSolvers();
		selectAllButton.innerText = "Select All Solvers";
	}
}

/**
 * Select all solvers by clicking on all inputs inside the checkboxContainer.
 */
function SelectAllSolvers(): void {
	const checkboxContainer = document.getElementById(
		"checkboxContainer"
	) as HTMLDivElement;
	const filterSolvers = checkboxContainer.getElementsByTagName("input");
	for (const solver of filterSolvers) {
		if (!solver.checked) {
			try {
				solver.click();
			} catch (err) {
				console.log("Could not select solvers: ", err);
			}
		}
	}
}

/**
 * Unselect all solvers by clicking on the checked input boxes.
 */
function UnselectAllSolvers(): void {
	const checkboxContainer = document.getElementById(
		"checkboxContainer"
	) as HTMLDivElement;
	const filterSolvers = checkboxContainer.getElementsByTagName("input");
	for (const solver of filterSolvers) {
		if (solver.checked) {
			try {
				solver.click();
			} catch (err) {
				console.log("Could not unselect solvers: ", err);
			}
		}
	}
}

/**
 * Select checked solvers from localStorage by using the ID of the input.
 */
export function SelectSavedSolvers(checkedSolvers: string[]): void {
	checkedSolvers.forEach((id) => {
		const solverCheckbox = document.getElementById(id) as HTMLInputElement;
		if (solverCheckbox) {
			solverCheckbox.checked = true;
		}
	});
}
