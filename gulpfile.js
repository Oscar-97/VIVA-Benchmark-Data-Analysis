const { task, src, dest } = require("gulp");
const replace = require("gulp-replace");
const zip = require("gulp-zip");
const merge = require("merge-stream");
const file = require("gulp-file");

const packageJSON = require("./package.json");
const version = packageJSON.version;

task("release", function () {
	return src(
		[
			"Dist/*.{js,css,txt}",
			"Docs/**/*",
			"Src/CSS/*.{png,jpg}",
			"Src/Pages/*.html",
			"report.html",
			"manifest.json",
			"service-worker.js"
		],
		{ base: "." }
	)
		.pipe(zip(`VIVA-release-${version}.zip`))
		.pipe(dest("Release"));
});

task("release-web", function () {
	const filesToRemoveHTMLstring = src(
		["Src/Pages/*.html", "report.html", "service-worker.js", "manifest.json"],
		{ base: "." }
	).pipe(replace(".html", ""));

	const otherFiles = src(
		["Dist/*.{js,css,txt}", "Docs/**/*", "Src/CSS/*.{png,jpg}"],
		{ base: "." }
	);

	const redirects = [
		"/ /report.html 301",
		"/performance_profile /Src/Pages/performance_profile",
		"/average_solver_time /Src/Pages/average_solver_time 301",
		"/compare_solvers /Src/Pages/compare_solvers.html 301",
		"/solver_time /Src/Pages/solver_time 301",
		"/number_of_nodes /Src/Pages/number_of_nodes 301",
		"/number_of_iterations /Src/Pages/number_of_iterations 301",
		"/termination_status /Src/Pages/termination_status 301",
		"/solution_quality /Src/Pages/solution_quality 301",
		"/solution_time /Src/Pages/solution_time 301",
		"/Src/Pages/performance_profile.html /Src/Pages/performance_profile 301",
		"/Src/Pages/average_solver_time.html /Src/Pages/average_solver_time 301",
		"/Src/Pages/compare_solvers.html /Src/Pages/compare_solvers 301",
		"/Src/Pages/solver_time.html /Src/Pages/solver_time 301",
		"/Src/Pages/number_of_nodes.html /Src/Pages/number_of_nodes 301",
		"/Src/Pages/number_of_iterations.html /Src/Pages/number_of_iterations 301",
		"/Src/Pages/termination_status.html /Src/Pages/termination_status 301",
		"/Src/Pages/solution_quality.html /Src/Pages/solution_quality 301",
		"/Src/Pages/solution_time.html /Src/Pages/solution_quality 301",
	];
	const redirectContent = redirects.join("\n");
	const redirectFile = file("_redirect", redirectContent, { src: true });

	return merge(filesToRemoveHTMLstring, otherFiles, redirectFile)
		.pipe(zip(`VIVA-release-web-${version}.zip`))
		.pipe(dest("Release"));
});
