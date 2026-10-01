import { elements } from "../Elements";
import $ from "jquery";
let notificationTimeout: ReturnType<typeof setTimeout> | undefined;

/**
 * This function displays a success notification with the specified message.
 * The notification fades in, remains visible for 10 seconds, and then fades out.
 *
 * @param {string} message - The message to be displayed in the notification.
 */
export function DisplayAlertNotification(message: string): void {
	try {
		// Remove other alert classes if notification is already displayed and it is triggered again.
		elements.alertNotification.style.display = "none";
		elements.alertNotification.classList.remove(
			"alert-warning",
			"alert-danger"
		);
	} finally {
		elements.alertNotification.classList.add("alert-success");
		elements.alertMessage.innerText = message;
		elements.alertIcon.innerHTML = "<i class='bi bi-check-circle-fill'></i>";

		$(elements.alertNotification)
			.css({ display: "block", opacity: 0 })
			.animate({ opacity: 1 }, 125);

		elements.closeAlertButton.addEventListener("click", function () {
			elements.alertNotification.style.display = "none";
		});

		clearTimeout(notificationTimeout);
		notificationTimeout = setTimeout(() => {
			$(elements.alertNotification).animate({ opacity: 0 }, 250, function () {
				elements.alertNotification.style.display = "none";
				elements.alertNotification.classList.remove("alert-success");
			});
		}, 10000);
	}
}

/**
 * This function displays a warning notification with the specified message.
 * The notification fades in, remains visible for 5 seconds, and then fades out.
 *
 * @param {string} message - The message to be displayed in the notification.
 */
export function DisplayWarningNotification(message: string): void {
	try {
		elements.alertNotification.style.display = "none";
		elements.alertNotification.classList.remove(
			"alert-success",
			"alert-danger"
		);
	} finally {
		elements.alertNotification.classList.add("alert-warning");
		elements.alertMessage.innerText = message;
		elements.alertIcon.innerHTML =
			"<i class='bi bi-exclamation-triangle-fill'></i>";

		$(elements.alertNotification)
			.css({ display: "block", opacity: 0 })
			.animate({ opacity: 1 }, 125);

		elements.closeAlertButton.addEventListener("click", function () {
			elements.alertNotification.style.display = "none";
		});

		clearTimeout(notificationTimeout);
		notificationTimeout = setTimeout(() => {
			$(elements.alertNotification).animate({ opacity: 0 }, 250, function () {
				elements.alertNotification.style.display = "none";
				elements.alertNotification.classList.remove("alert-warning");
			});
		}, 5000);
	}
}

/**
 * This function displays an error notification with the specified message.
 * The notification fades in, remains visible for 5 seconds, and then fades out.
 *
 * @param {string} message - The message to be displayed in the notification.
 */
export function DisplayErrorNotification(message: string): void {
	try {
		elements.alertNotification.style.display = "none";
		elements.alertNotification.classList.remove(
			"alert-success",
			"alert-warning"
		);
	} finally {
		elements.alertNotification.classList.add("alert-danger");
		elements.alertMessage.innerText = message;
		elements.alertIcon.innerHTML =
			"<i class='bi bi-exclamation-triangle-fill'></i>";

		$(elements.alertNotification)
			.css({ display: "block", opacity: 0 })
			.animate({ opacity: 1 }, 125);

		elements.closeAlertButton.addEventListener("click", function () {
			elements.alertNotification.style.display = "none";
		});

		clearTimeout(notificationTimeout);
		notificationTimeout = setTimeout(() => {
			$(elements.alertNotification).animate({ opacity: 0 }, 250, function () {
				elements.alertNotification.style.display = "none";
				elements.alertNotification.classList.remove("alert-danger");
			});
		}, 5000);
	}
}
