// The pages of the application. `name` is the file name without extension and decides which entry of
// the navigation bar is active, `location` tells where the file is (the report page is in the root folder).
//
// Run `npm run build:pages` after changing this file, the partials or the fragments.

const SAVE_TITLE = "Save currently loaded data to local storage.";
const DELETE_TITLE = "Delete currently saved data in local storage.";

/**
 * The buttons of a plot page, with the button that shows the plot.
 */
function PlotButtons(title, label) {
  return [
    ["view-plots", { title, label }],
    ["save", { title: SAVE_TITLE }],
    "separator",
    "download-saved",
    "configure",
    "download-chart-data",
    "separator",
    ["delete", { title: DELETE_TITLE }],
  ];
}

function PlotPage(name, title, view, extra = {}) {
  return {
    name,
    title,
    output: `Src/Pages/${name}.html`,
    location: "pages",
    buttons: PlotButtons(view.title, view.label),
    content: { statistics: true },
    ...extra,
  };
}

export const PAGES = [
  {
    name: "report",
    title: "Report",
    output: "report.html",
    location: "root",
    manifest: true,
    buttons: [
      "view-table",
      "show-selected",
      ["save", { title: "Save current table configuration to local storage." }],
      "separator",
      "download-saved",
      "configure",
      "separator",
      [
        "delete",
        { title: "Delete current table configuration from local storage." },
      ],
      "clear-table",
    ],
    content: { fragment: "report-body" },
  },
  PlotPage(
    "performance_profile",
    "Performance Profile",
    { title: "View performance profile.", label: "View Performance Profile" },
    { controls: "performance-profile-controls" },
  ),
  PlotPage(
    "solver_time_all",
    "Solver Time per Solver",
    {
      title: "View Solver Time per Solver.",
      label: "View Solver Time per Solver",
    },
    { controls: "solver-time-all-controls" },
  ),
  PlotPage("solver_time", "Solver Time per Instance", {
    title: "View the solver times.",
    label: "View Solver Time",
  }),
  PlotPage("number_of_nodes", "Number of Nodes", {
    title: "View number of nodes.",
    label: "View Number of Nodes",
  }),
  PlotPage("number_of_iterations", "Number of Iterations", {
    title: "View number of iterations.",
    label: "View Number of Iterations",
  }),
  PlotPage(
    "termination_status",
    "Termination Status",
    { title: "View termination status.", label: "View Termination Status" },
    { controls: "termination-status-controls" },
  ),
  PlotPage(
    "solution_quality",
    "Solution Quality",
    { title: "View solution quality.", label: "View Solution Quality" },
    { controls: "solution-quality-controls" },
  ),
  PlotPage(
    "solution_time",
    "Solution Time",
    { title: "View solution time.", label: "View Solution Time" },
    { content: { statistics: false } },
  ),
  {
    name: "compare_solvers",
    title: "Compare Solvers",
    output: "Src/Pages/compare_solvers.html",
    location: "pages",
    buttons: [
      "compare-solvers",
      ["save", { title: SAVE_TITLE }],
      "separator",
      "download-saved",
      "configure",
      "separator",
      ["delete", { title: DELETE_TITLE }],
    ],
    controls: "compare-solvers-controls",
    content: { fragment: "compare-solvers-body" },
  },
];
