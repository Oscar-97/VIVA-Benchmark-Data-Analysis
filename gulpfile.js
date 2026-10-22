const fs = require("fs");
const { task, src, dest } = require("gulp");
const replace = require("gulp-replace");
const merge = require("merge-stream");
const file = require("gulp-file");

const packageJSON = require("./package.json");
const version = packageJSON.version;

// Gulp 5 decodes the files as text unless encoding is false, which corrupts the images.
// gulp-zip 6 is an ES module, so it is loaded with import().
async function LoadZip() {
	const { default: zip } = await import("gulp-zip");
	return zip;
}

task("release", async function () {
	const zip = await LoadZip();
	return src(
		[
			"Dist/*.{js,css,txt}",
			"Dist/fonts/*",
			"Docs/**/*",
			"Src/CSS/*.{png,jpg}",
			"Src/Pages/*.html",
			"report.html",
			"manifest.json",
			"service-worker.js",
			"llms.txt",
			"robots.txt"
		],
		{ base: ".", encoding: false }
	)
		.pipe(zip(`VIVA-release-${version}.zip`))
		.pipe(dest("Release"));
});

task("release-web", async function () {
	const zip = await LoadZip();
	const filesToRemoveHTMLstring = src(
		["Src/Pages/*.html", "report.html", "service-worker.js", "manifest.json"],
		{ base: ".", encoding: false }
	).pipe(replace(".html", ""));

	const otherFiles = src(
		["Dist/*.{js,css,txt}", "Dist/fonts/*", "Docs/**/*", "Src/CSS/*.{png,jpg}", "llms.txt", "robots.txt"],
		{ base: ".", encoding: false }
	);

	const { BuildRedirects, REDIRECTS_FILE } = await import(
		"./scripts/web-release.mjs"
	);
	const redirectFile = file(REDIRECTS_FILE, BuildRedirects(), { src: true });

	// "/" is served from index.html. A redirect to /report would be cached by the service worker as a
	// redirected response, which the browser refuses to use for a navigation.
	const indexFile = file(
		"index.html",
		fs.readFileSync("report.html", "utf8").split(".html").join(""),
		{ src: true }
	);

	return merge(filesToRemoveHTMLstring, otherFiles, redirectFile, indexFile)
		.pipe(zip(`VIVA-release-web-${version}.zip`))
		.pipe(dest("Release"));
});
