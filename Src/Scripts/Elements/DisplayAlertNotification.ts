import { AlertNotification } from "./Elements";

export function DisplayAlertNotification(message: string): void {
	/**
	 * Show a success alert for 3 seconds.
	 */
	AlertNotification.classList.add("alert-success");
	AlertNotification.style.display = "block";
	AlertNotification.innerText = message;

	setTimeout(() => {
		AlertNotification.style.display = "none";
		AlertNotification.classList.remove("alert-success");
	}, 3000);
}

export function DisplayWarningNotification(message: string): void {
	/**
	 * Show a warning alert for 5 seconds.
	 */
	AlertNotification.classList.add("alert-warning");
	AlertNotification.style.display = "block";
	AlertNotification.innerText = message;

	setTimeout(() => {
		AlertNotification.style.display = "none";
		AlertNotification.classList.remove("alert-warning");
	}, 3000);
}

export function DisplayErrorNotification(message: string): void {
	/**
	 * Show an error alert for 5 seconds.
	 */
	AlertNotification.classList.add("alert-danger");
	AlertNotification.style.display = "block";
	AlertNotification.innerText = message;

	setTimeout(() => {
		AlertNotification.style.display = "none";
		AlertNotification.classList.remove("alert-danger");
	}, 5000);
}
