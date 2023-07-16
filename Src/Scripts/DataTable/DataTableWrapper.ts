const jq = require("jquery");
import "datatables.net-bs5";
import "datatables.net-fixedcolumns-bs5";
import "datatables.net-searchpanes-bs5";
import "datatables.net-select-bs5";
import "datatables.net-searchbuilder-bs5";
import "datatables.net-buttons-bs5";
import "datatables.net-buttons/js/buttons.colVis.js";
import "datatables.net-buttons/js/buttons.html5.mjs";
import "datatables.net-buttons/js/buttons.print.mjs";

import { GetCheckedSolvers, GetComparisonArray } from "../Solvers/UsedSolvers";
import { TableData, TableDataTrc } from "./DataTableBase";
import { ElementStatusWithTable } from "../Elements/ElementStatus";

/**
 * Display the data in the div with the id "dataTable" when clicking on the view all results or selection button.
 */
export function TableDisplay(
	Instance: string,
	Solvers: string[],
	InstanceLabels: string | string[],
	DataLabels: string[],
	ProblemList: string | string[],
	ResultsData: string[]
): void {
	setTimeout(() => {
		const CheckedSolvers = GetCheckedSolvers();
		const ComparisonArray = GetComparisonArray(CheckedSolvers, Solvers);

		/**
		 * Create the table with the provided data.
		 */
		TableData(
			Instance,
			CheckedSolvers,
			InstanceLabels,
			DataLabels,
			ProblemList,
			ResultsData,
			ComparisonArray
		);

		/**
		 * Apply the DataTables plugin DataTables plugin. Applied as a layer over the generated table.
		 */
		jq(document).ready(function () {
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
 * @param TrcData
 */
export function TableDisplayTrc(TrcData: object[]): void {
	setTimeout(() => {
		/**
		 * Create the table with the trc data.
		 */
		TableDataTrc(TrcData);

		/**
		 * Apply the DataTables plugin. Applied as a layer over the generated table.
		 */
		jq(document).ready(function () {
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
	const table = jq("#dataTableGenerated").DataTable({
		destroy: true,
		stateSave: true,
		searchPanes: {
			layout: "auto"
		},
		dom:
			"<'row'<'col-sm-12 col-md-6'l><'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'i>>" +
			"<'row mb-3'<'col-sm-12'tr>>" +
			"<'row'<'col-sm-6'B><'col-sm-6'p>>",
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
				searchPanes: {
					show: true
				},
				targets: [0, 2]
			}
		],
		buttons: [
			{
				text: "Toggle Filters",
				action: function (): void {
					table.searchPanes.container().toggle();
				}
			},
			{
				extend: "searchBuilder",
				text: "Search Builder"
			},
			"colvis",
			"print",
			"copy"
		],
		initComplete: function () {
			jq("#dataTable").css("visibility", "visible");
		}
	});

	jq(".dataTables_length select").addClass("custom-select custom-select-sm");
	table.searchPanes.container().prependTo(table.table().container());
	table.searchPanes.resizePanes();
	table.searchPanes.container().toggle();
}

/**
 * Destroy existing table.
 */
export function DestroyDataTable(): void {
	const table = jq("#dataTableGenerated").DataTable();
	table.destroy();

	const TableElementWrapper = document.getElementById(
		"dataTableGenerated_wrapper"
	);
	if (TableElementWrapper) {
		TableElementWrapper.remove();
	}

	const TableElement = document.getElementById("dataTableGenerated");
	if (TableElement) {
		TableElement.remove();
	}
}
