const CACHE_NAME = "VIVA-cache";

/**
 * Files to cache.
 */
const filesToCache = [
	"/",
	"report.html",
	"Dist/bundle.js",
	"Dist/main.css",
	"Src/CSS/tab_icon.png",
	"Src/Pages/average_solver_time.html",
	"Src/Pages/number_of_iterations.html",
	"Src/Pages/number_of_nodes.html",
	"Src/Pages/solver_time.html"
];

/**
 * The 'install' event is fired when the service worker is installed.
 * This is an ideal time to pre-cache static assets that make up the application shell,
 * so that the web app is immediately functional even when offline.
 */
self.addEventListener("install", function (event) {
	event.waitUntil(
		caches
			.open(CACHE_NAME)
			.then(function (cache) {
				console.log("Opened cache.");
				return cache.addAll(filesToCache);
			})
			.catch(function (error) {
				console.error("Failed to open cache: ", error);
			})
	);
});

/**
 * The 'fetch' event is triggered for every network request made by the browser.
 * In this event, we're handling the request by trying to fetch from the network first.
 * If that fails (which it will when the app is offline), we return the offline fallback page.
 */
self.addEventListener("fetch", function (event) {
	event.respondWith(
		caches.match(event.request).then(function (response) {
			if (response) {
				return response;
			}
			return fetch(event.request)
				.catch(function (error) {
					console.error("Failed fetch request:", error);
					return new Response("You are offline. Some resources may not be available.");
				});
		})
	);
});

/**
 * The 'activate' event is fired when the service worker starts up.
 * It's a great opportunity to clean up old caches and ensure that only the current cache is used.
 */
self.addEventListener("activate", (event) => {
	console.log("Activating new service worker...");
	const cacheAllowlist = [CACHE_NAME];

	event.waitUntil(
		caches.keys().then((cacheNames) => {
			return Promise.all(
				cacheNames.map((cacheName) => {
					if (cacheAllowlist.indexOf(cacheName) === -1) {
						console.log("Deleting out of date cache:", cacheName);
						return caches.delete(cacheName);
					}
				})
			);
		})
	);
});
