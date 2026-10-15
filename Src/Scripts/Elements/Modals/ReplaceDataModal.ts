import Modal from "bootstrap/js/dist/modal";

const MODAL_ID = "replaceDataModal";

/**
 * Creates the modal that asks whether the saved data may be replaced.
 */
function CreateReplaceDataModal(): HTMLDivElement {
	const modal = document.createElement("div");
	modal.className = "modal fade";
	modal.id = MODAL_ID;
	modal.tabIndex = -1;
	modal.setAttribute("aria-labelledby", "replaceDataModalLabel");
	modal.setAttribute("aria-hidden", "true");

	const dialog = document.createElement("div");
	dialog.className = "modal-dialog";

	const content = document.createElement("div");
	content.className = "modal-content";

	const header = document.createElement("div");
	header.className = "modal-header";

	const title = document.createElement("h5");
	title.className = "modal-title";
	title.id = "replaceDataModalLabel";
	title.innerText = "Replace the saved data with the demo data?";

	const closeButton = document.createElement("button");
	closeButton.type = "button";
	closeButton.className = "btn-close";
	closeButton.setAttribute("data-bs-dismiss", "modal");
	closeButton.setAttribute("aria-label", "Close");

	const body = document.createElement("div");
	body.className = "modal-body";
	body.innerText =
		"The data that you saved in this browser is replaced by the demo data. It cannot be restored, unless you downloaded it.";

	const footer = document.createElement("div");
	footer.className = "modal-footer";

	const cancelButton = document.createElement("button");
	cancelButton.type = "button";
	cancelButton.className = "btn btn-secondary";
	cancelButton.setAttribute("data-bs-dismiss", "modal");
	cancelButton.innerText = "Cancel";

	const replaceButton = document.createElement("button");
	replaceButton.type = "button";
	replaceButton.className = "btn btn-danger";
	replaceButton.id = "replaceDataButtonInModal";
	replaceButton.setAttribute("data-bs-dismiss", "modal");
	replaceButton.innerText = "Replace Data";

	header.append(title, closeButton);
	footer.append(cancelButton, replaceButton);
	content.append(header, body, footer);
	dialog.appendChild(content);
	modal.appendChild(dialog);
	document.body.appendChild(modal);
	return modal;
}

/**
 * Asks whether the saved data may be replaced, and calls `onConfirm` when it may.
 * The modal is created when it is first needed.
 */
export function ConfirmReplaceData(onConfirm: () => void): void {
	const existing = document.getElementById(MODAL_ID) as HTMLDivElement | null;
	const modal = existing ?? CreateReplaceDataModal();
	const replaceButton = modal.querySelector<HTMLButtonElement>(
		"#replaceDataButtonInModal"
	);
	if (replaceButton) {
		replaceButton.onclick = onConfirm;
	}
	Modal.getOrCreateInstance(modal).show();
}
