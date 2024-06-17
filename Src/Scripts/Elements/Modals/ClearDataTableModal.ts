export function ClearDataTableModal(): void {
	// Create the modal elements
	const modal = document.createElement("div");
	modal.className = "modal fade";
	modal.id = "clearDataTableModal";
	modal.tabIndex = -1;
	modal.setAttribute("aria-labelledby", "clearDataTableModalLabel");
	modal.setAttribute("aria-hidden", "false");

	const modalDialog = document.createElement("div");
	modalDialog.className = "modal-dialog";

	const modalContent = document.createElement("div");
	modalContent.className = "modal-content";

	const modalHeader = document.createElement("div");
	modalHeader.className = "modal-header";

	const modalTitle = document.createElement("h5");
	modalTitle.className = "modal-title";
	modalTitle.innerText = "Are you sure you want to clear the data table?";

	const closeButton = document.createElement("button");
	closeButton.type = "button";
	closeButton.className = "btn-close";
	closeButton.setAttribute("data-bs-dismiss", "modal");
	closeButton.setAttribute("aria-label", "Close");

	const modalFooter = document.createElement("div");
	modalFooter.className = "modal-footer";

	const cancelButton = document.createElement("button");
	cancelButton.type = "button";
	cancelButton.className = "btn btn-secondary";
	cancelButton.setAttribute("data-bs-dismiss", "modal");
	cancelButton.innerText = "Cancel";

	const clearButton = document.createElement("button");
	clearButton.className = "btn btn-danger";
	clearButton.id = "clearTableButtonInModal";
	clearButton.setAttribute("data-bs-dismiss", "modal");
	clearButton.setAttribute("data-toggle", "tooltip");
	clearButton.setAttribute("data-placement", "top");
	clearButton.setAttribute(
		"title",
		"Clear current table and refresh table page."
	);

	const clearButtonIcon = document.createElement("i");
	clearButtonIcon.className = "bi bi-trash";
	clearButton.appendChild(clearButtonIcon);
	clearButton.appendChild(document.createTextNode(" Clear Data Table"));

	// Append elements to create the modal structure
	modalHeader.appendChild(modalTitle);
	modalHeader.appendChild(closeButton);

	modalFooter.appendChild(cancelButton);
	modalFooter.appendChild(clearButton);

	modalContent.appendChild(modalHeader);
	modalContent.appendChild(modalFooter);

	modalDialog.appendChild(modalContent);

	modal.appendChild(modalDialog);

	// Append the modal to the body
	document.body.appendChild(modal);
}
