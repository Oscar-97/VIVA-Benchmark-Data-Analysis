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
    FilterLabels.innerText = Elements[i];

    // Create input buttons.
    const FilterInput = document.createElement("input") as HTMLInputElement;
    FilterInput.className = "form-check-input";
    FilterInput.type = "checkbox";
    FilterInput.id = Elements[i];

    // Append elements.
    FilterCheckboxes.appendChild(FilterInput);
    FilterCheckboxes.appendChild(FilterLabels);
    document.getElementById("checkboxContainer").appendChild(FilterCheckboxes);
  }
}
