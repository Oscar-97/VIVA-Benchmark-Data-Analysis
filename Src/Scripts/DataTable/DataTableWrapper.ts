import $ from "jquery";
import type { Config, Api } from "datatables.net";
import DataTable from "datatables.net-bs5";
import "datatables.net-fixedcolumns-bs5";
import "datatables.net-searchpanes";
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
import { HideTableHint, ShowTableHint } from "./TableHint";

/*
 * The Bootstrap 5 styling of the search panes. datatables.net-searchpanes-bs5 3.0.0 does this itself, but its
 * module uses `util` without importing it and fails in the browser, so the same classes are set here.
 * Its stylesheet is still used (Main.ts). Remove this when a fixed version of the package is released.
 */
DataTable.util.object.assignDeep(DataTable.SearchPane.classes, {
	buttonGroup: "btn-group",
	disabledButton: "disabled",
	narrow: "col",
	pane: { container: "table" },
	paneButton: "btn btn-subtle",
	pill: "badge rounded-pill bg-secondary",
	search: "form-control search",
	table: "table table-sm table-borderless",
	topRow: "dtsp-topRow"
});
DataTable.util.object.assignDeep(DataTable.SearchPanes.classes, {
	clearAll: "dtsp-clearAll btn btn-subtle",
	collapseAll: "dtsp-collapseAll btn btn-subtle",
	container: "dtsp-searchPanes",
	disabledButton: "disabled",
	panes: "dtsp-panes dtsp-panesContainer",
	search: DataTable.SearchPane.classes.search,
	showAll: "dtsp-showAll btn btn-subtle",
	title: "dtsp-title",
	titleRow: "dtsp-titleRow"
});

/**
 * The number of rows on a page, until the user chooses another number.
 */
const DEFAULT_PAGE_LENGTH = 10;

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
	const table = new DataTable("#dataTableGenerated", {
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
		lengthMenu: [10, 25, 50, 100, { label: "All", value: -1 }],
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
			searchPlaceholder: "Search all columns",
			emptyTable: "There are no rows to show.",
			zeroRecords:
				"No rows match the search. Change or clear the search to see rows.",
			searchBuilder: {
				button: "<i class='bi bi-search'></i> Advanced Search"
			}
		} as NonNullable<Config["language"]>,
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
					ToggleSearchPanes(table);
				},
				className: "rounded btn-sm"
			},
			"spacer",
			{
				text: "<i class='bi bi-arrow-counterclockwise'></i> Reset View",
				titleAttr:
					"Clear the search, filters, sorting and selection, and show the default columns and rows.",
				action: function (): void {
					ResetTableView(table);
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
		initComplete: function (): void {
			$("#loaderContainer").css("display", "none");
			$("#loaderContainer").hide();
			$("#dataTable")
				.css("opacity", "0")
				.css("visibility", "visible")
				.animate({ opacity: 1 }, 500);
			const api = this.api();
			api.columns().every(function () {
				const columnName = this.header().textContent;
				if (!DEFAULT_VISIBLE_HEADERS.includes(columnName)) {
					this.visible(false);
				}
			});
			UpdateTableHint(api);
			api.on("column-visibility.dt", () => {
				UpdateTableHint(api);
			});
		}
	});

	table.searchPanes.container().prependTo(table.table().container());
	table.searchPanes.resizePanes();
	ToggleSearchPanes(table);
}

/**
 * Shows the search panes when they are hidden and hides them when they are shown.
 */
function ToggleSearchPanes(table: Api): void {
	const container = table.searchPanes.container().get(0);
	if (container instanceof HTMLElement) {
		container.style.display = container.style.display === "none" ? "" : "none";
	}
}

/**
 * Shows how many of the columns of the table are shown.
 */
function UpdateTableHint(api: Api): void {
	const total = api.columns().count();
	const visible = api.columns(":visible").count();
	ShowTableHint(visible, total);
}

/**
 * Puts the table back as it is when it is first shown: no search, filters, selection or sorting,
 * the default columns and the first page of the default number of rows. The saved state is replaced,
 * so the table is also like this the next time it is shown.
 */
function ResetTableView(table: Api): void {
	table.search("");
	table.columns().search("");
	table.searchPanes.clearSelections();
	table.searchBuilder.rebuild({ criteria: [], logic: "AND" });
	table.rows().deselect();
	table.order([[0, "asc"]]);
	table.page.len(DEFAULT_PAGE_LENGTH);
	// Only the columns that differ are changed, and the table is laid out once after all of them.
	table.columns().every(function () {
		const wanted = DEFAULT_VISIBLE_HEADERS.includes(this.header().textContent);
		if (this.visible() !== wanted) {
			this.visible(wanted, false);
		}
	});
	table.columns.adjust();
	table.draw();
	table.state.save();
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
	const table = new DataTable("#dataTableGenerated");
	table.destroy();
	table.state.clear();
	HideTableHint();

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
	new DataTable(tableSelector, {
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
