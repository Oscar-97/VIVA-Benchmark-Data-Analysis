/**
 * This function checks if the browser supports service workers, a technology that enables
 * offline caching and background syncing for Progressive Web Apps (PWAs). If supported,
 * it registers a service worker when the page is loaded.
 *
 * @remarks
 * PWA will only be installable if the application is served over HTTPS.
 */
export function RegisterServiceWorker(): void {
	if ("serviceWorker" in navigator) {
		window.addEventListener("load", () => {
			navigator.serviceWorker
				.register("/service-worker.js")
				.then((registration) => {
					console.info(
						"ServiceWorker registration successful with scope: ",
						registration.scope
					);
				})
				.catch((err) => {
					console.warn("ServiceWorker registration failed: ", err);
				});
		});
	}
}

/**
 * This function requests permission for desktop notifications in the browser.
 */
export function RequestPWANotificationPermission(): void {
	if (!("Notification" in window)) {
		console.error("This browser does not support desktop notification");
	} else {
		Notification.requestPermission().then((permission) => {
			if (permission === "granted") {
				console.log("Notification permission granted.");
			} else {
				console.log("Notification permission denied or dismissed.");
			}
		});
	}
}

/**
 * This function shows a client side PWA notification with the specified title and options.
 *
 * @param {string} title - The title of the notification.
 * @param {NotificationOptions} options - The options for the notification.
 */
export function ShowPWANotification(
	title: string,
	options: NotificationOptions
): void {
	if (!("Notification" in window)) {
		console.error("This browser does not support notifications.");
		return;
	}

	if (Notification.permission === "granted") {
		new Notification(title, options);
	} else if (Notification.permission !== "denied") {
		Notification.requestPermission().then((permission) => {
			if (permission === "granted") {
				new Notification(title, options);
			}
		});
	}
}
