//const jq = require("jquery");
import $ from "jquery";
import "datatables.net-bs5";
import "datatables.net-fixedcolumns-bs5";
import "datatables.net-searchpanes-bs5";
import "datatables.net-select-bs5";
import "datatables.net-searchbuilder-bs5";
import "datatables.net-buttons-bs5";
import "datatables.net-buttons/js/buttons.colVis.js";
import "datatables.net-buttons/js/buttons.html5.mjs";
import "datatables.net-buttons/js/buttons.print.mjs";
import "datatables.net-datetime";

import { TableDataTrc } from "./DataTableBase";
import { ElementStateDisplayedTable } from "../Elements/ElementStatus";

/**
 * Function to display the trace data in a dynamically generated HTML table using the DataTables library for improved user interaction.
 *
 * @param traceData An array of objects where each object represents a row in the table, and the keys/values within the object represent columns and cell values.
 *
 * @returns The function doesn't return anything.
 *
 * @remarks
 * This function generates and displays a table using the 'TableDataTrc' function. It then applies DataTables configuration to it,
 * resulting in a table with additional features like search and pagination.
 * The table will be displayed in the HTML div with the id 'dataTable'.
 * This function will be invoked when a user clicks on the 'View All Results' or 'Selection' button.
 * Note: this function directly manipulates the DOM and doesn't return anything.
 *
 * @example
 * ```typescript
 * const traceData = [
 *   {Solver: "SolverA", Runtime: 10, ObjectiveValue: 100},
 *   {Solver: "SolverB", Runtime: 20, ObjectiveValue: 200}
 * ];
 * DisplayDataTable(traceData);
 * ```
 * This example will generate a table with two rows and three columns (Solver, Runtime, and ObjectiveValue) and apply DataTables configuration to it.
 */
export function DisplayDataTable(traceData: object[]): void {
	setTimeout(() => {
		/**
		 * Create the table with the trc data.
		 */
		TableDataTrc(traceData);

		/**
		 * Apply the DataTables plugin. Applied as a layer over the generated table.
		 */
		$(function () {
			DataTablesConfiguration();
			("#dataTableGenerated_wrapper");
		});

		ElementStateDisplayedTable();
	}, 500);
}

/**
 * This function configures the settings for the DataTables JavaScript library.
 * DataTables is a jQuery plugin that provides interactive features to HTML tables such as search, pagination, and sorting.
 *
 * @returns void
 *
 * @remarks
 * This function finds the table with the id 'dataTableGenerated' and applies various configurations to it.
 * Configurations include enabling the state saving feature, search panes, defining the DOM structure of the table,
 * setting table length and select options, defining responsive breakpoints, setting scroll properties,
 * defining fixed columns, setting button options and more.
 * Note that after configuring, the function makes some changes to CSS classes and moves the search panes container.
 */

function DataTablesConfiguration(): void {
	const table = $("#dataTableGenerated").DataTable({
		destroy: true,
		stateSave: true,
		// @ts-expect-error Add proper types.
		searchPanes: {
			layout: "auto"
		},
		dom:
			"<'row'<'col-sm-12 col-md-6'B><'col-sm-12 col-md-6'f>>" +
			"<'row'<'col-sm-12'tr>>" +
			"<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7 mt-2'p>>",
		lengthChange: true,
		lengthMenu: [
			[10, 25, 50, 100, -1],
			[10, 25, 50, 100, "All"]
		],
		select: {
			style: "os",
			blurable: true,
			className: "bg-primary row-selected-problems"
		},
		responsive: {
			details: {
				type: "column",
				target: "tr"
			},
			breakpoints: [
				{ name: "desktop", width: Infinity },
				{ name: "tablet", width: 1200 },
				{ name: "fablet", width: 768 },
				{ name: "phone", width: 480 }
			]
		},
		scrollY: "",
		scrollX: true,
		scrollCollapse: true,
		paging: true,
		fixedColumns: true,
		columnDefs: [
			{
				targets: [0, 2]
			}
		],
		language: {
			searchBuilder: {
				button: "<i class='bi bi-search'></i> Advanced Search"
			}
		} as DataTables.LanguageSettings,
		buttons: [
			{
				extend: "collection",
				text: "<i class='bi bi-gear'></i> Settings <span class='caret'></span>",
				className: "rounded btn-sm",
				buttons: [
					{
						extend: "pageLength",
						text: function (dt): string {
							return (
								"<i class='bi bi-list-columns-reverse'></i> Show " +
								dt.page.len() +
								" rows"
							);
						}
					},
					{
						extend: "colvis",
						text: "<i class='bi bi-layout-three-columns'></i> Column Visibility",
						columnText: function (_dt, idx, title): string {
							return idx + 1 + ": " + title;
						}
					}
				]
			},
			"spacer",
			{
				extend: "searchBuilder",
				className: "rounded btn-sm"
			},
			"spacer",
			{
				text: "<i class='bi bi-filter-square'></i> Toggle Filters",
				action: function (): void {
					// @ts-expect-error Add proper types.
					table.searchPanes.container().toggle();
				},
				className: "rounded btn-sm"
			},
			"spacer",
			{
				extend: "collection",
				text: "<i class='bi bi-database-down'></i> Export",
				className: "rounded btn-sm",
				buttons: [
					{
						extend: "print",
						text: "<i class='bi bi-printer'></i> Print"
					},
					{
						extend: "copy",
						text: "<i class='bi bi-clipboard2'></i> Copy"
					},
					{
						extend: "csv",
						text: "<i class='bi bi-filetype-csv'></i> CSV"
					}
				]
			}
		],
		initComplete: function () {
			$("#loaderContainer").css("display", "none");
			$("#loaderContainer").hide();
			$("#dataTable")
				.css("opacity", "0")
				.css("visibility", "visible")
				.animate({ opacity: 1 }, 500);
			const columnNamesToShow = [
				"InputFileName",
				"name",
				"SolverName",
				"Direction",
				"ModelType",
				"conscurvature",
				"convex",
				"objsense",
				"objtype",
				"ModelStatus",
				"SolverStatus",
				"TermStatus",
				"SolverTime",
				"NumberOfIterations",
				"NumberOfNodes",
				"PrimalBoundProblem",
				"DualBoundSolver",
				"dualbound",
				"primalbound",
				"gap",
				"objcurvature",
				"probtype",
				"DualBoundProblem",
				"PrimalBoundSolver",
				"Gap[%]",
				"PrimalGap",
				"DualGap",
				"Gap_Problem",
				"Gap_Solver"
			];
			this.api()
				.columns()
				.every(function () {
					const columnName = this.header().textContent;
					if (!columnNamesToShow.includes(columnName)) {
						this.visible(false);
					}
				});
		}
	});

	$(".dataTables_length select").addClass("custom-select custom-select-sm");
	// @ts-expect-error Remake in the future.
	table.searchPanes.container().prependTo(table.table().container());
	// @ts-expect-error Remake in the future.
	table.searchPanes.resizePanes();
	// @ts-expect-error Remake in the future.
	table.searchPanes.container().toggle();
}

/**
 * This function destroys the DataTable with id 'dataTableGenerated' and removes it from the DOM.
 *
 * @returns void
 *
 * @remarks
 * This function first grabs the DataTable by its id 'dataTableGenerated', destroys it using DataTables' .destroy() method.
 * Thereafter the state is cleared by running table.state.clear().
 * Then it removes the wrapper of the DataTable, and finally removes the DataTable itself from the DOM.
 */
export function DestroyDataTable(): void {
	const table = $("#dataTableGenerated").DataTable();
	table.destroy();
	table.state.clear();

	const tableElementWrapper = document.getElementById(
		"dataTableGenerated_wrapper"
	);
	if (tableElementWrapper) {
		tableElementWrapper.remove();
	}

	const tableElement = document.getElementById("dataTableGenerated");
	if (tableElement) {
		tableElement.remove();
	}
}
