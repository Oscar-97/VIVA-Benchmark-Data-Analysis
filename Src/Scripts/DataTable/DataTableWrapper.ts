import $ from "jquery";
import type { Config, Api } from "datatables.net";
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
import "datatables.net-responsive-bs5";

import {
	InstanceAttributesTable,
	SolveAttributesTable,
	TraceTableData
} from "./DataTableBase";
import { elements } from "../Elements/Elements";
import { ElementStateDisplayedTable } from "../Elements/Events/ElementStatus";
import { DEFAULT_VISIBLE_HEADERS } from "../Constants/TraceHeaders";
import { ShowPWANotification } from "../PWA/PWA-utils";
import { TableMessages } from "../Constants/Messages";
import { TraceData } from "../Interfaces/Interfaces";

/**
 * This function displays the trace data in a dynamically generated HTML table using the DataTables library for improved user interaction.
 * A notification is shown to the user upon successful generation of the table.
 *
 * @param {TraceData[]} traceData - Array of objects containing the result data.
 *
 * @remarks
 * This function generates and displays a table using the 'TableDataTrc' function.
 * It then applies DataTables configuration to it,
 * resulting in a table with additional features like search and pagination.
 * The table will be displayed in the HTML div with the id 'dataTable' and
 * the wrapper gets the id 'dataTableGenerated_wrapper'.
 * Note: this function directly manipulates the DOM and doesn't return anything.
 *
 * @example
 * ```typescript
 * const traceData = [
 *   {Solver: "SolverA", SolverTime: 10, ObjectiveValue: 100},
 *   {Solver: "SolverB", SolverTime: 20, ObjectiveValue: 200}
 * ];
 * DisplayDataTable(traceData);
 * ```
 * This example will generate a table with two rows and three columns (Solver, SolverTime, and ObjectiveValue) and apply DataTables configuration to it.
 */
export function DisplayDataTable(traceData: TraceData[]): void {
	setTimeout(() => {
		/**
		 * Create the table with the trc data.
		 */
		TraceTableData(traceData);
		InstanceAttributesTable(traceData);
		SolveAttributesTable(traceData);

		/**
		 * Apply the DataTables plugin. Applied as layers over the generated tables.
		 */
		DataTablesConfiguration();
		DataTablesConfigurationStats("#instanceAttributesTable_inner");
		DataTablesConfigurationStats("#solveAttributesTable_inner");
		ElementStateDisplayedTable();

		ShowPWANotification(TableMessages.TABLE_SUCCESS_HEADER, {
			body: TableMessages.TABLE_SUCCESS,
			icon: "./Src/CSS/tab_icon.png",
			silent: true
		});
	}, 500);
}

/**
 * This function configures the settings for the DataTables JavaScript library.
 * It provides interactive features to HTML tables such as search, pagination, and sorting.
 *
 * @remarks
 * This function finds the table with the id 'dataTableGenerated' and applies various configurations to it.
 * Configurations include enabling the state saving feature, search panes, defining the DOM structure of the table,
 * setting table length and select options, defining responsive breakpoints, setting scroll properties,
 * defining fixed columns, setting button options and more.
 * Note that after configuring, the function makes some changes to CSS classes and moves the search panes container.
 *
 * @todo Rewrite all of this.
 */

function DataTablesConfiguration(): void {
	const table = $("#dataTableGenerated").DataTable({
		destroy: true,
		stateSave: true,
		searchPanes: {
			layout: "auto"
		},
		layout: {
			topStart: "buttons",
			topEnd: "search",
			bottomStart: "info",
			bottomEnd: "paging"
		},
		pagingType: "numbers",
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
		} as Config["language"],
		buttons: [
			{
				extend: "collection",
				text: "<i class='bi bi-gear'></i> Settings <span class='caret'></span>",
				className: "rounded btn-sm",
				buttons: [
					{
						extend: "pageLength",
						text: function (dt: Api): string {
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
						columnText: function (
							_dt: Api,
							idx: number,
							title: string
						): string {
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
			const columnNamesToShow = DEFAULT_VISIBLE_HEADERS;
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

	table.searchPanes.container().prependTo(table.table().container());
	table.searchPanes.resizePanes();
	table.searchPanes.container().toggle();
}

/**
 * This function destroys the DataTable with id 'dataTableGenerated' and removes it from the DOM.
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

	if (elements.dataTableGeneratedWrapper) {
		elements.dataTableGeneratedWrapper.remove();
	}

	if (elements.dataTableGenerated) {
		elements.dataTableGenerated.remove();
	}
}

/**
 * This function configures the settings for the statistics, instance and solve attributes tables.
 * @param tableSelector ID of the table to apply the wrapper on.
 */
export function DataTablesConfigurationStats(tableSelector: string): void {
	$(tableSelector).DataTable({
		destroy: true,
		searching: false,
		paging: false,
		info: false,
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
		scrollCollapse: true
	});
}
