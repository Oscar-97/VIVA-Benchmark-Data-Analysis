import { ErrorMessages } from "../Constants/Messages";
import { DisplayErrorNotification } from "./DisplayAlertNotification";

/**
 * Populates checkboxes for solvers.
 *
 * @param {object} solvers - An object containing solver names as keys.
 */
export function PopulateCheckboxes(solvers: object): void {
	const container = document.getElementById("solverOptions");

	Object.keys(solvers).forEach((solverName) => {
		const checkbox = document.createElement("input");
		checkbox.type = "checkbox";
		checkbox.id = solverName;
		checkbox.value = solverName;
		checkbox.name = solverName;
		checkbox.classList.add("form-check-input");

		const label = document.createElement("label");
		label.htmlFor = solverName;
		label.appendChild(document.createTextNode(solverName));
		label.classList.add("form-check-label");

		const div = document.createElement("div");
		div.classList.add("form-check");

		div.appendChild(checkbox);
		div.appendChild(label);

		container.appendChild(div);
	});

	EnforceCheckboxLimit(container, 2);
}

/**
 * Enforces the checkbox limit.
 *
 * @param {HTMLElement} container - The container element that holds the checkboxes.
 * @param {number} maxLimit - The maximum number of checkboxes that can be checked.
 */
function EnforceCheckboxLimit(container: HTMLElement, maxLimit: number): void {
	container.addEventListener("change", (event) => {
		const checkedCheckboxes = container.querySelectorAll(
			'input[type="checkbox"]:checked'
		);
		if (checkedCheckboxes.length > maxLimit) {
			(event.target as HTMLInputElement).checked = false;
			DisplayErrorNotification(ErrorMessages.SELECT_SOLVER_AMOUNT);
		}
	});
}

/**
 * Retrieves the values of the selected checkboxes.
 *
 * @returns An array of strings representing the selected checkbox values.
 */
export function GetSelectedCheckboxValues(): string[] {
	const selectedValues: string[] = [];
	const checkboxes = document.querySelectorAll(
		`input[type="checkbox"]:checked`
	);
	checkboxes.forEach((checkbox: HTMLInputElement) => {
		selectedValues.push(checkbox.value);
	});

	return selectedValues;
}
