import { elements } from "../Elements";
import $ from "jquery";
let notificationTimeout: ReturnType<typeof setTimeout> | undefined;
let closeListenerAdded = false;

type AlertKind = "alert-success" | "alert-warning" | "alert-danger";

const ALERT_KINDS: AlertKind[] = [
	"alert-success",
	"alert-warning",
	"alert-danger"
];

/**
 * Shows the notification with the given kind, icon and message. It fades in, stays visible for the given time and fades out.
 * A running fade is stopped first, so that its end does not hide the new notification.
 */
function DisplayNotification(
	kind: AlertKind,
	icon: string,
	message: string,
	visibleMs: number
): void {
	const alert = elements.alertNotification;
	$(alert).stop(true);
	alert.style.display = "none";
	alert.classList.remove(...ALERT_KINDS);

	alert.classList.add(kind);
	elements.alertMessage.innerText = message;
	elements.alertIcon.innerHTML = `<i class='bi ${icon}'></i>`;

	$(alert).css({ display: "block", opacity: 0 }).animate({ opacity: 1 }, 125);

	if (!closeListenerAdded) {
		closeListenerAdded = true;
		elements.closeAlertButton.addEventListener("click", function () {
			elements.alertNotification.style.display = "none";
		});
	}

	clearTimeout(notificationTimeout);
	notificationTimeout = setTimeout(() => {
		$(alert).animate({ opacity: 0 }, 250, function () {
			alert.style.display = "none";
			alert.classList.remove(kind);
		});
	}, visibleMs);
}

/**
 * This function displays a success notification with the specified message.
 * The notification fades in, remains visible for 10 seconds, and then fades out.
 *
 * @param {string} message - The message to be displayed in the notification.
 */
export function DisplayAlertNotification(message: string): void {
	DisplayNotification("alert-success", "bi-check-circle-fill", message, 10000);
}

/**
 * This function displays a warning notification with the specified message.
 * The notification fades in, remains visible for 5 seconds, and then fades out.
 *
 * @param {string} message - The message to be displayed in the notification.
 */
export function DisplayWarningNotification(message: string): void {
	DisplayNotification(
		"alert-warning",
		"bi-exclamation-triangle-fill",
		message,
		5000
	);
}

/**
 * This function displays an error notification with the specified message.
 * The notification fades in, remains visible for 5 seconds, and then fades out.
 *
 * @param {string} message - The message to be displayed in the notification.
 */
export function DisplayErrorNotification(message: string): void {
	DisplayNotification(
		"alert-danger",
		"bi-exclamation-triangle-fill",
		message,
		5000
	);
}
