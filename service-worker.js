// @generated-start
// This block is written by scripts/build-service-worker.mjs (npm run build). Do not edit it by hand.
const CACHE_NAME = "VIVA-cache-1.2.0-6b62a3b033c2";
const filesToCache = [
	"/",
	"manifest.json",
	"report.html",
	"Src/Pages/compare_solvers.html",
	"Src/Pages/number_of_iterations.html",
	"Src/Pages/number_of_nodes.html",
	"Src/Pages/performance_profile.html",
	"Src/Pages/solution_quality.html",
	"Src/Pages/solution_time.html",
	"Src/Pages/solver_time_all.html",
	"Src/Pages/solver_time.html",
	"Src/Pages/termination_status.html",
	"Dist/bundle.js",
	"Dist/demodata.js",
	"Dist/main.css",
	"Dist/minlplib-dataset.js",
	"Dist/miplib2010-dataset.js",
	"Dist/miplib2017-dataset.js",
	"Dist/fonts/bootstrap-icons.woff2",
	"Src/CSS/icon_maskable.png",
	"Src/CSS/tab_icon.png"
];
// @generated-end

/**
 * The 'install' event is fired when the service worker is installed.
 * The files of the application shell are cached, so that the web app works offline.
 * The files are requested past the HTTP cache, so the cache of this version never holds files of an older one.
 * When a file cannot be cached the installation fails, and the previous service worker and its cache stay in use.
 */
self.addEventListener("install", function (event) {
	event.waitUntil(
		caches
			.open(CACHE_NAME)
			.then(function (cache) {
				return cache.addAll(
					filesToCache.map(function (file) {
						return new Request(file, { cache: "reload" });
					})
				);
			})
			.then(function () {
				return self.skipWaiting();
			})
	);
});

/**
 * The 'fetch' event is triggered for every network request made by the browser.
 * Requests of the application itself are answered from the cache when the file is there, otherwise from the network.
 * A navigation that cannot be answered falls back to the report page, so the application opens offline.
 * Requests to other origins and requests that are not GET are left to the browser.
 */
self.addEventListener("fetch", function (event) {
	const request = event.request;
	if (
		request.method !== "GET" ||
		new URL(request.url).origin !== self.location.origin
	) {
		return;
	}
	const isNavigation = request.mode === "navigate";

	event.respondWith(
		caches.open(CACHE_NAME).then(function (cache) {
			return cache
				.match(request, { ignoreSearch: isNavigation })
				.then(function (response) {
					if (response) {
						return response;
					}
					return fetch(request).catch(function (error) {
						console.error("Failed fetch request:", error);
						const offline = new Response("Offline", {
							status: 503,
							statusText: "Offline"
						});
						if (!isNavigation) {
							return offline;
						}
						return cache.match("report.html").then(function (fallback) {
							return fallback || offline;
						});
					});
				});
		})
	);
});

/**
 * The 'activate' event is fired when the service worker starts up.
 * The caches of other versions are deleted, and the open pages are taken over,
 * so that they use the new version at once.
 */
self.addEventListener("activate", (event) => {
	event.waitUntil(
		caches
			.keys()
			.then((cacheNames) =>
				Promise.all(
					cacheNames
						.filter((cacheName) => cacheName !== CACHE_NAME)
						.map((cacheName) => caches.delete(cacheName))
				)
			)
			.then(() => self.clients.claim())
	);
});
