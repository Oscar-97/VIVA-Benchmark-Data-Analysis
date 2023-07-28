import { alertNotification } from "./Elements";
import $ from "jquery";

export function DisplayAlertNotification(message: string): void {
	/**
	 * Show a success alert for 4 seconds with fade in and fade out effect.
	 */
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

export function DisplayWarningNotification(message: string): void {
	/**
	 * Show a warning alert for 3 seconds with fade in and fade out effect.
	 */
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

export function DisplayErrorNotification(message: string): void {
	/**
	 * Show an error alert for 5 seconds with fade in and fade out effect.
	 */
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
