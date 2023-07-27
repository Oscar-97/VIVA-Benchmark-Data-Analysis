import { AlertNotification } from "./Elements";
const jq = require("jquery");

export function DisplayAlertNotification(message: string): void {
	/**
	 * Show a success alert for 4 seconds with fade in and fade out effect.
	 */
	AlertNotification.classList.add("alert-success");
	AlertNotification.innerText = message;

	jq(AlertNotification)
		.css({ display: "block", opacity: 0 })
		.animate({ opacity: 1 }, 250);

	setTimeout(() => {
		jq(AlertNotification).animate({ opacity: 0 }, 250, function () {
			AlertNotification.style.display = "none";
			AlertNotification.classList.remove("alert-success");
		});
	}, 3500);
}

export function DisplayWarningNotification(message: string): void {
	/**
	 * Show a warning alert for 3 seconds with fade in and fade out effect.
	 */
	AlertNotification.classList.add("alert-warning");
	AlertNotification.innerText = message;

	jq(AlertNotification)
		.css({ display: "block", opacity: 0 })
		.animate({ opacity: 1 }, 250);

	setTimeout(() => {
		jq(AlertNotification).animate({ opacity: 0 }, 250, function () {
			AlertNotification.style.display = "none";
			AlertNotification.classList.remove("alert-warning");
		});
	}, 2500);
}

export function DisplayErrorNotification(message: string): void {
	/**
	 * Show an error alert for 5 seconds with fade in and fade out effect.
	 */
	AlertNotification.classList.add("alert-danger");
	AlertNotification.innerText = message;

	jq(AlertNotification)
		.css({ display: "block", opacity: 0 })
		.animate({ opacity: 1 }, 250);

	setTimeout(() => {
		jq(AlertNotification).animate({ opacity: 0 }, 250, function () {
			AlertNotification.style.display = "none";
			AlertNotification.classList.remove("alert-danger");
		});
	}, 4500);
}
