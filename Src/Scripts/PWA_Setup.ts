/**
 * This function checks if the browser supports service workers, a technology that enables
 * offline caching and background syncing for Progressive Web Apps (PWAs). If supported,
 * it registers a service worker when the page is loaded.
 *
 * @example
 * RegisterServiceWorker();
 * // This will register the service worker when the page is loaded, if the browser supports service workers.
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
