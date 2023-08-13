import {
	alertNotification,
	alertIcon,
	alertMessage,
	closeAlertButton,
	checkCircleFill,
	exclamationTriangleFill
} from "./Elements";
import $ from "jquery";

// const checkCircleFill = `
// <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16" width="16" height="16">
//   <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
// </svg>`;

// const exclamationTriangleFill = `
// <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16" width="16" height="16">
//   <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
// </svg>`;

/**
 * This function displays a success notification with the specified message.
 * The notification fades in, remains visible for 4 seconds, and then fades out.
 *
 * @param message - The message to be displayed in the notification.
 */
export function DisplayAlertNotification(message: string): void {
	alertNotification.classList.add("alert-success");
	alertMessage.innerText = message;
	alertIcon.innerHTML = checkCircleFill;

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
	alertMessage.innerText = message;
	alertIcon.innerHTML = exclamationTriangleFill;

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
	alertMessage.innerText = message;
	alertIcon.innerHTML = exclamationTriangleFill;

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
	}, 4500);
}
