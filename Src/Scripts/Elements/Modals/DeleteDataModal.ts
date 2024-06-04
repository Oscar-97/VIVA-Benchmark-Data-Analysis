export function CreateDeleteDataModal(): void {
	// Create the modal elements
	const modal = document.createElement("div");
	modal.className = "modal fade";
	modal.id = "deleteDataModal";
	modal.tabIndex = -1;
	modal.setAttribute("aria-labelledby", "deleteDataModalLabel");
	modal.setAttribute("aria-hidden", "false");

	const modalDialog = document.createElement("div");
	modalDialog.className = "modal-dialog";

	const modalContent = document.createElement("div");
	modalContent.className = "modal-content";

	const modalHeader = document.createElement("div");
	modalHeader.className = "modal-header";

	const modalTitle = document.createElement("h5");
	modalTitle.className = "modal-title";
	modalTitle.innerText = "Are you sure you want to delete the data?";

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

	const deleteButton = document.createElement("button");
	deleteButton.className = "btn btn-danger";
	deleteButton.id = "deleteButtonInModal";
	deleteButton.setAttribute("data-bs-dismiss", "modal");
	deleteButton.setAttribute("data-toggle", "tooltip");
	deleteButton.setAttribute("data-placement", "top");
	deleteButton.setAttribute(
		"title",
		"Delete currently saved data in local storage."
	);

	const deleteButtonIcon = document.createElement("i");
	deleteButtonIcon.className = "bi bi-trash";
	deleteButton.appendChild(deleteButtonIcon);
	deleteButton.appendChild(document.createTextNode(" Delete Data"));

	// Append elements to create the modal structure
	modalHeader.appendChild(modalTitle);
	modalHeader.appendChild(closeButton);

	modalFooter.appendChild(cancelButton);
	modalFooter.appendChild(deleteButton);

	modalContent.appendChild(modalHeader);
	modalContent.appendChild(modalFooter);

	modalDialog.appendChild(modalContent);

	modal.appendChild(modalDialog);

	// Append the modal to the body
	document.body.appendChild(modal);
}
