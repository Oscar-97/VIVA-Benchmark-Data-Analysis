const { task, src, dest } = require("gulp");
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
	const otherFiles = src(
		["Dist/*.{js,css,txt}", "Dist/fonts/*", "Docs/**/*", "Src/CSS/*.{png,jpg}", "llms.txt", "robots.txt"],
		{ base: ".", encoding: false }
	);

	// The pages, the manifest, the service worker and the redirects of the web release, see scripts/web-release.mjs.
	const { BuildWebFiles } = await import("./scripts/web-release.mjs");
	const webFiles = file(BuildWebFiles(), { src: true });

	return merge(otherFiles, webFiles)
		.pipe(zip(`VIVA-release-web-${version}.zip`))
		.pipe(dest("Release"));
});
