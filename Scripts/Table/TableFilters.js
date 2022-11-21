export function TableFilters(Solvers) {
    let FilterCheckboxes; 
    let FilterLabels;
    let FilterInput;

    for (var i = 0; i < Solvers.length; i++){

        // Create filter form div.
        FilterCheckboxes = document.createElement('div');
        FilterCheckboxes.className = "form-check form-check-inline";

        // Create filter labels.
        FilterLabels = document.createElement('label');
        FilterLabels.className = "form-check-label";
        FilterLabels.innerText = Solvers[i];

        // Create input buttons.
        FilterInput = document.createElement('input');
        FilterInput.className = 'form-check-input';
        FilterInput.type = "checkbox";
        FilterInput.id = Solvers[i]
        
        // Append elements.
        FilterCheckboxes.appendChild(FilterInput)
        FilterCheckboxes.appendChild(FilterLabels)
        document.getElementById('tableFilters').appendChild(FilterCheckboxes);
    }
}