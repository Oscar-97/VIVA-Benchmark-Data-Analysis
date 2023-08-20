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
import { ElementStatusWithTable } from "../Elements/ElementStatus";

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
 * TableDisplayTrc(traceData);
 * ```
 * This example will generate a table with two rows and three columns (Solver, Runtime, and ObjectiveValue) and apply DataTables configuration to it.
 */
export function TableDisplayTrc(traceData: object[]): void {
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

		ElementStatusWithTable();
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
		// @ts-ignore
		searchPanes: {
			layout: "auto"
		},
		dom:
			"<'row'<'col-12 col-sm-6 col-md-6'i><'col-12 col-sm-6 col-md-6 text-end'f>>" +
			"<'row'<'col-12'tr>>" +
			"<'row'<'col-12 col-lg-6 mt-4'B><'col-12 col-lg-6 mt-4 text-end'p>>",
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
			// @ts-ignore
			searchBuilder: {
				button: "<i class='bi bi-search'></i> Advanced Search"
			}
		},
		buttons: [
			{
				extend: "pageLength",
				className: "rounded-start btn-sm"
			},
			{
				extend: "colvis",
				className: "rounded-end btn-sm",
				columnText: (_dt: DataTables.Api, idx: number, title: string): string =>
					idx + 1 + ": " + title
			},
			"spacer",
			{
				extend: "searchBuilder",
				text: "Advanced Search Builder",
				className: "rounded btn-sm"
			},
			"spacer",
			{
				text: "<i class='bi bi-filter-square'></i> Toggle Filters",
				action: function (): void {
					// @ts-ignore
					table.searchPanes.container().toggle();
				},
				className: "rounded btn-sm"
			},
			"spacer",
			{
				extend: "collection",
				text: "<i class='bi bi-database-down'></i> Export",
				className: "rounded btn-sm",
				buttons: ["print", "copy", "csv"]
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
				"Dir",
				"ModelType",
				"conscurvature",
				"convex",
				"objsense",
				"objtype",
				"ModelStatus",
				"TermStatus",
				"Time[s]",
				"NumberOfIterations",
				"Nodes[i]",
				"Obj",
				"Obj_Est",
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
	// @ts-ignore
	table.searchPanes.container().prependTo(table.table().container());
	// @ts-ignore
	table.searchPanes.resizePanes();
	// @ts-ignore
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
