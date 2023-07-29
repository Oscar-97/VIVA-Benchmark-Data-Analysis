import { alertNotification } from "./Elements";
import $ from "jquery";

/**
 * This function displays a success notification with the specified message.
 * The notification fades in, remains visible for 4 seconds, and then fades out.
 *
 * @param message - The message to be displayed in the notification.
 */
export function DisplayAlertNotification(message: string): void {
	alertNotification.classList.add("alert-success");
	alertNotification.innerText = message;

	$(alertNotification)
		.css({ display: "block", opacity: 0 })
		.animate({ opacity: 1 }, 125);

	setTimeout(() => {
		$(alertNotification).animate({ opacity: 0 }, 250, function () {
			alertNotification.style.display = "none";
			alertNotification.classList.remove("alert-success");
		});
	}, 3500);
}

/**
 * This function displays a warning notification with the specified message.
 * The notification fades in, remains visible for 3 seconds, and then fades out.
 *
 * @param message - The message to be displayed in the notification.
 */
export function DisplayWarningNotification(message: string): void {
	alertNotification.classList.add("alert-warning");
	alertNotification.innerText = message;

	$(alertNotification)
		.css({ display: "block", opacity: 0 })
		.animate({ opacity: 1 }, 125);

	setTimeout(() => {
		$(alertNotification).animate({ opacity: 0 }, 250, function () {
			alertNotification.style.display = "none";
			alertNotification.classList.remove("alert-warning");
		});
	}, 2500);
}

/**
 * This function displays an error notification with the specified message.
 * The notification fades in, remains visible for 5 seconds, and then fades out.
 *
 * @param message - The message to be displayed in the notification.
 */
export function DisplayErrorNotification(message: string): void {
	alertNotification.classList.add("alert-danger");
	alertNotification.innerText = message;

	$(alertNotification)
		.css({ display: "block", opacity: 0 })
		.animate({ opacity: 1 }, 125);

	setTimeout(() => {
		$(alertNotification).animate({ opacity: 0 }, 250, function () {
			alertNotification.style.display = "none";
			alertNotification.classList.remove("alert-danger");
		});
	}, 4500);
}
