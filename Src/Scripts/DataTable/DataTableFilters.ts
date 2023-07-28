import { solverAndProblemsHeader } from "../Elements/Elements";
/**
 * Create the solver filters, displayed in the element with the id: tableFilters.
 * @param elements Filters for the table.
 * @param badgeName Name of the badge displayed at the top of the row.
 */
export function TableFilters(
	elements: string | string[],
	badgeName: string
): void {
	const usedSolvers = {};
	solverAndProblemsHeader.hidden = false;
	solverAndProblemsHeader.innerText = badgeName;

	const filterCheckboxesContainer = document.createElement(
		"div"
	) as HTMLDivElement;
	filterCheckboxesContainer.id = "checkboxContainer";
	document
		.getElementById("tableFilters")
		.appendChild(filterCheckboxesContainer);

	for (let i = 0; i < elements.length; i++) {
		const solver = elements[i];

		// Skip if the solver has already been added.
		if (usedSolvers[solver]) {
			continue;
		}
		/**
		 * @param FilterCheckboxes Filter form div.
		 * @param FilterLabels Filter labels.
		 * @param FilterInput Filter input buttons.
		 */
		// Create filter form div.
		const filterCheckboxes = document.createElement("div") as HTMLDivElement;
		filterCheckboxes.className = "form-check form-check-inline";

		// Create filter labels.
		const filterLabels = document.createElement("label") as HTMLLabelElement;
		filterLabels.className = "form-check-label";
		filterLabels.innerText = solver;

		// Create input buttons.
		const filterInput = document.createElement("input") as HTMLInputElement;
		filterInput.className = "form-check-input";
		filterInput.type = "checkbox";
		filterInput.id = solver;

		// Append elements.
		filterCheckboxes.appendChild(filterInput);
		filterCheckboxes.appendChild(filterLabels);
		document.getElementById("checkboxContainer").appendChild(filterCheckboxes);

		// Add to used list.
		usedSolvers[solver] = true;
	}
}
