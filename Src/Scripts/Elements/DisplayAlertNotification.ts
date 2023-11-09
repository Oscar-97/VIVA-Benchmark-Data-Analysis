import {
	alertNotification,
	alertIcon,
	alertMessage,
	closeAlertButton
} from "./Elements";
import $ from "jquery";

/**
 * This function displays a success notification with the specified message.
 * The notification fades in, remains visible for 4 seconds, and then fades out.
 *
 * @param message - The message to be displayed in the notification.
 */
export function DisplayAlertNotification(message: string): void {
	alertNotification.classList.add("alert-success");
	alertMessage.innerText = message;
	alertIcon.innerHTML = "<i class='bi bi-check-circle-fill'></i>";

	$(alertNotification)
		.css({ display: "block", opacity: 0 })
		.animate({ opacity: 1 }, 125);

	closeAlertButton.addEventListener("click", function () {
		alertNotification.style.display = "none";
	});

	setTimeout(() => {
		$(alertNotification).animate({ opacity: 0 }, 250, function () {
			alertNotification.style.display = "none";
			alertNotification.classList.remove("alert-success");
		});
	}, 10000);
}

/**
 * This function displays a warning notification with the specified message.
 * The notification fades in, remains visible for 3 seconds, and then fades out.
 *
 * @param message - The message to be displayed in the notification.
 */
export function DisplayWarningNotification(message: string): void {
	alertNotification.classList.add("alert-warning");
	alertMessage.innerText = message;
	alertIcon.innerHTML = "<i class='bi bi-exclamation-triangle-fill'></i>";

	$(alertNotification)
		.css({ display: "block", opacity: 0 })
		.animate({ opacity: 1 }, 125);

	closeAlertButton.addEventListener("click", function () {
		alertNotification.style.display = "none";
	});

	setTimeout(() => {
		$(alertNotification).animate({ opacity: 0 }, 250, function () {
			alertNotification.style.display = "none";
			alertNotification.classList.remove("alert-warning");
		});
	}, 5000);
}

/**
 * This function displays an error notification with the specified message.
 * The notification fades in, remains visible for 5 seconds, and then fades out.
 *
 * @param message - The message to be displayed in the notification.
 */
export function DisplayErrorNotification(message: string): void {
	alertNotification.classList.add("alert-danger");
	alertMessage.innerText = message;
	alertIcon.innerHTML = "<i class='bi bi-exclamation-triangle-fill'></i>";

	$(alertNotification)
		.css({ display: "block", opacity: 0 })
		.animate({ opacity: 1 }, 125);

	closeAlertButton.addEventListener("click", function () {
		alertNotification.style.display = "none";
	});

	setTimeout(() => {
		$(alertNotification).animate({ opacity: 0 }, 250, function () {
			alertNotification.style.display = "none";
			alertNotification.classList.remove("alert-danger");
		});
	}, 5000);
}
