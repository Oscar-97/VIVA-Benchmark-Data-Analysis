export function TableFilters(Solvers: string | any[]) {
    for (var i = 0; i < Solvers.length; i++){
        /**
         * @param FilterCheckboxes Filter form div.
         * @param FilterLabels Filter labels.
         * @param FilterInput Filter input buttons.
         */
        // Create filter form div.
        const FilterCheckboxes = document.createElement('div') as HTMLDivElement;
        FilterCheckboxes.className = "form-check form-check-inline";

        // Create filter labels.
        const FilterLabels = document.createElement('label') as HTMLLabelElement;
        FilterLabels.className = "form-check-label";
        FilterLabels.innerText = Solvers[i];

        // Create input buttons.
        const FilterInput = document.createElement('input') as HTMLInputElement;
        FilterInput.className = 'form-check-input';
        FilterInput.type = "checkbox";
        FilterInput.id = Solvers[i];
        
        // Append elements.
        FilterCheckboxes.appendChild(FilterInput);
        FilterCheckboxes.appendChild(FilterLabels);
        document.getElementById('tableFilters').appendChild(FilterCheckboxes);
    }
}