import { elements } from "../Elements";
import $ from "jquery";
let notificationTimeout: ReturnType<typeof setTimeout> | undefined;
let closeListenerAdded = false;
let actionListener: (() => void) | undefined;

/**
 * An action that a notification offers, shown as a button next to the message.
 */
export interface NotificationAction {
	label: string;
	onClick: () => void;
}

type AlertKind = "alert-success" | "alert-warning" | "alert-danger";

const ALERT_KINDS: AlertKind[] = [
	"alert-success",
	"alert-warning",
	"alert-danger"
];

/**
 * Shows the button of the action of the notification, or hides the button when there is no action.
 */
function ShowAction(action?: NotificationAction): void {
	const button = elements.alertActionButton;
	if (actionListener) {
		button.removeEventListener("click", actionListener);
		actionListener = undefined;
	}
	button.hidden = action === undefined;
	if (action) {
		button.textContent = action.label;
		actionListener = (): void => {
			elements.alertNotification.style.display = "none";
			action.onClick();
		};
		button.addEventListener("click", actionListener);
	}
}

/**
 * Shows the notification with the given kind, icon and message. It fades in, stays visible for the given time and fades out.
 * A running fade is stopped first, so that its end does not hide the new notification.
 */
function DisplayNotification(
	kind: AlertKind,
	icon: string,
	message: string,
	visibleMs: number,
	action?: NotificationAction
): void {
	const alert = elements.alertNotification;
	$(alert).stop(true);
	alert.style.display = "none";
	alert.classList.remove(...ALERT_KINDS);

	alert.classList.add(kind);
	elements.alertMessage.innerText = message;
	elements.alertIcon.innerHTML = `<i class='bi ${icon}'></i>`;

	ShowAction(action);

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
 * A notification with an action stays for 10 seconds, so that there is time to use the action.
 *
 * @param {string} message - The message to be displayed in the notification.
 * @param {NotificationAction} action - An optional action, shown as a button next to the message.
 */
export function DisplayWarningNotification(
	message: string,
	action?: NotificationAction
): void {
	DisplayNotification(
		"alert-warning",
		"bi-exclamation-triangle-fill",
		message,
		action ? 10000 : 5000,
		action
	);
}

/**
 * Hides the notification when it is an error, for example when the action that caused the error has been done
 * correctly since. A success or warning notification is not related to such an action and stays.
 */
export function HideErrorNotification(): void {
	const alert = elements.alertNotification;
	if (!alert.classList.contains("alert-danger")) {
		return;
	}
	clearTimeout(notificationTimeout);
	$(alert).stop(true);
	alert.style.display = "none";
	alert.classList.remove("alert-danger");
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
