import { InfoMessages } from "../../Constants/Messages";

export function CreateScreenSizeToast(): void {
	// Create the toast container
	const toastContainer = document.createElement("div");
	toastContainer.className =
		"toast-container position-fixed bottom-0 end-0 p-3";

	// Create the toast element
	const toast = document.createElement("div");
	toast.id = "desktopToast";
	toast.className = "toast";
	toast.setAttribute("role", "alert");
	toast.setAttribute("aria-live", "assertive");
	toast.setAttribute("aria-atomic", "true");

	// Create the toast header
	const toastHeader = document.createElement("div");
	toastHeader.className = "toast-header";

	// Create the header title
	const headerTitle = document.createElement("strong");
	headerTitle.className = "me-auto";
	headerTitle.textContent = "Screen Size Notice";

	// Create the timestamp
	const timestamp = document.createElement("small");
	timestamp.className = "text-body-secondary";
	timestamp.textContent = "just now";

	// Create the close button
	const closeButton = document.createElement("button");
	closeButton.type = "button";
	closeButton.className = "btn-close";
	closeButton.setAttribute("data-bs-dismiss", "toast");
	closeButton.setAttribute("aria-label", "Close");

	// Create the toast body
	const toastBody = document.createElement("div");
	toastBody.className = "toast-body";
	toastBody.textContent = InfoMessages.SCREEN_SIZE_NOTICE;

	// Assemble the toast structure
	toastHeader.appendChild(headerTitle);
	toastHeader.appendChild(timestamp);
	toastHeader.appendChild(closeButton);
	toast.appendChild(toastHeader);
	toast.appendChild(toastBody);
	toastContainer.appendChild(toast);

	// Append the toast container to the body
	document.body.appendChild(toastContainer);
}
