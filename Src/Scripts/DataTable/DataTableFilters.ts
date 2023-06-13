import { SolverAndProblemsHeader } from "../Elements/Elements";
/**
 * Create the solver filters, displayed in the element with the id: tableFilters.
 * @param Elements Filters for the table.
 * @param BadgeName Name of the badge displayed at the top of the row.
 */
export function TableFilters(
	Elements: string | string[],
	BadgeName: string
): void {
	const UsedSolvers = {};
	SolverAndProblemsHeader.hidden = false;
	SolverAndProblemsHeader.innerText = BadgeName;

	const FilterCheckboxesContainer = document.createElement(
		"div"
	) as HTMLDivElement;
	FilterCheckboxesContainer.id = "checkboxContainer";
	document
		.getElementById("tableFilters")
		.appendChild(FilterCheckboxesContainer);

	for (let i = 0; i < Elements.length; i++) {
		const Solver = Elements[i];

		// Skip if the solver has already been added.
		if (UsedSolvers[Solver]) {
			continue;
		}
		/**
		 * @param FilterCheckboxes Filter form div.
		 * @param FilterLabels Filter labels.
		 * @param FilterInput Filter input buttons.
		 */
		// Create filter form div.
		const FilterCheckboxes = document.createElement("div") as HTMLDivElement;
		FilterCheckboxes.className = "form-check form-check-inline";

		// Create filter labels.
		const FilterLabels = document.createElement("label") as HTMLLabelElement;
		FilterLabels.className = "form-check-label";
		FilterLabels.innerText = Solver;

		// Create input buttons.
		const FilterInput = document.createElement("input") as HTMLInputElement;
		FilterInput.className = "form-check-input";
		FilterInput.type = "checkbox";
		FilterInput.id = Solver;

		// Append elements.
		FilterCheckboxes.appendChild(FilterInput);
		FilterCheckboxes.appendChild(FilterLabels);
		document.getElementById("checkboxContainer").appendChild(FilterCheckboxes);

		// Add to used list.
		UsedSolvers[Solver] = true;
	}
}
