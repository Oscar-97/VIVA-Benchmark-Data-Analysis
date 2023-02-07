import { AlertNotification } from "./Elements";

export function DisplayAlertNotification(message: string) {
    /**
     * Show a simple success alert for 3 seconds.
     */
    AlertNotification.classList.add("alert-success");
    AlertNotification.style.display = "block";
    AlertNotification.innerText = message;

    setTimeout(() => {
    AlertNotification.style.display = "none";
    AlertNotification.classList.remove("alert-success");
    }, 3000);
}

export function DisplayErrorNotification(message: string) {
    /**
     * Show a simple success alert for 3 seconds.
     */
    AlertNotification.classList.add("alert-danger");
    AlertNotification.style.display = "block";
    AlertNotification.innerText = message;

    setTimeout(() => {
    AlertNotification.style.display = "none";
    AlertNotification.classList.remove("alert-danger");
    }, 5000);
}