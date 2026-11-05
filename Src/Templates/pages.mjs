// The pages of the application. `name` is the file name without extension and decides which entry of
// the navigation bar is active, `location` tells where the file is (the report page is in the root folder).
//
// Run `npm run build:pages` after changing this file, the partials or the fragments.

const SAVE_TITLE = "Save the loaded data in the local storage of this browser.";
const DELETE_TITLE =
  "Remove the data saved in the local storage of this browser.";

/**
 * The data menu of a page, with the actions that save, export and remove the data.
 */
function DataMenu(save, remove, extra = []) {
  return {
    menu: [
      ["save", { title: save }],
      "download-saved",
      "configure",
      "separator",
      ["delete", { title: remove }],
      ...extra,
    ],
  };
}

/**
 * The buttons of a plot page, with the button that shows the plot. The plot is shown after the data is loaded,
 * so the button updates it, after a change of the settings.
 */
function PlotButtons(title) {
  return [
    ["view-plots", { title, label: "Update plot" }],
    "download-chart-data",
    DataMenu(SAVE_TITLE, DELETE_TITLE),
  ];
}

function PlotPage(name, title, viewTitle, extra = {}) {
  return {
    name,
    title,
    output: `Src/Pages/${name}.html`,
    location: "pages",
    buttons: PlotButtons(viewTitle),
    content: { statistics: true },
    ...extra,
  };
}

export const PAGES = [
  {
    name: "report",
    title: "Results Table",
    output: "report.html",
    location: "root",
    manifest: true,
    buttons: [
      "view-table",
      "show-selected",
      DataMenu(
        "Save the current table configuration in the local storage of this browser.",
        "Remove the table configuration saved in the local storage of this browser.",
        ["clear-table"],
      ),
    ],
    content: { fragment: "report-body" },
  },
  PlotPage(
    "performance_profile",
    "Performance Profile",
    "View performance profile.",
    { controls: "performance-profile-controls" },
  ),
  PlotPage(
    "solver_time_all",
    "Solver Time per Solver",
    "View Solver Time per Solver.",
    { controls: "solver-time-all-controls" },
  ),
  PlotPage("solver_time", "Solver Time per Instance", "View the solver times."),
  PlotPage("number_of_nodes", "Number of Nodes", "View number of nodes."),
  PlotPage(
    "number_of_iterations",
    "Number of Iterations",
    "View number of iterations.",
  ),
  PlotPage(
    "termination_status",
    "Termination Status",
    "View termination status.",
    { controls: "termination-status-controls" },
  ),
  PlotPage("solution_quality", "Solution Quality", "View solution quality.", {
    controls: "solution-quality-controls",
  }),
  PlotPage("solution_time", "Solution Time", "View solution time.", {
    content: { statistics: false },
  }),
  {
    name: "compare_solvers",
    title: "Compare Solvers",
    output: "Src/Pages/compare_solvers.html",
    location: "pages",
    buttons: ["compare-solvers", DataMenu(SAVE_TITLE, DELETE_TITLE)],
    controls: "compare-solvers-controls",
    content: { fragment: "compare-solvers-body" },
  },
];
