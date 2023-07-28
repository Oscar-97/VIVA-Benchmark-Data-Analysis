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

import { GetCheckedSolvers, GetComparisonArray } from "../Solvers/UsedSolvers";
import { TableData, TableDataTrc } from "./DataTableBase";
import { ElementStatusWithTable } from "../Elements/ElementStatus";

/**
 * Display the data in the div with the id "dataTable" when clicking on the view all results or selection button.
 */
export function TableDisplay(
	instance: string,
	solvers: string[],
	instanceLabels: string | string[],
	dataLabels: string[],
	problemList: string | string[],
	resultsData: string[]
): void {
	setTimeout(() => {
		const checkedSolvers = GetCheckedSolvers();
		const comparisonArray = GetComparisonArray(checkedSolvers, solvers);

		/**
		 * Create the table with the provided data.
		 */
		TableData(
			instance,
			checkedSolvers,
			instanceLabels,
			dataLabels,
			problemList,
			resultsData,
			comparisonArray
		);

		/**
		 * Apply the DataTables plugin DataTables plugin. Applied as a layer over the generated table.
		 */
		$(function () {
			DataTablesConfiguration();
			("#dataTableGenerated_wrapper");
		});

		/**
		 * Set the button statuses.
		 */
		ElementStatusWithTable();
	}, 500);
}

/**
 * Display the data in the div with the id "dataTable" when clicking on the view all results or selection button.
 * @param traceData
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
 * DataTables settings.
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
				text: "Toggle Filters",
				action: function (): void {
					// @ts-ignore
					table.searchPanes.container().toggle();
				},
				className: "rounded btn-sm"
			},
			"spacer",
			{
				extend: "searchBuilder",
				text: "Search Builder",
				className: "rounded btn-sm"
			},
			"spacer",
			{
				extend: "collection",
				text: "Export",
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
				"Obj Est",
				"PrimalBound Problem",
				"DualBound Problem",
				"dualbound",
				"primalbound",
				"Gap",
				"gap",
				"objcurvature",
				"probtype",
				"PrimalBound Solver",
				"DualBound Solver",
				"Gap[%] Solver",
				"PrimalGap",
				"DualGap",
				"Gap Problem"
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
 * Destroy existing table.
 */
export function DestroyDataTable(): void {
	const table = $("#dataTableGenerated").DataTable();
	table.destroy();

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
